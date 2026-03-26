import type { NextRequest } from 'next/server';
import { getTrustUserExtension } from '@/src/lib/trust/repository';

// GET /api/trust/user/[userId]
export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;
  // TODO: Add auth/policy checks
  const trust = await getTrustUserExtension(userId);
  return Response.json(trust);
}
