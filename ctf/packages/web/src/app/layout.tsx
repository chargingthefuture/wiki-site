import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TI Skills Economy",
  description: "A trauma-informed skills economy for survivors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <html lang="en">
      <body>
        {publishableKey ? (
          <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
