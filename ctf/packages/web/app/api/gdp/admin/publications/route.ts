import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireGdpAdminAccess } from '../app/api/gdp/_lib';
import { insertGdpAudit, upsertPublication } from '../lib/gdp/repository';

type PublicationBody = {
  weekStartDate?: string;
  title?: string;
  summary?: string;
  publish?: boolean;
  legalApproved?: boolean;
};

export async function POST(request: Request) {
  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const gate = await requireGdpAdminAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  let body: PublicationBody;
  try {
    body = (await request.json()) as PublicationBody;
  } catch {
    return NextResponse.json({ ok: false, code: 'gdp_invalid_json', message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.weekStartDate || !body.title || !body.summary) {
    return NextResponse.json({ ok: false, code: 'gdp_invalid_payload', message: 'weekStartDate, title, and summary are required.' }, { status: 400 });
  }

  if (Boolean(body.publish) && body.legalApproved !== true) {
    await insertGdpAudit({
      actorId: gate.auth.userId,
      command: 'gdp.publication.upsert',
      policyStatus: 'deny',
      reason: 'legal_approval_required',
      targetType: 'publication',
      targetId: body.weekStartDate,
      metadata: { publish: true, legalApproved: Boolean(body.legalApproved), weekStartDate: body.weekStartDate },
    });

    return NextResponse.json(
      { ok: false, code: 'gdp_legal_approval_required', message: 'Publishing requires legal approval.' },
      { status: 403 },
    );
  }

  const publication = await upsertPublication({
    actorId: gate.auth.userId,
    weekStartDate: body.weekStartDate,
    title: body.title,
    summary: body.summary,
    publish: Boolean(body.publish),
  });

  await insertGdpAudit({
    actorId: gate.auth.userId,
    command: 'gdp.publication.upsert',
    policyStatus: 'allow',
    reason: 'ok',
    targetType: 'publication',
    targetId: publication.id,
      metadata: { publish: Boolean(body.publish), legalApproved: Boolean(body.legalApproved), weekStartDate: body.weekStartDate },
  });

  return NextResponse.json({ ok: true, publication }, { status: 201 });
}
