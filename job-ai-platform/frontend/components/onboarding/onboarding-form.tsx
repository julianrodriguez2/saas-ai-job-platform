"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "@/lib/api";

const steps = ["Basic Info", "Skills", "Work Summary"] as const;

export function OnboardingForm() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [location, setLocation] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [workHistory, setWorkHistory] = useState("");
  const [education, setEducation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedYearsExperience = useMemo(() => {
    if (!yearsExperience.trim()) {
      return undefined;
    }

    const parsed = Number.parseInt(yearsExperience, 10);

    if (Number.isNaN(parsed)) {
      return undefined;
    }

    return parsed;
  }, [yearsExperience]);

  function goToNextStep() {
    setStepIndex((value) => Math.min(value + 1, steps.length - 1));
  }

  function goToPreviousStep() {
    setStepIndex((value) => Math.max(value - 1, 0));
  }

  function addSkillFromInput() {
    const skill = currentSkill.trim();
    if (!skill) {
      return;
    }

    if (skills.includes(skill)) {
      setCurrentSkill("");
      return;
    }

    setSkills((previous) => [...previous, skill]);
    setCurrentSkill("");
  }

  function removeSkill(skillToRemove: string) {
    setSkills((previous) => previous.filter((skill) => skill !== skillToRemove));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (stepIndex < steps.length - 1) {
      goToNextStep();
      return;
    }

    setIsSubmitting(true);

    try {
      await createProfile({
        fullName,
        headline: targetRole ? `${targetRole} candidate` : undefined,
        targetRole,
        location,
        yearsExperience: parsedYearsExperience,
        skills,
        workHistory,
        education
      });

      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Failed to complete onboarding.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-border bg-panel p-6">
      <header className="space-y-1">
        <p className="text-sm text-muted">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h1 className="text-2xl font-semibold">{steps[stepIndex]}</h1>
      </header>

      {stepIndex === 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-muted">Full Name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Jane Doe"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted">Target Role</span>
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Full Stack Engineer"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted">Location</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Austin, TX"
              required
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-muted">Years Experience</span>
            <input
              type="number"
              min={0}
              max={80}
              value={yearsExperience}
              onChange={(event) => setYearsExperience(event.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              placeholder="5"
              required
            />
          </label>
        </div>
      ) : null}

      {stepIndex === 1 ? (
        <div className="space-y-3">
          <label className="space-y-1 text-sm">
            <span className="text-muted">Add Skill</span>
            <div className="flex gap-2">
              <input
                value={currentSkill}
                onChange={(event) => setCurrentSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkillFromInput();
                  }
                }}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                placeholder="TypeScript"
              />
              <button
                type="button"
                onClick={addSkillFromInput}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium"
              >
                Add
              </button>
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => removeSkill(skill)}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs"
                  title="Remove skill"
                >
                  {skill} x
                </button>
              ))
            ) : (
              <p className="text-sm text-muted">No skills added yet.</p>
            )}
          </div>
        </div>
      ) : null}

      {stepIndex === 2 ? (
        <div className="space-y-4">
          <label className="space-y-1 text-sm">
            <span className="text-muted">Work History</span>
            <textarea
              value={workHistory}
              onChange={(event) => setWorkHistory(event.target.value)}
              rows={6}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Summarize your recent work history."
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted">Education</span>
            <textarea
              value={education}
              onChange={(event) => setEducation(event.target.value)}
              rows={4}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Summarize your education background."
              required
            />
          </label>
        </div>
      ) : null}

      {error ? <p className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={stepIndex === 0 || isSubmitting}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {stepIndex < steps.length - 1 ? "Next" : isSubmitting ? "Submitting..." : "Finish Onboarding"}
        </button>
      </div>
    </form>
  );
}
