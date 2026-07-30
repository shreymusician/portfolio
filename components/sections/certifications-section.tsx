import Image from "next/image";
import { getAllCertifications } from "@/lib/certifications";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

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
                      <div className="glass-panel group h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent)] hover:shadow-[0_20px_60px_-15px_var(--glow-blue)]">
                        <div className="relative h-44 w-full bg-[var(--color-surface-2)]">
                          <Image
                            src={cert.imageUrl}
                            alt={cert.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <p className="text-sm font-medium text-[var(--color-accent-hover)]">
                            {cert.issueDate}
                          </p>
                          <h4 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
                            {cert.title}
                          </h4>
                          <p className="mt-1 text-base text-[var(--color-text-secondary)]">
                            {cert.issuer}
                          </p>
                          {cert.verifyUrl && (
                            <a
                              href={cert.verifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex text-sm font-medium text-[var(--color-accent-hover)] hover:underline"
                            >
                              Verify Certificate →
                            </a>
                          )}
                        </div>
                      </div>
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
