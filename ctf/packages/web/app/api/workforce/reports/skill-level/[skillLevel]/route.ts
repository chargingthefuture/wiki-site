import { NextResponse } from 'next/server';
import { requireWorkforceReadAccess } from '../../../_lib';
import { WORKFORCE_ERROR_CODE } from '../lib/workforce/constants';
import { fetchSkillLevelReport } from '../lib/workforce/repository';

type RouteParams = {
  params: Promise<{
    skillLevel: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const gate = await requireWorkforceReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const { skillLevel } = await params;

  try {
    const items = await fetchSkillLevelReport();
    const bucket = items.find((item) => item.bucket === skillLevel.toLowerCase()) ?? null;
    return NextResponse.json({ bucket, items }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch skill-level report.' },
      { status: 503 },
    );
  }
}
