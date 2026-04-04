// Clerk imports removed - auth disabled
// import { auth, currentUser } from '@clerk/nextjs/server';
import type { UnlockAccessTier } from 'lib/unlock/types';
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

export async function evaluatePluginAccess(
  options: EvaluatePluginAccessOptions = {},
): Promise<PluginAuthDecision> {
  const {
    requiredRoles,
    requireUsername = false,
    requireApprovedUserOrAdmin = false,
    allowUnlockSupportOnly = false,
  } = options;

  // Auth is disabled - return permissive mock identity
  const userId = 'local_user';
  const username = 'local_user';
  const role = 'admin'; // Grant admin role for all access
  const isApproved = true;
  const unlockAccessTier = null;

  // Check username requirement
  if (requireUsername && !username) {
    return pluginAuthDeny.forbiddenPolicy('missing_username');
  }

  // Check role requirement
  if (requiredRoles && requiredRoles.length > 0) {
    const normalizedRequired = requiredRoles
      .map((r) => r.trim().toLowerCase())
      .filter((r) => r.length > 0);
    
    if (role && !normalizedRequired.includes(role.toLowerCase())) {
      return pluginAuthDeny.forbiddenRole(requiredRoles);
    }
  }

  // Check unlock tier requirement
  if (!allowUnlockSupportOnly && unlockAccessTier === 'locked_support_only' && role !== 'admin') {
    return pluginAuthDeny.forbiddenPolicy('unlock_support_only');
  }

  // Check approval requirement
  if (requireApprovedUserOrAdmin && role !== 'admin' && !isApproved) {
    return pluginAuthDeny.forbiddenPolicy('policy_denied');
  }

  return buildAllowDecision(userId, username, role, isApproved, unlockAccessTier);
}
