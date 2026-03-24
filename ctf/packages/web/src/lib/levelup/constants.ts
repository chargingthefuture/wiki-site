export const LEVELUP_PLUGIN_SLUG = 'levelup';

export const LEVELUP_ERROR_CODE = {
  invalidPayload: 'levelup_invalid_payload',
  invalidJson: 'levelup_invalid_json',
  notFound: 'levelup_not_found',
  invalidState: 'levelup_invalid_state',
  insufficientBalance: 'levelup_insufficient_balance',
  rateLimitExceeded: 'levelup_rate_limit_exceeded',
  forbidden: 'levelup_forbidden',
  unavailable: 'levelup_unavailable',
} as const;

export const LEVELUP_DEFAULT_STARTER_CREDITS = 500;
export const LEVELUP_DEFAULT_TRAINER_SPLIT_PERCENT = 25;

export const LEVELUP_RATE_LIMIT = {
  enrollPerMinute: 6,
  milestoneValidatePerMinute: 20,
} as const;

export const LEVELUP_STATUS = {
  cohort: ['draft', 'open', 'active', 'completed', 'cancelled'] as const,
  enrollment: ['enrolled', 'active', 'completed', 'dropped'] as const,
  milestoneValidation: ['validated', 'released', 'disputed'] as const,
  dispute: ['open', 'under_review', 'resolved', 'dismissed'] as const,
} as const;

export type CohortStatus = (typeof LEVELUP_STATUS.cohort)[number];
export type EnrollmentStatus = (typeof LEVELUP_STATUS.enrollment)[number];
export type MilestoneValidationStatus = (typeof LEVELUP_STATUS.milestoneValidation)[number];
export type DisputeStatus = (typeof LEVELUP_STATUS.dispute)[number];
