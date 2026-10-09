import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import {buildpcContent} from '../scripts/templates/pages/buildpc/index.mjs';
import {buildComponentGroup} from '../scripts/templates/components/buildpc/configuration.mjs';
import {loadRuntime} from './helpers/runtime.mjs';
const read=async n=>JSON.parse(await fs.readFile('data/'+n+'.snapshot.json','utf8'));
const [buildData,storeData,contactData]=await Promise.all(['buildpc','store','product-detail'].map(read));
test('Build PC fixture preserves categories, optional warranty, stock and total without business endpoints',async()=>{
 const $=load(await fs.readFile('buildpc/index.html','utf8'));
 assert.equal($('[data-build-group]').length,9);assert.equal($('[data-build-item]').length,9);
 assert.deepEqual($('[data-build-total]').toArray().map(e=>$(e).text()),['46.660.000 đ','46.660.000 đ']);
 assert.equal($('[data-build-item="1045512385"] .bp-empty').text(),'Hết hàng');
 assert.equal($('[data-build-item="1045512385"] .bp-warranty').length,0);
 assert.equal($('[data-build-item="1068922111"] .bp-warranty').length,0);
 assert.ok($('.bp-quantity input').toArray().every(e=>$(e).attr('readonly')!==undefined&&$(e).attr('value')==='1'));
 assert.equal($('[data-picker-group]').length,9);assert.equal($('[data-picker-product]').length,180);
 for(const group of buildData.groups){const panel=$(`[data-picker-group="${group.id}"]`);assert.equal(panel.find('[data-picker-product]').first().attr('data-picker-product'),group.picker.products[0].id);assert.equal(panel.find('.bp-filter-scroll section').length,group.picker.filters.length);}
 assert.equal($('.ttg-build').attr('href'),'../buildpc/index.html');assert.ok($('.ttg-cart-badge').attr('hidden')!==undefined);
 assert.equal($('form[action], [onclick], [onchange], a[download]').length,0);
 assert.equal($('.bp-actions button[data-demo]').length,4);
 assert.equal($('.bp-picker-price').filter((_,e)=>$(e).text()==='Liên hệ').length,9);
 assert.equal($('dialog').attr('aria-labelledby'),'bp-picker-title');
});
test('Picker restores scrolling synchronously and ignores delayed close events after reopening',async()=>{
 const handlers={},documentHandlers={},button={dataset:{pickerOpen:'cpu'},focus(){document.activeElement=this;}};
 const toggle={setAttribute(){}},closeButton={addEventListener(type,fn){handlers.buttonClose=fn;}},search={focus(){document.activeElement=this;}};
 const panel={dataset:{pickerGroup:'cpu'},reset(){},querySelector(){return {scrollTop:0};}};
 const dialog={open:false,classList:{remove(){}},addEventListener(type,fn){handlers[type]=fn;},showModal(){this.open=true;},close(){this.open=false;},querySelectorAll(){return [panel];},querySelector(s){if(s==='.bp-filter-toggle')return {...toggle,addEventListener(){}};if(s==='[data-picker-close]')return closeButton;if(s==='.bp-search')return {reset(){}};if(s==='input[type="search"]')return search;return {hidden:true};}};
 const document={body:{style:{overflow:'auto'}},querySelector:()=>dialog,addEventListener(type,fn){documentHandlers[type]=fn;}};
 const {initComponentPicker}=await loadRuntime('component-picker',{document});initComponentPicker(document);
 const open=()=>documentHandlers.click({target:{closest:()=>button}});
 for(let i=0;i<30;i++){open();assert.equal(document.body.style.overflow,'hidden');handlers.buttonClose();assert.equal(document.body.style.overflow,'auto');}
 open();handlers.close();assert.equal(document.body.style.overflow,'hidden');
 let prevented=false;handlers.cancel({preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(dialog.open,false);assert.equal(document.body.style.overflow,'auto');assert.equal(document.activeElement,button);
});
test('Build PC reusable components support empty groups and nested static paths',async()=>{
 const empty=load(buildComponentGroup({...buildData.groups[0],items:[]},{assets:buildData.assets}));
 assert.equal(empty('[data-build-item]').length,0);assert.equal(empty('[data-picker-open]').text(),'+ Chọn CPU');
 for(const depth of [0,1,2]){const $=load(buildpcContent({buildData,storeData,contactData,context:{depth}}));for(const e of $('[src],[href]').toArray()){const url=$(e).attr('src')||$(e).attr('href');if(url==='#')continue;const resolved=path.posix.normalize(path.posix.join(Array(depth).fill('fixture').join('/'),url));assert.ok(!resolved.startsWith('../'));await fs.access(resolved);}}
});
