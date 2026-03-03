import { NextResponse } from 'next/server';
import { requireSkillsHuntReadAccess } from '../../../_lib';
import { SKILLS_HUNT_ERROR_CODE } from '@/src/lib/skills-hunt/constants';
import { listLeaderboard } from '@/src/lib/skills-hunt/repository';
import type { SkillsHuntLeaderboardMode } from '@/src/lib/skills-hunt/types';

function parseMode(value: string | null): SkillsHuntLeaderboardMode {
  return value === 'team' ? 'team' : 'individual';
}

export async function GET(request: Request, { params }: { params: Promise<{ roundId: string }> }) {
  const gate = await requireSkillsHuntReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const { roundId } = await params;
  const mode = parseMode(new URL(request.url).searchParams.get('mode'));

  try {
    const items = await listLeaderboard(roundId, mode);
    return NextResponse.json({ mode, items, generatedAtIso: new Date().toISOString() }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: SKILLS_HUNT_ERROR_CODE.persistenceUnavailable, message: 'Unable to load leaderboard.' },
      { status: 503 },
    );
  }
}
