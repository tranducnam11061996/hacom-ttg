import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { runInitializer } from './helpers/runtime.mjs';

async function harness(width=1279, hover=true) {
  class Element {
    handlers=new Map(); attrs={}; dataset={}; hidden=false; parent=null;
    classes=new Set(); style={values:{},setProperty(n,v){this.values[n]=v;},removeProperty(n){delete this.values[n];}};
    classList={contains:n=>this.classes.has(n),add:n=>this.classes.add(n),remove:n=>this.classes.delete(n),toggle:(n,v)=>v===undefined?(this.classes.has(n)?this.classes.delete(n):this.classes.add(n)):(v?this.classes.add(n):this.classes.delete(n))};
    addEventListener(n,fn){const list=this.handlers.get(n)||[];list.push(fn);this.handlers.set(n,list);}
    emit(n,e={}){for(const fn of this.handlers.get(n)||[])fn({target:this,...e});}
    setAttribute(n,v){this.attrs[n]=v;} getAttribute(n){return this.attrs[n];}
    contains(node){for(let p=node;p;p=p.parent)if(p===this)return true;return false;}
    getBoundingClientRect(){return {top:100,bottom:140,width:1220,height:178};}
    focus(){doc.activeElement=this;this.emit('focus');root.emit('focusin',{target:this});}
    closest(){return this.item||null;}
  }
  const doc=new Element(),win=new Element(),header=new Element(),root=new Element(),toggle=new Element(),content=new Element(),space=new Element();
  const desktop=new Element(),hoverInput=new Element();desktop.matches=width>=1280;hoverInput.matches=hover;
  content.hidden=true;toggle.parent=root;content.parent=root;root.parent=header;
  const indices=[0,1,4,6,7,8,14],panels=indices.map(i=>{const p=new Element();p.dataset.megaPanel=String(i);p.hidden=true;return p;});
  const items=Array.from({length:16},(_,i)=>{
    const item=new Element(),link=new Element(),accordion=indices.includes(i)?new Element():null;
    item.dataset.menuItem=String(i);item.parent=content;link.parent=item;link.item=item;
    item.link=link;item.accordion=accordion;if(accordion)accordion.parent=item;
    item.querySelector=s=>s==='a'?link:s.includes('accordion')?accordion:s.includes('aria-expanded')&&accordion?link:null;
    return item;
  });
  const group=new Element(),children=new Element();group.attrs['aria-controls']='group';group.attrs['aria-expanded']='true';
  root.querySelector=s=>({'[data-menu-toggle]':toggle,'[data-menu-content]':content})[s];
  root.querySelectorAll=s=>s==='[data-menu-item]'?items:s==='[data-mega-panel]'?panels:s==='[data-group-toggle]'?[group]:[];
  header.querySelector=s=>s==='[data-menu-root]'?root:header;
  header.querySelectorAll=()=>[];
  doc.querySelector=s=>s==='[data-header]'?header:s==='[data-header-space]'?space:null;
  doc.getElementById=()=>children;doc.hidden=false;win.innerHeight=900;win.scrollY=0;
  await runInitializer("header", "initHeader",{document:doc,window:win,matchMedia:query=>query.includes('min-width')?desktop:hoverInput,ResizeObserver:class{observe(){}}});
  const pointer=(target,type='mouse',x=10)=>target.emit('pointerenter',{pointerType:type,clientX:x,clientY:10});
  const click=(type='mouse',detail=1)=>toggle.emit('click',{pointerType:type,detail});
  return {doc,win,header,root,toggle,content,items,panels,desktop,hoverInput,group,children,pointer,click};
}

