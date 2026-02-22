import type { ServiceDeletionResponse } from "@ctf/shared";
import { NextResponse } from "next/server";
import { deleteChymeProfileData } from "../../../../lib/server/chymeRepository";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";

export async function DELETE(request: Request) {
  const { auth } = await getClerkServerModule(request);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteChymeProfileData(userId);

  const response: ServiceDeletionResponse = {
    ok: true,
    scope: "service",
    serviceName: "chyme",
    deletedAtIso: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
