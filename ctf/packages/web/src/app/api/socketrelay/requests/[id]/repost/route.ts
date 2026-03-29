import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireSocketRelayReadAccess, socketRelayErrorResponse } from '@/src/app/api/socketrelay/_lib';
import { repostRequest } from '@/src/lib/socketrelay/repository';

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const gate = await requireSocketRelayReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const { id } = await params;

  try {
    const item = await repostRequest(id, gate.auth.userId, gate.auth.isAdmin);
    return NextResponse.json({ ok: true, item }, { status: 200 });
  } catch (error) {
    return socketRelayErrorResponse(error, 'Request repost unavailable.');
  }
}
