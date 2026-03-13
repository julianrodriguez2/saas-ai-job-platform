"use client";

import { useEffect, useState } from "react";
import { getResumeById, type ResumeRecord } from "@/lib/api";

interface ResumePreviewProps {
  resumeId: string;
}

export function ResumePreview({ resumeId }: ResumePreviewProps) {
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await getResumeById(resumeId);
        setResume(result);
      } catch (error) {
        if (error instanceof Error) {
          setErrorText(error.message);
        } else {
          setErrorText("Failed to load resume.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [resumeId]);

  if (isLoading) {
    return <p className="text-sm text-muted">Loading generated resume...</p>;
  }

  if (errorText || !resume) {
    return (
      <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
        {errorText ?? "Resume not found."}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-border bg-panel p-5">
        <h1 className="text-2xl font-semibold">{resume.jobTitle}</h1>
        <p className="text-sm text-muted">{resume.companyName}</p>
      </header>

      <article className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="mt-2 text-sm leading-6">{resume.generatedContent.summary || "No summary generated."}</p>
      </article>

      <article className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {resume.generatedContent.skills.length > 0 ? (
            resume.generatedContent.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-surface px-2 py-1 text-xs text-text"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted">No skills generated.</p>
          )}
        </div>
      </article>

      <article className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">Experience</h2>
        <div className="mt-3 space-y-4">
          {resume.generatedContent.experience.length > 0 ? (
            resume.generatedContent.experience.map((item, index) => (
              <div key={`${item.role}-${index}`} className="space-y-1">
                <p className="text-sm font-semibold">
                  {item.role} {item.company ? `at ${item.company}` : ""}
                </p>
                <p className="text-xs text-muted">{item.period}</p>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {item.highlights.map((point, pointIndex) => (
                    <li key={`${index}-${pointIndex}`}>{point}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No experience entries generated.</p>
          )}
        </div>
      </article>

      <article className="rounded-xl border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">Education</h2>
        <div className="mt-3 space-y-4">
          {resume.generatedContent.education.length > 0 ? (
            resume.generatedContent.education.map((item, index) => (
              <div key={`${item.institution}-${index}`} className="space-y-1">
                <p className="text-sm font-semibold">
                  {item.degree} {item.institution ? `- ${item.institution}` : ""}
                </p>
                <p className="text-sm text-muted">{item.details}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No education entries generated.</p>
          )}
        </div>
      </article>
    </section>
  );
}

