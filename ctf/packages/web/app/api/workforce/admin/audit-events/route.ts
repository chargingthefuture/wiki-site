import { NextResponse } from 'next/server';
import { requireWorkforceAdminAccess } from '../../_lib';
import { WORKFORCE_ERROR_CODE } from '../lib/workforce/constants';
import { listAdminAuditEvents, parsePaginationParams } from '../lib/workforce/repository';

export async function GET(request: Request) {
  const gate = await requireWorkforceAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const pagination = parsePaginationParams(request.url);
    const result = await listAdminAuditEvents(pagination);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch audit events.' },
      { status: 503 },
    );
  }
}
