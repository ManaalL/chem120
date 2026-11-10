/* Chapter 4.5 (Mon Nov 2): VSEPR, shapes of molecules. Course notes Module 4, pp. 17-18 (section 4.6).
   Electron pairs repel; count groups (bonded atoms + lone pairs); ideal electronic geometry, then molecular geometry from the p. 18 table
   (all 14 rows, including 6 groups with 3 lone pairs drawn T-shaped). The notes print no bond angles: angles here are standard VSEPR values, marked as such. */
(function(){
const M=C120;
const VAL={H:1,B:3,C:4,N:5,O:6,F:7,Si:4,P:5,S:6,Cl:7,Se:6,Br:7,Te:6,I:7,Xe:8,Kr:8,As:5};
const DEMAND={H:1,F:1,Cl:1,Br:1,I:1,O:2,S:2,N:3};
const word=(n,w)=>`${n} ${w}${n===1?"":"s"}`;
/* [groups-lp]: electron geometry, molecular geometry, standard angles (not from the notes) */
const SH={"2-0":["linear","linear","180°"],"3-0":["trigonal planar","trigonal planar","120°"],"3-1":["trigonal planar","bent (V-shaped)","a little under 120°"],
  "4-0":["tetrahedral","tetrahedral","109.5°"],"4-1":["tetrahedral","trigonal pyramidal","a little under 109.5°"],"4-2":["tetrahedral","bent (V-shaped)","a little under 109.5°"],
  "5-0":["trigonal bipyramidal","trigonal bipyramidal","90°, 120° and 180°"],"5-1":["trigonal bipyramidal","see-saw","close to 90° and 120°"],"5-2":["trigonal bipyramidal","T-shaped","close to 90°"],"5-3":["trigonal bipyramidal","linear","180°"],
  "6-0":["octahedral","octahedral","90° and 180°"],"6-1":["octahedral","square pyramidal","close to 90°"],"6-2":["octahedral","square planar","90°"],"6-3":["octahedral","T-shaped","90°"]};
const ACC={"linear":["linear"],"trigonal planar":["trigonal planar","trigonal plane","triangular planar","trigonal"],"bent (V-shaped)":["bent","v-shaped","v shaped","v shape","v","angular","bent (v-shaped)","bent or v-shaped","bent/v-shaped"],
  "tetrahedral":["tetrahedral","tetrahedron"],"trigonal pyramidal":["trigonal pyramidal","trigonal pyramid","pyramidal"],"trigonal bipyramidal":["trigonal bipyramidal","trigonal bipyramid","trigonal bi-pyramidal","tbp"],
  "see-saw":["see-saw","seesaw","see saw","sawhorse"],"T-shaped":["t-shaped","t shaped","t-shape","t shape","t"],"octahedral":["octahedral","octahedron"],"square pyramidal":["square pyramidal","square pyramid"],"square planar":["square planar","square plane"]};
/* species: [formula, centre, outer atoms, charge] */
const POOL={
  1:[["H2O","O",["H","H"],0],["NH3","N",["H","H","H"],0],["CH4","C",["H","H","H","H"],0],["CO2","C",["O","O"],0],["BF3","B",["F","F","F"],0],["H2S","S",["H","H"],0],["PH3","P",["H","H","H"],0],["CCl4","C",["Cl","Cl","Cl","Cl"],0],["NH4^+","N",["H","H","H","H"],1],["H3O^+","O",["H","H","H"],1],["OF2","O",["F","F"],0],["HCN","C",["H","N"],0],["H2CO","C",["H","H","O"],0],["NF3","N",["F","F","F"],0]],
  2:[["SO2","S",["O","O"],0],["SO3","S",["O","O","O"],0],["NO2^-","N",["O","O"],-1],["NO3^-","N",["O","O","O"],-1],["CO3^2-","C",["O","O","O"],-2],["O3","O",["O","O"],0],["PCl5","P",["Cl","Cl","Cl","Cl","Cl"],0],["SF4","S",["F","F","F","F"],0],["ClF3","Cl",["F","F","F"],0],["XeF2","Xe",["F","F"],0],["SF6","S",["F","F","F","F","F","F"],0],["XeF4","Xe",["F","F","F","F"],0],["SOCl2","S",["O","Cl","Cl"],0],["POCl3","P",["O","Cl","Cl","Cl"],0],["ClO3^-","Cl",["O","O","O"],-1],["BrF5","Br",["F","F","F","F","F"],0]],
  3:[["I3^-","I",["I","I"],-1],["ICl4^-","I",["Cl","Cl","Cl","Cl"],-1],["IF5","I",["F","F","F","F","F"],0],["ICl2^-","I",["Cl","Cl"],-1],["BrF4^-","Br",["F","F","F","F"],-1],["IF4^+","I",["F","F","F","F"],1],["ClF2^+","Cl",["F","F"],1],["XeO3","Xe",["O","O","O"],0],["XeOF4","Xe",["O","F","F","F","F"],0],["SeCl4","Se",["Cl","Cl","Cl","Cl"],0],["TeCl4","Te",["Cl","Cl","Cl","Cl"],0],["ClO2^-","Cl",["O","O"],-1],["KrF2","Kr",["F","F"],0],["SO4^2-","S",["O","O","O","O"],-2],["BrF3","Br",["F","F","F"],0],["N3^-","N",["N","N"],-1]]
};
function axe(sp){ const [f,c,L,q]=sp; const dem=L.reduce((t,x)=>t+DEMAND[x],0); const lp=(VAL[c]-q-dem)/2; if(!Number.isInteger(lp)||lp<0) throw new Error("bad lone-pair count for "+f); const g=L.length+lp; return {f,c,L,q,lp,g,dem,key:`${g}-${lp}`}; }
function lpSteps(s){ const parts=s.L.reduce((m,x)=>{ m[x]=(m[x]||0)+1; return m; },{});
  const demTxt=Object.keys(parts).map(x=>`${parts[x]} × ${DEMAND[x]} (${x})`).join(" + ");
  return [`Lone pairs on $\\ce{${s.c}}$: $\\ce{${s.c}}$ has ${VAL[s.c]} valence electrons${s.q?`, ${s.q<0?"plus":"minus"} ${Math.abs(s.q)} for the charge`:""}. The outer atoms use ${demTxt} of them in bonds (H and halogens 1, O 2, N 3). $(${VAL[s.c]-s.q} - ${s.dem})/2 = ${s.lp}$.`,
    `Groups $=$ bonded atoms $+$ lone pairs $= ${s.L.length} + ${s.lp} = ${s.g}$ (a double or triple bond still counts as one group).`]; }

M.chapter({
  id:"M4C5", module:"m4", n:5, num:"4.5", date:"2026-11-02", added:"2026-10-26", quiz:"PC6",
  title:"VSEPR: shapes of molecules", pages:"17-18", sections:["4.6"],
  summary:"Electron groups around a central atom push each other as far apart as possible. Count the groups (bonded atoms + lone pairs) to get the electronic geometry, then look only at the atoms to name the molecular shape.",
  flags:[],
  formulas:[
    {id:"M4C5.f.groups", name:"Counting electron groups", tex:"\\#\\,\\text{groups} = \\#\\,\\text{bonded atoms} + \\#\\,\\text{lone pairs}", ref:"p. 18",
      note:"On the central atom. A double or triple bond goes to one atom, so it counts as one group.",
      blank:{tex:"\\#\\,\\text{groups} = \\#\\,\\text{bonded atoms} + \\boxed{\\,?\\,}", accept:["# lone pairs","lone pairs","number of lone pairs","#lone pairs","the number of lone pairs"]}},
    {id:"M4C5.f.vsepr", name:"VSEPR idea", tex:"\\text{electron pairs around a central atom repel and spread out as far as possible}", kind:"rule", ref:"p. 17"},
    {id:"M4C5.f.steps", name:"Predicting a shape", tex:"\\text{Lewis structure} \\to \\text{count groups} \\to \\text{electronic geometry} \\to \\text{molecular geometry}", kind:"rule", ref:"p. 17"},
    {id:"M4C5.f.electronic", name:"Electronic (ideal) geometries", tex:"2\\!:\\text{linear}\\quad 3\\!:\\text{trigonal planar}\\quad 4\\!:\\text{tetrahedral}\\quad 5\\!:\\text{trigonal bipyramidal}\\quad 6\\!:\\text{octahedral}", kind:"rule", ref:"p. 18",
      blank:{tex:"5\\ \\text{groups} \\to \\boxed{\\,?\\,}", accept:["trigonal bipyramidal","trigonal bipyramid","tbp"]}},
    {id:"M4C5.f.molecular", name:"Molecular geometries with lone pairs", tex:"\\begin{aligned}&3\\!:\\ 1\\,\\text{LP bent}\\\\ &4\\!:\\ 1\\,\\text{LP trigonal pyramidal},\\ 2\\,\\text{LP bent}\\\\ &5\\!:\\ 1\\,\\text{LP see-saw},\\ 2\\,\\text{LP T-shaped},\\ 3\\,\\text{LP linear}\\\\ &6\\!:\\ 1\\,\\text{LP square pyramidal},\\ 2\\,\\text{LP square planar},\\ 3\\,\\text{LP T-shaped}\\end{aligned}", kind:"rule", ref:"p. 18"},
    {id:"M4C5.f.lp-place", name:"Where lone pairs sit", tex:"\\text{5 groups: lone pairs equatorial};\\quad \\text{6 groups: 2 lone pairs opposite each other}", kind:"rule", ref:"p. 18", note:"Shown by the drawings in the p. 18 table; the notes don't state it in words."},
    {id:"M4C5.f.angles", name:"Ideal angles", tex:"180^\\circ\\ (\\text{linear}),\\ 120^\\circ\\ (\\text{trigonal planar}),\\ 109.5^\\circ\\ (\\text{tetrahedral}),\\ 90^\\circ, 120^\\circ\\ (\\text{trig. bipyr.}),\\ 90^\\circ\\ (\\text{octahedral})", kind:"constant", ref:"not from the notes", note:"Standard VSEPR angles, not from the notes: the module prints no bond angles."},
    {id:"M4C5.f.wedge", name:"Wedge and dash", tex:"\\text{solid wedge: toward you};\\quad \\text{dashed wedge: behind the page}", kind:"rule", ref:"p. 18"}
  ],
  glossary:[
    {id:"M4C5.t.vsepr", term:"VSEPR theory", def:"Valence Shell Electron Pair Repulsion: electron groups around a central atom repel and spread out as far as possible, which sets the shape. A model that works best for light p-block atoms.", ref:"p. 17"},
    {id:"M4C5.t.group", term:"Electron group", def:"Anything around the central atom that occupies a direction: a bonded atom (single, double or triple bond) or a lone pair.", ref:"p. 18"},
    {id:"M4C5.t.electronic-geometry", term:"Electronic (ideal) geometry", def:"The arrangement of all the electron groups, lone pairs included.", ref:"p. 17"},
    {id:"M4C5.t.molecular-geometry", term:"Molecular geometry", def:"The arrangement of the atoms only. Lone pairs shape it but are not part of its name.", ref:"p. 17"},
    {id:"M4C5.t.axial-equatorial", term:"Axial and equatorial", def:"In a trigonal bipyramid: the two positions on the vertical axis (axial) and the three around the middle (equatorial).", ref:"p. 18"},
    {id:"M4C5.t.wedge-dash", term:"Wedge-and-dash drawing", def:"A way to draw 3D shapes on paper: plain lines lie in the page, a solid wedge points toward you, a dashed wedge points behind the page.", ref:"p. 18"}
  ],
  figures:{
    shapes:{title:"Every VSEPR shape in 3D", cap:"One example for each row of the p. 18 table. Switch between Electron geometry and Molecular geometry to see the outline through all groups or through the atoms only. Angles shown in the readout are standard VSEPR values, not from the notes.", ref:"pp. 17-18",
      model:{type:"molecule", params:{molecule:"NH3", geo:"electron", choices:["CO2","BF3","SO2","CH4","NH3","H2O","PCl5","SF4","ClF3","XeF2","SF6","BrF5","XeF4","AX3E3"], polarity:false, fcToggle:false}},
      predict:{q:"Ammonia, $\\ce{NH3}$, has four electron groups on N: three bonded H atoms and one lone pair. What is its molecular geometry?", opts:[["Tetrahedral",false,"That is the electronic geometry, which includes the lone pair."],["Trigonal planar",false,"That needs 3 groups with no lone pair, like $\\ce{BF3}$."],["Trigonal pyramidal",true,"The four groups point to the corners of a tetrahedron; the atoms alone form a pyramid with N at the top."],["Bent",false,"Bent from a tetrahedron needs two lone pairs, like $\\ce{H2O}$."]], check:"Toggle Electron geometry and Molecular geometry and watch the outline change. Then try $\\ce{H2O}$ and $\\ce{CH4}$."}},
    builder:{title:"Build your own shape", cap:"Choose how many atoms and lone pairs sit on the central atom (2 to 6 groups in total). The atoms slide to their new positions and the readout names both geometries. Lone pairs take equatorial positions for 5 groups and opposite positions for 6, as drawn on p. 18.", ref:"p. 18",
      model:{type:"molecule", params:{mode:"builder", geo:"electron", polarity:false, fcToggle:false}},
      predict:{q:"A central atom has 4 bonded atoms and 2 lone pairs. What is the molecular geometry?", opts:[["Tetrahedral",false,"Six groups, not four: the electronic geometry is octahedral."],["See-saw",false,"See-saw is 4 atoms and 1 lone pair (5 groups)."],["Square planar",true,"Six groups make an octahedron; the two lone pairs sit opposite each other, leaving the four atoms in a square."],["Square pyramidal",false,"That is 5 atoms and 1 lone pair."]], check:"Set Bonded atoms to 4 and Lone pairs to 2. Then go to 3 and 3 to see the last row of the p. 18 table."}},
    table:{title:"The VSEPR table", cap:"Rows are the number of groups on the central atom; columns are how many of them are lone pairs. Click a shape for its electronic geometry, standard angles (not from the notes) and an example from Module 4.", ref:"p. 18",
      build(host,{PLOT,M}){
        const EX={"2-0":"$\\ce{CO2}$ (p. 17)","3-0":"$\\ce{BF3}$ (Ex. 4-1), $\\ce{SO3}$ (Ex. 4-9)","3-1":"$\\ce{SO2}$ (Ex. 4-8), $\\ce{O3}$ (Ex. 4-6), $\\ce{NO2-}$ (p. 12)","4-0":"$\\ce{CH4}$ (p. 18), $\\ce{CCl4}$ (Ex. 4-1), $\\ce{POCl3}$ (Ex. 4-9)","4-1":"$\\ce{NH3}$ (p. 3), $\\ce{ClO3-}$ (p. 10), $\\ce{SOCl2}$ (Ex. 4-2)","4-2":"$\\ce{H2O}$ (pp. 17, 19)","5-0":"$\\ce{PCl5}$ (not in the notes)","5-1":"$\\ce{SF4}$ (not in the notes)","5-2":"$\\ce{BrF3}$ (Ex. 4-1), $\\ce{ClF3}$ (Ex. 4-9)","5-3":"$\\ce{XeF2}$ (not in the notes)","6-0":"$\\ce{SF6}$ (not in the notes)","6-1":"$\\ce{BrF5}$ (Ex. 4-9)","6-2":"$\\ce{XeF4}$ (Ex. 4-2), $\\ce{ICl4-}$ (Ex. 4-1)","6-3":"no common example"};
        const wrap=document.createElement("div"); wrap.style.overflowX="auto"; host.append(wrap);
        const out=PLOT.readout(host);
        let t=`<table class="cn-table" style="display:table;width:100%"><tr><th>groups</th><th>0 LP</th><th>1 LP</th><th>2 LP</th><th>3 LP</th></tr>`;
        for(let g=2;g<=6;g++){ t+=`<tr><th>${g}</th>`; for(let l=0;l<=3;l++){ const k=`${g}-${l}`; t+=SH[k]&&(g>2||l===0)?`<td><button type="button" class="chip" data-k="${k}" aria-pressed="false">${SH[k][1]}</button></td>`:`<td></td>`; } t+=`</tr>`; }
        wrap.innerHTML=t+`</table>`;
        const show=k=>{ wrap.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===k))); const [g,l]=k.split("-"); const s=SH[k];
          out.innerHTML=M.rich(`<b>${g} groups, ${l} lone pair${l==="1"?"":"s"}</b>: electronic geometry <b>${s[0]}</b>, molecular geometry <b>${s[1]}</b> · ideal angles ${s[2]} (standard VSEPR, not from the notes) · example: ${EX[k]}`); };
        wrap.querySelectorAll("button").forEach(b=>b.onclick=()=>show(b.dataset.k));
        show("4-1");
      }},
    wedge:{title:"Wedge-and-dash drawing of methane", cap:"Two bonds lie in the page, one points toward you (solid wedge) and one points away (dashed wedge). This is how the p. 18 table draws every shape.", ref:"p. 18",
      build(host,{PLOT,M}){
        const W=420,H=230,cx=170,cy=118; let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="Methane drawn with wedges and dashes">`;
        const H1=[cx,cy-80], H2=[cx-88,cy+18], H3=[cx+84,cy-6], H4=[cx+50,cy+76];
        g+=`<line x1="${cx}" y1="${cy-12}" x2="${H1[0]}" y2="${H1[1]+12}" style="stroke:var(--fig-stroke);stroke-width:2.4"/>`;
        g+=`<line x1="${cx-12}" y1="${cy+2}" x2="${H2[0]+12}" y2="${H2[1]-2}" style="stroke:var(--fig-stroke);stroke-width:2.4"/>`;
        for(let i=1;i<=7;i++){ const t=i/8; const x=cx+12+(H3[0]-12-cx-12)*t, y=cy-2+(H3[1]-cy+2)*t; const w=1+t*7; g+=`<line x1="${x}" y1="${y-w}" x2="${x}" y2="${y+w}" style="stroke:var(--fig-stroke);stroke-width:1.6"/>`; }
        const dx=H4[0]-cx, dy=H4[1]-cy, L=Math.hypot(dx,dy), px=-dy/L*9, py=dx/L*9;
        g+=`<path d="M ${cx+dx*0.13} ${cy+dy*0.13} L ${H4[0]-dx*0.12+px} ${H4[1]-dy*0.12+py} L ${H4[0]-dx*0.12-px} ${H4[1]-dy*0.12-py} Z" style="fill:var(--fig-stroke)"/>`;
        g+=`<text x="${cx}" y="${cy+7}" text-anchor="middle" class="lbl" style="font-size:20px">C</text>`;
        [[H1,"H"],[H2,"H"],[H3,"H"],[H4,"H"]].forEach(([p,t])=>{ g+=`<text x="${p[0]}" y="${p[1]+6}" text-anchor="middle" class="lbl" style="font-size:18px">${t}</text>`; });
        g+=`<text x="${H3[0]+16}" y="${H3[1]-14}">dashed wedge: behind the page</text><text x="${H4[0]+16}" y="${H4[1]+6}">solid wedge: toward you</text><text x="${H2[0]-6}" y="${H2[1]+30}">plain lines: in the page</text>`;
        host.insertAdjacentHTML("beforeend",g+`</svg>`);
      }}
  },
  gens:[
    {id:"M4C5.g.count-groups", title:"Count the electron groups", skill:"Bonded atoms + lone pairs", ref:"p. 18",
      gen(R,d){
        const s=axe(R.pick(POOL[d]));
        return {prompt:`In $\\ce{${s.f}}$ (central atom $\\ce{${s.c}}$), how many lone pairs are on the central atom, and how many electron groups surround it?`,
          parts:[{label:"Lone pairs on the centre",answer:{type:"int",value:s.lp}},{label:"Electron groups",answer:{type:"int",value:s.g}}],
          hint:"Draw the Lewis structure, or count: lone pairs on the centre = (valence electrons of the centre − charge − electrons it shares with the outer atoms) ÷ 2. Groups = bonded atoms + lone pairs; a multiple bond counts once.",
          steps:[...lpSteps(s),`Electronic geometry: ${SH[s.key][0]}.`],
          answerTeX:`${word(s.lp,"lone pair")}, ${s.g} groups`, verify:{value:(s.g-s.L.length)}};
      }},
    {id:"M4C5.g.name-shape", title:"Name both geometries", skill:"The p. 18 table", ref:"pp. 17-18",
      gen(R,d){
        const s=axe(R.pick(POOL[d])); const [eg,mg]=SH[s.key];
        return {prompt:`Give the electronic (ideal) geometry and the molecular geometry of $\\ce{${s.f}}$.`,
          parts:[{label:"Electronic geometry",answer:{type:"text",accept:ACC[eg]}},{label:"Molecular geometry",answer:{type:"text",accept:ACC[mg]}}],
          hint:"Count groups on the central atom (atoms + lone pairs) for the electronic geometry. Then name the shape made by the atoms alone.",
          steps:[...lpSteps(s),`${s.g} groups: electronic geometry ${eg}.`,s.lp?`${word(s.lp,"lone pair")} out of ${s.g}: the atoms form a ${mg} shape (p. 18).`:`No lone pairs, so the molecular geometry is also ${mg}.`],
          answerTeX:`${eg}; ${mg}`};
      }},
    {id:"M4C5.g.shape-from-axe", title:"Shape from atoms and lone pairs", skill:"Read the table both ways", ref:"p. 18",
      gen(R,d){
        const keys=Object.keys(SH).filter(k=>{ const [g,l]=k.split("-").map(Number); return d===1?g<=4:d===2?g>=4:g>=5; }).filter(k=>k!=="2-1");
        const k=R.pick(keys); const [g,l]=k.split("-").map(Number); const a=g-l; const [eg,mg]=SH[k];
        return {prompt:`A central atom is bonded to ${word(a,"atom")} and carries ${word(l,"lone pair")}. What is its molecular geometry?`,
          answer:{type:"text",accept:ACC[mg]},
          hint:"Add atoms and lone pairs to get the number of groups and the electronic geometry. Then remove the lone pairs from the picture and name what the atoms make.",
          steps:[`Groups $= ${a} + ${l} = ${g}$: electronic geometry ${eg}.`,l?`${word(l,"lone pair")} ${g===5?"sit in equatorial positions":g===6&&l>=2?"start in opposite (axial) positions":"take one position"} (p. 18 drawings).`:"No lone pairs.",`The ${a} atoms form a ${mg} shape.`],
          answerTeX:mg};
      }},
    {id:"M4C5.g.which-shape", title:"Which of these have this shape?", skill:"Apply VSEPR to several species", ref:"p. 18",
      gen(R,d){
        const all=POOL[1].concat(POOL[2],d===3?POOL[3]:[]).map(axe);
        const targets=[...new Set(all.map(s=>SH[s.key][1]))].filter(mg=>{ const n=all.filter(s=>SH[s.key][1]===mg).length; return n>=1 && n<all.length; });
        const mg=R.pick(targets);
        const yes=R.shuffle(all.filter(s=>SH[s.key][1]===mg)), no=R.shuffle(all.filter(s=>SH[s.key][1]!==mg));
        const ny=Math.min(yes.length,d===1?1:R.int(1,3)); const pick=R.shuffle(yes.slice(0,ny).concat(no.slice(0,5-ny)));
        return {prompt:`Which of these have a ${mg} molecular geometry? Select all that apply.`,
          answer:{type:"multi",options:pick.map(s=>`$\\ce{${s.f}}$`),correct:pick.map((s,i)=>SH[s.key][1]===mg?i:-1).filter(i=>i>=0),why:pick.map(s=>`${s.g} groups, ${word(s.lp,"lone pair")}: ${SH[s.key][1]}.`)},
          hint:"For each one: lone pairs on the central atom, then groups, then the shape of the atoms.",
          steps:pick.map(s=>`$\\ce{${s.f}}$: ${s.L.length} atoms + ${word(s.lp,"lone pair")} = ${s.g} groups, ${SH[s.key][1]}.`),
          answerTeX:pick.filter(s=>SH[s.key][1]===mg).map(s=>`$\\ce{${s.f}}$`).join(", ")};
      }},
    {id:"M4C5.g.ideal-angle", title:"Ideal bond angles", skill:"Standard VSEPR angles (not from the notes)", ref:"p. 18",
      gen(R,d){
        const OPTS=["90°","109.5°","120°","180°"];
        let q,ans,why;
        if(d===1){ const c=R.pick([["linear",3,"Two groups point in opposite directions."],["trigonal planar",2,"Three groups split a circle into thirds."],["tetrahedral",1,"Four groups point to the corners of a tetrahedron."],["octahedral",0,"Six groups along $\\pm x$, $\\pm y$, $\\pm z$: neighbours are 90° apart."]]); q=`What is the ideal angle between two neighbouring bonds in a ${c[0]} electronic geometry with no lone pairs?`; ans=c[1]; why=c[2]; }
        else if(d===2){ const c=R.pick([["$\\ce{XeF4}$","F–Xe–F (neighbouring F atoms)",0,"Square planar: the four F sit at 90° in the plane."],["$\\ce{CO2}$","O–C–O",3,"Linear."],["$\\ce{SO3}$","O–S–O",2,"Trigonal planar."],["$\\ce{CCl4}$","Cl–C–Cl",1,"Tetrahedral."],["$\\ce{SF6}$","F–S–F (neighbouring F atoms)",0,"Octahedral."],["$\\ce{XeF2}$","F–Xe–F",3,"Linear: three equatorial lone pairs leave the two F atoms axial."],["$\\ce{BF3}$","F–B–F",2,"Trigonal planar."]]); q=`What is the ideal ${c[1]} angle in ${c[0]}?`; ans=c[2]; why=c[3]; }
        else { const c=R.pick([["two axial atoms",3,"Axial positions are opposite each other."],["two equatorial atoms",2,"The three equatorial positions split a circle."],["an axial atom and an equatorial atom",0,"The axis is perpendicular to the equatorial plane."]]); q=`In a trigonal bipyramid ($\\ce{PCl5}$), what is the ideal angle between ${c[0]}?`; ans=c[1]; why=c[2]; }
        return {prompt:`${q} (Standard VSEPR angles: the notes print no angles.)`,
          answer:{type:"mc",options:OPTS,correct:ans,keep:true},
          hint:"Electron groups get as far apart as they can: 2 groups 180°, 3 groups 120°, 4 groups 109.5°, 6 groups 90°. A trigonal bipyramid mixes 90°, 120° and 180°.",
          steps:[why,`Ideal angle: ${OPTS[ans]} (standard value, not from the notes).`],
          answerTeX:OPTS[ans]};
      }}
  ],
  exam:[
    {id:"M4C5.q1", ref:"p. 18", q:"How many electron groups are on the C atom in carbon dioxide, O=C=O?", opts:[["2",true,"Two bonded O atoms and no lone pairs. Each double bond counts once."],["4",false,"Double bonds count as one group each, because each goes to one atom."],["3",false,"C has no lone pair here."],["6",false,"That counts the O lone pairs, which are on O, not C."],["8",false,"That is the number of electrons around C, not groups."]]},
    {id:"M4C5.q2", ref:"pp. 17-18", q:"What are the electronic geometry and molecular geometry of water?", opts:[["Tetrahedral; bent",true,"4 groups (2 H, 2 lone pairs): tetrahedral arrangement, bent molecule."],["Linear; linear",false,"That is $\\ce{CO2}$, which has no lone pairs on the centre."],["Trigonal planar; bent",false,"That is $\\ce{SO2}$ (3 groups). O in water has 4."],["Tetrahedral; trigonal pyramidal",false,"Trigonal pyramidal needs 3 atoms and 1 lone pair."],["Bent; tetrahedral",false,"The order is reversed: electronic first, then molecular."]]},
    {id:"M4C5.q3", ref:"p. 18", q:"What is the molecular geometry of xenon tetrafluoride, $\\ce{XeF4}$?", opts:[["Tetrahedral",false,"Xe also has 2 lone pairs: 6 groups."],["See-saw",false,"See-saw is 4 atoms and 1 lone pair."],["Square planar",true,"6 groups, 2 lone pairs opposite each other: the 4 F atoms form a square."],["Square pyramidal",false,"That is 5 atoms and 1 lone pair, like $\\ce{BrF5}$."],["Octahedral",false,"That is the electronic geometry."]]},
    {id:"M4C5.q4", ref:"p. 18", q:"Chlorine trifluoride, $\\ce{ClF3}$, has 3 bonded F atoms and 2 lone pairs on Cl. Its molecular geometry is:", opts:[["Trigonal planar",false,"That needs 3 groups with no lone pairs."],["Trigonal pyramidal",false,"That needs 4 groups."],["T-shaped",true,"5 groups, lone pairs in two equatorial positions: the F atoms form a T."],["See-saw",false,"See-saw has 4 atoms and 1 lone pair."],["Linear",false,"Linear from 5 groups needs 3 lone pairs."]]},
    {id:"M4C5.q5", ref:"p. 18", q:"Which molecule is trigonal pyramidal?", opts:[["$\\ce{BF3}$",false,"Trigonal planar: no lone pair on B."],["$\\ce{SO3}$",false,"Trigonal planar: no lone pair on S."],["$\\ce{NH3}$",true,"3 atoms and 1 lone pair: 4 groups."],["$\\ce{CH4}$",false,"Tetrahedral: 4 atoms, no lone pairs."],["$\\ce{PCl5}$",false,"Trigonal bipyramidal."]]},
    {id:"M4C5.q6", ref:"p. 18", q:"In the p. 18 drawings of trigonal bipyramidal electron geometry, where do lone pairs go?", opts:[["Axial positions first",false,"The drawings keep the two axial positions for atoms in see-saw, T-shaped and linear."],["Equatorial positions",true,"See-saw, T-shaped and linear all have their lone pairs around the middle."],["Anywhere: all five positions are the same",false,"Axial and equatorial positions are not equivalent."],["Lone pairs are not counted for 5 groups",false,"Lone pairs always count as groups."]]},
    {id:"M4C5.q7", ref:"p. 18", multi:true, q:"Which species have an octahedral electronic geometry? Select all that apply.", opts:[["$\\ce{SF6}$",true,"6 atoms, no lone pairs."],["$\\ce{BrF5}$",true,"5 atoms + 1 lone pair = 6 groups."],["$\\ce{XeF4}$",true,"4 atoms + 2 lone pairs = 6 groups."],["$\\ce{PCl5}$",false,"5 groups: trigonal bipyramidal."],["$\\ce{SF4}$",false,"4 atoms + 1 lone pair = 5 groups."]]},
    {id:"M4C5.q8", ref:"p. 18", q:"In a wedge-and-dash drawing, what does a dashed wedge mean?", opts:[["A double bond",false,"Double bonds are drawn as two lines."],["A bond pointing behind the page",true,"p. 18: dashed wedge behind, solid wedge toward you."],["A bond pointing toward you",false,"That is the solid wedge."],["A lone pair",false,"Lone pairs are drawn as dots or lobes."],["A partial bond in a resonance hybrid",false,"Not what the wedge-and-dash convention means."]]}
  ],
  steps:[
    {type:"read", title:"Lewis structures are flat; molecules are not", ref:"p. 17", body:"<p>A Lewis structure shows which atoms are joined, but not the shape in space. Water and carbon dioxide both have three atoms, yet water is <b>bent</b> and carbon dioxide is <b>linear</b> (p. 17). Shape decides how a molecule packs, dissolves and reacts, so we need a way to predict it.</p><p>Tie several balloons together at their necks. They push apart and point in fixed directions: two make a line, three a flat triangle, four a tetrahedron. Electron groups around a central atom do the same.</p>"},
    {type:"read", title:"VSEPR: count the groups", ref:"pp. 17-18", body:"<div class=\"box def\"><b class=\"t\">Key idea (p. 17)</b>Electron pairs around a central atom repel each other and spread out as far as possible.</div><ol><li>Start from a correct Lewis structure.</li><li>Count the <b>groups</b> on the central atom: $\\#\\,\\text{groups} = \\#\\,\\text{bonded atoms} + \\#\\,\\text{lone pairs}$. This gives the <b>electronic (ideal) geometry</b>.</li><li>Use the p. 18 table to get the <b>molecular geometry</b>: the shape of the atoms alone.</li></ol><p>A double or triple bond points to one atom, so it counts as <b>one</b> group. VSEPR is a model: it works best for light p-block atoms (p. 17).</p>"},
    {type:"try", title:"Count the groups", gen:"M4C5.g.count-groups"},
    {type:"read", title:"Five electronic geometries", ref:"p. 18", body:"<table class=\"cn-table\"><tr><th>Groups</th><th>Electronic geometry</th><th>Ideal angles*</th></tr><tr><td>2</td><td>linear</td><td>180°</td></tr><tr><td>3</td><td>trigonal planar</td><td>120°</td></tr><tr><td>4</td><td>tetrahedral</td><td>109.5°</td></tr><tr><td>5</td><td>trigonal bipyramidal</td><td>90° (axial to equatorial), 120° (equatorial), 180° (axial)</td></tr><tr><td>6</td><td>octahedral</td><td>90°, 180°</td></tr></table><p class=\"small\">*Standard VSEPR angles, not from the notes: the notes print no bond angles.</p><p>In a trigonal bipyramid the positions are not all the same: two <b>axial</b> (top and bottom) and three <b>equatorial</b> (around the middle).</p>"},
    {type:"explore", title:"Turn every shape", fig:"shapes", ref:"pp. 17-18", body:"<p>Use the list to go row by row through the p. 18 table. For each one, read the group count in the readout, then toggle between the two geometries. Lone pairs are part of the electronic geometry but not part of the molecular geometry's name.</p>"},
    {type:"read", title:"Lone pairs change the name, not the arrangement", fig:"table", ref:"p. 18", body:"<p>The groups always take the same positions; lone pairs just make some of them invisible in the shape. With 4 groups: 0 lone pairs is tetrahedral, 1 is trigonal pyramidal ($\\ce{NH3}$), 2 is bent ($\\ce{H2O}$).</p><p>Watch where the lone pairs go in the p. 18 drawings. With 5 groups they take <b>equatorial</b> positions, giving see-saw (1), T-shaped (2) and linear (3). With 6 groups the first two sit <b>opposite</b> each other, giving square pyramidal (1) and square planar (2). The table's last row, 6 groups with 3 lone pairs, is drawn T-shaped; there is no common example.</p>"},
    {type:"example", title:"The shape of IF₅", ref:"p. 18 (like Example 4-9)", ex:{q:"Predict the electronic and molecular geometry of iodine pentafluoride, $\\ce{IF5}$.", steps:[{t:"Valence electrons: $7 + 5(7) = 42$. Five I–F bonds and three lone pairs on each F use $10 + 30 = 40$.",why:"Outer atoms first, as in Method 1."},{t:"The last 2 electrons are one lone pair on I. I has 12 electrons: an expanded octet.",why:"I is in period 5, so this is allowed."},{t:"Groups on I: 5 atoms + 1 lone pair = 6. Electronic geometry: octahedral.",why:"Count atoms, not bonds or electrons."},{t:"One position is a lone pair, so the five F atoms form a square pyramid.",why:"p. 18: 6 groups with 1 lone pair."}], ans:"Octahedral electronic geometry; square pyramidal molecular geometry."}},
    {type:"try", title:"Name both geometries", gen:"M4C5.g.name-shape"},
    {type:"explore", title:"Build any shape", fig:"builder", ref:"p. 18", body:"<p>Start at 4 bonded atoms, 0 lone pairs, then swap atoms for lone pairs one at a time. Do the same from 5 and from 6 groups. Each step down the row of the table removes one atom and keeps the arrangement.</p>"},
    {type:"try", title:"Shape from atoms and lone pairs", gen:"M4C5.g.shape-from-axe"},
    {type:"read", title:"Drawing 3D on paper", fig:"wedge", ref:"p. 18", body:"<p>The p. 18 table draws every shape with three kinds of bond line. A plain line lies in the page. A <b>solid wedge</b> points out of the page toward you. A <b>dashed wedge</b> points behind the page. Methane, drawn this way, shows its tetrahedral shape on flat paper.</p>"},
    {type:"example", title:"The shape of the chlorite ion, ClO₂⁻", ref:"pp. 17-18", ex:{q:"Predict the molecular geometry of $\\ce{ClO2-}$.", steps:[{t:"Valence electrons: $7 + 2(6) + 1 = 20$.",why:"Add one for the negative charge."},{t:"Cl in the middle with single bonds to both O and 3 lone pairs on each O: $4 + 12 = 16$ electrons. The other 4 are 2 lone pairs on Cl.",why:"Turning an O lone pair into a Cl=O bond (which lowers the formal charges) doesn't change the number of lone pairs on Cl."},{t:"Groups: 2 atoms + 2 lone pairs = 4. Electronic geometry: tetrahedral.",why:"Double bonds count once."},{t:"Molecular geometry: bent.",why:"Two of the four tetrahedral positions are lone pairs."}], ans:"Tetrahedral electronic geometry, bent molecular geometry."}},
    {type:"try", title:"Which have this shape?", gen:"M4C5.g.which-shape"},
    {type:"firstline", title:"Find the first mistake", q:"A student predicts the shape of formaldehyde, $\\ce{H2C=O}$:", lines:["C is bonded to two H atoms and one O atom and has no lone pairs.","The C=O double bond counts as two groups, so C has 4 groups.","4 groups: tetrahedral electronic geometry.","No lone pairs, so the molecule is tetrahedral."], wrong:1, why:"A double bond goes to one atom, so it is one group. C has 3 groups: trigonal planar, with ideal angles of 120° (standard value, not from the notes)."},
    {type:"try", title:"Ideal angles", gen:"M4C5.g.ideal-angle"},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
