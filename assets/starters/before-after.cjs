// A fictional example. Keep identities and panel geometry consistent.
module.exports=({draw:d})=>{
  const folder=(x,y,fill)=>`<g transform="translate(${x} ${y})">${d.path('M2 8 V4 H15 L21 10 H37 V34 H2 Z',{fill,width:2.3})}${d.path('M4 15 H35',{color:'#887C62',width:1.2,opacity:.5})}</g>`;
  const panel=(x,rows,selected,fill)=>d.box({x,y:200,w:300,h:340,fill:'#FFFFFF',seed:x})
    +d.path(`M${x+22} 266 Q${x+150} 269 ${x+277} 265`,{color:'#B8B5A7',width:1.7})
    +rows.map((name,i)=>{
      const y=298+i*81;
      return (name===selected?`<rect x="${x+18}" y="${y-8}" width="264" height="52" rx="11" fill="${fill}" opacity=".86"/>`:'')+folder(x+28,y,name===selected?'#F4D786':'#F2EBDD');
    }).join('');
  const rowLabels=(x,rows)=>rows.map((name,i)=>({text:`Project ${name}`,x:x+85,y:292+i*81,w:194,h:50,size:28,letteringStyle:'body',bold:name==='B'}));
  return {
    id:'before-after',title:'FocusOrder - recent work moves to the top',
    description:'Fictional sidebar illustration, not a real application screenshot. Project B moves from second to first after a turn completes.',
    width:1680,height:640,background:d.paper({color:'#FCFCFA'}),
    art:d.path('M65 301 Q264 312 545 298',{color:'#F4D786',width:17,opacity:.7})
      +d.path('M587 146 Q583 309 588 484',{color:'#C9C5B6',width:1.4,opacity:.65})
      +panel(710,['A','B','C'],'B','#F6DE9B')+panel(1220,['B','A','C'],'B','#CFE6D5')
      +d.arrow({from:[1030,399],to:[1200,318],bend:13,width:3.5,head:18})
      +d.path('M1533 241 L1550 233 M1526 223 L1535 207 M1540 261 L1559 263',{color:'#C6A149',width:3}),
    labels:[
      {text:'Local workflow',x:66,y:171,w:475,h:36,size:23,letteringStyle:'upright',color:'#6E7065'},
      {text:'FocusOrder',x:60,y:192,w:505,h:148,size:84,bold:true,letteringStyle:'upright',letterSpacing:-3},
      {text:'Keep active work within reach.',x:66,y:335,w:485,h:57,size:29,letteringStyle:'body'},
      {text:'Recent activity, easier to find.',x:68,y:408,w:480,h:42,size:22,letteringStyle:'body',color:'#6E7065'},
      {text:'Finish a turn in Project B.',x:738,y:102,w:800,h:48,size:29,letteringStyle:'body'},
      {text:'Before',x:730,y:150,w:250,h:44,size:25,letteringStyle:'body',color:'#6E7065'},
      {text:'After',x:1240,y:150,w:250,h:44,size:25,letteringStyle:'body',color:'#6E7065'},
      {text:'Projects',x:735,y:213,w:220,h:44,size:26,letteringStyle:'body',color:'#6E7065'},
      {text:'Projects',x:1245,y:213,w:220,h:44,size:26,letteringStyle:'body',color:'#6E7065'},
      ...rowLabels(710,['A','B','C']),...rowLabels(1220,['B','A','C']),
    ],
    sources:['Fictional FocusOrder example for illustrating a state transition; not a real product or client screenshot.','The before/after explanation pattern and light hand-drawn visual language were informed by the user-provided CodexPulse reference. Geometry is authored for this starter.'],
  };
};
