/**
 * SR Builds wordmark -- follows the same typographic-mark language as the
 * site's own Logo (no icon/avatar, gradient carried by the accent word) so
 * the creator brand reads as a sibling identity rather than a bolted-on
 * embed.
 */
export function ChannelBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark font-medium text-[var(--color-text-primary)] ${className}`}>
      <span>SR</span>
      <span className="brand-accent font-semibold">Builds</span>
      <span className="brand-underline" aria-hidden="true" />
    </span>
  );
}
