import { NextResponse } from 'next/server';
import { evaluatePluginAccess } from '@/src/lib/auth/server-authz';
import { markFullAccountDeletionRequested } from '@/src/lib/chyme/repository';
import { logChymeAudit } from '@/src/lib/chyme/audit';
import { CHYME_ERROR_CODE } from '@/src/lib/chyme/constants';

export async function DELETE() {
  const decision = await evaluatePluginAccess({
    requireUsername: false,
    requireApprovedUserOrAdmin: false,
    allowUnlockSupportOnly: true,
  });
  if (!decision.allowed) {
    return NextResponse.json(decision, { status: decision.status });
  }

  try {
    const deletion = await markFullAccountDeletionRequested(decision.userId);

    logChymeAudit({
      pluginId: 'chyme',
      command: 'account.profile.delete.full',
      actorId: decision.userId,
      status: 'allow',
      reason: 'account_deletion_requested',
      target: {
        scope: 'account',
      },
      result: 'success',
      errorCategory: null,
    });

    return NextResponse.json(deletion, { status: 202 });
  } catch {
    logChymeAudit({
      pluginId: 'chyme',
      command: 'account.profile.delete.full',
      actorId: decision.userId,
      status: 'allow',
      reason: 'account_deletion_requested',
      target: {
        scope: 'account',
      },
      result: 'failure',
      errorCategory: 'persistence_error',
    });

    return NextResponse.json(
      {
        ok: false,
        code: CHYME_ERROR_CODE.persistenceUnavailable,
        message: 'Unable to record full-account deletion request.',
      },
      { status: 503 },
    );
  }
}
