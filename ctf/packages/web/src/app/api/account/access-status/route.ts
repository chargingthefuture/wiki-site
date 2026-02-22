import { NextResponse } from "next/server";
import { upsertAccessUserFromClerk } from "../../../../lib/server/accessRepository";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";

export async function GET(request: Request) {
  const { auth, currentUser } = await getClerkServerModule(request);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

  const accessUser = await upsertAccessUserFromClerk({
    userId,
    email,
    firstName: clerkUser?.firstName ?? null,
    lastName: clerkUser?.lastName ?? null,
    profileImageUrl: clerkUser?.imageUrl ?? null,
  });

  return NextResponse.json(accessUser);
}
