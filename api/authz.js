'use strict';

const DEFAULT_ROLE_PERMISSIONS = Object.freeze({
  APPLICANT: ['auth:me', 'auth:active-role', 'case:read:own', 'case:write:own'],
  FRANCHISOR: ['auth:me', 'auth:active-role', 'franchise:read:own', 'franchise:write:own'],
  VERIFICATION_OFFICER: ['auth:me', 'auth:active-role', 'case:read:assigned', 'case:write:assigned'],
  ADMIN: ['auth:me', 'auth:active-role', 'franchise:read:any', 'franchise:write:any', 'case:read:any'],
  SUPER_ADMIN: ['auth:me', 'auth:active-role', 'franchise:read:any', 'franchise:write:any', 'case:read:any'],
});

/**
 * Shared server-side authorization guard. Active role is resolved from the session
 * in the database, then ownership and expert assignment are checked by Prisma.
 */
async function authorize(request, reply, policy = {}) {
  if (policy.public === true) return true;

  const session = request.auth;
  if (!session) {
    reply.code(401).send({ error: 'unauthorized' });
    return false;
  }

  const role = session.activeRole?.code ?? null;
  if (policy.authenticatedOnly) return true;
  if (!role) {
    reply.code(403).send({ error: 'active_role_required' });
    return false;
  }

  const permissionsByRole = request.server.rolePermissions ?? DEFAULT_ROLE_PERMISSIONS;
  const permissions = permissionsByRole[role] ?? [];
  if (policy.permission && !permissions.includes(policy.permission)) {
    reply.code(403).send({ error: 'forbidden' });
    return false;
  }

  if (policy.role && role !== policy.role) {
    reply.code(403).send({ error: 'forbidden' });
    return false;
  }

  const db = request.server.prisma;
  if (policy.ownership) {
    const { model, id, ownerField = 'ownerUserId' } = policy.ownership;
    if (!db[model] || typeof id !== 'string') {
      reply.code(400).send({ error: 'invalid_resource' });
      return false;
    }
    const record = await db[model].findUnique({
      where: { id },
      select: { [ownerField]: true },
    });
    if (!record || record[ownerField] !== session.userId) {
      reply.code(403).send({ error: 'forbidden' });
      return false;
    }
  }

  if (policy.expertAssignment) {
    const { model, id, expertField = 'expertUserId' } = policy.expertAssignment;
    if (!db[model] || typeof id !== 'string') {
      reply.code(400).send({ error: 'invalid_resource' });
      return false;
    }
    const record = await db[model].findUnique({
      where: { id },
      select: { [expertField]: true },
    });
    if (!record || record[expertField] !== session.userId) {
      reply.code(403).send({ error: 'forbidden' });
      return false;
    }
  }

  return true;
}

module.exports = { DEFAULT_ROLE_PERMISSIONS, authorize };
