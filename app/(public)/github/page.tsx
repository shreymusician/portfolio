import type { Metadata } from "next";
import {
  getGitHubActivity,
  getGitHubRepos,
  getLanguageBreakdown,
} from "@/lib/github";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Public repositories and recent activity from GitHub.",
};

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

export default async function GitHubPage() {
  const repos = await getGitHubRepos();
  const activity = await getGitHubActivity();
  const languages = getLanguageBreakdown(repos);
  const topRepos = repos.filter((r) => !r.isFork).slice(0, 9);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[var(--color-text-primary)]">
            GitHub
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
            Public repositories and recent activity, pulled live from GitHub.
          </p>
        </div>
        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          View profile
        </a>
      </div>

      {repos.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-secondary)]">
          GitHub data isn&apos;t available right now. Check back soon, or
          visit the profile link above directly.
        </p>
      ) : (
        <>
          {languages.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-medium text-[var(--color-text-secondary)]">
                Top languages
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {languages.slice(0, 6).map((lang) => (
                  <li key={lang.language} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 truncate font-mono text-xs text-[var(--color-text-primary)]">
                      {lang.language}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-accent)]"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-xs text-[var(--color-text-secondary)]">
                      {lang.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)]">
              Repositories
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-sm font-medium text-[var(--color-text-primary)]">
                      {repo.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                      ★ {repo.stars}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-1 text-xs text-[var(--color-text-secondary)]">
                    <span>{repo.language ?? "—"}</span>
                    <span>Updated {formatRelativeDate(repo.updatedAt)}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)]">
              Recent public GitHub activity
            </h2>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              A window into recent public events -- not a complete commit
              history.
            </p>
            {activity.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                No recent public activity to show.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {activity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm"
                  >
                    <span className="truncate text-[var(--color-text-primary)]">
                      {item.label}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-[var(--color-text-secondary)]">
                      {formatRelativeDate(item.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
