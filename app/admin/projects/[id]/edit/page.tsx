import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { updateProjectAction } from "../../actions";
import { ProjectForm } from "../../project-form";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const boundAction = updateProjectAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Edit Project
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {project.title}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <ProjectForm
          action={boundAction}
          defaultValues={project}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
