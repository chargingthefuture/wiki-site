type MaybeEnv = string | undefined;

function firstNonEmpty(...values: MaybeEnv[]): string | undefined {
  return values.find((value) => typeof value === 'string' && value.length > 0);
}

export function getClerkPublishableKey(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    process.env.RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    process.env.VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    process.env.RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  );
}

export function getClerkSecretKey(): string | undefined {
  return firstNonEmpty(
    process.env.CLERK_SECRET_KEY,
    process.env.RAILWAY_STAGING_CLERK_SECRET_KEY,
    process.env.VERCEL_CLERK_SECRET_KEY,
    process.env.RAILWAY_PROD_CLERK_SECRET_KEY,
  );
}

export function getClerkSignInUrl(): string | undefined {
  return firstNonEmpty(
    process.env.CLERK_SIGN_IN_URL,
    process.env.RAILWAY_STAGING_CLERK_SIGN_IN_URL,
    process.env.VERCEL_CLERK_SIGN_IN_URL,
    process.env.RAILWAY_PROD_CLERK_SIGN_IN_URL,
  );
}

export function getClerkRuntimeOptions(): {
  publishableKey?: string;
  secretKey?: string;
  signInUrl?: string;
} {
  return {
    publishableKey: getClerkPublishableKey(),
    secretKey: getClerkSecretKey(),
    signInUrl: getClerkSignInUrl(),
  };
}