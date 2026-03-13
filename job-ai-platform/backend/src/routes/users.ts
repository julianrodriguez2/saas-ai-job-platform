import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const usersRouter = Router();

usersRouter.get("/", usersController.listUsers);
usersRouter.get("/me", authMiddleware, usersController.getMe);
