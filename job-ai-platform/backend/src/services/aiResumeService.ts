import { z } from "zod";
import { getOpenAIClient } from "../config/openai";
import { env } from "../config/env";

const jobAnalysisSchema = z.object({
  title: z.string().default("Untitled Role"),
  companyName: z.string().default("Unknown Company"),
  skills: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  experienceLevel: z.string().default("Not specified")
});

const generatedResumeSchema = z.object({
  summary: z.string().catch(""),
  skills: z.array(z.string()).catch([]),
  experience: z
    .array(
      z.object({
        company: z.string().catch(""),
        title: z.string().catch(""),
        dates: z.string().catch(""),
        bullets: z.array(z.string()).catch([])
      })
    )
    .catch([]),
  education: z
    .array(
      z.object({
        school: z.string().catch(""),
        degree: z.string().catch(""),
        dates: z.string().catch("")
      })
    )
    .catch([])
});

export type JobAnalysis = z.infer<typeof jobAnalysisSchema>;
export type GeneratedResume = z.infer<typeof generatedResumeSchema>;

interface ResumeProfileInput {
  fullName: string | null;
  headline: string | null;
  yearsExperience: number | null;
  targetRole: string | null;
  location: string | null;
  skills: string[];
  education: string | null;
  workHistory: string | null;
}

function extractJsonObject(rawText: string | null | undefined): unknown {
  if (!rawText) {
    throw new Error("OpenAI response was empty.");
  }

  const trimmed = rawText.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start < 0 || end < start) {
    throw new Error("OpenAI response did not include valid JSON.");
  }

  return JSON.parse(trimmed.slice(start, end + 1));
}

const JOB_ANALYSIS_SYSTEM_PROMPT = `
You analyze job postings for resume targeting.
Return only valid JSON with:
{
  "title": string,
  "companyName": string,
  "skills": string[],
  "keywords": string[],
  "experienceLevel": string
}
Do not include markdown or extra text.
`.trim();

const RESUME_GENERATION_SYSTEM_PROMPT = `
You are an expert resume writer focused on ATS optimization.
Use the user's profile truthfully and tailor language to the target job analysis.
Return only valid JSON with:
{
  "summary": string,
  "skills": string[],
  "experience": [
    {
      "company": string,
      "title": string,
      "dates": string,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "school": string,
      "degree": string,
      "dates": string
    }
  ]
}
Rules:
- Use ATS-friendly keyword coverage from the job analysis.
- Do not invent employment or education beyond provided user profile context.
- Keep bullets impact-oriented and concise.
`.trim();

export class AIResumeService {
  async analyzeJobDescription(jobDescription: string): Promise<JobAnalysis> {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: JOB_ANALYSIS_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Analyze this job description:\n\n${jobDescription}`
        }
      ]
    });

    const rawResponse = completion.choices[0]?.message?.content;
    const parsedJson = extractJsonObject(rawResponse);

    return jobAnalysisSchema.parse(parsedJson);
  }

  async generateResume(profile: ResumeProfileInput, jobAnalysis: JobAnalysis): Promise<GeneratedResume> {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: RESUME_GENERATION_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              profile,
              jobAnalysis
            },
            null,
            2
          )
        }
      ]
    });

    const rawResponse = completion.choices[0]?.message?.content;
    const parsedJson = extractJsonObject(rawResponse);

    return generatedResumeSchema.parse(parsedJson);
  }
}

export const aiResumeService = new AIResumeService();

export const aiPromptTemplates = {
  JOB_ANALYSIS_SYSTEM_PROMPT,
  RESUME_GENERATION_SYSTEM_PROMPT
};
