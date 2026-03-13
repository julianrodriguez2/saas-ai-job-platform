import jwt from "jsonwebtoken";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing Google OAuth credentials. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
}

const backendJwtSecret = process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET;

if (!backendJwtSecret) {
  throw new Error("Missing JWT secret. Set JWT_SECRET or NEXTAUTH_SECRET.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({ user }) {
      return Boolean(user.email);
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? null
          },
          create: {
            email: user.email,
            name: user.name ?? null
          }
        });

        token.userId = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.name;
        token.picture = user.image ?? null;
        token.backendAccessToken = jwt.sign(
          { id: dbUser.id, email: dbUser.email },
          backendJwtSecret,
          { expiresIn: "8h" }
        );
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.name = typeof token.name === "string" ? token.name : null;
        session.user.image = typeof token.picture === "string" ? token.picture : null;
      }

      session.backendAccessToken =
        typeof token.backendAccessToken === "string" ? token.backendAccessToken : undefined;

      return session;
    }
  }
};
