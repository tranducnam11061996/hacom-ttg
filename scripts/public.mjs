import fs from 'node:fs/promises';
import path from 'node:path';
import { productDetailSlug } from './templates/utils/paths.mjs';

// Single registration point for generated pages. Never discover HTML from the root.
export const storePages = [{ file: 'index.html', depth: 0 }, { file: 'pc/index.html', depth: 1 }, { file: 'cart/index.html', depth: 1 }, { file: 'buildpc/index.html', depth: 1 }, { file: productDetailSlug + '/index.html', depth: 1 }];
const youtube = JSON.parse(await fs.readFile(new URL('../data/youtube.snapshot.json', import.meta.url), 'utf8'));
export const videoPages = [
  { file: 'videos/index.html', depth: 1 },
  ...youtube.playlists.map(p => ({ file: `videos/playlist/${p.slug}.html`, depth: 2 })),
];
export const generatedPages = [...storePages, ...videoPages];

async function files(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.filter(e => !e.name.startsWith('.')).map(e => {
    const file = path.posix.join(directory, e.name);
    return e.isDirectory() ? files(file) : e.isFile() ? [file] : [];
  }))).flat();
}

export async function publicFiles() {
  const [images, fonts, scripts] = await Promise.all([files('image'), files('fonts'), files('js')]);
  return [...generatedPages.map(p => p.file), 'css/site.min.css',
    ...images.filter(f => /\.(webp|png|jpe?g|svg)$/.test(f)),
    ...fonts.filter(f => /\.woff2$/.test(f)), ...scripts.filter(f => /\.js$/.test(f)),
  ];
}

/** Include transitive local imports once when reporting a page's own JS size. */
export async function scriptGraph(entry) {
  const visited = new Set();
  async function visit(file) {
    const normalized = path.posix.normalize(file);
    if (!/^js\/(?:[\w-]+\/)*[\w.-]+\.js$/.test(normalized)) throw Error('Non-public script import: ' + file);
    if (visited.has(normalized)) return;
    visited.add(normalized);
    const code = await fs.readFile(normalized, 'utf8');
    const imports = [...code.matchAll(/(?:\b(?:import|export)\s+(?:[^;]*?\s+from\s+)?|\bimport\s*\()\s*["']([^"']+)["']/g)];
    for (const [, specifier] of imports) {
      if (!specifier.startsWith('.')) throw Error('Non-local runtime import: ' + specifier);
      await visit(path.posix.join(path.posix.dirname(normalized), specifier));
    }
  }
  await visit(entry);
  return [...visited];
}
