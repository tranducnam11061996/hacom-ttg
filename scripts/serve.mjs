import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { publicFiles } from './public.mjs';
const root = process.cwd();
const allowed = new Set((await publicFiles()).map(file => '/' + file));
await fs.mkdir(".cache", { recursive: true });
await fs.writeFile(".cache/requests.ndjson", "");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};
http
  .createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (pathname === '/pc') pathname = '/pc/index.html';
      if (allowed.has(pathname + '/index.html')) pathname += '/index.html';
      if (pathname.endsWith("/")) pathname += "index.html";
      if (!allowed.has(pathname)) throw Error('Not public');
      const file = path.resolve(root, "." + pathname);
      if (!file.startsWith(root + path.sep)) throw Error("Invalid path");
      const body = await fs.readFile(file);
      const type = types[path.extname(file)] || "application/octet-stream";
      const gzip =
        /gzip/.test(req.headers["accept-encoding"] || "") &&
        /html|css|javascript|svg/.test(type);
      const payload = gzip ? gzipSync(body) : body;
      res.writeHead(200, {
        "Content-Type": type,
        "Content-Length": payload.length,
        "Cache-Control": "no-cache",
        ...(gzip
          ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" }
          : {}),
      });
      res.end(payload);
      fs.appendFile(
        ".cache/requests.ndjson",
        JSON.stringify({
          time: new Date().toISOString(),
          url: pathname,
          bodyBytes: payload.length,
          gzip,
        }) + "\n",
      ).catch(console.error);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not found");
    }
  })
  .listen(Number(process.env.PORT || 4173), "127.0.0.1", () =>
    console.log(`Preview http://127.0.0.1:${process.env.PORT || 4173}`),
  );
