BEGIN;

CREATE TABLE IF NOT EXISTS ctf_plugin_registry (
  plugin_slug TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('phase-0', 'phase-1', 'phase-2', 'phase-3')),
  start_gate TEXT NOT NULL,
  summary TEXT NOT NULL,
  availability_state TEXT NOT NULL CHECK (availability_state IN ('implemented_shell', 'planned')),
  nav_rank INTEGER NOT NULL DEFAULT 100,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS ctf_plugin_registry
  ADD COLUMN IF NOT EXISTS plugin_slug TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS phase TEXT,
  ADD COLUMN IF NOT EXISTS start_gate TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS availability_state TEXT,
  ADD COLUMN IF NOT EXISTS nav_rank INTEGER,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

UPDATE ctf_plugin_registry
SET
  nav_rank = COALESCE(nav_rank, 100),
  is_visible = COALESCE(is_visible, TRUE),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE nav_rank IS NULL
   OR is_visible IS NULL
   OR created_at IS NULL
   OR updated_at IS NULL;

DELETE FROM ctf_plugin_registry a
USING ctf_plugin_registry b
WHERE a.ctid < b.ctid
  AND a.plugin_slug = b.plugin_slug;

CREATE UNIQUE INDEX IF NOT EXISTS uq_ctf_plugin_registry_plugin_slug
  ON ctf_plugin_registry(plugin_slug);

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
VALUES
  ('chyme', 'Chyme', 'phase-0', 'Phase 0', 'Room bootstrap, chat, join flow, and deletion behavior with policy/audit.', 'implemented_shell', 10, TRUE),
  ('skills-taxonomy', 'Skills Taxonomy', 'phase-0', 'Phase 0', 'Hierarchy and CRUD for sectors, job titles, and skills with impact preview.', 'planned', 20, TRUE),
  ('directory', 'Directory', 'phase-0', 'Phase 0', 'Unified user/admin profile surface with claimed/unclaimed policy controls.', 'implemented_shell', 30, TRUE),
  ('feed-announcements', 'Feed + Announcements', 'phase-0', 'Phase 0', 'Timeline and announcement lifecycle in a coupled admin surface.', 'implemented_shell', 40, TRUE),
  ('workforce', 'Workforce', 'phase-1', 'Phase 1', 'Dashboard reporting and recruited-state derivation from upstream data.', 'implemented_shell', 50, TRUE),
  ('skills-hunt', 'Skills Hunt', 'phase-1', 'Phase 1', 'Rounds, moderation, scoring, leaderboards, and governed profile generation.', 'implemented_shell', 60, TRUE),
  ('foundation', 'Foundation', 'phase-1', 'Phase 1', 'Provider search and quote lifecycle using read-only Directory projections.', 'implemented_shell', 70, TRUE),
  ('lighthouse', 'LightHouse', 'phase-2', 'Phase 2', 'Profile/property/match parity scope with blocks lifecycle controls.', 'planned', 80, TRUE),
  ('socketrelay', 'SocketRelay', 'phase-2', 'Phase 2', 'Request and fulfillment flows with privacy-minimized public projections.', 'planned', 90, TRUE),
  ('trusttransport', 'TrustTransport', 'phase-2', 'Phase 2', 'Ride/package/food fulfillment with safety-first and dispute controls.', 'planned', 100, TRUE),
  ('peer-programming', 'Peer Programming', 'phase-2', 'Phase 2', 'Weekly cohort assignments with deterministic fallback-open behavior.', 'planned', 110, TRUE),
  ('mood', 'Mood', 'phase-2', 'Phase 2', 'Mood submissions with 7-day cooldown and anonymous clientId persistence.', 'planned', 120, TRUE),
  ('gentlepulse', 'GentlePulse', 'phase-2', 'Phase 2', 'Library listing/playback, ratings, favorites, and support route behavior.', 'planned', 130, TRUE),
  ('weekly-performance', 'Weekly Performance', 'phase-2', 'Phase 2', 'Week selection/guardrails with metrics, comparisons, and export gate checks.', 'planned', 140, TRUE),
  ('gdp', 'GDP', 'phase-3', 'Phase 3', 'Aggregate transparency and admin publish flows with compliance controls.', 'planned', 150, TRUE),
  ('service-credits', 'Service Credits', 'phase-3', 'Phase 3', 'Wallet/transfers/escrow/disputes and treasury governance workflows.', 'planned', 160, TRUE)
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