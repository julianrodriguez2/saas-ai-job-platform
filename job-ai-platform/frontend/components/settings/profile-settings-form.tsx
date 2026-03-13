"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Profile } from "@/lib/api";
import { updateProfile } from "@/lib/api";

interface ProfileSettingsFormProps {
  initialProfile: Profile;
}

export function ProfileSettingsForm({ initialProfile }: ProfileSettingsFormProps) {
  const [headline, setHeadline] = useState(initialProfile.headline ?? "");
  const [targetRole, setTargetRole] = useState(initialProfile.targetRole ?? "");
  const [location, setLocation] = useState(initialProfile.location ?? "");
  const [skillsInput, setSkillsInput] = useState(initialProfile.skills.join(", "));
  const [education, setEducation] = useState(initialProfile.education ?? "");
  const [workHistory, setWorkHistory] = useState(initialProfile.workHistory ?? "");
  const [statusText, setStatusText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedSkills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    [skillsInput]
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusText(null);

    try {
      await updateProfile({
        headline,
        targetRole,
        location,
        skills: parsedSkills,
        education,
        workHistory
      });

      setStatusText("Profile updated successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setStatusText(`Failed to update profile: ${error.message}`);
      } else {
        setStatusText("Failed to update profile.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-panel p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-muted">Headline</span>
          <input
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="Senior Product Designer"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted">Target Role</span>
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="Frontend Engineer"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted">Location</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="San Francisco, CA"
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-muted">Skills (comma separated)</span>
          <input
            value={skillsInput}
            onChange={(event) => setSkillsInput(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="TypeScript, React, Node.js"
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-muted">Education</span>
          <textarea
            value={education}
            onChange={(event) => setEducation(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="BS in Computer Science ..."
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-muted">Work History</span>
          <textarea
            value={workHistory}
            onChange={(event) => setWorkHistory(event.target.value)}
            rows={5}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            placeholder="Led platform migration ..."
          />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
        {statusText ? <p className="text-sm text-muted">{statusText}</p> : null}
      </div>
    </form>
  );
}

