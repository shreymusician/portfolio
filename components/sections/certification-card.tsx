import Image from "next/image";
import type { CertificationDTO } from "@/lib/certifications";

/**
 * The whole card is the certificate link when a verifyUrl exists (currently
 * a Google Drive link in practice). Certs without one render as a static
 * card -- there's nothing to click through to, so no pointer cursor or hover
 * badge is shown for those.
 */
export function CertificationCard({ cert }: { cert: CertificationDTO }) {
  const isClickable = Boolean(cert.verifyUrl);

  const cardClassName = `glass-panel group relative flex h-full flex-col overflow-hidden rounded-2xl border border-transparent transition-all duration-300 ${
    isClickable
      ? "cursor-pointer hover:-translate-y-1.5 hover:border-[var(--color-accent)] hover:shadow-[0_20px_60px_-15px_var(--glow-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      : ""
  }`;

  const content = (
    <>
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-[var(--color-surface-2)]">
        <Image
          src={cert.imageUrl}
          alt={cert.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {isClickable && (
          <span className="glass-panel pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full border-[var(--color-border-strong)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ↗ Open Certificate
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {cert.title}
        </h4>
        <p className="mt-1 text-base text-[var(--color-text-secondary)]">{cert.issuer}</p>
      </div>
    </>
  );

  if (isClickable) {
    return (
      <a
        href={cert.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {content}
      </a>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
