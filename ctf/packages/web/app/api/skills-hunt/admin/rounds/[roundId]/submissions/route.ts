import { NextResponse } from 'next/server';
import { requireSkillsHuntModeratorAccess } from '../../../../_lib';
import { SKILLS_HUNT_ERROR_CODE } from '../lib/skills-hunt/constants';
import { listSubmissions, parsePaginationParams } from '../lib/skills-hunt/repository';

export async function GET(request: Request, { params }: { params: Promise<{ roundId: string }> }) {
  const gate = await requireSkillsHuntModeratorAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const { roundId } = await params;
  const status = new URL(request.url).searchParams.get('status');

  try {
    const pagination = parsePaginationParams(request.url);
    const result = await listSubmissions(roundId, status, pagination, {
      userId: gate.auth.userId,
      isModeratorOrAdmin: true,
    });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: SKILLS_HUNT_ERROR_CODE.persistenceUnavailable, message: 'Unable to list submissions.' },
      { status: 503 },
    );
  }
}
