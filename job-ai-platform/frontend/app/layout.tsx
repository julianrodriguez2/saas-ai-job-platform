import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job AI Platform",
  description: "AI-powered job search platform SaaS scaffold"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <AppShell>{children}</AppShell>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
