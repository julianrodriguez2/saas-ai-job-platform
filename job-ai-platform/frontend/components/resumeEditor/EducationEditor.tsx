"use client";

import type { ResumeEducationItem } from "@/lib/api";

interface EducationEditorProps {
  items: ResumeEducationItem[];
  onChange: (items: ResumeEducationItem[]) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function createBlankEducation(): ResumeEducationItem {
  return {
    school: "",
    degree: "",
    dates: ""
  };
}

export function EducationEditor({ items, onChange, onMoveUp, onMoveDown }: EducationEditorProps) {
  function updateItem(index: number, patch: Partial<ResumeEducationItem>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...items, createBlankEducation()]);
  }

  function deleteItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) {
      return;
    }

    const cloned = [...items];
    const [moved] = cloned.splice(index, 1);
    cloned.splice(newIndex, 0, moved);
    onChange(cloned);
  }

  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Education</h2>
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
          <button
            type="button"
            onClick={addItem}
            className="rounded-md border border-border bg-surface px-3 py-1 text-xs font-medium"
          >
            Add Entry
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <article key={`education-${index}`} className="rounded-md border border-border bg-surface p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Entry {index + 1}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-50"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-50"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  value={item.school}
                  onChange={(event) => updateItem(index, { school: event.target.value })}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
                  placeholder="School"
                />
                <input
                  value={item.degree}
                  onChange={(event) => updateItem(index, { degree: event.target.value })}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
                  placeholder="Degree"
                />
                <input
                  value={item.dates}
                  onChange={(event) => updateItem(index, { dates: event.target.value })}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
                  placeholder="Dates"
                />
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-muted">No education entries yet.</p>
        )}
      </div>
    </section>
  );
}

