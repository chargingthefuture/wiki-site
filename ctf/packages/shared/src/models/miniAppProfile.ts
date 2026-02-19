export type MiniAppName = "chyme";

export interface MiniAppProfileRecord {
  userId: string;
  miniAppName: MiniAppName;
  createdAtIso: string;
  updatedAtIso: string;
  deletedAtIso?: string;
}

export interface MiniAppDeletionRequest {
  userId: string;
  miniAppName: MiniAppName;
  reason: "user_requested" | "policy_enforcement";
  requestedAtIso: string;
}
