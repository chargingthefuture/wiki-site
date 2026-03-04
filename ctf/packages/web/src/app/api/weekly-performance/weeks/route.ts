import { NextResponse } from 'next/server';
import { requireWeeklyPerformanceReadAccess } from '@/src/app/api/weekly-performance/_lib';
import { listWeeks } from '@/src/lib/weekly-performance/repository';

export async function GET() {
  const gate = await requireWeeklyPerformanceReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const weeks = await listWeeks();
  return NextResponse.json({ ok: true, weeks }, { status: 200 });
}
