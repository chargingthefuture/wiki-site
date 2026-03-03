import { NextResponse } from 'next/server';
import { WORKFORCE_ERROR_CODE } from '@/src/lib/workforce/constants';
import { runIncrementalRecruitedSync } from '@/src/lib/workforce/repository';

type SyncBody = {
  batchSize?: number;
};

function isAuthorized(request: Request): boolean {
  const configuredToken = process.env.WORKFORCE_SYNC_TOKEN;
  if (!configuredToken || configuredToken.trim().length === 0) {
    return false;
  }

  const providedToken = request.headers.get('x-workforce-sync-token') ?? '';
  return providedToken.length > 0 && providedToken === configuredToken;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.invalidSyncToken, message: 'Invalid workforce sync token.' },
      { status: 403 },
    );
  }

  let body: SyncBody = {};
  try {
    body = (await request.json()) as SyncBody;
  } catch {
    body = {};
  }

  try {
    const result = await runIncrementalRecruitedSync(null, {
      batchSize: Number.isFinite(body.batchSize) ? Number(body.batchSize) : undefined,
      source: 'internal_token_sync',
    });

    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to run internal incremental sync.' },
      { status: 503 },
    );
  }
}
