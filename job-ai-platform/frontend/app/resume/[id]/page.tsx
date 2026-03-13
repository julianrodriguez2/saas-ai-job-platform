import { ResumePreview } from "@/components/resume/resume-preview";
import { requireProfile } from "@/lib/auth";

interface ResumePreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResumePreviewPage({ params }: ResumePreviewPageProps) {
  await requireProfile();
  const resolvedParams = await params;

  return (
    <section className="space-y-4">
      <p className="text-sm text-muted">AI-generated resume draft preview.</p>
      <ResumePreview resumeId={resolvedParams.id} />
    </section>
  );
}

