import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
test('Header uses the exact local sprite and decorative accessible icons', async()=>{
 const $=load(await fs.readFile('index.html','utf8'));
 const icons=$('.ttg-header .ttg-header-icon');
 assert.equal(icons.length,7);
 icons.each((_,e)=>assert.equal($(e).attr('aria-hidden'),'true'));
 const png=await fs.readFile('image/icons/ttgshop-icons-map-2.png');
 assert.equal(png.readUInt32BE(16),452);assert.equal(png.readUInt32BE(20),406);
 assert.match(await fs.readFile('index.html','utf8'), /viewBox="0 0 640 640"/);
 assert.equal($('.ttg-menu-label').text(),'DANH MỤC SẢN PHẨM');
 assert.equal($('.ttg-shortcuts img').length,6);
});

