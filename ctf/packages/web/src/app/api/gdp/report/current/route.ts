import { NextResponse } from 'next/server';
import { requireGdpReadAccess } from '@/src/app/api/gdp/_lib';
import { getLatestPublication } from '@/src/lib/gdp/repository';

export async function GET() {
  const gate = await requireGdpReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const report = await getLatestPublication();
  return NextResponse.json({ ok: true, report }, { status: 200 });
}
