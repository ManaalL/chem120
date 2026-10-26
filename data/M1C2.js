/* Chapter 1.2 (Mon Sep 14): Solubility and precipitation. Course notes Module 1, pp. 7-8 (section 1.2).
   Precipitation reactions, gravimetric analysis, the seven solubility guidelines in priority order (every exception as printed),
   predicting precipitates, molecular and net ionic equations (Examples 1-5 and 1-6). */
(function(){
const M=C120;
const ceD=f=>String(f).replace(/NaN/g,"Na{}N");   /* "NaN" in NaNO3 trips the site's text checks; mhchem renders Na{}N the same */
const gcd=(a,b)=>M.gcd(a,b);
/* cations: [formula part, name, charge, kind]  kind: g1 alkali, nh4, g2, or the symbol for exceptions */
const CAT={Li:["Li","lithium",1,"g1"],Na:["Na","sodium",1,"g1"],K:["K","potassium",1,"g1"],Rb:["Rb","rubidium",1,"g1"],Cs:["Cs","cesium",1,"g1"],NH4:["NH4","ammonium",1,"nh4"],
  Mg:["Mg","magnesium",2,"g2"],Ca:["Ca","calcium",2,"g2"],Sr:["Sr","strontium",2,"g2"],Ba:["Ba","barium",2,"g2"],Ag:["Ag","silver",1,"Ag"],Pb:["Pb","lead(II)",2,"Pb"],Hg2:["Hg2","mercury(I)",2,"Hg"],
  Zn:["Zn","zinc",2,"tm"],Cu:["Cu","copper(II)",2,"tm"],Fe2:["Fe","iron(II)",2,"tm"],Fe3:["Fe","iron(III)",3,"tm"],Al:["Al","aluminum",3,"tm"],Ni:["Ni","nickel(II)",2,"tm"],Co:["Co","cobalt(II)",2,"tm"],Mn:["Mn","manganese(II)",2,"tm"],Bi:["Bi","bismuth(III)",3,"tm"],Cd:["Cd","cadmium",2,"tm"]};
/* anions: [formula part, name, charge, polyatomic] */
const AN={NO3:["NO3","nitrate",1,1],Cl:["Cl","chloride",1,0],Br:["Br","bromide",1,0],I:["I","iodide",1,0],SO4:["SO4","sulfate",2,1],CO3:["CO3","carbonate",2,1],PO4:["PO4","phosphate",3,1],S:["S","sulfide",2,0],OH:["OH","hydroxide",1,1]};
const RULES=["","Salts of the alkali metals (group 1) are soluble.","Ammonium salts are soluble.","Nitrates are soluble.","Chlorides, bromides and iodides are soluble, except those of lead, mercury and silver.","Sulfates are soluble, except those of calcium, strontium, barium, silver, mercury and lead.","Carbonates, phosphates and sulfides are insoluble, except those of the alkali metals and ammonium.","Hydroxides are insoluble or slightly soluble, except those of the alkali metals; group 2 hydroxides are slightly soluble."];
/* pairs left out because the compound does not exist as a simple salt (not from the notes) */
const SKIP=new Set(["Al:CO3","Al:S","Fe3:CO3","Fe3:S","Bi:CO3","Ag:OH","Hg2:OH","Hg2:CO3","Hg2:S","Hg2:PO4","Bi:SO4","Bi:OH","Cd:PO4"]);
const ok=(c,a)=>!SKIP.has(c+":"+a);
/* solubility by the guidelines, checked in priority order (p. 7) */
function sol(c,a){
  const k=CAT[c][3];
  if(k==="g1") return {s:"soluble",rule:1};
  if(k==="nh4") return {s:"soluble",rule:2};
  if(a==="NO3") return {s:"soluble",rule:3};
  if(["Cl","Br","I"].includes(a)) return ["Pb","Hg","Ag"].includes(k)?{s:"insoluble",rule:4}:{s:"soluble",rule:4};
  if(a==="SO4") return (["Ca","Sr","Ba"].includes(c)||["Pb","Hg","Ag"].includes(k))?{s:"insoluble",rule:5}:{s:"soluble",rule:5};
  if(["CO3","PO4","S"].includes(a)) return {s:"insoluble",rule:6};
  if(a==="OH") return k==="g2"?{s:"slightly soluble",rule:7}:{s:"insoluble",rule:7};
}
function formula(c,a){ const [cs,,qc]=CAT[c], [as,,qa,poly]=AN[a]; const l=qc*qa/gcd(qc,qa); const nc=l/qc, na=l/qa;
  const part=(s,n,p)=>n===1?s:(p?`(${s})${n}`:`${s}${n}`); return part(cs,nc,cs==="NH4"||cs==="Hg2")+part(as,na,poly); }
const cIon=c=>{ const [s,,q]=CAT[c]; return q===1?`${s}+`:`${s}^${q}+`; };
const aIon=a=>{ const [s,,q]=AN[a]; return q===1?`${s}-`:`${s}^${q}-`; };
const nameOf=(c,a)=>`${CAT[c][1]} ${AN[a][1]}`;
function why(c,a){ const r=sol(c,a); const f=formula(c,a);
  const lead={1:`$\\ce{${CAT[c][0]}+}$ is an alkali metal ion`,2:"it is an ammonium salt",3:"it is a nitrate",4:r.s==="soluble"?`it is a ${AN[a][1]} and ${CAT[c][1]} is not one of the exceptions (Pb, Hg, Ag)`:`it is a ${AN[a][1]} of ${CAT[c][1]}, one of the exceptions`,5:r.s==="soluble"?`it is a sulfate and ${CAT[c][1]} is not one of the exceptions (Ca, Sr, Ba, Ag, Hg, Pb)`:`it is a sulfate of ${CAT[c][1]}, one of the exceptions`,6:`it is a ${AN[a][1]} and the cation is not an alkali metal or ammonium`,7:r.s==="slightly soluble"?"it is a group 2 hydroxide":"it is a hydroxide of a metal outside group 1"}[r.rule];
  return `$\\ce{${ceD(f)}}$ is <b>${r.s}</b> by rule ${r.rule}: ${lead}.`; }
/* a precipitation: insoluble product cX aY made from soluble X(NO3 or Cl) and (Na, K or NH4)Y */
function precip(R,d){
  const anions=d===1?["Cl","Br","I","SO4","OH"]:d===2?["Cl","Br","I","SO4","CO3","OH","PO4"]:["Cl","Br","I","SO4","CO3","PO4","S","OH"];
  let c,a,tries=0; do{ c=R.pick(Object.keys(CAT)); a=R.pick(anions); tries++; }while((!ok(c,a)||sol(c,a).s!=="insoluble")&&tries<200);
  const carA=(CAT[c][3]==="tm"||CAT[c][3]==="g2")&&R.int(0,1)?"Cl":"NO3";
  const carC=R.pick(a==="OH"?["Na","K"]:["Na","K","NH4"]);
  const p=CAT[c][2], q=AN[a][2], g=gcd(p,q);
  const r1=formula(c,carA), r2=formula(carC,a), pr=formula(c,a), sp=formula(carC,carA);
  const co=[q/g,p/g,1,p*q/g];
  const term=(n,f,st)=>`${n>1?n:""}${f}(${st})`;
  const mol=`${term(co[0],r1,"aq")} + ${term(co[1],r2,"aq")} -> ${term(1,pr,"s")} + ${term(co[3],sp,"aq")}`;
  const net=`${term(q/g,cIon(c),"aq")} + ${term(p/g,aIon(a),"aq")} -> ${term(1,pr,"s")}`;
  return {c,a,carA,carC,r1,r2,pr,sp,mol,net,spect:[cIon(carC),aIon(carA)]};
}

M.chapter({
  id:"M1C2", module:"m1", n:2, num:"1.2", date:"2026-09-14", added:"2026-10-26", quiz:"PC1",
  title:"Solubility and precipitation", pages:"7-8", sections:["1.2"],
  summary:"When two ionic solutions are mixed, a solid precipitates if any new pairing of ions is insoluble. Seven solubility guidelines, applied in order of priority, tell you which pairings are insoluble.",
  flags:[],
  formulas:[
    {id:"M1C2.f.priority", name:"How to use the guidelines", kind:"rule", ref:"p. 7", tex:"\\text{Go down the list from rule 1; the first rule that applies decides.}", note:"A higher rule overrides a lower one. Example: $\\ce{AgNO3}$ is soluble (rule 3) even though silver is an exception in rules 4 and 5.",
      blank:{tex:"\\text{The guidelines are listed in order of decreasing }\\boxed{\\,?\\,}", accept:["priority"]}},
    {id:"M1C2.f.rule1", name:"Rule 1: alkali metal salts", kind:"rule", ref:"p. 7", tex:"\\text{Salts of the alkali metals (group 1) are soluble.}", note:"e.g. NaCl, $\\ce{KNO3}$",
      blank:{tex:"\\text{Salts of the }\\boxed{\\,?\\,}\\text{ are soluble.}", accept:["alkali metals","group 1","alkali metal","group 1 metals"]}},
    {id:"M1C2.f.rule2", name:"Rule 2: ammonium salts", kind:"rule", ref:"p. 7", tex:"\\ce{NH4+}\\text{ salts are soluble.}", note:"e.g. $\\ce{NH4Cl}$, $\\ce{(NH4)2SO4}$",
      blank:{tex:"\\boxed{\\,?\\,}\\text{ salts are soluble (rule 2).}", accept:["ammonium","NH4+","NH4"]}},
    {id:"M1C2.f.rule3", name:"Rule 3: nitrates", kind:"rule", ref:"p. 7", tex:"\\ce{NO3-}\\text{ salts (nitrates) are soluble.}", note:"e.g. $\\ce{AgNO3}$, $\\ce{Zn(NO3)2}$",
      blank:{tex:"\\boxed{\\,?\\,}\\text{ are soluble (rule 3).}", accept:["nitrates","nitrate","NO3-"]}},
    {id:"M1C2.f.rule4", name:"Rule 4: chlorides, bromides, iodides", kind:"rule", ref:"p. 7", tex:"\\ce{Cl-},\\ \\ce{Br-},\\ \\ce{I-}\\text{ soluble, except with }\\ce{Pb^2+},\\ \\text{mercury }(\\ce{Hg+}\\text{ and }\\ce{Hg2^2+}),\\ \\ce{Ag+}", note:"e.g. $\\ce{ZnCl2}$ is soluble; $\\ce{PbCl2}$ is not.",
      blank:{tex:"\\ce{Cl-},\\ \\ce{Br-},\\ \\ce{I-}\\text{ soluble except with }\\ce{Pb^2+},\\ \\ce{Hg2^2+}\\text{ and }\\boxed{\\,?\\,}", accept:["Ag+","silver","Ag","Ag^+"]}},
    {id:"M1C2.f.rule5", name:"Rule 5: sulfates", kind:"rule", ref:"p. 7", tex:"\\ce{SO4^2-}\\text{ soluble, except with Ca, Sr, Ba, Ag, Hg and Pb}",
      blank:{tex:"\\ce{SO4^2-}\\text{ soluble except with Ca, Sr, Ba, Ag, Hg and }\\boxed{\\,?\\,}", accept:["Pb","lead","Pb2+","Pb^2+"]}},
    {id:"M1C2.f.rule6", name:"Rule 6: carbonates, phosphates, sulfides", kind:"rule", ref:"p. 7", tex:"\\ce{CO3^2-},\\ \\ce{PO4^3-},\\ \\ce{S^2-}\\text{ insoluble, except with the alkali metals (rule 1) and }\\ce{NH4+}\\text{ (rule 2)}",
      blank:{tex:"\\ce{CO3^2-},\\ \\ce{PO4^3-},\\ \\ce{S^2-}\\text{ insoluble except with group 1 and }\\boxed{\\,?\\,}", accept:["NH4+","ammonium","NH4"]}},
    {id:"M1C2.f.rule7", name:"Rule 7: hydroxides", kind:"rule", ref:"p. 7", tex:"\\ce{OH-}\\text{ insoluble or slightly soluble, except with the alkali metals; group 2 hydroxides are slightly soluble}", note:"Virtually all other hydroxides are insoluble.",
      blank:{tex:"\\text{Group 2 hydroxides are }\\boxed{\\,?\\,}", accept:["slightly soluble","sparingly soluble"]}}
  ],
  glossary:[
    {id:"M1C2.t.precipitation", term:"Precipitation reaction", def:"Ions in solution combine to form an insoluble solid, the precipitate.", ref:"p. 7"},
    {id:"M1C2.t.precipitate", term:"Precipitate", def:"The insoluble solid that forms and settles out of a solution. It can be filtered off, dried and weighed.", ref:"p. 7"},
    {id:"M1C2.t.gravimetric", term:"Gravimetric analysis", def:"Finding the amount of a substance in a sample from the mass of a precipitate it produces.", ref:"p. 7"},
    {id:"M1C2.t.spectator", term:"Spectator ion", def:"An ion that is in solution before and after the reaction and takes no part in it. It is left out of the net ionic equation.", ref:"p. 8"},
    {id:"M1C2.t.net-ionic", term:"Net ionic equation", def:"An equation that shows only the species that actually change; spectator ions are removed.", ref:"p. 8"}
  ],
  figures:{
    lookup:{title:"Solubility rule lookup", cap:"Choose a cation and an anion. The page goes down the guidelines in order and stops at the first one that applies. The grid below gives the verdict for every pair: S soluble, I insoluble, ss slightly soluble. Click a cell to see its reasoning. Dashes are pairs that do not form a simple salt (not from the notes).", ref:"p. 7",
      build(host,{PLOT,M}){
        const ctl=PLOT.controls(host);
        const mk=(t,obj,val)=>{ const lab=document.createElement("label"); lab.innerHTML=`<span>${t}</span>`; const s=document.createElement("select"); Object.keys(obj).forEach(k=>s.append(new Option(`${obj[k][1]} (${k==="Hg2"?"Hg2 2+":k.replace(/\d$/,"")})`,k))); s.value=val; lab.append(s); ctl.append(lab); return s; };
        const sc=mk("Cation",CAT,"Pb"), sa=mk("Anion",AN,"Cl");
        const out=document.createElement("div"); out.className="box"; host.append(out);
        const grid=document.createElement("div"); host.append(grid);
        function show(){ const c=sc.value, a=sa.value;
          if(!ok(c,a)){ out.innerHTML=M.rich(`${CAT[c][1]} ${AN[a][1]} does not exist as a simple salt (not from the notes), so the guidelines are not applied to it.`); return; }
          const r=sol(c,a); let steps=""; for(let i=1;i<=r.rule;i++) steps+=`<li${i===r.rule?' style="font-weight:600"':""}>Rule ${i}: ${RULES[i]} ${i<r.rule?"Does not apply.":"Applies."}</li>`;
          out.innerHTML=M.rich(`<b class="t">${CAT[c][1]} ${AN[a][1]}</b>${why(c,a)}<ol style="margin:6px 0 0 1.1em;padding:0">${steps}</ol>`); }
        let h=`<table class="cn-table" style="font-size:.85rem"><tr><th></th>${Object.keys(AN).map(a=>`<th>${M.ce(aIon(a))}</th>`).join("")}</tr>`;
        Object.keys(CAT).forEach(c=>{ h+=`<tr><th>${M.ce(cIon(c))}</th>`+Object.keys(AN).map(a=>{ if(!ok(c,a)) return "<td>–</td>"; const s=sol(c,a).s; const t=s==="soluble"?"S":s==="insoluble"?"I":"ss";
          return `<td><button type="button" data-c="${c}" data-a="${a}" style="border:0;background:${t==="S"?"transparent":"var(--accentSoft)"};font:600 .85rem var(--mono);color:var(--ink);cursor:pointer;width:100%" aria-label="${CAT[c][1]} ${AN[a][1]}: ${s}">${t}</button></td>`; }).join("")+"</tr>"; });
        grid.innerHTML=h+"</table>";
        grid.querySelectorAll("button").forEach(b=>b.onclick=()=>{ sc.value=b.dataset.c; sa.value=b.dataset.a; show(); });
        sc.onchange=show; sa.onchange=show; show();
      }},
    pbi2:{title:"Mixing lead(II) nitrate and potassium iodide", cap:"Ions in the two solutions move freely. When the solutions meet, $\\ce{Pb^2+}$ and $\\ce{I-}$ lock into a solid; $\\ce{K+}$ and $\\ce{NO3-}$ stay dissolved.", ref:"p. 7",
      model:{type:"particles", params:{scenario:"precip", reaction:"Pb(NO3)2+KI"}},
      predict:{q:"After the solid forms, which ions are still dissolved?", opts:[["$\\ce{Pb^2+}$ and $\\ce{I-}$",false,"These form $\\ce{PbI2}$, insoluble by rule 4 (lead is an exception)."],["$\\ce{K+}$ and $\\ce{NO3-}$",true,"$\\ce{KNO3}$ is soluble (rules 1 and 3). These are the spectator ions."],["All four ions",false,"$\\ce{Pb^2+}$ and $\\ce{I-}$ leave the solution as a solid."],["None",false,"$\\ce{KNO3}$ is soluble, so its ions stay in solution."]], check:"Mix the solutions and watch which ions end up in the solid."}},
    nopt:{title:"Mixing sodium chloride and potassium nitrate", cap:"Every possible pairing here (NaCl, $\\ce{KNO3}$, $\\ce{Na{}NO3}$, KCl) is soluble, so the ions just mix.", ref:"p. 7",
      model:{type:"particles", params:{scenario:"precip", reaction:"NaCl+KNO3"}},
      predict:{q:"Will a precipitate form when NaCl(aq) and $\\ce{KNO3}$(aq) are mixed?", opts:[["Yes, KCl",false,"KCl is soluble: potassium is an alkali metal (rule 1)."],["Yes, $\\ce{Na{}NO3}$",false,"Soluble by rules 1 and 3."],["No: every combination is soluble",true,"Both cations are alkali metals, so all four salts are soluble by rule 1."]], check:"Mix the two solutions and see whether any ions pair up."}}
  },
  gens:[
    {id:"M1C2.g.soluble", title:"Soluble or insoluble?", skill:"Apply the guidelines in priority order", ref:"p. 7",
      gen(R,d){
        const easy=[["Na","Cl"],["K","SO4"],["Ag","Cl"],["Ba","SO4"],["Ca","CO3"],["NH4","Br"],["Zn","NO3"],["Cu","OH"],["Li","PO4"],["Fe3","OH"],["Pb","I"],["Mg","Cl"]];
        const hard=[["Ag","NO3"],["Pb","SO4"],["Ag","SO4"],["NH4","PO4"],["NH4","S"],["K","OH"],["Ba","OH"],["Ca","OH"],["Hg2","Br"],["Ca","SO4"],["Sr","SO4"],["Zn","S"],["Pb","NO3"],["Mg","SO4"],["Cu","SO4"],["Hg2","SO4"],["Na","CO3"],["Bi","Cl"],["Sr","OH"],["Ni","CO3"]];
        let pair;
        if(d===1) pair=R.pick(easy); else if(d===3) pair=R.pick(hard);
        else { let c,a; do{ c=R.pick(Object.keys(CAT)); a=R.pick(Object.keys(AN)); }while(!ok(c,a)); pair=[c,a]; }
        const [c,a]=pair; const r=sol(c,a); const f=formula(c,a);
        const opts=["Soluble","Insoluble","Slightly soluble"]; const correct=opts.findIndex(o=>o.toLowerCase()===r.s);
        const steps=[]; for(let i=1;i<=r.rule;i++) steps.push(`Rule ${i}: ${RULES[i]} ${i<r.rule?"Does not apply.":"<b>Applies.</b>"}`); steps.push(why(c,a));
        const base={hint:"Start at rule 1 and go down. The first rule that applies decides; ignore the rules below it.",steps,answerTeX:`${r.s} (rule ${r.rule})`};
        if(d===1) return {...base,prompt:`Is $\\ce{${ceD(f)}}$ (${nameOf(c,a)}) soluble in water?`,answer:{type:"mc",options:opts,correct,keep:true}};
        return {...base,prompt:`Consider $\\ce{${ceD(f)}}$ (${nameOf(c,a)}).`,parts:[{label:"Is it soluble in water?",answer:{type:"mc",options:opts,correct,keep:true}},{label:"Which rule number (1 to 7) decides?",answer:{type:"int",value:r.rule}}]};
      }},
    {id:"M1C2.g.which-soluble", title:"Pick the soluble compounds", skill:"Scan a list with the guidelines", ref:"p. 7",
      gen(R,d){
        const all=[]; Object.keys(CAT).forEach(c=>Object.keys(AN).forEach(a=>{ if(ok(c,a)&&(d>1||sol(c,a).s!=="slightly soluble")) all.push([c,a]); }));
        const tricky=[["Ag","NO3"],["NH4","PO4"],["Pb","Cl"],["Ba","SO4"],["K","S"],["Hg2","I"],["Ag","SO4"],["NH4","CO3"],["Ca","SO4"],["Rb","OH"]];
        let pick; let t=0;
        do{ const base=d===3?R.shuffle(tricky).slice(0,2):[]; const rest=R.shuffle(all); pick=base.slice(); for(const p of rest){ if(pick.length>=5) break; if(!pick.some(q=>formula(...q)===formula(...p))) pick.push(p); }
          pick=R.shuffle(pick); const n=pick.filter(p=>sol(...p).s==="soluble").length; if(n>=1&&n<=4) break; t++; }while(t<100);
        const correct=pick.map((p,i)=>sol(...p).s==="soluble"?i:-1).filter(i=>i>=0);
        return {prompt:"Which of these compounds are soluble in water? Select all that apply. (A slightly soluble compound does not count as soluble.)",
          answer:{type:"multi",options:pick.map(p=>`$\\ce{${ceD(formula(...p))}}$`),correct},
          hint:"Check each compound against rules 1 to 7 in order.",
          steps:pick.map(p=>why(...p)), answerTeX:correct.length?correct.map(i=>`$\\ce{${ceD(formula(...pick[i]))}}$`).join(", "):"none"};
      }},
    {id:"M1C2.g.precipitate", title:"Predict the precipitate", skill:"Swap partners and test each new pair", ref:"pp. 7-8",
      gen(R,d){
        const P=precip(R,d);
        return {prompt:`Aqueous solutions of $\\ce{${ceD(P.r1)}}$ and $\\ce{${ceD(P.r2)}}$ are mixed. What is the formula of the precipitate?`,
          answer:{type:"formula",answer:P.pr},
          hint:"Swap the partners: the cation of one compound with the anion of the other. Test both new compounds with the guidelines.",
          steps:[`Ions present: $\\ce{${cIon(P.c)}}$, $\\ce{${aIon(P.carA)}}$, $\\ce{${cIon(P.carC)}}$, $\\ce{${aIon(P.a)}}$.`,`New pairs: $\\ce{${P.pr}}$ and $\\ce{${ceD(P.sp)}}$.`,why(P.carC,P.carA),why(P.c,P.a),`The precipitate is $\\ce{${P.pr}}$.`],
          answerTeX:`$\\ce{${P.pr}}$`};
      }},
    {id:"M1C2.g.net-ionic", title:"Write the net ionic equation", skill:"Remove spectator ions", ref:"p. 8",
      gen(R,d){
        const P=precip(R,d);
        return {prompt:`Write the net ionic equation for the reaction when $\\ce{${ceD(P.r1)}}$(aq) and $\\ce{${ceD(P.r2)}}$(aq) are mixed. Give charges like Fe^3+ or SO4^2-. States are optional.`,
          answer:{type:"equation",answer:P.net},
          hint:"Find the precipitate first. The net ionic equation shows only its ions combining into the solid, with coefficients that balance the charge.",
          steps:[`Molecular equation: $\\ce{${ceD(P.mol)}}$`,`Split the soluble compounds into ions. $\\ce{${cIon(P.carC)}}$ and $\\ce{${aIon(P.carA)}}$ appear unchanged on both sides: they are spectators.`,`Net ionic equation: $\\ce{${P.net}}$`,`Charge check: $${AN[P.a][2]/gcd(CAT[P.c][2],AN[P.a][2])}(+${CAT[P.c][2]}) + ${CAT[P.c][2]/gcd(CAT[P.c][2],AN[P.a][2])}(-${AN[P.a][2]}) = 0$, the same as the neutral solid.`],
          answerTeX:`$\\ce{${P.net}}$`};
      }},
    {id:"M1C2.g.spectators", title:"Find the spectator ions", skill:"Separate reacting ions from spectators", ref:"p. 8",
      gen(R,d){
        const P=precip(R,d);
        const ions=[cIon(P.c),aIon(P.carA),cIon(P.carC),aIon(P.a)]; const order=R.shuffle([0,1,2,3]);
        const opts=order.map(i=>`$\\ce{${ions[i]}}$`); const correct=order.map((i,k)=>i===1||i===2?k:-1).filter(k=>k>=0);
        return {prompt:`What are the spectator ions when solutions of ${nameOf(P.c,P.carA)} and ${nameOf(P.carC,P.a)} are mixed? Select all that apply.`,
          answer:{type:"multi",options:opts,correct},
          hint:"Spectators are the ions that stay dissolved: the ones that make up the soluble product.",
          steps:[`Ions present: ${ions.map(x=>`$\\ce{${x}}$`).join(", ")}.`,why(P.c,P.a),why(P.carC,P.carA),`So $\\ce{${ions[2]}}$ and $\\ce{${ions[1]}}$ are spectators.`],
          answerTeX:`$\\ce{${ions[2]}}$ and $\\ce{${ions[1]}}$`};
      }}
  ],
  exam:[
    {id:"M1C2.q1", ref:"p. 7", q:"Which compound is insoluble in water?", opts:[["$\\ce{NH4Cl}$",false,"Ammonium salts are soluble (rule 2)."],["$\\ce{PbBr2}$",true,"Bromides are soluble except with lead, mercury and silver (rule 4)."],["$\\ce{Zn(NO3)2}$",false,"Nitrates are soluble (rule 3)."],["$\\ce{Na2S}$",false,"Sulfides are insoluble except with group 1 and ammonium (rule 6); Na is group 1."],["$\\ce{MgSO4}$",false,"Magnesium is not one of the sulfate exceptions (rule 5)."]]},
    {id:"M1C2.q2", ref:"p. 7", q:"Silver forms an insoluble chloride and an insoluble sulfate. Why is silver nitrate soluble?", opts:[["Nitrates are soluble (rule 3), and that rule ranks above the rules that list silver as an exception.",true,"Rules are applied in order of priority; rule 3 settles it first."],["Silver is an alkali metal.",false,"Silver is a transition metal, not in group 1."],["Silver nitrate is a molecular compound.",false,"It is ionic: $\\ce{Ag+}$ and $\\ce{NO3-}$."],["It is not soluble; it is an exception to rule 3.",false,"Rule 3 has no exceptions."],["Because rule 7 says all silver salts are soluble.",false,"Rule 7 is about hydroxides."]]},
    {id:"M1C2.q3", ref:"p. 7", multi:true, q:"Which combinations of solutions produce a precipitate? Select all that apply.", opts:[["$\\ce{KBr}$(aq) and $\\ce{Hg2(NO3)2}$(aq)",true,"$\\ce{Hg2Br2}$ is insoluble (rule 4)."],["$\\ce{Na2SO4}$(aq) and $\\ce{ZnCl2}$(aq)",false,"$\\ce{ZnSO4}$ and NaCl are both soluble."],["$\\ce{(NH4)2S}$(aq) and $\\ce{CuCl2}$(aq)",true,"CuS is insoluble (rule 6)."],["$\\ce{LiOH}$(aq) and $\\ce{KNO3}$(aq)",false,"$\\ce{LiNO3}$ and KOH are both soluble (rule 1)."],["$\\ce{Sr(NO3)2}$(aq) and $\\ce{K2SO4}$(aq)",true,"$\\ce{SrSO4}$ is insoluble (rule 5)."]]},
    {id:"M1C2.q4", ref:"p. 7", q:"According to the course guidelines, how soluble is $\\ce{Ba(OH)2}$?", opts:[["Soluble, because barium is an alkali metal",false,"Barium is in group 2, the alkaline-earth metals."],["Insoluble, like nearly all hydroxides",false,"Group 2 hydroxides are singled out as slightly soluble."],["Slightly soluble",true,"Rule 7: group 2 hydroxides are slightly soluble."],["Soluble, because hydroxides are always soluble",false,"Hydroxides are mostly insoluble (rule 7)."],["Insoluble, because sulfates of barium are insoluble",false,"The sulfate rule says nothing about hydroxides."]]},
    {id:"M1C2.q5", ref:"p. 7", q:"Why is $\\ce{(NH4)3PO4}$ soluble even though phosphates are generally insoluble?", opts:[["Rule 2 (ammonium salts are soluble) has higher priority than rule 6.",true,"Rule 6 itself lists ammonium phosphate as an exception, because of rule 2."],["Phosphates are soluble when the cation has a 1+ charge.",false,"$\\ce{Ag3PO4}$ has a 1+ cation and is insoluble."],["Ammonium is an alkali metal.",false,"$\\ce{NH4+}$ is a polyatomic ion, covered by its own rule."],["It is a nitrate.",false,"It contains no nitrate."],["It is molecular, not ionic.",false,"It is ionic: $\\ce{NH4+}$ and $\\ce{PO4^3-}$."]]},
    {id:"M1C2.q6", ref:"p. 7", q:"In gravimetric analysis, how is the amount of a substance in a sample found?", opts:[["From the mass of a precipitate it produces",true,"The solid is filtered off, dried and weighed (p. 7)."],["From the colour of the solution",false,"That is not gravimetric analysis."],["From the volume of gas it gives off",false,"Gravimetric means by mass."],["From the temperature change",false,"Not part of gravimetric analysis."],["From the number of ions counted in solution",false,"Ions can't be counted directly; the precipitate is weighed."]]},
    {id:"M1C2.q7", ref:"p. 8", q:"What is the net ionic equation when $\\ce{BaCl2}$(aq) and $\\ce{K2CO3}$(aq) are mixed?", opts:[["$\\ce{Ba^2+(aq) + CO3^2-(aq) -> BaCO3(s)}$",true,"$\\ce{BaCO3}$ is insoluble (rule 6); $\\ce{K+}$ and $\\ce{Cl-}$ are spectators."],["$\\ce{K+(aq) + Cl-(aq) -> KCl(s)}$",false,"KCl is soluble (rule 1)."],["$\\ce{BaCl2(aq) + K2CO3(aq) -> BaCO3(s) + 2KCl(aq)}$",false,"That is the molecular equation, not the net ionic one."],["$\\ce{Ba^2+(aq) + 2Cl-(aq) -> BaCl2(s)}$",false,"$\\ce{BaCl2}$ is soluble (rule 4)."],["No reaction",false,"$\\ce{BaCO3}$ precipitates."]]}
  ],
  steps:[
    {type:"read", title:"A precipitate is an insoluble solid made from dissolved ions", ref:"p. 7", body:"<p>In a <b>precipitation reaction</b>, ions from two solutions meet and form a solid that does not dissolve. The solid settles out, and it can be filtered off, dried and weighed.</p><p>Picture a dance where everyone switches partners. Most new couples keep dancing (they stay dissolved). One couple grips so tightly that they drop out of the dance: that pair is the precipitate.</p><p>Chemists use the differences in solubility to separate the parts of a mixture. In <b>gravimetric analysis</b>, the mass of the precipitate tells you how much of a substance the sample held. You will do exactly this in chapter 1.6.</p>"},
    {type:"read", title:"Seven solubility guidelines, in order of priority", ref:"p. 7", body:"<p>Go down the list and stop at the <b>first</b> rule that applies. A higher rule always beats a lower one.</p><ol><li>Salts of the alkali metals (group 1) are soluble. (NaCl, $\\ce{KNO3}$)</li><li>Ammonium ($\\ce{NH4+}$) salts are soluble. ($\\ce{NH4Cl}$, $\\ce{(NH4)2SO4}$)</li><li>Nitrates ($\\ce{NO3-}$) are soluble. ($\\ce{AgNO3}$, $\\ce{Zn(NO3)2}$)</li><li>Chlorides, bromides and iodides are soluble, <b>except</b> those of lead ($\\ce{Pb^2+}$), mercury ($\\ce{Hg+}$ and $\\ce{Hg2^2+}$) and silver ($\\ce{Ag+}$). ($\\ce{ZnCl2}$ soluble, $\\ce{PbCl2}$ not)</li><li>Sulfates ($\\ce{SO4^2-}$) are soluble, <b>except</b> those of calcium, strontium, barium, silver, mercury and lead.</li><li>Carbonates ($\\ce{CO3^2-}$), phosphates ($\\ce{PO4^3-}$) and sulfides ($\\ce{S^2-}$) are <b>insoluble</b>, except those of the alkali metals (rule 1) and ammonium (rule 2).</li><li>Hydroxides ($\\ce{OH-}$) are insoluble or slightly soluble, except those of the alkali metals (rule 1). Group 2 hydroxides are slightly soluble; virtually all others are insoluble.</li></ol><p>Mercury(I) exists in water as the pair $\\ce{Hg2^2+}$, so its chloride is $\\ce{Hg2Cl2}$. Rules 1 to 3 have no exceptions, which is why sodium, potassium, ammonium and nitrate ions are almost always spectators.</p>"},
    {type:"explore", title:"Look up any cation and anion", fig:"lookup", ref:"p. 7", body:"<p>Pick silver and try every anion: only nitrate is soluble. Then pick sodium: every anion is soluble, because rule 1 comes first. Click cells in the grid to test yourself before reading the reason.</p>"},
    {type:"try", title:"Soluble or insoluble?", gen:"M1C2.g.soluble", diff:1},
    {type:"mcq", title:"Priority decides", q:"Which rule decides that $\\ce{K2CO3}$ is soluble?", opts:[["Rule 1: alkali metal salts are soluble",true,"Rule 1 is checked first and applies. Rule 6 even names this case as an exception."],["Rule 6: carbonates are insoluble",false,"Rule 6 would say insoluble, but rule 1 has higher priority."],["Rule 3: nitrates are soluble",false,"There is no nitrate in $\\ce{K2CO3}$."],["Rule 2: ammonium salts are soluble",false,"There is no ammonium in $\\ce{K2CO3}$."]], after:"Always read the rules from the top. The first match wins."},
    {type:"try", title:"Soluble, and which rule?", gen:"M1C2.g.soluble"},
    {type:"read", title:"Predict a precipitate by swapping partners", ref:"p. 8", body:"<p>To decide whether mixing two solutions gives a precipitate:</p><ol><li>List the four ions present.</li><li>Pair each cation with the <b>other</b> compound's anion.</li><li>Test both new compounds with the guidelines. If one is insoluble, it precipitates. If both are soluble, there is no reaction.</li></ol><p>This explains why mixing calcium chloride and sodium phosphate gives a solid (Example 1-5): the new pair calcium phosphate is insoluble by rule 6, while NaCl stays dissolved by rule 1.</p>"},
    {type:"explore", title:"Watch lead(II) iodide form", fig:"pbi2", ref:"p. 7", body:"<p>Before the solutions mix, every ion moves freely. After mixing, only $\\ce{Pb^2+}$ and $\\ce{I-}$ join the solid. The other two ions are in the same state at the end as at the start.</p>"},
    {type:"explore", title:"Not every mixture reacts", fig:"nopt", ref:"p. 7", body:"<p>If both cations are alkali metals, rule 1 makes every possible salt soluble. Mixing gives a solution of four ions and no solid.</p>"},
    {type:"try", title:"Predict the precipitate", gen:"M1C2.g.precipitate"},
    {type:"read", title:"Net ionic equations leave out the spectators", ref:"p. 8", body:"<p>Three ways to write the same precipitation:</p><ul><li><b>Molecular:</b> whole formulas. $\\ce{FeCl3(aq) + 3NaOH(aq) -> Fe(OH)3(s) + 3NaCl(aq)}$</li><li><b>Ionic:</b> every dissolved ionic compound split into its ions.</li><li><b>Net ionic:</b> cancel the ions that appear unchanged on both sides (the <b>spectator ions</b>, here $\\ce{Na+}$ and $\\ce{Cl-}$). $\\ce{Fe^3+(aq) + 3OH-(aq) -> Fe(OH)3(s)}$</li></ul><p>A net ionic equation must balance both atoms and total charge. The solid keeps its whole formula with (s).</p>"},
    {type:"example", title:"Mixing cobalt(II) chloride and potassium phosphate", ref:"p. 8 (like Example 1-6)", ex:{q:"Aqueous $\\ce{CoCl2}$ and $\\ce{K3PO4}$ are mixed. Does a reaction occur? If so, give the molecular and net ionic equations.", steps:[
      {t:"Ions: $\\ce{Co^2+}$, $\\ce{Cl-}$, $\\ce{K+}$, $\\ce{PO4^3-}$. New pairs: $\\ce{Co3(PO4)2}$ and KCl.",why:"Swap partners. Charges fix the formulas: three 2+ balance two 3−."},
      {t:"KCl is soluble (rule 1). $\\ce{Co3(PO4)2}$ is insoluble (rule 6).",why:"Cobalt is not an alkali metal or ammonium, so its phosphate is insoluble."},
      {t:"Molecular: $\\ce{3CoCl2(aq) + 2K3PO4(aq) -> Co3(PO4)2(s) + 6KCl(aq)}$",why:"Balance Co first (3), then $\\ce{PO4}$ (2), then K and Cl (6)."},
      {t:"$\\ce{K+}$ and $\\ce{Cl-}$ appear on both sides unchanged.",why:"They are spectators."},
      {t:"Net ionic: $\\ce{3Co^2+(aq) + 2PO4^3-(aq) -> Co3(PO4)2(s)}$",why:"Charge check: $3(+2) + 2(-3) = 0$ on the left, 0 on the right."}], ans:"Yes. $\\ce{3Co^2+(aq) + 2PO4^3-(aq) -> Co3(PO4)2(s)}$"}},
    {type:"try", title:"Write the net ionic equation", gen:"M1C2.g.net-ionic"},
    {type:"firstline", title:"Find the first mistake", q:"A student predicts what happens when $\\ce{AgNO3}$(aq) and $\\ce{Na2SO4}$(aq) are mixed:", lines:["Ions present: $\\ce{Ag+}$, $\\ce{NO3-}$, $\\ce{Na+}$, $\\ce{SO4^2-}$.","New pairs: $\\ce{Ag2SO4}$ and $\\ce{Na{}NO3}$.","$\\ce{Ag2SO4}$ is soluble, because sulfates are soluble.","So no precipitate forms."], wrong:2, why:"Silver is one of the sulfate exceptions in rule 5, so $\\ce{Ag2SO4}$ is insoluble by the course guidelines and precipitates."},
    {type:"try", title:"Spectator ions", gen:"M1C2.g.spectators"},
    {type:"formulas", title:"The solubility guidelines"}
  ]
});
})();
