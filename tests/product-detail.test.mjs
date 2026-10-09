import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { load } from 'cheerio';
import { productDetailContent } from '../scripts/templates/pages/product/index.mjs';
import { similarProducts } from '../scripts/templates/components/similar-products.mjs';
import { productHref, productDetailSlug } from '../scripts/templates/utils/paths.mjs';
const read = async name => JSON.parse(await fs.readFile('data/' + name + '.snapshot.json', 'utf8'));
const [data, store] = await Promise.all([read('product-detail'), read('store')]);

test('Product snapshot preserves settled source content and original local assets', async () => {
  for (const [field, count] of [['gallery',7],['comboGroups',4],['summary',8],['specificationRows',8],['similarProducts',15],['upgradeGroups',3]]) assert.equal(data[field].length,count,field);
  assert.equal(data.price,'52.480.000 đ');
  assert.equal(data.market,'55.990.000 đ');
  assert.ok(data.similarProducts.every(p=>p.name&&p.price&&data.assets[p.image]));
  assert.equal(data.similarProducts.at(-1).sourceUrl,'/'+productDetailSlug);
  assert.ok(data.summary[1].includes('B860M'));
  assert.ok(data.fragments.description.includes('Z890M'));
  for (const asset of Object.values(data.assets)) {
    const bytes=await fs.readFile(asset.path);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.hash,asset.path);
    assert.ok(asset.width>0&&asset.height>0);
  }
});

test('Product output has one shared shell, complete content, local references and inert new actions', async () => {
  const html=await fs.readFile(productDetailSlug+'/index.html','utf8'), $=load(html);
  for(const s of ['main#main','h1','[data-header]','.ttg-footer','.service-section','.commitment-section']) assert.equal($(s).length,1,s);
  assert.equal($('.pd-thumbnail').length,7);
  assert.equal($('.pd-combo-card').length,4);
  assert.equal($('.pd-similar [data-product]').length,15);
  assert.equal($('.pd-specification tr').length,9);
  assert.equal($('.pd-upgrade [aria-pressed=true]').length,3);
  assert.equal($('.pd-quantity input').attr('value'),'1');
  assert.ok($('.pd-quantity input').is('[readonly]'));
  $('.pd-container button,.pd-contact button').not('[data-commitment-toggle]').each((_,e)=>assert.ok($(e).is('[data-demo][type=button]'),$(e).text()));
  assert.equal($('.pd-container [data-category-carousel]').length,0);
  assert.ok(!/iframe|checkgame|ttg-cg|javascript:|on(?:click|error)=|fancybox|swiper|hura/i.test(html));
  for(const e of $('.pd-container [src],.pd-contact [src]').toArray()) {
    const src=$(e).attr('src');assert.ok(!/^https?:/.test(src));
    await fs.access(path.posix.normalize(path.posix.join(productDetailSlug,src)));
  }
});

test('Product links and reusable rails resolve correctly under nested static hosting', async () => {
  const current={name:data.title,sourceUrl:'/'+productDetailSlug};
  for(const depth of [0,1,2]) {
    assert.equal(productHref(current,{depth}),'../'.repeat(depth)+productDetailSlug+'/index.html');
    assert.equal(productHref({name:'Other PC',sourceUrl:'/other'},{depth}),'#');
    const $=load(productDetailContent({productData:data,storeData:store,context:{depth}}));
    assert.equal($('.pd-breadcrumb>a').first().attr('href'),'../'.repeat(depth)+'index.html');
    assert.equal($('.pd-similar [data-product]').last().find('a').first().attr('href'),productHref(current,{depth}));
  }
  for(const page of ['index.html','pc/index.html']) {
    const $=load(await fs.readFile(page,'utf8'));
    assert.ok($('[data-product] a').toArray().some(e=>$(e).attr('href')===(page.startsWith('pc/')?'../':'')+productDetailSlug+'/index.html'));
  }
  assert.throws(()=>similarProducts({products:[],assets:{}}),/unique id/);
  const markup=['one','two'].map(id=>similarProducts({products:[],assets:{},id,allHref:'#'})).join('');
  const $=load(markup);assert.equal(new Set($('[id]').toArray().map(e=>$(e).attr('id'))).size,2);
});
