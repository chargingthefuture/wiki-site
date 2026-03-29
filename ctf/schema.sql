-- Combined schema.sql for CTF (rewrite, no /platform)
-- This file is a snapshot of the current schema for Neon, based only on ctf/migrations/*.sql

-- === chyme-core-phase0 ===
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
CREATE UNIQUE INDEX IF NOT EXISTS uq_chyme_rooms_room_key ON chyme_rooms(room_key);
CREATE TABLE IF NOT EXISTS chyme_service_profiles (
  user_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
CREATE TABLE IF NOT EXISTS chyme_room_members (
  room_id TEXT NOT NULL REFERENCES chyme_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT NULL,
  role TEXT NOT NULL CHECK (role IN ('speaker', 'listener')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_chyme_room_members_room_id ON chyme_room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chyme_room_members_user_id ON chyme_room_members(user_id);
CREATE TABLE IF NOT EXISTS chyme_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL REFERENCES chyme_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT NULL,
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1000),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
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
CREATE INDEX IF NOT EXISTS idx_chyme_deletion_events_user_scope ON chyme_deletion_events(user_id, scope, requested_at DESC);
COMMIT;

-- === clerk-username-handle-baseline ===
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS username VARCHAR(64);
ALTER TABLE IF EXISTS public.chyme_room_members ADD COLUMN IF NOT EXISTS username VARCHAR(64);
ALTER TABLE IF EXISTS public.chyme_messages ADD COLUMN IF NOT EXISTS author_username VARCHAR(64);

-- === skills-hunt-core-phase1 ===
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS skills_hunt_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  scoring_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at > starts_at)
);
CREATE TABLE IF NOT EXISTS skills_hunt_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES skills_hunt_rounds(id) ON DELETE CASCADE,
  submitter_user_id TEXT NOT NULL,
  submitter_username TEXT NULL,
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL,
  quora_profile_url TEXT NOT NULL,
  quora_profile_url_normalized TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  claimed_professions JSONB NOT NULL DEFAULT '[]'::jsonb,
  signature_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'flagged')),
  review_action TEXT NULL CHECK (review_action IN ('accept', 'reject', 'edit', 'flag')),
  reviewed_by_user_id TEXT NULL,
  review_notes TEXT NULL,
  score_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  reviewed_at TIMESTAMPTZ NULL,
  directory_profile_generated_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (round_id, signature_hash)
);
CREATE TABLE IF NOT EXISTS skills_hunt_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES skills_hunt_rounds(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('individual', 'team')),
  rank INTEGER NOT NULL,
  score INTEGER NOT NULL,
  accepted_count INTEGER NOT NULL DEFAULT 0,
  rare_skill_bonus INTEGER NOT NULL DEFAULT 0,
  user_id TEXT NULL,
  username_snapshot TEXT NULL,
  team_key TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (round_id, mode, rank)
);
CREATE TABLE IF NOT EXISTS skills_hunt_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, code)
);
CREATE TABLE IF NOT EXISTS skills_hunt_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS skills_hunt_feature_reward_card (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS skills_hunt_rare_skills_lookup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES skills_hunt_rounds(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  bonus_points INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (round_id, skill_name)
);
CREATE TABLE IF NOT EXISTS skills_hunt_directory_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES skills_hunt_submissions(id) ON DELETE CASCADE,
  directory_profile_id TEXT NOT NULL,
  invited_by_username TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id),
  UNIQUE (directory_profile_id)
);
CREATE TABLE IF NOT EXISTS skills_hunt_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  command TEXT NOT NULL,
  policy_status TEXT NOT NULL CHECK (policy_status IN ('allow', 'deny')),
  reason TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_rounds_status_window ON skills_hunt_rounds (status, starts_at DESC, ends_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_submissions_round_status_created ON skills_hunt_submissions (round_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_submissions_submitter_created ON skills_hunt_submissions (submitter_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_leaderboard_lookup ON skills_hunt_leaderboard (round_id, mode, rank ASC, score DESC);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_notifications_user_unread ON skills_hunt_notifications (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_audit_log_lookup ON skills_hunt_audit_log (created_at DESC, actor_id, command);
COMMIT;

-- === skills-hunt-service-credits ===
CREATE TABLE IF NOT EXISTS skills_hunt_service_credits_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id VARCHAR NOT NULL REFERENCES users(id),
    to_user_id VARCHAR NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL CHECK (amount > 0),
    reason TEXT,
    submission_id UUID REFERENCES skills_hunt_submissions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_service_credits_from_user ON skills_hunt_service_credits_transactions (from_user_id);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_service_credits_to_user ON skills_hunt_service_credits_transactions (to_user_id);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_service_credits_submission_id ON skills_hunt_service_credits_transactions (submission_id);
