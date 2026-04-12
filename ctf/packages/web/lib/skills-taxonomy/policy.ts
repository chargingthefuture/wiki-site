import { pluginAuthDeny, type PluginDenyResponse } from 'lib/auth/deny-taxonomy';
import type { AllowDecision } from 'lib/auth/server-authz';

export function ensureTaxonomyAdmin(decision: AllowDecision): PluginDenyResponse | null {
  if (decision.role === 'admin' || decision.role === 'taxonomy_admin') {
    return null;
  }

  return pluginAuthDeny.forbiddenRole(['admin', 'taxonomy_admin']);
}
