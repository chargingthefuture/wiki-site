import type { Metadata } from 'next';
import { ClerkProvider } from '../lib/auth/clerk-wrapper';
import {
  getClerkAfterSignOutUrl,
  getClerkPublishableKey,
  getClerkSignInUrl,
} from '../lib/auth/clerk-env';
import './globals.css';

export const metadata: Metadata = {
  title: 'CTF Survivor Hub',
  description: 'Dark theme plugin-first community shell for survivor-centered support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = getClerkPublishableKey();
  // signInUrl is passed to ClerkProvider for client-side redirect awareness
  // (matching the working platform pattern). It is NOT passed to
  // clerkMiddleware — see clerk-env.ts getClerkRuntimeOptions().
  const signInUrl = getClerkSignInUrl();
  const afterSignOutUrl = getClerkAfterSignOutUrl();
  const clerkProviderProps = {
    ...(publishableKey ? { publishableKey } : {}),
    ...(signInUrl ? { signInUrl } : {}),
    ...(afterSignOutUrl ? { afterSignOutUrl } : {}),
    // After sign-in, redirect to /apps if no redirect_url was provided.
    // Matches the platform's signInFallbackRedirectUrl pattern.
    signInFallbackRedirectUrl: '/apps',
  };

  return (
    <html lang="en">
      <body>
        <ClerkProvider {...clerkProviderProps}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
