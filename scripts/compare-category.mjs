import fs from 'node:fs/promises';
import sharp from 'sharp';
const results=[];
for(const width of [1280,1440,1620,1920]) {
 const source=`docs/screenshots/category-reference-${width}.jpg`, local=`docs/screenshots/category-local-${width}.jpg`;
 const ref=await sharp(source).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const target=await sharp(local).removeAlpha().raw().toBuffer({resolveWithObject:true});
 if(ref.info.width!==target.info.width||ref.info.height!==target.info.height) throw Error('Screenshot size differs: '+width);
 const {width:w,height:h,channels:c}=ref.info, diff=Buffer.alloc(w*h*3);let changed=0;
 for(let p=0;p<w*h;p++){let max=0;for(let k=0;k<3;k++)max=Math.max(max,Math.abs(ref.data[p*c+k]-target.data[p*c+k]));if(max>30)changed++;diff[p*3]=max;diff[p*3+1]=max;diff[p*3+2]=max;}
 await sharp(diff,{raw:{width:w,height:h,channels:3}}).png().toFile(`docs/screenshots/category-diff-${width}.png`);
 const overlay=Buffer.from(ref.data);for(let i=0;i<overlay.length;i++)overlay[i]=Math.round((ref.data[i]+target.data[i])/2);
 await sharp(overlay,{raw:{width:w,height:h,channels:c}}).jpeg({quality:85}).toFile(`docs/screenshots/category-overlay-${width}.jpg`);
 results.push({width,height:h,changedPixelsAbove30:changed,changedPercent:Number((changed/(w*h)*100).toFixed(3))});
}
await fs.writeFile('docs/category-listing-pixel-comparison.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results));
