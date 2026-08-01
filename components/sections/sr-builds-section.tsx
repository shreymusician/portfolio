import {
  getYouTubeChannel,
  getFeaturedVideo,
  getLatestVideos,
  getPlaylists,
} from "@/lib/youtube";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatGrid, type StatItem } from "@/components/ui/stat-grid";
import { ChannelHeader } from "@/components/sections/sr-builds/channel-header";
import { FeaturedVideo } from "@/components/sections/sr-builds/featured-video";
import { VideoCard } from "@/components/sections/sr-builds/video-card";
import { PlaylistCard } from "@/components/sections/sr-builds/playlist-card";

export async function SRBuildsSection() {
  const [channel, featured, videos, playlists] = await Promise.all([
    getYouTubeChannel(),
    getFeaturedVideo(),
    getLatestVideos(6),
    getPlaylists(6),
  ]);

  const stats: StatItem[] = [];
  if (channel) {
    stats.push(
      { label: "Subscribers", value: channel.subscriberCount, accent: "orange" },
      { label: "Total Views", value: channel.viewCount, accent: "sky" },
      { label: "Videos", value: channel.videoCount, accent: "purple" }
    );
  }

  return (
    <section id="sr-builds" className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(55%_50%_at_20%_0%,var(--glow-orange),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Creator Brand"
          title="SR Builds"
          description="I don't just build software -- I document the process, teach what I learn, and share it with the community. This is that journey, in public."
        />

        <div className="mt-14">
          <ChannelHeader channel={channel} />
        </div>

        {stats.length > 0 && (
          <div className="mt-10">
            <StatGrid stats={stats} />
          </div>
        )}

        <div className="mt-16">
          <Reveal>
            <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
              Featured Video
            </h3>
          </Reveal>
          <div className="mt-4">
            <FeaturedVideo video={featured} />
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
              Latest Uploads
            </h3>
          </Reveal>
          {videos.length > 0 ? (
            <RevealGroup className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <RevealItem key={video.id}>
                  <VideoCard video={video} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal delay={0.1} className="mt-4">
              <div className="glass-panel rounded-2xl p-12 text-center text-base text-[var(--color-text-secondary)]">
                Latest uploads will appear here once the SR Builds channel is connected.
              </div>
            </Reveal>
          )}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-base font-semibold text-[var(--color-text-secondary)]">
              Playlists
            </h3>
          </Reveal>
          {playlists.length > 0 ? (
            <RevealGroup className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <RevealItem key={playlist.id}>
                  <PlaylistCard playlist={playlist} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal delay={0.1} className="mt-4">
              <div className="glass-panel rounded-2xl p-12 text-center text-base text-[var(--color-text-secondary)]">
                Playlists will appear here once the SR Builds channel is connected.
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
