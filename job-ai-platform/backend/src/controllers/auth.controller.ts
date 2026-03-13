import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  googleAuthStart(_req: Request, res: Response): void {
    res.status(501).json({
      message: "Google OAuth flow is not implemented yet.",
      config: authService.getGoogleOAuthConfig()
    });
  }

  googleAuthCallback(_req: Request, res: Response): void {
    res.status(501).json({
      message: "Google OAuth callback handler is not implemented yet."
    });
  }
}

export const authController = new AuthController();

