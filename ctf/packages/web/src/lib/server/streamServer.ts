import { StreamChat } from "stream-chat";
import { getRequiredServerEnv } from "./providerEnv";

let cachedServerClient: StreamChat | null = null;

export const getStreamServerClient = () => {
  const apiKey = getRequiredServerEnv("STREAM_API_KEY");
  const apiSecret = getRequiredServerEnv("STREAM_API_SECRET");

  if (!cachedServerClient) {
    cachedServerClient = StreamChat.getInstance(apiKey, apiSecret);
  }

  return cachedServerClient;
};

export const createStreamUserToken = (userId: string): { apiKey: string; token: string } | null => {
  const apiKey = getRequiredServerEnv("STREAM_API_KEY");
  const client = getStreamServerClient();

  if (!client) {
    return null;
  }

  const token = client.createToken(userId);
  return { apiKey, token };
};

export const provisionStreamUserAndChannel = async (input: {
  userId: string;
  userName: string;
  channelType?: string;
  channelId: string;
  channelName: string;
}): Promise<boolean> => {
  const client = getStreamServerClient();
  if (!client) {
    return false;
  }

  const channelType = input.channelType ?? "messaging";

  await client.upsertUser({
    id: input.userId,
    name: input.userName,
  });

  const channel = client.channel(channelType, input.channelId, {
    name: input.channelName,
    created_by_id: input.userId,
    members: [input.userId],
  });

  try {
    await channel.create();
  } catch {
    await channel.addMembers([input.userId]);
  }

  return true;
};
