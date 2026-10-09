import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Thầy Giáo Ba – Danh sách phát",
  description:
    "Khám phá bốn playlist Thầy Giáo Ba: Siêu Trung Thực, Vlog, Aba Reaction và Daily Moment. Chọn tập và xem video YouTube trong bản demo.",
};
import { youtubeData } from "@/data";
import { PlaylistCards } from "@/features/videos/PlaylistCards";
export default function Page() {
  return (
    <main id="main" className="site-container py-8">
      <h1 className="mb-3 text-3xl font-bold">Thầy Giáo Ba — Danh sách phát</h1>
      <p className="mb-6 text-gray-600">
        Dữ liệu công khai được lưu ngày {youtubeData.capturedAt}; tối đa 30 tập
        mỗi playlist.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <PlaylistCards headingLevel={2} />
      </div>
    </main>
  );
}
