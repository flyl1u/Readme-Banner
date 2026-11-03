#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const draw=require('./draw.cjs');
const runtime=require('./runtime.cjs');
const lettering=require('./lettering.cjs');
function preview(items,title='README banner preview') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${draw.esc(title)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#eeeee9;color:#343932;font-family:Arial,sans-serif}main{max-width:1728px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:18px}h1{font-size:25px;margin:0}nav{display:${items.length>1?'flex':'none'};gap:8px}button{font:inherit;font-size:14px;padding:8px 14px;background:#fff;border:1px solid #d6d7cf;border-radius:8px;cursor:pointer}button[aria-pressed=true]{background:#343932;color:#fff}.items{display:grid;gap:20px}figure{margin:0;background:#fff;border:1px solid #d6d7cf;border-radius:10px;overflow:hidden}figcaption{padding:14px 20px;border-bottom:1px solid #e5e5dc;font-size:20px;font-weight:600}small{font-size:15px;color:#74776c;font-weight:400;margin-left:18px}figure img{display:block;width:100%;height:auto;cursor:zoom-in}.side .items{grid-template-columns:repeat(${Math.min(items.length,3)},minmax(0,1fr))}.side figcaption{font-size:16px}.side small{display:block;margin:6px 0 0}dialog{padding:0;border:0;max-width:96vw;max-height:96vh;overflow:auto;background:#fbf8ef}dialog::backdrop{background:#252820bb}dialog img{display:block;width:auto;max-width:none;cursor:zoom-out}@media(max-width:700px){main{padding:12px}header{align-items:start}h1{font-size:18px}figcaption{font-size:16px;padding:12px}small{display:block;margin:5px 0 0;font-size:12px}button{font-size:12px;padding:6px 8px}.side .items{grid-template-columns:1fr}}@media print{nav{display:none}figure{break-inside:avoid}}
</style></head><body><main><header><h1>${draw.esc(title)}</h1><nav aria-label="Comparison layout"><button type="button" data-layout="stack" aria-pressed="true">Stack</button><button type="button" data-layout="side" aria-pressed="false">Side by side</button></nav></header><section class="items">${items.map((item,i)=>`<figure><figcaption>${draw.esc(item.label||`Version ${i+1}`)}${item.description?`<small>${draw.esc(item.description)}</small>`:''}</figcaption><img id="readme-v${i+1}" alt="${draw.esc(item.label||'README banner')}" src="data:image/svg+xml;base64,${Buffer.from(item.svg).toString('base64')}"></figure>`).join('')}</section></main><dialog aria-label="Enlarged banner"><img alt="Enlarged banner preview"></dialog><script>
document.querySelectorAll('[data-layout]').forEach(button=>button.onclick=()=>{document.body.classList.toggle('side',button.dataset.layout==='side');document.querySelectorAll('[data-layout]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));});const dialog=document.querySelector('dialog');document.querySelectorAll('figure img').forEach(img=>img.onclick=()=>{dialog.querySelector('img').src=img.src;dialog.showModal();});dialog.onclick=()=>dialog.close();
</script></body></html>`;
}
function outputPath(value) {
  const out=path.resolve(value),root=path.resolve(__dirname,'..'),skill=path.join(root,'SKILL.md');
  if(fs.existsSync(skill)&&/^name:\s*(?:readme-banner|fly-readme)\s*$/m.test(fs.readFileSync(skill,'utf8'))&&(out===root||out.startsWith(root+path.sep)))throw Error('Keep generated output outside the skill package');
  fs.mkdirSync(out,{recursive:true});
  return out;
}
async function main() {
  const opts=runtime.options(process.argv.slice(2));
  if(opts.help){console.log('node build.cjs scene.cjs --out output/hero-v1 [--formats svg,html,png] [--renderer auto|browser|sharp]\nnode build.cjs --doctor');return;}
  if(opts.doctor){console.log(JSON.stringify({node:process.version,playwright:!!runtime.load('playwright',true),sharp:!!runtime.load('sharp',true),browser:runtime.browserPath()||null},null,2));return;}
  if(!opts.input||!opts.out)throw Error('Provide a trusted scene.cjs and --out directory');
  const input=path.resolve(opts.input),out=outputPath(opts.out),exported=require(input);
  const result=typeof exported==='function'?await exported({draw,sceneDir:path.dirname(input)}):exported;
  const scenes=result.variants||[result],ids=new Set(),items=[];
  const report={schema:'fly-readme.build/v2',renderer:null,formats:opts.formats,warnings:[],banners:[]};
  for(const scene of scenes){if(ids.has(scene.id))throw Error(`Duplicate banner ID: ${scene.id}`);ids.add(scene.id);items.push({scene,svg:draw.svg(scene),label:scene.label||scene.title||scene.id});}
  if(!items.length)throw Error('At least one banner is required');
  const painter=opts.formats.includes('png')?await runtime.renderer(opts.renderer,report):null;
  try {
    for(const item of items) {
      const {scene,svg}=item;
      if(opts.formats.includes('svg'))fs.writeFileSync(path.join(out,`${scene.id}.svg`),svg);
      const checks=painter?await painter.render(svg,scene,path.join(out,`${scene.id}.png`)):{};
      const letteringInfo=lettering.summary(scene);
      if(!letteringInfo.portableHandwriting)report.warnings.push(`${scene.id}: native text depends on system fonts and does not guarantee handwritten glyphs.`);
      report.banners.push({...checks,id:scene.id,lettering:letteringInfo,svgSha256:createHash('sha256').update(svg).digest('hex')});
    }
  }finally{if(painter)await painter.close();}
  if(opts.formats.includes('html'))fs.writeFileSync(path.join(out,'preview.html'),preview(items,result.title||'README banner preview'));
  const fontSources=report.banners.flatMap(b=>b.lettering.assets.map(a=>`Outlined lettering: ${a.family} (${a.weight}), OFL-1.1; source ${a.source}; original font SHA-256 ${a.sourceSha256}. Words remain editable in scene.cjs.`));
  const sources=[...new Set([].concat(result.sources||[],...scenes.map(s=>s.sources||[]),fontSources))];
  if(sources.length)fs.writeFileSync(path.join(out,'SOURCES.md'),'# Asset and content sources\n\n'+sources.map(s=>`- ${s}`).join('\n')+'\n');
  fs.writeFileSync(path.join(out,'build-report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({ok:true,out,banners:items.length,renderer:report.renderer,warnings:report.warnings},null,2));
}
if(require.main===module)main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
module.exports={preview,outputPath};
