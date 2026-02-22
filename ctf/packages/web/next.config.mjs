import { withSentryConfig } from "@sentry/nextjs";

const isVercelBuild = process.env.VERCEL === "1";
const webProvider = isVercelBuild ? "VERCEL" : "RAILWAY";

const requiredUniversalEnv = (name) => {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
};

const requiredProviderEnv = (suffix) => {
  const key = `${webProvider}_${suffix}`;
  const value = process.env[key];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

const nextPublicAppUrl = requiredProviderEnv("NEXT_PUBLIC_APP_URL");
const sentryDsn = requiredProviderEnv("SENTRY_DSN");

const databaseUrl = requiredUniversalEnv("DATABASE_URL");
const streamApiKey = requiredUniversalEnv("STREAM_API_KEY");
const streamApiSecret = requiredUniversalEnv("STREAM_API_SECRET");
const observabilityProvider = requiredUniversalEnv("OBSERVABILITY_PROVIDER");

process.env.SENTRY_DSN = sentryDsn;
process.env.DATABASE_URL = databaseUrl;
process.env.STREAM_API_KEY = streamApiKey;
process.env.STREAM_API_SECRET = streamApiSecret;
process.env.OBSERVABILITY_PROVIDER = observabilityProvider;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  env: {
    NEXT_PUBLIC_APP_URL: nextPublicAppUrl,
    NEXT_PUBLIC_STREAM_API_KEY: streamApiKey,
    NEXT_PUBLIC_SENTRY_DSN: sentryDsn,
    NEXT_PUBLIC_OBSERVABILITY_PROVIDER: observabilityProvider,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "charging-the-future",
  project: "javascript-nextjs",
});
