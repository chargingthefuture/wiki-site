import type { SkillsHuntLeaderboardEntry, SkillsHuntLeaderboardMode } from "@ctf/shared";
import { getDbPool } from "../db";

interface LeaderboardRow {
  round_id: string;
  entry_type: SkillsHuntLeaderboardMode;
  entry_key: string;
  display_name: string;
  points: number;
  accepted_count: number;
  first_match_count: number;
  rare_skill_count: number;
  rank_position: number;
  updated_at: string;
}

const mapLeaderboardEntry = (row: LeaderboardRow): SkillsHuntLeaderboardEntry => ({
  roundId: row.round_id,
  mode: row.entry_type,
  entryKey: row.entry_key,
  displayName: row.display_name,
  points: row.points,
  acceptedCount: row.accepted_count,
  firstMatchCount: row.first_match_count,
  rareSkillCount: row.rare_skill_count,
  rank: row.rank_position,
  updatedAtIso: new Date(row.updated_at).toISOString(),
});

export const listLeaderboardByRound = async (
  roundId: string,
  mode: SkillsHuntLeaderboardMode,
): Promise<SkillsHuntLeaderboardEntry[]> => {
  const pool = getDbPool();
  const result = await pool.query<LeaderboardRow>(
    `
      SELECT
        round_id,
        entry_type,
        entry_key,
        display_name,
        points,
        accepted_count,
        first_match_count,
        rare_skill_count,
        rank_position,
        updated_at
      FROM skills_hunt_leaderboard
      WHERE round_id = $1
        AND entry_type = $2
      ORDER BY rank_position ASC
    `,
    [roundId, mode],
  );

  return result.rows.map(mapLeaderboardEntry);
};

export const rebuildLeaderboardForRound = async (roundId: string): Promise<void> => {
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    await pool.query(`DELETE FROM skills_hunt_leaderboard WHERE round_id = $1`, [roundId]);

    await pool.query(
      `
        INSERT INTO skills_hunt_leaderboard (
          round_id,
          entry_type,
          entry_key,
          display_name,
          points,
          accepted_count,
          first_match_count,
          rare_skill_count,
          rank_position,
          updated_at
        )
        SELECT
          ranked.round_id,
          'individual',
          ranked.submitter_user_id,
          ranked.submitter_username,
          ranked.points,
          ranked.accepted_count,
          ranked.first_match_count,
          ranked.rare_skill_count,
          ranked.rank_position,
          NOW()
        FROM (
          SELECT
            s.round_id,
            s.submitter_user_id,
            MAX(s.submitter_username) AS submitter_username,
            SUM(s.points_awarded) AS points,
            COUNT(*) AS accepted_count,
            COUNT(*) FILTER (WHERE s.points_awarded > 0 AND s.points_awarded >= 1) AS first_match_count,
            COUNT(*) FILTER (WHERE EXISTS (
              SELECT 1
              FROM skills_hunt_rare_skills_lookup r
              WHERE r.is_active = TRUE
                AND r.normalized_skill_name = ANY (
                  ARRAY(
                    SELECT LOWER(value::text)
                    FROM jsonb_array_elements_text(s.skills) AS value
                  )
                )
            )) AS rare_skill_count,
            ROW_NUMBER() OVER (
              ORDER BY SUM(s.points_awarded) DESC, COUNT(*) DESC, MAX(s.created_at) ASC
            ) AS rank_position
          FROM skills_hunt_submissions s
          WHERE s.round_id = $1
            AND s.status = 'accepted'
          GROUP BY s.round_id, s.submitter_user_id
        ) ranked
      `,
      [roundId],
    );

    await pool.query(
      `
        INSERT INTO skills_hunt_leaderboard (
          round_id,
          entry_type,
          entry_key,
          display_name,
          points,
          accepted_count,
          first_match_count,
          rare_skill_count,
          rank_position,
          updated_at
        )
        SELECT
          ranked.round_id,
          'team',
          ranked.profession,
          ranked.profession,
          ranked.points,
          ranked.accepted_count,
          0,
          0,
          ranked.rank_position,
          NOW()
        FROM (
          SELECT
            s.round_id,
            profession.value AS profession,
            SUM(s.points_awarded) AS points,
            COUNT(*) AS accepted_count,
            ROW_NUMBER() OVER (
              ORDER BY SUM(s.points_awarded) DESC, COUNT(*) DESC, profession.value ASC
            ) AS rank_position
          FROM skills_hunt_submissions s,
          LATERAL jsonb_array_elements_text(s.claimed_professions) AS profession(value)
          WHERE s.round_id = $1
            AND s.status = 'accepted'
          GROUP BY s.round_id, profession.value
        ) ranked
      `,
      [roundId],
    );

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};
