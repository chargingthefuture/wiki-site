import { NextResponse } from 'next/server';
import { requirePeerProgrammingReadAccess, peerProgrammingErrorResponse } from '../app/api/peer-programming/_lib';
import { getMyCohort, getPublishedWeeklyTopic, listMessages } from '../lib/peer-programming/repository';

export async function GET() {
  const gate = await requirePeerProgrammingReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const [topic, cohort] = await Promise.all([
      getPublishedWeeklyTopic(),
      getMyCohort(gate.auth.userId),
    ]);

    const messages = cohort ? await listMessages(cohort.id) : [];

    return NextResponse.json({
      ok: true,
      topic,
      cohort,
      messages,
      fallbackOpen: cohort?.fallbackOpen ?? true,
    });
  } catch (error) {
    return peerProgrammingErrorResponse(error, 'Peer programming room unavailable.');
  }
}
