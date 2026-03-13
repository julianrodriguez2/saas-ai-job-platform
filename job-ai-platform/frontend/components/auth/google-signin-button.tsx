"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      Sign in with Google
    </button>
  );
}

