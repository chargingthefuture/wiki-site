import { StreamChat } from 'stream-chat';

type StreamConfig = {
  apiKey: string;
  apiSecret: string;
};

export type LighthouseStreamParticipantCredentials = {
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
  return `lighthouse-${userId}`;
}

async function upsertStreamUser(streamClient: StreamChat, userId: string, displayName: string): Promise<string> {
  const streamUserId = toStreamUserId(userId);
  await streamClient.upsertUser({ id: streamUserId, name: displayName });
  return streamUserId;
}

export async function ensureLighthouseMatchChannel(input: {
  matchId: string;
  seekerUserId: string;
  seekerDisplayName: string;
  hostUserId: string;
  hostDisplayName: string;
}): Promise<string | null> {
  const config = getStreamConfig();
  if (!config) {
    return null;
  }

  const streamClient = StreamChat.getInstance(config.apiKey, config.apiSecret);
  const seekerStreamUserId = await upsertStreamUser(streamClient, input.seekerUserId, input.seekerDisplayName);
  const hostStreamUserId = await upsertStreamUser(streamClient, input.hostUserId, input.hostDisplayName);

  const streamChannelId = `lighthouse-match-${input.matchId}`;
  const channel = streamClient.channel('messaging', streamChannelId, {
    created_by_id: seekerStreamUserId,
    name: 'LightHouse Match Thread',
  });

  try {
    await channel.create();
  } catch {
    await channel.watch();
  }

  await channel.addMembers([seekerStreamUserId, hostStreamUserId]);
  return streamChannelId;
}

export async function createLighthouseParticipantToken(userId: string, displayName: string): Promise<LighthouseStreamParticipantCredentials | null> {
  const config = getStreamConfig();
  if (!config) {
    return null;
  }

  const streamClient = StreamChat.getInstance(config.apiKey, config.apiSecret);
  const streamUserId = await upsertStreamUser(streamClient, userId, displayName);

  return {
    streamApiKey: config.apiKey,
    streamUserId,
    streamToken: streamClient.createToken(streamUserId),
  };
}
