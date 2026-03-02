BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS skills_taxonomy_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  workforce_share NUMERIC(6,3) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_job_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID NOT NULL REFERENCES skills_taxonomy_sectors(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title_id UUID NOT NULL REFERENCES skills_taxonomy_job_titles(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  aliases JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_consumer_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_name TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('sector', 'job-title', 'skill')),
  target_id UUID NOT NULL,
  reference_count INTEGER NOT NULL DEFAULT 1 CHECK (reference_count >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (consumer_name, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_change_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('sector', 'job-title', 'skill')),
  target_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'preview')),
  reason TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_user_extension (
  user_id TEXT PRIMARY KEY,
  skill_visibility_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  endorsement_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES skills_taxonomy_skills(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_skill_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES skills_taxonomy_skills(id) ON DELETE RESTRICT,
  value INTEGER NOT NULL DEFAULT 1 CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS skills_taxonomy_deletion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('service', 'account')),
  plugin_id TEXT NOT NULL DEFAULT 'skills-taxonomy',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ NULL,
  result TEXT NOT NULL CHECK (result IN ('requested', 'processing', 'completed', 'failed')),
  request_id TEXT NULL,
  trace_id TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_skills_taxonomy_job_titles_sector ON skills_taxonomy_job_titles(sector_id);
CREATE INDEX IF NOT EXISTS idx_skills_taxonomy_skills_job_title ON skills_taxonomy_skills(job_title_id);
CREATE INDEX IF NOT EXISTS idx_skills_taxonomy_consumer_bindings_target ON skills_taxonomy_consumer_bindings(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_skills_taxonomy_change_events_target ON skills_taxonomy_change_events(target_type, target_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_taxonomy_sectors_name_ci ON skills_taxonomy_sectors (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_taxonomy_job_titles_sector_name_ci ON skills_taxonomy_job_titles (sector_id, lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_taxonomy_skills_job_title_name_ci ON skills_taxonomy_skills (job_title_id, lower(name));

CREATE OR REPLACE VIEW skills_taxonomy_flattened_projection AS
SELECT
  sec.id AS sector_id,
  sec.name AS sector_name,
  jt.id AS job_title_id,
  jt.name AS job_title_name,
  sk.id AS skill_id,
  sk.name AS skill_name,
  sk.aliases AS skill_aliases,
  (sec.is_active AND jt.is_active AND sk.is_active) AS is_active
FROM skills_taxonomy_sectors sec
JOIN skills_taxonomy_job_titles jt ON jt.sector_id = sec.id
JOIN skills_taxonomy_skills sk ON sk.job_title_id = jt.id;

CREATE OR REPLACE VIEW skills_taxonomy_dependency_graph AS
SELECT
  target_type,
  target_id,
  SUM(reference_count)::integer AS total_references,
  MAX(updated_at) AS snapshot_at
FROM skills_taxonomy_consumer_bindings
GROUP BY target_type, target_id;

COMMIT;
