import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { requireProfile } from "@/lib/auth";

export default async function SettingsPage() {
  const { profile } = await requireProfile();

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-muted">Manage your profile data used for resume and job-matching personalization.</p>
      <ProfileSettingsForm initialProfile={profile} />
    </section>
  );
}
