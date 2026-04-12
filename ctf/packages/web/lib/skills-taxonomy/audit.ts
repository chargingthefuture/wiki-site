import { randomUUID } from 'crypto';
import type { SkillsTaxonomyAuditEvent } from './types';

function buildTargetContext(target: SkillsTaxonomyAuditEvent['target']): Record<string, string> {
  const compacted = Object.entries(target).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      acc[key] = value;
    }

    return acc;
  }, {});

  return compacted;
}

export function logSkillsTaxonomyAudit(event: SkillsTaxonomyAuditEvent): void {
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

  console.info('[skills-taxonomy.audit]', JSON.stringify(payload));
}
