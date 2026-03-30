import { NextResponse } from 'next/server';
import {
  ensureMutationCsrf,
  requireTrustTransportReadAccess,
  trustTransportErrorResponse,
} from '../app/api/trusttransport/_lib';
import { triggerEmergencyStop } from '../lib/trusttransport/repository';

type RouteProps = {
  params: Promise<{ tripId: string }>;
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

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
  }

  const notes = typeof body.notes === 'string' ? body.notes : null;
  const { tripId } = await params;

  try {
    const result = await triggerEmergencyStop(tripId, gate.auth.userId, gate.auth.isAdmin, notes);
    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch (error) {
    return trustTransportErrorResponse(error, 'Emergency stop unavailable.');
  }
}
