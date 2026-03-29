import { canonicalizePluginSlug } from '@/src/lib/plugins/repository';
import { redirect } from 'next/navigation';

type LegacyPluginPageProps = {
  searchParams?: Promise<{
    plugin?: string | string[];
  }>;
};

function getRequestedPluginSlug(pluginValue: string | string[] | undefined): string | null {
  if (Array.isArray(pluginValue)) {
    return pluginValue[0] ?? null;
  }

  return pluginValue ?? null;
}

export default async function PluginPage({ searchParams }: LegacyPluginPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPluginSlug = getRequestedPluginSlug(resolvedSearchParams?.plugin);
  const canonicalSlug = requestedPluginSlug ? canonicalizePluginSlug(requestedPluginSlug) : 'chyme';

  redirect(`/apps/${encodeURIComponent(canonicalSlug)}`);
}
