BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS mood_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  mood_value INTEGER NOT NULL CHECK (mood_value BETWEEN 1 AND 5),
  note TEXT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mood_admin_audit_trail (
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

CREATE INDEX IF NOT EXISTS idx_mood_submissions_user_submitted ON mood_submissions (user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_submissions_client_submitted ON mood_submissions (client_id, submitted_at DESC);

COMMIT;
