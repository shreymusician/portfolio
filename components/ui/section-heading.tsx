import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent-hover)]">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[clamp(1rem,1.1vw,1.125rem)] leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
