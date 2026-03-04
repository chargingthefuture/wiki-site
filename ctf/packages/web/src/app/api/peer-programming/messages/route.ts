import { NextResponse } from 'next/server';
import { ensureMutationCsrf, peerProgrammingErrorResponse, requirePeerProgrammingReadAccess } from '@/src/app/api/peer-programming/_lib';
import { createMessage, insertPeerProgrammingAudit } from '@/src/lib/peer-programming/repository';
import type { PeerProgrammingTier } from '@/src/lib/peer-programming/types';

type CreateMessageBody = {
  cohortId?: string;
  body?: string;
  tier?: PeerProgrammingTier;
};

export async function POST(request: Request) {
  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const gate = await requirePeerProgrammingReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  let body: CreateMessageBody;
  try {
    body = (await request.json()) as CreateMessageBody;
  } catch {
    return NextResponse.json({ ok: false, code: 'peer_programming_invalid_json', message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.cohortId || !body.body) {
    return NextResponse.json({ ok: false, code: 'peer_programming_invalid_payload', message: 'cohortId and body are required.' }, { status: 400 });
  }

  try {
    const message = await createMessage({
      cohortId: body.cohortId,
      authorUserId: gate.auth.userId,
      body: body.body,
      tier: body.tier ?? 'cohort_member',
    });

    await insertPeerProgrammingAudit({
      actorId: gate.auth.userId,
      command: 'peer-programming.thread.post.create',
      policyStatus: 'allow',
      reason: 'ok',
      targetType: 'message',
      targetId: message.id,
    });

    return NextResponse.json({ ok: true, message }, { status: 201 });
  } catch (error) {
    return peerProgrammingErrorResponse(error, 'Message creation unavailable.');
  }
}
