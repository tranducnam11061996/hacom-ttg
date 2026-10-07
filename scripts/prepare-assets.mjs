// One-time migration from the saved page. Run before removing include/.
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import sharp from "sharp";

const original = await fs.readFile("index.html", "utf8");
const $ = load(original);
if ($(".p-item").length !== 171 || !original.includes("./include/"))
  throw new Error(
    "Migration requires the original saved index.html and include. Use npm run build for the migrated site.",
  );
await fs.mkdir(".cache", { recursive: true });
await fs.writeFile(".cache/index.original.html", original);
for (const dir of [
  "image/brand",
  "image/banners",
  "image/products",
  "image/icons",
  "css",
  "js",
  "fonts",
  "data",
  "docs",
  "videos/playlist",
  "tests",
])
  await fs.mkdir(dir, { recursive: true });
const cleanText = (element) => $(element).text().replace(/\s+/g, " ").trim();
const product = (element) => {
  const p = $(element),
    image = p.find(".p-picture");
  return {
    name: cleanText(p.find(".p-name")),
    url: p.find(".p-image").attr("href"),
    image: image.attr("data-src") || image.attr("src"),
    price: cleanText(p.find(".p-price-sale")),
    market: cleanText(p.find(".p-price-market")),
    discount: cleanText(p.find(".p-price-off")),
    status: cleanText(p.find(".p-status")),
    buy: cleanText(p.find(".p-buy")),
    overlay: p.find(".p-image span").attr("class") || "",
  };
};
const snapshot = {
  sourceBytes: Buffer.byteLength(original),
  sourceElementCount: $("*").length,
  sourceProductCount: $(".p-item").length,
  title: $("title").text(),
  description: $('meta[name="description"]').attr("content"),
  hero: $(".section-hero img")
    .map((i, e) => ({
      source: $(e).attr("src"),
      alt: $(e).attr("alt"),
      width: Number($(e).attr("width")),
      height: Number($(e).attr("height")),
    }))
    .get(),
  categories: $(".js-category-box")
    .map((i, e) => ({
      name: cleanText($(e).find("h2")),
      links: $(e)
        .find("ul a")
        .map((j, a) => cleanText(a))
        .get(),
      products: $(e)
        .find(".p-item")
        .map((j, p) => product(p))
        .get(),
    }))
    .get(),
  collections: $(".js-collection-slider")
    .map((i, e) => ({
      id: $(e).attr("data-id"),
      products: $(e)
        .find(".p-item")
        .map((j, p) => product(p))
        .get(),
    }))
    .get(),
  navigation: $(".js-navbar-item")
    .map((i, e) => ({
      name: cleanText($(e).find(".navbar-title")),
      links: $(e)
        .find(".sub-item-link")
        .map((j, a) => cleanText(a))
        .get(),
    }))
    .get(),
  searchCategories: $('select[name="category"] option')
    .map((i, e) => cleanText(e))
    .get(),
  features: $(".support-featured li")
    .map((i, e) => ({
      title: cleanText($(e).find("h3")),
      text: cleanText($(e).find("p")),
    }))
    .get(),
  questions: $(".support-question li")
    .map((i, e) => ({
      title: cleanText($(e).find("h3")),
      html: $(e).find('[class*="js-anwers-content"]').html(),
    }))
    .get(),
  footer: $(".global-footer").html(),
  support: $(".header-top__support").html(),
};
const resources = new Map();
const add = (source, group) => {
  if (source && !resources.has(source))
    resources.set(source, { source, group });
};
snapshot.hero.forEach((x) => add(x.source, "banners"));
for (const list of [...snapshot.categories, ...snapshot.collections])
  list.products.forEach((p) => add(p.image, "products"));
$("img").each((i, e) => {
  if (
    !$(e).closest(".section-hero,.p-item,#ttg-giantiepgame-recommendations")
      .length
  )
    add(
      $(e).attr("data-src") || $(e).attr("src"),
      /logo|bct/.test($(e).attr("src") || $(e).attr("data-src") || "")
        ? "brand"
        : "icons",
    );
});
add("/static/assets/default/images/ttgshop-collection-bg-1.jpg", "banners");
const pcCSS = await fs.readFile("include/style_pc.css", "utf8");
snapshot.overlays = {};
for (const p of [...snapshot.categories, ...snapshot.collections].flatMap(
  (x) => x.products,
)) {
  if (!p.overlay || snapshot.overlays[p.overlay]) continue;
  const escaped = p.overlay.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = pcCSS.match(new RegExp("\\." + escaped + "\\s*\\{([^}]+)\\}"));
  const source = block?.[1].match(/url\(([^)]+)\)/)?.[1]?.trim();
  if (source) {
    snapshot.overlays[p.overlay] = source;
    add(source, "icons");
  }
}
const originals = await fs.readdir("include");
const originalHashes = new Map();
let duplicateBytes = 0;
for (const filename of originals) {
  const bytes = await fs.readFile(path.join("include", filename));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (originalHashes.has(hash)) duplicateBytes += bytes.length;
  else originalHashes.set(hash, filename);
}
snapshot.originalAssetBytes = (
  await Promise.all(originals.map((f) => fs.stat(path.join("include", f))))
).reduce((n, s) => n + s.size, 0);
snapshot.originalDuplicateBytes = duplicateBytes;
const entries = [],
  hashes = new Map();
