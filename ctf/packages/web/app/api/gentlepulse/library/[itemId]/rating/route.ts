import { NextResponse } from 'next/server';
import { ensureMutationCsrf, requireGentlePulseWriteAccess } from '../app/api/gentlepulse/_lib';
import { upsertRating } from '../lib/gentlepulse/repository';

type ItemParams = {
  params: Promise<{ itemId: string }>;
};

type RatingBody = {
  rating?: number;
};

export async function PUT(request: Request, context: ItemParams) {
  const csrfDeny = ensureMutationCsrf(request);
  if (csrfDeny) {
    return csrfDeny;
  }

  const gate = await requireGentlePulseWriteAccess();
  if (!gate.allowed) {
    return gate.response;
  }

  let body: RatingBody;
  try {
    body = (await request.json()) as RatingBody;
  } catch {
    return NextResponse.json({ ok: false, code: 'gentlepulse_invalid_json', message: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body.rating !== 'number') {
    return NextResponse.json({ ok: false, code: 'gentlepulse_invalid_payload', message: 'rating is required.' }, { status: 400 });
  }

  const { itemId } = await context.params;

  try {
    await upsertRating({ userId: gate.auth.userId, itemId, rating: body.rating });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, code: 'gentlepulse_invalid_payload', message: 'Invalid rating payload.' }, { status: 400 });
  }
}
