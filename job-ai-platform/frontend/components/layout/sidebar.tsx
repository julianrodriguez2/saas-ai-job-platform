"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resume Builder", href: "/resume-builder" },
  { label: "Job Board", href: "/job-board" },
  { label: "Job Tracker", href: "/job-tracker" },
  { label: "Settings", href: "/settings" }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userEmail = user?.email ?? "Not signed in";

  return (
    <aside className="w-full border-b border-border bg-panel p-4 md:flex md:h-screen md:w-64 md:flex-col md:border-b-0 md:border-r">
      <div className="mb-6 md:mb-8">
        <p className="text-lg font-semibold text-primary">Job AI Platform</p>
      </div>
      <nav className="flex flex-row flex-wrap gap-2 md:flex-col">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                active ? "bg-primary text-white" : "bg-surface text-text hover:bg-border"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        {!user ? (
          <Link
            href="/login"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === "/login" ? "bg-primary text-white" : "bg-surface text-text hover:bg-border"
            }`}
          >
            Login
          </Link>
        ) : null}
      </nav>
      <div className="mt-6 border-t border-border pt-4 md:mt-auto">
        <div className="mb-3 flex items-center gap-3">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt="User avatar"
              className="h-10 w-10 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-muted">
              {userEmail.slice(0, 1).toUpperCase()}
            </div>
          )}
          <p className="truncate text-sm text-muted">{userEmail}</p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition hover:bg-border"
          >
            Logout
          </button>
        ) : null}
      </div>
    </aside>
  );
}
