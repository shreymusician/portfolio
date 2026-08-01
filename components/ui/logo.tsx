/**
 * Typographic brand wordmark -- "Shreyas" in solid type, "R S" carrying a
 * slow-shifting blue -> purple -> sky gradient. No icon, no avatar circle:
 * the type itself is the mark, so it scales cleanly from mobile nav to a
 * future favicon/social banner without needing a separate glyph. Set in
 * Sora (via .brand-mark) rather than the body font, with the gradient
 * reserved for the initials so the mark reads as designed, not colorful.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`brand-mark font-medium text-[var(--color-text-primary)] ${className}`}
    >
      <span>Shreyas</span>
      <span className="brand-accent font-semibold">R S</span>
      <span className="brand-underline" aria-hidden="true" />
    </span>
  );
}
