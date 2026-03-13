import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import type { Profile } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireProfile() {
  const user = await requireAuth();
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const normalizedProfile: Profile = {
    id: profile.id,
    userId: profile.userId,
    headline: profile.headline,
    yearsExperience: profile.yearsExperience,
    targetRole: profile.targetRole,
    location: profile.location,
    skills: profile.skills,
    education: profile.education,
    workHistory: profile.workHistory,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };

  return {
    user,
    profile: normalizedProfile
  };
}

export async function redirectToDashboardIfOnboarded() {
  const user = await requireAuth();
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) {
    redirect("/dashboard");
  }

  return user;
}
