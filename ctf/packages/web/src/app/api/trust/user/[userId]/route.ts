import type { NextRequest } from 'next/server';
import { getTrustUserExtension } from '@/src/lib/trust/repository';

// GET /api/trust/user/[userId]
export async function GET(req: NextRequest, context: unknown) {
  const { userId } = (context as { params: { userId: string } }).params;
  // TODO: Add auth/policy checks
  const trust = await getTrustUserExtension(userId);
  return Response.json(trust);
}
