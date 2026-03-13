import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface DecodedAuthToken extends JwtPayload {
  id?: string;
  email?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header." });
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedAuthToken;

    if (!decoded.id || !decoded.email) {
      res.status(401).json({ error: "Token payload is invalid." });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (_error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

