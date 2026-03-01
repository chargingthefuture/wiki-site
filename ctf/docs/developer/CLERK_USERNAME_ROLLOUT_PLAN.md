# Clerk Username Rollout Plan

## Scope and assumptions

- Scope: production rollout of Clerk `username` as canonical handle baseline for `ctf` plugins and related username snapshots.
- Shared DB assumption: `ctf` and `platform` use the same PostgreSQL/Neon database.
- Legacy users: approximately 60 existing signups may not yet have Clerk `username` populated.
- Migration file: `ctf/migrations/2026-03-01-clerk-username-handle-baseline.sql`.

## Pre-deploy checks (SQL)

```sql
-- Confirm core table exists
SELECT to_regclass('public.users') AS users_table;

-- Confirm current username column state (if any)
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'username';

-- If users.username exists, check whitespace-only values
SELECT COUNT(*) AS whitespace_only_usernames
FROM public.users
WHERE username IS NOT NULL
  AND btrim(username) = '';

-- If users.username exists, check case-insensitive duplicates after trim
SELECT lower(btrim(username)) AS normalized_username, COUNT(*) AS row_count
FROM public.users
WHERE username IS NOT NULL
  AND btrim(username) <> ''
GROUP BY lower(btrim(username))
HAVING COUNT(*) > 1;

-- Check whether Chyme tables exist before expecting snapshot columns
SELECT to_regclass('public.chyme_room_members') AS chyme_room_members_table,
       to_regclass('public.chyme_messages') AS chyme_messages_table;
```

## Migration apply steps

1. Open Neon SQL editor (or production SQL execution path).
2. Paste and run `ctf/migrations/2026-03-01-clerk-username-handle-baseline.sql`.
3. Confirm execution completes without errors.
4. If duplicate usernames are detected by the unique index creation step, resolve duplicates first, then re-run migration.

## Legacy user backfill via Clerk Admin (manual)

1. Generate list of users missing usable handles in app DB:

```sql
SELECT id, email
FROM public.users
WHERE username IS NULL OR btrim(username) = ''
ORDER BY created_at ASC
LIMIT 200;
```

2. In Clerk Admin, set a unique `username` for each legacy user (expected set: ~60 users).
3. Ensure your existing Clerk-to-DB sync path (webhook or reconciliation job) updates `public.users.username` from Clerk `username`.
4. Re-run verification queries below until missing/invalid counts are zero (or accepted exceptions are documented).

## Post-deploy verification (SQL)

```sql
-- Column and constraint verification
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'username';

SELECT conname
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
  AND t.relname = 'users'
  AND conname = 'users_username_not_blank_chk';

-- Index verification
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_users_username_ci_unique',
    'idx_users_username_lookup',
    'idx_chyme_room_members_username_ci',
    'idx_chyme_messages_author_username_ci'
  )
ORDER BY indexname;

-- Data verification
SELECT COUNT(*) AS missing_or_blank_username
FROM public.users
WHERE username IS NULL OR btrim(username) = '';

SELECT lower(btrim(username)) AS normalized_username, COUNT(*) AS row_count
FROM public.users
WHERE username IS NOT NULL
  AND btrim(username) <> ''
GROUP BY lower(btrim(username))
HAVING COUNT(*) > 1;
```

## Failure and rollback notes

- This migration is additive; rollback requires explicit drops.
- If rollback is required, run only what applies in your environment:

```sql
DROP INDEX IF EXISTS public.idx_chyme_messages_author_username_ci;
DROP INDEX IF EXISTS public.idx_chyme_room_members_username_ci;
DROP INDEX IF EXISTS public.idx_users_username_lookup;
DROP INDEX IF EXISTS public.idx_users_username_ci_unique;

ALTER TABLE IF EXISTS public.users
  DROP CONSTRAINT IF EXISTS users_username_not_blank_chk;

ALTER TABLE IF EXISTS public.chyme_messages
  DROP COLUMN IF EXISTS author_username;

ALTER TABLE IF EXISTS public.chyme_room_members
  DROP COLUMN IF EXISTS username;

ALTER TABLE IF EXISTS public.users
  DROP COLUMN IF EXISTS username;
```
