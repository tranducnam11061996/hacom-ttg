// Explicit refresh from a settled Chrome DevTools DOM capture; builds stay offline.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';
const arg = process.argv.indexOf('--dom');
if (arg < 0 || !process.argv[arg + 1]) throw Error('Usage: node scripts/collect-cart.mjs --dom <capture.json>');
const capture = JSON.parse(await fs.readFile(process.argv[arg + 1], 'utf8'));
if (capture.source !== 'https://ttgshop.vn/cart') throw Error('Wrong cart source');
const $ = load(capture.html);
const items = $('.js-item-row').toArray().map(e => {
  const row = $(e);
  return { id: row.attr('data-item_id'), name: row.find('.name').text().trim(),
    sourceUrl: row.find('a').first().attr('href'), image: row.find('img').attr('src'),
    price: Number(row.find('.js-buy-price').val()), quantity: Number(row.find('.js-buy-quantity').val()),
    warranty: row.find('td').first().find('p span').text().trim() };
});
if (items.length !== 3 || new Set(items.map(i => i.id)).size !== 3 || items.some(i => !i.name || !i.image || i.quantity !== 1) || items.reduce((n,i)=>n+i.price*i.quantity,0)!==134940000) throw Error('Unexpected cart fixture');
const map = JSON.parse(await fs.readFile('data/assets-map.json', 'utf8'));
const assets = {};
for (const src of new Set(items.map(i => i.image))) {
  const source = new URL(src, capture.source).href;
  const response = await fetch(source);
  if (!response.ok) throw Error('Asset HTTP ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  const existing = map.entries.find(e => e.hash === hash);
  if (existing && await fs.readFile(existing.path).then(b=>b.equals(bytes),()=>false)) { assets[src] = existing; continue; }
  const meta = await sharp(bytes).metadata();
  const path = 'image/cart/' + hash.slice(0,16) + '.' + (meta.format === 'jpeg' ? 'jpg' : meta.format);
  await fs.mkdir('image/cart', { recursive: true });
  await fs.writeFile(path, bytes);
  const asset = { source, path, hash, width: meta.width, height: meta.height, bytes: bytes.length, status:'local', used:true, group:'cart' };
  assets[src] = asset;
  map.entries = map.entries.filter(e=>e.source!==source); map.entries.push(asset);
}
const provinces = $('#ship_to_province option').toArray().map(e=>({value:$(e).attr('value'),name:$(e).text().trim()}));
const snapshot = { source:capture.source, collectedAt:new Date().toISOString(), items, assets, provinces, installmentMonthly:17992000,
  labels:{title:'Giỏ hàng',breadcrumb:'Thông tin giỏ hàng',clear:'Xóa toàn bộ giỏ hàng',buyer:'THÔNG TIN NGƯỜI MUA',summary:'TỔNG TIỀN',buyerHint:'Để tiếp tục đặt hàng, quý khách xin vui lòng nhập thông tin bên dưới'} };
await fs.writeFile('data/cart.snapshot.json', JSON.stringify(snapshot,null,2)+'\n');
await fs.writeFile('data/assets-map.json', JSON.stringify(map,null,2)+'\n');
console.log('Cart snapshot: 3 items, ' + provinces.length + ' province options');
