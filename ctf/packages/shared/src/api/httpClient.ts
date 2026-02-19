export interface HttpClientOptions {
  baseUrl: string;
  authToken?: string;
}

export const createHttpClient = (options: HttpClientOptions) => {
  return {
    get: async <T>(path: string): Promise<T> => {
      const response = await fetch(`${options.baseUrl}${path}`, {
        headers: options.authToken
          ? {
              Authorization: `Bearer ${options.authToken}`,
            }
          : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP GET failed: ${response.status}`);
      }

      return (await response.json()) as T;
    },
  };
};
