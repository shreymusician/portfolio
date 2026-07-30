"use client";

import { deleteProjectAction } from "./actions";

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteProjectAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-error)] hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]"
      >
        Delete
      </button>
    </form>
  );
}
