import { Router } from "express";
import { resumeController } from "../controllers/resume.controller";

export const resumeRouter = Router();

resumeRouter.get("/", resumeController.listResumes);
resumeRouter.post("/", resumeController.createResume);

