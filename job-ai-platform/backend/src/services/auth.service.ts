import { env } from "../config/env";

export class AuthService {
  getGoogleOAuthConfig() {
    return {
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      callbackUrl: env.GOOGLE_CALLBACK_URL ?? ""
    };
  }
}

export const authService = new AuthService();

