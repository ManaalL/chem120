/* Chapter 3.3 (Wed Oct 21): The periodic table and configuration exceptions. Course notes Module 3, pp. 6-7 (section 3.3).
   Periods, groups and blocks, the block formulas, valence electrons from the group number, abbreviated configurations
   (Example 3-2), the starred exceptions, Cr and Cu, and the notes' point that "half-filled stability" is a myth (W).
   Positions are worked out here (not with C120.chem.position) so the p block of periods 2 and 3 lands in groups 13 to 18. */
(function(){
const M=C120;
const CH=M.chem;
const NOBLES=[["He",2],["Ne",10],["Ar",18],["Kr",36],["Xe",54],["Rn",86]];
const STARRED=["Cr","Cu","Nb","Mo","Ru","Rh","Pd","Ag","Pt","Au","La","Gd","Ac","Th","Pa","U","Np","Cm"];
const EXTRA_SYMS="Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
const symOf=z=>z<=103?CH.sym(z):EXTRA_SYMS[z-104];
const name=z=>CH.NAME[CH.sym(z)], lname=z=>name(z).toLowerCase();
const CAP={s:2,p:6,d:10,f:14};
/* period, group and block as in the notes' table (p. 6); La-Lu and Ac-Lr are the f block */
function pos(z){
  const P=[[1,2],[3,10],[11,18],[19,36],[37,54],[55,86],[87,118]];
  const period=P.findIndex(([a,b])=>z>=a&&z<=b)+1; const k=z-P[period-1][0];
  if(period===1) return {period,group:z===1?1:18,block:"s"};
  if(period<=3) return {period,group:k<2?k+1:k+11,block:k<2?"s":"p"};
  if(period<=5) return {period,group:k+1,block:k<2?"s":k<12?"d":"p"};
  if(k<2) return {period,group:k+1,block:"s"};
  if(k<17) return {period,group:null,block:"f"};
  const g=k-13; return {period,group:g,block:g<=12?"d":"p"};
}
/* Aufbau prediction with no exceptions (what the position in the table gives) */
function aufbau(n){ const occ={}; let left=n; for(const s of CH.ORDER){ if(left<=0) break; const c=Math.min(CAP[s[1]],left); occ[s]=c; left-=c; } return occ; }
function str(occ,{short=true,tex=false}={}){
  const total=Object.values(occ).reduce((a,b)=>a+b,0); let core=null;
  if(short) for(const [g,zg] of NOBLES){ if(zg>total) break; const co=aufbau(zg); if(Object.keys(co).every(k=>occ[k]===co[k])) core=[g,co]; }
  const keys=CH.ORDER.filter(k=>occ[k] && !(core&&core[1][k]));
  const body=keys.map(k=>tex?`${k}^{${occ[k]}}`:`${k}${occ[k]}`).join(tex?"\\,":" ");
  const c=core?(tex?`[\\mathrm{${core[0]}}]`:`[${core[0]}]`):"";
  return c+(c&&body?(tex?"\\,":" "):"")+body;
}
const actual=z=>CH.occupancy(z);
const valence=g=>g<=12?g:g-10;
const isNoble=z=>[2,10,18,36,54,86].includes(z);
const okZ=z=>!isNoble(z) && !STARRED.includes(CH.sym(z));

M.chapter({
  id:"M3C3", module:"m3", n:3, num:"3.3", date:"2026-10-21", added:"2026-10-26", quiz:"PC4",
  title:"The periodic table and configuration exceptions", pages:"6-7", sections:["3.3"],
  summary:"The periodic table is a map of electron configurations: the period gives the outer shell, the block gives the subshell that received the last electron, and the group number gives the valence electrons. Cr and Cu are the two exceptions to know: $[\\mathrm{Ar}]\\,4s^1\\,3d^5$ and $[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$.",
  flags:[
    {ref:"p. 6", text:"The p-block formula $(n-1)d^{10}\\,ns^2\\,np^{G-12}$ is printed \"for $n > 4$\". It should be $n \\ge 4$ (or $n > 3$): as printed, period 4 (Ga to Kr, which do have $3d^{10}$) is covered by neither formula. For periods 6 and 7 the full configuration also includes $(n-2)f^{14}$, which the formula leaves out."},
    {ref:"p. 6", text:"Minor and outside what you are tested on: Ce is not starred, although its accepted ground state ($[\\mathrm{Xe}]\\,6s^2\\,4f^1\\,5d^1$) differs from the position-based $[\\mathrm{Xe}]\\,6s^2\\,4f^2$ (not from the notes). Only Cr and Cu need to be known."}
  ],
  formulas:[
    {id:"M3C3.f.s-block", name:"s block valence configuration", tex:"ns^{G}", ref:"p. 6", note:"Groups 1 and 2, plus He. $n$ is the period, $G$ the group.",
      blank:{tex:"\\text{s block: } ns^{\\boxed{\\,?\\,}}", accept:["G"]}},
    {id:"M3C3.f.d-block", name:"d block valence configuration", tex:"(n-1)d^{\\,G-2}\\,ns^{2}", ref:"p. 6", note:"Groups 3 to 12. The notes also write it $ns^2\\,(n-1)d^{\\,G-2}$ (p. 8). Cr and Cu are exceptions.",
      blank:{tex:"(n-1)d^{\\,\\boxed{\\,?\\,}}\\,ns^{2}", accept:["G-2","G - 2"]}},
    {id:"M3C3.f.p-block-low", name:"p block, periods 2 and 3", tex:"ns^{2}\\,np^{\\,G-12}\\quad(n \\le 3)", ref:"p. 6",
      blank:{tex:"ns^{2}\\,np^{\\,\\boxed{\\,?\\,}}", accept:["G-12","G - 12"]}},
    {id:"M3C3.f.p-block-high", name:"p block, period 4 and below", tex:"(n-1)d^{10}\\,ns^{2}\\,np^{\\,G-12}\\quad(n \\ge 4)", ref:"p. 6", note:"Printed as \"$n > 4$\"; see the flag. From period 6 on, a full $(n-2)f^{14}$ is also inside."},
    {id:"M3C3.f.valence", name:"Valence electrons from the group number", tex:"G \\le 12:\\ \\#\\,\\text{valence } e^- = G\\qquad G \\ge 13:\\ \\#\\,\\text{valence } e^- = G-10", kind:"rule", ref:"p. 6", note:"He is the exception: 2 valence electrons although it sits in group 18.",
      blank:{tex:"G \\ge 13:\\ \\#\\,\\text{valence } e^- = \\boxed{\\,?\\,}", accept:["G-10","G - 10"]}},
    {id:"M3C3.f.cr", name:"Chromium (exception)", tex:"\\mathrm{Cr}:\\ [\\mathrm{Ar}]\\,4s^{1}\\,3d^{5}\\quad(\\text{not } 4s^{2}\\,3d^{4})", kind:"rule", ref:"p. 7",
      blank:{tex:"\\mathrm{Cr}:\\ [\\mathrm{Ar}]\\,\\boxed{\\,?\\,}", accept:["4s1 3d5","4s^1 3d^5","3d5 4s1","4s1, 3d5"]}},
    {id:"M3C3.f.cu", name:"Copper (exception)", tex:"\\mathrm{Cu}:\\ [\\mathrm{Ar}]\\,4s^{1}\\,3d^{10}\\quad(\\text{not } 4s^{2}\\,3d^{9})", kind:"rule", ref:"p. 7",
      blank:{tex:"\\mathrm{Cu}:\\ [\\mathrm{Ar}]\\,\\boxed{\\,?\\,}", accept:["4s1 3d10","4s^1 3d^10","3d10 4s1","4s1, 3d10"]}},
    {id:"M3C3.f.w", name:"Tungsten: evidence against half-filled stability", tex:"\\mathrm{W}:\\ [\\mathrm{Xe}]\\,6s^{2}\\,4f^{14}\\,5d^{4}\\quad(\\text{not } 6s^{1}\\,4f^{14}\\,5d^{5})", kind:"rule", ref:"p. 7", note:"W is in the same group as Cr but does not take the half-filled $d^5$ arrangement."}
  ],
  glossary:[
    {id:"M3C3.t.period", term:"Period", def:"A row of the periodic table. There are seven, and each one starts a new shell.", ref:"p. 6"},
    {id:"M3C3.t.group", term:"Group", def:"A column of the periodic table, numbered 1 to 18. Atoms in one group have similar outer configurations.", ref:"p. 6"},
    {id:"M3C3.t.block", term:"Block (s, p, d, f)", def:"The part of the table where the last electron added goes into an s, p, d or f subshell. Ca is s block; V is d block.", ref:"p. 6"},
    {id:"M3C3.t.valence", term:"Valence electrons", def:"Electrons in the outermost shell; the ones that take part in bonding. The group-number rule also counts the $(n-1)d$ electrons of d-block atoms.", ref:"p. 6"},
    {id:"M3C3.t.abbreviated", term:"Abbreviated configuration", def:"A configuration that writes the previous noble gas in brackets for the core, then the electrons after it: Fe is $[\\mathrm{Ar}]\\,4s^2\\,3d^6$.", ref:"p. 7"},
    {id:"M3C3.t.exception", term:"Configuration exception", def:"An element whose measured ground state differs from the one its position predicts. The notes star 18 of them; you need Cr and Cu.", ref:"pp. 6-7"}
  ],
  figures:{
    table:{title:"The periodic table as a map of configurations", cap:"The table on p. 6, coloured by block. Click any element for the configuration its position predicts. Switch to valence electrons to see the group-number rule, or to the starred elements whose real configuration differs.", ref:"pp. 6-7",
      build(host,{PLOT,M}){
        let mode="block", sel=26;
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Show",items:[["block","Blocks"],["val","Valence electrons"],["star","Exceptions (*)"]],value:mode,onchange:v=>{ mode=v; draw(); }});
        const grid=document.createElement("div"); grid.className="ptable"; grid.setAttribute("aria-label","Periodic table"); host.append(grid);
        const leg=document.createElement("div"); leg.className="small muted pt-leg"; host.append(leg);
        const out=PLOT.readout(host);
        const COL={s:"var(--m1)",p:"var(--m2)",d:"var(--m3)",f:"var(--m4)"};
        const place=z=>{ const p=pos(z); if(p.block==="f"){ const base=p.period===6?57:89; return {row:p.period===6?9:10,col:z-base+3}; } return {row:p.period,col:p.group}; };
        function draw(){
          grid.innerHTML="";
          for(let z=1;z<=118;z++){
            const s=symOf(z), p=pos(z), {row,col}=place(z), star=STARRED.includes(s);
            let bg=`color-mix(in srgb,${COL[p.block]} 30%,var(--paper))`, lab="";
            if(mode==="val"){ if(p.group){ const v=z===2?2:valence(p.group); lab=String(v); bg=`color-mix(in srgb,var(--accent) ${Math.round(8+v*6)}%,var(--paper))`; } else bg="var(--paper)"; }
            if(mode==="star") bg=star?`color-mix(in srgb,var(--warn) ${s==="Cr"||s==="Cu"?70:35}%,var(--paper))`:"var(--paper)";
            const b=document.createElement("button"); b.type="button"; b.className="pt-el"+(z===sel?" on":"")+(star?" star":"");
            b.style.cssText=`grid-row:${row};grid-column:${col};background:${bg}`; b.setAttribute("aria-label",`${CH.NAME[s]||s}, Z = ${z}`); b.setAttribute("aria-pressed",String(z===sel));
            b.innerHTML=`<span class="z">${z}</span><span class="s">${s}</span><span class="m">${lab}</span>`;
            b.onclick=()=>{ sel=z; draw(); }; grid.append(b);
          }
          const gap=(r,t)=>{ const d=document.createElement("div"); d.className="pt-gap"; d.style.cssText=`grid-row:${r};grid-column:1 / span 2`; d.textContent=t; grid.append(d); };
          gap(9,"57-71"); gap(10,"89-103");
          leg.innerHTML=mode==="block"?["s","p","d","f"].map(k=>`<span class="sw" style="background:color-mix(in srgb,${COL[k]} 30%,var(--paper))"></span>${k} block`).join(" "):mode==="val"?"Number = valence electrons: the group number for groups 1 to 12, the group number minus 10 for groups 13 to 18 (p. 6). He has 2.":"Starred in the notes (p. 6): the real ground state differs from the position. Darker: Cr and Cu, the two you need.";
          const z=sel, s=symOf(z), p=pos(z), star=STARRED.includes(s);
          let msg=`<b>${CH.NAME[s]||s}</b> ($Z = ${z}$): period ${p.period}${p.group?`, group ${p.group}`:""}, ${p.block} block. `;
          if(p.block==="f") msg+="The f block (lanthanides and actinides) is outside this course.";
          else if(z>86) msg+="Configurations past radon are outside this course.";
          else {
            const pred=aufbau(z); msg+=`From its position: $${str(pred,{tex:true})}$. `;
            if(s==="Cr"||s==="Cu") msg+=`<b>Exception you need:</b> experiment gives $${str(actual(z),{tex:true})}$ (p. 7).`;
            else if(star) msg+="Starred in the notes: the real configuration is different. You do not need to know it.";
            else msg+=`${CH.unpaired(pred)} unpaired electron${CH.unpaired(pred)===1?"":"s"}.`;
            if(p.group) msg+=` Valence electrons: ${z===2?"2 (He)":valence(p.group)}.`;
          }
          out.innerHTML=M.rich(msg);
        }
        draw();
      }},
    cr:{title:"Chromium and copper break the pattern", cap:"Step through the first-row transition metals. The diagram shows the measured ground state. For Cr and Cu one $4s$ electron sits in $3d$ instead.", ref:"p. 7",
      model:{type:"aufbau", params:{element:"Cr", mode:"show", maxZ:36}},
      predict:{q:"Chromium is in group 6. Its position predicts $[\\mathrm{Ar}]\\,4s^2\\,3d^4$. What does experiment give?", opts:[["$[\\mathrm{Ar}]\\,4s^2\\,3d^4$",false,"That is the Aufbau prediction. Cr is one of the two exceptions."],["$[\\mathrm{Ar}]\\,4s^1\\,3d^5$",true,"One $4s$ electron moves to $3d$ (p. 7)."],["$[\\mathrm{Ar}]\\,3d^6$",false,"Experiment leaves one electron in $4s$."],["$[\\mathrm{Ar}]\\,4s^2\\,3d^3\\,4p^1$",false,"$4p$ is not used."]], check:"Step from V to Cr to Mn and watch the 4s level; then do the same from Ni to Cu to Zn."}}
  },
  gens:[
    {id:"M3C3.g.short", title:"Abbreviated configuration from the table", skill:"Noble-gas core plus the electrons after it", ref:"pp. 6-7",
      gen(R,d){
        const lo=d===1?11:19, hi=d===1?38:d===2?54:56; const pool=[]; for(let z=lo;z<=hi;z++) if(okZ(z)) pool.push(z);
        if(d===3) pool.push(24,29,24,29);
        const z=R.pick(pool), occ=actual(z), p=pos(z);
        const core=NOBLES.filter(([g,n])=>n<z).pop();
        const after=CH.ORDER.filter(k=>occ[k] && !(aufbau(core[1])[k]));
        const exc=z===24||z===29;
        return {prompt:`Use the periodic table to write the abbreviated ground-state configuration of ${lname(z)} ($Z = ${z}$).`,
          answer:{type:"config",answer:str(occ),form:"short"},
          hint:`Find the noble gas before it (${core[0]}, $Z = ${core[1]}$). Then walk along period ${p.period} to ${CH.sym(z)}: s block, then d block, then p block.`,
          steps:[`Core: the noble gas at the end of period ${p.period-1} is ${core[0]}, so start with $[\\mathrm{${core[0]}}]$ (${core[1]} electrons).`,`Electrons after the core: $${z} - ${core[1]} = ${z-core[1]}$.`,`Period ${p.period}, group ${p.group}, ${p.block} block: ${after.map(k=>`$${k}^{${occ[k]}}$`).join(", ")}.`,exc?`${name(z)} is one of the two exceptions: the position predicts $${str(aufbau(z),{tex:true})}$, experiment gives the answer below (p. 7).`:`Check: $${core[1]} + ${after.map(k=>occ[k]).join(" + ")} = ${z}$.`,`$${str(occ,{tex:true})}$`],
          answerTeX:`$${str(occ,{tex:true})}$`};
      }},
    {id:"M3C3.g.block", title:"Block, period and valence electrons", skill:"Read the position in the table", ref:"p. 6",
      gen(R,d){
        const pool=[]; for(let z=1;z<=(d===1?20:d===2?36:56);z++) if(z!==2 && !isNoble(z)||(d>1&&z>2&&isNoble(z))) pool.push(z);
        let z=R.pick(pool); if(d===3 && R()<0.5) z=R.pick([21,22,23,25,26,27,28,30,39,40,43,48]);
        const p=pos(z), v=valence(p.group);
        return {prompt:`For ${lname(z)} ($Z = ${z}$): which block is it in, which period, and how many valence electrons does the group-number rule give?`,
          parts:[{label:"Block (s, p, d or f)",answer:{type:"text",accept:[p.block,`${p.block} block`,`${p.block}-block`]}},{label:"Period",answer:{type:"int",value:p.period}},{label:"Valence electrons",answer:{type:"int",value:v}}],
          hint:"The row is the period. The last electron's subshell gives the block. Valence electrons: the group number for groups 1 to 12, the group number minus 10 for groups 13 to 18.",
          steps:[`${CH.sym(z)} is in period ${p.period}, group ${p.group}.`,`Groups 1 and 2 are s block, 3 to 12 d block, 13 to 18 p block (He aside): ${p.block} block.`,p.group<=12?`Group ${p.group} $\\le 12$: valence electrons $= ${p.group}$.`:`Group ${p.group} $\\ge 13$: valence electrons $= ${p.group} - 10 = ${v}$.`,`Configuration check: $${str(actual(z),{tex:true})}$.`],
          answerTeX:`${p.block} block, period ${p.period}, ${v} valence electron${v===1?"":"s"}`};
      }},
    {id:"M3C3.g.exception", title:"Cr, Cu and their neighbours", skill:"Know the two exceptions; get the rest from the table", ref:"p. 7",
      gen(R,d){
        const z=d===1?R.pick([24,29]):d===2?R.pick([21,22,23,24,25,26,27,28,29,30]):R.pick([23,24,25,28,29,30,24,29]);
        const occ=actual(z), exc=z===24||z===29, u=CH.unpaired(occ);
        const parts=[{label:"Abbreviated configuration",answer:{type:"config",answer:str(occ),form:"short"}}];
        if(d===3) parts.push({label:"Unpaired electrons",answer:{type:"int",value:u}});
        return {prompt:`Write the abbreviated ground-state configuration of ${lname(z)} ($Z = ${z}$)${d===3?" and give the number of unpaired electrons":""}.`,
          parts, hint:"Start from $[\\mathrm{Ar}]$. Use the d-block formula $4s^2\\,3d^{\\,G-2}$, unless the element is Cr or Cu.",
          steps:[`${name(z)} is in group ${pos(z).group}, so its position predicts $${str(aufbau(z),{tex:true})}$.`,exc?`${name(z)} is an exception you need to know: one $4s$ electron is found in $3d$ instead (p. 7).`:"It is not an exception, so the prediction stands.",`$${str(occ,{tex:true})}$`,...(d===3?[`$3d^{${occ["3d"]}}$${occ["4s"]===1?" and $4s^1$":""}: ${u} unpaired electron${u===1?"":"s"} (Hund's rule).`]:[])],
          answerTeX:`$${str(occ,{tex:true})}$${d===3?`, ${u} unpaired`:""}`};
      }},
    {id:"M3C3.g.identify", title:"Name the element from its configuration", skill:"Read the table backwards", ref:"pp. 6-7",
      gen(R,d){
        const pool=[]; const rng=d===1?[3,20]:d===2?[21,36]:[31,54]; for(let z=rng[0];z<=rng[1];z++) if(okZ(z)) pool.push(z);
        const z=R.pick(pool), occ=actual(z), p=pos(z); const core=NOBLES.filter(([g,n])=>n<z).pop();
        return {prompt:`Which neutral atom has the ground-state configuration $${str(occ,{tex:true})}$? Give its symbol.`,
          answer:{type:"text",accept:[CH.sym(z),name(z)]},
          hint:"Add the core's electrons to the ones written after it to get $Z$. Or find the row from the highest $n$ and count across.",
          steps:[`$[\\mathrm{${core[0]}}]$ holds ${core[1]} electrons.`,`After the core: $${CH.ORDER.filter(k=>occ[k]&&!aufbau(core[1])[k]).map(k=>occ[k]).join(" + ")} = ${z-core[1]}$.`,`$Z = ${core[1]} + ${z-core[1]} = ${z}$: ${name(z)}, period ${p.period}, group ${p.group}.`],
          answerTeX:`${CH.sym(z)} (${name(z)})`};
      }}
  ],
  exam:[
    {id:"M3C3.q1", ref:"p. 7", q:"What is the ground-state configuration of a copper atom?", opts:[["$[\\mathrm{Ar}]\\,4s^2\\,3d^9$",false,"That is the position-based prediction. Cu is an exception."],["$[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$",true,"One of the two exceptions you need (p. 7)."],["$[\\mathrm{Ar}]\\,3d^{11}$",false,"A $d$ subshell holds at most 10."],["$[\\mathrm{Ar}]\\,4s^2\\,3d^{10}$",false,"That is 30 electrons: zinc."],["$[\\mathrm{Kr}]\\,4s^1\\,3d^{10}$",false,"The core before period 4 is Ar, not Kr."]]},
    {id:"M3C3.q2", ref:"p. 6", q:"By the group-number rule in the notes, how many valence electrons do selenium (group 16) and iron (group 8) have?", opts:[["Se 6, Fe 8",true,"Group 16: $16 - 10 = 6$. Group 8: $\\le 12$, so 8."],["Se 16, Fe 8",false,"For groups 13 to 18, subtract 10."],["Se 6, Fe 2",false,"The rule counts Fe's $3d$ electrons too: $4s^2\\,3d^6$ gives 8."],["Se 4, Fe 6",false,"Se is $4s^2\\,4p^4$ outside the $3d^{10}$: 6."],["Se 6, Fe 26",false,"26 is the total, not the valence count."]]},
    {id:"M3C3.q3", ref:"p. 6", q:"In the ground-state configuration of the period 4 element in group 15, what comes after the $[\\mathrm{Ar}]$ core?", opts:[["$4s^2\\,4p^3$",false,"That adds up to only 23 electrons. Period 4 p-block atoms also have a full $3d^{10}$ before $4p$."],["$3d^{10}\\,4s^2\\,4p^3$",true,"$(n-1)d^{10}\\,ns^2\\,np^{\\,G-12}$ with $n = 4$, $G = 15$ (this is As)."],["$4s^2\\,3d^3$",false,"That is group 5 (V)."],["$3d^{10}\\,4s^2\\,4p^5$",false,"$G - 12 = 3$, not 5."],["$4s^2\\,4p^{15}$",false,"A $p$ subshell holds at most 6."]]},
    {id:"M3C3.q4", ref:"p. 6", q:"Which of these elements is in the d block?", opts:[["Ga",false,"Ga is group 13: p block, even though it has a full $3d^{10}$ inside."],["Zn",true,"Group 12: the last electron went into $3d$."],["Ca",false,"Group 2: s block."],["Ge",false,"Group 14: p block."],["He",false,"He is in the s block (p. 6)."]]},
    {id:"M3C3.q5", ref:"p. 7", q:"What does the notes' tungsten example show?", opts:[["W has the configuration $[\\mathrm{Xe}]\\,6s^1\\,4f^{14}\\,5d^5$.",false,"The notes say the reverse: W is $6s^2\\,4f^{14}\\,5d^4$."],["Half-filled subshells are always extra stable.",false,"W, in the same group as Cr, does not take the half-filled arrangement."],["The \"special stability of half-filled subshells\" does not explain exceptions; the notes call it a myth.",true,"W is $[\\mathrm{Xe}]\\,6s^2\\,4f^{14}\\,5d^4$, not $5d^5$ (p. 7)."],["Every group 6 element follows Cr.",false,"W does not."],["Exceptions only happen in period 4.",false,"The notes star exceptions in periods 5, 6 and 7 as well."]]},
    {id:"M3C3.q6", ref:"pp. 6-7", q:"Which neutral atom has the configuration $[\\mathrm{Kr}]\\,5s^2\\,4d^{10}\\,5p^5$?", opts:[["Br",false,"Br is $[\\mathrm{Ar}]\\,4s^2\\,3d^{10}\\,4p^5$."],["I",true,"$36 + 2 + 10 + 5 = 53$: iodine."],["Xe",false,"Xe has $5p^6$."],["Te",false,"Te has $5p^4$."],["At",false,"At is in period 6."]]},
    {id:"M3C3.q7", ref:"p. 7", q:"How many unpaired electrons does a ground-state chromium atom have?", opts:[["4",false,"That is for the predicted $4s^2\\,3d^4$."],["5",false,"Count the $4s^1$ electron too."],["6",true,"$4s^1\\,3d^5$: one plus five, all unpaired."],["2",false,"Draw the five $3d$ electrons in five orbitals."],["0",false,"Cr has two part-filled subshells."]]}
  ],
  steps:[
    {type:"read", title:"Rows are shells, columns are configurations", ref:"p. 6", body:"<p>The layout of the periodic table follows electron configurations.</p><ul><li>A row is a <b>period</b>. There are seven. Each one starts a new shell: period 4 starts by putting an electron into $4s$.</li><li>A column is a <b>group</b>, numbered 1 to 18. Atoms in one group have similar outer configurations: F is $[\\mathrm{He}]\\,2s^2\\,2p^5$ and Cl is $[\\mathrm{Ne}]\\,3s^2\\,3p^5$.</li></ul><p>Think of a parking garage. The floor number tells you the shell; the space number on that floor tells you how many electrons are in the outer subshells.</p>"},
    {type:"explore", title:"Click through the table", fig:"table", ref:"pp. 6-7", body:"<p>Click a few elements in each block and read the configuration underneath.</p><ul><li>Walk along period 4 from K to Kr: $4s$ fills, then $3d$, then $4p$.</li><li>Switch to <b>Valence electrons</b>: the number climbs 1 to 12 across groups 1 to 12, then restarts at 3 in group 13.</li><li>Switch to <b>Exceptions</b>: 18 elements are starred. Only Cr and Cu are ones you need.</li></ul>"},
    {type:"read", title:"Each block has a general formula", ref:"p. 6", body:"<p>The block is the subshell that got the last electron: Ca is s block because its last electron went into $4s$; V is d block because its last went into $3d$. Write $n$ for the period and $G$ for the group:</p><div class=\"box def\"><b class=\"t\">Valence configurations (p. 6)</b>s block: $ns^{G}$<br>d block: $(n-1)d^{\\,G-2}\\,ns^2$<br>p block, $n \\le 3$: $ns^2\\,np^{\\,G-12}$<br>p block, $n \\ge 4$: $(n-1)d^{10}\\,ns^2\\,np^{\\,G-12}$</div><p>Note: the notes print the last line as \"for $n > 4$\". That would leave out period 4 (Ga to Kr), which does have $3d^{10}$, so read it as $n \\ge 4$. He sits above the noble gases but belongs to the s block ($1s^2$).</p>"},
    {type:"mcq", title:"Where is helium?", q:"Helium is drawn at the top of group 18. Which block is it in, and why?", opts:[["p block, because it is a noble gas",false,"It has no $p$ electrons."],["s block, because its last (and only) electrons are in $1s$",true,"The notes say He is part of the s block (p. 6)."],["d block, because it is above the transition metals",false,"It sits above Ne, not above the d block."],["It is in no block",false,"Every element is in a block."]]},
    {type:"example", title:"Abbreviated configurations of tin and zirconium", ref:"pp. 6-7", ex:{q:"Use the periodic table to write abbreviated ground-state configurations for Sn ($Z = 50$) and Zr ($Z = 40$). How many unpaired electrons does each have?", steps:[{t:"Both are in period 5, so the core is the noble gas that ends period 4: $[\\mathrm{Kr}]$, 36 electrons.",why:"The bracketed noble gas stands for all the inner electrons."},{t:"Sn: group 14, p block. Walk across period 5: $5s^2$ (groups 1 to 2), $4d^{10}$ (groups 3 to 12), then $5p^2$ (groups 13 to 14).",why:"p block with $n \\ge 4$: $(n-1)d^{10}\\,ns^2\\,np^{\\,G-12}$ with $G - 12 = 2$."},{t:"Sn $= [\\mathrm{Kr}]\\,5s^2\\,4d^{10}\\,5p^2$. Check: $36 + 2 + 10 + 2 = 50$.",why:"Electron count matches $Z$."},{t:"Zr: group 4, d block: $[\\mathrm{Kr}]\\,5s^2\\,4d^2$. Check: $36 + 4 = 40$.",why:"d block: $(n-1)d^{\\,G-2}\\,ns^2$ with $G - 2 = 2$."},{t:"Unpaired: Sn has $5p^2$ in three $p$ orbitals, so 2. Zr has $4d^2$ in five $d$ orbitals, so 2.",why:"Hund's rule: separate orbitals, parallel spins."}], ans:"Sn $= [\\mathrm{Kr}]\\,5s^2\\,4d^{10}\\,5p^2$ (2 unpaired); Zr $= [\\mathrm{Kr}]\\,5s^2\\,4d^2$ (2 unpaired).", ref:"pp. 6-7"}},
    {type:"try", title:"Abbreviated configurations", gen:"M3C3.g.short"},
    {type:"read", title:"Counting valence electrons", ref:"p. 6", body:"<p>Valence electrons are the outer electrons that take part in bonding. The group number gives the count:</p><ul><li>Group 12 or less: valence electrons $=$ group number. (Fe, group 8: $4s^2\\,3d^6$ gives 8.)</li><li>Group 13 or more: valence electrons $=$ group number $- 10$. (Br, group 17: $4s^2\\,4p^5$ gives 7.)</li></ul><p>The minus 10 skips the ten d-block columns (groups 3 to 12); in period 4 and below it also leaves out the full $(n-1)d^{10}$ that p-block atoms carry inside. One small mismatch to be aware of: the notes define valence electrons as those in the outermost shell, but the group rule for the d block also counts the $(n-1)d$ electrons. He is the odd one out with 2.</p>"},
    {type:"try", title:"Block, period and valence electrons", gen:"M3C3.g.block"},
    {type:"read", title:"Cr and Cu: the two exceptions to know", ref:"p. 7", body:"<p>The $n + l$ rule gets every atom up to $Z = 36$ right except two.</p><table class=\"cn-table\"><tr><th>atom</th><th>Aufbau prediction</th><th>experiment</th></tr><tr><td>Cr</td><td>$[\\mathrm{Ar}]\\,4s^2\\,3d^4$</td><td>$[\\mathrm{Ar}]\\,4s^1\\,3d^5$</td></tr><tr><td>Cu</td><td>$[\\mathrm{Ar}]\\,4s^2\\,3d^9$</td><td>$[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$</td></tr></table><p>In both, one electron that the rule puts in $4s$ is found in $3d$ instead. Learn these two. Exceptions are hard to predict, so for anything else, use the rule.</p>"},
    {type:"explore", title:"Watch the 4s electron move", fig:"cr", ref:"p. 7", body:"<p>Step V, Cr, Mn and then Ni, Cu, Zn. Every neighbour has $4s^2$. Cr and Cu have $4s^1$, with the electron moved to $3d$.</p>"},
    {type:"read", title:"Why? The notes reject the usual story", ref:"p. 7", body:"<p>Many textbooks say half-filled ($d^5$) and filled ($d^{10}$) subshells are \"specially stable\". The notes call that a cop-out: it just names the result without explaining where the stability would come from, and the idea has been knocked down.</p><p>The evidence: tungsten is in the same group as Cr, but its ground state is $[\\mathrm{Xe}]\\,6s^2\\,4f^{14}\\,5d^4$, not the half-filled $[\\mathrm{Xe}]\\,6s^1\\,4f^{14}\\,5d^5$. If half-filled stability were a rule, W would follow Cr.</p><p>The notes star 18 elements as exceptions: Cr, Cu; Nb, Mo, Ru, Rh, Pd, Ag; Pt, Au; La, Gd; Ac, Th, Pa, U, Np, Cm. Most are for $Z > 36$ and many are f block. You are only expected to know Cr and Cu.</p>"},
    {type:"mcq", title:"What the notes conclude", q:"A classmate says \"Cr is $4s^1\\,3d^5$ because half-filled subshells are extra stable.\" What would the notes say?", opts:[["Correct, and it predicts every exception.",false,"It fails for W."],["That explanation is a myth: W, in Cr's group, is $6s^2\\,5d^4$, not $6s^1\\,5d^5$.",true,"The notes use W as the counterexample (p. 7)."],["Cr is not an exception at all.",false,"Cr is one of the two exceptions you need."],["Only filled subshells are stable, not half-filled ones.",false,"The notes reject the special stability of both."]]},
    {type:"try", title:"Cr, Cu and their neighbours", gen:"M3C3.g.exception"},
    {type:"firstline", title:"Find the first mistake", q:"A student writes the configuration of copper ($Z = 29$) and counts unpaired electrons:", lines:["Cu is in period 4, group 11, so the core is $[\\mathrm{Ar}]$.","The d-block formula gives $4s^2\\,3d^{9}$.","Cu follows the formula, so Cu $= [\\mathrm{Ar}]\\,4s^2\\,3d^9$.","$3d^9$ has one unpaired electron, so Cu has 1 unpaired electron."], wrong:2, why:"Cu is one of the two exceptions: experiment gives $[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$ (p. 7). The unpaired count happens to stay at 1, but now it is the $4s$ electron."},
    {type:"try", title:"Name the element", gen:"M3C3.g.identify"},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
