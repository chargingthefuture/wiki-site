import type { SkillsHuntAchievement } from "@ctf/shared";
import { getDbPool } from "../db";

interface AchievementRow {
  id: number;
  user_id: string;
  round_id: string | null;
  code: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  awarded_at: string;
}

const mapAchievement = (row: AchievementRow): SkillsHuntAchievement => ({
  id: row.id,
  userId: row.user_id,
  roundId: row.round_id,
  code: row.code,
  title: row.title,
  description: row.description,
  metadata: row.metadata,
  awardedAtIso: new Date(row.awarded_at).toISOString(),
});

export const listAchievementsByUser = async (userId: string): Promise<SkillsHuntAchievement[]> => {
  const pool = getDbPool();
  const result = await pool.query<AchievementRow>(
    `
      SELECT
        id,
        user_id,
        round_id,
        code,
        title,
        description,
        metadata,
        awarded_at
      FROM skills_hunt_achievements
      WHERE user_id = $1
      ORDER BY awarded_at DESC
    `,
    [userId],
  );

  return result.rows.map(mapAchievement);
};
