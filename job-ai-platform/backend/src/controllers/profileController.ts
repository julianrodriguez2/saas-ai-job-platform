import { Response } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const baseProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(120).optional(),
  headline: z.string().trim().max(200).optional(),
  yearsExperience: z.number().int().min(0).max(80).optional(),
  targetRole: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  skills: z.array(z.string().trim().min(1).max(60)).max(50).optional(),
  education: z.string().trim().max(4000).optional(),
  workHistory: z.string().trim().max(8000).optional()
});

const createProfileSchema = baseProfileSchema;
const updateProfileSchema = baseProfileSchema;

export class ProfileController {
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: req.user.id
      }
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found." });
      return;
    }

    res.status(200).json(profile);
  }

  async createProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsedBody = createProfileSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid profile payload.",
        details: parsedBody.error.flatten()
      });
      return;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: req.user.id
      }
    });

    if (existingProfile) {
      res.status(409).json({ error: "Profile already exists for this user." });
      return;
    }

    const createdProfile = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (parsedBody.data.fullName) {
        await tx.user.update({
          where: { id: req.user!.id },
          data: { name: parsedBody.data.fullName }
        });
      }

      return tx.profile.create({
        data: {
          userId: req.user!.id,
          headline: parsedBody.data.headline,
          yearsExperience: parsedBody.data.yearsExperience,
          targetRole: parsedBody.data.targetRole,
          location: parsedBody.data.location,
          skills: parsedBody.data.skills ?? [],
          education: parsedBody.data.education,
          workHistory: parsedBody.data.workHistory
        }
      });
    });

    res.status(201).json(createdProfile);
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsedBody = updateProfileSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid profile payload.",
        details: parsedBody.error.flatten()
      });
      return;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: req.user.id
      }
    });

    if (!existingProfile) {
      res.status(404).json({ error: "Profile not found." });
      return;
    }

    const profileInput = parsedBody.data;

    const updatedProfile = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (profileInput.fullName) {
        await tx.user.update({
          where: { id: req.user!.id },
          data: { name: profileInput.fullName }
        });
      }

      return tx.profile.update({
        where: {
          userId: req.user!.id
        },
        data: {
          headline: profileInput.headline,
          yearsExperience: profileInput.yearsExperience,
          targetRole: profileInput.targetRole,
          location: profileInput.location,
          skills: profileInput.skills,
          education: profileInput.education,
          workHistory: profileInput.workHistory
        }
      });
    });

    res.status(200).json(updatedProfile);
  }
}

export const profileController = new ProfileController();
