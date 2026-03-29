import { NextResponse } from 'next/server';
import { requireWorkforceReadAccess } from '../_lib';
import { WORKFORCE_ERROR_CODE } from '@/src/lib/workforce/constants';
import { getDashboard } from '@/src/lib/workforce/repository';

export async function GET() {
  const gate = await requireWorkforceReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const dashboard = await getDashboard();
    return NextResponse.json({ dashboard }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to load dashboard.' },
      { status: 503 },
    );
  }
}
