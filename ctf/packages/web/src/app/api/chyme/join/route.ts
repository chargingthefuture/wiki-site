import type { ChymeJoinCallResponse } from "@ctf/shared";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chymeRoomId, upsertChymeProfileAndMember } from "../../../../lib/server/chymeRepository";
import {
  createStreamUserToken,
  provisionStreamUserAndChannel,
} from "../../../../lib/server/streamServer";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const userName = user?.firstName ?? user?.username ?? "Member";

  await upsertChymeProfileAndMember({
    userId,
    displayName: userName,
    avatarUrl: user?.imageUrl ?? undefined,
    role: "listener",
  });

  const isProvisioned = await provisionStreamUserAndChannel({
    userId,
    userName,
    channelType: "messaging",
    channelId: chymeRoomId,
    channelName: "Chyme Main Room",
  });

  if (!isProvisioned) {
    return NextResponse.json({ error: "Stream server is not configured" }, { status: 503 });
  }

  const streamToken = createStreamUserToken(userId);
  if (!streamToken) {
    return NextResponse.json({ error: "Stream server is not configured" }, { status: 503 });
  }

  const response: ChymeJoinCallResponse = {
    ok: true,
    roomId: chymeRoomId,
    streamChannelId: chymeRoomId,
    streamCallType: "messaging",
    streamApiKey: streamToken.apiKey,
    streamToken: streamToken.token,
    streamUserId: userId,
    streamUserName: userName,
  };

  return NextResponse.json(response);
}
