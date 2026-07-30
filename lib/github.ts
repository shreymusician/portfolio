const GITHUB_API_BASE = "https://api.github.com";
const REVALIDATE_SECONDS = 21600; // 6 hours -- respects GitHub's rate limits

export type GitHubRepo = {
  id: number;
  name: string;
  htmlUrl: string;
  description: string | null;
  stars: number;
  language: string | null;
  updatedAt: string;
  isFork: boolean;
};

export type GitHubActivityItem = {
  id: string;
  type: string;
  repoName: string;
  createdAt: string;
  label: string;
};

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const pat = process.env.GITHUB_PAT;
  if (pat) {
    headers.Authorization = `Bearer ${pat}`;
  }
  return headers;
}

/**
 * Fetches public repos for GITHUB_USERNAME. Degrades gracefully: returns an
 * empty array (never throws) if the username is unset, the request fails,
 * or GitHub rate-limits us -- the page renders an empty state instead of
 * crashing. GITHUB_PAT raises the rate limit from 60/hr to 5000/hr.
 */
export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) {
    console.error("GITHUB_USERNAME is not configured; skipping GitHub repo fetch.");
    return [];
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!response.ok) {
      console.error(
        `GitHub repos request failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = (await response.json()) as Array<{
      id: number;
      name: string;
      html_url: string;
      description: string | null;
      stargazers_count: number;
      language: string | null;
      updated_at: string;
      fork: boolean;
      private: boolean;
    }>;

    return data
      .filter((repo) => !repo.private)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        htmlUrl: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        isFork: repo.fork,
      }))
      .sort((a, b) => b.stars - a.stars);
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}

const EVENT_LABELS: Record<string, (repo: string) => string> = {
  PushEvent: (repo) => `Pushed to ${repo}`,
  CreateEvent: (repo) => `Created ${repo}`,
  PullRequestEvent: (repo) => `Opened a pull request on ${repo}`,
  IssuesEvent: (repo) => `Opened an issue on ${repo}`,
  IssueCommentEvent: (repo) => `Commented on ${repo}`,
  WatchEvent: (repo) => `Starred ${repo}`,
  ForkEvent: (repo) => `Forked ${repo}`,
  ReleaseEvent: (repo) => `Published a release on ${repo}`,
};

/**
 * Fetches recent PUBLIC events for GITHUB_USERNAME. This is intentionally
 * described as "recent public activity", not "recent commits" -- the events
 * API mixes several event types and only covers a recent public window, not
 * a full commit history. Degrades to an empty array on any failure.
 */
export async function getGitHubActivity(): Promise<GitHubActivityItem[]> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return [];

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=10`,
      {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!response.ok) {
      console.error(
        `GitHub activity request failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = (await response.json()) as Array<{
      id: string;
      type: string;
      created_at: string;
      repo: { name: string };
    }>;

    return data.map((event) => {
      const labelFn = EVENT_LABELS[event.type];
      return {
        id: event.id,
        type: event.type,
        repoName: event.repo.name,
        createdAt: event.created_at,
        label: labelFn ? labelFn(event.repo.name) : `${event.type} on ${event.repo.name}`,
      };
    });
  } catch (error) {
    console.error("Failed to fetch GitHub activity:", error);
    return [];
  }
}

export type GitHubProfile = {
  publicRepos: number;
  followers: number;
  following: number;
};

/**
 * Fetches public profile counters (repos, followers, following) via the
 * REST /users endpoint. This data is public and needs no token, so it's
 * fetched independently of the GraphQL-backed contribution calendar below.
 */
export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return null;

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`,
      {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      public_repos: number;
      followers: number;
      following: number;
    };

    return {
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
    return null;
  }
}

export type ContributionDay = {
  date: string;
  count: number;
  weekday: number;
};

export type ContributionCalendar = {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  weeks: ContributionDay[][];
};

/**
 * Fetches the last 12 months of contribution activity via GitHub's GraphQL
 * API. Unlike the REST endpoints above, GraphQL always requires an
 * authenticated token -- so this returns null (not an empty calendar) when
 * GITHUB_PAT is unset, and the UI hides the heatmap entirely rather than
 * rendering a broken/empty grid.
 */
export async function getContributionCalendar(): Promise<ContributionCalendar | null> {
  const username = process.env.GITHUB_USERNAME;
  const pat = process.env.GITHUB_PAT;
  if (!username || !pat) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;

    const json = await response.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    const weeks: ContributionDay[][] = calendar.weeks.map(
      (week: { contributionDays: Array<{ date: string; contributionCount: number; weekday: number }> }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          weekday: day.weekday,
        }))
    );

    const allDays = weeks.flat();
    let longestStreak = 0;
    let running = 0;
    for (const day of allDays) {
      if (day.count > 0) {
        running += 1;
        longestStreak = Math.max(longestStreak, running);
      } else {
        running = 0;
      }
    }

    let currentStreak = 0;
    for (let i = allDays.length - 1; i >= 0; i -= 1) {
      if (allDays[i].count > 0) {
        currentStreak += 1;
      } else if (i === allDays.length - 1) {
        // Today may legitimately have zero contributions yet -- skip it
        // without breaking the streak count.
        continue;
      } else {
        break;
      }
    }

    return {
      totalContributions: calendar.totalContributions,
      currentStreak,
      longestStreak,
      weeks,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub contribution calendar:", error);
    return null;
  }
}

/** Aggregates each repo's primary language into a sorted count breakdown. */
export function getLanguageBreakdown(
  repos: GitHubRepo[]
): { language: string; count: number; percentage: number }[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return Array.from(counts.entries())
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}
