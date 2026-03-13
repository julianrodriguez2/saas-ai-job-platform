"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isCenteredPage = pathname === "/login" || pathname === "/onboarding";

  if (isCenteredPage) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
