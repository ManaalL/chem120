/* Chapter 4.2 (Wed Oct 28): Ideal fragments, incomplete and expanded octets. Course notes Module 4, pp. 6-9 (section 4.2, Method 2).
   Decorating a central atom with ideal neutral fragments (p. 6), charged and isoelectronic fragments (p. 7), Examples 4-1 to 4-4 (pp. 5, 8, 9):
   boron's incomplete octet and the expanded octets of 3rd-period and heavier atoms. */
(function(){
const M=C120;
const VAL={H:1,B:3,Al:3,C:4,Si:4,N:5,P:5,As:5,O:6,S:6,Se:6,Te:6,F:7,Cl:7,Br:7,I:7,Xe:8,Kr:8};
const ROW2=new Set(["B","C","N","O","F"]);
const tm=n=>n<0?`-${-n}`:n>0?`+${n}`:"0";
const word=(n,w)=>`${n} ${w}${n===1?"":"s"}`;
/* the fragment table, pp. 6-7: key -> [bonds, lone pairs] */
const FRAG={"H":[1,0],"B":[3,0],"C":[4,0],"N":[3,1],"O":[2,2],"F":[1,3],"B-":[4,0],"C-":[3,1],"N-":[2,2],"O-":[1,3],"C+":[3,0],"N+":[4,0],"O+":[3,1]};
const fragTeX=k=>{ const el=k.replace(/[+-]/,""), q=k.slice(el.length); return q?`\\ce{${el}^${q}}`:`\\ce{${el}}`; };
/* single-bonded terminal atoms and their "valence demand" for the lone-pair count on the centre */
const DEMAND={H:1,F:1,Cl:1,Br:1,I:1,O:2};

M.chapter({
  id:"M4C2", module:"m4", n:2, num:"4.2", date:"2026-10-28", added:"2026-10-26", quiz:"PC5",
  title:"Ideal fragments, incomplete and expanded octets", pages:"6-9", sections:["4.2"],
  summary:"Each atom has a favourite way to bond with a formal charge of 0: C makes 4 bonds, N 3 bonds and a lone pair, O 2 bonds and 2 lone pairs, F 1 bond and 3 lone pairs. Build structures from these fragments, then check the central atom. Boron stops at 6 electrons; atoms from the 3rd period on can hold more than 8.",
  flags:[],
  formulas:[
    {id:"M4C2.f.method2", name:"Method 2: build from fragments", tex:"\\text{1. decorate the central atom} \\to \\text{2. find its FC} \\to \\text{3. adjust}", kind:"rule", ref:"p. 6",
      note:"Step 2 asks whether the central atom is missing electrons. Step 3 moves lone pairs or bonding pairs to fix it."},
    {id:"M4C2.f.neutral", name:"Ideal neutral fragments (FC = 0)", tex:"\\ce{H}: 1,0 \\quad \\ce{B}: 3,0 \\quad \\ce{C}: 4,0 \\quad \\ce{N}: 3,1 \\quad \\ce{O}: 2,2 \\quad \\ce{F}: 1,3", kind:"rule", ref:"p. 6",
      note:"Each pair is (bonds, lone pairs). A double bond counts as 2 bonds and a triple as 3. Atoms lower in the same group follow the same pattern.",
      blank:{tex:"\\ce{N}: 3\\ \\text{bonds},\\ \\boxed{\\,?\\,}\\ \\text{lone pair(s)}", accept:["1","one"]}},
    {id:"M4C2.f.charged", name:"Ideal charged fragments", tex:"\\ce{B^-}: 4,0 \\quad \\ce{C^-}: 3,1 \\quad \\ce{N^-}: 2,2 \\quad \\ce{O^-}: 1,3 \\qquad \\ce{C^+}: 3,0 \\quad \\ce{N^+}: 4,0 \\quad \\ce{O^+}: 3,1", kind:"rule", ref:"p. 7",
      note:"Same electron count, same pattern: $\\ce{N+}$ bonds like C, $\\ce{O-}$ like F, $\\ce{C+}$ like B."},
    {id:"M4C2.f.octet-bonds", name:"Bonds for an atom with an octet", tex:"\\text{bonds} = 8 - V + \\text{FC}, \\qquad \\text{lone pairs} = 4 - \\text{bonds}", ref:"pp. 4-7",
      note:"Not printed in the notes: it follows from the formal charge formula (p. 4) when the atom has 8 electrons. It reproduces every octet fragment on pp. 6-7. B and $\\ce{C+}$ (6 electrons) are the exceptions.",
      blank:{tex:"\\text{bonds} = 8 - V + \\boxed{\\,?\\,}", accept:["FC","formal charge","the formal charge"]}},
    {id:"M4C2.f.expanded", name:"Who can have more than 8?", tex:"\\text{only atoms after the 2nd row (3rd, 4th, 5th row and beyond)}", kind:"rule", ref:"p. 8",
      note:"C, N, O and F never have an incomplete octet when neutral, and 2nd-row atoms never expand."},
    {id:"M4C2.f.incomplete", name:"Boron's incomplete octet", tex:"\\ce{B}: 3\\ \\text{bonds},\\ 0\\ \\text{lone pairs},\\ 6\\ e^-", kind:"rule", ref:"p. 7"}
  ],
  glossary:[
    {id:"M4C2.t.ideal-fragment", term:"Ideal fragment", def:"A bonding pattern (number of bonds and lone pairs) that gives an atom a complete octet, or a duet for H, with a formal charge of 0. Boron's 3-bond pattern is the incomplete-octet case.", ref:"p. 6"},
    {id:"M4C2.t.decorate", term:"Decorating the central atom", def:"Step 1 of Method 2: attach the outer atoms to the central atom using their ideal fragments.", ref:"p. 6"},
    {id:"M4C2.t.isoelectronic", term:"Isoelectronic", def:"Having the same number of valence electrons. Isoelectronic fragments, like $\\ce{N+}$ and neutral C, show the same bonding pattern.", ref:"p. 7"},
    {id:"M4C2.t.carbocation", term:"Carbocation", def:"A carbon with a $+1$ formal charge: 3 bonds and no lone pairs, the same pattern as boron.", ref:"p. 7"},
    {id:"M4C2.t.incomplete", term:"Incomplete octet", def:"Fewer than 8 electrons around an atom, as in $\\ce{BF3}$, where B has 6.", ref:"p. 7"},
    {id:"M4C2.t.terminal", term:"Terminal atom", def:"An atom bonded to only one other atom, on the outside of the structure. H and F are always terminal.", ref:"p. 4"}
  ],
  figures:{
    fragments:{title:"The fragment table, drawn", cap:"Pick an atom and a formal charge. Each card is one way that fragment can bond (a double bond counts as 2 bonds, a triple as 3). Fragments with the same number of valence electrons show the same cards. Rebuilt from the tables on pp. 6-7.", ref:"pp. 6-7",
      build(host,{PLOT,M}){
        let el="N", q=0;
        const svgHost=document.createElement("div"); host.append(svgHost);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Atom",items:["H","B","C","N","O","F"].map(k=>[k,k]),value:el,onchange:v=>{ el=v; draw(); }});
        PLOT.seg(ctl,{label:"Formal charge",items:[[-1,"−1"],[0,"0"],[1,"+1"]],value:q,onchange:v=>{ q=v; draw(); }});
        const out=PLOT.readout(host);
        const parts=n=>{ const res=[]; const rec=(left,max,acc)=>{ if(!left){ res.push(acc); return; } for(let k=Math.min(3,max,left);k>=1;k--) rec(left-k,k,acc.concat(k)); }; rec(n,3,[]); return res; };
        function cell(list,lp,x,y,lab){
          const items=list.concat(Array(lp).fill(0)); const n=items.length; let g="";
          items.forEach((o,i)=>{ const a=-Math.PI/2+2*Math.PI*i/Math.max(1,n); const ux=Math.cos(a), uy=Math.sin(a), px=-uy, py=ux;
            if(o===0){ [-4,4].forEach(k=>{ g+=`<circle cx="${x+ux*24+px*k}" cy="${y+uy*24+py*k}" r="2.5" style="fill:var(--c,var(--accent))"/>`; }); }
            else { const offs=o===1?[0]:o===2?[-3.5,3.5]:[-6,0,6]; offs.forEach(k=>{ g+=`<line x1="${x+ux*15+px*k}" y1="${y+uy*15+py*k}" x2="${x+ux*42+px*k}" y2="${y+uy*42+py*k}" style="stroke:var(--fig-stroke);stroke-width:2"/>`; }); g+=`<circle cx="${x+ux*50}" cy="${y+uy*50}" r="7" style="fill:var(--fig-soft);stroke:var(--fig-axis)"/>`; } });
          g+=`<text x="${x}" y="${y+6}" text-anchor="middle" class="lbl" style="font-size:17px">${lab}</text>`;
          return g;
        }
        function draw(){
          const key=el+(q<0?"-":q>0?"+":""); const f=FRAG[key];
          if(!f){ svgHost.innerHTML=`<svg viewBox="0 0 600 120" class="fig" role="img" aria-label="no fragment"><text x="300" y="64" text-anchor="middle">${el}${q?(q>0?"⁺":"⁻"):""} is not one of the fragments on p. 7.</text></svg>`; out.innerHTML=M.rich("The notes list $\\ce{B-}$, $\\ce{C-}$, $\\ce{N-}$, $\\ce{O-}$ (anions) and $\\ce{C+}$, $\\ce{N+}$, $\\ce{O+}$ (cations)."); return; }
          const [b,lp]=f; const six=(key==="B"||key==="C+"||key==="H"); const list=six?[Array(b).fill(1)]:parts(b);
          const W=Math.max(600,list.length*130), H=150; let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${key}: ${b} bonds and ${lp} lone pairs">`;
          const lab=el+(q>0?"⁺":q<0?"⁻":"");
          list.forEach((pt,i)=>{ g+=cell(pt,lp,W/list.length*(i+0.5),75,lab); });
          svgHost.innerHTML=g+`</svg>`;
          const V=VAL[el], e=2*lp+2*b; const twin=Object.keys(FRAG).filter(k=>k!==key && FRAG[k][0]===b && FRAG[k][1]===lp);
          out.innerHTML=M.rich(`$${fragTeX(key)}$: <b>${b} bond${b>1?"s":""}, ${lp} lone pair${lp===1?"":"s"}</b> · electrons around it: $${e}$ · FC $= ${V} - (${2*lp} + ${b}) = ${tm(V-2*lp-b)}$${twin.length?` · same pattern: ${twin.map(k=>`$${fragTeX(k)}$`).join(", ")}`:""}`);
        }
        draw();
      }},
    octets:{title:"Incomplete and expanded octets in 3D", cap:"Molecules and ions from Examples 4-1 and 4-2 (pp. 5, 8), plus three with shapes the notes draw without naming an example. Lone pairs on the central atom are the larger lobes. Count bonding pairs and lone pairs around the central atom to get its electron count.", ref:"pp. 5-8",
      model:{type:"molecule", params:{molecule:"XeF4", fc:true, choices:["BF3","BrF3","XeF4","ICl4m","SOCl2x","SOCl2","ClO3m","PCl5","SF4","SF6","XeF2"], polarity:false}},
      predict:{q:"Xenon tetrafluoride, $\\ce{XeF4}$: how many electrons surround the Xe atom?", opts:[["8",false,"Four bonds already account for 8. Xe also keeps two lone pairs."],["10",false,"That would be one lone pair. Xe brings 8 valence electrons and uses only 4 in bonds."],["12",true,"4 bonding pairs + 2 lone pairs $= 6$ pairs $= 12$ electrons: an expanded octet, allowed because Xe is in period 5."],["6",false,"Only boron-type atoms stop at 6."]], check:"With Lone pairs on, count the two big lobes above and below the Xe. Then switch to $\\ce{BF3}$ and $\\ce{ICl4-}$."}}
  },
  gens:[
    {id:"M4C2.g.fragment-pattern", title:"Bonds and lone pairs of a fragment", skill:"Ideal fragments, pp. 6-7", ref:"pp. 6-7",
      gen(R,d){
        const SAME={P:"N",As:"N",S:"O",Se:"O",Cl:"F",Br:"F",I:"F",Si:"C"};
        let key, el, q;
        if(d===1){ key=R.pick(["B","C","N","O","F","H"]); }
        else if(d===2){ key=R.pick(["B-","C-","N-","O-","C+","N+","O+"]); }
        else { el=R.pick(["P","S","Cl","Br","Si","Se","I"]); const base=SAME[el]; const ch=R.pick(base==="F"?[""]:base==="C"?["","-"]:["","-","+"]); key=base+ch; }
        const baseEl=key.replace(/[+-]/,""); el=el||baseEl; q=key.endsWith("-")?-1:key.endsWith("+")?1:0;
        const [b,lp]=FRAG[key]; const V=VAL[el];
        const lab=q?`\\ce{${el}^${q>0?"+":"-"}}`:`\\ce{${el}}`;
        const twin=Object.keys(FRAG).filter(k=>k!==key && FRAG[k][0]===b && FRAG[k][1]===lp && !k.includes(q>0?"+":q<0?"-":"#"));
        const steps=[];
        if(el!==baseEl) steps.push(`$\\ce{${el}}$ is in the same group as $\\ce{${baseEl}}$, so it follows the same pattern (p. 6).`);
        steps.push(`Valence electrons: $V = ${V}$. Formal charge wanted: $${tm(q)}$.`);
        if(key==="H") steps.push("H holds only 2 electrons: one bond, no lone pairs.");
        else if(b+lp===3) steps.push(`This is a 6-electron fragment (like boron): ${b} bonds, no lone pairs (p. 7).`);
        else steps.push(`With an octet: bonds $= 8 - V + \\text{FC} = 8 - ${V} + (${q}) = ${b}$; lone pairs $= 4 - ${b} = ${lp}$.`);
        steps.push(`Check: $\\text{FC} = ${V} - (${2*lp} + ${b}) = ${tm(V-2*lp-b)}$.`);
        if(twin.length) steps.push(`Same pattern as ${twin.map(k=>`$${fragTeX(k)}$`).join(" and ")}.`);
        return {prompt:`What is the ideal bonding pattern for $${lab}$${q?` (formal charge $${tm(q)}$)`:" with a formal charge of 0"}? Give the number of bonds (a double bond counts as 2) and the number of lone pairs.`,
          parts:[{label:"Bonds",answer:{type:"int",value:b}},{label:"Lone pairs",answer:{type:"int",value:lp}}],
          hint:"For an atom with an octet, bonds + lone pairs = 4 pairs. Formal charge = V − (lone-pair electrons + bonds). B and C⁺ are the 6-electron exceptions; H has 2.",
          steps, answerTeX:`${word(b,"bond")}, ${word(lp,"lone pair")}`, verify:{value:(key==="H"||b+lp===3)?b:8-V+q}};
      }},
    {id:"M4C2.g.isoelectronic", title:"Same electrons, same pattern", skill:"Isoelectronic fragments, p. 7", ref:"p. 7",
      gen(R,d){
        const keys=Object.keys(FRAG).filter(k=>k!=="H");
        const pat=k=>FRAG[k].join(",");
        const groups={}; keys.forEach(k=>{ (groups[pat(k)]=groups[pat(k)]||[]).push(k); });
        const target=R.pick(keys.filter(k=>groups[pat(k)].length>1 && (d===1?!/[+-]/.test(k):true)));
        const right=R.pick(groups[pat(target)].filter(k=>k!==target));
        const wrongPool=R.shuffle(keys.filter(k=>pat(k)!==pat(target)));
        const opts=[right]; for(const k of wrongPool){ if(opts.length>=4) break; if(!opts.some(o=>pat(o)===pat(k))) opts.push(k); }
        const order=R.shuffle(opts);
        const [b,lp]=FRAG[target];
        return {prompt:`Which fragment has the same bonding pattern as $${fragTeX(target)}$ (${word(b,"bond")}, ${word(lp,"lone pair")})?`,
          answer:{type:"mc",options:order.map(k=>`$${fragTeX(k)}$`),correct:order.indexOf(right),why:order.map(k=>`$${fragTeX(k)}$: ${word(FRAG[k][0],"bond")}, ${word(FRAG[k][1],"lone pair")}.`)},
          hint:"Count valence electrons including the charge: add one for −, remove one for +. Same count, same pattern (p. 7).",
          steps:[`$${fragTeX(target)}$ has ${VAL[target.replace(/[+-]/,"")]-(target.endsWith("+")?1:target.endsWith("-")?-1:0)} valence electrons to work with.`,`$${fragTeX(right)}$ has ${VAL[right.replace(/[+-]/,"")]-(right.endsWith("+")?1:right.endsWith("-")?-1:0)}: the same number, so the same pattern.`,`Both: ${word(b,"bond")}, ${word(lp,"lone pair")}.`],
          answerTeX:`$${fragTeX(right)}$`};
      }},
    {id:"M4C2.g.octet-type", title:"Incomplete, octet or expanded?", skill:"Electrons around the central atom", ref:"pp. 4-8",
      gen(R,d){
        /* [formula, centre, outer atoms (single-bonded), charge] */
        const POOL={1:[["BF3","B",3,0],["BCl3","B",3,0],["CF4","C",4,0],["NF3","N",3,0],["PCl5","P",5,0],["SF6","S",6,0],["OF2","O",2,0],["AlCl3","Al",3,0]],
                    2:[["SF4","S",4,0],["ClF3","Cl",3,0],["XeF2","Xe",2,0],["XeF4","Xe",4,0],["IF5","I",5,0],["BrF3","Br",3,0],["PCl3","P",3,0],["SiCl4","Si",4,0]],
                    3:[["ICl4^-","I",4,-1],["I3^-","I",2,-1],["PF6^-","P",6,-1],["BrF4^-","Br",4,-1],["ICl2^-","I",2,-1],["PCl4^+","P",4,1],["IF4^+","I",4,1],["SeF4","Se",4,0],["KrF2","Kr",2,0],["BF4^-","B",4,-1]]};
        const [f,c,n,q]=R.pick(POOL[d]);
        const lp=(VAL[c]-q-n)/2; const e=2*(n+lp);
        const cls=e<8?0:e===8?1:2; const names=["Incomplete octet (fewer than 8)","Octet (exactly 8)","Expanded octet (more than 8)"];
        const outer=f==="I3^-"?"I":f.replace(/\^.*$/,"").slice(c.length).replace(/\d+$/,"");
        return {prompt:`In the Lewis structure of $\\ce{${f}}$ (every $\\ce{${outer}}$ single-bonded to $\\ce{${c}}$ with formal charge 0), how many electrons surround the central $\\ce{${c}}$ atom, and which kind of octet is it?`,
          parts:[{label:`Electrons around ${c}`,answer:{type:"int",value:e}},{label:"Kind",answer:{type:"mc",options:names,correct:cls,keep:true}}],
          hint:"Lone pairs on the centre = (V of the centre − charge − number of single bonds) ÷ 2, when every outer atom keeps formal charge 0. Electrons around the centre = 2 × (bonds + lone pairs).",
          steps:[`$\\ce{${c}}$ brings $${VAL[c]}$ valence electrons${q?`; the ion's charge of $${tm(q)}$ sits on the centre, so it has $${VAL[c]-q}$ to use`:""}.`,`${n} single bonds use $${n}$ of them.`,`Lone pairs on $\\ce{${c}}$: $(${VAL[c]-q} - ${n})/2 = ${lp}$.`,`Electrons around $\\ce{${c}}$: $2(${n} + ${lp}) = ${e}$.`,cls===2?`More than 8 is allowed because $\\ce{${c}}$ is beyond the 2nd row (p. 8).`:cls===0?`Fewer than 8: the boron-type pattern (p. 7).`:`Exactly 8.`],
          answerTeX:`${e} electrons: ${names[cls].split(" (")[0].toLowerCase()}`};
      }},
    {id:"M4C2.g.central-fc", title:"Method 2: check and adjust the central atom", skill:"Decorate, find the FC, adjust", ref:"pp. 6-8",
      gen(R,d){
        /* [formula, centre, single-bonded neutral outer atoms (Cl, F, H or OH), bare O atoms, charge] */
        const POOL={1:[["CO3^2-","C",0,3,-2],["NO3^-","N",0,3,-1],["NO2^-","N",0,2,-1],["H2CO","C",2,1,0],["COCl2","C",2,1,0],["HCO3^-","C",1,2,-1]],
                    2:[["SOCl2","S",2,1,0],["SO2Cl2","S",2,2,0],["POCl3","P",3,1,0],["ClO3^-","Cl",0,3,-1],["SO3^2-","S",0,3,-2],["PO4^3-","P",0,4,-3],["SO4^2-","S",0,4,-2]],
                    3:[["H2SO4","S",2,2,0],["H3PO4","P",3,1,0],["BrO3^-","Br",0,3,-1],["ClO2^-","Cl",0,2,-1],["HSO4^-","S",1,3,-1],["IO3^-","I",0,3,-1],["SO3","S",0,3,0],["SeO4^2-","Se",0,4,-2]]};
        const [f,c,nx,nO,q]=R.pick(POOL[d]);
        const V=VAL[c]; const lp=(V-q-nx-2*nO)/2; const fc0=V-2*lp-(nx+nO);
        const e0=2*(lp+nx+nO);
        const row2=ROW2.has(c);
        const nd=row2?Math.max(0,(8-e0)/2):fc0;   /* doubles: 2nd row stops at the octet; others go to FC 0 */
        const fcEnd=fc0-nd;
        const OHW={"H2SO4":"two –OH groups","H3PO4":"three –OH groups","HCO3^-":"one –OH group","HSO4^-":"one –OH group"};
        const outerWords=OHW[f]?OHW[f]:nx?`${nx} single-bonded ${f.match(/Cl|F|H/)[0]==="H"?"H":f.match(/Cl|F/)[0]} atom${nx>1?"s":""}`:"";
        const steps=[`Decorate $\\ce{${c}}$: ${outerWords?outerWords+" and ":""}${word(nO,"bare O atom")} drawn as $\\ce{-O^-}$ (1 bond, 3 lone pairs). That leaves ${word(lp,"lone pair")} on $\\ce{${c}}$.`,
          `Step 2: $\\text{FC}(\\ce{${c}}) = ${V} - (${2*lp} + ${nx+nO}) = ${tm(fc0)}$. Check: $${tm(fc0)} + ${nO}(-1) = ${tm(q)}$, the overall charge.`];
        if(row2) steps.push(`Step 3: $\\ce{${c}}$ is a 2nd-row atom with ${e0} electrons. Turn ${word(nd,"O lone pair")} into ${nd===1?"a double bond":"double bonds"} until it has 8, and stop: it can't expand. Its formal charge ends at $${tm(fcEnd)}$.`);
        else if(nd>0) steps.push(`Step 3: $\\ce{${c}}$ is beyond the 2nd row, so it may expand. Each lone pair moved from an $\\ce{O-}$ into a $\\ce{${c}=O}$ bond lowers its FC by 1. ${nd===1?"One double bond brings":nd+" double bonds bring"} it to 0, with ${e0+2*nd} electrons around $\\ce{${c}}$.`);
        else steps.push("Step 3: the formal charge is already 0. Nothing to move.");
        steps.push(`The smallest formal charges win (p. 4): ${word(nd,"double bond")} to O in the final structure.`);
        return {prompt:`Use Method 2 for $\\ce{${f}}$${OHW[f]?" (H atoms on O)":""}. Decorate the central $\\ce{${c}}$ with ideal fragments, drawing every O that is bonded only to $\\ce{${c}}$ as $\\ce{-O^-}$. (a) What is the formal charge on $\\ce{${c}}$ at that stage? (b) After the final adjustment, how many $\\ce{${c}=O}$ double bonds does the best structure have?`,
          parts:[{label:"(a) FC on the centre",answer:{type:"int",value:fc0}},{label:"(b) double bonds to O",answer:{type:"int",value:nd}}],
          hint:"Formal charge = V − (lone-pair electrons + bonds). A positive charge on the centre means it is missing electrons: move lone pairs from O⁻ into double bonds. 2nd-row atoms stop at 8; atoms beyond the 2nd row can keep going until the FC is 0.",
          steps, answerTeX:`(a) $${tm(fc0)}$; (b) ${nd}`};
      }},
    {id:"M4C2.g.lp-central", title:"Lone pairs and formal charge on the central atom", skill:"Expanded octets in ions", ref:"pp. 5, 8",
      gen(R,d){
        const POOL={1:[["BrF3","Br",3,0],["XeF4","Xe",4,0],["ClF3","Cl",3,0],["XeF2","Xe",2,0],["SF4","S",4,0],["IF5","I",5,0]],
                    2:[["ICl4^-","I",4,-1],["I3^-","I",2,-1],["BrF4^-","Br",4,-1],["ICl2^-","I",2,-1],["BrF6^-","Br",6,-1],["SF5^-","S",5,-1]],
                    3:[["IF4^+","I",4,1],["ClF2^+","Cl",2,1],["BrF2^+","Br",2,1],["XeF3^+","Xe",3,1],["PCl4^+","P",4,1],["IF6^+","I",6,1],["XeF5^+","Xe",5,1]]};
        const [f,c,n,q]=R.pick(POOL[d]);
        const V=VAL[c]; const lp=(V-q-n)/2; const fc=V-2*lp-n;
        const outer=f==="I3^-"?"I":f.replace(/\^.*$/,"").slice(c.length).replace(/\d+$/,"");
        const tot=V+n*VAL[outer]-q;
        const left=tot-2*n-6*n;
        return {prompt:`$\\ce{${f}}$ has every $\\ce{${outer}}$ single-bonded to the central $\\ce{${c}}$ with three lone pairs each. How many lone pairs are on $\\ce{${c}}$, and what is its formal charge?`,
          parts:[{label:`Lone pairs on ${c}`,answer:{type:"int",value:lp}},{label:`FC on ${c}`,answer:{type:"int",value:fc}}],
          hint:"Total valence electrons, minus 2 per bond, minus 6 per outer atom: what is left sits on the centre as lone pairs. Then FC = V − (lone-pair electrons + bonds).",
          steps:[`Total valence electrons: $${V} + ${n}(${VAL[outer]})${q?` ${q<0?"+":"-"} ${Math.abs(q)}`:""} = ${tot}$.`,`Bonds use $2\\times${n} = ${2*n}$; outer lone pairs use $6\\times${n} = ${6*n}$.`,`Left for $\\ce{${c}}$: $${tot} - ${2*n} - ${6*n} = ${left}$ electrons $= ${lp}$ lone pair${lp===1?"":"s"}.`,`$\\text{FC}(\\ce{${c}}) = ${V} - (${2*lp} + ${n}) = ${tm(fc)}$, which equals the ion's charge because every outer atom is 0.`,`Electrons around $\\ce{${c}}$: $2(${n}+${lp}) = ${2*(n+lp)}$${2*(n+lp)>8?", an expanded octet":""}.`],
          answerTeX:`${word(lp,"lone pair")}, FC $${tm(fc)}$`, verify:{value:left/2}};
      }}
  ],
  exam:[
    {id:"M4C2.q1", ref:"p. 6", q:"Which bonding pattern gives a neutral O atom a formal charge of 0 and an octet?", opts:[["1 bond, 3 lone pairs",false,"That is $\\ce{O-}$ (FC $-1$), the terminal oxyanion fragment."],["2 bonds, 2 lone pairs",true,"$6 - (4 + 2) = 0$, and $2(2+2) = 8$ electrons. Two single bonds or one double bond."],["3 bonds, 1 lone pair",false,"That is $\\ce{O+}$ (FC $+1$)."],["2 bonds, 1 lone pair",false,"Only 6 electrons, and FC $= +2$."],["4 bonds, 0 lone pairs",false,"That pattern belongs to C (and $\\ce{N+}$)."]]},
    {id:"M4C2.q2", ref:"p. 7", q:"In which molecule does the central atom have an incomplete octet?", opts:[["$\\ce{NF3}$",false,"N has 3 bonds and 1 lone pair: 8 electrons."],["$\\ce{BF3}$",true,"B has 3 bonds and no lone pairs: 6 electrons, FC 0 (p. 7)."],["$\\ce{CCl4}$",false,"C has 4 bonds: 8 electrons."],["$\\ce{SF6}$",false,"S has 12 electrons: expanded, not incomplete."],["$\\ce{H2O}$",false,"O has 2 bonds and 2 lone pairs: 8 electrons."]]},
    {id:"M4C2.q3", ref:"p. 8", q:"Which of these molecules cannot exist?", opts:[["$\\ce{PCl5}$",false,"P is in period 3 and can hold 10 electrons."],["$\\ce{SF6}$",false,"S is in period 3 and can hold 12 electrons."],["$\\ce{NF5}$",true,"N is a 2nd-row atom and never holds more than 8 electrons; five bonds would need 10."],["$\\ce{XeF4}$",false,"Xe is in period 5; an expanded octet is fine (Example 4-2)."],["$\\ce{ClF3}$",false,"Cl is in period 3: 3 bonds and 2 lone pairs, 10 electrons."]]},
    {id:"M4C2.q4", ref:"p. 5", q:"In $\\ce{ICl4-}$, each Cl is single-bonded to I with three lone pairs. How many lone pairs are on I, and what is its formal charge?", opts:[["1 lone pair, $0$",false,"$7 + 28 + 1 = 36$ electrons; after 4 bonds and 12 Cl lone pairs, 4 electrons (2 pairs) are left."],["2 lone pairs, $-1$",true,"I: $7 - (4 + 4) = -1$, with 12 electrons around it."],["2 lone pairs, $0$",false,"I brought 7 and owns $4 + 4 = 8$."],["0 lone pairs, $+1$",false,"That leaves 4 electrons unplaced."],["3 lone pairs, $-3$",false,"Only 4 electrons are left for I."]]},
    {id:"M4C2.q5", ref:"p. 7", q:"A carbocation (C with formal charge $+1$) has the same bonding pattern as which neutral atom?", opts:[["N",false,"Neutral N has 3 bonds and a lone pair; $\\ce{C+}$ has no lone pair."],["B",true,"Both have 3 valence electrons to bond with: 3 bonds, no lone pairs, 6 electrons (p. 7)."],["O",false,"Neutral O has 2 bonds and 2 lone pairs."],["C",false,"Neutral C makes 4 bonds."],["F",false,"Neutral F makes 1 bond."]]},
    {id:"M4C2.q6", ref:"pp. 6-8", q:"Using Method 2 on $\\ce{SO2Cl2}$, S is first decorated with two $\\ce{-Cl}$ and two $\\ce{-O^-}$ fragments, which gives S a formal charge of $+2$. What should happen next?", opts:[["Nothing: $+2$ on S is the final answer.",false,"Formal charges almost never exceed $\\pm1$ in an important structure (p. 4)."],["Move one lone pair from each $\\ce{O-}$ into an S=O double bond, giving S a formal charge of 0.",true,"S is in period 3, so it can expand to 12 electrons, and every formal charge becomes 0."],["Add two lone pairs to S.",false,"That adds electrons the molecule doesn't have."],["Break an S–Cl bond.",false,"The atoms stay connected the same way; only electrons move."],["Move a lone pair from Cl into an S=Cl bond.",false,"Cl prefers 1 bond (ideal fragment F, p. 6); this would put $+1$ on Cl."]]},
    {id:"M4C2.q7", ref:"pp. 5-8", multi:true, q:"Which species have an expanded octet on the central atom? Select all that apply.", opts:[["$\\ce{SF4}$",true,"4 bonds + 1 lone pair: 10 electrons."],["$\\ce{XeF2}$",true,"2 bonds + 3 lone pairs: 10 electrons."],["$\\ce{NH4+}$",false,"4 bonds, no lone pairs: 8 electrons."],["$\\ce{BF3}$",false,"6 electrons: incomplete."],["$\\ce{ICl4-}$",true,"4 bonds + 2 lone pairs: 12 electrons."]]}
  ],
  steps:[
    {type:"read", title:"Method 2: build with pieces you already know", ref:"p. 6", body:"<p>Method 1 places electrons one pair at a time. Method 2 works like building with Lego: each atom comes as a standard piece with a fixed number of connectors, and you snap the pieces together (p. 6).</p><ol><li><b>Decorate</b> the central atom with the outer atoms, each drawn as its ideal fragment.</li><li><b>Find the formal charge on the central atom.</b> A charge you didn't expect means electrons are missing or extra.</li><li><b>Adjust.</b> Move lone pairs or bonding pairs around the central atom to fix it.</li></ol><p>The rules from p. 4 still apply: 2nd-row atoms never go above 8, C, N, O and F almost never go below 8, and 3rd-row atoms may expand if they need to.</p>"},
    {type:"read", title:"The ideal neutral fragments", ref:"p. 6", body:"<p>An <b>ideal fragment</b> is a bonding pattern that gives the atom a full octet (H: 2 electrons) and a formal charge of 0. A double bond counts as 2 bonds and a triple bond as 3.</p><table class=\"cn-table\"><tr><th>Atom</th><th>H</th><th>B</th><th>C</th><th>N</th><th>O</th><th>F</th></tr><tr><th>Bonds</th><td>1</td><td>3</td><td>4</td><td>3</td><td>2</td><td>1</td></tr><tr><th>Lone pairs</th><td>0</td><td>0</td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>Ways to bond</th><td>–H</td><td>3 single</td><td>4 single; 1 double + 2 single; 2 double; 1 triple + 1 single</td><td>3 single; 1 double + 1 single; 1 triple</td><td>2 single; 1 double</td><td>1 single</td></tr></table><p>Boron is the odd one: 3 bonds and only 6 electrons. Atoms lower in a group behave like the top one: S like O, P like N, Cl, Br and I like F (p. 6).</p><p>Learn this table. It turns most Lewis structures into a matching game.</p>"},
    {type:"explore", title:"Every way each fragment can bond", fig:"fragments", ref:"pp. 6-7", body:"<p>Pick C with charge 0: four cards, from four single bonds to a triple bond plus a single bond. Pick N: three cards. Then pick N with charge $+1$: the cards are the same as neutral C.</p><p>Try O with $-1$. That is the $\\ce{-O^-}$ group you will see on every oxyanion.</p>"},
    {type:"try", title:"Bonds and lone pairs of a fragment", gen:"M4C2.g.fragment-pattern"},
    {type:"read", title:"Charged fragments follow the same patterns", ref:"p. 7", body:"<p>Adding or removing an electron makes an atom look like its neighbour in the periodic table. Species with the same number of valence electrons are <b>isoelectronic</b>, and they bond the same way (p. 7).</p><table class=\"cn-table\"><tr><th></th><th>3 bonds, 0 LP</th><th>4 bonds, 0 LP</th><th>3 bonds, 1 LP</th><th>2 bonds, 2 LP</th><th>1 bond, 3 LP</th></tr><tr><th>Anions</th><td></td><td>$\\ce{B-}$</td><td>$\\ce{C-}$</td><td>$\\ce{N-}$</td><td>$\\ce{O-}$</td></tr><tr><th>Neutral</th><td>B</td><td>C</td><td>N</td><td>O</td><td>F</td></tr><tr><th>Cations</th><td>$\\ce{C+}$</td><td>$\\ce{N+}$</td><td>$\\ce{O+}$</td><td></td><td></td></tr></table><p>A <b>carbocation</b> ($\\ce{C+}$) looks like boron. $\\ce{N+}$ makes four bonds like carbon, as in $\\ce{NH4+}$. $\\ce{O-}$ makes one bond like F.</p>"},
    {type:"try", title:"Isoelectronic fragments", gen:"M4C2.g.isoelectronic"},
    {type:"read", title:"Fewer than 8, or more than 8", ref:"pp. 5-8", body:"<p><b>Incomplete octet.</b> Boron usually stops at 3 bonds and 6 electrons, as in $\\ce{BF3}$ (Example 4-1). Every formal charge is 0, so there is nothing to fix.</p><p><b>Expanded octet.</b> Atoms from the 3rd period and beyond (S, P, Cl, Br, I, Xe) can hold more than 8 electrons (p. 8). In Example 4-1, Br in $\\ce{BrF3}$ has 3 bonds and 2 lone pairs: 10 electrons. In Example 4-2, Xe in $\\ce{XeF4}$ has 4 bonds and 2 lone pairs: 12.</p><div class=\"box warn\"><b class=\"t\">Never for the 2nd row</b>C, N, O and F never expand, and never have an incomplete octet when neutral (p. 8). $\\ce{NF5}$ can't exist; $\\ce{PF5}$ can.</div>"},
    {type:"explore", title:"Count the electrons around the central atom", fig:"octets", ref:"pp. 5-8", body:"<p>For each species, count bonding pairs plus lone pairs on the central atom, then double it. $\\ce{BF3}$: 6. $\\ce{BrF3}$: 10. $\\ce{XeF4}$ and $\\ce{ICl4-}$: 12.</p><p>Compare the two thionyl chloride entries. The one with an S–O single bond has S at $+1$ and O at $-1$; the one with S=O has every formal charge 0 and 10 electrons on S.</p>"},
    {type:"try", title:"Incomplete, octet or expanded?", gen:"M4C2.g.octet-type"},
    {type:"example", title:"Sulfuryl chloride by Method 2", ref:"pp. 6-8 (like Example 4-2)", ex:{q:"Draw $\\ce{SO2Cl2}$ (S bonded to two O and two Cl) using ideal fragments. Show any non-zero formal charges.", steps:[{t:"Decorate S with two $\\ce{-Cl}$ (1 bond, 3 lone pairs) and two $\\ce{-O^-}$ (1 bond, 3 lone pairs).",why:"Each O is bonded only to S. As a one-bond fragment, O is the $\\ce{O-}$ piece from p. 7."},{t:"Electron check: $6 + 2(6) + 2(7) = 32$ valence electrons. Four bonds (8) and 12 outer lone pairs (24) use all 32, so S has no lone pairs.",why:"Nothing is left over for S."},{t:"Step 2: $\\text{FC}(\\ce{S}) = 6 - (0 + 4) = +2$. The charges $+2, -1, -1$ add to 0.",why:"A $+2$ says S is short of electrons it could share."},{t:"Step 3: move one lone pair from each $\\ce{O-}$ into an S=O bond. Each move lowers S by 1 and raises that O to 0.",why:"S is in period 3, so 12 electrons around it is allowed (p. 8)."},{t:"Final: S with two S=O and two S–Cl, no lone pairs on S; every formal charge 0.",why:"The smallest formal charges win (p. 4)."}], ans:"Two S=O, two S–Cl, 12 electrons around S, every formal charge 0."}},
    {type:"try", title:"Check and adjust the central atom", gen:"M4C2.g.central-fc"},
    {type:"mcq", title:"Where Method 2 stops for nitrogen", q:"The nitrate ion, $\\ce{NO3-}$, is decorated with three $\\ce{-O^-}$ fragments, which leaves N with formal charge $+2$ and only 6 electrons. What is the best final structure?", opts:[["One N=O and two N–O⁻: N has 8 electrons and formal charge $+1$.",true,"N is a 2nd-row atom, so it stops at 8 electrons even though its formal charge is still $+1$."],["Two N=O and one N–O⁻: N has 10 electrons and formal charge 0.",false,"N can't hold 10 electrons: only atoms beyond the 2nd row expand (p. 8)."],["Three N–O⁻: N keeps 6 electrons.",false,"N almost never has fewer than 8 electrons."],["Three N=O: every O is neutral.",false,"N would have 12 electrons, and the charges would no longer add to $-1$."]], after:"The same decoration works for $\\ce{ClO3-}$, but Cl is in period 3, so it can keep going to formal charge 0. That is the structure drawn on p. 10."},
    {type:"try", title:"Lone pairs on an expanded central atom", gen:"M4C2.g.lp-central"},
    {type:"firstline", title:"Find the first mistake", q:"A student draws the boron trichloride molecule, $\\ce{BCl3}$:", lines:["Valence electrons: $3 + 3(7) = 24$.","Three B–Cl single bonds and three lone pairs on each Cl use all 24 electrons.","B has only 6 electrons, so one Cl lone pair must become a B=Cl double bond.","With B=Cl, B has an octet and every formal charge is 0."], wrong:2, why:"Boron's ideal pattern is 3 bonds with 6 electrons (pp. 6-7). Making B=Cl would give Cl $+1$ and B $-1$, so the structure with three single bonds and every formal charge 0 is the right one. (Line 4 is also wrong: those charges are not 0.)"},
    {type:"formulas", title:"Fragments and rules to know"}
  ]
});
})();
