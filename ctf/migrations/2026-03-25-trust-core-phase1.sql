BEGIN;

-- Trust plugin: user extension table
CREATE TABLE IF NOT EXISTS trust_user_extension (
  user_id TEXT PRIMARY KEY,
  trust_status TEXT NOT NULL DEFAULT 'unverified' CHECK (trust_status IN ('unverified', 'verified', 'flagged')),
  trust_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  trust_visibility TEXT NOT NULL DEFAULT 'public' CHECK (trust_visibility IN ('public', 'private', 'restricted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trust plugin: signal snapshots
CREATE TABLE IF NOT EXISTS trust_signal_snapshots (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  snapshot_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, snapshot_type, created_at)
);
CREATE INDEX IF NOT EXISTS idx_trust_signal_snapshots_user ON trust_signal_snapshots (user_id, created_at DESC);

-- Trust plugin: admin audit trail
CREATE TABLE IF NOT EXISTS trust_admin_audit_trail (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id TEXT NULL,
  command TEXT NOT NULL,
  policy_status TEXT NOT NULL CHECK (policy_status IN ('allow', 'deny')),
  reason TEXT NOT NULL,
  target_user_id TEXT NULL,
  request_id TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trust_admin_audit_trail_target_user ON trust_admin_audit_trail (target_user_id, created_at DESC);

-- Register Trust plugin in plugin registry
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
  'trust',
  'Trust',
  'phase-1',
  'Phase 1',
  'Privacy-first trust evidence and verification plugin.',
  'implemented_shell',
  70,
  FALSE
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

COMMIT;
