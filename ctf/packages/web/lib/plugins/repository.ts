import { queryDb } from 'lib/db/postgres';

export type PluginPhase = 'phase-0' | 'phase-1' | 'phase-2' | 'phase-3';
export type PluginAvailabilityState = 'implemented_shell' | 'planned';

export type PluginRegistryItem = {
  slug: string;
  name: string;
  phase: PluginPhase;
  startGate: string;
  summary: string;
  availabilityState: PluginAvailabilityState;
  navRank: number;
  isVisible: boolean;
};

export type PluginRegistrySummary = {
  total: number;
  implementedShells: number;
  planned: number;
};

type PluginRegistryRow = {
  plugin_slug: string;
  display_name: string;
  phase: PluginPhase;
  start_gate: string;
  summary: string;
  availability_state: PluginAvailabilityState;
  nav_rank: number;
  is_visible: boolean;
};

const fallbackPluginRegistry: PluginRegistryItem[] = [
  {
    slug: 'chyme',
    name: 'Chyme',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Room bootstrap, chat, join flow, and deletion behavior with policy/audit.',
    availabilityState: 'implemented_shell',
    navRank: 10,
    isVisible: true,
  },
  {
    slug: 'skills-taxonomy',
    name: 'Skills Taxonomy',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Hierarchy and CRUD for sectors, job titles, and skills with impact preview.',
    availabilityState: 'planned',
    navRank: 20,
    isVisible: true,
  },
  {
    slug: 'directory',
    name: 'Directory',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Unified user/admin profile surface with claimed/unclaimed policy controls.',
    availabilityState: 'implemented_shell',
    navRank: 30,
    isVisible: true,
  },
  {
    slug: 'feed-announcements',
    name: 'Feed + Announcements',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Timeline and announcement lifecycle in a coupled admin surface.',
    availabilityState: 'implemented_shell',
    navRank: 40,
    isVisible: true,
  },
  {
    slug: 'workforce',
    name: 'Workforce',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Dashboard reporting and recruited-state derivation from upstream data.',
    availabilityState: 'implemented_shell',
    navRank: 50,
    isVisible: true,
  },
  {
    slug: 'skills-hunt',
    name: 'Skills Hunt',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Rounds, moderation, scoring, leaderboards, and governed profile generation.',
    availabilityState: 'implemented_shell',
    navRank: 60,
    isVisible: true,
  },
  {
    slug: 'unlock',
    name: 'Unlock',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Internal verification queue and staged unlock orchestration for Quora URL onboarding.',
    availabilityState: 'implemented_shell',
    navRank: 65,
    isVisible: false,
  },
  {
    slug: 'foundation',
    name: 'Foundation',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Provider search and quote lifecycle using read-only Directory projections.',
    availabilityState: 'implemented_shell',
    navRank: 70,
    isVisible: true,
  },
  {
    slug: 'lighthouse',
    name: 'LightHouse',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Profile/property/match parity scope with blocks lifecycle controls.',
    availabilityState: 'implemented_shell',
    navRank: 80,
    isVisible: true,
  },
  {
    slug: 'socketrelay',
    name: 'SocketRelay',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Request and fulfillment flows with privacy-minimized public projections.',
    availabilityState: 'implemented_shell',
    navRank: 90,
    isVisible: true,
  },
  {
    slug: 'trusttransport',
    name: 'TrustTransport',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Ride/package/food fulfillment with safety-first and dispute controls.',
    availabilityState: 'implemented_shell',
    navRank: 100,
    isVisible: true,
  },
  {
    slug: 'peer-programming',
    name: 'Peer Programming',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Weekly cohort assignments with deterministic fallback-open behavior.',
    availabilityState: 'implemented_shell',
    navRank: 110,
    isVisible: true,
  },
  {
    slug: 'mood',
    name: 'Mood',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Mood submissions with 7-day cooldown and anonymous clientId persistence.',
    availabilityState: 'implemented_shell',
    navRank: 120,
    isVisible: true,
  },
  {
    slug: 'gentlepulse',
    name: 'GentlePulse',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Library listing/playback, ratings, favorites, and support route behavior.',
    availabilityState: 'implemented_shell',
    navRank: 130,
    isVisible: true,
  },
  {
    slug: 'weekly-performance',
    name: 'Weekly Performance',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Week selection/guardrails with metrics, comparisons, and export gate checks.',
    availabilityState: 'implemented_shell',
    navRank: 140,
    isVisible: true,
  },
  {
    slug: 'gdp',
    name: 'GDP',
    phase: 'phase-3',
    startGate: 'Phase 3',
    summary: 'Aggregate transparency and admin publish flows with compliance controls.',
    availabilityState: 'implemented_shell',
    navRank: 150,
    isVisible: true,
  },
  {
    slug: 'service-credits',
    name: 'Service Credits',
    phase: 'phase-3',
    startGate: 'Phase 3',
    summary: 'Wallet/transfers/escrow/disputes and treasury governance workflows.',
    availabilityState: 'implemented_shell',
    navRank: 160,
    isVisible: true,
  },
  {
    slug: 'levelup',
    name: 'LevelUp',
    phase: 'phase-3',
    startGate: 'Phase 3',
    summary: 'Flexible training cohorts with milestone escrow release, trainer payouts, stipends, and disputes.',
    availabilityState: 'implemented_shell',
    navRank: 170,
    isVisible: true,
  },
];

