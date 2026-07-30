import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { ProjectsBrowser } from "@/components/sections/projects-browser";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of AI/ML and software projects I've built.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[var(--color-text-primary)]">
        Projects
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
        A collection of things I&apos;ve built, from ML experiments to full
        applications.
      </p>

      <div className="mt-10">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Coming Soon
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              I'm working on some exciting projects. Check back soon to see what I've built.
            </p>
          </div>
        ) : (
          <ProjectsBrowser projects={projects} />
        )}
      </div>
    </div>
  );
}
