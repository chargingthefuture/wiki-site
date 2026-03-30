'use client';

import Link from 'next/link';
import type { PluginRegistryItem } from '../lib/plugins/repository';
import { getPluginVisuals } from './shell-plugin-config';
import styles from './community-shell.module.css';

function getPluginHref(slug: string): string {
  return `/apps/${encodeURIComponent(slug)}`;
}

type ShellAppsPanelProps = {
  plugins: PluginRegistryItem[];
  activeApp: string | null;
  onAppSelect: (slug: string | null) => void;
};

export function ShellAppsPanel({ plugins, activeApp, onAppSelect }: ShellAppsPanelProps) {
  return (
    <div className={styles.appsPanel}>
      <div className={styles.appsPanelHeader}>
        <h2 className={styles.appsPanelTitle}>All Plugins</h2>
        <p className={styles.appsPanelSub}>Your complete peer-to-peer marketplace — from survivor to thriver</p>
      </div>

      {plugins.length === 0 && (
        <p className={styles.appsEmpty}>No matching plugins. Try a different search.</p>
      )}

      <div className={styles.appsGrid}>
        {plugins.map((plugin) => {
          const { emoji, color, bg } = getPluginVisuals(plugin.slug);
          const isActive = activeApp === plugin.slug;
          return (
            <div
              key={plugin.slug}
              className={styles.appCard}
              style={{
                background: isActive ? `${bg}ee` : `${bg}88`,
                borderColor: isActive ? `${color}60` : `${color}20`,
              }}
              onClick={() => onAppSelect(isActive ? null : plugin.slug)}
            >
              <div className={styles.appCardTop}>
                <div
                  className={styles.appCardIcon}
                  style={{ background: `${color}20`, borderColor: `${color}35`, color }}
                  aria-hidden="true"
                >
                  {emoji}
                </div>
                <div className={styles.appCardBadges}>
                  <span className={styles.appCardPhase}>{plugin.startGate}</span>
                  {plugin.availabilityState === 'implemented_shell' && (
                    <span className={styles.appCardLive} style={{ color }}>Live</span>
                  )}
                </div>
              </div>
              <p className={styles.appCardName}>{plugin.name}</p>
              <p className={styles.appCardDesc}>{plugin.summary}</p>
              <Link
                href={getPluginHref(plugin.slug)}
                className={styles.appCardAction}
                style={{ color, borderColor: `${color}35`, background: `${color}15` }}
                onClick={(e) => e.stopPropagation()}
              >
                Open plugin →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
