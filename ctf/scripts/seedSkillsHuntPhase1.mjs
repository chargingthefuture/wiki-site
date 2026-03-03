#!/usr/bin/env node

import { Pool } from 'pg';

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

const pool = new Pool({
  connectionString: requireEnv('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
});

const roundId = '33333333-3333-4333-8333-333333333333';
const submissionId = '44444444-4444-4444-8444-444444444444';

async function main() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
        INSERT INTO skills_hunt_rounds
          (id, name, description, status, starts_at, ends_at, scoring_config, created_by_user_id, updated_by_user_id)
        VALUES
          ($1::uuid, 'Phase-1 Seed Round', 'Deterministic seed round for skills-hunt validation.', 'active', NOW() - INTERVAL '1 day', NOW() + INTERVAL '14 days', '{}'::jsonb, 'seed-admin', 'seed-admin')
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          starts_at = EXCLUDED.starts_at,
          ends_at = EXCLUDED.ends_at,
          updated_by_user_id = EXCLUDED.updated_by_user_id,
          updated_at = NOW()
      `,
      [roundId],
    );

    await client.query(
      `
        INSERT INTO skills_hunt_submissions
          (
            id,
            round_id,
            submitter_user_id,
            submitter_username,
            display_name,
            bio,
            quora_profile_url,
            quora_profile_url_normalized,
            skills,
            claimed_professions,
            signature_hash,
            status,
            review_action,
            reviewed_by_user_id,
            review_notes,
            score_breakdown,
            points_awarded,
            reviewed_at
          )
        VALUES
          (
            $1::uuid,
            $2::uuid,
            'seed-user-01',
            'seed-user-01',
            'Seed Contributor',
            'Seed biography for accepted submission flow validation.',
            'https://www.quora.com/profile/Seed-Contributor',
            'https://www.quora.com/profile/Seed-Contributor',
            '["TypeScript","Policy Design"]'::jsonb,
            '["mentor"]'::jsonb,
            'seed-signature-001',
            'accepted',
            'accept',
            'seed-moderator',
            'seed accepted',
            '{"matchBase":6,"firstMatchBonus":4,"stackBonus":2,"rareSkillBonus":0,"qualityBonus":0}'::jsonb,
            12,
            NOW()
          )
        ON CONFLICT (id)
        DO UPDATE SET
          status = EXCLUDED.status,
          review_action = EXCLUDED.review_action,
          reviewed_by_user_id = EXCLUDED.reviewed_by_user_id,
          review_notes = EXCLUDED.review_notes,
          score_breakdown = EXCLUDED.score_breakdown,
          points_awarded = EXCLUDED.points_awarded,
          reviewed_at = EXCLUDED.reviewed_at,
          updated_at = NOW()
      `,
      [submissionId, roundId],
    );

    await client.query(
      `
        INSERT INTO skills_hunt_leaderboard
          (round_id, mode, rank, score, accepted_count, rare_skill_bonus, user_id, username_snapshot, team_key, metadata)
        VALUES
          ($1::uuid, 'individual', 1, 12, 1, 0, 'seed-user-01', 'seed-user-01', NULL, '{}'::jsonb)
        ON CONFLICT (round_id, mode, rank)
        DO UPDATE SET
          score = EXCLUDED.score,
          accepted_count = EXCLUDED.accepted_count,
          rare_skill_bonus = EXCLUDED.rare_skill_bonus,
          user_id = EXCLUDED.user_id,
          username_snapshot = EXCLUDED.username_snapshot,
          updated_at = NOW()
      `,
      [roundId],
    );

    await client.query(
      `
        INSERT INTO skills_hunt_achievements (user_id, code, title, description, metadata)
        VALUES ('seed-user-01', 'accepted-first', 'First Accepted Submission', 'First accepted Skills Hunt submission.', '{}'::jsonb)
        ON CONFLICT (user_id, code)
        DO NOTHING
      `,
    );

    await client.query(
      `
        INSERT INTO skills_hunt_notifications (user_id, kind, title, body, metadata)
        VALUES
          ('seed-user-01', 'submission-accepted', 'Submission accepted', 'Your seed submission was accepted.', '{"seed":true}'::jsonb)
        ON CONFLICT DO NOTHING
      `,
    );

    await client.query('COMMIT');
    console.log('Skills Hunt phase-1 seed fixtures applied.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
