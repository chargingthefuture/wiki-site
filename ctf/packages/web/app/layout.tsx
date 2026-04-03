import type { Metadata } from 'next';
import { ClerkProvider } from '../lib/auth/clerk-wrapper';
import {
  getClerkAfterSignOutUrl,
  getClerkPublishableKey,
  getClerkSignInUrl,
  isSignInUrlExternal,
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
  // Only pass signInUrl to ClerkProvider when it points to an external host
  // (e.g. Clerk Account Portal). Same-origin / relative values are omitted so
  // Clerk uses its native Account Portal redirect flow.
  const signInUrl = isSignInUrlExternal() ? getClerkSignInUrl() : undefined;
  const afterSignOutUrl = getClerkAfterSignOutUrl();
  const clerkProviderProps = {
    ...(publishableKey ? { publishableKey } : {}),
    ...(signInUrl ? { signInUrl } : {}),
    ...(afterSignOutUrl ? { afterSignOutUrl } : {}),
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
