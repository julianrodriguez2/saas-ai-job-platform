"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resume Builder", href: "/resume-builder" },
  { label: "Job Board", href: "/job-board" },
  { label: "Job Tracker", href: "/job-tracker" },
  { label: "Settings", href: "/settings" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border bg-panel p-4 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6">
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
        <Link
          href="/login"
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            pathname === "/login" ? "bg-primary text-white" : "bg-surface text-text hover:bg-border"
          }`}
        >
          Login
        </Link>
      </nav>
    </aside>
  );
}

