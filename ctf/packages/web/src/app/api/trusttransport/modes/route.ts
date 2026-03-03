import { NextResponse } from 'next/server';
import { listModes } from '@/src/lib/trusttransport/repository';

export async function GET() {
  const modes = await listModes();
  return NextResponse.json({ ok: true, modes }, { status: 200 });
}
