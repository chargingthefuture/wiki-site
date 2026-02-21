function applyClerkEnvAliases() {
  if (process.env.VERCEL !== "1") {
    return;
  }

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  }

  if (!process.env.CLERK_SECRET_KEY && process.env.VERCEL_CLERK_SECRET_KEY) {
    process.env.CLERK_SECRET_KEY = process.env.VERCEL_CLERK_SECRET_KEY;
  }
}

export async function register() {
  applyClerkEnvAliases();

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
