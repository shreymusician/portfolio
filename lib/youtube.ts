const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const REVALIDATE_SECONDS = 21600; // 6 hours -- respects the API's daily quota

function isConfigured(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID);
}

/** Converts an ISO 8601 duration ("PT12M34S") into "12:34" / "1:02:34". */
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export type YouTubeChannel = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  url: string;
};

/**
 * Fetches channel snippet + statistics for YOUTUBE_CHANNEL_ID. Degrades
 * gracefully: returns null (never throws) if the API key/channel id are
 * unset or the request fails, so the section can fall back to static brand
 * copy instead of crashing the page.
 */
export async function getYouTubeChannel(): Promise<YouTubeChannel | null> {
  if (!isConfigured()) return null;

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) {
      console.error(`YouTube channel request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as {
      items: Array<{
        id: string;
        snippet: {
          title: string;
          description: string;
          customUrl?: string;
          thumbnails: { high?: { url: string }; default: { url: string } };
        };
        statistics: {
          subscriberCount: string;
          viewCount: string;
          videoCount: string;
        };
      }>;
    };

    const channel = data.items?.[0];
    if (!channel) return null;

    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails.high?.url ?? channel.snippet.thumbnails.default.url,
      subscriberCount: Number(channel.statistics.subscriberCount),
      viewCount: Number(channel.statistics.viewCount),
      videoCount: Number(channel.statistics.videoCount),
      url: channel.snippet.customUrl
        ? `https://www.youtube.com/${channel.snippet.customUrl}`
        : `https://www.youtube.com/channel/${channel.id}`,
    };
  } catch (error) {
    console.error("Failed to fetch YouTube channel:", error);
    return null;
  }
}

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  url: string;
};

type RawVideoItem = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { high?: { url: string }; default: { url: string } };
  };
  contentDetails: { duration: string };
  statistics: { viewCount: string };
};

function mapVideoItem(item: RawVideoItem): YouTubeVideo {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.default.url,
    publishedAt: item.snippet.publishedAt,
    duration: formatDuration(item.contentDetails.duration),
    viewCount: Number(item.statistics.viewCount ?? 0),
    url: `https://www.youtube.com/watch?v=${item.id}`,
  };
}

async function fetchVideosByIds(ids: string[]): Promise<Map<string, YouTubeVideo>> {
  if (ids.length === 0) return new Map();

  const response = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${ids.join(",")}&key=${process.env.YOUTUBE_API_KEY}`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!response.ok) return new Map();

  const data = (await response.json()) as { items: RawVideoItem[] };
  return new Map((data.items ?? []).map((item) => [item.id, mapVideoItem(item)]));
}

async function getUploadsPlaylistId(): Promise<string | null> {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      items: Array<{ contentDetails: { relatedPlaylists: { uploads: string } } }>;
    };
    return data.items?.[0]?.contentDetails.relatedPlaylists.uploads ?? null;
  } catch (error) {
    console.error("Failed to resolve YouTube uploads playlist:", error);
    return null;
  }
}

/**
 * Fetches the most recent uploads via the channel's uploads playlist.
 * playlistItems only carries basic snippet data, so this resolves video ids
 * first (in upload order) then batches a single videos.list call for
 * duration/view-count/full snippet -- 2 requests total, never N+1. Returns
 * an empty array (never throws) if unconfigured or either request fails.
 */
export async function getLatestVideos(limit = 6): Promise<YouTubeVideo[]> {
  if (!isConfigured()) return [];

  try {
    const uploadsPlaylistId = await getUploadsPlaylistId();
    if (!uploadsPlaylistId) return [];

    const response = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=contentDetails&maxResults=${limit}&playlistId=${uploadsPlaylistId}&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) return [];

    const data = (await response.json()) as {
      items: Array<{ contentDetails: { videoId: string } }>;
    };
    const orderedIds = (data.items ?? []).map((item) => item.contentDetails.videoId);
    if (orderedIds.length === 0) return [];

    const videosById = await fetchVideosByIds(orderedIds);
    return orderedIds
      .map((id) => videosById.get(id))
      .filter((video): video is YouTubeVideo => Boolean(video));
  } catch (error) {
    console.error("Failed to fetch latest YouTube videos:", error);
    return [];
  }
}

/**
 * Resolves the featured video: YOUTUBE_FEATURED_VIDEO_ID if pinned, else the
 * most recent upload. Reuses getLatestVideos rather than a separate
 * videos.list call when no video is pinned, to save quota.
 */
export async function getFeaturedVideo(): Promise<YouTubeVideo | null> {
  if (!isConfigured()) return null;

  const pinnedId = process.env.YOUTUBE_FEATURED_VIDEO_ID;
  if (!pinnedId) {
    const [latest] = await getLatestVideos(1);
    return latest ?? null;
  }

  try {
    const videosById = await fetchVideosByIds([pinnedId]);
    return videosById.get(pinnedId) ?? null;
  } catch (error) {
    console.error("Failed to fetch featured YouTube video:", error);
    return null;
  }
}

export type YouTubePlaylist = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  url: string;
};

/**
 * Fetches public playlists for the channel. Returns an empty array (never
 * throws) if unconfigured or the request fails.
 */
export async function getPlaylists(limit = 6): Promise<YouTubePlaylist[]> {
  if (!isConfigured()) return [];

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&maxResults=${limit}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) return [];

    const data = (await response.json()) as {
      items: Array<{
        id: string;
        snippet: {
          title: string;
          description: string;
          thumbnails: { high?: { url: string }; default: { url: string } };
        };
        contentDetails: { itemCount: number };
      }>;
    };

    return (data.items ?? []).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.default.url,
      itemCount: item.contentDetails.itemCount,
      url: `https://www.youtube.com/playlist?list=${item.id}`,
    }));
  } catch (error) {
    console.error("Failed to fetch YouTube playlists:", error);
    return [];
  }
}
