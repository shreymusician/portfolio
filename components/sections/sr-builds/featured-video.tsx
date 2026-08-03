import type { YouTubeVideo } from "@/lib/youtube";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PlayThumbnail } from "./play-thumbnail";
import { formatRelativeDate } from "./format-relative-date";

/**
 * The section's visual centerpiece: large thumbnail on one side, title +
 * metadata + CTA on the other. Desktop splits the two; smaller breakpoints
 * stack. Links straight out to YouTube rather than embedding a player, so
 * the section never triggers autoplay/cookie-consent chrome of its own.
 */
export function FeaturedVideo({ video }: { video: YouTubeVideo | null }) {
  return (
    <Reveal delay={0.1}>
      <div className="glass-panel overflow-hidden rounded-3xl">
        {video ? (
          <div className="group flex flex-col lg:flex-row lg:items-stretch">
            <PlayThumbnail
              href={video.url}
              thumbnailUrl={video.thumbnailUrl}
              title={video.title}
              duration={video.duration}
              className="lg:w-3/5"
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority
            />

            <div className="flex flex-1 flex-col justify-center gap-4 p-8 sm:p-10">
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-hover)]">
                Featured Video
              </span>
              <h3 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-tight text-[var(--color-text-primary)]">
                {video.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                <span>{formatRelativeDate(video.publishedAt)}</span>
                <span aria-hidden="true">•</span>
                <span>{video.duration}</span>
              </div>
              <p className="line-clamp-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {video.description || "No description provided."}
              </p>
              <div className="mt-2">
                <Button href={video.url} variant="primary">
                  Watch on YouTube
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 p-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-hover)]">
              Featured Video
            </span>
            <p className="max-w-sm text-base text-[var(--color-text-secondary)]">
              The flagship video will appear here once the SR Builds channel is connected.
            </p>
          </div>
        )}
      </div>
    </Reveal>
  );
}
