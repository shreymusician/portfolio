import {
  getGitHubActivity,
  getGitHubRepos,
  getLanguageBreakdown,
} from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

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

export async function GitHubSection() {
  const repos = await getGitHubRepos();
  const activity = await getGitHubActivity();
  const languages = getLanguageBreakdown(repos);
  const topRepos = repos.filter((r) => !r.isFork).slice(0, 9);

  return (
    <section id="github" className="relative px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Live"
          title="GitHub Activity"
          description="Public repositories and recent activity, pulled live from GitHub."
        />

        <Reveal delay={0.1} className="mt-8 flex justify-center">
          <Button href={siteConfig.githubUrl} variant="secondary">
            View profile
          </Button>
        </Reveal>

        {repos.length === 0 ? (
          <Reveal delay={0.15} className="mt-14">
            <div className="glass-panel rounded-2xl p-12 text-center text-sm text-[var(--color-text-secondary)]">
              GitHub data isn&apos;t available right now. Check back soon, or
              visit the profile link above directly.
            </div>
          </Reveal>
        ) : (
          <>
            {languages.length > 0 && (
              <Reveal delay={0.15} className="mt-16">
                <div className="glass-panel rounded-2xl p-6 sm:p-8">
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Top languages
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {languages.slice(0, 6).map((lang) => (
                      <li key={lang.language} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 truncate font-mono text-xs text-[var(--color-text-primary)]">
                          {lang.language}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right font-mono text-xs text-[var(--color-text-secondary)]">
                          {lang.percentage}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <div className="mt-16">
              <Reveal>
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Repositories
                </h3>
              </Reveal>
              <RevealGroup className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topRepos.map((repo) => (
                  <RevealItem key={repo.id}>
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-panel flex h-full flex-col gap-2 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent)] hover:shadow-[0_20px_60px_-15px_var(--glow-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-sm font-medium text-[var(--color-text-primary)]">
                          {repo.name}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--color-highlight)]">
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
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div className="mt-16">
              <Reveal>
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Recent public GitHub activity
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  A window into recent public events — not a complete commit
                  history.
                </p>
              </Reveal>
              {activity.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                  No recent public activity to show.
                </p>
              ) : (
                <RevealGroup className="mt-4 flex flex-col gap-2">
                  {activity.map((item) => (
                    <RevealItem key={item.id}>
                      <div className="glass-panel flex items-center justify-between gap-3 rounded-xl px-5 py-3 text-sm">
                        <span className="truncate text-[var(--color-text-primary)]">
                          {item.label}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-[var(--color-text-secondary)]">
                          {formatRelativeDate(item.createdAt)}
                        </span>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
