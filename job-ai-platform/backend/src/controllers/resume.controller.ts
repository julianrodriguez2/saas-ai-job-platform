import { Request, Response } from "express";

export class ResumeController {
  listResumes(_req: Request, res: Response): void {
    res.status(501).json({
      message: "List resumes endpoint is not implemented yet."
    });
  }

  createResume(_req: Request, res: Response): void {
    res.status(501).json({
      message: "Create resume endpoint is not implemented yet."
    });
  }
}

export const resumeController = new ResumeController();

