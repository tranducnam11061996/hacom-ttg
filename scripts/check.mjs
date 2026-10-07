import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import { gzipSync } from "node:zlib";
import { generatedPages, publicFiles, scriptGraph } from './public.mjs';
const original = JSON.parse(
  await fs.readFile("data/store.snapshot.json", "utf8"),
);
const pages = generatedPages.map(page => page.file);
const allowed = new Set(await publicFiles());
const errors = [];
const pageScripts = {};
let count = 0;
for (const file of pages) {
  const html = await fs.readFile(file, "utf8");
  const $ = load(html);
  const ids = new Set();
  $("[id]").each((_, el) => {
    const id = $(el).attr("id");
    if (ids.has(id)) errors.push(`${file}: duplicate ${id}`);
    ids.add(id);
  });
  if (
    /include\/|javascript:|on(?:click|load|error)=|hura|fancybox|swiper|jquery|googletagmanager/i.test(
      html,
    )
  )
    errors.push(file + ": legacy code");
  for (const el of $("[src],[href],[srcset]").toArray()) {
    const n = $(el);
    const refs = [
      n.attr("src"),
      n.attr("href"),
      ...(n.attr("srcset") || "").split(",").map((s) => s.trim().split(" ")[0]),
    ].filter(Boolean);
    for (const ref of refs) {
      if (/^(https?:|#|\?)/.test(ref)) continue;
      const target = path.resolve(path.dirname(file), ref.split(/[?#]/)[0]);
      const publicTarget = path.relative(process.cwd(), target).replaceAll('\\', '/');
      if (!allowed.has(publicTarget)) errors.push(`${file}: non-public ${ref}`);
      try {
        await fs.access(target);
      } catch {
        errors.push(`${file}: missing ${ref}`);
      }
    }
  }
  const modules = new Set();
  for (const script of $('script[type="module"][src]').toArray()) {
    const entry = path.posix.normalize(path.posix.join(path.posix.dirname(file), $(script).attr('src')));
    try { for (const dependency of await scriptGraph(entry)) modules.add(dependency); }
    catch (error) { errors.push(`${file}: ${error.message}`); }
  }
  let bytes = 0, gzipBytes = 0;
  for (const module of modules) {
    if (!allowed.has(module)) errors.push(`${file}: non-public module ${module}`);
    const source = await fs.readFile(module);
    bytes += source.length; gzipBytes += gzipSync(source).length;
  }
  pageScripts[file] = { modules: [...modules], bytes, gzipBytes };
  if (gzipBytes > 20 * 1024) errors.push(`${file}: own JS exceeds 20 KiB gzip`);
  if (file === "index.html") {
    count = $("[data-product]").length;
    const expected = [
      ...original.collections.flatMap((c) => c.products),
      ...original.categories.flatMap((c) => c.products),
    ];
    $("[data-product]").each((i, el) => {
      if (
        $(el).find("h3").text() !== expected[i]?.name ||
        !$(el).text().includes(expected[i]?.price)
      )
        errors.push("Product mismatch " + i);
    });
    if ($("iframe").length) errors.push("Homepage iframe");
  }
}
if (count !== 171) errors.push("Product count " + count);
const css = await fs.readFile("css/site.min.css");
for (const [, ref] of css.toString().matchAll(/url\((?:["']?)([^)"']+)/g)) {
  if (!ref.startsWith("data:"))
    try {
      await fs.access(path.resolve("css", ref));
    } catch {
      errors.push("Missing CSS URL " + ref);
    }
}
const metrics = {
  sourceHtmlBytes: original.sourceBytes,
  htmlBytes: (await fs.stat("index.html")).size,
  cssBytes: css.length,
  cssGzipBytes: gzipSync(css).length,
  products: count,
  pages: pages.length,
  localReferenceErrors: errors.length,
  js: {},
  pageScripts,
};
metrics.htmlReductionPercent = Number(
  (100 * (1 - metrics.htmlBytes / metrics.sourceHtmlBytes)).toFixed(1),
);
for (const file of [...allowed].filter(file => file.startsWith('js/'))) {
  const b = await fs.readFile(file);
  metrics.js[file.slice(3)] = { bytes: b.length, gzipBytes: gzipSync(b).length };
}
if (css.length > 70 * 1024) errors.push('CSS exceeds 70 KiB');
metrics.htmlGzipBytes = gzipSync(await fs.readFile("index.html")).length;
await fs.writeFile(
  "docs/validation.json",
  JSON.stringify(
    { checkedAt: new Date().toISOString(), metrics, errors },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify(metrics, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
}
