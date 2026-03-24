BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS levelup_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  track TEXT NOT NULL,
  seats INTEGER NOT NULL CHECK (seats > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  required_credits NUMERIC(14, 2) NOT NULL DEFAULT 0,
  materials_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  device_support BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  allow_no_deposit BOOLEAN NOT NULL DEFAULT FALSE,
  trainer_split_percent NUMERIC(5, 2) NOT NULL DEFAULT 25 CHECK (trainer_split_percent >= 0 AND trainer_split_percent <= 100),
  completion_bonus_credits NUMERIC(14, 2) NOT NULL DEFAULT 0,
  stipend_mode TEXT NOT NULL DEFAULT 'none' CHECK (stipend_mode IN ('none', 'scheduled', 'milestone')),
  stipend_amount_per_payout NUMERIC(14, 2) NOT NULL DEFAULT 0,
  stipend_interval_days INTEGER NULL,
  microgrant_mode TEXT NOT NULL DEFAULT 'none' CHECK (microgrant_mode IN ('none', 'cohort_pool', 'separate_grant')),
  microgrant_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  refund_policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  payout_policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS levelup_curriculum_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES levelup_cohorts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sequence_no INTEGER NOT NULL CHECK (sequence_no > 0),
  required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cohort_id, sequence_no)
);

CREATE TABLE IF NOT EXISTS levelup_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES levelup_cohorts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  percent_release NUMERIC(5, 2) NOT NULL CHECK (percent_release > 0 AND percent_release <= 100),
  required_task TEXT NOT NULL,
  sequence_no INTEGER NOT NULL CHECK (sequence_no > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cohort_id, sequence_no)
);

CREATE TABLE IF NOT EXISTS levelup_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES levelup_cohorts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('enrolled', 'active', 'completed', 'dropped')) DEFAULT 'enrolled',
  credits_deposited NUMERIC(14, 2) NOT NULL DEFAULT 0,
  progress_percent NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  assigned_trainer_id TEXT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cohort_id, user_id)
);

CREATE TABLE IF NOT EXISTS levelup_enrollment_milestone_escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES levelup_enrollments(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES levelup_milestones(id) ON DELETE CASCADE,
  escrow_id UUID NOT NULL,
  held_amount NUMERIC(14, 2) NOT NULL CHECK (held_amount > 0),
  release_status TEXT NOT NULL CHECK (release_status IN ('held', 'released', 'reverted')) DEFAULT 'held',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (enrollment_id, milestone_id),
  UNIQUE (escrow_id)
);

CREATE TABLE IF NOT EXISTS levelup_milestone_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES levelup_enrollments(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES levelup_milestones(id) ON DELETE CASCADE,
  validated_by_user_id TEXT NOT NULL,
  validation_note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('validated', 'released', 'disputed')) DEFAULT 'validated',
  validated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  released_at TIMESTAMPTZ NULL,
  release_transfer_id UUID NULL,
  trainer_payout_governance_id UUID NULL,
  UNIQUE (enrollment_id, milestone_id)
);

CREATE TABLE IF NOT EXISTS levelup_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES levelup_enrollments(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES levelup_cohorts(id) ON DELETE CASCADE,
  disbursement_type TEXT NOT NULL CHECK (disbursement_type IN ('stipend', 'materials_microgrant', 'device_microgrant', 'completion_bonus', 'trainer_payout')),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  source_type TEXT NOT NULL CHECK (source_type IN ('cohort_pool', 'separate_grant', 'treasury_grant')),
  recipient_user_id TEXT NOT NULL,
  reference_id TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'completed',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS levelup_stipend_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES levelup_enrollments(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES levelup_cohorts(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'paid', 'cancelled')) DEFAULT 'scheduled',
  reference_disbursement_id UUID NULL REFERENCES levelup_disbursements(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS levelup_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES levelup_enrollments(id) ON DELETE CASCADE,
  milestone_id UUID NULL REFERENCES levelup_milestones(id) ON DELETE SET NULL,
  opened_by_user_id TEXT NOT NULL,
  assigned_to_user_id TEXT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')) DEFAULT 'open',
  resolution_comment TEXT NULL,
  resolved_by_user_id TEXT NULL,
  resolved_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS levelup_dispute_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES levelup_disputes(id) ON DELETE CASCADE,
  actor_user_id TEXT NOT NULL,
  body TEXT NOT NULL,
  attachment_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS levelup_rate_limit_counters (
  user_id TEXT NOT NULL,
  command_name TEXT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  window_seconds INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, command_name, window_started_at, window_seconds)
);

CREATE TABLE IF NOT EXISTS levelup_command_idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  command_name TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  response_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (actor_id, command_name, idempotency_key)
);

CREATE TABLE IF NOT EXISTS levelup_audit_events (
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

CREATE TABLE IF NOT EXISTS levelup_policy_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  starter_credits NUMERIC(14, 2) NOT NULL DEFAULT 500,
  default_trainer_split_percent NUMERIC(5, 2) NOT NULL DEFAULT 25,
  config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO levelup_policy_config (id, starter_credits, default_trainer_split_percent, config_json, updated_by_user_id)
VALUES (1, 500, 25, '{"regionalBands": {}, "tierOverrides": {"pilot": 500, "priority": [1000, 2500], "micro": [100, 300]}}'::jsonb, 'system')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ctf_plugin_registry (
  plugin_slug,
  display_name,
  phase,
  start_gate,
  summary,
  availability_state,
  nav_rank,
  is_visible
)
VALUES (
  'levelup',
  'LevelUp',
  'phase-3',
  'Phase 3',
  'Flexible training cohorts with escrowed enrollment, milestone-based release, trainer payouts, stipends, and disputes.',
  'implemented_shell',
  170,
  TRUE
)
ON CONFLICT (plugin_slug) DO UPDATE
SET
  display_name = EXCLUDED.display_name,
  phase = EXCLUDED.phase,
  start_gate = EXCLUDED.start_gate,
  summary = EXCLUDED.summary,
  availability_state = EXCLUDED.availability_state,
  nav_rank = EXCLUDED.nav_rank,
  is_visible = EXCLUDED.is_visible,
  updated_at = NOW();

CREATE INDEX IF NOT EXISTS idx_levelup_cohorts_track_status_start ON levelup_cohorts (track, status, start_date);
CREATE INDEX IF NOT EXISTS idx_levelup_enrollments_user_status ON levelup_enrollments (user_id, status);
CREATE INDEX IF NOT EXISTS idx_levelup_milestones_cohort_seq ON levelup_milestones (cohort_id, sequence_no);
CREATE INDEX IF NOT EXISTS idx_levelup_disputes_status_created ON levelup_disputes (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_levelup_disbursements_enrollment_created ON levelup_disbursements (enrollment_id, created_at DESC);

COMMIT;
