import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireFeedAdminAccess } from '../../../feed/_lib';
import { FEED_ERROR_CODE } from '@/src/lib/feed/constants';
import { createAnnouncementDraft, validateAnnouncementDraftInput } from '@/src/lib/feed/repository';
import type { AnnouncementDraftInput } from '@/src/lib/feed/types';

type DraftBody = Partial<AnnouncementDraftInput>;

function parseBody(body: DraftBody): AnnouncementDraftInput {
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

export async function POST(request: Request) {
  const gate = await requireFeedAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  let body: DraftBody;
  try {
    body = (await request.json()) as DraftBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const input = parseBody(body);
  if (!validateAnnouncementDraftInput(input)) {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.invalidPayload, message: 'Invalid draft payload.' },
      { status: 400 },
    );
  }

  try {
    const announcement = await createAnnouncementDraft(gate.auth.userId, input);
    return NextResponse.json({ ok: true, announcement }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, code: FEED_ERROR_CODE.persistenceUnavailable, message: 'Unable to create draft.' },
      { status: 503 },
    );
  }
}
