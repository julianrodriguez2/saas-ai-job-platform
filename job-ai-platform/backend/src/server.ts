import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

app.listen(env.BACKEND_PORT, () => {
  logger.info(`Backend listening on http://localhost:${env.BACKEND_PORT}`);
});

