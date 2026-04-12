import { NextResponse } from 'next/server';
import { CHYME_ERROR_CODE } from 'lib/chyme/constants';
import { logChymeAudit } from 'lib/chyme/audit';
import { getRoomState } from 'lib/chyme/repository';
import { requireChymeAccess } from '../_lib';

export async function GET() {
  const gate = await requireChymeAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const room = await getRoomState(gate.identity);
    logChymeAudit({
      pluginId: 'chyme',
      command: 'chyme.room.state.fetch',
      actorId: gate.auth.userId,
      status: 'allow',
      reason: 'approved_user_or_admin',
      target: {
        roomId: room.roomId,
        roomKey: room.roomKey,
      },
      result: 'success',
      errorCategory: null,
    });

    return NextResponse.json(room, { status: 200 });
  } catch {
    logChymeAudit({
      pluginId: 'chyme',
      command: 'chyme.room.state.fetch',
      actorId: gate.auth.userId,
      status: 'allow',
      reason: 'approved_user_or_admin',
      target: {},
      result: 'failure',
      errorCategory: 'persistence_error',
    });

    return NextResponse.json(
      {
        ok: false,
        code: CHYME_ERROR_CODE.persistenceUnavailable,
        message: 'Unable to load Chyme room state.',
      },
      { status: 503 },
    );
  }
}
