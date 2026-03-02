import { StreamChat } from 'stream-chat';
import type { MembershipEventType } from './types';

type StreamConfig = {
  apiKey: string;
  apiSecret: string;
};

function getStreamConfig(): StreamConfig | null {
  const apiKey = process.env.STREAM_API_KEY?.trim();
  const apiSecret = process.env.STREAM_API_SECRET?.trim();

  if (!apiKey || !apiSecret) {
    return null;
  }

  return { apiKey, apiSecret };
}

export async function emitFeedMembershipEventToStream(input: {
  actorId: string;
  userId: string;
  pluginId: string;
  eventType: MembershipEventType;
  requestId: string | null;
  traceId: string | null;
}): Promise<boolean> {
  const streamConfig = getStreamConfig();
  if (!streamConfig) {
    return false;
  }

  const streamClient = StreamChat.getInstance(streamConfig.apiKey, streamConfig.apiSecret);
  const channel = streamClient.channel('messaging', 'ctf-feed-membership-events', {
    created_by_id: `feed-${input.actorId}`,
    name: 'CTF Feed Membership Events',
  });

  try {
    await channel.create();
  } catch {
    await channel.watch();
  }

  await channel.sendEvent({
    type: 'feed.membership.updated',
    actorId: input.actorId,
    userId: input.userId,
    pluginId: input.pluginId,
    eventType: input.eventType,
    requestId: input.requestId,
    traceId: input.traceId,
    emittedAt: new Date().toISOString(),
  });

  return true;
}
