import type { ChymeChatMessage } from "@ctf/shared";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  insertChymeMessage,
  listChymeMessages,
  upsertChymeProfileAndMember,
} from "../../../../lib/server/chymeRepository";

export async function GET() {
  const messages: ChymeChatMessage[] = await listChymeMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string };
  const safeText = (body.text ?? "").trim();

  if (!safeText) {
    return NextResponse.json({ error: "Message text is required" }, { status: 400 });
  }

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

  const message: ChymeChatMessage = await insertChymeMessage({
    userId,
    authorDisplayName: user?.firstName ?? user?.username ?? "You",
    text: safeText,
  });

  return NextResponse.json(message, { status: 201 });
}
