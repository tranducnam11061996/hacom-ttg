// Run explicitly to refresh the reference; ordinary builds stay offline.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';
const origin = 'https://ttgshop.vn';
const response = await fetch(origin + '/pc');
if (!response.ok) throw Error('Cannot collect category: ' + response.status);
const html = await response.text(), $ = load(html);
const assets = {}, map = JSON.parse(await fs.readFile('data/assets-map.json', 'utf8'));
async function local(source) {
  if (assets[source]) return assets[source];
  const url = new URL(source, origin).href;
  const r = await fetch(url); if (!r.ok) throw Error(`${r.status}: ${url}`);
  const raw = Buffer.from(await r.arrayBuffer()), hash = crypto.createHash('sha256').update(raw).digest('hex');
  const duplicate = map.entries.find(a => a.hash === hash);
  if (duplicate && await fs.readFile(duplicate.path).then(b=>b.equals(raw),()=>false)) { assets[source] = duplicate; return duplicate; }
  const meta = await sharp(raw).metadata(), ext = meta.format === 'jpeg' ? 'jpg' : meta.format;
  const path = `image/category/pc-${hash.slice(0,12)}.${ext}`;
  await fs.mkdir('image/category', { recursive:true }); await fs.writeFile(path, raw);
  const asset = { source:url, path, hash, width:meta.width, height:meta.height, bytes:raw.length, status:'local', used:true, group:'category' };
  assets[source] = asset; map.entries=map.entries.filter(a=>a.source!==url); map.entries.push(asset); return asset;
}
const products = $('.category-products .p-item').toArray().map(el => {
  const n = $(el); return { name:n.find('.p-name').text().trim(), image:n.find('.p-picture').attr('data-src') || n.find('.p-picture').attr('src'), price:n.find('.p-price-sale').text().trim(), market:n.find('.p-price-market').text().trim(), discount:n.find('.p-price-off').text().trim(), buy:n.find('.p-buy').text().trim(), status:n.find('.p-status').text().trim(), tooltipHtml:n.find('.p-tooltip').html(), overlay:'delta' };
});
const filter = $('.category-filter');
const groups = [];
filter.find('.category-filter__price,.category-filter__brand,.category-filter__attribute > div > div').each((_, el) => {
  const n=$(el), title=n.find('h3,h4').first().text().trim();
  const items=n.find('li').toArray().map(li=>({ label:$(li).text().trim(), checkbox:$(li).find('input').length>0 }));
  if(title && items.length) groups.push({title,items});
});
const description = load($('.category-description .js-vm-content').html(), null, false);
description('script,style').remove();
for(const img of description('img').toArray()) await local(description(img).attr('src'));
for(const p of products) await local(p.image);
const overlay='/media/lib/26-09-2026/khung-pc-delta-force_pc.png'; await local(overlay);
const zalo='/static/assets/default/images/zalo-icon-15012026-1.png'; await local(zalo);
const messenger='/static/assets/default/images/ttgshop-float-icon-1.png'; await local(messenger);
const snapshot={ source:origin+'/pc', collectedAt:new Date().toISOString(), title:'PC GAMING', totalProducts:446, totalPages:$('.paging-link').length, descriptionHtml:description.html(), categoryLinks:filter.find('.category-filter__child li a').toArray().map(a=>({label:$(a).text().trim()})), filterGroups:groups, sortOptions:$('.category-products select option').toArray().map(o=>$(o).text().trim()), products, assets, overlays:{delta:overlay}, zalo, messenger };
if(products.length!==60 || snapshot.totalPages!==7 || groups.length!==6) throw Error(`Unexpected source: ${products.length} products, ${groups.length} filter groups`);
await fs.writeFile('data/category-pc.snapshot.json', JSON.stringify(snapshot,null,2)+'\n');
await fs.writeFile('data/assets-map.json',JSON.stringify(map,null,2)+'\n');
await fs.mkdir('.cache/category',{recursive:true}); await fs.writeFile('.cache/category/source.html',html);
console.log(`Collected ${products.length} cards, ${groups.length} groups, ${Object.keys(assets).length} assets`);

