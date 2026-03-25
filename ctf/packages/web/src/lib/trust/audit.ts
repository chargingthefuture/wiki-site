import { queryDb } from '@/src/lib/db/postgres';

// Log a trust plugin audit event
export async function logTrustAuditEvent({
  actorUserId,
  command,
  policyStatus,
  reason,
  targetUserId,
  requestId,
  metadata = {},
}: {
  actorUserId?: string;
  command: string;
  policyStatus: 'allow' | 'deny';
  reason: string;
  targetUserId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}) {
  await queryDb(
    `INSERT INTO trust_admin_audit_trail (actor_user_id, command, policy_status, reason, target_user_id, request_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [actorUserId ?? null, command, policyStatus, reason, targetUserId ?? null, requestId ?? null, JSON.stringify(metadata)]
  );
}
