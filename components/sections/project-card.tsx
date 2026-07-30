import Image from "next/image";
import Link from "next/link";
import type { ProjectDTO } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-accent)] focus-within:border-[var(--color-accent)]">
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-background)]">
        <Image
          src={project.coverImageUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-[var(--color-text-primary)]">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              {project.title}
            </Link>
          </h3>
          {project.impactMetric && (
            <span className="shrink-0 rounded-full bg-[var(--color-success)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-success)]">
              {project.impactMetric}
            </span>
          )}
        </div>

        <p className="text-sm text-[var(--color-text-secondary)]">
          {project.description}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-[var(--color-border)] px-2 py-0.5 font-mono text-xs text-[var(--color-text-secondary)]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-4 pt-2 text-sm font-medium">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
