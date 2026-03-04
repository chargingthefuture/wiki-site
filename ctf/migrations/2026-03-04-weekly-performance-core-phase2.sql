BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS weekly_performance_weeks (
  week_start_date DATE PRIMARY KEY,
  week_end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'locked', 'published')) DEFAULT 'open',
  selected_by_user_id TEXT NULL,
  selected_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weekly_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL REFERENCES weekly_performance_weeks(week_start_date) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  metric_value NUMERIC(14, 2) NOT NULL,
  metric_unit TEXT NOT NULL,
  source_plugin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_start_date, metric_key)
);

CREATE TABLE IF NOT EXISTS weekly_performance_audit_trail (
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

INSERT INTO weekly_performance_weeks (week_start_date, week_end_date, status)
VALUES (DATE_TRUNC('week', NOW())::date, (DATE_TRUNC('week', NOW())::date + INTERVAL '6 days')::date, 'open')
ON CONFLICT (week_start_date) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_weekly_perf_metrics_week ON weekly_performance_metrics (week_start_date, metric_key);

COMMIT;
