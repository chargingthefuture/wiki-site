import { StreamChat } from 'stream-chat';

type StreamConfig = {
  apiKey: string;
  apiSecret: string;
};

export type TrustTransportStreamParticipantCredentials = {
  streamApiKey: string;
  streamUserId: string;
  streamToken: string;
};

function getStreamConfig(): StreamConfig | null {
  const apiKey = process.env.STREAM_API_KEY?.trim();
  const apiSecret = process.env.STREAM_API_SECRET?.trim();
  if (!apiKey || !apiSecret) {
    return null;
  }

  return { apiKey, apiSecret };
}

function toStreamUserId(userId: string): string {
  return `trusttransport-${userId}`;
}

async function upsertStreamUser(streamClient: StreamChat, userId: string): Promise<string> {
  const streamUserId = toStreamUserId(userId);
  await streamClient.upsertUser({ id: streamUserId, name: streamUserId });
  return streamUserId;
}

export async function ensureTrustTransportTripChannel(input: {
  tripId: string;
  requesterUserId: string;
  providerUserId: string;
}): Promise<string | null> {
  const config = getStreamConfig();
  if (!config) {
    return null;
  }

  const streamClient = StreamChat.getInstance(config.apiKey, config.apiSecret);
  const requesterStreamUserId = await upsertStreamUser(streamClient, input.requesterUserId);
  const providerStreamUserId = await upsertStreamUser(streamClient, input.providerUserId);

  const streamChannelId = `trusttransport-trip-${input.tripId}`;
  const channel = streamClient.channel('messaging', streamChannelId, {
    created_by_id: requesterStreamUserId,
    name: 'TrustTransport Trip Thread',
  });

  try {
    await channel.create();
  } catch {
    await channel.watch();
  }

  await channel.addMembers([requesterStreamUserId, providerStreamUserId]);
  return streamChannelId;
}

export async function createTrustTransportParticipantToken(userId: string): Promise<TrustTransportStreamParticipantCredentials | null> {
  const config = getStreamConfig();
  if (!config) {
    return null;
  }

  const streamClient = StreamChat.getInstance(config.apiKey, config.apiSecret);
  const streamUserId = await upsertStreamUser(streamClient, userId);

  return {
    streamApiKey: config.apiKey,
    streamUserId,
    streamToken: streamClient.createToken(streamUserId),
  };
}
