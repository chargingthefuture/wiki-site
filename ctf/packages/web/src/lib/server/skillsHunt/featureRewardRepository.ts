import type { SkillsHuntFeatureRewardCard, UpdateSkillsHuntFeatureRewardCardRequest } from "@ctf/shared";
import { getDbPool } from "../db";

interface RewardCardRow {
  title: string;
  description: string;
  cta_label: string;
  cta_url: string;
  is_active: boolean;
  updated_by_user_id: string;
  updated_at: string;
}

const mapRewardCard = (row: RewardCardRow): SkillsHuntFeatureRewardCard => ({
  title: row.title,
  description: row.description,
  ctaLabel: row.cta_label,
  ctaUrl: row.cta_url,
  isActive: row.is_active,
  updatedByUserId: row.updated_by_user_id,
  updatedAtIso: new Date(row.updated_at).toISOString(),
});

export const getFeatureRewardCard = async (): Promise<SkillsHuntFeatureRewardCard | null> => {
  const pool = getDbPool();
  const result = await pool.query<RewardCardRow>(
    `
      SELECT
        title,
        description,
        cta_label,
        cta_url,
        is_active,
        updated_by_user_id,
        updated_at
      FROM skills_hunt_feature_reward_card
      WHERE id = 1
      LIMIT 1
    `,
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRewardCard(result.rows[0]);
};

export const upsertFeatureRewardCard = async (input: {
  actorUserId: string;
  data: UpdateSkillsHuntFeatureRewardCardRequest;
}): Promise<SkillsHuntFeatureRewardCard> => {
  const pool = getDbPool();
  const result = await pool.query<RewardCardRow>(
    `
      INSERT INTO skills_hunt_feature_reward_card (
        id,
        title,
        description,
        cta_label,
        cta_url,
        is_active,
        updated_by_user_id,
        updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        cta_label = EXCLUDED.cta_label,
        cta_url = EXCLUDED.cta_url,
        is_active = EXCLUDED.is_active,
        updated_by_user_id = EXCLUDED.updated_by_user_id,
        updated_at = NOW()
      RETURNING
        title,
        description,
        cta_label,
        cta_url,
        is_active,
        updated_by_user_id,
        updated_at
    `,
    [
      input.data.title.trim(),
      input.data.description.trim(),
      input.data.ctaLabel.trim(),
      input.data.ctaUrl.trim(),
      input.data.isActive,
      input.actorUserId,
    ],
  );

  return mapRewardCard(result.rows[0]);
};
