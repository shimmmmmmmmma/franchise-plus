'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');
const { test } = require('node:test');
const { createServer, normalizeIranianMobile } = require('./server');
const { authorize, DEFAULT_ROLE_PERMISSIONS } = require('./authz');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('Set DATABASE_URL to a dedicated PostgreSQL database ending in _test.');
const parsedDatabaseUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(parsedDatabaseUrl.pathname.replace(/^\/+/, '').split('/')[0] || '');
if (!databaseName.endsWith('_test')) {
  throw new Error('Refusing to run authentication tests unless the database name ends in _test.');
}

const prisma = new PrismaClient();
let fixedNow;
let app;

async function clearFixtures() {
  // Audit rows and their users are retained because audit_events are append-only.
  await prisma.supportCase.deleteMany();
  await prisma.session.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.userRole.deleteMany();
}


async function createTestUser(mobileE164, status = 'ACTIVE') {
  return prisma.user.create({
    data: {
      publicId: `TEST-${crypto.randomBytes(12).toString('hex')}`,
      mobileE164,
      status,
      mobileVerifiedAt: status === 'ACTIVE' ? fixedNow : null,
    },
  });
}

async function buildApp(t, options = {}) {
  const mockNow = options.now ?? (() => new Date(fixedNow));
  const smsAdapter = options.smsAdapter;
  app = await createServer({
    prisma,
    env: options.env ?? { NODE_ENV: 'test', DEV_OTP: '1' },
    now: mockNow,
    smsAdapter,
    otpHashSecret: crypto.randomBytes(32),
    requestOtpLimit: options.requestOtpLimit,
    requestOtpWindowMs: options.requestOtpWindowMs,
    maxOtpAttempts: options.maxOtpAttempts,
  });
  t.after(async () => {
    if (app) await app.close();
    app = null;
  });
  return app;
}

async function requestOtp(server, mobileE164 = '+989121234567') {
  const response = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164, purpose: 'LOGIN' },
  });
  assert.equal(response.statusCode, 201, response.body);
  const payload = response.json();
  assert.equal(Object.hasOwn(payload, 'devOtp'), false, 'test environment must not return an OTP');
  const captured = server.smsAdapter.getSent().find((message) => message.challengeId === payload.challengeId);
  assert.ok(captured, 'the explicitly mock SMS adapter should capture the test OTP');
  return { challengeId: payload.challengeId, code: captured.code, mobileE164 };
}

async function verifyOtp(server, otp) {
  return server.inject({
    method: 'POST',
    url: '/api/auth/verify-otp',
    payload: { challengeId: otp.challengeId, code: otp.code },
  });
}

async function establishSession(server, otp) {
  const response = await verifyOtp(server, otp);
  assert.equal(response.statusCode, 200, response.body);
  const cookie = response.headers['set-cookie'];
  assert.equal(typeof cookie, 'string');
  assert.match(cookie, /^fp_session=[0-9a-f]{64};/i);
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  return { response, cookie: cookie.split(';')[0] };
}

test.before(async () => {
  await prisma.$connect();
  const current = await prisma.$queryRaw`SELECT current_database() AS name`;
  assert.equal(current[0].name, databaseName, 'connected DB must be the explicitly named _test database');

  const migrationsDirectory = path.join(__dirname, '..', 'prisma', 'migrations');
  const expectedMigrations = fs.readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const appliedMigrations = await prisma.$queryRaw`
    SELECT migration_name
    FROM "_prisma_migrations"
    WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL
    ORDER BY migration_name
  `;
  assert.deepEqual(
    appliedMigrations.map((row) => row.migration_name).sort(),
    expectedMigrations,
    'the test DB must have only completed migrations from this repository applied',
  );
  const seededRoleCodes = await prisma.role.findMany({ select: { code: true }, orderBy: { code: 'asc' } });
  assert.deepEqual(
    seededRoleCodes.map((role) => role.code),
    ['ADMIN', 'APPLICANT', 'FRANCHISOR', 'SUPER_ADMIN', 'VERIFICATION_OFFICER'],
    'system roles must come from the repository migration, not a seed step',
  );
});

test.beforeEach(async () => {
  fixedNow = new Date(Date.now() + 1_000);
  await clearFixtures();
});

test.after(async () => {
  await clearFixtures();
  await prisma.$disconnect();
});

