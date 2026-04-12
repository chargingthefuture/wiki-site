import { NextResponse } from 'next/server';
import { createDispute, insertServiceCreditsAudit } from 'lib/service-credits/repository';
import { ensureMutationCsrf, requireServiceCreditsReadAccess } from 'lib/service-credits/_lib';

type DisputeBody = {
  transferId?: string;
  reason?: string;
};

export async function POST(request: Request) {
  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const gate = await requireServiceCreditsReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  let body: DisputeBody;
  try {
    body = (await request.json()) as DisputeBody;
  } catch {
    return NextResponse.json({ ok: false, code: 'service_credits_invalid_json', message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.transferId || !body.reason) {
    return NextResponse.json({ ok: false, code: 'service_credits_invalid_payload', message: 'transferId and reason are required.' }, { status: 400 });
  }

  const disputeId = await createDispute({ transferId: body.transferId, openedByUserId: gate.auth.userId, reason: body.reason });
  await insertServiceCreditsAudit({
    actorId: gate.auth.userId,
    command: 'service-credits.dispute.create',
    policyStatus: 'allow',
    reason: 'ok',
    targetType: 'dispute',
    targetId: disputeId,
  });

  return NextResponse.json({ ok: true, disputeId }, { status: 201 });
}
