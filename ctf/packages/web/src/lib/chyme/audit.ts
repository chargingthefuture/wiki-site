import { randomUUID } from 'crypto';
import type { ChymeAuditEvent } from './types';

function buildTargetContext(target: ChymeAuditEvent['target']): Record<string, string> {
  const compacted = Object.entries(target).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      acc[key] = value;
    }

    return acc;
  }, {});

  return compacted;
}

export function logChymeAudit(event: ChymeAuditEvent): void {
  const payload = {
    eventId: randomUUID(),
    timestamp: new Date().toISOString(),
    actorId: event.actorId,
    pluginId: event.pluginId,
    command: event.command,
    commandVersion: '1.0.0',
    policyDecision: {
      status: event.status,
      reason: event.reason,
    },
    targetContext: buildTargetContext(event.target),
    result: {
      status: event.result,
      errorCategory: event.errorCategory ?? 'none',
    },
  };

  console.info('[chyme.audit]', JSON.stringify(payload));
}
