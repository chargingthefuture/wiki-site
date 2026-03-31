import { NextResponse } from 'next/server';
import { requireGdpReadAccess } from 'lib/gdp/_lib';
import { getLatestPublication } from 'lib/gdp/repository';

export async function GET() {
  const gate = await requireGdpReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const report = await getLatestPublication();
  return NextResponse.json({ ok: true, report }, { status: 200 });
}
