import { requireAuth } from "@/lib/auth";

export default async function SettingsPage() {
  await requireAuth();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-muted">
        Account configuration, API keys, and integration preferences will be added in later increments.
      </p>
    </section>
  );
}
