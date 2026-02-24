import type { SkillsHuntScoringConfig } from "@ctf/shared";
import { DEFAULT_SKILLS_HUNT_SCORING_CONFIG } from "./constants";

export interface SkillsHuntScoringInput {
  claimedProfessionsCount: number;
  isFirstMatchForSubmitter: boolean;
  hasRareSkill: boolean;
  acceptedWithoutEdit: boolean;
}

export interface SkillsHuntScoreBreakdown {
  total: number;
  matchPoints: number;
  firstMatchBonus: number;
  skillStackBonus: number;
  rareSkillBonus: number;
  qualityBonus: number;
}

export const resolveScoringConfig = (
  input: Partial<SkillsHuntScoringConfig> | null | undefined,
): SkillsHuntScoringConfig => {
  return {
    matchPoints: input?.matchPoints ?? DEFAULT_SKILLS_HUNT_SCORING_CONFIG.matchPoints,
    firstMatchBonus: input?.firstMatchBonus ?? DEFAULT_SKILLS_HUNT_SCORING_CONFIG.firstMatchBonus,
    skillStackBonus: input?.skillStackBonus ?? DEFAULT_SKILLS_HUNT_SCORING_CONFIG.skillStackBonus,
    rareSkillBonus: input?.rareSkillBonus ?? DEFAULT_SKILLS_HUNT_SCORING_CONFIG.rareSkillBonus,
    qualityBonus: input?.qualityBonus ?? DEFAULT_SKILLS_HUNT_SCORING_CONFIG.qualityBonus,
  };
};

export const computeSkillsHuntScore = (
  configInput: Partial<SkillsHuntScoringConfig> | null | undefined,
  data: SkillsHuntScoringInput,
): SkillsHuntScoreBreakdown => {
  const config = resolveScoringConfig(configInput);

  const firstMatchBonus = data.isFirstMatchForSubmitter ? config.firstMatchBonus : 0;
  const skillStackBonus = data.claimedProfessionsCount >= 2 ? config.skillStackBonus : 0;
  const rareSkillBonus = data.hasRareSkill ? config.rareSkillBonus : 0;
  const qualityBonus = data.acceptedWithoutEdit ? config.qualityBonus : 0;

  const total = config.matchPoints + firstMatchBonus + skillStackBonus + rareSkillBonus + qualityBonus;

  return {
    total,
    matchPoints: config.matchPoints,
    firstMatchBonus,
    skillStackBonus,
    rareSkillBonus,
    qualityBonus,
  };
};
