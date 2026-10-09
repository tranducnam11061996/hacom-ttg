// Explicit refresh only. Capture the settled product DOM with Chrome DevTools MCP,
// then pass its evaluate_script JSON file via --dom. Normal builds never fetch.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';

const slug = 'pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc';
const source = 'https://ttgshop.vn/' + slug;
const domPath = process.argv[process.argv.indexOf('--dom') + 1];
if (!process.argv.includes('--dom') || !domPath) throw Error('Usage: node scripts/collect-product.mjs --dom <Chrome DevTools DOM JSON>');
const captured = JSON.parse(await fs.readFile(domPath, 'utf8'));
if (captured.source !== source) throw Error('Wrong source page');
const response = await fetch(source);
if (!response.ok) throw Error('Source HTTP ' + response.status);
const sourceHtml = await response.text();
const $ = load(captured.html);
const text = selector => $(selector).first().text().replace(/\s+/g, ' ').trim();
const imageSrc = n => n.attr('data-src') || n.attr('src');
const gallery = $('.gallery-top .swiper-slide').toArray().map((e, i) => ({
  image: $(e).find('a').attr('href'), thumbnail: imageSrc($('.gallery-thumbs .swiper-slide').eq(i).find('img')),
}));
const comboGroups = $('.pd-combo-item').toArray().map(e => ({
  title: $(e).find('.pd-combo-item-title').text().trim(), image: imageSrc($(e).find('img')),
}));
const upgradeGroups = $('.tb-hura8-variant-selection tr').toArray().map(e => ({
  label: $(e).find('td').first().text().trim(),
  options: $(e).find('a').toArray().map(a => $(a).text().trim()),
  selectedIndex: $(e).find('a').toArray().findIndex(a => $(a).hasClass('selected')),
}));
const similarProducts = $('#js-detail-similar-list .p-item').toArray().map(e => ({
  name: $(e).find('.p-name').text().trim(), image: imageSrc($(e).find('.p-picture')),
  price: $(e).find('.p-price-sale').text().trim(), market: $(e).find('.p-price-market').text().trim(),
  discount: $(e).find('.p-price-off').text().trim(), buy: $(e).find('.p-buy').text().trim(),
  status: $(e).find('.p-status').text().trim(), sourceUrl: $(e).find('.p-image').attr('href'), overlay: 'delta',
}));
const summary = $('.product-summary li').toArray().map(e => $(e).text().trim());
const specificationRows = $('.detail-spec .js-vm-content table tr').toArray().slice(1).map(e =>
  $(e).find('td').toArray().map(td => $(td).text().trim()));
if (gallery.length !== 7 || comboGroups.length !== 4 || summary.length !== 8 ||
    specificationRows.length !== 8 || similarProducts.length !== 15 || upgradeGroups.length !== 3 ||
    similarProducts.some(p => !p.name || !p.image || !p.price)) throw Error('Incomplete source or placeholder products: ' + [gallery.length, comboGroups.length, summary.length, specificationRows.length, similarProducts.length, upgradeGroups.length].join('/'));

