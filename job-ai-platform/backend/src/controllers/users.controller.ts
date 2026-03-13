import { Request, Response } from "express";

export class UsersController {
  listUsers(_req: Request, res: Response): void {
    res.status(501).json({
      message: "List users endpoint is not implemented yet."
    });
  }
}

export const usersController = new UsersController();

