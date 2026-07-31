import {
  getGitHubActivity,
  getGitHubProfile,
  getContributionCalendar,
  getGitHubRepos,
  getLanguageBreakdown,
} from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { StatsGrid, type GithubStat } from "@/components/sections/github/stats-grid";
import { ContributionHeatmapCard } from "@/components/sections/github/contribution-heatmap-card";
import { PinnedRepoCard } from "@/components/sections/github/pinned-repo-card";

const PINNED_REPO_NAMES = [
  "portfolio",
  "carepolicy-ai-mvp",
  "data-science-journey",
  "medilens-ai",
];

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
  const [repos, activity, profile, calendar] = await Promise.all([
    getGitHubRepos(),
    getGitHubActivity(),
    getGitHubProfile(),
    getContributionCalendar(),
  ]);
  const languages = getLanguageBreakdown(repos);
  const nonForkRepos = repos.filter((r) => !r.isFork);

  const pinned = PINNED_REPO_NAMES.map((name) =>
    nonForkRepos.find((r) => r.name.toLowerCase() === name.toLowerCase())
  ).filter((r): r is NonNullable<typeof r> => Boolean(r));

  const pinnedIds = new Set(pinned.map((r) => r.id));
  if (pinned.length < 3) {
    for (const repo of nonForkRepos) {
      if (pinned.length >= 4) break;
      if (!pinnedIds.has(repo.id)) {
        pinned.push(repo);
        pinnedIds.add(repo.id);
      }
    }
  }

  const topRepos = nonForkRepos.filter((r) => !pinnedIds.has(r.id)).slice(0, 9);

  const stats: GithubStat[] = [];
  if (profile) {
    stats.push({ label: "Public Repos", value: profile.publicRepos, accent: "blue" });
  }
  if (calendar) {
    stats.push(
      {
        label: "Contributions (This Year)",
        value: calendar.years[0]?.totalContributions ?? 0,
        accent: "orange",
      },
      { label: "Current Streak", value: calendar.currentStreak, accent: "purple" },
      { label: "Longest Streak", value: calendar.longestStreak, accent: "sky" }
    );
  }
  if (profile) {
    stats.push({
      label: "Active Since",
      value: profile.joinedYear,
      accent: "blue",
      raw: true,
    });
  }

  return (
    <section id="github" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(55%_50%_at_80%_0%,var(--glow-sky),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-2xl justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-3.5 py-1.5 text-sm font-semibold uppercase tracking-widest text-[var(--color-success)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            </span>
            Live
          </span>
        </div>

        <div className="mt-4">
          <SectionHeading
            eyebrow="Developer Dashboard"
            title="Live GitHub Activity"
            description="Statistics, contribution history, and repositories are fetched automatically from GitHub -- this is a live snapshot of how I build, not a static list."
          />
        </div>

        <Reveal delay={0.1} className="mt-8 flex justify-center">
          <Button href={siteConfig.githubUrl} variant="secondary">
            View profile
          </Button>
        </Reveal>

        {repos.length === 0 ? (
          <Reveal delay={0.15} className="mt-14">
            <div className="glass-panel rounded-2xl p-12 text-center text-base text-[var(--color-text-secondary)]">
              GitHub data isn&apos;t available right now. Check back soon, or
              visit the profile link above directly.
            </div>
          </Reveal>
        ) : (
          <>
            {stats.length > 0 && (
              <div className="mt-16">
                <StatsGrid stats={stats} />
              </div>
            )}

            {calendar && calendar.years.length > 0 && (
              <Reveal delay={0.1} className="mt-10">
                <ContributionHeatmapCard years={calendar.years} />
              </Reveal>
            )}

            {pinned.length > 0 && (
              <div className="mt-16">
                <Reveal>
                  <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
                    Pinned Projects
                  </h3>
                </Reveal>
                <RevealGroup className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {pinned.map((repo) => (
                    <RevealItem key={repo.id}>
                      <PinnedRepoCard repo={repo} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}

            {languages.length > 0 && (
              <Reveal delay={0.15} className="mt-16">
                <div className="glass-panel rounded-2xl p-6 sm:p-8">
                  <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
                    Top languages
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {languages.slice(0, 6).map((lang) => (
                      <li key={lang.language} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 truncate font-mono text-sm text-[var(--color-text-primary)]">
                          {lang.language}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-sky)]"
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                        <span className="w-12 shrink-0 text-right font-mono text-sm text-[var(--color-text-secondary)]">
                          {lang.percentage}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {topRepos.length > 0 && (
              <div className="mt-16">
                <Reveal>
                  <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
                    More Repositories
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
                          <span className="truncate font-mono text-base font-medium text-[var(--color-text-primary)]">
                            {repo.name}
                          </span>
                          <span className="flex shrink-0 items-center gap-1 text-sm text-[var(--color-highlight)]">
                            ★ {repo.stars}
                          </span>
                        </div>
                        {repo.description && (
                          <p className="line-clamp-2 text-base text-[var(--color-text-secondary)]">
                            {repo.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-1 text-sm text-[var(--color-text-secondary)]">
                          <span>{repo.language ?? "—"}</span>
                          <span>Updated {formatRelativeDate(repo.updatedAt)}</span>
                        </div>
                      </a>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}

            <div className="mt-16">
              <Reveal>
                <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
                  Recent public GitHub activity
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  A window into recent public events — not a complete commit
                  history.
                </p>
              </Reveal>
              {activity.length === 0 ? (
                <p className="mt-4 text-base text-[var(--color-text-secondary)]">
                  No recent public activity to show.
                </p>
              ) : (
                <RevealGroup className="mt-4 flex flex-col gap-2">
                  {activity.map((item) => (
                    <RevealItem key={item.id}>
                      <div className="glass-panel flex items-center justify-between gap-3 rounded-xl px-5 py-3 text-base">
                        <span className="truncate text-[var(--color-text-primary)]">
                          {item.label}
                        </span>
                        <span className="shrink-0 font-mono text-sm text-[var(--color-text-secondary)]">
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
