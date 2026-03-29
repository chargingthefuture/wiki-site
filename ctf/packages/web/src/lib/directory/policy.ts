import type { AllowDecision } from '@/src/lib/auth/server-authz';
import { pluginAuthDeny, type PluginDenyResponse } from '@/src/lib/auth/deny-taxonomy';

export function ensureDirectoryAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.isAdmin) {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['admin']);
}
