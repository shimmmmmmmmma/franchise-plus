'use strict';

/** Explicit development-only SMS adapter: captures messages in memory, never sends SMS. */
function createMockSmsAdapter() {
  const sent = [];
  return Object.freeze({
    adapterType: 'mock-only',
    label: 'MOCK ONLY — no SMS is sent',
    async sendOtp({ mobileE164, code, challengeId }) {
      sent.push({ mobileE164, code, challengeId, createdAt: new Date() });
      return { accepted: true, adapter: 'mock-only' };
    },
    getSent() {
      return sent.map((message) => ({ ...message }));
    },
    clear() {
      sent.length = 0;
    },
  });
}

module.exports = { createMockSmsAdapter };
