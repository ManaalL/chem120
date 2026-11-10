/* Chapter 4.6 (Wed Nov 4): Polar bonds and molecular dipoles. Course notes Module 4, pp. 19-20 (section 4.7).
   Partial charges and bond dipoles from electronegativity differences, polar covalent bonds, deciding molecular polarity from the VSEPR shape,
   electrostatic potential maps (Cl2, HCl, H2O), Example 4-9. Module 4 prints no electronegativity values: this chapter uses the Module 3, p. 15 values (C120.chem.EN). */
(function(){
const M=C120;
const EN=M.chem.EN;
const word=(n,w)=>`${n} ${w}${n===1?"":"s"}`;
const bt=(a,b)=>`\\ce{${a}-${b}}`;
/* neutral molecules: [formula, shape, polar?, reason] */
const MOLS=[
  ["CO2","linear",false,"two equal C=O dipoles point in opposite directions and cancel"],
  ["BF3","trigonal planar",false,"three equal B–F dipoles at 120° cancel"],
  ["CH4","tetrahedral",false,"four equal C–H dipoles in a tetrahedron cancel"],
  ["CCl4","tetrahedral",false,"four equal C–Cl dipoles in a tetrahedron cancel"],
  ["SO3","trigonal planar",false,"three equal S–O dipoles at 120° cancel"],
  ["PCl5","trigonal bipyramidal",false,"the axial pair cancels and the three equatorial dipoles cancel"],
  ["XeF2","linear",false,"two equal Xe–F dipoles point opposite ways"],
  ["SF6","octahedral",false,"every S–F dipole is cancelled by the one opposite it"],
  ["XeF4","square planar",false,"opposite Xe–F dipoles cancel in pairs"],
  ["CS2","linear",false,"C and S have the same electronegativity (2.5), and the shape is symmetric anyway"],
  ["CF4","tetrahedral",false,"four equal C–F dipoles in a tetrahedron cancel"],
  ["BCl3","trigonal planar",false,"three equal B–Cl dipoles at 120° cancel"],
  ["Cl2","linear (diatomic)",false,"two identical atoms: no bond dipole at all"],
  ["H2O","bent",true,"the two O–H dipoles both point up toward O and add"],
  ["NH3","trigonal pyramidal",true,"the three N–H dipoles all tilt toward N and add"],
  ["HCl","linear (diatomic)",true,"one polar bond, nothing to cancel it"],
  ["SO2","bent",true,"the two S–O dipoles are not opposite each other"],
  ["CH3Cl","tetrahedral",true,"the C–Cl dipole is much larger than the C–H dipoles, so they can't cancel"],
  ["CH2Cl2","tetrahedral",true,"two C–Cl and two C–H dipoles don't cancel"],
  ["CHCl3","tetrahedral",true,"three C–Cl dipoles and one C–H dipole don't cancel"],
  ["NF3","trigonal pyramidal",true,"the three N–F dipoles tilt the same way"],
  ["PCl3","trigonal pyramidal",true,"the three P–Cl dipoles tilt the same way"],
  ["SF4","see-saw",true,"the lone pair makes the shape lopsided, so the S–F dipoles don't cancel"],
  ["ClF3","T-shaped",true,"the T shape leaves an uncancelled Cl–F dipole"],
  ["BrF5","square pyramidal",true,"the axial Br–F dipole has nothing opposite it"],
  ["H2S","bent",true,"the two S–H dipoles don't point opposite ways"],
  ["OF2","bent",true,"the two O–F dipoles both point outward on the same side"],
  ["HCN","linear",true,"H–C and C≡N dipoles point the same way (both toward N's end)"],
  ["OCS","linear",true,"the C=O dipole is bigger than the C=S dipole (C and S are both 2.5), so they don't cancel"],
  ["POCl3","tetrahedral",true,"the P–O dipole differs from the P–Cl dipoles"],
  ["H2CO","trigonal planar",true,"C=O and C–H dipoles differ"],
  ["COCl2","trigonal planar",true,"C=O and C–Cl dipoles differ"]
];

M.chapter({
  id:"M4C6", module:"m4", n:6, num:"4.6", date:"2026-11-04", added:"2026-10-26", quiz:"PC6",
  title:"Polar bonds and molecular dipoles", pages:"19-20", sections:["4.7"],
  summary:"When two bonded atoms differ in electronegativity, the shared electrons shift toward the more electronegative one, giving partial charges and a bond dipole. A molecule is polar if its bond dipoles, arranged in its VSEPR shape, do not cancel.",
  flags:[],
  formulas:[
    {id:"M4C6.f.partial", name:"Partial charges", tex:"\\text{more electronegative atom: } \\delta^-;\\quad \\text{less electronegative: } \\delta^+", kind:"rule", ref:"p. 19",
      note:"$\\delta$ is usually smaller than the charge of one electron. Electronegativity values: Module 3, p. 15 (Module 4 prints none).",
      blank:{tex:"\\text{the more electronegative atom carries } \\boxed{\\,?\\,}", accept:["δ-","δ−","delta-","delta minus","partial negative","partial negative charge","-δ","−δ","d-"]}},
    {id:"M4C6.f.dipole", name:"Bond dipole moment", tex:"\\mu \\text{ grows with the partial charges } \\delta \\text{ and with the distance between them}", kind:"rule", ref:"p. 19",
      note:"Drawn as an arrow from $\\delta^+$ to $\\delta^-$ with a cross at the $\\delta^+$ tail. The notes give no equation and no units for $\\mu$."},
    {id:"M4C6.f.polar-test", name:"Is the molecule polar?", tex:"\\text{VSEPR shape} + \\text{bond dipoles}:\\ \\text{cancel} \\Rightarrow \\text{non-polar};\\ \\text{don't cancel} \\Rightarrow \\text{polar}", kind:"rule", ref:"p. 19",
      blank:{tex:"\\text{bond dipoles cancel} \\Rightarrow \\boxed{\\,?\\,}", accept:["non-polar","nonpolar","non polar","a non-polar molecule","the molecule is non-polar"]}},
    {id:"M4C6.f.esp", name:"Electrostatic potential maps", tex:"\\text{red: most negative};\\quad \\text{blue: most positive}", kind:"rule", ref:"p. 19"},
    {id:"M4C6.f.polar-strong", name:"Polar bonds are often stronger", tex:"\\text{polar covalent} = \\text{covalent character} + \\text{some ionic character}", kind:"rule", ref:"p. 19",
      note:"Compare H–F (565 kJ mol⁻¹) with H–H (436) and F–F (159) on p. 16."}
  ],
  glossary:[
    {id:"M4C6.t.partial-charge", term:"Partial charge (δ)", def:"A fraction of a charge on a bonded atom, caused by uneven sharing: $\\delta^-$ on the more electronegative atom, $\\delta^+$ on the other.", ref:"p. 19"},
    {id:"M4C6.t.bond-dipole", term:"Bond dipole moment (μ)", def:"The separation of partial charges along a bond. It grows with the size of the partial charges and the distance between them.", ref:"p. 19"},
    {id:"M4C6.t.polar-bond", term:"Polar covalent bond", def:"A covalent bond with a dipole moment: shared unevenly, so it has some ionic character.", ref:"p. 19"},
    {id:"M4C6.t.polar-molecule", term:"Polar molecule", def:"A molecule whose bond dipoles don't cancel, leaving a permanent uneven spread of electron density.", ref:"p. 19"},
    {id:"M4C6.t.nonpolar", term:"Non-polar molecule", def:"A molecule with no net dipole: either no polar bonds, or polar bonds arranged so symmetrically that they cancel.", ref:"p. 19"},
    {id:"M4C6.t.esp", term:"Electrostatic potential map", def:"A picture of a molecule's surface coloured by charge: red where it is most negative, blue where it is most positive.", ref:"p. 19"}
  ],
  figures:{
    polarity:{title:"Bond dipoles and the net dipole", cap:"Arrows point from δ+ to δ−, with lengths set by the electronegativity difference (Module 3, p. 15 values; Xe uses a standard value because the notes print none). The thick arrow is the net dipole. Molecules from pp. 19-20 and Example 4-9, plus a few marked as not in the notes.", ref:"pp. 19-20",
      model:{type:"molecule", params:{molecule:"CO2", dipoles:true, partial:true, choices:["CO2","H2O","HCl","Cl2","BF3","NH3","CH4","CCl4","CH3Cl","CH2Cl2","SO2","SO3","ClF3","BrF5","XeF4","POCl3","OCS","CS2","CH3CN"], fcToggle:false}},
      predict:{q:"Carbon dioxide has two polar C=O bonds. Is the molecule polar?", opts:[["Yes: polar bonds make a polar molecule.",false,"Only if the dipoles don't cancel. Here they are equal and opposite."],["No: the two dipoles are equal and point in opposite directions.",true,"Linear shape, so the C=O dipoles cancel. No net dipole."],["Only at one end.",false,"The molecule is symmetric: both ends are the same."]], check:"With Dipoles on, look for the thick net-dipole arrow. Then pick $\\ce{H2O}$, $\\ce{OCS}$ and $\\ce{CH2Cl2}$."}},
    adder:{title:"Adding bond dipoles", cap:"Bond dipoles add like arrows. Set the angle between two bonds and how strong each dipole is; the dark arrow is their sum. At 180° two equal dipoles cancel. Three equal dipoles at 120° also cancel; change one and they don't.", ref:"p. 19",
      build(host,{PLOT,M}){
        let mode="2", ang=104.5, r2=1, r3=1;
        const svgHost=document.createElement("div"); host.append(svgHost);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Bonds",items:[["2","Two bonds"],["3","Three bonds in a plane"]],value:"2",onchange:v=>{ mode=v; draw(); }});
        const sA=PLOT.slider(ctl,{label:"Angle between the two bonds (°)",min:60,max:180,step:0.5,value:ang,oninput:v=>{ ang=v; draw(); }});
        const sB=PLOT.slider(ctl,{label:"Second (or third) dipole ÷ first",min:0.3,max:1.7,step:0.05,value:1,fmt:v=>(+v).toFixed(2),oninput:v=>{ r2=v; r3=v; draw(); }});
        const out=PLOT.readout(host);
        function arrowSVG(x1,y1,x2,y2,st){ const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L; const hx=x2-ux*12, hy=y2-uy*12;
          return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" style="${st}"/><path d="M ${x2} ${y2} L ${hx-uy*6} ${hy+ux*6} L ${hx+uy*6} ${hy-ux*6} Z" style="${st.replace(/stroke:/,"fill:")}"/>`+`<line x1="${x1+ux*10-uy*6}" y1="${y1+uy*10+ux*6}" x2="${x1+ux*10+uy*6}" y2="${y1+uy*10-ux*6}" style="${st}"/>`; }
        function draw(){
          const W=420,H=300,cx=210,cy=170,S=95;
          const v=[]; if(mode==="2"){ const a=ang*Math.PI/180; v.push([Math.sin(a/2),-Math.cos(a/2),1],[-Math.sin(a/2),-Math.cos(a/2),r2]); }
          else { [90,210,330].forEach((d,i)=>{ const a=d*Math.PI/180; v.push([Math.cos(a),-Math.sin(a),i===2?r3:1]); }); }
          let sx=0,sy=0; v.forEach(([x,y,m])=>{ sx+=x*m; sy+=y*m; }); const net=Math.hypot(sx,sy);
          let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="bond dipoles and their sum">`;
          v.forEach(([x,y,m],i)=>{ g+=`<line x1="${cx}" y1="${cy}" x2="${cx+x*S*1.25}" y2="${cy+y*S*1.25}" style="stroke:var(--fig-axis);stroke-width:5;stroke-linecap:round;opacity:.35"/>`; g+=`<circle cx="${cx+x*S*1.35}" cy="${cy+y*S*1.35}" r="13" style="fill:var(--fig-soft);stroke:var(--fig-axis)"/><text x="${cx+x*S*1.35}" y="${cy+y*S*1.35+4}" text-anchor="middle" class="lbl">X</text>`; g+=arrowSVG(cx+x*18,cy+y*18,cx+x*(18+S*m*0.8),cy+y*(18+S*m*0.8),"stroke:var(--c,var(--accent));stroke-width:2.5"); });
          g+=`<circle cx="${cx}" cy="${cy}" r="15" style="fill:var(--fig-soft);stroke:var(--fig-axis)"/><text x="${cx}" y="${cy+5}" text-anchor="middle" class="lbl">A</text>`;
          if(net>0.03) g+=arrowSVG(cx-sx*S*0.4,cy-sy*S*0.4,cx+sx*S*0.6,cy+sy*S*0.6,"stroke:var(--head);stroke-width:4");
          svgHost.innerHTML=g+`</svg>`;
          sA.closest("div").style.display=mode==="2"?"":"none";
          out.innerHTML=M.rich(`Net dipole: <b>${net<0.03?"0 (the dipoles cancel): non-polar":net.toFixed(2)+" × one bond dipole: polar"}</b>. ${mode==="2"?(Math.abs(ang-180)<0.3&&Math.abs(r2-1)<0.01?"Linear and identical, like $\\ce{CO2}$.":ang<130?"Bent, like $\\ce{H2O}$: the dipoles add.":""):(Math.abs(r3-1)<0.01?"Equal and 120° apart, like $\\ce{BF3}$.":"One different atom, like $\\ce{H2CO}$ or $\\ce{COCl2}$.")} (Here the outer atoms are drawn as the δ− ends.)`);
        }
        draw();
      }}
  },
  gens:[
    {id:"M4C6.g.delta-end", title:"Which end is δ−?", skill:"Compare electronegativities", ref:"p. 19",
      gen(R,d){
        const SETS={1:[["H","Cl"],["C","O"],["N","H"],["O","H"],["C","F"],["H","F"],["C","Cl"],["N","O"],["H","Br"]],
                    2:[["S","O"],["P","Cl"],["B","F"],["C","N"],["Br","Cl"],["S","H"],["I","Cl"],["C","H"],["B","H"],["Se","Cl"]],
                    3:[["C","S"],["P","H"],["N","Cl"],["C","I"],["S","I"],["C","H"],["Br","O"],["As","H"],["Te","H"]]};
        let [a,b]=R.pick(SETS[d]); if(R.int(0,1)) [a,b]=[b,a];
        const ea=EN[a], eb=EN[b]; const corr=ea>eb?0:eb>ea?1:2;
        return {prompt:`In a $${bt(a,b)}$ bond, which atom carries the partial negative charge ($\\delta^-$)?`,
          answer:{type:"mc",options:[`$\\ce{${a}}$`,`$\\ce{${b}}$`,"Neither: the bond is non-polar"],correct:corr,keep:true,why:[`$\\ce{${a}}$: ${ea}`,`$\\ce{${b}}$: ${eb}`,ea===eb?"Equal electronegativities share evenly.":"The two values differ."]},
          hint:"The more electronegative atom pulls the shared pair closer and becomes δ−. Use the Module 3, p. 15 values.",
          steps:[`Electronegativities (Module 3, p. 15): $\\ce{${a}}$ ${ea}, $\\ce{${b}}$ ${eb}.`,corr===2?"They are equal, so the electrons are shared evenly: no partial charges.":`$\\ce{${corr===0?a:b}}$ is more electronegative, so it is $\\delta^-$ and $\\ce{${corr===0?b:a}}$ is $\\delta^+$.`],
          answerTeX:corr===2?"Neither (non-polar)":`$\\ce{${corr===0?a:b}}$`};
      }},
    {id:"M4C6.g.most-polar-bond", title:"Which bond is most polar?", skill:"Largest electronegativity difference", ref:"p. 19",
      gen(R,d){
        const ELS=d===1?["H","C","N","O","F","Cl"]:d===2?["H","B","C","N","O","F","P","S","Cl","Br"]:["H","B","C","N","O","F","P","S","Cl","Br","I","Se","As"];
        let bonds, best, tries=0;
        do{ const set=new Set(); bonds=[]; while(bonds.length<4){ const a=R.pick(ELS), b=R.pick(ELS); if(a===b) continue; const k=[a,b].sort().join("-"); if(set.has(k)) continue; set.add(k); bonds.push([a,b]); }
          const dEN=x=>Math.abs(EN[x[0]]-EN[x[1]]); const ds=bonds.map(dEN); const mx=Math.max(...ds); best=ds.indexOf(mx); if(ds.filter(x=>Math.abs(x-mx)<1e-9).length===1) break; tries++; }
        while(tries<40);
        const dEN=x=>+(Math.abs(EN[x[0]]-EN[x[1]])).toFixed(1);
        return {prompt:"Which bond is the most polar?",
          answer:{type:"mc",options:bonds.map(x=>`$${bt(x[0],x[1])}$`),correct:best,why:bonds.map(x=>`difference $= |${EN[x[0]]} - ${EN[x[1]]}| = ${dEN(x)}$`)},
          hint:"The bigger the electronegativity difference, the more uneven the sharing. Use the Module 3, p. 15 values.",
          steps:[...bonds.map(x=>`$${bt(x[0],x[1])}$: $|${EN[x[0]]} - ${EN[x[1]]}| = ${dEN(x)}$`),`Largest difference: $${bt(bonds[best][0],bonds[best][1])}$.`],
          answerTeX:`$${bt(bonds[best][0],bonds[best][1])}$`};
      }},
    {id:"M4C6.g.polar-molecule", title:"Polar or non-polar?", skill:"Shape plus bond dipoles", ref:"pp. 19-20",
      gen(R,d){
        const easy=["CO2","BF3","CH4","CCl4","H2O","NH3","HCl","Cl2","SO2","SO3","H2S","CF4"];
        const mid=easy.concat(["CH3Cl","CH2Cl2","NF3","PCl3","XeF2","SF6","XeF4","HCN","H2CO","OF2","BCl3"]);
        const pool=MOLS.filter(m=>(d===1?easy:d===2?mid:MOLS.map(x=>x[0])).includes(m[0]));
        const [f,shape,polar,why]=R.pick(pool);
        return {prompt:`Is $\\ce{${f}}$ polar or non-polar?`,
          answer:{type:"mc",options:["Polar","Non-polar"],correct:polar?0:1,keep:true},
          hint:"Find the VSEPR shape first. Then picture each bond dipole as an arrow toward the more electronegative atom and ask whether they cancel.",
          steps:[`Shape of $\\ce{${f}}$: ${shape}.`,`Bond dipoles: ${why}.`,`So $\\ce{${f}}$ is ${polar?"polar":"non-polar"}.`],
          answerTeX:polar?"Polar":"Non-polar"};
      }},
    {id:"M4C6.g.which-polar", title:"Select the polar molecules", skill:"Polarity for several molecules", ref:"pp. 19-20",
      gen(R,d){
        const P=R.shuffle(MOLS.filter(m=>m[2])), N=R.shuffle(MOLS.filter(m=>!m[2]));
        const np=d===1?R.int(1,2):R.int(1,4); const pick=R.shuffle(P.slice(0,np).concat(N.slice(0,5-np)));
        return {prompt:"Which of these molecules are polar? Select all that apply.",
          answer:{type:"multi",options:pick.map(m=>`$\\ce{${m[0]}}$`),correct:pick.map((m,i)=>m[2]?i:-1).filter(i=>i>=0),why:pick.map(m=>`${m[1]}: ${m[3]}.`)},
          hint:"Symmetric shapes with identical outer atoms are non-polar. Lone pairs on the centre or different outer atoms usually make a molecule polar.",
          steps:pick.map(m=>`$\\ce{${m[0]}}$ (${m[1]}): ${m[3]}, so ${m[2]?"polar":"non-polar"}.`),
          answerTeX:pick.filter(m=>m[2]).map(m=>`$\\ce{${m[0]}}$`).join(", ")||"none"};
      }},
    {id:"M4C6.g.central-partial", title:"Is the central atom δ+ or δ−?", skill:"Partial charges in a molecule", ref:"p. 19",
      gen(R,d){
        const P={1:[["H2O","O","H"],["NH3","N","H"],["CCl4","C","Cl"],["CO2","C","O"],["CF4","C","F"],["HCN","C",null]],
                 2:[["OF2","O","F"],["NF3","N","F"],["CH4","C","H"],["PCl3","P","Cl"],["H2S","S","H"],["BF3","B","F"],["SO2","S","O"]],
                 3:[["PH3","P","H"],["CS2","C","S"],["BH3","B","H"],["Cl2O","O","Cl"],["NCl3","N","Cl"],["SCl2","S","Cl"],["CI4","C","I"]]};
        let pool=P[d].filter(x=>x[2]); const [f,c,o]=R.pick(pool);
        const ec=EN[c], eo=EN[o]; const corr=ec<eo?0:ec>eo?1:2;
        return {prompt:`In $\\ce{${f}}$, does the central $\\ce{${c}}$ atom carry a partial positive charge, a partial negative charge, or neither?`,
          answer:{type:"mc",options:["$\\delta^+$","$\\delta^-$","Neither"],correct:corr,keep:true},
          hint:"Compare the central atom's electronegativity with its neighbours' (Module 3, p. 15).",
          steps:[`$\\ce{${c}}$: ${ec}; $\\ce{${o}}$: ${eo}.`,corr===2?`Equal values: the ${c}–${o} bonds are non-polar, so no partial charge.`:corr===0?`$\\ce{${o}}$ is more electronegative, so it pulls electrons away from $\\ce{${c}}$: $\\ce{${c}}$ is $\\delta^+$.`:`$\\ce{${c}}$ is more electronegative than $\\ce{${o}}$, so it pulls electrons toward itself: $\\delta^-$.`],
          answerTeX:["δ+","δ−","neither"][corr]};
      }}
  ],
  exam:[
    {id:"M4C6.q1", ref:"p. 19", q:"In the H–Cl molecule, which description is correct?", opts:[["H is δ− and Cl is δ+.",false,"Cl (3.0) is more electronegative than H (2.1), so Cl is δ−."],["H is δ+ and Cl is δ−; the dipole arrow points from H to Cl.",true,"p. 19 draws exactly this, with the crossed tail at H."],["Both atoms are neutral because the bond is covalent.",false,"Covalent bonds between different atoms are usually polar."],["H carries a full +1 charge.",false,"The partial charge is smaller than one electron's charge."],["The molecule is non-polar because it is linear.",false,"A diatomic with a polar bond has nothing to cancel it."]]},
    {id:"M4C6.q2", ref:"p. 19", q:"How do you decide whether a molecule is polar?", opts:[["It is polar if any bond in it is polar.",false,"$\\ce{CO2}$ has polar bonds but is non-polar."],["Find its VSEPR shape and check whether the bond dipoles cancel.",true,"The green box on p. 19."],["It is polar if it has lone pairs anywhere.",false,"$\\ce{CF4}$ has lone pairs on F and is non-polar."],["It is polar if it contains hydrogen.",false,"$\\ce{CH4}$ is non-polar."],["It is polar if its formula has more than two atoms.",false,"$\\ce{BF3}$ has four atoms and is non-polar."]]},
    {id:"M4C6.q3", ref:"p. 19", q:"In an electrostatic potential map, what do red and blue mean?", opts:[["Red is most negative, blue is most positive.",true,"p. 19."],["Red is most positive, blue is most negative.",false,"Reversed."],["Red is a lone pair, blue is a bond.",false,"The colours show charge, not bonding."],["Red is oxygen, blue is nitrogen.",false,"Those are ball-and-stick colours, not potential-map colours."],["Red is non-polar, blue is polar.",false,"A non-polar molecule like $\\ce{Cl2}$ is one even colour (green)."]]},
    {id:"M4C6.q4", ref:"p. 20", q:"Which molecule from Example 4-9 is non-polar?", opts:[["$\\ce{ClF3}$",false,"T-shaped: the dipoles don't cancel."],["$\\ce{BrF5}$",false,"Square pyramidal: the axial Br–F dipole is not cancelled."],["$\\ce{SO3}$",true,"Trigonal planar with three equal S–O dipoles at 120°: they cancel."],["$\\ce{POCl3}$",false,"Tetrahedral, but P=O and P–Cl dipoles differ."],["$\\ce{CH3CN}$",false,"Linear C–C≡N end with a strong dipole toward N."]]},
    {id:"M4C6.q5", ref:"p. 19", multi:true, q:"Which molecules are polar? Select all that apply.", opts:[["$\\ce{H2O}$",true,"Bent: the O–H dipoles add."],["$\\ce{CCl4}$",false,"Tetrahedral with four identical dipoles: they cancel."],["$\\ce{NH3}$",true,"Trigonal pyramidal: the N–H dipoles add."],["$\\ce{XeF4}$",false,"Square planar: opposite dipoles cancel."],["$\\ce{CH2Cl2}$",true,"Two C–Cl and two C–H dipoles can't cancel."]]},
    {id:"M4C6.q6", ref:"pp. 16, 19", q:"Why is the H–F bond (565 kJ mol⁻¹) stronger than both H–H (436) and F–F (159)?", opts:[["Polar covalent bonds have some ionic character on top of the covalent sharing.",true,"p. 19: polar covalent bonds are often stronger than pure covalent bonds."],["H–F is a double bond.",false,"H forms only one bond."],["F atoms are larger than H atoms.",false,"Size alone would make it weaker, not stronger."],["H–F is non-polar.",false,"It is the most polar bond in the table (4.0 − 2.1)."],["The values are measured at different temperatures.",false,"Not what the notes use to explain the trend."]]},
    {id:"M4C6.q7", ref:"pp. 19-20", q:"$\\ce{CO2}$ and $\\ce{OCS}$ are both linear. Which statement is correct?", opts:[["Both are non-polar.",false,"In OCS the two ends differ."],["Both are polar.",false,"The two C=O dipoles in $\\ce{CO2}$ cancel."],["$\\ce{CO2}$ is non-polar; $\\ce{OCS}$ is polar.",true,"The C=O dipole is not cancelled by C=S, since C and S have the same electronegativity."],["$\\ce{CO2}$ is polar; $\\ce{OCS}$ is non-polar.",false,"Reversed."],["Linear molecules can't be polar.",false,"$\\ce{HCl}$ and $\\ce{HCN}$ are linear and polar."]]}
  ],
  steps:[
    {type:"read", title:"Uneven sharing makes partial charges", ref:"p. 19", body:"<p>When two different atoms share a pair of electrons, the more <b>electronegative</b> one pulls the pair closer. Like a tug-of-war between a strong and a weak team, the rope still connects both, but it sits nearer the strong side.</p><p>That end gets a <b>partial negative charge</b>, $\\delta^-$, and the other end a <b>partial positive charge</b>, $\\delta^+$. Each $\\delta$ is usually smaller than the charge of one electron. The separated charges make a <b>bond dipole moment</b>, $\\mu$, which grows with the size of the partial charges and the distance between them (p. 19).</p><p>A bond with a dipole is a <b>polar covalent bond</b>: covalent, with some ionic character. Polar covalent bonds are often stronger than pure covalent ones (p. 19). Look at p. 16: H–F (565 kJ mol⁻¹) beats both H–H (436) and F–F (159).</p>"},
    {type:"read", title:"Electronegativity values and the dipole arrow", ref:"p. 19", body:"<p>Module 4 prints no electronegativity values. Use the Module 3, p. 15 table:</p><table class=\"cn-table\"><tr><th>H</th><th>B</th><th>C</th><th>N</th><th>O</th><th>F</th><th>P</th><th>S</th><th>Cl</th><th>Br</th><th>I</th></tr><tr><td>2.1</td><td>2.0</td><td>2.5</td><td>3.0</td><td>3.5</td><td>4.0</td><td>2.1</td><td>2.5</td><td>3.0</td><td>2.8</td><td>2.5</td></tr></table><p>A dipole is drawn as an arrow from $\\delta^+$ to $\\delta^-$, with a small cross on the tail at the $\\delta^+$ end (p. 19). In H–Cl the arrow points from H to Cl.</p><p>Watch the ties: C and S are both 2.5, so a C–S bond is non-polar; so are P–H (2.1 and 2.1) and N–Cl (3.0 and 3.0).</p>"},
    {type:"try", title:"Which end is δ−?", gen:"M4C6.g.delta-end"},
    {type:"try", title:"Most polar bond", gen:"M4C6.g.most-polar-bond"},
    {type:"read", title:"Polar bonds do not always make a polar molecule", ref:"p. 19", body:"<div class=\"box def\"><b class=\"t\">How to decide (p. 19)</b>Find the 3D (VSEPR) shape and add up the bond dipoles.<br><b>Cancel:</b> symmetric electron density, a <b>non-polar</b> molecule.<br><b>Don't cancel:</b> a permanent uneven spread, a <b>polar</b> molecule.</div><p>The notes show three cases with electrostatic potential maps (red is most negative, blue most positive): $\\ce{Cl2}$ is evenly green, non-polar; $\\ce{HCl}$ runs from blue at H to red at Cl, polar; $\\ce{H2O}$ is red over O and blue at the two H atoms. Both O–H dipoles point up toward O, so they add: polar.</p><p>Polarity matters because it controls how molecules attract each other, which affects solubility, boiling points and reactivity.</p>"},
    {type:"explore", title:"Watch dipoles add or cancel", fig:"polarity", ref:"pp. 19-20", body:"<p>$\\ce{CO2}$: two big arrows, no net arrow. $\\ce{H2O}$: the arrows add to a net dipole pointing to O's side. Then compare $\\ce{CCl4}$ (cancels) with $\\ce{CH2Cl2}$ (doesn't), and $\\ce{SO3}$ (cancels) with $\\ce{SO2}$ (doesn't).</p>"},
    {type:"explore", title:"Add dipoles by hand", fig:"adder", ref:"p. 19", body:"<p>Two equal dipoles: slide the angle from 180° down. At 180° they cancel; at 104.5° (water's angle, a standard value not from the notes) they add to more than one bond dipole. Now set the angle to 180° and change the second dipole: unequal dipoles never cancel, which is why OCS is polar.</p><p>Switch to three bonds in a plane: equal dipoles at 120° cancel, like $\\ce{BF3}$. Change one and the molecule becomes polar, like $\\ce{H2CO}$.</p>"},
    {type:"mcq", title:"Same shape, different answer", q:"$\\ce{CCl4}$ and $\\ce{CH2Cl2}$ are both tetrahedral. Which is polar?", opts:[["Only $\\ce{CCl4}$",false,"Four identical C–Cl dipoles in a tetrahedron cancel exactly."],["Only $\\ce{CH2Cl2}$",true,"Two C–Cl and two C–H dipoles are different sizes, so they can't cancel."],["Both",false,"$\\ce{CCl4}$ is perfectly symmetric."],["Neither",false,"$\\ce{CH2Cl2}$ has an uneven mix of outer atoms."]], after:"Shape alone isn't enough: the outer atoms must also be identical for the dipoles to cancel."},
    {type:"example", title:"Is SF₄ polar?", ref:"pp. 19-20 (like Example 4-9)", ex:{q:"Sulfur tetrafluoride, $\\ce{SF4}$ (not in the notes): draw the VSEPR structure, name both geometries and decide whether it is polar.", steps:[{t:"Valence electrons: $6 + 4(7) = 34$. Four S–F bonds and three lone pairs on each F use 32; S keeps one lone pair.",why:"S is in period 3, so 10 electrons around it is allowed."},{t:"Groups on S: 4 atoms + 1 lone pair = 5. Electronic geometry: trigonal bipyramidal.",why:"p. 18."},{t:"The lone pair takes an equatorial position: molecular geometry see-saw.",why:"As drawn in the p. 18 table."},{t:"Each S–F bond is polar (S 2.5, F 4.0). The two axial dipoles cancel, but the two equatorial ones point to the same side, away from the lone pair.",why:"They don't cancel."},{t:"Net dipole: polar.",why:"The lone pair makes the shape lopsided."}], ans:"Trigonal bipyramidal electronic geometry, see-saw molecular geometry, polar."}},
    {type:"try", title:"Polar or non-polar?", gen:"M4C6.g.polar-molecule"},
    {type:"example", title:"CS₂ against OCS", ref:"p. 19", ex:{q:"Carbon disulfide ($\\ce{S=C=S}$) and carbonyl sulfide ($\\ce{O=C=S}$) are both linear (neither is in the notes). Which is polar?", steps:[{t:"Both have 2 groups on C and no lone pairs: linear.",why:"Double bonds count once."},{t:"$\\ce{CS2}$: C and S are both 2.5, so the C=S bonds are not even polar. Non-polar.",why:"Module 3, p. 15 values."},{t:"$\\ce{OCS}$: C=O is polar (2.5 vs 3.5) and C=S is not. Nothing cancels the C=O dipole.",why:"Different ends, no symmetry."}], ans:"$\\ce{CS2}$ is non-polar; $\\ce{OCS}$ is polar."}},
    {type:"try", title:"Select the polar molecules", gen:"M4C6.g.which-polar"},
    {type:"try", title:"Charge on the central atom", gen:"M4C6.g.central-partial"},
    {type:"firstline", title:"Find the first mistake", q:"A student decides whether $\\ce{BCl3}$ is polar:", lines:["B has 3 bonded Cl atoms and no lone pairs: 3 groups.","The shape is trigonal planar.","Each B–Cl bond is polar, with Cl as δ− (Cl 3.0, B 2.0).","Because the molecule has polar bonds, it is a polar molecule."], wrong:3, why:"Polar bonds are not enough. Three identical dipoles 120° apart cancel, so $\\ce{BCl3}$ is non-polar, like $\\ce{BF3}$."},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
