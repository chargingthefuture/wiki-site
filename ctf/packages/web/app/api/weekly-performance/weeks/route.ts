import { NextResponse } from 'next/server';
import { requireWeeklyPerformanceReadAccess } from 'lib/weekly-performance/_lib';
import { listWeeks } from 'lib/weekly-performance/repository';

export async function GET() {
  const gate = await requireWeeklyPerformanceReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const weeks = await listWeeks();
  return NextResponse.json({ ok: true, weeks }, { status: 200 });
}
