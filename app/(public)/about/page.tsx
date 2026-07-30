import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} -- background, education, and skills.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[var(--color-text-primary)]">
        About Me
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {siteConfig.bio.map((paragraph) => (
          <p
            key={paragraph.slice(0, 20)}
            className="text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-[var(--color-text-secondary)]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold text-[var(--color-text-primary)]">
          Education
        </h2>
        <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="font-medium text-[var(--color-text-primary)]">
            {siteConfig.education.degree}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {siteConfig.education.school} · {siteConfig.education.period}
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold text-[var(--color-text-primary)]">
          Skills
        </h2>
        <div className="mt-4 flex flex-col gap-5">
          {siteConfig.skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                {group.category}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs text-[var(--color-text-primary)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold text-[var(--color-text-primary)]">
          Highlights
        </h2>
        <ol className="mt-4 flex flex-col gap-4 border-l border-[var(--color-border)] pl-5">
          {siteConfig.highlights.map((item) => (
            <li key={item.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.45rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]"
              />
              <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                {item.date}
              </p>
              <p className="font-medium text-[var(--color-text-primary)]">
                {item.title}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
