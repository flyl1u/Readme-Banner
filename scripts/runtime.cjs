const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const lettering=require('./lettering.cjs');
function load(name,optional=false) {
  try{return require(name);}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;}
  const roots=[process.env.FLY_README_NODE_MODULES,...String(process.env.NODE_PATH||'').split(path.delimiter),path.resolve(path.dirname(process.execPath),'../node_modules'),path.join(path.dirname(process.execPath),'node_modules')].filter(Boolean);
  for(const root of roots)try{return createRequire(path.join(path.resolve(root),'__fly_readme__.cjs'))(name);}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;}
  if(optional)return null;
  throw Error(`Missing ${name}. Locate installed dependencies or set FLY_README_NODE_MODULES.`);
}
function browserPath() {
  const candidates=[process.env.FLY_README_BROWSER,process.env.CHROME_BIN];
  if(process.platform==='win32')for(const root of [process.env.PROGRAMFILES,process.env['PROGRAMFILES(X86)'],process.env.LOCALAPPDATA].filter(Boolean)) candidates.push(path.join(root,'Google/Chrome/Application/chrome.exe'),path.join(root,'Microsoft/Edge/Application/msedge.exe'));
  else candidates.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser');
  return candidates.find(p=>p&&fs.existsSync(p));
}
function options(argv) {
  const result={formats:['svg','html','png'],renderer:'auto'};
  for(let i=0;i<argv.length;i++) {
    const key=argv[i];
    if(key==='--out')result.out=argv[++i];
    else if(key==='--formats')result.formats=String(argv[++i]).split(',');
    else if(key==='--renderer')result.renderer=argv[++i];
    else if(key==='--doctor')result.doctor=true;
    else if(key==='--help'||key==='-h')result.help=true;
    else if(!key.startsWith('-')&&!result.input)result.input=key;
    else throw Error(`Unexpected argument: ${key}`);
  }
  if(!['auto','browser','sharp'].includes(result.renderer))throw Error('Renderer must be auto, browser, or sharp');
  if(result.formats.some(x=>!['svg','html','png'].includes(x)))throw Error('Formats must be svg, html, and/or png');
  return result;
}
async function renderer(mode,report) {
  let browser,sharp;
  if(mode!=='sharp') {
    const pw=load('playwright',true);
    if(pw)try{browser=await pw.chromium.launch({headless:true,...(browserPath()?{executablePath:browserPath()}:{} )});}
    catch(e){if(mode==='browser')throw e;report.warnings.push(`Browser unavailable: ${e.message.split('\n')[0]}`);}
    else if(mode==='browser')throw Error('Playwright is not available for browser rendering');
  }
  if(!browser) {
    sharp=load('sharp');
    report.warnings.push('Sharp raster rendering only. Browser image loading and font metrics were not verified.');
  }
  report.renderer=browser?'browser':'sharp';
  const external=[];
  async function newPage(width,height) {
    const page=await browser.newPage({viewport:{width:Math.ceil(width),height:Math.ceil(height)},deviceScaleFactor:1});
    await page.route('**/*',route=>{if(/^https?:/i.test(route.request().url())){external.push(route.request().url());return route.abort();}return route.continue();});
    return page;
  }
  return {
    async render(source,scene,file,{thumbnails=true}={}) {
      const width=scene.width||1680,height=scene.height||640;
      const result={id:scene.id,width,height,fonts:lettering.summary(scene).fonts,fontMetricsChecked:false,labelBoundsChecked:false,imageChecks:[]};
      if(browser) {
        const page=await newPage(width,height);
        try {
          await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}body>svg{display:block}</style></head><body>${source}</body></html>`,{waitUntil:'load'});
          await page.evaluate(()=>document.fonts.ready);
          const metrics=await page.locator('[data-label]').evaluateAll(nodes=>nodes.map(n=>{const box=n.getBBox();return {index:Number(n.dataset.label),width:box.width,height:box.height};}));
          for(const m of metrics){const t=scene.labels[m.index];if(m.width>t.w+2||m.height>t.h+2)throw Error(`${scene.id} label ${m.index} does not fit (${Math.ceil(m.width)} x ${Math.ceil(m.height)}). Enlarge its box or revise the copy.`);}
          result.fontMetricsChecked=scene.textMode==='native';
          result.labelBoundsChecked=true;
          await page.locator('body > svg').screenshot({path:file,omitBackground:true});
        }finally{await page.close();}
      } else await sharp(Buffer.from(source)).png().toFile(file);
      if(thumbnails)for(const displayWidth of [980,358]) {
        const suffix=displayWidth===980?'readme':'mobile',thumb=file.replace(/\.png$/i,`-${suffix}.png`);
        if(browser) {
          const page=await newPage(displayWidth+32,height*displayWidth/width+32);
          try {
            await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:16px}img{display:block;width:100%;height:auto}</style></head><body><img alt="README banner preview" src="data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}"></body></html>`,{waitUntil:'load'});
            await page.locator('img').evaluate(img=>img.decode());
            const check=await page.locator('img').evaluate(img=>({complete:img.complete,naturalWidth:img.naturalWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
            if(!check.complete||check.naturalWidth!==width||check.overflow)throw Error('SVG image loading or responsive width check failed');
            await page.locator('img').screenshot({path:thumb});
            result.imageChecks.push({width:displayWidth,loaded:true,overflow:false});
          }finally{await page.close();}
        }else await sharp(file).resize({width:displayWidth}).png().toFile(thumb);
      }
      if(external.length)throw Error('The artwork attempted to load remote resources');
      result.externalRequests=browser?0:null;
      return result;
    },
    async close(){if(browser)await browser.close();},
  };
}
module.exports={load,browserPath,options,renderer};
