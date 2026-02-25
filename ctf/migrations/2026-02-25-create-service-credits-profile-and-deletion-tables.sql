BEGIN;

CREATE TABLE IF NOT EXISTS service_credits_user_extension (
  user_id TEXT PRIMARY KEY,
  wallet_id TEXT,
  wallet_status TEXT NOT NULL DEFAULT 'active' CHECK (wallet_status IN ('active', 'restricted', 'pending_deletion', 'deleted')),
  deletion_request_id TEXT,
  deletion_requested_at TIMESTAMPTZ,
  reclaim_eligible_at TIMESTAMPTZ,
  service_deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('personal', 'treasury', 'escrow')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'restricted', 'pending_deletion', 'deleted')),
  available_balance_units BIGINT NOT NULL DEFAULT 0 CHECK (available_balance_units >= 0),
  held_balance_units BIGINT NOT NULL DEFAULT 0 CHECK (held_balance_units >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_service_credits_wallets_user_type
  ON service_credits_wallets (user_id, wallet_type)
  WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS service_credits_transfers (
  id TEXT PRIMARY KEY,
  source_wallet_id TEXT NOT NULL REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  destination_wallet_id TEXT NOT NULL REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  transfer_type TEXT NOT NULL,
  amount_units BIGINT NOT NULL CHECK (amount_units > 0),
  origin_plugin TEXT,
  deletion_request_id TEXT,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_escrow_holds (
  id TEXT PRIMARY KEY,
  source_wallet_id TEXT NOT NULL REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('held', 'released', 'refunded')),
  held_amount_units BIGINT NOT NULL CHECK (held_amount_units > 0),
  origin_plugin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS service_credits_treasury_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('fee_collect', 'account_deletion_reclaim', 'grant', 'adjustment')),
  source_wallet_id TEXT REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  treasury_wallet_id TEXT NOT NULL REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  amount_units BIGINT NOT NULL CHECK (amount_units > 0),
  deletion_request_id TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_command_idempotency (
  idempotency_key TEXT PRIMARY KEY,
  command_name TEXT NOT NULL,
  request_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_credits_account_deletion_reclaims (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_id TEXT REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  deletion_request_id TEXT NOT NULL,
  reclaim_eligible_at TIMESTAMPTZ NOT NULL,
  reclaim_status TEXT NOT NULL DEFAULT 'pending_window' CHECK (reclaim_status IN ('pending_window', 'blocked_escrow', 'completed', 'failed')),
  amount_transferred_units BIGINT NOT NULL DEFAULT 0 CHECK (amount_transferred_units >= 0),
  transfer_id TEXT,
  tombstone_id BIGINT,
  request_id TEXT,
  trace_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, deletion_request_id)
);

CREATE TABLE IF NOT EXISTS service_credits_wallet_tombstones (
  id BIGSERIAL PRIMARY KEY,
  wallet_id TEXT NOT NULL REFERENCES service_credits_wallets(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL,
  deletion_request_id TEXT NOT NULL,
  original_available_balance_units BIGINT NOT NULL CHECK (original_available_balance_units >= 0),
  original_held_balance_units BIGINT NOT NULL CHECK (original_held_balance_units >= 0),
  deletion_reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet_id, deletion_request_id)
);

CREATE INDEX IF NOT EXISTS idx_service_credits_wallets_status_updated
  ON service_credits_wallets (status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_credits_escrow_holds_wallet_status
  ON service_credits_escrow_holds (source_wallet_id, status);

CREATE INDEX IF NOT EXISTS idx_service_credits_treasury_events_type_occurred
  ON service_credits_treasury_events (event_type, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_credits_account_deletion_reclaims_status_eligible
  ON service_credits_account_deletion_reclaims (reclaim_status, reclaim_eligible_at ASC);

CREATE INDEX IF NOT EXISTS idx_service_credits_wallet_tombstones_user_created
  ON service_credits_wallet_tombstones (user_id, created_at DESC);

COMMIT;
