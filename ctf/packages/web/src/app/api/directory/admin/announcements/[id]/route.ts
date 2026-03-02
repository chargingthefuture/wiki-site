import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireDirectoryAdminAccess } from '../../../_lib';
import { DIRECTORY_ERROR_CODE } from '@/src/lib/directory/constants';
import { deactivateAnnouncement, updateAnnouncement, validateAnnouncementInput } from '@/src/lib/directory/repository';
import type { DirectoryAnnouncementInput } from '@/src/lib/directory/types';

type RouteParams = { params: Promise<{ id: string }> };

type AnnouncementBody = Partial<DirectoryAnnouncementInput>;

function parseBody(body: AnnouncementBody): DirectoryAnnouncementInput {
  return {
    title: typeof body.title === 'string' ? body.title : '',
    body: typeof body.body === 'string' ? body.body : '',
    isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
    publishedAtIso: typeof body.publishedAtIso === 'string' ? body.publishedAtIso : undefined,
    expiresAtIso: typeof body.expiresAtIso === 'string' ? body.expiresAtIso : undefined,
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  const gate = await requireDirectoryAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const { id } = await params;

  let body: AnnouncementBody;
  try {
    body = (await request.json()) as AnnouncementBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: DIRECTORY_ERROR_CODE.invalidPayload, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const input = parseBody(body);
  if (!validateAnnouncementInput(input)) {
    return NextResponse.json(
      { ok: false, code: DIRECTORY_ERROR_CODE.invalidPayload, message: 'Invalid announcement payload.' },
      { status: 400 },
    );
  }

  try {
    const announcement = await updateAnnouncement(gate.auth.userId, id, input);
    if (!announcement) {
      return NextResponse.json(
        { ok: false, code: DIRECTORY_ERROR_CODE.notFound, message: 'Announcement not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, announcement }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: DIRECTORY_ERROR_CODE.persistenceUnavailable, message: 'Unable to update announcement.' },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const gate = await requireDirectoryAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const { id } = await params;

  try {
    const ok = await deactivateAnnouncement(gate.auth.userId, id);
    if (!ok) {
      return NextResponse.json(
        { ok: false, code: DIRECTORY_ERROR_CODE.notFound, message: 'Announcement not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: DIRECTORY_ERROR_CODE.persistenceUnavailable, message: 'Unable to deactivate announcement.' },
      { status: 503 },
    );
  }
}
