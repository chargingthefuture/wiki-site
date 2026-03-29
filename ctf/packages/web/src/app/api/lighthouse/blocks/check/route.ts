import { NextRequest, NextResponse } from 'next/server';
import { requireLighthouseReadAccess } from '@/src/app/api/lighthouse/_lib';
import { LIGHTHOUSE_ERROR_CODE } from '@/src/lib/lighthouse/constants';
import { isBlockedPair } from '@/src/lib/lighthouse/repository';

export async function GET(request: NextRequest) {
  const gate = await requireLighthouseReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const blockedUserId = request.nextUrl.searchParams.get('blockedUserId')?.trim() ?? '';
  if (!blockedUserId) {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.invalidPayload, message: 'blockedUserId query parameter is required.' },
      { status: 400 },
    );
  }

  try {
    const blocked = await isBlockedPair(gate.auth.userId, blockedUserId);
    return NextResponse.json({ ok: true, blocked }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.persistenceUnavailable, message: 'Block check unavailable.' },
      { status: 503 },
    );
  }
}
