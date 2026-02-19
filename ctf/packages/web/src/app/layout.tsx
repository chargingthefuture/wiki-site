import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TI Skills Economy",
  description: "A trauma-informed skills economy for survivors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
