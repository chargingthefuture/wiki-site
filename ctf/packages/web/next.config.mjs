import { withSentryConfig } from "@sentry/nextjs";

const isVercelBuild = process.env.VERCEL === "1";

if (isVercelBuild && !process.env.VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY for Vercel build. " +
      "Vercel deployments must use dedicated Vercel Clerk keys and must not fall back to Railway keys.",
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      (isVercelBuild
        ? process.env.VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) || "",
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "charging-the-future",
  project: "javascript-nextjs",
});
