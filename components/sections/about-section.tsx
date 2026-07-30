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

export function AboutSection() {
  return (
    <section id="about" className="relative px-4 py-28 sm:px-6">
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
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Feel free to reach out on any platform below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {connectLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-white/[0.06]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.15}>
            <div className="glass-panel h-full rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Education
              </h3>
              <p className="mt-3 font-medium text-[var(--color-text-primary)]">
                {siteConfig.education.degree}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {siteConfig.education.school} · {siteConfig.education.period}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass-panel h-full rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Highlights
              </h3>
              <ol className="mt-4 flex flex-col gap-4 border-l border-[var(--color-border)] pl-5">
                {siteConfig.highlights.slice(0, 2).map((item) => (
                  <li key={item.title} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-[var(--color-highlight)]"
                    />
                    <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                      {item.date}
                    </p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {item.title}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Skills
            </h3>
            <RevealGroup className="mt-5 flex flex-col gap-5">
              {siteConfig.skills.map((group) => (
                <RevealItem key={group.category}>
                  <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {group.category}
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3 py-1 font-mono text-xs text-[var(--color-text-primary)]"
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
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Passionate about building intelligent hardware systems and exploring
              robotics applications. Completed hands-on training at India&apos;s
              premier research institutions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
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
                  className="rounded-full border border-[var(--color-border)] bg-white/[0.03] px-3 py-1 font-mono text-xs text-[var(--color-text-primary)]"
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
