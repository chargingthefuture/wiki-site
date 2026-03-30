import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireFeedAdminAccess } from '../../_lib';
import { FEED_ERROR_CODE } from '../lib/feed/constants';
import { getFeedConfig, updateFeedConfig, validateFeedConfigInput } from '../lib/feed/repository';
import { logFeedAudit } from '../lib/feed/audit';
import type { FeedConfigInput } from '../lib/feed/types';

type ConfigBody = Partial<FeedConfigInput>;

function parseBody(body: ConfigBody): FeedConfigInput {
  return {
    renderMode: body.renderMode === 'card_toast' ? 'card_toast' : 'card_only',
    killSwitchEnabled: Boolean(body.killSwitchEnabled),
    maxTimelinePageSize: Number(body.maxTimelinePageSize ?? 50),
  };
}

export async function GET() {
  const gate = await requireFeedAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const config = await getFeedConfig();
    return NextResponse.json({ config }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to fetch feed config.' },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const gate = await requireFeedAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  let body: ConfigBody;
  try {
    body = (await request.json()) as ConfigBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const input = parseBody(body);
  if (!validateFeedConfigInput(input)) {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid feed config payload.' },
      { status: 400 },
    );
  }

  try {
    const config = await updateFeedConfig(gate.auth.userId, input);
    logFeedAudit({
      actorId: gate.auth.userId,
      pluginId: 'feed',
      command: 'feed.admin.config.update',
      status: 'allow',
      reason: 'admin_update_allowed',
      targetType: 'feed_config',
      targetId: 'singleton',
      result: 'success',
      errorCategory: null,
    });

    return NextResponse.json({ ok: true, config }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to update feed config.' },
      { status: 503 },
    );
  }
}
