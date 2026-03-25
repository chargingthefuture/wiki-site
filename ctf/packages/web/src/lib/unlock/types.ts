export type UnlockReviewStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export type UnlockAccessTier = 'pending_readonly' | 'locked_support_only' | 'approved_full';

export type UnlockSubmission = {
  id: number;
  userId: string;
  quoraProfileUrl: string;
  quoraProfileUrlNormalized: string;
  reviewStatus: UnlockReviewStatus;
  accessTier: UnlockAccessTier;
  unlockWindowExpiresAt: string;
  reminderStage: number;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  incentiveGrantedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUnlockSubmissionInput = {
  userId: string;
  quoraProfileUrl: string;
  quoraProfileUrlNormalized: string;
};

export type ReviewUnlockSubmissionInput = {
  actorUserId: string;
  submissionId: number;
  reviewStatus: Exclude<UnlockReviewStatus, 'pending'>;
  reviewNote?: string;
};

export type UnlockQueueFilters = {
  reviewStatus?: UnlockReviewStatus;
  accessTier?: UnlockAccessTier;
  limit?: number;
};

export type UnlockDashboardSnapshot = {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  spamCount: number;
  lockedSupportOnlyCount: number;
};

export type UnlockStatus = {
  userId: string;
  accessTier: UnlockAccessTier | null;
  reviewStatus: UnlockReviewStatus | null;
  unlockWindowExpiresAt: string | null;
  reminderStage: number;
  incentiveGrantedAt: string | null;
  hasSubmission: boolean;
};
