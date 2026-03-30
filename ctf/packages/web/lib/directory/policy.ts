import type { AllowDecision } from '../lib/auth/server-authz';
import { pluginAuthDeny, type PluginDenyResponse } from '../lib/auth/deny-taxonomy';

export function ensureDirectoryAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin) {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['admin']);
}
