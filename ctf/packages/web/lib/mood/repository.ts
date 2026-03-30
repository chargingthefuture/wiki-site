import { randomUUID } from 'crypto';
import { queryDb } from '../lib/db/postgres';
import { MOOD_COOLDOWN_DAYS } from './constants';

export async function getMoodEligibility(input: { clientId: string }): Promise<{ eligible: boolean; cooldownUntilIso: string | null; lastSubmissionAtIso: string | null }> {
  const result = await queryDb<{ submitted_at: Date }>(
    `SELECT submitted_at
     FROM mood_submissions
     WHERE client_id = $1
     ORDER BY submitted_at DESC
     LIMIT 1`,
    [input.clientId],
  );

  if (result.rows.length === 0) {
    return { eligible: true, cooldownUntilIso: null, lastSubmissionAtIso: null };
  }

  const lastSubmission = result.rows[0].submitted_at;
  const cooldownUntil = new Date(lastSubmission.getTime() + MOOD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();

  return {
    eligible: now >= cooldownUntil,
    cooldownUntilIso: cooldownUntil.toISOString(),
    lastSubmissionAtIso: lastSubmission.toISOString(),
  };
}

export async function createMoodSubmission(input: { userId: string; clientId: string; moodValue: number; note: string | null }) {
  if (!Number.isInteger(input.moodValue) || input.moodValue < 1 || input.moodValue > 5) {
    throw new Error('invalid_payload');
  }

  const eligibility = await getMoodEligibility({ clientId: input.clientId });
  if (!eligibility.eligible) {
    throw new Error('cooldown_active');
  }

  const inserted = await queryDb<{ id: string; submitted_at: Date }>(
    `INSERT INTO mood_submissions (id, user_id, client_id, mood_value, note)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, submitted_at`,
    [randomUUID(), input.userId, input.clientId, input.moodValue, input.note],
  );

  return {
    id: inserted.rows[0].id,
    submittedAtIso: inserted.rows[0].submitted_at.toISOString(),
  };
}
