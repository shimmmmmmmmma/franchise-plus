-- Regression checks for the Phase 2 foundation. Safe only for databases ending _dev or _test.
-- Run with: psql "$DATABASE_URL_WITHOUT_SCHEMA_QUERY" -f prisma/tests/constraints.sql
\set ON_ERROR_STOP on
BEGIN;

DO $$
BEGIN
  IF current_database() !~ '_(dev|test)$' THEN
    RAISE EXCEPTION 'Refusing constraint tests outside a _dev or _test database';
  END IF;
END;
$$;

DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_role_id UUID;
  test_mobile TEXT := '+1' || lpad(floor(random() * 99999999999999)::bigint::text, 14, '0');
  audit_id UUID := gen_random_uuid();
  audit_actor_id UUID := gen_random_uuid();
  audit_actor_mobile TEXT := '+1' || lpad(floor(random() * 99999999999999)::bigint::text, 14, '0');
  actual_actor_id UUID;
  actual_role_code TEXT;
BEGIN
  SELECT id INTO test_role_id FROM roles WHERE code = 'APPLICANT';
  IF test_role_id IS NULL THEN
    RAISE EXCEPTION 'Seed APPLICANT role before running this test';
  END IF;

  -- E.164-style check rejects a malformed phone.
  BEGIN
    INSERT INTO users (id, public_id, mobile_e164, updated_at)
    VALUES (
      gen_random_uuid(),
      'bad_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 28),
      '12345',
      now()
    );
    RAISE EXCEPTION 'Invalid mobile unexpectedly succeeded';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: malformed mobile rejected';
  END;

  -- Only one live assignment per (user, role); revoked history can be retained.
  INSERT INTO users (id, public_id, mobile_e164, updated_at)
  VALUES (
    test_user_id,
    'test_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 27),
    test_mobile,
    now()
  );
  INSERT INTO user_roles (id, user_id, role_id)
  VALUES (gen_random_uuid(), test_user_id, test_role_id);

  BEGIN
    INSERT INTO user_roles (id, user_id, role_id)
    VALUES (gen_random_uuid(), test_user_id, test_role_id);
    RAISE EXCEPTION 'Duplicate active user role unexpectedly succeeded';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate active role rejected';
  END;

  INSERT INTO user_roles (id, user_id, role_id, revoked_at)
  VALUES (gen_random_uuid(), test_user_id, test_role_id, now());

  -- The audit payload cannot be edited, unlinked directly, deleted, or truncated.
  INSERT INTO audit_events (id, action, entity_type, entity_id, actor_role_code, result, changed_fields)
  VALUES (audit_id, 'test.append_only', 'test', 'constraints', 'APPLICANT', 'SUCCESS', ARRAY[]::TEXT[]);

  BEGIN
    UPDATE audit_events SET action = 'test.mutated' WHERE id = audit_id;
    RAISE EXCEPTION 'Audit UPDATE unexpectedly succeeded';
  EXCEPTION WHEN SQLSTATE '55000' THEN
    RAISE NOTICE 'PASS: audit UPDATE rejected';
  END;

  BEGIN
    UPDATE audit_events SET actor_user_id = NULL WHERE id = audit_id;
    RAISE EXCEPTION 'Direct audit actor unlink unexpectedly succeeded';
  EXCEPTION WHEN SQLSTATE '55000' THEN
    RAISE NOTICE 'PASS: direct audit actor unlink rejected';
  END;

  BEGIN
    DELETE FROM audit_events WHERE id = audit_id;
    RAISE EXCEPTION 'Audit DELETE unexpectedly succeeded';
  EXCEPTION WHEN SQLSTATE '55000' THEN
    RAISE NOTICE 'PASS: audit DELETE rejected';
  END;

  BEGIN
    EXECUTE 'TRUNCATE TABLE audit_events';
    RAISE EXCEPTION 'Audit TRUNCATE unexpectedly succeeded';
  EXCEPTION WHEN SQLSTATE '55000' THEN
    RAISE NOTICE 'PASS: audit TRUNCATE rejected';
  END;

  -- Per DATABASE_SCHEMA.md, deleting an actor anonymizes only the FK; event and role snapshot survive.
  INSERT INTO users (id, public_id, mobile_e164, updated_at)
  VALUES (
    audit_actor_id,
    'test_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 27),
    audit_actor_mobile,
    now()
  );
  INSERT INTO audit_events (id, actor_user_id, actor_role_code, action, entity_type, entity_id, result, changed_fields)
  VALUES (gen_random_uuid(), audit_actor_id, 'APPLICANT', 'test.actor_delete', 'test', 'constraints', 'SUCCESS', ARRAY[]::TEXT[]);
  DELETE FROM users WHERE id = audit_actor_id;

  SELECT actor_user_id, actor_role_code
    INTO actual_actor_id, actual_role_code
    FROM audit_events
    WHERE action = 'test.actor_delete' AND entity_id = 'constraints';

  IF actual_actor_id IS NOT NULL OR actual_role_code IS DISTINCT FROM 'APPLICANT' THEN
    RAISE EXCEPTION 'FK anonymization did not preserve the expected audit snapshot';
  END IF;
  RAISE NOTICE 'PASS: FK SET NULL preserves audit event and role snapshot';
END;
$$;

ROLLBACK;
