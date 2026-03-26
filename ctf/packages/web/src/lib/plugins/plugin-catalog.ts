export type PluginPhase = 'baseline' | 'phase-0' | 'phase-1' | 'phase-2' | 'phase-3';

export type PluginCatalogItem = {
  id: string;
  name: string;
  phase: PluginPhase;
  startGate: string;
  summary: string;
};

export const pluginCatalog: PluginCatalogItem[] = [
  {
    id: 'bf-01-clerk-foundation',
    name: 'Clerk Foundation',
    phase: 'baseline',
    startGate: 'Baseline -1A',
    summary: 'Identity provider baseline and server-side authz guardrails for web.',
  },
  {
    id: 'bf-02-railway-baseline',
    name: 'Railway Baseline',
    phase: 'baseline',
    startGate: 'Baseline -1B',
    summary: 'Canonical runtime/deployment baseline for full-stack CTF surfaces.',
  },
  {
    id: 'bf-04-expo-baseline',
    name: 'Expo Baseline',
    phase: 'baseline',
    startGate: 'Baseline -1D',
    summary: 'Android deployment baseline for Expo/EAS preview and production readiness.',
  },
  {
    id: 'chyme',
    name: 'Chyme',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Room bootstrap, chat, join flow, and deletion behavior with policy/audit.',
  },
  {
    id: 'skills-taxonomy',
    name: 'Skills Taxonomy',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Hierarchy and CRUD for sectors, job titles, and skills with impact preview.',
  },
  {
    id: 'directory',
    name: 'Directory',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Unified user/admin profile surface with claimed/unclaimed policy controls.',
  },
  {
    id: 'feed-announcements',
    name: 'Feed + Announcements',
    phase: 'phase-0',
    startGate: 'Phase 0',
    summary: 'Timeline and announcement lifecycle in a coupled admin surface.',
  },
  {
    id: 'workforce',
    name: 'Workforce',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Dashboard reporting and recruited-state derivation from upstream data.',
  },
  {
    id: 'skills-hunt',
    name: 'Skills Hunt',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Rounds, moderation, scoring, leaderboards, and governed profile generation.',
  },
  {
    id: 'foundation',
    name: 'Foundation',
    phase: 'phase-1',
    startGate: 'Phase 1',
    summary: 'Provider search and quote lifecycle using read-only Directory projections.',
  },
  {
    id: 'lighthouse',
    name: 'LightHouse',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Profile/property/match parity scope with blocks lifecycle controls.',
  },
  {
    id: 'socketrelay',
    name: 'SocketRelay',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Request and fulfillment flows with privacy-minimized public projections.',
  },
  {
    id: 'trusttransport',
    name: 'TrustTransport',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Ride/package/food fulfillment with safety-first and dispute controls.',
  },
  {
    id: 'peer-programming',
    name: 'Peer Programming',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Weekly cohort assignments with deterministic fallback-open behavior.',
  },
  {
    id: 'mood',
    name: 'Mood',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Mood submissions with 7-day cooldown and anonymous clientId persistence.',
  },
  {
    id: 'gentlepulse',
    name: 'GentlePulse',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Library listing/playback, ratings, favorites, and support route behavior.',
  },
  {
    id: 'weekly-performance',
    name: 'Weekly Performance',
    phase: 'phase-2',
    startGate: 'Phase 2',
    summary: 'Week selection/guardrails with metrics, comparisons, and export gate checks.',
  },
  {
    id: 'gdp',
    name: 'GDP',
    phase: 'phase-3',
    startGate: 'Phase 3',
    summary: 'Aggregate transparency and admin publish flows with compliance controls.',
  },
  {
    id: 'service-credits',
    name: 'Service Credits',
    phase: 'phase-3',
    startGate: 'Phase 3',
    summary: 'Wallet/transfers/escrow/disputes and treasury governance workflows.',
  },
  {
    id: 'levelup',
    name: 'LevelUp',
    phase: 'phase-3',
    startGate: 'Phase 3',
    summary: 'Flexible training cohorts with milestone escrow release, trainer payouts, stipends, and disputes.',
  },
];

export const baselinePluginCount = pluginCatalog.filter((plugin) => plugin.phase === 'baseline').length;
export const nonBaselinePlugins = pluginCatalog.filter((plugin) => plugin.phase !== 'baseline');