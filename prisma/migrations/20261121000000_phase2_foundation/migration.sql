-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_PHONE', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('SIGNUP', 'LOGIN', 'PHONE_CHANGE', 'RECOVERY');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('ALLOW', 'DENY', 'SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "public_id" VARCHAR(32) NOT NULL,
    "mobile_e164" VARCHAR(16) NOT NULL,
    "email" VARCHAR(254),
    "password_hash" VARCHAR(255),
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_PHONE',
    "mobile_verified_at" TIMESTAMPTZ(3),
    "last_login_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "title_fa" VARCHAR(120) NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "granted_by_user_id" UUID,
    "granted_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "ip_hash" CHAR(64),
    "user_agent" VARCHAR(512),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "revoked_reason" VARCHAR(200),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_challenges" (
    "id" UUID NOT NULL,
    "mobile_e164" VARCHAR(16) NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "code_hash" CHAR(64) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "consumed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "actor_role_code" VARCHAR(64),
    "action" VARCHAR(120) NOT NULL,
    "entity_type" VARCHAR(80) NOT NULL,
    "entity_id" VARCHAR(80) NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "changed_fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "request_id" VARCHAR(80),
    "session_id_hash" CHAR(64),
    "ip_hash" CHAR(64),
    "purpose_code" VARCHAR(80),
    "reason_text" VARCHAR(500),
    "result" "AuditResult" NOT NULL DEFAULT 'SUCCESS',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "slug" VARCHAR(120) NOT NULL,
    "title_fa" VARCHAR(160) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_public_id_key" ON "users"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_e164_key" ON "users"("mobile_e164");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "user_roles_user_id_role_id_idx" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_expires_at_idx" ON "sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "otp_challenges_mobile_e164_created_at_idx" ON "otp_challenges"("mobile_e164", "created_at" DESC);

-- CreateIndex
CREATE INDEX "otp_challenges_expires_at_idx" ON "otp_challenges"("expires_at");

-- CreateIndex
CREATE INDEX "audit_events_entity_type_entity_id_created_at_idx" ON "audit_events"("entity_type", "entity_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_events_actor_user_id_created_at_idx" ON "audit_events"("actor_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_events_action_created_at_idx" ON "audit_events"("action", "created_at");

-- CreateIndex
CREATE INDEX "audit_events_request_id_idx" ON "audit_events"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "industries_slug_key" ON "industries"("slug");

-- CreateIndex
CREATE INDEX "industries_parent_id_sort_order_idx" ON "industries"("parent_id", "sort_order");

-- CreateIndex
CREATE INDEX "industries_is_active_idx" ON "industries"("is_active");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industries" ADD CONSTRAINT "industries_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "industries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- قیدهای SQL که Prisma Schema به‌تنهایی نمایش نمی‌دهد.
CREATE UNIQUE INDEX "uq_user_role_active"
  ON "user_roles" ("user_id", "role_id")
  WHERE "revoked_at" IS NULL;

ALTER TABLE "users"
  ADD CONSTRAINT "chk_users_mobile_e164"
  CHECK ("mobile_e164" ~ '^\+[1-9][0-9]{0,14}$');

ALTER TABLE "otp_challenges"
  ADD CONSTRAINT "chk_otp_challenges_attempts_nonnegative"
  CHECK ("attempts" >= 0);

ALTER TABLE "sessions"
  ADD CONSTRAINT "chk_sessions_expiry_after_creation"
  CHECK ("expires_at" > "created_at");

-- رویداد ممیزی فقط‌افزودنی است. تنها استثنا، SET NULL داخلیِ FK هنگام
-- حذف کاربر برای حفظ رویداد و snapshot نقش است؛ UPDATE مستقیم همچنان رد می‌شود.
CREATE OR REPLACE FUNCTION "reject_audit_event_mutation"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND pg_trigger_depth() > 1
     AND OLD."actor_user_id" IS NOT NULL
     AND NEW."actor_user_id" IS NULL
     AND (to_jsonb(NEW) - 'actor_user_id') = (to_jsonb(OLD) - 'actor_user_id')
  THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'audit_events are append-only; % is forbidden', TG_OP
    USING ERRCODE = '55000';
END;
$$;

CREATE TRIGGER "audit_events_reject_update_delete"
  BEFORE UPDATE OR DELETE ON "audit_events"
  FOR EACH ROW EXECUTE FUNCTION "reject_audit_event_mutation"();

CREATE TRIGGER "audit_events_reject_truncate"
  BEFORE TRUNCATE ON "audit_events"
  FOR EACH STATEMENT EXECUTE FUNCTION "reject_audit_event_mutation"();

REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "audit_events" FROM PUBLIC;
