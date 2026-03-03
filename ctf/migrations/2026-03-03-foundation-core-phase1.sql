BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS foundation_user_extension (
  user_id TEXT PRIMARY KEY,
  notification_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  accessibility_runtime_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  trauma_informed_defaults JSONB NOT NULL DEFAULT '{}'::jsonb,
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundation_capacity_policies (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  max_active_threads_per_user INTEGER NOT NULL DEFAULT 20,
  max_messages_per_minute INTEGER NOT NULL DEFAULT 20,
  max_searches_per_minute INTEGER NOT NULL DEFAULT 40,
  max_quote_transitions_per_minute INTEGER NOT NULL DEFAULT 20,
  max_call_duration_minutes INTEGER NOT NULL DEFAULT 45,
  quota_state TEXT NOT NULL DEFAULT 'green' CHECK (quota_state IN ('green', 'yellow', 'orange', 'red')),
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundation_quota_threshold_states (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  stream_api_calls_used INTEGER NOT NULL DEFAULT 0,
  stream_api_calls_budget INTEGER NOT NULL DEFAULT 100000,
  stream_video_minutes_used INTEGER NOT NULL DEFAULT 0,
  stream_video_minutes_budget INTEGER NOT NULL DEFAULT 50000,
  threshold_state TEXT NOT NULL DEFAULT 'green' CHECK (threshold_state IN ('green', 'yellow', 'orange', 'red')),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundation_connection_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survivor_user_id TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  provider_directory_profile_id UUID NOT NULL REFERENCES directory_profiles(id) ON DELETE RESTRICT,
  stream_channel_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (survivor_user_id, provider_user_id),
  UNIQUE (stream_channel_id),
  CHECK (survivor_user_id <> provider_user_id)
);

CREATE TABLE IF NOT EXISTS foundation_thread_participants (
  thread_id UUID NOT NULL REFERENCES foundation_connection_threads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  participant_role TEXT NOT NULL CHECK (participant_role IN ('survivor', 'provider')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS foundation_message_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES foundation_connection_threads(id) ON DELETE CASCADE,
  sender_user_id TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('survivor', 'provider')),
  message_text TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  client_message_id TEXT NOT NULL,
  stream_message_id TEXT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'accepted' CHECK (moderation_status IN ('accepted', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (thread_id, sender_user_id, client_message_id)
);

CREATE TABLE IF NOT EXISTS foundation_call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES foundation_connection_threads(id) ON DELETE CASCADE,
  created_by_user_id TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('voice', 'video')),
  stream_call_id TEXT NOT NULL,
  requested_duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'active', 'ended', 'cancelled')),
  started_at TIMESTAMPTZ NULL,
  ended_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (stream_call_id)
);

CREATE TABLE IF NOT EXISTS foundation_quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES foundation_connection_threads(id) ON DELETE CASCADE,
  survivor_user_id TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  service_type TEXT NOT NULL,
  request_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  lifecycle_state TEXT NOT NULL DEFAULT 'requested' CHECK (lifecycle_state IN ('requested', 'provider_responded', 'closed')),
  last_transitioned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundation_quote_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID NOT NULL REFERENCES foundation_quote_requests(id) ON DELETE CASCADE,
  actor_user_id TEXT NOT NULL,
  previous_state TEXT NULL,
  current_state TEXT NOT NULL CHECK (current_state IN ('requested', 'provider_responded', 'closed')),
  reason TEXT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundation_notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  thread_id UUID NULL REFERENCES foundation_connection_threads(id) ON DELETE SET NULL,
  quote_request_id UUID NULL REFERENCES foundation_quote_requests(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundation_rate_limit_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  command_name TEXT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  window_seconds INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, command_name, window_started_at, window_seconds)
);

CREATE TABLE IF NOT EXISTS foundation_admin_audit_trail (
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

CREATE INDEX IF NOT EXISTS idx_foundation_threads_survivor
  ON foundation_connection_threads (survivor_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_threads_provider
  ON foundation_connection_threads (provider_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_messages_thread_created
  ON foundation_message_metadata (thread_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_calls_thread_created
  ON foundation_call_sessions (thread_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_quotes_survivor_state
  ON foundation_quote_requests (survivor_user_id, lifecycle_state, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_quotes_provider_state
  ON foundation_quote_requests (provider_user_id, lifecycle_state, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_quote_events_quote
  ON foundation_quote_status_events (quote_request_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_notifications_user_ack
  ON foundation_notification_events (user_id, is_acknowledged, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_rate_limit_lookup
  ON foundation_rate_limit_counters (user_id, command_name, window_started_at DESC);

CREATE INDEX IF NOT EXISTS idx_foundation_audit_lookup
  ON foundation_admin_audit_trail (created_at DESC, actor_id, command);

INSERT INTO foundation_capacity_policies (
  singleton_key,
  max_active_threads_per_user,
  max_messages_per_minute,
  max_searches_per_minute,
  max_quote_transitions_per_minute,
  max_call_duration_minutes,
  quota_state,
  kill_switch_enabled,
  updated_by_user_id
)
VALUES (
  TRUE,
  20,
  20,
  40,
  20,
  45,
  'green',
  FALSE,
  'system-seed'
)
ON CONFLICT (singleton_key) DO NOTHING;

INSERT INTO foundation_quota_threshold_states (
  singleton_key,
  stream_api_calls_used,
  stream_api_calls_budget,
  stream_video_minutes_used,
  stream_video_minutes_budget,
  threshold_state,
  computed_at
)
VALUES (
  TRUE,
  0,
  100000,
  0,
  50000,
  'green',
  NOW()
)
ON CONFLICT (singleton_key) DO NOTHING;

COMMIT;
