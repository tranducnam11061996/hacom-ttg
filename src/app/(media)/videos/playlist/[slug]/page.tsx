import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { youtubeData } from "@/data";
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
      " tập đã lưu. Chọn tập và phát video YouTube trong giao diện demo TTG SHOP.",
  };
}
export default async function Page({ params, searchParams }: Props) {
  const playlist = findPlaylist((await params).slug);
  const { video } = await searchParams;
  const initialVideoId =
    playlist.videos.find(
      (v) => v.id === (typeof video === "string" ? video : undefined),
    )?.id ?? playlist.videos[0].id;
  return (
    <VideoPlayer
      key={playlist.id}
      playlist={playlist}
      initialVideoId={initialVideoId}
      capturedAt={youtubeData.capturedAt}
    />
  );
}
