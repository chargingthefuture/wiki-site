'use client';

import Link from 'next/link';
import type { ShellSection } from './shell-types';
import type { PluginRegistryItem } from '@/src/lib/plugins/repository';
import { getPluginVisuals } from './shell-plugin-config';
import styles from './community-shell.module.css';

type ShellSidebarProps = {
  section: ShellSection;
  plugins: PluginRegistryItem[];
  activeApp: string | null;
  onAppSelect: (slug: string | null) => void;
  query: string;
  onQueryChange: (q: string) => void;
};

const STATIC_CHANNELS = [
  { name: 'general', href: '/apps/chyme' },
  { name: 'housing-help', href: '/apps/lighthouse' },
  { name: 'skills-trade', href: '/apps/chyme' },
  { name: 'mutual-aid', href: '/apps/socketrelay' },
];

const STATIC_DMS = ['Maria G.', 'James T.', 'Amara O.'];

export function ShellSidebar({
  section,
  plugins,
  activeApp,
  onAppSelect,
  query,
  onQueryChange,
}: ShellSidebarProps) {
  const placeholder = section === 'chat' ? 'Search channels…' : 'Search apps…';

  return (
    <aside className={`${styles.panel} ${styles.leftNav}`}>
      <div className={styles.sidebarHeader}>
        <p className={styles.sectionTitle}>{section === 'chat' ? 'Channels' : 'Mini-Apps'}</p>
        <label className={styles.visuallyHidden} htmlFor="sidebar-search">{placeholder}</label>
        <input
          id="sidebar-search"
          className={styles.sidebarSearch}
          placeholder={placeholder}
          type="search"
          value={section === 'apps' ? query : ''}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className={styles.sidebarBody}>
        {section === 'chat' ? (
          <>
            {STATIC_CHANNELS.map((ch) => (
              <Link key={ch.name} href={ch.href} className={styles.sidebarChannel}>
                <span className={styles.sidebarChannelHash}>#</span>
                <span className={styles.sidebarChannelName}>{ch.name}</span>
              </Link>
            ))}
            <p className={styles.sidebarGroupLabel}>Direct Messages</p>
            {STATIC_DMS.map((name) => (
              <div key={name} className={styles.sidebarDm}>
                <span className={styles.sidebarDmDot} aria-hidden="true" />
                <span>{name}</span>
              </div>
            ))}
          </>
        ) : (
          plugins.map((plugin) => {
            const { emoji, color } = getPluginVisuals(plugin.slug);
            const isActive = activeApp === plugin.slug;
            return (
              <button
                key={plugin.slug}
                type="button"
                className={isActive ? `${styles.sidebarApp} ${styles.sidebarAppActive}` : styles.sidebarApp}
                style={isActive ? { borderLeftColor: color, color } : undefined}
                onClick={() => onAppSelect(isActive ? null : plugin.slug)}
              >
                <span aria-hidden="true">{emoji}</span>
                <span className={styles.sidebarAppName}>{plugin.name}</span>
              </button>
            );
          })
        )}
      </div>

      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarFooterTitle}>Space · Invite Only</p>
        <p className={styles.sidebarFooterMeta}>CTF survivor community</p>
      </div>
    </aside>
  );
}
