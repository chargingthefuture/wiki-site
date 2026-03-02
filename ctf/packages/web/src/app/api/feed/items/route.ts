import { NextResponse } from 'next/server';
import { requireFeedReadAccess } from '../_lib';
import { FEED_ERROR_CODE } from '@/src/lib/feed/constants';
import { listFeedTimeline, parsePaginationParams } from '@/src/lib/feed/repository';

export async function GET(request: Request) {
  const gate = await requireFeedReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const pagination = parsePaginationParams(request.url);
  const params = new URL(request.url).searchParams;
  const pluginId = params.get('pluginId');

  try {
    const payload = await listFeedTimeline(
      gate.auth.userId,
      gate.auth.role,
      pagination,
      { pluginId },
    );

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch feed timeline.' },
      { status: 503 },
    );
  }
}
