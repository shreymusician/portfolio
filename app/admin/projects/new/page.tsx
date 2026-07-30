import type { Metadata } from "next";
import { createProjectAction } from "../actions";
import { ProjectForm } from "../project-form";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          New Project
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Create a new portfolio project. Uncheck &quot;Published&quot; to
          save it as a draft.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <ProjectForm action={createProjectAction} submitLabel="Create project" />
      </div>
    </div>
  );
}
