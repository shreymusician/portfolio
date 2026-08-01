import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import type { YouTubeChannel } from "@/lib/youtube";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ChannelBadge } from "./channel-badge";

/**
 * Channel identity card: logo, description, and the Subscribe/Visit actions.
 * Falls back to static brand copy from siteConfig when the YouTube API
 * isn't configured yet, so the section never looks broken pre-launch.
 */
export function ChannelHeader({ channel }: { channel: YouTubeChannel | null }) {
  const description = channel?.description || siteConfig.srBuilds.description;
  const channelUrl = channel?.url ?? siteConfig.youtubeUrl;

  return (
    <Reveal>
      <div className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-accent-2)]/20 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
          {channel?.thumbnailUrl ? (
            <Image
              src={channel.thumbnailUrl}
              alt={channel.title}
              width={88}
              height={88}
              className="h-20 w-20 shrink-0 rounded-full border border-[var(--color-border-strong)] object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] text-2xl font-semibold text-[var(--color-text-primary)]"
            >
              SR
            </div>
          )}

          <div className="flex-1">
            <ChannelBadge className="text-2xl sm:text-3xl" />
            <p className="mt-2 text-base font-medium text-[var(--color-text-secondary)]">
              {siteConfig.srBuilds.tagline}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:mx-0">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Button href={channelUrl} variant="primary">
                Subscribe
              </Button>
              <Button href={channelUrl} variant="secondary">
                Visit Channel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
