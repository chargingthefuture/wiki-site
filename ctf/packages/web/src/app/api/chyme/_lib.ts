import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { evaluatePluginAccess, type AllowDecision } from '@/src/lib/auth/server-authz';

export type ChymeApiIdentity = {
  userId: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
};

export type ChymeApiGate =
  | {
    allowed: true;
    auth: AllowDecision;
    identity: ChymeApiIdentity;
  }
  | {
    allowed: false;
    response: NextResponse;
  };

function buildDisplayName(
  username: string | null,
  firstName: string | null,
  lastName: string | null,
  userId: string,
): string {
  if (username) {
    return `@${username}`;
  }

  const fullName = [firstName, lastName].filter((part) => typeof part === 'string' && part.length > 0).join(' ').trim();
  if (fullName.length > 0) {
    return fullName;
  }

  return `user-${userId.slice(0, 8)}`;
}

export async function requireChymeAccess(): Promise<ChymeApiGate> {
  const authDecision = await evaluatePluginAccess({
    allowUnlockSupportOnly: true,
    requireUsername: false,
    requireApprovedUserOrAdmin: false,
  });

  if (!authDecision.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(authDecision, { status: authDecision.status }),
    };
  }

  const user = await currentUser();

  const identity: ChymeApiIdentity = {
    userId: authDecision.userId,
    username: authDecision.username,
    displayName: buildDisplayName(
      authDecision.username,
      user?.firstName ?? null,
      user?.lastName ?? null,
      authDecision.userId,
    ),
    avatarUrl: user?.imageUrl ?? null,
  };

  return {
    allowed: true,
    auth: authDecision,
    identity,
  };
}
