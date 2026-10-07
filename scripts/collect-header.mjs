// Explicit one-time collection. Normal builds never access the network.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';
const origin='https://ttgshop.vn';
const get=async url=>{const r=await fetch(new URL(url,origin));if(!r.ok)throw Error(`${r.status}: ${url}`);return r;};
const $=load(await (await get('/')).text());
const assets=new Map();
async function local(source,folder){
  if(!source)return null;
  const url=new URL(source,origin);url.search='';
  if(assets.has(url.href))return assets.get(url.href);
  const raw=Buffer.from(await (await get(url.href)).arrayBuffer());
  const hash=crypto.createHash('sha256').update(raw).digest('hex');
  const existing=[...assets.values()].find(a=>a.hash===hash);
  if(existing){assets.set(url.href,existing);return existing;}
  const originalMeta=await sharp(raw).metadata();
  const output=folder==='banners'?await sharp(raw).resize({width:Math.min(346,originalMeta.width)}).webp({quality:88}).toBuffer():raw;
  const meta=await sharp(output).metadata();
  const ext=meta.format==='jpeg'?'jpg':meta.format;
  const path=`image/${folder}/header-${hash.slice(0,12)}.${ext}`;
  await fs.mkdir(`image/${folder}`,{recursive:true});await fs.writeFile(path,output);
  const a={source:url.href,path,hash,width:meta.width,height:meta.height,bytes:output.length,originalBytes:raw.length};assets.set(url.href,a);return a;
}
const categories=[];
for(const el of $('.navbar-item.js-navbar-item').toArray()){
 const n=$(el),groups=[];
 for(const g of n.find('.sub-item').toArray()){
  const group=$(g),heading=group.find('.sub-item-1 > a').first();
  if(heading.length)groups.push({name:heading.text().trim(),children:group.find('.sub-item-2 > a').toArray().map(a=>$(a).text().trim())});
 }
 const category={name:n.children('.navbar-link').text().trim(),groups,brands:[],banner:null};
 const endpoint=n.attr('data-url');
 if(groups.length&&endpoint){
  const b=load(await (await get(endpoint)).text());
  const list=b('.js-nav-brand-list');
  category.banner=await local(list.attr('data-banner-file'),'banners');
  for(const a of list.find('a').toArray()){
   const link=b(a),img=link.find('img');
   category.brands.push({name:(img.attr('alt')||link.attr('title')||link.text()).trim()||'Thương hiệu',image:img.length?await local(img.attr('src')||img.attr('data-src'),'brand'):null});
  }
 }
 categories.push(category);
}
const shortcuts=[];
for(const el of $('.header-bottom a').toArray()){
 const a=$(el),style=a.find('i').attr('style')||'',source=style.match(/url\(['"]?([^)'" ]+)/)?.[1];
 if(source)shortcuts.push({name:a.text().trim(),image:await local(source,'icons')});
}
const support=[];
for(const el of $('.header-top__support-group').toArray()){
 const n=$(el),sections=[];
 for(const wrapper of n.find('.header-top__support-wrapper').toArray()){
  const w=$(wrapper);
  for(const title of w.find('.header-top__support-title').toArray())sections.push({title:$(title).text().trim(),lines:$(title).nextUntil('.header-top__support-title','a').toArray().map(a=>$(a).text().replace(/\s+/g,' ').trim()).filter(Boolean)});
 }
 if(!sections.length){const text=n.find('.header-top__support-list').text().split(/\n/).map(s=>s.trim()).filter(Boolean);sections.push({title:'',lines:text});}
 support.push({name:n.find('.header-top__support-heading').text().trim(),sections});
}
if(categories.length!==16||categories.filter(c=>c.groups.length).length!==7)throw Error('Unexpected menu structure; inspect source before updating snapshot');
await fs.writeFile('data/header.snapshot.json',JSON.stringify({collectedAt:new Date().toISOString(),source:origin,categories,shortcuts,support,assets:[...assets.values()]},null,2)+'\n');
const map=JSON.parse(await fs.readFile('data/assets-map.json','utf8'));
const sources=new Set([...assets.values()].map(a=>a.source));
map.entries=map.entries.filter(a=>!sources.has(a.source));
map.entries.push(...[...assets.values()].map(a=>({...a,group:a.path.split('/')[1],status:'local',used:true})));
await fs.writeFile('data/assets-map.json',JSON.stringify(map,null,2)+'\n');
console.log(JSON.stringify({categories:categories.length,groups:categories.map(c=>[c.name,c.groups.length,c.brands.length,!!c.banner]),shortcuts:shortcuts.length,support:support.length,assets:assets.size}));
