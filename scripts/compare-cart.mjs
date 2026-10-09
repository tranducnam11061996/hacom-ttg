import fs from 'node:fs/promises';
import sharp from 'sharp';
const temp='C:/Users/ADMIN/AppData/Local/Temp/';
const measurements=[], pixels=[];
await fs.mkdir('docs/screenshots',{recursive:true});
for(const width of [1280,1440,1620,1920]) {
  const source=JSON.parse(await fs.readFile(temp+`cart-source-${width}.json`));
  const local=JSON.parse(await fs.readFile(temp+`cart-local-${width}.json`));
  const rows=local.blocks.slice(0,8).map((l,i)=>({source:source.blocks[i].sel,local:l.sel,
    delta:Object.fromEntries(['x','y','w','h'].map(k=>[k,Number((l[k]-source.blocks[i][k]).toFixed(3))]))}));
  measurements.push({width,source,local,rows});
  for(const kind of ['source','local']) await fs.copyFile(temp+`cart-${kind}-${width}.png`,`docs/screenshots/cart-${kind}-${width}.png`);
  const sm=await sharp(temp+`cart-source-${width}.png`).metadata();
  const lm=await sharp(temp+`cart-local-${width}.png`).metadata();
  const regions={items:source.blocks[2],form:source.blocks[3],whole:{x:0,y:0,w:Math.min(sm.width,lm.width),h:Math.min(sm.height,lm.height)}};
  for(const [region,r] of Object.entries(regions)) {
    const crop={left:Math.round(r.x),top:Math.round(r.y),width:Math.round(r.w),height:Math.round(r.h)};
    const a=await sharp(temp+`cart-source-${width}.png`).extract(crop).ensureAlpha().raw().toBuffer();
    const b=await sharp(temp+`cart-local-${width}.png`).extract(crop).ensureAlpha().raw().toBuffer();
    const diff=Buffer.alloc(a.length);let changed=0,error=0;
    for(let i=0;i<a.length;i+=4) {let max=0;for(let c=0;c<3;c++){const d=Math.abs(a[i+c]-b[i+c]);max=Math.max(max,d);error+=d;diff[i+c]=d;}diff[i+3]=255;if(max>25)changed++;}
    await sharp(diff,{raw:{width:crop.width,height:crop.height,channels:4}}).png().toFile(`docs/screenshots/cart-diff-${width}-${region}.png`);
    pixels.push({width,region,crop,changedPixelPercent:Number((100*changed/(a.length/4)).toFixed(3)),meanChannelError:Number((error/(a.length/4*3)).toFixed(3))});
  }
}
await fs.writeFile('docs/cart-measurements.json',JSON.stringify(measurements,null,2)+'\n');
await fs.writeFile('docs/cart-pixel-comparison.json',JSON.stringify(pixels,null,2)+'\n');
console.log(JSON.stringify(measurements.map(m=>({width:m.width,rows:m.rows})),null,2));
console.log(JSON.stringify(pixels,null,2));
