"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
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
