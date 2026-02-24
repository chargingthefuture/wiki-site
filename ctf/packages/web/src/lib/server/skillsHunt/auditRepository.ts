import { getDbPool } from "../db";

export const insertAuditLog = async (input: {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
}): Promise<void> => {
  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO skills_hunt_audit_log (
        actor_user_id,
        action,
        entity_type,
        entity_id,
        details
      )
      VALUES ($1, $2, $3, $4, $5::jsonb)
    `,
    [input.actorUserId, input.action, input.entityType, input.entityId, JSON.stringify(input.details ?? {})],
  );
};
