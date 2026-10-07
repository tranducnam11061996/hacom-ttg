import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { runInitializer } from './helpers/runtime.mjs';
import {load} from 'cheerio';
test('Service and commitment output preserve local copy and demo links',async()=>{
 const d=JSON.parse(await fs.readFile('data/store.snapshot.json','utf8'));
 const $=load(await fs.readFile('index.html','utf8'));
 assert.deepEqual($('.service-list h3').toArray().map(e=>$(e).text()),d.features.map(f=>f.title));
 assert.deepEqual($('.service-list p').toArray().map(e=>$(e).text()),d.features.map(f=>f.text));
 assert.deepEqual($('[data-commitment-toggle]>span:first-child').toArray().map(e=>$(e).text()),d.questions.map(q=>q.title));
 $('[data-commitment]').each((i,e)=>{
  const b=$(e).find('button'),p=$(e).find('[data-commitment-panel]');
  assert.equal(b.attr('aria-controls'),p.attr('id'));assert.equal(b.attr('aria-expanded'),'false');
  assert.ok(p.is('[hidden][inert]'));
  const clean=load(d.questions[i].html,null,false);clean('script,style,i,svg').remove();
  assert.equal(p.text().replace(/\s+/g,' ').trim(),clean.text().replace(/\s+/g,' ').trim());
 });
 $('.commitment-content a').each((_,e)=>assert.equal($(e).attr('href'),'#'));
 assert.equal($('[data-product]').length,171);
});
test('Commitment animation can reverse, resize and reduce motion independently',async()=>{
 let now=0,id=0;const frames=new Map(),resize=[];
 const changes=[];const motion={matches:false,addEventListener(n,f){changes.push(f);}};
 const items=Array.from({length:2},()=>{
  const style={height:'',removeProperty(k){this[k]='';}};
  const panel={hidden:true,inert:true,style,firstElementChild:{getBoundingClientRect:()=>({height:120})},getBoundingClientRect:()=>({height:parseFloat(style.height)||120}),contains:()=>false};
  const button={aria:'false',setAttribute(k,v){this.aria=v;},addEventListener(n,f){this.click=f;}};
  return {panel,button,querySelector:s=>s.includes('toggle')?button:panel};
 });
 await runInitializer("commitment", "initCommitment",{document:{querySelectorAll:()=>items},matchMedia:()=>motion,window:{addEventListener:(n,f)=>resize.push(f)},performance:{now:()=>now},requestAnimationFrame:f=>{frames.set(++id,f);return id;},cancelAnimationFrame:i=>frames.delete(i)});
 const tick=t=>{now+=t;const jobs=[...frames.values()];frames.clear();jobs.forEach(f=>f(now));};
 items[0].button.click();tick(200);assert.ok(Math.abs(parseFloat(items[0].panel.style.height)-60)<0.001);
 items[0].button.click();assert.equal(items[0].panel.inert,true);tick(400);assert.equal(items[0].panel.hidden,true);
 items.forEach(i=>i.button.click());tick(100);resize.forEach(f=>f());tick(400);
 items.forEach(i=>{assert.equal(i.panel.hidden,false);assert.equal(i.panel.style.height,'');assert.equal(i.button.aria,'true');});
 motion.matches=true;items[0].button.click();assert.equal(items[0].panel.hidden,true);assert.equal(items[1].panel.hidden,false);
 motion.matches=false;items[0].button.click();tick(100);motion.matches=true;changes.forEach(f=>f());assert.equal(items[0].panel.style.height,'');assert.equal(frames.size,0);
});
