import fs from "node:fs/promises";
import { esc, icon, shell } from "./html.mjs";
import { playlistCards } from "./templates/components/playlist-cards.mjs";
import { videoPages } from './public.mjs';
const snapshot = JSON.parse(
  await fs.readFile("data/youtube.snapshot.json", "utf8"),
);
const cards = () => playlistCards(snapshot.playlists, { context: { depth: 1 } });
const nav = (depth) =>
  `<header class="bg-secondary text-white"><div class="site-container flex flex-wrap items-center justify-between gap-3 py-5"><a href="${"../".repeat(depth)}index.html" class="font-bold">TTG SHOP</a><a href="${depth === 2 ? "../" : ""}index.html">Danh sách phát</a><a href="${snapshot.channel.url}" target="_blank" rel="noopener noreferrer">Kênh Thầy Giáo Ba ↗</a></div></header>`;
await fs.writeFile(
  videoPages[0].file,
  shell(
    "Thầy Giáo Ba — Danh sách phát",
    `${nav(1)}<main id="main" class="site-container py-8"><h1 class="mb-3 text-3xl font-bold">Thầy Giáo Ba — Danh sách phát</h1><p class="mb-6 text-gray-600">Dữ liệu công khai được lưu ngày ${snapshot.capturedAt}; tối đa 30 tập mỗi playlist.</p><div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">${cards()}</div></main>`,
    { depth: 1 },
  ),
);
for (const p of snapshot.playlists) {
  const first = p.videos[0];
  const body = `${nav(2)}<main id="main" class="site-container py-6" data-playlist="${p.id}"><h1 class="mb-3 text-2xl font-bold">${esc(p.title)}</h1><p class="mb-6 text-gray-600">Đang liệt kê ${p.videos.length} trên ${p.total.toLocaleString("vi-VN")} video. Snapshot ngày ${snapshot.capturedAt}. ${esc(p.note || "Thứ tự giữ nguyên từ playlist công khai.")}</p><div class="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><section id="player" aria-labelledby="current-title" class="min-w-0"><div id="player-frame" class="relative w-full aspect-video min-h-[200px] overflow-hidden rounded-xl bg-secondary text-white"><img id="player-cover" src="${first.thumbnail}" width="480" height="360" alt="" class="size-full object-cover"><button id="play-video" type="button" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 text-lg font-bold">${icon("play")} Phát video</button><div id="youtube-player" class="absolute inset-0 size-full" hidden></div></div><h2 id="current-title" class="mt-4 text-xl font-bold">${esc(first.title)}</h2><p id="player-status" role="status" class="mt-3 text-sm text-gray-600">Bấm phát để tải trình phát YouTube.</p><a id="youtube-link" href="https://www.youtube.com/watch?v=${first.id}&amp;list=${p.id}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block rounded-lg bg-secondary px-4 py-3 font-semibold text-white">Xem trên YouTube ↗</a><noscript><p class="mt-3">Bật JavaScript để chọn và phát tập tại đây, hoặc dùng liên kết YouTube.</p></noscript></section><section aria-labelledby="episodes-title" class="min-w-0 rounded-xl bg-white p-3"><h2 id="episodes-title" class="mb-3 text-lg font-bold">Danh sách tập</h2><ol class="max-h-[720px] space-y-2 overflow-y-auto">${p.videos.map((v) => `<li><a data-episode data-video-id="${v.id}" href="?video=${v.id}#player" ${v === first ? 'aria-current="true"' : ""} class="flex items-start gap-3 rounded-lg p-2 hover:bg-orange-50 aria-current:bg-orange-100"><span class="w-5 shrink-0 pt-2 text-xs">${v.position}</span><div class="relative w-24 shrink-0"><img src="${v.thumbnail}" width="480" height="360" alt="" loading="lazy" decoding="async" class="aspect-video w-full rounded object-cover"><span class="absolute right-1 bottom-1 bg-black/80 px-1 text-xs text-white">${esc(v.duration)}</span></div><span data-title class="min-w-0 text-sm font-medium">${esc(v.title)}</span></a></li>`).join("")}</ol></section></div></main>`;
  await fs.writeFile(
    videoPages.find(page => page.file === `videos/playlist/${p.slug}.html`).file,
    shell(p.title + " — Thầy Giáo Ba", body, { depth: 2, script: "video" }),
  );
}
console.log(
  "YouTube: " +
    snapshot.playlists.reduce((n, p) => n + p.videos.length, 0) +
    " public videos",
);
