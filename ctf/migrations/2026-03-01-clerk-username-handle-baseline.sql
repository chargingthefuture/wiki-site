-- Migration: Clerk username handle baseline propagation
-- Date: 2026-03-01
-- Scope: Shared DB used by platform + ctf (additive, idempotent)
-- Notes:
--   - Safe to re-run.
--   - Uses guarded DDL for existing columns/indexes/constraints.

-- 1) Canonical username handle column on users
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS username VARCHAR(64);

-- 2) Guardrail: disallow whitespace-only usernames when present
DO $$
BEGIN
  IF to_regclass('public.users') IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'users'
         AND column_name = 'username'
     )
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint c
       JOIN pg_class t ON t.oid = c.conrelid
       JOIN pg_namespace n ON n.oid = t.relnamespace
       WHERE n.nspname = 'public'
         AND t.relname = 'users'
         AND c.conname = 'users_username_not_blank_chk'
     )
  THEN
    EXECUTE $sql$
      ALTER TABLE public.users
      ADD CONSTRAINT users_username_not_blank_chk
      CHECK (username IS NULL OR btrim(username) <> '')
    $sql$;
  END IF;
END
$$;

-- 3) Case-insensitive uniqueness for non-null, non-blank usernames
DO $$
BEGIN
  IF to_regclass('public.users') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_class i
       JOIN pg_namespace n ON n.oid = i.relnamespace
       WHERE n.nspname = 'public'
         AND i.relname = 'idx_users_username_ci_unique'
     )
  THEN
    EXECUTE $sql$
      CREATE UNIQUE INDEX idx_users_username_ci_unique
      ON public.users (lower(username))
      WHERE username IS NOT NULL AND btrim(username) <> ''
    $sql$;
  END IF;
END
$$;

-- 4) Fast direct username lookup index
DO $$
BEGIN
  IF to_regclass('public.users') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_class i
       JOIN pg_namespace n ON n.oid = i.relnamespace
       WHERE n.nspname = 'public'
         AND i.relname = 'idx_users_username_lookup'
     )
  THEN
    EXECUTE $sql$
      CREATE INDEX idx_users_username_lookup
      ON public.users (username)
      WHERE username IS NOT NULL AND btrim(username) <> ''
    $sql$;
  END IF;
END
$$;

-- 5) Chyme username snapshots (only when tables are present)
ALTER TABLE IF EXISTS public.chyme_room_members
  ADD COLUMN IF NOT EXISTS username VARCHAR(64);

ALTER TABLE IF EXISTS public.chyme_messages
  ADD COLUMN IF NOT EXISTS author_username VARCHAR(64);

-- 6) Snapshot lookup indexes where appropriate
DO $$
BEGIN
  IF to_regclass('public.chyme_room_members') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_class i
       JOIN pg_namespace n ON n.oid = i.relnamespace
       WHERE n.nspname = 'public'
         AND i.relname = 'idx_chyme_room_members_username_ci'
     )
  THEN
    EXECUTE $sql$
      CREATE INDEX idx_chyme_room_members_username_ci
      ON public.chyme_room_members (lower(username))
      WHERE username IS NOT NULL AND btrim(username) <> ''
    $sql$;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('public.chyme_messages') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_class i
       JOIN pg_namespace n ON n.oid = i.relnamespace
       WHERE n.nspname = 'public'
         AND i.relname = 'idx_chyme_messages_author_username_ci'
     )
  THEN
    EXECUTE $sql$
      CREATE INDEX idx_chyme_messages_author_username_ci
      ON public.chyme_messages (lower(author_username))
      WHERE author_username IS NOT NULL AND btrim(author_username) <> ''
    $sql$;
  END IF;
END
$$;
