import { NextRequest, NextResponse } from 'next/server';
import { requireLighthouseReadAccess } from '@/src/app/api/lighthouse/_lib';
import { LIGHTHOUSE_ERROR_CODE } from '@/src/lib/lighthouse/constants';
import { listAnnouncementsForLighthouseUser } from '@/src/lib/lighthouse/repository';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const gate = await requireLighthouseReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const page = parsePositiveInt(request.nextUrl.searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(request.nextUrl.searchParams.get('pageSize'), 20);

  try {
    const result = await listAnnouncementsForLighthouseUser({
      userId: gate.auth.userId,
      role: gate.auth.role,
      page,
      pageSize,
    });

    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: LIGHTHOUSE_ERROR_CODE.persistenceUnavailable, message: 'Announcement listing unavailable.' },
      { status: 503 },
    );
  }
}
