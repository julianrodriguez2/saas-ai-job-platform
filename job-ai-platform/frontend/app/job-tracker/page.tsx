import { requireAuth } from "@/lib/auth";

export default async function JobTrackerPage() {
  await requireAuth();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Job Tracker</h1>
      <p className="text-muted">Application tracking table and status workflows will be implemented later.</p>
    </section>
  );
}
