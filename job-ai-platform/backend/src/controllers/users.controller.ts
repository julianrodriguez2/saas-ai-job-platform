import { Request, Response } from "express";

export class UsersController {
  listUsers(_req: Request, res: Response): void {
    res.status(501).json({
      message: "List users endpoint is not implemented yet."
    });
  }

  getMe(req: Request, res: Response): void {
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized"
      });
      return;
    }

    res.status(200).json({
      id: req.user.id,
      email: req.user.email
    });
  }
}

export const usersController = new UsersController();
