-- ========================================
-- LEGACY PROFILE REDIRECT MAPPING TABLE
-- ========================================
-- Purpose: Maintain backward compatibility for legacy plugin profile URLs
-- during the platform migration from /platform to ctf rewrite.
-- Allows existing shared URLs to continue working without link rot.

CREATE TABLE IF NOT EXISTS legacy_profile_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_slug VARCHAR NOT NULL,
  scope VARCHAR NOT NULL,
  legacy_entity_id UUID NOT NULL,
  current_entity_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Composite unique constraint: ensure one mapping per plugin+scope+legacy_id
CREATE UNIQUE INDEX IF NOT EXISTS uq_legacy_profile_redirects
  ON legacy_profile_redirects(plugin_slug, scope, legacy_entity_id);

-- Query index to quickly find redirect by plugin+scope+legacy_id
CREATE INDEX IF NOT EXISTS idx_legacy_redirects_lookup
  ON legacy_profile_redirects(plugin_slug, scope, legacy_entity_id);

-- Audit index to track when redirects were created
CREATE INDEX IF NOT EXISTS idx_legacy_redirects_created_at
  ON legacy_profile_redirects(created_at DESC);

COMMENT ON TABLE legacy_profile_redirects IS 
  'Maps legacy platform profile URLs to new ctf rewrite entity IDs. Used during platform migration to prevent link rot.';

COMMENT ON COLUMN legacy_profile_redirects.plugin_slug IS 
  'Plugin identifier (e.g., "directory", "lighthouse", "socketrelay")';

COMMENT ON COLUMN legacy_profile_redirects.scope IS 
  'URL path segment between plugin and ID (e.g., "public", "property")';

COMMENT ON COLUMN legacy_profile_redirects.legacy_entity_id IS 
  'The old UUID from the legacy platform /platform database';

COMMENT ON COLUMN legacy_profile_redirects.current_entity_id IS 
  'The corresponding new UUID in the ctf rewrite database';
