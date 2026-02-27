import type { ChymeRoomState } from "@ctf/shared";
import { NextResponse } from "next/server";
import { upsertAccessUserFromClerk } from "../../../../lib/server/accessRepository";
import { getChymeRoomState, upsertChymeProfileAndMember } from "../../../../lib/server/chymeRepository";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";

export async function GET() {
  const { auth, currentUser } = await getClerkServerModule();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const accessUser = await upsertAccessUserFromClerk({
    userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    profileImageUrl: user?.imageUrl ?? null,
  });

  if (!accessUser.isApproved && !accessUser.isAdmin) {
    return NextResponse.json({ error: "User is not approved" }, { status: 403 });
  }

  await upsertChymeProfileAndMember({
    userId,
    displayName: user?.firstName ?? user?.username ?? "Member",
    avatarUrl: user?.imageUrl ?? undefined,
    role: "listener",
  });

  const roomState: ChymeRoomState = await getChymeRoomState();

  return NextResponse.json(roomState);
}
