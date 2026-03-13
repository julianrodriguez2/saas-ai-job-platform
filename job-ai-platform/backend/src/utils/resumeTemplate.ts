import { Profile, Resume, User } from "@prisma/client";

export type ResumeTemplateName = "classic" | "modern" | "compact";

export interface ResumeExperienceItem {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
}

export interface ResumeEducationItem {
  school: string;
  degree: string;
  dates: string;
}

export interface ResumeContentShape {
  summary: string;
  skills: string[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
}

export interface ResumeTemplateStyle {
  headingFontSize: number;
  bodyFontSize: number;
  sectionSpacing: number;
  lineGap: number;
}

export interface ResumeTemplateLayout {
  template: ResumeTemplateName;
  style: ResumeTemplateStyle;
  name: string;
  headline: string;
  title: string;
  summary: string;
  skills: string[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
}

const templateStyles: Record<ResumeTemplateName, ResumeTemplateStyle> = {
  classic: {
    headingFontSize: 14,
    bodyFontSize: 11,
    sectionSpacing: 12,
    lineGap: 4
  },
  modern: {
    headingFontSize: 15,
    bodyFontSize: 11,
    sectionSpacing: 14,
    lineGap: 5
  },
  compact: {
    headingFontSize: 13,
    bodyFontSize: 10,
    sectionSpacing: 9,
    lineGap: 3
  }
};

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => String(entry ?? "").trim()).filter(Boolean);
}

function normalizeExperience(value: unknown): ResumeExperienceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const item = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>) : {};

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
      bullets: normalizeStringArray(
        Array.isArray(item.bullets) ? item.bullets : Array.isArray(item.highlights) ? item.highlights : []
      )
    };
  });
}

function normalizeEducation(value: unknown): ResumeEducationItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const item = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>) : {};

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
  });
}

export function normalizeResumeContent(raw: unknown): ResumeContentShape {
  const content = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  return {
    summary: typeof content.summary === "string" ? content.summary : "",
    skills: normalizeStringArray(content.skills),
    experience: normalizeExperience(content.experience),
    education: normalizeEducation(content.education)
  };
}

export function resolveResumeTemplate(value: string | null | undefined): ResumeTemplateName {
  if (value === "modern" || value === "compact" || value === "classic") {
    return value;
  }

  return "classic";
}

interface BuildTemplateLayoutInput {
  resume: Resume;
  user: User;
  profile: Profile | null;
}

export function buildResumeTemplateLayout({
  resume,
  user,
  profile
}: BuildTemplateLayoutInput): ResumeTemplateLayout {
  const template = resolveResumeTemplate(resume.template);
  const style = templateStyles[template];
  const content = normalizeResumeContent(resume.generatedContent);

  return {
    template,
    style,
    name: user.name ?? "Candidate Name",
    headline: profile?.headline ?? profile?.targetRole ?? "",
    title: resume.title,
    summary: content.summary,
    skills: content.skills,
    experience: content.experience,
    education: content.education
  };
}

