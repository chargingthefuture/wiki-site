import { NextResponse } from "next/server";
import { listAccessUsers, upsertAccessUserFromClerk } from "../../../../lib/server/accessRepository";
import { getClerkServerModule } from "../../../../lib/server/clerkServer";

export async function GET() {
  const { auth, currentUser } = await getClerkServerModule();
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

  if (!accessUser.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await listAccessUsers();
  return NextResponse.json(users);
}
