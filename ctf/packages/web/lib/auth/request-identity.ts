import { cookies, headers } from 'next/headers';
import type { UnlockAccessTier } from 'lib/unlock/types';

type MaybeValue = string | null | undefined;

export type RequestIdentity = {
  userId: string;
  username: string | null;
  role: string | null;
  isApproved: boolean;
  unlockAccessTier: UnlockAccessTier | null;
};

const DEFAULT_USER_ID = 'local_user';
const DEFAULT_USERNAME = 'local_user';
const DEFAULT_ROLE = 'admin';

function pickFirstNonEmpty(...values: MaybeValue[]): string | null {
  for (const value of values) {
    if (typeof value === 'string') {
      const normalized = value.trim();
      if (normalized.length > 0) {
        return normalized;
      }
    }
  }

  return null;
}

function normalizeRole(value: MaybeValue): string | null {
  const normalized = pickFirstNonEmpty(value);
  return normalized ? normalized.toLowerCase() : null;
}

function normalizeBoolean(value: MaybeValue): boolean | null {
  const normalized = pickFirstNonEmpty(value)?.toLowerCase();
  if (!normalized) return null;
  if (['1', 'true', 'yes', 'approved'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'denied'].includes(normalized)) return false;
  return null;
}

function normalizeUnlockAccessTier(value: MaybeValue): UnlockAccessTier | null {
  const normalized = pickFirstNonEmpty(value);
  if (
    normalized === 'pending_readonly'
    || normalized === 'locked_support_only'
    || normalized === 'approved_full'
  ) {
    return normalized;
  }

  return null;
}

function readIdentityValue(
  headerName: string,
  cookieName: string,
  headerStore: Headers,
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): string | null {
  return pickFirstNonEmpty(
    headerStore.get(headerName),
    cookieStore.get(cookieName)?.value,
  );
}

export async function resolveRequestIdentity(): Promise<RequestIdentity> {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const userId = readIdentityValue('x-ctf-user-id', 'ctf_user_id', headerStore, cookieStore) ?? DEFAULT_USER_ID;
  const username = readIdentityValue('x-ctf-username', 'ctf_username', headerStore, cookieStore) ?? DEFAULT_USERNAME;
  const role = normalizeRole(
    readIdentityValue('x-ctf-user-role', 'ctf_user_role', headerStore, cookieStore) ?? DEFAULT_ROLE,
  );
  const isApproved = normalizeBoolean(
    readIdentityValue('x-ctf-user-approved', 'ctf_user_approved', headerStore, cookieStore),
  ) ?? true;
  const unlockAccessTier = normalizeUnlockAccessTier(
    readIdentityValue('x-ctf-unlock-tier', 'ctf_unlock_tier', headerStore, cookieStore),
  );

  return {
    userId,
    username,
    role,
    isApproved,
    unlockAccessTier,
  };
}

export function buildIdentityDisplayName(username: string | null, userId: string): string {
  if (username) {
    return `@${username}`;
  }

  return `user-${userId.slice(0, 8)}`;
}
