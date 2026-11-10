/* Chapter 3.4 (Wed Oct 21): Ions and magnetism. Course notes Module 3, pp. 8-9 (sections 3.4 and 3.5 A).
   Configurations of monatomic anions and cations (Example 3-3), why d-block atoms lose ns electrons first,
   the "blind" n + l trap (Mn2+ against V), paramagnetic and diamagnetic atoms (Example 3-4).
   Module 4 (p. 7) uses "isoelectronic" for the same number of valence electrons; this chapter avoids the word in questions and says "same total number of electrons". */
(function(){
const M=C120;
const CH=M.chem;
const NOBLES=[["He",2],["Ne",10],["Ar",18],["Kr",36],["Xe",54]];
const CAP={s:2,p:6,d:10,f:14};
const Z=s=>CH.Z(s), name=s=>CH.NAME[s];
function aufbau(n){ const occ={}; let left=n; for(const s of CH.ORDER){ if(left<=0) break; const c=Math.min(CAP[s[1]],left); occ[s]=c; left-=c; } return occ; }
/* abbreviated string with the largest noble-gas core that fits (so Na+ is [Ne]); core can be forced */
function str(occ,{tex=false,core:force=null}={}){
  const total=Object.values(occ).reduce((a,b)=>a+b,0); let core=null;
  for(const [g,zg] of NOBLES){ if(zg>total) break; const co=aufbau(zg); if(Object.keys(co).every(k=>occ[k]===co[k])) core=[g,co]; if(force&&g===force) break; }
  const keys=CH.ORDER.filter(k=>occ[k] && !(core&&core[1][k]));
  const body=keys.map(k=>tex?`${k}^{${occ[k]}}`:`${k}${occ[k]}`).join(tex?"\\,":" ");
  const c=core?(tex?`[\\mathrm{${core[0]}}]`:`[${core[0]}]`):"";
  return c+(c&&body?(tex?"\\,":" "):"")+body;
}
const occOf=(s,c)=>CH.ionOccupancy(Z(s),c);
const nElec=(s,c)=>Z(s)-c;
/* every way a student may abbreviate it: for a noble-gas-like ion, [Ar] or [Ne] 3s2 3p6 */
function answers(occ){ const a=[str(occ)]; const total=Object.values(occ).reduce((x,y)=>x+y,0); const i=NOBLES.findIndex(([g,n])=>n===total); if(i>0) a.push(str(occ,{core:NOBLES[i-1][0]})); return a; }
const lab=(s,c)=>c===0?s:`${s}^{${Math.abs(c)>1?Math.abs(c):""}${c>0?"+":"-"}}`;
const ce=(s,c)=>`$\\ce{${lab(s,c)}}$`;
const MAIN_CAT=[["Na",1],["Mg",2],["Al",3],["K",1],["Ca",2],["Ga",3],["Ga",1],["Sr",2],["Sn",2],["Sn",4],["In",1],["Se",1],["As",1],["P",1],["Cl",1],["I",1]];
const ANIONS=[["H",-1],["N",-3],["O",-2],["O",-1],["F",-1],["P",-3],["S",-2],["Cl",-1],["Se",-2],["Br",-1],["I",-1],["C",-1],["Si",-1],["Te",-2]];
const D_CAT=[["Sc",3],["Ti",2],["Ti",4],["V",2],["V",3],["Cr",2],["Cr",3],["Mn",2],["Mn",3],["Fe",2],["Fe",3],["Co",2],["Co",3],["Ni",2],["Cu",1],["Cu",2],["Zn",2]];
const steps4ion=(s,c)=>{
  const z=Z(s), n0=CH.occupancy(z), occ=occOf(s,c); const out=[`Neutral ${s}: $${str(n0,{tex:true})}$ (${z} electrons).`];
  if(c<0){ out.push(`${ce(s,c)} has ${-c} extra electron${c<-1?"s":""}: ${z-c} in all. Add ${c<-1?"them":"it"} in $n + l$ order (rule i, p. 8).`); }
  else {
    const gone=[]; const o={...n0}; for(let i=0;i<c;i++){ const k=Object.keys(o).filter(k=>o[k]>0).sort((a,b)=>(+b[0])-(+a[0])||"spdf".indexOf(b[1])-"spdf".indexOf(a[1]))[0]; o[k]--; gone.push(k); }
    const tally={}; gone.forEach(k=>tally[k]=(tally[k]||0)+1);
    out.push(`${ce(s,c)} has ${c} fewer electron${c>1?"s":""}: ${z-c} in all. Remove from the highest $n$ first; for a tie in $n$, the highest $l$ first (rule ii, p. 8).`);
    out.push(`Removed: ${Object.entries(tally).map(([k,v])=>`${v} from $${k}$`).join(", ")}.`);
    if(n0["4s"] && n0["3d"] && gone.includes("4s")) out.push("For a d-block atom the $4s$ electrons leave before any $3d$ electron, even though $4s$ filled first.");
  }
  out.push(`${ce(s,c)}: $${str(occ,{tex:true})}$.`); return out;
};
const boxes=(k,e)=>{ const n=CAP[k[1]]/2; const up=Math.min(e,n), dn=Math.max(0,e-n); return [...Array(n)].map((_,i)=>i<dn?"↑↓":i<up?"↑":"_").join("  "); };

M.chapter({
  id:"M3C4", module:"m3", n:4, num:"3.4", date:"2026-10-21", added:"2026-10-26", quiz:"PC4",
  title:"Ions and magnetism", pages:"8-9", sections:["3.4","3.5"],
  summary:"Write the neutral atom first. Anions add electrons in $n + l$ order; cations lose them from the highest $n$ first, then the highest $l$, so d-block atoms lose $ns$ before $(n-1)d$. Unpaired electrons make an atom or ion paramagnetic; with all electrons paired it is diamagnetic.",
  flags:[],
  formulas:[
    {id:"M3C4.f.anion", name:"Monatomic anions", tex:"\\text{neutral configuration, then add } e^- \\text{ by the } (n+l) \\text{ rule}", kind:"rule", ref:"p. 8"},
    {id:"M3C4.f.cation", name:"Monatomic cations", tex:"\\text{neutral configuration, then remove from the highest } n\\text{; tie: highest } l", kind:"rule", ref:"p. 8",
      note:"Br to Br$^+$ loses a $4p$ electron (same $n$ as $4s$, higher $l$). Fe to Fe$^{2+}$ loses both $4s$ electrons."},
    {id:"M3C4.f.ns-first", name:"d-block cations lose ns first", tex:"ns^2\\,(n-1)d^{\\,G-2} \\;\\to\\; \\text{remove } ns \\text{ before } (n-1)d", kind:"rule", ref:"p. 8", note:"Found by experiment. Mn$^{2+}$ is $[\\mathrm{Ar}]\\,3d^5$, not $[\\mathrm{Ar}]\\,4s^2\\,3d^3$ (that is neutral V)."},
    {id:"M3C4.f.dia", name:"Diamagnetic", tex:"\\text{all electrons paired} \\Rightarrow \\text{no magnetic moment, weak interaction with a magnet}", kind:"rule", ref:"p. 9"},
    {id:"M3C4.f.para", name:"Paramagnetic", tex:"\\ge 1 \\text{ unpaired electron} \\Rightarrow \\text{magnetic moment, strong interaction with a magnet}", kind:"rule", ref:"p. 9"}
  ],
  glossary:[
    {id:"M3C4.t.anion", term:"Monatomic anion", def:"A single atom that has gained one or more electrons, such as $\\ce{O^2-}$ or $\\ce{Cl-}$.", ref:"p. 8"},
    {id:"M3C4.t.cation", term:"Monatomic cation", def:"A single atom that has lost one or more electrons, such as $\\ce{Ni^2+}$ or $\\ce{S+}$.", ref:"p. 8"},
    {id:"M3C4.t.moment", term:"Magnetic moment", def:"The net magnetic field of an atom. Each electron's spin makes a small field; paired spins cancel, unpaired spins leave a net moment.", ref:"p. 9"},
    {id:"M3C4.t.para", term:"Paramagnetic", def:"Having one or more unpaired electrons. The atom has a magnetic moment and is strongly affected by an external magnet.", ref:"p. 9"},
    {id:"M3C4.t.dia", term:"Diamagnetic", def:"Having every electron paired. No magnetic moment, and only a weak interaction with an external magnet.", ref:"p. 9"},
    {id:"M3C4.t.iso", term:"Isoelectronic", def:"Module 4 (p. 7) defines isoelectronic species as having the same number of <b>valence</b> electrons, such as $\\ce{N+}$ and C. Many textbooks use it for the same <b>total</b> number of electrons, such as $\\ce{Na+}$, $\\ce{F-}$ and Ne (10 each); that second sense is not from the notes. Module 3 makes the related point that Mn$^{2+}$ and V both have 23 electrons in all but different configurations.", ref:"p. 8"}
  ],
  figures:{
    ion:{title:"Remove electrons from an atom", cap:"The energy-level diagram and 3D orbitals for iron. Raise the charge to take electrons away and watch which level empties first.", ref:"p. 8",
      model:{type:"aufbau", params:{element:"Fe", charge:2, maxZ:36}},
      predict:{q:"Iron is $[\\mathrm{Ar}]\\,4s^2\\,3d^6$. Which electrons leave when Fe becomes $\\ce{Fe^2+}$?", opts:[["Two $3d$ electrons, because $3d$ filled last",false,"Filling order is not leaving order. The highest $n$ goes first."],["Both $4s$ electrons",true,"$n = 4$ is higher than $n = 3$, so $4s$ empties first: $[\\mathrm{Ar}]\\,3d^6$ (p. 8)."],["One $4s$ and one $3d$",false,"Both come from the highest $n$, which is $4s$."],["Two $3p$ electrons",false,"Inner electrons stay."]], check:"Set the charge to 0, +1, +2, then +3 and watch which level loses each electron."}},
    boxes:{title:"Orbital boxes and magnetism", cap:"Pick an atom or ion. The diagram draws the subshells outside the noble-gas core as orbital boxes, filled by Hund's rule, and counts the unpaired electrons.", ref:"pp. 8-9",
      build(host,{PLOT,M}){
        const LIST=[["O",0],["N",0],["Ne",0],["Mg",0],["Zn",0],["Zn",2],["Fe",0],["Fe",2],["Fe",3],["Cr",0],["Cr",3],["Cu",0],["Cu",1],["Cu",2],["Mn",2],["V",0],["Co",3],["Ni",2],["Na",1],["Cl",-1],["Se",-2],["Br",1],["Ga",3],["Sc",3]];
        let cur=7;
        const ctl=PLOT.controls(host); const sel=document.createElement("select"); sel.setAttribute("aria-label","Atom or ion");
        LIST.forEach(([s,c],i)=>{ const o=document.createElement("option"); o.value=i; o.textContent=c===0?`${s} (atom)`:`${s}${Math.abs(c)>1?Math.abs(c):""}${c>0?"+":"−"}`; if(i===cur) o.selected=true; sel.append(o); });
        sel.onchange=()=>{ cur=+sel.value; draw(); }; ctl.append(sel);
        const svgHost=document.createElement("div"); host.append(svgHost); const out=PLOT.readout(host);
        function draw(){
          const [s,c]=LIST[cur]; const occ=CH.ionOccupancy(CH.Z(s),c); const total=CH.Z(s)-c;
          let core=null; for(const [g,zg] of NOBLES){ if(zg>total) break; const co=aufbau(zg); if(Object.keys(co).every(k=>occ[k]===co[k])) core=[g,co,zg]; }
          let keys=CH.ORDER.filter(k=>occ[k]&&!(core&&core[1][k]));
          const show=keys.length?keys:(core?Object.keys(core[1]).slice(-2):[]);
          const W=520; let y=34; let g="";
          if(core) g+=`<text x="10" y="20" style="font-size:12px">core: [${core[0]}] (${core[2]} electrons, all paired)</text>`;
          let u=0;
          for(const k of show){ const n=CAP[k[1]]/2, e=occ[k]||0; const dn=Math.max(0,e-n);
            g+=`<text x="10" y="${y+22}" style="font-size:14px;font-weight:600">${k}</text>`;
            for(let i=0;i<n;i++){ const x=60+i*46; const has=i<Math.min(e,n), pair=i<dn; if(has&&!pair) u++;
              g+=`<rect x="${x}" y="${y}" width="40" height="34" rx="4" style="fill:${has&&!pair?"color-mix(in srgb,var(--accent) 18%,var(--paper))":"var(--paper)"};stroke:var(--fig-stroke);stroke-width:1.3"/>`;
              if(has) g+=`<path d="M${x+14} ${y+28} L${x+14} ${y+6} M${x+9} ${y+12} L${x+14} ${y+5} L${x+19} ${y+12}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`;
              if(pair) g+=`<path d="M${x+27} ${y+6} L${x+27} ${y+28} M${x+22} ${y+22} L${x+27} ${y+29} L${x+32} ${y+22}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`;
            }
            y+=46; }
          const para=u>0;
          g+=`<text x="10" y="${y+12}" style="font-size:11px">pull from a magnet (schematic)</text><rect x="290" y="${y+1}" width="200" height="14" rx="7" style="fill:var(--fig-soft);stroke:var(--rule)"/><rect x="290" y="${y+1}" width="${para?Math.min(200,30+28*u):8}" height="14" rx="7" style="fill:var(--accent);opacity:.8"/>`;
          svgHost.innerHTML=`<svg viewBox="0 0 ${W} ${y+26}" class="fig" role="img" aria-label="Orbital boxes for ${s} ${c}">${g}</svg>`;
          out.innerHTML=M.rich(`${ce(s,c)}: $${str(occ,{tex:true})}$, ${total} electrons. <b>${u} unpaired</b>, so it is <b>${para?"paramagnetic":"diamagnetic"}</b>${para?": the spins do not cancel and it is drawn into a magnetic field.":": every spin is cancelled by a partner."}`);
        }
        draw();
      }}
  },
  gens:[
    {id:"M3C4.g.ion", title:"Configuration of a monatomic ion", skill:"Anions add by $n + l$; cations lose highest $n$, then highest $l$", ref:"p. 8",
      gen(R,d){
        const [s,c]=d===1?R.pick(R()<0.5?MAIN_CAT.slice(0,8):ANIONS):d===2?R.pick(D_CAT.filter(x=>!(x[0]==="Ni"&&x[1]===2))):R.pick([...D_CAT.filter(x=>["Cr","Cu","Co","Mn","Ni"].includes(x[0])),...MAIN_CAT.slice(6),["Br",1],["Se",-2],["Te",-2]]);
        const occ=occOf(s,c);
        return {prompt:`Write the abbreviated ground-state configuration of ${ce(s,c)}.`,
          answer:{type:"config",answer:answers(occ),form:"short"},
          hint:c<0?"Write the neutral atom, then add the extra electrons in the $n + l$ order.":"Write the neutral atom, then remove electrons from the highest $n$ first (for a tie, the highest $l$).",
          steps:steps4ion(s,c), answerTeX:`$${str(occ,{tex:true})}$`};
      }},
    {id:"M3C4.g.counts", title:"Electrons in 4s, 3d and unpaired", skill:"Count electrons subshell by subshell in an ion", ref:"pp. 8-9",
      gen(R,d){
        const pool=d===1?D_CAT.filter(x=>x[1]===2):d===2?D_CAT.filter(x=>x[1]===3||x[0]==="Ti"&&x[1]===4):[...D_CAT.filter(x=>["Cr","Cu"].includes(x[0])),["Ga",3],["Ga",1],["Se",1],["As",1]];
        const [s,c]=R.pick(pool); const occ=occOf(s,c); const u=CH.unpaired(occ);
        const n4s=occ["4s"]||0, n3d=occ["3d"]||0, n4p=occ["4p"]||0;
        return {prompt:`Take ${ce(s,c)} in its ground state. Count its electrons in $4s$, in $3d$ and in $4p$, and count its unpaired electrons.`,
          parts:[{label:"$4s$ electrons",answer:{type:"int",value:n4s}},{label:"$3d$ electrons",answer:{type:"int",value:n3d}},{label:"$4p$ electrons",answer:{type:"int",value:n4p}},{label:"Unpaired electrons",answer:{type:"int",value:u}}],
          hint:"Write the neutral atom first. A cation loses its $4s$ electrons before any $3d$ electron, and $4p$ before $4s$.",
          steps:[...steps4ion(s,c),`Counts: $4s$: ${n4s}, $3d$: ${n3d}, $4p$: ${n4p}.`,n3d&&n3d<10?`$3d^{${n3d}}$: ${boxes("3d",n3d)}.`:"",`Unpaired electrons: ${u}.`].filter(Boolean),
          answerTeX:`${n4s}, ${n3d}, ${n4p}; ${u} unpaired`};
      }},
    {id:"M3C4.g.first-out", title:"Which subshell loses the first electron?", skill:"Highest $n$ first, then highest $l$", ref:"p. 8",
      gen(R,d){
        const pool=d===1?["Na","Mg","K","Ca","Al","Cl"]:d===2?["Fe","Co","Ni","Zn","Ti","V","Mn","Ga","Br","Se"]:["Cu","Cr","Ga","As","Sn","Zn","Sc","Ge"];
        const s=R.pick(pool), z=Z(s), occ=CH.occupancy(z);
        const k=Object.keys(occ).sort((a,b)=>(+b[0])-(+a[0])||"spdf".indexOf(b[1])-"spdf".indexOf(a[1]))[0];
        return {prompt:`When ${/^[aeiou]/i.test(name(s))?"an":"a"} ${name(s).toLowerCase()} atom loses one electron to form ${ce(s,1)}, which subshell does the electron come from? (Type it like 3p.)`,
          answer:{type:"text",accept:[k,`${k[0]} ${k[1]}`]},
          hint:"Write the neutral configuration. Look for the highest $n$; if two subshells share it, take the one with the higher $l$.",
          steps:[`${s}: $${str(occ,{tex:true})}$.`,`Highest $n$ present: $n = ${k[0]}$ (${Object.keys(occ).filter(x=>x[0]===k[0]).map(x=>`$${x}$`).join(" and ")}).`,`Among those, the highest $l$ is $${k}$.`,`The electron comes from $${k}$.`],
          answerTeX:`$${k}$`};
      }},
    {id:"M3C4.g.iso", title:"Same total number of electrons", skill:"Count total electrons in atoms and ions", ref:"p. 8",
      gen(R,d){
        const SET={10:[["Ne",0],["F",-1],["O",-2],["N",-3],["Na",1],["Mg",2],["Al",3]],18:[["Ar",0],["Cl",-1],["S",-2],["P",-3],["K",1],["Ca",2],["Sc",3]],36:[["Kr",0],["Br",-1],["Se",-2],["Rb",1],["Sr",2]],2:[["He",0],["H",-1],["Li",1],["Be",2]]};
        const n=R.pick(d===1?[10,18]:d===2?[10,18,36]:[2,10,18,36]);
        const same=R.shuffle(SET[n]); const target=same[0]; const right=same.slice(1,1+R.int(1,Math.min(3,same.length-1)));
        const others=[]; for(const k of Object.keys(SET)) if(+k!==n) others.push(...SET[k]);
        others.push(["Na",0],["Cl",0],["O",-1],["Mg",1],["K",0],["Ca",1],["S",-1]);
        const wrongs=R.shuffle(others.filter(([s,c])=>nElec(s,c)!==n)).filter((x,i,a)=>a.findIndex(y=>y[0]===x[0]&&y[1]===x[1])===i).slice(0,5-right.length);
        const opts=R.shuffle([...right.map(x=>[x,true]),...wrongs.map(x=>[x,false])]);
        return {prompt:`Which of these have the same total number of electrons as ${ce(...target)}? Select all that apply.`,
          answer:{type:"multi",options:opts.map(([x])=>`${ce(...x)}`),correct:opts.map((o,i)=>o[1]?i:-1).filter(i=>i>=0),why:opts.map(([x])=>x[1]===0?`${ce(...x)}: neutral, $Z = ${Z(x[0])}$, so ${Z(x[0])} electrons.`:`${ce(...x)}: $${Z(x[0])}${x[1]>0?" - "+x[1]:" + "+(-x[1])} = ${nElec(...x)}$ electrons.`)},
          hint:"Electrons in an ion $= Z - \\text{charge}$. Compare each total with the target's.",
          steps:[target[1]===0?`${ce(...target)}: neutral, $Z = ${n}$, so ${n} electrons.`:`${ce(...target)}: $Z = ${Z(target[0])}$, so $${Z(target[0])}${target[1]>0?" - "+target[1]:" + "+(-target[1])} = ${n}$ electrons.`,...opts.map(([x,ok])=>`${ce(...x)}: ${nElec(...x)} electrons${ok?" (match)":""}.`)],
          answerTeX:right.map(x=>ce(...x)).join(", ")};
      }},
    {id:"M3C4.g.magnetic", title:"Paramagnetic or diamagnetic?", skill:"Unpaired electrons decide", ref:"p. 9",
      gen(R,d){
        const pool=d===1?[["He",0],["Be",0],["B",0],["C",0],["N",0],["O",0],["F",0],["Ne",0],["Mg",0],["Na",0],["Ar",0],["Ca",0]]:d===2?[["Zn",0],["Fe",0],["Mn",0],["Sc",0],["Ca",0],["Kr",0],["Ni",0],["Ga",0],["Se",0],["Cu",0],["Cr",0],["Sr",0]]:[["Zn",2],["Fe",3],["Cu",1],["Cu",2],["Na",1],["O",-2],["Mn",2],["Co",3],["Ga",3],["Br",1],["Cr",3],["Sc",3],["Ti",4],["Ni",2]];
        const want=R.pick(["paramagnetic","diamagnetic"]);
        let pick, cor; for(let t=0;t<40;t++){ pick=R.shuffle(pool).slice(0,5); if(pick.map(x=>x[0]).sort().join()==="B,Be,C,N,O") continue; cor=pick.map(([s,c],i)=>((CH.unpaired(occOf(s,c))>0)===(want==="paramagnetic"))?i:-1).filter(i=>i>=0); if(cor.length>=1&&cor.length<=4) break; }
        const lines=pick.map(([s,c])=>{ const o=occOf(s,c), u=CH.unpaired(o); return `${ce(s,c)}: $${str(o,{tex:true})}$, ${u} unpaired.`; });
        return {prompt:`Select every species below that is <b>${want}</b> in its ground state.`,
          answer:{type:"multi",options:pick.map(x=>ce(...x)),correct:cor,why:lines},
          hint:"Write each configuration and look for part-filled subshells. Any unpaired electron makes it paramagnetic; all paired makes it diamagnetic.",
          steps:[...lines,`${want[0].toUpperCase()+want.slice(1)}: ${cor.map(i=>ce(...pick[i])).join(", ")}.`],
          answerTeX:cor.map(i=>ce(...pick[i])).join(", ")};
      }}
  ],
  exam:[
    {id:"M3C4.q1", ref:"p. 8", q:"What is the ground-state configuration of $\\ce{Co^3+}$?", opts:[["$[\\mathrm{Ar}]\\,3d^6$",true,"Co is $[\\mathrm{Ar}]\\,4s^2\\,3d^7$. Remove both $4s$ electrons, then one $3d$."],["$[\\mathrm{Ar}]\\,4s^2\\,3d^4$",false,"$3d$ electrons were removed before $4s$. The highest $n$ goes first."],["$[\\mathrm{Ar}]\\,4s^1\\,3d^5$",false,"Both $4s$ electrons leave before any $3d$."],["$[\\mathrm{Ar}]\\,3d^7$",false,"That is $\\ce{Co^2+}$."],["$[\\mathrm{Ar}]\\,4s^2\\,3d^{10}$",false,"That has 30 electrons; $\\ce{Co^3+}$ has 24."]]},
    {id:"M3C4.q2", ref:"p. 8", q:"Which ion has the same number of electrons as an argon atom?", opts:[["$\\ce{Na+}$",false,"10 electrons, like Ne."],["$\\ce{Ca^2+}$",true,"$20 - 2 = 18$."],["$\\ce{Br-}$",false,"36 electrons, like Kr."],["$\\ce{Mg^2+}$",false,"10 electrons."],["$\\ce{F-}$",false,"10 electrons."]]},
    {id:"M3C4.q3", ref:"p. 9", multi:true, q:"Which of these atoms are diamagnetic in their ground states? Select all that apply.", opts:[["Mg",true,"$[\\mathrm{Ne}]\\,3s^2$: all paired."],["Zn",true,"$[\\mathrm{Ar}]\\,4s^2\\,3d^{10}$: all paired."],["Kr",true,"Full shells: all paired."],["O",false,"$2p^4$ has 2 unpaired."],["Cu",false,"$4s^1\\,3d^{10}$ has 1 unpaired."]]},
    {id:"M3C4.q4", ref:"pp. 8-9", q:"How many unpaired electrons does $\\ce{Fe^2+}$ have?", opts:[["2",false,"Too few. $3d^6$ in five orbitals: one pair and four single electrons."],["4",true,"$[\\mathrm{Ar}]\\,3d^6$: ↑↓ ↑ ↑ ↑ ↑."],["5",false,"That is $\\ce{Fe^3+}$ ($3d^5$)."],["6",false,"Only five $d$ orbitals: the sixth electron pairs."],["0",false,"$3d^6$ is part-filled."]]},
    {id:"M3C4.q5", ref:"p. 8", q:"When a germanium atom ($[\\mathrm{Ar}]\\,4s^2\\,3d^{10}\\,4p^2$) forms $\\ce{Ge+}$, which electron is removed?", opts:[["A $3d$ electron",false,"$n = 3$ is lower than $n = 4$."],["A $4s$ electron",false,"$4s$ and $4p$ share $n = 4$; the higher $l$ ($4p$) goes first."],["A $4p$ electron",true,"Highest $n$ is 4; between $4s$ and $4p$, the higher $l$ leaves first."],["A $3p$ electron",false,"Inner electrons stay."],["Any of them, at random",false,"The rule picks one."]]},
    {id:"M3C4.q6", ref:"p. 8", q:"$\\ce{Mn^2+}$ and a neutral V atom both have 23 electrons. Which statement is correct?", opts:[["Both are $[\\mathrm{Ar}]\\,4s^2\\,3d^3$.",false,"That is only V. Applying the $n + l$ rule blindly to 23 electrons is the trap."],["$\\ce{Mn^2+}$ is $[\\mathrm{Ar}]\\,3d^5$; V is $[\\mathrm{Ar}]\\,4s^2\\,3d^3$.",true,"Mn loses its two $4s$ electrons; V is a neutral atom built by $n + l$ (p. 8)."],["Both are $[\\mathrm{Ar}]\\,3d^5$.",false,"Neutral V keeps $4s^2$."],["$\\ce{Mn^2+}$ is $[\\mathrm{Ar}]\\,4s^2\\,3d^3$; V is $[\\mathrm{Ar}]\\,3d^5$.",false,"Backwards."],["Ions and atoms with the same electron count always have the same configuration.",false,"This pair is the counterexample in the notes."]]},
    {id:"M3C4.q7", ref:"p. 9", q:"Which statement about a paramagnetic atom is correct?", opts:[["All of its electrons are paired.",false,"That is diamagnetic."],["It has a magnetic moment and interacts strongly with an external magnetic field.",true,"Unpaired spins do not cancel (p. 9)."],["It is not affected by a magnet at all.",false,"Even diamagnetic atoms interact weakly."],["It must be an ion.",false,"Many neutral atoms are paramagnetic, like O and Fe."],["It has an even number of electrons.",false,"Count does not decide; pairing does. N has 7 electrons and is paramagnetic."]]}
  ],
  steps:[
    {type:"read", title:"An ion starts from its neutral atom", ref:"p. 8", body:"<p>For a monatomic ion, always write the neutral atom first. Then:</p><div class=\"box def\"><b class=\"t\">Rules for ions (p. 8)</b>(i) <b>Anions</b>: add the extra electrons in the $n + l$ order.<br>(ii) <b>Cations</b>: remove electrons from the highest $n$ first. If two subshells have the same $n$, remove from the higher $l$ first.</div><p>Rule (ii) matters most for the d block. A d-block atom is $ns^2\\,(n-1)d^{\\,G-2}$, and experiments show the $ns$ electrons leave first, even though they went in first.</p><p>An analogy: guests who arrive early at a party may grab the seats nearest the door. They are not the most recent arrivals, but they are the first to leave.</p>"},
    {type:"example", title:"Configurations of Fe³⁺ and Se²⁻", ref:"p. 8", ex:{q:"Write abbreviated ground-state configurations for $\\ce{Fe^3+}$ and $\\ce{Se^2-}$.", steps:[{t:"Fe: $[\\mathrm{Ar}]\\,4s^2\\,3d^6$ (26 electrons).",why:"Always start from the neutral atom."},{t:"$\\ce{Fe^3+}$ has 23 electrons: remove 3. The highest $n$ is 4, so both $4s$ electrons go first, then one $3d$.",why:"Rule (ii): highest $n$ first."},{t:"$\\ce{Fe^3+} = [\\mathrm{Ar}]\\,3d^5$.",why:"Check: $18 + 5 = 23$."},{t:"Se: $[\\mathrm{Ar}]\\,4s^2\\,3d^{10}\\,4p^4$ (34 electrons).",why:"Group 16, period 4."},{t:"$\\ce{Se^2-}$ has 36 electrons: add 2 into $4p$, the next place in the $n + l$ order.",why:"Rule (i)."},{t:"$\\ce{Se^2-} = [\\mathrm{Ar}]\\,4s^2\\,3d^{10}\\,4p^6$, which is the same as $[\\mathrm{Kr}]$.",why:"36 electrons: the krypton configuration."}], ans:"$\\ce{Fe^3+} = [\\mathrm{Ar}]\\,3d^5$; $\\ce{Se^2-} = [\\mathrm{Ar}]\\,4s^2\\,3d^{10}\\,4p^6 = [\\mathrm{Kr}]$.", ref:"p. 8"}},
    {type:"try", title:"Configuration of an ion", gen:"M3C4.g.ion"},
    {type:"explore", title:"Take electrons away from iron", fig:"ion", ref:"p. 8", body:"<p>Raise the charge one step at a time. The first two electrons come out of $4s$, the third out of $3d$. Compare with the filling order: $4s$ went in before $3d$, yet it is also the first to go.</p>"},
    {type:"try", title:"Which subshell loses the first electron?", gen:"M3C4.g.first-out"},
    {type:"read", title:"The blind n + l trap", ref:"p. 8", body:"<p>$\\ce{Mn^2+}$ has 23 electrons. If you ignore where they came from and fill 23 electrons by the $n + l$ rule, you get $[\\mathrm{Ar}]\\,4s^2\\,3d^3$. That is wrong: it is the configuration of the <b>neutral atom</b> with 23 electrons, vanadium.</p><p>The right way: Mn is $[\\mathrm{Ar}]\\,4s^2\\,3d^5$, and removing the two $4s$ electrons gives $\\ce{Mn^2+} = [\\mathrm{Ar}]\\,3d^5$.</p><p>Many textbooks call species with the same total number of electrons <b>isoelectronic</b>. (Careful: Module 4, p. 7 uses that word for the same number of <i>valence</i> electrons.) Same total electron count does not always mean same configuration: $\\ce{Mn^2+}$ and V show it. For main-group ions it usually does: $\\ce{Na+}$, $\\ce{F-}$ and Ne are all $1s^2\\,2s^2\\,2p^6$.</p>"},
    {type:"mcq", title:"Same count, different configuration", q:"Which pair below has the same total number of electrons <b>and</b> the same configuration?", opts:[["$\\ce{Cu+}$ and Zn",false,"$\\ce{Cu+}$ has 28 electrons and Zn has 30."],["$\\ce{Zn^2+}$ and $\\ce{Cu+}$",true,"Both have 28 electrons and both are $[\\mathrm{Ar}]\\,3d^{10}$."],["$\\ce{Fe^2+}$ and Cr",false,"Both have 24 electrons, but $\\ce{Fe^2+}$ is $[\\mathrm{Ar}]\\,3d^6$ and Cr is $[\\mathrm{Ar}]\\,4s^1\\,3d^5$."],["$\\ce{Mn^2+}$ and V",false,"23 electrons each, but $[\\mathrm{Ar}]\\,3d^5$ against $[\\mathrm{Ar}]\\,4s^2\\,3d^3$."]]},
    {type:"try", title:"Same total number of electrons", gen:"M3C4.g.iso"},
    {type:"read", title:"Paired spins cancel; unpaired spins do not", ref:"p. 9", body:"<p>Each electron's spin makes a tiny magnetic field, like a tiny bar magnet. Two electrons sharing an orbital have opposite spins, so their fields cancel.</p><ul><li><b>Diamagnetic</b>: every electron is paired. No magnetic moment, and only a weak interaction with an external magnet.</li><li><b>Paramagnetic</b>: one or more unpaired electrons. The atom has a magnetic moment and is strongly affected by a magnet.</li></ul><p>So the test is simple: write the configuration, use Hund's rule on any part-filled subshell, and look for an unpaired electron.</p>"},
    {type:"explore", title:"Draw the boxes, count the spins", fig:"boxes", ref:"pp. 8-9", body:"<p>Compare Fe, $\\ce{Fe^2+}$ and $\\ce{Fe^3+}$: the unpaired count goes 4, 4, 5. Then compare Zn with $\\ce{Zn^2+}$, and Cu with $\\ce{Cu+}$ and $\\ce{Cu^2+}$. Which ones are diamagnetic?</p>"},
    {type:"try", title:"Electrons in 4s, 3d and unpaired", gen:"M3C4.g.counts"},
    {type:"mcq", title:"Atom against ion", q:"Zinc is diamagnetic. What about $\\ce{Zn^2+}$?", opts:[["Paramagnetic: it lost two electrons",false,"It lost the paired $4s^2$, leaving $3d^{10}$, which is also all paired."],["Diamagnetic: it is $[\\mathrm{Ar}]\\,3d^{10}$, all paired",true,"Removing a full $4s^2$ leaves only full subshells."],["It cannot be decided without data",false,"The configuration decides it."]]},
    {type:"try", title:"Paramagnetic or diamagnetic?", gen:"M3C4.g.magnetic"},
    {type:"firstline", title:"Find the first mistake", q:"A student writes the configuration of $\\ce{Fe^2+}$:", lines:["Fe is $[\\mathrm{Ar}]\\,4s^2\\,3d^6$.","$\\ce{Fe^2+}$ has $26 - 2 = 24$ electrons.","$3d$ filled last, so the two electrons come out of $3d$.","$\\ce{Fe^2+} = [\\mathrm{Ar}]\\,4s^2\\,3d^4$."], wrong:2, why:"Cations lose electrons from the highest $n$ first. $4s$ ($n = 4$) empties before $3d$ ($n = 3$), so $\\ce{Fe^2+} = [\\mathrm{Ar}]\\,3d^6$ (p. 8)."},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
