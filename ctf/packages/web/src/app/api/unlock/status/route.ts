import { NextResponse } from 'next/server';
import { requireUnlockUserAccess } from '@/src/app/api/unlock/_lib';
import { getUnlockStatusForUser, insertUnlockAudit } from '@/src/lib/unlock/repository';

export async function GET() {
  const gate = await requireUnlockUserAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const status = await getUnlockStatusForUser(gate.auth.userId);

    await insertUnlockAudit({
      actorUserId: gate.auth.userId,
      command: 'unlock.status.get',
      policyStatus: 'allow',
      reason: 'ok',
      targetUserId: gate.auth.userId,
      metadata: {
        accessTier: status.accessTier,
        reviewStatus: status.reviewStatus,
      },
    });

    return NextResponse.json({ ok: true, status });
  } catch {
    return NextResponse.json({ ok: false, message: 'Unlock status unavailable.' }, { status: 503 });
  }
}
