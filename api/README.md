# Local-only authentication API

This is a separate Fastify service under `api/`; it uses this repository's Prisma client and PostgreSQL schema. It binds to `127.0.0.1` only and refuses to start outside `NODE_ENV=development` (tests use `NODE_ENV=test`). It is not a production authentication service.

## Local run

1. Install the repository dependencies and apply the committed Prisma migrations to the local development database.
2. The data migration `20261121140000_seed_system_roles` inserts the five system roles idempotently; auth does not depend on running `npm run db:seed` in production. A newly-created account receives an `APPLICANT` membership after successful phone verification; existing role assignments are not changed, and the API never grants elevated roles.
3. Start the API from the repository root:

   ```sh
   NODE_ENV=development npm run api:start
   ```

   The service listens on `http://127.0.0.1:4020`. To include a development OTP in `request-otp` responses for local manual testing only:

   ```sh
   NODE_ENV=development DEV_OTP=1 npm run api:start
   ```

   Otherwise the OTP is not returned by the API. The only SMS adapter is explicitly labeled `MOCK ONLY — no SMS is sent`; it captures OTPs in process memory and has no network integration.

## Routes

- `POST /api/auth/request-otp` — JSON `{ "mobileE164": "+989121234567", "purpose": "LOGIN" }`. Persian/ASCII national forms (`۰۹۱۲…`, `0912…`), `+989…`, and `00989…` normalize to `+989…`; other countries or invalid forms return `422 unsupported_country`. `purpose` may be `LOGIN` or `SIGNUP`. Challenges expire after five minutes, keep a hashed OTP and attempt count, and lock after five invalid attempts. The simple rate limit is five requests per minute per source IP and normalized phone number.
- `POST /api/auth/verify-otp` — JSON `{ "challengeId": "<challenge-id>", "code": "<six-digit-code>" }`. On success, creates a database-backed session and sets an `HttpOnly; SameSite=Lax` cookie. The raw session token is never included in JSON.
- `POST /api/auth/logout` — requires the session cookie, revokes the server-side session, and clears the cookie.
- `GET /api/me` — requires that cookie; returns the caller's profile, assigned roles, and active role. A user with exactly one active role gets it selected automatically at session creation; users with multiple roles start with `activeRole: null` and choose one explicitly.
- `POST /api/me/active-role` — JSON `{ "roleCode": "APPLICANT" }`; accepts only an active role membership already assigned to that user. Selecting the already active role again returns `409`.

All routes pass through the shared server-side `authorize` guard. For persisted data-backed ownership and expert-assignment checks, migration `20261121130000_auth_rbac_cases` adds the minimal `support_cases` table with `owner_user_id` and `expert_user_id` foreign keys. Integration tests create actual users and case rows, then verify the guard allows the owner/assigned expert and denies other users. This slice does not add a case HTTP resource endpoint.

`audit_events` records successful login (`auth.login.success`), each wrong OTP (`auth.otp.failure`), the lock event (`auth.otp.locked`), and active-role changes (`auth.active_role.change`). Events include entity/action/result and a SHA-256 IP hash; OTP values and raw session tokens are never written to the audit log.

## Auth integration tests

Use a new, dedicated PostgreSQL database whose name ends in `_test`; do not point this at the development database. Create the empty database using your local PostgreSQL administration setup, then pass its URL only through the environment:

```sh
AUTH_TEST_DATABASE_URL='postgresql://…/franchise_plus_auth_test?schema=public' npm run test:auth:fresh
```

The runner refuses database names without the `_test` suffix, resets only that test schema, applies only migrations committed in this repository (`migrate reset --skip-seed`), then runs `node:test`. The integration test verifies the connected database name, applied migration list, and the five roles inserted by the data migration. Test users and support cases are fixtures; the repository seed script is not run against the test database.
