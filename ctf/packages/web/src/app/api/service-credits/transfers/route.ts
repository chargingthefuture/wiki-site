import { NextResponse } from 'next/server';
import { createTransfer, insertServiceCreditsAudit } from '@/src/lib/service-credits/repository';
import { ensureMutationCsrf, requireServiceCreditsReadAccess } from '@/src/app/api/service-credits/_lib';

type TransferBody = {
  recipientUserId?: string;
  amount?: number;
  idempotencyKey?: string;
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
    if (error instanceof Error && error.message === 'insufficient_balance') {
      return NextResponse.json({ ok: false, code: 'service_credits_insufficient_balance', message: 'Insufficient balance.' }, { status: 409 });
    }

    if (error instanceof Error && error.message === 'invalid_payload') {
      return NextResponse.json({ ok: false, code: 'service_credits_invalid_payload', message: 'Invalid transfer payload.' }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'transfer_conflict') {
      return NextResponse.json({ ok: false, code: 'service_credits_transfer_conflict', message: 'Unable to resolve idempotent transfer state.' }, { status: 409 });
    }

    if (error instanceof Error && error.message === 'external_ledger_not_configured') {
      return NextResponse.json(
        { ok: false, code: 'service_credits_external_ledger_not_configured', message: 'Formance ledger is not configured for Service Credits.' },
        { status: 503 },
      );
    }

    if (error instanceof Error && error.message === 'external_ledger_unavailable') {
      return NextResponse.json(
        { ok: false, code: 'service_credits_external_ledger_unavailable', message: 'Formance ledger rejected or failed the transfer posting.' },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: false, code: 'service_credits_unavailable', message: 'Transfer unavailable.' }, { status: 503 });
  }
}
