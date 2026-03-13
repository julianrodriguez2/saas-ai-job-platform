import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { redirectToDashboardIfOnboarded } from "@/lib/auth";

export default async function OnboardingPage() {
  await redirectToDashboardIfOnboarded();

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <p className="text-sm text-muted">Complete your profile to unlock personalized resume and job matching.</p>
      <OnboardingForm />
    </section>
  );
}

