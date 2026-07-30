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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
        <span className="h-1 w-1 rounded-full bg-[var(--color-highlight)]" />
        <span className="eyebrow-gradient">{eyebrow}</span>
      </span>
      <h2 className="mt-5 text-[clamp(1.9rem,4.2vw,2.9rem)] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.7] text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
