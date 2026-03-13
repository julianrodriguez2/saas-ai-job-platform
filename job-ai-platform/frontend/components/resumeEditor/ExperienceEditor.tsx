"use client";

import type { ResumeExperienceItem } from "@/lib/api";

interface ExperienceEditorProps {
  items: ResumeExperienceItem[];
  onChange: (items: ResumeExperienceItem[]) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function createBlankExperience(): ResumeExperienceItem {
  return {
    company: "",
    title: "",
    dates: "",
    bullets: [""]
  };
}

export function ExperienceEditor({ items, onChange, onMoveUp, onMoveDown }: ExperienceEditorProps) {
  function updateItem(index: number, patch: Partial<ResumeExperienceItem>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...items, createBlankExperience()]);
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

  function addBullet(itemIndex: number) {
    const target = items[itemIndex];
    updateItem(itemIndex, {
      bullets: [...target.bullets, ""]
    });
  }

  function updateBullet(itemIndex: number, bulletIndex: number, value: string) {
    const target = items[itemIndex];
    updateItem(itemIndex, {
      bullets: target.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet))
    });
  }

  function deleteBullet(itemIndex: number, bulletIndex: number) {
    const target = items[itemIndex];
    updateItem(itemIndex, {
      bullets: target.bullets.filter((_, index) => index !== bulletIndex)
    });
  }

  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Experience</h2>
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
            <article key={`experience-${index}`} className="rounded-md border border-border bg-surface p-3">
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
                  value={item.company}
                  onChange={(event) => updateItem(index, { company: event.target.value })}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
                  placeholder="Company"
                />
                <input
                  value={item.title}
                  onChange={(event) => updateItem(index, { title: event.target.value })}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
                  placeholder="Role"
                />
                <input
                  value={item.dates}
                  onChange={(event) => updateItem(index, { dates: event.target.value })}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
                  placeholder="Dates"
                />
              </div>

              <div className="mt-3 space-y-2">
                {item.bullets.map((bullet, bulletIndex) => (
                  <div key={`bullet-${index}-${bulletIndex}`} className="flex gap-2">
                    <input
                      value={bullet}
                      onChange={(event) => updateBullet(index, bulletIndex, event.target.value)}
                      className="w-full rounded-md border border-border bg-panel px-3 py-2 text-sm"
                      placeholder="Bullet point"
                    />
                    <button
                      type="button"
                      onClick={() => deleteBullet(index, bulletIndex)}
                      className="rounded-md border border-border px-3 py-2 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(index)}
                  className="rounded-md border border-border bg-panel px-3 py-2 text-xs font-medium"
                >
                  Add Bullet
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-muted">No experience entries yet.</p>
        )}
      </div>
    </section>
  );
}

