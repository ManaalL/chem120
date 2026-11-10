/* Chapter 4.4 (Mon Nov 2): Lattice energy and bond strength. Course notes Module 4, pp. 15-16 (sections 4.4 and 4.5).
   Coulomb potential energy, lattice energy (LiF, NaCl, ZnO), the Madelung estimate and why it overestimates; covalent bond length and
   bond energy table (p. 16), and how size, bond order and polarity change bond strength. */
(function(){
const M=C120;
const CH=M.chem, K=CH.CONST;
const EPS0=8.854e-12;                 /* C^2 J^-1 m^-1: standard value, not printed in the notes or on the data sheet */
const MAD=1.7476;                     /* NaCl structure, p. 15 */
/* ionic radii (pm). Li+, Na+, Zn2+, F-, Cl-, O2- are the p. 15 values; the rest are given in each question (standard values, not from the notes) */
const RAD={"Li+":68,"Na+":97,"K+":133,"Rb+":147,"Cs+":167,"Mg2+":66,"Ca2+":99,"Sr2+":112,"Ba2+":134,"Zn2+":74,"F-":136,"Cl-":181,"Br-":196,"I-":216,"O2-":140,"S2-":184};
const ionTeX=k=>{ const m=k.match(/^([A-Z][a-z]?)(\d?)([+-])$/); return `\\ce{${m[1]}^{${m[2]}${m[3]}}}`; };
const zOf=k=>{ const m=k.match(/(\d?)([+-])$/); return (m[2]==="-"?-1:1)*(m[1]?+m[1]:1); };
/* p. 16 */
const BL={"H-H":74,"H-C":110,"H-N":100,"H-O":97,"H-F":92,"H-S":132,"H-Cl":127,"H-Br":141,"H-I":161,"C-C":154,"C=C":134,"C#C":120,"C-N":147,"C=N":128,"C#N":116,"C-O":143,"C=O":120,"C-Cl":178,"N-N":145,"N=N":123,"N#N":110,"N-O":136,"N=O":120,"O-O":145,"O=O":121,"F-F":143,"Cl-Cl":199,"Br-Br":228,"I-I":266};
const BE={"H-H":436,"H-C":414,"H-N":389,"H-O":464,"H-F":565,"H-S":368,"H-Cl":431,"H-Br":364,"H-I":297,"C-C":347,"C=C":611,"C#C":837,"C-N":305,"C=N":615,"C#N":891,"C-O":360,"C=O":736,"C-Cl":339,"N-N":163,"N=N":418,"N#N":946,"N-O":222,"N=O":590,"O-O":142,"O=O":498,"F-F":159,"Cl-Cl":243,"Br-Br":193,"I-I":151};
const bTeX=k=>`\\ce{${k}}`;
const latt=(z,r)=>MAD*K.NA*z*K.e*K.e/(4*Math.PI*EPS0*r*1e-12)/1000;   /* kJ/mol, z = q1q2 in units of e */

M.chapter({
  id:"M4C4", module:"m4", n:4, num:"4.4", date:"2026-11-02", added:"2026-10-26", quiz:"PC6",
  title:"Lattice energy and bond strength", pages:"15-16", sections:["4.4","4.5"],
  summary:"Ions attract with an energy proportional to $q_1q_2/r$, so lattice energy grows with the ion charges and shrinks with the ion sizes. Covalent bonds get shorter and stronger with higher bond order and between smaller atoms.",
  flags:[
    {ref:"p. 15", text:"The lattice energies in the table are printed in kJ (LiF −1036, NaCl −781, ZnO −4059). They are molar quantities and should read kJ mol⁻¹; the notes' own formula on the same page includes $N_A$ so that $\\Delta H_{\\text{lattice}}$ comes out in J mol⁻¹."},
    {ref:"p. 16", text:"Observation 4 says a double bond is not twice as strong as a single bond. That is true for C–C (C=C 611 < 2 × 347 = 694 kJ mol⁻¹), but the same table shows the opposite for N=N (418 > 2 × 163 = 326), O=O (498 > 2 × 142 = 284), N=O (590 > 2 × 222 = 444), C=O (736 > 2 × 360 = 720) and C=N (615 > 2 × 305 = 610). It holds for carbon–carbon bonds, not in general."}
  ],
  formulas:[
    {id:"M4C4.f.coulomb", name:"Potential energy of two charges", tex:"PE = \\dfrac{q_1 q_2}{4\\pi\\varepsilon_0 r}", ref:"p. 15",
      note:"$q_1, q_2$ in C; $r$ in m (distance between the centres); PE in J. Opposite charges give a negative PE: attraction.",
      blank:{tex:"PE = \\dfrac{q_1 q_2}{4\\pi\\varepsilon_0\\,\\boxed{\\,?\\,}}", accept:["r","distance","the distance"]}},
    {id:"M4C4.f.lattice-def", name:"Lattice energy", tex:"\\text{energy released when gas-phase ions combine to form an ionic solid}", kind:"rule", ref:"p. 15",
      note:"Written as $\\ce{Na+(g) + Cl-(g) -> NaCl(s)}$, $\\Delta H_{\\text{lattice}} = -781$ kJ mol⁻¹."},
    {id:"M4C4.f.lattice-est", name:"Coulomb estimate of the lattice energy", tex:"\\Delta H_{\\text{lattice}} \\approx \\dfrac{A\\,N_A\\,q_1 q_2}{4\\pi\\varepsilon_0 r_0}, \\quad r_0 = r_+ + r_-", ref:"p. 15",
      note:"$A$ = Madelung constant (packing of the ions). Counts only attractions and repulsions between charges, not the repulsion between electron clouds, so it overestimates the real value.",
      blank:{tex:"r_0 = \\boxed{\\,?\\,}", accept:["r+ + r-","r_+ + r_-","r+ + r−","r++r-","sum of the ionic radii","the sum of the ionic radii"]}},
    {id:"M4C4.f.madelung", name:"Madelung constant, NaCl structure", tex:"A = 1.7476", kind:"constant", ref:"p. 15"},
    {id:"M4C4.f.eps0", name:"Vacuum permittivity", tex:"\\varepsilon_0 = 8.854\\times10^{-12}\\ \\mathrm{C^2\\,J^{-1}\\,m^{-1}}", kind:"constant", ref:"not from the notes", note:"The notes use $\\varepsilon_0$ but print no value, and it is not on the data sheet. Standard value."},
    {id:"M4C4.f.e", name:"Elementary charge", tex:"e = 1.602\\times10^{-19}\\ \\mathrm{C}", kind:"constant", ref:"data sheet", note:"An ion with charge $z$ carries $q = ze$."},
    {id:"M4C4.f.lattice-trend", name:"Lattice energy trends", tex:"\\text{larger ion charges} \\Rightarrow \\text{larger lattice energy};\\quad \\text{smaller ions} \\Rightarrow \\text{larger lattice energy}", kind:"rule", ref:"p. 15"},
    {id:"M4C4.f.bond-strength", name:"What sets covalent bond strength", tex:"\\text{size of the atoms, bond order, polarity}", kind:"rule", ref:"p. 16",
      note:"Small atoms form short, strong bonds. Higher bond order: shorter and stronger. Polar bonds are often stronger (p. 19)."},
    {id:"M4C4.f.typical", name:"Typical covalent bonds", tex:"100\\text{ to }200\\ \\mathrm{pm};\\quad \\text{a few hundred kJ mol}^{-1}", kind:"rule", ref:"p. 16"}
  ],
  glossary:[
    {id:"M4C4.t.lattice-energy", term:"Lattice energy", def:"The energy released when gas-phase ions come together to form an ionic solid. A larger value means a more stable ionic compound.", ref:"p. 15"},
    {id:"M4C4.t.ionic-radius", term:"Ionic radius", def:"The size of an ion. Neighbouring ions touch, so the distance between their centres is $r_+ + r_-$.", ref:"p. 15"},
    {id:"M4C4.t.madelung", term:"Madelung constant", def:"A number, $A$, that accounts for how the ions are packed in a crystal (all the neighbours, not just one pair). $A = 1.7476$ for the NaCl structure.", ref:"p. 15"},
    {id:"M4C4.t.born-haber", term:"Born–Haber cycle", def:"A Hess's-law route for finding lattice energies from other thermochemical data. Named in the notes but not worked through.", ref:"p. 15"},
    {id:"M4C4.t.bde", term:"Bond dissociation energy", def:"The energy needed to break a particular covalent bond, in kJ mol⁻¹. Usually a few hundred kJ mol⁻¹.", ref:"p. 16"},
    {id:"M4C4.t.bond-length", term:"Bond length", def:"The distance between the nuclei of two bonded atoms. Covalent bonds are typically 100 to 200 pm.", ref:"p. 16"}
  ],
  figures:{
    lattice:{title:"Ions in a lattice", cap:"Rock-salt lattices built from the ionic radii on p. 15. The nearest-neighbour distance is $r_+ + r_-$. Compare the three and check the Coulomb estimate against the notes' lattice energies.", ref:"p. 15",
      model:{type:"lattice", params:{pair:"NaCl", pairs:["LiF","NaCl","ZnO"]}},
      predict:{q:"Which of LiF, NaCl and ZnO has the largest lattice energy?", opts:[["LiF",false,"Small ions (204 pm apart), but only charges of $\\pm1$."],["NaCl",false,"The largest distance (278 pm) and charges of $\\pm1$: the smallest of the three."],["ZnO",true,"Charges of $+2$ and $-2$ make $q_1q_2$ four times larger, and the ions are small (214 pm). $-4059$ kJ mol⁻¹ (p. 15)."]], check:"Switch between the three and compare the charges and the distance between neighbouring ions."}},
    coulomb:{title:"The Coulomb estimate", cap:"Lattice energy from $\\Delta H \\approx A N_A q_1q_2/(4\\pi\\varepsilon_0 r_0)$ with $A = 1.7476$, plotted against $r_0$ for charge products 1 and 4. Open circles: the notes' values for LiF, NaCl and ZnO (p. 15). Every estimate is larger than the real value because the formula leaves out the repulsion between electron clouds. ($\\varepsilon_0$ is a standard value, not from the notes.)", ref:"p. 15",
      build(host,{PLOT,M}){
        const G=PLOT.graph(host,{x:[150,350],y:[0,6000],xstep:50,ystep:1000,xlabel:"r₀ / pm",ylabel:"|ΔH| / kJ mol⁻¹",h:320});
        G.fn(r=>latt(1,r),{cls:"cv"}); G.fn(r=>latt(4,r),{cls:"cv c"});
        G.label(330,latt(1,330)+260,"q₁q₂ = 1",{anchor:"end"}); G.label(330,latt(4,330)+260,"q₁q₂ = 4",{anchor:"end",cls:"lblc"});
        const DATA=[["LiF",1,204,1036],["NaCl",1,278,781],["ZnO",4,214,4059]];
        DATA.forEach(([n,z,r,v])=>{ G.open(r,v); G.label(r,v,n,{dx:8,dy:16}); });
        let z=1, r=278; const dot=G.dot(r,latt(z,r));
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Charges",items:[[1,"+1 / −1"],[4,"+2 / −2"]],value:1,onchange:v=>{ z=+v; draw(); }});
        PLOT.slider(ctl,{label:"r₀ = r₊ + r₋ (pm)",min:160,max:340,value:r,oninput:v=>{ r=v; draw(); }});
        const out=PLOT.readout(host);
        function draw(){ const est=latt(z,r); dot.set(r,est); const m=DATA.find(d=>d[1]===z&&d[2]===r);
          out.innerHTML=M.rich(`Estimate: $\\Delta H \\approx -${est.toFixed(0)}$ kJ mol⁻¹${m?` · notes (${m[0]}): $-${m[3]}$ kJ mol⁻¹, so the estimate is ${((est/m[3]-1)*100).toFixed(0)}% too large`:""}. Try $r_0$ = 204, 278 and 214 pm.`); }
        draw();
      }},
    bars:{title:"Is a double bond twice a single bond?", cap:"Bond energies from the p. 16 table. The dashed outlines are 2 × and 3 × the single-bond energy. For C–C the double and triple bonds fall short of them; for N–N and O–O they go past.", ref:"p. 16",
      build(host,{PLOT,M}){
        const PAIRS=[["C","C"],["C","N"],["C","O"],["N","N"],["N","O"],["O","O"]];
        let k=0; const svgHost=document.createElement("div"); host.append(svgHost);
        const ctl=PLOT.controls(host); PLOT.seg(ctl,{label:"Bond",items:PAIRS.map((p,i)=>[i,`${p[0]}–${p[1]}`]),value:0,onchange:v=>{ k=+v; draw(); }});
        const out=PLOT.readout(host);
        function draw(){
          const [a,b]=PAIRS[k]; const s=BE[`${a}-${b}`], d=BE[`${a}=${b}`], t=BE[`${a}#${b}`];
          const W=600,H=240,base=200,sc=170/1100; const bars=[["single",s,1],["double",d,2]]; if(t) bars.push(["triple",t,3]);
          let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${a}–${b} bond energies">`;
          g+=`<line x1="40" y1="${base}" x2="${W-20}" y2="${base}" class="ax"/>`;
          [0,250,500,750,1000].forEach(v=>{ g+=`<line x1="36" y1="${base-v*sc}" x2="${W-20}" y2="${base-v*sc}" class="gr"/><text x="32" y="${base-v*sc+4}" text-anchor="end">${v}</text>`; });
          bars.forEach(([lab,v,n],i)=>{ const x=80+i*170, w=90;
            if(n>1) g+=`<rect x="${x}" y="${base-n*s*sc}" width="${w}" height="${n*s*sc}" style="fill:none;stroke:var(--fig-axis);stroke-dasharray:5 4"/><text x="${x+w+4}" y="${base-n*s*sc+4}">${n} × single = ${n*s}</text>`;
            g+=`<rect x="${x+10}" y="${base-v*sc}" width="${w-20}" height="${v*sc}" style="fill:var(--c,var(--accent));fill-opacity:.75"/>`;
            g+=`<text x="${x+w/2}" y="${base-v*sc-6}" text-anchor="middle" class="lbl">${v}</text><text x="${x+w/2}" y="${base+16}" text-anchor="middle">${lab}</text>`; });
          g+=`<text x="44" y="16">kJ mol⁻¹</text>`;
          svgHost.innerHTML=g+`</svg>`;
          const r2=d/s; out.innerHTML=M.rich(`${a}=${b} ÷ ${a}–${b} $= ${d}/${s} = ${r2.toFixed(2)}$: the double bond is <b>${r2>2?"more":"less"} than twice</b> as strong.${t?` Triple ÷ single $= ${(t/s).toFixed(2)}$.`:""}`);
        }
        draw();
      }},
    lengths:{title:"Single, double and triple bonds in one molecule", cap:"But-1-en-3-yne, $\\ce{CH2=CH-C#CH}$ (not in the notes), has a C=C, a C–C and a $\\ce{C#C}$ side by side. The model uses the p. 16 bond lengths: 134, 154 and 120 pm.", ref:"p. 16",
      model:{type:"molecule", params:{molecule:"vinylacetylene", choices:["vinylacetylene","H2","HCl","Cl2"], polarity:false, fcToggle:false, cam:[0.3,0.4,5]}},
      predict:{q:"Rank the three carbon–carbon bonds in $\\ce{CH2=CH-C#CH}$ from shortest to longest.", opts:[["$\\ce{C#C}$ < C=C < C–C",true,"Higher bond order, shorter bond: 120, 134, 154 pm (p. 16)."],["C–C < C=C < $\\ce{C#C}$",false,"Reversed: more shared pairs pull the atoms closer."],["All three are the same length",false,"The table gives 154, 134 and 120 pm."],["C=C < $\\ce{C#C}$ < C–C",false,"The triple bond is the shortest."]], check:"Look down on the flat chain and compare the three C–C distances. Then pick $\\ce{H2}$ and $\\ce{Cl2}$ (74 and 199 pm)."}}
  },
  gens:[
    {id:"M4C4.g.ion-pair-pe", title:"Potential energy of one ion pair", skill:"$PE = q_1q_2/(4\\pi\\varepsilon_0 r)$", ref:"p. 15",
      gen(R,d){
        const CAT=d===1?["Li+","Na+","K+"]:["Li+","Na+","K+","Mg2+","Ca2+","Sr2+","Ba2+","Zn2+"], AN=d===1?["F-","Cl-","Br-"]:["F-","Cl-","Br-","I-","O2-","S2-"];
        const c=R.pick(CAT), a=R.pick(AN); const z1=zOf(c), z2=zOf(a);
        const rc=RAD[c], ra=RAD[a], r=rc+ra;
        const q1=z1*K.e, q2=z2*K.e; const pe=q1*q2/(4*Math.PI*EPS0*r*1e-12);
        const kC=1/(4*Math.PI*EPS0);
        return {prompt:`A $${ionTeX(c)}$ ion (radius ${rc} pm) touches a $${ionTeX(a)}$ ion (radius ${ra} pm). What is the potential energy of this one pair? Use $e = 1.602\\times10^{-19}$ C and $\\varepsilon_0 = 8.854\\times10^{-12}\\ \\mathrm{C^2\\,J^{-1}\\,m^{-1}}$ (standard value, not from the notes).`,
          answer:{type:"num",value:pe,unit:"J",sf:3},
          hint:"Touching ions: r = r₊ + r₋, converted to metres. Each charge is (ion charge) × e. Opposite charges give a negative PE.",
          steps:[`$r = ${rc} + ${ra} = ${r}\\ \\mathrm{pm} = ${r}\\times10^{-12}\\ \\mathrm{m}$`,`$q_1 = ${z1}e = ${M.numTeX(q1,4)}$ C, $\\ q_2 = ${z2}e = ${M.numTeX(q2,4)}$ C`,`$PE = \\dfrac{(${M.numTeX(q1,4)})(${M.numTeX(q2,4)})}{4\\pi(8.854\\times10^{-12})(${r}\\times10^{-12})}$`,`$PE = ${M.qty(pe,3,"J")}$ (negative: the ions attract)`],
          answerTeX:`$${M.qty(pe,3,"J")}$`, verify:{value:kC*z1*z2*K.e*K.e/(r*1e-12)}};
      }},
    {id:"M4C4.g.lattice-estimate", title:"Estimate a lattice energy", skill:"$\\Delta H \\approx A N_A q_1q_2/(4\\pi\\varepsilon_0 r_0)$", ref:"p. 15",
      gen(R,d){
        const POOL={1:[["LiF","Li+","F-"],["NaCl","Na+","Cl-"],["KCl","K+","Cl-"],["NaF","Na+","F-"],["KBr","K+","Br-"]],
                    2:[["LiCl","Li+","Cl-"],["NaBr","Na+","Br-"],["KI","K+","I-"],["RbCl","Rb+","Cl-"],["MgO","Mg2+","O2-"],["CaO","Ca2+","O2-"]],
                    3:[["SrO","Sr2+","O2-"],["BaO","Ba2+","O2-"],["CaS","Ca2+","S2-"],["MgS","Mg2+","S2-"],["NaI","Na+","I-"],["KF","K+","F-"]]};
        const [f,c,a]=R.pick(POOL[d]); const z=zOf(c)*zOf(a); const r0=RAD[c]+RAD[a];
        const val=-latt(-z,r0);
        const ref=-latt(1,278);   /* NaCl at 278 pm, then scale by charge and distance */
        return {prompt:`$\\ce{${f}}$ has the NaCl structure ($A = 1.7476$). Its ions have radii ${RAD[c]} pm ($${ionTeX(c)}$) and ${RAD[a]} pm ($${ionTeX(a)}$). Estimate $\\Delta H_{\\text{lattice}}$ in kJ mol⁻¹ with the Coulomb formula. Use $\\varepsilon_0 = 8.854\\times10^{-12}\\ \\mathrm{C^2\\,J^{-1}\\,m^{-1}}$ (not from the notes) and the data-sheet $e$ and $N_A$.`,
          answer:{type:"num",value:val,unit:"kJ/mol",sf:Math.abs(val)<1000?3:undefined},   /* MC.fmtSig can't write 4-digit values to 3 s.f., so no sig-fig check above 1000 */
          hint:"r₀ = r₊ + r₋ in metres; q₁q₂ = (z₊e)(z₋e). Multiply by A and N_A, divide by 4πε₀r₀, then convert J/mol to kJ/mol. Energy is released, so ΔH is negative.",
          steps:[`$r_0 = ${RAD[c]} + ${RAD[a]} = ${r0}\\ \\mathrm{pm} = ${r0}\\times10^{-12}$ m`,`$q_1q_2 = (${zOf(c)})(${zOf(a)})e^2 = ${z}(1.602\\times10^{-19})^2 = ${M.numTeX(z*K.e*K.e,4)}\\ \\mathrm{C^2}$`,`$\\Delta H \\approx \\dfrac{(1.7476)(6.022\\times10^{23})(${M.numTeX(z*K.e*K.e,4)})}{4\\pi(8.854\\times10^{-12})(${r0}\\times10^{-12})} = ${M.numTeX(val*1000,4)}\\ \\mathrm{J\\,mol^{-1}}$`,`$= ${M.qty(val,3,"kJ/mol")}$`,`The real value is smaller in size: the formula ignores the repulsion between the ions' electron clouds (p. 15).`],
          answerTeX:`$${M.qty(val,3,"kJ/mol")}$`, verify:{value:ref*(-z)*278/r0}};
      }},
    {id:"M4C4.g.rank-lattice", title:"Which has the largest lattice energy?", skill:"Charge first, then size", ref:"p. 15",
      gen(R,d){
        const SETS={1:[["LiF","NaF","KF","RbF"],["NaF","NaCl","NaBr","NaI"],["LiCl","NaCl","KCl","RbCl"],["KF","KCl","KBr","KI"],["MgO","CaO","SrO","BaO"]],
                    2:[["NaCl","MgO","KBr","LiF"],["CaO","NaF","KCl","CsI"],["NaCl","MgCl2","MgO","KCl"],["ZnO","LiF","NaCl","KBr"],["BaO","KF","NaBr","LiCl"]],
                    3:[["MgO","CaO","BaO","NaF"],["CaS","CaO","KCl","SrO"],["BaO","CaO","SrO","KF"],["MgS","MgO","CaS","NaCl"],["SrS","SrO","BaO","RbF"]]};
        const ION={Li:"Li+",Na:"Na+",K:"K+",Rb:"Rb+",Cs:"Cs+",Mg:"Mg2+",Ca:"Ca2+",Sr:"Sr2+",Ba:"Ba2+",Zn:"Zn2+",F:"F-",Cl:"Cl-",Br:"Br-",I:"I-",O:"O2-",S:"S2-"};
        const parse=f=>{ const m=f.match(/^([A-Z][a-z]?)([A-Z][a-z]?)(\d?)$/); return [ION[m[1]],ION[m[2]]]; };
        const score=f=>{ const [c,a]=parse(f); return Math.abs(zOf(c)*zOf(a))/(RAD[c]+RAD[a]); };
        const set=R.pick(SETS[d]); const best=set.reduce((b,f)=>score(f)>score(b)?f:b,set[0]);
        const order=R.shuffle(set);
        const why=f=>{ const [c,a]=parse(f); return `$${ionTeX(c)}$ and $${ionTeX(a)}$: charges ${zOf(c)} and ${zOf(a)}${f===best?", the best combination of high charge and small ions.":"."}`; };
        const [bc,ba]=parse(best);
        return {prompt:"Which of these ionic compounds has the largest lattice energy (the most energy released)?",
          answer:{type:"mc",options:order.map(f=>`$\\ce{${f}}$`),correct:order.indexOf(best),why:order.map(why)},
          hint:"Charges matter most: compare the product of the ion charges first. If those tie, the compound with the smaller ions (closer together) wins. Ions get bigger going down a group.",
          steps:[`Compare charge products: ${set.map(f=>{ const [c,a]=parse(f); return `$\\ce{${f}}$: ${Math.abs(zOf(c)*zOf(a))}`; }).join(", ")}.`,`Among the highest, compare sizes (smaller ions sit closer, so $r$ is smaller).`,`Largest: $\\ce{${best}}$ ($${ionTeX(bc)}$ and $${ionTeX(ba)}$).`],
          answerTeX:`$\\ce{${best}}$`};
      }},
    {id:"M4C4.g.compare-bonds", title:"Strongest, weakest, shortest, longest", skill:"Size and bond order (p. 16)", ref:"p. 16",
      gen(R,d){
        const SETS={1:[["C-C","C=C","C#C"],["N-N","N=N","N#N"],["C-O","C=O"],["N-O","N=O"],["C-N","C=N","C#N"]],
                    2:[["H-F","H-Cl","H-Br","H-I"],["H-H","Cl-Cl","Br-Br","I-I"],["H-C","H-N","H-O","H-F"],["C-C","C-N","C-O","C-Cl"]],
                    3:[["C#N","C=O","N#N","C=C"],["O-O","N-N","C-C","H-H"],["C=C","N=N","O=O","C=O"],["H-I","C-Cl","Cl-Cl","H-Br"]]};
        const Q=[["the strongest",(a,b)=>BE[a]>BE[b],BE,"kJ mol⁻¹"],["the weakest",(a,b)=>BE[a]<BE[b],BE,"kJ mol⁻¹"],["the shortest",(a,b)=>BL[a]<BL[b],BL,"pm"],["the longest",(a,b)=>BL[a]>BL[b],BL,"pm"]];
        let set,q,best,tries=0;
        do{ set=R.pick(SETS[d]); q=R.pick(Q); best=set.reduce((b,x)=>q[1](x,b)?x:b,set[0]); tries++; }
        while(tries<20 && set.filter(x=>q[2][x]===q[2][best]).length>1);
        const order=R.shuffle(set);
        return {prompt:`Which bond is ${q[0]}?`,
          answer:{type:"mc",options:order.map(x=>`$${bTeX(x)}$`),correct:order.indexOf(best),why:order.map(x=>`${q[2][x]} ${q[3]} (p. 16).`)},
          hint:"Higher bond order: shorter and stronger. Smaller atoms: shorter and usually stronger bonds. Then check the p. 16 table.",
          steps:[...set.map(x=>`$${bTeX(x)}$: ${BL[x]} pm, ${BE[x]} kJ mol⁻¹`),`${q[0][0].toUpperCase()+q[0].slice(1)}: $${bTeX(best)}$.`],
          answerTeX:`$${bTeX(best)}$`};
      }},
    {id:"M4C4.g.bond-energy-use", title:"Energy to break bonds", skill:"Bond energies with moles and molecules", ref:"p. 16",
      gen(R,d){
        if(d===1){
          const P=[["H2","H-H"],["Cl2","Cl-Cl"],["N2","N#N"],["O2","O=O"],["HF","H-F"],["HCl","H-Cl"],["Br2","Br-Br"],["I2","I-I"]];
          const [f,b]=R.pick(P); const per=BE[b]*1000/K.NA;
          return {prompt:`Using the p. 16 table, how much energy (in J) does it take to break one $${bTeX(b)}$ bond in a single $\\ce{${f}}$ molecule?`,
            answer:{type:"num",value:per,unit:"J",sf:3},
            hint:"The table is per mole of bonds. Convert kJ to J and divide by Avogadro's number.",
            steps:[`$${bTeX(b)}$: ${BE[b]} kJ mol⁻¹ $= ${BE[b]}\\times10^{3}$ J mol⁻¹`,`$\\dfrac{${BE[b]}\\times10^{3}}{6.022\\times10^{23}} = ${M.qty(per,3,"J")}$`],
            answerTeX:`$${M.qty(per,3,"J")}$`, verify:{value:BE[b]/(K.NA/1000)}};
        }
        const P=d===2?[["H2",[["H-H",1]]],["Cl2",[["Cl-Cl",1]]],["N2",[["N#N",1]]],["O2",[["O=O",1]]],["F2",[["F-F",1]]],["HBr",[["H-Br",1]]]]
                     :[["CH4",[["H-C",4]]],["NH3",[["H-N",3]]],["H2O",[["H-O",2]]],["C2H6",[["C-C",1],["H-C",6]]],["CH3OH",[["H-C",3],["C-O",1],["H-O",1]]],["HCN",[["H-C",1],["C#N",1]]]];
        const [f,bonds]=R.pick(P); const m=R.sig(d===2?1:2,d===2?20:50,3); const MM=CH.mm(f); const n=m/MM;
        const perMol=bonds.reduce((t,[b,k])=>t+k*BE[b],0); const E=n*perMol;
        return {prompt:`Using the p. 16 table, how much energy is needed to break every bond in ${M.toSig(m,3)} g of $\\ce{${f}}$ (as separate gas molecules)?`,
          answer:{type:"num",value:E,unit:"kJ",sf:Math.abs(E)<1000?3:undefined},
          hint:"Find moles from the data-sheet molar mass. Add up the bond energies for one mole of molecules (count every bond), then multiply.",
          steps:[`$M(\\ce{${f}}) = ${CH.mmWork(f)}$`,`$n = ${M.toSig(m,3)}/${MM.toFixed(2)} = ${M.numTeX(n,4)}$ mol`,`Bonds per molecule: ${bonds.map(([b,k])=>`${k} × $${bTeX(b)}$ (${BE[b]})`).join(" + ")} $= ${perMol}$ kJ mol⁻¹`,`$E = ${M.numTeX(n,4)} \\times ${perMol} = ${M.qty(E,3,"kJ")}$`],
          answerTeX:`$${M.qty(E,3,"kJ")}$`, verify:{value:perMol*m/MM}};
      }},
    {id:"M4C4.g.double-vs-single", title:"Is a double bond twice a single bond?", skill:"Read the p. 16 table critically", ref:"p. 16",
      gen(R,d){
        const P=d===3?[["C","C",3],["N","N",3],["C","N",3]]:[["C","C",2],["C","N",2],["C","O",2],["N","N",2],["N","O",2],["O","O",2]];
        const [a,b,n]=R.pick(P); const s=BE[`${a}-${b}`], m=BE[`${a}${n===2?"=":"#"}${b}`]; const ratio=m/s; const more=ratio>n;
        const sym=n===2?"=":"#"; const name=n===2?"double":"triple"; const times=n===2?"twice":"three times";
        return {prompt:`From the p. 16 table, find the ratio of the $${bTeX(`${a}${sym}${b}`)}$ bond energy to the $${bTeX(`${a}-${b}`)}$ bond energy. Is the ${name} bond more or less than ${times} as strong as the single bond?`,
          parts:[{label:"Ratio",answer:{type:"num",value:ratio,sf:3}},{label:"Compared with the single bond",answer:{type:"mc",options:[`More than ${times} as strong`,`Less than ${times} as strong`],correct:more?0:1,keep:true}}],
          hint:"Divide the multiple-bond energy by the single-bond energy and compare with 2 (double) or 3 (triple).",
          steps:[`$${bTeX(`${a}${sym}${b}`)}$: ${m} kJ mol⁻¹; $${bTeX(`${a}-${b}`)}$: ${s} kJ mol⁻¹`,`Ratio $= ${m}/${s} = ${M.toSig(ratio,3)}$`,`$${M.toSig(ratio,3)}$ is ${more?"greater":"less"} than ${n}: ${more?"more":"less"} than ${times} as strong.`,more?"The notes' remark on p. 16 holds for C–C but not for this pair (see the flag for this chapter).":"This agrees with the remark on p. 16."],
          answerTeX:`${M.toSig(ratio,3)}: ${more?"more":"less"} than ${times}`, verify:{value:m/s}};
      }}
  ],
  exam:[
    {id:"M4C4.q1", ref:"p. 15", q:"Which compound has the largest lattice energy?", opts:[["LiF",false,"Small ions, but charges of only $\\pm1$."],["NaCl",false,"Charges of $\\pm1$ and the largest distance of the three in the notes."],["ZnO",true,"Charges of $\\pm2$ give $q_1q_2 = -4$, and the ions are small: $-4059$ kJ mol⁻¹."],["KBr",false,"Charges of $\\pm1$ and large ions."],["CsI",false,"Charges of $\\pm1$ and very large ions: among the smallest lattice energies."]]},
    {id:"M4C4.q2", ref:"p. 15", q:"Which process does the lattice energy describe?", opts:[["$\\ce{Na(s) + 1/2Cl2(g) -> NaCl(s)}$",false,"That is forming the solid from its elements."],["$\\ce{Na+(g) + Cl-(g) -> NaCl(s)}$",true,"Gas-phase ions combining into the ionic solid (p. 15)."],["$\\ce{NaCl(s) -> Na(s) + 1/2Cl2(g)}$",false,"That is decomposition into the elements."],["$\\ce{Na(g) -> Na+(g) + e-}$",false,"That is ionization (Module 3)."],["$\\ce{NaCl(s) -> NaCl(l)}$",false,"That is melting."]]},
    {id:"M4C4.q3", ref:"p. 15", q:"Why does $\\Delta H_{\\text{lattice}} \\approx A N_A q_1q_2/(4\\pi\\varepsilon_0 r_0)$ overestimate the real lattice energy?", opts:[["It ignores the repulsion between the electron clouds of neighbouring ions.",true,"Even oppositely charged ions repel a little once their electron clouds overlap (p. 15)."],["It counts only one pair of ions.",false,"The Madelung constant $A$ already accounts for all the neighbours."],["It uses the wrong sign for the charges.",false,"The signs are right: opposite charges give a negative energy."],["Ionic radii are always too large.",false,"The radii are measured values."],["It leaves out Avogadro's number.",false,"$N_A$ is in the formula, which is why it gives J mol⁻¹."]]},
    {id:"M4C4.q4", ref:"p. 15", multi:true, q:"Which changes make the lattice energy of an ionic compound larger? Select all that apply.", opts:[["Larger charges on the ions",true,"$q_1q_2$ grows."],["Smaller ionic radii",true,"$r_0$ shrinks, so the attraction is stronger."],["Larger ionic radii",false,"Farther apart means weaker attraction."],["Moving the cation down its group",false,"The cation gets bigger, so the lattice energy drops."]]},
    {id:"M4C4.q5", ref:"p. 16", q:"Which statement agrees with the bond table on p. 16?", opts:[["A C≡C bond is longer than a C–C bond.",false,"120 pm vs 154 pm: the triple bond is shorter."],["As bond order increases, bonds get shorter and stronger.",true,"C–C 154 pm, 347 kJ; C=C 134 pm, 611 kJ; C≡C 120 pm, 837 kJ."],["Every double bond in the table is less than twice as strong as the matching single bond.",false,"N=N (418) is more than twice N–N (163). See this chapter's flag."],["Covalent bonds are typically 1 to 2 pm long.",false,"Typically 100 to 200 pm."],["Bond energies are typically a few kJ mol⁻¹.",false,"A few hundred kJ mol⁻¹."]]},
    {id:"M4C4.q6", ref:"p. 16", q:"$\\ce{H2}$ has a bond of 74 pm and 436 kJ mol⁻¹; $\\ce{Cl2}$ has 199 pm and 243 kJ mol⁻¹. What does the comparison show?", opts:[["Small atoms form short, strong bonds.",true,"Observation 3 on p. 16."],["Large atoms form short, strong bonds.",false,"Cl is larger, and its bond is longer and weaker."],["Bond length doesn't affect bond strength.",false,"The shorter bond here is the stronger one."],["H–H is a double bond.",false,"H forms only one bond."],["Cl–Cl is polar.",false,"Two identical atoms: no polarity."]]},
    {id:"M4C4.q7", ref:"p. 16", q:"Which pair from the p. 16 table has a double-bond energy MORE than twice its single-bond energy?", opts:[["C–C / C=C",false,"611 < 694: less than twice."],["N–N / N=N",true,"418 > 326. The notes' remark that double bonds are not twice as strong holds for C–C, not here."],["Both C–C and N–N",false,"C=C is less than twice C–C."],["Neither",false,"Check N–N: 163 × 2 = 326, and N=N is 418."],["None of the table's pairs can be compared",false,"Six single/double pairs are in the table."]]}
  ],
  steps:[
    {type:"read", title:"Opposite charges attract: Coulomb's law", ref:"p. 15", body:"<p>An ionic bond is the pull between a cation and an anion. The energy of two charges $q_1$ and $q_2$ a distance $r$ apart is $$PE = \\frac{q_1q_2}{4\\pi\\varepsilon_0 r}$$ For opposite charges $q_1q_2$ is negative, so $PE$ is negative: energy is released as the ions come together.</p><p>Like two magnets, the pull is stronger when the magnets are stronger (bigger charges) and when they are closer (smaller $r$). Touching ions sit $r_+ + r_-$ apart, the sum of their radii.</p><p>Charges are in coulombs: an ion with charge $z$ carries $q = ze$, with $e = 1.602\\times10^{-19}$ C (data sheet). The notes don't print $\\varepsilon_0$; the standard value is $8.854\\times10^{-12}\\ \\mathrm{C^2\\,J^{-1}\\,m^{-1}}$ (not from the notes).</p>"},
    {type:"try", title:"Energy of one ion pair", gen:"M4C4.g.ion-pair-pe"},
    {type:"read", title:"Lattice energy", ref:"p. 15", body:"<div class=\"box def\"><b class=\"t\">Lattice energy (p. 15)</b>The energy released when gas-phase ions combine to form an ionic solid.</div><table class=\"cn-table\"><tr><th>Reaction</th><th>$\\Delta H_{\\text{lattice}}$ (kJ mol⁻¹)</th><th>$r_+$, $r_-$ (pm)</th><th>$q_1q_2$ (units of $e^2$)</th><th>$r_+ + r_-$ (pm)</th></tr><tr><td>$\\ce{Li+(g) + F-(g) -> LiF(s)}$</td><td>−1036</td><td>68, 136</td><td>−1</td><td>204</td></tr><tr><td>$\\ce{Na+(g) + Cl-(g) -> NaCl(s)}$</td><td>−781</td><td>97, 181</td><td>−1</td><td>278</td></tr><tr><td>$\\ce{Zn^2+(g) + O^2-(g) -> ZnO(s)}$</td><td>−4059</td><td>74, 140</td><td>−4</td><td>214</td></tr></table><p>Two trends (p. 15): <b>the greater the charges, the greater the lattice energy; the smaller the ions, the greater the lattice energy.</b> Charge wins by a mile: ZnO's charges multiply to 4, and its lattice energy is about four times LiF's. Strong lattices are why ionic solids melt at high temperatures.</p><p>(The notes print these values in kJ; they are per mole, kJ mol⁻¹. See the flag.)</p>"},
    {type:"explore", title:"Three lattices side by side", fig:"lattice", ref:"p. 15", body:"<p>Each ion touches its nearest neighbours of opposite charge. Compare how far apart the centres are (204, 278, 214 pm) and how big the charges are.</p>"},
    {type:"read", title:"Estimating a lattice energy", ref:"p. 15", body:"<p>One ion pair is not a crystal. Every ion has many neighbours at many distances, some attracting and some repelling. The <b>Madelung constant</b> $A$ adds them all up for a given packing; for the NaCl structure, $A = 1.7476$. Multiply by $N_A$ to get a molar value:</p>$$\\Delta H_{\\text{lattice}} \\approx \\frac{A\\,N_A\\,q_1q_2}{4\\pi\\varepsilon_0 r_0},\\qquad r_0 = r_+ + r_-$$<p>This counts only charges. Each ion is wrapped in an electron cloud, and neighbouring clouds push on each other even when the ions are oppositely charged. Leaving that out makes the estimate too large (p. 15). Real lattice energies can also be found from other data with Hess's law and the Born–Haber cycle, which the notes only name.</p>"},
    {type:"example", title:"Estimate the lattice energy of KCl", ref:"p. 15", ex:{q:"KCl has the NaCl structure. Using $r(\\ce{K+}) = 133$ pm and $r(\\ce{Cl-}) = 181$ pm (standard radii, not from the notes), estimate $\\Delta H_{\\text{lattice}}$.", steps:[{t:"$r_0 = 133 + 181 = 314$ pm $= 3.14\\times10^{-10}$ m",why:"Touching ions: add the radii, then convert pm to m."},{t:"$q_1q_2 = (+1)(-1)(1.602\\times10^{-19})^2 = -2.566\\times10^{-38}\\ \\mathrm{C^2}$",why:"Each charge is $ze$."},{t:"$\\Delta H \\approx \\dfrac{(1.7476)(6.022\\times10^{23})(-2.566\\times10^{-38})}{4\\pi(8.854\\times10^{-12})(3.14\\times10^{-10})} = -7.73\\times10^{5}$ J mol⁻¹",why:"$\\varepsilon_0$ is the standard value (not from the notes)."},{t:"$\\Delta H \\approx -773$ kJ mol⁻¹",why:"Smaller in size than NaCl's estimate ($-873$) because $\\ce{K+}$ is bigger than $\\ce{Na+}$. The real value is smaller still: the formula overestimates."}], ans:"$\\Delta H_{\\text{lattice}} \\approx -773$ kJ mol⁻¹"}},
    {type:"explore", title:"Estimate against measurement", fig:"coulomb", ref:"p. 15", body:"<p>Set $r_0$ to 278 pm with charges $\\pm1$: the estimate is about 873 kJ mol⁻¹ against the notes' 781. Then try 204 pm (LiF) and switch to $\\pm2$ at 214 pm (ZnO). Every estimate lands above the real value, as the notes predict.</p><p>Going from $\\pm1$ to $\\pm2$ multiplies the energy by 4. Shrinking $r_0$ from 278 to 204 pm multiplies it by only about 1.4.</p>"},
    {type:"try", title:"Estimate a lattice energy", gen:"M4C4.g.lattice-estimate"},
    {type:"try", title:"Rank lattice energies", gen:"M4C4.g.rank-lattice"},
    {type:"read", title:"How strong is a covalent bond?", ref:"p. 16", body:"<p>The <b>bond dissociation energy</b> is the energy needed to break a particular covalent bond. Three things set it (p. 16): the <b>sizes</b> of the atoms, the <b>bond order</b>, and whether the bond is <b>polar</b>.</p><ol><li>Covalent bonds are typically 100 to 200 pm long.</li><li>Bond energies are typically a few hundred kJ mol⁻¹.</li><li>Small atoms form short, strong bonds: H–H is 74 pm and 436 kJ mol⁻¹; Cl–Cl is 199 pm and 243 kJ mol⁻¹.</li><li>Higher bond order, shorter and stronger: C–C 154 pm, 347; C=C 134 pm, 611; C≡C 120 pm, 837 kJ mol⁻¹.</li></ol><p>The notes add that a double bond is not twice as strong as a single bond. That is true for C–C (611 is less than 694). Check the next figure before you trust it for other atoms.</p>"},
    {type:"explore", title:"Compare double and twice single", fig:"bars", ref:"p. 16", body:"<p>C–C: the double and triple bars fall short of the dashed outlines. Now pick N–N: the double bond is more than twice the single, and the triple more than five times. O–O and N–O behave like N–N. The single bonds between N and O atoms are unusually weak, which is why their ratios are so large. The remark on p. 16 is about carbon, not every bond.</p>"},
    {type:"explore", title:"See three bond orders at once", fig:"lengths", ref:"p. 16", body:"<p>The model builds every bond at its p. 16 length. In this one molecule the C≡C is clearly the shortest and the C–C the longest.</p>"},
    {type:"try", title:"Pick the bond", gen:"M4C4.g.compare-bonds"},
    {type:"example", title:"Energy to break every bond in methane", ref:"p. 16", ex:{q:"How much energy does it take to break all the bonds in 10.0 g of $\\ce{CH4}$ gas, using the p. 16 table?", steps:[{t:"$M(\\ce{CH4}) = 12.01 + 4(1.008) = 16.04$ g mol⁻¹, so $n = 10.0/16.04 = 0.6234$ mol",why:"Data-sheet masses."},{t:"Each molecule has four C–H bonds: $4 \\times 414 = 1656$ kJ per mole of $\\ce{CH4}$",why:"H–C is 414 kJ mol⁻¹ in the table."},{t:"$E = 0.6234 \\times 1656 = 1.03\\times10^{3}$ kJ",why:"Energy must be added: breaking bonds always costs energy."}], ans:"About $1.03\\times10^{3}$ kJ"}},
    {type:"try", title:"Energy to break bonds", gen:"M4C4.g.bond-energy-use"},
    {type:"formulas", title:"Formulas and rules to know"}
  ]
});
})();
