import { NextResponse } from 'next/server';
import { evaluatePluginAccess } from 'lib/auth/server-authz';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminOnly = searchParams.get('adminOnly') === 'true';
  const requiredRoles = adminOnly ? ['admin'] : undefined;
  const decision = await evaluatePluginAccess({ requiredRoles });

  if (!decision.allowed) {
    return NextResponse.json(decision, { status: decision.status });
  }

  return NextResponse.json(
    {
      allowed: true,
      userId: decision.userId,
      requiredRoles: requiredRoles ?? [],
    },
    { status: 200 },
  );
}
