import type { PoolClient } from 'pg';
import { queryDb } from 'lib/db/postgres';
import type { TrustUserExtension } from './types';

export async function getTrustUserExtension(userId: string): Promise<TrustUserExtension> {
  const result = await queryDb<{
    user_id: string;
    trust_status: string;
    trust_evidence: import('./types').TrustEvidenceItem[];
    trust_visibility: string;
    updated_at: Date;
  }>(
    `SELECT user_id, trust_status, trust_evidence, trust_visibility, updated_at FROM trust_user_extension WHERE user_id = $1`,
    [userId]
  );
  if (!result.rows.length) {
    return {
      userId,
      trustStatus: 'unverified',
      trustEvidence: [],
      trustVisibility: 'public',
      updatedAt: new Date().toISOString(),
    };
  }
  const row = result.rows[0];
  return {
    userId: row.user_id,
    trustStatus: row.trust_status as TrustUserExtension['trustStatus'],
    trustEvidence: row.trust_evidence ?? [],
    trustVisibility: row.trust_visibility as TrustUserExtension['trustVisibility'],
    updatedAt: row.updated_at.toISOString(),
  };
}