test('GET /api/me returns 401 without a server-side session', async (t) => {
  const server = await buildApp(t);
  const response = await server.inject({ method: 'GET', url: '/api/me' });
  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.json(), { error: 'unauthorized' });
  const logout = await server.inject({ method: 'POST', url: '/api/auth/logout' });
  assert.equal(logout.statusCode, 401);
  assert.deepEqual(logout.json(), { error: 'unauthorized' });
});

test('Iranian phone formats normalize to E.164 and foreign numbers are rejected', async (t) => {
  const expected = '+989121234567';
  assert.equal(normalizeIranianMobile('۰۹۱۲۱۲۳۴۵۶۷'), expected);
  assert.equal(normalizeIranianMobile('09121234567'), expected);
  assert.equal(normalizeIranianMobile('+989121234567'), expected);
  assert.equal(normalizeIranianMobile('00989121234567'), expected);

  const server = await buildApp(t);
  const response = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164: '+4915112345700' },
  });
  assert.equal(response.statusCode, 422);
  assert.deepEqual(response.json(), { error: 'unsupported_country' });
  assert.equal(await prisma.otpChallenge.count(), 0);
  assert.equal(server.smsAdapter.getSent().length, 0);

  const normalizedRequest = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164: '۰۹۱۲۱۲۳۴۵۶۷' },
  });
  assert.equal(normalizedRequest.statusCode, 201);
  const challenge = await prisma.otpChallenge.findUnique({ where: { id: normalizedRequest.json().challengeId } });
  assert.equal(challenge.mobileE164, expected);
  assert.equal(server.smsAdapter.getSent()[0].mobileE164, expected);
});

test('the shared RBAC guard rejects a permission not granted by the active role', async () => {
  let statusCode = 200;
  let body;
  const reply = {
    code(code) { statusCode = code; return this; },
    send(value) { body = value; return this; },
  };
  const request = {
    auth: { userId: 'test-user', activeRole: { code: 'APPLICANT' } },
    server: { rolePermissions: DEFAULT_ROLE_PERMISSIONS, prisma: {} },
  };
  const allowed = await authorize(request, reply, { permission: 'case:read:assigned' });
  assert.equal(allowed, false);
  assert.equal(statusCode, 403);
  assert.deepEqual(body, { error: 'forbidden' });
});

test('shared RBAC checks ownership and expert assignment against a persisted support_cases row', async () => {
  function replyRecorder() {
    return {
      statusCode: 200,
      body: undefined,
      code(code) { this.statusCode = code; return this; },
      send(value) { this.body = value; return this; },
    };
  }

  const owner = await createTestUser('+989111111111');
  const assignedExpert = await createTestUser('+989111111112');
  const otherExpert = await createTestUser('+989111111113');
  const applicantRole = await prisma.role.findUnique({ where: { code: 'APPLICANT' } });
  const officerRole = await prisma.role.findUnique({ where: { code: 'VERIFICATION_OFFICER' } });
  await prisma.userRole.create({ data: { userId: owner.id, roleId: applicantRole.id } });
  await prisma.userRole.create({ data: { userId: assignedExpert.id, roleId: officerRole.id } });
  await prisma.userRole.create({ data: { userId: otherExpert.id, roleId: applicantRole.id } });
  await prisma.userRole.create({ data: { userId: otherExpert.id, roleId: officerRole.id } });

  const supportCase = await prisma.supportCase.create({
    data: {
      publicId: `CASE-${crypto.randomBytes(10).toString('hex')}`,
      ownerUserId: owner.id,
      expertUserId: assignedExpert.id,
    },
  });
  const makeRequest = (userId, activeRole) => ({
    auth: { userId, activeRole },
    server: { rolePermissions: DEFAULT_ROLE_PERMISSIONS, prisma },
  });

  const ownerReply = replyRecorder();
  assert.equal(await authorize(makeRequest(owner.id, applicantRole), ownerReply, {
    permission: 'case:read:own',
    ownership: { model: 'supportCase', id: supportCase.id, ownerField: 'ownerUserId' },
  }), true);

  const otherOwnerReply = replyRecorder();
  assert.equal(await authorize(makeRequest(otherExpert.id, applicantRole), otherOwnerReply, {
    permission: 'case:read:own',
    ownership: { model: 'supportCase', id: supportCase.id, ownerField: 'ownerUserId' },
  }), false);
  assert.equal(otherOwnerReply.statusCode, 403);

  const assignedReply = replyRecorder();
  assert.equal(await authorize(makeRequest(assignedExpert.id, officerRole), assignedReply, {
    permission: 'case:read:assigned',
    expertAssignment: { model: 'supportCase', id: supportCase.id, expertField: 'expertUserId' },
  }), true);

  const unassignedReply = replyRecorder();
  assert.equal(await authorize(makeRequest(otherExpert.id, officerRole), unassignedReply, {
    permission: 'case:read:assigned',
    expertAssignment: { model: 'supportCase', id: supportCase.id, expertField: 'expertUserId' },
  }), false);
  assert.equal(unassignedReply.statusCode, 403);
});

