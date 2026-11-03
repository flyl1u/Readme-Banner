// The project's own bilingual banner. Rebuild from the repository root.
const path=require('node:path');
module.exports=({draw:d,sceneDir})=>{
  const mark=path.join(sceneDir,'mark.svg');
  const commonArt=d.path('M76 346 Q260 355 514 344',{color:'#F4D786',width:17,opacity:.72})
    +d.path('M613 146 Q609 320 615 501',{color:'#C9C5B6',width:1.4,opacity:.65})
    // Project context, one skill, and a concrete README image output.
    +d.box({x:672,y:205,w:191,h:232,fill:'#E3EBE0',rotate:-3,seed:3})
    +d.path('M704 275 L704 244 L744 244 L757 257 L829 257 L829 313 L704 313 Z',{fill:'#F4D786',width:3})
    +d.box({x:713,y:282,w:105,h:93,fill:'#FFFDF7',rotate:2,seed:5})
    +d.path('M733 306 L796 306 M733 324 L784 324 M733 342 L771 342',{width:3})
    +d.arrow({from:[890,322],to:[959,322],head:16,width:3.1})
    +d.box({x:989,y:233,w:181,h:179,fill:'#F4D786',rotate:-2,seed:7})
    +d.image({file:mark,x:1022,y:253,w:112,h:112,alt:'Readme-Banner project mark'})
    +d.path('M1129 213 l5 -16 M1151 221 l14 -8 M1109 207 l-2 -15',{color:'#BD9744',width:2.7})
    +d.arrow({from:[1195,322],to:[1241,322],head:15,width:3.1})
    +d.box({x:1280,y:177,w:315,h:302,fill:'#DFE9DD',rotate:3,seed:9})
    +d.box({x:1267,y:163,w:315,h:302,fill:'#FFFDF7',rotate:1,seed:11})
    +d.path('M1269 208 Q1433 211 1581 208',{color:'#9C9C8D',width:1.8})
    +'<circle cx="1287" cy="186" r="4" fill="#D89A83"/><circle cx="1301" cy="186" r="4" fill="#E4C469"/><circle cx="1315" cy="186" r="4" fill="#9EB59C"/>'
    // Miniature introduction banner inside the README: title and useful diagram.
    +d.path('M1286 236 L1565 236 L1564 356 L1288 358 Z',{fill:'#FBF8EF',color:'#D1CEC1',width:1.3})
    +d.path('M1301 294 Q1347 298 1394 293',{color:'#F4D786',width:8,opacity:.8})
    +d.path('M1301 317 L1387 318',{color:'#9A9E8B',width:3})
    +d.box({x:1420,y:268,w:39,h:41,fill:'#DFEAFA',rotate:-3,seed:4})
    +d.arrow({from:[1470,288],to:[1494,288],head:7,width:2})
    +d.box({x:1505,y:265,w:41,h:47,fill:'#F4D786',rotate:2,seed:2})
    +d.path('M1525 254 l1 -8 M1543 258 l6 -5',{color:'#BD9744',width:1.8})
    +d.path('M1290 385 L1534 386 M1290 407 L1553 409 M1290 429 L1470 430',{color:'#BABCB1',width:3});
  const wording={
    en:{id:'hero',label:'English',title:'Readme-Banner - a clear first look for your project',
      description:'Project context flows through the Readme-Banner skill into a hand-drawn introduction SVG embedded at the top of a README.',
      promise:'A clear first look for your repo.',support:'Hand-drawn SVG. Ready for GitHub.',
      context:'Project context',skill:'Banner skill',output:'A README, explained.',mini:'Your project'},
    zh:{id:'hero-zh-cn',label:'Chinese localization',title:'Readme-Banner - 让项目第一眼就讲清楚',
      description:'读取项目资料，通过 Readme-Banner Skill，产出可直接嵌入 README 顶部的手绘 SVG 介绍图。',
      promise:'让项目，第一眼就讲清楚。',support:'手绘 SVG · 离线预览 · 可直接嵌入',
      context:'项目资料',skill:'首图 Skill',output:'一眼看懂的 README',mini:'项目名称'},
  };
  const sources=[
    'Content: this repository\'s SKILL.md, scripts/build.cjs, and references/authoring.md. The drawing depicts project context becoming a self-contained README introduction SVG.',
    'The README/page drawings, project mark in mark.svg, connectors, and paper are original SVG geometry, licensed under the repository MIT License.',
    'English is the default banner language. The Chinese variant is an explicit localization for this repository\'s bilingual README.',
    'Visual direction follows the user-named CodexPulse and fly-brief references; see references/sources.md. Their product marks and Agent host lists are not reused.',
  ];
  return {title:'Readme-Banner - bilingual README headers',sources,
    variants:Object.entries(wording).map(([language,w])=>({
      id:w.id,label:w.label,title:w.title,description:w.description,
      width:1680,height:640,allowCjk:language==='zh',art:commonArt,
      labels:[
        {text:'Agent Skill',x:77,y:91,w:470,h:40,size:24,color:'#6E7065'},
        {text:'Readme-\nBanner',x:69,y:138,w:503,h:224,size:103,bold:true,lineHeight:1.02,letterSpacing:-3},
        {text:w.promise,x:77,y:388,w:493,h:60,size:31,letteringStyle:'upright'},
        {text:w.support,x:79,y:472,w:492,h:43,size:23,letteringStyle:'upright',color:'#6E7065'},
        {text:w.context,x:672,y:462,w:195,h:42,size:26,letteringStyle:'body',align:'center'},
        {text:w.skill,x:997,y:365,w:164,h:38,size:24,bold:true,align:'center',rotate:-2},
        {text:'README.md',x:1340,y:171,w:227,h:34,size:24,letteringStyle:'body',color:'#6E7065',rotate:1},
        {text:w.mini,x:1299,y:258,w:110,h:39,size:language==='zh'?23:19,bold:true,letterSpacing:-.5},
        {text:w.output,x:1267,y:502,w:330,h:46,size:28,letteringStyle:'body',align:'center'},
      ],
    })),
  };
};
