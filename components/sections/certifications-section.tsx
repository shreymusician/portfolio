import { getAllCertifications } from "@/lib/certifications";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CertificationCard } from "@/components/sections/certification-card";

const categoryLabels: Record<string, string> = {
  certification: "Certifications",
  workshop: "Workshops",
  hackathon: "Hackathons",
  achievement: "Achievements",
};

export async function CertificationsSection() {
  const certifications = await getAllCertifications();

  const grouped = certifications.reduce(
    (acc, cert) => {
      (acc[cert.category] ??= []).push(cert);
      return acc;
    },
    {} as Record<string, typeof certifications>
  );

  return (
    <section id="certifications" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(55%_50%_at_20%_0%,var(--glow-orange),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Recognition"
          title="Certifications & Achievements"
          description="Formal recognition of my learning journey through certifications, workshops, and competitive achievements."
        />

        {Object.keys(grouped).length === 0 ? (
          <Reveal className="mt-14">
            <div className="glass-panel rounded-2xl p-12 text-center text-base text-[var(--color-text-secondary)]">
              No certifications yet.
            </div>
          </Reveal>
        ) : (
          <div className="mt-16 space-y-16">
            {Object.entries(grouped).map(([category, certs]) => (
              <div key={category}>
                <Reveal>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {categoryLabels[category] || category}
                  </h3>
                </Reveal>
                <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {certs.map((cert) => (
                    <RevealItem key={cert.id}>
                      <CertificationCard cert={cert} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
