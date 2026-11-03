#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const draw=require('./draw.cjs');
const runtime=require('./runtime.cjs');
const {preview,outputPath}=require('./build.cjs');
async function main() {
  const opts=runtime.options(process.argv.slice(2));
  if(opts.help){console.log('node compare.cjs variants.json --out output/comparison [--formats svg,html,png] [--renderer auto|browser|sharp]');return;}
  if(!opts.input||!opts.out)throw Error('Provide a comparison manifest and --out directory');
  const manifestPath=path.resolve(opts.input),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8')),base=path.dirname(manifestPath),out=outputPath(opts.out);
  if(!Array.isArray(manifest.items)||manifest.items.length<1||manifest.items.length>8)throw Error('Provide 1-8 actual SVG files to compare');
  const items=manifest.items.map((item,i)=>{
    const file=path.resolve(base,item.file),svg=fs.readFileSync(file,'utf8');
    draw.assertStatic(svg,{allowCjk:!!manifest.allowCjk});
    const view=svg.match(/\bviewBox=["']\s*([-\d.]+)[ ,]+([-\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)\s*["']/i);
    if(!view||Number(view[3])<=0||Number(view[4])<=0)throw Error(`Missing or invalid viewBox: ${item.file}`);
    return {label:item.label||`Version ${i+1}`,description:item.description||'',file:item.file,svg,ratio:Number(view[3])/Number(view[4]),sha256:createHash('sha256').update(svg).digest('hex')};
  });
  if(items.some(x=>Math.abs(x.ratio-items[0].ratio)>1e-5))throw Error('Use equal aspect ratios for a fair comparison');
  const imageWidth=1680,imageHeight=imageWidth/items[0].ratio,cardHeight=imageHeight+56;
  const scene={id:'comparison',title:manifest.title||'README banner comparison',description:'Saved versions displayed at equal size.',width:1728,height:104+items.length*(cardHeight+20)-20,allowCjk:!!manifest.allowCjk,textMode:'native',labels:[]};
  scene.background=draw.paper({width:scene.width,height:scene.height,color:'#EEEEE9',dots:false});
  scene.labels.push({text:scene.title,x:26,y:14,w:1660,h:48,size:28,font:'Arial, sans-serif',bold:true});
  scene.art=items.map((item,i)=>{
    const y=80+i*(cardHeight+20);
    scene.labels.push({text:item.label,x:44,y:y+7,w:400,h:40,size:25,font:'Arial, sans-serif',bold:true});
    if(item.description)scene.labels.push({text:item.description,x:465,y:y+7,w:1215,h:40,size:20,font:'Arial, sans-serif',color:'#74776C'});
    return `<rect x="24" y="${draw.n(y)}" width="1680" height="${draw.n(cardHeight)}" rx="8" fill="#fff"/>`
      +`<image x="24" y="${draw.n(y+56)}" width="1680" height="${draw.n(imageHeight)}" href="data:image/svg+xml;base64,${Buffer.from(item.svg).toString('base64')}"/>`;
  }).join('');
  const svg=draw.svg(scene),report={schema:'fly-readme.comparison/v1',renderer:null,warnings:[],inputs:items.map(({label,file,sha256})=>({label,file,sha256}))};
  if(opts.formats.includes('svg'))fs.writeFileSync(path.join(out,'comparison.svg'),svg);
  if(opts.formats.includes('html'))fs.writeFileSync(path.join(out,'comparison.html'),preview(items,scene.title));
  if(opts.formats.includes('png')){
    const painter=await runtime.renderer(opts.renderer,report);
    try{report.render=await painter.render(svg,scene,path.join(out,'comparison.png'),{thumbnails:false});}finally{await painter.close();}
  }
  fs.writeFileSync(path.join(out,'comparison-report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({ok:true,out,versions:items.length,renderer:report.renderer,warnings:report.warnings},null,2));
}
main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
