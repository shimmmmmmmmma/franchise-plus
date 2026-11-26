'use strict';

// Load local development configuration without ever logging it; environment overrides .env.
require('dotenv').config();

const crypto = require('node:crypto');
const Fastify = require('fastify');
const { PrismaClient } = require('@prisma/client');
const { authorize } = require('./authz');
const { writeAuditEvent } = require('./audit');
const { createMockSmsAdapter } = require('./sms-adapter');

const SESSION_COOKIE = 'fp_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const IRAN_E164_RE = /^\+989\d{9}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeIranianMobile(value) {
  if (typeof value !== 'string') return null;
  let normalized = value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\s()-]/g, '');

  if (/^09\d{9}$/.test(normalized)) {
    normalized = `+98${normalized.slice(1)}`;
  } else if (/^0098/.test(normalized)) {
    normalized = `+98${normalized.slice(4)}`;
  }

  return IRAN_E164_RE.test(normalized) ? normalized : null;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function otpDigest(secret, challengeId, mobileE164, purpose, code) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${challengeId}\n${mobileE164}\n${purpose}\n${code}`)
    .digest('hex');
}

function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const a = Buffer.from(left.trim(), 'hex');
  const b = Buffer.from(right.trim(), 'hex');
  return a.length === 32 && b.length === 32 && crypto.timingSafeEqual(a, b);
}

function readCookie(header, name) {
  if (typeof header !== 'string') return null;
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      return part.slice(separator + 1).trim();
    }
  }
  return null;
}

function newPublicId() {
  return `FP-${crypto.randomBytes(10).toString('hex').toUpperCase()}`;
}

function createRateLimiter({ limit, windowMs, now }) {
  const buckets = new Map();
  return {
    take(key) {
      const current = now().getTime();
      let bucket = buckets.get(key);
      if (!bucket || current - bucket.startedAt >= windowMs || current < bucket.startedAt) {
        bucket = { startedAt: current, count: 0 };
      }
      if (bucket.count >= limit) {
        buckets.set(key, bucket);
        return Math.max(1, Math.ceil((bucket.startedAt + windowMs - current) / 1000));
      }
      bucket.count += 1;
      buckets.set(key, bucket);
      return 0;
    },
    clear() {
      buckets.clear();
    },
  };
}

function setSessionCookie(reply, token, env) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (env.NODE_ENV === 'production') parts.push('Secure');
  reply.header('set-cookie', parts.join('; '));
}

function clearSessionCookie(reply, env) {
  const parts = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (env.NODE_ENV === 'production') parts.push('Secure');
  reply.header('set-cookie', parts.join('; '));
}

async function createServer(options = {}) {
  const env = options.env ?? process.env;
  const nodeEnv = env.NODE_ENV || 'development';
  if (!['development', 'test'].includes(nodeEnv)) {
    throw new Error('This authentication API is restricted to local development and tests.');
  }

  const ownsPrisma = !options.prisma;
  const prisma = options.prisma ?? new PrismaClient();
  const smsAdapter = options.smsAdapter ?? createMockSmsAdapter();
  if (smsAdapter.adapterType !== 'mock-only' || typeof smsAdapter.sendOtp !== 'function') {
    if (ownsPrisma) await prisma.$disconnect();
    throw new Error('Only the explicitly labeled mock SMS adapter is permitted.');
  }

  const now = options.now ?? (() => new Date());
  const otpSecret = options.otpHashSecret ?? crypto.randomBytes(32);
  const maxOtpAttempts = options.maxOtpAttempts ?? MAX_OTP_ATTEMPTS;
  const limiter = createRateLimiter({
    limit: options.requestOtpLimit ?? 5,
    windowMs: options.requestOtpWindowMs ?? 60_000,
    now,
  });

  const app = Fastify({ logger: false, bodyLimit: 16 * 1024 });
  app.decorate('prisma', prisma);
  app.decorate('smsAdapter', smsAdapter);
  app.decorateRequest('auth', null);

  app.addHook('preHandler', async (request) => {
    request.auth = null;
    const rawToken = readCookie(request.headers.cookie, SESSION_COOKIE);
    if (!rawToken || !/^[0-9a-f]{64}$/i.test(rawToken)) return;

    const session = await prisma.session.findUnique({
      where: { tokenHash: sha256(rawToken) },
      include: {
        activeRole: true,
        user: {
          include: {
            roles: {
              where: { revokedAt: null },
              include: { role: true },
            },
          },
        },
      },
    });
    const current = now();
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= current ||
      !session.user ||
      session.user.deletedAt ||
      session.user.status !== 'ACTIVE'
    ) {
      return;
    }

    const roles = session.user.roles.map((membership) => membership.role);
    const activeRole = session.activeRole && roles.some((role) => role.id === session.activeRole.id)
      ? session.activeRole
      : null;

    request.auth = {
      sessionId: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      user: session.user,
      roles,
      activeRole,
    };
  });

  app.setErrorHandler((error, request, reply) => {
    const status = Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode < 500
      ? error.statusCode
      : 500;
    reply.code(status).send({ error: status === 500 ? 'internal_error' : 'invalid_request' });
  });

  app.post('/api/auth/request-otp', async (request, reply) => {
    if (!(await authorize(request, reply, { public: true }))) return;
    reply.header('cache-control', 'no-store');

    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const mobileE164 = normalizeIranianMobile(body.mobileE164);
    const purpose = body.purpose ?? 'LOGIN';
    if (!mobileE164) {
      return reply.code(422).send({ error: 'unsupported_country' });
    }
    if (!['LOGIN', 'SIGNUP'].includes(purpose)) {
      return reply.code(400).send({ error: 'invalid_otp_purpose' });
    }

    const retryAfter = limiter.take(`${request.ip}:${mobileE164}`);
    if (retryAfter > 0) {
      reply.header('retry-after', String(retryAfter));
      return reply.code(429).send({ error: 'rate_limited' });
    }

    const code = String(crypto.randomInt(100_000, 1_000_000));
    const challengeId = crypto.randomUUID();
    const current = now();
    const expiresAt = new Date(current.getTime() + OTP_TTL_MS);

    try {
      await prisma.otpChallenge.updateMany({
        where: { mobileE164, purpose, consumedAt: null, lockedAt: null },
        data: { consumedAt: current },
      });
      await prisma.otpChallenge.create({
        data: {
          id: challengeId,
          mobileE164,
          purpose,
          codeHash: otpDigest(otpSecret, challengeId, mobileE164, purpose, code),
          attempts: 0,
          expiresAt,
        },
      });
      await smsAdapter.sendOtp({ mobileE164, code, challengeId });
    } catch (_error) {
      return reply.code(503).send({ error: 'otp_delivery_unavailable' });
    }

    const response = {
      challengeId,
      expiresAt: expiresAt.toISOString(),
      delivery: { adapter: 'mock-only', label: smsAdapter.label },
    };
    if (env.NODE_ENV === 'development' && env.DEV_OTP === '1') response.devOtp = code;
    return reply.code(201).send(response);
  });

  app.post('/api/auth/verify-otp', async (request, reply) => {
    if (!(await authorize(request, reply, { public: true }))) return;
    reply.header('cache-control', 'no-store');

    const body = request.body && typeof request.body === 'object' ? request.body : {};
    const { challengeId, code } = body;
    if (
      typeof challengeId !== 'string' ||
      !UUID_RE.test(challengeId) ||
      typeof code !== 'string' ||
      !/^\d{6}$/.test(code)
    ) {
      return reply.code(400).send({ error: 'invalid_otp_request' });
    }

    const challenge = await prisma.otpChallenge.findUnique({ where: { id: challengeId } });
    if (!challenge || challenge.consumedAt) {
      return reply.code(400).send({ error: 'invalid_or_consumed_challenge' });
    }
    const current = now();
    if (challenge.expiresAt <= current) {
      return reply.code(410).send({ error: 'otp_expired' });
    }
    if (challenge.lockedAt || challenge.attempts >= maxOtpAttempts) {
      return reply.code(423).send({ error: 'otp_locked' });
    }

    const candidate = otpDigest(otpSecret, challenge.id, challenge.mobileE164, challenge.purpose, code);
    if (!safeEqualHex(candidate, challenge.codeHash)) {
      const locked = challenge.attempts + 1 >= maxOtpAttempts;
      let failure;
      try {
        failure = await prisma.$transaction(async (tx) => {
          const updated = await tx.otpChallenge.updateMany({
            where: {
              id: challenge.id,
              attempts: challenge.attempts,
              consumedAt: null,
              lockedAt: null,
              expiresAt: { gt: current },
            },
            data: {
              attempts: { increment: 1 },
              ...(locked ? { lockedAt: current } : {}),
            },
          });
          if (updated.count !== 1) return { error: 'challenge_state_changed' };

          await writeAuditEvent(tx, request, {
            action: 'auth.otp.failure',
            entityType: 'OtpChallenge',
            entityId: challenge.id,
            result: 'FAILURE',
            purposeCode: challenge.purpose,
            after: { attempts: challenge.attempts + 1 },
          });
          if (locked) {
            await writeAuditEvent(tx, request, {
              action: 'auth.otp.locked',
              entityType: 'OtpChallenge',
              entityId: challenge.id,
              result: 'DENY',
              purposeCode: challenge.purpose,
              after: { attempts: challenge.attempts + 1, maxAttempts: maxOtpAttempts },
            });
          }
          return { locked };
        });
      } catch (_error) {
        return reply.code(503).send({ error: 'audit_unavailable' });
      }
      if (failure.error === 'challenge_state_changed') {
        return reply.code(409).send({ error: failure.error });
      }
      if (locked) return reply.code(423).send({ error: 'otp_locked' });
      return reply.code(401).send({
        error: 'invalid_otp',
        attemptsRemaining: Math.max(0, maxOtpAttempts - challenge.attempts - 1),
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const sessionTokenHash = sha256(rawToken);
    const sessionExpiresAt = new Date(current.getTime() + SESSION_TTL_SECONDS * 1000);
    let result;
    try {
      result = await prisma.$transaction(async (tx) => {
        const consumed = await tx.otpChallenge.updateMany({
          where: {
            id: challenge.id,
            attempts: challenge.attempts,
            consumedAt: null,
            lockedAt: null,
            expiresAt: { gt: current },
          },
          data: { consumedAt: current },
        });
        if (consumed.count !== 1) return { error: 'challenge_state_changed' };

        let user = await tx.user.findUnique({ where: { mobileE164: challenge.mobileE164 } });
        if (!user) {
          const applicantRole = await tx.role.findUnique({ where: { code: 'APPLICANT' } });
          if (!applicantRole) return { error: 'system_roles_not_seeded' };
          user = await tx.user.create({
            data: {
              publicId: newPublicId(),
              mobileE164: challenge.mobileE164,
              status: 'ACTIVE',
              mobileVerifiedAt: current,
            },
          });
          await tx.userRole.create({ data: { userId: user.id, roleId: applicantRole.id } });
        } else if (user.deletedAt || ['SUSPENDED', 'CLOSED'].includes(user.status)) {
          return { error: 'account_unavailable' };
        } else if (user.status === 'PENDING_PHONE' || !user.mobileVerifiedAt) {
          user = await tx.user.update({
            where: { id: user.id },
            data: {
              status: 'ACTIVE',
              mobileVerifiedAt: user.mobileVerifiedAt ?? current,
            },
          });
        }

        const activeMemberships = await tx.userRole.findMany({
          where: { userId: user.id, revokedAt: null },
          select: { roleId: true, role: { select: { code: true } } },
        });
        if (activeMemberships.length === 0) return { error: 'roles_not_assigned' };
        const onlyActiveMembership = activeMemberships.length === 1 ? activeMemberships[0] : null;
        const initialActiveRoleId = onlyActiveMembership?.roleId ?? null;
        const initialActiveRoleCode = onlyActiveMembership?.role.code ?? null;

        const session = await tx.session.create({
          data: {
            userId: user.id,
            activeRoleId: initialActiveRoleId,
            tokenHash: sessionTokenHash,
            ipHash: sha256(String(request.ip)),
            userAgent: typeof request.headers['user-agent'] === 'string'
              ? request.headers['user-agent'].slice(0, 512)
              : null,
            expiresAt: sessionExpiresAt,
          },
        });
        await writeAuditEvent(tx, request, {
          actorUserId: user.id,
          actorRoleCode: initialActiveRoleCode,
          action: 'auth.login.success',
          entityType: 'User',
          entityId: user.id,
          result: 'SUCCESS',
          sessionId: session.id,
          purposeCode: challenge.purpose,
          after: { activeRoleCode: initialActiveRoleCode },
        });
        return { userId: user.id, sessionId: session.id };
      });
    } catch (_error) {
      return reply.code(503).send({ error: 'authentication_unavailable' });
    }

    if (result.error === 'challenge_state_changed') {
      return reply.code(409).send({ error: result.error });
    }
    if (result.error === 'system_roles_not_seeded') {
      return reply.code(503).send({ error: result.error });
    }
    if (result.error === 'account_unavailable' || result.error === 'roles_not_assigned') {
      return reply.code(403).send({ error: result.error });
    }

    setSessionCookie(reply, rawToken, env);
    return reply.code(200).send({ authenticated: true, userId: result.userId });
  });

  app.post('/api/auth/logout', async (request, reply) => {
    if (!(await authorize(request, reply, { authenticatedOnly: true }))) return;
    reply.header('cache-control', 'no-store');

    const revokedAt = now();
    const revoked = await prisma.session.updateMany({
      where: {
        id: request.auth.sessionId,
        userId: request.auth.userId,
        revokedAt: null,
        expiresAt: { gt: revokedAt },
      },
      data: { revokedAt, revokedReason: 'user_logout', lastSeenAt: revokedAt },
    });
    clearSessionCookie(reply, env);
    if (revoked.count !== 1) return reply.code(401).send({ error: 'unauthorized' });
    return reply.send({ loggedOut: true });
  });

  app.get('/api/me', async (request, reply) => {
    if (!(await authorize(request, reply, { authenticatedOnly: true }))) return;
    reply.header('cache-control', 'no-store');
    const user = request.auth.user;
    return reply.send({
      user: {
        id: user.id,
        publicId: user.publicId,
        mobileE164: user.mobileE164,
        status: user.status,
      },
      roles: request.auth.roles.map((role) => ({ code: role.code, titleFa: role.titleFa })),
      activeRole: request.auth.activeRole
        ? { code: request.auth.activeRole.code, titleFa: request.auth.activeRole.titleFa }
        : null,
    });
  });

  app.post('/api/me/active-role', async (request, reply) => {
    if (!(await authorize(request, reply, { authenticatedOnly: true }))) return;
    reply.header('cache-control', 'no-store');
    const roleCode = request.body && typeof request.body === 'object' ? request.body.roleCode : null;
    if (typeof roleCode !== 'string' || !/^[A-Z][A-Z0-9_]{0,63}$/.test(roleCode)) {
      return reply.code(400).send({ error: 'invalid_role_code' });
    }

    let change;
    try {
      change = await prisma.$transaction(async (tx) => {
        const membership = await tx.userRole.findFirst({
          where: {
            userId: request.auth.userId,
            revokedAt: null,
            role: { code: roleCode },
          },
          include: { role: true },
        });
        if (!membership) return { error: 'role_not_assigned' };

        const current = now();
        const session = await tx.session.findFirst({
          where: {
            id: request.auth.sessionId,
            userId: request.auth.userId,
            revokedAt: null,
            expiresAt: { gt: current },
          },
          include: { activeRole: true },
        });
        if (!session) return { error: 'unauthorized' };
        if (session.activeRoleId === membership.roleId) return { error: 'role_already_active' };

        const updated = await tx.session.updateMany({
          where: {
            id: session.id,
            userId: request.auth.userId,
            revokedAt: null,
            expiresAt: { gt: current },
            activeRoleId: session.activeRoleId,
          },
          data: { activeRoleId: membership.roleId, lastSeenAt: current },
        });
        if (updated.count !== 1) return { error: 'unauthorized' };

        await writeAuditEvent(tx, request, {
          actorUserId: request.auth.userId,
          actorRoleCode: session.activeRole?.code ?? null,
          action: 'auth.active_role.change',
          entityType: 'Session',
          entityId: session.id,
          result: 'SUCCESS',
          sessionId: session.id,
          before: { activeRoleCode: session.activeRole?.code ?? null },
          after: { activeRoleCode: membership.role.code },
          changedFields: ['activeRole'],
        });
        return { role: membership.role };
      });
    } catch (_error) {
      return reply.code(503).send({ error: 'audit_unavailable' });
    }

    if (change.error === 'role_not_assigned') return reply.code(403).send({ error: change.error });
    if (change.error === 'role_already_active') return reply.code(409).send({ error: change.error });
    if (change.error === 'unauthorized') return reply.code(401).send({ error: change.error });

    return reply.send({ activeRole: { code: change.role.code, titleFa: change.role.titleFa } });
  });

  app.addHook('onClose', async () => {
    limiter.clear();
    if (ownsPrisma) await prisma.$disconnect();
  });

  return app;
}

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Set NODE_ENV=development; this server is local-only.');
  }
  const app = await createServer();
  const port = Number.parseInt(process.env.API_PORT || '4020', 10);
  await app.listen({ host: '127.0.0.1', port });
  console.log(`Local auth API ready at http://127.0.0.1:${port} (SMS adapter: MOCK ONLY)`);
}

if (require.main === module) {
  main().catch(() => {
    console.error('Auth API startup failed; check local development configuration.');
    process.exit(1);
  });
}

module.exports = {
  createServer,
  normalizeIranianMobile,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  OTP_TTL_MS,
  MAX_OTP_ATTEMPTS,
  sha256,
  otpDigest,
};
