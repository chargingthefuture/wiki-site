import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireFeedAdminAccess } from '../../../feed/_lib';
import { FEED_ERROR_CODE } from '@/src/lib/feed/constants';
import { emitMembershipEvent } from '@/src/lib/feed/repository';
import type { MembershipEventType } from '@/src/lib/feed/types';

type MembershipBody = {
  userId?: string;
  pluginId?: string;
  eventType?: MembershipEventType;
  requestId?: string | null;
  traceId?: string | null;
};

function parseMembershipBody(body: MembershipBody) {
  return {
    userId: typeof body.userId === 'string' ? body.userId.trim() : '',
    pluginId: typeof body.pluginId === 'string' ? body.pluginId.trim() : '',
    eventType: body.eventType === 'leave' ? 'leave' : 'join',
    requestId: typeof body.requestId === 'string' ? body.requestId : null,
    traceId: typeof body.traceId === 'string' ? body.traceId : null,
  };
}

export async function POST(request: Request) {
  const gate = await requireFeedAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  let body: MembershipBody;
  try {
    body = (await request.json()) as MembershipBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const input = parseMembershipBody(body);
  if (!input.userId || !input.pluginId) {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'userId and pluginId are required.' },
      { status: 400 },
    );
  }

  try {
    const result = await emitMembershipEvent({
      actorId: gate.auth.userId,
      userId: input.userId,
      pluginId: input.pluginId,
      eventType: input.eventType,
      requestId: input.requestId,
      traceId: input.traceId,
    });

    return NextResponse.json({ ok: true, streamEmitted: result.streamEmitted }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to emit membership event.' },
      { status: 503 },
    );
  }
}