test('an expired OTP challenge cannot create a session', async (t) => {
  const server = await buildApp(t);
  const otp = await requestOtp(server);
  await prisma.otpChallenge.update({
    where: { id: otp.challengeId },
    data: { expiresAt: new Date(fixedNow.getTime() - 1) },
  });
  const response = await verifyOtp(server, otp);
  assert.equal(response.statusCode, 410);
  assert.deepEqual(response.json(), { error: 'otp_expired' });
  assert.equal(await prisma.session.count(), 0);
});

test('a single role auto-activates and successful login is audited', async (t) => {
  const server = await buildApp(t);
  const otp = await requestOtp(server, '+989121234579');
  const { response: verified, cookie } = await establishSession(server, otp);
  const userId = verified.json().userId;
  const me = await server.inject({ method: 'GET', url: '/api/me', headers: { cookie } });
  assert.equal(me.statusCode, 200);
  assert.deepEqual(me.json().roles.map((role) => role.code), ['APPLICANT']);
  assert.equal(me.json().activeRole.code, 'APPLICANT');

  const audit = await prisma.auditEvent.findFirst({
    where: { action: 'auth.login.success', actorUserId: userId },
  });
  assert.ok(audit);
  assert.equal(audit.entityType, 'User');
  assert.equal(audit.entityId, userId);
  assert.equal(audit.actorRoleCode, 'APPLICANT');
  assert.equal(audit.result, 'SUCCESS');
  assert.match(audit.ipHash, /^[0-9a-f]{64}$/);
  assert.match(audit.sessionIdHash, /^[0-9a-f]{64}$/);
});

test('an existing single-role account keeps and auto-activates its assigned role', async (t) => {
  const server = await buildApp(t);
  const mobileE164 = '+989121234578';
  const franchisorRole = await prisma.role.findUnique({ where: { code: 'FRANCHISOR' } });
  const user = await createTestUser(mobileE164);
  await prisma.userRole.create({ data: { userId: user.id, roleId: franchisorRole.id } });

  const otp = await requestOtp(server, mobileE164);
  const { cookie } = await establishSession(server, otp);
  const me = await server.inject({ method: 'GET', url: '/api/me', headers: { cookie } });
  assert.equal(me.statusCode, 200);
  assert.deepEqual(me.json().roles.map((role) => role.code), ['FRANCHISOR']);
  assert.equal(me.json().activeRole.code, 'FRANCHISOR');
  assert.equal(await prisma.userRole.count({ where: { userId: user.id, revokedAt: null } }), 1);
});

