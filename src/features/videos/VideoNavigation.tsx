import Link from "next/link";
import { youtubeData } from "@/data";
import { routes } from "@/lib/routes";
export function VideoNavigation() {
  return (
    <header className="bg-secondary text-white [&_:focus-visible]:outline-brand-muted">
      <div className="site-container flex flex-wrap items-center justify-between gap-3 py-5">
        <Link prefetch={false} href={routes.home} className="font-bold">
          TGB SHOP
        </Link>
        <Link prefetch={false} href={routes.videos} className="hover:text-brand-muted">
          Danh sách phát
        </Link>
        <a
          href={youtubeData.channel.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Kênh Thầy Giáo Ba ↗
        </a>
      </div>
    </header>
  );
}
