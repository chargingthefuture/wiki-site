import type {
  CreateSkillsHuntRoundRequest,
  SkillsHuntRound,
  SkillsHuntScoringConfig,
  UpdateSkillsHuntRoundRequest,
} from "@ctf/shared";
import { randomUUID } from "crypto";
import { getDbPool } from "../db";
import { DEFAULT_SKILLS_HUNT_SCORING_CONFIG } from "./constants";
import { resolveScoringConfig } from "./scoring";

interface RoundRow {
  id: string;
  name: string;
  description: string;
  status: SkillsHuntRound["status"];
  starts_at: string;
  ends_at: string;
  scoring_config: Partial<SkillsHuntScoringConfig>;
  created_by_user_id: string;
  updated_by_user_id: string;
  created_at: string;
  updated_at: string;
}

const mapRound = (row: RoundRow): SkillsHuntRound => ({
  id: row.id,
  name: row.name,
  description: row.description,
  status: row.status,
  startsAtIso: new Date(row.starts_at).toISOString(),
  endsAtIso: new Date(row.ends_at).toISOString(),
  scoringConfig: resolveScoringConfig(row.scoring_config),
  createdByUserId: row.created_by_user_id,
  updatedByUserId: row.updated_by_user_id,
  createdAtIso: new Date(row.created_at).toISOString(),
  updatedAtIso: new Date(row.updated_at).toISOString(),
});

const parseDateInput = (value: string): Date => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date input");
  }

  return parsed;
};

export const createRound = async (input: {
  actorUserId: string;
  data: CreateSkillsHuntRoundRequest;
}): Promise<SkillsHuntRound> => {
  const pool = getDbPool();
  const id = randomUUID();
  const startsAt = parseDateInput(input.data.startsAtIso);
  const endsAt = parseDateInput(input.data.endsAtIso);
  const scoringConfig = resolveScoringConfig(input.data.scoringConfig);

  const result = await pool.query<RoundRow>(
    `
      INSERT INTO skills_hunt_rounds (
        id,
        name,
        description,
        status,
        starts_at,
        ends_at,
        scoring_config,
        created_by_user_id,
        updated_by_user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $8)
      RETURNING
        id,
        name,
        description,
        status,
        starts_at,
        ends_at,
        scoring_config,
        created_by_user_id,
        updated_by_user_id,
        created_at,
        updated_at
    `,
    [
      id,
      input.data.name.trim(),
      input.data.description?.trim() ?? "",
      input.data.status ?? "draft",
      startsAt.toISOString(),
      endsAt.toISOString(),
      JSON.stringify(scoringConfig),
      input.actorUserId,
    ],
  );

  return mapRound(result.rows[0]);
};

export const listRounds = async (): Promise<SkillsHuntRound[]> => {
  const pool = getDbPool();
  const result = await pool.query<RoundRow>(
    `
      SELECT
        id,
        name,
        description,
        status,
        starts_at,
        ends_at,
        scoring_config,
        created_by_user_id,
        updated_by_user_id,
        created_at,
        updated_at
      FROM skills_hunt_rounds
      ORDER BY starts_at DESC
    `,
  );

  return result.rows.map(mapRound);
};

export const getRoundById = async (roundId: string): Promise<SkillsHuntRound | null> => {
  const pool = getDbPool();
  const result = await pool.query<RoundRow>(
    `
      SELECT
        id,
        name,
        description,
        status,
        starts_at,
        ends_at,
        scoring_config,
        created_by_user_id,
        updated_by_user_id,
        created_at,
        updated_at
      FROM skills_hunt_rounds
      WHERE id = $1
      LIMIT 1
    `,
    [roundId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRound(result.rows[0]);
};

export const updateRound = async (input: {
  roundId: string;
  actorUserId: string;
  data: UpdateSkillsHuntRoundRequest;
}): Promise<SkillsHuntRound | null> => {
  const existing = await getRoundById(input.roundId);
  if (!existing) {
    return null;
  }

  const pool = getDbPool();
  const startsAt = input.data.startsAtIso ? parseDateInput(input.data.startsAtIso) : new Date(existing.startsAtIso);
  const endsAt = input.data.endsAtIso ? parseDateInput(input.data.endsAtIso) : new Date(existing.endsAtIso);

  const mergedScoringConfig = resolveScoringConfig({
    ...existing.scoringConfig,
    ...(input.data.scoringConfig ?? {}),
  });

  const result = await pool.query<RoundRow>(
    `
      UPDATE skills_hunt_rounds
      SET
        name = $2,
        description = $3,
        status = $4,
        starts_at = $5,
        ends_at = $6,
        scoring_config = $7::jsonb,
        updated_by_user_id = $8,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        name,
        description,
        status,
        starts_at,
        ends_at,
        scoring_config,
        created_by_user_id,
        updated_by_user_id,
        created_at,
        updated_at
    `,
    [
      input.roundId,
      input.data.name?.trim() ?? existing.name,
      input.data.description?.trim() ?? existing.description,
      input.data.status ?? existing.status,
      startsAt.toISOString(),
      endsAt.toISOString(),
      JSON.stringify(mergedScoringConfig ?? DEFAULT_SKILLS_HUNT_SCORING_CONFIG),
      input.actorUserId,
    ],
  );

  return mapRound(result.rows[0]);
};
