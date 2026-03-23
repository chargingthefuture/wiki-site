'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import type { ShellStats } from './shell-types';
import type { PluginRegistryItem } from '@/src/lib/plugins/repository';
import { getPluginVisuals } from './shell-plugin-config';
import styles from './community-shell.module.css';

const GDP_GOAL = 300_000_000_000;

function formatCurrencyAbbr(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(0)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

type ShellRightRailProps = {
  stats: ShellStats;
  activePlugins: PluginRegistryItem[];
  implementedCount: number;
};

export function ShellRightRail({ stats, activePlugins, implementedCount }: ShellRightRailProps) {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.username ?? 'Survivor';
  const initial = displayName.slice(0, 1).toUpperCase();
  const gdpValue = stats.gdpValueUsd ?? 0;
  const progressPct = GDP_GOAL > 0 ? Math.min(100, Math.round((gdpValue / GDP_GOAL) * 100)) : 0;

  return (
    <aside className={`${styles.panel} ${styles.rightRail}`}>
      <section className={styles.profileCard}>
        <div className={styles.profileAvatar} aria-hidden="true">{initial}</div>
        <p className={styles.profileName}>Welcome, {displayName}</p>
        <p className={styles.profileMeta}>Safe Space · {implementedCount} live plugins</p>
        <span className={styles.profileBadge}>Safe Space ✓</span>
      </section>

      <section className={styles.quoteCard}>
        <p className={styles.quoteText}>&ldquo;You are not what happened to you. You are what you choose to become.&rdquo;</p>
        <p className={styles.quoteAuthor}>— Carl Jung</p>
      </section>

      <section>
        <p className={styles.sectionTitle}>Active Plugins</p>
        <ul className={styles.memberList}>
          {activePlugins.map((plugin) => {
            const { emoji, color } = getPluginVisuals(plugin.slug);
            return (
              <li key={plugin.slug}>
                <Link
                  href={`/apps/${plugin.slug}`}
                  className={styles.memberItem}
                  style={{ borderColor: `${color}20` }}
                >
                  <span aria-hidden="true">{emoji}</span>
                  <span className={styles.memberItemName}>{plugin.name}</span>
                  <span className={styles.memberItemGate} style={{ color }}>{plugin.startGate}</span>
                </Link>
              </li>
            );
          })}
          {activePlugins.length === 0 && (
            <li className={styles.memberItem}>No active plugins yet.</li>
          )}
        </ul>
      </section>

      <section className={styles.gdpCard}>
        <p className={styles.gdpCardTitle}>🗺️ GDP Progress</p>
        {gdpValue > 0 ? (
          <>
            <p className={styles.gdpCardValue}>{formatCurrencyAbbr(gdpValue)}</p>
            <p className={styles.gdpCardSub}>of $300B opportunity</p>
            <div className={styles.gdpProgressTrack}>
              <div className={styles.gdpProgressFill} style={{ width: `${progressPct}%` }} />
            </div>
            <div className={styles.gdpProgressLabels}>
              <span>{progressPct}% to goal</span>
              <span>{formatCurrencyAbbr(GDP_GOAL - gdpValue)} remaining</span>
            </div>
          </>
        ) : (
          <p className={styles.gdpCardSub}>No published GDP data yet.</p>
        )}
      </section>

      <div className={styles.authActions}>
        <Link className={styles.subtleButton} href="/apps/chyme">Open Chyme</Link>
      </div>
    </aside>
  );
}
