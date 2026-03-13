"use client";

interface SummaryEditorProps {
  value: string;
  onChange: (value: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function SummaryEditor({ value, onChange, onMoveUp, onMoveDown }: SummaryEditorProps) {
  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Summary</h2>
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
        placeholder="Write a concise professional summary tailored to the target role."
      />
    </section>
  );
}

