import fs from 'node:fs/promises';
import { storeLayout } from './templates/layouts/store.mjs';
import { categoryContent } from './templates/pages/category/index.mjs';
const read=async name=>JSON.parse(await fs.readFile(`data/${name}.snapshot.json`,'utf8'));
const [categoryData,storeData,headerData]=await Promise.all([read('category-pc'),read('store'),read('header')]);
const context={depth:1};
await fs.mkdir('pc',{recursive:true});
await fs.writeFile('pc/index.html',storeLayout({title:'PC GAMING — TTG SHOP Demo',description:'Danh mục PC GAMING — giao diện demo.',content:categoryContent({categoryData,storeData,context}),storeData,headerData,context,mainClass:'listing-screen',pageScript:'category'}));
console.log('Category: '+categoryData.products.length+' products');
