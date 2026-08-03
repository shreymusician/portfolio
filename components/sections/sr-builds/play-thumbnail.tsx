import Image from "next/image";

/**
 * Shared thumbnail treatment for the featured video and upload cards: slow
 * zoom + centered play affordance, optional duration badge. Deliberately
 * has no "group" of its own -- it reads group-hover from whichever ancestor
 * (the card, or the featured-video row) declares `group`, so hovering
 * anywhere on the card zooms the thumbnail, not just the image itself.
 * Always links straight out to YouTube.
 */
export function PlayThumbnail({
  href,
  thumbnailUrl,
  title,
  duration,
  sizes = "100vw",
  priority = false,
  className = "",
}: {
  href: string;
  thumbnailUrl: string;
  title: string;
  duration?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch "${title}" on YouTube`}
      className={`relative block aspect-video w-full overflow-hidden bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset ${className}`}
    >
      <Image
        src={thumbnailUrl}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 transition-colors duration-300 group-hover:from-black/65"
      />
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 opacity-85 shadow-lg transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-black">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      {duration && (
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
          {duration}
        </span>
      )}
    </a>
  );
}
