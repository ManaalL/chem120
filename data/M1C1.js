/* Chapter 1.1 (Fri Sep 11): Elements, compounds and balanced equations. Course notes Module 1, pp. 1-6 (sections 1.1 and 1.2).
   The periodic table and its vocabulary, six reaction types, balancing and the law of conservation of mass,
   aqueous solutions, ionic vs molecular compounds, common polyatomic ions. */
(function(){
const M=C120, CH=M.chem;
const ce=f=>`$\\ce{${f}}$`;
/* "NaN" inside a formula (NaNO3) trips the site's text checks, so displayed formulas use Na{}N (mhchem renders it the same) */
const ceD=f=>String(f).replace(/NaN/g,"Na{}N");
const gcd=(a,b)=>M.gcd(a,b);
const gcdAll=a=>a.reduce((g,x)=>gcd(g,x));
/* "2 Fe + 3 O2" style text for a side, with coefficient 1 left out */
const side=(sp,co)=>sp.map((s,i)=>(co&&co[i]!==1?co[i]:"")+s).join(" + ");
const eqTeX=(L,R,cl,cr)=>`\\ce{${side(L,cl)} -> ${side(R,cr)}}`;
const eqText=(L,R,cl,cr)=>`${side(L,cl)} -> ${side(R,cr)}`;
/* atom counts for one side */
function countSide(sp,co){ const c={}; sp.forEach((s,i)=>{ const r=window.MC.parseSpecies(s); for(const k in r.counts) c[k]=(c[k]||0)+r.counts[k]*(co?co[i]:1); }); return c; }

/* balancing pool: [reactants, products, coefficients in order] */
const EASY=[
  [["H2","O2"],["H2O"],[2,1,2]], [["N2","H2"],["NH3"],[1,3,2]], [["Na","Cl2"],["NaCl"],[2,1,2]], [["Mg","O2"],["MgO"],[2,1,2]],
  [["Fe","Cl2"],["FeCl3"],[2,3,2]], [["KClO3"],["KCl","O2"],[2,2,3]], [["Ca","H2O"],["Ca(OH)2","H2"],[1,2,1,1]],
  [["P4","O2"],["P4O10"],[1,5,1]], [["SO2","O2"],["SO3"],[2,1,2]], [["Cu","O2"],["Cu2O"],[4,1,2]], [["Al","Br2"],["AlBr3"],[2,3,2]], [["HgO"],["Hg","O2"],[2,2,1]]
];
const HARD=[
  [["Fe2O3","CO"],["Fe","CO2"],[1,3,2,3]], [["NH3","O2"],["NO","H2O"],[4,5,4,6]], [["FeS2","O2"],["Fe2O3","SO2"],[4,11,2,8]],
  [["Al","H2SO4"],["Al2(SO4)3","H2"],[2,3,1,3]], [["Cu","HNO3"],["Cu(NO3)2","NO","H2O"],[3,8,3,2,4]], [["Na2O2","H2O"],["NaOH","O2"],[2,2,4,1]],
  [["Mg3N2","H2O"],["Mg(OH)2","NH3"],[1,6,3,2]], [["PbS","O2"],["PbO","SO2"],[2,3,2,2]], [["NaHCO3"],["Na2CO3","H2O","CO2"],[2,1,1,1]],
  [["KMnO4","HCl"],["KCl","MnCl2","Cl2","H2O"],[2,16,2,2,5,8]], [["Ca3(PO4)2","SiO2","C"],["CaSiO3","P4","CO"],[2,6,10,6,1,10]]
];
/* fuels for combustion: [formula as written, name, C, H, O] */
const FUELS=[["CH4","methane",1,4,0],["C2H6","ethane",2,6,0],["C3H8","propane",3,8,0],["C4H10","butane",4,10,0],["C5H12","pentane",5,12,0],["C6H14","hexane",6,14,0],["C7H16","heptane",7,16,0],
  ["C2H4","ethene",2,4,0],["C3H6","propene",3,6,0],["C6H6","benzene",6,6,0],["C7H8","toluene",7,8,0],["C6H12","cyclohexane",6,12,0],
  ["CH3OH","methanol",1,4,1],["C2H5OH","ethanol",2,6,1],["C3H7OH","propan-1-ol",3,8,1],["C3H6O","acetone",3,6,1],["C6H12O6","glucose",6,12,6],["C4H10O","diethyl ether",4,10,1]];
function burn(x,y,z){ let c=[4,4*x+y-2*z,4*x,2*y]; const g=gcdAll(c); return c.map(v=>v/g); }

/* reaction types (p. 3), with new example equations */
const TYPES=["Synthesis","Decomposition","Single displacement","Double displacement","Combustion","Acid-base"];
const TYPE_EX={
  "Synthesis":["2Na + Cl2 -> 2NaCl","N2 + 3H2 -> 2NH3","CaO + CO2 -> CaCO3","2Al + 3Br2 -> 2AlBr3","H2 + Cl2 -> 2HCl"],
  "Decomposition":["2KClO3 -> 2KCl + 3O2","CaCO3 -> CaO + CO2","2HgO -> 2Hg + O2","2NaN3 -> 2Na + 3N2","2NaHCO3 -> Na2CO3 + H2O + CO2"],
  "Single displacement":["Zn + CuSO4 -> ZnSO4 + Cu","Mg + 2HCl -> MgCl2 + H2","Cl2 + 2KBr -> 2KCl + Br2","Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag","Fe + H2SO4 -> FeSO4 + H2"],
  "Double displacement":["BaCl2 + Na2SO4 -> BaSO4 + 2NaCl","Pb(NO3)2 + 2KI -> PbI2 + 2KNO3","AgNO3 + KBr -> AgBr + KNO3","CaCl2 + Na2CO3 -> CaCO3 + 2NaCl"],
  "Combustion":["CH4 + 2O2 -> CO2 + 2H2O","C3H8 + 5O2 -> 3CO2 + 4H2O","C2H5OH + 3O2 -> 2CO2 + 3H2O","2C4H10 + 13O2 -> 8CO2 + 10H2O"],
  "Acid-base":["HNO3 + KOH -> KNO3 + H2O","H2SO4 + 2NaOH -> Na2SO4 + 2H2O","HBr + LiOH -> LiBr + H2O","CH3COOH + NaOH -> CH3COONa + H2O"]
};
const TYPE_WHY={
  "Synthesis":"Two or more substances join into a new substance.",
  "Decomposition":"One reactant breaks down into two or more simpler products.",
  "Single displacement":"An element takes the place of another element in a compound.",
  "Double displacement":"Two ionic compounds swap partners (here a solid precipitate forms).",
  "Combustion":"A fuel reacts with $\\ce{O2}$; a fuel made of C, H (and O) gives $\\ce{CO2}$ and $\\ce{H2O}$.",
  "Acid-base":"An $\\ce{H+}$ moves from the acid to the base."
};

/* common polyatomic ions (p. 5): [formula, name, a salt that contains it] */
const IONS=[["NO3-","nitrate","KNO3"],["NO2-","nitrite","NaNO2"],["CN-","cyanide","KCN"],["CNO-","cyanate","NaCNO"],["SCN-","thiocyanate","KSCN"],["HCO2-","formate","NaHCO2"],
  ["HSO4-","hydrogen sulfate","NaHSO4"],["SO4^2-","sulfate","K2SO4"],["PO4^3-","phosphate","Na3PO4"],["HPO4^2-","hydrogen phosphate","K2HPO4"],["H2PO4-","dihydrogen phosphate","NaH2PO4"],
  ["PO3^3-","phosphite","K3PO3"],["CO3^2-","carbonate","Li2CO3"],["HCO3-","hydrogen carbonate","KHCO3"],["O2^2-","peroxide","Na2O2"],["C2H3O2-","acetate","NaC2H3O2"],
  ["ClO4-","perchlorate","KClO4"],["ClO3-","chlorate","NaClO3"],["ClO2-","chlorite","NaClO2"],["ClO-","hypochlorite","KClO"],["CrO4^2-","chromate","K2CrO4"],["Cr2O7^2-","dichromate","Na2Cr2O7"],["MnO4-","permanganate","KMnO4"],["OH-","hydroxide","LiOH"]];
const CATS=[["Na","sodium",1],["K","potassium",1],["Li","lithium",1],["NH4","ammonium",1],["Mg","magnesium",2],["Ca","calcium",2],["Ba","barium",2],["Al","aluminum",3]];
const chargeOf=f=>window.MC.parseSpecies(f).charge;
const bare=f=>f.includes("^")?f.slice(0,f.indexOf("^")):f.replace(/[+-]$/,"");
const polyAtomic=f=>Object.values(window.MC.parseSpecies(f).counts).reduce((a,b)=>a+b,0)>1;
/* neutral formula from a cation and an anion */
function salt(cat,qc,an){ const qa=-chargeOf(an); const l=qc*qa/gcd(qc,qa); const nc=l/qc, na=l/qa; const cs=cat, as=bare(an);
  const part=(s,n,poly)=>n===1?s:(poly?`(${s})${n}`:`${s}${n}`); return part(cs,nc,cs==="NH4")+part(as,na,polyAtomic(an)); }

M.chapter({
  id:"M1C1", module:"m1", n:1, num:"1.1", date:"2026-09-11", added:"2026-10-26", quiz:"PC1",
  title:"Elements, compounds and balanced equations", pages:"1-6", sections:["1.1","1.2"],
  summary:"Every substance is built from about 90 natural elements. A chemical equation only rearranges atoms, so it must be balanced: the same number of each kind of atom on both sides (the law of conservation of mass).",
  flags:[],
  formulas:[
    {id:"M1C1.f.conservation", name:"Law of conservation of mass", kind:"rule", ref:"p. 3",
      tex:"\\text{atoms of each element (reactants)}=\\text{atoms of that element (products)}", note:"Change coefficients, never subscripts. A subscript change makes a different substance.",
      blank:{tex:"\\text{balanced: same number of each kind of }\\boxed{\\,?\\,}\\text{ on both sides}", accept:["atom","atoms"]}},
    {id:"M1C1.f.combustion", name:"Combustion of a hydrocarbon", kind:"rule", ref:"p. 3",
      tex:"\\ce{C_xH_y + O2 -> CO2 + H2O}", note:"The fuel reacts with an oxidant (usually O<sub>2</sub>) and gives off a lot of heat. Compounds of C, H and O also give only CO<sub>2</sub> and H<sub>2</sub>O.",
      blank:{tex:"\\ce{C_xH_y + O2 ->}\\ \\boxed{\\,?\\,}\\ \\ce{+ H2O}", accept:["CO2","co2"]}},
    {id:"M1C1.f.natural", name:"Naturally occurring elements", kind:"rule", ref:"p. 2",
      tex:"Z=1\\text{ to }92,\\ \\text{except }\\ce{Tc}\\ (43)\\text{ and }\\ce{Pm}\\ (61)", note:"That makes 90 natural elements (p. 1). Elements 93 to 118 are made in particle accelerators.",
      blank:{tex:"Z=1\\text{ to }92\\text{ except }\\ce{Tc}\\text{ and }\\boxed{\\,?\\,}", accept:["Pm","promethium","61"]}},
    {id:"M1C1.f.cl-oxoanions", name:"Chlorine oxoanions", kind:"rule", ref:"p. 5",
      tex:"\\ce{ClO4-}\\ \\text{perchlorate},\\ \\ce{ClO3-}\\ \\text{chlorate},\\ \\ce{ClO2-}\\ \\text{chlorite},\\ \\ce{ClO-}\\ \\text{hypochlorite}",
      blank:{tex:"\\text{chlorite}=\\boxed{\\,?\\,}", accept:["ClO2-","ClO2^-","ClO2 -","ClO2−"]}},
    {id:"M1C1.f.s-c-ions", name:"Sulfate, carbonate, phosphate families", kind:"rule", ref:"p. 5",
      tex:"\\ce{SO4^2-},\\ \\ce{HSO4-};\\quad \\ce{CO3^2-},\\ \\ce{HCO3-};\\quad \\ce{PO4^3-},\\ \\ce{HPO4^2-},\\ \\ce{H2PO4-},\\ \\ce{PO3^3-}", note:"Each H<sup>+</sup> added to an anion lowers its negative charge by 1.",
      blank:{tex:"\\text{hydrogen phosphate}=\\boxed{\\,?\\,}", accept:["HPO4^2-","HPO42-","HPO4 2-","HPO4^-2"]}},
    {id:"M1C1.f.n-ions", name:"Nitrogen and carbon ions", kind:"rule", ref:"p. 5",
      tex:"\\ce{NH4+},\\ \\ce{NO3-},\\ \\ce{NO2-},\\ \\ce{CN-},\\ \\ce{CNO-}\\ \\text{(cyanate)},\\ \\ce{SCN-}\\ \\text{(thiocyanate)},\\ \\ce{HCO2-}\\ \\text{(formate)},\\ \\ce{C2H3O2-}\\ \\text{(acetate)}",
      blank:{tex:"\\text{nitrite}=\\boxed{\\,?\\,}", accept:["NO2-","NO2^-","NO2 -"]}},
    {id:"M1C1.f.metal-oxo", name:"Chromate, dichromate, permanganate, peroxide", kind:"rule", ref:"p. 5",
      tex:"\\ce{CrO4^2-},\\ \\ce{Cr2O7^2-},\\ \\ce{MnO4-},\\ \\ce{O2^2-}",
      blank:{tex:"\\text{dichromate}=\\boxed{\\,?\\,}", accept:["Cr2O7^2-","Cr2O72-","Cr2O7 2-","Cr2O7^-2"]}}
  ],
  glossary:[
    {id:"M1C1.t.iupac", term:"IUPAC", def:"International Union of Pure and Applied Chemistry: the world authority on chemical names, symbols, new elements and atomic weights.", ref:"p. 1"},
    {id:"M1C1.t.group", term:"Group and period", def:"A group is a column of the periodic table (1 to 18). A period is a row (1 to 7).", ref:"p. 2"},
    {id:"M1C1.t.balanced", term:"Balanced equation", def:"An equation with the same number of atoms of each element on the reactant side and the product side.", ref:"p. 3"},
    {id:"M1C1.t.combustion", term:"Combustion", def:"A highly exothermic reaction of a compound with an oxidant, usually $\\ce{O2}$. Hydrocarbons give $\\ce{CO2}$ and $\\ce{H2O}$.", ref:"p. 3"},
    {id:"M1C1.t.aqueous", term:"Aqueous solution", def:"A homogeneous mixture with water as the solvent, marked (aq).", ref:"p. 5"},
    {id:"M1C1.t.ionic", term:"Ionic compound", def:"Positive and negative ions held in a regular repeating pattern by ionic bonding. Solid at room temperature. Dissolved ions are surrounded by water molecules.", ref:"p. 5"},
    {id:"M1C1.t.molecular", term:"Molecular compound", def:"Neutral molecules whose atoms share electrons in covalent bonds. Can be solid, liquid or gas. Dissolving gives ions only if the molecules react with water.", ref:"p. 6"},
    {id:"M1C1.t.formula-unit", term:"Formula unit", def:"The smallest repeating group of ions in an ionic compound, such as one $\\ce{Na+}$ and one $\\ce{Cl-}$ in NaCl.", ref:"p. 5"}
  ],
  figures:{
    balance3d:{title:"Balancing propane combustion with particles", cap:"Each sphere cluster is one molecule. Change the coefficients and watch the atom tally on each side. The equation is balanced when every element has the same count on both sides.", ref:"p. 3",
      model:{type:"particles", params:{scenario:"balance", reaction:"propane", unbalanced:true}},
      predict:{q:"Propane, $\\ce{C3H8}$, burns in oxygen to give $\\ce{CO2}$ and $\\ce{H2O}$. How many $\\ce{O2}$ molecules does each $\\ce{C3H8}$ need?", opts:[["3",false,"3 $\\ce{CO2}$ use 6 O atoms, and the water needs more."],["4",false,"4 is the number of $\\ce{H2O}$ (8 H ÷ 2)."],["5",true,"Products: 3 $\\ce{CO2}$ (6 O) + 4 $\\ce{H2O}$ (4 O) = 10 O atoms = 5 $\\ce{O2}$."],["7",false,"Count O in 3 $\\ce{CO2}$ and 4 $\\ce{H2O}$: 10 atoms, which is 5 $\\ce{O2}$."]], check:"Set the coefficients to 1, 5, 3, 4 and check that C, H and O all match."}},
    counter:{title:"Atom counter", cap:"Pick an equation and change the coefficients. The table counts every element on each side. Subscripts are fixed: changing them would make a different substance.", ref:"p. 3",
      build(host,{PLOT,M}){
        const RX=[{n:"Iron + oxygen",L:["Fe","O2"],R:["Fe2O3"]},{n:"Ammonia + oxygen",L:["NH3","O2"],R:["NO","H2O"]},{n:"Ethane combustion",L:["C2H6","O2"],R:["CO2","H2O"]},
          {n:"Aluminum + hydrochloric acid",L:["Al","HCl"],R:["AlCl3","H2"]},{n:"Potassium chlorate decomposes",L:["KClO3"],R:["KCl","O2"]},{n:"Calcium + water",L:["Ca","H2O"],R:["Ca(OH)2","H2"]}];
        let ri=0, cl=[], cr=[];
        const ctl=PLOT.controls(host);
        const lab=document.createElement("label"); lab.innerHTML="<span>Equation</span>"; const sel=document.createElement("select"); RX.forEach((r,i)=>sel.append(new Option(r.n,i))); lab.append(sel); ctl.append(lab);
        const eq=document.createElement("div"); eq.style.cssText="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0;font-size:1.05rem"; host.append(eq);
        const tbl=document.createElement("div"); host.append(tbl);
        const out=PLOT.readout(host);
        const btn=(t,f,label)=>{ const b=document.createElement("button"); b.type="button"; b.className="btn sm ghost"; b.textContent=t; b.setAttribute("aria-label",label); b.onclick=f; return b; };
        function spBox(f,arr,i){ const d=document.createElement("span"); d.style.cssText="display:inline-flex;align-items:center;gap:4px;border:1px solid var(--rule);border-radius:8px;padding:3px 6px;background:var(--paper)";
          d.append(btn("−",()=>{ if(arr[i]>1){ arr[i]--; draw(); } },`fewer ${f}`)); const c=document.createElement("b"); c.textContent=arr[i]; c.style.minWidth="1.4em"; c.style.textAlign="center"; d.append(c);
          d.append(btn("+",()=>{ if(arr[i]<20){ arr[i]++; draw(); } },`more ${f}`)); const t=document.createElement("span"); t.innerHTML=M.ce(f); d.append(t); return d; }
        const plus=()=>{ const s=document.createElement("span"); s.textContent="+"; return s; };
        function draw(){
          const r=RX[ri]; eq.innerHTML="";
          r.L.forEach((f,i)=>{ if(i) eq.append(plus()); eq.append(spBox(f,cl,i)); });
          const ar=document.createElement("span"); ar.innerHTML=M.tex("\\longrightarrow"); eq.append(ar);
          r.R.forEach((f,i)=>{ if(i) eq.append(plus()); eq.append(spBox(f,cr,i)); });
          const a=countSide(r.L,cl), b=countSide(r.R,cr); const els=[...new Set([...Object.keys(a),...Object.keys(b)])];
          let off=[]; let h=`<table class="cn-table"><tr><th>Element</th><th>Reactant side</th><th>Product side</th><th></th></tr>`;
          els.forEach(e=>{ const x=a[e]||0, y=b[e]||0; if(x!==y) off.push(e); h+=`<tr><td>${e}</td><td>${x}</td><td>${y}</td><td>${x===y?"equal":"not equal"}</td></tr>`; });
          tbl.innerHTML=h+"</table>";
          const all=[...cl,...cr]; const g=gcdAll(all);
          out.innerHTML=off.length?`Not balanced yet: ${off.join(", ")} ${off.length>1?"differ":"differs"}.`:g>1?`<b>Balanced</b>, but every coefficient divides by ${g}. Use the smallest whole numbers.`:`<b>Balanced</b> with the smallest whole numbers: ${M.tex(eqTeX(r.L,r.R,cl,cr))}`;
        }
        sel.onchange=()=>{ ri=+sel.value; cl=RX[ri].L.map(()=>1); cr=RX[ri].R.map(()=>1); draw(); };
        sel.onchange();
      }},
    shapes:{title:"Three molecular compounds", cap:"Ball-and-stick models of the three molecules pictured on p. 6. Atoms share electrons in covalent bonds; there are no ions. (Why each molecule has its shape is Module 4.)", ref:"p. 6",
      model:{type:"molecule", params:{molecule:"H2O", choices:["H2O","CO2","CCl4"], polarity:false, fcToggle:false, geoToggle:false}},
      predict:{q:"Water and carbon dioxide each have three atoms. Do they have the same shape?", opts:[["Yes: both are straight lines.",false,"Only $\\ce{CO2}$ is a straight line."],["No: water is bent and carbon dioxide is linear.",true,"The pictures on p. 6 show a bent $\\ce{H2O}$ and a linear $\\ce{CO2}$."],["No: water is linear and carbon dioxide is bent.",false,"It is the other way round."]], check:"Pick H2O, then CO2, and rotate each one to look at it side on."}}
  },
  gens:[
    {id:"M1C1.g.classify", title:"Name the reaction type", skill:"Recognise the six reaction types", ref:"p. 3",
      gen(R,d){
        const pool=d===1?["Synthesis","Decomposition","Combustion"]:TYPES;
        const t=R.pick(pool); const e=R.pick(TYPE_EX[t]);
        let opts=TYPES.slice(); if(t==="Acid-base") opts=opts.filter(x=>x!=="Double displacement"); else if(t==="Double displacement") opts=opts.filter(x=>x!=="Acid-base"); else opts=opts.filter(x=>x!==(R.int(0,1)?"Acid-base":"Double displacement"));
        return {prompt:`Which type of reaction is this? $$\\ce{${ceD(e)}}$$`,
          answer:{type:"mc",options:opts,correct:opts.indexOf(t),keep:true},
          hint:"Count reactants and products, then look for $\\ce{O2}$ with a fuel, an $\\ce{H+}$ moving from an acid, or an element swapping into a compound.",
          steps:[`Look at the pattern of the equation.`,TYPE_WHY[t],`So this is a <b>${t.toLowerCase()}</b> reaction.`],
          answerTeX:t};
      }},
    {id:"M1C1.g.balance", title:"Balance an equation", skill:"Choose coefficients so atoms are conserved", ref:"p. 3",
      gen(R,d){
        let L,Rr,co;
        if(d===1){ [L,Rr,co]=R.pick(EASY); }
        else if(d===2){ const f=R.pick(FUELS); L=[f[0],"O2"]; Rr=["CO2","H2O"]; co=burn(f[2],f[3],f[4]); }
        else { [L,Rr,co]=R.pick(HARD); }
        const n=L.length+Rr.length; const cl=co.slice(0,L.length), cr=co.slice(L.length);
        const blank=sp=>sp.map(s=>`\\_\\,\\ce{${s}}`).join(" + ");
        const els=[...new Set([...Object.keys(countSide(L,cl)),...Object.keys(countSide(Rr,cr))])];
        const tally=countSide(L,cl);
        return {prompt:`Balance with the smallest whole-number coefficients. Type all ${n} coefficients in order, separated by commas (write 1 where needed). $$${blank(L)} \\longrightarrow ${blank(Rr)}$$`,
          answer:{type:"list",answer:co},
          hint:d===2?"Balance C first (into $\\ce{CO2}$), then H (into $\\ce{H2O}$), then O last using $\\ce{O2}$. If $\\ce{O2}$ needs a half, double everything.":"Start with the element that appears in the fewest formulas. Leave single elements (like $\\ce{O2}$ or $\\ce{Fe}$) for last.",
          steps:[`Balanced: $${eqTeX(L,Rr,cl,cr)}$`,`Check each element: ${els.map(e=>`${e} ${tally[e]}`).join(", ")} on both sides.`,`Coefficients in order: ${co.join(", ")}.`],
          answerTeX:co.join(", ")};
      }},
    {id:"M1C1.g.combustion", title:"Write a combustion equation", skill:"Predict products and balance", ref:"p. 3",
      gen(R,d){
        const pool=d===1?FUELS.filter(f=>f[4]===0&&f[2]<=3):d===2?FUELS.filter(f=>f[4]===0):FUELS.filter(f=>f[4]>0||f[2]>=6);
        const f=R.pick(pool); const co=burn(f[2],f[3],f[4]); const L=[f[0],"O2"], Rr=["CO2","H2O"];
        const ans=eqText(L,Rr,co.slice(0,2),co.slice(2));
        const o2=(4*f[2]+f[3]-2*f[4])/4;
        return {prompt:`Write the balanced equation for the complete combustion of ${f[1]}, $\\ce{${f[0]}}$. Use the smallest whole-number coefficients. (States are optional; type the arrow as ->.)`,
          answer:{type:"equation",answer:ans},
          hint:"Complete combustion of a C, H (and O) compound gives only $\\ce{CO2}$ and $\\ce{H2O}$.",
          steps:[`Products: $\\ce{CO2}$ and $\\ce{H2O}$.`,`C: ${f[2]} $\\ce{CO2}$. H: ${f[3]} H atoms make ${f[3]/2} $\\ce{H2O}$.`,`O needed on the product side: $2(${f[2]}) + ${f[3]/2} = ${2*f[2]+f[3]/2}$${f[4]?`, minus ${f[4]} O already in the fuel`:""}, so $${M.num(o2)}$ $\\ce{O2}$ per fuel molecule.`,
            co[0]>1?`$${M.num(o2)}$ is not a whole number, so multiply everything by ${co[0]}.`:`All whole numbers already.`,`$${eqTeX(L,Rr,co.slice(0,2),co.slice(2))}$`],
          answerTeX:`$${eqTeX(L,Rr,co.slice(0,2),co.slice(2))}$`};
      }},
    {id:"M1C1.g.ions", title:"Polyatomic ions and their compounds", skill:"Know the common polyatomic ions", ref:"p. 5",
      gen(R,d){
        const ion=R.pick(IONS.filter(x=>d<3||x[0]!=="OH-"));
        if(d===1) return {prompt:`Write the formula of the ${ion[1]} ion, with its charge (for example SO4^2- or NH4+).`,
          answer:{type:"formula",answer:ion[0]}, hint:"See the table of common polyatomic ions (p. 5).",
          steps:[`The ${ion[1]} ion is $\\ce{${ion[0]}}$.`], answerTeX:`$\\ce{${ion[0]}}$`};
        if(d===2) return {prompt:`$\\ce{${ceD(ion[2])}}$ is an ionic compound made of a metal cation and a polyatomic anion. Write the formula of the anion, with its charge.`,
          answer:{type:"formula",answer:ion[0]}, hint:"Take off the metal. What is left is the anion; its charge balances the metal's charge.",
          steps:[`The cation is the metal ion; the rest of the formula is the ${ion[1]} ion.`,`Anion: $\\ce{${ion[0]}}$ (${ion[1]}).`], answerTeX:`$\\ce{${ion[0]}}$`};
        const ion3=R.pick(IONS.filter(x=>!["OH-","O2^2-","HCO2-","CNO-","PO3^3-","HSO4-"].includes(x[0]))); const cat=R.pick(CATS.filter(c=>c[0]!=="Al"||!/H|C(?![lr])/.test(bare(ion3[0])))); return (function(ion){ const f=salt(cat[0],cat[2],ion[0]); 
        return {prompt:`Write the formula of ${cat[1]} ${ion[1]}.`,
          answer:{type:"formula",answer:f}, hint:"Write both ions with charges, then take enough of each so the total charge is zero. Put brackets around a polyatomic ion used more than once.",
          steps:[`Ions: $\\ce{${cat[0]}${cat[2]>1?"^"+cat[2]+"+":"+"}}$ and $\\ce{${ion[0]}}$.`,`Charges must add to zero: lowest common multiple of ${cat[2]} and ${-chargeOf(ion[0])}.`,`Formula: $\\ce{${ceD(f)}}$.`], answerTeX:`$\\ce{${ceD(f)}}$`}; })(ion3);
      }},
    {id:"M1C1.g.count", title:"Count atoms in a formula", skill:"Read subscripts, brackets and coefficients", ref:"p. 3",
      gen(R,d){
        const pool=d===1?["Na2SO4","Ca(OH)2","Mg(NO3)2","K3PO4","NH4NO3"]:d===2?["Al2(SO4)3","(NH4)2CO3","Ca3(PO4)2","Fe(NO3)3","Ba(ClO4)2","(NH4)3PO4"]:["CuSO4*5H2O","Na2CO3*10H2O","MgSO4*7H2O","Al2(SO4)3*18H2O","CoCl2*6H2O"];
        const f=R.pick(pool); const k=d===1?R.int(1,3):d===2?R.int(2,4):1; const c=window.MC.parseSpecies(f).counts; const els=Object.keys(c).filter(e=>c[e]>1||d>1); const e=R.pick(els.length?els:Object.keys(c));
        const tot=k*c[e];
        return {prompt:`How many ${CH.NAME[e].toLowerCase()} (${e}) atoms are in $\\ce{${k>1?k:""}${f}}$?`,
          answer:{type:"int",value:tot},
          hint:"A subscript after a bracket multiplies everything inside it. A coefficient in front multiplies the whole formula.",
          steps:[`One $\\ce{${f}}$ contains ${c[e]} ${e} atom${c[e]>1?"s":""}.`,k>1?`The coefficient ${k} multiplies that: $${k}\\times${c[e]} = ${tot}$.`:`The coefficient is 1, so the total is ${tot}.`],
          answerTeX:String(tot)};
      }}
  ],
  exam:[
    {id:"M1C1.q1", ref:"p. 3", q:"Which equation is balanced?", opts:[
      ["$\\ce{Fe + O2 -> Fe2O3}$",false,"Fe: 1 vs 2; O: 2 vs 3."],
      ["$\\ce{2C2H6 + 7O2 -> 4CO2 + 6H2O}$",true,"C 4 = 4, H 12 = 12, O 14 = 8 + 6."],
      ["$\\ce{NH3 + O2 -> NO + H2O}$",false,"H: 3 vs 2."],
      ["$\\ce{2KClO3 -> 2KCl + 2O2}$",false,"O: 6 vs 4. It needs 3 $\\ce{O2}$."],
      ["$\\ce{Al + 3HCl -> AlCl3 + 3H2}$",false,"H: 3 vs 6."]]},
    {id:"M1C1.q2", ref:"p. 3", q:"Why must a chemical equation be balanced?", opts:[
      ["Because atoms are neither created nor destroyed in a reaction (conservation of mass).",true,"The same atoms are only rearranged."],
      ["Because the number of molecules must be the same on both sides.",false,"Molecule counts can change: $\\ce{2H2 + O2 -> 2H2O}$ goes from 3 to 2."],
      ["Because the total charge must always be zero.",false,"Charge must match on both sides, but it need not be zero."],
      ["Because each coefficient must be 1 or 2.",false,"Coefficients can be any whole numbers."],
      ["Because the reactants and products must have the same subscripts.",false,"Subscripts belong to each substance and differ between reactants and products."]]},
    {id:"M1C1.q3", ref:"p. 2", q:"Which element with atomic number below 93 does not occur naturally on Earth?", opts:[
      ["Uranium (92)",false,"Element 92 occurs naturally."],["Technetium (43)",true,"Tc (43) and Pm (61) are the two exceptions."],["Radium (88)",false,"Ra is natural."],["Bismuth (83)",false,"Bi is natural."],["Iodine (53)",false,"I is natural."]]},
    {id:"M1C1.q4", ref:"p. 3", q:"$\\ce{2Na{}N3 -> 2Na + 3N2}$ is an example of which type of reaction?", opts:[
      ["Synthesis",false,"Synthesis joins substances together."],["Decomposition",true,"One reactant breaks into simpler products."],["Single displacement",false,"No element replaces another in a compound."],["Combustion",false,"There is no oxidant such as $\\ce{O2}$."],["Acid-base",false,"No proton is transferred."]]},
    {id:"M1C1.q5", ref:"pp. 5-6", q:"Which substance is a molecular compound?", opts:[
      ["$\\ce{K2SO4}$",false,"Ionic: $\\ce{K+}$ and $\\ce{SO4^2-}$."],["$\\ce{NH4NO3}$",false,"Ionic: $\\ce{NH4+}$ and $\\ce{NO3-}$, even though it has no metal."],["$\\ce{CCl4}$",true,"Covalent bonds between nonmetals; no ions."],["$\\ce{CH3ONa}$",false,"Ionic: $\\ce{Na+}$ and methoxide $\\ce{CH3O-}$."],["$\\ce{NaCl}$",false,"Ionic: $\\ce{Na+}$ and $\\ce{Cl-}$."]]},
    {id:"M1C1.q6", ref:"p. 5", q:"What is the formula of the chlorite ion?", opts:[
      ["$\\ce{ClO-}$",false,"Hypochlorite."],["$\\ce{ClO2-}$",true,"Chlorite."],["$\\ce{ClO3-}$",false,"Chlorate."],["$\\ce{ClO4-}$",false,"Perchlorate."],["$\\ce{Cl-}$",false,"Chloride."]]},
    {id:"M1C1.q7", ref:"p. 5", multi:true, q:"Which compounds contain a polyatomic ion? Select all that apply.", opts:[
      ["$\\ce{NaHCO3}$",true,"Hydrogen carbonate, $\\ce{HCO3-}$."],["$\\ce{MgO}$",false,"$\\ce{Mg^2+}$ and $\\ce{O^2-}$ are single-atom ions."],["$\\ce{NH4Cl}$",true,"Ammonium, $\\ce{NH4+}$."],["$\\ce{KMnO4}$",true,"Permanganate, $\\ce{MnO4-}$."],["$\\ce{CaCl2}$",false,"$\\ce{Ca^2+}$ and $\\ce{Cl-}$ only."]]}
  ],
  steps:[
    {type:"read", title:"About 90 natural elements build every substance", ref:"pp. 1-2", body:"<p>An <b>element</b> is one kind of atom. There are 118 known elements, and IUPAC (the world authority on names, symbols and atomic weights) keeps the official periodic table.</p><p>Elements 1 to 92 occur on Earth, except technetium (Tc, 43) and promethium (Pm, 61). That leaves <b>90 natural elements</b>. Yet the CAS Registry lists over 204 million different substances. Think of an alphabet: 26 letters make every word in a dictionary. Ninety elements make every compound.</p><p>Elements 93 to 118 are made a few atoms at a time in particle accelerators. Elements 112 to 118 completed period 7 between 2010 and 2016.</p><h4>The vocabulary of the table</h4><p>The notes ask you to place these terms on a blank table. The standard placements (the notes leave the answers for you to fill in):</p><table class=\"cn-table\"><tr><th>Term</th><th>Where</th></tr><tr><td>Group</td><td>a column, numbered 1 to 18</td></tr><tr><td>Period</td><td>a row, numbered 1 to 7</td></tr><tr><td>Alkali metals</td><td>group 1 (not H)</td></tr><tr><td>Alkaline-earth metals</td><td>group 2</td></tr><tr><td>Transition metals</td><td>groups 3 to 12</td></tr><tr><td>Halogens</td><td>group 17</td></tr><tr><td>Noble gases</td><td>group 18</td></tr><tr><td>Lanthanoids, actinoids</td><td>the two rows below the table (57 to 71, 89 to 103)</td></tr></table><p>Each tile gives the <b>atomic number</b> (protons) and the <b>atomic mass</b>. For carbon: 6 and 12.011. The lanthanoids and actinoids sit at the bottom only to keep the table narrow; in place, the table would need 32 columns.</p>"},
    {type:"read", title:"Six common reaction types", ref:"p. 3", body:"<p>You need to recognise these patterns, predict the products and balance the equation.</p><table class=\"cn-table\"><tr><th>Type</th><th>Pattern</th><th>New example</th></tr><tr><td>Synthesis</td><td>substances join into a new one</td><td>$\\ce{CaO + CO2 -> CaCO3}$</td></tr><tr><td>Decomposition</td><td>one reactant breaks into simpler products</td><td>$\\ce{CaCO3 -> CaO + CO2}$</td></tr><tr><td>Single displacement</td><td>an element replaces a less reactive one</td><td>$\\ce{Zn + CuSO4 -> ZnSO4 + Cu}$</td></tr><tr><td>Double displacement</td><td>two ionic compounds swap ions (precipitation)</td><td>$\\ce{AgNO3 + KBr -> AgBr + KNO3}$</td></tr><tr><td>Combustion</td><td>fuel + oxidant ($\\ce{O2}$), very exothermic</td><td>$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$</td></tr><tr><td>Acid-base</td><td>$\\ce{H+}$ moves from acid to base</td><td>$\\ce{HNO3 + KOH -> KNO3 + H2O}$</td></tr></table><p>An acid reacting with a hydroxide also swaps ions, but the notes file it under acid-base: the key event is the proton transfer.</p>"},
    {type:"try", title:"Classify reactions", gen:"M1C1.g.classify", diff:1},
    {type:"read", title:"Balanced equations conserve atoms", ref:"p. 3", body:"<p>A reaction rearranges atoms; it never makes or destroys them. So every equation must have the same number of each kind of atom on both sides. This is the <b>law of conservation of mass</b>.</p><p>Think of building with blocks: you can take a model apart and build something else, but the pile of blocks stays the same.</p><div class=\"box def\"><b class=\"t\">How to balance</b>Change only the <b>coefficients</b> (the numbers in front). Never change a subscript: $\\ce{H2O2}$ is not water. Use the smallest whole numbers.</div>"},
    {type:"explore", title:"Balance propane combustion particle by particle", fig:"balance3d", ref:"p. 3", body:"<p>Start with one of each molecule. Carbon is off first: 3 C on the left, 1 on the right. Fix C, then H, then O last, because $\\ce{O2}$ appears alone and can be adjusted without upsetting anything else.</p>"},
    {type:"example", title:"Balance the combustion of butane", ref:"p. 4 (like Example 1-2)", ex:{q:"Write the balanced equation for the complete combustion of butane, $\\ce{C4H10}$.", steps:[
      {t:"$\\ce{C4H10 + O2 -> CO2 + H2O}$",why:"A hydrocarbon burns to carbon dioxide and water (p. 3)."},
      {t:"$\\ce{C4H10 + O2 -> 4CO2 + 5H2O}$",why:"4 C go to 4 $\\ce{CO2}$. 10 H make 5 $\\ce{H2O}$."},
      {t:"O on the right: $4(2) + 5 = 13$ atoms, which is $\\tfrac{13}{2}$ $\\ce{O2}$.",why:"Balance O last, since $\\ce{O2}$ contains nothing else."},
      {t:"$\\ce{2C4H10 + 13O2 -> 8CO2 + 10H2O}$",why:"Double everything to clear the half."},
      {t:"Check: C 8 = 8, H 20 = 20, O 26 = 16 + 10.",why:"Every element matches."}], ans:"$\\ce{2C4H10 + 13O2 -> 8CO2 + 10H2O}$"}},
    {type:"explore", title:"Count atoms while you balance", fig:"counter", ref:"p. 3", body:"<p>Try each equation. Notice that a single change can unbalance an element you already fixed. When that happens, go back and balance the element that appears in the most compounds first.</p>"},
    {type:"try", title:"Balance equations", gen:"M1C1.g.balance"},
    {type:"firstline", title:"Find the first mistake", q:"A student balances the reaction of aluminum with oxygen to make aluminum oxide:", lines:["Unbalanced: $\\ce{Al + O2 -> Al2O3}$","O: 2 on the left, 3 on the right. Lowest common multiple 6.","Write $\\ce{Al + 3O2 -> Al2O6}$ so O is 6 on both sides.","Then Al: $\\ce{2Al + 3O2 -> Al2O6}$."], wrong:2, why:"Changing $\\ce{Al2O3}$ to $\\ce{Al2O6}$ changes the substance. The right move is coefficients: $\\ce{4Al + 3O2 -> 2Al2O3}$."},
    {type:"try", title:"Write combustion equations", gen:"M1C1.g.combustion"},
    {type:"read", title:"Ionic and molecular compounds behave differently in water", ref:"pp. 5-6", body:"<p>A <b>solution</b> is a uniform mixture of solutes in a solvent; (aq) means the solvent is water.</p><p><b>Ionic compounds</b> are made of positive and negative ions in a repeating pattern (NaCl, $\\ce{K2SO4}$, $\\ce{NH4NO3}$). They are solids. When one dissolves, the ions separate and each is surrounded by water: the O end of water points at cations, the H end at anions.</p><p><b>Molecular compounds</b> are neutral molecules held together by covalent bonds ($\\ce{H2O}$, $\\ce{CCl4}$, $\\ce{CO2}$). They can be solids, liquids or gases. When they dissolve, the molecules stay whole unless they react with water to form ions (as HCl does).</p><p>Quick test: a metal ion or $\\ce{NH4+}$ paired with an anion means ionic. Only nonmetals, and no $\\ce{NH4+}$, means molecular.</p>"},
    {type:"explore", title:"Look at three molecules", fig:"shapes", ref:"p. 6", body:"<p>These are molecules, not ion lattices: each is a separate, neutral unit. Compare their shapes, which the notes show on p. 6.</p>"},
    {type:"read", title:"Know the common polyatomic ions", ref:"p. 5", body:"<p>A polyatomic ion is a charged group of atoms that stays together in a compound. Learn these formulas and charges:</p><table class=\"cn-table\"><tr><td>$\\ce{H3O+}$ hydronium</td><td>$\\ce{OH-}$ hydroxide</td><td>$\\ce{NH4+}$ ammonium</td></tr><tr><td>$\\ce{NO3-}$ nitrate</td><td>$\\ce{NO2-}$ nitrite</td><td>$\\ce{CN-}$ cyanide</td></tr><tr><td>$\\ce{CNO-}$ cyanate</td><td>$\\ce{SCN-}$ thiocyanate</td><td>$\\ce{HCO2-}$ formate</td></tr><tr><td>$\\ce{SO4^2-}$ sulfate</td><td>$\\ce{HSO4-}$ hydrogen sulfate</td><td>$\\ce{CO3^2-}$ carbonate</td></tr><tr><td>$\\ce{HCO3-}$ hydrogen carbonate</td><td>$\\ce{PO4^3-}$ phosphate</td><td>$\\ce{HPO4^2-}$ hydrogen phosphate</td></tr><tr><td>$\\ce{H2PO4-}$ dihydrogen phosphate</td><td>$\\ce{PO3^3-}$ phosphite</td><td>$\\ce{O2^2-}$ peroxide</td></tr><tr><td>$\\ce{C2H3O2-}$ acetate</td><td>$\\ce{ClO4-}$ perchlorate</td><td>$\\ce{ClO3-}$ chlorate</td></tr><tr><td>$\\ce{ClO2-}$ chlorite</td><td>$\\ce{ClO-}$ hypochlorite</td><td>$\\ce{MnO4-}$ permanganate</td></tr><tr><td>$\\ce{CrO4^2-}$ chromate</td><td>$\\ce{Cr2O7^2-}$ dichromate</td><td></td></tr></table><p>Patterns help: per-, -ate, -ite, hypo- go from most to fewest O atoms, and each H added to an anion makes its charge one less negative.</p>"},
    {type:"try", title:"Polyatomic ions", gen:"M1C1.g.ions"},
    {type:"mcq", title:"Ionic or molecular?", multi:true, q:"Which of these are ionic compounds? Select all that apply.", opts:[["$\\ce{SO3}$",false,"Only nonmetals: molecular."],["$\\ce{NH4HCO2}$",true,"Ammonium formate: $\\ce{NH4+}$ and $\\ce{HCO2-}$."],["$\\ce{CH3COOH}$",false,"Acetic acid is molecular (it makes a few ions in water by reacting with it)."],["$\\ce{Li2CO3}$",true,"$\\ce{Li+}$ and $\\ce{CO3^2-}$."],["$\\ce{HBr}$",false,"Molecular; it ionizes when it reacts with water."]], after:"Ammonium compounds are ionic even with no metal present."},
    {type:"formulas", title:"Rules and ions to know"}
  ]
});
})();
