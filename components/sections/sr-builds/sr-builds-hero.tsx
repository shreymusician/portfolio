import { Reveal } from "@/components/motion/reveal";

/**
 * Cinematic section header -- deliberately not the shared SectionHeading
 * used everywhere else. SR Builds is a creator brand, not another data
 * panel, so it earns its own oversized title treatment (mirrors the scale
 * of the homepage hero name) instead of the compact eyebrow/title pattern.
 */
export function SRBuildsHero() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.14em]">
          <span aria-hidden="true">🎬</span>
          <span className="eyebrow-gradient">Content Creator</span>
        </span>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-gradient">
          SR Builds
        </h2>
      </Reveal>

      <Reveal delay={0.16}>
        <p className="mt-5 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold leading-snug text-[var(--color-text-primary)]">
          Building in Public.
          <br />
          Teaching What I Learn.
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <p className="mx-auto mt-6 max-w-xl text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.75] text-[var(--color-text-secondary)]">
          Every project I build eventually becomes a lesson. I create videos on AI, Data
          Science, Python, Full-Stack Development, Project Building, and Engineering.
        </p>
      </Reveal>
    </div>
  );
}
