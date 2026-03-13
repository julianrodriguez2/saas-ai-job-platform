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

export interface GeneratedResumeContent {
  summary: string;
  skills: string[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
}