test('Mouse hover opens at 1279 and 1280px without selecting a default panel',async()=>{
  for(const width of [768,1279,1280,1920]){
    const h=await harness(width);h.pointer(h.root);assert.equal(h.content.hidden,false);assert.equal(h.toggle.attrs['aria-expanded'],'true');
    assert.ok(h.panels.every(p=>p.hidden));
    for(const i of [0,1,4,6,7,8,14]){h.pointer(h.items[i]);assert.deepEqual(h.panels.filter(p=>!p.hidden).map(p=>p.dataset.megaPanel),[String(i)]);assert.equal(h.items[i].accordion.attrs['aria-expanded'],'true');}
    h.pointer(h.items[3]);assert.ok(h.panels.every(p=>p.hidden));
    h.root.emit('pointerleave',{pointerType:'mouse'});assert.equal(h.content.hidden,true);
    h.pointer(h.root,'pen');h.pointer(h.items[0],'pen');assert.equal(h.panels[0].hidden,false);
  }
});

test('Touch and hybrid input never open on hover and clicks toggle without focus reopening',async()=>{
  for(const hover of [false,true])for(const width of [390,1280]){
    const h=await harness(width,hover);h.pointer(h.root,'touch');assert.equal(h.content.hidden,true);
    h.root.emit('pointerdown',{pointerType:'touch'});h.toggle.focus();assert.equal(h.content.hidden,true);
    h.click('touch');assert.equal(h.content.hidden,false);h.click('touch');assert.equal(h.content.hidden,true);
    h.pointer(h.root,'mouse');assert.equal(h.content.hidden,!hover);
  }
});

test('Keyboard, Escape, outside click and focus retention keep menu states consistent',async()=>{
  for(const width of [1279,1280]){
    const h=await harness(width);h.toggle.focus();assert.equal(h.content.hidden,width<1280);
    if(h.content.hidden)h.click('',0);
    h.items[6].link.focus();assert.equal(h.panels.find(p=>p.dataset.megaPanel==='6').hidden,false);
    h.root.emit('pointerleave',{pointerType:'mouse'});assert.equal(h.content.hidden,false);
    h.doc.emit('keydown',{key:'Escape',preventDefault(){}});assert.equal(h.content.hidden,true);assert.equal(h.doc.activeElement,h.toggle);assert.ok(h.panels.every(p=>p.hidden));
    h.click('',0);assert.equal(h.content.hidden,false);h.click('',0);assert.equal(h.content.hidden,true);
    h.pointer(h.root);h.doc.emit('click',{target:new Object()});assert.equal(h.content.hidden,true);
    h.pointer(h.root);h.root.emit('focusout',{relatedTarget:null});assert.equal(h.content.hidden,true);
  }
});

test('Selecting categories preserves group expansion and capability/resize/compact changes reset menu',async()=>{
  const h=await harness();h.pointer(h.root);h.pointer(h.items[6]);h.group.emit('click');assert.equal(h.children.hidden,true);
  h.pointer(h.items[0]);h.pointer(h.items[6]);assert.equal(h.group.attrs['aria-expanded'],'false');assert.equal(h.children.hidden,true);
  for(const reset of [()=>h.hoverInput.emit('change'),()=>h.win.emit('resize'),()=>{h.win.scrollY=600;h.win.emit('scroll');},()=>{h.win.scrollY=0;h.win.emit('scroll');},()=>h.desktop.emit('change')]){
    h.pointer(h.root);h.pointer(h.items[6]);reset();assert.equal(h.content.hidden,true);assert.ok(h.panels.every(p=>p.hidden));assert.ok(h.items.every(i=>!i.classes.has('is-active')));
  }
  assert.equal(h.root.handlers.get('pointerenter').length,1);
});

test('Viewport height applies only to accordion and is cleared when entering desktop',async()=>{
  const h=await harness(1279);h.pointer(h.root);
  assert.equal(h.root.style.values['--menu-height'],'788px');
  h.desktop.matches=true;h.desktop.emit('change');h.win.emit('resize');
  assert.equal(h.root.style.values['--menu-height'],undefined);assert.equal(h.content.hidden,true);
  h.pointer(h.root);assert.equal(h.root.style.values['--menu-height'],undefined);
  h.desktop.matches=false;h.desktop.emit('change');h.win.innerHeight=600;h.win.emit('resize');h.pointer(h.root);
  assert.equal(h.root.style.values['--menu-height'],'488px');assert.equal(h.content.hidden,false);
});
