BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS peer_programming_weekly_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  guidance TEXT NOT NULL,
  revision_note TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_by_user_id TEXT NULL,
  published_at TIMESTAMPTZ NULL,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peer_programming_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  cohort_label TEXT NOT NULL,
  topic_id UUID NULL REFERENCES peer_programming_weekly_topics(id) ON DELETE SET NULL,
  fallback_open BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_start_date, cohort_label)
);

CREATE TABLE IF NOT EXISTS peer_programming_cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES peer_programming_cohorts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cohort_id, user_id)
);

CREATE TABLE IF NOT EXISTS peer_programming_assignment_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES peer_programming_cohorts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivered_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS peer_programming_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES peer_programming_cohorts(id) ON DELETE CASCADE,
  author_user_id TEXT NOT NULL,
  parent_message_id UUID NULL REFERENCES peer_programming_messages(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('cohort_member', 'authenticated_audience', 'public_audience')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peer_programming_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NULL REFERENCES peer_programming_cohorts(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  suggestion_category TEXT NOT NULL,
  release_surface TEXT NOT NULL CHECK (release_surface IN ('web', 'android')),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peer_programming_admin_audit_trail (
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

CREATE INDEX IF NOT EXISTS idx_pp_cohorts_week ON peer_programming_cohorts (week_start_date, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pp_members_user ON peer_programming_cohort_members (user_id, assigned_at DESC);
CREATE INDEX IF NOT EXISTS idx_pp_notifications_user_created ON peer_programming_assignment_notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pp_messages_cohort_created ON peer_programming_messages (cohort_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_pp_feedback_created ON peer_programming_feedback (created_at DESC);

COMMIT;
