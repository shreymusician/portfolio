import Image from "next/image";
import type { YouTubePlaylist } from "@/lib/youtube";
import { Button } from "@/components/ui/button";

/**
 * Netflix-collection styling: title + video count live over the thumbnail
 * itself (gradient scrim), not below it, so the card reads as a curated
 * collection rather than a generic bordered box.
 */
export function PlaylistCard({ playlist }: { playlist: YouTubePlaylist }) {
  return (
    <div className="glass-panel group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent-2)] hover:shadow-[0_24px_70px_-18px_var(--glow-purple)]">
      <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
        <Image
          src={playlist.thumbnailUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white">
            {playlist.title}
          </h3>
          <span className="shrink-0 rounded-md bg-white/15 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {playlist.itemCount} videos
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {playlist.description || "A curated collection from SR Builds."}
        </p>
        <Button href={playlist.url} variant="secondary" className="self-start">
          Open Playlist
        </Button>
      </div>
    </div>
  );
}
