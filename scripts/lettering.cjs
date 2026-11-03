// Deterministic OFL glyph outlines. No system fonts or third-party Node modules.
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const {createHash}=require('node:crypto');
const cache=new Map();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const n=value=>Math.round(value*10000)/10000;
const lines=text=>text.replace(/\r\n?/g,'\n').split('\n');
function load(role) {
  if(cache.has(role))return cache.get(role);
  const root=path.resolve(__dirname,'../assets/lettering');
  let manifest,bytes;
  try{
    manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
    const entry=manifest.fonts[role];
    if(!entry)throw Error(`Unknown bundled lettering role: ${role}`);
    bytes=fs.readFileSync(path.join(root,entry.file));
    const hash=createHash('sha256').update(bytes).digest('hex');
    if(hash!==entry.sha256)throw Error(`Bundled glyph data checksum mismatch: ${entry.file}`);
    const font=JSON.parse(zlib.gunzipSync(bytes).toString('utf8'));
    if(font.schema!=='fly-readme.outlines/v1'||font.sourceSha256!==entry.sourceSha256)throw Error(`Invalid glyph data: ${entry.file}`);
    font.role=role;font.dataSha256=hash;
    cache.set(role,font);return font;
  }catch(error){throw Error(`Cannot load bundled handwriting (${role}): ${error.message}. Restore assets/lettering; do not substitute a system font.`);}
}
function layout(text,size=28,bold=false,spacing=0,style='upright') {
  if(!['upright','body'].includes(style))throw Error(`Unknown letteringStyle: ${style}. Use upright or body.`);
  const family=style==='body'?'latin':'upright';
  const preferred=load(`${family}-${bold?'bold':'regular'}`);
  const glyphs=[],used=new Map();
  let cursor=0,previous=null,bounds=null;
  for(const character of Array.from(text.normalize('NFC'))) {
    const cp=character.codePointAt(0),key=String(cp);
    let font=preferred;
    if(!font.cmap[key])font=load('cjk-regular');
    const name=font.cmap[key],glyph=font.glyphs[name];
    if(!glyph)throw Error(`No bundled handwritten glyph for U+${cp.toString(16).toUpperCase()}. Add licensed outline coverage; system fallback is disabled.`);
    const scale=size/font.unitsPerEm;
    if(previous?.font===font)cursor+=(font.kerning[previous.name+'\0'+name]||0)*scale;
    glyphs.push({font,glyph,x:cursor,scale});used.set(font.role,font);
    if(glyph.bounds){
      const b=[cursor+glyph.bounds[0]*scale,-glyph.bounds[3]*scale,cursor+glyph.bounds[2]*scale,-glyph.bounds[1]*scale];
      bounds=bounds?[Math.min(bounds[0],b[0]),Math.min(bounds[1],b[1]),Math.max(bounds[2],b[2]),Math.max(bounds[3],b[3])]:b;
    }
    cursor+=glyph.advance*scale+spacing;
    previous={font,name};
  }
  return {glyphs,width:glyphs.length?cursor-spacing:0,bounds,fonts:[...used.values()]};
}
function outline(t,index=0) {
  const {x,y,w,h,size=28,align='left',rotate=0,lineHeight=1.2,color='#343932'}=t;
  const rows=lines(t.text),anchor={left:x,center:x+w/2,right:x+w}[align];
  if(anchor===undefined)throw Error(`Unknown text alignment: ${align}`);
  const baseline=y+h/2-(rows.length-1)*size*lineHeight/2+size*.35;
  const art=rows.map((line,i)=>{
    const run=layout(line,size,!!t.bold,t.letterSpacing||0,t.letteringStyle||'upright'),left=anchor-(align==='center'?run.width/2:align==='right'?run.width:0),base=baseline+i*size*lineHeight;
    if(run.bounds){
      const b=[left+run.bounds[0],base+run.bounds[1],left+run.bounds[2],base+run.bounds[3]];
      if(b[0]<x-2||b[1]<y-2||b[2]>x+w+2||b[3]>y+h+2)throw Error(`Outlined label ${index} does not fit its box (${Math.ceil(b[2]-b[0])} x ${Math.ceil(b[3]-b[1])}). Enlarge its box or revise the copy.`);
    }
    return run.glyphs.filter(g=>g.glyph.path).map(g=>`<path data-font="${esc(g.font.sourceFamily)}" d="${esc(g.glyph.path)}" transform="translate(${n(left+g.x)} ${n(base)}) scale(${n(g.scale)} ${n(-g.scale)})"/>`).join('');
  }).join('');
  return `<g data-label="${index}" data-lettering="outline" data-lettering-style="${esc(t.letteringStyle||'upright')}" role="img" aria-label="${esc(t.text)}" fill="${esc(color)}" transform="rotate(${n(rotate)} ${n(x+w/2)} ${n(y+h/2)})">${art}</g>`;
}
function summary(scene) {
  const mode=scene.textMode||'outline';
  if(mode==='native')return {mode,portableHandwriting:false,coverageChecked:false,fonts:[...new Set((scene.labels||[]).map(t=>t.font||'Comic Sans MS, Segoe Print, Bradley Hand, cursive'))],assets:[]};
  const used=new Map();
  for(const t of scene.labels||[])for(const row of lines(t.text))for(const font of layout(row,t.size||28,!!t.bold,t.letterSpacing||0,t.letteringStyle||'upright').fonts)used.set(font.role,font);
  return {mode,portableHandwriting:true,coverageChecked:true,styles:[...new Set((scene.labels||[]).map(t=>t.letteringStyle||'upright'))],fonts:[...new Set([...used.values()].map(f=>f.sourceFamily))],assets:[...used.values()].map(f=>({family:f.sourceFamily,weight:f.weight,source:f.source,sourceSha256:f.sourceSha256,dataSha256:f.dataSha256,license:f.license}))};
}
module.exports={layout,outline,summary};
