export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  content: unknown;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  source: string;
  url: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: string;
  appliedDate: string | null;
  notes: string | null;
}

