// A fictional example. Replace the subject, inputs, mark, and output as needed.
module.exports=({draw:d})=>{
  const nodes=[
    {name:'Files',kind:'document',cx:660,cy:140,fill:'#F6DFD2',rotate:-4},
    {name:'Links',kind:'link',cx:835,cy:140,fill:'#DDE8DE',rotate:3},
    {name:'Notes',kind:'notes',cx:660,cy:315,fill:'#DFEAFA',rotate:-3},
    {name:'Images',kind:'image',cx:835,cy:315,fill:'#DDEDE2',rotate:3},
    {name:'Drafts',kind:'document',cx:660,cy:490,fill:'#E8E2EF',rotate:-4},
    {name:'Chats',kind:'chat',cx:835,cy:490,fill:'#DFEAFA',rotate:3},
  ];
  const diagram=d.group({
    art:nodes.map((node,i)=>d.tile({...node,seed:i+1})).join('')
      +d.brace({x:943,y:91,h:469})
      +d.arrow({from:[968,322],to:[1016,322],width:3.1,head:15})
      +d.box({x:1040,y:239,w:185,h:168,fill:'#F4D786',rotate:-2,seed:11})
      +d.symbol({kind:'document',cx:1133,cy:302,size:93})
      +d.path('M1110 312 L1126 326 L1155 295',{color:'#BA533B',width:5})
      +d.path('M1194 218 l8 -13 M1217 228 l16 -4 M1174 210 l-1 -15',{color:'#BD9744',width:2.7})
      +d.arrow({from:[1250,322],to:[1298,322],width:3.5,head:16})
      +d.box({x:1338,y:188,w:254,h:284,fill:'#E7ECDD',rotate:4,seed:3})
      +d.box({x:1327,y:177,w:254,h:284,fill:'#FFFDF7',rotate:1,seed:4})
      +d.path('M1329 223 Q1450 225 1578 224',{color:'#9C9C8D',width:1.8})
      +'<circle cx="1346" cy="200" r="4" fill="#D89A83"/><circle cx="1360" cy="200" r="4" fill="#E4C469"/><circle cx="1374" cy="200" r="4" fill="#9EB59C"/>'
      +['#F4D786','#C9DFC9','#CDDDF1'].map((fill,i)=>`<rect x="1349" y="${265+i*58}" width="25" height="25" rx="7" fill="${fill}"/>`).join(''),
    labels:[
      ...nodes.map(node=>({text:node.name,x:node.cx-90,y:node.cy+52,w:180,h:40,size:26,letteringStyle:'body',align:'center',rotate:node.rotate/2})),
      {text:'Papertrail',x:1045,y:360,w:171,h:41,size:27,bold:true,letteringStyle:'upright',align:'center',rotate:-2},
      {text:'brief.html',x:1395,y:185,w:165,h:33,size:22,letteringStyle:'body',color:'#6E7065',rotate:1},
      ...['Summary','Actions','Sources'].map((text,i)=>({text,x:1388,y:258+i*58,w:175,h:42,size:26,letteringStyle:'body',rotate:1})),
      {text:'A local brief',x:1302,y:495,w:305,h:46,size:28,letteringStyle:'body',align:'center'},
    ],
  },{scale:.93,origin:[1610,320]});
  return {
    id:'grouped-flow',title:'Papertrail - scattered context into one clear brief',
    description:'Fictional workflow illustration: files, links, notes, images, drafts, and chats feed a shared tool that produces a local brief.',
    width:1680,height:640,
    art:d.path('M65 301 Q248 312 535 298',{color:'#F4D786',width:17,opacity:.7})
      +d.path('M587 146 Q583 309 588 484',{color:'#C9C5B6',width:1.4,opacity:.65})+diagram.art,
    labels:[
      {text:'Context tool',x:66,y:171,w:440,h:36,size:23,letteringStyle:'upright',color:'#6E7065'},
      {text:'Papertrail',x:60,y:192,w:505,h:148,size:100,bold:true,letteringStyle:'upright',letterSpacing:-3},
      {text:'Your sources, one clear brief.',x:66,y:335,w:485,h:57,size:30,letteringStyle:'body'},
      {text:'Gather context. Keep the useful parts.',x:68,y:408,w:480,h:42,size:21,letteringStyle:'body',color:'#6E7065'},
      ...diagram.labels,
    ],
    sources:['Fictional Papertrail example for layout authoring; it makes no claim about an existing product.','Generic symbols, paper, brace, and connectors are original SVG geometry. Replace them with a real project mark and verified facts when adapting.'],
  };
};
