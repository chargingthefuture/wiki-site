import { randomUUID } from 'crypto';

type FoundationAuditEvent = {
  actorId: string;
  command: string;
  status: 'allow' | 'deny';
  reason: string;
  targetType: string;
  targetId: string;
  result: 'success' | 'failure';
  errorCategory: string | null;
  metadata?: Record<string, unknown>;
};

export function logFoundationAudit(event: FoundationAuditEvent): void {
  const payload = {
    eventId: randomUUID(),
    timestamp: new Date().toISOString(),
    actorId: event.actorId,
    pluginId: 'foundation',
    command: event.command,
    commandVersion: '1.0.0',
    policyDecision: {
      status: event.status,
      reason: event.reason,
    },
    targetContext: {
      targetType: event.targetType,
      targetId: event.targetId,
    },
    result: {
      status: event.result,
      errorCategory: event.errorCategory ?? 'none',
    },
    metadata: event.metadata ?? {},
  };

  console.info('[foundation.audit]', JSON.stringify(payload));
}
