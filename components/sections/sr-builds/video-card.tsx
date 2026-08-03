import type { YouTubeVideo } from "@/lib/youtube";
import { PlayThumbnail } from "./play-thumbnail";
import { formatRelativeDate } from "./format-relative-date";

export function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <div className="glass-panel group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent-2)] hover:shadow-[0_24px_70px_-18px_var(--glow-purple)]">
      <PlayThumbnail
        href={video.url}
        thumbnailUrl={video.thumbnailUrl}
        title={video.title}
        duration={video.duration}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col gap-2 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset"
      >
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--color-text-primary)] transition-colors duration-300 group-hover:text-[var(--color-accent-hover)]">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span>{formatRelativeDate(video.publishedAt)}</span>
          <span aria-hidden="true">•</span>
          <span>{video.viewCount.toLocaleString()} views</span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {video.description || "No description provided."}
        </p>
        <span className="mt-auto inline-flex translate-x-0 items-center gap-1 pt-2 text-sm font-semibold text-[var(--color-accent-hover)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          Watch Video <span aria-hidden="true">→</span>
        </span>
      </a>
    </div>
  );
}
