'use strict';

const { createHash } = require('node:crypto');

function hashIp(ip) {
  return createHash('sha256').update(String(ip)).digest('hex');
}

async function writeAuditEvent(tx, request, event) {
  const data = {
    actorUserId: event.actorUserId ?? null,
    actorRoleCode: event.actorRoleCode ?? null,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId,
    result: event.result,
    ipHash: hashIp(request.ip),
  };
  if (event.sessionId) {
    data.sessionIdHash = createHash('sha256').update(event.sessionId).digest('hex');
  }
  if (event.purposeCode) data.purposeCode = event.purposeCode;
  if (event.before !== undefined) data.before = event.before;
  if (event.after !== undefined) data.after = event.after;
  if (event.changedFields) data.changedFields = event.changedFields;
  if (event.reasonText) data.reasonText = event.reasonText;

  return tx.auditEvent.create({ data });
}

module.exports = { hashIp, writeAuditEvent };
