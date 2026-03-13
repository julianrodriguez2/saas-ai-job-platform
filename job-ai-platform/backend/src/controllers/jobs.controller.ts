import { Request, Response } from "express";

export class JobsController {
  listJobs(_req: Request, res: Response): void {
    res.status(501).json({
      message: "List jobs endpoint is not implemented yet."
    });
  }
}

export const jobsController = new JobsController();

