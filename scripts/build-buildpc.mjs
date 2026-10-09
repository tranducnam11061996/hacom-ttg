import fs from 'node:fs/promises';
import {storeLayout} from './templates/layouts/store.mjs';
import {buildpcContent} from './templates/pages/buildpc/index.mjs';
const read=async name=>JSON.parse(await fs.readFile('data/'+name+'.snapshot.json','utf8'));
const [buildData,storeData,headerData,contactData]=await Promise.all(['buildpc','store','header','product-detail'].map(read));
const context={depth:1};
await fs.mkdir('buildpc',{recursive:true});
await fs.writeFile('buildpc/index.html',storeLayout({title:'Xây dựng máy tính - tạo máy tính — TTG SHOP Demo',description:'Xây dựng cấu hình PC — giao diện demo.',content:buildpcContent({buildData,storeData,contactData,context}),storeData,headerData,context,mainClass:'buildpc-screen',pageScript:'buildpc'}));
console.log('Build PC: buildpc/index.html');
