import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--glow-royal),transparent_70%)]"
      />
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Get in touch"
          title="Let's build something together"
          description="Open to internships, collaborations, and interesting problems. Reach out through any of these."
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
            <div
              aria-hidden="true"
              className="absolute -inset-x-10 -top-20 h-40 rounded-full bg-gradient-to-r from-[var(--color-accent)]/30 via-[var(--color-accent-2)]/25 to-transparent blur-3xl"
            />
            <div className="relative flex flex-wrap items-center justify-center gap-4">
              <Button href={`mailto:${siteConfig.email}`} variant="primary">
                Email Me
              </Button>
              <Button href={siteConfig.linkedinUrl} variant="secondary">
                LinkedIn
              </Button>
              <Button href={siteConfig.githubUrl} variant="secondary">
                GitHub
              </Button>
              <Button href={siteConfig.youtubeUrl} variant="secondary">
                YouTube
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
