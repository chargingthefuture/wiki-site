import { NextResponse } from 'next/server';
import { requireTrustTransportProviderAccess, trustTransportErrorResponse } from 'lib/trusttransport/_lib';
import { listMyPayouts } from 'lib/trusttransport/repository';

export async function GET() {
  const gate = await requireTrustTransportProviderAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const items = await listMyPayouts(gate.auth.userId);
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (error) {
    return trustTransportErrorResponse(error, 'Payout listing unavailable.');
  }
}
