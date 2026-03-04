import { randomUUID } from 'crypto';
import { queryDb, withDbTransaction } from '@/src/lib/db/postgres';
import { postEscrowHoldToFormance } from '@/src/lib/service-credits/formance-ledger';

type WalletRow = {
  user_id: string;
  available_balance: string;
  escrow_balance: string;
};

function mapWallet(row: WalletRow) {
  return {
    userId: row.user_id,
    availableBalance: Number(row.available_balance),
    escrowBalance: Number(row.escrow_balance),
  };
}

export async function getOrCreateWallet(userId: string) {
  const upsert = await queryDb<WalletRow>(
    `INSERT INTO service_credits_wallets (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
     RETURNING user_id, available_balance::text, escrow_balance::text`,
    [userId],
  );

  return mapWallet(upsert.rows[0]);
}

export async function createTransfer(input: {
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  idempotencyKey: string;
}) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('invalid_payload');
  }

  return withDbTransaction(async (client) => {
    await client.query(
      `INSERT INTO service_credits_wallets (user_id)
       VALUES ($1), ($2)
       ON CONFLICT (user_id) DO NOTHING`,
      [input.senderUserId, input.recipientUserId],
    );

    const balanceResult = await client.query<{ available_balance: string }>(
      `SELECT available_balance::text FROM service_credits_wallets WHERE user_id = $1 FOR UPDATE`,
      [input.senderUserId],
    );

    const senderBalance = Number(balanceResult.rows[0]?.available_balance ?? '0');
    if (senderBalance < input.amount) {
      throw new Error('insufficient_balance');
    }

    const transferId = randomUUID();
    const insertedTransfer = await client.query<{
      id: string;
      sender_user_id: string;
      recipient_user_id: string;
      amount: string;
      status: 'pending' | 'completed' | 'cancelled' | 'disputed';
    }>(
      `INSERT INTO service_credits_transfers (id, sender_user_id, recipient_user_id, amount, status, idempotency_key)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       ON CONFLICT (sender_user_id, idempotency_key) DO NOTHING
       RETURNING id::text, sender_user_id, recipient_user_id, amount::text, status`,
      [transferId, input.senderUserId, input.recipientUserId, input.amount, input.idempotencyKey],
    );

    if (!insertedTransfer.rows[0]) {
      const existingTransfer = await client.query<{
        id: string;
        sender_user_id: string;
        recipient_user_id: string;
        amount: string;
        status: 'pending' | 'completed' | 'cancelled' | 'disputed';
      }>(
        `SELECT id::text, sender_user_id, recipient_user_id, amount::text, status
         FROM service_credits_transfers
         WHERE sender_user_id = $1 AND idempotency_key = $2
         LIMIT 1`,
        [input.senderUserId, input.idempotencyKey],
      );

      if (!existingTransfer.rows[0]) {
        throw new Error('transfer_conflict');
      }

      const existingEscrow = await client.query<{ id: string }>(
        `SELECT id::text
         FROM service_credits_escrow_holds
         WHERE transfer_id = $1 AND status = 'held'
         ORDER BY created_at DESC
         LIMIT 1`,
        [existingTransfer.rows[0].id],
      );

      return {
        id: existingTransfer.rows[0].id,
        senderUserId: existingTransfer.rows[0].sender_user_id,
        recipientUserId: existingTransfer.rows[0].recipient_user_id,
        amount: Number(existingTransfer.rows[0].amount),
        status: existingTransfer.rows[0].status,
        escrowHoldId: existingEscrow.rows[0]?.id ?? null,
      };
    }

    const escrowHoldId = randomUUID();
    const externalLedger = await postEscrowHoldToFormance({
      transferId,
      senderUserId: input.senderUserId,
      recipientUserId: input.recipientUserId,
      amount: input.amount,
      idempotencyKey: input.idempotencyKey,
    });

    await client.query(
      `UPDATE service_credits_wallets
       SET available_balance = available_balance - $2, escrow_balance = escrow_balance + $2, updated_at = NOW()
       WHERE user_id = $1`,
      [input.senderUserId, input.amount],
    );

    await client.query(
      `INSERT INTO service_credits_escrow_holds (id, wallet_user_id, transfer_id, amount, status)
       VALUES ($1, $2, $3, $4, 'held')`,
      [escrowHoldId, input.senderUserId, transferId, input.amount],
    );

    await client.query(
      `INSERT INTO service_credits_ledger_entries (id, user_id, entry_type, amount, reference_type, reference_id, accounting_scope, metadata)
       VALUES ($1, $2, 'escrow_hold', $4, 'escrow', $3, 'service_credits_non_gdp', $5::jsonb)`,
      [
        randomUUID(),
        input.senderUserId,
        escrowHoldId,
        input.amount,
        JSON.stringify({ externalLedger: 'formance', externalLedgerTransactionId: externalLedger.transactionId }),
      ],
    );

    return {
      id: transferId,
      senderUserId: input.senderUserId,
      recipientUserId: input.recipientUserId,
      amount: input.amount,
      status: 'pending' as const,
      escrowHoldId,
    };
  });
}

export async function createDispute(input: { transferId: string; openedByUserId: string; reason: string }) {
  const inserted = await queryDb<{ id: string }>(
    `INSERT INTO service_credits_disputes (id, transfer_id, opened_by_user_id, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING id::text`,
    [randomUUID(), input.transferId, input.openedByUserId, input.reason.trim()],
  );

  return inserted.rows[0].id;
}

export async function getTreasuryConfig() {
  const result = await queryDb<{ policy: Record<string, unknown> }>(
    `SELECT policy
     FROM service_credits_treasury_config
     WHERE id = 1
     LIMIT 1`,
  );

  return result.rows[0]?.policy ?? {};
}

export async function updateTreasuryConfig(input: { actorId: string; policy: Record<string, unknown> }) {
  await queryDb(
    `UPDATE service_credits_treasury_config
     SET policy = $1::jsonb, updated_by_user_id = $2, updated_at = NOW()
     WHERE id = 1`,
    [JSON.stringify(input.policy), input.actorId],
  );
}

export async function insertServiceCreditsAudit(input: {
  actorId: string;
  command: string;
  policyStatus: 'allow' | 'deny';
  reason: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}) {
  await queryDb(
    `INSERT INTO service_credits_admin_audit_trail
      (id, actor_id, command, policy_status, reason, target_type, target_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
    [randomUUID(), input.actorId, input.command, input.policyStatus, input.reason, input.targetType, input.targetId, JSON.stringify(input.metadata ?? {})],
  );
}
