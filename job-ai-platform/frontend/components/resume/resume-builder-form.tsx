"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { generateResume } from "@/lib/api";

export function ResumeBuilderForm() {
  const router = useRouter();
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorText(null);

    const trimmedUrl = jobUrl.trim();
    const trimmedDescription = jobDescription.trim();

    if (!trimmedUrl && !trimmedDescription) {
      setErrorText("Provide either a job posting URL or paste a job description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resume = await generateResume({
        jobUrl: trimmedUrl || undefined,
        jobDescription: trimmedDescription || undefined
      });

      router.push(`/resume/${resume.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText("Failed to generate resume.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-panel p-6">
      <label className="space-y-1 text-sm">
        <span className="text-muted">Job Posting URL</span>
        <input
          type="url"
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="https://company.com/careers/software-engineer"
        />
      </label>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <label className="space-y-1 text-sm">
        <span className="text-muted">Paste Job Description</span>
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={10}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Paste the full job description here..."
        />
      </label>
      {errorText ? (
        <p className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">{errorText}</p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
      >
        {isSubmitting ? "Generating..." : "Generate Resume"}
      </button>
    </form>
  );
}

