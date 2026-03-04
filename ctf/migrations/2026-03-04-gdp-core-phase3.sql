BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS gdp_reporting_weeks (
  week_start_date DATE PRIMARY KEY,
  week_end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gdp_metric_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL REFERENCES gdp_reporting_weeks(week_start_date) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  metric_value NUMERIC(16, 2) NOT NULL,
  dp_suppressed BOOLEAN NOT NULL DEFAULT FALSE,
  lawful_basis TEXT NOT NULL,
  source_plugin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_start_date, metric_key)
);

CREATE TABLE IF NOT EXISTS gdp_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL REFERENCES gdp_reporting_weeks(week_start_date) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_by_user_id TEXT NULL,
  published_at TIMESTAMPTZ NULL,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gdp_admin_audit_trail (
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

INSERT INTO gdp_reporting_weeks (week_start_date, week_end_date)
VALUES (DATE_TRUNC('week', NOW())::date, (DATE_TRUNC('week', NOW())::date + INTERVAL '6 days')::date)
ON CONFLICT (week_start_date) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_gdp_metrics_week ON gdp_metric_snapshots (week_start_date, metric_key);
CREATE INDEX IF NOT EXISTS idx_gdp_publications_week ON gdp_publications (week_start_date, status, updated_at DESC);

COMMIT;
