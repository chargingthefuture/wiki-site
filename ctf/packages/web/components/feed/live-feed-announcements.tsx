'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FeedConfig, FeedPagination, FeedTimelineItem } from '../../lib/feed/types';

type FeedFilter = 'all' | 'unread' | 'announcements' | 'alerts';

type FeedSnapshotResponse = {
  items: FeedTimelineItem[];
  pagination: FeedPagination;
};

type FeedConfigResponse = {
  config: FeedConfig;
};

type LiveFeedAnnouncementsProps = {
  initialItems: FeedTimelineItem[];
  initialConfig: FeedConfig | null;
  initialError: string | null;
  isAdmin: boolean;
};

function isAlertItem(item: FeedTimelineItem): boolean {
  return item.mandatory || item.priority >= 80;
}

function formatFeedTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  const diffMinutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  return date.toLocaleDateString();
}

async function loadFeedSnapshot(): Promise<{ items: FeedTimelineItem[]; config: FeedConfig | null }> {
  const [itemsResponse, configResponse] = await Promise.all([
    fetch('/api/feed/items?page=1&pageSize=24', { cache: 'no-store' }),
    fetch('/api/feed/config', { cache: 'no-store' }),
  ]);

  if (!itemsResponse.ok) {
    throw new Error('Unable to load live feed items.');
  }

  const timeline = await itemsResponse.json() as FeedSnapshotResponse;
  const config = configResponse.ok
    ? ((await configResponse.json()) as FeedConfigResponse).config
    : null;

  return {
    items: timeline.items,
    config,
  };
}

function getVisibleItems(items: FeedTimelineItem[], filter: FeedFilter): FeedTimelineItem[] {
  switch (filter) {
    case 'unread':
      return items.filter((item) => !item.isRead);
    case 'announcements':
      return items.filter((item) => item.itemType === 'announcement');
    case 'alerts':
      return items.filter(isAlertItem);
    case 'all':
    default:
      return items;
  }
}

export function LiveFeedAnnouncements({
  initialItems,
  initialConfig,
  initialError,
  isAdmin,
}: LiveFeedAnnouncementsProps) {
  const [items, setItems] = useState(initialItems);
  const [config, setConfig] = useState(initialConfig);
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [error, setError] = useState<string | null>(initialError);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  const refreshFeed = useCallback(async (showSpinner = false) => {
    if (showSpinner) {
      setIsRefreshing(true);
    }

    try {
      const snapshot = await loadFeedSnapshot();
      setItems(snapshot.items);
      setConfig(snapshot.config);
      setError(null);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to refresh the feed right now.');
    } finally {
      if (showSpinner) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void refreshFeed(initialItems.length === 0);
    const timer = window.setInterval(() => {
      void refreshFeed(false);
    }, 30000);

    return () => {
      window.clearInterval(timer);
    };
  }, [initialItems.length, refreshFeed]);

  const visibleItems = useMemo(() => getVisibleItems(items, filter), [filter, items]);
  const unreadCount = items.filter((item) => !item.isRead).length;
  const alertCount = items.filter(isAlertItem).length;

  const handleItemMutation = useCallback(async (itemId: string, action: 'read' | 'dismiss') => {
    setBusyItemId(itemId);
    setError(null);

    try {
      const response = await fetch(`/api/feed/items/${itemId}/${action}`, {
        method: 'POST',
        headers: {
          'x-ctf-csrf': '1',
        },
      });

      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.message ?? 'Unable to update the feed item.');
      }

      setItems((previous) => previous.flatMap((item) => {
        if (item.id !== itemId) {
          return [item];
        }

        if (action === 'dismiss' && !item.mandatory) {
          return [];
        }

        return [{ ...item, isRead: true }];
      }));
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Unable to update the feed item.');
    } finally {
      setBusyItemId(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#090b10] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#111827] via-[#0f172a] to-[#0c1424] p-5 shadow-lg shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Live community feed</p>
              <h1 className="mt-2 text-2xl font-semibold">Feed + Announcements</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                This timeline now reads from the live feed tables and refreshes automatically.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1">{items.length} live items</span>
              <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1">{unreadCount} unread</span>
              <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1">{alertCount} alerts</span>
              {config ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {config.renderMode === 'card_toast' ? 'Card + toast mode' : 'Card-only mode'}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {([
              ['all', 'All'],
              ['unread', 'Unread'],
              ['announcements', 'Announcements'],
              ['alerts', 'Alerts'],
            ] as Array<[FeedFilter, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  filter === value
                    ? 'bg-violet-500 text-white'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void refreshFeed(true)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
            >
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            {isAdmin ? (
              <Link
                href="/admin/feed-announcements"
                className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-200 hover:bg-violet-500/20"
              >
                Open admin
              </Link>
            ) : null}
          </div>
        </section>

        {error ? (
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4">
          {visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-slate-300">
              No live feed items match this filter yet.
            </div>
          ) : (
            visibleItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-[#0f172a]/80 p-5 shadow-md shadow-black/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-violet-200">
                        {item.itemType}
                      </span>
                      {!item.isRead ? (
                        <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-200">
                          Unread
                        </span>
                      ) : null}
                      {isAlertItem(item) ? (
                        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
                          Alert
                        </span>
                      ) : null}
                      {item.mandatory ? (
                        <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-200">
                          Mandatory
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                  <div className="text-xs text-slate-400 sm:text-right">
                    <p>{formatFeedTime(item.publishedAtIso)}</p>
                    <p className="mt-1">Priority {item.priority}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!item.isRead ? (
                    <button
                      type="button"
                      onClick={() => void handleItemMutation(item.id, 'read')}
                      disabled={busyItemId === item.id}
                      className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-100 hover:bg-sky-500/20 disabled:opacity-60"
                    >
                      {busyItemId === item.id ? 'Saving…' : 'Mark read'}
                    </button>
                  ) : null}
                  {!item.mandatory ? (
                    <button
                      type="button"
                      onClick={() => void handleItemMutation(item.id, 'dismiss')}
                      disabled={busyItemId === item.id}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-60"
                    >
                      Dismiss
                    </button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
