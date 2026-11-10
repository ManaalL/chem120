/* Chapter 3.5 (Fri Oct 23): Atomic radius and ionization energy. Course notes Module 3, pp. 10-13 (section 3.5 B and C).
   Covalent and metallic radii, the radius trends and their reasons, ionization energy (the Mg example on p. 11),
   IE trends, and the dips from group 2 to 13 (Be to B, Mg to Al) and group 15 to 16 (N to O) as the notes explain them.
   The notes print no table of radii or first ionization energies, only graphs. The IE values below are standard values
   (not from the notes) and are labelled so wherever they appear. Bond lengths are from Module 4, p. 16. */
(function(){
const M=C120;
const CH=M.chem;
const name=s=>CH.NAME[s];
/* standard first ionization energies, kJ/mol (not from the notes; the notes graph them on p. 11) */
const IE={H:1312,He:2372,Li:520,Be:900,B:801,C:1086,N:1402,O:1314,F:1681,Ne:2081,Na:496,Mg:738,Al:578,Si:787,P:1012,S:1000,Cl:1251,Ar:1521,K:419,Ca:590,Sc:633,Ti:659,V:651,Cr:653,Mn:717,Fe:762,Co:760,Ni:737,Cu:745,Zn:906,Ga:579,Ge:762,As:947,Se:941,Br:1140,Kr:1351,Rb:403,Sr:550,Y:600,Zr:640,Nb:652,Mo:684,Tc:702,Ru:710,Rh:720,Pd:804,Ag:731,Cd:868,In:558,Sn:709,Sb:834,Te:869,I:1008,Xe:1170,Cs:376,Ba:503};
const IE1_MG=738, IE2_MG=1451;
/* main-group grid: [symbol, period, group] */
const MAIN=[];
[["Li","Be","B","C","N","O","F","Ne"],["Na","Mg","Al","Si","P","S","Cl","Ar"],["K","Ca","Ga","Ge","As","Se","Br","Kr"],["Rb","Sr","In","Sn","Sb","Te","I","Xe"],["Cs","Ba","Tl","Pb","Bi","Po","At","Rn"]].forEach((row,i)=>row.forEach((s,j)=>MAIN.push([s,i+2,[1,2,13,14,15,16,17,18][j]])));
const at=s=>MAIN.find(x=>x[0]===s);
const col=g=>g<=2?g:g-10;   /* 1..8 across the main-group columns */
const ANOM=[["Be","B"],["Mg","Al"],["Ca","Ga"],["N","O"],["P","S"],["As","Se"]];
const isAnomPair=(a,b)=>ANOM.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
const BONDS=[["H",74],["F",143],["Cl",199],["Br",228],["I",266]];   /* single-bond X2 molecules only (Module 4, p. 16) */
const METALS=[["Na",372],["K",453],["Mg",320],["Al",286],["Fe",248],["Cu",256],["Ag",289],["Au",288]];
const sfOf=v=>String(v).replace(/^0\.0*/,"").replace(".","").length;

M.chapter({
  id:"M3C5", module:"m3", n:5, num:"3.5", date:"2026-10-23", added:"2026-10-26", quiz:"PC4",
  title:"Atomic radius and ionization energy", pages:"10-13", sections:["3.5"],
  summary:"Atoms shrink from left to right across a period and grow down a group. First ionization energy does the reverse: it rises across a period and falls down a group, with dips from group 2 to 13 and from group 15 to 16. Each electron removed costs more than the last: $IE(1) < IE(2) < IE(3)$.",
  flags:[],
  formulas:[
    {id:"M3C5.f.cov", name:"Covalent radius", tex:"r_{\\text{cov}}(\\mathrm{X}) = \\tfrac12\\, d(\\mathrm{X{-}X}) \\text{ in } \\mathrm{X_2}", ref:"p. 10", note:"Most useful for elements that form diatomic molecules.",
      blank:{tex:"r_{\\text{cov}}(\\mathrm{X}) = \\boxed{\\,?\\,}\\, d(\\mathrm{X{-}X})", accept:["1/2","½","0.5","\\tfrac12","half"]}},
    {id:"M3C5.f.met", name:"Metallic radius", tex:"r_{\\text{met}} = \\tfrac12\\,(\\text{nearest-neighbour distance in the metal})", ref:"p. 10", note:"Most elements are metals at room conditions, so this is the radius used for most of the table."},
    {id:"M3C5.f.radius-trend", name:"Radius trends", tex:"\\text{radius: decreases left to right, increases down a group}", kind:"rule", ref:"p. 10",
      note:"Across: more nuclear charge, and electrons in the same shell shield each other only partly, so all are pulled in. Down: each new shell has its electron density farther out."},
    {id:"M3C5.f.ie", name:"Ionization energy", tex:"\\mathrm{X(g) \\rightarrow X^{+}(g) + e^-}\\qquad IE = \\Delta H > 0", ref:"p. 11", note:"Removing an electron always takes energy, so ionization energies are always positive."},
    {id:"M3C5.f.mg", name:"Ionization energies of Mg", tex:"IE(1) = 738\\ \\mathrm{kJ\\,mol^{-1}},\\quad IE(2) = 1451\\ \\mathrm{kJ\\,mol^{-1}}", kind:"constant", ref:"p. 11",
      blank:{tex:"IE(1)_{\\mathrm{Mg}} = \\boxed{\\,?\\,}\\ \\mathrm{kJ\\,mol^{-1}}", accept:["738"]}},
    {id:"M3C5.f.mg-total", name:"Two steps add (Mg to Mg²⁺)", tex:"\\mathrm{Mg(g) \\rightarrow Mg^{2+}(g) + 2e^-}\\quad \\Delta H = IE(1) + IE(2) = 2189\\ \\mathrm{kJ\\,mol^{-1}}", ref:"p. 11",
      blank:{tex:"\\Delta H(\\mathrm{Mg \\rightarrow Mg^{2+}}) = \\boxed{\\,?\\,}\\ \\mathrm{kJ\\,mol^{-1}}", accept:["2189","738+1451","IE(1)+IE(2)"]}},
    {id:"M3C5.f.successive", name:"Successive ionization energies", tex:"IE(1) < IE(2) < IE(3) < \\cdots", kind:"rule", ref:"p. 11"},
    {id:"M3C5.f.ie-trend", name:"Ionization energy trends", tex:"IE(1)\\text{: increases left to right (with exceptions), decreases down a group}", kind:"rule", ref:"p. 11"},
    {id:"M3C5.f.dips", name:"The two dips", tex:"\\text{group } 2 \\to 13 \\ \\text{and}\\ \\text{group } 15 \\to 16:\\ IE(1) \\text{ drops}", kind:"rule", ref:"pp. 11-13",
      note:"2 to 13: the electron removed is in a higher-energy $p$ orbital. 15 to 16: the electron removed is a paired $p$ electron; the drop starts once $p$ orbitals are shared."}
  ],
  glossary:[
    {id:"M3C5.t.cov", term:"Covalent radius", def:"Half the bond length of the $\\mathrm{X_2}$ molecule.", ref:"p. 10"},
    {id:"M3C5.t.met", term:"Metallic radius", def:"Half the distance between nearest-neighbour atoms in a metallic solid.", ref:"p. 10"},
    {id:"M3C5.t.ie", term:"Ionization energy (IE)", def:"The energy needed to remove an electron from a gas-phase atom, often given as $\\Delta H$ in kJ mol⁻¹. $IE(1)$ removes the first electron, $IE(2)$ the next.", ref:"p. 11"},
    {id:"M3C5.t.zeff", term:"Effective nuclear charge", def:"The pull from the nucleus that an electron actually feels after other electrons shield it. The notes use it in words only (p. 12), with no formula.", ref:"p. 12"},
    {id:"M3C5.t.endothermic", term:"Endothermic", def:"Taking in energy ($\\Delta H > 0$). Every ionization is endothermic.", ref:"p. 11"}
  ],
  figures:{
    radius:{title:"Atomic radius across the table", cap:"Each element is a bar whose height is its atomic radius (standard values, not from the notes; the notes show the same pattern as a graph on p. 10). Click a bar for its value and source.", ref:"p. 10",
      model:{type:"trends", params:{property:"radius", highlight:["Na","Cl","Li","Cs"]}},
      predict:{q:"Leaving out argon, which atom in period 3 has the largest radius?", opts:[["Na",true,"Radius falls from left to right, so the group 1 atom is largest."],["Cl",false,"Cl is the smallest of the period 3 atoms shown on p. 10."],["Si",false,"Si is in the middle."],["All the same: they share $n = 3$",false,"Same outer shell, but a bigger nuclear charge pulls it in."]], check:"Click along period 3 from Na to Cl, then down group 1 from Li to Cs."}},
    ie3d:{title:"First ionization energy across the table", cap:"Bar height is the first ionization energy (standard values, not from the notes). Look for the tall noble gases, the short alkali metals, and the small steps down after groups 2 and 15.", ref:"pp. 11-13",
      model:{type:"trends", params:{property:"ie", highlight:["N","O","Be","B"]}},
      predict:{q:"Which has the higher first ionization energy: nitrogen or oxygen?", opts:[["Nitrogen",true,"The drop from group 15 to 16 happens once $2p$ orbitals start to be shared (pp. 12-13)."],["Oxygen",false,"The simple left-to-right trend says O, but O's electron is a paired $2p$ electron and is easier to remove."],["They are equal",false,"Click both bars: they differ."]], check:"Click N, then O, then compare Be with B."}},
    ieplot:{title:"First ionization energy against atomic number", cap:"$IE(1)$ for $Z = 1$ to 54 (standard values, not from the notes; the notes plot the same graph on p. 11). Slide to any element. Peaks are noble gases, valleys are alkali metals.", ref:"p. 11",
      build(host,{PLOT,M}){
        const CH=M.chem; let z=8;
        const ctl=PLOT.controls(host);
        const G=PLOT.graph(host,{x:[0,56],y:[0,2600],xstep:10,ystep:500,xlabel:"Z",ylabel:"IE(1), kJ/mol",h:320});
        const pts=[]; for(let k=1;k<=54;k++) pts.push([k,IE[CH.sym(k)]]);
        for(let i=1;i<pts.length;i++) G.line(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],{cls:"cv"});
        pts.forEach(([x,y])=>{ const d=G.dot(x,y,{r:2.6}); d.style.opacity=".7"; });
        const mark=G.dot(z,IE[CH.sym(z)],{r:6,filled:true});
        const lab=G.label(z,IE[CH.sym(z)],CH.sym(z),{dx:8,dy:-8});
        const out=PLOT.readout(host);
        const note={Be:"Be to B: B's electron comes out of a higher-energy $2p$ orbital.",B:"Lower than Be: the $2p$ electron is easier to remove than a $2s$ electron.",N:"Higher than O: N loses an unpaired $2p$ electron.",O:"Lower than N: O loses a paired $2p$ electron (p. 12).",Mg:"Mg is the notes' example: 738 kJ/mol (p. 11).",Al:"Lower than Mg: same reason as B against Be.",P:"Higher than S: same reason as N against O.",S:"Lower than P: a paired $3p$ electron is removed.",He:"The highest of all.",Li:"A valley: one $2s$ electron outside a full shell."};
        PLOT.slider(ctl,{label:"Element",min:1,max:54,value:z,fmt:v=>`${v} ${CH.sym(v)}`,oninput:v=>{ z=v; draw(); }});
        function draw(){ const s=CH.sym(z), v=IE[s]; mark.set(z,v); lab.set(z,v,s); out.innerHTML=M.rich(`${CH.NAME[s]}: $IE(1) = ${v}$ kJ/mol (standard value, not from the notes). ${note[s]||""}`); }
        draw();
      }}
  },
  gens:[
    {id:"M3C5.g.radius", title:"Size of a covalent or metallic radius", skill:"Half the distance between nuclei", ref:"p. 10",
      gen(R,d){
        if(d===1){ const [s,b]=R.pick(BONDS); const sf=sfOf(b);
          return {prompt:`The $\\ce{${s}-${s}}$ bond length in $\\ce{${s}2}$ is ${b} pm (Module 4, p. 16). What is the covalent radius of ${name(s).toLowerCase()}?`,
            answer:{type:"num",value:b/2,unit:"pm",sf}, hint:"The covalent radius is half the X to X bond length (p. 10).",
            steps:[`$r_{\\text{cov}} = \\tfrac12\\, d(\\ce{${s}-${s}})$`,`$= \\tfrac12 \\times ${b}\\ \\mathrm{pm} = ${M.toSig(b/2,sf)}\\ \\mathrm{pm}$`],
            answerTeX:`$${M.toSig(b/2,sf)}\\ \\mathrm{pm}$`, verify:{value:b*0.5}}; }
        const [s,dpm]=R.pick(METALS); const dnm=dpm/1000;
        if(d===2) return {prompt:`In solid ${name(s).toLowerCase()}, the distance between the nuclei of nearest-neighbour atoms is ${dnm.toFixed(3)} nm (standard value, not from the notes). What is the metallic radius of ${s}, in pm?`,
            answer:{type:"num",value:dpm/2,unit:"pm",sf:3}, hint:"Metallic radius $=$ half the nearest-neighbour distance. Then convert: 1 nm $= 1000$ pm.",
            steps:[`$r_{\\text{met}} = \\tfrac12 \\times ${dnm.toFixed(3)}\\ \\mathrm{nm} = ${(dnm/2).toFixed(4)}\\ \\mathrm{nm}$`,`$${(dnm/2).toFixed(4)}\\ \\mathrm{nm} \\times 1000\\ \\mathrm{pm/nm} = ${M.toSig(dpm/2,3)}\\ \\mathrm{pm}$`],
            answerTeX:`$${M.toSig(dpm/2,3)}\\ \\mathrm{pm}$`, verify:{value:dnm*1e3*0.5}};
        const r=+M.toSig(dpm/2,3);
        return {prompt:`The metallic radius of ${name(s).toLowerCase()} is ${r} pm (standard value, not from the notes). What distance, in nm, separates the nuclei of two neighbouring ${s} atoms in the metal?`,
          answer:{type:"num",value:2*r/1000,unit:"nm",sf:3}, hint:"Nearest-neighbour distance $= 2 \\times r_{\\text{met}}$. Then 1000 pm $= 1$ nm.",
          steps:[`$d = 2 r_{\\text{met}} = 2 \\times ${r}\\ \\mathrm{pm} = ${2*r}\\ \\mathrm{pm}$`,`$${2*r}\\ \\mathrm{pm} \\div 1000 = ${M.toSig(2*r/1000,3)}\\ \\mathrm{nm}$`],
          answerTeX:`$${M.toSig(2*r/1000,3)}\\ \\mathrm{nm}$`, verify:{value:(r+r)*1e-3}};
      }},
    {id:"M3C5.g.size-order", title:"Which atom is largest or smallest?", skill:"Radius trends across and down", ref:"p. 10",
      gen(R,d){
        const pool=MAIN.filter(x=>x[2]!==18 && x[2]!==13 && x[1]<=(d===1?4:5));
        let target, opts, want;
        for(let t=0;t<200;t++){
          target=R.pick(pool); want=R.pick(["largest","smallest"]); const [ts,tp,tg]=target;
          let cand=pool.filter(([s,p,g])=>s!==ts && (want==="largest"? p<=tp&&col(g)>=col(tg) : p>=tp&&col(g)<=col(tg)));
          if(d===1) cand=cand.filter(([s,p,g])=>p===tp||g===tg);
          const need=d===1?2:d===2?3:4; if(cand.length<need) continue;
          opts=R.shuffle([target,...R.shuffle(cand).slice(0,need)]); if(opts.map(x=>x[0]).sort().join()==="Br,Ca,I,K,Rb") continue; break;   /* a sample test's own set */
        }
        const [ts,tp,tg]=target;
        return {prompt:`Compare atomic radii. Which of these is the <b>${want}</b> atom?`,
          answer:{type:"mc",options:opts.map(x=>x[0]),correct:opts.indexOf(target),why:opts.map(([s,p,g])=>`${s}: period ${p}, group ${g}.`)},
          hint:"Radius decreases from left to right across a period and increases down a group (p. 10). Find the atom that is lowest and farthest left (for largest) or highest and farthest right (for smallest).",
          steps:[...opts.map(([s,p,g])=>`${s}: period ${p}, group ${g}.`),want==="largest"?`${ts} is the farthest down and the farthest left: every other option is above it, to its right, or both.`:`${ts} is the farthest up and the farthest right: every other option is below it, to its left, or both.`,`Down a group a new, farther shell is added; across a period the larger nuclear charge pulls the same shell in. So ${ts} is the ${want}.`],
          answerTeX:ts};
      }},
    {id:"M3C5.g.mg", title:"Energy to ionize magnesium", skill:"Use $IE(1)$ and $IE(2)$ of Mg with moles", ref:"p. 11",
      gen(R,d){
        const mm=CH.MASS.Mg, NA=CH.CONST.NA;
        if(d===1){ const n=R.sig(0.1,1.3,3);
          return {prompt:`How much energy, in kJ, is needed to turn ${M.toSig(n,3)} mol of gas-phase Mg atoms into $\\ce{Mg+}$ ions? Use the value in the notes.`,
            answer:{type:"num",value:n*IE1_MG,unit:"kJ",sf:3}, hint:"$IE(1)$ of Mg is 738 kJ per mole of atoms (p. 11).",
            steps:[`$\\ce{Mg(g) -> Mg+(g) + e-}$: $IE(1) = 738\\ \\mathrm{kJ\\,mol^{-1}}$`,`$E = ${M.toSig(n,3)}\\ \\mathrm{mol} \\times 738\\ \\mathrm{kJ\\,mol^{-1}} = ${M.toSig(n*IE1_MG,3)}\\ \\mathrm{kJ}$`],
            answerTeX:`$${M.qty(n*IE1_MG,3,"kJ")}$`, verify:{value:IE1_MG*n}}; }
        if(d===2 && R()<0.5){ const per=IE1_MG*1000/NA;
          return {prompt:"Using the notes' value of $IE(1)$ for magnesium, how much energy in joules does it take to remove one electron from a single gas-phase Mg atom?",
            answer:{type:"num",value:per,unit:"J",sf:3}, hint:"738 kJ is for a mole of atoms. Change kJ to J, then divide by Avogadro's number.",
            steps:["$IE(1) = 738\\ \\mathrm{kJ\\,mol^{-1}} = 7.38\\times10^{5}\\ \\mathrm{J\\,mol^{-1}}$",`$\\dfrac{7.38\\times10^{5}\\ \\mathrm{J\\,mol^{-1}}}{6.022\\times10^{23}\\ \\mathrm{mol^{-1}}} = ${M.numTeX(per,3)}\\ \\mathrm{J}$`],
            answerTeX:`$${M.qty(per,3,"J")}$`, verify:{value:738/NA*1e3}}; }
        const m=R.sig(1,d===2?20:10,3); const n=m/mm; const two=d===3;
        const per=two?IE1_MG+IE2_MG:IE1_MG; const E=n*per;
        return {prompt:`How much energy, in kJ, is needed to convert ${M.toSig(m,3)} g of gas-phase Mg atoms completely into $\\ce{${two?"Mg^2+":"Mg+"}(g)}$ ions? Use the values in the notes and the data-sheet molar mass.`,
          answer:{type:"num",value:E,unit:"kJ",sf:3}, hint:two?"Two electrons per atom: add $IE(1)$ and $IE(2)$ (p. 11), then multiply by moles.":"Find moles with $M(\\mathrm{Mg}) = 24.31$ g/mol, then multiply by $IE(1)$.",
          steps:[`$n = \\dfrac{${M.toSig(m,3)}\\ \\mathrm{g}}{24.31\\ \\mathrm{g\\,mol^{-1}}} = ${M.toSig(n,4)}\\ \\mathrm{mol}$`,two?"$\\Delta H = IE(1) + IE(2) = 738 + 1451 = 2189\\ \\mathrm{kJ\\,mol^{-1}}$":"$IE(1) = 738\\ \\mathrm{kJ\\,mol^{-1}}$",`$E = ${M.toSig(n,4)}\\ \\mathrm{mol} \\times ${per}\\ \\mathrm{kJ\\,mol^{-1}} = ${M.toSig(E,3)}\\ \\mathrm{kJ}$`],
          answerTeX:`$${M.qty(E,3,"kJ")}$`, verify:{value:two?(m*IE1_MG+m*IE2_MG)/mm:m*IE1_MG/mm}};
      }},
    {id:"M3C5.g.ie-order", title:"Which atom has the highest or lowest IE(1)?", skill:"IE trends and the two dips", ref:"pp. 11-13",
      gen(R,d){
        const pool=MAIN.filter(x=>x[1]<=(d===3?5:4) && !(d===1&&x[2]===13));
        let set, want, best, ok=false;
        for(let t=0;t<300&&!ok;t++){
          want=R.pick(["highest","lowest"]);
          if(d===1){ const g=R.pick([1,2,14,15,16,17,18]); set=R.shuffle(pool.filter(x=>x[2]===g)).slice(0,R.int(3,4)); }
          else if(d===2){ const p=R.int(2,3); set=R.shuffle(pool.filter(x=>x[1]===p)).slice(0,R.int(4,5)); }
          else { const [a,b]=R.pick(ANOM); const per=at(a)[1]; const extra=R.shuffle(pool.filter(x=>x[1]===per&&x[0]!==a&&x[0]!==b)).slice(0,R.int(2,3)); set=R.shuffle([at(a),at(b),...extra]); }   /* same period only, so the trend and the dips decide it without data */
          if(set.map(x=>x[0]).sort().join()==="B,Be,C,N,O") continue;   /* the assignment's own set */
          const v=set.map(x=>IE[x[0]]); const sorted=[...v].sort((a,b)=>want==="highest"?b-a:a-b);
          best=set[v.indexOf(sorted[0])]; const second=set[v.indexOf(sorted[1])];
          ok=Math.abs(sorted[0]-sorted[1])>=25 || isAnomPair(best[0],second[0]);
        }
        const why=set.map(([s,p,g])=>`${s}: period ${p}, group ${g}, $IE(1) = ${IE[s]}$ kJ/mol (standard value).`);
        const anomalyHit=set.some(x=>set.some(y=>isAnomPair(x[0],y[0])&&x[1]===y[1]));
        return {prompt:`Which of these atoms has the <b>${want}</b> first ionization energy?`,
          answer:{type:"mc",options:set.map(x=>x[0]),correct:set.indexOf(best),why},
          hint:"IE(1) rises from left to right and falls down a group. Watch for the dips: group 2 to 13 and group 15 to 16 (pp. 11-13).",
          steps:["Trend: $IE(1)$ increases across a period and decreases down a group (p. 11).",anomalyHit?"This set includes a dip pair. Going from group 2 to 13 the electron comes from a higher-energy $p$ orbital; going from group 15 to 16 it is the first paired $p$ electron. Both are easier to remove.":"No dip pairs in this set, so the plain trends decide.",...why,`So the ${want} is ${best[0]}.`],
          answerTeX:best[0]};
      }},
    {id:"M3C5.g.dip", title:"Why does IE(1) drop here?", skill:"Explain the group 2 to 13 and 15 to 16 dips", ref:"pp. 12-13",
      gen(R,d){
        const pairs=d===1?[["Be","B"],["N","O"]]:d===2?[["Mg","Al"],["P","S"],["Be","B"],["N","O"]]:ANOM;
        const [a,b]=R.pick(pairs); const s1=["Be","Mg","Ca"].includes(a);
        const A=at(a), nshell=A[1];
        const options=[`The electron removed from ${b} is in a higher-energy $${nshell}p$ orbital than the $${nshell}s$ electron removed from ${a}.`,
          `The electron removed from ${b} is paired in a $${nshell}p$ orbital, so it feels extra repulsion (or less attraction) and is easier to remove.`,
          `${b} has a smaller nuclear charge than ${a}.`,
          `${b} is a larger atom than ${a} because it has more electrons.`,
          `${b} has fewer electrons in its outer shell than ${a}.`];
        const correct=s1?0:1;
        return {prompt:`${name(b)} is to the right of ${name(a).toLowerCase()} in period ${nshell}, yet its first ionization energy is lower. Which explanation matches the notes?`,
          answer:{type:"mc",options,correct,why:[s1?"Right: this is the group 2 to 13 explanation (p. 12).":`That is the group 2 to 13 reason. ${a} and ${b} are groups 15 and 16.`,s1?`That is the group 15 to 16 reason. ${a} and ${b} are groups 2 and 13.`:"Right: the drop starts once p orbitals are shared (pp. 12-13).",`${b} has one more proton than ${a}.`,"Radius decreases across a period.",`${b} has one more outer electron than ${a}.`]},
          hint:"Write both configurations and look at the electron that leaves each atom.",
          steps:[`${a}: $${CH.config(CH.Z(a),0,{short:true,tex:true})}$. ${b}: $${CH.config(CH.Z(b),0,{short:true,tex:true})}$.`,s1?`${a} loses an $${nshell}s$ electron; ${b} loses its single $${nshell}p$ electron, which is in a higher-energy orbital and easier to remove (p. 12).`:`${a} loses an unpaired $${nshell}p$ electron; ${b} loses one of a pair. Paired electrons are closer together on average, so they repel more and are easier to remove; or, seen the other way, unpaired electrons shield each other less and feel a larger effective nuclear charge (p. 12).`,s1?"":"The notes do not settle which picture is right; what to remember is that the drop comes once $p$ orbitals start to be shared (p. 13)."].filter(Boolean),
          answerTeX:options[correct]};
      }}
  ],
  exam:[
    {id:"M3C5.q1", ref:"p. 10", q:"Of Si, Cl, C, O and S, which has the biggest covalent radius?", opts:[["Si",true,"Period 3, and the farthest left of the period 3 options."],["Cl",false,"Same period as Si but farther right: smaller."],["C",false,"Period 2: one shell fewer than Si."],["O",false,"Period 2 and far right."],["S",false,"Same period as Si but to its right."]]},
    {id:"M3C5.q2", ref:"pp. 11-13", q:"Which period 3 atom has the highest first ionization energy among Mg, Al, Si, P and S?", opts:[["Mg",false,"Group 2 is low; IE rises across the period."],["Al",false,"Al is below Mg (the group 2 to 13 dip)."],["Si",false,"P is higher."],["P",true,"S is lower than P because S loses a paired $3p$ electron (the group 15 to 16 dip)."],["S",false,"The simple trend says S, but the dip after group 15 puts it just below P."]]},
    {id:"M3C5.q3", ref:"p. 11", q:"For magnesium, $IE(1) = 738$ and $IE(2) = 1451$ kJ mol⁻¹. Which statement is correct?", opts:[["$\\ce{Mg(g) -> Mg^2+(g) + 2e-}$ needs 2189 kJ mol⁻¹.",true,"The two steps add: $738 + 1451$ (p. 11)."],["$\\ce{Mg(g) -> Mg^2+(g) + 2e-}$ needs 1451 kJ mol⁻¹.",false,"That is only the second step."],["$IE(2)$ is larger because the second electron is farther from the nucleus.",false,"The second electron is removed from a positive ion, which holds it more tightly."],["$\\ce{Mg+(g) -> Mg^2+(g) + e-}$ releases 1451 kJ mol⁻¹.",false,"Ionization always takes in energy."],["$IE(1)$ and $IE(2)$ are the same because both electrons are $3s$.",false,"Each successive IE is larger: $IE(1) < IE(2)$."]]},
    {id:"M3C5.q4", ref:"p. 12", q:"Why is the first ionization energy of boron lower than that of beryllium?", opts:[["B's outer electron is in a $2p$ orbital, higher in energy than Be's $2s$.",true,"This is the notes' explanation (p. 12)."],["B has a smaller nuclear charge.",false,"B has 5 protons, Be has 4."],["B's electron is paired.",false,"B has one $2p$ electron, unpaired."],["B is a larger atom than Be.",false,"Radius decreases across the period."],["Be has a half-filled subshell.",false,"Be is $2s^2$: a full subshell. And the notes do not use half-filled stability as a reason."]]},
    {id:"M3C5.q5", ref:"p. 10", q:"The $\\ce{Br-Br}$ bond length is 228 pm. What is the covalent radius of bromine?", opts:[["114 pm",true,"Half the bond length."],["228 pm",false,"That is the whole bond."],["456 pm",false,"Divide, do not multiply."],["57 pm",false,"Half, not a quarter."],["0.228 pm",false,"228 pm is 0.228 nm."]]},
    {id:"M3C5.q6", ref:"p. 11", q:"Which statement about ionization energies is <b>false</b>?", opts:[["Ionization energies are always positive.",false,"True: removing an electron always takes energy."],["$IE(1)$ decreases down a group.",false,"True: the electron is in a higher shell, farther out."],["$IE(2)$ of an atom is larger than its $IE(1)$.",false,"True: $IE(1) < IE(2) < IE(3)$."],["Metals have negative ionization energies because they lose electrons easily.",true,"False. Easy to remove means small, but still positive."],["$IE(1)$ generally increases across a period.",false,"True, with the two dips."]]},
    {id:"M3C5.q7", ref:"pp. 10-11", multi:true, q:"Which properties increase going down group 1 from Li to Cs? Select all that apply.", opts:[["Atomic radius",true,"A new shell is added each period."],["First ionization energy",false,"It decreases: the outer electron is farther away."],["Principal quantum number of the outer electron",true,"From $2s$ for Li to $6s$ for Cs."],["Second ionization energy",false,"Like $IE(1)$, it decreases down the group."],["Nuclear charge",true,"$Z$ goes up from 3 to 55. The new, farther shells still make the atoms bigger."]]}
  ],
  steps:[
    {type:"read", title:"An atom's size depends on how you measure it", ref:"p. 10", body:"<p>An atom has no hard edge, and you cannot put a single atom under a ruler. So radius is defined from distances between nuclei, which can be measured:</p><div class=\"box def\"><b class=\"t\">Two radii (p. 10)</b><b>Covalent radius</b> of X: half the X to X bond length in an $\\mathrm{X_2}$ molecule.<br><b>Metallic radius</b>: half the distance between neighbouring nuclei in the solid metal.</div><p>Think of measuring the size of a cotton ball: the answer depends on how hard you squeeze. In the same way, the value depends on the atom's surroundings and on the method, so compare radii measured the same way.</p>"},
    {type:"try", title:"Covalent and metallic radii", gen:"M3C5.g.radius"},
    {type:"read", title:"Smaller across, bigger down", ref:"p. 10", body:"<ul><li><b>Across a period</b> (left to right) radius <b>decreases</b>. Each step adds a proton and an electron to the same shell. Electrons in one shell shield each other only partly, so the growing nuclear charge wins and pulls the whole shell in.</li><li><b>Down a group</b> radius <b>increases</b>. Each period starts a new shell, and a new shell has its electron density farther from the nucleus.</li></ul><p>On the graph on p. 10, each period starts with a tall peak at the group 1 metal and falls to the halogen. The alkali metals get bigger from Li to Cs, and so do the halogens from F to I.</p>"},
    {type:"explore", title:"See the radius pattern in 3D", fig:"radius", ref:"p. 10", body:"<p>Turn the table to look along a period: the bars fall from left to right. Look down a column: they grow. The transition metals in the middle stay roughly level.</p>"},
    {type:"try", title:"Largest or smallest atom", gen:"M3C5.g.size-order"},
    {type:"read", title:"Ionization energy: the price of removing an electron", ref:"p. 11", body:"<p>The <b>ionization energy</b> is the energy needed to remove an electron from a gas-phase atom. The notes use magnesium:</p><p>$$\\ce{Mg(g) -> Mg+(g) + e-}\\qquad IE(1) = 738\\ \\mathrm{kJ\\,mol^{-1}}$$ $$\\ce{Mg+(g) -> Mg^2+(g) + e-}\\qquad IE(2) = 1451\\ \\mathrm{kJ\\,mol^{-1}}$$ Adding the two steps: $\\ce{Mg(g) -> Mg^2+(g) + 2e-}$ needs $738 + 1451 = 2189$ kJ mol⁻¹.</p><p>Two facts follow. Removing an electron always costs energy, so every IE is positive. And each next electron is harder to remove, because it is pulled by an ion that is already positive: $IE(1) < IE(2) < IE(3) < \\cdots$</p>"},
    {type:"example", title:"Energy to make Mg²⁺ from a sample of Mg", ref:"p. 11", ex:{q:"How much energy is needed to convert 2.50 g of gas-phase Mg atoms into $\\ce{Mg^2+(g)}$ ions?", steps:[{t:"$n = \\dfrac{2.50\\ \\mathrm{g}}{24.31\\ \\mathrm{g\\,mol^{-1}}} = 0.10284\\ \\mathrm{mol}$",why:"Data-sheet molar mass. Keep extra digits until the end."},{t:"Per mole: $IE(1) + IE(2) = 738 + 1451 = 2189\\ \\mathrm{kJ\\,mol^{-1}}$",why:"Two electrons leave each atom, so both steps count (p. 11)."},{t:"$E = 0.10284\\ \\mathrm{mol} \\times 2189\\ \\mathrm{kJ\\,mol^{-1}} = 225.1\\ \\mathrm{kJ}$",why:"Energy per mole times moles."},{t:"Round to 3 significant figures: 225 kJ.",why:"2.50 g has 3 significant figures."}], ans:"225 kJ (energy taken in).", ref:"p. 11"}},
    {type:"try", title:"Energy to ionize magnesium", gen:"M3C5.g.mg"},
    {type:"read", title:"IE rises across a period and falls down a group", ref:"p. 11", body:"<ul><li><b>Down a group</b> $IE(1)$ <b>decreases</b>. The outer electron is in a higher $n$ orbital, higher in energy and farther out, so it comes off more easily.</li><li><b>Across a period</b> $IE(1)$ <b>generally increases</b>. The atoms shrink, so the outer electrons are closer to the nucleus and held more tightly.</li></ul><p>\"Generally\" matters. Along period 2 the values zig-zag: Be is above B, and N is above O. The same dips show up in period 3 (Mg above Al, P above S).</p>"},
    {type:"explore", title:"Trace IE(1) from H to Xe", fig:"ieplot", ref:"p. 11", body:"<p>Slide through period 2 (Z = 3 to 10) and find the two places where the line steps down. Then do period 3 (Z = 11 to 18). The pattern repeats.</p>"},
    {type:"read", title:"Why the two dips happen", ref:"pp. 12-13", body:"<p><b>Group 2 to 13</b> (Be to B, Mg to Al). Be is $[\\mathrm{He}]\\,2s^2$ and B is $[\\mathrm{He}]\\,2s^2\\,2p^1$. B's electron comes from $2p$, a higher-energy orbital than Be's $2s$, so it is easier to remove.</p><p><b>Group 15 to 16</b> (N to O). The notes reframe the question: O, F and Ne all have lower $IE(1)$ than you would expect by extending the rise from B to N. The common thread: B, C and N lose an <b>unpaired</b> $2p$ electron, while O, F and Ne lose a <b>paired</b> one. Two pictures explain it:</p><ul><li>Repulsion: two electrons in one orbital are closer together on average, so they repel more, which makes one easier to remove.</li><li>Attraction: unpaired electrons with parallel spins avoid each other, shield each other less, and feel a larger effective nuclear charge, which makes them harder to remove.</li></ul><p>The notes do not choose between them (an atom's energy is a balance of both, and four species are involved: N, N⁺, O and O⁺). What to remember: <b>the drop comes once the $2p$ orbitals start to be shared.</b></p>"},
    {type:"explore", title:"Find the dips in 3D", fig:"ie3d", ref:"pp. 11-13", body:"<p>Click N then O, and Be then B. Then look at the noble gases (tallest in each row) and the alkali metals (shortest).</p>"},
    {type:"mcq", title:"Nitrogen against oxygen", q:"Which statement explains why $IE(1)$ of N is higher than that of O?", opts:[["O loses a paired $2p$ electron; N loses an unpaired one.",true,"This is the key point on p. 13: the drop starts once $2p$ orbitals are shared."],["O has a smaller nuclear charge than N.",false,"O has 8 protons, N has 7."],["N has a half-filled subshell, which is specially stable.",false,"The notes do not use that idea; they call special stability a myth (p. 7)."],["O's outer electron is in a higher shell.",false,"Both lose a $2p$ electron."]]},
    {type:"try", title:"Highest or lowest IE(1)", gen:"M3C5.g.ie-order"},
    {type:"try", title:"Explain a dip", gen:"M3C5.g.dip"},
    {type:"formulas", title:"Rules and values to know"}
  ]
});
})();
