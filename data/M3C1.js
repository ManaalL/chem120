/* Chapter 3.1 (Mon Oct 19): Orbital energies in multielectron atoms. Course notes Module 3, pp. 1-2 (section 3.1).
   The conceptual model (hydrogen-like orbitals, average attraction and repulsion), why subshells split, shells and subshells,
   and how orbital energy and size change with Z. The notes explain the splitting with electron-electron repulsion only;
   shielding appears later (pp. 4, 10, 12) and "penetration" is a Module 2 word (Module 2, p. 26). */
(function(){
const M=C120;
const CH=M.chem;
const LET="spdfghi";
const subLab=(n,l)=>`${n}${LET[l]}`;
const nm=z=>`${CH.NAME[CH.sym(z)]} (${CH.sym(z)}, $Z = ${z}$)`;

M.chapter({
  id:"M3C1", module:"m3", n:1, num:"3.1", date:"2026-10-19", added:"2026-10-26", quiz:"PC4",
  title:"Orbital energies in multielectron atoms", pages:"1-2", sections:["3.1"],
  summary:"A many-electron atom uses the same set of hydrogen-like orbitals, but electron-electron repulsion splits each shell: $s < p < d < f$. A bigger nuclear charge pulls every orbital lower in energy and makes it smaller.",
  flags:[],
  formulas:[
    {id:"M3C1.f.subshells", name:"Subshells in a shell", tex:"\\text{shell } n \\text{ has } n \\text{ subshells: } l = 0, 1, \\dots, n-1", kind:"rule", ref:"p. 2",
      note:"The $n = 3$ shell has three subshells: $3s$, $3p$ and $3d$.",
      blank:{tex:"\\text{number of subshells in shell } n = \\boxed{\\,?\\,}", accept:["n"]}},
    {id:"M3C1.f.h-energy", name:"Hydrogen: energy depends on n only", tex:"\\text{H: } E(ns) = E(np) = E(nd)", kind:"rule", ref:"p. 2",
      note:"Every orbital in a shell has the same energy in the H atom (they are degenerate)."},
    {id:"M3C1.f.split", name:"Multielectron atoms: subshells split", tex:"E(ns) < E(np) < E(nd) < E(nf)", kind:"rule", ref:"p. 2",
      note:"Within one shell, $s$ is lowest. The cause given in the notes is electron-electron repulsion.",
      blank:{tex:"E(ns) < E(np) < \\boxed{\\,?\\,} < E(nf)", accept:["E(nd)","nd","d","E(nd) "]}},
    {id:"M3C1.f.z-effect", name:"Effect of nuclear charge", tex:"Z\\uparrow \\;\\Rightarrow\\; \\text{energy of a given orbital}\\downarrow,\\ \\text{size}\\downarrow", kind:"rule", ref:"p. 2",
      note:"A larger nuclear charge attracts each electron more strongly, which lowers the orbital's energy and pulls it in."}
  ],
  glossary:[
    {id:"M3C1.t.multielectron", term:"Multielectron atom", def:"Any atom with more than one electron ($Z > 1$). Its Schrödinger equation is easy to write down but hard to solve because the electrons repel each other.", ref:"p. 1"},
    {id:"M3C1.t.nuclear-charge", term:"Nuclear charge", def:"The positive charge of the nucleus, $+Z$. It goes up by one from each element to the next.", ref:"p. 1"},
    {id:"M3C1.t.model", term:"Conceptual model (hydrogen-like orbitals)", def:"The picture used for every atom: electrons go into orbitals labelled 1s, 2s, 2p, 3s and so on, with the same quantum numbers as hydrogen. Each electron feels an average pull from the nucleus and an average push from the other electrons.", ref:"p. 1"},
    {id:"M3C1.t.shell", term:"Shell", def:"All the orbitals with the same $n$: the $n = 2$ shell, the $n = 3$ shell, and so on.", ref:"p. 2"},
    {id:"M3C1.t.subshell", term:"Subshell", def:"All the orbitals with the same $n$ and $l$, such as the $3p$ subshell. A shell with quantum number $n$ has $n$ subshells.", ref:"p. 2"},
    {id:"M3C1.t.shielding", term:"Shielding", def:"Other electrons partly cancel the nucleus's pull on an electron. The notes use this idea for Hund's rule (p. 4), the radius trend (p. 10) and the N to O drop in ionization energy (p. 12).", ref:"p. 4"}
  ],
  figures:{
    levels:{title:"Orbital energy levels: H atom against a multielectron atom", cap:"A schematic version of the diagram on p. 2 (no numbers: the notes print none). In hydrogen, every orbital in a shell sits at one height. In a multielectron atom each shell splits into $s < p < d$, and every level is lower than in hydrogen because the nuclear charge is bigger.", ref:"p. 2",
      build(host,{PLOT,M}){
        const ctl=PLOT.controls(host); let hi=3;
        const svgHost=document.createElement("div"); host.append(svgHost);
        const out=PLOT.readout(host);
        PLOT.seg(ctl,{label:"Highlight a shell",items:[[1,"n = 1"],[2,"n = 2"],[3,"n = 3"]],value:hi,onchange:v=>{ hi=v; draw(); }});
        /* y positions (svg units, larger = lower energy) */
        const H={1:[["1s",1,300]],2:[["2s",1,150],["2p",3,150]],3:[["3s",1,95],["3p",3,95],["3d",5,95]]};
        const X={1:[["1s",1,330]],2:[["2s",1,215],["2p",3,190]],3:[["3s",1,150],["3p",3,128],["3d",5,108]]};
        const MSG={1:"$n = 1$ has one subshell, $1s$. It is lower in the multielectron atom because a bigger nuclear charge pulls the electron in (p. 2).",
          2:"In H, $2s$ and $2p$ have the same energy. In a multielectron atom, electron-electron repulsion splits them: $2s$ is below $2p$ (p. 2).",
          3:"In H, $3s$, $3p$ and $3d$ are all at one level. In a multielectron atom they form a staircase: $3s < 3p < 3d$ (p. 2)."};
        function col(data,x0,title){
          let g=`<text x="${x0+90}" y="22" text-anchor="middle" style="font-size:13px;font-weight:600">${title}</text>`;
          for(const n of [1,2,3]) for(const [lab,cnt,y] of data[n]){
            const on=n===hi; const w=14, gap=4; const tot=cnt*w+(cnt-1)*gap;
            const xs=lab.endsWith("s")?x0+5:lab.endsWith("p")?x0+30:x0+90;
            for(let i=0;i<cnt;i++) g+=`<line x1="${xs+i*(w+gap)}" x2="${xs+i*(w+gap)+w}" y1="${y}" y2="${y}" style="stroke:${on?"var(--accent)":"var(--fig-stroke)"};stroke-width:${on?3.2:2};opacity:${on?1:.55}"/>`;
            g+=`<text x="${xs+tot/2}" y="${y-6}" text-anchor="middle" style="font-size:11px;opacity:${on?1:.7}">${lab}</text>`;
          }
          return g;
        }
        function draw(){
          const W=420,Hh=350;
          let g=`<svg viewBox="0 0 ${W} ${Hh}" class="fig" role="img" aria-label="Orbital energy levels for hydrogen and a multielectron atom">`;
          g+=`<line x1="18" y1="335" x2="18" y2="40" style="stroke:var(--fig-axis);stroke-width:1.5"/><path d="M12 48 L18 36 L24 48" style="fill:none;stroke:var(--fig-axis);stroke-width:1.5"/><text x="26" y="44" style="font-size:11px">Energy</text>`;
          g+=col(H,30,"H atom (Z = 1)")+col(X,225,"Multielectron (Z > 1)");
          g+=`<line x1="215" y1="34" x2="215" y2="340" style="stroke:var(--grid);stroke-dasharray:4 4"/></svg>`;
          svgHost.innerHTML=g; out.innerHTML=M.rich(MSG[hi]);
        }
        draw();
      }},
    core:{title:"Inner electrons and outer electrons", cap:"Radial probability of the $1s$ core electrons against a $2s$ or $2p$ electron. Most of the $1s$ density sits close to the nucleus, so an outer electron is partly screened from the full nuclear charge. The $2s$ curve has a small inner peak inside the $1s$ region; $2p$ does not. Module 2 (p. 26) calls this getting close to the nucleus \"penetrating\".", ref:"pp. 1-2",
      model:{type:"shells", params:{compare:["2s","2p"]}},
      predict:{q:"Which outer electron spends some of its time very close to the nucleus, inside most of the $1s$ density?", opts:[["The $2s$ electron",true,"The $2s$ radial curve has a small inner peak near the nucleus. That extra time close in is one way to picture why $2s$ sits below $2p$."],["The $2p$ electron",false,"A $p$ electron has zero probability right at the nucleus, and its curve has no inner peak."],["Both the same",false,"Compare the curves near $r = 0$: they are not the same."],["Neither: outer electrons never come inside the $1s$ region",false,"Both curves start at $r = 0$; the $2s$ one has a clear inner bump."]], check:"Compare the 2s and 2p curves with the 1s curve close to the nucleus, and read how much of each lies inside the cut-off."}}
  },
  gens:[
    {id:"M3C1.g.subshells", title:"Subshells in a shell", skill:"Shell $n$ has $n$ subshells", ref:"p. 2",
      gen(R,d){
        const n=d===1?R.int(1,3):d===2?R.int(2,5):R.int(4,6);
        const list=[...Array(n)].map((_,l)=>subLab(n,l));
        return {prompt:`How many subshells does the $n = ${n}$ shell have, and what is the label of the subshell with the largest $l$?`,
          parts:[{label:"Number of subshells",answer:{type:"int",value:n}},{label:"Subshell with the largest $l$ (like 2p)",answer:{type:"text",accept:[subLab(n,n-1),`${n} ${LET[n-1]}`]}}],
          hint:"$l$ can be any whole number from $0$ to $n-1$. The letters go s, p, d, f, g, h for $l = 0, 1, 2, 3, 4, 5$.",
          steps:[`For $n = ${n}$, $l$ can be $${[...Array(n)].map((_,l)=>l).join(", ")}$.`,`That is ${n} value${n>1?"s":""} of $l$, so ${n} subshell${n>1?"s":""}: $${list.join(",\\ ")}$.`,`The largest is $l = ${n-1}$, the $${subLab(n,n-1)}$ subshell.`],
          answerTeX:`${n} subshell${n>1?"s":""}; the last is $${subLab(n,n-1)}$`};
      }},
    {id:"M3C1.g.compare", title:"Which orbital is higher in energy?", skill:"H atom against multielectron atom", ref:"p. 2",
      gen(R,d){
        const kinds=d===1?["Hsame","Msame"]:d===2?["Hsame","Hdiff","Msame"]:["Hdiff","Msame"];
        const kind=R.pick(kinds);
        let a,b,atom,ans,why;
        if(kind==="Hsame"){ const n=R.int(2,d===1?3:4); const ls=R.shuffle([...Array(n)].map((_,i)=>i)).slice(0,2); a=[n,ls[0]]; b=[n,ls[1]]; atom="a hydrogen atom"; ans=2; why=`In hydrogen, energy depends only on $n$. Both have $n = ${n}$, so they are degenerate.`; }
        else if(kind==="Hdiff"){ const n1=R.int(2,3), n2=n1+R.int(1,2); const l1=R.int(1,n1-1), l2=0; a=[n1,l1]; b=[n2,l2]; if(R()<0.5) [a,b]=[b,a]; atom="a hydrogen atom"; ans=a[0]>b[0]?0:1; why=`In hydrogen only $n$ matters. The orbital with $n = ${Math.max(a[0],b[0])}$ is higher, whatever its letter.`; }
        else { const n=d===3?R.int(3,4):R.int(2,3); const ls=R.shuffle([...Array(n)].map((_,i)=>i)).slice(0,2); a=[n,ls[0]]; b=[n,ls[1]]; const z=R.pick([11,12,17,19,20,26,35]); atom=`a ${CH.NAME[CH.sym(z)].toLowerCase()} atom`; ans=a[1]>b[1]?0:1; why=`In a multielectron atom the shell splits: $s < p < d < f$. $${subLab(...(a[1]>b[1]?a:b))}$ has the larger $l$, so it is higher.`; }
        const A=subLab(...a), B=subLab(...b);
        const options=[`The $${A}$ orbital is higher`,`The $${B}$ orbital is higher`,"They have the same energy"];
        return {prompt:`In ${atom}, compare the energies of a $${A}$ orbital and a $${B}$ orbital.`,
          answer:{type:"mc",options,correct:ans,keep:true},
          hint:"Hydrogen: only $n$ decides the energy. Multielectron atom: within one shell, $s < p < d < f$.",
          steps:[kind==="Msame"?`${atom[0].toUpperCase()+atom.slice(1)} has more than one electron, so electron-electron repulsion matters (p. 2).`:"Hydrogen has one electron, so there is no electron-electron repulsion.",why],
          answerTeX:options[ans]};
      }},
    {id:"M3C1.g.zeffect", title:"Nuclear charge and orbital energy", skill:"Bigger $Z$: lower and smaller orbitals", ref:"p. 2",
      gen(R,d){
        const orb=d===1?"1s":d===2?R.pick(["2s","2p"]):R.pick(["2p","3s"]);
        const minZ={"1s":1,"2s":3,"2p":5,"3s":11}[orb];
        const zs=R.shuffle([...Array(36-minZ+1)].map((_,i)=>minZ+i)).slice(0,d===1?3:4);
        const asks=d===3?[["highest energy",false],["largest",false],["lowest energy",true],["smallest",true]]:[["lowest energy",true],["smallest",true]];
        const [word,wantMax]=R.pick(asks);
        const target=wantMax?Math.max(...zs):Math.min(...zs);
        const options=zs.map(z=>`${CH.NAME[CH.sym(z)]} ($Z = ${z}$)`);
        return {prompt:`In which atom is the $${orb}$ orbital the <b>${word}</b>?`,
          answer:{type:"mc",options,correct:zs.indexOf(target)},
          hint:"The same orbital is pulled lower in energy and closer in as the nuclear charge $Z$ grows (p. 2).",
          steps:[`Compare nuclear charges: ${zs.map(z=>`${CH.sym(z)} $Z = ${z}$`).join(", ")}.`,`A bigger $Z$ attracts the electron more strongly, which lowers the orbital's energy and shrinks it.`,`So the ${word} $${orb}$ orbital is in the atom with the ${wantMax?"largest":"smallest"} $Z$: ${CH.NAME[CH.sym(target)]}.`],
          answerTeX:CH.NAME[CH.sym(target)]};
      }},
    {id:"M3C1.g.interactions", title:"Count the interactions in an atom", skill:"Why more electrons make the problem harder", ref:"p. 1",
      gen(R,d){
        const N=d===1?R.int(3,4):d===2?R.int(3,5):R.int(5,8);
        const pairs=N*(N-1)/2; let check=0; for(let i=0;i<N;i++) for(let j=i+1;j<N;j++) check++;
        return {prompt:`A neutral ${nm(N).replace(/^\w/,c=>c.toLowerCase())} atom: how many electron-nucleus attractions and how many electron-electron repulsions must its Schrödinger equation include? (Helium has 2 and 1.)`,
          parts:[{label:"Electron-nucleus attractions",answer:{type:"int",value:N}},{label:"Electron-electron repulsions",answer:{type:"int",value:check}}],
          hint:"Each electron is attracted to the one nucleus. Each pair of electrons repels: count the pairs.",
          steps:[`A neutral atom with $Z = ${N}$ has ${N} electrons.`,`Each electron feels the nucleus: ${N} attractions.`,`Electron pairs: $\\dfrac{${N}\\times${N-1}}{2} = ${pairs}$ repulsions.`,`So ${N+pairs} interactions in all. The repulsions are what make the equation hard to solve (p. 1).`],
          answerTeX:`${N} attractions, ${pairs} repulsions`};
      }}
  ],
  exam:[
    {id:"M3C1.q1", ref:"p. 2", q:"In a hydrogen atom, which orbitals have the same energy as a $3p$ orbital?", opts:[["Only the other two $3p$ orbitals",false,"In H the $3s$ and $3d$ orbitals are at that level too."],["$3s$ and $3d$ (and the other $3p$ orbitals)",true,"In hydrogen, energy depends only on $n$, so the whole $n = 3$ shell is degenerate."],["$2p$ and $4p$",false,"Same letter does not mean same energy. $n$ decides it in hydrogen."],["$4s$ only",false,"$4s$ has $n = 4$, so it is higher."],["None: every orbital in H has its own energy",false,"The H levels are degenerate within each shell."]]},
    {id:"M3C1.q2", ref:"p. 2", q:"According to the notes, why are the $3s$, $3p$ and $3d$ subshells of a chlorine atom not at the same energy?", opts:[["Electron-electron repulsion in a multielectron atom",true,"This is the reason the notes give on p. 2."],["The nucleus of Cl is larger than a proton",false,"A bigger nuclear charge lowers all levels; by itself it does not split a shell."],["The $3d$ orbitals of Cl hold electrons",false,"The $3d$ subshell is empty in Cl, and that is not the cause."],["The Pauli principle forbids equal energies",false,"Pauli limits how many electrons share an orbital. It says nothing about orbital energies."],["Hund's rule raises the energy of $d$ orbitals",false,"Hund's rule is about how electrons spread over degenerate orbitals."]]},
    {id:"M3C1.q3", ref:"p. 2", q:"How do the energy and the size of the $1s$ orbital change from He to Ne?", opts:[["Energy goes down, size goes down",true,"A bigger $Z$ attracts the electron more strongly: lower energy and a tighter orbital."],["Energy goes up, size goes up",false,"More nuclear charge pulls the orbital in and lower."],["Energy goes down, size goes up",false,"Stronger attraction makes the orbital contract."],["Energy goes up, size goes down",false,"Stronger attraction lowers the energy."],["Neither changes: $1s$ is the same in every atom",false,"The notes say both decrease as $Z$ increases."]]},
    {id:"M3C1.q4", ref:"p. 2", q:"How many subshells does the $n = 4$ shell contain?", opts:[["2",false,"That would be $n = 2$."],["3",false,"$l$ runs from 0 to 3, which is four values."],["4",true,"$4s$, $4p$, $4d$, $4f$: one for each $l = 0, 1, 2, 3$."],["8",false,"Count values of $l$, not something else."],["16",false,"16 is the number of orbitals in the shell, not subshells."]]},
    {id:"M3C1.q5", ref:"p. 1", q:"Which statement about the Schrödinger equation for a helium atom matches the notes?", opts:[["It cannot be written down because helium has two electrons.",false,"Writing it down is described as easy."],["It is easy to write down; solving it is hard because of the electron-electron repulsion.",true,"The repulsion term is the difficulty."],["It is the same as for hydrogen except that $Z = 2$.",false,"There is also a second electron and the repulsion between the two."],["It has only two interactions: each electron with the nucleus.",false,"There are three: two attractions and one repulsion."],["It must be solved exactly to predict any electron configuration.",false,"The notes say we can understand how electrons pack without solving it for every atom."]]},
    {id:"M3C1.q6", ref:"p. 1", q:"In the conceptual model for a multielectron atom, which statement is correct?", opts:[["Each electron feels an average attraction to the nucleus and an average repulsion from the other electrons.",true,"That is the boxed model on p. 1."],["Electrons do not use hydrogen-like orbitals.",false,"The model gives the atom a full set of hydrogen-like orbitals: 1s, 2s, 2p and so on."],["The quantum numbers are different from those of hydrogen.",false,"They are the same: $n$, $l$, $m_l$, $m_s$."],["All the electrons share one orbital.",false,"That would break the Pauli principle (next chapter)."],["Electron-electron repulsion is ignored.",false,"It is included as an average."]]}
  ],
  steps:[
    {type:"read", title:"One electron is solved; many electrons are not", ref:"p. 1", body:"<p>Module 2 solved the hydrogen atom: one electron, one proton. Every state of that electron is labelled by $(n, l, m_l, m_s)$ and lives in a region of space we call an orbital.</p><p>Helium adds one proton to the nucleus ($Z = +2$) and one more electron. Now there are three interactions: electron 1 with the nucleus, electron 2 with the nucleus, and electron 1 with electron 2. Writing the Schrödinger equation for this is easy. Solving it is not, and the trouble is the electron-electron repulsion.</p><p>Think of one planet around a star: the path is easy to predict. Add a second planet that tugs on the first and the paths become hard to work out exactly. Chemists use a simpler model instead of solving every atom.</p>"},
    {type:"read", title:"The model: hydrogen-like orbitals, filled by many electrons", ref:"p. 1", body:"<div class=\"box def\"><b class=\"t\">Conceptual model (p. 1)</b>Every atom has a full set of hydrogen-like orbitals ($1s, 2s, 2p, 3s, \\dots$) with the same quantum numbers as hydrogen. The atom's electrons go into these orbitals. Each electron feels an <b>average</b> pull toward the nucleus and an <b>average</b> push from all the other electrons.</div><p>This leaves two questions for the next chapters: how many electrons can share an orbital, and which arrangement gives the atom the lowest energy? Each electron wants to be close to the nucleus, but the electrons also want to stay away from each other.</p>"},
    {type:"mcq", title:"Interactions grow fast", q:"A neutral lithium atom has 3 electrons. How many interactions does its Schrödinger equation contain?", opts:[["3",false,"That counts only the attractions to the nucleus."],["4",false,"Count every pair of electrons, too."],["6",true,"3 electron-nucleus attractions plus 3 electron-electron pairs (1-2, 1-3, 2-3)."],["9",false,"Each pair of electrons is counted once, not twice."]], after:"Helium has 3 interactions, lithium 6, and a 10-electron atom 55. That is why the notes avoid solving each atom exactly."},
    {type:"try", title:"Count the interactions", gen:"M3C1.g.interactions", diff:2},
    {type:"read", title:"Shells and subshells", ref:"p. 2", body:"<p>Two words you will use all the time:</p><ul><li>A <b>shell</b> is set by $n$: the $n = 1$ shell, the $n = 2$ shell, and so on.</li><li>A <b>subshell</b> is set by $n$ and $l$ together: $3s$, $3p$, $3d$. Since $l$ runs from $0$ to $n - 1$, shell $n$ has exactly $n$ subshells.</li></ul><p>A building analogy: the shell is a floor, and the subshells are the apartments on that floor. Floor 3 has three apartments (s, p, d); floor 4 has four (s, p, d, f).</p>"},
    {type:"try", title:"Subshells in a shell", gen:"M3C1.g.subshells"},
    {type:"explore", title:"Hydrogen levels against multielectron levels", fig:"levels", ref:"p. 2", body:"<p>Pick a shell and compare the two diagrams.</p><ul><li>In hydrogen the shell is one level. All its orbitals are <b>degenerate</b> (same energy).</li><li>In a multielectron atom the shell splits into a staircase: $s$ lowest, then $p$, then $d$.</li><li>Every multielectron level is drawn lower than the matching hydrogen level, because the nucleus has more charge.</li></ul>"},
    {type:"read", title:"Why a shell splits", ref:"pp. 2, 4", body:"<p>The notes give one reason: <b>electron-electron repulsion</b>. In hydrogen there is no other electron, so only $n$ sets the energy. Once there are other electrons, how an orbital is shaped and where its electron spends time changes how much repulsion it feels, and the subshells of a shell end up at different energies: $s < p < d < f$.</p><p>A useful picture (the notes use it later, on pp. 4 and 10) is <b>shielding</b>: inner electrons sit between the nucleus and an outer electron and cancel part of the nucleus's pull. Module 2 (p. 26) showed that an $s$ electron has a real chance of being found right at the nucleus while $p$, $d$ and $f$ electrons do not. An $s$ electron that gets close in is shielded less, feels more of the nucleus, and is lower in energy. (This link between penetration, shielding and the splitting is a common textbook picture; the Module 3 notes do not make it.)</p><p>Keep the two ideas apart from a third one: a bigger nuclear charge lowers <i>every</i> orbital and makes it smaller (p. 2).</p>"},
    {type:"explore", title:"Compare a 2s and a 2p electron with the 1s core", fig:"core", ref:"pp. 1-2", body:"<p>The $1s$ curve is the core electron density. The shading shows how much of each outer orbital lies inside the cut-off radius (start: the most probable $1s$ radius). Compare each outer orbital with the core.</p><ul><li>$2s$: a small inner peak lies inside the $1s$ region. Part of the time this electron is close to the nucleus.</li><li>$2p$: no inner peak, and zero probability right at the nucleus.</li></ul><p>This picture (shielding, and $s$ electrons getting close to the nucleus) is a way to see the splitting. The notes themselves give the reason as electron-electron repulsion.</p>"},
    {type:"example", title:"Rank the same orbital in three atoms", ref:"p. 2", ex:{q:"Put the $1s$ orbitals of H, C and Ne in order of energy and in order of size. Then say whether $2s$ and $2p$ have the same energy in C, and in H.", steps:[{t:"Nuclear charges: H $Z = 1$, C $Z = 6$, Ne $Z = 10$.",why:"The nuclear charge is the only thing that changes for the same orbital."},{t:"Energy: $1s$(Ne) $<$ $1s$(C) $<$ $1s$(H).",why:"A bigger $Z$ pulls the electron in more strongly, which lowers the energy (p. 2)."},{t:"Size: $1s$(Ne) $<$ $1s$(C) $<$ $1s$(H).",why:"Stronger attraction makes the orbital contract (p. 2)."},{t:"In C, $2s$ is below $2p$.",why:"C has 6 electrons, so electron-electron repulsion splits the $n = 2$ shell."},{t:"In H, $2s$ and $2p$ have the same energy.",why:"One electron: no repulsion, so only $n$ matters."}], ans:"Energy and size both: Ne $<$ C $<$ H. In C, $E(2s) < E(2p)$; in H they are equal.", ref:"p. 2"}},
    {type:"try", title:"Which orbital is higher?", gen:"M3C1.g.compare"},
    {type:"try", title:"Bigger nucleus, lower orbital", gen:"M3C1.g.zeffect"},
    {type:"firstline", title:"Find the first mistake", q:"A student describes the $n = 3$ shell of a sodium atom:", lines:["Na has 11 electrons, so it is a multielectron atom.","In a hydrogen atom, orbital energy depends only on $n$.","So in Na, the $3s$, $3p$ and $3d$ orbitals have the same energy.","The $3s$ orbital of Na is lower in energy than the $3s$ orbital of H."], wrong:2, why:"The hydrogen rule does not carry over. In a multielectron atom electron-electron repulsion splits the shell: $3s < 3p < 3d$ (p. 2). Line 4 is correct: Na has a bigger nuclear charge."},
    {type:"mcq", title:"Splitting or nuclear charge?", q:"Which change is caused by electron-electron repulsion rather than by a bigger nuclear charge?", opts:[["The $1s$ orbital of Ne is smaller than the $1s$ orbital of H.",false,"That is the nuclear-charge effect: $Z = 10$ against $Z = 1$."],["In Mg, $3p$ is higher in energy than $3s$.",true,"Splitting within a shell comes from electron-electron repulsion (p. 2)."],["The $2s$ orbital of F is lower in energy than the $2s$ orbital of Li.",false,"Same orbital, bigger $Z$: that is the nuclear-charge effect."]]},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
