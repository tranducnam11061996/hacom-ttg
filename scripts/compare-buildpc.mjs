import fs from 'node:fs/promises';
import sharp from 'sharp';
const directory='docs/screenshots/';
const measurements=JSON.parse(await fs.readFile('docs/buildpc-measurements.json','utf8'));
const comparisons=[];
for(const width of [1280,1440,1620,1920]) {
 const rect=measurements.find(x=>x.width===width&&x.label==='source').panel;
 const regions={whole:null,configuration:{left:Math.ceil(rect.x),top:Math.ceil(rect.y),width:Math.floor(rect.width)-1,height:Math.floor(rect.height)-1},popup:null};
 for(const [region,crop] of Object.entries(regions)) {
  const suffix=region==='popup'?'popup-':'';
  const files=['source','local'].map(label=>directory+`buildpc-${label}-${suffix}${width}.png`);
  const sizes=await Promise.all(files.map(file=>sharp(file).metadata()));
  const w=Math.max(...sizes.map(s=>s.width)),h=Math.max(...sizes.map(s=>s.height));
  const buffers=await Promise.all(files.map((file,i)=>{let p=sharp(file).flatten({background:'#fff'}).removeAlpha();if(crop)p=p.extract(crop);else p=p.extend({right:w-sizes[i].width,bottom:h-sizes[i].height,background:'#fff'});return p.raw().toBuffer({resolveWithObject:true});}));
  const a=buffers[0],b=buffers[1],diff=Buffer.alloc(a.data.length);let changed=0,sum=0;
  for(let i=0;i<a.data.length;i+=3){let max=0;for(let c=0;c<3;c++){const delta=Math.abs(a.data[i+c]-b.data[i+c]);sum+=delta;max=Math.max(max,delta);diff[i+c]=delta;}if(max>24)changed++;}
  const pixels=a.info.width*a.info.height;
  const output=`buildpc-diff-${width}-${region}.png`;
  await sharp(diff,{raw:{width:a.info.width,height:a.info.height,channels:3}}).png().toFile(directory+output);
  comparisons.push({width,region,sourceSize:[sizes[0].width,sizes[0].height],localSize:[sizes[1].width,sizes[1].height],meanAbsoluteChannelDifference:Number((sum/(pixels*3)).toFixed(3)),pixelsOver24Percent:Number((changed/pixels*100).toFixed(3)),diff:output});
  if(crop){for(let i=0;i<2;i++)await sharp(files[i]).extract(crop).png().toFile(directory+`buildpc-${i?'local':'source'}-configuration-${width}.png`);}
 }
}
await fs.writeFile('docs/buildpc-pixel-comparison.json',JSON.stringify({threshold:24,note:'Pixel differences are not a similarity score; captures include demo badge, icon, image compression and shared footer differences.',comparisons},null,2)+'\n');
console.table(comparisons.map(({width,region,meanAbsoluteChannelDifference,pixelsOver24Percent})=>({width,region,meanAbsoluteChannelDifference,pixelsOver24Percent})));
