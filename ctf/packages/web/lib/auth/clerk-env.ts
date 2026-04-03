
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
  if (!signInUrl) {
    return undefined;
  }

  // Hosted Clerk auth can live on a different host; preserve absolute URLs.
  return signInUrl.toString();
}

export function getClerkAfterSignOutUrl(): string | undefined {
  const configuredAfterSignOutUrl = firstNonEmpty(
    process.env.CLERK_AFTER_SIGN_OUT_URL,
    process.env.RAILWAY_STAGING_CLERK_AFTER_SIGN_OUT_URL,
    process.env.RAILWAY_PROD_CLERK_AFTER_SIGN_OUT_URL,
    getClerkSignInUrl(),
  );
  if (!configuredAfterSignOutUrl) {
    return undefined;
  }

  if (configuredAfterSignOutUrl.startsWith('/')) {
    return configuredAfterSignOutUrl;
  }

  const afterSignOutUrl = parseUrl(configuredAfterSignOutUrl);
  if (!afterSignOutUrl) {
    return undefined;
  }

  return afterSignOutUrl.toString();
}

/**
 * Returns true when the configured sign-in URL lives on a different host
 * (e.g. Clerk Account Portal) and should be passed to ClerkProvider /
 * clerkMiddleware. When the URL is relative or same-origin it is omitted so
 * Clerk falls back to its native Account Portal redirect flow.
 */
export function isSignInUrlExternal(): boolean {
  const signInUrl = getClerkSignInUrl();
  if (!signInUrl) {
    return false;
  }

  // Relative paths are same-origin by definition.
  if (signInUrl.startsWith('/')) {
    return false;
  }

  const parsedSignIn = parseUrl(signInUrl);
  if (!parsedSignIn) {
    return false;
  }

  const appUrl = getAppUrl();
  const parsedApp = parseUrl(appUrl);

  // If we cannot determine the app's own host, treat the sign-in URL as
  // external to avoid silently swallowing a configured value.
  if (!parsedApp) {
    return true;
  }

  return parsedSignIn.hostname !== parsedApp.hostname;
}

export function getClerkRuntimeOptions(): {
  publishableKey?: string;
  secretKey?: string;
  signInUrl?: string;
} {
  const publishableKey = getClerkPublishableKey();
  const secretKey = getClerkSecretKey();
  const signInUrl = isSignInUrlExternal() ? getClerkSignInUrl() : undefined;

  return {
    ...(publishableKey ? { publishableKey } : {}),
    ...(secretKey ? { secretKey } : {}),
    ...(signInUrl ? { signInUrl } : {}),
  };
}