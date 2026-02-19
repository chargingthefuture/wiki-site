import { createStreamClient } from "@ctf/shared";

export const getMobileStreamClient = (apiKey: string, userId: string, token: string) => {
  return createStreamClient({
    apiKey,
    userId,
    token,
  });
};
