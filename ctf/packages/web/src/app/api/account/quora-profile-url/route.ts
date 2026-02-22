import { NextResponse } from "next/server";
import {
  updateOwnQuoraProfileUrl,
  upsertAccessUserFromClerk,
} from "../../../../lib/server/accessRepository";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";

const normalizeQuoraUrl = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.includes("quora.com")) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
};

export async function PUT(request: Request) {
  const { auth, currentUser } = await getClerkServerModule(request);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

  await upsertAccessUserFromClerk({
    userId,
    email,
    firstName: clerkUser?.firstName ?? null,
    lastName: clerkUser?.lastName ?? null,
    profileImageUrl: clerkUser?.imageUrl ?? null,
  });

  const body = (await request.json()) as { quoraProfileUrl?: unknown };
  const quoraProfileUrl = normalizeQuoraUrl(body.quoraProfileUrl);

  if (!quoraProfileUrl) {
    return NextResponse.json(
      { error: "Please provide a valid Quora profile URL." },
      { status: 400 },
    );
  }

  const updated = await updateOwnQuoraProfileUrl(userId, quoraProfileUrl);
  return NextResponse.json(updated);
}
