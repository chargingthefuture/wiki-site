import { headers } from "next/headers";
import { resolveClerkRuntimeConfig } from "./clerkHostConfig";

const hydrateClerkServerEnv = async (request?: Request) => {
  const headerReader = request?.headers ?? (await headers());
  const { secretKey } = resolveClerkRuntimeConfig(headerReader);

  if (process.env.CLERK_SECRET_KEY !== secretKey) {
    process.env.CLERK_SECRET_KEY = secretKey;
  }
};

export const getClerkServerModule = async (request?: Request) => {
  await hydrateClerkServerEnv(request);
  return import("@clerk/nextjs/server");
};
