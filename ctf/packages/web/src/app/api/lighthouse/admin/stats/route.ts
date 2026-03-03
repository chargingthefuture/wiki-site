import { NextResponse } from 'next/server';
import { requireLighthouseAdminAccess } from '@/src/app/api/lighthouse/_lib';
import { LIGHTHOUSE_ERROR_CODE } from '@/src/lib/lighthouse/constants';
import { getLighthouseAdminStats } from '@/src/lib/lighthouse/repository';

export async function GET() {
  const gate = await requireLighthouseAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const stats = await getLighthouseAdminStats();
    return NextResponse.json({ ok: true, stats }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.persistenceUnavailable, message: 'Admin stats unavailable.' },
      { status: 503 },
    );
  }
}
