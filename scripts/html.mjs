import { assetUrl } from './templates/utils/paths.mjs';
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const icon = (name = "arrow") =>
  `<svg class="inline-block size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${{ arrow: '<path d="m9 5 7 7-7 7"/>', search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>', menu: '<path d="M3 6h18M3 12h18M3 18h18"/>', cart: '<path d="M2 3h3l3 13h11l3-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>', play: '<path d="m8 4 12 8-12 8Z"/>', user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>' }[name]}</svg>`;
export const shell = (
  title,
  body,
  {
    depth = 0,
    script = "ui",
    description = "Website demo TTG và danh sách phát Thầy Giáo Ba.",
  } = {},
) => {
  const publicUrl = value => esc(assetUrl(value, { depth }));
  return `<!doctype html>\n<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="icon" type="image/webp" href="${publicUrl("image/brand/logo_ttgshop-logo-27122025-1-91346259.webp")}"><link rel="stylesheet" href="${publicUrl("css/site.min.css")}"><script type="module" src="${publicUrl(`js/${script}.js`)}"></script></head><body class="bg-[#f5f5f5] text-secondary"><a class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3" href="#main">Bỏ qua điều hướng</a>${body}</body></html>\n`;
};
