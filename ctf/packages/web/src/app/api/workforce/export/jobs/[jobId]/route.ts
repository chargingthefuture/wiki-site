import { NextResponse } from 'next/server';
import { requireWorkforceAdminAccess } from '../../../_lib';
import { WORKFORCE_ERROR_CODE } from '@/src/lib/workforce/constants';
import { getExportJobById } from '@/src/lib/workforce/repository';

type RouteParams = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const gate = await requireWorkforceAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const { jobId } = await params;

  try {
    const job = await getExportJobById(jobId);
    if (!job) {
      return NextResponse.json(
        { ok: false, code: WORKFORCE_ERROR_CODE.notFound, message: 'Export job not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: WORKFORCE_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch export job.' },
      { status: 503 },
    );
  }
}
