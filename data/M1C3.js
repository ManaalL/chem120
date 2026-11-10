/* Chapter 1.3 (Mon Sep 14): Acids, bases and net ionic equations. Course notes Module 1, pp. 9-12 (section 1.2).
   Bronsted-Lowry acids and bases, the strong acids and strong bases to know, neutralization, molecular and net ionic equations
   (Examples 1-7, 1-8 and 1-9). */
(function(){
const M=C120;
const ceD=f=>String(f).replace(/NaN/g,"Na{}N");
const gcd=(a,b)=>M.gcd(a,b);
/* acids: h = acidic H atoms, an = anion formula part, q = anion charge, strong per p. 9 */
const ACID={HCl:{h:1,an:"Cl",name:"hydrochloric acid",strong:true},HBr:{h:1,an:"Br",name:"hydrobromic acid",strong:true},HI:{h:1,an:"I",name:"hydroiodic acid",strong:true},
  HClO4:{h:1,an:"ClO4",name:"perchloric acid",strong:true},HBrO4:{h:1,an:"BrO4",name:"perbromic acid",strong:true},HIO4:{h:1,an:"IO4",name:"periodic acid",strong:true},
  HNO3:{h:1,an:"NO3",name:"nitric acid",strong:true},H2SO4:{h:2,an:"SO4",name:"sulfuric acid",strong:true},
  HF:{h:1,an:"F",name:"hydrofluoric acid",strong:false},CH3COOH:{h:1,an:"CH3COO",name:"acetic acid",strong:false},HCN:{h:1,an:"CN",name:"hydrocyanic acid",strong:false},HNO2:{h:1,an:"NO2",name:"nitrous acid",strong:false}};
const BASE={NaOH:{cat:"Na",q:1,name:"sodium hydroxide"},KOH:{cat:"K",q:1,name:"potassium hydroxide"},LiOH:{cat:"Li",q:1,name:"lithium hydroxide"},RbOH:{cat:"Rb",q:1,name:"rubidium hydroxide"},
  "Ca(OH)2":{cat:"Ca",q:2,name:"calcium hydroxide"},"Ba(OH)2":{cat:"Ba",q:2,name:"barium hydroxide"},"Sr(OH)2":{cat:"Sr",q:2,name:"strontium hydroxide"}};
const ionTxt=(s,q,sign)=>q===1?`${s}${sign}`:`${s}^${q}${sign}`;
const polyA=a=>/[A-Z].*[A-Z0-9]/.test(a);
function salt(cat,qc,an,qa){ const l=qc*qa/gcd(qc,qa), nc=l/qc, na=l/qa; const p=(s,n,poly)=>n===1?s:(poly?`(${s})${n}`:`${s}${n}`); return p(cat,nc,cat==="NH4")+p(an,na,polyA(an)); }
const co=(n,f)=>(n>1?n:"")+f;
/* molecular, net ionic and spectators for acid + base. base may be "NH3" (only with strong acids) */
function neut(A,B){
  const a=ACID[A];
  if(B==="NH3"){ const s=salt("NH4",1,a.an,a.h); return {mol:`${co(a.h,"NH3")}(aq) + ${A}(aq) -> ${s}(aq)`, net:`NH3(aq) + H+(aq) -> NH4+(aq)`, spect:[ionTxt(a.an,a.h,"-")], water:0, salt:s}; }
  const b=BASE[B]; const g=gcd(a.h,b.q); const ca=b.q/g, cb=a.h/g, w=ca*a.h; const s=salt(b.cat,b.q,a.an,a.h);
  const mol=`${co(ca,A)}(aq) + ${co(cb,B)}(aq) -> ${s}(aq) + ${co(w,"H2O")}(l)`;
  const net=a.strong?`H+(aq) + OH-(aq) -> H2O(l)`:`${A}(aq) + OH-(aq) -> ${ionTxt(a.an,1,"-")}(aq) + H2O(l)`;
  const spect=[ionTxt(b.cat,b.q,"+")].concat(a.strong?[ionTxt(a.an,a.h,"-")]:[]);
  return {mol,net,spect,water:w,salt:s};
}
/* acid + base pairs that stay simple: no precipitate among the products (p. 7) and no salts the guidelines don't cover */
function okPair(A,B){ const a=ACID[A]; if(B==="NH3") return a.strong; const b=BASE[B];
  if(b.q===2 && A==="H2SO4") return false;                 /* CaSO4, BaSO4, SrSO4 precipitate */
  if(b.q===2 && !a.strong && A!=="CH3COOH") return false;  /* fluorides, cyanides, nitrites of group 2 are not covered */
  return true; }
/* identify the acid and base (Example 1-7 style) */
const ID=[["HNO3 + H2O -> H3O+ + NO3-","HNO3","H2O","H3O+"],["HCN + H2O <=> H3O+ + CN-","HCN","H2O","H3O+"],["NH3 + H2O <=> NH4+ + OH-","H2O","NH3","NH4+"],
  ["H- + H2O -> H2 + OH-","H2O","H-","H2"],["CH3O- + H2O -> CH3OH + OH-","H2O","CH3O-","CH3OH"],["HF + OH- -> F- + H2O","HF","OH-","H2O"],
  ["CH3COOH + NH3 -> CH3COO- + NH4+","CH3COOH","NH3","NH4+"],["NH4+ + OH- -> NH3 + H2O","NH4+","OH-","H2O"],["H2SO4 + H2O -> H3O+ + HSO4-","H2SO4","H2O","H3O+"],
  ["HSO4- + H2O <=> H3O+ + SO4^2-","HSO4-","H2O","H3O+"],["CO3^2- + H2O <=> HCO3- + OH-","H2O","CO3^2-","HCO3-"],["HBr + NH3 -> NH4+ + Br-","HBr","NH3","NH4+"],["CN- + H2O <=> HCN + OH-","H2O","CN-","HCN"]];
/* classify a species (p. 9) */
const KIND=[["HCl","Strong acid"],["HBr","Strong acid"],["HI","Strong acid"],["HClO4","Strong acid"],["HBrO4","Strong acid"],["HIO4","Strong acid"],["HNO3","Strong acid"],["H2SO4","Strong acid"],
  ["HF","Weak acid"],["CH3COOH","Weak acid"],["HCN","Weak acid"],["HNO2","Weak acid"],["HClO","Weak acid"],
  ["LiOH","Strong base"],["NaOH","Strong base"],["KOH","Strong base"],["RbOH","Strong base"],["Mg(OH)2","Strong base"],["Ca(OH)2","Strong base"],["Sr(OH)2","Strong base"],["Ba(OH)2","Strong base"],["NaH","Strong base"],["K2O","Strong base"],
  ["NH3","Weak base"]];
const KIND_WHY={"Strong acid":"It is one of the eight strong acids listed on p. 9: it ionizes completely in water.","Weak acid":"It is not on the list of strong acids (p. 9), so treat it as weak: only some of its molecules react with water.","Strong base":"Group 1 and group 2 hydroxides, hydrides and oxides are the strong bases on p. 9 (hydride and oxide ions react with water to give $\\ce{OH-}$).","Weak base":"Ammonia accepts $\\ce{H+}$ from water, but only partly; it is not a hydroxide, hydride or oxide."};
/* precipitations for the mixed net ionic generator (p. 7 rules) */
const PPT=[["Pb(NO3)2","Na2SO4","Pb^2+(aq) + SO4^2-(aq) -> PbSO4(s)"],["AgNO3","KI","Ag+(aq) + I-(aq) -> AgI(s)"],["CuCl2","Na2S","Cu^2+(aq) + S^2-(aq) -> CuS(s)"],
  ["Fe(NO3)3","NaOH","Fe^3+(aq) + 3OH-(aq) -> Fe(OH)3(s)"],["MgCl2","K2CO3","Mg^2+(aq) + CO3^2-(aq) -> MgCO3(s)"],["ZnCl2","KOH","Zn^2+(aq) + 2OH-(aq) -> Zn(OH)2(s)"],["Sr(NO3)2","Li2SO4","Sr^2+(aq) + SO4^2-(aq) -> SrSO4(s)"]];

M.chapter({
  id:"M1C3", module:"m1", n:3, num:"1.3", date:"2026-09-14", added:"2026-10-26", quiz:"PC1",
  title:"Acids, bases and net ionic equations", pages:"9-12", sections:["1.2"],
  summary:"An acid gives away $\\ce{H+}$ and a base takes it. Eight strong acids and the group 1 and 2 hydroxides ionize completely; every other acid on this course is weak and stays mostly as molecules, which is how it is written in a net ionic equation.",
  flags:[],
  formulas:[
    {id:"M1C3.f.bronsted", name:"Brønsted-Lowry acid and base", kind:"rule", ref:"p. 9", tex:"\\text{acid} = \\ce{H+}\\text{ donor};\\quad \\text{base} = \\ce{H+}\\text{ acceptor}", note:"An acid-base reaction is a proton transfer from the acid to the base.",
      blank:{tex:"\\text{A base is a proton (}\\ce{H+}\\text{) }\\boxed{\\,?\\,}", accept:["acceptor","accepter"]}},
    {id:"M1C3.f.strong-acids", name:"The strong acids", kind:"rule", ref:"p. 9", tex:"\\ce{HCl},\\ \\ce{HBr},\\ \\ce{HI},\\ \\ce{HClO4},\\ \\ce{HBrO4},\\ \\ce{HIO4},\\ \\ce{HNO3},\\ \\ce{H2SO4}", note:"HF is <b>not</b> a strong acid, even though HCl, HBr and HI are.",
      blank:{tex:"\\text{The binary acid of a halogen that is NOT strong: }\\boxed{\\,?\\,}", accept:["HF","hydrofluoric acid"]}},
    {id:"M1C3.f.strong-bases", name:"The strong bases", kind:"rule", ref:"p. 9", tex:"\\text{group 1 hydroxides (very soluble)};\\ \\text{group 2 hydroxides (slightly soluble)};\\ \\ce{H-},\\ \\ce{O^2-}", note:"Hydride and oxide ions react with water to give $\\ce{OH-}$.",
      blank:{tex:"\\ce{H-}\\text{ and }\\ce{O^2-}\\text{ react with water to give }\\boxed{\\,?\\,}", accept:["OH-","hydroxide","OH^-","hydroxide ions"]}},
    {id:"M1C3.f.binary", name:"Binary acid", kind:"rule", ref:"p. 9", tex:"\\ce{H_{n}X}", note:"H and one other element; the acidic H is bonded to X. In an oxoacid the acidic H is bonded to O.",
      blank:{tex:"\\text{In an oxoacid, the acidic H is bonded to }\\boxed{\\,?\\,}", accept:["O","oxygen"]}},
    {id:"M1C3.f.diprotic", name:"Sulfuric acid is diprotic", kind:"rule", ref:"p. 9", tex:"\\ce{H2SO4 + H2O -> H3O+ + HSO4-},\\quad \\ce{HSO4- + H2O -> H3O+ + SO4^2-}", note:"Two acidic H atoms, removed in two separate steps. One mole of $\\ce{H2SO4}$ neutralizes two moles of $\\ce{OH-}$.",
      blank:{tex:"\\ce{H2SO4}\\text{ has }\\boxed{\\,?\\,}\\text{ acidic H atoms}", accept:["2","two"]}},
    {id:"M1C3.f.neutralization", name:"Neutralization", kind:"rule", ref:"p. 10", tex:"\\text{acid} + \\text{base} \\longrightarrow \\text{salt}\\ (+\\ \\ce{H2O}\\text{, often})", note:"If either the acid or the base is strong, the reaction goes essentially to completion (100%).",
      blank:{tex:"\\text{acid} + \\text{base} \\longrightarrow \\boxed{\\,?\\,}\\ (+\\ \\ce{H2O})", accept:["salt","a salt"]}}
  ],
  glossary:[
    {id:"M1C3.t.acid", term:"Brønsted-Lowry acid", def:"A proton ($\\ce{H+}$) donor. In water it protonates water molecules, giving $\\ce{H3O+}$.", ref:"p. 9"},
    {id:"M1C3.t.base", term:"Brønsted-Lowry base", def:"A proton ($\\ce{H+}$) acceptor. In water it deprotonates water molecules, giving $\\ce{OH-}$.", ref:"p. 9"},
    {id:"M1C3.t.strong", term:"Strong acid or base", def:"Every molecule reacts with water: it ionizes completely.", ref:"p. 9"},
    {id:"M1C3.t.oxoacid", term:"Oxoacid", def:"An acid containing H, O and at least one other element, with the acidic H bonded to O (e.g. $\\ce{HNO3}$).", ref:"p. 9"},
    {id:"M1C3.t.diprotic", term:"Diprotic acid", def:"An acid with two acidic H atoms, which ionize in two separate steps ($\\ce{H2SO4}$).", ref:"p. 9"},
    {id:"M1C3.t.salt", term:"Salt", def:"The ionic compound formed from the base's cation and the acid's anion in a neutralization.", ref:"p. 10"},
    {id:"M1C3.t.titration", term:"Acid-base titration", def:"A lab method of analysis that uses a neutralization going 100% to completion.", ref:"p. 10"}
  ],
  figures:{
    acids3d:{title:"Where the acidic hydrogen sits", cap:"Nitric acid and sulfuric acid are oxoacids: each acidic H is bonded to an O. Hydrogen chloride is a binary acid: its H is bonded directly to Cl.", ref:"p. 9",
      model:{type:"molecule", params:{molecule:"HNO3", choices:["HNO3","H2SO4","HCl"], polarity:false, fcToggle:false, geoToggle:false}},
      predict:{q:"In nitric acid, $\\ce{HNO3}$, which atom is the acidic H attached to?", opts:[["N",false,"In an oxoacid the acidic H is never on the central atom."],["O",true,"Oxoacids have their acidic H bonded to oxygen (p. 9)."],["It is not bonded to anything",false,"Before it ionizes, the H is covalently bonded in the molecule."]], check:"Rotate HNO3 and follow the bond from the H atom. Then compare H2SO4 and HCl."}},
    builder:{title:"Net ionic equation builder", cap:"Choose an acid and a base. Strong acids, strong bases and soluble salts are written as ions; weak acids, ammonia and water stay whole. The ions that appear unchanged on both sides are the spectators.", ref:"pp. 10-12",
      build(host,{PLOT,M}){
        const ctl=PLOT.controls(host);
        const mk=(t,keys,val,lab)=>{ const l=document.createElement("label"); l.innerHTML=`<span>${t}</span>`; const s=document.createElement("select"); keys.forEach(k=>s.append(new Option(lab(k),k))); s.value=val; l.append(s); ctl.append(l); return s; };
        const sa=mk("Acid",Object.keys(ACID),"HF",k=>`${k} (${ACID[k].strong?"strong":"weak"})`);
        const sb=mk("Base",[...Object.keys(BASE),"NH3"],"KOH",k=>k==="NH3"?"NH3 (weak)":`${k} (strong)`);
        const out=document.createElement("div"); host.append(out);
        function ionic(A,B){ const a=ACID[A]; const N=neut(A,B);
          const L=[]; const Rr=[];
          if(B==="NH3"){ L.push(`${co(a.h,"NH3")}`); }
          else { const b=BASE[B]; const g=gcd(a.h,b.q), ca=b.q/g, cb=a.h/g; L.push(`${co(cb,ionTxt(b.cat,b.q,"+"))} + ${co(cb*b.q,"OH-")}`); }
          const ca=B==="NH3"?1:BASE[B].q/gcd(a.h,BASE[B].q);
          if(a.strong) L.push(`${co(ca*a.h,"H+")} + ${co(ca,ionTxt(a.an,a.h,"-"))}`); else L.push(co(ca,A));
          if(B==="NH3"){ Rr.push(`${co(a.h,"NH4+")} + ${ionTxt(a.an,a.h,"-")}`); }
          else { const b=BASE[B]; const g=gcd(a.h,b.q), cb=a.h/g; Rr.push(`${co(cb,ionTxt(b.cat,b.q,"+"))} + ${co(ca,ionTxt(a.an,a.h,"-"))}`); Rr.push(co(N.water,"H2O")); }
          return `${L.join(" + ")} -> ${Rr.join(" + ")}`; }
        function draw(){ const A=sa.value, B=sb.value;
          if(!okPair(A,B)){ out.innerHTML=M.rich(`<div class="box warn">${B==="NH3"?"A weak acid with a weak base is not covered in the notes.":A==="H2SO4"?"The sulfate of this group 2 metal is insoluble (rule 5), so a precipitate forms as well. Pick another pair.":"The guidelines on p. 7 don't cover this salt. Pick another pair."}</div>`); return; }
          const N=neut(A,B);
          out.innerHTML=M.rich(`<p><b>Molecular</b><br>$\\ce{${ceD(N.mol)}}$</p><p><b>Ionic</b> (strong electrolytes split)<br>$\\ce{${ionic(A,B)}}$</p><p><b>Spectators</b>: ${N.spect.map(x=>`$\\ce{${x}}$`).join(" and ")}</p><p><b>Net ionic</b><br>$\\ce{${N.net}}$</p><p class="muted small">${ACID[A].strong?`${A} is strong, so it is written as ions.`:`${A} is weak, so it is written as whole molecules.`}${B==="NH3"?" No water forms: the H+ goes onto NH3.":""}</p>`); }
        sa.onchange=draw; sb.onchange=draw; draw();
      }}
  },
  gens:[
    {id:"M1C3.g.kind", title:"Strong or weak, acid or base?", skill:"Know the strong acids and strong bases", ref:"p. 9",
      gen(R,d){
        const pool=d===1?KIND.filter(k=>["HCl","HNO3","H2SO4","HF","CH3COOH","NaOH","KOH","Ca(OH)2","NH3","HBr"].includes(k[0])):d===2?KIND.filter(k=>!["NaH","K2O","HClO"].includes(k[0])):KIND.filter(k=>["HIO4","HBrO4","HClO4","HF","HClO","HCN","HNO2","Mg(OH)2","Sr(OH)2","NaH","K2O","NH3","HI","H2SO4"].includes(k[0]));
        const [f,k]=R.pick(pool); const opts=["Strong acid","Weak acid","Strong base","Weak base"];
        return {prompt:`How is $\\ce{${f}}$ classified in this course?`,
          answer:{type:"mc",options:opts,correct:opts.indexOf(k),keep:true},
          hint:"Learn the eight strong acids. Any other acid here is weak. Strong bases are group 1 and 2 hydroxides, plus hydride and oxide ions.",
          steps:[KIND_WHY[k],`So $\\ce{${f}}$ is a <b>${k.toLowerCase()}</b>.`], answerTeX:k};
      }},
    {id:"M1C3.g.identify", title:"Find the acid and the base", skill:"Follow the proton", ref:"p. 10",
      gen(R,d){
        const pool=d===1?ID.filter(x=>x[2]==="H2O"||x[1]==="H2O").slice(0,6):ID;
        const [eq,acid,base,got]=R.pick(pool); const opts=[acid,base].sort(); const tex=x=>`$\\ce{${x}}$`;
        const st=[`Find the reactant that loses an $\\ce{H+}$: $\\ce{${acid}}$. It is the acid (proton donor).`,`The other reactant gains the $\\ce{H+}$ and becomes $\\ce{${got}}$: $\\ce{${base}}$ is the base (proton acceptor).`];
        if(d<3) return {prompt:`In the reaction below, which reactant is the acid? $$\\ce{${eq}}$$`, answer:{type:"mc",options:opts.map(tex),correct:opts.indexOf(acid)},
          hint:"Compare each reactant with the products. The acid ends up with one H fewer.", steps:st, answerTeX:tex(acid)};
        return {prompt:`For the reaction below, which reactant is the acid, and which product formed when the base accepted the proton? $$\\ce{${eq}}$$`,
          parts:[{label:"The acid",answer:{type:"mc",options:opts.map(tex),correct:opts.indexOf(acid)}},{label:"Formula of the product made from the base (with charge if any)",answer:{type:"formula",answer:got}}],
          hint:"The base gains one H and its charge goes up by one.", steps:st, answerTeX:`acid $\\ce{${acid}}$; the base becomes $\\ce{${got}}$`};
      }},
    {id:"M1C3.g.neutralize", title:"Balance a neutralization", skill:"Acid + base gives salt + water", ref:"p. 11",
      gen(R,d){
        const acids=d===1?["HCl","HNO3","HBr"]:d===2?["HCl","HNO3","HBr","HClO4","H2SO4","HI"]:["H2SO4","CH3COOH","HClO4","HF","HNO3","HCN"];
        const bases=d===1?["NaOH","KOH","LiOH"]:[...Object.keys(BASE),...(d===3?["NH3"]:[])];
        let A,B,t=0; do{ A=R.pick(acids); B=R.pick(bases); t++; }while(!okPair(A,B)&&t<200);
        const N=neut(A,B); const plain=N.mol.replace(/\((aq|l|s)\)/g,"");
        return {prompt:`Write the balanced molecular equation for the reaction of aqueous ${ACID[A].name} ($\\ce{${A}}$) with ${B==="NH3"?"aqueous ammonia":BASE[B].name} ($\\ce{${B}}$). States are optional.`,
          answer:{type:"equation",answer:plain},
          hint:B==="NH3"?"Ammonia takes the $\\ce{H+}$ and becomes $\\ce{NH4+}$. No water forms.":"The salt is the base's cation with the acid's anion. Each $\\ce{H+}$ from the acid meets one $\\ce{OH-}$ to make one $\\ce{H2O}$.",
          steps:[B==="NH3"?`Ammonia accepts the proton: $\\ce{NH3 + H+ -> NH4+}$, so the salt is $\\ce{${N.salt}}$.`:`Ions in the salt: $\\ce{${ionTxt(BASE[B].cat,BASE[B].q,"+")}}$ and $\\ce{${ionTxt(ACID[A].an,ACID[A].h,"-")}}$, so the salt is $\\ce{${ceD(N.salt)}}$.`,
            B==="NH3"?`Balance N: ${ACID[A].h} $\\ce{NH3}$ per $\\ce{${A}}$.`:`$\\ce{H+}$ from the acid must equal $\\ce{OH-}$ from the base: ${N.water} of each, giving ${N.water} $\\ce{H2O}$.`,
            `$\\ce{${ceD(N.mol)}}$`], answerTeX:`$\\ce{${ceD(N.mol)}}$`};
      }},
    {id:"M1C3.g.net", title:"Net ionic equations: acid-base or precipitation", skill:"Split only strong electrolytes", ref:"p. 12",
      gen(R,d){
        const kinds=d===1?["sa-sb","wa-sb"]:d===2?["sa-sb","wa-sb","nh3","ppt"]:["wa-sb","nh3","nh4","co3","ppt","ppt"];
        const k=R.pick(kinds); let r1,r2,net,type="Acid-base",why;
        if(k==="sa-sb"){ let A,B; do{ A=R.pick(["HCl","HBr","HI","HNO3","HClO4"]); B=R.pick(["NaOH","KOH","LiOH"]); }while(!okPair(A,B)); r1=A; r2=B; net="H+(aq) + OH-(aq) -> H2O(l)"; why=`Both are strong, so both are written as ions. The cation of the base and the anion of the acid are spectators.`; }
        if(k==="wa-sb"){ const A=R.pick(["HF","CH3COOH","HCN","HNO2"]); const B=R.pick(["NaOH","KOH","LiOH"]); r1=A; r2=B; net=neut(A,B).net; why=`$\\ce{${A}}$ is a weak acid, so it stays as molecules. $\\ce{${B}}$ is strong, so only its $\\ce{OH-}$ reacts; $\\ce{${BASE[B].cat}+}$ is a spectator.`; }
        if(k==="nh3"){ const A=R.pick(["HCl","HBr","HNO3","HClO4","HI"]); r1="NH3"; r2=A; net="NH3(aq) + H+(aq) -> NH4+(aq)"; why=`Ammonia is a weak base and stays as molecules. The strong acid is ions; its anion is a spectator.`; }
        if(k==="nh4"){ const S=R.pick(["NH4Cl","NH4NO3","NH4Br"]); const B=R.pick(["NaOH","KOH"]); r1=S; r2=B; net="NH4+(aq) + OH-(aq) -> NH3(aq) + H2O(l)"; why=`$\\ce{NH4+}$ gives its $\\ce{H+}$ to $\\ce{OH-}$ (it acts as the acid). The other ions are spectators.`; }
        if(k==="co3"){ const S=R.pick(["Na2CO3","K2CO3"]); const A=R.pick(["HCl","HNO3","HBr"]); r1=S; r2=A; net="CO3^2-(aq) + 2H+(aq) -> H2O(l) + CO2(g)"; why=`The carbonate ion takes two $\\ce{H+}$ and the products are water and carbon dioxide gas, as for $\\ce{CaCO3}$ + HCl (p. 4). The metal ion and the acid's anion are spectators.`; }
        if(k==="ppt"){ const p=R.pick(PPT); r1=p[0]; r2=p[1]; net=p[2]; type="Precipitation"; why=`No acid is present. Swapping partners gives an insoluble solid (p. 7); the other ions are spectators.`; }
        return {prompt:`Aqueous $\\ce{${r1}}$ and $\\ce{${r2}}$ are mixed. Write the net ionic equation, and classify the reaction. Write a hydrogen ion as H+ (it means $\\ce{H3O+}$ here). States are optional.`,
          parts:[{label:"Net ionic equation",answer:{type:"equation",answer:net}},{label:"Type of reaction",answer:{type:"mc",options:["Acid-base","Precipitation"],correct:type==="Acid-base"?0:1,keep:true}}],
          hint:"Write strong acids, strong bases and soluble salts as ions. Keep weak acids, ammonia, water, gases and solids as whole formulas. Then cancel the spectators.",
          steps:[why,`Net ionic: $\\ce{${net}}$`,`Type: ${type.toLowerCase()}.`], answerTeX:`$\\ce{${net}}$ (${type.toLowerCase()})`};
      }}
  ],
  exam:[
    {id:"M1C3.q1", ref:"p. 9", q:"Which of these acids is NOT a strong acid?", opts:[["HI",false,"Strong (binary acid)."],["$\\ce{HIO4}$",false,"Periodic acid is on the strong list."],["HF",true,"The notes stress that HF is not strong, unlike HCl, HBr and HI."],["$\\ce{HBrO4}$",false,"Perbromic acid is strong."],["$\\ce{H2SO4}$",false,"Strong, and diprotic."]]},
    {id:"M1C3.q2", ref:"p. 10", q:"Aqueous ammonia reacts with hydrochloric acid: $\\ce{NH3 + HCl -> NH4Cl}$. Which statement is correct?", opts:[["It is a neutralization that produces no water.",true,"A neutralization always gives a salt, but not always water (p. 10)."],["It does not go to completion because ammonia is weak.",false,"If either reactant is strong, it goes essentially to completion. HCl is strong."],["It is a precipitation reaction.",false,"$\\ce{NH4Cl}$ is soluble (rule 2)."],["HCl is the base.",false,"HCl donates the proton: it is the acid."],["Water is produced along with the salt.",false,"There is no water among the products."]]},
    {id:"M1C3.q3", ref:"p. 12", q:"What is the net ionic equation for the reaction of HF(aq) with KOH(aq)?", opts:[["$\\ce{H+(aq) + OH-(aq) -> H2O(l)}$",false,"That would treat HF as strong. HF is weak, so it stays as HF."],["$\\ce{HF(aq) + OH-(aq) -> F-(aq) + H2O(l)}$",true,"Weak acid kept whole; $\\ce{K+}$ is the only spectator."],["$\\ce{HF(aq) + KOH(aq) -> KF(aq) + H2O(l)}$",false,"That is the molecular equation."],["$\\ce{K+(aq) + F-(aq) -> KF(s)}$",false,"KF is soluble (rule 1)."],["$\\ce{F-(aq) + H2O(l) -> HF(aq) + OH-(aq)}$",false,"Reversed, and not what happens here."]]},
    {id:"M1C3.q4", ref:"p. 10", q:"In $\\ce{H- + H2O -> H2 + OH-}$, what role does water play?", opts:[["Acid: it donates $\\ce{H+}$ to the hydride ion",true,"Water loses an H and becomes $\\ce{OH-}$."],["Base: it accepts $\\ce{H+}$",false,"Water ends with one H fewer, so it gave the proton away."],["Spectator",false,"Water changes into $\\ce{OH-}$."],["Salt",false,"No salt is formed."],["Neither; no proton moves",false,"A proton moves from $\\ce{H2O}$ to $\\ce{H-}$."]]},
    {id:"M1C3.q5", ref:"p. 9", q:"How many moles of NaOH are needed to neutralize 1 mol of $\\ce{H2SO4}$ completely?", opts:[["0.5 mol",false,"That would be true if NaOH had two hydroxides."],["1 mol",false,"$\\ce{H2SO4}$ has two acidic H atoms."],["2 mol",true,"$\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$"],["3 mol",false,"Only two protons are available."],["4 mol",false,"Count acidic H atoms: 2."]]},
    {id:"M1C3.q6", ref:"p. 9", multi:true, q:"Which of these are strong bases? Select all that apply.", opts:[["KOH",true,"Group 1 hydroxide."],["$\\ce{Ba(OH)2}$",true,"Group 2 hydroxide (only slightly soluble, but strong)."],["$\\ce{NH3}$",false,"A weak base."],["NaH",true,"Hydride ion reacts with water to give $\\ce{OH-}$."],["$\\ce{CH3COOH}$",false,"An acid."]]},
    {id:"M1C3.q7", ref:"p. 12", q:"Aqueous $\\ce{FeCl3}$ and NaOH are mixed. How should this reaction be classified?", opts:[["Precipitation: $\\ce{Fe^3+}$ and $\\ce{OH-}$ form insoluble $\\ce{Fe(OH)3}$",true,"No proton moves; a solid forms (rule 7)."],["Acid-base, because NaOH is a base",false,"There is no acid to give a proton; $\\ce{OH-}$ is used to make a solid."],["No reaction",false,"$\\ce{Fe(OH)3}$ is insoluble."],["Combustion",false,"No fuel or oxidant."],["Single displacement",false,"No element replaces another."]]}
  ],
  steps:[
    {type:"read", title:"Acids donate protons; bases accept them", ref:"p. 9", body:"<p>The course uses the <b>Brønsted-Lowry</b> definitions. An <b>acid</b> is a proton ($\\ce{H+}$) donor. A <b>base</b> is a proton acceptor. Every acid-base reaction is a proton transfer, from the acid to the base, like passing a ball from one player to another.</p><p>In water, an acid hands its proton to water molecules and makes $\\ce{H3O+}$. A base takes a proton from water molecules and leaves $\\ce{OH-}$.</p><p>A <b>strong</b> acid or base reacts completely with water: every molecule ionizes. A weak one reacts only partly.</p>"},
    {type:"explore", title:"Find the acidic hydrogen", fig:"acids3d", ref:"p. 9", body:"<p><b>Binary acids</b> ($\\ce{H_{n}X}$) have H bonded to one other element. <b>Oxoacids</b> contain H, O and at least one more element, and the acidic H is bonded to an O. Compare where the H sits in each molecule.</p>"},
    {type:"read", title:"Learn the strong acids and strong bases by name", ref:"p. 9", body:"<table class=\"cn-table\"><tr><th>Strong acids</th><th>Strong bases</th></tr><tr><td>Binary: HCl (hydrochloric), HBr (hydrobromic), HI (hydroiodic)<br>Oxoacids: $\\ce{HClO4}$ (perchloric), $\\ce{HBrO4}$ (perbromic), $\\ce{HIO4}$ (periodic), $\\ce{HNO3}$ (nitric), $\\ce{H2SO4}$ (sulfuric)</td><td>Group 1 hydroxides (LiOH, NaOH, KOH, RbOH): very soluble<br>Group 2 hydroxides ($\\ce{Mg(OH)2}$, $\\ce{Ca(OH)2}$, $\\ce{Sr(OH)2}$, $\\ce{Ba(OH)2}$): only slightly soluble<br>Hydride ($\\ce{H-}$) and oxide ($\\ce{O^2-}$) ions: react with water to give $\\ce{OH-}$</td></tr></table><div class=\"box warn\"><b class=\"t\">Watch out</b>HF is <b>not</b> a strong acid, even though HCl, HBr and HI are.</div><p>Sulfuric acid is <b>diprotic</b>: it has two acidic H atoms and gives them up in two separate steps: $\\ce{H2SO4 + H2O -> H3O+ + HSO4-}$, then $\\ce{HSO4- + H2O -> H3O+ + SO4^2-}$.</p><p>Any acid not on this list (HF, acetic acid, HCN) is treated as weak. Ammonia is a weak base.</p>"},
    {type:"try", title:"Classify acids and bases", gen:"M1C3.g.kind"},
    {type:"mcq", title:"Water can be either", q:"In $\\ce{CO3^2- + H2O <=> HCO3- + OH-}$ and $\\ce{HNO3 + H2O -> H3O+ + NO3-}$, what does water do?", opts:[["It is an acid in both.",false,"In the second reaction water gains an H."],["It is a base in both.",false,"In the first reaction water loses an H."],["It is an acid in the first and a base in the second.",true,"It gives $\\ce{H+}$ to carbonate, then takes $\\ce{H+}$ from nitric acid."],["It is a base in the first and an acid in the second.",false,"Follow the H: water becomes $\\ce{OH-}$ in the first."]], after:"Water acts as a base with acids and as an acid with bases, as in Example 1-7."},
    {type:"try", title:"Find the acid", gen:"M1C3.g.identify"},
    {type:"read", title:"Neutralization makes a salt, and often water", ref:"p. 10", body:"<p>In a <b>neutralization</b>, an acid and a base react to form a <b>salt</b> (the base's cation with the acid's anion). Water usually forms too, but not always:</p><ul><li>strong acid + strong base: $\\ce{HBr + KOH -> KBr + H2O}$</li><li>weak acid + strong base: $\\ce{HCN + NaOH -> NaCN + H2O}$</li><li>weak base + strong acid: $\\ce{NH3 + HNO3 -> NH4NO3}$ (no water)</li></ul><p>If <b>either</b> the acid or the base is strong, the reaction goes essentially to completion (100%). That is what makes an acid-base <b>titration</b> work as a method of analysis.</p>"},
    {type:"example", title:"Nitric acid and barium hydroxide", ref:"p. 11 (like Example 1-8)", ex:{q:"Write the balanced molecular equation for the reaction of aqueous nitric acid with barium hydroxide.", steps:[
      {t:"Salt ions: $\\ce{Ba^2+}$ (from the base) and $\\ce{NO3-}$ (from the acid), so the salt is $\\ce{Ba(NO3)2}$.",why:"Two nitrates balance one 2+ ion."},
      {t:"$\\ce{Ba(OH)2}$ supplies 2 $\\ce{OH-}$, so it needs 2 $\\ce{HNO3}$.",why:"Each $\\ce{H+}$ meets one $\\ce{OH-}$."},
      {t:"$\\ce{2HNO3(aq) + Ba(OH)2(aq) -> Ba(NO3)2(aq) + 2H2O(l)}$",why:"Two $\\ce{H+}$ + two $\\ce{OH-}$ give two $\\ce{H2O}$."},
      {t:"Check: Ba 1 = 1, N 2 = 2, H 4 = 4, O 8 = 6 + 2.",why:"Balanced."}], ans:"$\\ce{2HNO3(aq) + Ba(OH)2(aq) -> Ba(NO3)2(aq) + 2H2O(l)}$"}},
    {type:"try", title:"Balance neutralizations", gen:"M1C3.g.neutralize"},
    {type:"read", title:"Net ionic equations split only strong electrolytes", ref:"p. 12", body:"<p>To write a net ionic equation:</p><ol><li>Write the balanced molecular equation.</li><li>Split into ions only what is fully ionized in water: <b>strong acids</b>, <b>strong bases</b> and <b>soluble ionic compounds</b>.</li><li>Keep whole: <b>weak acids</b> (HF, $\\ce{CH3COOH}$), <b>weak bases</b> ($\\ce{NH3}$), water, gases and solids.</li><li>Cancel the spectator ions.</li></ol><p>Strong acid + strong base always reduces to $\\ce{H+ + OH- -> H2O}$ (the same as $\\ce{H3O+ + OH- -> 2H2O}$). A weak acid keeps its formula: $\\ce{HCN + OH- -> CN- + H2O}$.</p>"},
    {type:"explore", title:"Build molecular, ionic and net ionic equations", fig:"builder", ref:"pp. 10-12", body:"<p>Switch the acid between a strong one (HCl) and a weak one (HF) with the same base. Watch the net ionic equation change, and see which ions are spectators each time.</p>"},
    {type:"firstline", title:"Find the first mistake", q:"A student writes the net ionic equation for acetic acid with sodium hydroxide:", lines:["Molecular: $\\ce{CH3COOH(aq) + NaOH(aq) -> CH3COONa(aq) + H2O(l)}$","Ionic: $\\ce{CH3COO-(aq) + H+(aq) + Na+(aq) + OH-(aq) -> CH3COO-(aq) + Na+(aq) + H2O(l)}$","Cancel spectators $\\ce{CH3COO-}$ and $\\ce{Na+}$.","Net: $\\ce{H+(aq) + OH-(aq) -> H2O(l)}$"], wrong:1, why:"Acetic acid is weak, so it is not split into ions. The ionic equation keeps $\\ce{CH3COOH}$ whole, and the net ionic equation is $\\ce{CH3COOH + OH- -> CH3COO- + H2O}$."},
    {type:"try", title:"Net ionic equations", gen:"M1C3.g.net"},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
