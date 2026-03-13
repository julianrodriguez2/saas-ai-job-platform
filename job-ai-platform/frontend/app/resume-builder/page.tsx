import { requireProfile } from "@/lib/auth";

export default async function ResumeBuilderPage() {
  await requireProfile();

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Resume Builder</h1>
      <p className="text-muted">AI resume generation workflows will be implemented in a later increment.</p>
    </section>
  );
}
