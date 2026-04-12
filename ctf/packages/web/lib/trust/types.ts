// Trust plugin types for web app

export type TrustStatus = 'unverified' | 'verified' | 'flagged';
export type TrustVisibility = 'public' | 'private' | 'restricted';

export interface TrustEvidenceItem {
  type: string; // e.g. 'admin-note', 'user-submission', 'external-link'
  summary: string;
  details?: string;
  createdAt: string;
  createdBy?: string;
}

export interface TrustUserExtension {
  userId: string;
  trustStatus: TrustStatus;
  trustEvidence: TrustEvidenceItem[];
  trustVisibility: TrustVisibility;
  updatedAt: string;
}

export interface TrustSignalSnapshot {
  id: string;
  userId: string;
  snapshot: Record<string, unknown>;
  snapshotType: string;
  createdAt: string;
}

export interface TrustAdminAuditTrail {
  id: string;
  actorUserId?: string;
  command: string;
  policyStatus: 'allow' | 'deny';
  reason: string;
  targetUserId?: string;
  requestId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
