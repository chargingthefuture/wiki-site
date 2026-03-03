import { NextResponse } from 'next/server';
import { requireTrustTransportAdminAccess, trustTransportErrorResponse } from '@/src/app/api/trusttransport/_lib';
import { listAuditEvents } from '@/src/lib/trusttransport/repository';

export async function GET() {
  const gate = await requireTrustTransportAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const items = await listAuditEvents();
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (error) {
    return trustTransportErrorResponse(error, 'Audit events unavailable.');
  }
}
