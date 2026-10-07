import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { runInitializer } from './helpers/runtime.mjs';
import { load } from 'cheerio';

test('Category output preserves every snapshot field and demo action', async () => {
  const data = JSON.parse(await fs.readFile('data/store.snapshot.json', 'utf8'));
  const $ = load(await fs.readFile('index.html', 'utf8'));
  assert.equal($('[data-category]').length, 7);
  data.categories.forEach((category, i) => {
    const section = $(`[data-category="${i}"]`);
    assert.deepEqual(section.find('.category-links a').toArray().map(e => $(e).text()), category.links);
    assert.equal(section.find('[data-product]').length, category.products.length);
    section.find('[data-product]').each((j, element) => {
      const card = $(element), product = category.products[j];
      for (const [selector, field] of [['h3','name'],['.category-price','price'],['del','market'],['.category-stock','status'],['.category-discount','discount']])
        assert.equal(card.find(selector).text(), product[field] || '');
      assert.equal(card.find('.category-image img').first().attr('src'), data.assets[product.image].path);
      assert.equal(card.find('[data-demo]').text().trim(), product.buy);
      card.find('a').each((_, link) => assert.equal($(link).attr('href'), '#'));
    });
  });
});

// Run the real UI module against browser events and a deterministic clock.
// This exercises carousel lifecycle without introducing a browser dependency.
async function harness({ reduced = false, count = 15, sale = false } = {}) {
  let now = 0, sequence = 0;
  const jobs = new Map(), observers = [];
  const setTimer = (fn, delay) => { const id = ++sequence; jobs.set(id,{fn,time:now+delay}); return id; };
  class Target {
    handlers = new Map();
    addEventListener(name, fn) { const handlers = this.handlers.get(name) || []; handlers.push(fn); this.handlers.set(name, handlers); }
    emit(name, event = {}) { for (const fn of this.handlers.get(name) || []) fn(event); }
  }
  const track = new Target();
  let cardWidth = 90;
  Object.assign(track, { clientWidth:490, scrollWidth:count*100-10, scrollLeft:0, children:Array(count), firstElementChild:{getBoundingClientRect:()=>({width:cardWidth})}, style:{removeProperty(key){ if(key==='scroll-snap-type') delete this.scrollSnapType; }} });
  const prev = new Target(), next = new Target();
  prev.hasAttribute = name => name === 'data-category-prev';
  next.hasAttribute = () => false;
  const rail = new Target();
  const panel={hidden:false};
  rail.closest=()=>sale?panel:null;rail.hasAttribute=()=>sale;rail.classList={add(){},remove(){}};
  track.setPointerCapture=()=>{};
  rail.querySelector = () => track;
  rail.querySelectorAll = () => [prev,next];
  rail.contains = element => [prev,next,track].includes(element);
  const doc = new Target(), win = new Target(), motion = new Target();
  Object.assign(doc, {hidden:false, querySelector:()=>null, querySelectorAll:selector=>selector==='[data-category-carousel]'?[rail]:[]});
  motion.matches = reduced;
  const context = { document:doc, window:win, matchMedia:()=>motion, performance:{now:()=>now}, setTimeout:setTimer, clearTimeout:id=>jobs.delete(id), setInterval:setTimer, clearInterval:id=>jobs.delete(id), requestAnimationFrame:fn=>setTimer(()=>fn(now),16), cancelAnimationFrame:id=>jobs.delete(id), IntersectionObserver:class { constructor(fn){this.callback=fn;observers.push(this);} observe(){} }, ResizeObserver:class {constructor(fn){this.callback=fn;observers.push(this);}observe(){}} };
  await runInitializer("carousel", "initCarousels", context);
  const advance = milliseconds => {
    const end = now+milliseconds;
    for (;;) {
      const due = [...jobs.entries()].filter(([,job])=>job.time<=end).sort((a,b)=>a[1].time-b[1].time)[0];
      if(!due) break;
      now=due[1].time; jobs.delete(due[0]); due[1].fn();
    }
    now=end;
  };
  return {track,prev,next,rail,doc,win,panel,motion,advance, visible:value=>observers[0].callback([{target:rail,isIntersecting:value}]), resize(width){cardWidth=width;track.scrollWidth=count*(width+10)-10;observers[1].callback();}};
}

