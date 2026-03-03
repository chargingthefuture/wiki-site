export type SkillsHuntRoundStatus = 'draft' | 'active' | 'closed' | 'archived';
export type SkillsHuntSubmissionStatus = 'pending' | 'accepted' | 'rejected' | 'flagged';
export type SkillsHuntReviewAction = 'accept' | 'reject' | 'edit' | 'flag';
export type SkillsHuntLeaderboardMode = 'individual' | 'team';

export type SkillsHuntPagination = {
  page: number;
  pageSize: number;
};

export type SkillsHuntRound = {
  id: string;
  name: string;
  description: string | null;
  status: SkillsHuntRoundStatus;
  startsAtIso: string;
  endsAtIso: string;
  scoringConfig: Record<string, unknown>;
  createdByUserId: string;
  updatedByUserId: string;
  createdAtIso: string;
  updatedAtIso: string;
};

export type SkillsHuntRoundInput = {
  name: string;
  description: string | null;
  status: SkillsHuntRoundStatus;
  startsAtIso: string;
  endsAtIso: string;
  scoringConfig?: Record<string, unknown>;
};

export type SkillsHuntSubmission = {
  id: string;
  roundId: string;
  submitterUserId: string;
  submitterUsername: string | null;
  displayName: string;
  bio: string;
  quoraProfileUrl: string;
  skills: string[];
  claimedProfessions: string[];
  status: SkillsHuntSubmissionStatus;
  pointsAwarded: number;
  scoreBreakdown: Record<string, unknown>;
  reviewAction: SkillsHuntReviewAction | null;
  reviewNotes: string | null;
  reviewedByUserId: string | null;
  reviewedAtIso: string | null;
  directoryProfileGeneratedAtIso: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

export type SkillsHuntSubmissionInput = {
  roundId: string;
  displayName: string;
  bio: string;
  quoraProfileUrl: string;
  skills: string[];
  claimedProfessions: string[];
};

export type SkillsHuntSubmissionReviewInput = {
  action: SkillsHuntReviewAction;
  notes: string | null;
};

export type SkillsHuntLeaderboardItem = {
  rank: number;
  score: number;
  acceptedCount: number;
  rareSkillBonus: number;
  userId: string | null;
  usernameSnapshot: string | null;
  teamKey: string | null;
  metadata: Record<string, unknown>;
};

export type SkillsHuntAchievement = {
  id: string;
  userId: string;
  code: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  awardedAtIso: string;
};

export type SkillsHuntNotification = {
  id: string;
  userId: string;
  kind: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  readAtIso: string | null;
  createdAtIso: string;
};

export type SkillsHuntFeatureRewardCard = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
  updatedByUserId: string;
  updatedAtIso: string;
};

export type SkillsHuntFeatureRewardCardInput = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
};

export type SkillsHuntGeneratedDirectoryProfile = {
  submissionId: string;
  generatedProfileId: string;
  profileStatus: 'unclaimed';
  invitedByUsername: string;
  createdAtIso: string;
};
