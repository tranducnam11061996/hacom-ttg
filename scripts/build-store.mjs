import fs from 'node:fs/promises';
import { storeLayout } from './templates/layouts/store.mjs';
import { homeContent } from './templates/pages/home/index.mjs';
import { storePages } from './public.mjs';

const readSnapshot = async name => JSON.parse(await fs.readFile(`data/${name}.snapshot.json`, 'utf8'));
const [storeData, headerData, youtube] = await Promise.all([
  readSnapshot('store'), readSnapshot('header'), readSnapshot('youtube'),
]);
const context = { depth: storePages[0].depth };
await fs.writeFile(storePages[0].file, storeLayout({
  title: storeData.title + ' — Demo', description: storeData.description,
  content: homeContent(storeData, youtube.playlists, context),
  storeData, headerData, context,
  mainClass: 'site-container store-main pt-[12px]', pageScript: 'home',
}));
console.log('Store: ' + storeData.sourceProductCount + ' product placements');
