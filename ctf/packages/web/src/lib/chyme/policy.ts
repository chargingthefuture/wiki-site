import { pluginAuthDeny, type PluginDenyResponse } from '@/src/lib/auth/deny-taxonomy';
import type { AllowDecision } from '@/src/lib/auth/server-authz';

export function ensureApprovedUserOrAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin || decision.isApproved) {
    return null;
  }

  return pluginAuthDeny.forbiddenPolicy('policy_denied');
}
