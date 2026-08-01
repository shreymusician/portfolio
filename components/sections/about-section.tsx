import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const connectLinks = [
  { label: "Email", href: `mailto:${siteConfig.email}` },
  { label: "LinkedIn", href: siteConfig.linkedinUrl },
  { label: "GitHub", href: siteConfig.githubUrl },
  { label: "YouTube", href: siteConfig.youtubeUrl },
];

const roboticsTools = [
  "ROS",
  "Arduino",
  "Embedded Systems",
  "Sensor Integration",
  "IoT Platforms",
  "Hardware Design",
];

/** Reverse-chronological education history for the timeline -- newest
 * milestone first. Each entry's `glow` picks its icon-ring accent from the
 * portfolio's existing palette (blue / purple / sky / orange). */
const educationTimeline = [
  {
    icon: "🎓",
    glow: "var(--color-accent)",
    degree: "Bachelor of Engineering in Artificial Intelligence and Machine Learning",
    period: "August 2024 -- April 2028 (Current)",
    institution: "Adichunchanagiri Institute of Technology, Chikkamagaluru",
    score: "CGPA: 9.0",
  },
  {
    icon: "📘",
    glow: "var(--color-accent-2)",
    degree: "Higher Secondary",
    period: "Passed Out -- April 2024",
    institution: "Sri Sai Angels PU College, Sirgapura, Chikkamagaluru",
    score: "Percentage: 89%",
  },
  {
    icon: "🏫",
    glow: "var(--color-sky)",
    degree: "Class 10",
    period: "Passed Out -- July 2022",
    institution: "Sri Sai Angels School, Sirgapura, Chikkamagaluru",
    score: "Percentage: 84.6%",
  },
] as const;

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(60%_50%_at_20%_0%,var(--glow-purple),transparent_70%)]"
      />
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="About"
          title="Engineer, artist, and lifelong builder"
          description="The story behind the projects."
        />

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="flex flex-col gap-5">
            {siteConfig.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 20)}
                className="text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-[var(--color-text-secondary)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Let&apos;s Connect
            </h3>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              Feel free to reach out on any platform below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {connectLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-2 text-base font-medium text-[var(--color-text-primary)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-white/[0.06]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold tracking-tight text-[var(--color-text-primary)]">
              Education <span className="text-gradient">Journey</span>
            </h3>
            <p className="mt-3 text-base text-[var(--color-text-secondary)]">
              The academic foundation behind my engineering journey.
            </p>
          </div>

          <div className="relative mx-auto mt-12 max-w-2xl">
            {/* Timeline spine: thin blue-to-purple gradient line. */}
            <div
              aria-hidden="true"
              className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-sky)]/40"
            />

            <RevealGroup className="flex flex-col gap-8">
              {educationTimeline.map((entry) => (
                <RevealItem key={entry.degree} className="relative flex gap-6">
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-2xl"
                    style={{ boxShadow: `0 0 22px 2px ${entry.glow}33` }}
                  >
                    {entry.icon}
                  </span>

                  <div className="glass-panel flex-1 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/60 hover:shadow-[0_12px_36px_-8px_var(--glow-purple)] sm:p-8">
                    <p className="font-mono text-sm text-[var(--color-text-secondary)]">
                      {entry.period}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
                      {entry.degree}
                    </p>
                    <p className="mt-2 text-base text-[var(--color-text-secondary)]">
                      {entry.institution}
                    </p>
                    <p className="mt-3 inline-flex rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3 py-1 font-mono text-sm text-[var(--color-accent-hover)]">
                      {entry.score}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Skills
            </h3>
            <RevealGroup className="mt-5 flex flex-col gap-5">
              {siteConfig.skills.map((group) => (
                <RevealItem key={group.category}>
                  <h4 className="text-base font-medium text-[var(--color-text-secondary)]">
                    {group.category}
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3 py-1 font-mono text-sm text-[var(--color-text-primary)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              IoT & Robotics
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
              Passionate about building intelligent hardware systems and exploring
              robotics applications. Completed hands-on training at India&apos;s
              premier research institutions.
            </p>
            <ul className="mt-4 space-y-2 text-base text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>IoT Robotics ROS Workshop at IISc (Indian Institute of Science)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>Hands-on robotics learning and embedded systems development</span>
              </li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2">
              {roboticsTools.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3 py-1 font-mono text-sm text-[var(--color-text-primary)]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
