import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireFeedReadAccess } from '../../../feed/_lib';
import { FEED_ERROR_CODE } from '../lib/feed/constants';
import { logFeedAudit } from '../lib/feed/audit';
import { dismissAnnouncement } from '../lib/feed/repository';

type RouteParams = {
  params: Promise<{
    announcementId: string;
  }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const gate = await requireFeedReadAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const { announcementId } = await params;

  try {
    const outcome = await dismissAnnouncement(gate.auth.userId, announcementId);
    if (outcome === 'mandatory') {
      return NextResponse.json(
        {
          ok: false,
          code: FEED_ERROR_CODE.dismissNotAllowed,
          message: 'Mandatory announcements cannot be dismissed.',
        },
        { status: 409 },
      );
    }

    logFeedAudit({
      actorId: gate.auth.userId,
      pluginId: 'announcements',
      command: 'announcements.dismiss',
      status: 'allow',
      reason: 'dismiss_allowed',
      targetType: 'announcement',
      targetId: announcementId,
      result: 'success',
      errorCategory: null,
    });

    return NextResponse.json({ ok: true, announcementId }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to dismiss announcement.' },
      { status: 503 },
    );
  }
}
