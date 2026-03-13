"use client";

import { useState } from "react";

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function SkillsEditor({ skills, onChange, onMoveUp, onMoveDown }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState("");

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed) {
      return;
    }

    if (skills.some((skill) => skill.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill("");
      return;
    }

    onChange([...skills, trimmed]);
    setNewSkill("");
  }

  function removeSkill(skillToRemove: string) {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  }

  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs disabled:opacity-50"
          >
            Up
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs disabled:opacity-50"
          >
            Down
          </button>
        </div>
      </header>
      <div className="mb-3 flex gap-2">
        <input
          value={newSkill}
          onChange={(event) => setNewSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill();
            }
          }}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Add a skill"
        />
        <button
          type="button"
          onClick={addSkill}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1 text-xs"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded px-1 text-xs text-muted hover:bg-border"
                aria-label={`Remove ${skill}`}
              >
                x
              </button>
            </span>
          ))
        ) : (
          <p className="text-sm text-muted">No skills added yet.</p>
        )}
      </div>
    </section>
  );
}
