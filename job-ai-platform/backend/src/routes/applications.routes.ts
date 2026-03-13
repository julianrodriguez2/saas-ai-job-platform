import { Router } from "express";
import { applicationsController } from "../controllers/applications.controller";

export const applicationsRouter = Router();

applicationsRouter.get("/", applicationsController.listApplications);
applicationsRouter.post("/", applicationsController.createApplication);

