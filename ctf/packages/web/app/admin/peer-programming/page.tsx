import { redirect } from 'next/navigation';
import { evaluatePluginAccess } from '../lib/auth/server-authz';
import { getPublishedWeeklyTopic } from '../lib/peer-programming/repository';

export default async function PeerProgrammingAdminPage() {
  const decision = await evaluatePluginAccess({ requireApprovedUserOrAdmin: true, requireUsername: false });
  if (!decision.allowed || !decision.isAdmin) {
    redirect('/apps/peer-programming');
  }

  const topic = await getPublishedWeeklyTopic();

  return [
    'Peer Programming Admin',
    `Topic: ${topic?.title ?? 'No topic published for current week'}`,
    `Status: ${topic?.status ?? 'n/a'}`,
    `Week start: ${topic?.weekStartDate ?? 'n/a'}`,
    'Admin APIs: GET/PUT /api/peer-programming/admin/topics, POST /api/peer-programming/admin/assignments/run',
  ].join('\n');
}
