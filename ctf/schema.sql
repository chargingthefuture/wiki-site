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

-- === peer-programming placeholder ===
CREATE TABLE IF NOT EXISTS peer_programming_weekly_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  title TEXT NOT NULL,
  guidance TEXT NOT NULL,
  revision_note TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_by_user_id TEXT NOT NULL,
  published_by_user_id TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns with guarded DDL for legacy DBs
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS week_start_date DATE NOT NULL;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS title TEXT NOT NULL;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS guidance TEXT NOT NULL;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS revision_note TEXT;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS status TEXT NOT NULL CHECK (status IN ('draft', 'published'));
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS created_by_user_id TEXT NOT NULL;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS published_by_user_id TEXT;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE IF EXISTS peer_programming_weekly_topics ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

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
CREATE INDEX IF NOT EXISTS idx_skills_hunt_notifications_user_unread ON skills_hunt_notifications (user_id, read_at, created_at DESC);
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

-- === feed tables ===
CREATE TABLE IF NOT EXISTS feed_render_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  render_mode TEXT NOT NULL,
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  max_timeline_page_size INTEGER NOT NULL DEFAULT 100,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL,
  source_announcement_id UUID,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS feed_item_targets (
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  target_role TEXT,
  target_plugin TEXT,
  target_region TEXT,
  PRIMARY KEY (item_id, target_role, target_plugin, target_region)
);
CREATE TABLE IF NOT EXISTS feed_user_read_state (
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);
CREATE TABLE IF NOT EXISTS feed_user_dismissals (
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);

-- === GDP Publications ===
CREATE TABLE IF NOT EXISTS gdp_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  created_by_user_id TEXT NOT NULL,
  published_by_user_id TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  ,host_user_id TEXT
);

-- Add columns with guarded DDL for legacy DBs
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS week_start_date DATE NOT NULL;
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS title TEXT NOT NULL;
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL;
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS status TEXT NOT NULL CHECK (status IN ('draft', 'published'));
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS created_by_user_id TEXT NOT NULL;
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS published_by_user_id TEXT;
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE IF EXISTS gdp_publications ADD COLUMN IF NOT EXISTS host_user_id TEXT;
CREATE TABLE IF NOT EXISTS feed_membership_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  request_id TEXT,
  trace_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS announcement_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  priority INTEGER NOT NULL,
  mandatory BOOLEAN NOT NULL,
  schedule_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  targeting JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS announcement_delivery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS announcement_user_state (
  user_id TEXT NOT NULL,
  announcement_id UUID NOT NULL,
  read_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, announcement_id)
);
CREATE TABLE IF NOT EXISTS announcement_membership_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  request_id TEXT,
  trace_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === unlock tables ===
CREATE TABLE IF NOT EXISTS unlock_verification_submissions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  quora_profile_url TEXT NOT NULL,
  quora_profile_url_normalized TEXT NOT NULL,
  review_status TEXT NOT NULL CHECK (review_status IN ('pending', 'approved', 'rejected', 'spam')),
  access_tier TEXT NOT NULL CHECK (access_tier IN ('pending_readonly', 'approved_full', 'locked_support_only')),
  unlock_window_expires_at TIMESTAMPTZ NOT NULL,
  reminder_stage INTEGER NOT NULL DEFAULT 0,
  reviewed_by_user_id TEXT,
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  incentive_granted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns with guarded DDL for legacy DBs
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS id SERIAL;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL UNIQUE;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS quora_profile_url TEXT NOT NULL;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS quora_profile_url_normalized TEXT NOT NULL;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL CHECK (review_status IN ('pending', 'approved', 'rejected', 'spam'));
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS access_tier TEXT NOT NULL CHECK (access_tier IN ('pending_readonly', 'approved_full', 'locked_support_only'));
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS unlock_window_expires_at TIMESTAMPTZ NOT NULL;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS reminder_stage INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS reviewed_by_user_id TEXT;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS review_note TEXT;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS incentive_granted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE IF EXISTS unlock_verification_submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE TABLE IF NOT EXISTS unlock_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unlock_runtime_config (
  singleton_id INTEGER PRIMARY KEY DEFAULT 1,
  submission_window_hours INTEGER NOT NULL DEFAULT 168,
  reminder_schedule_hours INTEGER[] NOT NULL DEFAULT ARRAY[0,24,72,168],
  incentive_amount TEXT NOT NULL DEFAULT '100',
  support_only_after_expiry BOOLEAN NOT NULL DEFAULT TRUE
);
ALTER TABLE IF EXISTS unlock_runtime_config ADD COLUMN IF NOT EXISTS singleton_id INTEGER PRIMARY KEY DEFAULT 1;
ALTER TABLE IF EXISTS unlock_runtime_config ADD COLUMN IF NOT EXISTS submission_window_hours INTEGER NOT NULL DEFAULT 168;
ALTER TABLE IF EXISTS unlock_runtime_config ADD COLUMN IF NOT EXISTS reminder_schedule_hours INTEGER[] NOT NULL DEFAULT ARRAY[0,24,72,168];
ALTER TABLE IF EXISTS unlock_runtime_config ADD COLUMN IF NOT EXISTS incentive_amount TEXT NOT NULL DEFAULT '100';
ALTER TABLE IF EXISTS unlock_runtime_config ADD COLUMN IF NOT EXISTS support_only_after_expiry BOOLEAN NOT NULL DEFAULT TRUE;

