ALTER TABLE "sessions"
  ADD COLUMN "active_role_id" UUID;

ALTER TABLE "otp_challenges"
  ADD COLUMN "locked_at" TIMESTAMPTZ(3);

ALTER TABLE "sessions"
  ADD CONSTRAINT "sessions_active_role_id_fkey"
  FOREIGN KEY ("active_role_id") REFERENCES "roles"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "sessions_active_role_id_idx"
  ON "sessions"("active_role_id");
