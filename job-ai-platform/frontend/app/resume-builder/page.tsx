import { ResumeBuilderForm } from "@/components/resume/resume-builder-form";
import { requireProfile } from "@/lib/auth";

export default async function ResumeBuilderPage() {
  await requireProfile();

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Resume Builder</h1>
      <p className="text-muted">
        Paste a job description or provide a job URL to generate an ATS-optimized resume draft tailored to that role.
      </p>
      <ResumeBuilderForm />
    </section>
  );
}
