import { NextResponse } from 'next/server';
import { requireLighthouseAdminAccess } from '@/src/app/api/lighthouse/_lib';
import { LIGHTHOUSE_ERROR_CODE } from '@/src/lib/lighthouse/constants';
import { listLighthouseProfiles } from '@/src/lib/lighthouse/repository';

export async function GET() {
  const gate = await requireLighthouseAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const items = await listLighthouseProfiles('host');
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.persistenceUnavailable, message: 'Host listing unavailable.' },
      { status: 503 },
    );
  }
}
