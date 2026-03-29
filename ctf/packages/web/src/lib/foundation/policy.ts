import type { AllowDecision } from '@/src/lib/auth/server-authz';
import { pluginAuthDeny, type PluginDenyResponse } from '@/src/lib/auth/deny-taxonomy';

export function ensureFoundationAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin || decision.role === 'operations') {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['admin', 'operations']);
}
