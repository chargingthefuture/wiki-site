export type UserId = string;
export type ChannelId = string;
export type MessageId = string;

export interface RequestContext {
  requestId: string;
  actorId?: string;
}
