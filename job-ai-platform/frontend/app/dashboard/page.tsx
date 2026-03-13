import { BackendStatus } from "@/components/api/backend-status";
import { ProfileSummary } from "@/components/dashboard/profile-summary";
import { requireProfile } from "@/lib/auth";

export default async function DashboardPage() {
  const { user, profile } = await requireProfile();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Welcome back, {user.name ?? user.email}</h1>
        <p className="text-muted">Your profile and job activity overview is ready below.</p>
      </header>
      <ProfileSummary profile={profile} />
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-panel p-4">
          <p className="text-sm text-muted">Resumes Generated</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </article>
        <article className="rounded-xl border border-border bg-panel p-4">
          <p className="text-sm text-muted">Jobs Saved</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </article>
        <article className="rounded-xl border border-border bg-panel p-4">
          <p className="text-sm text-muted">Applications Sent</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </article>
      </div>
      <BackendStatus />
    </section>
  );
}
