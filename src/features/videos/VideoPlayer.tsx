"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { loadYoutubeApi, type YoutubePlayer } from "./youtube-api";
import type { Playlist } from "./types";

export function VideoPlayer({
  playlist,
  initialVideoId,
  capturedAt,
}: {
  playlist: Playlist;
  initialVideoId: string;
  capturedAt: string;
}) {
  const search = useSearchParams(),
    pathname = usePathname(),
    router = useRouter();
  const candidate = search.get("video"),
    first = playlist.videos[0];
  const [externalId, setExternalId] = useState<string | null>(null);
  const selected =
    externalId ||
    (playlist.videos.some((v) => v.id === candidate)
      ? candidate!
      : candidate
        ? first.id
        : initialVideoId);
  const known = playlist.videos.find((v) => v.id === selected);
  const [ready, setReady] = useState(false),
    [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Bấm phát để tải trình phát YouTube.");
  const holder = useRef<HTMLDivElement>(null),
    player = useRef<YoutubePlayer | undefined>(undefined);
  const alive = useRef(false),
    current = useRef(selected);
  const playingId = useRef<string | undefined>(undefined);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      player.current?.destroy();
      player.current = undefined;
    };
  }, []);
  useEffect(() => {
    current.current = selected;
    if (player.current && ready && playingId.current !== selected) {
      const index = playlist.videos.findIndex((v) => v.id === selected);
      if (index >= 0) {
        playingId.current = selected;
        player.current.loadPlaylist({
          list: playlist.id,
          listType: "playlist",
          index,
        });
      }
    }
  }, [selected, ready, playlist]);
  function changeUrl(id: string) {
    const params = new URLSearchParams(window.location.search);
    params.set("video", id);
    router.replace(`${pathname}?${params}#player`, { scroll: false });
  }
  async function play() {
    if (loading || player.current) return;
    setLoading(true);
    setStatus("Đang tải trình phát…");
    try {
      const api = await loadYoutubeApi();
      if (!alive.current || !holder.current) return;
      const mount = document.createElement("div");
      holder.current.replaceChildren(mount);
      player.current = new api.Player(mount, {
        width: "100%",
        height: "100%",
        videoId: current.current,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          listType: "playlist",
          list: playlist.id,
          origin: location.origin,
        },
        events: {
          onReady: (event) => {
            if (!alive.current) return;
            setReady(true);
            setStatus("Trình phát đã sẵn sàng.");
            playingId.current = current.current;
            event.target.loadPlaylist({
              list: playlist.id,
              listType: "playlist",
              index: Math.max(
                0,
                playlist.videos.findIndex((v) => v.id === current.current),
              ),
            });
          },
          onStateChange: (event) => {
            if (!alive.current) return;
            const id = event.target.getVideoData()?.video_id;
            if (!id || id === current.current) return;
            playingId.current = id;
            current.current = id;
            setExternalId(playlist.videos.some((v) => v.id === id) ? null : id);
            changeUrl(id);
          },
          onError: () => {
            if (alive.current)
              setStatus(
                "Video không phát được tại đây. Dùng liên kết “Xem trên YouTube” bên dưới.",
              );
          },
        },
      });
    } catch (error) {
      if (alive.current)
        setStatus(
          error instanceof Error
            ? error.message
            : "Không tải được YouTube. Hãy thử lại hoặc xem trên YouTube.",
        );
    } finally {
      if (alive.current) setLoading(false);
    }
  }
  return (
    <main id="main" className="site-container py-6" data-playlist={playlist.id}>
      <h1 className="mb-3 text-2xl font-bold">{playlist.title}</h1>
      <p className="mb-6 text-gray-600">
        Đang liệt kê {playlist.videos.length} trên{" "}
        {playlist.total.toLocaleString("vi-VN")} video. Snapshot ngày{" "}
        {capturedAt}.{" "}
        {playlist.note || "Thứ tự giữ nguyên từ playlist công khai."}
      </p>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <section
          id="player"
          aria-labelledby="current-title"
          className="min-w-0"
        >
          <div
            id="player-frame"
            className="relative w-full aspect-video min-h-[200px] overflow-hidden rounded-xl bg-secondary text-white"
          >
            <img
              id="player-cover"
              src={known?.thumbnail || first.thumbnail}
              width="480"
              height="360"
              alt=""
              fetchPriority="high"
              className="size-full object-cover"
              hidden={ready}
            />
            <button
              id="play-video"
              type="button"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 text-lg font-bold"
              disabled={loading}
              hidden={ready}
              onClick={play}
            >
              <Icon name="play" /> Phát video
            </button>
            <div
              ref={holder}
              id="youtube-player"
              className="absolute inset-0 size-full"
              hidden={!ready && !loading}
            />
          </div>
          <h2 id="current-title" className="mt-4 text-xl font-bold">
            {known?.title || "Video ngoài danh sách đã lưu"}
          </h2>
          <p
            id="player-status"
            role="status"
            className="mt-3 min-h-5 text-sm text-gray-600"
          >
            {status}
          </p>
          <a
            id="youtube-link"
            href={`https://www.youtube.com/watch?v=${encodeURIComponent(selected)}&list=${playlist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-secondary px-4 py-3 font-semibold text-white"
          >
            Xem trên YouTube ↗
          </a>
          <noscript>
            <p className="mt-3">
              Bật JavaScript để chọn và phát tập tại đây, hoặc dùng liên kết
              YouTube.
            </p>
          </noscript>
        </section>
        <section
          aria-labelledby="episodes-title"
          className="min-w-0 rounded-xl bg-white p-3"
        >
          <h2 id="episodes-title" className="mb-3 text-lg font-bold">
            Danh sách tập
          </h2>
          <ol className="max-h-[720px] space-y-2 overflow-y-auto">
            {playlist.videos.map((v) => (
              <li key={v.id}>
                <Link
                  data-episode=""
                  data-video-id={v.id}
                  href={`?video=${v.id}#player`}
                  prefetch={false}
                  aria-current={v.id === selected ? "true" : undefined}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-orange-50 aria-current:bg-orange-100"
                  onClick={(event) => {
                    event.preventDefault();
                    setExternalId(null);
                    changeUrl(v.id);
                    if (!ready)
                      setStatus(
                        "Đã chọn tập. Bấm phát để tải trình phát YouTube.",
                      );
                  }}
                >
                  <span className="w-5 shrink-0 pt-2 text-xs">
                    {v.position}
                  </span>
                  <div className="relative w-24 shrink-0">
                    <img
                      src={v.thumbnail}
                      width="480"
                      height="360"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full rounded object-cover"
                    />
                    <span className="absolute right-1 bottom-1 bg-black/80 px-1 text-xs text-white">
                      {v.duration}
                    </span>
                  </div>
                  <span data-title="" className="min-w-0 text-sm font-medium">
                    {v.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
