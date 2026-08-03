import {
  getYouTubeChannel,
  getFeaturedVideo,
  getLatestVideos,
  getPlaylists,
} from "@/lib/youtube";
import { siteConfig } from "@/lib/site-config";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SRBuildsHero } from "@/components/sections/sr-builds/sr-builds-hero";
import { FeaturedVideo } from "@/components/sections/sr-builds/featured-video";
import { VideoCard } from "@/components/sections/sr-builds/video-card";
import { PlaylistCard } from "@/components/sections/sr-builds/playlist-card";
import { StatsStrip, type StripStat } from "@/components/sections/sr-builds/stats-strip";
import { SubscribeCTA } from "@/components/sections/sr-builds/subscribe-cta";
import { Reveal } from "@/components/motion/reveal";

export async function SRBuildsSection() {
  const [channel, featured, videos, playlists] = await Promise.all([
    getYouTubeChannel(),
    getFeaturedVideo(),
    getLatestVideos(6),
    getPlaylists(6),
  ]);

  const channelUrl = channel?.url ?? siteConfig.youtubeUrl;

  const stats: StripStat[] = [];
  if (channel) {
    stats.push(
      { label: "Subscribers", value: channel.subscriberCount },
      { label: "Videos", value: channel.videoCount },
      { label: "Total Views", value: channel.viewCount }
    );
  }
  if (playlists.length > 0) {
    stats.push({ label: "Playlists", value: playlists.length });
  }

  return (
    <section id="sr-builds" className="relative overflow-hidden px-4 py-28 sm:px-6">
      {/* Purple -> orange -> pink -> blue wash, distinct from GitHub's single
          sky glow, kept subtle so the page never reads as tinted red. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(50%_45%_at_15%_0%,var(--glow-purple),transparent_70%)] opacity-70" />
        <div className="absolute inset-x-0 top-1/4 h-[32rem] bg-[radial-gradient(45%_45%_at_85%_15%,var(--glow-orange),transparent_70%)] opacity-60" />
        <div className="absolute inset-x-0 top-1/2 h-[34rem] bg-[radial-gradient(50%_50%_at_20%_50%,var(--glow-pink),transparent_70%)] opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-[32rem] bg-[radial-gradient(50%_45%_at_80%_100%,var(--glow-blue),transparent_70%)] opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl">
        <SRBuildsHero />

        <div className="mt-16">
          <FeaturedVideo video={featured} />
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="text-center text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold tracking-tight text-[var(--color-text-primary)]">
              Latest Uploads
            </h3>
          </Reveal>
          {videos.length > 0 ? (
            <RevealGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <RevealItem key={video.id}>
                  <VideoCard video={video} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal delay={0.1} className="mt-8">
              <div className="glass-panel rounded-2xl p-12 text-center text-base text-[var(--color-text-secondary)]">
                Latest uploads will appear here once the SR Builds channel is connected.
              </div>
            </Reveal>
          )}
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="text-center text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold tracking-tight text-[var(--color-text-primary)]">
              Playlists
            </h3>
          </Reveal>
          {playlists.length > 0 ? (
            <RevealGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <RevealItem key={playlist.id}>
                  <PlaylistCard playlist={playlist} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal delay={0.1} className="mt-8">
              <div className="glass-panel rounded-2xl p-12 text-center text-base text-[var(--color-text-secondary)]">
                Playlists will appear here once the SR Builds channel is connected.
              </div>
            </Reveal>
          )}
        </div>

        {stats.length > 0 && (
          <div className="mt-20">
            <StatsStrip stats={stats} />
          </div>
        )}

        <div className="mt-16">
          <SubscribeCTA channelUrl={channelUrl} />
        </div>
      </div>
    </section>
  );
}
