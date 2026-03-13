import { Router } from "express";
import { applicationsRouter } from "./applications.routes";
import { authRouter } from "./auth.routes";
import { jobsRouter } from "./jobs.routes";
import { profileRouter } from "./profile";
import { resumeRouter } from "./resume.routes";
import { usersRouter } from "./users";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/resume", resumeRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/applications", applicationsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/profile", profileRouter);
