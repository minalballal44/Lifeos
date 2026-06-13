import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeOS — Your Complete Life Management System",
  description:
    "AI-powered productivity platform to organize your entire life, track goals, build habits, journal daily, and stay accountable.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-hidden">{children}</body>
    </html>
  );
}
