BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS chyme_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_key TEXT NOT NULL UNIQUE,
  room_name TEXT NOT NULL,
  call_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS chyme_rooms
  ADD COLUMN IF NOT EXISTS room_key TEXT,
  ADD COLUMN IF NOT EXISTS room_name TEXT,
  ADD COLUMN IF NOT EXISTS call_active BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS uq_chyme_rooms_room_key ON chyme_rooms(room_key);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chyme_rooms'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'ALTER TABLE chyme_rooms ALTER COLUMN name SET DEFAULT ''Chyme Main Room''';
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS chyme_service_profiles (
  user_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

ALTER TABLE IF EXISTS chyme_service_profiles
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;

CREATE TABLE IF NOT EXISTS chyme_room_members (
  room_id UUID NOT NULL REFERENCES chyme_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT NULL,
  role TEXT NOT NULL CHECK (role IN ('speaker', 'listener')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

ALTER TABLE IF EXISTS chyme_room_members
  ADD COLUMN IF NOT EXISTS username TEXT NULL,
  ADD COLUMN IF NOT EXISTS display_name TEXT NULL,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS role TEXT NULL,
  ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_chyme_room_members_room_id ON chyme_room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chyme_room_members_user_id ON chyme_room_members(user_id);

CREATE TABLE IF NOT EXISTS chyme_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chyme_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT NULL,
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1000),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS chyme_messages
  ADD COLUMN IF NOT EXISTS username TEXT NULL,
  ADD COLUMN IF NOT EXISTS display_name TEXT NULL,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS text TEXT NULL,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_chyme_messages_room_sent_at ON chyme_messages(room_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_chyme_messages_user_id ON chyme_messages(user_id);

CREATE TABLE IF NOT EXISTS chyme_deletion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('service', 'account')),
  service_name TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('requested', 'processing', 'completed', 'failed')),
  metadata JSONB NULL DEFAULT '{}'::jsonb
);

ALTER TABLE IF EXISTS chyme_deletion_events
  ADD COLUMN IF NOT EXISTS service_name TEXT NULL,
  ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS status TEXT NULL,
  ADD COLUMN IF NOT EXISTS metadata JSONB NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_chyme_deletion_events_user_scope ON chyme_deletion_events(user_id, scope, requested_at DESC);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chyme_rooms'
      AND column_name = 'room_key'
  ) AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chyme_rooms'
      AND column_name = 'room_name'
  ) THEN
    BEGIN
      INSERT INTO chyme_rooms (room_key, room_name, call_active)
      VALUES ('chyme-main-room', 'Chyme Main Room', FALSE)
      ON CONFLICT (room_key) DO UPDATE
      SET room_name = EXCLUDED.room_name,
          updated_at = NOW();
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;
END
$$;

COMMIT;
