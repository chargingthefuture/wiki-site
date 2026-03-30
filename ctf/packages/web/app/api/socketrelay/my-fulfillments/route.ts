import { NextResponse } from 'next/server';
import { requireSocketRelayReadAccess, socketRelayErrorResponse } from '../app/api/socketrelay/_lib';
import { listMyFulfillments } from '../lib/socketrelay/repository';

export async function GET() {
  const gate = await requireSocketRelayReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const items = await listMyFulfillments(gate.auth.userId);
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (error) {
    return socketRelayErrorResponse(error, 'My fulfillments unavailable.');
  }
}
