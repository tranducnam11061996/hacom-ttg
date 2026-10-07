import { esc, icon } from "../../html.mjs";
import { assetUrl } from "../utils/assets.mjs";
export function playlistCards(playlists, { context = {} } = {}) {
  return playlists
    .map(
      (p, i) =>
        `<a href="${esc(assetUrl(`videos/playlist/${p.slug}.html`,context))}" target="_blank" rel="noopener" class="min-w-[260px] snap-start overflow-hidden rounded-xl bg-white shadow-sm"><div class="relative aspect-video"><img src="${p.thumbnail}" width="480" height="360" loading="lazy" decoding="async" alt="" class="size-full object-cover"><span class="absolute inset-0 flex items-center justify-center text-white">${icon("play")}</span><span class="absolute bottom-2 left-2 rounded bg-secondary/90 px-2 py-1 text-white">${i + 1}</span></div><div class="p-4"><h3 class="font-bold">${esc(p.title)}</h3><p class="mt-2 text-sm text-gray-600">${p.total.toLocaleString("vi-VN")} video • ${p.videos.length} tập đã lưu</p></div></a>`,
    )
    .join("");
}
