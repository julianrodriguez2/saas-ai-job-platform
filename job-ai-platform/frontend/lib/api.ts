import { clientEnv } from "./env";
import { getSession } from "next-auth/react";

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ApiClient {
  private readonly baseUrl = clientEnv.apiBaseUrl;

  private async getAuthorizationHeader(): Promise<Record<string, string>> {
    const session = await getSession();
    const backendAccessToken = session?.backendAccessToken;

    if (!backendAccessToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${backendAccessToken}`
    };
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    const authHeader = await this.getAuthorizationHeader();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...authHeader
    };
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = typeof payload.error === "string" ? payload.error : "Request failed";
      throw new ApiClientError(message, response.status);
    }

    return payload as TResponse;
  }

  async post<TResponse>(path: string, body: unknown): Promise<TResponse> {
    const authHeader = await this.getAuthorizationHeader();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...authHeader
    };
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = typeof payload.error === "string" ? payload.error : "Request failed";
      throw new ApiClientError(message, response.status);
    }

    return payload as TResponse;
  }

  async put<TResponse>(path: string, body: unknown): Promise<TResponse> {
    const authHeader = await this.getAuthorizationHeader();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...authHeader
    };
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body)
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = typeof payload.error === "string" ? payload.error : "Request failed";
      throw new ApiClientError(message, response.status);
    }

    return payload as TResponse;
  }
}

export const apiClient = new ApiClient();

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

export interface CreateProfileInput {
  fullName?: string;
  headline?: string;
  yearsExperience?: number;
  targetRole?: string;
  location?: string;
  skills?: string[];
  education?: string;
  workHistory?: string;
}

export interface UpdateProfileInput {
  headline?: string;
  yearsExperience?: number;
  targetRole?: string;
  location?: string;
  skills?: string[];
  education?: string;
  workHistory?: string;
}

export async function getProfile(): Promise<Profile | null> {
  try {
    return await apiClient.get<Profile>("/profile");
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function createProfile(payload: CreateProfileInput): Promise<Profile> {
  return apiClient.post<Profile>("/profile", payload);
}

export async function updateProfile(payload: UpdateProfileInput): Promise<Profile> {
  return apiClient.put<Profile>("/profile", payload);
}

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

export interface ResumeRecord {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  generatedContent: GeneratedResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateResumeInput {
  jobUrl?: string;
  jobDescription?: string;
}

export async function generateResume(payload: GenerateResumeInput): Promise<ResumeRecord> {
  return apiClient.post<ResumeRecord>("/resume/generate", payload);
}

export async function getResumes(): Promise<ResumeRecord[]> {
  return apiClient.get<ResumeRecord[]>("/resume");
}

export async function getResumeById(id: string): Promise<ResumeRecord> {
  return apiClient.get<ResumeRecord>(`/resume/${id}`);
}
