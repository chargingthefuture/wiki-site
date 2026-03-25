'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ShellStats, ChatMessage } from './shell-types';
import type { PluginRegistryItem } from '@/src/lib/plugins/repository';
import styles from './community-shell.module.css';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: 'hub',
    text: 'Welcome back, Survivor. You have 3 new opportunities in your network today.',
    time: '9:01 AM',
  },
  {
    id: 2,
    from: 'user',
    text: 'Show me housing options near me',
    time: '9:03 AM',
  },
  {
    id: 3,
    from: 'hub',
    text: 'Found 12 verified safe housing listings through LightHouse. Two are accepting Service Credits.',
    time: '9:03 AM',
    actionLabel: 'Open LightHouse →',
    actionSlug: 'lighthouse',
  },
  {
    id: 4,
    from: 'user',
    text: "What's the GDP tracker showing this week?",
    time: '9:05 AM',
  },
  {
    id: 5,
    from: 'hub',
    text: 'Check the Gross Domestic Product plugin for the latest economy metrics and your skills contribution.',
    time: '9:05 AM',
    actionLabel: 'Open GDP →',
    actionSlug: 'gross-domestic-product',
  },
];

const SUGGESTIONS = [
  'Find a tradesperson',
  'Join a Chyme room',
  'Check my Service Credits',
  'Open meditation',
  'View skills directory',
];

function formatStatNumber(value: number | null): string {
  if (value === null || value === 0) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function formatStatCurrency(value: number | null): string {
  if (value === null || value === 0) return '$0';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(0)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

type ShellChatPanelProps = {
  stats: ShellStats;
  plugins: PluginRegistryItem[];
};

export function ShellChatPanel({ stats, plugins }: ShellChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: input.trim(), time: 'Now' }]);
    setInput('');
  };

  const implementedCount = plugins.filter((p) => p.availabilityState === 'implemented_shell').length;

  return (
    <div className={styles.chatPanelWrap}>
      <div className={styles.heroBanner}>
        <div className={styles.heroBannerContent}>
          <p className={styles.heroBannerTag}>✦ From Survivor to Thriver</p>
          <h1 className={styles.heroBannerTitle}>Good morning — your network is active.</h1>
          <p className={styles.heroBannerSub}>{implementedCount} live plugins · one economy · $300B opportunity.</p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStatBlock}>
            <span className={styles.heroStatValue} style={{ color: '#A78BFA' }}>
              {formatStatNumber(stats.memberCount)}
            </span>
            <span className={styles.heroStatLabel}>Members</span>
          </div>
          <div className={styles.heroStatBlock}>
            <span className={styles.heroStatValue} style={{ color: '#38BDF8' }}>
              {formatStatCurrency(stats.gdpValueUsd)}
            </span>
            <span className={styles.heroStatLabel}>GDP</span>
          </div>
          <div className={styles.heroStatBlock}>
            <span className={styles.heroStatValue} style={{ color: '#34D399' }}>$300B</span>
            <span className={styles.heroStatLabel}>Opportunity</span>
          </div>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.from === 'user' ? `${styles.chatRow} ${styles.chatRowUser}` : styles.chatRow}
          >
            {msg.from === 'hub' && <div className={styles.chatAvatar} aria-hidden="true">SH</div>}
            <div className={styles.chatBubbleGroup}>
              <div className={msg.from === 'user' ? `${styles.chatBubble} ${styles.chatBubbleUser}` : `${styles.chatBubble} ${styles.chatBubbleHub}`}>
                {msg.text}
              </div>
              {msg.actionLabel && msg.actionSlug && (
                <Link href={`/apps/${msg.actionSlug}`} className={styles.chatActionBtn}>
                  {msg.actionLabel}
                </Link>
              )}
              <span className={msg.from === 'user' ? `${styles.chatTime} ${styles.chatTimeUser}` : styles.chatTime}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatSuggestions}>
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className={styles.chatChip} onClick={() => setInput(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className={styles.chatInputWrap}>
        <label className={styles.visuallyHidden} htmlFor="chat-input">Message Survivor Hub</label>
        <input
          id="chat-input"
          className={styles.chatInput}
          placeholder="Ask Survivor Hub anything, or search resources…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          type="button"
          className={input.trim() ? `${styles.chatSendBtn} ${styles.chatSendBtnActive}` : styles.chatSendBtn}
          onClick={handleSend}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>

      <p className={styles.chatFootnote}>
        Human-assisted · GetStream powered (coming soon)
      </p>
    </div>
  );
}
