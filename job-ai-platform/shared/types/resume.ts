export interface ResumeExperienceItem {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface ResumeEducationItem {
  institution: string;
  degree: string;
  details: string;
}

export interface GeneratedResumeContent {
  summary: string;
  skills: string[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
}

