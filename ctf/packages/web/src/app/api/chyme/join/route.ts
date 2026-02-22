import type { ChymeJoinCallResponse } from "@ctf/shared";
import { NextResponse } from "next/server";
import { upsertAccessUserFromClerk } from "../../../../lib/server/accessRepository";
import { chymeRoomId, upsertChymeProfileAndMember } from "../../../../lib/server/chymeRepository";
import {
  createStreamUserToken,
  provisionStreamUserAndChannel,
} from "../../../../lib/server/streamServer";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";

export async function POST(request: Request) {
  const { auth, currentUser } = await getClerkServerModule(request);
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
