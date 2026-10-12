import type { Playlist } from "./types";

/** The server and live URL must apply exactly the same validation. */
export function resolvePlaylistVideo(playlist: Playlist, candidates: string[]): string {
  return candidates.length === 1 && playlist.videos.some((video) => video.id === candidates[0])
    ? candidates[0]
    : playlist.videos[0].id;
}
