import { BackendStatus } from "@/components/api/backend-status";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAuth();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted">Overview area for resume activity, job feed, and application progress.</p>
      <BackendStatus />
    </section>
  );
}
