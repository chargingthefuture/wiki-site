import { StreamChat } from 'stream-chat';
import { CHYME_MAIN_ROOM_KEY } from './constants';

type StreamConfig = {
  apiKey: string;
  apiSecret: string;
};

export type StreamJoinCredentials = {
  streamApiKey: string;
  streamChannelId: string;
  streamUserId: string;
  streamToken: string;
};

function getStreamConfig(): StreamConfig | null {
  const apiKey = process.env.STREAM_API_KEY?.trim();
  const apiSecret = process.env.STREAM_API_SECRET?.trim();

  if (!apiKey || !apiSecret) {
    return null;
  }

  return {
    apiKey,
    apiSecret,
  };
}

function createStreamUserId(userId: string): string {
  return `chyme-${userId}`;
}

export async function createStreamJoinCredentials(
  userId: string,
  displayName: string,
): Promise<StreamJoinCredentials | null> {
  const streamConfig = getStreamConfig();
  if (!streamConfig) {
    return null;
  }

  const streamUserId = createStreamUserId(userId);
  const streamClient = StreamChat.getInstance(streamConfig.apiKey, streamConfig.apiSecret);

  await streamClient.upsertUser({
    id: streamUserId,
    name: displayName,
  });

  const channel = streamClient.channel('messaging', CHYME_MAIN_ROOM_KEY, {
    created_by_id: streamUserId,
    name: 'Chyme Main Room',
  });

  try {
    await channel.create();
  } catch {
    await channel.watch();
  }
  await channel.addMembers([streamUserId]);
  const streamChannelId = channel.id ?? CHYME_MAIN_ROOM_KEY;

  return {
    streamApiKey: streamConfig.apiKey,
    streamChannelId,
    streamUserId,
    streamToken: streamClient.createToken(streamUserId),
  };
}