const placeholder = "image/products/placeholder.svg";
await fs.writeFile(
  placeholder,
  '<svg xmlns="http://www.w3.org/2000/svg" width="350" height="350" viewBox="0 0 350 350"><rect width="350" height="350" fill="#f5f5f5"/><rect x="110" y="75" width="130" height="160" rx="10" fill="none" stroke="#bbb" stroke-width="6"/><circle cx="175" cy="140" r="30" fill="none" stroke="#bbb" stroke-width="6"/><text x="175" y="275" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#555">Ảnh chưa khả dụng</text></svg>',
);
const queue = [...resources.values()];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    let bytes,
      downloaded = false;
    try {
      const filename = path.basename(item.source);
      try {
        bytes = await fs.readFile(path.join("include", filename));
      } catch {
        const url = item.source.startsWith("http")
          ? item.source
          : new URL(item.source, "https://ttgshop.vn/").href;
        const response = await fetch(url, {
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw Error("HTTP " + response.status);
        bytes = Buffer.from(await response.arrayBuffer());
        downloaded = true;
      }
      const metadata = await sharp(bytes).metadata();
      const hash = createHash("sha256").update(bytes).digest("hex");
      let asset = hashes.get(hash);
      if (!asset) {
        const safe = filename
          .split(".")[0]
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, "-")
          .slice(0, 110);
        const base = `image/${item.group}/${safe}-${hash.slice(0, 8)}`;
        const maxWidth =
          item.group === "banners"
            ? 1600
            : item.group === "products"
              ? 350
              : Math.min(metadata.width, 1000);
        const result = await sharp(bytes)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .webp({ quality: item.group === "banners" ? 86 : 88 })
          .toBuffer({ resolveWithObject: true });
        asset = {
          path: base + ".webp",
          width: result.info.width,
          height: result.info.height,
          bytes: result.data.length,
          hash,
          originalBytes: bytes.length,
        };
        hashes.set(hash, asset);
        await fs.writeFile(asset.path, result.data);
        if (item.group === "banners" && asset.width > 800) {
          asset.small = base + "-800.webp";
          await sharp(bytes)
            .resize({ width: 800 })
            .webp({ quality: 86 })
            .toFile(asset.small);
        }
      }
      entries.push({
        ...item,
        ...asset,
        status: downloaded ? "downloaded" : "local",
      });
    } catch (error) {
      entries.push({
        ...item,
        path: placeholder,
        width: 350,
        height: 350,
        status: "missing",
        reason: error.message,
      });
    }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
const fontCSS = await fs.readFile("include/css2", "utf8");
let fonts = "";
for (const block of fontCSS.matchAll(
  /\/\* (vietnamese|latin-ext|latin) \*\/\s*(@font-face\s*\{[^}]+\})/g,
)) {
  if (!block[2].includes("font-style: normal")) continue;
  const url = block[2].match(/url\(([^)]+)\)/)[1];
  const response = await fetch(url);
  if (!response.ok) throw Error("Font download failed: " + response.status);
  const filename = `inter-${block[1]}.woff2`;
  await fs.writeFile(
    "fonts/" + filename,
    Buffer.from(await response.arrayBuffer()),
  );
  fonts += block[2].replace(url, "../fonts/" + filename) + "\n";
}
await fs.writeFile("css/fonts.input.css", fonts);
snapshot.assets = Object.fromEntries(entries.map((x) => [x.source, x]));
await fs.writeFile(
  "data/store.snapshot.json",
  JSON.stringify(snapshot, null, 2),
);
await fs.writeFile(
  "data/assets-map.json",
  JSON.stringify(
    {
      originalAssetBytes: snapshot.originalAssetBytes,
      duplicateBytes,
      entries,
    },
    null,
    2,
  ),
);
await fs.writeFile(
  "docs/assets-report.md",
  "# Báo cáo tài nguyên\n\n" +
    entries
      .filter((x) => x.status === "missing")
      .map((x) => `- ${x.source}: ${x.reason}`)
      .join("\n") +
    "\n\nẢnh thiếu dùng placeholder cùng tỷ lệ. Bản gốc: D:\\hacom-ttg-original-2026-10-07.zip.\n",
);
console.log(
  JSON.stringify({
    products: snapshot.sourceProductCount,
    assets: entries.length,
    missing: entries.filter((x) => x.status === "missing").length,
    duplicateBytes,
  }),
);
