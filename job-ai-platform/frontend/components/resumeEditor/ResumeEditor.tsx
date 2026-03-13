"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getResumeById,
  type GeneratedResumeContent,
  type ResumeEducationItem,
  type ResumeExperienceItem,
  type ResumeRecord,
  updateResume
} from "@/lib/api";
import { EducationEditor } from "./EducationEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { SkillsEditor } from "./SkillsEditor";
import { SummaryEditor } from "./SummaryEditor";

type LeftSection = "summary" | "skills";
type RightSection = "experience" | "education";
type SaveState = "idle" | "saving" | "saved" | "error";

function defaultContent(): GeneratedResumeContent {
  return {
    summary: "",
    skills: [],
    experience: [],
    education: []
  };
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => String(entry ?? "").trim()).filter(Boolean);
}

function normalizeExperienceEntry(value: unknown): ResumeExperienceItem {
  const item = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

  return {
    company: typeof item.company === "string" ? item.company : "",
    title:
      typeof item.title === "string"
        ? item.title
        : typeof item.role === "string"
          ? item.role
          : "",
    dates:
      typeof item.dates === "string"
        ? item.dates
        : typeof item.period === "string"
          ? item.period
          : "",
    bullets: toStringArray(
      Array.isArray(item.bullets) ? item.bullets : Array.isArray(item.highlights) ? item.highlights : []
    )
  };
}

function normalizeEducationEntry(value: unknown): ResumeEducationItem {
  const item = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

  return {
    school:
      typeof item.school === "string"
        ? item.school
        : typeof item.institution === "string"
          ? item.institution
          : "",
    degree: typeof item.degree === "string" ? item.degree : "",
    dates:
      typeof item.dates === "string"
        ? item.dates
        : typeof item.details === "string"
          ? item.details
          : ""
  };
}

function normalizeResumeContent(raw: unknown): GeneratedResumeContent {
  const value = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  const summary = typeof value.summary === "string" ? value.summary : "";
  const skills = toStringArray(value.skills);
  const experience = Array.isArray(value.experience)
    ? value.experience.map((entry) => normalizeExperienceEntry(entry))
    : [];
  const education = Array.isArray(value.education)
    ? value.education.map((entry) => normalizeEducationEntry(entry))
    : [];

  return {
    summary,
    skills,
    experience,
    education
  };
}

interface ResumeEditorProps {
  resumeId: string;
}

