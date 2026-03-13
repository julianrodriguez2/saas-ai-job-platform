import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details ?? null
    });
    return;
  }

  const fallbackMessage = err instanceof Error ? err.message : "Unexpected error";

  res.status(500).json({
    error: fallbackMessage
  });
}

