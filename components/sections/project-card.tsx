import Image from "next/image";
import Link from "next/link";
import type { ProjectDTO } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <article className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent)] hover:shadow-[0_20px_60px_-15px_var(--glow-blue)] focus-within:border-[var(--color-accent)]">
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-surface-2)]">
        <Image
          src={project.coverImageUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              {project.title}
            </Link>
          </h3>
          {project.impactMetric && (
            <span className="shrink-0 rounded-full bg-[var(--color-success)]/10 px-2.5 py-1 text-sm font-medium text-[var(--color-success)]">
              {project.impactMetric}
            </span>
          )}
        </div>

        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          {project.description}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-mono text-sm text-[var(--color-text-secondary)]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-4 pt-2 text-base font-medium">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
