import type { Metadata } from "next";
import Image from "next/image";
import { getAllCertifications } from "@/lib/certifications";

export const metadata: Metadata = {
  title: "Certifications & Achievements",
  description: "Certifications, workshops, and achievements.",
};

export default async function CertificationsPage() {
  const certifications = await getAllCertifications();

  const groupedByCategory = certifications.reduce(
    (acc, cert) => {
      const category = cert.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(cert);
      return acc;
    },
    {} as Record<string, typeof certifications>
  );

  const categoryLabels: Record<string, string> = {
    certification: "Certifications",
    workshop: "Workshops",
    hackathon: "Hackathons",
    achievement: "Achievements",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[var(--color-text-primary)]">
        Certifications & Achievements
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
        Formal recognition of my learning journey through certifications, workshops, and competitive achievements.
      </p>

      {Object.keys(groupedByCategory).length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No certifications yet.
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {Object.entries(groupedByCategory).map(([category, certs]) => (
            <section key={category}>
              <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold text-[var(--color-text-primary)]">
                {categoryLabels[category] || category}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-0 transition-all hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full bg-[var(--color-background)]">
                      <Image
                        src={cert.imageUrl}
                        alt={cert.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-[var(--color-accent)]">
                        {cert.issueDate}
                      </p>
                      <h3 className="mt-2 font-semibold text-[var(--color-text-primary)]">
                        {cert.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {cert.issuer}
                      </p>
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex text-xs font-medium text-[var(--color-accent)] hover:underline"
                        >
                          Verify Certificate →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
