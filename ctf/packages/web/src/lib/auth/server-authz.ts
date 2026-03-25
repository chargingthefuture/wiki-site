import { auth, currentUser } from '@clerk/nextjs/server';
import { getEffectiveUnlockAccessTier } from '@/src/lib/unlock/repository';
import type { UnlockAccessTier } from '@/src/lib/unlock/types';
import { pluginAuthDeny, type PluginDenyResponse } from './deny-taxonomy';

export type AllowDecision = {
  allowed: true;
  userId: string;
  username: string | null;
  role: string | null;
  isAdmin: boolean;
  isApproved: boolean;
  unlockAccessTier: UnlockAccessTier | null;
};

export type PluginAuthDecision = AllowDecision | PluginDenyResponse;

type EvaluatePluginAccessOptions = {
  requiredRoles?: string[];
  requireUsername?: boolean;
  requireApprovedUserOrAdmin?: boolean;
  allowUnlockSupportOnly?: boolean;
};

function normalizeUsername(username: string | null | undefined): string | null {
  if (!username) {
    return null;
  }

  const trimmedUsername = username.trim();
  return trimmedUsername.length > 0 ? trimmedUsername : null;
}

function buildAllowDecision(
  userId: string,
  username: string | null,
  role: string | null,
  isApproved: boolean,
  unlockAccessTier: UnlockAccessTier | null,
): AllowDecision {
  return {
    allowed: true,
    userId,
    username,
    role,
    isAdmin: role === 'admin',
    isApproved,
    unlockAccessTier,
  };
}

function denyIfUsernameRequired(
  requireUsername: boolean,
  username: string | null,
): PluginDenyResponse | null {
  if (requireUsername && !username) {
    return pluginAuthDeny.forbiddenPolicy('missing_username');
  }

  return null;
}

function denyIfRoleMissing(
  requiredRoles: string[] | undefined,
  claims: unknown,
): PluginDenyResponse | null {
  if (!requiredRoles || requiredRoles.length === 0) {
    return null;
  }

  const role = extractRole(claims);
  const normalizedRequiredRoles = requiredRoles
    .map((requiredRole) => normalizeRole(requiredRole))
    .filter((requiredRole): requiredRole is string => Boolean(requiredRole));

  if (!role || !normalizedRequiredRoles.includes(role)) {
    return pluginAuthDeny.forbiddenRole(requiredRoles);
  }

  return null;
}

function normalizeRole(role: string | null | undefined): string | null {
  if (!role) {
    return null;
  }

  const normalizedRole = role.trim().toLowerCase();
  return normalizedRole.length > 0 ? normalizedRole : null;
}

function extractRole(claims: unknown): string | null {
  if (!claims || typeof claims !== 'object') {
    return null;
  }

  const sessionClaims = claims as {
    publicMetadata?: { role?: unknown };
  };

  if (typeof sessionClaims.publicMetadata?.role === 'string') {
    return normalizeRole(sessionClaims.publicMetadata.role);
  }

  return null;
}

function parseApprovedValue(approvedCandidate: unknown): boolean {
  if (typeof approvedCandidate === 'boolean') {
    return approvedCandidate;
  }

  if (typeof approvedCandidate === 'string') {
    const normalized = approvedCandidate.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  if (typeof approvedCandidate === 'number') {
    return approvedCandidate === 1;
  }

  return false;
}

function getApprovedCandidate(user: unknown): unknown {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const typedUser = user as {
    publicMetadata?: { approved?: unknown };
    privateMetadata?: { approved?: unknown };
    unsafeMetadata?: { approved?: unknown };
  };

  return (
    typedUser.publicMetadata?.approved
    ?? typedUser.privateMetadata?.approved
    ?? typedUser.unsafeMetadata?.approved
  );
}

function isApprovedFromUser(user: unknown): boolean {
  return parseApprovedValue(getApprovedCandidate(user));
}

function denyIfApprovalMissing(
  requireApprovedUserOrAdmin: boolean,
  role: string | null,
  isApproved: boolean,
): PluginDenyResponse | null {
  if (!requireApprovedUserOrAdmin) {
    return null;
  }

  if (role === 'admin' || isApproved) {
    return null;
  }

  return pluginAuthDeny.forbiddenPolicy('policy_denied');
}

function denyIfUnlockSupportOnly(
  allowUnlockSupportOnly: boolean,
  role: string | null,
  unlockAccessTier: UnlockAccessTier | null,
): PluginDenyResponse | null {
  if (allowUnlockSupportOnly) {
    return null;
  }

  if (role === 'admin') {
    return null;
  }

  if (unlockAccessTier === 'locked_support_only') {
    return pluginAuthDeny.forbiddenPolicy('unlock_support_only');
  }

  return null;
}

export async function evaluatePluginAccess(
  options: EvaluatePluginAccessOptions = {},
): Promise<PluginAuthDecision> {
  const {
    requiredRoles,
    requireUsername = false,
    requireApprovedUserOrAdmin = false,
    allowUnlockSupportOnly = false,
  } = options;
  const session = await auth();

  if (!session.userId) {
    return pluginAuthDeny.unauthorized();
  }

  const user = await currentUser();
  const username = normalizeUsername(user?.username);
  const role = extractRole(session.sessionClaims);
  const isApproved = isApprovedFromUser(user);
  const unlockAccessTier = await getEffectiveUnlockAccessTier(session.userId);

  const usernameDenyDecision = denyIfUsernameRequired(requireUsername, username);
  if (usernameDenyDecision) {
    return usernameDenyDecision;
  }

  const roleDenyDecision = denyIfRoleMissing(requiredRoles, session.sessionClaims);
  if (roleDenyDecision) {
    return roleDenyDecision;
  }

  const unlockTierDenyDecision = denyIfUnlockSupportOnly(allowUnlockSupportOnly, role, unlockAccessTier);
  if (unlockTierDenyDecision) {
    return unlockTierDenyDecision;
  }

  const approvalDenyDecision = denyIfApprovalMissing(requireApprovedUserOrAdmin, role, isApproved);
  if (approvalDenyDecision) {
    return approvalDenyDecision;
  }

  return buildAllowDecision(session.userId, username, role, isApproved, unlockAccessTier);
}
