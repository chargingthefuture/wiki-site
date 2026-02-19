import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "charging-the-future",
  project: "javascript-nextjs",
});
