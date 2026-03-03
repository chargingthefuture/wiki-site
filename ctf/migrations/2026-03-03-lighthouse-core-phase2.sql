BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS lighthouse_user_extension (
  user_id TEXT PRIMARY KEY,
  notification_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  accessibility_runtime_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  trauma_informed_defaults JSONB NOT NULL DEFAULT '{}'::jsonb,
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lighthouse_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('seeker', 'host')),
  bio TEXT NULL,
  phone_number TEXT NULL,
  signal_url TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  has_property BOOLEAN NOT NULL DEFAULT FALSE,
  housing_needs TEXT NULL,
  desired_move_in_date DATE NULL,
  budget_min NUMERIC(12,2) NULL,
  budget_max NUMERIC(12,2) NULL,
  desired_country TEXT NULL,
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (budget_min IS NULL OR budget_min >= 0),
  CHECK (budget_max IS NULL OR budget_max >= 0),
  CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_max >= budget_min)
);

CREATE TABLE IF NOT EXISTS lighthouse_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NULL,
  address_line TEXT NULL,
  city TEXT NULL,
  state TEXT NULL,
  country TEXT NULL,
  zip_code TEXT NULL,
  bedrooms INTEGER NULL,
  bathrooms NUMERIC(4,1) NULL,
  monthly_rent NUMERIC(12,2) NULL,
  available_from DATE NULL,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  house_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  airbnb_profile_url TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (bedrooms IS NULL OR bedrooms >= 0),
  CHECK (bathrooms IS NULL OR bathrooms >= 0),
  CHECK (monthly_rent IS NULL OR monthly_rent >= 0)
);

CREATE TABLE IF NOT EXISTS lighthouse_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES lighthouse_properties(id) ON DELETE CASCADE,
  seeker_user_id TEXT NOT NULL,
  host_user_id TEXT NOT NULL,
  message TEXT NULL,
  proposed_move_in_date DATE NULL,
  host_response TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  stream_channel_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_lighthouse_match_active_request
  ON lighthouse_matches (property_id, seeker_user_id)
  WHERE status IN ('pending', 'accepted');

CREATE TABLE IF NOT EXISTS lighthouse_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_user_id TEXT NOT NULL,
  blocked_user_id TEXT NOT NULL,
  reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (blocker_user_id, blocked_user_id),
  CHECK (blocker_user_id <> blocked_user_id)
);

CREATE TABLE IF NOT EXISTS lighthouse_admin_audit_trail (
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

CREATE INDEX IF NOT EXISTS idx_lighthouse_profiles_type_active
  ON lighthouse_profiles (profile_type, is_active, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_lighthouse_properties_host_active
  ON lighthouse_properties (host_user_id, is_active, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_lighthouse_properties_browse
  ON lighthouse_properties (is_active, country, city, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_lighthouse_matches_actor_lookup
  ON lighthouse_matches (seeker_user_id, host_user_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_lighthouse_blocks_blocker
  ON lighthouse_blocks (blocker_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lighthouse_audit_lookup
  ON lighthouse_admin_audit_trail (created_at DESC, actor_id, command);

COMMIT;
