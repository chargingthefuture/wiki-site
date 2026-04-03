import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { SignIn } from 'lib/auth/clerk-wrapper';
import { getAppUrl, getClerkSignInUrl } from 'lib/auth/clerk-env';

type SignInPageProps = {
  searchParams?: Promise<{
    redirect_url?: string;
  }>;
};

/**
 * Returns the redirect_url value only when it is a safe same-origin
 * destination (relative path or matching the app host). Foreign origins are
 * rejected to prevent open-redirect attacks (OWASP A1).
 */
function safeRedirectUrl(raw: string | undefined): string | null {
  if (!raw) {
    return null;
  }

  // Relative paths are always safe.
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }

  try {
    const parsed = new URL(raw);
    const appUrl = getAppUrl();
    if (appUrl) {
      const parsedApp = new URL(appUrl);
      if (parsed.hostname === parsedApp.hostname) {
        return parsed.pathname + parsed.search + parsed.hash;
      }
    }
  } catch {
    // Malformed URL — reject.
  }

  return null;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;

  // If the user is already authenticated, skip the sign-in form entirely and
  // forward them to the requested destination (or /apps as a fallback).
  const session = await auth();
  if (session.userId) {
    const destination = safeRedirectUrl(resolvedSearchParams?.redirect_url) ?? '/apps';
    redirect(destination);
  }

  const signInUrl = getClerkSignInUrl();
  if (signInUrl && /^https?:\/\//.test(signInUrl)) {
    const hostedSignInUrl = new URL(signInUrl);
    const validatedRedirect = safeRedirectUrl(resolvedSearchParams?.redirect_url);
    if (validatedRedirect) {
      hostedSignInUrl.searchParams.set('redirect_url', validatedRedirect);
    }
    redirect(hostedSignInUrl.toString());
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1117',
      }}
    >
      <SignIn />
    </div>
  );
}
