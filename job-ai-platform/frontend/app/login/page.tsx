import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <section className="rounded-xl border border-border bg-panel p-8 shadow-sm">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-sm text-muted">Continue with your Google account to access your dashboard.</p>
      </div>
      <GoogleSignInButton />
    </section>
  );
}
