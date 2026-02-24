BEGIN;

CREATE TABLE IF NOT EXISTS skills_hunt_rounds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 140),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  scoring_config JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(scoring_config) = 'object'),
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (starts_at < ends_at)
);

CREATE TABLE IF NOT EXISTS skills_hunt_submissions (
  id TEXT PRIMARY KEY,
  round_id TEXT NOT NULL REFERENCES skills_hunt_rounds(id) ON DELETE CASCADE,
  submitter_user_id TEXT NOT NULL,
  submitter_username TEXT NOT NULL CHECK (char_length(submitter_username) >= 2 AND char_length(submitter_username) <= 100),
  submitter_admin_preapproved BOOLEAN NOT NULL DEFAULT FALSE,
  display_name TEXT NOT NULL CHECK (
    char_length(display_name) >= 2
    AND char_length(display_name) <= 100
    AND display_name ~ '^[A-Za-z0-9 ]+$'
  ),
  bio TEXT NOT NULL CHECK (
    char_length(bio) <= 280
    AND bio !~* '<[^>]+>'
  ),
  quora_profile_url TEXT NOT NULL CHECK (
    quora_profile_url ~* '^https?://(www\.)?quora\.com/profile/[A-Za-z0-9_-]+/?$'
  ),
  normalized_quora_profile_url TEXT NOT NULL,
  skills JSONB NOT NULL CHECK (jsonb_typeof(skills) = 'array'),
  skills_signature TEXT NOT NULL CHECK (char_length(skills_signature) >= 1),
  claimed_professions JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(claimed_professions) = 'array'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'flagged', 'auto_rejected')),
  url_validation_result TEXT NOT NULL DEFAULT 'unchecked' CHECK (url_validation_result IN ('unchecked', 'valid', 'dead', 'invalid')),
  review_notes TEXT,
  edit_count INTEGER NOT NULL DEFAULT 0 CHECK (edit_count >= 0),
  reviewed_by_user_id TEXT,
  reviewed_at TIMESTAMPTZ,
  points_awarded INTEGER NOT NULL DEFAULT 0 CHECK (points_awarded >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_hunt_submission_round_url_signature
  ON skills_hunt_submissions (round_id, normalized_quora_profile_url, skills_signature);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_submissions_round_status_created
  ON skills_hunt_submissions (round_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_submissions_submitter_created
  ON skills_hunt_submissions (submitter_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS skills_hunt_leaderboard (
  round_id TEXT NOT NULL REFERENCES skills_hunt_rounds(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('individual', 'team')),
  entry_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  accepted_count INTEGER NOT NULL DEFAULT 0 CHECK (accepted_count >= 0),
  first_match_count INTEGER NOT NULL DEFAULT 0 CHECK (first_match_count >= 0),
  rare_skill_count INTEGER NOT NULL DEFAULT 0 CHECK (rare_skill_count >= 0),
  rank_position INTEGER NOT NULL DEFAULT 0 CHECK (rank_position >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (round_id, entry_type, entry_key)
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_leaderboard_round_mode_rank
  ON skills_hunt_leaderboard (round_id, entry_type, rank_position ASC);

CREATE TABLE IF NOT EXISTS skills_hunt_achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  round_id TEXT REFERENCES skills_hunt_rounds(id) ON DELETE SET NULL,
  code TEXT NOT NULL CHECK (char_length(code) >= 2 AND char_length(code) <= 80),
  title TEXT NOT NULL CHECK (char_length(title) >= 2 AND char_length(title) <= 140),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, round_id, code)
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_achievements_user_awarded
  ON skills_hunt_achievements (user_id, awarded_at DESC);

CREATE TABLE IF NOT EXISTS skills_hunt_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (char_length(notification_type) >= 2 AND char_length(notification_type) <= 64),
  title TEXT NOT NULL CHECK (char_length(title) >= 2 AND char_length(title) <= 140),
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(payload) = 'object'),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_notifications_user_feed
  ON skills_hunt_notifications (user_id, is_read, created_at DESC);

CREATE TABLE IF NOT EXISTS skills_hunt_feature_reward_card (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title TEXT NOT NULL CHECK (char_length(title) >= 2 AND char_length(title) <= 140),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  cta_label TEXT NOT NULL CHECK (char_length(cta_label) >= 1 AND char_length(cta_label) <= 80),
  cta_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills_hunt_audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (char_length(action) >= 2 AND char_length(action) <= 64),
  entity_type TEXT NOT NULL CHECK (char_length(entity_type) >= 2 AND char_length(entity_type) <= 64),
  entity_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_audit_actor_created
  ON skills_hunt_audit_log (actor_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_audit_entity_created
  ON skills_hunt_audit_log (entity_type, entity_id, created_at DESC);

CREATE TABLE IF NOT EXISTS skills_hunt_directory_profiles (
  id TEXT PRIMARY KEY,
  source_submission_id TEXT UNIQUE REFERENCES skills_hunt_submissions(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL CHECK (char_length(display_name) >= 2 AND char_length(display_name) <= 100),
  bio TEXT NOT NULL CHECK (char_length(bio) <= 280),
  quora_profile_url TEXT NOT NULL,
  normalized_quora_profile_url TEXT NOT NULL UNIQUE,
  skills JSONB NOT NULL CHECK (jsonb_typeof(skills) = 'array'),
  claimed_professions JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(claimed_professions) = 'array'),
  profile_status TEXT NOT NULL DEFAULT 'unclaimed' CHECK (profile_status IN ('unclaimed', 'claimed')),
  profile_label TEXT NOT NULL DEFAULT 'community-generated',
  invited_by_username TEXT NOT NULL CHECK (char_length(invited_by_username) >= 2 AND char_length(invited_by_username) <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_directory_profiles_status_created
  ON skills_hunt_directory_profiles (profile_status, created_at DESC);

CREATE TABLE IF NOT EXISTS skills_hunt_rare_skills_lookup (
  skill_name TEXT PRIMARY KEY,
  normalized_skill_name TEXT NOT NULL UNIQUE,
  bonus_points INTEGER NOT NULL DEFAULT 10 CHECK (bonus_points >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_rare_skills_active
  ON skills_hunt_rare_skills_lookup (is_active, normalized_skill_name);

COMMIT;
