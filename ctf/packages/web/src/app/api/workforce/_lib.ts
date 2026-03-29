import { NextResponse } from 'next/server';
import { evaluatePluginAccess, type AllowDecision } from '@/src/lib/auth/server-authz';
import { ensureWorkforceAdmin } from '@/src/lib/workforce/policy';
import { WORKFORCE_ERROR_CODE } from '@/src/lib/workforce/constants';
import { getAppUrl } from '@/src/lib/auth/clerk-env';

export type WorkforceApiGate =
  | {
    allowed: true;
    auth: AllowDecision;
  }
  | {
    allowed: false;
    response: NextResponse;
  };

export async function requireWorkforceReadAccess(): Promise<WorkforceApiGate> {
  const decision = await evaluatePluginAccess({ requireApprovedUserOrAdmin: true, requireUsername: false });
  if (!decision.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(decision, { status: decision.status }),
    };
  }

  return {
    allowed: true,
    auth: decision,
  };
}

export async function requireWorkforceAdminAccess(): Promise<WorkforceApiGate> {
  const decision = await evaluatePluginAccess({ requireUsername: false });
  if (!decision.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(decision, { status: decision.status }),
    };
  }

  const denyDecision = ensureWorkforceAdmin(decision);
  if (denyDecision) {
    return {
      allowed: false,
      response: NextResponse.json(denyDecision, { status: denyDecision.status }),
    };
  }

  return {
    allowed: true,
    auth: decision,
  };
}

export function ensureMutationCsrf(request: Request): NextResponse | null {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return null;
  }

  const csrfHeader = request.headers.get('x-ctf-csrf');
  if (csrfHeader !== '1') {
    return NextResponse.json(
      {
        ok: false,
        code: WORKFORCE_ERROR_CODE.csrfDenied,
        message: 'Missing CSRF confirmation header.',
      },
      { status: 403 },
    );
  }

  const appUrl = getAppUrl();
  const origin = request.headers.get('origin');

  if (!appUrl || !origin) {
    return null;
  }

  let appHost = '';
  let originHost = '';
  try {
    appHost = new URL(appUrl).host;
    originHost = new URL(origin).host;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: WORKFORCE_ERROR_CODE.csrfDenied,
        message: 'Invalid request origin metadata.',
      },
      { status: 403 },
    );
  }

  if (appHost !== originHost) {
    return NextResponse.json(
      {
        ok: false,
        code: WORKFORCE_ERROR_CODE.csrfDenied,
        message: 'Cross-origin mutation denied by CSRF policy.',
      },
      { status: 403 },
    );
  }

  return null;
}
