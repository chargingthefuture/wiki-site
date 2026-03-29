import { NextResponse } from 'next/server';
import { requireDirectoryReadAccess } from '../_lib';
import { DIRECTORY_ERROR_CODE } from '@/src/lib/directory/constants';
import { listTaxonomyJobTitles } from '@/src/lib/directory/repository';

export async function GET(request: Request) {
  const gate = await requireDirectoryReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const sectorId = new URL(request.url).searchParams.get('sectorId');

  try {
    const items = await listTaxonomyJobTitles(sectorId);
    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: DIRECTORY_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch job titles.' },
      { status: 503 },
    );
  }
}
