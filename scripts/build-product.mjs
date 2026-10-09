import fs from 'node:fs/promises';
import { storeLayout } from './templates/layouts/store.mjs';
import { productDetailContent } from './templates/pages/product/index.mjs';
const read = async name => JSON.parse(await fs.readFile('data/' + name + '.snapshot.json', 'utf8'));
const [productData, storeData, headerData] = await Promise.all([read('product-detail'), read('store'), read('header')]);
const context = { depth: 1 };
await fs.mkdir(productData.slug, { recursive: true });
await fs.writeFile(productData.slug + '/index.html', storeLayout({
  title: productData.title + ' — TTG SHOP Demo', description: 'Chi tiết sản phẩm — giao diện demo.',
  content: productDetailContent({ productData, storeData, context }), storeData, headerData, context,
  mainClass: 'product-detail-screen', pageScript: 'ui',
}));
console.log('Product detail: ' + productData.slug);
