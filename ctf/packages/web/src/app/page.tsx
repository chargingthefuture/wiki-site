import { CommunityShell } from '@/src/components/community-shell/community-shell';
import { listPluginRegistry } from '@/src/lib/plugins/repository';
import { getGdpShellStats } from '@/src/lib/gdp/repository';

export default async function HomePage() {
  const [plugins, shellStats] = await Promise.all([listPluginRegistry(), getGdpShellStats()]);
  return <CommunityShell initialPlugins={plugins} shellStats={shellStats} />;
}
