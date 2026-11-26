'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');
const { test } = require('node:test');
const { createServer } = require('./server');
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
  await prisma.session.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
}

async function seedRoleFixtures() {
  const roles = [
    ['APPLICANT', 'متقاضی نمایندگی'],
    ['FRANCHISOR', 'واگذارکننده'],
    ['VERIFICATION_OFFICER', 'کارشناس احراز'],
    ['ADMIN', 'مدیر'],
    ['SUPER_ADMIN', 'مدیرکل'],
  ];
  for (const [code, titleFa] of roles) {
    await prisma.role.create({ data: { code, titleFa, isSystem: true } });
  }
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

async function requestOtp(server, mobileE164 = '+4915112345678') {
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
});

test.beforeEach(async () => {
  fixedNow = new Date(Date.now() + 1_000);
  await clearFixtures();
  await seedRoleFixtures();
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

test('the shared RBAC guard checks franchise ownership and expert assignment', async () => {
  function replyRecorder() {
    return {
      statusCode: 200,
      body: undefined,
      code(code) { this.statusCode = code; return this; },
      send(value) { this.body = value; return this; },
    };
  }

  const request = {
    auth: { userId: 'owner-1', activeRole: { code: 'FRANCHISOR' } },
    server: {
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      prisma: {
        franchise: { findUnique: async () => ({ ownerUserId: 'owner-1' }) },
        supportCase: { findUnique: async () => ({ expertUserId: 'expert-1' }) },
      },
    },
  };
  const ownerReply = replyRecorder();
  assert.equal(await authorize(request, ownerReply, {
    permission: 'franchise:read:own',
    ownership: { model: 'franchise', id: 'franchise-1' },
  }), true);

  request.auth = { userId: 'other-1', activeRole: { code: 'FRANCHISOR' } };
  const ownerDeniedReply = replyRecorder();
  assert.equal(await authorize(request, ownerDeniedReply, {
    permission: 'franchise:read:own',
    ownership: { model: 'franchise', id: 'franchise-1' },
  }), false);
  assert.equal(ownerDeniedReply.statusCode, 403);

  request.auth = { userId: 'expert-1', activeRole: { code: 'VERIFICATION_OFFICER' } };
  const expertReply = replyRecorder();
  assert.equal(await authorize(request, expertReply, {
    permission: 'case:read:assigned',
    expertAssignment: { model: 'supportCase', id: 'case-1' },
  }), true);

  request.auth = { userId: 'other-1', activeRole: { code: 'VERIFICATION_OFFICER' } };
  const deniedReply = replyRecorder();
  assert.equal(await authorize(request, deniedReply, {
    permission: 'case:read:assigned',
    expertAssignment: { model: 'supportCase', id: 'case-1' },
  }), false);
  assert.equal(deniedReply.statusCode, 403);
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

test('an unassigned role is forbidden; assigning an already-active role is rejected', async (t) => {
  const server = await buildApp(t);
  const otp = await requestOtp(server, '+4915112345680');
  const { response: verified, cookie } = await establishSession(server, otp);
  const userId = verified.json().userId;

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

  const repeated = await server.inject({
    method: 'POST',
    url: '/api/me/active-role',
    headers: { cookie },
    payload: { roleCode: 'APPLICANT' },
  });
  assert.equal(repeated.statusCode, 409);
  assert.deepEqual(repeated.json(), { error: 'role_already_active' });

  const userRole = await prisma.userRole.findFirst({
    where: { userId, revokedAt: null },
    include: { role: true },
  });
  assert.equal(userRole.role.code, 'APPLICANT');
  await assert.rejects(
    prisma.userRole.create({ data: { userId, roleId: userRole.roleId } }),
    (error) => error.code === 'P2002',
  );
});

test('failed OTP attempts lock the challenge at the configured limit', async (t) => {
  const server = await buildApp(t, { maxOtpAttempts: 3 });
  const otp = await requestOtp(server, '+4915112345681');
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
  const locked = await verifyOtp(server, otp);
  assert.equal(locked.statusCode, 423);
});

test('request-otp applies a simple per-IP and per-number rate limit', async (t) => {
  const server = await buildApp(t, { requestOtpLimit: 1, requestOtpWindowMs: 60_000 });
  const first = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164: '+4915112345682' },
  });
  const second = await server.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { mobileE164: '+4915112345682' },
  });
  assert.equal(first.statusCode, 201);
  assert.equal(second.statusCode, 429);
  assert.deepEqual(second.json(), { error: 'rate_limited' });
});
