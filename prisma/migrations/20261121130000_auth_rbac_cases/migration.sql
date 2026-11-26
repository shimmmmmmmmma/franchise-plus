CREATE TABLE "support_cases" (
    "id" UUID NOT NULL,
    "public_id" VARCHAR(32) NOT NULL,
    "owner_user_id" UUID NOT NULL,
    "expert_user_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "support_cases_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "support_cases_public_id_key"
  ON "support_cases"("public_id");

CREATE INDEX "support_cases_owner_user_id_created_at_idx"
  ON "support_cases"("owner_user_id", "created_at" DESC);

CREATE INDEX "support_cases_expert_user_id_created_at_idx"
  ON "support_cases"("expert_user_id", "created_at" DESC);

ALTER TABLE "support_cases"
  ADD CONSTRAINT "support_cases_owner_user_id_fkey"
  FOREIGN KEY ("owner_user_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "support_cases"
  ADD CONSTRAINT "support_cases_expert_user_id_fkey"
  FOREIGN KEY ("expert_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
