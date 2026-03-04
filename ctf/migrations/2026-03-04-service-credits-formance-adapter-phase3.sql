BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS service_credits_command_idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  command_name TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  response_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (actor_id, command_name, idempotency_key)
);

CREATE TABLE IF NOT EXISTS service_credits_adapter_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command_name TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'formance',
  status TEXT NOT NULL CHECK (status IN ('queued', 'delivered', 'failed')) DEFAULT 'queued',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  provider_transaction_id TEXT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (command_name, idempotency_key)
);

CREATE TABLE IF NOT EXISTS service_credits_governance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('mint_grant', 'burn')),
  target_user_id TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  governance_ticket_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  provider_transaction_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_type, actor_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS service_credits_treasury_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('fee_collect', 'deletion_reclaim')),
  source_user_id TEXT NOT NULL,
  treasury_user_id TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  transfer_id UUID NULL REFERENCES service_credits_transfers(id) ON DELETE SET NULL,
  reason_code TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  provider_transaction_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_type, actor_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS service_credits_dispute_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_case_id TEXT NOT NULL,
  source_user_id TEXT NOT NULL,
  destination_user_id TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  adjustment_reason TEXT NOT NULL,
  transfer_id UUID NOT NULL REFERENCES service_credits_transfers(id) ON DELETE RESTRICT,
  actor_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  provider_transaction_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (actor_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS service_credits_wallet_tombstones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id TEXT NOT NULL,
  deletion_request_id TEXT NOT NULL,
  final_available_balance NUMERIC(14, 2) NOT NULL,
  final_escrow_balance NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, deletion_request_id)
);

CREATE TABLE IF NOT EXISTS service_credits_account_deletion_reclaims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id TEXT NOT NULL,
  deletion_request_id TEXT NOT NULL,
  treasury_user_id TEXT NOT NULL,
  amount_transferred NUMERIC(14, 2) NOT NULL CHECK (amount_transferred >= 0),
  transfer_id UUID NULL REFERENCES service_credits_transfers(id) ON DELETE SET NULL,
  tombstone_id UUID NOT NULL REFERENCES service_credits_wallet_tombstones(id) ON DELETE RESTRICT,
  request_id TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  provider_transaction_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, deletion_request_id),
  UNIQUE (actor_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_service_credits_outbox_status_created
  ON service_credits_adapter_outbox (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_credits_cmd_idempotency_actor_command
  ON service_credits_command_idempotency (actor_id, command_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_credits_treasury_events_created
  ON service_credits_treasury_events (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_credits_governance_events_created
  ON service_credits_governance_events (event_type, created_at DESC);

COMMIT;
