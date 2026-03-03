BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS workforce_user_extension (
  user_id TEXT PRIMARY KEY,
  availability_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  work_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_occupations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sector TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_profiles (
  user_id TEXT PRIMARY KEY,
  occupation_id UUID NULL REFERENCES workforce_occupations(id) ON DELETE SET NULL,
  skill_level TEXT NOT NULL DEFAULT 'unknown',
  region TEXT NULL,
  recruited_state BOOLEAN NOT NULL DEFAULT FALSE,
  recruited_resolved_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NULL,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_config (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  exports_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  report_week_timezone TEXT NOT NULL DEFAULT 'America/New_York',
  report_week_start_dow SMALLINT NOT NULL DEFAULT 6,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_report_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('summary', 'skill_level', 'sector')),
  snapshot_key TEXT NOT NULL DEFAULT 'global',
  workforce_total INTEGER NOT NULL DEFAULT 0,
  recruited_total INTEGER NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  week_start_date DATE NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_recruited_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  directory_profile_id TEXT NOT NULL,
  source_event TEXT NOT NULL CHECK (
    source_event IN (
      'directory_profile_upsert',
      'directory_profile_assign',
      'workforce_admin_recompute',
      'workforce_profile_service_delete'
    )
  ),
  inference_dedupe_key TEXT NOT NULL UNIQUE,
  resolved_recruited BOOLEAN NOT NULL,
  resolved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'deferred')),
  export_type TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workforce_admin_audit_trail (
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

CREATE INDEX IF NOT EXISTS idx_workforce_profiles_recruited_state
  ON workforce_profiles (recruited_state, recruited_resolved_at DESC);

CREATE INDEX IF NOT EXISTS idx_workforce_profiles_occupation
  ON workforce_profiles (occupation_id, skill_level);

CREATE INDEX IF NOT EXISTS idx_workforce_occupations_active
  ON workforce_occupations (is_active, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_workforce_announcements_active
  ON workforce_announcements (is_active, published_at DESC, expires_at);

CREATE INDEX IF NOT EXISTS idx_workforce_recruited_events_user_created
  ON workforce_recruited_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_workforce_report_snapshots_lookup
  ON workforce_report_snapshots (snapshot_type, snapshot_key, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_workforce_admin_audit_trail_lookup
  ON workforce_admin_audit_trail (created_at DESC, actor_id);

INSERT INTO workforce_config (
  singleton_key,
  exports_enabled,
  kill_switch_enabled,
  report_week_timezone,
  report_week_start_dow,
  updated_by_user_id
)
VALUES (TRUE, FALSE, FALSE, 'America/New_York', 6, 'system-seed')
ON CONFLICT (singleton_key)
DO NOTHING;

COMMIT;
