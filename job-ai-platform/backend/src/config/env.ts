import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

const resolvedJwtSecret = parsedEnv.data.JWT_SECRET ?? parsedEnv.data.NEXTAUTH_SECRET;

if (!resolvedJwtSecret) {
  throw new Error("Missing JWT secret. Set JWT_SECRET or NEXTAUTH_SECRET.");
}

export const env = {
  ...parsedEnv.data,
  JWT_SECRET: resolvedJwtSecret
};