test('role selection only accepts assigned roles and rejects duplicates', async (t) => {
  const server = await buildApp(t);
  const mobileE164 = '+989121234580';
  const applicantRole = await prisma.role.findUnique({ where: { code: 'APPLICANT' } });
  const franchisorRole = await prisma.role.findUnique({ where: { code: 'FRANCHISOR' } });
  const user = await createTestUser(mobileE164, 'PENDING_PHONE');
  await prisma.userRole.create({ data: { userId: user.id, roleId: applicantRole.id } });
  await prisma.userRole.create({ data: { userId: user.id, roleId: franchisorRole.id } });

  const otp = await requestOtp(server, mobileE164);
  const { response: verified, cookie } = await establishSession(server, otp);
  const userId = verified.json().userId;
  const me = await server.inject({ method: 'GET', url: '/api/me', headers: { cookie } });
  assert.equal(me.statusCode, 200);
  assert.equal(me.json().activeRole, null, 'multiple assigned roles require a selection');

  const unassigned = await server.inject({
    method: 'POST',
    url: '/api/me/active-role',
    headers: { cookie },
    payload: { roleCode: 'ADMIN' },
  });
  assert.equal(unassigned.statusCode, 403);
  assert.deepEqual(unassigned.json(), { error: 'role_not_assigned' });

  const selected = await server.inject({
    method: 'POST',
    url: '/api/me/active-role',
    headers: { cookie },
    payload: { roleCode: 'APPLICANT' },
  });
  assert.equal(selected.statusCode, 200);
  assert.equal(selected.json().activeRole.code, 'APPLICANT');
  const roleAudit = await prisma.auditEvent.findFirst({
    where: { action: 'auth.active_role.change', actorUserId: userId },
  });
  assert.ok(roleAudit);
  assert.equal(roleAudit.entityType, 'Session');
  assert.equal(roleAudit.result, 'SUCCESS');
  assert.match(roleAudit.ipHash, /^[0-9a-f]{64}$/);
  assert.deepEqual(roleAudit.before, { activeRoleCode: null });
  assert.deepEqual(roleAudit.after, { activeRoleCode: 'APPLICANT' });

  const repeated = await server.inject({
    method: 'POST',
    url: '/api/me/active-role',
    headers: { cookie },
    payload: { roleCode: 'APPLICANT' },
  });
  assert.equal(repeated.statusCode, 409);
  assert.deepEqual(repeated.json(), { error: 'role_already_active' });

  const userRole = await prisma.userRole.findFirst({
    where: { userId, revokedAt: null, role: { code: 'APPLICANT' } },
  });
  assert.ok(userRole);
  await assert.rejects(
    prisma.userRole.create({ data: { userId, roleId: applicantRole.id } }),
    (error) => error.code === 'P2002',
  );
});

test('logout revokes the server-side session and clears the cookie', async (t) => {
  const server = await buildApp(t);
  const otp = await requestOtp(server, '+989121234583');
  const { response: verified, cookie } = await establishSession(server, otp);
  const userId = verified.json().userId;

  const logout = await server.inject({
    method: 'POST',
    url: '/api/auth/logout',
    headers: { cookie },
  });
  assert.equal(logout.statusCode, 200);
  assert.deepEqual(logout.json(), { loggedOut: true });
  assert.match(logout.headers['set-cookie'], /^fp_session=;/);
  assert.match(logout.headers['set-cookie'], /HttpOnly/i);
  assert.match(logout.headers['set-cookie'], /SameSite=Lax/i);
  assert.match(logout.headers['set-cookie'], /Max-Age=0/i);

  const me = await server.inject({ method: 'GET', url: '/api/me', headers: { cookie } });
  assert.equal(me.statusCode, 401);
  const session = await prisma.session.findFirst({ where: { userId } });
  assert.ok(session.revokedAt);
  assert.equal(session.revokedReason, 'user_logout');
});

test('failed OTP attempts lock the challenge at the configured limit', async (t) => {
  const server = await buildApp(t, { maxOtpAttempts: 3 });
  const otp = await requestOtp(server, '+989121234581');
  const wrongCode = otp.code === '000000' ? '000001' : '000000';
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await server.inject({
      method: 'POST',
      url: '/api/auth/verify-otp',
      payload: { challengeId: otp.challengeId, code: wrongCode },
    });
    assert.equal(response.statusCode, attempt < 3 ? 401 : 423);
  }
  const challenge = await prisma.otpChallenge.findUnique({ where: { id: otp.challengeId } });
  assert.equal(challenge.attempts, 3);
  assert.ok(challenge.lockedAt);
  const failedEvents = await prisma.auditEvent.findMany({
    where: { action: 'auth.otp.failure', entityId: otp.challengeId },
  });
  assert.equal(failedEvents.length, 3);
  assert.ok(failedEvents.every((event) => event.result === 'FAILURE' && /^[0-9a-f]{64}$/.test(event.ipHash)));
  const lockEvent = await prisma.auditEvent.findFirst({
    where: { action: 'auth.otp.locked', entityId: otp.challengeId },
  });
  assert.ok(lockEvent);
  assert.equal(lockEvent.result, 'DENY');
  assert.match(lockEvent.ipHash, /^[0-9a-f]{64}$/);
  const locked = await verifyOtp(server, otp);
  assert.equal(locked.statusCode, 423);
});

test('request-otp applies a simple per-IP and per-number rate limit', async (t) => {
  const server = await buildApp(t, { requestOtpLimit: 1, requestOtpWindowMs: 60_000 });
  const first = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164: '+989121234582' },
  });
  const second = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164: '+989121234582' },
  });
  assert.equal(first.statusCode, 201);
  assert.equal(second.statusCode, 429);
  assert.deepEqual(second.json(), { error: 'rate_limited' });
});
