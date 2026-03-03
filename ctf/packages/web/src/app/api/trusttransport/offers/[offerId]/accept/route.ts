import { NextResponse } from 'next/server';
import {
  ensureMutationCsrf,
  requireTrustTransportReadAccess,
  trustTransportErrorResponse,
} from '@/src/app/api/trusttransport/_lib';
import { TRUSTTRANSPORT_ERROR_CODE } from '@/src/lib/trusttransport/constants';
import { acceptOffer } from '@/src/lib/trusttransport/repository';

type RouteProps = {
  params: Promise<{ offerId: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const gate = await requireTrustTransportReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const { offerId } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, code: TRUSTTRANSPORT_ERROR_CODE.invalidPayload, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const requestId = typeof body.requestId === 'string' ? body.requestId : '';
  if (!requestId) {
    return NextResponse.json(
      { ok: false, code: TRUSTTRANSPORT_ERROR_CODE.invalidPayload, message: 'requestId is required.' },
      { status: 400 },
    );
  }

  const idempotencyKey = typeof body.idempotencyKey === 'string' && body.idempotencyKey.trim().length > 0
    ? body.idempotencyKey.trim()
    : `${gate.auth.userId}:${Date.now()}`;

  try {
    const result = await acceptOffer(requestId, offerId, gate.auth.userId, idempotencyKey);
    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch (error) {
    return trustTransportErrorResponse(error, 'Offer accept unavailable.');
  }
}
