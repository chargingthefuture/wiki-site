import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TI Skills Economy",
  description: "A trauma-informed skills economy for survivors.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <html lang="en">
      <body>
        {publishableKey && signInUrl && appUrl ? (
          <ClerkProvider
            publishableKey={publishableKey}
            signInUrl={signInUrl}
            afterSignOutUrl={signInUrl}
            signInFallbackRedirectUrl={`${appUrl}/`}
          >
            {children}
          </ClerkProvider>
        ) : (
          <main className="access-center" aria-label="Authentication configuration required">
            <div className="access-card">
              <h1>Authentication configuration required</h1>
              <p>
                Clerk routing is not configured for this deployment. Set
                {" "}
                <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</strong>,
                {" "}
                <strong>NEXT_PUBLIC_CLERK_SIGN_IN_URL</strong>,
                {" "}
                and
                {" "}
                <strong>NEXT_PUBLIC_APP_URL</strong>
                {" "}
                and redeploy.
              </p>
            </div>
          </main>
        )}
      </body>
    </html>
  );
}
