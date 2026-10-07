import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
test('Sale keeps six local collections, all fields, demo links and title',async()=>{
 const d=JSON.parse(await fs.readFile('data/store.snapshot.json','utf8'));
 const $=load(await fs.readFile('index.html','utf8'));const sale=$('[data-sale]');
 assert.equal(sale.find('[data-product]').length,84);assert.equal($('[data-product]').length,171);
 assert.equal(sale.find('[role=tab]').length,6);assert.ok(sale.find('[role=tablist]').is('[hidden]'));
 assert.equal(sale.find('[role=tabpanel]:not([hidden])').attr('id'),'collection-4');
 assert.equal(sale.find('.sale-title').attr('src'),d.assets['./include/ttgshop-collection-title-1.png'].path);
 d.collections.forEach(c=>{const cards=sale.find('#collection-'+c.id+' [data-product]');assert.equal(cards.length,c.products.length);
 cards.each((i,e)=>{const card=$(e),p=c.products[i];for(const [selector,field] of [['h3','name'],['.category-price','price'],['del','market'],['.category-stock','status'],['.category-discount','discount']])assert.equal(card.find(selector).text(),p[field]||'');assert.equal(card.find('img').first().attr('src'),d.assets[p.image].path);assert.equal(card.find('[data-demo]').text().trim(),p.buy);});});
 sale.find('a').each((_,e)=>assert.equal($(e).attr('href'),'#'));assert.equal(sale.find('[data-rail]').length,0);
});
