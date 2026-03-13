import { ResumeEditor } from "@/components/resumeEditor/ResumeEditor";
import { requireProfile } from "@/lib/auth";

interface ResumeEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResumeEditorPage({ params }: ResumeEditorPageProps) {
  await requireProfile();
  const resolvedParams = await params;

  return (
    <section className="space-y-4">
      <p className="text-sm text-muted">Edit your generated resume. Changes autosave automatically.</p>
      <ResumeEditor resumeId={resolvedParams.id} />
    </section>
  );
}