const assets = {};
const map = JSON.parse(await fs.readFile('data/assets-map.json', 'utf8'));
async function local(src) {
  if (!src) throw Error('Missing source asset');
  if (assets[src]) return;
  const url = new URL(src, source).href;
  const r = await fetch(url); if (!r.ok) throw Error('Asset HTTP ' + r.status + ': ' + url);
  const bytes = Buffer.from(await r.arrayBuffer());
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  const duplicate = map.entries.find(a => a.hash === hash);
  if (duplicate && await fs.readFile(duplicate.path).then(b => b.equals(bytes), () => false)) {
    assets[src] = duplicate; return;
  }
  const meta = await sharp(bytes).metadata();
  const ext = meta.format === 'jpeg' ? 'jpg' : meta.format;
  const path = 'image/product-detail/' + hash.slice(0, 16) + '.' + ext;
  await fs.mkdir('image/product-detail', { recursive: true });
  await fs.writeFile(path, bytes);
  const asset = { source: url, path, hash, width: meta.width, height: meta.height, bytes: bytes.length, status: 'local', used: true, group: 'product-detail' };
  assets[src] = asset;
  map.entries = map.entries.filter(a => a.source !== url); map.entries.push(asset);
}
const overlays = { delta: '/media/lib/26-09-2026/khung-pc-delta-force_pc.png' };
const contacts = { messenger: '/static/assets/default/images/ttgshop-float-icon-1.png', zalo: '/static/assets/default/images/zalo-icon-15012026-1.png' };
function fragment(selector) {
  const f = load($(selector).html() || '', null, false);
  f('script,style,iframe,object,embed,input[type=hidden]').remove();
  f('*').each((_, e) => {
    const n = f(e);
    for (const key of Object.keys(e.attribs || {})) {
      if (key.startsWith('on') || key.startsWith('data-') || ['id','target','rel'].includes(key)) n.removeAttr(key);
    }
    if (n.attr('class')) {
      n.attr('class', n.attr('class').split(/\s+/).filter(c => !/^js-|^\d+$/.test(c)).join(' ')
        .replace(/product-/g, 'pd-').replace(/\[--color-primary\]/g, '[var(--color-primary)]'));
    }
    if (e.name === 'a') n.attr('href', '#').attr('data-demo', '');
    if (e.name === 'button') n.attr('type', 'button').attr('data-demo', '');
    if (e.name === 'input') n.attr('readonly', '').attr('value', '1');
  });
  f('i').each((_, e) => {
    const cls = f(e).attr('class') || '';
    const type = cls.includes('check-list') ? 'check' : cls.includes('gift') ? 'gift' : 'config';
    f(e).replaceWith('<span class="pd-icon pd-icon-' + type + '" aria-hidden="true"></span>');
  });
  return f.html();
}
const fragments = {
  price: fragment('.product-box'), summary: fragment('.product-summary'),
  promotion: fragment('.product-offer'), quantity: fragment('.product-quantity'),
  purchase: fragment('.product-buy'), description: fragment('.detail-description .js-vm-content'),
  specification: fragment('.detail-spec .js-vm-content'),
};
const descriptionImages = load(fragments.description, null, false)('img').toArray().map(e => e.attribs.src);
const sources = [...gallery.flatMap(g => [g.image, g.thumbnail]), ...comboGroups.map(g => g.image),
  ...similarProducts.map(p => p.image), ...descriptionImages, ...Object.values(overlays), ...Object.values(contacts)];
for (const src of new Set(sources)) await local(src);
const snapshot = {
  source, collectedAt: new Date().toISOString(), productId: '1072100357', slug,
  title: text('h1').replace(/\s*\(Cấu hình gốc\)\s*$/, ''), displayTitle: text('h1'),
  price: text('.product-price-sale'), market: text('.product-price-market'),
  saving: text('.js-variant-discount-num'), warranty: text('.product-wantary'),
  gallery, summary, upgradeGroups, comboGroups, specificationRows, similarProducts,
  comboCartSvg: $('.pd-combo-buy svg').first().attr('aria-hidden','true').toString(),
  fragments, overlays, contacts, assets,
};
await fs.writeFile('data/product-detail.snapshot.json', JSON.stringify(snapshot, null, 2) + '\n');
await fs.writeFile('data/assets-map.json', JSON.stringify(map, null, 2) + '\n');
await fs.mkdir('.cache/product-detail-reference', { recursive: true });
await fs.writeFile('.cache/product-detail-reference/source.html', sourceHtml);
// Literal class list lets Tailwind scan the sanitized snapshot fragments.
const classes = load(Object.values(fragments).join(' '))('[class]').toArray().map(e => e.attribs.class).join('\n');
await fs.writeFile('scripts/templates/pages/product/snapshot-classes.txt', classes + '\n');
console.log('Product: 7 gallery images, 4 combos, 8 specification rows, 15 similar products; ' + Object.keys(assets).length + ' assets');
