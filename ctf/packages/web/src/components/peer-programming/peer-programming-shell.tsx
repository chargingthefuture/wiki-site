import { getMyCohort, getPublishedWeeklyTopic, listMessages } from '@/src/lib/peer-programming/repository';

type PeerProgrammingShellProps = {
  userId: string;
  isAdmin: boolean;
};

export async function PeerProgrammingShell({ userId, isAdmin }: PeerProgrammingShellProps) {
  const [topic, cohort] = await Promise.all([getPublishedWeeklyTopic(), getMyCohort(userId)]);
  const messages = cohort ? await listMessages(cohort.id) : [];

  return [
    'Peer Programming',
    `Topic: ${topic?.title ?? 'No published topic'}`,
    `Cohort: ${cohort?.cohortLabel ?? 'Fallback open'}`,
    `Messages: ${messages.length}`,
    `Week start: ${cohort?.weekStartDate ?? 'current'}`,
    `Fallback open: ${cohort?.fallbackOpen ? 'yes' : 'no'}`,
    `Admin access: ${isAdmin ? 'yes (/admin/peer-programming)' : 'no'}`,
  ].join('\n');
}
