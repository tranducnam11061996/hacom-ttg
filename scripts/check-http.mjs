import fs from 'node:fs/promises';
import path from 'node:path';
import { publicFiles as getPublicFiles } from './public.mjs';
import { productDetailSlug } from './templates/utils/paths.mjs';
const publicFiles = await getPublicFiles();
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const mimeTypes = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml' };
const results=[];
for(let i=0;i<publicFiles.length;i+=6){await Promise.all(publicFiles.slice(i,i+6).map(async f=>{const response=await fetch(origin+'/'+f,{headers:{'Accept-Encoding':'gzip'}});const body=Buffer.from(await response.arrayBuffer());const original=await fs.readFile(f);results.push({file:f,status:response.status,mime:response.headers.get('content-type'),bodyBytes:Number(response.headers.get('content-length')),gzip:response.headers.get('content-encoding')==='gzip',matches:body.equals(original)});}));}
const errors=results.filter(r=>r.status!==200||!r.matches||!r.mime?.startsWith(mimeTypes[path.extname(r.file)])||(/\.(html|css|js)$/.test(r.file)&&!r.gzip));
const blocked = [];
for (const alias of ['/buildpc', '/buildpc/', '/buildpc/index.html']) {
 const response = await fetch(origin + alias);
 if (response.status !== 200 || !(await response.text()).includes('buildpc-screen')) errors.push({file:alias,status:response.status,reason:'Build PC alias failed'});
}
for (const alias of ['/cart', '/cart/', '/cart/index.html']) {
 const response = await fetch(origin + alias);
 if (response.status !== 200 || !(await response.text()).includes('cart-screen')) errors.push({file:alias,status:response.status,reason:'Cart alias failed'});
}
for (const alias of ['/pc', '/pc/', '/pc/index.html']) {
 const response = await fetch(origin + alias);
 if (response.status !== 200 || !(await response.text()).includes('listing-screen')) errors.push({file:alias,status:response.status,reason:'Category alias failed'});
}
for (const suffix of ['', '/', '/index.html']) {
 const alias = '/' + productDetailSlug + suffix;
 const response = await fetch(origin + alias);
 if (response.status !== 200 || !(await response.text()).includes('product-detail-screen')) errors.push({file:alias,status:response.status,reason:'Product alias failed'});
}
for (const file of ['README.md', 'data/store.snapshot.json', 'data/product-detail.snapshot.json', 'scripts/build-product.mjs', 'scripts/build-store.mjs', 'tests/menu.test.mjs', '.cache/shared-ui/index.before.html', 'css/header.input.css']) {
 const response = await fetch(origin+'/'+file);
 blocked.push({ file, status: response.status });
 if (response.status !== 404) errors.push({file, status:response.status, reason:'Non-public file exposed'});
}
await fs.writeFile('docs/http-validation.json',JSON.stringify({checkedAt:new Date().toISOString(),origin,files:results.length,errors,blocked,results},null,2)+'\n');console.log(`HTTP: ${results.length} public files checked, ${errors.length} errors`);if(errors.length)process.exitCode=1;
