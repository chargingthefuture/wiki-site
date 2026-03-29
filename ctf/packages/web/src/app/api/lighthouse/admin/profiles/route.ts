import { NextRequest, NextResponse } from 'next/server';
import { requireLighthouseAdminAccess } from '@/src/app/api/lighthouse/_lib';
import { LIGHTHOUSE_ERROR_CODE } from '@/src/lib/lighthouse/constants';
import { listLighthouseProfiles } from '@/src/lib/lighthouse/repository';

export async function GET(request: NextRequest) {
  const gate = await requireLighthouseAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const rawType = request.nextUrl.searchParams.get('profileType');
  if (rawType && rawType !== 'seeker' && rawType !== 'host') {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.invalidPayload, message: 'profileType must be seeker or host.' },
      { status: 400 },
    );
  }

  try {
    const items = await listLighthouseProfiles(rawType === 'seeker' || rawType === 'host' ? rawType : undefined);
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.persistenceUnavailable, message: 'Profile listing unavailable.' },
      { status: 503 },
    );
  }
}
