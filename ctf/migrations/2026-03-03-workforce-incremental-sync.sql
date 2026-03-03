BEGIN;

CREATE TABLE IF NOT EXISTS workforce_recruited_sync_cursor (
  singleton_key BOOLEAN PRIMARY KEY DEFAULT TRUE,
  last_cursor_at TIMESTAMPTZ NOT NULL DEFAULT '1970-01-01T00:00:00Z'::timestamptz,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO workforce_recruited_sync_cursor (singleton_key, last_cursor_at)
VALUES (TRUE, '1970-01-01T00:00:00Z'::timestamptz)
ON CONFLICT (singleton_key)
DO NOTHING;

COMMIT;
