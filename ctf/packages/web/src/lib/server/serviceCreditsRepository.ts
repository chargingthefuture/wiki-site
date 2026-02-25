import { getDbPool } from "./db";

export const enqueueServiceCreditsAccountDeletionReclaim = async (input: {
  userId: string;
  deletionRequestId: string;
  requestId?: string;
  traceId?: string;
}): Promise<void> => {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO service_credits_user_extension (
          user_id,
          wallet_status,
          deletion_request_id,
          deletion_requested_at,
          reclaim_eligible_at
        )
        VALUES ($1, 'pending_deletion', $2, NOW(), NOW() + INTERVAL '7 days')
        ON CONFLICT (user_id) DO UPDATE SET
          wallet_status = 'pending_deletion',
          deletion_request_id = EXCLUDED.deletion_request_id,
          deletion_requested_at = NOW(),
          reclaim_eligible_at = NOW() + INTERVAL '7 days',
          updated_at = NOW()
      `,
      [input.userId, input.deletionRequestId],
    );

    await client.query(
      `
        UPDATE service_credits_wallets
        SET status = 'pending_deletion',
            updated_at = NOW()
        WHERE user_id = $1
          AND wallet_type = 'personal'
      `,
      [input.userId],
    );

    await client.query(
      `
        INSERT INTO service_credits_account_deletion_reclaims (
          user_id,
          wallet_id,
          deletion_request_id,
          reclaim_eligible_at,
          reclaim_status,
          request_id,
          trace_id
        )
        VALUES (
          $1,
          (
            SELECT id
            FROM service_credits_wallets
            WHERE user_id = $1
              AND wallet_type = 'personal'
            LIMIT 1
          ),
          $2,
          NOW() + INTERVAL '7 days',
          'pending_window',
          $3,
          $4
        )
        ON CONFLICT (user_id, deletion_request_id) DO UPDATE SET
          wallet_id = EXCLUDED.wallet_id,
          reclaim_eligible_at = EXCLUDED.reclaim_eligible_at,
          reclaim_status = 'pending_window',
          request_id = EXCLUDED.request_id,
          trace_id = EXCLUDED.trace_id,
          updated_at = NOW()
      `,
      [input.userId, input.deletionRequestId, input.requestId ?? null, input.traceId ?? null],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
