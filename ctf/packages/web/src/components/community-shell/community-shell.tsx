'use client';

import { useEffect, useMemo, useState } from 'react';
import { SignedIn } from '@/src/lib/auth/clerk-wrapper';
import type { PluginRegistryItem } from '@/src/lib/plugins/repository';
import type { ShellSection, ShellStats } from './shell-types';
import { ShellIconRail } from './shell-icon-rail';
import { ShellSidebar } from './shell-sidebar';
import { ShellChatPanel } from './shell-chat-panel';
import { ShellAppsPanel } from './shell-apps-panel';
import { ShellRightRail } from './shell-right-rail';
import styles from './community-shell.module.css';

type CommunityShellProps = {
  initialPlugins: PluginRegistryItem[];
  shellStats: ShellStats;
};

type PluginsApiPayload = {
  plugins?: PluginRegistryItem[];
};

export function CommunityShell({ initialPlugins, shellStats }: CommunityShellProps) {
  const [section, setSection] = useState<ShellSection>('chat');
  const [query, setQuery] = useState('');
  const [plugins, setPlugins] = useState(initialPlugins);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlugins() {
      try {
        const res = await fetch('/api/plugins', { method: 'GET', cache: 'no-store' });
        if (!res.ok) throw new Error('Unable to load plugin registry.');
        const payload = (await res.json()) as PluginsApiPayload;
        if (!Array.isArray(payload.plugins)) throw new Error('Invalid plugin registry payload.');
        if (!cancelled) {
          setPlugins(payload.plugins);
          setLoadError(null);
        }
      } catch {
        if (!cancelled) {
          setLoadError('Live plugin data is temporarily unavailable. Showing last known registry snapshot.');
        }
      }
    }

    void loadPlugins();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPlugins = useMemo(() => {
    if (!normalizedQuery) return plugins;
    return plugins.filter((p) =>
      `${p.name} ${p.summary} ${p.phase} ${p.startGate}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, plugins]);

  const implementedCount = plugins.filter((p) => p.availabilityState === 'implemented_shell').length;
  const activePlugins = filteredPlugins
    .filter((p) => p.availabilityState === 'implemented_shell')
    .slice(0, 5);

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <ShellIconRail section={section} onSectionChange={setSection} />
        <ShellSidebar
          section={section}
          plugins={filteredPlugins}
          activeApp={activeApp}
          onAppSelect={setActiveApp}
          query={query}
          onQueryChange={setQuery}
        />
        <main className={`${styles.panel} ${styles.content}`}>
          <SignedIn>
            {loadError ? (
              <section className={styles.usernameAlert} role="alert">{loadError}</section>
            ) : null}
          </SignedIn>
          {section === 'chat' ? (
            <ShellChatPanel stats={shellStats} plugins={filteredPlugins} />
          ) : (
            <ShellAppsPanel plugins={filteredPlugins} activeApp={activeApp} onAppSelect={setActiveApp} />
          )}
        </main>
        <ShellRightRail
          stats={shellStats}
          activePlugins={activePlugins}
          implementedCount={implementedCount}
        />
      </div>
    </div>
  );
}
