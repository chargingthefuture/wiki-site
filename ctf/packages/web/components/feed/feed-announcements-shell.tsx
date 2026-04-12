import { getFeedConfig, listFeedTimeline } from 'lib/feed/repository';
import { LiveFeedAnnouncements } from './live-feed-announcements';

type FeedAnnouncementsShellProps = {
  userId: string;
  role: string | null;
  isAdmin: boolean;
};

export async function FeedAnnouncementsShell({ userId, role, isAdmin }: FeedAnnouncementsShellProps) {
  const [timeline, config] = await Promise.all([
    listFeedTimeline(userId, role, { page: 1, pageSize: 24 }, { pluginId: null }).catch(() => null),
    getFeedConfig().catch(() => null),
  ]);

  return (
    <LiveFeedAnnouncements
      initialItems={timeline?.items ?? []}
      initialConfig={config}
      initialError={timeline ? null : 'Live feed data is temporarily unavailable.'}
      isAdmin={isAdmin}
    />
  );
}
