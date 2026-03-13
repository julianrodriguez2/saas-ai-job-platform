import type { Profile } from "@/lib/api";

interface ProfileSummaryProps {
  profile: Profile;
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <h2 className="text-lg font-semibold">Profile Summary</h2>
      <dl className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Headline</dt>
          <dd className="text-sm">{profile.headline ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Target Role</dt>
          <dd className="text-sm">{profile.targetRole ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Location</dt>
          <dd className="text-sm">{profile.location ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Experience</dt>
          <dd className="text-sm">
            {typeof profile.yearsExperience === "number"
              ? `${profile.yearsExperience} years`
              : "Not set"}
          </dd>
        </div>
        <div className="md:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-muted">Skills</dt>
          <dd className="mt-1 flex flex-wrap gap-2">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-surface px-2 py-1 text-xs text-text"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm">No skills added.</span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

