BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS feed_user_extension (
  user_id TEXT PRIMARY KEY,
  toast_mode_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  render_mode TEXT NOT NULL DEFAULT 'card_only' CHECK (render_mode IN ('card_only', 'card_toast')),
  service_deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_render_config (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  render_mode TEXT NOT NULL DEFAULT 'card_only' CHECK (render_mode IN ('card_only', 'card_toast')),
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  max_timeline_page_size INTEGER NOT NULL DEFAULT 50,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  priority INTEGER NOT NULL DEFAULT 0,
  mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  schedule_at TIMESTAMPTZ NULL,
  published_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ NULL,
  targeting JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcement_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  targeting JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (announcement_id, revision_number)
);

CREATE TABLE IF NOT EXISTS announcement_delivery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('published', 'archived', 'membership_recalc')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcement_user_state (
  user_id TEXT NOT NULL,
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NULL,
  dismissed_at TIMESTAMPTZ NULL,
  acknowledged_at TIMESTAMPTZ NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, announcement_id)
);

CREATE TABLE IF NOT EXISTS announcement_membership_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('join', 'leave')),
  request_id TEXT NULL,
  trace_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcement_admin_audit_trail (
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

CREATE TABLE IF NOT EXISTS feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('announcement', 'activity')),
  source_announcement_id UUID NULL REFERENCES announcements(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_item_targets (
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  target_plugin TEXT NULL,
  target_region TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (item_id, target_role, target_plugin, target_region)
);

CREATE TABLE IF NOT EXISTS feed_user_read_state (
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS feed_user_dismissals (
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS feed_membership_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('join', 'leave')),
  request_id TEXT NULL,
  trace_id TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_admin_audit_trail (
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

CREATE INDEX IF NOT EXISTS idx_announcements_status_publish
  ON announcements (status, published_at DESC, expires_at);

CREATE INDEX IF NOT EXISTS idx_announcement_targets_json
  ON announcements USING GIN (targeting);

CREATE INDEX IF NOT EXISTS idx_announcement_delivery_events
  ON announcement_delivery_events (announcement_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_items_visibility
  ON feed_items (is_active, published_at DESC, priority DESC, expires_at);

CREATE UNIQUE INDEX IF NOT EXISTS uq_feed_items_source_announcement
  ON feed_items (source_announcement_id)
  WHERE source_announcement_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_feed_targets_lookup
  ON feed_item_targets (target_role, target_plugin, target_region, item_id);

CREATE INDEX IF NOT EXISTS idx_feed_membership_events_lookup
  ON feed_membership_events (user_id, plugin_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcement_membership_events_lookup
  ON announcement_membership_events (user_id, plugin_id, created_at DESC);

INSERT INTO feed_render_config (singleton_key, render_mode, kill_switch_enabled, max_timeline_page_size, updated_by_user_id)
VALUES (TRUE, 'card_only', FALSE, 50, 'system-seed')
ON CONFLICT (singleton_key)
DO NOTHING;

CREATE OR REPLACE VIEW feed_timeline_projection AS
SELECT
  fi.id,
  fi.item_type,
  fi.source_announcement_id,
  fi.title,
  fi.body,
  fi.priority,
  fi.mandatory,
  fi.published_at,
  fi.expires_at,
  fi.is_active,
  fi.updated_at
FROM feed_items fi
WHERE fi.is_active = TRUE
  AND fi.published_at <= NOW()
  AND (fi.expires_at IS NULL OR fi.expires_at > NOW());

COMMIT;
