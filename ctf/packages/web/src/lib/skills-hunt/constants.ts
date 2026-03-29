export const SKILLS_HUNT_DEFAULT_PAGE = 1;
export const SKILLS_HUNT_DEFAULT_PAGE_SIZE = 20;
export const SKILLS_HUNT_MAX_PAGE_SIZE = 100;

export const SKILLS_HUNT_MAX_ROUND_NAME_LENGTH = 120;
export const SKILLS_HUNT_MAX_ROUND_DESCRIPTION_LENGTH = 1200;
export const SKILLS_HUNT_MAX_DISPLAY_NAME_LENGTH = 120;
export const SKILLS_HUNT_MAX_BIO_LENGTH = 1200;
export const SKILLS_HUNT_MAX_URL_LENGTH = 512;
export const SKILLS_HUNT_MAX_REVIEW_NOTES_LENGTH = 1000;

export const SKILLS_HUNT_SUBMISSION_LIMIT_7D = 10;
export const SKILLS_HUNT_REJECTION_GUARD_SAMPLE_SIZE = 10;
export const SKILLS_HUNT_REJECTION_GUARD_THRESHOLD = 0.8;

export const SKILLS_HUNT_SCORE_WEIGHTS = {
  matchBase: 3,
  firstMatchBonus: 4,
  stackBonusPerProfession: 2,
  rareSkillBonusDefault: 3,
  qualityBonus: 2,
} as const;

export const SKILLS_HUNT_ERROR_CODE = {
  invalidPayload: 'SKILLS_HUNT_INVALID_PAYLOAD',
  persistenceUnavailable: 'SKILLS_HUNT_PERSISTENCE_UNAVAILABLE',
  csrfDenied: 'SKILLS_HUNT_CSRF_DENIED',
  roundNotFound: 'SKILLS_HUNT_ROUND_NOT_FOUND',
  roundNotActive: 'SKILLS_HUNT_ROUND_NOT_ACTIVE',
  duplicateSubmission: 'SKILLS_HUNT_DUPLICATE_SUBMISSION',
  submissionLimitExceeded: 'SKILLS_HUNT_SUBMISSION_LIMIT_EXCEEDED',
  rejectionGuardViolation: 'SKILLS_HUNT_REJECTION_GUARD_VIOLATION',
  submissionNotFound: 'SKILLS_HUNT_SUBMISSION_NOT_FOUND',
  invalidReviewAction: 'SKILLS_HUNT_INVALID_REVIEW_ACTION',
  profileAlreadyGenerated: 'SKILLS_HUNT_PROFILE_ALREADY_GENERATED',
} as const;
