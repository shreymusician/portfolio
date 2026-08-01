import Image from "next/image";
import type { YouTubePlaylist } from "@/lib/youtube";

export function PlaylistCard({ playlist }: { playlist: YouTubePlaylist }) {
  return (
    <a
      href={playlist.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent-2)] hover:shadow-[0_24px_70px_-18px_var(--glow-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
        <Image
          src={playlist.thumbnailUrl}
          alt={playlist.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {playlist.itemCount} videos
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--color-text-primary)]">
          {playlist.title}
        </h3>
      </div>
    </a>
  );
}
