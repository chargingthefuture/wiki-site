import { CommunityShell } from '@/src/components/community-shell/community-shell';
import { listPluginRegistry } from '@/src/lib/plugins/repository';
import { getGdpShellStats } from '@/src/lib/gdp/repository';

export default async function HomePage() {
  const pluginsPromise = listPluginRegistry();
  const shellStatsPromise = getGdpShellStats().catch(() => {
    return { memberCount: null, gdpValueUsd: null };
  });
  const [plugins, shellStats] = await Promise.all([pluginsPromise, shellStatsPromise]);
  return <CommunityShell initialPlugins={plugins} shellStats={shellStats} />;
}
