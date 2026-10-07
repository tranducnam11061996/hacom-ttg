import fs from "node:fs/promises";
import path from "node:path";
const files = ["index.html", "css/site.min.css"];
const content = (
  await Promise.all(files.map((f) => fs.readFile(f, "utf8")))
).join("\n");
const map = JSON.parse(await fs.readFile("data/assets-map.json", "utf8"));
const keep = new Set();
for (const a of map.entries) {
  a.used = content.includes(a.path);
  if (a.used) {
    keep.add(a.path);
    if (a.small && content.includes(a.small)) keep.add(a.small);
  }
}
async function prune(dir) {
  for (const f of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, f.name);
    if (f.isDirectory()) await prune(file);
    else if (!keep.has(file.replaceAll("\\", "/"))) {
      const full = path.resolve(file);
      if (!full.startsWith(path.resolve("image") + path.sep))
        throw Error("Outside images");
      await fs.unlink(full);
    }
  }
}
await prune("image");
await fs.writeFile("data/assets-map.json", JSON.stringify(map, null, 2) + "\n");
console.log("Public image files retained: " + keep.size);
