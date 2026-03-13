export interface Profile {
  id: string;
  userId: string;
  headline: string | null;
  yearsExperience: number | null;
  targetRole: string | null;
  location: string | null;
  skills: string[];
  education: string | null;
  workHistory: string | null;
  createdAt: string;
  updatedAt: string;
}