test('Sale drag snaps and blocks accidental click; hidden panels never autoplay',async()=>{
 const h=await harness({sale:true,reduced:true});h.visible(true);
 h.track.emit('pointerdown',{pointerType:'mouse',button:0,pointerId:1,clientX:500});
 h.track.emit('pointermove',{pointerId:1,clientX:270,preventDefault(){}});h.win.emit('pointerup');
 assert.equal(h.track.scrollLeft,200);let blocked=false;
 h.rail.emit('click',{preventDefault(){blocked=true;},stopPropagation(){}});assert.equal(blocked,true);
 const a=await harness({sale:true});a.panel.hidden=true;a.visible(true);a.advance(10000);assert.equal(a.track.scrollLeft,0);
 a.panel.hidden=false;a.visible(true);a.advance(4600);assert.equal(a.track.scrollLeft,100);
});

test('Autoplay waits 3.5 seconds, moves one card in one second, pauses and resumes', async () => {
  const h=await harness(); h.visible(true); h.advance(3499); assert.equal(h.track.scrollLeft,0);
  h.advance(501); assert.ok(h.track.scrollLeft>0 && h.track.scrollLeft<100);
  h.advance(600); assert.equal(h.track.scrollLeft,100);
  h.rail.emit('pointerenter',{pointerType:'mouse'}); h.advance(10000); assert.equal(h.track.scrollLeft,100);
  h.rail.emit('pointerleave'); h.advance(4600); assert.equal(h.track.scrollLeft,200);
  h.visible(false); h.advance(10000); assert.equal(h.track.scrollLeft,200);
  h.visible(true); h.doc.hidden=true; h.doc.emit('visibilitychange'); h.advance(10000); assert.equal(h.track.scrollLeft,200);
  h.doc.hidden=false; h.doc.emit('visibilitychange'); h.advance(4600); assert.equal(h.track.scrollLeft,300);
});

test('Keyboard, rewind, reduced motion, small lists and resize remain safe', async () => {
  const h=await harness({reduced:true}); h.visible(true); h.advance(10000); assert.equal(h.track.scrollLeft,0);
  h.prev.emit('click'); assert.equal(h.track.scrollLeft,1000);
  h.next.emit('click'); assert.equal(h.track.scrollLeft,0);
  h.rail.emit('keydown',{key:'End',preventDefault(){}}); assert.equal(h.track.scrollLeft,1000);
  h.rail.emit('keydown',{key:'Home',preventDefault(){}}); assert.equal(h.track.scrollLeft,0);
  h.next.emit('click'); assert.equal(h.track.scrollLeft,100);
  h.resize(115); assert.equal(h.track.scrollLeft,125);
  const small=await harness({count:3}); small.visible(true); small.advance(10000);
  assert.equal(small.next.hidden,true); assert.equal(small.prev.hidden,true); assert.equal(small.track.scrollLeft,0);
  const active=await harness(); active.next.emit('click'); active.advance(400); active.resize(115);
  assert.equal(active.track.style.scrollSnapType,undefined);
  active.advance(2000); assert.equal(active.track.scrollLeft,125);
});

test('Focus and user scrolling suspend autoplay and cancel an active transition', async () => {
  const h=await harness(); h.visible(true); h.rail.emit('focusin'); h.advance(10000);
  assert.equal(h.track.scrollLeft,0);
  h.rail.emit('focusout',{relatedTarget:null}); h.advance(4600);
  assert.equal(h.track.scrollLeft,100);
  h.next.emit('click'); h.advance(400); h.track.emit('wheel');
  const interrupted=h.track.scrollLeft;
  assert.equal(h.track.style.scrollSnapType,undefined);
  h.advance(3000); assert.equal(h.track.scrollLeft,interrupted);
  h.advance(1800); assert.equal(h.track.scrollLeft,300);
});
