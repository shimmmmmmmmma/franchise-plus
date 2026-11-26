#!/bin/sh
set -eu

if [ -z "${AUTH_TEST_DATABASE_URL:-}" ]; then
  echo 'Set AUTH_TEST_DATABASE_URL to a dedicated PostgreSQL database whose name ends in _test.' >&2
  exit 2
fi

node <<'NODE'
const value = process.env.AUTH_TEST_DATABASE_URL;
let url;
try {
  url = new URL(value);
} catch {
  console.error('AUTH_TEST_DATABASE_URL must be a valid PostgreSQL URL.');
  process.exit(2);
}
const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, '').split('/')[0] || '');
if (!databaseName.endsWith('_test')) {
  console.error('Refusing to reset a database unless its name ends in _test.');
  process.exit(2);
}
NODE

export DATABASE_URL="$AUTH_TEST_DATABASE_URL"
npx prisma migrate reset --force --skip-seed --skip-generate
node --test api/auth.test.js
