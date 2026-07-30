import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.coverImageUrl }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/projects"
        className="text-base font-medium text-[var(--color-accent)] hover:underline"
      >
        ← All projects
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[var(--color-text-primary)]">
          {project.title}
        </h1>
        {project.impactMetric && (
          <span className="shrink-0 rounded-full bg-[var(--color-success)]/10 px-3 py-1 text-base font-medium text-[var(--color-success)]">
            {project.impactMetric}
          </span>
        )}
      </div>

      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
        <Image
          src={project.coverImageUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-[var(--color-text-secondary)]">
        {project.description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-md border border-[var(--color-border)] px-2.5 py-1 font-mono text-sm text-[var(--color-text-secondary)]"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-base font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            View on GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-base font-medium text-white hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            Live demo
          </a>
        )}
      </div>
    </div>
  );
}