export function ResumeEditor({ resumeId }: ResumeEditorProps) {
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [content, setContent] = useState<GeneratedResumeContent>(defaultContent());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [leftOrder, setLeftOrder] = useState<LeftSection[]>(["summary", "skills"]);
  const [rightOrder, setRightOrder] = useState<RightSection[]>(["experience", "education"]);

  const hasLoadedRef = useRef(false);
  const lastSavedContentRef = useRef("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const fetchedResume = await getResumeById(resumeId);
        const normalized = normalizeResumeContent(fetchedResume.generatedContent);

        setResume(fetchedResume);
        setContent(normalized);
        lastSavedContentRef.current = JSON.stringify(normalized);
        hasLoadedRef.current = true;
      } catch (error) {
        if (error instanceof Error) {
          setLoadError(error.message);
        } else {
          setLoadError("Failed to load resume.");
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [resumeId]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }

    const serialized = JSON.stringify(content);
    if (serialized === lastSavedContentRef.current) {
      return;
    }

    setSaveState("saving");
    setSaveError(null);

    const timer = setTimeout(async () => {
      try {
        const updated = await updateResume(resumeId, content);
        lastSavedContentRef.current = serialized;

        setResume((previous) =>
          previous
            ? {
                ...previous,
                version: updated.version,
                lastEditedAt: updated.lastEditedAt,
                updatedAt: updated.updatedAt
              }
            : updated
        );

        setSaveState("saved");
      } catch (error) {
        setSaveState("error");
        if (error instanceof Error) {
          setSaveError(error.message);
        } else {
          setSaveError("Autosave failed.");
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, resumeId]);

  function moveWithinOrder<T extends string>(
    values: T[],
    setValues: (value: T[]) => void,
    section: T,
    direction: -1 | 1
  ) {
    const index = values.indexOf(section);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= values.length) {
      return;
    }

    const updated = [...values];
    const [moved] = updated.splice(index, 1);
    updated.splice(nextIndex, 0, moved);
    setValues(updated);
  }

  const saveLabel = useMemo(() => {
    if (saveState === "saving") {
      return "Saving...";
    }

    if (saveState === "saved") {
      return "Saved";
    }

    if (saveState === "error") {
      return "Save failed";
    }

    return "No changes yet";
  }, [saveState]);

  if (loading) {
    return <p className="text-sm text-muted">Loading resume editor...</p>;
  }

  if (loadError || !resume) {
    return (
      <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
        {loadError ?? "Resume not found."}
      </p>
    );
  }

  const sectionMap = {
    summary: (
      <SummaryEditor
        value={content.summary}
        onChange={(value) => setContent((previous) => ({ ...previous, summary: value }))}
        onMoveUp={
          leftOrder[0] !== "summary"
            ? () => moveWithinOrder(leftOrder, setLeftOrder, "summary", -1)
            : undefined
        }
        onMoveDown={
          leftOrder[leftOrder.length - 1] !== "summary"
            ? () => moveWithinOrder(leftOrder, setLeftOrder, "summary", 1)
            : undefined
        }
      />
    ),
    skills: (
      <SkillsEditor
        skills={content.skills}
        onChange={(skills) => setContent((previous) => ({ ...previous, skills }))}
        onMoveUp={
          leftOrder[0] !== "skills" ? () => moveWithinOrder(leftOrder, setLeftOrder, "skills", -1) : undefined
        }
        onMoveDown={
          leftOrder[leftOrder.length - 1] !== "skills"
            ? () => moveWithinOrder(leftOrder, setLeftOrder, "skills", 1)
            : undefined
        }
      />
    ),
    experience: (
      <ExperienceEditor
        items={content.experience}
        onChange={(experience) => setContent((previous) => ({ ...previous, experience }))}
        onMoveUp={
          rightOrder[0] !== "experience"
            ? () => moveWithinOrder(rightOrder, setRightOrder, "experience", -1)
            : undefined
        }
        onMoveDown={
          rightOrder[rightOrder.length - 1] !== "experience"
            ? () => moveWithinOrder(rightOrder, setRightOrder, "experience", 1)
            : undefined
        }
      />
    ),
    education: (
      <EducationEditor
        items={content.education}
        onChange={(education) => setContent((previous) => ({ ...previous, education }))}
        onMoveUp={
          rightOrder[0] !== "education"
            ? () => moveWithinOrder(rightOrder, setRightOrder, "education", -1)
            : undefined
        }
        onMoveDown={
          rightOrder[rightOrder.length - 1] !== "education"
            ? () => moveWithinOrder(rightOrder, setRightOrder, "education", 1)
            : undefined
        }
      />
    )
  };

  return (
    <section className="space-y-4">
      <header className="rounded-xl border border-border bg-panel p-5">
        <h1 className="text-2xl font-semibold">{resume.title}</h1>
        <p className="text-sm text-muted">
          Target: {resume.jobTitle} at {resume.companyName}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span>{saveLabel}</span>
          <span>Version {resume.version}</span>
          <span>Last edited: {new Date(resume.lastEditedAt).toLocaleString()}</span>
        </div>
        {saveError ? <p className="mt-2 text-sm text-red-700">{saveError}</p> : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-4">
          {leftOrder.map((section) => (
            <div key={section}>{sectionMap[section]}</div>
          ))}
        </div>
        <div className="space-y-4">
          {rightOrder.map((section) => (
            <div key={section}>{sectionMap[section]}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
