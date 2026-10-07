import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { storeLayout } from '../scripts/templates/layouts/store.mjs';
import { productCard } from '../scripts/templates/components/product-card.mjs';
import { hero } from '../scripts/templates/pages/home/hero.mjs';
import { homeContent } from '../scripts/templates/pages/home/index.mjs';
import { assetUrl, createImage } from '../scripts/templates/utils/assets.mjs';
import { generatedPages, publicFiles, scriptGraph } from '../scripts/public.mjs';
import { loadRuntime } from './helpers/runtime.mjs';

const read = async name => JSON.parse(await fs.readFile(`data/${name}.snapshot.json`, 'utf8'));
const [storeData, headerData, youtube] = await Promise.all([read('store'), read('header'), read('youtube')]);

test('Store layout and reusable assets work at depths 0, 1 and 2', async () => {
  for (const depth of [0, 1, 2]) {
    const context = { depth }, directory = Array(depth).fill('fixture').join('/');
    const options = { assets: storeData.assets, overlays: storeData.overlays, context };
    const content = `<h1>Trang thử</h1>${productCard(storeData.categories[0].products[0], options)}${hero(storeData.hero, storeData.assets, context)}`;
    const $ = load(storeLayout({ title: 'Thử <layout>', description: 'Demo "TTG"', content, storeData, headerData, context }));
    for (const selector of ['main#main', '[data-header]', '[data-menu-root]', '.ttg-footer', '#demo-status']) assert.equal($(selector).length, 1);
    assert.equal($('h1').length, 1);
    assert.equal($('.sale-section,.service-section,.commitment-section').length, 0);
    assert.equal($('script').attr('src'), '../'.repeat(depth) + 'js/ui.js');
    assert.equal($('title').text(), 'Thử <layout>');
    const ids = $('[id]').toArray().map(el => $(el).attr('id'));
    assert.equal(new Set(ids).size, ids.length);
    for (const element of $('[src],[href],[srcset]').toArray()) {
      const node = $(element);
      const urls = [node.attr('src'), node.attr('href'), ...(node.attr('srcset') || '').split(',').map(v => v.trim().split(' ')[0])].filter(Boolean);
      for (const url of urls) {
        if (/^(https?:|#|\?)/.test(url)) continue;
        const resolved = path.posix.normalize(path.posix.join(directory, url));
        assert.ok(!resolved.startsWith('../'), resolved);
        await fs.access(resolved);
      }
    }
  }
});

test('Path helper preserves external URLs, anchors and queries; invalid depth and missing assets fail clearly', () => {
  for (const url of ['https://example.com/a', '//example.com/a', '#main', '?video=abc', 'mailto:demo@example.com']) assert.equal(assetUrl(url, { depth: 2 }), url);
  assert.equal(assetUrl('./image/example.webp', { depth: 2 }), '../../image/example.webp');
  assert.equal(assetUrl('/image/example.webp', { depth: 1 }), '../image/example.webp');
  assert.throws(() => assetUrl('image/example.webp', { depth: -1 }), /Invalid page depth/);
  assert.throws(() => createImage({})('missing', 'Demo'), /Asset missing: missing/);
});

test('Homepage is rendered completely and changing shared data reaches all layouts', () => {
  const content = homeContent(storeData, youtube.playlists);
  const $ = load(content);
  assert.equal($('[data-product]').length, 171);
  assert.equal($('[data-category]').length, 7);
  assert.equal($('[data-sale] [role="tabpanel"]').length, 6);
  assert.equal($('[aria-labelledby="youtube-title"] a').length, 5);
  assert.ok(!content.includes('youtube:start'));
  const updated = structuredClone(headerData);
  updated.support[0].name = 'Hỗ trợ dùng chung';
  for (const depth of [0, 1, 2]) {
    const html = storeLayout({ title: 'Fixture', content: '<h1>Fixture</h1>', storeData, headerData: updated, context: { depth } });
    assert.ok(html.includes('Hỗ trợ dùng chung'));
  }
});

test('Public manifest includes transitive JS modules and excludes sources', async () => {
  const publicSet = new Set(await publicFiles());
  assert.equal(generatedPages.length, 6);
  for (const module of await scriptGraph('js/home.js')) assert.ok(publicSet.has(module), module);
  assert.ok((await scriptGraph('js/home.js')).includes('js/modules/motion.js'));
  assert.deepEqual(await scriptGraph('js/video.js'), ['js/video.js', 'js/video-state.js']);
  for (const file of ['data/store.snapshot.json', 'scripts/build-store.mjs', 'css/header.input.css', 'README.md']) assert.ok(!publicSet.has(file));
});

test('Absent components allocate no observers, timers or event listeners', async () => {
  const document = { querySelector: () => null, querySelectorAll: () => [] };
  const unexpected = () => { throw Error('Unexpected browser allocation'); };
  for (const [module, initializer] of [['demo', 'initDemo'], ['header', 'initHeader'], ['carousel', 'initCarousels'], ['hero', 'initHero'], ['sale-tabs', 'initSaleTabs'], ['commitment', 'initCommitment']]) {
    const namespace = await loadRuntime(module, { document, matchMedia: unexpected, IntersectionObserver: unexpected, ResizeObserver: unexpected, setTimeout: unexpected });
    namespace[initializer](document);
    namespace[initializer](document);
  }
});

test('Demo prevents only marked actions and demo forms, initializes once, and hides toast', async () => {
  const handlers = {}, timers = new Map();
  let sequence = 0;
  const status = { hidden: true };
  const document = { querySelector: () => status, addEventListener(name, handler) { (handlers[name] ??= []).push(handler); } };
  const { initDemo } = await loadRuntime('demo', { document, setTimeout(fn) { timers.set(++sequence, fn); return sequence; }, clearTimeout(id) { timers.delete(id); } });
  initDemo(document); initDemo(document);
  assert.equal(handlers.click.length, 1); assert.equal(handlers.submit.length, 1);
  let prevented = 0;
  const event = { preventDefault() { prevented++; } };
  handlers.click[0]({ ...event, target: { closest: () => null } });
  handlers.submit[0]({ ...event, target: { matches: () => false } });
  assert.equal(prevented, 0);
  handlers.click[0]({ ...event, target: { closest: () => ({}) } });
  handlers.submit[0]({ ...event, target: { matches: () => true } });
  assert.equal(prevented, 2); assert.equal(status.hidden, false); assert.equal(timers.size, 1);
  [...timers.values()][0](); assert.equal(status.hidden, true);
});

test('Product cards support empty optional fields and escape text', () => {
  const product = { ...storeData.categories[0].products[0], name: '<script>Demo</script>', market: '', discount: '', overlay: '', status: 'Liên hệ' };
  const $ = load(productCard(product, { assets: storeData.assets }));
  assert.equal($('script').length, 0);
  assert.equal($('h3').text(), product.name);
  assert.equal($('.category-discount').length, 0);
  assert.equal($('.category-image img').length, 1);
  assert.equal($('.category-stock-empty').length, 1);
});
