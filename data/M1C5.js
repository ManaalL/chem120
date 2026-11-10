/* Chapter 1.5 (Fri Sep 18): Limiting reagent and percent yield. Course notes Module 1, pp. 18-22 (section 1.3).
   Theoretical yield, limiting and excess reagents, percent yield; mass, solution and liquid (density) versions
   (Pre-Class Example p. 19, Examples 1-14 to 1-16). */
(function(){
const M=C120, CH=M.chem;
const ceD=f=>String(f).replace(/NaN/g,"Na{}N");
const mm=f=>CH.mm(f), mw=f=>CH.mmWork(f);
const q=(v,sf,u)=>M.qty(v,sf,u), t4=v=>M.numTeX(v,4);
const pct=(v,sf=3)=>`${M.toSig(v,sf)}\\%`;
/* values that round up to a power of ten (99.97 to 3 sf) display with an extra digit; avoid them */
const edge=(v,sf=3)=>{ const a=Math.abs(v), e=Math.floor(Math.log10(a)); return Math.round(a/Math.pow(10,e-sf+1))>=Math.pow(10,sf); };
const side=(sp,co)=>sp.map((s,i)=>(co[i]!==1?co[i]:"")+s).join(" + ");
const eqTeX=(L,R,c)=>`\\ce{${ceD(side(L,c.slice(0,L.length)))} -> ${ceD(side(R,c.slice(L.length)))}}`;
const eqBare=(L,R)=>`\\ce{${ceD(L.join(" + "))} -> ${ceD(R.join(" + "))}}`;
/* two-reactant reactions (balanced) */
const RX=[[["H2","O2"],["H2O"],[2,1,2]],[["N2","H2"],["NH3"],[1,3,2]],[["Fe","O2"],["Fe2O3"],[4,3,2]],[["Na","Cl2"],["NaCl"],[2,1,2]],[["CH4","O2"],["CO2","H2O"],[1,2,1,2]],
  [["C3H8","O2"],["CO2","H2O"],[1,5,3,4]],[["SO2","O2"],["SO3"],[2,1,2]],[["NH3","O2"],["NO","H2O"],[4,5,4,6]],[["Fe2O3","CO"],["Fe","CO2"],[1,3,2,3]],[["P4","Cl2"],["PCl3"],[1,6,4]],
  [["NO","O2"],["NO2"],[2,1,2]],[["CS2","O2"],["CO2","SO2"],[1,3,1,2]],[["SiO2","C"],["SiC","CO"],[1,3,1,2]],[["Zn","HCl"],["ZnCl2","H2"],[1,2,1,1]],[["Mg","HCl"],["MgCl2","H2"],[1,2,1,1]],
  [["C2H6","O2"],["CO2","H2O"],[2,7,4,6]],[["CaO","C"],["CaC2","CO"],[1,3,1,1]],[["Li","N2"],["Li3N"],[6,1,2]],[["K","Br2"],["KBr"],[2,1,2]],[["Al","S"],["Al2S3"],[2,3,1]]];
/* precipitations from two solutions: [r1, r2, ppt, c1, c2, cppt] (balanced) */
const PPT=[["AgNO3","NaCl","AgCl",1,1,1],["AgNO3","KBr","AgBr",1,1,1],["BaCl2","Na2SO4","BaSO4",1,1,1],["CaCl2","Na2CO3","CaCO3",1,1,1],["Pb(NO3)2","KI","PbI2",1,2,1],
  ["AgNO3","CaCl2","AgCl",2,1,2],["Pb(NO3)2","NaCl","PbCl2",1,2,1],["CaCl2","Na3PO4","Ca3(PO4)2",3,2,1],["Ba(NO3)2","K2SO4","BaSO4",1,1,1]];
const PPT_EQ={"AgNO3+NaCl":"AgNO3 + NaCl -> AgCl + NaNO3","AgNO3+KBr":"AgNO3 + KBr -> AgBr + KNO3","BaCl2+Na2SO4":"BaCl2 + Na2SO4 -> BaSO4 + 2NaCl","CaCl2+Na2CO3":"CaCl2 + Na2CO3 -> CaCO3 + 2NaCl",
  "Pb(NO3)2+KI":"Pb(NO3)2 + 2KI -> PbI2 + 2KNO3","AgNO3+CaCl2":"2AgNO3 + CaCl2 -> 2AgCl + Ca(NO3)2","Pb(NO3)2+NaCl":"Pb(NO3)2 + 2NaCl -> PbCl2 + 2NaNO3","CaCl2+Na3PO4":"3CaCl2 + 2Na3PO4 -> Ca3(PO4)2 + 6NaCl","Ba(NO3)2+K2SO4":"Ba(NO3)2 + K2SO4 -> BaSO4 + 2KNO3"};
/* liquid esterifications: [alcohol, its density, ester, its density, name]. Densities are given in the problem (not from the notes); acetic acid 1.05 g/mL is from p. 22 */
const LIQ=[["C2H6O",0.789,"C4H8O2",0.902,"ethyl acetate","ethanol"],["CH4O",0.791,"C3H6O2",0.932,"methyl acetate","methanol"],["C3H8O",0.803,"C5H10O2",0.888,"propyl acetate","propan-1-ol"],["C5H12O",0.810,"C7H14O2",0.876,"isoamyl acetate","isoamyl alcohol"]];
/* pick a two-reactant problem where neither reactant is close to the exact stoichiometric amount */
function setup(R,d){ for(;;){ const [L,Rr,co]=R.pick(RX); const p=R.int(0,Rr.length-1); const nA=R.sig(0.6,6,3), nB=R.sig(0.6,6,3);
  const yA=nA*co[L.length+p]/co[0], yB=nB*co[L.length+p]/co[1]; const r=yA/yB; if(Math.abs(r-1)<0.08) continue; return {L,Rr,co,p,nA,nB,yA,yB,lim:yA<yB?0:1}; } }

M.chapter({
  id:"M1C5", module:"m1", n:5, num:"1.5", date:"2026-09-18", added:"2026-10-26", quiz:"PC1",
  title:"Limiting reagent and percent yield", pages:"18-22", sections:["1.3"],
  summary:"The reactant that runs out first, the limiting reagent, sets the theoretical yield. Percent yield compares what you actually got with that maximum.",
  flags:[
    {ref:"p. 22", text:"Example 1-16 describes cinnamic acid as \"a yellow liquid\" with density 1.25 g mL<sup>−1</sup>. Real cinnamic acid is a white crystalline solid at room temperature (not from the notes). Treat the state and density as made-up data for the exercise; the calculation method is unaffected."}
  ],
  formulas:[
    {id:"M1C5.f.percent-yield", name:"Percent yield", ref:"p. 18", tex:"\\%\\ \\text{yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}}\\times100",
      blank:{tex:"\\%\\ \\text{yield} = \\frac{\\text{actual yield}}{\\boxed{\\,?\\,}}\\times100", accept:["theoretical yield","theoretical"]}},
    {id:"M1C5.f.theoretical", name:"Theoretical yield", kind:"rule", ref:"p. 18", tex:"\\text{theoretical yield} = \\text{maximum product, set by the limiting reagent}",
      blank:{tex:"\\text{theoretical yield is set by the }\\boxed{\\,?\\,}", accept:["limiting reagent","limiting reactant","limiting"]}},
    {id:"M1C5.f.limiting", name:"Finding the limiting reagent", kind:"rule", ref:"p. 19", tex:"\\text{work out the product each reactant could make; the smaller amount wins}", note:"Compare moles of product, never grams of reactant. The other reactant is in excess and some of it is left over.",
      blank:{tex:"\\text{The reactant that gives the }\\boxed{\\,?\\,}\\text{ product is limiting}", accept:["least","less","smallest amount of","least amount of","smaller amount of"]}},
    {id:"M1C5.f.liquid", name:"Mass of a liquid from its volume", ref:"p. 22", tex:"m = \\rho V", note:"Used when reactants or products are measured in mL (Example 1-16). From $\\rho = m/V$ (p. 13).",
      blank:{tex:"m = \\boxed{\\,?\\,}\\times V", accept:["ρ","rho","density","p"]}},
    {id:"M1C5.f.solution", name:"Moles in a solution", ref:"p. 21", tex:"n = cV\\quad(V\\text{ in L})", note:"Used for each solution in Example 1-15.",
      blank:{tex:"n = c\\times\\boxed{\\,?\\,}", accept:["V","volume","V (L)"]}}
  ],
  glossary:[
    {id:"M1C5.t.theoretical", term:"Theoretical yield", def:"The maximum amount of product that can form, calculated from the limiting reagent.", ref:"p. 18"},
    {id:"M1C5.t.limiting", term:"Limiting reagent (limiting reactant)", def:"The reactant that runs out first and so limits how much product can form.", ref:"p. 18"},
    {id:"M1C5.t.excess", term:"Excess reagent", def:"A reactant present in more than the amount needed; some of it is left when the reaction stops.", ref:"p. 18"},
    {id:"M1C5.t.actual", term:"Actual yield", def:"The amount of product really obtained in an experiment.", ref:"p. 18"},
    {id:"M1C5.t.percent", term:"Percent yield", def:"Actual yield divided by theoretical yield, times 100.", ref:"p. 18"}
  ],
  figures:{
    lim3d:{title:"Nitrogen and hydrogen make ammonia", cap:"Start with 4 $\\ce{N2}$ and 9 $\\ce{H2}$. Each $\\ce{N2}$ needs 3 $\\ce{H2}$. Run the reaction and see which molecules are left.", ref:"p. 18",
      model:{type:"particles", params:{scenario:"limiting", reaction:"n2-h2", a:4, b:9}},
      predict:{q:"With 4 $\\ce{N2}$ and 9 $\\ce{H2}$ ($\\ce{N2 + 3H2 -> 2NH3}$), which reactant runs out first?", opts:[["$\\ce{N2}$, because there are fewer of them",false,"Fewer molecules does not mean limiting: 4 $\\ce{N2}$ would need 12 $\\ce{H2}$."],["$\\ce{H2}$",true,"9 $\\ce{H2}$ use only 3 $\\ce{N2}$. 6 $\\ce{NH3}$ form and 1 $\\ce{N2}$ is left."],["Neither: they run out together",false,"That needs exactly 3 $\\ce{H2}$ per $\\ce{N2}$."]], check:"Run the reaction and count the $\\ce{NH3}$ made and the leftover $\\ce{N2}$."}},
    calc:{title:"Limiting reagent and yield calculator", cap:"Set the masses of the two reactants. Each bar is the mass of product that reactant alone could make; the shorter bar is the theoretical yield. Then set the actual yield to see the percent yield. Data-sheet molar masses.", ref:"pp. 18-19",
      build(host,{PLOT,M}){
        const OPTS=[[["Na","Cl2"],["NaCl"],[2,1,2]],[["Fe2O3","CO"],["Fe","CO2"],[1,3,2,3]],[["N2","H2"],["NH3"],[1,3,2]],[["C3H8","O2"],["CO2","H2O"],[1,5,3,4]],[["Zn","HCl"],["ZnCl2","H2"],[1,2,1,1]]];
        let k=0, mA=10, mB=12, act=80;
        const ctl=PLOT.controls(host);
        const lab=document.createElement("label"); lab.innerHTML="<span>Reaction</span>"; const sel=document.createElement("select"); OPTS.forEach((o,i)=>sel.append(new Option(`${side(o[0],o[2])} → ${side(o[1],o[2].slice(o[0].length))}`,i))); lab.append(sel); ctl.append(lab);
        const sA=PLOT.slider(ctl,{label:"Mass of reactant A (g)",min:1,max:100,step:0.5,value:mA,oninput:v=>{ mA=v; draw(); }});
        const sB=PLOT.slider(ctl,{label:"Mass of reactant B (g)",min:1,max:100,step:0.5,value:mB,oninput:v=>{ mB=v; draw(); }});
        const sY=PLOT.slider(ctl,{label:"Actual yield (% of the theoretical mass you recover)",min:0,max:100,value:act,oninput:v=>{ act=v; draw(); }});
        const svgHost=document.createElement("div"); host.append(svgHost); const out=PLOT.readout(host);
        function draw(){ const [L,Rr,co]=OPTS[k]; const P=Rr[0], cp=co[L.length]; const MP=CH.mm(P);
          sA.previousElementSibling.querySelector("span").innerHTML=`Mass of ${L[0]} (g)`; sB.previousElementSibling.querySelector("span").innerHTML=`Mass of ${L[1]} (g)`;
          const nA=mA/CH.mm(L[0]), nB=mB/CH.mm(L[1]); const yA=nA*cp/co[0]*MP, yB=nB*cp/co[1]*MP; const th=Math.min(yA,yB); const lim=yA<=yB?0:1;
          const W=520,H=120, max=Math.max(yA,yB)*1.1, X=v=>110+v/max*(W-130);
          const bar=(y,v,t,on)=>`<text x="0" y="${y+15}">${t}</text><rect x="110" y="${y}" width="${X(v)-110}" height="22" rx="4" style="fill:var(--c);fill-opacity:${on?.85:.25};stroke:var(--c)"/><text x="${X(v)+6}" y="${y+15}">${v.toFixed(2)} g ${P}${on?" (limiting)":""}</text>`;
          svgHost.innerHTML=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="Product possible from each reactant">${bar(10,yA,"from "+L[0],lim===0)}${bar(44,yB,"from "+L[1],lim===1)}<rect x="110" y="80" width="${Math.max(0,X(th*act/100)-110)}" height="22" rx="4" style="fill:var(--ok);fill-opacity:.7"/><text x="0" y="95">actual</text><text x="${X(th*act/100)+6}" y="95">${(th*act/100).toFixed(2)} g</text></svg>`;
          const ex=lim===0?L[1]:L[0]; const nEx=lim===0?nB-nA*co[1]/co[0]:nA-nB*co[0]/co[1]; const left=nEx*CH.mm(ex);
          out.innerHTML=M.rich(`Limiting: <b>${lim===0?L[0]:L[1]}</b>. Theoretical yield ${th.toFixed(2)} g $\\ce{${ceD(P)}}$. ${ex} left over: ${left.toFixed(2)} g. Percent yield $= ${(th*act/100).toFixed(2)}/${th.toFixed(2)}\\times100 = ${act}\\%$.`); }
        sel.onchange=()=>{ k=+sel.value; draw(); }; draw();
      }}
  },
  gens:[
    {id:"M1C5.g.kit", title:"Limiting parts in a model kit", skill:"Spot the part that runs out", ref:"p. 18",
      gen(R,d){
        const KITS=[["H2O","H",2,"O",1],["NH3","H",3,"N",1],["CO2","O",2,"C",1],["CH4","H",4,"C",1],["H2O2","H",2,"O",2],["C2H6","H",6,"C",2],["SO3","O",3,"S",1]];
        let k,x,y,n,leftA,leftB; do{ k=R.pick(KITS); x=R.int(d===1?6:10,d===1?20:60); y=R.int(d===1?3:5,d===1?12:30); n=Math.min(Math.floor(x/k[2]),Math.floor(y/k[4])); leftA=x-n*k[2]; leftB=y-n*k[4]; }while(n<2||(leftA===0&&leftB===0)||Math.floor(x/k[2])===Math.floor(y/k[4]));
        const limA=Math.floor(x/k[2])<Math.floor(y/k[4]); const ex=limA?k[3]:k[1], left=limA?leftB:leftA;
        return {prompt:`A model kit has ${x} ${k[1]} balls and ${y} ${k[3]} balls. Each $\\ce{${k[0]}}$ model needs ${k[2]} ${k[1]} and ${k[4]} ${k[3]}. How many complete models can you build, and how many ${ex} balls are left over?`,
          parts:[{label:`Number of $\\ce{${k[0]}}$ models`,answer:{type:"int",value:n}},{label:`${ex} balls left over`,answer:{type:"int",value:left}}],
          hint:"Work out how many models each kind of ball could make on its own. The smaller number is the most you can build.",
          steps:[`${k[1]}: $${x}\\div${k[2]} = ${(x/k[2]).toFixed(2).replace(/\.00$/,"")}$, so at most ${Math.floor(x/k[2])} models.`,`${k[3]}: $${y}\\div${k[4]} = ${(y/k[4]).toFixed(2).replace(/\.00$/,"")}$, so at most ${Math.floor(y/k[4])} models.`,`The ${limA?k[1]:k[3]} balls run out first (the limiting part): ${n} models, the theoretical yield.`,`${ex} used: $${n}\\times${limA?k[4]:k[2]} = ${n*(limA?k[4]:k[2])}$; left over: ${left}.`],
          answerTeX:`${n} models; ${left} ${ex} left`};
      }},
    {id:"M1C5.g.limiting", title:"Which reagent limits, and what is left?", skill:"Compare product from each reactant", ref:"p. 19",
      gen(R,d){
        const S=setup(R,d); const {L,Rr,co,p}=S; const P=Rr[p], A=L[0], B=L[1]; const opts=[A,B].map(x=>`$\\ce{${ceD(x)}}$`);
        const eq=d===3?eqBare(L,Rr):eqTeX(L,Rr,co);
        if(d===1){ const nEx=S.lim===0?S.nB-S.nA*co[1]/co[0]:S.nA-S.nB*co[0]/co[1]; const ex=S.lim===0?B:A; const nP=Math.min(S.yA,S.yB);
          return {prompt:`${M.toSig(S.nA,3)} mol of $\\ce{${ceD(A)}}$ and ${M.toSig(S.nB,3)} mol of $\\ce{${ceD(B)}}$ react: $$${eq}$$`,
            parts:[{label:"Limiting reagent",answer:{type:"mc",options:opts,correct:S.lim}},{label:`Moles of $\\ce{${ceD(P)}}$ formed`,answer:{type:"num",value:nP,unit:"mol",sf:3}},{label:`Moles of $\\ce{${ceD(ex)}}$ left over`,answer:{type:"num",value:nEx,unit:"mol",sf:3}}],
            hint:"Find the moles of product each reactant could make. The smaller is the answer; the other reactant is in excess.",
            steps:[`From $\\ce{${ceD(A)}}$: $${M.toSig(S.nA,3)}\\times\\frac{${co[L.length+p]}}{${co[0]}} = ${q(S.yA,4,"mol")}$ $\\ce{${ceD(P)}}$`,`From $\\ce{${ceD(B)}}$: $${M.toSig(S.nB,3)}\\times\\frac{${co[L.length+p]}}{${co[1]}} = ${q(S.yB,4,"mol")}$ $\\ce{${ceD(P)}}$`,`$\\ce{${ceD(S.lim===0?A:B)}}$ gives less, so it is limiting: ${M.toSig(nP,3)} mol $\\ce{${ceD(P)}}$.`,`$\\ce{${ceD(ex)}}$ used: $${M.numTeX(S.lim===0?S.nA:S.nB,3)}\\times\\frac{${co[S.lim===0?1:0]}}{${co[S.lim]}} = ${t4((S.lim===0?S.nA:S.nB)*co[S.lim===0?1:0]/co[S.lim])}$ mol; left: ${q(nEx,3,"mol")}.`],
            answerTeX:`$\\ce{${ceD(S.lim===0?A:B)}}$ limits; ${q(nP,3,"mol")} $\\ce{${ceD(P)}}$; ${q(nEx,3,"mol")} $\\ce{${ceD(ex)}}$ left`, verify:{values:[null,Math.min(S.nA*co[L.length+p]/co[0],S.nB*co[L.length+p]/co[1]),nEx]}}; }
        /* by mass, with the excess left in grams */
        let mA,mB,nA,nB,yA,yB; do{ mA=R.sig(4,80,3); mB=R.sig(4,80,3); nA=mA/mm(A); nB=mB/mm(B); yA=nA*co[L.length+p]/co[0]; yB=nB*co[L.length+p]/co[1]; }while(Math.abs(yA/yB-1)<0.08);
        const lim=yA<yB?0:1, ex=lim===0?B:A, nUsed=lim===0?nA*co[1]/co[0]:nB*co[0]/co[1], mLeft=(lim===0?mB:mA)-nUsed*mm(ex);
        return {prompt:`${d===3?"For the unbalanced reaction":"For"} $$${eq}$$ ${M.toSig(mA,3)} g of $\\ce{${ceD(A)}}$ and ${M.toSig(mB,3)} g of $\\ce{${ceD(B)}}$ react as far as possible.`,
          parts:[{label:"Limiting reagent",answer:{type:"mc",options:opts,correct:lim}},{label:`Mass of $\\ce{${ceD(ex)}}$ left over`,answer:{type:"num",value:mLeft,unit:"g",sf:3}}],
          hint:"Convert both masses to moles. Find which one makes less product. Then work out how much of the other one is used, and subtract.",
          steps:[...(d===3?[`Balance: $${eqTeX(L,Rr,co)}$`]:[]),`$n_{\\ce{${ceD(A)}}} = ${M.toSig(mA,3)}/${M.num(mm(A),3)} = ${q(nA,4,"mol")}$; $n_{\\ce{${ceD(B)}}} = ${M.toSig(mB,3)}/${M.num(mm(B),3)} = ${q(nB,4,"mol")}$`,
            `Product possible: from $\\ce{${ceD(A)}}$ ${t4(yA)} mol, from $\\ce{${ceD(B)}}$ ${t4(yB)} mol $\\ce{${ceD(P)}}$. $\\ce{${ceD(lim===0?A:B)}}$ is limiting.`,
            `$\\ce{${ceD(ex)}}$ used: ${t4(nUsed)} mol $= ${q(nUsed*mm(ex),4,"g")}$`,`Left: $${M.toSig(lim===0?mB:mA,3)} - ${M.numTeX(nUsed*mm(ex),4)} = ${q(mLeft,3,"g")}$`],
          answerTeX:`$\\ce{${ceD(lim===0?A:B)}}$ limits; ${q(mLeft,3,"g")} of $\\ce{${ceD(ex)}}$ left`, verify:{values:[null,(lim===0?mB-mA/mm(A)*co[1]/co[0]*mm(B):mA-mB/mm(B)*co[0]/co[1]*mm(A))]}};
      }},
    {id:"M1C5.g.theoretical", title:"Theoretical yield from two masses", skill:"Limiting reagent to grams of product", ref:"p. 19",
      gen(R,d){
        let S,mA,mB,nA,nB,yA,yB,P,A,B; for(;;){ S=setup(R,d); A=S.L[0]; B=S.L[1]; P=S.Rr[S.p]; mA=R.sig(3,90,3); mB=R.sig(3,90,3); nA=mA/mm(A); nB=mB/mm(B); yA=nA*S.co[S.L.length+S.p]/S.co[0]; yB=nB*S.co[S.L.length+S.p]/S.co[1]; const th=Math.min(yA,yB)*mm(P); if(Math.abs(yA/yB-1)>0.08 && th>0.2 && th<990 && !edge(th)) break; }
        const lim=yA<yB?0:1; const mP=Math.min(yA,yB)*mm(P); const eq=d===3?eqBare(S.L,S.Rr):eqTeX(S.L,S.Rr,S.co);
        return {prompt:`What is the theoretical yield of $\\ce{${ceD(P)}}$ when ${M.toSig(mA,3)} g of $\\ce{${ceD(A)}}$ reacts with ${M.toSig(mB,3)} g of $\\ce{${ceD(B)}}$? $$${eq}$$${d===3?" (The equation is not balanced.)":""}`,
          answer:{type:"num",value:mP,unit:"g",sf:3},
          hint:"Work out the product from each reactant separately. The smaller amount is the theoretical yield.",
          steps:[...(d===3?[`Balance: $${eqTeX(S.L,S.Rr,S.co)}$`]:[]),`From $\\ce{${ceD(A)}}$: $\\dfrac{${M.toSig(mA,3)}}{${M.num(mm(A),3)}}\\times\\dfrac{${S.co[S.L.length+S.p]}}{${S.co[0]}} = ${q(yA,4,"mol")}$ $\\ce{${ceD(P)}}$`,`From $\\ce{${ceD(B)}}$: $\\dfrac{${M.toSig(mB,3)}}{${M.num(mm(B),3)}}\\times\\dfrac{${S.co[S.L.length+S.p]}}{${S.co[1]}} = ${q(yB,4,"mol")}$ $\\ce{${ceD(P)}}$`,
            `$\\ce{${ceD(lim===0?A:B)}}$ is limiting. Theoretical yield $= ${t4(Math.min(yA,yB))}\\ \\mathrm{mol}\\times${M.num(mm(P),3)}\\ \\mathrm{g\\,mol^{-1}} = ${q(mP,3,"g")}$`],
          answerTeX:`$${q(mP,3,"g")}$`, verify:{value:Math.min(mA/mm(A)/S.co[0],mB/mm(B)/S.co[1])*S.co[S.L.length+S.p]*mm(P)}};
      }},
    {id:"M1C5.g.percent-yield", title:"Percent yield", skill:"Actual over theoretical", ref:"p. 18",
      gen(R,d){
        if(d===1){ const th=R.sig(5,90,3); const a=+(th*R.real(0.45,0.97,3)).toPrecision(3); const y=100*a/th;
          return {prompt:`A reaction has a theoretical yield of ${M.toSig(th,3)} g. ${M.toSig(a,3)} g of product is collected. What is the percent yield?`, answer:{type:"num",value:y,unit:"%",sf:3},
            hint:"% yield = actual ÷ theoretical × 100.", steps:[`$\\%\\ \\text{yield} = \\dfrac{${M.toSig(a,3)}}{${M.toSig(th,3)}}\\times100 = ${pct(y)}$`], answerTeX:`$${pct(y)}$`, verify:{value:a/th*100}}; }
        if(d===2){ let S,mA,mB,nA,nB,yA,yB,P,A,B,th; for(;;){ S=setup(R,d); A=S.L[0]; B=S.L[1]; P=S.Rr[S.p]; mA=R.sig(3,90,3); mB=R.sig(3,90,3); nA=mA/mm(A); nB=mB/mm(B); yA=nA*S.co[S.L.length+S.p]/S.co[0]; yB=nB*S.co[S.L.length+S.p]/S.co[1]; th=Math.min(yA,yB)*mm(P); if(Math.abs(yA/yB-1)>0.08 && th>0.3 && th<990) break; }
          const a=+(th*R.real(0.45,0.95,3)).toPrecision(3); const y=100*a/th; const lim=yA<yB?0:1;
          return {prompt:`${M.toSig(mA,3)} g of $\\ce{${ceD(A)}}$ and ${M.toSig(mB,3)} g of $\\ce{${ceD(B)}}$ react, and ${M.toSig(a,3)} g of $\\ce{${ceD(P)}}$ is obtained. What is the percent yield? $$${eqTeX(S.L,S.Rr,S.co)}$$`, answer:{type:"num",value:y,unit:"%",sf:3},
            hint:"Find the limiting reagent and the theoretical yield first, then compare.",
            steps:[`Product from $\\ce{${ceD(A)}}$: ${t4(yA)} mol; from $\\ce{${ceD(B)}}$: ${t4(yB)} mol. $\\ce{${ceD(lim===0?A:B)}}$ limits.`,`Theoretical yield $= ${t4(Math.min(yA,yB))}\\times${M.num(mm(P),3)} = ${q(th,4,"g")}$`,`$\\%\\ \\text{yield} = \\dfrac{${M.toSig(a,3)}}{${M.numTeX(th,4)}}\\times100 = ${pct(y)}$`], answerTeX:`$${pct(y)}$`, verify:{value:100*a/(Math.min(mA/mm(A)/S.co[0],mB/mm(B)/S.co[1])*S.co[S.L.length+S.p]*mm(P))}}; }
        /* liquids measured by volume (Example 1-16 style) */
        const [al,rA,es,rE,esName,alName]=R.pick(LIQ); const rAc=1.05; let VA,VB,nA,nB,th,Va;
        do{ VA=R.sig(3,12,3); VB=R.sig(3,12,3); nA=VA*rA/mm(al); nB=VB*rAc/mm("C2H4O2"); }while(Math.abs(nA/nB-1)<0.08);
        th=Math.min(nA,nB)*mm(es); Va=+(th*R.real(0.5,0.92,3)/rE).toPrecision(3); const a=Va*rE; const y=100*a/th; const lim=nA<nB?alName:"acetic acid";
        return {prompt:`${esName} ($\\ce{${es}}$) is made from ${alName} ($\\ce{${al}}$, density ${rA} g mL<sup>−1</sup>) and acetic acid ($\\ce{C2H4O2}$, density 1.05 g mL<sup>−1</sup>): $$\\ce{${al} + C2H4O2 -> ${es} + H2O}$$ ${M.toSig(VA,3)} mL of ${alName} and ${M.toSig(VB,3)} mL of acetic acid give ${M.toSig(Va,3)} mL of ${esName} (density ${rE} g mL<sup>−1</sup>). What is the percent yield? (Densities are given; molar masses from the data sheet.)`,
          answer:{type:"num",value:y,unit:"%",sf:3},
          hint:"Turn every volume into a mass with $m = \\rho V$, then into moles. Find the limiting reagent, then compare masses of product.",
          steps:[`$n_{\\ce{${al}}} = \\dfrac{${M.toSig(VA,3)}\\times${rA}}{${M.num(mm(al),3)}} = ${q(nA,4,"mol")}$`,`$n_{\\ce{C2H4O2}} = \\dfrac{${M.toSig(VB,3)}\\times1.05}{${M.num(mm("C2H4O2"),3)}} = ${q(nB,4,"mol")}$`,`1 : 1 ratio, so ${lim} is limiting. Theoretical $= ${t4(Math.min(nA,nB))}\\times${M.num(mm(es),3)} = ${q(th,4,"g")}$`,`Actual $= ${M.toSig(Va,3)}\\ \\mathrm{mL}\\times${rE} = ${q(a,4,"g")}$`,`$\\%\\ \\text{yield} = \\dfrac{${M.numTeX(a,4)}}{${M.numTeX(th,4)}}\\times100 = ${pct(y)}$`],
          answerTeX:`$${pct(y)}$`, verify:{value:100*Va*rE/(mm(es)*Math.min(VA*rA/mm(al),VB*rAc/mm("C2H4O2")))}};
      }},
    {id:"M1C5.g.solutions", title:"Precipitate from two solutions", skill:"$n = cV$ for each, then the limiting reagent", ref:"p. 21",
      gen(R,d){
        const pool=d===1?PPT.filter(p=>p[3]===1&&p[4]===1):d===2?PPT.filter(p=>p[3]+p[4]<=3):PPT;
        const [r1,r2,pp,c1,c2,cp]=R.pick(pool); let V1,M1,V2,M2,n1,n2,y1,y2;
        do{ V1=R.sig(10,50,3); M1=R.sig(0.05,0.5,3); V2=R.sig(10,50,3); M2=R.sig(0.05,0.5,3); n1=V1*M1/1000; n2=V2*M2/1000; y1=n1*cp/c1; y2=n2*cp/c2; }while(Math.abs(y1/y2-1)<0.08);
        const lim=y1<y2?0:1; const mP=Math.min(y1,y2)*mm(pp);
        return {prompt:`What mass of $\\ce{${pp}}$ precipitates when ${M.toSig(V1,3)} mL of ${M.toSig(M1,3)} M $\\ce{${r1}}$(aq) is mixed with ${M.toSig(V2,3)} mL of ${M.toSig(M2,3)} M $\\ce{${r2}}$(aq)? $$\\ce{${ceD(PPT_EQ[r1+"+"+r2])}}$$`,
          answer:{type:"num",value:mP,unit:"g",sf:3},
          hint:"Moles of each solute from $n = cV$ (V in litres). Then find which one makes less precipitate.",
          steps:[`$n_{\\ce{${r1}}} = ${M.toSig(M1,3)}\\times${M.numTeX(V1/1000,3)} = ${q(n1,4,"mol")}$`,`$n_{\\ce{${r2}}} = ${M.toSig(M2,3)}\\times${M.numTeX(V2/1000,3)} = ${q(n2,4,"mol")}$`,`Precipitate possible: ${q(y1,4,"mol")} from $\\ce{${r1}}$, ${q(y2,4,"mol")} from $\\ce{${r2}}$. $\\ce{${lim?r2:r1}}$ is limiting.`,`$m = ${t4(Math.min(y1,y2))}\\times${M.num(mm(pp),3)} = ${q(mP,3,"g")}$`],
          answerTeX:`$${q(mP,3,"g")}$`, verify:{value:Math.min(V1*M1/c1,V2*M2/c2)/1000*cp*mm(pp)}};
      }}
  ],
  exam:[
    {id:"M1C5.q1", ref:"p. 18", q:"Which statement about the limiting reagent is correct?", opts:[["It is the reactant present in the smallest mass.",false,"Mass alone can mislead; molar masses and coefficients matter."],["It is the reactant that runs out first and fixes the theoretical yield.",true,"Definition, p. 18."],["It is the reactant with the smallest coefficient.",false,"Coefficients alone don't decide; amounts do."],["It is left over when the reaction stops.",false,"That is the excess reagent."],["It is always the more expensive reactant.",false,"Not a chemical idea."]]},
    {id:"M1C5.q2", ref:"p. 18", q:"A model needs 3 white pieces and 1 black piece. You have 14 white and 6 black pieces. Which is true?", opts:[["4 models; black is in excess and 4 black pieces are left.",false,"4 models use 4 black pieces, so 6 − 4 = 2 are left."],["4 models; white is limiting; 2 black pieces are left.",true,"14 ÷ 3 = 4 (and 2 white spare, not enough for a fifth); 6 black could make 6. White limits; 6 − 4 = 2 black left."],["6 models; black is limiting.",false,"Six models would need 18 white pieces."],["4 models; black is limiting.",false,"Black could make 6 models; white runs out first."],["5 models; white is limiting.",false,"Five models need 15 white pieces."]]},
    {id:"M1C5.q3", ref:"p. 19", q:"4.0 mol $\\ce{H2}$ reacts with 3.0 mol $\\ce{O2}$: $\\ce{2H2 + O2 -> 2H2O}$. Which is correct?", opts:[["$\\ce{O2}$ is limiting and 6.0 mol $\\ce{H2O}$ forms.",false,"3.0 mol $\\ce{O2}$ would need 6.0 mol $\\ce{H2}$; there is only 4.0."],["$\\ce{H2}$ is limiting, 4.0 mol $\\ce{H2O}$ forms and 1.0 mol $\\ce{O2}$ is left.",true,"4.0 mol $\\ce{H2}$ uses 2.0 mol $\\ce{O2}$."],["$\\ce{H2}$ is limiting and 2.0 mol $\\ce{H2O}$ forms.",false,"$\\ce{H2}$ and $\\ce{H2O}$ are in a 1 : 1 ratio."],["Neither is limiting.",false,"They are not in a 2 : 1 ratio."],["$\\ce{H2}$ is limiting and 2.0 mol $\\ce{O2}$ is left.",false,"2.0 mol $\\ce{O2}$ is used, so 1.0 mol is left."]]},
    {id:"M1C5.q4", ref:"p. 18", q:"The theoretical yield of a reaction is 15.0 g and 12.4 g of product is collected. What is the percent yield?", opts:[["82.7%",true,"$12.4/15.0\\times100$"],["121%",false,"That divides theoretical by actual."],["17.3%",false,"That is the percent lost."],["2.60%",false,"Divide, don't subtract."],["12.4%",false,"The actual yield is not a percentage by itself."]]},
    {id:"M1C5.q5", ref:"p. 21", q:"What mass of AgCl forms when 20.0 mL of 0.100 M $\\ce{AgNO3}$ is mixed with 10.0 mL of 0.150 M NaCl?", opts:[["0.215 g",true,"NaCl: $1.50\\times10^{-3}$ mol, less than $\\ce{AgNO3}$ ($2.00\\times10^{-3}$). $1.50\\times10^{-3}\\times143.35$."],["0.287 g",false,"That uses $\\ce{AgNO3}$, the excess reagent."],["0.502 g",false,"That adds the two amounts."],["0.0717 g",false,"That uses the difference in moles."],["2.15 g",false,"Check the mL to L conversion."]]},
    {id:"M1C5.q6", ref:"p. 18", multi:true, q:"Which statements are true? Select all that apply.", opts:[["Some of the excess reagent is left when the reaction stops.",true,"That is what excess means."],["The theoretical yield is calculated from the limiting reagent.",true,"p. 18."],["Percent yield uses the actual yield divided by the theoretical yield.",true,"p. 18."],["The limiting reagent is always the one with fewer moles.",false,"Coefficients matter: 4 $\\ce{N2}$ is not limiting against 9 $\\ce{H2}$."],["The actual yield is usually larger than the theoretical yield.",false,"The theoretical yield is the maximum."]]}
  ],
  steps:[
    {type:"read", title:"The ingredient that runs out first decides the yield", ref:"p. 18", body:"<p>The notes use a grilled cheese sandwich: 2 slices of bread + 1 slice of cheese → 1 sandwich. With 6 slices of bread and 5 of cheese you can make only 3 sandwiches, and 2 slices of cheese are left.</p><ul><li>The <b>limiting reagent</b> (bread) runs out first and limits the product.</li><li>The <b>excess reagent</b> (cheese) is left over.</li><li>The <b>theoretical yield</b> (3 sandwiches) is the maximum amount of product.</li></ul><p>Reactions work the same way, except the ratio comes from the coefficients and the amounts must be in moles.</p>"},
    {type:"try", title:"Count models from a kit", gen:"M1C5.g.kit", diff:1},
    {type:"explore", title:"Run a reaction with an excess", fig:"lim3d", ref:"p. 18", body:"<p>There are fewer $\\ce{N2}$ molecules than $\\ce{H2}$, yet $\\ce{N2}$ is the excess reagent. What matters is how many of each the equation needs, not which you have fewer of.</p>"},
    {type:"read", title:"Find the limiting reagent by comparing products", ref:"p. 19", body:"<p>The safest method: for <b>each</b> reactant, do the mole method as if the other were unlimited, and find how much product it could make. The reactant that gives the <b>smaller</b> amount is limiting, and that smaller amount is the theoretical yield.</p><ol><li>Convert each reactant to moles ($n = m/M$, or $n = cV$ for solutions, or $m = \\rho V$ first for liquids).</li><li>Multiply each by (coefficient of product) ÷ (its own coefficient).</li><li>The smaller result is the theoretical yield in moles; convert to grams.</li></ol><p>To find what is left over, work out how much of the excess reagent the limiting one uses up, and subtract.</p>"},
    {type:"example", title:"Sodium and chlorine", ref:"p. 19 (like the Pre-Class Example)", ex:{q:"10.0 g of Na reacts with 12.0 g of $\\ce{Cl2}$: $\\ce{2Na + Cl2 -> 2NaCl}$. Which reagent is limiting, and what is the theoretical yield of NaCl?", steps:[
      {t:"$n_\\mathrm{Na} = 10.0/22.99 = 0.4350$ mol, so it could make 0.4350 mol NaCl.",why:"2 Na give 2 NaCl: 1 : 1."},
      {t:"$n_{\\ce{Cl2}} = 12.0/70.90 = 0.1693$ mol, so it could make $0.1693\\times2 = 0.3385$ mol NaCl.",why:"1 $\\ce{Cl2}$ gives 2 NaCl."},
      {t:"$\\ce{Cl2}$ gives less, so $\\ce{Cl2}$ is limiting.",why:"Even though there is more mass of $\\ce{Cl2}$ than of Na."},
      {t:"Theoretical yield $= 0.3385\\times58.44 = 19.8$ g NaCl",why:"$M(\\ce{NaCl}) = 22.99 + 35.45$."}], ans:"$\\ce{Cl2}$ is limiting; 19.8 g NaCl"}},
    {type:"explore", title:"Change the amounts and watch the limit switch", fig:"calc", ref:"pp. 18-19", body:"<p>Increase the mass of the limiting reactant until its bar passes the other one. At that point the limit switches, and adding more of the first reactant no longer makes more product.</p>"},
    {type:"try", title:"Limiting reagent and leftovers", gen:"M1C5.g.limiting"},
    {type:"try", title:"Theoretical yield", gen:"M1C5.g.theoretical"},
    {type:"read", title:"Percent yield compares reality with the maximum", ref:"p. 18", body:"<p>$$\\%\\ \\text{yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}}\\times100$$</p><p>If one of the 3 sandwiches burns, the actual yield is 2 and the percent yield is $2/3\\times100 = 66.7\\%$. In the lab, product is lost in transfers and purification, so the actual yield is usually below the theoretical yield. Both yields must be in the same units (both grams, or both moles).</p>"},
    {type:"mcq", title:"What sets the theoretical yield?", q:"In Example 1-14, ammonia and copper(II) oxide react to make $\\ce{N2}$. To find the percent yield, which amount do you divide the measured $\\ce{N2}$ mass by?", opts:[["The $\\ce{N2}$ that the limiting reagent could make",true,"That is the theoretical yield."],["The $\\ce{N2}$ that the excess reagent could make",false,"The excess reagent can't all react."],["The total mass of reactants",false,"Percent yield compares product with product."],["The mass of the limiting reagent",false,"Compare product with the product it could make."]], after:"Always find the limiting reagent before the percent yield."},
    {type:"try", title:"Percent yield", gen:"M1C5.g.percent-yield"},
    {type:"read", title:"Solutions and liquids: convert to moles first", ref:"pp. 21-22", body:"<p>Nothing changes except step 1 of the mole method:</p><ul><li><b>Solutions</b> (Example 1-15): $n = cV$ for each reactant, with $V$ in litres. Then compare as usual.</li><li><b>Liquids measured by volume</b> (Example 1-16): $m = \\rho V$ gives grams, then $n = m/M$. If the product is also measured in mL, convert it to grams with its density before comparing with the theoretical yield.</li></ul>"},
    {type:"try", title:"Precipitate from two solutions", gen:"M1C5.g.solutions"},
    {type:"firstline", title:"Find the first mistake", q:"8.00 g of $\\ce{H2}$ and 32.0 g of $\\ce{O2}$ react: $\\ce{2H2 + O2 -> 2H2O}$. A student finds the theoretical yield:", lines:["There are fewer grams of $\\ce{H2}$, so $\\ce{H2}$ is limiting.","$n_{\\ce{H2}} = 8.00/2.016 = 3.968$ mol","$n_{\\ce{H2O}} = 3.968$ mol","Theoretical yield $= 3.968\\times18.02 = 71.5$ g"], wrong:0, why:"Compare moles of product, not grams of reactant. $\\ce{O2}$: $32.0/32.00 = 1.000$ mol, which can make 2.000 mol $\\ce{H2O}$, less than the 3.968 mol from $\\ce{H2}$. $\\ce{O2}$ is limiting and the yield is $2.000\\times18.02 = 36.0$ g. (A yield bigger than the 40.0 g of reactants is impossible anyway.)"},
    {type:"formulas", title:"Formulas to know"}
  ]
});
})();
