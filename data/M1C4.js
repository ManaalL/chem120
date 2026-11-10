/* Chapter 1.4 (Wed Sep 16): Moles, solutions and combustion analysis. Course notes Module 1, pp. 13-17 (section 1.3).
   The mole, Avogadro's number, molar mass, density and concentration; the three-step mole method;
   solution stoichiometry (Examples 1-11, 1-12); combustion analysis and empirical formulas (Example 1-13). */
(function(){
const M=C120, CH=M.chem, NA=CH.CONST.NA;
const ceD=f=>String(f).replace(/NaN/g,"Na{}N");
const mm=f=>CH.mm(f), mw=f=>CH.mmWork(f);
const t4=v=>M.numTeX(v,4), q=(v,sf,u)=>M.qty(v,sf,u);
const pct=(v,sf=3)=>`${M.toSig(v,sf)}\\%`;
const side=(sp,co)=>sp.map((s,i)=>(co[i]!==1?co[i]:"")+s).join(" + ");
const eqTeX=(L,R,c)=>`\\ce{${ceD(side(L,c.slice(0,L.length)))} -> ${ceD(side(R,c.slice(L.length)))}}`;
const eqBare=(L,R)=>`\\ce{${ceD(L.join(" + "))} -> ${ceD(R.join(" + "))}}`;
const counts=f=>window.MC.parseSpecies(f).counts;
const ELNAME=e=>CH.NAME[e].toLowerCase();
/* reactions for the mole method, all balanced (checked atom by atom) */
const RX=[[["Mg","O2"],["MgO"],[2,1,2]],[["N2","H2"],["NH3"],[1,3,2]],[["CH4","O2"],["CO2","H2O"],[1,2,1,2]],[["C3H8","O2"],["CO2","H2O"],[1,5,3,4]],
  [["KClO3"],["KCl","O2"],[2,2,3]],[["Fe2O3","CO"],["Fe","CO2"],[1,3,2,3]],[["C2H6","O2"],["CO2","H2O"],[2,7,4,6]],[["CaCO3","HCl"],["CaCl2","H2O","CO2"],[1,2,1,1,1]],
  [["NH3","O2"],["NO","H2O"],[4,5,4,6]],[["C6H12O6","O2"],["CO2","H2O"],[1,6,6,6]],[["H2O2"],["H2O","O2"],[2,2,1]],[["Mg3N2","H2O"],["Mg(OH)2","NH3"],[1,6,3,2]],
  [["NaHCO3"],["Na2CO3","H2O","CO2"],[2,1,1,1]],[["Al","HCl"],["AlCl3","H2"],[2,6,2,3]],[["NaN3"],["Na","N2"],[2,2,3]],[["SiO2","C"],["SiC","CO"],[1,3,1,2]],[["P4","Cl2"],["PCl3"],[1,6,4]]];
const MOLS=[["H2O","water"],["CO2","carbon dioxide"],["NaCl","sodium chloride"],["CaCO3","calcium carbonate"],["C6H12O6","glucose"],["NH3","ammonia"],["H2SO4","sulfuric acid"],["NaOH","sodium hydroxide"],["KMnO4","potassium permanganate"],["C2H5OH","ethanol"],["Fe2O3","iron(III) oxide"],["Al2(SO4)3","aluminum sulfate"]];
const DRUGS=[["C8H10N4O2","caffeine"],["C9H8O4","aspirin"],["C12H22O11","sucrose"],["C10H14N2","nicotine"],["C13H18O2","ibuprofen"],["C6H8O6","vitamin C"],["C18H27NO3","capsaicin"],["C8H11NO2","dopamine"],["C8H9NO2","acetaminophen"]];
const PREF=[["mg",1e-3],["μg",1e-6],["ng",1e-9]];
const ELEMS=["Mg","Al","S","Ca","Ti","Cr","Fe","Cu","Zn","Br","Sr","Zr","Ag","Sn","I","Ba","W","Pt","Au","Pb"];
const LIQ=[["C2H5OH","ethanol",0.789],["CH3OH","methanol",0.791],["C6H6","benzene",0.876],["C3H6O","acetone",0.784],["CCl4","carbon tetrachloride",1.59],["C6H14","hexane",0.655]];
/* salts for ion concentration: [salt, ion, ions per formula unit] */
const SALTS=[["CaCl2","Cl-",2],["FeCl3","Cl-",3],["Ca(NO3)2","NO3-",2],["Al(NO3)3","NO3-",3],["Na2SO4","Na+",2],["K3PO4","K+",3],["Na2CO3","Na+",2],["MgCl2","Cl-",2],["K2SO4","K+",2],["AlCl3","Cl-",3]];
/* compounds for combustion analysis (molecular formulas) */
const CHX=["C2H4","C3H6","C6H6","C2H2","C2H6","C3H8","C4H10","C8H10","C7H8","C5H12","C9H12","C6H14"];
const CHO=["C6H12O6","C4H8O2","C3H6O","C2H6O","C3H8O","C4H10O","C3H6O2","C4H6O2","C8H8O3","C9H8O4","C5H10O2","C6H10O4","C4H4O4","C2H2O4","C7H6O3","C6H8O7","C10H14O"];
const sub=(f)=>{ const c=counts(f); return [c.C||0,c.H||0,c.O||0]; };
const fml=(c,h,o)=>`C${c>1?c:""}H${h>1?h:""}${o?("O"+(o>1?o:"")):""}`;

M.chapter({
  id:"M1C4", module:"m1", n:4, num:"1.4", date:"2026-09-16", added:"2026-10-26", quiz:"PC1",
  title:"Moles, solutions and combustion analysis", pages:"13-17", sections:["1.3"],
  summary:"The mole lets you count particles by weighing them: $n = m/M$. Every stoichiometry problem follows the same three steps: convert what you know to moles, use the coefficients to get moles of what you want, then convert back.",
  flags:[
    {ref:"p. 13", text:"The notes say \"the IUPAC symbol for mol is $n$\". Strictly, $n$ is the symbol for the quantity (amount of substance) and mol is its unit, so $n = 0.50$ mol. The notes also print Avogadro's number without a unit; as a constant it is $6.022\\times10^{23}\\ \\mathrm{mol^{-1}}$ (data sheet)."}
  ],
  formulas:[
    {id:"M1C4.f.avogadro", name:"Avogadro's number", kind:"constant", ref:"p. 13", tex:"N_A = 6.022\\times10^{23}\\ \\mathrm{mol^{-1}}", note:"The number of particles (atoms, molecules, ions, formula units) in one mole. The unit is from the data sheet.",
      blank:{tex:"N_A = \\boxed{\\,?\\,}\\ \\mathrm{mol^{-1}}", accept:["6.022e23","6.022 x 10^23","6.022×10^23","6.022x10^23","6.022 × 10^23"]}},
    {id:"M1C4.f.moles", name:"Moles from mass", ref:"p. 13", tex:"n = \\frac{m}{M}", note:"$n$ in mol, $m$ in g, $M$ (molar mass, the mass of one mole) in g mol<sup>−1</sup>.",
      blank:{tex:"n = \\frac{m}{\\boxed{\\,?\\,}}", accept:["M","molar mass"]}},
    {id:"M1C4.f.particles", name:"Particles from moles", ref:"p. 13", tex:"N = n\\,N_A",
      blank:{tex:"N = n\\times\\boxed{\\,?\\,}", accept:["NA","N_A","Avogadro's number","6.022e23"]}},
    {id:"M1C4.f.density", name:"Density", ref:"p. 13", tex:"\\rho = \\frac{m}{V}", note:"Mass per unit volume, often g mL<sup>−1</sup>.",
      blank:{tex:"\\rho = \\frac{\\boxed{\\,?\\,}}{V}", accept:["m","mass"]}},
    {id:"M1C4.f.concentration", name:"Molar concentration", ref:"p. 13", tex:"c = \\frac{n}{V}\\quad(\\mathrm{mol\\,L^{-1}} = \\mathrm{M})", note:"Moles of solute per litre of solution. Rearranged: $n = cV$ with $V$ in litres.",
      blank:{tex:"c = \\frac{n}{\\boxed{\\,?\\,}}", accept:["V","volume","V (L)"]}},
    {id:"M1C4.f.mole-method", name:"The mole method", kind:"rule", ref:"p. 14", tex:"\\text{known quantity}\\xrightarrow{\\ \\text{to moles}\\ }n_A\\xrightarrow{\\ \\times\\,\\text{coefficient ratio}\\ }n_B\\xrightarrow{\\ \\text{from moles}\\ }\\text{wanted quantity}",
      blank:{tex:"n_B = n_A\\times\\frac{\\text{coefficient of B}}{\\boxed{\\,?\\,}}", accept:["coefficient of A","coefficient of a","coeff of A"]}},
    {id:"M1C4.f.combustion", name:"Combustion analysis", kind:"rule", ref:"p. 17", tex:"\\text{all C}\\to\\ce{CO2},\\quad\\text{all H}\\to\\ce{H2O},\\quad m_\\mathrm{O} = m_\\text{sample} - m_\\mathrm{C} - m_\\mathrm{H}", note:"Each $\\ce{H2O}$ holds 2 H atoms: $n_\\mathrm{H} = 2\\,n_{\\ce{H2O}}$.",
      blank:{tex:"n_\\mathrm{H} = \\boxed{\\,?\\,}\\times n_{\\ce{H2O}}", accept:["2","two"]}}
  ],
  glossary:[
    {id:"M1C4.t.mole", term:"Mole (mol)", def:"The SI unit for amount of substance (symbol $n$): $6.022\\times10^{23}$ particles. The chemist's counting unit.", ref:"p. 13"},
    {id:"M1C4.t.molar-mass", term:"Molar mass, $M$", def:"The mass of one mole of a substance, in g mol<sup>−1</sup>. For a compound, add the atomic masses from the data sheet.", ref:"p. 13"},
    {id:"M1C4.t.stoichiometry", term:"Stoichiometry", def:"The quantitative relationships between the amounts of reactants and products in a reaction.", ref:"p. 13"},
    {id:"M1C4.t.concentration", term:"Concentration (molarity)", def:"Moles of solute per litre of solution, mol L<sup>−1</sup> or M.", ref:"p. 13"},
    {id:"M1C4.t.empirical", term:"Empirical formula", def:"The simplest whole-number ratio of atoms in a compound (C<sub>7</sub>H<sub>6</sub>O<sub>2</sub> style ratios come from combustion analysis).", ref:"p. 17"},
    {id:"M1C4.t.molecular", term:"Molecular formula", def:"The actual number of each atom in one molecule: a whole-number multiple of the empirical formula, found from the molar mass.", ref:"p. 17"},
    {id:"M1C4.t.percent", term:"Percent composition", def:"The mass percent of each element in a compound.", ref:"p. 17"}
  ],
  figures:{
    molemap:{title:"The mole map", cap:"Type a number in any box. Mass, moles and particles convert through the molar mass and Avogadro's number; moles and the solution volume give the concentration. Molar masses use the data sheet.", ref:"p. 13",
      build(host,{PLOT,M}){
        const SUBS=["H2O","NaCl","CO2","C6H12O6","NaOH","CaCl2","H2SO4"];
        let f="NaCl", n=0.25, V=250;
        const ctl=PLOT.controls(host);
        const lab=document.createElement("label"); lab.innerHTML="<span>Substance</span>"; const sel=document.createElement("select"); SUBS.forEach(s=>sel.append(new Option(s,s))); sel.value=f; lab.append(sel); ctl.append(lab);
        const mmOut=document.createElement("div"); mmOut.className="readout"; host.append(mmOut);
        const row=document.createElement("div"); row.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:10px 0"; host.append(row);
        const box=(t,u,arrow)=>{ const d=document.createElement("div"); d.style.cssText="border:1px solid var(--rule);border-radius:8px;padding:8px;background:var(--paper)"; d.innerHTML=`<div class="mono">${t}</div>`; const i=document.createElement("input"); i.type="text"; i.inputMode="decimal"; i.style.cssText="width:100%;font:inherit;padding:6px 8px;border:1px solid var(--rule);border-radius:6px;background:var(--paper);color:var(--ink)"; i.setAttribute("aria-label",t); d.append(i); const s=document.createElement("div"); s.className="readout"; s.innerHTML=u; d.append(s); if(arrow){ const a=document.createElement("div"); a.className="readout"; a.innerHTML=arrow; d.append(a); } row.append(d); return i; };
        const iM=box("Mass","g",M.rich("$\\div M$ to get moles")), iN=box("Amount","mol",M.rich("$\\times N_A$ to get particles")), iP=box("Particles","formula units or molecules",M.rich("$\\div N_A$ to get moles")), iV=box("Solution volume","mL",M.rich("$c = n/V$, with $V$ in L"));
        const cOut=document.createElement("div"); cOut.className="box"; host.append(cOut);
        const fmt=v=>{ const a=Math.abs(v); return (a>=1e4||(a<1e-3&&a>0))?v.toExponential(4).replace("e+","e"):String(+v.toPrecision(4)); };
        function draw(skip){ const Mm=CH.mm(f);
          mmOut.innerHTML=M.rich(`$M(\\ce{${f}}) = ${CH.mmWork(f)}$`);
          if(skip!=="m") iM.value=fmt(n*Mm); if(skip!=="n") iN.value=fmt(n); if(skip!=="p") iP.value=fmt(n*NA); if(skip!=="v") iV.value=fmt(V);
          cOut.innerHTML=M.rich(`$c = \\dfrac{${M.numTeX(n,4)}\\ \\mathrm{mol}}{${M.numTeX(V/1000,4)}\\ \\mathrm{L}} = ${M.numTeX(n/(V/1000),4)}\\ \\mathrm{mol\\,L^{-1}}$`); }
        const rd=i=>{ const v=parseFloat(String(i.value).replace(/[x×]\s*10\^?/,"e")); return isFinite(v)&&v>0?v:null; };
        iM.oninput=()=>{ const v=rd(iM); if(v){ n=v/CH.mm(f); draw("m"); } };
        iN.oninput=()=>{ const v=rd(iN); if(v){ n=v; draw("n"); } };
        iP.oninput=()=>{ const v=rd(iP); if(v){ n=v/NA; draw("p"); } };
        iV.oninput=()=>{ const v=rd(iV); if(v){ V=v; draw("v"); } };
        sel.onchange=()=>{ f=sel.value; draw(); };
        draw();
      }},
    burn3d:{title:"Where the carbon and hydrogen go", cap:"Methane burning: every C atom ends up in a $\\ce{CO2}$ molecule and every H atom in an $\\ce{H2O}$ molecule. Combustion analysis relies on exactly this.", ref:"p. 17",
      model:{type:"particles", params:{scenario:"balance", reaction:"ch4-o2"}},
      predict:{q:"One $\\ce{CH4}$ molecule burns completely. How many $\\ce{H2O}$ molecules hold its hydrogen atoms?", opts:[["1",false,"One $\\ce{H2O}$ holds only 2 H atoms; methane has 4."],["2",true,"4 H atoms, 2 per water molecule: 2 $\\ce{H2O}$. That is why $n_\\mathrm{H} = 2n_{\\ce{H2O}}$."],["4",false,"Each water molecule carries 2 H atoms, not 1."]], check:"Count the H atoms on each side of the balanced equation."}}
  },
  gens:[
    {id:"M1C4.g.moles", title:"Mass, moles and particles", skill:"Use $n = m/M$ and $N = nN_A$", ref:"p. 13",
      gen(R,d){
        if(d===1){ const [f,nm]=R.pick(MOLS); const Mm=mm(f);
          if(R.int(0,1)){ const m=R.sig(2,95,3); const n=m/Mm;
            return {prompt:`How many moles of ${nm} are in ${M.toSig(m,3)} g of $\\ce{${f}}$?`, answer:{type:"num",value:n,unit:"mol",sf:3},
              hint:"$n = m/M$. Add up the molar mass from the data sheet.", steps:[`$M = ${mw(f)}$`,`$n = \\dfrac{m}{M} = \\dfrac{${M.toSig(m,3)}\\ \\mathrm{g}}{${M.num(Mm,3)}\\ \\mathrm{g\\,mol^{-1}}} = ${q(n,3,"mol")}$`], answerTeX:`$${q(n,3,"mol")}$`, verify:{value:m*(1/Mm)}}; }
          const n=R.sig(0.05,3.5,3); const m=n*Mm;
          return {prompt:`What is the mass of ${M.toSig(n,3)} mol of ${nm}, $\\ce{${f}}$?`, answer:{type:"num",value:m,unit:"g",sf:3},
            hint:"$m = nM$.", steps:[`$M = ${mw(f)}$`,`$m = nM = ${M.toSig(n,3)}\\ \\mathrm{mol}\\times${M.num(Mm,3)}\\ \\mathrm{g\\,mol^{-1}} = ${q(m,3,"g")}$`], answerTeX:`$${q(m,3,"g")}$`, verify:{value:Mm*n}}; }
        if(d===2){ const [f,nm]=R.pick(DRUGS); const c=counts(f); const e=R.pick(Object.keys(c)); const [pu,ps]=R.pick(PREF); const mv=R.sig(1.2,95,3); const g=mv*ps; const Mm=mm(f); const n=g/Mm; const N=n*c[e]*NA;
          return {prompt:`How many ${ELNAME(e)} atoms are in ${M.toSig(mv,3)} ${pu} of ${nm}, $\\ce{${f}}$? Give 3 significant figures (type large numbers like 1.23e20).`, answer:{type:"num",value:N,sf:3},
            hint:`Convert ${pu} to g, then g to mol, then mol of molecules to atoms: each molecule has ${c[e]} ${e} atom${c[e]>1?"s":""}.`,
            steps:[`$m = ${M.toSig(mv,3)}\\ \\mathrm{${pu.replace("μ","\\mu ")}} = ${q(g,3,"g")}$`,`$M = ${mw(f)}$`,`$n = \\dfrac{${M.numTeX(g,3)}}{${M.num(Mm,3)}} = ${q(n,4,"mol")}$ of molecules`,`$N(\\mathrm{${e}}) = ${M.numTeX(n,4)}\\times${c[e]}\\times6.022\\times10^{23} = ${M.numTeX(N,3)}$ atoms`],
            answerTeX:`$${M.numTeX(N,3,{sci:true})}$ atoms`, verify:{value:mv*ps*c[e]*NA/Mm}}; }
        if(R.int(0,1)){ const e=R.pick(ELEMS); const Mt=CH.MASS[e]; const N=R.sig(1.5,9.5,4)*1e22; const m=+(N/NA*Mt).toPrecision(4); const Mc=m/(N/NA);
          return {prompt:`A ${M.toSig(m,4)} g sample of a pure element contains $${M.numTeX(N,4,{sci:true})}$ atoms. Which element is it? Type its symbol.`, answer:{type:"formula",answer:e},
            hint:"Find the moles from the atom count, then the molar mass $M = m/n$. Match it to the data sheet.",
            steps:[`$n = \\dfrac{N}{N_A} = \\dfrac{${M.numTeX(N,4,{sci:true})}}{6.022\\times10^{23}} = ${q(N/NA,4,"mol")}$`,`$M = \\dfrac{m}{n} = \\dfrac{${M.toSig(m,4)}}{${M.numTeX(N/NA,4)}} = ${q(Mc,4,"g/mol")}$`,`The data sheet value closest to this is ${e} (${CH.MASS[e]} g mol<sup>−1</sup>).`], answerTeX:e}; }
        const [f,nm,rho]=R.pick(LIQ); const V=R.sig(1.5,25,3); const m=rho*V; const n=m/mm(f); const N=n*NA;
        return {prompt:`How many molecules are in ${M.toSig(V,3)} mL of ${nm}, $\\ce{${f}}$ (density ${rho} g mL<sup>−1</sup>, given)? Type large numbers like 1.23e20.`, answer:{type:"num",value:N,sf:3},
          hint:"Volume to mass with the density, mass to moles with $M$, then moles to molecules with $N_A$.",
          steps:[`$m = \\rho V = ${rho}\\times${M.toSig(V,3)} = ${q(m,4,"g")}$`,`$n = \\dfrac{${M.numTeX(m,4)}}{${M.num(mm(f),3)}} = ${q(n,4,"mol")}$`,`$N = ${M.numTeX(n,4)}\\times6.022\\times10^{23} = ${M.numTeX(N,3)}$`], answerTeX:`$${M.numTeX(N,3,{sci:true})}$ molecules`, verify:{value:V*rho*NA/mm(f)}};
      }},
    {id:"M1C4.g.percent", title:"Mass percent of an element", skill:"Percent composition from a formula", ref:"p. 17",
      gen(R,d){
        const pool=["Fe2O3","CuSO4","K3PO4","Ca(NO3)2","(NH4)2SO4","C6H12O6","Al2(SO4)3","NaHCO3","KMnO4","Mg3N2","Na2CO3","CaCl2","SnO2","PbI2","C8H10N4O2"];
        const f=R.pick(pool); const c=counts(f); const e=R.pick(Object.keys(c)); const Mm=mm(f); const part=c[e]*CH.MASS[e]; const frac=part/Mm;
        const st0=[`$M(\\ce{${f}}) = ${mw(f)}$`,`Mass of ${e} in one mole: $${c[e]>1?c[e]+"\\times":""}${CH.MASS[e]} = ${M.num(part,3)}$ g`];
        if(d===1) return {prompt:`What is the percentage by mass of ${ELNAME(e)} in $\\ce{${f}}$?`, answer:{type:"num",value:100*frac,unit:"%",sf:3},
          hint:"Mass of that element in one mole of the compound, divided by the molar mass, times 100.", steps:[...st0,`$\\%\\,${e} = \\dfrac{${M.num(part,3)}}{${M.num(Mm,3)}}\\times100 = ${pct(100*frac)}$`], answerTeX:`$${pct(100*frac)}$`, verify:{value:100*c[e]*CH.MASS[e]/Mm}};
        if(d===2){ const m=R.sig(5,80,3); const me=m*frac;
          return {prompt:`What mass of ${ELNAME(e)} is in ${M.toSig(m,3)} g of $\\ce{${f}}$?`, answer:{type:"num",value:me,unit:"g",sf:3},
            hint:"Find the mass fraction of the element in the compound, then multiply by the sample mass.", steps:[...st0,`$m_\\mathrm{${e}} = ${M.toSig(m,3)}\\ \\mathrm{g}\\times\\dfrac{${M.num(part,3)}}{${M.num(Mm,3)}} = ${q(me,3,"g")}$`], answerTeX:`$${q(me,3,"g")}$`, verify:{value:(m/Mm)*c[e]*CH.MASS[e]}}; }
        let me,m; do{ me=R.sig(1.2,30,3); m=me/frac; }while(m>990);
        return {prompt:`What mass of $\\ce{${f}}$ contains ${M.toSig(me,3)} g of ${ELNAME(e)}?`, answer:{type:"num",value:m,unit:"g",sf:3},
          hint:"Divide the element's mass by its mass fraction in the compound.", steps:[...st0,`$m = \\dfrac{${M.toSig(me,3)}\\ \\mathrm{g}}{${M.num(part,3)}/${M.num(Mm,3)}} = ${q(m,3,"g")}$`], answerTeX:`$${q(m,3,"g")}$`, verify:{value:me/CH.MASS[e]/c[e]*Mm}};
      }},
    {id:"M1C4.g.mole-method", title:"Mass to mass with the mole method", skill:"To moles, between moles, from moles", ref:"p. 14",
      gen(R,d){
        const [L,Rr,co]=R.pick(RX); const all=[...L,...Rr]; const n=all.length;
        let i=R.int(0,L.length-1), j=R.int(L.length,n-1);
        if(d>=2 && R.int(0,1)) [i,j]=[j,R.int(0,L.length-1)];        /* product to reactant */
        const A=all[i], B=all[j]; let mA,nA,nB,mB; do{ mA=R.sig(3,90,3); nA=mA/mm(A); nB=nA*co[j]/co[i]; mB=nB*mm(B); }while(mB<0.5||mB>990);
        const eq=d===3?eqBare(L,Rr):eqTeX(L,Rr,co);
        const st=[];
        if(d===3) st.push(`Balance first: $${eqTeX(L,Rr,co)}$`);
        st.push(`To moles: $n_{\\ce{${A}}} = \\dfrac{${M.toSig(mA,3)}\\ \\mathrm{g}}{${M.num(mm(A),3)}\\ \\mathrm{g\\,mol^{-1}}} = ${q(nA,4,"mol")}$`);
        st.push(`Between moles: $n_{\\ce{${B}}} = ${M.numTeX(nA,4)}\\times\\dfrac{${co[j]}}{${co[i]}} = ${q(nB,4,"mol")}$`);
        st.push(`From moles: $m = ${M.numTeX(nB,4)}\\ \\mathrm{mol}\\times${M.num(mm(B),3)}\\ \\mathrm{g\\,mol^{-1}} = ${q(mB,3,"g")}$`);
        const role=i<L.length?"reacts":"is produced";
        return {prompt:`${d===3?"For the unbalanced reaction":"For the reaction"} $$${eq}$$ ${M.toSig(mA,3)} g of $\\ce{${ceD(A)}}$ ${role}. What mass of $\\ce{${ceD(B)}}$ ${j<L.length?"reacts":"forms"}? Assume any other reactant is in excess.`,
          answer:{type:"num",value:mB,unit:"g",sf:3},
          hint:"Convert the known mass to moles, multiply by the coefficient ratio (wanted over known), then convert to grams.",
          steps:st.map(ceD), answerTeX:`$${q(mB,3,"g")}$`, verify:{value:mA*co[j]*mm(B)/(co[i]*mm(A))}};
      }},
    {id:"M1C4.g.titration", title:"Neutralization volumes", skill:"$n = cV$ with the coefficient ratio", ref:"p. 16",
      gen(R,d){
        const pairs=d===1?[["HCl","NaOH",1,1],["HNO3","KOH",1,1],["HBr","LiOH",1,1]]:[["H2SO4","NaOH",1,2],["H2SO4","KOH",1,2],["HCl","Ba(OH)2",2,1],["HNO3","Ca(OH)2",2,1],["HClO4","Sr(OH)2",2,1]];
        const [A,B,ca,cb]=R.pick(pairs);
        const eqs={"HCl,NaOH":"HCl + NaOH -> NaCl + H2O","HNO3,KOH":"HNO3 + KOH -> KNO3 + H2O","HBr,LiOH":"HBr + LiOH -> LiBr + H2O","H2SO4,NaOH":"H2SO4 + 2NaOH -> Na2SO4 + 2H2O","H2SO4,KOH":"H2SO4 + 2KOH -> K2SO4 + 2H2O","HCl,Ba(OH)2":"2HCl + Ba(OH)2 -> BaCl2 + 2H2O","HNO3,Ca(OH)2":"2HNO3 + Ca(OH)2 -> Ca(NO3)2 + 2H2O","HClO4,Sr(OH)2":"2HClO4 + Sr(OH)2 -> Sr(ClO4)2 + 2H2O"};
        const eq=eqs[A+","+B];
        if(d<3){ let cA,cB,VB,nB,nA,VA; do{ cA=R.sig(0.08,1.5,3); cB=R.sig(0.08,1.5,3); VB=R.sig(10,60,3); nB=cB*VB/1000; nA=nB*ca/cb; VA=nA/cA*1000; }while(VA<5||VA>990);
          return {prompt:`What volume of ${M.toSig(cA,3)} M $\\ce{${A}}$ is needed to neutralize ${M.toSig(VB,3)} mL of ${M.toSig(cB,3)} M $\\ce{${B}}$? $$\\ce{${eq}}$$`,
            answer:{type:"num",value:VA,unit:"mL",sf:3},
            hint:"$n = cV$ for the base (V in L), use the coefficient ratio to get moles of acid, then $V = n/c$.",
            steps:[`$n_{\\ce{${B}}} = ${M.toSig(cB,3)}\\ \\mathrm{mol\\,L^{-1}}\\times${M.numTeX(VB/1000,3)}\\ \\mathrm{L} = ${q(nB,4,"mol")}$`,`$n_{\\ce{${A}}} = ${M.numTeX(nB,4)}\\times\\dfrac{${ca}}{${cb}} = ${q(nA,4,"mol")}$`,`$V = \\dfrac{n}{c} = \\dfrac{${M.numTeX(nA,4)}}{${M.toSig(cA,3)}} = ${q(nA/cA,4,"L")} = ${q(VA,3,"mL")}$`],
            answerTeX:`$${q(VA,3,"mL")}$`, verify:{value:(cB*VB*ca/cb)/cA}}; }
        /* Example 1-11 style: solid base dissolved to a stated volume (the volume does not matter) */
        const base=R.pick(["NaOH","KOH","LiOH"]); let m,cA,n,nA,VA; do{ m=R.sig(8,75,3); cA=R.sig(0.5,2.5,3); n=m/mm(base); nA=n/2; VA=nA/cA*1000; }while(VA<5||VA>990); const Vt=R.sig(1.2,4.5,3);
        return {prompt:`A solution is made by dissolving ${M.toSig(m,3)} g of $\\ce{${base}}$ in enough water to make ${M.toSig(Vt,3)} L. What volume of ${M.toSig(cA,3)} M $\\ce{H2SO4}$ neutralizes all of it? $$\\ce{H2SO4 + 2${base} -> ${base==="NaOH"?"Na":base==="KOH"?"K":"Li"}2SO4 + 2H2O}$$`,
          answer:{type:"num",value:VA,unit:"mL",sf:3},
          hint:"All of the dissolved base must be neutralized, so only its moles matter. The total volume is not needed.",
          steps:[`$n_{\\ce{${base}}} = \\dfrac{${M.toSig(m,3)}}{${M.num(mm(base),3)}} = ${q(n,4,"mol")}$ (the ${M.toSig(Vt,3)} L does not enter)`,`$n_{\\ce{H2SO4}} = \\tfrac12\\times${M.numTeX(n,4)} = ${q(nA,4,"mol")}$`,`$V = \\dfrac{${M.numTeX(nA,4)}}{${M.toSig(cA,3)}} = ${q(nA/cA,4,"L")} = ${q(VA,3,"mL")}$`],
          answerTeX:`$${q(VA,3,"mL")}$`, verify:{value:1000*m/(2*cA*mm(base))}};
      }},
    {id:"M1C4.g.ion-conc", title:"Concentration of an ion", skill:"Ions per formula unit, $c = n/V$", ref:"p. 16",
      gen(R,d){
        const [s,ion,k]=R.pick(SALTS); const Ms=mm(s);
        if(d===1){ const c=R.sig(0.05,1.5,3); const ci=k*c;
          return {prompt:`What is the concentration of $\\ce{${ion}}$ in ${M.toSig(c,3)} M $\\ce{${s}}$(aq)?`, answer:{type:"num",value:ci,unit:"M",sf:3},
            hint:`Each formula unit of $\\ce{${s}}$ releases ${k} $\\ce{${ion}}$ ions.`, steps:[`$\\ce{${s}}$ gives ${k} $\\ce{${ion}}$ per formula unit.`,`$[\\ce{${ion}}] = ${k}\\times${M.toSig(c,3)} = ${q(ci,3,"M")}$`], answerTeX:`$${q(ci,3,"M")}$`, verify:{value:c*k}}; }
        if(d===2){ if(R.int(0,1)){ const m=R.sig(1.5,40,3), V=R.sig(100,900,3); const n=m/Ms; const ci=k*n/(V/1000);
            return {prompt:`${M.toSig(m,3)} g of $\\ce{${s}}$ is dissolved in water to make ${M.toSig(V,3)} mL of solution. What is $[\\ce{${ion}}]$?`, answer:{type:"num",value:ci,unit:"M",sf:3},
              hint:"Moles of salt from the mass, times ions per formula unit, divided by the volume in litres.", steps:[`$n_{\\ce{${s}}} = \\dfrac{${M.toSig(m,3)}}{${M.num(Ms,3)}} = ${q(n,4,"mol")}$`,`$n_{\\ce{${ion}}} = ${k}\\times${M.numTeX(n,4)} = ${q(k*n,4,"mol")}$`,`$[\\ce{${ion}}] = \\dfrac{${M.numTeX(k*n,4)}}{${M.numTeX(V/1000,3)}\\ \\mathrm{L}} = ${q(ci,3,"M")}$`], answerTeX:`$${q(ci,3,"M")}$`, verify:{value:k*m*1000/(Ms*V)}}; }
          const c=R.sig(0.1,2,3), V1=R.sig(5,50,3), V2=R.pick([100,250,500,1000]); const n=c*V1/1000; const ci=k*n/(V2/1000);
          return {prompt:`${M.toSig(V1,3)} mL of ${M.toSig(c,3)} M $\\ce{${s}}$ is diluted with water to a total volume of ${V2}.0 mL. What is $[\\ce{${ion}}]$ in the diluted solution?`, answer:{type:"num",value:ci,unit:"M",sf:3},
            hint:"Dilution doesn't change the moles of solute: find $n = cV$ first, then divide by the new volume.", steps:[`$n_{\\ce{${s}}} = ${M.toSig(c,3)}\\times${M.numTeX(V1/1000,3)} = ${q(n,4,"mol")}$`,`$n_{\\ce{${ion}}} = ${k}\\times${M.numTeX(n,4)} = ${q(k*n,4,"mol")}$`,`$[\\ce{${ion}}] = \\dfrac{${M.numTeX(k*n,4)}}{${M.numTeX(V2/1000,4)}\\ \\mathrm{L}} = ${q(ci,3,"M")}$`], answerTeX:`$${q(ci,3,"M")}$`, verify:{value:k*c*V1/V2}}; }
        const w=R.sig(5,30,3), rho=R.sig(1.03,1.4,3); const msol=1000*rho, ms=msol*w/100, n=ms/Ms, ci=k*n;
        return {prompt:`An aqueous solution of $\\ce{${s}}$ is ${M.toSig(w,3)}% $\\ce{${s}}$ by mass and has a density of ${M.toSig(rho,3)} g mL<sup>−1</sup>. What is the concentration of $\\ce{${ion}}$?`, answer:{type:"num",value:ci,unit:"M",sf:3},
          hint:"Take exactly 1 L (1000 mL) of solution. Density gives its mass; the percent gives the mass of salt; then moles; then ions.",
          steps:[`Take 1.000 L: mass $= 1000\\ \\mathrm{mL}\\times${M.toSig(rho,3)}\\ \\mathrm{g\\,mL^{-1}} = ${q(msol,4,"g")}$`,`Mass of $\\ce{${s}}$ $= ${M.toSig(w,3)}\\%\\times${M.numTeX(msol,4)} = ${q(ms,4,"g")}$`,`$n = \\dfrac{${M.numTeX(ms,4)}}{${M.num(Ms,3)}} = ${q(n,4,"mol")}$, so $[\\ce{${s}}] = ${q(n,4,"M")}$`,`$[\\ce{${ion}}] = ${k}\\times${M.numTeX(n,4)} = ${q(ci,3,"M")}$`],
          answerTeX:`$${q(ci,3,"M")}$`, verify:{value:k*10*rho*w/Ms}};
      }},
    {id:"M1C4.g.combustion", title:"Empirical formula from combustion analysis", skill:"Masses of $\\ce{CO2}$ and $\\ce{H2O}$ to a formula", ref:"p. 17",
      gen(R,d){
        const MCO2=mm("CO2"), MH2O=mm("H2O");
        for(let t=0;t<60;t++){
          const f=R.pick(d===1?CHX:d===2?CHO:["C6H12O6","C4H8O2","C4H6O2","C6H10O4","C4H4O4","C2H2O4","C6H12O2","C8H8O2","C10H20O2"]); const [x,y,z]=sub(f); const g=[x,y,z].filter(v=>v).reduce((a,b)=>M.gcd(a,b)); const emp=[x/g,y/g,z/g];
          const sf=d===1?3:4; const ms=R.sig(0.25,1.6,sf); const nmol=ms/mm(f);
          const mC=+(nmol*x*MCO2).toPrecision(sf), mH=+(nmol*(y/2)*MH2O).toPrecision(sf);
          const nC=mC/MCO2, nH=2*mH/MH2O, gC=nC*CH.MASS.C, gH=nH*CH.MASS.H, gO=ms-gC-gH, nO=z?gO/CH.MASS.O:0;
          const small=Math.min(...[nC,nH,nO].filter(v=>v>0)); const r=[nC/small,nH/small,nO/small];
          let k=1; for(const kk of [1,2,3,4,5,6]){ if(r.every(v=>!v||Math.abs(v*kk-Math.round(v*kk))<0.08)){ k=kk; break; } k=0; }
          if(!k) continue; const got=r.map(v=>Math.round(v*k)); if(got[0]!==emp[0]||got[1]!==emp[1]||got[2]!==emp[2]) continue;
          if(z && gO<0.04*ms) continue;
          const E=fml(...emp), Mol=fml(x,y,z), Me=mm(E), Mm=+mm(Mol).toPrecision(3), mult=g;
          const st=[`$n_\\mathrm{C} = n_{\\ce{CO2}} = \\dfrac{${M.toSig(mC,sf)}}{${M.num(MCO2,3)}} = ${q(nC,4,"mol")}$, so $m_\\mathrm{C} = ${q(gC,4,"g")}$`,
            `$n_\\mathrm{H} = 2\\times\\dfrac{${M.toSig(mH,sf)}}{${M.num(MH2O,3)}} = ${q(nH,4,"mol")}$, so $m_\\mathrm{H} = ${q(gH,4,"g")}$`];
          if(z) st.push(`$m_\\mathrm{O} = ${M.toSig(ms,sf)} - ${M.numTeX(gC,4)} - ${M.numTeX(gH,4)} = ${q(gO,4,"g")}$, $n_\\mathrm{O} = ${q(nO,4,"mol")}$`);
          st.push(`Divide by the smallest: C : H${z?" : O":""} $= ${r.filter(v=>v).map(v=>v.toFixed(3)).join(" : ")}$`);
          if(k>1) st.push(`Multiply by ${k} to get whole numbers: ${got.filter(v=>v).join(" : ")}`);
          st.push(`Empirical formula: $\\ce{${E}}$`);
          const prompt=`${d===1?"A hydrocarbon (only C and H)":"A compound containing only C, H and O"}: a ${M.toSig(ms,sf)} g sample burns completely in excess $\\ce{O2}$ to give ${M.toSig(mC,sf)} g $\\ce{CO2}$ and ${M.toSig(mH,sf)} g $\\ce{H2O}$.`;
          const hint=`All the C ends up in $\\ce{CO2}$ and all the H in $\\ce{H2O}$ (2 H per molecule).${z?" Find O by difference.":""} Then take the mole ratio.`;
          if(d<3) return {prompt:prompt+" What is the empirical formula?", answer:{type:"formula",answer:E}, hint, steps:st, answerTeX:`$\\ce{${E}}$`};
          return {prompt:prompt+` Its molar mass is about ${M.toSig(Mm,3)} g mol<sup>−1</sup>. Give the empirical and molecular formulas.`,
            parts:[{label:"Empirical formula",answer:{type:"formula",answer:E}},{label:"Molecular formula",answer:{type:"formula",answer:Mol}}], hint,
            steps:[...st,`$\\dfrac{${M.toSig(Mm,3)}}{${M.num(Me,3)}} = ${(Mm/Me).toFixed(2)}\\approx${mult}$, so the molecular formula is $\\ce{${Mol}}$.`], answerTeX:`$\\ce{${E}}$; $\\ce{${Mol}}$`};
        }
        const E="CH2"; return {prompt:"A hydrocarbon burns to give $\\ce{CO2}$ and $\\ce{H2O}$ in a 1 : 1 mole ratio. What is its empirical formula?", answer:{type:"formula",answer:E}, hint:"Each $\\ce{H2O}$ holds 2 H.", steps:["C : H = 1 : 2"], answerTeX:"$\\ce{CH2}$"};
      }}
  ],
  exam:[
    {id:"M1C4.q1", ref:"p. 13", q:"How many oxygen atoms are in 0.250 mol of $\\ce{CO2}$?", opts:[["$1.51\\times10^{23}$",false,"That is the number of $\\ce{CO2}$ molecules; each has 2 O atoms."],["$3.01\\times10^{23}$",true,"$0.250\\times2\\times6.022\\times10^{23}$"],["$6.02\\times10^{23}$",false,"That would be 1 mol of O atoms."],["0.500",false,"That is the moles of O atoms, not the number."],["$2.41\\times10^{24}$",false,"That is 4 mol of atoms. Use $N = 0.250\\times2\\times N_A$."]]},
    {id:"M1C4.q2", ref:"p. 14", q:"For $\\ce{2A + B -> 3C}$, with B in excess, what is the correct order of steps to find the mass of C from a mass of A?", opts:[["mass A to mol A; mol A × 3/2 to mol C; mol C × $M_\\mathrm{C}$",true,"To moles, between moles with the coefficients, from moles."],["mass A × 3/2 to mass C",false,"Coefficients relate moles, not grams."],["mass A to mol A; mol A × 2/3 to mol C; mol C × $M_\\mathrm{C}$",false,"The ratio is upside down: wanted over known, 3/2."],["mol B to mol C, then mass",false,"B is in excess; A decides the amount of C."],["mass A ÷ $M_\\mathrm{C}$",false,"Each substance has its own molar mass."]]},
    {id:"M1C4.q3", ref:"p. 16", q:"What is the concentration of $\\ce{Cl-}$ in 0.300 M $\\ce{AlCl3}$(aq)?", opts:[["0.100 M",false,"Multiply, don't divide, by 3."],["0.300 M",false,"Each $\\ce{AlCl3}$ releases 3 $\\ce{Cl-}$."],["0.600 M",false,"That would be for $\\ce{MgCl2}$."],["0.900 M",true,"$3\\times0.300$"],["1.20 M",false,"That counts all four ions."]]},
    {id:"M1C4.q4", ref:"p. 17", q:"In combustion analysis of a C, H, O compound, how is the mass of oxygen in the sample found?", opts:[["From the mass of $\\ce{CO2}$ and $\\ce{H2O}$ oxygen atoms",false,"Most of that O came from the $\\ce{O2}$ used to burn the sample."],["By difference: sample mass − mass of C − mass of H",true,"All of the C and H are accounted for; the rest is O."],["From the mass of $\\ce{O2}$ consumed",false,"$\\ce{O2}$ is in excess and not measured."],["It cannot be found",false,"It can, by difference."],["By assuming one O per molecule",false,"Never assume; calculate it."]]},
    {id:"M1C4.q5", ref:"p. 17", q:"A compound has empirical formula $\\ce{CH2O}$ and molar mass about 180 g mol<sup>−1</sup>. What is its molecular formula?", opts:[["$\\ce{CH2O}$",false,"Its molar mass is 30.03, not 180."],["$\\ce{C3H6O3}$",false,"Molar mass 90.08."],["$\\ce{C6H12O6}$",true,"$180/30.03 = 6$"],["$\\ce{C6H6O6}$",false,"Not a multiple of $\\ce{CH2O}$."],["$\\ce{C12H24O12}$",false,"Molar mass 360."]]},
    {id:"M1C4.q6", ref:"p. 16", q:"A 15.0 g sample of KOH is dissolved to make 0.500 L of solution. What volume of 0.750 M HCl neutralizes it? ($\\ce{HCl + KOH -> KCl + H2O}$)", opts:[["356 mL",true,"$n = 15.0/56.11 = 0.2673$ mol; $V = 0.2673/0.750 = 0.356$ L."],["500 mL",false,"The solution volume of the base is not the answer."],["178 mL",false,"That uses a 1 : 2 ratio; HCl and KOH react 1 : 1."],["713 mL",false,"That uses a 2 : 1 ratio."],["20.0 mL",false,"Check the units: convert mass to moles first."]]},
    {id:"M1C4.q7", ref:"p. 13", q:"Which statement about molar mass is correct?", opts:[["It is the mass of one mole of a substance, in g mol<sup>−1</sup>.",true,"Definition on p. 13."],["It is the mass of one molecule, in g.",false,"One molecule weighs $M/N_A$ grams."],["It is the same for every substance.",false,"Each substance has its own."],["It is the number of particles in a mole.",false,"That is Avogadro's number."],["It changes with the size of the sample.",false,"It is a property of the substance."]]}
  ],
  steps:[
    {type:"read", title:"The mole counts particles by weighing them", ref:"p. 13", body:"<p>Atoms are far too small to count one by one, so chemists count them by mass. A <b>mole</b> (unit mol, quantity symbol $n$) is $N_A = 6.022\\times10^{23}$ particles, the same way a dozen is 12 eggs. The <b>molar mass</b> $M$ is the mass of one mole, in g mol<sup>−1</sup>: add up the atomic masses from the data sheet.</p><div class=\"box def\"><b class=\"t\">Three relationships (p. 13)</b>$n = \\dfrac{m}{M}$ &nbsp; (mass to moles)<br>$\\rho = \\dfrac{m}{V}$ &nbsp; (density links mass and volume)<br>$c = \\dfrac{n}{V}$ &nbsp; (concentration in mol L<sup>−1</sup>, also written M)</div><p>A bakery sells flour by the kilogram, not by the grain. Molar mass is the price tag that converts between the two.</p>"},
    {type:"explore", title:"Move around the mole map", fig:"molemap", ref:"p. 13", body:"<p>Type 1 in the moles box for each substance and compare the masses: one mole of glucose weighs 10 times more than one mole of water, yet both contain $6.022\\times10^{23}$ molecules. Then set a volume to see the concentration.</p>"},
    {type:"try", title:"Mass, moles and particles", gen:"M1C4.g.moles"},
    {type:"try", title:"Percent composition", gen:"M1C4.g.percent"},
    {type:"read", title:"The mole method: to moles, between moles, from moles", ref:"p. 14", body:"<p>Almost every stoichiometry problem starts with a known amount of one substance and asks for another. Coefficients in a balanced equation are <b>mole</b> ratios, never mass ratios, so the route always goes through moles.</p><table class=\"cn-table\"><tr><th>1. To moles</th><th>2. Between moles</th><th>3. From moles</th></tr><tr><td>mass, volume or concentration of the known substance → mol</td><td>multiply by (coefficient of wanted) ÷ (coefficient of known)</td><td>mol → the quantity asked for</td></tr></table><p>For $\\ce{2A + B -> 3C}$ with B in excess: $n_\\mathrm{A} = m_\\mathrm{A}/M_\\mathrm{A}$, then $n_\\mathrm{C} = n_\\mathrm{A}\\times\\tfrac32$, then $m_\\mathrm{C} = n_\\mathrm{C}M_\\mathrm{C}$.</p>"},
    {type:"example", title:"Iron from iron(III) oxide", ref:"p. 15 (like the Pre-Class Example)", ex:{q:"What mass of Fe can be made from 25.0 g of $\\ce{Fe2O3}$ with excess CO? $$\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$$", steps:[
      {t:"$M(\\ce{Fe2O3}) = 2(55.85) + 3(16.00) = 159.70$ g mol<sup>−1</sup>",why:"Data-sheet masses."},
      {t:"$n_{\\ce{Fe2O3}} = 25.0/159.70 = 0.1565$ mol",why:"Step 1: to moles."},
      {t:"$n_\\mathrm{Fe} = 0.1565\\times\\tfrac21 = 0.3131$ mol",why:"Step 2: 2 Fe per $\\ce{Fe2O3}$."},
      {t:"$m_\\mathrm{Fe} = 0.3131\\times55.85 = 17.5$ g",why:"Step 3: from moles. Three sig figs, like 25.0 g."}], ans:"17.5 g Fe"}},
    {type:"try", title:"Mass to mass", gen:"M1C4.g.mole-method"},
    {type:"read", title:"Solutions: moles are concentration times volume", ref:"p. 16", body:"<p>For a solution, step 1 of the mole method is $n = cV$ with $V$ in litres. Two things to watch:</p><ul><li><b>Only moles react.</b> If a solid is dissolved and then all of it reacts, the volume of water used doesn't matter (Example 1-11).</li><li><b>Count ions per formula unit.</b> 0.20 M $\\ce{Na2SO4}$ is 0.40 M in $\\ce{Na+}$.</li></ul><p>When a solution is given as a <b>percent by mass</b> with a <b>density</b>, imagine exactly 1 L of it: density gives the mass of the litre, the percent gives the mass of solute, and molar mass gives moles per litre (Example 1-12).</p>"},
    {type:"try", title:"Neutralization volumes", gen:"M1C4.g.titration"},
    {type:"try", title:"Ion concentrations", gen:"M1C4.g.ion-conc"},
    {type:"read", title:"Combustion analysis finds a formula from two masses", ref:"p. 17", body:"<p>Burn a weighed sample of a C, H (and O) compound in excess oxygen and weigh the $\\ce{CO2}$ and $\\ce{H2O}$ formed. Every C atom ends up in $\\ce{CO2}$ and every H atom in $\\ce{H2O}$.</p><table class=\"cn-table\"><tr><th>To moles</th><th>Between moles</th><th>From moles</th></tr><tr><td>g $\\ce{CO2}$ → mol $\\ce{CO2}$</td><td>mol C = mol $\\ce{CO2}$</td><td>mol C → g C → %C</td></tr><tr><td>g $\\ce{H2O}$ → mol $\\ce{H2O}$</td><td>mol H = 2 × mol $\\ce{H2O}$</td><td>mol H → g H → %H</td></tr></table><p>Oxygen comes <b>by difference</b>: what is left of the sample mass. Divide all the mole amounts by the smallest to get the <b>empirical formula</b>; if a ratio ends in .5, .33 or .25, multiply through by 2, 3 or 4. A measured molar mass then gives the <b>molecular formula</b>, a whole-number multiple of the empirical one.</p>"},
    {type:"explore", title:"Follow the atoms of a burning fuel", fig:"burn3d", ref:"p. 17", body:"<p>The O in the products comes partly from the fuel and mostly from the $\\ce{O2}$, which is why oxygen in the sample must be found by difference and not from the product masses.</p>"},
    {type:"try", title:"Combustion analysis", gen:"M1C4.g.combustion"},
    {type:"firstline", title:"Find the first mistake", q:"0.500 g of a hydrocarbon gives 1.570 g $\\ce{CO2}$ and 0.643 g $\\ce{H2O}$. A student works out the formula:", lines:["$n_\\mathrm{C} = 1.570/44.01 = 0.03567$ mol","$n_\\mathrm{H} = 0.643/18.02 = 0.03568$ mol","C : H = 1 : 1","Empirical formula CH"], wrong:1, why:"Each $\\ce{H2O}$ contains 2 H atoms, so $n_\\mathrm{H} = 2\\times0.643/18.02 = 0.07137$ mol. The ratio is 1 : 2 and the empirical formula is $\\ce{CH2}$."},
    {type:"formulas", title:"Formulas to know"}
  ]
});
})();
