import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const proofPoints = [
  "3rd-year AI/ML engineering student",
  "Ships and documents projects end-to-end",
  "Builds in public on SR Builds (YouTube)",
];

export default function HomePage() {
  const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-4 py-16 sm:px-6 md:flex-row md:py-24">
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <p className="text-sm font-medium text-[var(--color-accent)]">
          {siteConfig.title}
        </p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight text-[var(--color-text-primary)]">
          {siteConfig.name}
        </h1>
        <p className="mt-4 max-w-xl text-[clamp(1rem,1.2vw,1.125rem)] text-[var(--color-text-secondary)]">
          {siteConfig.tagline}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <Link
            href="/projects"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            View Projects
          </Link>
          <Link
            href="/github"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            Explore GitHub
          </Link>
          <a
            href={siteConfig.resumeUrl}
            className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            Download Resume
          </a>
        </div>

        <ul className="mt-10 flex flex-col gap-2 text-sm text-[var(--color-text-secondary)]">
          {proofPoints.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48 ring-1 ring-gray-200 shadow-md rounded-full dark:ring-gray-800">
        <Image
          src={siteConfig.profileImageUrl}
          alt={siteConfig.name}
          fill
          className="rounded-full object-cover"
          priority
        />
      </div>
    </section>
  );
}
