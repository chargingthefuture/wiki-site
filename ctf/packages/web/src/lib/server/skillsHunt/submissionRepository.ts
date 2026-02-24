import type { SkillsHuntSubmission, SkillsHuntSubmissionStatus } from "@ctf/shared";
import { randomUUID } from "crypto";
import { getDbPool } from "../db";

interface SubmissionRow {
  id: string;
  round_id: string;
  submitter_user_id: string;
  submitter_username: string;
  submitter_admin_preapproved: boolean;
  display_name: string;
  bio: string;
  quora_profile_url: string;
  normalized_quora_profile_url: string;
  skills: string[];
  skills_signature: string;
  claimed_professions: string[];
  status: SkillsHuntSubmissionStatus;
  url_validation_result: SkillsHuntSubmission["urlValidationResult"];
  review_notes: string | null;
  edit_count: number;
  reviewed_by_user_id: string | null;
  reviewed_at: string | null;
  points_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface SubmissionFilters {
  status?: SkillsHuntSubmissionStatus;
  submitterUserId?: string;
  fromDateIso?: string;
  toDateIso?: string;
  profession?: string;
}

const mapSubmission = (row: SubmissionRow): SkillsHuntSubmission => ({
  id: row.id,
  roundId: row.round_id,
  submitterUserId: row.submitter_user_id,
  submitterUsername: row.submitter_username,
  submitterAdminPreapproved: row.submitter_admin_preapproved,
  displayName: row.display_name,
  bio: row.bio,
  quoraProfileUrl: row.quora_profile_url,
  normalizedQuoraProfileUrl: row.normalized_quora_profile_url,
  skills: row.skills,
  skillsSignature: row.skills_signature,
  claimedProfessions: row.claimed_professions,
  status: row.status,
  urlValidationResult: row.url_validation_result,
  reviewNotes: row.review_notes,
  editCount: row.edit_count,
  reviewedByUserId: row.reviewed_by_user_id,
  reviewedAtIso: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
  pointsAwarded: row.points_awarded,
  createdAtIso: new Date(row.created_at).toISOString(),
  updatedAtIso: new Date(row.updated_at).toISOString(),
});

export const createSubmission = async (input: {
  roundId: string;
  submitterUserId: string;
  submitterUsername: string;
  submitterAdminPreapproved: boolean;
  displayName: string;
  bio: string;
  quoraProfileUrl: string;
  normalizedQuoraProfileUrl: string;
  skills: string[];
  skillsSignature: string;
  claimedProfessions: string[];
  status: SkillsHuntSubmissionStatus;
  urlValidationResult: SkillsHuntSubmission["urlValidationResult"];
  reviewNotes?: string;
}): Promise<SkillsHuntSubmission> => {
  const pool = getDbPool();
  const id = randomUUID();

  const result = await pool.query<SubmissionRow>(
    `
      INSERT INTO skills_hunt_submissions (
        id,
        round_id,
        submitter_user_id,
        submitter_username,
        submitter_admin_preapproved,
        display_name,
        bio,
        quora_profile_url,
        normalized_quora_profile_url,
        skills,
        skills_signature,
        claimed_professions,
        status,
        url_validation_result,
        review_notes,
        reviewed_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10::jsonb,
        $11,
        $12::jsonb,
        $13,
        $14,
        $15,
        CASE WHEN $13 IN ('accepted', 'rejected', 'flagged', 'auto_rejected') THEN NOW() ELSE NULL END
      )
      RETURNING
        id,
        round_id,
        submitter_user_id,
        submitter_username,
        submitter_admin_preapproved,
        display_name,
        bio,
        quora_profile_url,
        normalized_quora_profile_url,
        skills,
        skills_signature,
        claimed_professions,
        status,
        url_validation_result,
        review_notes,
        edit_count,
        reviewed_by_user_id,
        reviewed_at,
        points_awarded,
        created_at,
        updated_at
    `,
    [
      id,
      input.roundId,
      input.submitterUserId,
      input.submitterUsername,
      input.submitterAdminPreapproved,
      input.displayName,
      input.bio,
      input.quoraProfileUrl,
      input.normalizedQuoraProfileUrl,
      JSON.stringify(input.skills),
      input.skillsSignature,
      JSON.stringify(input.claimedProfessions),
      input.status,
      input.urlValidationResult,
      input.reviewNotes ?? null,
    ],
  );

  return mapSubmission(result.rows[0]);
};

export const getSubmissionById = async (submissionId: string): Promise<SkillsHuntSubmission | null> => {
  const pool = getDbPool();
  const result = await pool.query<SubmissionRow>(
    `
      SELECT
        id,
        round_id,
        submitter_user_id,
        submitter_username,
        submitter_admin_preapproved,
        display_name,
        bio,
        quora_profile_url,
        normalized_quora_profile_url,
        skills,
        skills_signature,
        claimed_professions,
        status,
        url_validation_result,
        review_notes,
        edit_count,
        reviewed_by_user_id,
        reviewed_at,
        points_awarded,
        created_at,
        updated_at
      FROM skills_hunt_submissions
      WHERE id = $1
      LIMIT 1
    `,
    [submissionId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapSubmission(result.rows[0]);
};

export const getRoundSubmissionDuplicate = async (input: {
  roundId: string;
  normalizedQuoraProfileUrl: string;
  skillsSignature: string;
}): Promise<SkillsHuntSubmission | null> => {
  const pool = getDbPool();
  const result = await pool.query<SubmissionRow>(
    `
      SELECT
        id,
        round_id,
        submitter_user_id,
        submitter_username,
        submitter_admin_preapproved,
        display_name,
        bio,
        quora_profile_url,
        normalized_quora_profile_url,
        skills,
        skills_signature,
        claimed_professions,
        status,
        url_validation_result,
        review_notes,
        edit_count,
        reviewed_by_user_id,
        reviewed_at,
        points_awarded,
        created_at,
        updated_at
      FROM skills_hunt_submissions
      WHERE round_id = $1
        AND normalized_quora_profile_url = $2
        AND skills_signature = $3
      LIMIT 1
    `,
    [input.roundId, input.normalizedQuoraProfileUrl, input.skillsSignature],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapSubmission(result.rows[0]);
};

export const countSubmissionsInRollingWindow = async (input: {
  submitterUserId: string;
  lookbackDays: number;
}): Promise<number> => {
  const pool = getDbPool();
  const result = await pool.query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM skills_hunt_submissions
      WHERE submitter_user_id = $1
        AND created_at >= NOW() - ($2::text || ' days')::interval
    `,
    [input.submitterUserId, input.lookbackDays],
  );

  return Number(result.rows[0]?.count ?? 0);
};

export const getSubmitterReviewStats = async (submitterUserId: string): Promise<{ reviewed: number; rejected: number }> => {
  const pool = getDbPool();
  const result = await pool.query<{ reviewed_count: string; rejected_count: string }>(
    `
      SELECT
        COUNT(*) FILTER (WHERE status IN ('accepted', 'rejected', 'flagged', 'auto_rejected'))::text AS reviewed_count,
        COUNT(*) FILTER (WHERE status IN ('rejected', 'auto_rejected'))::text AS rejected_count
      FROM skills_hunt_submissions
      WHERE submitter_user_id = $1
    `,
    [submitterUserId],
  );

  return {
    reviewed: Number(result.rows[0]?.reviewed_count ?? 0),
    rejected: Number(result.rows[0]?.rejected_count ?? 0),
  };
};

export const countAcceptedSubmissionsBySubmitterInRound = async (input: {
  roundId: string;
  submitterUserId: string;
}): Promise<number> => {
  const pool = getDbPool();
  const result = await pool.query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM skills_hunt_submissions
      WHERE round_id = $1
        AND submitter_user_id = $2
        AND status = 'accepted'
    `,
    [input.roundId, input.submitterUserId],
  );

  return Number(result.rows[0]?.count ?? 0);
};

export const listRoundSubmissions = async (input: {
  roundId: string;
  filters?: SubmissionFilters;
  page: number;
  limit: number;
}): Promise<SkillsHuntSubmission[]> => {
  const pool = getDbPool();
  const whereClauses: string[] = ["round_id = $1"];
  const values: Array<string | number> = [input.roundId];
  let parameterIndex = values.length + 1;

  if (input.filters?.status) {
    whereClauses.push(`status = $${parameterIndex}`);
    values.push(input.filters.status);
    parameterIndex += 1;
  }

  if (input.filters?.submitterUserId) {
    whereClauses.push(`submitter_user_id = $${parameterIndex}`);
    values.push(input.filters.submitterUserId);
    parameterIndex += 1;
  }

  if (input.filters?.fromDateIso) {
    whereClauses.push(`created_at >= $${parameterIndex}`);
    values.push(input.filters.fromDateIso);
    parameterIndex += 1;
  }

  if (input.filters?.toDateIso) {
    whereClauses.push(`created_at <= $${parameterIndex}`);
    values.push(input.filters.toDateIso);
    parameterIndex += 1;
  }

  if (input.filters?.profession) {
    whereClauses.push(`claimed_professions ? $${parameterIndex}`);
    values.push(input.filters.profession);
    parameterIndex += 1;
  }

  const offset = (input.page - 1) * input.limit;
  values.push(input.limit, offset);

  const sql = `
    SELECT
      id,
      round_id,
      submitter_user_id,
      submitter_username,
      submitter_admin_preapproved,
      display_name,
      bio,
      quora_profile_url,
      normalized_quora_profile_url,
      skills,
      skills_signature,
      claimed_professions,
      status,
      url_validation_result,
      review_notes,
      edit_count,
      reviewed_by_user_id,
      reviewed_at,
      points_awarded,
      created_at,
      updated_at
    FROM skills_hunt_submissions
    WHERE ${whereClauses.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT $${parameterIndex}
    OFFSET $${parameterIndex + 1}
  `;

  const result = await pool.query<SubmissionRow>(sql, values);
  return result.rows.map(mapSubmission);
};

export const updateSubmissionReview = async (input: {
  submissionId: string;
  reviewedByUserId: string;
  status: SkillsHuntSubmissionStatus;
  reviewNotes?: string;
  pointsAwarded?: number;
}): Promise<SkillsHuntSubmission | null> => {
  const pool = getDbPool();
  const result = await pool.query<SubmissionRow>(
    `
      UPDATE skills_hunt_submissions
      SET
        status = $2,
        review_notes = $3,
        points_awarded = $4,
        reviewed_by_user_id = $5,
        reviewed_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        round_id,
        submitter_user_id,
        submitter_username,
        submitter_admin_preapproved,
        display_name,
        bio,
        quora_profile_url,
        normalized_quora_profile_url,
        skills,
        skills_signature,
        claimed_professions,
        status,
        url_validation_result,
        review_notes,
        edit_count,
        reviewed_by_user_id,
        reviewed_at,
        points_awarded,
        created_at,
        updated_at
    `,
    [input.submissionId, input.status, input.reviewNotes ?? null, input.pointsAwarded ?? 0, input.reviewedByUserId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapSubmission(result.rows[0]);
};

export const editSubmission = async (input: {
  submissionId: string;
  displayName?: string;
  bio?: string;
  skills?: string[];
  skillsSignature?: string;
  claimedProfessions?: string[];
  reviewedByUserId: string;
  reviewNotes?: string;
}): Promise<SkillsHuntSubmission | null> => {
  const current = await getSubmissionById(input.submissionId);
  if (!current) {
    return null;
  }

  const pool = getDbPool();
  const result = await pool.query<SubmissionRow>(
    `
      UPDATE skills_hunt_submissions
      SET
        display_name = $2,
        bio = $3,
        skills = $4::jsonb,
        skills_signature = $5,
        claimed_professions = $6::jsonb,
        edit_count = edit_count + 1,
        review_notes = $7,
        reviewed_by_user_id = $8,
        reviewed_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        round_id,
        submitter_user_id,
        submitter_username,
        submitter_admin_preapproved,
        display_name,
        bio,
        quora_profile_url,
        normalized_quora_profile_url,
        skills,
        skills_signature,
        claimed_professions,
        status,
        url_validation_result,
        review_notes,
        edit_count,
        reviewed_by_user_id,
        reviewed_at,
        points_awarded,
        created_at,
        updated_at
    `,
    [
      input.submissionId,
      input.displayName ?? current.displayName,
      input.bio ?? current.bio,
      JSON.stringify(input.skills ?? current.skills),
      input.skillsSignature ?? current.skillsSignature,
      JSON.stringify(input.claimedProfessions ?? current.claimedProfessions),
      input.reviewNotes ?? current.reviewNotes,
      input.reviewedByUserId,
    ],
  );

  return mapSubmission(result.rows[0]);
};
