/* Chapter 4.1 (Mon Oct 26): Octet rule, Lewis structures and formal charge. Course notes Module 4, pp. 1-5 (sections 4.1 and 4.2, Method 1).
   Octet rule, ionic vs covalent bonding, Lewis symbols, Method 1 for drawing Lewis structures, the formal charge formula (p. 4) and the rules for picking the best structure. */
(function(){
const M=C120;
const VAL={H:1,Li:1,Na:1,K:1,Rb:1,Be:2,Mg:2,Ca:2,Sr:2,Ba:2,B:3,Al:3,C:4,Si:4,N:5,P:5,O:6,S:6,Se:6,F:7,Cl:7,Br:7,I:7,Xe:8};
const GROUP={H:1,Li:1,Na:1,K:1,Rb:1,Be:2,Mg:2,Ca:2,Sr:2,Ba:2,B:13,Al:13,C:14,Si:14,N:15,P:15,O:16,S:16,Se:16,F:17,Cl:17,Br:17,I:17,Xe:18};
const tm=n=>n<0?`-${-n}`:n>0?`+${n}`:"0";            /* signed number for TeX */
const word=(n,w)=>`${n} ${w}${n===1?"":"s"}`;
const ORD_NAME={1:"single",2:"double",3:"triple"};
/* describe a set of bonds like {1:2,2:1} as "one double bond and two single bonds" */
const NUMW=["no","one","two","three","four","five","six"];
function bondWords(b){ const parts=[]; [3,2,1].forEach(o=>{ if(b[o]) parts.push(`${NUMW[b[o]]} ${ORD_NAME[o]} bond${b[o]>1?"s":""}`); }); if(!parts.length) return "no bonds"; return parts.length>1?parts.slice(0,-1).join(", ")+" and "+parts[parts.length-1]:parts[0]; }

M.chapter({
  id:"M4C1", module:"m4", n:1, num:"4.1", date:"2026-10-26", added:"2026-10-26", quiz:"PC5",
  title:"Octet rule, Lewis structures and formal charge", pages:"1-5", sections:["4.1","4.2"],
  summary:"Atoms bond so that each one ends up with a noble-gas arrangement: by transferring electrons (ionic bonds) or by sharing pairs (covalent bonds). A Lewis structure shows the shared pairs and lone pairs, and formal charge, $\\text{FC} = V - (L + \\tfrac{1}{2}B)$, tells you which structure is most reasonable.",
  flags:[],
  formulas:[
    {id:"M4C1.f.octet", name:"Octet rule", tex:"\\text{atoms gain, lose or share electrons to reach the nearest noble-gas configuration } (ns^2np^6)", kind:"rule", ref:"p. 1", note:"Every noble gas except He has $ns^2np^6$ in its valence shell: 8 electrons, an octet."},
    {id:"M4C1.f.ionic-covalent", name:"Ionic or molecular?", tex:"\\text{s-block metal + p-block atom (esp. groups 16, 17)} \\to \\text{ionic};\\quad \\text{p-block + p-block} \\to \\text{covalent}", kind:"rule", ref:"p. 1"},
    {id:"M4C1.f.valence", name:"Valence electrons of a main-group atom", tex:"\\text{valence } e^- = \\text{group number (1, 2, or 13 to 18 minus 10)}", kind:"rule", ref:"p. 3", note:"Groups 1, 2, 13, 14, 15, 16, 17, 18 have 1, 2, 3, 4, 5, 6, 7, 8 valence electrons. For an ion, add one electron per negative charge and remove one per positive charge."},
    {id:"M4C1.f.formal-charge", name:"Formal charge", tex:"\\text{FC}(X) = V_X - \\left(L_X + \\tfrac{1}{2}B_X\\right)", ref:"p. 4",
      note:"$V$ = valence electrons X brings (group number). X \"owns\" all its lone-pair electrons $L$ and half of its bonding electrons $B$. The notes write this in words; the symbols are this site's.",
      blank:{tex:"\\text{FC}(X) = V_X - \\left(L_X + \\boxed{\\,?\\,}\\right)", accept:["B/2","1/2B","1/2 B","½B","B_X/2","(1/2)B","0.5B","half the bonding electrons","half of B"]}},
    {id:"M4C1.f.fc-sum", name:"Formal charges add up to the charge", tex:"\\sum \\text{FC} = \\text{overall charge of the molecule or ion}", kind:"rule", ref:"p. 4",
      blank:{tex:"\\sum \\text{FC} = \\boxed{\\,?\\,}", accept:["overall charge","the overall charge","total charge","charge","the charge","net charge","charge on the ion"]}},
    {id:"M4C1.f.limits", name:"How many electrons an atom can hold", tex:"\\text{H}: \\le 2;\\quad \\text{2nd row}: \\le 8;\\quad \\text{3rd period and beyond: may exceed } 8", kind:"rule", ref:"p. 4",
      note:"H forms one bond and is always terminal. C, N, O and F almost never have fewer than 8 electrons around them."},
    {id:"M4C1.f.best", name:"Choosing the best structure", tex:"\\text{smallest FCs; } -\\text{FC on the more electronegative atom; no like charges side by side}", kind:"rule", ref:"p. 4",
      note:"Formal charges almost never go beyond $\\pm1$. Structures with $\\pm2$ or more are usually not important."}
  ],
  glossary:[
    {id:"M4C1.t.octet", term:"Octet", def:"The 8 valence electrons ($ns^2np^6$) that every noble gas except He has. Main-group atoms tend to reach this arrangement when they bond.", ref:"p. 1"},
    {id:"M4C1.t.ionic-bond", term:"Ionic bond", def:"The electrostatic attraction between a cation and an anion formed when electrons move from one atom to another.", ref:"p. 1"},
    {id:"M4C1.t.covalent-bond", term:"Covalent bond", def:"A shared pair of electrons between two atoms. Two shared pairs make a double bond, three a triple bond.", ref:"p. 1"},
    {id:"M4C1.t.main-group", term:"Main-group elements", def:"The s-block and p-block elements. Module 4 deals only with compounds of these.", ref:"p. 1"},
    {id:"M4C1.t.lewis-symbol", term:"Lewis symbol", def:"An element symbol with its valence electrons drawn as dots around it.", ref:"p. 3"},
    {id:"M4C1.t.lewis-structure", term:"Lewis structure", def:"A drawing of how atoms are bonded: each line is a bonding pair, each pair of dots is a lone pair, and non-zero formal charges are always shown.", ref:"p. 3"},
    {id:"M4C1.t.lone-pair", term:"Lone pair", def:"A pair of valence electrons on one atom that is not shared in a bond. Drawn as two dots.", ref:"p. 3"},
    {id:"M4C1.t.formal-charge", term:"Formal charge", def:"The charge an atom would have if it kept all its lone-pair electrons and exactly half of its bonding electrons. A bookkeeping tool, not the real charge on the atom.", ref:"p. 4"},
    {id:"M4C1.t.expanded-octet", term:"Expanded octet", def:"More than 8 valence electrons around an atom. Only atoms from the 3rd period and beyond can do this.", ref:"p. 4"}
  ],
  figures:{
    symbols:{title:"Lewis symbols", cap:"Each dot is one valence electron, and the number of dots is the group number. Dots go on one at a time, one per side, before any pair up. Switch to period 3: the same group has the same pattern.", ref:"p. 3",
      build(host,{PLOT,M}){
        const P2=["Li","Be","B","C","N","O","F","Ne"], P3=["Na","Mg","Al","Si","P","S","Cl","Ar"], G=[1,2,13,14,15,16,17,18];
        let row=P2; const svgHost=document.createElement("div"); host.append(svgHost);
        const ctl=PLOT.controls(host); PLOT.seg(ctl,{label:"Period",items:[["2","Period 2"],["3","Period 3"]],value:"2",onchange:v=>{ row=v==="2"?P2:P3; draw(); }});
        /* singles fill right, left, top, bottom; then pairs form top, bottom, left, right */
        const SIDES={r:[1,0],l:[-1,0],t:[0,-1],b:[0,1]};
        function dotsFor(n){ const cnt={r:0,l:0,t:0,b:0}; ["r","l","t","b"].slice(0,Math.min(4,n)).forEach(s=>cnt[s]=1); ["t","b","l","r"].slice(0,Math.max(0,n-4)).forEach(s=>cnt[s]=2); return cnt; }
        function draw(){
          const W=640,H=150,cw=W/8; let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="Lewis symbols for period ${row===P2?2:3}">`;
          row.forEach((el,i)=>{ const cx=cw*i+cw/2, cy=62, n=i<2?i+1:i+1; const ve=[1,2,3,4,5,6,7,8][i]; const cnt=dotsFor(ve);
            g+=`<text x="${cx}" y="${cy+7}" text-anchor="middle" class="lbl" style="font-size:20px">${el}</text>`;
            Object.keys(cnt).forEach(s=>{ const [dx,dy]=SIDES[s]; const k=cnt[s]; if(!k) return; const rx=cx+dx*(el.length>1?21:16), ry=cy+dy*19;
              const off=k===2?[-4.5,4.5]:[0]; off.forEach(o=>{ const px=dy?rx+o:rx, py=dy?ry:ry+o; g+=`<circle cx="${px}" cy="${py}" r="2.6" style="fill:var(--c,var(--accent))"/>`; }); });
            g+=`<text x="${cx}" y="112" text-anchor="middle">group ${G[i]}</text><text x="${cx}" y="130" text-anchor="middle">${ve} e⁻</text>`; });
          svgHost.innerHTML=g+`</svg>`;
        }
        draw();
      }},
    fcCalc:{title:"Formal charge bookkeeping", cap:"Pick an atom, then set its bonds and lone pairs. The atom owns all of its lone-pair electrons and half of its bonding electrons; formal charge is what it brought minus what it owns (p. 4). Find the settings that give a formal charge of 0 for each atom.", ref:"pp. 4-6",
      build(host,{PLOT,M}){
        const EL={B:3,C:4,N:5,O:6,F:7,P:5,S:6,Cl:7}; const ROW2=new Set(["B","C","N","O","F"]);
        let el="N", s=3, d=0, t=0, lp=1;
        const svgHost=document.createElement("div"); host.append(svgHost);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Atom",items:Object.keys(EL).map(k=>[k,k]),value:el,onchange:v=>{ el=v; draw(); }});
        const sS=PLOT.slider(ctl,{label:"Single bonds",min:0,max:6,value:s,oninput:v=>{ s=v; draw(); }});
        const sD=PLOT.slider(ctl,{label:"Double bonds",min:0,max:3,value:d,oninput:v=>{ d=v; draw(); }});
        const sT=PLOT.slider(ctl,{label:"Triple bonds",min:0,max:2,value:t,oninput:v=>{ t=v; draw(); }});
        const sL=PLOT.slider(ctl,{label:"Lone pairs",min:0,max:4,value:lp,oninput:v=>{ lp=v; draw(); }});
        const out=PLOT.readout(host);
        function draw(){
          const V=EL[el], bo=s+2*d+3*t, L=2*lp, B=2*bo, own=L+B/2, fc=V-own, around=L+B, dom=s+d+t+lp;
          const W=360,H=220,cx=W/2,cy=H/2; let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${el} with ${s} single, ${d} double, ${t} triple bonds and ${lp} lone pairs">`;
          const items=[]; for(let i=0;i<t;i++) items.push(3); for(let i=0;i<d;i++) items.push(2); for(let i=0;i<s;i++) items.push(1); for(let i=0;i<lp;i++) items.push(0);
          const n=items.length;
          items.forEach((o,i)=>{ const a=-Math.PI/2+2*Math.PI*i/Math.max(1,n); const ux=Math.cos(a), uy=Math.sin(a), px=-uy, py=ux;
            if(o===0){ [-5,5].forEach(k=>{ g+=`<circle cx="${cx+ux*34+px*k}" cy="${cy+uy*34+py*k}" r="3.2" style="fill:var(--c,var(--accent))"/>`; }); }
            else { const offs=o===1?[0]:o===2?[-4,4]:[-7,0,7]; offs.forEach(k=>{ g+=`<line x1="${cx+ux*22+px*k}" y1="${cy+uy*22+py*k}" x2="${cx+ux*72+px*k}" y2="${cy+uy*72+py*k}" style="stroke:var(--fig-stroke);stroke-width:2.2"/>`; });
              g+=`<circle cx="${cx+ux*84}" cy="${cy+uy*84}" r="9" style="fill:var(--fig-soft);stroke:var(--fig-axis)"/>`; } });
          g+=`<text x="${cx}" y="${cy+8}" text-anchor="middle" class="lbl" style="font-size:22px">${el}</text>`;
          if(fc) g+=`<text x="${cx+18}" y="${cy-10}" class="lblc" style="font-size:14px">${fc>0?"+"+fc:"−"+(-fc)}</text>`;
          svgHost.innerHTML=g+`</svg>`;
          let note="";
          if(dom>6) note="More than six groups around one atom never happens in this course.";
          else if(ROW2.has(el) && around>8) note=`Not allowed: ${el} is a 2nd-row atom and never holds more than 8 electrons (p. 4).`;
          else if(around>8) note=`Expanded octet: ${around} electrons. Allowed for ${el}, a 3rd-period atom (p. 4).`;
          else if(el==="B" && around===6 && fc===0) note="Boron's usual pattern: 3 bonds, no lone pairs, only 6 electrons (pp. 6-7).";
          else if(around<8 && ROW2.has(el)) note=`Only ${around} electrons around ${el}. C, N, O and F almost never have fewer than 8 (p. 4).`;
          else if(around===8 && fc===0) note="An octet with formal charge 0: one of the ideal fragments on p. 6.";
          else if(around===8) note=`An octet, but formal charge ${fc>0?"+"+fc:"−"+(-fc)}.`;
          out.innerHTML=M.rich(`$V = ${V}$ (group number) &nbsp; $L = ${L}$ &nbsp; $B = ${B}$<br>owned $= L + \\tfrac12 B = ${L} + ${B/2} = ${own}$<br><b>FC $= ${V} - ${own} = ${tm(fc)}$</b> &nbsp; electrons around ${el}: $L + B = ${around}$<br>${note}`);
        }
        draw();
      }},
    co:{title:"Formal charges in 3D", cap:"Small molecules and ions from Module 4 with their formal charges shown. Lines are bonding pairs; the pale lobes with two dots are lone pairs. Pick another species from the list and check that the formal charges add up to the overall charge.", ref:"pp. 3-4",
      model:{type:"molecule", params:{molecule:"CO", fc:true, choices:["CO","HCN","OCNm","H2CO","NH3","CO2","CCl4"], polarity:false, geoToggle:false}},
      predict:{q:"Carbon monoxide is drawn as $\\ce{C#O}$ with one lone pair on each atom. Which atom carries the negative formal charge?", opts:[["C",true,"C: $4 - (2 + \\tfrac12\\cdot 6) = -1$. C brought 4 electrons but owns 5."],["O",false,"O: $6 - (2 + 3) = +1$. O brought 6 but owns only 5, so it is $+1$ even though it is the more electronegative atom."],["Neither: both are 0",false,"Count them: C owns $2 + 3 = 5$ (brought 4), O owns $2 + 3 = 5$ (brought 6)."]], check:"Make sure Formal charges is on and read the small labels. Then pick the cyanate ion and see where its $-1$ sits."}}
  },
  gens:[
    {id:"M4C1.g.valence-total", title:"Count the valence electrons", skill:"Group numbers, then adjust for the charge", ref:"pp. 3-4",
      gen(R,d){
        const POOL={1:["H2O","NH3","CH4","HCN","CO2","H2CO","H2S","NF3","CS2","OF2","PCl3","HOCl","C2H4","SiF4"],
                    2:["NH4^+","OH^-","CN^-","H3O^+","NO^+","NO2^-","ClO^-","BH4^-","NH2^-","SCN^-","CO3^2-","NO3^-","SO3^2-","N3^-"],
                    3:["SO4^2-","PO4^3-","ClO4^-","C2H5OH","CH3COO^-","HCO3^-","H2PO4^-","XeF4","SF6","IF5","BrF4^-","IO3^-","SeO3^2-","C3H6O"]};
        const f=R.pick(POOL[d]); const sp=window.MC.parseSpecies(f);
        const els=Object.keys(sp.counts); const lines=[]; let tot=0;
        els.forEach(e=>{ const n=sp.counts[e], v=VAL[e]; tot+=n*v; lines.push(`$\\ce{${e}}$: group ${GROUP[e]}, so ${v} each; $${n}\\times${v} = ${n*v}$`); });
        const q=sp.charge; const total=tot-q;
        const steps=[...lines,`Sum for the neutral atoms: $${tot}$.`];
        if(q<0) steps.push(`A charge of $${q}$ means ${word(-q,"extra electron")}: $${tot} + ${-q} = ${total}$.`);
        else if(q>0) steps.push(`A charge of $+${q}$ means ${word(q,"electron")} removed: $${tot} - ${q} = ${total}$.`);
        steps.push(`Total valence electrons: $${total}$ (that is ${total/2} pairs to place).`);
        /* independent count: electrons = protons in valence shells minus charge, summed element by element in a different order */
        const alt=els.slice().reverse().reduce((t,e)=>t+VAL[e]*sp.counts[e],0)-q;
        return {prompt:`How many valence electrons must be shown in the Lewis structure of $\\ce{${f}}$?`,
          answer:{type:"int",value:total},
          hint:"Valence electrons = group number for each atom (1, 2, then 13 to 18 give 3 to 8). Add one electron for each negative charge; take one away for each positive charge.",
          steps, answerTeX:`$${total}$ valence electrons`, verify:{value:alt}};
      }},
    {id:"M4C1.g.formal-charge", title:"Formal charge on one atom", skill:"$\\text{FC} = V - (L + \\tfrac12 B)$", ref:"p. 4",
      gen(R,d){
        let el, b, lp;
        if(d===1){ const o=R.pick([["C",4,0],["C",3,1],["C",3,0],["N",3,1],["N",4,0],["N",2,2],["O",2,2],["O",3,1],["O",1,3],["F",1,3],["B",3,0],["B",4,0]]); el=o[0]; b={1:o[1],2:0,3:0}; lp=o[2]; }
        else if(d===2){ el=R.pick(["C","N","O","N","O","S"]); const pat=R.pick([[0,1,0],[1,1,0],[2,1,0],[0,2,0],[1,0,1],[0,0,1],[3,0,0],[4,0,0],[2,0,0],[1,0,0]]); b={1:pat[0],2:pat[1],3:pat[2]};
          const bo=pat[0]+2*pat[1]+3*pat[2]; lp=Math.max(0,4-bo); if(el==="C" && R.int(0,1)) lp=Math.max(0,lp-1); }
        else { const opts=[["S",{1:2,2:2,3:0},0],["S",{1:4,2:0,3:0},0],["S",{1:2,2:1,3:0},1],["P",{1:4,2:0,3:0},0],["P",{1:3,2:1,3:0},0],["Cl",{1:1,2:3,3:0},0],["Cl",{1:3,2:0,3:0},1],["Cl",{1:4,2:0,3:0},0],["I",{1:4,2:0,3:0},2],["Br",{1:3,2:0,3:0},2],["Xe",{1:4,2:0,3:0},2],["Xe",{1:2,2:0,3:0},3],["S",{1:4,2:0,3:0},1],["S",{1:0,2:3,3:0},0],["I",{1:2,2:0,3:0},3]];
          const o=R.pick(opts); el=o[0]; b=o[1]; lp=o[2]; }
        const V=VAL[el], bo=b[1]+2*b[2]+3*b[3], L=2*lp, B=2*bo, fc=V-(L+B/2);
        return {prompt:`In a Lewis structure, ${/^[AEIOU]/.test(el)?"an":"a"} $\\ce{${el}}$ atom has ${bondWords(b)} and ${word(lp,"lone pair")}. What is its formal charge?`,
          answer:{type:"int",value:fc},
          hint:"FC = (valence electrons the atom brings) − (lone-pair electrons + half the bonding electrons).",
          steps:[`$\\ce{${el}}$ is in group ${GROUP[el]}: $V = ${V}$.`,`Lone-pair electrons: $L = 2\\times${lp} = ${L}$.`,`Bonding electrons: ${bondWords(b)} hold $B = ${B}$ electrons; the atom owns half, $${B/2}$.`,`$\\text{FC} = ${V} - (${L} + ${B/2}) = ${tm(fc)}$`],
          answerTeX:`$${tm(fc)}$`, verify:{value:V-2*lp-bo}};
      }},
    {id:"M4C1.g.bond-lone-pairs", title:"Bonding pairs and lone pairs", skill:"Method 1 from start to finish", ref:"pp. 3-4",
      gen(R,d){
        /* [formula, bonding pairs, lone pairs, structure in words] */
        const POOL={1:[["H2O",2,2,"two O–H bonds; O has two lone pairs"],["NH3",3,1,"three N–H bonds; N has one lone pair"],["HF",1,3,"one H–F bond; F has three lone pairs"],["CH4",4,0,"four C–H bonds"],["H2S",2,2,"two S–H bonds; S has two lone pairs"],["PH3",3,1,"three P–H bonds; P has one lone pair"],["HCl",1,3,"one H–Cl bond; Cl has three lone pairs"],["N2",3,2,"$\\ce{N#N}$; one lone pair on each N"]],
                    2:[["HCN",4,1,"$\\ce{H-C#N}$; one lone pair on N"],["H2CO",4,2,"C=O plus two C–H; two lone pairs on O"],["C2H2",5,0,"$\\ce{H-C#C-H}$"],["C2H4",6,0,"C=C plus four C–H"],["CS2",4,4,"S=C=S; two lone pairs on each S"],["OF2",2,8,"two O–F; O has 2 lone pairs, each F has 3"],["HOCl",2,5,"H–O–Cl; O has 2 lone pairs, Cl has 3"],["NF3",3,10,"three N–F; N has 1 lone pair, each F has 3"]],
                    3:[["CH3OH",5,2,"three C–H, C–O, O–H; two lone pairs on O"],["N2H4",5,2,"N–N, four N–H; one lone pair on each N"],["H2O2",3,4,"H–O–O–H; two lone pairs on each O"],["HCOOH",5,4,"C–H, C=O, C–O, O–H; two lone pairs on each O"],["CH3CN",7,1,"three C–H, C–C, $\\ce{C#N}$; one lone pair on N"],["COCl2",4,8,"C=O and two C–Cl; O has 2 lone pairs, each Cl has 3"],["NOCl",3,6,"Cl–N=O; N has 1 lone pair, O 2, Cl 3"],["PCl3",3,10,"three P–Cl; P has 1 lone pair, each Cl has 3"],["CCl4",4,12,"four C–Cl; each Cl has 3 lone pairs"]]};
        const [f,bp,lpn,desc]=R.pick(POOL[d]); const sp=window.MC.parseSpecies(f);
        const tot=Object.keys(sp.counts).reduce((t,e)=>t+VAL[e]*sp.counts[e],0)-sp.charge;
        if(2*(bp+lpn)!==tot) throw new Error(`electron count mismatch for ${f}`);
        return {prompt:`Draw the Lewis structure of $\\ce{${f}}$ (every atom with formal charge 0). How many bonding pairs and how many lone pairs does it have in total?`,
          parts:[{label:"Bonding pairs",answer:{type:"int",value:bp}},{label:"Lone pairs (all atoms)",answer:{type:"int",value:lpn}}],
          hint:"Count the valence electrons first. Every pair is either a bonding pair (a line) or a lone pair (two dots), so bonding pairs + lone pairs = total ÷ 2. A double bond is 2 bonding pairs; a triple bond is 3.",
          steps:[`Valence electrons: $${tot}$, so $${tot/2}$ pairs in all.`,`Structure: ${desc}.`,`Bonding pairs: $${bp}$ (count 2 for a double bond and 3 for a triple bond).`,`Lone pairs: $${tot/2} - ${bp} = ${lpn}$.`],
          answerTeX:`${bp} bonding pairs, ${lpn} lone pairs`, verify:{value:tot/2-lpn}};
      }},
    {id:"M4C1.g.ionic-covalent", title:"Ionic or covalent, and the formula", skill:"Octet rule for pairs of elements", ref:"p. 1",
      gen(R,d){
        const ION=[["Na","S","Na2S",1,-2],["K","Br","KBr",1,-1],["Ca","Cl","CaCl2",2,-1],["Mg","O","MgO",2,-2],["Li","O","Li2O",1,-2],["Ba","F","BaF2",2,-1],["K","O","K2O",1,-2],["Sr","Br","SrBr2",2,-1],["Mg","F","MgF2",2,-1],["Ca","S","CaS",2,-2],["Rb","I","RbI",1,-1],["Li","S","Li2S",1,-2]];
        const COV=[["H","S","H2S"],["N","H","NH3"],["P","Cl","PCl3"],["C","F","CF4"],["O","F","OF2"],["Si","H","SiH4"],["N","F","NF3"],["H","Br","HBr"],["Se","H","H2Se"],["C","Cl","CCl4"],["P","H","PH3"],["S","Cl","SCl2"]];
        const ionic=d===1?R.int(0,1)===0:R.int(0,2)>0?R.int(0,1)===0:true;
        let A,B,f,steps;
        if(ionic){ const c=R.pick(ION); [A,B,f]=c; const qa=c[3], qb=c[4];
          steps=[`$\\ce{${A}}$ is an s-block metal (group ${GROUP[A]}); $\\ce{${B}}$ is a p-block atom (group ${GROUP[B]}). Electrons transfer: ionic.`,`$\\ce{${A}}$ loses ${word(qa,"electron")} to reach a noble-gas arrangement: $\\ce{${A}^{${qa>1?qa:""}+}}$.`,`$\\ce{${B}}$ gains ${word(-qb,"electron")}: $\\ce{${B}^{${-qb>1?-qb:""}-}}$.`,`Balance the charges: $\\ce{${f}}$.`]; }
        else { const c=R.pick(COV); [A,B,f]=c; const sp=window.MC.parseSpecies(f); const els=Object.keys(sp.counts);
          steps=[`Both $\\ce{${A}}$ and $\\ce{${B}}$ are non-metals (H or p-block). They share electron pairs: covalent.`,...els.map(e=>`$\\ce{${e}}$ needs ${e==="H"?"1 more electron (2 in all)":`${8-VAL[e]} more electron${8-VAL[e]>1?"s":""} for an octet`}, so it forms ${e==="H"?1:8-VAL[e]} bond${(e==="H"?1:8-VAL[e])>1?"s":""}.`),`Formula: $\\ce{${f}}$.`]; }
        const order=R.int(0,1)?[A,B]:[B,A];
        return {prompt:`What kind of bond forms between $\\ce{${order[0]}}$ and $\\ce{${order[1]}}$, and what is the formula of the simplest binary compound they form?`,
          parts:[{label:"Bond type",answer:{type:"mc",options:["Ionic","Covalent"],correct:ionic?0:1,keep:true}},{label:"Formula",answer:{type:"formula",answer:f}}],
          hint:"s-block metal with a p-block atom (especially groups 16 and 17): ionic. Two p-block atoms (H counts here): covalent. Then use the octet rule to get the charges or the number of bonds.",
          steps, answerTeX:`${ionic?"Ionic":"Covalent"}, $\\ce{${f}}$`};
      }},
    {id:"M4C1.g.better-structure", title:"Which structure do the formal charges favour?", skill:"Rules for formal charge (p. 4)", ref:"p. 4",
      gen(R,d){
        /* [species, [structure TeX, FCs text, why], index of best, rule used] */
        const S=[
          ["the cyanate ion, $\\ce{OCN-}$",[["$\\ce{O-C#N}$","O $-1$, C $0$, N $0$","Charges are at most $\\pm1$ and the $-1$ sits on O, the more electronegative atom."],["$\\ce{O=C=N}$","O $0$, C $0$, N $-1$","Allowed, but the $-1$ is on N, which is less electronegative than O (p. 4 uses this exact ion)."],["$\\ce{O#C-N}$","O $+1$, C $0$, N $-2$","A $-2$ and a $+1$: large formal charges, so this structure is not important."]],0],
          ["the thiocyanate ion, $\\ce{SCN-}$",[["$\\ce{S=C=N}$","S $0$, C $0$, N $-1$","The $-1$ is on N. N (3.0) is more electronegative than S (2.5) (Module 3, p. 15)."],["$\\ce{S-C#N}$","S $-1$, C $0$, N $0$","Allowed, but the $-1$ is on S, the less electronegative atom."],["$\\ce{S#C-N}$","S $+1$, C $0$, N $-2$","A $-2$ makes this one unimportant."]],0],
          ["dinitrogen monoxide, $\\ce{N2O}$ (atoms in the order N–N–O)",[["$\\ce{N#N-O}$","N $0$, N $+1$, O $-1$","Charges at most $\\pm1$ with the $-1$ on O, the most electronegative atom."],["$\\ce{N=N=O}$","N $-1$, N $+1$, O $0$","Allowed, but the $-1$ is on N instead of O."],["$\\ce{N-N#O}$","N $-2$, N $+1$, O $+1$","A $-2$, and a $+1$ on O: not important."]],0],
          ["carbon dioxide, $\\ce{CO2}$",[["$\\ce{O=C=O}$","all $0$","Every formal charge is zero: the smallest possible."],["$\\ce{O#C-O}$","O $+1$, C $0$, O $-1$","Every atom has an octet, but the charges are not needed."]],0],
          ["hydrogen cyanide versus its isomer (H on C or on N)",[["$\\ce{H-C#N}$","all $0$","All zero."],["$\\ce{H-N#C}$","N $+1$, C $-1$","Charges of $\\pm1$ that the other arrangement avoids."]],0],
          ["carbon monoxide, $\\ce{CO}$",[["$\\ce{C#O}$, one lone pair on each atom","C $-1$, O $+1$","Both atoms have an octet. C almost never has fewer than 8 electrons (p. 4), so this one wins even though O ends up $+1$."],["$\\ce{C=O}$, one lone pair on C and two on O","C $0$, O $0$","Zero charges, but C has only 6 electrons. C, N, O and F almost never have fewer than 8 (p. 4)."]],0]
        ];
        const pool=d===1?S.slice(0,4):d===2?S.slice(0,5):S;
        const [sp,list,best]=R.pick(pool);
        const idx=R.shuffle(list.map((x,i)=>i));
        const options=idx.map(i=>`${list[i][0]} (FC: ${list[i][1]})`);
        return {prompt:`Which Lewis structure for ${sp} do the rules on p. 4 favour? Formal charges are given for each.`,
          answer:{type:"mc",options,correct:idx.indexOf(best),why:idx.map(i=>list[i][2])},
          hint:"First rule out anything that breaks the octet limits or has charges of ±2. Then prefer the smallest formal charges, and put a negative formal charge on the more electronegative atom.",
          steps:[...list.map((x,i)=>`${x[0]}: ${x[1]}. ${x[2]}`),`Best: ${list[best][0]}.`],
          answerTeX:list[best][0]};
      }}
  ],
  exam:[
    {id:"M4C1.q1", ref:"p. 4", q:"In a Lewis structure, an N atom has four single bonds and no lone pairs. What is its formal charge?", opts:[["$-1$",false,"That would need N to own 6 electrons. It owns $\\tfrac12(8) = 4$."],["$0$",false,"Neutral N has 3 bonds and 1 lone pair."],["$+1$",true,"$5 - (0 + 4) = +1$, the ammonium-type N."],["$+2$",false,"N owns 4 electrons and brought 5: the difference is 1."],["$-2$",false,"The sign is wrong: N owns fewer electrons than it brought."]]},
    {id:"M4C1.q2", ref:"p. 4", multi:true, q:"Which statements about formal charge are correct? Select all that apply.", opts:[["The formal charges in a structure add up to the overall charge of the molecule or ion.",true,"Electrons are not created or destroyed, so the bookkeeping must add up (p. 4)."],["A negative formal charge belongs on the more electronegative atom when there is a choice.",true,"p. 4, using $\\ce{NCO-}$ as the example."],["Formal charge is the measured charge on the atom.",false,"It is a bookkeeping value from a set of counting rules, not a measurement."],["Placing $+1$ and $+1$ on neighbouring atoms is a good arrangement.",false,"Avoid like formal charges on adjacent atoms (p. 4)."],["Structures with formal charges of $\\pm2$ are usually the most important.",false,"Large formal charges usually mean the structure is not important."]]},
    {id:"M4C1.q3", ref:"p. 1", q:"Which pair of elements is most likely to form an ionic compound?", opts:[["N and O",false,"Two p-block atoms share electrons: covalent."],["Ca and Br",true,"An s-block metal with a group 17 atom: Ca gives two electrons, forming $\\ce{CaBr2}$."],["C and S",false,"Both p-block: covalent ($\\ce{CS2}$)."],["H and Cl",false,"$\\ce{HCl}$ is a covalent molecule (p. 2 asks this)."],["P and F",false,"Both p-block: covalent."]]},
    {id:"M4C1.q4", ref:"p. 4", q:"How many valence electrons are in the Lewis structure of the sulfite ion, $\\ce{SO3^2-}$?", opts:[["24",false,"That is $6 + 3(6)$ without the two extra electrons from the $2-$ charge."],["26",true,"$6 + 18 + 2 = 26$."],["22",false,"The charge adds electrons; it does not remove them."],["32",false,"Check: S and O each bring 6."],["28",false,"Only 2 extra electrons for a $2-$ charge."]]},
    {id:"M4C1.q5", ref:"p. 4", q:"Which atom could have more than 8 valence electrons around it in a Lewis structure?", opts:[["C",false,"2nd-row atoms never exceed 8."],["N",false,"2nd-row atoms never exceed 8."],["O",false,"2nd-row atoms never exceed 8."],["S",true,"S is in the 3rd period, so an expanded octet is possible."],["F",false,"2nd-row atoms never exceed 8, and F forms only one bond."]]},
    {id:"M4C1.q6", ref:"pp. 3-4", q:"How many bonding pairs and lone pairs are in the Lewis structure of formaldehyde, $\\ce{H2CO}$ (C in the middle)?", opts:[["3 bonding pairs, 2 lone pairs",false,"The C=O double bond counts as 2 bonding pairs."],["4 bonding pairs, 2 lone pairs",true,"Two C–H plus a C=O: 4 bonding pairs. O keeps 2 lone pairs. $2(4+2) = 12$ valence electrons."],["4 bonding pairs, 4 lone pairs",false,"That is 16 electrons; $\\ce{H2CO}$ has 12."],["3 bonding pairs, 3 lone pairs",false,"With only single bonds C would have 6 electrons, which C almost never has."],["5 bonding pairs, 1 lone pair",false,"O with 3 bonds and 1 lone pair would be $+1$."]]},
    {id:"M4C1.q7", ref:"p. 4", q:"Which statement about hydrogen in Lewis structures is correct?", opts:[["H can form two bonds when it is in the middle of a molecule.",false,"H never holds more than 2 electrons, so it forms one bond."],["H always forms exactly one bond and is always a terminal atom.",true,"p. 4, rule (i)."],["H usually carries a lone pair.",false,"Its 2 electrons are in its one bond."],["H follows the octet rule.",false,"H is limited to 2 electrons, like He."],["H can have an expanded octet.",false,"Only atoms from the 3rd period and beyond can."]]}
  ],
  steps:[
    {type:"read", title:"Atoms bond to reach a noble-gas arrangement", ref:"p. 1", body:"<p>Noble gases barely react. Every one of them except He has $ns^2np^6$ in its outer shell: eight valence electrons, an <b>octet</b>. Other main-group atoms tend to end up with the same arrangement as the nearest noble gas. That is the <b>octet rule</b>.</p><p>Think of a team that plays best with exactly eight players. A team with one extra player trades one away; a team that is one short borrows one, or shares a player with a neighbouring team. Atoms do both: they <b>transfer</b> electrons or <b>share</b> them, and either way a bond forms.</p><div class=\"box def\"><b class=\"t\">Two kinds of bond (p. 1)</b><b>Ionic:</b> electrons move from one atom to another. The cation and anion attract each other.<br><b>Covalent:</b> two atoms share a pair of electrons. One shared pair is a single bond, two a double bond, three a triple bond.</div><p>Which one happens? Recall from Module 3 that group 1 and 2 metals have low ionization energies, while group 16 and 17 atoms have large ionization energies and large electron affinities (p. 1).</p><ul><li>s-block metal + p-block atom (especially groups 16 and 17): an <b>ionic compound</b>. Na gives one electron to Cl, making $\\ce{Na+}$ and $\\ce{Cl-}$.</li><li>p-block atom + p-block atom: neither gives electrons away easily, so they share. A <b>molecular compound</b> with covalent bonds, like $\\ce{H2O}$.</li></ul><p>The rest of Module 4 is about the shared kind.</p>"},
    {type:"try", title:"Ionic or covalent?", gen:"M4C1.g.ionic-covalent"},
    {type:"read", title:"Lewis symbols and Lewis structures", fig:"symbols", ref:"p. 3", body:"<p>A <b>Lewis symbol</b> is an element symbol with one dot for each valence electron. For main-group atoms the count is the group number (groups 13 to 18 give 3 to 8).</p><p>A <b>Lewis structure</b> shows how atoms are joined. Three conventions (p. 3):</p><ul><li>a line is a bonding pair (2 electrons);</li><li>a pair of dots is a <b>lone pair</b>, not shared;</li><li>every non-zero formal charge is written on its atom.</li></ul><p>Ammonia, $\\ce{NH3}$, has 3 bonding pairs and 1 lone pair on N. Carbon dioxide, O=C=O, has 4 bonding pairs and 4 lone pairs (two on each O).</p>"},
    {type:"try", title:"Count the valence electrons", gen:"M4C1.g.valence-total"},
    {type:"read", title:"Method 1: the traditional recipe", ref:"p. 4", body:"<ol><li>Add up the valence electrons (group numbers; adjust for any charge).</li><li>Put one pair between each pair of bonded atoms.</li><li>Place the remaining electrons as lone pairs, filling the outer (terminal) atoms first.</li><li>Work out the formal charge on every atom.</li></ol><div class=\"box warn\"><b class=\"t\">Limits (p. 4)</b>H never has more than 2 electrons: it makes one bond and is always on the outside.<br>2nd-row atoms never have more than 8. C, N, O and F almost never have fewer than 8.<br>Atoms from the 3rd period and beyond can have an <b>expanded octet</b> (more than 8).</div><p>If the central atom ends up short of 8 and it is C, N or O, turn a lone pair on a neighbour into a second (or third) bond.</p>"},
    {type:"example", title:"Draw phosgene, COCl₂, by Method 1", ref:"p. 4 (Method 1)", ex:{q:"Draw a Lewis structure for phosgene, $\\ce{COCl2}$, with C bonded to O and to both Cl atoms. Show any non-zero formal charges.", steps:[{t:"Valence electrons: $4 + 6 + 2(7) = 24$, so 12 pairs.",why:"C is group 14, O group 16, Cl group 17. The molecule is neutral."},{t:"Three single bonds from C to O, Cl and Cl use 6 electrons. 18 are left.",why:"One pair between each pair of bonded atoms."},{t:"Fill the outer atoms: 3 lone pairs on O and 3 on each Cl. That uses all 18.",why:"Terminal atoms first."},{t:"C now has only 3 bonds, 6 electrons. Move one lone pair from O into a second C–O bond: C=O.",why:"C almost never has fewer than 8. Using O rather than Cl keeps every formal charge at 0 (a C=Cl bond would make Cl $+1$ and O $-1$)."},{t:"Formal charges: C $4-(0+4)=0$; O $6-(4+2)=0$; each Cl $7-(6+1)=0$. Sum $= 0$.",why:"Matches the overall charge of the neutral molecule."}], ans:"Cl–C(=O)–Cl: 4 bonding pairs, 8 lone pairs (2 on O, 3 on each Cl), every formal charge 0."}},
    {type:"try", title:"Bonding pairs and lone pairs", gen:"M4C1.g.bond-lone-pairs"},
    {type:"read", title:"Formal charge: what an atom brought minus what it owns", ref:"p. 4", body:"<p>Each atom brings its valence electrons to the molecule. In the finished structure it \"owns\" <b>all</b> of its lone-pair electrons and <b>half</b> of its bonding electrons, because each bond is shared with one other atom. Like splitting the cost of a shared meal: you pay for what is only yours, and half of what you share.</p><div class=\"box def\"><b class=\"t\">Formal charge (p. 4)</b>$$\\text{FC} = V - \\left(L + \\tfrac12 B\\right)$$$V$ = valence electrons brought (group number), $L$ = lone-pair electrons on the atom, $B$ = bonding electrons around it.</div><p>Formal charge is bookkeeping, not a real charge. It is how you judge whether a structure is reasonable.</p>"},
    {type:"explore", title:"Find the zero-charge patterns", fig:"fcCalc", ref:"pp. 4-6", body:"<p>Set N to 3 single bonds and 1 lone pair: FC 0. Now try 4 single bonds and no lone pairs: $+1$. Then 2 single bonds and 2 lone pairs: $-1$.</p><p>For each atom, find the settings with formal charge 0 and 8 electrons. You will rediscover a pattern: C makes 4 bonds, N 3 bonds and 1 lone pair, O 2 bonds and 2 lone pairs, F 1 bond and 3 lone pairs. That pattern is the start of the next chapter.</p>"},
    {type:"try", title:"Formal charge on one atom", gen:"M4C1.g.formal-charge"},
    {type:"explore", title:"Where does the minus sign go in CO?", fig:"co", ref:"pp. 3-4", body:"<p>The formal charge depends only on the counting, not on electronegativity. In CO the less electronegative atom, C, ends up $-1$.</p><p>Use the list to check the others: every atom in $\\ce{HCN}$ and $\\ce{CO2}$ is 0, and the cyanate ion carries its $-1$ on O.</p>"},
    {type:"read", title:"Choosing between structures", ref:"p. 4", body:"<p>Sometimes more than one structure follows the rules. Formal charges decide which matters most (p. 4):</p><ol><li>The formal charges must add up to the overall charge.</li><li>Smaller is better. Formal charges almost never go past $\\pm1$; a structure with $\\pm2$ or more is usually not important.</li><li>Put a negative formal charge on the more electronegative atom when you can. In $\\ce{NCO-}$ the $-1$ belongs on O, not N.</li><li>Avoid like formal charges ($+1$ and $+1$, or $-1$ and $-1$) on neighbouring atoms.</li></ol><p>When more than one acceptable structure exists, they are called resonance structures. That is chapter 4.3.</p>"},
    {type:"example", title:"Pick the best structure for N₂O", ref:"p. 4", ex:{q:"Dinitrogen monoxide has its atoms in the order N–N–O and 16 valence electrons. Three structures obey the octet rule: N=N=O, $\\ce{N#N-O}$ and $\\ce{N-N#O}$. Which do the formal-charge rules favour?", steps:[{t:"N=N=O (lone pairs: 2 on the end N, 0 on the middle N, 2 on O): FCs $5-(4+2)=-1$, $5-(0+4)=+1$, $6-(4+2)=0$.",why:"Sum $= 0$. Charges of $\\pm1$."},{t:"$\\ce{N#N-O}$ (1 lone pair on the end N, 3 on O): FCs $5-(2+3)=0$, $+1$, $6-(6+1)=-1$.",why:"Sum $= 0$. Charges of $\\pm1$."},{t:"$\\ce{N-N#O}$ (3 lone pairs on the end N, 1 on O): FCs $5-(6+1)=-2$, $+1$, $6-(2+3)=+1$.",why:"A $-2$ rules it out."},{t:"The first two tie on size. The second puts $-1$ on O, the more electronegative atom (O 3.5, N 3.0).",why:"Electronegativities from Module 3, p. 15."}], ans:"$\\ce{N#N-O}$ with formal charges 0, $+1$, $-1$."}},
    {type:"try", title:"Which structure wins?", gen:"M4C1.g.better-structure"},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the formal charge on O in the hydroxide ion, $\\ce{OH-}$ (O has one bond to H and three lone pairs):", lines:["O is in group 16, so $V = 6$.","Lone-pair electrons: $L = 3 \\times 2 = 6$.","Bonding electrons around O: $B = 2$, and O owns all 2 of them.","$\\text{FC} = 6 - (6 + 2) = -2$."], wrong:2, why:"O owns only half of its bonding electrons: $\\tfrac12(2) = 1$. So $\\text{FC} = 6 - (6 + 1) = -1$, which matches the ion's charge."},
    {type:"formulas", title:"Rules and formulas to know"}
  ]
});
})();
