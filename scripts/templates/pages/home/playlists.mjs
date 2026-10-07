import { icon } from "../../../html.mjs";
import { assetUrl } from "../../utils/assets.mjs";
import { playlistCards } from "../../components/playlist-cards.mjs";
export function homePlaylists(playlists, context = {}) {
 return `<section aria-labelledby="youtube-title"><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 id="youtube-title" class="text-2xl font-bold">Thầy Giáo Ba — Danh sách phát</h2><a href="${assetUrl("videos/index.html",context)}" target="_blank" rel="noopener" class="font-semibold">Xem tất cả ${icon()}</a></div><div class="grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-3 snap-x snap-mandatory sm:grid-flow-row sm:grid-cols-2 xl:grid-cols-4">${playlistCards(playlists, { context })}</div></section>`;
}
