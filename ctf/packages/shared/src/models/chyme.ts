export interface ChymeParticipant {
  id: string;
  displayName: string;
  avatarUrl?: string;
  role: "speaker" | "listener";
}

export interface ChymeRoomState {
  roomId: string;
  roomName: string;
  serviceName: "chyme";
  callActive: boolean;
  participants: ChymeParticipant[];
}

export interface ChymeChatMessage {
  id: string;
  authorId: string;
  authorDisplayName: string;
  text: string;
  sentAtIso: string;
}

export interface ChymeJoinCallResponse {
  ok: boolean;
  roomId: string;
  streamChannelId?: string;
  streamCallType?: string;
  streamApiKey?: string;
  streamUserId?: string;
  streamUserName?: string;
  streamToken?: string;
}

export interface ServiceDeletionResponse {
  ok: boolean;
  scope: "service" | "account";
  serviceName?: "chyme";
  deletedAtIso: string;
}
