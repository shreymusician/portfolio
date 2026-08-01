import type { YouTubeVideo } from "@/lib/youtube";
import { Reveal } from "@/components/motion/reveal";

/**
 * Flagship video slot. Renders a live embed once the YouTube API is wired
 * up; shows an on-brand placeholder (not an error state) beforehand so the
 * section reads as "coming soon" rather than broken.
 */
export function FeaturedVideo({ video }: { video: YouTubeVideo | null }) {
  return (
    <Reveal delay={0.1}>
      <div className="glass-panel overflow-hidden rounded-3xl">
        {video ? (
          <>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="p-6 sm:p-8">
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-hover)]">
                Featured
              </span>
              <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
                {video.title}
              </h3>
            </div>
          </>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 p-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-hover)]">
              Featured
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
