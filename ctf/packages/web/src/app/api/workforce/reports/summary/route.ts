import { NextResponse } from 'next/server';
import { requireWorkforceReadAccess } from '../../_lib';
import { WORKFORCE_ERROR_CODE } from '@/src/lib/workforce/constants';
import { fetchSummaryReport } from '@/src/lib/workforce/repository';

export async function GET() {
  const gate = await requireWorkforceReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const summary = await fetchSummaryReport();
    return NextResponse.json({ summary }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch summary report.' },
      { status: 503 },
    );
  }
}
