import { getPublishedProjects } from "@/lib/projects";
import { ProjectsBrowser } from "@/components/sections/projects-browser";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export async function ProjectsSection() {
  const projects = await getPublishedProjects();

  return (
    <section id="projects" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(55%_50%_at_80%_0%,var(--glow-blue),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Work"
          title="Things I've built"
          description="A collection of things I've built, from ML experiments to full applications."
        />

        <Reveal delay={0.1} className="mt-14">
          {projects.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                Coming Soon
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                I&apos;m working on some exciting projects. Check back soon to
                see what I&apos;ve built.
              </p>
            </div>
          ) : (
            <ProjectsBrowser projects={projects} />
          )}
        </Reveal>
      </div>
    </section>
  );
}
