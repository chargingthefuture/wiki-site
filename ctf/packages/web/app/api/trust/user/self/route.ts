import type { NextRequest } from 'next/server';
import { getTrustUserExtension } from '../lib/trust/repository';

// GET /api/trust/user/self
export async function GET(req: NextRequest) {
  // TODO: Replace with real auth context
  const userId = 'self-placeholder';
  const trust = await getTrustUserExtension(userId);
  return Response.json(trust);
}
