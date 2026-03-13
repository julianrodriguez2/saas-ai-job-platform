import { Request, Response } from "express";

export class ApplicationsController {
  listApplications(_req: Request, res: Response): void {
    res.status(501).json({
      message: "List applications endpoint is not implemented yet."
    });
  }

  createApplication(_req: Request, res: Response): void {
    res.status(501).json({
      message: "Create application endpoint is not implemented yet."
    });
  }
}

export const applicationsController = new ApplicationsController();

