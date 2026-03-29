import Link from 'next/link';
import {
  getFeedConfig,
  listAnnouncements,
  listFeedTimeline,
} from '@/src/lib/feed/repository';
import type { Announcement, FeedTimelineItem } from '@/src/lib/feed/types';

type FeedAnnouncementsShellProps = {
  userId: string;
  role: string | null;
  isAdmin: boolean;
};

function TimelineSection({ items, total }: { items: FeedTimelineItem[]; total: number }) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Feed Timeline</h2>
      <p className="text-sm text-muted-foreground">Showing {items.length} of {total} items.</p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="rounded border p-3 space-y-1">
            <p className="font-medium">{item.title}</p>
            <p className="text-muted-foreground">{item.body}</p>
            <p className="text-xs text-muted-foreground">
              {item.itemType} · priority {item.priority} · {item.mandatory ? 'mandatory' : 'optional'}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No feed items available yet.</li>
        ) : null}
      </ul>
    </section>
  );
}

function AnnouncementSection({ items }: { items: Announcement[] }) {
  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-lg font-medium">Announcements</h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="rounded border p-3">
            <p className="font-medium">{item.title}</p>
            <p className="text-muted-foreground">{item.body}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.status} · priority {item.priority}</p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No announcements yet.</li>
        ) : null}
      </ul>
    </section>
  );
}

export async function FeedAnnouncementsShell({ userId, role, isAdmin }: FeedAnnouncementsShellProps) {
  const timeline = await listFeedTimeline(userId, role, { page: 1, pageSize: 20 }, {});
  const announcements = await listAnnouncements(false);
  const config = await getFeedConfig();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Feed + Announcements</h1>
        <p className="text-sm text-muted-foreground">
          Combined timeline and announcement lifecycle surface.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-5 text-sm">
        <p><span className="font-medium">Render mode:</span> {config.renderMode}</p>
        <p><span className="font-medium">Kill switch:</span> {config.killSwitchEnabled ? 'enabled' : 'disabled'}</p>
      </section>

      <TimelineSection items={timeline.items} total={timeline.pagination.total} />
      <AnnouncementSection items={announcements} />

      {isAdmin ? (
        <section className="rounded-lg border bg-card p-5 text-sm space-y-2">
          <h2 className="text-lg font-medium">Admin Controls</h2>
          <p className="text-muted-foreground">
            Manage drafts, publish/archive lifecycle, targeting checks, and feed rendering at
            {' '}<Link className="underline underline-offset-4" href="/admin/feed-announcements">/admin/feed-announcements</Link>.
          </p>
        </section>
      ) : null}

      <p className="text-sm">
        <Link className="underline underline-offset-4" href="/">Return to home</Link>
      </p>
    </main>
  );
}
