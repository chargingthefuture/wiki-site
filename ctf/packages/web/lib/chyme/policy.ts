import { pluginAuthDeny, type PluginDenyResponse } from '../lib/auth/deny-taxonomy';
import type { AllowDecision } from '../lib/auth/server-authz';

export function ensureApprovedUserOrAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin || decision.isApproved) {
    return null;
  }

  return pluginAuthDeny.forbiddenPolicy('policy_denied');
}
