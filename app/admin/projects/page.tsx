import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjectsForAdmin } from "@/lib/projects";
import { DeleteProjectButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Projects",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Projects
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {projects.length} project{projects.length === 1 ? "" : "s"} total.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No projects yet.{" "}
            <Link
              href="/admin/projects/new"
              className="font-medium text-[var(--color-accent)] hover:underline"
            >
              Create your first project
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-medium text-[var(--color-text-primary)]">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="shrink-0 rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
                      Featured
                    </span>
                  )}
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      project.published
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-[var(--color-text-secondary)]">
                  /{project.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
