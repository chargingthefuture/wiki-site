import { NextResponse } from 'next/server';
import { evaluatePluginAccess } from 'lib/auth/server-authz';
import { getTrustUserExtension } from 'lib/trust/repository';

export async function GET() {
  const decision = await evaluatePluginAccess({ requireUsername: false });
  if (!decision.allowed) {
    return NextResponse.json(decision, { status: decision.status });
  }

  const trust = await getTrustUserExtension(decision.userId);
  return NextResponse.json(trust, { status: 200 });
}
