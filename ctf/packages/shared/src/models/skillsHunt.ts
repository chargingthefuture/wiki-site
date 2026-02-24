export type SkillsHuntRoundStatus = "draft" | "active" | "closed" | "archived";

export interface SkillsHuntScoringConfig {
  matchPoints: number;
  firstMatchBonus: number;
  skillStackBonus: number;
  rareSkillBonus: number;
  qualityBonus: number;
}

export interface SkillsHuntRound {
  id: string;
  name: string;
  description: string;
  status: SkillsHuntRoundStatus;
  startsAtIso: string;
  endsAtIso: string;
  scoringConfig: SkillsHuntScoringConfig;
  createdByUserId: string;
  updatedByUserId: string;
  createdAtIso: string;
  updatedAtIso: string;
}

export type SkillsHuntSubmissionStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "flagged"
  | "auto_rejected";

export type SkillsHuntUrlValidationResult = "unchecked" | "valid" | "dead" | "invalid";

export interface SkillsHuntSubmission {
  id: string;
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
  urlValidationResult: SkillsHuntUrlValidationResult;
  reviewNotes: string | null;
  editCount: number;
  reviewedByUserId: string | null;
  reviewedAtIso: string | null;
  pointsAwarded: number;
  createdAtIso: string;
  updatedAtIso: string;
}

export type SkillsHuntLeaderboardMode = "individual" | "team";

export interface SkillsHuntLeaderboardEntry {
  roundId: string;
  mode: SkillsHuntLeaderboardMode;
  entryKey: string;
  displayName: string;
  points: number;
  acceptedCount: number;
  firstMatchCount: number;
  rareSkillCount: number;
  rank: number;
  updatedAtIso: string;
}

export interface SkillsHuntAchievement {
  id: number;
  userId: string;
  roundId: string | null;
  code: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  awardedAtIso: string;
}

export interface SkillsHuntNotification {
  id: string;
  userId: string;
  notificationType: string;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  isRead: boolean;
  readAtIso: string | null;
  createdAtIso: string;
}

export interface SkillsHuntFeatureRewardCard {
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
  updatedByUserId: string;
  updatedAtIso: string;
}

export interface CreateSkillsHuntRoundRequest {
  name: string;
  description?: string;
  status?: SkillsHuntRoundStatus;
  startsAtIso: string;
  endsAtIso: string;
  scoringConfig?: Partial<SkillsHuntScoringConfig>;
}

export interface UpdateSkillsHuntRoundRequest {
  name?: string;
  description?: string;
  status?: SkillsHuntRoundStatus;
  startsAtIso?: string;
  endsAtIso?: string;
  scoringConfig?: Partial<SkillsHuntScoringConfig>;
}

export interface SubmitSkillsHuntEntryRequest {
  displayName: string;
  bio: string;
  quoraProfileUrl: string;
  skills: string[] | string;
  claimedProfessions?: string[] | string;
  adminPreapproved?: boolean;
}

export type SkillsHuntReviewAction = "accept" | "reject" | "edit" | "flag";

export interface ReviewSkillsHuntSubmissionRequest {
  action: SkillsHuntReviewAction;
  notes?: string;
  edit?: {
    displayName?: string;
    bio?: string;
    skills?: string[] | string;
    claimedProfessions?: string[] | string;
  };
}

export interface UpdateSkillsHuntFeatureRewardCardRequest {
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
}
