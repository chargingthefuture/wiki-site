import type { Metadata } from 'next';
import { ClerkProvider } from '../lib/auth/clerk-wrapper';
import {
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
  const signInUrl = getClerkSignInUrl();
  const clerkProviderProps = {
    ...(publishableKey ? { publishableKey } : {}),
    ...(signInUrl ? { signInUrl } : {}),
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
