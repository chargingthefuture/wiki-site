import { NextResponse } from 'next/server';
import { requireLighthouseReadAccess } from '@/src/app/api/lighthouse/_lib';
import { LIGHTHOUSE_ERROR_CODE } from '@/src/lib/lighthouse/constants';
import { listMyProperties } from '@/src/lib/lighthouse/repository';

export async function GET() {
  const gate = await requireLighthouseReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const items = await listMyProperties(gate.auth.userId);
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.persistenceUnavailable, message: 'My property listing unavailable.' },
      { status: 503 },
    );
  }
}
