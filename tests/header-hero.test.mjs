import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { runInitializer } from './helpers/runtime.mjs';
import {load} from 'cheerio';
test('Header snapshot hierarchy, banners, brands and demo links survive generation',async()=>{
 const data=JSON.parse(await fs.readFile('data/header.snapshot.json','utf8'));
 const $=load(await fs.readFile('index.html','utf8'));
 assert.equal(data.categories.length,16);assert.equal($('[data-mega-panel]').length,7);
 assert.equal(new Set(data.categories.map(c=>c.banner?.path).filter(Boolean)).size,4);
 data.categories.forEach((c,i)=>{
  assert.equal($(`[data-menu-item="${i}"]>a`).text().trim(),c.name);
  const panel=$(`[data-mega-panel="${i}"]`);
  assert.deepEqual(panel.find('.ttg-mega-title').toArray().map(e=>$(e).text()),c.groups.map(g=>g.name));
  assert.deepEqual(panel.find('.ttg-mega-child').toArray().map(e=>$(e).text()),c.groups.flatMap(g=>g.children));
  assert.equal(panel.find('.ttg-brands a').length,c.brands.length);
 });
 $('.ttg-header a,.ttg-hero-section a').each((_,e)=>assert.ok(['#','index.html','pc/index.html','cart/index.html','buildpc/index.html'].includes($(e).attr('href'))));
 assert.equal($('.ttg-slide').length,9);assert.equal($('.ttg-secondary-banners>a').length,3);
 assert.equal($('[data-hero-prev],[data-hero-next]').length,0);
 assert.equal($('.ttg-slide img[fetchpriority="high"]').length,1);
 assert.equal($('[data-product]').length,171);
});
async function harness(reduced=false){
 let now=0,sequence=0;const jobs=new Map(),observers=[];
 const timer=(fn,delay)=>{const id=++sequence;jobs.set(id,{fn,time:now+delay});return id;};
 class Target{handlers=new Map();addEventListener(n,fn){const a=this.handlers.get(n)||[];a.push(fn);this.handlers.set(n,a);}emit(n,e={}){for(const fn of this.handlers.get(n)||[])fn(e);}setAttribute(n,v){this[n]=v;}}
 const track=new Target(),pause=new Target(),hero=new Target(),doc=new Target(),win=new Target(),motion=new Target();
 const slides=Array.from({length:9},()=>{const s=new Target(),img={loading:'lazy'};s.querySelector=()=>img;return s;});
 Object.assign(track,{clientWidth:1200,scrollLeft:0,children:slides,style:{removeProperty(){this.scrollSnapType='';}},setPointerCapture(){}});
 hero.querySelector=s=>s==='[data-hero-track]'?track:pause;hero.contains=n=>[pause,track,...slides].includes(n);
 Object.assign(doc,{hidden:false,querySelector:()=>null,querySelectorAll:s=>s==='[data-hero]'?[hero]:[]});motion.matches=reduced;
 const context={document:doc,window:win,matchMedia:()=>motion,performance:{now:()=>now},setTimeout:timer,clearTimeout:id=>jobs.delete(id),requestAnimationFrame:fn=>timer(()=>fn(now),16),cancelAnimationFrame:id=>jobs.delete(id),IntersectionObserver:class{constructor(fn){this.callback=fn;observers.push(this);}observe(){}},ResizeObserver:class{constructor(fn){this.callback=fn;observers.push(this);}observe(){}}};
 await runInitializer("hero", "initHero", context);
 const advance=ms=>{const end=now+ms;for(;;){const due=[...jobs].filter(([,j])=>j.time<=end).sort((a,b)=>a[1].time-b[1].time)[0];if(!due)break;now=due[1].time;jobs.delete(due[0]);due[1].fn();}now=end;};
 // Hero creates only its own visibility and resize observers.
 observers[0].callback([{target:hero,isIntersecting:true}]);
 return {track,hero,pause,doc,win,motion,slides,advance,resize:()=>observers[1].callback(),visible:v=>observers[0].callback([{target:hero,isIntersecting:v}])};
}
test('Hero autoplay pauses/resumes, rewinds, handles resize and reduced motion',async()=>{
 const h=await harness();h.advance(3499);assert.equal(h.track.scrollLeft,0);h.advance(1100);assert.equal(h.track.scrollLeft,1210);
 h.hero.emit('pointerenter',{pointerType:'mouse'});h.advance(9000);assert.equal(h.track.scrollLeft,1210);
 h.hero.emit('pointerleave');h.advance(4520);assert.equal(h.track.scrollLeft,2420);
 h.visible(false);h.advance(9000);assert.equal(h.track.scrollLeft,2420);h.visible(true);
 h.hero.emit('focusin');h.advance(9000);assert.equal(h.track.scrollLeft,2420);
 h.hero.emit('keydown',{key:'ArrowLeft',preventDefault(){}});h.advance(1020);assert.equal(h.track.scrollLeft,1210);
 h.hero.emit('keydown',{key:'ArrowLeft',preventDefault(){}});h.advance(1020);h.hero.emit('keydown',{key:'ArrowLeft',preventDefault(){}});h.advance(1020);assert.equal(h.track.scrollLeft,9680);
 h.track.clientWidth=800;h.resize();assert.equal(h.track.scrollLeft,6480);
 h.doc.hidden=true;h.doc.emit('visibilitychange');h.advance(9000);assert.equal(h.track.scrollLeft,6480);
 const r=await harness(true);r.advance(10000);assert.equal(r.track.scrollLeft,0);r.hero.emit('keydown',{key:'ArrowRight',preventDefault(){}});assert.equal(r.track.scrollLeft,1210);
});
test('Hero drag snaps to a slide and suppresses an accidental demo click',async()=>{
 const h=await harness(true);h.track.emit('pointerdown',{button:0,pointerId:1,clientX:1000,clientY:200});
 h.track.emit('pointermove',{pointerId:1,clientX:200,clientY:202,preventDefault(){}});h.win.emit('pointerup',{pointerId:1});assert.equal(h.track.scrollLeft,1210);
 let prevented=false,stopped=false;h.hero.emit('click',{preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});assert.ok(prevented&&stopped);
});
