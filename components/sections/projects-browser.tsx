"use client";

import { useMemo, useState } from "react";
import type { ProjectDTO } from "@/lib/projects";
import { ProjectCard } from "./project-card";

export function ProjectsBrowser({ projects }: { projects: ProjectDTO[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const project of projects) {
      for (const tech of project.techStack) tags.add(tech);
    }
    return Array.from(tags).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeTag) return projects;
    return projects.filter((p) => p.techStack.includes(activeTag));
  }, [projects, activeTag]);

  return (
    <div className="flex flex-col gap-8">
      {allTags.length > 0 && (
        <div
          role="group"
          aria-label="Filter projects by technology"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
              activeTag === null
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                activeTag === tag
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center text-base text-[var(--color-text-secondary)]">
          No projects match this filter yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
