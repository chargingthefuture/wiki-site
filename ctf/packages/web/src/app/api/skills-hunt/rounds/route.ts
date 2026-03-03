import { NextResponse } from 'next/server';
import { requireSkillsHuntReadAccess } from '../_lib';
import { SKILLS_HUNT_ERROR_CODE } from '@/src/lib/skills-hunt/constants';
import { listRounds } from '@/src/lib/skills-hunt/repository';
import type { SkillsHuntRoundStatus } from '@/src/lib/skills-hunt/types';

function parseStatus(value: string | null): SkillsHuntRoundStatus | null {
  if (!value) {
    return null;
  }

  if (value === 'draft' || value === 'active' || value === 'closed' || value === 'archived') {
    return value;
  }

  return null;
}

export async function GET(request: Request) {
  const gate = await requireSkillsHuntReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const status = parseStatus(new URL(request.url).searchParams.get('status'));

  try {
    const rounds = await listRounds(status);
    return NextResponse.json({ rounds }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: SKILLS_HUNT_ERROR_CODE.persistenceUnavailable, message: 'Unable to load rounds.' },
      { status: 503 },
    );
  }
}
