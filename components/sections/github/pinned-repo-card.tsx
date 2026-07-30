import type { GitHubRepo } from "@/lib/github";

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

export function PinnedRepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent-2)] hover:shadow-[0_24px_70px_-18px_var(--glow-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-accent-2)]/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
      />
      <div className="relative flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent-hover)]">
          Pinned
        </span>
        <span className="flex items-center gap-1 text-xs text-[var(--color-highlight)]">
          ★ {repo.stars}
        </span>
      </div>

      <h3 className="relative truncate font-mono text-base font-semibold text-[var(--color-text-primary)]">
        {repo.name}
      </h3>

      <p className="relative line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {repo.description ?? "No description provided."}
      </p>

      <div className="relative flex items-center justify-between pt-2 text-xs text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1.5">
          {repo.language && (
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]" />
          )}
          {repo.language ?? "—"}
        </span>
        <span>Updated {formatRelativeDate(repo.updatedAt)}</span>
      </div>
    </a>
  );
}
