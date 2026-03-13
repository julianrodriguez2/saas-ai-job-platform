import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { aiResumeService } from "../services/aiResumeService";
import { resumeExportService } from "../services/resumeExportService";
import { parseJobPosting } from "../utils/jobParser";
import { buildResumeTemplateLayout } from "../utils/resumeTemplate";

const resumeContentSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      dates: z.string(),
      bullets: z.array(z.string())
    })
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      dates: z.string()
    })
  )
});

const generateResumeSchema = z
  .object({
    jobUrl: z.string().url().optional(),
    jobDescription: z.string().trim().min(20).optional()
  })
  .refine((value) => Boolean(value.jobUrl || value.jobDescription), {
    message: "Provide either a jobUrl or a jobDescription."
  });

const updateResumeSchema = z.object({
  content: resumeContentSchema
});

function toSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

  return slug || "resume";
}

export class ResumeController {
  async generateResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsedBody = generateResumeSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid generate resume payload.",
        details: parsedBody.error.flatten()
      });
      return;
    }

    try {
      const userWithProfile = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true }
      });

      if (!userWithProfile || !userWithProfile.profile) {
        res.status(400).json({
          error: "Profile not found. Complete onboarding before generating resumes."
        });
        return;
      }

      let descriptionText = parsedBody.data.jobDescription?.trim() ?? "";

      if (!descriptionText && parsedBody.data.jobUrl) {
        const parsedJob = await parseJobPosting(parsedBody.data.jobUrl);
        descriptionText = parsedJob.description;
      }

      if (!descriptionText) {
        res.status(400).json({ error: "Unable to resolve job description text." });
        return;
      }

      const jobAnalysis = await aiResumeService.analyzeJobDescription(descriptionText);

      const generatedContent = await aiResumeService.generateResume(
        {
          fullName: userWithProfile.name,
          headline: userWithProfile.profile.headline,
          yearsExperience: userWithProfile.profile.yearsExperience,
          targetRole: userWithProfile.profile.targetRole,
          location: userWithProfile.profile.location,
          skills: userWithProfile.profile.skills,
          education: userWithProfile.profile.education,
          workHistory: userWithProfile.profile.workHistory
        },
        jobAnalysis
      );

      const savedResume = await prisma.resume.create({
        data: {
          userId: req.user.id,
          title: `${jobAnalysis.title || userWithProfile.profile.targetRole || "Resume"} - Tailored Draft`,
          jobTitle: jobAnalysis.title || userWithProfile.profile.targetRole || "Untitled Role",
          companyName: jobAnalysis.companyName || "Unknown Company",
          jobDescription: descriptionText,
          version: 1,
          lastEditedAt: new Date(),
          generatedContent
        }
      });

      res.status(201).json({
        ...savedResume,
        jobAnalysis
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Resume generation failed.";

      res.status(500).json({
        error: message
      });
    }
  }

  async listResumes(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json(resumes);
  }

  async getResumeById(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const resumeId = req.params.id;
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: req.user.id
      }
    });

    if (!resume) {
      res.status(404).json({
        error: "Resume not found."
      });
      return;
    }

    res.status(200).json(resume);
  }

  async updateResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsedBody = updateResumeSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid resume update payload.",
        details: parsedBody.error.flatten()
      });
      return;
    }

    const resumeId = req.params.id;
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: req.user.id
      }
    });

    if (!existingResume) {
      res.status(404).json({
        error: "Resume not found."
      });
      return;
    }

    const updatedResume = await prisma.resume.update({
      where: {
        id: existingResume.id
      },
      data: {
        generatedContent: parsedBody.data.content,
        lastEditedAt: new Date(),
        version: {
          increment: 1
        }
      }
    });

    res.status(200).json(updatedResume);
  }

  async exportResumePdf(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!resume) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }

    try {
      const layout = buildResumeTemplateLayout({
        resume,
        user: resume.user,
        profile: resume.user.profile
      });
      const pdfBuffer = await resumeExportService.generatePDF(layout);
      const fileBaseName = `${toSlug(resume.title)}-${resume.id.slice(0, 8)}`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${fileBaseName}.pdf"`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export resume PDF.";
      res.status(500).json({ error: message });
    }
  }

  async exportResumeDocx(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!resume) {
      res.status(404).json({ error: "Resume not found." });
      return;
    }

    try {
      const layout = buildResumeTemplateLayout({
        resume,
        user: resume.user,
        profile: resume.user.profile
      });
      const docxBuffer = await resumeExportService.generateDOCX(layout);
      const fileBaseName = `${toSlug(resume.title)}-${resume.id.slice(0, 8)}`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${fileBaseName}.docx"`);
      res.status(200).send(docxBuffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export resume DOCX.";
      res.status(500).json({ error: message });
    }
  }
}

export const resumeController = new ResumeController();
