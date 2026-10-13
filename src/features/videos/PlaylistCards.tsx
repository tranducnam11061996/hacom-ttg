import Link from "next/link";
import { youtubeData } from "@/data";
import { Icon } from "@/components/ui/Icon";
import { playlistHref, routes } from "@/lib/routes";
export function PlaylistCards({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return youtubeData.playlists.map((p, i) => (
    <Link
      prefetch={false}
      key={p.id}
      href={playlistHref(p.slug)}
      target="_blank"
      rel="noopener"
      className="min-w-[260px] snap-start overflow-hidden rounded-xl bg-white shadow-sm hover:ring-1 hover:ring-brand-selected"
    >
      <div className="relative aspect-video">
        <img
          src={p.thumbnail}
          width="480"
          height="360"
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : undefined}
          decoding="async"
          alt=""
          className="size-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white">
          <Icon name="play" />
        </span>
        <span className="absolute bottom-2 left-2 rounded bg-secondary/90 px-2 py-1 text-white">
          {i + 1}
        </span>
      </div>
      <div className="p-4">
        <Heading className="font-bold">{p.title}</Heading>
        <p className="mt-2 text-sm text-gray-600">
          {p.total.toLocaleString("vi-VN")} video • {p.videos.length} tập đã lưu
        </p>
      </div>
    </Link>
  ));
}
export function PlaylistSection() {
  return (
    <section aria-labelledby="youtube-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="youtube-title" className="text-2xl font-bold">
          Thầy Giáo Ba — Danh sách phát
        </h2>
        <Link
          prefetch={false}
          href={routes.videos}
          target="_blank"
          rel="noopener"
          className="font-semibold text-brand-text hover:text-secondary"
        >
          Xem tất cả <Icon />
        </Link>
      </div>
      <div className="grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-3 snap-x snap-mandatory sm:grid-flow-row sm:grid-cols-2 xl:grid-cols-4">
        <PlaylistCards />
      </div>
    </section>
  );
}
