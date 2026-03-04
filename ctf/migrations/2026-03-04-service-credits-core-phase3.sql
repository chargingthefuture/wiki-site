BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS service_credits_wallets (
  user_id TEXT PRIMARY KEY,
  available_balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
  escrow_balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('credit', 'debit', 'escrow_hold', 'escrow_release', 'adjustment', 'reclaim')),
  amount NUMERIC(14, 2) NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  accounting_scope TEXT NOT NULL CHECK (accounting_scope IN ('service_credits_non_gdp', 'cross_plugin_adapter')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id TEXT NOT NULL,
  recipient_user_id TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  UNIQUE (sender_user_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS service_credits_escrow_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_user_id TEXT NOT NULL,
  transfer_id UUID NULL REFERENCES service_credits_transfers(id) ON DELETE SET NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('held', 'released', 'reverted')) DEFAULT 'held',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID NOT NULL REFERENCES service_credits_transfers(id) ON DELETE CASCADE,
  opened_by_user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'resolved', 'dismissed')) DEFAULT 'open',
  resolution_note TEXT NULL,
  resolved_by_user_id TEXT NULL,
  resolved_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_treasury_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_admin_audit_trail (
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

INSERT INTO service_credits_treasury_config (id, policy, updated_by_user_id)
VALUES (1, '{"maxTransferAmount": 10000, "disputeWindowDays": 14, "nonGdpReclaim": true}'::jsonb, 'system')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_service_credits_ledger_user_created ON service_credits_ledger_entries (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_credits_transfers_sender_created ON service_credits_transfers (sender_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_credits_disputes_status_created ON service_credits_disputes (status, created_at DESC);

COMMIT;
