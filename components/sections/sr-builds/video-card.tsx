import Image from "next/image";
import type { YouTubeVideo } from "@/lib/youtube";

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

export function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent-2)] hover:shadow-[0_24px_70px_-18px_var(--glow-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-black">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--color-text-primary)]">
          {video.title}
        </h3>
        <span className="mt-auto text-sm text-[var(--color-text-secondary)]">
          {formatRelativeDate(video.publishedAt)}
        </span>
      </div>
    </a>
  );
}
