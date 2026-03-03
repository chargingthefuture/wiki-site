import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireWorkforceAdminAccess } from '../../_lib';
import { WORKFORCE_ERROR_CODE } from '@/src/lib/workforce/constants';
import { runIncrementalRecruitedSync } from '@/src/lib/workforce/repository';

type SyncBody = {
  batchSize?: number;
};

export async function POST(request: Request) {
  const gate = await requireWorkforceAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  let body: SyncBody = {};
  try {
    body = (await request.json()) as SyncBody;
  } catch {
    body = {};
  }

  try {
    const result = await runIncrementalRecruitedSync(gate.auth.userId, {
      batchSize: Number.isFinite(body.batchSize) ? Number(body.batchSize) : undefined,
      source: 'admin_sync_route',
    });

    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to run incremental sync.' },
      { status: 503 },
    );
  }
}