-- === levelup_enrollments table (guarded DDL, schema drift prevention) ===
CREATE TABLE IF NOT EXISTS levelup_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'dropped', 'pending')),
  credits_deposited INTEGER NOT NULL DEFAULT 0,
  assigned_trainer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cohort_id, user_id)
);
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS cohort_id UUID NOT NULL;
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL;
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'dropped', 'pending'));
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS credits_deposited INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS assigned_trainer_id TEXT;
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE IF EXISTS levelup_enrollments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
-- Add unique constraint if not exists (Postgres 15+)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'levelup_enrollments' AND indexname = 'levelup_enrollments_cohort_id_user_id_key'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS levelup_enrollments_cohort_id_user_id_key ON levelup_enrollments(cohort_id, user_id)';
  END IF;
END $$;
-- === trusttransport tables ===
CREATE TABLE IF NOT EXISTS trusttransport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  pickup_city TEXT,
  dropoff_city TEXT,
  pickup_geo_redacted TEXT,
  dropoff_geo_redacted TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES trusttransport_requests(id) ON DELETE CASCADE,
  trip_id UUID,
  actor_user_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES trusttransport_requests(id) ON DELETE CASCADE,
  provider_user_id TEXT NOT NULL,
  note TEXT,
  proposed_amount INTEGER,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES trusttransport_requests(id) ON DELETE CASCADE,
  offer_id UUID,
  requester_user_id TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL,
  stream_channel_id TEXT,
  cancelled_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_risk_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  trip_id UUID,
  actor_user_id TEXT NOT NULL,
  target_user_id TEXT,
  signal_type TEXT NOT NULL,
  severity TEXT,
  notes TEXT,
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by_user_id TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID,
  request_id UUID,
  opened_by_user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trusttransport_trips(id) ON DELETE CASCADE,
  requester_user_id TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_market_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_user_extension (
  user_id TEXT PRIMARY KEY,
  availability_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  work_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  service_deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_proof_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trusttransport_trips(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL,
  artifact_redacted TEXT,
  captured_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_earnings_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_user_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS trusttransport_admin_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  command TEXT NOT NULL,
  policy_status TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === workforce tables ===
CREATE TABLE IF NOT EXISTS workforce_profiles (
  user_id TEXT PRIMARY KEY,
  occupation_id UUID NOT NULL,
  skill_level TEXT NOT NULL,
  region TEXT NOT NULL,
  recruited_state BOOLEAN NOT NULL DEFAULT FALSE,
  recruited_resolved_at TIMESTAMPTZ,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workforce_occupations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workforce_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workforce_user_extension (
  user_id TEXT PRIMARY KEY,
  availability_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  work_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  service_deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workforce_recruited_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workforce_config (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  exports_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  report_week_timezone TEXT NOT NULL,
  report_week_start_dow INTEGER NOT NULL DEFAULT 0,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workforce_recruited_sync_cursor (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  last_cursor_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === service credits tables ===
CREATE TABLE IF NOT EXISTS service_credits_wallets (
  user_id TEXT PRIMARY KEY,
  available_balance NUMERIC NOT NULL DEFAULT 0,
  escrow_balance NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id TEXT NOT NULL,
  recipient_user_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_command_idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command TEXT NOT NULL,
  response_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_adapter_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_escrow_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_user_id TEXT NOT NULL,
  transfer_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  accounting_scope TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_governance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_treasury_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_wallet_tombstones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  final_available_balance NUMERIC NOT NULL,
  final_escrow_balance NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_account_deletion_reclaims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  amount_transferred NUMERIC NOT NULL,
  transfer_id UUID,
  tombstone_id UUID,
  provider_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_dispute_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL,
  adjustment_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_admin_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  command TEXT NOT NULL,
  policy_status TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_treasury_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS service_credits_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID NOT NULL,
  opened_by_user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
