
type MaybeEnv = string | undefined;

function firstNonEmpty(...values: MaybeEnv[]): string | undefined {
  return values.find((value) => typeof value === 'string' && value.length > 0);
}

function parseUrl(value: string | undefined): URL | null {
  if (!value) {
    return null;
  }
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function getAppUrl(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.RAILWAY_NEXT_PUBLIC_APP_URL,
  );
}

export function getClerkPublishableKey(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    process.env.RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    process.env.RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  );
}

export function getClerkSecretKey(): string | undefined {
  return firstNonEmpty(
    process.env.CLERK_SECRET_KEY,
    process.env.RAILWAY_STAGING_CLERK_SECRET_KEY,
    process.env.RAILWAY_PROD_CLERK_SECRET_KEY,
  );
}

export function getClerkSignInUrl(): string | undefined {
  const configuredSignInUrl = firstNonEmpty(
    process.env.CLERK_SIGN_IN_URL,
    process.env.RAILWAY_STAGING_CLERK_SIGN_IN_URL,
    process.env.RAILWAY_PROD_CLERK_SIGN_IN_URL,
  );
  if (!configuredSignInUrl) {
    return undefined;
  }

  if (configuredSignInUrl.startsWith('/')) {
    return configuredSignInUrl;
  }

  const signInUrl = parseUrl(configuredSignInUrl);
  const appUrl = parseUrl(getAppUrl());

  if (!signInUrl || !appUrl) {
    return undefined;
  }

  if (signInUrl.host !== appUrl.host) {
    return undefined;
  }

  return `${signInUrl.pathname}${signInUrl.search}${signInUrl.hash}`;
}

export function getClerkRuntimeOptions(): {
  publishableKey?: string;
  secretKey?: string;
  signInUrl?: string;
} {
  const publishableKey = getClerkPublishableKey();
  const secretKey = getClerkSecretKey();
  const signInUrl = getClerkSignInUrl();

  return {
    ...(publishableKey ? { publishableKey } : {}),
    ...(secretKey ? { secretKey } : {}),
    ...(signInUrl ? { signInUrl } : {}),
  };
}