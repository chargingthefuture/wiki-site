import type { AllowDecision } from '@/src/lib/auth/server-authz';
import { pluginAuthDeny, type PluginDenyResponse } from '@/src/lib/auth/deny-taxonomy';

export function ensureServiceCreditsAdmin(auth: AllowDecision): PluginDenyResponse | null {
  if (auth.isAdmin) {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['admin']);
}
