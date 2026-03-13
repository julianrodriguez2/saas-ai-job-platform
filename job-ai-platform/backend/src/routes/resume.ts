import { Router } from "express";
import { resumeController } from "../controllers/resumeController";
import { authMiddleware } from "../middleware/authMiddleware";

export const resumeRouter = Router();

resumeRouter.post("/generate", authMiddleware, resumeController.generateResume);
resumeRouter.get("/", authMiddleware, resumeController.listResumes);
resumeRouter.get("/:id", authMiddleware, resumeController.getResumeById);
resumeRouter.put("/:id", authMiddleware, resumeController.updateResume);
