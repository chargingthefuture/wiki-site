import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireFeedAdminAccess } from '../../_lib';
import { FEED_ERROR_CODE } from '@/src/lib/feed/constants';
import { createAnnouncementDraft, listAnnouncements, validateAnnouncementDraftInput } from '@/src/lib/feed/repository';
import { logFeedAudit } from '@/src/lib/feed/audit';
import type { AnnouncementDraftInput } from '@/src/lib/feed/types';

type AnnouncementBody = Partial<AnnouncementDraftInput>;

function parseBody(body: AnnouncementBody): AnnouncementDraftInput {
  return {
    title: typeof body.title === 'string' ? body.title : '',
    body: typeof body.body === 'string' ? body.body : '',
    priority: typeof body.priority === 'number' ? body.priority : 0,
    mandatory: typeof body.mandatory === 'boolean' ? body.mandatory : false,
    scheduleAtIso: typeof body.scheduleAtIso === 'string' ? body.scheduleAtIso : null,
    expiresAtIso: typeof body.expiresAtIso === 'string' ? body.expiresAtIso : null,
    targeting: body.targeting,
  };
}

export async function GET() {
  const gate = await requireFeedAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  try {
    const announcements = await listAnnouncements(true);
    return NextResponse.json({ items: announcements }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to list announcements.' },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const gate = await requireFeedAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  let body: AnnouncementBody;
  try {
    body = (await request.json()) as AnnouncementBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const input = parseBody(body);
  if (!validateAnnouncementDraftInput(input)) {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid announcement draft payload.' },
      { status: 400 },
    );
  }

  try {
    const announcement = await createAnnouncementDraft(gate.auth.userId, input);
    logFeedAudit({
      actorId: gate.auth.userId,
      pluginId: 'announcements',
      command: 'announcements.draft.create',
      status: 'allow',
      reason: 'admin_authoring_allowed',
      targetType: 'announcement',
      targetId: announcement.id,
      result: 'success',
      errorCategory: null,
    });
    return NextResponse.json({ ok: true, announcement }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to create announcement draft.' },
      { status: 503 },
    );
  }
}
