import fs from 'node:fs/promises';
import { storeLayout } from './templates/layouts/store.mjs';
import { cartContent } from './templates/pages/cart/index.mjs';
const read = async name => JSON.parse(await fs.readFile('data/'+name+'.snapshot.json','utf8'));
const [cartData,storeData,headerData,contactData] = await Promise.all(['cart','store','header','product-detail'].map(read));
const context = {depth:1};
await fs.mkdir('cart',{recursive:true});
await fs.writeFile('cart/index.html',storeLayout({title:'Thông tin giỏ hàng — TTG SHOP Demo',description:'Giỏ hàng — giao diện demo.',content:cartContent({cartData,storeData,contactData,context}),storeData,headerData,context,cartCount:cartData.items.length,mainClass:'cart-screen'}));
console.log('Cart: cart/index.html');
