import { NextResponse } from "next/server";
import {
  updateUserApproval,
  upsertAccessUserFromClerk,
} from "../../../../../../lib/server/accessRepository";
import { getClerkServerModule } from "../../../../../../lib/server/clerkServer";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  if (!accessUser.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { isApproved?: unknown };
  if (typeof body.isApproved !== "boolean") {
    return NextResponse.json({ error: "isApproved must be a boolean" }, { status: 400 });
  }

  const { id } = await context.params;
  const updated = await updateUserApproval(id, body.isApproved);

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
