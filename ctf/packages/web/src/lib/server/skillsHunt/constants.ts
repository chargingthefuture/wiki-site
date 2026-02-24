import type { SkillsHuntScoringConfig } from "@ctf/shared";

export const SKILLS_HUNT_MAX_SUBMISSIONS_PER_USER_ROLLING_7_DAYS = 5;
export const SKILLS_HUNT_REJECTION_GUARD_MIN_REVIEWED = 5;
export const SKILLS_HUNT_REJECTION_GUARD_MAX_RATE = 0.2;
export const SKILLS_HUNT_URL_VERIFY_TIMEOUT_MS = 5000;

export const DEFAULT_SKILLS_HUNT_SCORING_CONFIG: SkillsHuntScoringConfig = {
  matchPoints: 10,
  firstMatchBonus: 5,
  skillStackBonus: 4,
  rareSkillBonus: 6,
  qualityBonus: 3,
};
