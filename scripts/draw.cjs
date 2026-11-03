const fs = require('node:fs');
const nodePath = require('node:path');
const lettering = require('./lettering.cjs');
const ink = '#343932';
const hand = 'Comic Sans MS, Segoe Print, Bradley Hand, cursive';
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const n = value => {
  if (!Number.isFinite(Number(value))) throw Error(`Non-finite coordinate: ${value}`);
  return Math.round(Number(value)*1000)/1000;
};
function path(d,{color=ink,width=3,fill='none',opacity=1}={}) {
  return `<path d="${esc(d)}" fill="${esc(fill)}" stroke="${esc(color)}" stroke-width="${n(width)}" opacity="${n(opacity)}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function paper({width=1680,height=640,color='#FBF8EF',dots=true}={}) {
  return `<rect width="${n(width)}" height="${n(height)}" fill="${esc(color)}"/>`
    +(dots?'<defs><pattern id="paper-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="9" cy="11" r=".7" fill="#A69C87" opacity=".16"/></pattern></defs>'
      +`<rect width="${n(width)}" height="${n(height)}" fill="url(#paper-dots)"/>`:'');
}
function box({x,y,w,h,fill='#FFFDF7',rotate=0,seed=1}) {
  const r=Math.min(24,w*.12,h*.16), a=((seed*13)%9-4)*.3;
  const curve=`M${x+r} ${y+a} Q${x-1} ${y} ${x} ${y+r} L${x+1} ${y+h-r} Q${x} ${y+h+1} ${x+r} ${y+h} L${x+w-r} ${y+h-1} Q${x+w+1} ${y+h} ${x+w} ${y+h-r} L${x+w+a} ${y+r} Q${x+w} ${y-1} ${x+w-r} ${y} Z`;
  return `<g transform="rotate(${n(rotate)} ${n(x+w/2)} ${n(y+h/2)})">`
    +path(curve,{fill,width:3.1})
    +path(`M${x+r+3} ${y+5} Q${x+w/2} ${y+2} ${x+w-r} ${y+4} M${x+w-5} ${y+r+3} L${x+w-4} ${y+h-r} Q${x+w-4} ${y+h-5} ${x+w-r} ${y+h-5}`,{color:'#68695F',width:1.15,opacity:.4})+'</g>';
}
function arrow({from,to,bend=0,width=3.2,head=17,color='#4D5147'}) {
  const [x,y]=from.map(n),[ex,ey]=to.map(n),dx=ex-x,dy=ey-y,len=Math.hypot(dx,dy);
  if(len<1) throw Error('Arrow endpoints must differ');
  const nx=-dy/len,ny=dx/len;
  const c1=[x+dx*.32+nx*bend,y+dy*.32+ny*bend],c2=[x+dx*.73+nx*bend,y+dy*.73+ny*bend];
  const a=Math.atan2(ey-c2[1],ex-c2[0]);
  const curve=`M${x} ${y} C${c1.map(n).join(' ')} ${c2.map(n).join(' ')} ${ex} ${ey}`;
  return path(curve,{color,width})+`<g transform="translate(0 2.5)">${path(curve,{color,width:1,opacity:.3})}</g>`
    +path(`M${n(ex-head*Math.cos(a-.48))} ${n(ey-head*Math.sin(a-.48))} L${ex} ${ey} L${n(ex-head*Math.cos(a+.48))} ${n(ey-head*Math.sin(a+.48))}`,{color,width});
}
function brace({x,y,h,color='#777B6E'}) {
  const mid=y+h/2;
  return path(`M${x-24} ${y} Q${x+2} ${y-2} ${x} ${y+24} L${x-2} ${mid-40} Q${x-2} ${mid-15} ${x+12} ${mid} Q${x-2} ${mid+15} ${x-2} ${mid+40} L${x+1} ${y+h-24} Q${x+2} ${y+h} ${x-22} ${y+h}`,{color,width:2.7});
}
function symbol({kind='document',cx,cy,size=60,color=ink}) {
  const paths={
    document:'M18 8 H40 L49 18 V55 H18 Z M40 8 V19 H49 M25 29 H41 M25 38 H41 M25 46 H36',
    link:'M27 23 L35 15 C47 4 61 20 49 31 L40 40 M24 24 L15 33 C3 45 19 60 30 49 L39 40 M22 42 L43 21',
    notes:'M15 11 H49 V54 H15 Z M23 22 H41 M23 32 H41 M23 42 H35 M23 7 V15 M40 7 V15',
    image:'M10 13 H54 V51 H10 Z M12 44 L26 30 L36 39 L44 31 L53 42 M38 22 H39',
    chat:'M11 12 H53 V43 H31 L19 54 V43 H11 Z M20 24 H44 M20 33 H36',
    check:'M15 33 L27 45 L51 18',
  };
  if(!paths[kind]) throw Error(`Unknown generic symbol: ${kind}`);
  return `<g transform="translate(${n(cx-size/2)} ${n(cy-size/2)}) scale(${n(size/64)})">${path(paths[kind],{color,width:3.2})}</g>`;
}
function assertStatic(svg,{allowCjk=false,depth=0}={}) {
  if(depth>4) throw Error('Too many nested SVG images');
  if(!/<svg\b/.test(svg)) throw Error('An SVG root is required');
  if(/<(?:script|foreignObject|iframe|object|embed|animate\w*|set)\b|\bon\w+\s*=|<!DOCTYPE|<!ENTITY|@import|(?:href\s*=\s*["']\s*(?:https?:|file:|javascript:|\/\/))|url\(\s*["']?(?:https?:|file:|\/\/)/i.test(svg)) throw Error('SVG must be static with no active or remote resources');
  for(const match of svg.matchAll(/(?:\s|:)(?:href|src)\s*=\s*["']([^"']*)["']/gi)) {
    if(match[1]&&!/^(?:#|data:image\/(?:svg\+xml|png|jpeg|webp);base64,)/i.test(match[1])) throw Error('SVG resources must be embedded');
  }
  if(!allowCjk&&/\p{Script=Han}/u.test(svg)) throw Error('Use English banner text and metadata; found Han characters');
  for(const match of svg.matchAll(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/g)) assertStatic(Buffer.from(match[1],'base64').toString('utf8'),{allowCjk,depth:depth+1});
}
function image({file,x,y,w,h,alt='',allowCjk=false}) {
  const mime={'.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[nodePath.extname(file).toLowerCase()];
  if(!mime) throw Error(`Unsupported image: ${file}`);
  const bytes=fs.readFileSync(file);
  if(mime==='image/svg+xml') assertStatic(bytes.toString('utf8'),{allowCjk});
  return `<image x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" href="data:${mime};base64,${bytes.toString('base64')}" preserveAspectRatio="xMidYMid meet"><title>${esc(alt)}</title></image>`;
}
function tile({cx,cy,size=84,fill='#DDEDE2',rotate=0,seed=1,kind='document',file}) {
  return `<g transform="rotate(${n(rotate)} ${n(cx)} ${n(cy)})">`
    +box({x:cx-size/2,y:cy-size/2,w:size,h:size,fill,seed})
    +(file?image({file,x:cx-size*.36,y:cy-size*.36,w:size*.72,h:size*.72}):symbol({kind,cx,cy,size:size*.7}))+'</g>';
}
function group({art,labels=[]},{scale=1,origin=[0,0]}={}) {
  const ox=origin[0]*(1-scale),oy=origin[1]*(1-scale);
  return {art:`<g transform="translate(${n(ox)} ${n(oy)}) scale(${n(scale)})">${art}</g>`,
    labels:labels.map(t=>({...t,x:t.x*scale+ox,y:t.y*scale+oy,w:t.w*scale,h:t.h*scale,size:(t.size||28)*scale,letterSpacing:(t.letterSpacing||0)*scale}))};
}
function text(t,index) {
  const {x,y,w,h,size=28,align='left',font=hand,color=ink,rotate=0,lineHeight=1.2}=t;
  const anchor={left:'start',center:'middle',right:'end'}[align];
  if(!anchor) throw Error(`Unknown text alignment: ${align}`);
  const tx=x+(align==='center'?w/2:align==='right'?w:0),lines=t.text.split('\n');
  const baseline=y+h/2-(lines.length-1)*size*lineHeight/2+size*.35;
  return `<g data-label="${index}" transform="rotate(${n(rotate)} ${n(x+w/2)} ${n(y+h/2)})"><text x="${n(tx)}" y="${n(baseline)}" text-anchor="${anchor}" font-family="${esc(font)}" font-size="${n(size)}" font-weight="${t.bold?'700':'400'}" letter-spacing="${n(t.letterSpacing||0)}" fill="${esc(color)}">${lines.map((line,i)=>`<tspan x="${n(tx)}" dy="${i?n(size*lineHeight):0}">${esc(line)}</tspan>`).join('')}</text></g>`;
}
function validate(scene) {
  if(scene.textMode&&!['outline','native'].includes(scene.textMode))throw Error('textMode must be outline or native');
  if(!/^[a-z][a-z0-9-]*$/.test(scene.id)) throw Error('Use a letter-prefixed lowercase ID with digits/hyphens only');
  const width=scene.width||1680,height=scene.height||640;
  if(width<=0||height<=0||!Number.isFinite(width+height)) throw Error('Invalid canvas dimensions');
  for(const [i,t] of (scene.labels||[]).entries()) {
    if(typeof t.text!=='string') throw Error(`Label ${i} needs text`);
    for(const key of ['x','y','w','h']) n(t[key]);
    if(t.w<=0||t.h<=0||(t.size||28)<=0) throw Error(`Invalid label ${i} box or font size`);
    const angle=(t.rotate||0)*Math.PI/180,cx=t.x+t.w/2,cy=t.y+t.h/2;
    for(const [dx,dy] of [[-t.w/2,-t.h/2],[t.w/2,-t.h/2],[t.w/2,t.h/2],[-t.w/2,t.h/2]]) {
      const x=cx+dx*Math.cos(angle)-dy*Math.sin(angle),y=cy+dx*Math.sin(angle)+dy*Math.cos(angle);
      if(x<0||y<0||x>width||y>height) throw Error(`Label ${i} box extends outside the canvas`);
    }
  }
}
function svg(scene) {
  validate(scene);
  if(scene.textMode!=='native'&&/<text\b/i.test((scene.art||'')+(scene.background||'')))throw Error('Put banner lettering in labels or draw.text() so it uses bundled outlines. Native art text needs an explicit textMode: native.');
  const width=scene.width||1680,height=scene.height||640,id=scene.id;
  const renderText=scene.textMode==='native'?text:lettering.outline;
  const source=`<svg xmlns="http://www.w3.org/2000/svg" width="${n(width)}" height="${n(height)}" viewBox="0 0 ${n(width)} ${n(height)}" role="img" aria-labelledby="${esc(id)}-title ${esc(id)}-desc"><title id="${esc(id)}-title">${esc(scene.title||id)}</title><desc id="${esc(id)}-desc">${esc(scene.description||scene.title||id)}</desc>${scene.background??paper({width,height})}${scene.art||''}${(scene.labels||[]).map(renderText).join('')}</svg>`;
  assertStatic(source,{allowCjk:!!scene.allowCjk});
  return source;
}
module.exports={ink,hand,esc,n,path,paper,box,arrow,brace,symbol,image,tile,group,text:lettering.outline,validate,svg,assertStatic};
