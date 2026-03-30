import { NextResponse } from 'next/server';
import { requireWeeklyPerformanceReadAccess } from '../app/api/weekly-performance/_lib';
import { getCurrentWeek } from '../lib/weekly-performance/repository';
import { countActiveUsersLastDays } from '../lib/engagement/login-activity';

export async function GET() {
  const gate = await requireWeeklyPerformanceReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const [currentWeek, activeUsersLast7Days] = await Promise.all([
    getCurrentWeek(),
    countActiveUsersLastDays(7),
  ]);

  return NextResponse.json({ ok: true, currentWeek, activeUsersLast7Days }, { status: 200 });
}
