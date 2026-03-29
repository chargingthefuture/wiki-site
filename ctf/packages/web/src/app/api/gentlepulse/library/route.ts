import { NextResponse } from 'next/server';
import { requireGentlePulseReadAccess } from '@/src/app/api/gentlepulse/_lib';
import { listLibraryItems } from '@/src/lib/gentlepulse/repository';

export async function GET() {
  const gate = await requireGentlePulseReadAccess();
  if ('response' in gate) {
    return gate.response;
  }

  const items = await listLibraryItems();
  return NextResponse.json({ ok: true, items }, { status: 200 });
}
