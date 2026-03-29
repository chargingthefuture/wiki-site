import { NextResponse } from 'next/server';
import { requireServiceCreditsReadAccess } from '@/src/app/api/service-credits/_lib';
import { getOrCreateWallet } from '@/src/lib/service-credits/repository';

export async function GET() {
  const gate = await requireServiceCreditsReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const wallet = await getOrCreateWallet(gate.auth.userId);
  return NextResponse.json({ ok: true, wallet }, { status: 200 });
}