const pluginAliasMap: Record<string, string> = {
  announcements: 'feed-announcements',
  feed: 'feed-announcements',
  'gross-domestic-product': 'gdp',
  leveluptraining: 'levelup',
  servicecredits: 'service-credits',
  'socket-relay': 'socketrelay',
  'trust-transport': 'trusttransport',
};

export function canonicalizePluginSlug(input: string): string {
  const normalized = input.trim().toLowerCase();
  return pluginAliasMap[normalized] ?? normalized;
}

export function getPluginRoute(slug: string): string {
  return `/apps/${encodeURIComponent(slug)}`;
}

function mapPluginRegistryRow(row: PluginRegistryRow): PluginRegistryItem {
  return {
    slug: row.plugin_slug,
    name: row.display_name,
    phase: row.phase,
    startGate: row.start_gate,
    summary: row.summary,
    availabilityState: row.availability_state,
    navRank: row.nav_rank,
    isVisible: row.is_visible,
  };
}

function buildSummary(items: PluginRegistryItem[]): PluginRegistrySummary {
  let implementedShells = 0;
  let planned = 0;

  for (const item of items) {
    if (item.availabilityState === 'implemented_shell') {
      implementedShells += 1;
      continue;
    }

    planned += 1;
  }

  return {
    total: items.length,
    implementedShells,
    planned,
  };
}

export async function listPluginRegistry(options?: { includeHidden?: boolean }): Promise<PluginRegistryItem[]> {
  const includeHidden = Boolean(options?.includeHidden);

  try {
    const result = await queryDb<PluginRegistryRow>(
      `SELECT
         plugin_slug,
         display_name,
         phase,
         start_gate,
         summary,
         availability_state,
         nav_rank,
         is_visible
       FROM ctf_plugin_registry
       WHERE ($1::boolean OR is_visible = TRUE)
       ORDER BY
         CASE phase
           WHEN 'phase-0' THEN 0
           WHEN 'phase-1' THEN 1
           WHEN 'phase-2' THEN 2
           WHEN 'phase-3' THEN 3
         END,
         nav_rank ASC,
         display_name ASC`,
      [includeHidden],
    );

    return result.rows.map(mapPluginRegistryRow);
  } catch {
    return includeHidden
      ? fallbackPluginRegistry
      : fallbackPluginRegistry.filter((item) => item.isVisible);
  }
}

export async function getPluginBySlug(slug: string): Promise<PluginRegistryItem | null> {
  const canonicalSlug = canonicalizePluginSlug(slug);

  try {
    const result = await queryDb<PluginRegistryRow>(
      `SELECT
         plugin_slug,
         display_name,
         phase,
         start_gate,
         summary,
         availability_state,
         nav_rank,
         is_visible
       FROM ctf_plugin_registry
       WHERE plugin_slug = $1
       LIMIT 1`,
      [canonicalSlug],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return mapPluginRegistryRow(result.rows[0]);
  } catch {
    return fallbackPluginRegistry.find((item) => item.slug === canonicalSlug) ?? null;
  }
}

export async function listPluginRegistryWithSummary(options?: { includeHidden?: boolean }) {
  const plugins = await listPluginRegistry(options);
  return {
    plugins,
    summary: buildSummary(plugins),
  };
}
