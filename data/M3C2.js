/* Chapter 3.2 (Mon Oct 19): Pauli, Aufbau and Hund. Course notes Module 3, pp. 3-5 (section 3.2).
   Pauli exclusion principle and subshell capacity, the (n + l) filling rule, Hund's rule and its shielding rationale,
   ground-state configurations and unpaired electrons (Example 3-1). Cr and Cu are left for Chapter 3.3. */
(function(){
const M=C120;
const CH=M.chem;
const LET="spdfghi";
const CAPL=l=>2*(2*l+1);
const sym=z=>CH.sym(z), name=z=>CH.NAME[CH.sym(z)], lname=z=>name(z).toLowerCase();
const full=z=>CH.config(z), fullTeX=z=>CH.config(z,0,{tex:true});
/* last electron added by the Aufbau order (no exceptions: Cr and Cu are left out of the pools) */
function lastSub(z){ let left=z, last=null; for(const s of CH.ORDER){ if(left<=0) break; const c=CAPL("spdf".indexOf(s[1])); last=[s,Math.min(c,left)]; left-=c; } return last; }
const POOL=d=>{ const a=d===1?[3,20]:d===2?[11,30]:[19,36]; const out=[]; for(let z=a[0];z<=a[1];z++) if(z!==24&&z!==29) out.push(z); return out; };
const boxes=(sub,e)=>{ const l="spdf".indexOf(sub[1]); const n=2*l+1; const up=Math.min(e,n), dn=Math.max(0,e-n); return [...Array(n)].map((_,i)=>i<dn?"↑↓":i<up?"↑":"_").join("  "); };

M.chapter({
  id:"M3C2", module:"m3", n:2, num:"3.2", date:"2026-10-19", added:"2026-10-26", quiz:"PC4",
  title:"Pauli, Aufbau and Hund", pages:"3-5", sections:["3.2"],
  summary:"Three rules give the ground-state configuration: no two electrons share all four quantum numbers (Pauli), fill the lowest $n + l$ first with ties going to the lower $n$ (Aufbau), and spread electrons over degenerate orbitals with parallel spins before pairing them (Hund).",
  flags:[],
  formulas:[
    {id:"M3C2.f.pauli", name:"Pauli exclusion principle", tex:"\\text{no two electrons have the same } (n,\\ l,\\ m_l,\\ m_s)", kind:"rule", ref:"p. 3",
      note:"Two electrons in one orbital already share $n$, $l$ and $m_l$, so their $m_s$ must differ: one $+\\tfrac12$, one $-\\tfrac12$. The spin quantum number $s$ is $\\tfrac12$ for every electron (Module 2, p. 32); only $m_s$ changes."},
    {id:"M3C2.f.orbitals", name:"Orbitals in a subshell", tex:"\\#\\,\\text{orbitals} = 2l+1", ref:"p. 3", note:"$s$: 1, $p$: 3, $d$: 5, $f$: 7.",
      blank:{tex:"\\#\\,\\text{orbitals} = \\boxed{\\,?\\,}", accept:["2l+1","2ℓ+1","2l + 1","1+2l"]}},
    {id:"M3C2.f.capacity", name:"Electrons in a full subshell", tex:"\\#\\,e^- = 2(2l+1)", ref:"p. 3", note:"Two electrons per orbital: $s$ 2, $p$ 6, $d$ 10, $f$ 14. The notes give the table; this line is the same rule written as a formula.",
      blank:{tex:"\\#\\,e^- = 2\\times\\boxed{\\,?\\,}", accept:["2l+1","(2l+1)","2ℓ+1","(2ℓ+1)"]}},
    {id:"M3C2.f.shell", name:"Electrons in a full shell", tex:"\\#\\,e^-(\\text{shell } n) = 2n^2", ref:"p. 3", note:"Not printed in the notes. It follows from adding $2(2l+1)$ for $l = 0$ to $n-1$. The $n = 4$ shell holds $2 + 6 + 10 + 14 = 32$.",
      blank:{tex:"\\#\\,e^-(\\text{shell } n) = \\boxed{\\,?\\,}", accept:["2n^2","2n²","2n2","2*n^2","2 n^2"]}},
    {id:"M3C2.f.aufbau", name:"The (n + l) rule", tex:"\\text{fill the lowest } n+l \\text{ first; if tied, the lower } n \\text{ first}", kind:"rule", ref:"p. 3",
      note:"For neutral atoms. The notes stress that orbital energies themselves do not follow this rule: it is the filling order that gives the lowest energy for the whole atom, found by experiment."},
    {id:"M3C2.f.order", name:"Filling order", tex:"1s,\\ 2s,\\ 2p,\\ 3s,\\ 3p,\\ 4s,\\ 3d,\\ 4p,\\ 5s,\\ 4d", kind:"rule", ref:"p. 3", note:"$n + l$ = 1, 2, 3, 3, 4, 4, 5, 5, 5, 6.",
      blank:{tex:"\\dots,\\ 3p,\\ 4s,\\ \\boxed{\\,?\\,},\\ 4p,\\ 5s,\\ \\dots", accept:["3d"]}},
    {id:"M3C2.f.hund", name:"Hund's rule", tex:"\\text{degenerate orbitals: maximum number of parallel spins}", kind:"rule", ref:"p. 4",
      note:"If a set of equal-energy orbitals is not full, the lowest-energy arrangement puts electrons in separate orbitals with the same spin before any pairing."},
    {id:"M3C2.f.exceptions", name:"Exceptions up to Z = 36", tex:"\\text{only Cr and Cu}", kind:"rule", ref:"p. 3", note:"You need to know these two (Chapter 3.3). Above $Z = 36$ there are many exceptions you do not need."}
  ],
  glossary:[
    {id:"M3C2.t.pauli", term:"Pauli exclusion principle", def:"No two electrons in an atom have the same set of four quantum numbers $n$, $l$, $m_l$, $m_s$. So an orbital holds at most two electrons, with opposite spins.", ref:"p. 3"},
    {id:"M3C2.t.aufbau", term:"Aufbau procedure", def:"Building up a configuration by adding electrons in the order given by the $n + l$ rule.", ref:"p. 3"},
    {id:"M3C2.t.degenerate", term:"Energetically degenerate", def:"Having the same energy. The three $2p$ orbitals of an atom are degenerate.", ref:"p. 4"},
    {id:"M3C2.t.hund", term:"Hund's rule", def:"When degenerate orbitals are only partly filled, the lowest energy arrangement has the most parallel spins.", ref:"p. 4"},
    {id:"M3C2.t.parallel", term:"Parallel spins", def:"Electrons with the same $m_s$ (both up or both down).", ref:"p. 4"},
    {id:"M3C2.t.ground", term:"Ground-state configuration", def:"The electron configuration with the lowest energy.", ref:"p. 5"},
    {id:"M3C2.t.unpaired", term:"Unpaired electron", def:"An electron alone in an orbital, with no partner of opposite spin.", ref:"p. 5"}
  ],
  figures:{
    fill:{title:"The n + l filling grid", cap:"The filling triangle from p. 3, laid out as a grid: rows are $n$, columns are $l$. Each diagonal joins subshells with the same $n + l$, read from the top right (lower $n$) down to the bottom left. Slide the electron count to fill the grid in Aufbau order. This shows the rule's prediction; Cr and Cu differ (Chapter 3.3).", ref:"p. 3",
      build(host,{PLOT,M}){
        const CH=M.chem; let Z=26;
        const ctl=PLOT.controls(host); const svgHost=document.createElement("div"); host.append(svgHost); const out=PLOT.readout(host);
        PLOT.slider(ctl,{label:"Electrons",min:1,max:54,value:Z,fmt:v=>`${v} (${CH.sym(v)})`,oninput:v=>{ Z=v; draw(); }});
        const SUBS=[]; for(let n=1;n<=5;n++) for(let l=0;l<n;l++) SUBS.push({n,l,lab:`${n}${"spdfg"[l]}`,cap:2*(2*l+1)});
        const order=SUBS.slice().sort((a,b)=>(a.n+a.l)-(b.n+b.l)||a.n-b.n);
        const cx=l=>18+l*82, cy=n=>16+(n-1)*54, CW=74, CHh=42;
        function draw(){
          const occ={}; let left=Z, cur=null; for(const s of order){ if(left<=0) break; const c=Math.min(s.cap,left); occ[s.lab]=c; left-=c; cur=s; }
          let g=`<svg viewBox="0 0 440 300" class="fig" role="img" aria-label="Filling grid with ${Z} electrons">`;
          for(let k=2;k<=6;k++){ const cells=SUBS.filter(s=>s.n+s.l===k).sort((a,b)=>a.n-b.n); if(cells.length<2) continue; const a=cells[0], b=cells[cells.length-1];
            g+=`<line x1="${cx(a.l)+CW/2+18}" y1="${cy(a.n)+CHh/2-14}" x2="${cx(b.l)+CW/2-18}" y2="${cy(b.n)+CHh/2+14}" style="stroke:var(--bad);stroke-width:1.4;opacity:.3"/>`; }
          for(const s of SUBS){ const e=occ[s.lab]||0, fr=e/s.cap, on=cur&&cur.lab===s.lab;
            g+=`<rect x="${cx(s.l)}" y="${cy(s.n)}" width="${CW}" height="${CHh}" rx="6" style="fill:var(--accent);fill-opacity:${e?0.12+0.5*fr:0};stroke:${on?"var(--accent)":"var(--fig-stroke)"};stroke-width:${on?2.6:1};stroke-opacity:${on?1:.5}"/>`;
            g+=`<text x="${cx(s.l)+CW/2}" y="${cy(s.n)+18}" text-anchor="middle" style="font-size:14px;font-weight:600">${s.lab}${e?`<tspan style="font-size:10px" dy="-6">${e}</tspan>`:""}</text>`;
            g+=`<text x="${cx(s.l)+CW/2}" y="${cy(s.n)+35}" text-anchor="middle" style="font-size:10px;opacity:.75">n + l = ${s.n+s.l}</text>`; }
          g+=`</svg>`; svgHost.innerHTML=g;
          const str=CH.configString(occ,{tex:true});
          let msg=`$Z = ${Z}$ (${CH.NAME[CH.sym(Z)]}): $${str}$. The last electron went into $${cur.lab}$ ($n + l = ${cur.n+cur.l}$).`;
          if(Z===24||Z===29) msg+=` Experiment gives $[\\mathrm{Ar}]\\,4s^{1}\\,3d^{${Z===24?5:10}}$ instead (p. 7).`;
          else if([41,42,44,45,46,47].includes(Z)) msg+=" This element is starred in the notes' table (p. 6): its real configuration differs, and you do not need to know it.";
          out.innerHTML=M.rich(msg);
        }
        draw();
      }},
    build:{title:"Build a configuration electron by electron", cap:"An energy-level diagram beside the 3D orbitals. Add electrons one at a time; the model tells you when a move breaks the Pauli principle or Hund's rule.", ref:"pp. 3-4",
      model:{type:"aufbau", params:{element:"B", mode:"build", maxZ:36}},
      predict:{q:"Boron has one $2p$ electron. Where does carbon's extra electron go?", opts:[["Into the same $2p$ orbital, with the opposite spin",false,"Pauli allows it, but it is not the lowest energy: Hund's rule prefers separate orbitals."],["Into a different $2p$ orbital, with the same spin",true,"Hund's rule: the most parallel spins in degenerate orbitals (p. 4)."],["Into a different $2p$ orbital, with the opposite spin",false,"Separate orbitals is right, but the spins should be parallel."],["Into the $3s$ orbital",false,"$2p$ ($n + l = 3$, $n = 2$) still has room and comes before $3s$."]], check:"Add one electron to boron and try each place. The model flags the arrangements that break Hund's rule."}}
  },
  gens:[
    {id:"M3C2.g.capacity", title:"Orbitals and electrons in a subshell or shell", skill:"$2l+1$ orbitals, $2(2l+1)$ electrons, $2n^2$ per shell", ref:"p. 3",
      gen(R,d){
        if(d<3){
          const l=d===1?R.int(0,3):R.int(1,4); let n=d===1?l+R.int(1,3):l+R.int(1,4); if(n===6&&l===3) n=7; const lab=`${n}${LET[l]}`;   /* 6f is the assignment's own case */
          return {prompt:`How many orbitals are in the $${lab}$ subshell, and how many electrons does it hold when full?`,
            parts:[{label:"Orbitals",answer:{type:"int",value:2*l+1}},{label:"Electrons when full",answer:{type:"int",value:2*(2*l+1)}}],
            hint:"The letter gives $l$. Orbitals $= 2l+1$; each orbital holds 2 electrons (Pauli). The value of $n$ does not matter.",
            steps:[`$${lab}$: the letter ${LET[l]} means $l = ${l}$.`,`Orbitals $= 2l+1 = ${2*l+1}$ (one for each $m_l$ from $-${l}$ to $+${l}$).`,`Each orbital holds 2 electrons, so $2\\times${2*l+1} = ${2*(2*l+1)}$ electrons.`],
            answerTeX:`${2*l+1} orbitals, ${2*(2*l+1)} electrons`};
        }
        const n=R.pick([3,4,5,7]); const terms=[...Array(n)].map((_,l)=>2*l+1);
        return {prompt:`How many orbitals are in the $n = ${n}$ shell, and how many electrons can the whole shell hold?`,
          parts:[{label:"Orbitals in the shell",answer:{type:"int",value:n*n}},{label:"Electrons in the full shell",answer:{type:"int",value:2*n*n}}],
          hint:`List every subshell of $n = ${n}$ (all values of $l$ from 0 to ${n-1}), not only the ones that fill in known atoms.`,
          steps:[`$l$ runs from $0$ to $${n-1}$: $${[...Array(n)].map((_,l)=>`${n}${LET[l]}`).join(",\\ ")}$.`,`Orbitals: $${terms.join("+")} = ${n*n}$ $(= n^2)$.`,`Electrons: $2\\times${n*n} = ${2*n*n}$ $(= 2n^2)$.`,n>=5?`Stopping at $${n}f$ would give ${2*(1+3+5+7)} electrons, which misses the subshells with $l \\ge 4$.`:`Check by subshells: $${terms.map(t=>2*t).join("+")} = ${2*n*n}$.`],
          answerTeX:`${n*n} orbitals, ${2*n*n} electrons`};
      }},
    {id:"M3C2.g.next", title:"Which subshell fills next?", skill:"Use the $n + l$ rule", ref:"p. 3",
      gen(R,d){
        const hi=d===1?7:d===2?11:15; const idx=[]; for(let i=1;i<hi;i++) if(CH.ORDER[i]!=="5s") idx.push(i);
        const i=R.pick(idx); const sub=CH.ORDER[i]; const dir=d===1?"after":R.pick(["before","after"]);
        const ans=dir==="after"?CH.ORDER[i+1]:CH.ORDER[i-1];
        const nl=s=>+s[0]+"spdf".indexOf(s[1]);
        return {prompt:`In the $(n + l)$ filling order for a neutral atom, which subshell comes right <b>${dir}</b> $${sub}$? (Type it like 3p.)`,
          answer:{type:"text",accept:[ans,`${ans[0]} ${ans[1]}`]},
          hint:"Work out $n + l$ for the subshells around it. Lower $n + l$ fills first; for a tie, the lower $n$ fills first.",
          steps:[`$${sub}$: $n + l = ${sub[0]} + ${"spdf".indexOf(sub[1])} = ${nl(sub)}$.`,`$${ans}$: $n + l = ${nl(ans)}$.`,nl(ans)===nl(sub)?`Same $n + l$, so the lower $n$ goes first: $${dir==="after"?sub:ans}$ then $${dir==="after"?ans:sub}$.`:`${dir==="after"?"Next":"The one just before"} in the order: $${CH.ORDER.slice(Math.max(0,i-2),i+3).join(",\\ ")}$.`,`So $${ans}$ fills ${dir} $${sub}$.`],
          answerTeX:`$${ans}$`};
      }},
    {id:"M3C2.g.config", title:"Write a full ground-state configuration", skill:"Aufbau order with subshell capacities", ref:"pp. 3-5",
      gen(R,d){
        const z=R.pick(POOL(d)); const occ=CH.occupancy(z);
        const keys=CH.ORDER.filter(k=>occ[k]); let run=0;
        return {prompt:`Write the full (complete) ground-state electron configuration of ${lname(z)} ($Z = ${z}$). Do not use a noble-gas core.`,
          answer:{type:"config",answer:full(z),form:"full"},
          hint:"Fill in the order 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p with 2, 2, 6, 2, 6, 2, 10, 6 electrons until you have used them all.",
          steps:[`${name(z)} has $${z}$ electrons.`,...keys.map(k=>{ run+=occ[k]; return `$${k}^{${occ[k]}}$: running total ${run}.`; }),`Answer: $${fullTeX(z)}$.`],
          answerTeX:`$${fullTeX(z)}$`};
      }},
    {id:"M3C2.g.unpaired", title:"Count unpaired electrons", skill:"Hund's rule in a partly filled subshell", ref:"pp. 4-5",
      gen(R,d){
        const pool=POOL(d).filter(z=>d===1?true:CH.unpaired(CH.occupancy(z))>0||R()<0.3);
        const z=R.pick(pool); const occ=CH.occupancy(z); const u=CH.unpaired(occ);
        const open=CH.ORDER.filter(k=>occ[k] && occ[k]<CAPL("spdf".indexOf(k[1])));
        return {prompt:`How many unpaired electrons does a ground-state ${lname(z)} atom ($Z = ${z}$) have?`,
          answer:{type:"int",value:u},
          hint:"Write the configuration. Full subshells have no unpaired electrons. In a part-filled subshell, put one electron in each orbital (same spin) before pairing.",
          steps:[`Configuration: $${CH.config(z,0,{short:z>10&&z!==18&&z!==36,tex:true})}$.`,open.length?`Only $${open.join(", ")}$ ${open.length>1?"are":"is"} part-filled.`:"Every subshell is full.",...open.map(k=>`$${k}^{${occ[k]}}$ in ${2*"spdf".indexOf(k[1])+1} orbital${k[1]==="s"?"":"s"}: ${boxes(k,occ[k])} (Hund's rule).`),`Unpaired electrons: ${u}.`],
          answerTeX:String(u)};
      }},
    {id:"M3C2.g.last", title:"Quantum numbers of the last electron", skill:"Link the configuration to $(n, l, m_l, m_s)$", ref:"pp. 3-4",
      gen(R,d){
        const z=R.pick(POOL(d).filter(z=>z!==15)); const [sub,e]=lastSub(z);   /* P is the assignment's own case */ const n=+sub[0], l="spdf".indexOf(sub[1]);
        const pairing=e>2*l+1;
        return {prompt:`Build the ground state of ${lname(z)} ($Z = ${z}$) with the Aufbau procedure. For the final electron placed, give its spin quantum number $s$ and a valid $(n, l, m_l, m_s)$. Type $m_s$ as +1/2 or -1/2.`,
          parts:[{label:"Spin quantum number $s$",answer:{type:"text",accept:["1/2","+1/2","0.5","½"]}},
            {label:"$(n, l, m_l, m_s)$ of the last electron",answer:{type:"qset",answer:[n,l,0,0.5],needMs:true,test:q=>q.n!==n?`The last electron is in $${sub}$, so $n = ${n}$.`:q.l!==l?`The last electron is in a ${sub[1]} subshell, so $l = ${l}$.`:true}}],
          hint:"Find the subshell that receives the last electron. Its $n$ and letter give $n$ and $l$. Any allowed $m_l$ is acceptable. $s$ is the same for every electron.",
          steps:[`Configuration: $${fullTeX(z)}$. The last electron goes into $${sub}$ (electron ${e} of that subshell).`,`$n = ${n}$, $l = ${l}$ (${sub[1]}).`,l?`$m_l$ can be any of $${[...Array(2*l+1)].map((_,i)=>i-l).join(", ")}$: the orbitals are labelled arbitrarily, so any one is acceptable.`:"$m_l = 0$ (an $s$ subshell has one orbital).",pairing?`This electron pairs up, so its $m_s$ is opposite to the one already there. Either sign works as a single answer.`:`It enters an orbital alone; $m_s = +\\tfrac12$ or $-\\tfrac12$ are both acceptable.`,`$s = \\tfrac12$ always (it is not the same thing as $m_s$).`],
          answerTeX:`$s = \\tfrac12$; e.g. $(${n},\\ ${l},\\ 0,\\ +\\tfrac12)$`};
      }}
  ],
  exam:[
    {id:"M3C2.q1", ref:"p. 3", q:"Which pair of electrons could <b>not</b> both be in the same atom?", opts:[["$(3, 1, 0, +\\tfrac12)$ and $(3, 1, 0, -\\tfrac12)$",false,"Same orbital, opposite spins: allowed."],["$(2, 1, 1, +\\tfrac12)$ and $(2, 1, -1, +\\tfrac12)$",false,"Different $m_l$: different orbitals."],["$(4, 2, -2, -\\tfrac12)$ and $(4, 2, -2, -\\tfrac12)$",true,"All four quantum numbers match, which the Pauli principle forbids."],["$(1, 0, 0, +\\tfrac12)$ and $(2, 0, 0, +\\tfrac12)$",false,"Different $n$."],["$(3, 2, 1, +\\tfrac12)$ and $(3, 1, 1, +\\tfrac12)$",false,"Different $l$."]]},
    {id:"M3C2.q2", ref:"p. 3", q:"How many electrons are needed to fill the whole $n = 5$ shell?", opts:[["18",false,"That stops at $5d$."],["25",false,"25 is the number of orbitals ($n^2$). Each holds two electrons."],["32",false,"That stops at $5f$. The shell also has a $5g$ subshell ($l = 4$)."],["50",true,"$2n^2 = 2(25) = 50$: $2+6+10+14+18$."],["10",false,"That is one $d$ subshell."]]},
    {id:"M3C2.q3", ref:"p. 3", q:"The $5p$, $4d$ and $6s$ subshells all have $n + l = 6$. In what order do they fill?", opts:[["$4d$, then $5p$, then $6s$",true,"For a tie in $n + l$, the lower $n$ fills first."],["$6s$, then $5p$, then $4d$",false,"That is backwards: lower $n$ first."],["$5p$, then $4d$, then $6s$",false,"$4d$ has the lowest $n$ of the three."],["All three fill at the same time",false,"The rule gives one order."],["$4d$, then $6s$, then $5p$",false,"$5p$ ($n = 5$) comes before $6s$ ($n = 6$)."]]},
    {id:"M3C2.q4", ref:"p. 4", q:"Which orbital diagram is the ground state of the $2p$ electrons in nitrogen?", opts:[["↑↓ &nbsp; ↑ &nbsp; _",false,"Pairing while an orbital is empty raises the energy."],["↑ &nbsp; ↑ &nbsp; ↑",true,"One electron per orbital with parallel spins: Hund's rule."],["↑ &nbsp; ↓ &nbsp; ↑",false,"One per orbital is right, but the spins should be parallel."],["↑↓ &nbsp; ↑↓ &nbsp; _",false,"That has four electrons, and pairs them."],["↑↓↑ &nbsp; _ &nbsp; _",false,"An orbital holds at most two electrons."]]},
    {id:"M3C2.q5", ref:"pp. 4-5", q:"How many unpaired electrons does a ground-state sulfur atom have?", opts:[["0",false,"$3p^4$ is part-filled."],["1",false,"Draw the four $3p$ electrons in three orbitals."],["2",true,"$3p^4$: ↑↓ ↑ ↑, so two unpaired."],["4",false,"Only three $3p$ orbitals: the fourth electron must pair."],["6",false,"S has 16 electrons, most of them paired."]]},
    {id:"M3C2.q6", ref:"p. 3", multi:true, q:"Which of these break the Pauli principle (the subshell holds too many electrons)? Select all that apply.", opts:[["$1s^3$",true,"One orbital holds at most 2."],["$2p^7$",true,"Three orbitals hold at most 6."],["$3d^{10}$",false,"Five orbitals, 10 electrons: full, allowed."],["$4f^{14}$",false,"Seven orbitals, 14 electrons: full, allowed."],["$3d^{11}$",true,"A $d$ subshell holds at most 10."]]},
    {id:"M3C2.q7", ref:"p. 4", q:"Why does Hund's rule give a lower energy, according to the notes?", opts:[["Electrons with parallel spins avoid each other more, shield each other less, and feel more attraction to the nucleus.",true,"This is the rationale on p. 4."],["Paired electrons attract each other.",false,"Electrons always repel."],["Parallel spins cancel their magnetic fields.",false,"Parallel spins add; opposite spins cancel."],["Orbitals with one electron are smaller.",false,"That is not the reason given."],["The Pauli principle forbids pairing.",false,"Pauli allows two electrons per orbital with opposite spins."]]}
  ],
  steps:[
    {type:"read", title:"Three rules for the lowest-energy arrangement", ref:"p. 3", body:"<p>The question for this chapter: how do an atom's electrons spread over its orbitals to give the lowest possible energy? Three rules answer it.</p><p>Picture a bus with rows of two-person seats, cheapest rows at the front. Riders fill the front rows first (Aufbau). Each seat bench holds two people at most, and they must face opposite ways (Pauli). On a row of equal benches, people take an empty bench before sitting next to a stranger (Hund).</p>"},
    {type:"read", title:"Pauli: two electrons per orbital, opposite spins", ref:"p. 3", body:"<div class=\"box def\"><b class=\"t\">Pauli exclusion principle (p. 3)</b>No two electrons in an atom have the same four quantum numbers $n$, $l$, $m_l$ and $m_s$.</div><p>Two electrons in the same orbital already share $n$, $l$ and $m_l$. The only thing left is $m_s$, so one must be $+\\tfrac12$ and the other $-\\tfrac12$. An orbital holds two electrons at most.</p><table class=\"cn-table\"><tr><th>subshell</th><th>orbitals ($2l + 1$)</th><th>electrons when full</th></tr><tr><td>$s$</td><td>1</td><td>2</td></tr><tr><td>$p$</td><td>3</td><td>6</td></tr><tr><td>$d$</td><td>5</td><td>10</td></tr><tr><td>$f$</td><td>7</td><td>14</td></tr></table><p>Do not mix up $s$ and $m_s$. The spin quantum number $s$ is $\\tfrac12$ for every electron (Module 2, p. 32). Only $m_s$ can be $+\\tfrac12$ or $-\\tfrac12$.</p>"},
    {type:"mcq", title:"What has to differ?", q:"Two electrons share a $4d$ orbital with $m_l = -1$. Which quantum number must be different for the two electrons?", opts:[["$n$",false,"Both are in $4d$: $n = 4$ for both."],["$l$",false,"Both are $d$: $l = 2$."],["$m_l$",false,"Same orbital means same $m_l$."],["$m_s$",true,"It is the only one left, so one is $+\\tfrac12$ and the other $-\\tfrac12$."],["$s$",false,"$s = \\tfrac12$ for every electron."]]},
    {type:"try", title:"Count orbitals and electrons", gen:"M3C2.g.capacity"},
    {type:"read", title:"Aufbau: the n + l rule", ref:"p. 3", body:"<div class=\"box def\"><b class=\"t\">The $(n + l)$ rule (p. 3)</b>For neutral atoms, fill the subshell with the lower $n + l$ first. If two subshells have the same $n + l$, fill the one with the lower $n$ first.</div><p>That gives the order $1s,\\ 2s,\\ 2p,\\ 3s,\\ 3p,\\ 4s,\\ 3d,\\ 4p,\\ 5s,\\ 4d$ with $n + l = 1, 2, 3, 3, 4, 4, 5, 5, 5, 6$. Notice $4s$ ($4 + 0 = 4$) comes before $3d$ ($3 + 2 = 5$).</p><p>The notes add a warning: orbital energies themselves do not follow this rule. It is the order of filling that gives the whole atom its lowest energy, and it was found by experiment. Up to $Z = 36$ only Cr and Cu break it (Chapter 3.3).</p>"},
    {type:"explore", title:"Fill the grid in n + l order", fig:"fill", ref:"p. 3", body:"<p>Slide the electron count from 1 upward and watch the cells fill.</p><ul><li>The red diagonals join subshells with equal $n + l$. Each one is read from the top right (lower $n$) to the bottom left.</li><li>Stop at 19 (K): the electron goes into $4s$, not $3d$.</li><li>Stop at 21 (Sc): now $3d$ starts, because $3d$ comes before $4p$ on the $n + l = 5$ diagonal.</li></ul>"},
    {type:"try", title:"Which subshell is next?", gen:"M3C2.g.next"},
    {type:"read", title:"Hund: spread out before pairing", ref:"p. 4", body:"<p>The three $2p$ orbitals have the same energy: they are <b>energetically degenerate</b>. Two electrons could go into them in several ways:</p><ul><li>both in one orbital (↑↓ &nbsp; _ &nbsp; _),</li><li>in two orbitals with the same spin (↑ &nbsp; ↑ &nbsp; _),</li><li>in two orbitals with opposite spins (↑ &nbsp; ↓ &nbsp; _).</li></ul><div class=\"box def\"><b class=\"t\">Hund's rule (p. 4)</b>When a set of degenerate orbitals is not full, the lowest-energy arrangement has the most parallel spins.</div><p>So the second option wins. Why? Electrons with parallel spins keep away from each other more, so each one shields the other less from the nucleus. Each feels a stronger pull, and the atom's energy drops (p. 4).</p>"},
    {type:"mcq", title:"Up or down?", q:"Carbon's two $2p$ electrons are in separate orbitals with parallel spins. Does it matter whether both spins point up or both point down?", opts:[["Yes: both up is lower in energy",false,"Nothing in the atom picks out a direction. The two choices are equivalent."],["No: both up and both down have the same energy",true,"Hund's rule asks for parallel spins; the shared direction does not matter."],["Yes: both down is lower in energy",false,"Neither direction is special."]], after:"The notes ask this question on p. 4. Parallel is what counts; diagrams usually draw the arrows up by habit."},
    {type:"explore", title:"Build atoms one electron at a time", fig:"build", ref:"pp. 3-4", body:"<p>Start at boron and add electrons. Try breaking the rules on purpose:</p><ul><li>Put a third electron into a full orbital. That breaks Pauli.</li><li>Pair two $2p$ electrons while another $2p$ orbital is empty. That breaks Hund.</li><li>Keep going to argon, then to potassium: watch the 19th electron go into $4s$.</li></ul>"},
    {type:"example", title:"Configuration and unpaired electrons of titanium", ref:"pp. 3-5", ex:{q:"Write the full ground-state configuration of titanium ($Z = 22$) and find the number of unpaired electrons.", steps:[{t:"Ti has 22 electrons.",why:"Neutral atom: electrons = $Z$."},{t:"$1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6$ uses 18.",why:"Filled in $n + l$ order with capacities 2, 2, 6, 2, 6."},{t:"$4s^2$ brings the total to 20.",why:"$4s$ has $n + l = 4$, lower than $3d$ ($5$)."},{t:"$3d^2$ uses the last 2: total 22.",why:"$3d$ ($n + l = 5$, $n = 3$) comes before $4p$ ($n + l = 5$, $n = 4$)."},{t:"Configuration: $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,4s^2\\,3d^2$.",why:"Check: $2+2+6+2+6+2+2 = 22$."},{t:"The two $3d$ electrons go into separate $d$ orbitals with parallel spins: 2 unpaired.",why:"Hund's rule. All other subshells are full."}], ans:"$1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,4s^2\\,3d^2$, with 2 unpaired electrons.", ref:"pp. 3-5"}},
    {type:"try", title:"Write a full configuration", gen:"M3C2.g.config"},
    {type:"try", title:"Count unpaired electrons", gen:"M3C2.g.unpaired"},
    {type:"firstline", title:"Find the first mistake", q:"A student builds the configuration of cobalt ($Z = 27$):", lines:["Co has 27 electrons.","$1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6$ holds 18 of them.","$3d$ fills next because it has $n = 3$, lower than $4s$: $3d^9$.","So Co is $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^9$."], wrong:2, why:"Filling goes by $n + l$, not by $n$. $4s$ has $n + l = 4$ and $3d$ has $5$, so $4s^2$ comes first, then $3d^7$: Co is $[\\mathrm{Ar}]\\,4s^2\\,3d^7$."},
    {type:"try", title:"Quantum numbers of the last electron", gen:"M3C2.g.last", diff:2},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
