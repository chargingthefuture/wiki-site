import { NextResponse } from 'next/server';
import { createTransfer, insertServiceCreditsAudit } from '@/src/lib/service-credits/repository';
import { ensureMutationCsrf, requireServiceCreditsReadAccess, serviceCreditsErrorResponse } from '@/src/app/api/service-credits/_lib';

type TransferBody = {
  recipientUserId?: string;
  amount?: number;
  idempotencyKey?: string;
  originPlugin?: string;
  reasonCode?: string;
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

  let body: TransferBody;
  try {
    body = (await request.json()) as TransferBody;
  } catch {
    return NextResponse.json({ ok: false, code: 'service_credits_invalid_json', message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.recipientUserId || typeof body.amount !== 'number' || !body.idempotencyKey) {
    return NextResponse.json({ ok: false, code: 'service_credits_invalid_payload', message: 'recipientUserId, amount and idempotencyKey are required.' }, { status: 400 });
  }

  try {
    const transfer = await createTransfer({
      senderUserId: gate.auth.userId,
      recipientUserId: body.recipientUserId,
      amount: body.amount,
      idempotencyKey: body.idempotencyKey,
      originPlugin: typeof body.originPlugin === 'string' ? body.originPlugin : undefined,
      reasonCode: typeof body.reasonCode === 'string' ? body.reasonCode : undefined,
    });

    await insertServiceCreditsAudit({
      actorId: gate.auth.userId,
      command: 'service-credits.transfer.create',
      policyStatus: 'allow',
      reason: 'ok',
      targetType: 'transfer',
      targetId: transfer.id,
      metadata: {
        amount: transfer.amount,
        recipientUserId: transfer.recipientUserId,
        status: transfer.status,
        escrowHoldId: transfer.escrowHoldId,
      },
    });

    return NextResponse.json({ ok: true, transfer }, { status: 201 });
  } catch (error) {
    return serviceCreditsErrorResponse(error, 'Transfer unavailable.');
  }
}
