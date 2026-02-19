import type { ChymeRoomState } from "@ctf/shared";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getChymeRoomState, upsertChymeProfileAndMember } from "../../../../lib/server/chymeRepository";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();

  await upsertChymeProfileAndMember({
    userId,
    displayName: user?.firstName ?? user?.username ?? "Member",
    avatarUrl: user?.imageUrl ?? undefined,
    role: "listener",
  });

  const roomState: ChymeRoomState = await getChymeRoomState();

  return NextResponse.json(roomState);
}
