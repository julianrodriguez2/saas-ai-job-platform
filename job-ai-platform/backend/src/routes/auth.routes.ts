import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.get("/google", authController.googleAuthStart);
authRouter.get("/google/callback", authController.googleAuthCallback);

