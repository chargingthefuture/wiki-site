BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS directory_user_extension (
  user_id TEXT PRIMARY KEY,
  profile_visibility TEXT NOT NULL DEFAULT 'workspace' CHECK (profile_visibility IN ('private', 'workspace', 'public')),
  contact_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS directory_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claimed_by_user_id TEXT NULL,
  display_name TEXT NOT NULL,
  headline TEXT NULL,
  bio TEXT NULL,
  profile_url TEXT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  sector_id UUID NULL,
  job_title_id UUID NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS directory_profiles
  ADD COLUMN IF NOT EXISTS claimed_by_user_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS display_name TEXT NULL,
  ADD COLUMN IF NOT EXISTS headline TEXT NULL,
  ADD COLUMN IF NOT EXISTS bio TEXT NULL,
  ADD COLUMN IF NOT EXISTS profile_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sector_id UUID NULL,
  ADD COLUMN IF NOT EXISTS job_title_id UUID NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS directory_profile_skills (
  profile_id TEXT NOT NULL,
  skill_id UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_id, skill_id)
);

ALTER TABLE IF EXISTS directory_profile_skills
  ADD COLUMN IF NOT EXISTS profile_id TEXT,
  ADD COLUMN IF NOT EXISTS skill_id UUID,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS directory_profile_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL,
  tag_kind TEXT NOT NULL,
  tag_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS directory_profile_tags
  ADD COLUMN IF NOT EXISTS profile_id TEXT,
  ADD COLUMN IF NOT EXISTS tag_kind TEXT,
  ADD COLUMN IF NOT EXISTS tag_value TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS directory_announcements (
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

ALTER TABLE IF EXISTS directory_announcements
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS created_by_user_id TEXT,
  ADD COLUMN IF NOT EXISTS updated_by_user_id TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS directory_profile_change_events (
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

CREATE TABLE IF NOT EXISTS directory_deletion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('service', 'account')),
  plugin_id TEXT NOT NULL DEFAULT 'directory',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ NULL,
  result TEXT NOT NULL CHECK (result IN ('requested', 'processing', 'completed', 'failed')),
  request_id TEXT NULL,
  trace_id TEXT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_directory_profiles_claimed_user
  ON directory_profiles (claimed_by_user_id)
  WHERE claimed_by_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_directory_profiles_visibility
  ON directory_profiles (is_active, is_public, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_directory_profiles_selectors
  ON directory_profiles (sector_id, job_title_id, is_active, is_public);

CREATE INDEX IF NOT EXISTS idx_directory_profile_skills_skill
  ON directory_profile_skills (skill_id, display_order, profile_id);

CREATE INDEX IF NOT EXISTS idx_directory_profile_tags_lookup
  ON directory_profile_tags (tag_kind, lower(tag_value));

CREATE UNIQUE INDEX IF NOT EXISTS uq_directory_profile_tags_profile_kind_value_ci
  ON directory_profile_tags (profile_id, tag_kind, lower(tag_value));

CREATE INDEX IF NOT EXISTS idx_directory_announcements_active_window
  ON directory_announcements (is_active, published_at DESC, expires_at);

CREATE INDEX IF NOT EXISTS idx_directory_change_events_target
  ON directory_profile_change_events (target_type, target_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_directory_deletion_events_user_scope
  ON directory_deletion_events (user_id, scope, requested_at DESC);

DO $$
BEGIN
  IF to_regclass('public.skills_taxonomy_sectors') IS NOT NULL
     AND to_regclass('public.skills_taxonomy_job_titles') IS NOT NULL
     AND to_regclass('public.skills_taxonomy_skills') IS NOT NULL THEN
    EXECUTE $v$
      CREATE OR REPLACE VIEW directory_public_projection AS
      SELECT
        p.id,
        p.display_name,
        p.headline,
        p.bio,
        p.profile_url,
        p.sector_id,
        s.name AS sector_name,
        p.job_title_id,
        jt.name AS job_title_name,
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', sk.id,
                'name', sk.name,
                'displayOrder', dps.display_order
              )
              ORDER BY dps.display_order ASC, sk.name ASC
            )
            FROM directory_profile_skills dps
            JOIN skills_taxonomy_skills sk ON sk.id = dps.skill_id
            WHERE dps.profile_id = p.id
          ),
          '[]'::jsonb
        ) AS skills,
        p.updated_at
      FROM directory_profiles p
      LEFT JOIN skills_taxonomy_sectors s ON s.id = p.sector_id
      LEFT JOIN skills_taxonomy_job_titles jt ON jt.id = p.job_title_id
      WHERE p.is_active = TRUE AND p.is_public = TRUE
    $v$;
  ELSE
    EXECUTE $v$
      CREATE OR REPLACE VIEW directory_public_projection AS
      SELECT
        p.id,
        p.display_name,
        p.headline,
        p.bio,
        p.profile_url,
        p.sector_id,
        NULL::text AS sector_name,
        p.job_title_id,
        NULL::text AS job_title_name,
        '[]'::jsonb AS skills,
        p.updated_at
      FROM directory_profiles p
      WHERE p.is_active = TRUE AND p.is_public = TRUE
    $v$;
  END IF;
END $$;

COMMIT;
