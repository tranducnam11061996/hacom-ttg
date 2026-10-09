// Analyze screenshots captured by Chrome DevTools MCP; no browser connection.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const results=[];
const measurements=[];
for(const viewport of [1280,1440,1620,1920]) {
  const source=JSON.parse(await fs.readFile(`docs/screenshots/pd-source-${viewport}-measurements.json`,'utf8'));
  const local=JSON.parse(await fs.readFile(`docs/screenshots/pd-local-${viewport}-measurements.json`,'utf8'));
  const deltas=source.sections.map((s,i)=>({source:s.selector,local:local.sections[i].selector,
    delta:Object.fromEntries(['x','y','w','h'].map(k=>[k,+(local.sections[i][k]-s[k]).toFixed(4)]))}));
  measurements.push({viewport,source,local,deltas,maxAbsoluteDelta:Math.max(...deltas.flatMap(d=>Object.values(d.delta).map(Math.abs)))});
  for(const section of ['top','information','similar']) {
    const prefix=`docs/screenshots/pd-`;
    const a=await sharp(`${prefix}source-${viewport}-${section}.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const b=await sharp(`${prefix}local-${viewport}-${section}.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
    if(a.info.width!==b.info.width||a.info.height!==b.info.height)throw Error('Screenshot dimensions differ');
    const {width:w,height:h,channels:c}=a.info;
    const diff=Buffer.alloc(w*h*3),overlay=Buffer.alloc(w*h*3);
    const box=source.sections[0];
    const left=Math.ceil(box.x),right=Math.floor(box.x+box.w);
    const top=section==='top'?Math.ceil(box.y):100;
    // Compare product content only; header and floating contact animations are outside this rectangle.
    const bottom=section==='information'?Math.floor(100+source.sections[12].h):section==='similar'?Math.floor(100+source.sections.at(-1).h):h;
    let changed=0,count=0,sum=0;
    for(let p=0;p<w*h;p++) {
      let max=0;const x=p%w,y=Math.floor(p/w);
      for(let k=0;k<3;k++) {
        const error=Math.abs(a.data[p*c+k]-b.data[p*c+k]);max=Math.max(max,error);
        diff[p*3+k]=0;overlay[p*3+k]=Math.round((a.data[p*c+k]+b.data[p*c+k])/2);
      }
      diff[p*3]=max;diff[p*3+1]=max;diff[p*3+2]=max;
      if(x>=left&&x<right&&y>=top&&y<bottom){count++;sum+=max;if(max>30)changed++;}
    }
    await sharp(diff,{raw:{width:w,height:h,channels:3}}).png().toFile(`${prefix}diff-${viewport}-${section}.png`);
    await sharp(overlay,{raw:{width:w,height:h,channels:3}}).jpeg({quality:85}).toFile(`${prefix}overlay-${viewport}-${section}.jpg`);
    results.push({viewport,section,comparisonRect:{left,top,width:right-left,height:bottom-top},changedPixelsAbove30:changed,
      changedPercent:+(changed/count*100).toFixed(3),meanMaxChannelError:+(sum/count).toFixed(3)});
  }
}
await fs.writeFile('docs/product-detail-measurements.json',JSON.stringify(measurements,null,2)+'\n');
await fs.writeFile('docs/product-detail-pixel-comparison.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({geometry:measurements.map(m=>({viewport:m.viewport,maxAbsoluteDelta:m.maxAbsoluteDelta})),pixels:results},null,2));
