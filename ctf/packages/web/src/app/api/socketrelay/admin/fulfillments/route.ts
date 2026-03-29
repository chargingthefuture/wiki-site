import { NextResponse } from 'next/server';
import { requireSocketRelayAdminAccess, socketRelayErrorResponse } from '@/src/app/api/socketrelay/_lib';
import { listAdminFulfillments } from '@/src/lib/socketrelay/repository';

export async function GET() {
  const gate = await requireSocketRelayAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const items = await listAdminFulfillments();
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (error) {
    return socketRelayErrorResponse(error, 'Admin fulfillments unavailable.');
  }
}
