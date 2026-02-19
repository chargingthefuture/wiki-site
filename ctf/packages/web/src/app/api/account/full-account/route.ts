import type { ServiceDeletionResponse } from "@ctf/shared";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { recordFullAccountDeletionRequest } from "../../../../lib/server/chymeRepository";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await recordFullAccountDeletionRequest(userId);

  const response: ServiceDeletionResponse = {
    ok: true,
    scope: "account",
    deletedAtIso: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
