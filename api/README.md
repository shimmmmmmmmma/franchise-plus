# Local-only authentication API

This is a separate Fastify service under `api/`; it uses this repository's Prisma client and PostgreSQL schema. It binds to `127.0.0.1` only and refuses to start outside `NODE_ENV=development` (tests use `NODE_ENV=test`). It is not a production authentication service.

## Local run

1. Install the repository dependencies and apply the committed Prisma migrations to the local development database.
2. Seed the system roles (`APPLICANT`, `FRANCHISOR`, `VERIFICATION_OFFICER`, `ADMIN`, `SUPER_ADMIN`) using the existing `npm run db:seed` script. The API creates an `APPLICANT` membership after successful phone verification; it never grants elevated roles.
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

- `POST /api/auth/request-otp` — JSON `{ "mobileE164": "+4915112345678", "purpose": "LOGIN" }`. `purpose` may be `LOGIN` or `SIGNUP`. Challenges expire after five minutes, keep a hashed OTP and attempt count, and lock after five invalid attempts. The simple rate limit is five requests per minute per source IP and phone number.
- `POST /api/auth/verify-otp` — JSON `{ "challengeId": "<challenge-id>", "code": "<six-digit-code>" }`. On success, creates a database-backed session and sets an `HttpOnly; SameSite=Lax` cookie. The raw session token is never included in JSON.
- `GET /api/me` — requires that cookie; returns the caller's profile, assigned roles, and active role.
- `POST /api/me/active-role` — JSON `{ "roleCode": "APPLICANT" }`; accepts only an active role membership already assigned to that user. Selecting the already active role again returns `409`.

All routes pass through the shared server-side `authorize` guard. It checks authentication, the session's active role and permissions, and supports explicit record-ownership and expert-assignment checks for protected resource routes. This slice does not add franchise/case resource endpoints.

## Auth integration tests

Use a new, dedicated PostgreSQL database whose name ends in `_test`; do not point this at the development database. Create the empty database using your local PostgreSQL administration setup, then pass its URL only through the environment:

```sh
AUTH_TEST_DATABASE_URL='postgresql://…/franchise_plus_auth_test?schema=public' npm run test:auth:fresh
```

The runner refuses database names without the `_test` suffix, resets only that test schema, applies only migrations committed in this repository (`migrate reset --skip-seed`), then runs `node:test`. The integration test also verifies the connected database name and applied migration list. It creates test roles as fixtures; it does not run the repository seed against the test database.
