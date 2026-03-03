import type { AllowDecision } from '@/src/lib/auth/server-authz';
import { pluginAuthDeny, type PluginDenyResponse } from '@/src/lib/auth/deny-taxonomy';

export function ensureSkillsHuntModeratorOrAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin || decision.role === 'moderator') {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['moderator', 'admin']);
}

export function ensureSkillsHuntAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin) {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['admin']);
}
