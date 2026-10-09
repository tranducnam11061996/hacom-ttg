import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { cartContent } from '../scripts/templates/pages/cart/index.mjs';
import { storeLayout } from '../scripts/templates/layouts/store.mjs';
const read = async n => JSON.parse(await fs.readFile('data/'+n+'.snapshot.json','utf8'));
const [cartData,storeData,headerData,contactData] = await Promise.all(['cart','store','header','product-detail'].map(read));
test('Cart keeps the three source items, totals, shared layout and demo boundaries',async()=>{
  const $ = load(await fs.readFile('cart/index.html','utf8'));
  assert.equal($('.cart-item').length,3);
  assert.deepEqual($('.cart-product-name').toArray().map(e=>$(e).text()),cartData.items.map(i=>i.name));
  assert.equal(cartData.items.reduce((n,i)=>n+i.price*i.quantity,0),134940000);
  assert.equal($('.cart-final-price').text(),'134.940.000 VNĐ');
  assert.equal($('.cart-quantity input[readonly][value="1"]').length,3);
  assert.equal($('#cart-province option').length,64);
  assert.equal($('#cart-district option').length,1);
  for(const selector of ['[data-header]','.ttg-footer','.service-section','.commitment-section','main','#demo-status','.floating-contact']) assert.equal($(selector).length,1,selector);
  assert.equal($('.ttg-cart').attr('href'),'../cart/index.html');
  assert.equal($('.ttg-cart-badge').text(),'3');
  assert.equal($('.cart-product-name').last().attr('href'),'../'+contactData.slug+'/index.html');
  assert.equal($('.cart-product-name[href="#"]').length,2);
  assert.equal($('form[data-demo-form][novalidate]').length,1);
  assert.equal($('form[action*="send-cart"],input[type=hidden],[onclick],script[src^="https"],iframe').length,0);
  $('.cart-screen button,.floating-contact button').not('[data-commitment-toggle]').each((_,e)=>assert.ok($(e).is('[data-demo][type=button],button[type=submit]')));
  $('[id]').each((_,e)=>assert.equal($('#'+$(e).attr('id')).length,1));
  $('label[for]').each((_,e)=>assert.equal($('#'+$(e).attr('for')).length,1));
});
test('Cart component references resolve at nested static hosting depths',async()=>{
  for(const depth of [0,1,2]) {
    const context={depth};
    const html=storeLayout({title:'Cart fixture',content:cartContent({cartData,storeData,contactData,context}),storeData,headerData,context,cartCount:3});
    const $=load(html);
    for(const e of $('[src],[href]').toArray()) {
      const value=$(e).attr('src') || $(e).attr('href');
      if(!value || /^(#|https?:|mailto:|tel:)/.test(value)) continue;
      const resolved=path.posix.normalize(path.posix.join(Array(depth).fill('fixture').join('/'),value));
      assert.ok(!resolved.startsWith('../'),resolved);await fs.access(resolved);
    }
    assert.equal($('.ttg-cart').attr('href'),'../'.repeat(depth)+'cart/index.html');
  }
});
