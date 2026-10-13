import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { youtubeData } from "@/data";
import { resolvePlaylistVideo } from "@/features/videos/resolve-playlist-video";
import { VideoPlayer } from "@/features/videos/VideoPlayer";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ video?: string | string[] }>;
};
function findPlaylist(slug: string) {
  const playlist = youtubeData.playlists.find((p) => p.slug === slug);
  if (!playlist) notFound();
  return playlist;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findPlaylist((await params).slug);
  return {
    title: p.title + " – Thầy Giáo Ba",
    description:
      "Xem playlist " +
      p.title +
      " của Thầy Giáo Ba với " +
      p.videos.length +
      " tập đã lưu. Chọn tập và phát video YouTube trong giao diện demo TGB SHOP.",
  };
}
export default async function Page({ params, searchParams }: Props) {
  const playlist = findPlaylist((await params).slug);
  const { video } = await searchParams;
  const initialVideoId = resolvePlaylistVideo(playlist, video === undefined ? [] : Array.isArray(video) ? video : [video]);
  return (
    <VideoPlayer
      key={playlist.id}
      playlist={playlist}
      initialVideoId={initialVideoId}
      capturedAt={youtubeData.capturedAt}
    />
  );
}
