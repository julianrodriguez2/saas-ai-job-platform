import { Router } from "express";
import { profileController } from "../controllers/profileController";
import { authMiddleware } from "../middleware/authMiddleware";

export const profileRouter = Router();

profileRouter.get("/", authMiddleware, profileController.getProfile);
profileRouter.post("/", authMiddleware, profileController.createProfile);
profileRouter.put("/", authMiddleware, profileController.updateProfile);

