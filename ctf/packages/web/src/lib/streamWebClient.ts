import { StreamChat } from "stream-chat";

let cachedClient: StreamChat | null = null;

export const getStreamWebClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = StreamChat.getInstance(apiKey);
  }

  return cachedClient;
};
