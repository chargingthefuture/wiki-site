BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS gentlepulse_library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT NOT NULL,
  support_route TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gentlepulse_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES gentlepulse_library_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS gentlepulse_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES gentlepulse_library_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS gentlepulse_play_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NULL,
  anonymous_client_id TEXT NULL,
  item_id UUID NOT NULL REFERENCES gentlepulse_library_items(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  CHECK (user_id IS NOT NULL OR anonymous_client_id IS NOT NULL)
);

INSERT INTO gentlepulse_library_items (slug, title, description, media_url, support_route)
VALUES
  ('breathing-baseline', 'Breathing Baseline', 'Guided breathing for regulated reset.', 'https://media.example.local/gentlepulse/breathing-baseline.mp3', '/support'),
  ('grounding-quick-reset', 'Grounding Quick Reset', 'A short grounding sequence for high-stress moments.', 'https://media.example.local/gentlepulse/grounding-quick-reset.mp3', '/support')
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_gentlepulse_library_active ON gentlepulse_library_items (is_active, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_gentlepulse_play_events_item_started ON gentlepulse_play_events (item_id, started_at DESC);

COMMIT;
