import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { resolveClerkRuntimeConfig } from "../lib/server/clerkHostConfig";
import "./globals.css";

export const metadata: Metadata = {
  title: "TI Skills Economy",
  description: "A trauma-informed skills economy for survivors.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const { host, publishableKey, signInUrl } = resolveClerkRuntimeConfig(requestHeaders);
  const appUrl = `https://${host}`;

  return (
    <html lang="en">
      <body>
        <ClerkProvider
          publishableKey={publishableKey}
          signInUrl={signInUrl}
          afterSignOutUrl={signInUrl}
          signInFallbackRedirectUrl={`${appUrl}/`}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
