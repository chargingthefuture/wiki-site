import type { ServiceDeletionResponse } from "@ctf/shared";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { recordFullAccountDeletionRequest } from "../../../../lib/server/chymeRepository";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";
import { enqueueServiceCreditsAccountDeletionReclaim } from "../../../../lib/server/serviceCreditsRepository";

export async function DELETE() {
  const { auth } = await getClerkServerModule();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletionRequestId = randomUUID();

  await recordFullAccountDeletionRequest(userId);
  await enqueueServiceCreditsAccountDeletionReclaim({ userId, deletionRequestId });

  const response: ServiceDeletionResponse = {
    ok: true,
    scope: "account",
    deletedAtIso: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
