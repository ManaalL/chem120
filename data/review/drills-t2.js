/* Test 2 drills: one drill per type of question that the official Test 2 samples ask.
   Each drill has a short "how to think about it" and a generator that makes endless new multiple-choice questions of that type,
   with a reason on every option. All questions are written for this site (new species, numbers and wording).
   gen(R) gets a seeded random source (C120.rng) and returns {q, opts:[[text, correct, why]], multi?}.
   Data: data-sheet constants; EA values from the notes' table (Module 3, p. 14); first ionization energies are standard values (not printed in the notes, which only graph them on p. 12). */
(function(){
const CH=()=>C120.chem, K=()=>C120.chem.CONST;
const LET="spdfg";
const lab=(n,l)=>`${n}${LET[l]}`;
const sci=(v,sf=3)=>{ if(v===0) return "0"; const [m,e]=Number(v).toExponential(sf-1).split("e"); const ee=+e; return ee===0?m:`${m}\\times10^{${ee}}`; };
const S=(v,sf,u)=>`$${sci(v,sf)}$${u?" "+u:""}`;
const frac=x=>({1:"1",1.5:"1\\tfrac12",2:"2",3:"3",2.5:"2\\tfrac12"})[x]||(Math.abs(x-4/3)<1e-9?"1\\tfrac13":String(x));
/* one right option + up to four wrong ones, dropping repeats */
function mc(q,right,wrongs,extra={}){ const seen=new Set([right[0]]), w=[]; for(const x of wrongs){ if(x && !seen.has(x[0])){ seen.add(x[0]); w.push(x); } if(w.length>=4) break; } return {q,opts:[[right[0],true,right[1]],...w.map(x=>[x[0],false,x[1]])],...extra}; }
function pickN(R,arr,n){ return R.shuffle(arr).slice(0,n); }
const cfg=(z,q=0)=>`$${CH().config(z,q,{short:true,tex:true})}$`;
const occStr=occ=>`$${CH().configString(occ,{short:true,tex:true})}$`;
const ce=f=>`$\\ce{${f}}$`;

/* ---------- Module 2 data ---------- */
const NODES={ "p_x":["the $yz$ plane"], "p_y":["the $xz$ plane"], "p_z":["the $xy$ plane"],
  "d_{xy}":["the $xz$ plane","the $yz$ plane"], "d_{xz}":["the $xy$ plane","the $yz$ plane"], "d_{yz}":["the $xy$ plane","the $xz$ plane"],
  "d_{x^2-y^2}":["the plane $x = y$","the plane $x = -y$"], "d_{z^2}":["two cones around the $z$ axis"] };
const WHY_NODE={ "p_x":"$p_x$ points along $x$, so it is zero where $x = 0$: the $yz$ plane.", "p_y":"$p_y$ points along $y$, so it is zero where $y = 0$: the $xz$ plane.", "p_z":"$p_z$ points along $z$, so it is zero where $z = 0$: the $xy$ plane.",
  "d_{xy}":"$d_{xy}$ goes as $xy$: zero when $x = 0$ (the $yz$ plane) or $y = 0$ (the $xz$ plane). Its lobes sit between the $x$ and $y$ axes.", "d_{xz}":"$d_{xz}$ goes as $xz$: zero when $x = 0$ (the $yz$ plane) or $z = 0$ (the $xy$ plane).", "d_{yz}":"$d_{yz}$ goes as $yz$: zero when $y = 0$ (the $xz$ plane) or $z = 0$ (the $xy$ plane).",
  "d_{x^2-y^2}":"$d_{x^2-y^2}$ goes as $x^2 - y^2$: zero on the two vertical planes $x = y$ and $x = -y$. Its lobes lie along the $x$ and $y$ axes.", "d_{z^2}":"$d_{z^2}$ has two lobes on $z$ and a ring around the middle; its two angular nodes are cones, not planes." };
const pn=(o,R)=>o[0]==="p"?R.int(2,5):R.int(3,5);
const nlList=[]; for(let n=1;n<=6;n++) for(let l=0;l<Math.min(n,4);l++) nlList.push([n,l]);

/* ---------- Module 3 data ---------- */
const IE1={Li:520,Be:900,B:801,C:1086,N:1402,O:1314,F:1681,Ne:2081,Na:496,Mg:738,Al:578,Si:786,P:1012,S:1000,Cl:1251,Ar:1521};
const MAIN=[]; ["Li","Be","B","C","N","O","F","Na","Mg","Al","Si","P","S","Cl","K","Ca","Ge","As","Se","Br","Rb","Sr","Sn","Sb","Te","I"].forEach(s=>MAIN.push(s));
const pos=s=>CH().position(CH().Z(s));
function dominantSet(R,kind){ /* kind: "big" (largest radius / lowest IE) or "small" (smallest radius / highest IE). Every distractor is clearly on the other side by the trends. */
  for(let t=0;t<200;t++){ const a=R.pick(MAIN), pa=pos(a);
    const ok=s=>{ if(s===a) return false; const p=pos(s); if(p.period===pa.period&&p.group===pa.group) return false;
      const dom= kind==="big" ? (p.period<=pa.period && p.group>=pa.group) : (p.period>=pa.period && p.group<=pa.group);
      if(!dom) return false; const g=[p.group,pa.group].sort((x,y)=>x-y).join(","); if(g==="2,13"||g==="15,16") return false; return true; };
    const pool=MAIN.filter(ok); if(pool.length>=4) return [a,...pickN(R,pool,4)]; }
  return null; }
const TM=[]; for(let z=21;z<=30;z++) for(const q of [1,2,3]) { const sy=["Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn"][z-21]; if(sy==="Sc"&&q!==3) continue; if(sy==="Zn"&&q!==2) continue; if(sy==="Cu"&&q===3) continue; if(sy==="Ti"&&q===1) continue; if(["V","Mn","Fe","Co","Ni"].includes(sy)&&q===1) continue; TM.push([z,q]); }
const MG_IONS=[[11,1],[12,2],[13,3],[8,-2],[16,-2],[17,-1],[7,-3],[9,-1],[19,1],[20,2],[35,-1],[15,-3],[34,-2]];
const ionLabel=(z,q)=>{ const s=CH().sym(z); return q===0?s:Math.abs(q)>1?`${s}^${Math.abs(q)}${q>0?"+":"-"}`:`${s}${q>0?"+":"-"}`; };

/* ---------- Module 4 data ---------- */
const VAL={H:1,Be:2,B:3,C:4,N:5,O:6,F:7,Al:3,Si:4,P:5,S:6,Cl:7,Ge:4,As:5,Se:6,Br:7,Sn:4,Sb:5,Te:6,I:7,Xe:8,Kr:8};
const LP=[["XeF2",3,2],["XeF4",2,4],["ClF3",2,3],["BrF3",2,3],["BrF5",1,5],["IF5",1,5],["SF4",1,4],["SeCl4",1,4],["TeCl4",1,4],["SF6",0,6],["PCl5",0,5],["AsF5",0,5],["ICl4-",2,4],["ICl2-",3,2],["I3-",3,2],["BrF4-",2,4],["IF4+",1,4],["NH3",1,3],["H2O",2,2],["PCl3",1,3],["SCl2",2,2],["CH4",0,4],["BBr3",0,3],["SiCl4",0,4],["NF3",1,3],["OF2",2,2],["BeCl2",0,2],["AlCl3",0,3]];
const RES_YES=[["O3","Two structures swap which end O has the double bond."],["NO2-","Two structures swap which O has the double bond."],["NO3-","Three structures, the N=O at each O in turn."],["CO3^2-","Three structures, the C=O at each O in turn."],["HCO2-","Formate (H on C): two structures swap which O has the C=O."],["CH3CO2-","Acetate: two structures swap which O has the C=O."],["C6H6","Benzene: two structures swap the positions of the three C=C bonds."]];
const RES_NO=[["SCN-","Its structures put the −1 on S or on N: non-equivalent."],["OCN-","Its structures put the −1 on O or on N: non-equivalent."],["NH4+","Only single bonds and no lone pair on N: one structure."],["CH4","One structure."],["H2O","One structure."],["HCN","H–C≡N is the one good structure."],["NH3","One structure."],["N2O","Its structures place charges on different atoms: non-equivalent."]];
const BO=[["NO2-","N–O",1.5,"3 bonds over 2 equivalent N–O links."],["O3","O–O",1.5,"3 bonds over 2 equivalent O–O links."],["NO3-","N–O",4/3,"4 bonds over 3 equivalent N–O links."],["CO3^2-","C–O",4/3,"4 bonds over 3 equivalent C–O links."],["HCO2-","C–O",1.5,"3 bonds over the 2 C–O links (H is on C)."],["CH3CO2-","C–O",1.5,"3 bonds over the 2 C–O links of the CO2 group."],["C6H6","C–C",1.5,"Each ring C–C is single in one structure and double in the other."],["CN-","C–N",3,"One structure with a triple bond."],["CO","C–O",3,"C≡O, one lone pair on each atom."],["N2","N–N",3,"N≡N."],["HCN","C–N",3,"H–C≡N."]];

const TF=(R,trues,falses,kind)=>{ /* kind "true": one true + four false; "false": one false + four true */
  const one=kind==="true"?R.pick(trues):R.pick(falses), rest=pickN(R,kind==="true"?falses:trues,4);
  return {one,rest}; };

C120.addDrills([
/* ======================= Module 2 ======================= */
{id:"D.nodeplane", lec:"M2C6", title:"Angular nodes of p and d orbitals", ref:"Module 2, pp. 22-24",
 how:`<p>An angular node is a plane (or cone) through the nucleus where $\\psi = 0$. Read it off the orbital's label:</p><ul><li>$p_x$, $p_y$, $p_z$: the node is the plane where that coordinate is zero. $p_y$ is zero when $y = 0$, which is the $xz$ plane.</li><li>$d_{xy}$, $d_{xz}$, $d_{yz}$: zero when either letter is zero, so two planes. $d_{xz}$: $x = 0$ (the $yz$ plane) and $z = 0$ (the $xy$ plane).</li><li>$d_{x^2-y^2}$: the planes $x = \\pm y$, between its lobes. $d_{z^2}$: two cones.</li></ul><p>Number of angular nodes $= l$, whatever $n$ is.</p>`,
 gen(R){ const keys=Object.keys(NODES);
  if(R()<0.5){ const o=R.pick(keys), n=pn(o,R); const right=NODES[o].join(" and ");
    return mc(`Where are the angular node(s) of a $${n}${o}$ orbital?`,[right,WHY_NODE[o]],R.shuffle(keys.filter(k=>k!==o)).map(k=>[NODES[k].join(" and "),`That is $${k}$. ${WHY_NODE[o]}`]).concat([["the nucleus only","The nucleus is on every node, but an angular node is a whole plane or cone."]])); }
  const plane=R.pick(["xy","xz","yz"]); const has=keys.filter(k=>NODES[k].includes(`the $${plane}$ plane`)), not=keys.filter(k=>!has.includes(k));
  const o=R.pick(has);
  return mc(`Pick the orbital whose electron density is zero at every point of the $${plane}$ plane.`,[`$${pn(o,R)}${o}$`,WHY_NODE[o]],R.shuffle(not).map(k=>[`$${pn(k,R)}${k}$`,`It has density in the $${plane}$ plane. ${WHY_NODE[k]}`])); }},

{id:"D.nodecount", lec:"M2C6", title:"Count nodes, or name the orbital from its nodes", ref:"Module 2, pp. 22-24",
 how:`<p>Three counts, all from $n$ and $l$:</p><ul><li>angular nodes $= l$ (s 0, p 1, d 2, f 3)</li><li>radial nodes $= n - l - 1$</li><li>total nodes $= n - 1$</li></ul><p>Going backwards: angular nodes give $l$ (the letter), then $n = \\text{radial} + l + 1$.</p>`,
 gen(R){ const pool=nlList.filter(([n,l])=>n>=2); const [n,l]=R.pick(pool), r=n-l-1;
  const txt=(a,b)=>`${a} angular, ${b} radial`;
  if(R()<0.5) return mc(`Count the nodes of a ${lab(n,l)} orbital of hydrogen.`,[txt(l,r),`Angular $= l = ${l}$. Radial $= n-l-1 = ${n}-${l}-1 = ${r}$.`],
    [[txt(r,l),"Swapped: angular nodes are $l$, radial are $n-l-1$."],[txt(l,n-l),"Radial nodes are $n-l-1$, not $n-l$ (that is the number of RDF maxima)."],[txt(0,n-1),`That is ${n}s.`],[txt(l,n-1),"$n-1$ is the total number of nodes, not the radial ones."],[txt(l+1,Math.max(0,r-1)),"Angular nodes equal $l$."],[txt(l,r+1),"Radial nodes are $n-l-1$."],[txt(l+1,r),"Angular nodes equal $l$."],[txt(l,r+2),"Radial nodes are $n-l-1$."],[txt(Math.max(0,l-1),r+1),"Angular nodes equal $l$."],[txt(l+2,r),"Angular nodes equal $l$."]]);
  const near=nlList.filter(([a,b])=>!(a===n&&b===l)&&(a-b-1===r||b===l||Math.abs(a-n)<=1)); const wrong=[...R.shuffle(near),...R.shuffle(nlList.filter(([a,b])=>!(a===n&&b===l)&&!near.some(x=>x[0]===a&&x[1]===b)))];
  return mc(`A hydrogen orbital has exactly ${l} angular and ${r} radial node${r===1?"":"s"}. Name it.`,[lab(n,l),`${l} angular nodes means $l = ${l}$ (${LET[l]}). Then $n = ${r} + ${l} + 1 = ${n}$.`],
    wrong.map(([a,b])=>[lab(a,b),`${lab(a,b)} has ${b} angular and ${a-b-1} radial nodes.`])); }},

{id:"D.plot", lec:"M2C7", title:"Name the orbital from its R(r), R² or RDF plot", ref:"Module 2, pp. 25-30",
 how:`<p>What to read off a radial plot:</p><ul><li><b>At $r = 0$:</b> $R$ (and $R^2$) is largest there only for s orbitals. For $l \\ge 1$ it starts at zero. The RDF ($r^2R^2$) always starts at zero.</li><li><b>Radial nodes:</b> each place $R$ crosses zero (or $R^2$ and the RDF touch zero between bumps). Count $= n-l-1$.</li><li><b>Maxima:</b> $R^2$ and the RDF have $n - l$ bumps.</li><li><b>Most probable radius:</b> the tallest peak of the RDF, not of $R^2$.</li></ul><p>Then combine: bumps $= n-l$ plus the $l$ you know gives $n$.</p>`,
 gen(R){ const pool=nlList.filter(([n,l])=>n<=5&&l<=2); const [n,l]=R.pick(pool), r=n-l-1, m=n-l;
  const v=R.int(0,2);
  if(v===0){ const desc=`Its radial factor $R(r)$ is ${l===0?"largest":"zero"} at $r = 0$ and crosses zero ${r===0?"nowhere":r===1?"once":r===2?"twice":r+" times"} before it dies away.`;
    const fits=([a,b])=>(b===0)===(l===0)&&a-b-1===r;
    const wrong=R.shuffle(pool.filter(x=>!fits(x)));
    return mc(`A hydrogen orbital is described like this. ${desc} Which orbital could it be?`,[lab(n,l),`${l===0?"Largest at $r = 0$ means an s orbital":"Zero at $r = 0$ means $l \\ge 1$"}; ${r} sign change${r===1?"":"s"} means ${r} radial node${r===1?"":"s"}, and ${lab(n,l)} has $${n}-${l}-1 = ${r}$.`],
      wrong.map(([a,b])=>[lab(a,b),`${lab(a,b)} ${b===0?"is largest at $r = 0$":"starts at zero"} and has ${a-b-1} radial node${a-b-1===1?"":"s"}.`])); }
  if(v===1){ const wrong=R.shuffle(pool.filter(([a,b])=>!(a-b===m&&b===l)));
    return mc(`The radial distribution function of a hydrogen orbital has ${m} maxim${m===1?"um":"a"}, and the orbital has ${l} angular node${l===1?"":"s"}. Which orbital is it?`,[lab(n,l),`Maxima $= n-l$, so $n = ${m} + ${l} = ${n}$, and ${l} angular nodes means ${LET[l]}.`],
      wrong.map(([a,b])=>[lab(a,b),`${lab(a,b)} has ${a-b} maxim${a-b===1?"um":"a"} and ${b} angular node${b===1?"":"s"}.`])); }
  const wrongN=R.shuffle(pool.filter(([a,b])=>!(a===n&&b===l)));
  const sp=`$R^2$ is ${l===0?"largest":"zero"} at $r = 0$ and has ${m} bump${m===1?"":"s"}`;
  return mc(`A plot of $R(r)^2$ against $r$ for a hydrogen orbital: ${sp}. Which orbital fits?`,[lab(n,l),`${l===0?"Largest at the nucleus: s":"Zero at the nucleus: $l \\ge 1$"}. Bumps $= n-l = ${m}$. Of these options only ${lab(n,l)} fits.`],
    wrongN.filter(([a,b])=>!((b===0)===(l===0)&&a-b===m)).map(([a,b])=>[lab(a,b),`${lab(a,b)}: $R^2$ ${b===0?"largest":"zero"} at $r = 0$, ${a-b} bump${a-b===1?"":"s"}.`])); }},

{id:"D.transition", lec:"M2C3", title:"Hydrogen transitions: energy, wavelength, longest or shortest", ref:"Module 2, pp. 9-10",
 how:`<p>For hydrogen only, $E_n = -R_H/n^2$ with $R_H = 2.179\\times10^{-18}$ J.</p><ol><li>Energy of the photon: $\\Delta E = R_H\\left|\\frac{1}{n_i^2}-\\frac{1}{n_f^2}\\right|$. Going up absorbs, going down emits.</li><li>Wavelength: $\\lambda = \\frac{hc}{\\Delta E}$. Bigger gap, shorter wavelength.</li><li>The letter (s, p, d) does not change the energy in hydrogen. Only $n$ matters.</li></ol><p>Ground state means $n = 1$.</p>`,
 gen(R){ const {h,c,RH}=K(); const v=R.int(0,2);
  const pair=()=>{ let a=R.int(1,6), b=R.int(1,6); while(b===a||(a===1&&b===3)||(a===2&&b===5)) { a=R.int(1,6); b=R.int(1,6); } return [a,b]; };
  const orb=n=>n===1?"1s":`${n}${R.pick("spd".slice(0,Math.min(3,n)))}`;
  if(v<2){ const [a,b]=pair(); const up=b>a; const E=RH*Math.abs(1/a**2-1/b**2);
    const from=R()<0.5?`$n = ${a}$ to $n = ${b}$`:`the ${orb(a)} orbital to the ${orb(b)} orbital`;
    if(v===0){ const w=[[S(RH*Math.abs(1/a-1/b),3,"J"),"The squares were left off: use $1/n^2$."],[S(RH/Math.min(a,b)**2,3,"J"),"That is the energy to remove the electron from the lower level, not this jump."],[S(RH*(1/a**2+1/b**2),3,"J"),"Subtract the two terms, don't add them."],[S(RH*Math.abs(1-1/Math.max(a,b)**2),3,"J"),"That starts from $n = 1$."],[S(RH/Math.max(a,b)**2,3,"J"),"That is only one of the two terms."]];
      return mc(`How much energy is ${up?"absorbed":"released"} when the electron in a hydrogen atom goes from ${from}? Choose the closest answer.`,[S(E,3,"J"),`$\\Delta E = R_H\\left|\\frac{1}{${a}^2}-\\frac{1}{${b}^2}\\right| = ${sci(E,4)}$ J, ${up?"absorbed (going up)":"released (going down)"}.`],w); }
    const lam=h*c/E*1e9; const nm=x=>`${x>=100?x.toFixed(0):x.toPrecision(3)} nm`;
    return mc(`The electron in a hydrogen atom goes from ${from}. What is the wavelength of the photon ${up?"absorbed":"emitted"}? Choose the closest answer.`,[nm(lam),`$\\Delta E = ${sci(E,4)}$ J, $\\lambda = \\frac{hc}{\\Delta E} = ${sci(lam*1e-9,3)}$ m.`],
      [[nm(h*c/(RH*Math.abs(1/a-1/b))*1e9),"The squares were left off."],[nm(h*c/(RH/Math.min(a,b)**2)*1e9),"That uses only the lower level's energy."],[nm(c/(E/h)*1e9*2),"Not $hc/\\Delta E$."],[nm(h*c/(RH*(1/a**2+1/b**2))*1e9),"Subtract the terms, don't add them."],[nm(lam*4),"Not $hc/\\Delta E$ for these levels."]]); }
  let set=null; for(let t=0;t<100&&!set;t++){ const ps=[]; while(ps.length<5){ const p=pair(); if(!ps.some(q=>q[0]===p[0]&&q[1]===p[1])) ps.push(p); } const g=ps.map(([a,b])=>Math.abs(1/a**2-1/b**2)); const uniq=new Set(g.map(x=>x.toFixed(6))).size===5; if(uniq) set={ps,g}; }
  const want=R.pick(["longest wavelength","shortest wavelength","largest energy","smallest energy"]);
  const small=want==="longest wavelength"||want==="smallest energy"; const gs=set.g; const k=gs.indexOf(small?Math.min(...gs):Math.max(...gs));
  const lab2=([a,b])=>`${orb(a)} $\\to$ ${orb(b)}`; const labs=set.ps.map(lab2);
  return mc(`Of these jumps in a hydrogen atom, which one goes with the photon of <b>${want}</b>?`,[labs[k],`Compare $\\left|\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right|$: ${set.ps.map(([a,b],i)=>`${a}→${b}: ${gs[i].toFixed(3)}`).join(", ")}. ${small?"Smallest gap: smallest energy, longest wavelength.":"Biggest gap: largest energy, shortest wavelength."} Only $n$ matters in hydrogen.`],
    set.ps.map((p,i)=>i===k?null:[labs[i],`Gap ${gs[i].toFixed(3)} $R_H$, not the ${small?"smallest":"biggest"}.`]).filter(Boolean)); }},

{id:"D.debroglie", lec:"M2C4", title:"de Broglie wavelength of an electron or a molecule", ref:"Module 2, pp. 12-14",
 how:`<p>$\\lambda = \\frac{h}{mv}$, with $m$ in kg, $v$ in m s$^{-1}$, $\\lambda$ in m (1 J = 1 kg m$^2$ s$^{-2}$).</p><ol><li>For a molecule, find the mass of <b>one</b> molecule: molar mass in kg mol$^{-1}$ divided by $N_A$.</li><li>Rearrange if they give $\\lambda$: $v = \\frac{h}{m\\lambda}$.</li><li>Convert nm or pm to m before you divide.</li></ol><p>Common traps: grams instead of kg (off by 1000), forgetting $N_A$ (off by $6\\times10^{23}$), and upside-down answers.</p>`,
 gen(R){ const {h,NA,me}=K(); const sp=R.pick(["electron","H2","He","N2","O2","Ar","CO2","CH4"]);
  const isE=sp==="electron"; const M=isE?null:CH().mm(sp); const m=isE?me:M*1e-3/NA; const name=isE?"An electron":`A $\\ce{${sp}}$ molecule (molar mass ${M.toFixed(2)} g mol$^{-1}$)`;
  if(R()<0.55){ const v=isE?R.sig(1e5,9e6,3):R.sig(100,2000,3); const lam=h/(m*v);
    const w=[[S(lam/1000,3,"m"),"The mass was used in grams: use kg."],[S(isE?lam*1e3:h/(M*1e-3*v),3,"m"),isE?"Not $h/(mv)$ for these numbers.":"This uses the mass of a whole mole: divide by $N_A$ first."],[S(1/lam,3,"m"),"This is $\\frac{mv}{h}$, upside down."],[S(lam*2*Math.PI,3,"m"),"No $2\\pi$ in $\\lambda = h/mv$."],[S(lam*1e9,3,"m"),"Not $h/(mv)$ in metres."]];
    return mc(`${name} moves at $${sci(v,3)}$ m s$^{-1}$. What is its de Broglie wavelength? Choose the closest answer.`,[S(lam,3,"m"),`${isE?"":`$m = \\frac{${(M*1e-3).toPrecision(4)}\\ \\text{kg mol}^{-1}}{6.022\\times10^{23}} = ${sci(m,4)}$ kg. `}$\\lambda = \\frac{h}{mv} = \\frac{6.626\\times10^{-34}}{(${sci(m,4)})(${sci(v,3)})} = ${sci(lam,3)}$ m.`],w); }
  const lnm=isE?R.sig(0.1,5,3):R.sig(50,900,3); const lam=lnm*1e-9; const v=h/(m*lam);
  const w=[[S(v/1000,3,"m s$^{-1}$"),"The mass was used in grams: use kg."],[S(isE?v*1e3:h/(M*1e-3*lam),3,"m s$^{-1}$"),isE?"Not $h/(m\\lambda)$ for these numbers.":"This uses the mass of a whole mole: divide by $N_A$ first."],[S(v*1e-9,3,"m s$^{-1}$"),"The nm were not converted to m."],[S(1/v,3,"m s$^{-1}$"),"This is $\\frac{m\\lambda}{h}$, upside down."],[S(v*1e9,3,"m s$^{-1}$"),"Check the nm to m conversion."]];
  return mc(`${name} has a de Broglie wavelength of ${lnm} nm. How fast is it moving? Choose the closest answer.`,[S(v,3,"m s$^{-1}$"),`${isE?"":`$m = ${sci(m,4)}$ kg per molecule. `}$v = \\frac{h}{m\\lambda} = \\frac{6.626\\times10^{-34}}{(${sci(m,4)})(${sci(lam,3)})} = ${sci(v,3)}$ m s$^{-1}$.`],w); }},

{id:"D.heisenberg", lec:"M2C4", title:"Heisenberg: smallest uncertainty in position or speed", ref:"Module 2, p. 15",
 how:`<p>$\\Delta x\\,\\Delta p \\ge \\frac{h}{4\\pi}$ and $\\Delta p = m\\,\\Delta v$. So the smallest uncertainties are</p><p>$$\\Delta x = \\frac{h}{4\\pi m\\,\\Delta v} \\qquad \\Delta v = \\frac{h}{4\\pi m\\,\\Delta x}$$</p><p>Check the $4\\pi$, use kg, and convert pm or nm to m.</p>`,
 gen(R){ const {h,me}=K(); if(R()<0.5){ const dv=R.sig(1e3,5e6,2); const dx=h/(4*Math.PI*me*dv);
   return mc(`The speed of an electron is known to within $\\pm${sci(dv,2)}$ m s$^{-1}$. What is the smallest possible uncertainty in its position? Choose the closest answer.`,[S(dx,2,"m"),`$\\Delta x = \\frac{h}{4\\pi m\\Delta v} = \\frac{6.626\\times10^{-34}}{4\\pi(9.109\\times10^{-31})(${sci(dv,2)})} = ${sci(dx,3)}$ m.`],
    [[S(dx*4*Math.PI,2,"m"),"The $4\\pi$ was left out."],[S(dx*2,2,"m"),"This uses $2\\pi$ instead of $4\\pi$."],[S(dx/2,2,"m"),"This uses $8\\pi$."],[S(dx/1000,2,"m"),"The mass was used in grams."],[S(1/dx,2,"m"),"Upside down."]]); }
  const xpm=R.pick([10,25,50,100,200,500]); const dx=xpm*1e-12; const dv=h/(4*Math.PI*me*dx);
  return mc(`An electron's position is known to within ${xpm} pm. What is the smallest possible uncertainty in its speed? Choose the closest answer.`,[S(dv,2,"m s$^{-1}$"),`$\\Delta v = \\frac{h}{4\\pi m\\Delta x} = \\frac{6.626\\times10^{-34}}{4\\pi(9.109\\times10^{-31})(${sci(dx,2)})} = ${sci(dv,3)}$ m s$^{-1}$.`],
    [[S(dv*4*Math.PI,2,"m s$^{-1}$"),"The $4\\pi$ was left out."],[S(dv*2,2,"m s$^{-1}$"),"This uses $2\\pi$."],[S(dv*1e-12,2,"m s$^{-1}$"),"The pm were not converted to m."],[S(dv/1000,2,"m s$^{-1}$"),"The mass was used in grams."],[S(dv/2,2,"m s$^{-1}$"),"This uses $8\\pi$."]]); }},

{id:"D.qnumbers", lec:"M2C5", title:"Quantum number sets: allowed or not, and which orbital", ref:"Module 2, pp. 18-20 and 32",
 how:`<p>The rules:</p><ul><li>$n = 1, 2, 3, \\dots$</li><li>$l = 0$ to $n-1$ (whole numbers). The letter: 0 s, 1 p, 2 d, 3 f.</li><li>$m_l = -l$ to $+l$ (whole numbers)</li><li>$m_s = +\\tfrac12$ or $-\\tfrac12$ only</li></ul><p>$n$ and $l$ name the orbital (3, 2 is 3d); $m_l$ only says which one of the 3d's.</p>`,
 gen(R){ const v=R.int(0,2); const valid=()=>{ const n=R.int(1,5), l=R.int(0,n-1), ml=R.int(-l,l), ms=R.pick(["+\\tfrac12","-\\tfrac12"]); return [n,l,ml,ms]; };
  const show=([n,l,ml,ms])=>`$(${n},\\ ${l},\\ ${ml},\\ ${ms})$`;
  const bad=()=>{ const k=R.int(0,4); const [n,l,ml,ms]=valid();
    if(k===0){ const nn=R.int(1,4); return [[nn,nn,0,ms],`$l$ must be less than $n$: with $n = ${nn}$, $l$ goes up to ${nn-1}.`]; }
    if(k===1){ const ll=Math.max(1,l); const nn=Math.max(n,ll+1); return [[nn,ll,ll+1,ms],`$|m_l|$ can't be bigger than $l = ${ll}$.`]; }
    if(k===2) return [[n,l,ml,R.pick(["0","+1","-1"])],"$m_s$ can only be $+\\tfrac12$ or $-\\tfrac12$."];
    if(k===3) return [[n,-1,0,ms],"$l$ can't be negative."];
    return [[0,0,0,ms],"$n$ starts at 1."]; };
  if(v===0){ const g=valid(); const ws=[]; while(ws.length<14){ const b=bad(); ws.push([show(b[0]),b[1]]); }
    return mc("Which set of quantum numbers $(n,\\ l,\\ m_l,\\ m_s)$ is allowed for an electron?",[show(g),`$l < n$, $|m_l| \\le l$ and $m_s = \\pm\\tfrac12$: all rules met. It is a ${lab(g[0],g[1])} electron.`],ws); }
  if(v===1){ const b=bad(); const ws=[]; for(let i=0;i<14;i++){ const g=valid(); ws.push([show(g),`Allowed: a ${lab(g[0],g[1])} electron.`]); }
    return mc("Which set of quantum numbers $(n,\\ l,\\ m_l,\\ m_s)$ is NOT allowed?",[show(b[0]),b[1]],ws); }
  const n=R.int(2,5), l=R.int(0,Math.min(3,n-1)), ml=R.int(-l,l);
  return mc(`An electron in a hydrogen-like atom has $n = ${n}$, $l = ${l}$, $m_l = ${ml}$. Which orbital is it in?`,[lab(n,l),`$n = ${n}$ and $l = ${l}$ (${LET[l]}) make ${lab(n,l)}; $m_l$ picks one of the ${2*l+1} ${lab(n,l)} orbitals.`],
    [[`${n}${LET[Math.min(3,l+1)]}`,`$l = ${Math.min(3,l+1)}$ would be ${LET[Math.min(3,l+1)]}.`],[`${n+1}${LET[l]}`,`$n$ is ${n}.`],[`${n}${LET[Math.max(0,l-1)]}`,`$l = ${Math.max(0,l-1)}$ would be ${LET[Math.max(0,l-1)]}.`],[`${n}f`,"f needs $l = 3$."],[`${Math.max(1,n-1)}${LET[l]}`,`$n$ is ${n}.`],[`${n}${LET[Math.abs(ml)]||"s"}`,"The letter comes from $l$, not $m_l$."]]); }},

{id:"D.m2true", lec:"M2C4", title:"True or false: waves, uncertainty and the wavefunction", ref:"Module 2, pp. 12-17",
 how:`<p>The ideas these statements test:</p><ul><li>de Broglie: every moving particle has $\\lambda = h/mv$. Heavier or faster means shorter.</li><li>Diffraction is a wave property. Electrons diffract, so electrons act like waves.</li><li>Heisenberg: position and momentum can't both be known exactly at once. It is a limit of nature, not of instruments.</li><li>$\\psi$ itself has no physical meaning. $|\\psi|^2$ is a probability density; $|\\psi|^2 dV$ is the probability in a small volume.</li><li>In hydrogen the energy depends only on $n$. Orbitals get smaller and lower in energy as $Z$ increases.</li></ul><p>Read every word: a statement with one wrong detail is false.</p>`,
 gen(R){ const T=["$|\\psi|^2$ gives the probability density of the electron at a point.","$|\\psi|^2\\,dV$ is the probability of finding the electron in a small volume $dV$ around a point.","Any moving particle has a de Broglie wavelength, $\\lambda = h/mv$.","Electron diffraction shows that electrons behave like waves.","In hydrogen, every orbital with the same $n$ has the same energy.","Position and momentum of an electron can't both be known exactly at the same time.","The more precisely an electron's position is known, the less precisely its momentum is known.","The 3d orbital of hydrogen is larger than the 3d orbital of $\\ce{He+}$.","At the same speed, a proton has a shorter de Broglie wavelength than an electron."];
  const F=["$\\psi$ itself is the probability of finding the electron at a point.","Only electrons have de Broglie wavelengths; larger objects do not.","At the same speed, a heavier particle has a longer de Broglie wavelength.","Diffraction is evidence that electrons behave like particles.","The uncertainty principle comes from measuring instruments that aren't precise enough.","In hydrogen, a 3d orbital is higher in energy than a 3s orbital.","An orbital gets larger as the nuclear charge increases.","The electron moves around the nucleus in a fixed circular path, as Bohr pictured it.","Knowing an electron's position exactly also fixes its momentum exactly."];
  const kind=R()<0.7?"true":"false"; const {one,rest}=TF(R,T,F,kind);
  const why=s=>T.includes(s)?"True.":"False. "+({[F[0]]:"It is $|\\psi|^2$ that relates to probability.",[F[1]]:"Every moving particle has one; for big objects it is just too small to notice.",[F[2]]:"$\\lambda = h/mv$: more mass, shorter wavelength.",[F[3]]:"Diffraction is a wave property.",[F[4]]:"It is a basic limit.",[F[5]]:"In hydrogen, 3s, 3p and 3d have the same energy.",[F[6]]:"More nuclear charge pulls the electron in: the orbital shrinks.",[F[7]]:"The Bohr model is wrong: electrons are described by orbitals, regions of probability.",[F[8]]:"Exact position means completely uncertain momentum."})[s];
  return mc(`Pick the <b>${kind==="true"?"true":"false"}</b> statement.`,[one,why(one)],rest.map(s=>[s,why(s)])); }},

/* ======================= Module 3 ======================= */
{id:"D.multie", lec:"M3C1", title:"Orbital energies in multielectron atoms", ref:"Module 3, pp. 1-2",
 how:`<ul><li>Hydrogen (one electron): energy depends only on $n$, so 2s and 2p have the same energy, and $E_n = -R_H/n^2$ works.</li><li>Multielectron atoms: electron-electron repulsion splits each shell, so s < p < d < f within a shell. $-R_H/n^2$ does not give their energies.</li><li>As $Z$ increases, a given orbital (1s, say) is pulled in: lower in energy and smaller. So the 1s electrons of K are held more tightly than those of Na.</li></ul>`,
 gen(R){ const T=["In a multielectron atom, the 2s subshell is lower in energy than the 2p subshell.","Within a shell of a multielectron atom, the subshells are ordered s < p < d < f in energy.","Electron-electron repulsion is why the subshells of a shell have different energies in a multielectron atom.","As $Z$ increases, the 1s orbital gets lower in energy and smaller.","In hydrogen, the 2s and 2p orbitals have the same energy.","$E_n = -R_H/n^2$ only applies to one-electron species.","The 1s electrons of K are held more tightly than the 1s electrons of Na."];
  const F=["In a multielectron atom, the 3s, 3p and 3d subshells have the same energy.","The energy of a 2s electron in Li is $-R_H/2^2$.","The 1s orbital of Ar is larger than the 1s orbital of H.","Increasing $Z$ raises the energy of the 1s orbital.","In hydrogen, the 2s orbital is lower in energy than the 2p orbital.","Electron-electron repulsion makes all the subshells of a shell equal in energy.","The 1s electrons of Na are held more tightly than the 1s electrons of Rb."];
  const fw={[F[0]]:"Only in hydrogen. Repulsion splits them: 3s < 3p < 3d.",[F[1]]:"That formula is only for one-electron species.",[F[2]]:"Higher $Z$ pulls the 1s in: smaller.",[F[3]]:"More nuclear charge lowers the energy.",[F[4]]:"In hydrogen they have the same energy.",[F[5]]:"Repulsion is what splits them.",[F[6]]:"Rb has the larger $Z$, so its 1s electrons are held more tightly."};
  if(R()<0.5){ const items=pickN(R,[...T.map(s=>[s,true,"True."]),...F.map(s=>[s,false,"False. "+fw[s]])],5); return {q:"Which statements about orbital energies are true? Select all that apply. You may select more than one, one, or none of the options.",opts:items,multi:true}; }
  const kind=R()<0.6?"true":"false"; const {one,rest}=TF(R,T,F,kind); const why=s=>T.includes(s)?"True.":"False. "+fw[s];
  return mc(`About multielectron atoms: pick the <b>${kind==="true"?"true":"false"}</b> statement.`,[one,why(one)],rest.map(s=>[s,why(s)])); }},

{id:"D.config", lec:"M3C3", title:"Electron configurations of atoms (including Cr and Cu)", ref:"Module 3, pp. 3-7",
 how:`<ol><li>Find the noble gas before the element: that is the core ([He], [Ne], [Ar], [Kr]).</li><li>Fill in the $n + l$ order: 4s before 3d, 3d before 4p.</li><li>Know the two exceptions: Cr is $[\\mathrm{Ar}]\\,4s^1\\,3d^5$ and Cu is $[\\mathrm{Ar}]\\,4s^1\\,3d^{10}$.</li></ol><p>The notes call "half-filled shells are extra stable" a myth. You only need to know these two exceptions.</p>`,
 gen(R){ let z=R()<0.3?R.pick([24,29]):R.int(5,35); if(z===10||z===18) z++; const exc=z===24||z===29; const s=CH().sym(z); const occ=CH().occupancy(z);
  const plain=()=>{ const o={}; let left=z; for(const sub of CH().ORDER){ if(left<=0) break; const cap={s:2,p:6,d:10,f:14}[sub[1]]; const c=Math.min(cap,left); o[sub]=c; left-=c; } return o; };
  const w=[];
  if(s==="Cr"||s==="Cu") w.push([occStr(plain()),`This is what the $n+l$ rule predicts, but ${s} is one of the two exceptions.`]);
  if(occ["3d"]){ const o={...occ}; const x=o["4s"]||0; o["3d"]+=x; delete o["4s"]; if(o["3d"]<=10) w.push([occStr(o),"4s fills before 3d in a neutral atom."]); const o2={...occ}; o2["4d"]=o2["3d"]; delete o2["3d"]; w.push([occStr(o2).replace("4d","4d"),"After 4s comes 3d, not 4d."]); }
  if(z>3){ w.push([cfg(z-1),`That is ${CH().sym(z-1)}, one electron short.`]); w.push([cfg(z+1),`That is ${CH().sym(z+1)}, one electron too many.`]); }
  w.push([cfg(z-2),`That is ${CH().sym(z-2)}, two electrons short.`]); if(z<36) w.push([cfg(z+2),`That is ${CH().sym(z+2)}, two electrons too many.`]);
  const core=CH().config(z,0,{short:true,tex:true}); const m=core.match(/\[\\mathrm\{(\w+)\}\]/);
  if(m){ const order=["He","Ne","Ar","Kr"]; const i=order.indexOf(m[1]); const alt=order[i+1]||order[i-1]; if(alt) w.push([`$${core.replace(m[1],alt)}$`,`The core is the noble gas before ${s}: [${m[1]}].`]); }
  if(!exc&&R()<0.7) return mc(`Choose the ground-state configuration of ${CH().NAME[s].toLowerCase()} (${s}, Z = ${z}).`,[cfg(z),s==="Cr"||s==="Cu"?`${s} is an exception: one 4s electron moves into 3d.`:"Core, then the $n+l$ filling order."],R.shuffle(w));
  const near=R.shuffle([z-2,z-1,z+1,z+2,z+3].filter(x=>x>=3&&x<=36));
  return mc(`Which element has the ground-state configuration ${cfg(z)}?`,[s,`Count the electrons: core plus ${cfg(z)} gives ${z}.`],near.map(x=>[CH().sym(x),`${CH().sym(x)} is ${cfg(x)}.`])); }},

{id:"D.ionconfig", lec:"M3C4", title:"Configurations of ions (transition metals lose 4s first)", ref:"Module 3, p. 8",
 how:`<ol><li>Write the neutral atom first.</li><li>Cation: take electrons from the highest $n$ first. For transition metals that means all of 4s before any 3d. Fe is $[\\mathrm{Ar}]\\,4s^2\\,3d^6$, so $\\ce{Fe^2+}$ is $[\\mathrm{Ar}]\\,3d^6$.</li><li>Anion: add electrons in the normal filling order.</li></ol>`,
 gen(R){ const [z,q]=R()<0.7?R.pick(TM.filter(([a,b])=>!(a===28&&b===2))):R.pick(MG_IONS); const s=CH().sym(z), L=ionLabel(z,q);
  const w=[[cfg(z),`That is neutral ${s}.`]];
  const neu=CH().occupancy(z);
  if(q>0 && neu["3d"]>=q){ const o={...neu}; o["3d"]-=q; if(!o["3d"]) delete o["3d"]; w.push([occStr(o),"Cations lose the 4s electrons (highest $n$) before 3d."]); }
  if(q>0 && neu["4s"] && neu["3d"]){ const o={...neu}; o["4s"]=1; o["3d"]=neu["3d"]-(q-(neu["4s"]-1)); if(o["3d"]>0&&o["3d"]!==CH().ionOccupancy(z,q)["3d"]) w.push([occStr(o),"Both 4s electrons go before any 3d."]); }
  w.push([cfg(z,q+(q>0?1:-1)),`That is ${ce(ionLabel(z,q+(q>0?1:-1)))}.`]); w.push([cfg(z,q>0?q-1:q+1),`That is ${ce(ionLabel(z,q>0?q-1:q+1))}.`]);
  if(q>0) w.push([cfg(z+q),"That adds electrons instead of removing them."]); else w.push([cfg(z+q),"That removes electrons instead of adding them."]);
  return mc(`Choose the ground-state configuration of ${ce(L)}.`,[cfg(z,q),`${s} is ${cfg(z)}. ${q>0?`Remove ${q} electron${q>1?"s":""}, highest $n$ first`:`Add ${-q} electron${q<-1?"s":""}`}: ${cfg(z,q)}.`],R.shuffle(w)); }},

{id:"D.lastqn", lec:"M3C2", title:"The highest-energy electron: quantum numbers and which atom", ref:"Module 3, pp. 3-5",
 how:`<p>The highest-energy electron is the last one added in the filling order. Its subshell gives $n$ and $l$: 3p means $n = 3$, $l = 1$; 4s means $n = 4$, $l = 0$; 3d means $n = 3$, $l = 2$.</p><p>So "$n = 3$, $l = 1$" points to an atom whose configuration ends in 3p: Al to Ar. Watch out: K and Ca end in 4s, and Sc to Zn end in 3d (which still has $n = 3$).</p>`,
 gen(R){ const last=z=>{ const o=CH().occupancy(z); const ks=CH().ORDER.filter(k=>o[k]); return ks[ks.length-1]; };
  const zs=[]; for(let z=1;z<=36;z++) if(z!==24&&z!==29) zs.push(z);
  const nl=k=>[+k[0],LET.indexOf(k[1])];
  if(R()<0.5){ const z=R.pick(zs.filter(x=>x>2)); const k=last(z); const [n,l]=nl(k);
    const others=R.shuffle(zs.filter(x=>last(x)!==k)).slice(0,8);
    const ml=R.int(-l,l), ms=R.pick(["+\\tfrac12","-\\tfrac12"]);
    return mc(`In a ground-state atom, the last electron added by the filling order sits in an orbital with $n = ${n}$ and $l = ${l}$ (for example $m_l = ${ml}$, $m_s = ${ms}$). In which of these atoms is that true?`,[CH().sym(z),`$n = ${n}$, $l = ${l}$ is ${k}, and ${CH().sym(z)} (${cfg(z)}) ends in ${k}.`],others.map(x=>[CH().sym(x),`${CH().sym(x)} ends in ${last(x)}.`])); }
  const z=R.pick(zs.filter(x=>x>4)); const k=last(z); const [n,l]=nl(k); const show=(a,b,c,d)=>`$(${a},\\ ${b},\\ ${c},\\ ${d})$`;
  const ms=R.pick(["+\\tfrac12","-\\tfrac12"]);
  const wr=[]; CH().ORDER.slice(0,9).forEach(kk=>{ if(kk===k) return; const [a,b]=nl(kk); wr.push([show(a,b,0,ms),`That is a ${kk} electron.`]); }); wr.push([show(n,l,l+1,ms),`$|m_l|$ can't exceed $l = ${l}$.`]);
  return mc(`Which set $(n,\\ l,\\ m_l,\\ m_s)$ could describe the highest-energy electron of a ground-state ${CH().sym(z)} atom?`,[show(n,l,R.int(-l,l),ms),`${CH().sym(z)} is ${cfg(z)}: the last electron is in ${k}, so $n = ${n}$, $l = ${l}$.`],R.shuffle(wr)); }},

{id:"D.unpaired", lec:"M3C4", title:"Unpaired electrons and magnetism", ref:"Module 3, pp. 4 and 9",
 how:`<ol><li>Write the configuration (ions: 4s out first).</li><li>Only the partly filled subshell matters. Hund's rule: one electron in each orbital before any pair. p has 3 orbitals, d has 5.</li><li>Unpaired $= $ electrons if that is at most the number of orbitals, otherwise $2\\times\\text{orbitals} - \\text{electrons}$. $d^6$: 4 unpaired. $p^4$: 2.</li><li>Any unpaired electron: paramagnetic. All paired: diamagnetic.</li></ol><p>Don't forget Cr ($4s^1\\,3d^5$): 6 unpaired.</p>`,
 gen(R){ const sp=()=>{ if(R()<0.6) return [R.int(1,36),0]; return R()<0.7?R.pick(TM):R.pick(MG_IONS); };
  const up=([z,q])=>CH().unpaired(CH().ionOccupancy(z,q)); const nm=([z,q])=>ce(ionLabel(z,q));
  const v=R.int(0,2);
  if(v===0){ const x=sp(); const u=up(x); const nums=[0,1,2,3,4,5,6].filter(n=>n!==u);
    return mc(`How many unpaired electrons does ${nm(x)} have in its ground state?`,[String(u),`${nm(x)} is ${cfg(x[0],x[1])}: ${u} unpaired by Hund's rule.`],R.shuffle(nums).map(n=>[String(n),"Fill each orbital singly first, then pair."])); }
  if(v===1){ for(let t=0;t<200;t++){ const set=[]; while(set.length<5){ const x=[R.int(3,36),0]; if(!set.some(y=>y[0]===x[0])) set.push(x); } const us=set.map(up); const mx=Math.max(...us); if(us.filter(u=>u===mx).length===1){ const k=us.indexOf(mx);
      return mc("Of these ground-state atoms, which one has the most unpaired electrons?",[nm(set[k]),`${nm(set[k])} is ${cfg(set[k][0])}: ${mx} unpaired.`],set.map((x,i)=>i===k?null:[nm(x),`${cfg(x[0])}: ${us[i]} unpaired.`]).filter(Boolean)); } } }
  const dia=R()<0.5; for(let t=0;t<200;t++){ const set=[]; while(set.length<5){ const x=sp(); if(!set.some(y=>y[0]===x[0]&&y[1]===x[1])) set.push(x); } const us=set.map(up); const hits=us.map(u=>dia?u===0:u>0); if(hits.filter(Boolean).length===1){ const k=hits.indexOf(true);
      return mc(`Pick the one that is <b>${dia?"diamagnetic (no unpaired electrons)":"paramagnetic (has unpaired electrons)"}</b> in its ground state.`,[nm(set[k]),`${cfg(set[k][0],set[k][1])}: ${us[k]} unpaired, so ${dia?"all paired":"paramagnetic"}.`],set.map((x,i)=>i===k?null:[nm(x),`${cfg(x[0],x[1])}: ${us[i]} unpaired, so ${us[i]?"paramagnetic":"diamagnetic"}.`]).filter(Boolean)); } }
  return null; }},

{id:"D.radius", lec:"M3C5", title:"Atomic radius trends", ref:"Module 3, p. 10",
 how:`<ul><li><b>Down a group:</b> bigger. Each period adds a new shell.</li><li><b>Across a period (left to right):</b> smaller. More protons, same shell, and electrons in the same shell only partly shield each other.</li><li>So the biggest atoms are bottom left (Rb, Cs), the smallest top right (F, Ne).</li></ul><p>To compare two atoms, they should agree on direction: one is both lower and further left.</p>`,
 gen(R){ const big=R()<0.5; const set=dominantSet(R,big?"big":"small"); if(!set) return null; const [a,...o]=set;
  const d=s=>{ const p=pos(s); return `period ${p.period}, group ${p.group}`; };
  return mc(`Of these atoms, which is the <b>${big?"biggest":"smallest"}</b> (by atomic radius)?`,[a,`${a} (${d(a)}) is ${big?"lower and/or further left":"higher and/or further right"} than every other option.`],o.map(s=>[s,`${s} (${d(s)}) is ${big?"higher or further right":"lower or further left"} than ${a}.`])); }},

{id:"D.ie", lec:"M3C5", title:"Ionization energy trends and the two dips", ref:"Module 3, pp. 11-13",
 how:`<ul><li>IE is the energy to pull an electron off a gas-phase atom. Small atoms hold on harder: IE goes <b>up</b> across a period and <b>down</b> a group (the opposite of radius).</li><li>Two dips across a period: group 2 to 13 (B is below Be: the 2p electron is easier to remove than 2s) and group 15 to 16 (O is below N: O's fourth p electron is paired).</li><li>Noble gases are highest in each period; the halogen comes next.</li></ul>`,
 gen(R){ const v=R.int(0,2);
  if(v===0){ const per=R.pick([["Li","Be","B","C","N","O","F"],["Na","Mg","Al","Si","P","S","Cl"]]); let st=R.int(0,3); if(R()<0.6) st=R.pick([0,1,2,3].filter(i=>i<=1||i===3)); const els=per.slice(st,st+4);
    const sorted=els.slice().sort((x,y)=>IE1[x]-IE1[y]); const lr=els.join(" < "); const T=arr=>arr.join(" < ");
    const w=[[lr,"This ignores the dips at groups 13 and 16."],[T(els.slice().reverse()),"IE increases left to right, not the other way."],[T([sorted[1],sorted[0],...sorted.slice(2)]),"Check the first two."],[T([...sorted.slice(0,2),sorted[3],sorted[2]]),"Check the last two."],[T([sorted[0],sorted[2],sorted[1],sorted[3]]),"Check the middle two."]];
    return mc(`Which list puts ${els.join(", ")} in order of <b>increasing</b> first ionization energy?`,[T(sorted),`Values (kJ mol$^{-1}$, standard data): ${els.map(s=>`${s} ${IE1[s]}`).join(", ")}. IE rises across the period except the drops from group 2 to 13 and from 15 to 16.`],w.filter(x=>x[0]!==T(sorted))); }
  const hi=R()<0.6; const set=dominantSet(R,hi?"small":"big"); if(!set) return null; const [a,...o]=set;
  const useCfg=v===2; const show=s=>useCfg?cfg(CH().Z(s)):s;
  const d=s=>{ const p=pos(s); return `period ${p.period}, group ${p.group}`; };
  return mc(`Which ${useCfg?"gas-phase atom, given by its configuration,":"of these atoms"} has the <b>${hi?"highest":"lowest"}</b> first ionization energy?`,[show(a),`${useCfg?a+" ("+d(a)+")":d(a)}: ${hi?"higher up and further right":"lower down and further left"} than every other option.`],o.map(s=>[show(s),`${useCfg?s+": ":""}${d(s)}, ${hi?"lower or further left":"higher or further right"} than ${a}.`])); }},

{id:"D.ionsize", lec:"M3C5", title:"Sizes of ions: isoelectronic series and X⁻ > X > X⁺", ref:"Module 3, p. 10 (reasoning; the notes give no ion sizes)",
 how:`<ul><li>Adding electrons makes a species bigger (more repulsion, same nucleus). Removing electrons makes it smaller. So $\\ce{X-} > \\ce{X} > \\ce{X+}$.</li><li>Same number of electrons (isoelectronic): more protons pull them in harder, so the one with the smallest $Z$ is biggest. $\\ce{O^2-} > \\ce{F-} > \\ce{Na+} > \\ce{Mg^2+}$.</li></ul>`,
 gen(R){ if(R()<0.5){ const s=R.pick(["O","Cl","N","P","F","Br","Se","I"]); const a=`${s}-`, c=`${s}+`; const G=x=>ce(x);
    const r=`${G(a)} > ${G(s)} > ${G(c)}`;
    return mc(`Rank ${G(c)}, ${G(a)} and ${G(s)} from largest to smallest.`,[r,"Same nucleus: adding an electron makes it bigger, removing one makes it smaller."],[[`${G(c)} > ${G(s)} > ${G(a)}`,"This is reversed."],[`${G(s)} > ${G(a)} > ${G(c)}`,"The anion has one more electron than the atom, so it is bigger."],[`${G(c)} > ${G(a)} > ${G(s)}`,"The cation has lost an electron: smallest."],[`${G(s)} > ${G(c)} > ${G(a)}`,"The anion is the largest."],[`${G(a)} > ${G(c)} > ${G(s)}`,"The cation is smaller than the atom."]]); }
  const ser=R.pick([[["N^3-",7],["O^2-",8],["F-",9],["Na+",11],["Mg^2+",12],["Al^3+",13]],[["P^3-",15],["S^2-",16],["Cl-",17],["K+",19],["Ca^2+",20]]]);
  const pick=pickN(R,ser,4); const byZ=pick.slice().sort((x,y)=>x[1]-y[1]); const T=arr=>arr.map(x=>ce(x[0])).join(" > ");
  return mc(`These ions all have the same number of electrons: ${pick.map(x=>ce(x[0])).join(", ")}. Which list is in order of <b>decreasing</b> radius?`,[T(byZ),`Same electrons, so more protons means smaller. Order by $Z$: ${byZ.map(x=>`${x[0].replace(/\^?[\d+-]+$/,"")} ${x[1]}`).join(", ")}.`],
    [[T(byZ.slice().reverse()),"Reversed: the highest $Z$ pulls hardest, so it is smallest."],[T([byZ[1],byZ[0],...byZ.slice(2)]),"The smaller $Z$ comes first."],[T([...byZ.slice(0,2),byZ[3],byZ[2]]),"The smaller $Z$ comes first."],[T([byZ[0],byZ[2],byZ[1],byZ[3]]),"The smaller $Z$ comes first."],[T(R.shuffle(byZ)),"Order by nuclear charge."]]); }},

{id:"D.ea", lec:"M3C6", title:"Electron affinity from the notes' table", ref:"Module 3, p. 14",
 how:`<p>EA is the energy change when a gas-phase atom gains an electron. Negative means energy is released.</p><ul><li>Most negative: the halogens. In the table Cl (−349) is more negative than F (−328).</li><li>Listed as "> 0": Be, Mg and the noble gases. N is +7. These don't release energy.</li><li>Group 2 and group 15 are less negative than their neighbours.</li></ul><p>"Smallest magnitude" means closest to zero, or positive.</p>`,
 gen(R){ const EA=CH().EA; const syms=Object.keys(EA).filter(s=>CH().Z(s)<=54); const val=s=>EA[s]==null?"> 0":(EA[s]>0?"+":"")+EA[s];
  const v=R.int(0,2);
  for(let t=0;t<300;t++){ const set=pickN(R,syms,5); const nul=set.filter(s=>EA[s]==null||EA[s]>0);
    if(v===0){ if(nul.length>1) continue; const nums=set.map(s=>EA[s]==null?1e9:EA[s]); const mn=Math.min(...nums); if(nums.filter(x=>x===mn).length>1||mn>0) continue; const a=set[nums.indexOf(mn)];
      return mc("Using the electron affinity table in the notes, which atom releases the <b>most</b> energy when it gains an electron?",[a,`EA(${a}) = ${val(a)} kJ mol$^{-1}$, the most negative here.`],set.filter(s=>s!==a).map(s=>[s,`EA = ${val(s)} kJ mol$^{-1}$.`])); }
    if(v===1){ if(nul.length!==1) continue; const a=nul[0];
      return mc("Using the electron affinity table in the notes, which atom does <b>not</b> release energy when it gains an electron?",[a,`EA(${a}) is ${val(a)} in the table: no energy released.`],set.filter(s=>s!==a).map(s=>[s,`EA = ${val(s)} kJ mol$^{-1}$: energy released.`])); }
    const mag=s=>EA[s]==null||EA[s]>0?-1:Math.abs(EA[s]); if(nul.length>1) continue; const ms=set.map(mag); const mn=Math.min(...ms); if(ms.filter(x=>x===mn).length>1) continue; const a=set[ms.indexOf(mn)];
    return mc("Using the notes' table, whose electron affinity is <b>closest to zero or positive</b>?",[a,`EA(${a}) = ${val(a)}${EA[a]==null?": it doesn't hold an extra electron at all.":" kJ mol$^{-1}$, closest to zero."}`],set.filter(s=>s!==a).map(s=>[s,`EA = ${val(s)} kJ mol$^{-1}$.`])); }
  return null; }},

{id:"D.trendsall", lec:"M3C5", title:"Mixed trend statements, select all", ref:"Module 3, pp. 9-15",
 how:`<p>Check each statement on its own. For each one ask: radius (bottom left biggest), IE (top right highest, with dips at groups 13 and 16), EA (use the table on p. 14), magnetism (any unpaired electron is paramagnetic). Each part of a two-part statement must be true.</p><p>Select-all is marked correct minus incorrect, so only pick the ones you're sure of.</p>`,
 gen(R){ const items=[]; const mk=(t,ok,why)=>items.push([t,ok,why]);
  for(let t=0;t<20&&items.length<5;t++){ const k=R.int(0,3);
    if(k===0){ const s=dominantSet(R,"big"); if(!s) continue; const a=s[0], b=s[1]; const flip=R()<0.5; mk(flip?`${b} has a larger atomic radius than ${a}.`:`${a} has a larger atomic radius than ${b}.`,!flip,`${a} is lower and/or further left than ${b}, so ${a} is larger.`); }
    else if(k===1){ const s=dominantSet(R,"small"); if(!s) continue; const a=s[0], b=s[1]; const flip=R()<0.5; mk(flip?`${b} has a higher first ionization energy than ${a}.`:`${a} has a higher first ionization energy than ${b}.`,!flip,`${a} is higher and/or further right than ${b}, so ${a} has the higher IE.`); }
    else if(k===2){ const z=R.int(3,36), u=CH().unpaired(CH().occupancy(z)); const para=R()<0.5; mk(`${CH().sym(z)} is ${para?"paramagnetic":"diamagnetic"}.`,para?u>0:u===0,`${cfg(z)}: ${u} unpaired.`); }
    else { const EA=CH().EA; const ps=Object.keys(EA).filter(s=>EA[s]!=null&&CH().Z(s)<=36); const [a,b]=pickN(R,ps,2); if(EA[a]===EA[b]) continue; mk(`${a} releases more energy than ${b} when it gains an electron.`,EA[a]<EA[b],`Table: ${a} ${EA[a]}, ${b} ${EA[b]} kJ mol$^{-1}$.`); } }
  if(items.length<5) return null; const seen=new Set(); const out=items.filter(x=>!seen.has(x[0])&&seen.add(x[0])).slice(0,5); if(out.length<5) return null;
  return {q:"Which of the following statements are correct? Select all that apply. You may select more than one, one, or none of the options.",opts:out.map(([t,ok,why])=>[t,ok,(ok?"True. ":"False. ")+why]),multi:true}; }},

/* ======================= Module 4 (pp. 1-14) ======================= */
{id:"D.fc", lec:"M4C1", title:"Formal charge", ref:"Module 4, pp. 3-4",
 how:`<p>$$\\text{FC} = (\\text{valence electrons}) - (\\text{lone-pair electrons}) - (\\text{number of bonds})$$</p><p>An atom owns all its lone-pair electrons and half of each bond. A double bond counts as 2 bonds, a triple as 3. The formal charges in a structure always add up to the overall charge.</p><p>Quick ones to know: O with 1 bond and 3 lone pairs is −1; N with 4 bonds is +1; C with 3 bonds and a lone pair is −1.</p>`,
 gen(R){ if(R()<0.5){ const opts=[["O",1,3],["O",2,2],["O",3,1],["N",4,0],["N",3,1],["N",2,2],["C",4,0],["C",3,1],["B",4,0],["B",3,0],["S",2,2],["S",4,1],["S",6,0],["S",1,3],["Cl",1,3],["Cl",4,0],["Cl",3,2],["Cl",5,1],["P",4,0],["P",5,0],["F",1,3],["Xe",4,2]];
    const [X,b,p]=R.pick(opts); const V=VAL[X]; const fc=V-2*p-b; const sgn=x=>x>0?"+"+x:String(x);
    return mc(`In a Lewis structure, a ${X} atom has ${b} bond${b===1?"":"s"} (counting a double bond as 2) and ${p} lone pair${p===1?"":"s"}. What is its formal charge?`,[sgn(fc),`FC = ${V} − ${2*p} − ${b} = ${sgn(fc)}.`],[-3,-2,-1,0,1,2,3].filter(x=>x!==fc).sort((x,y)=>Math.abs(x-fc)-Math.abs(y-fc)).map(x=>[sgn(x),x===V-p-b?"Lone pairs count 2 electrons each.":x===V-2*p-2*b?"Count bonds, not bonding electrons.":"FC = valence − lone-pair electrons − bonds."])); }
  const bank=[["NH4+","the N atom (four N–H bonds)","+1","N: 5 − 0 − 4"],["H3O+","the O atom (three O–H bonds, one lone pair)","+1","O: 6 − 2 − 3"],["NO+","the N atom in [:N≡O:]$^+$","0","N: 5 − 2 − 3"],["NO+","the O atom in [:N≡O:]$^+$","+1","O: 6 − 2 − 3"],["CO","the C atom in :C≡O:","−1","C: 4 − 2 − 3"],["CO","the O atom in :C≡O:","+1","O: 6 − 2 − 3"],["NO2-","the N atom in O=N–O$^-$ (one lone pair on N)","0","N: 5 − 2 − 3"],["NO2-","the single-bonded O in O=N–O$^-$ (three lone pairs)","−1","O: 6 − 6 − 1"],["CH3NO2","the N atom in nitromethane (one N=O, one N–O, one N–C, no lone pair)","+1","N: 5 − 0 − 4"],["BF4-","the B atom (four B–F bonds)","−1","B: 3 − 0 − 4"],["ClO3-","the Cl atom when all three Cl–O bonds are single (one lone pair on Cl)","+2","Cl: 7 − 2 − 3"],["SO4^2-","the S atom when all four S–O bonds are single","+2","S: 6 − 0 − 4"],["SO4^2-","the S atom with two S=O and two S–O","0","S: 6 − 0 − 6"],["OH-","the O atom","−1","O: 6 − 6 − 1"],["O3","the middle O in O=O–O (one lone pair)","+1","O: 6 − 2 − 3"]];
  const [f,where,ans,why]=R.pick(bank); const all=["−2","−1","0","+1","+2","+3"].filter(x=>x!==ans);
  return mc(`In ${ce(f)}, what is the formal charge on ${where}?`,[ans,`FC = valence − lone-pair electrons − bonds. ${why} = ${ans}.`],R.shuffle(all).map(x=>[x,"FC = valence − lone-pair electrons − bonds."])); }},

{id:"D.lonepairs", lec:"M4C2", title:"Lone pairs and electron count on the central atom", ref:"Module 4, pp. 6-9",
 how:`<p>For a central atom with only single bonds to F, Cl or H:</p><ol><li>Start with its valence electrons (group number). Add one for each negative charge, take one away for each positive charge.</li><li>Subtract one electron for each bond.</li><li>What's left, divided by 2, is the number of lone pairs.</li></ol><p>Electrons around the central atom $= 2\\times\\text{bonds} + 2\\times\\text{lone pairs}$. More than 8 is an expanded octet (only period 3 and below); fewer than 8 is incomplete (B, Be, Al).</p>`,
 gen(R){ const v=R.int(0,2); const cen=f=>f.match(/^[A-Z][a-z]?/)[0]==="H"?f.match(/[A-Z][a-z]?/g)[1]:f.match(/^[A-Z][a-z]?/)[0];
  const tex=f=>ce(f.replace(/^(\w+?)([+-])$/,"$1^$2").replace(/^(\w+?)(\d)([+-])$/,"$1^$2$3"));
  if(v===0){ const [f,lp,b]=R.pick(LP); const c=cen(f);
    return mc(`How many lone pairs are on the central atom of ${tex(f)}?`,[String(lp),`${c} brings ${VAL[c]}${/-$/.test(f)?" + 1 (negative charge)":/\+$/.test(f)?" − 1 (positive charge)":""} electrons; ${b} go into bonds; ${2*lp} left = ${lp} lone pair${lp===1?"":"s"}.`],[0,1,2,3,4].filter(x=>x!==lp).map(x=>[String(x),"Count: valence (adjusted for charge) − bonds, then halve."])); }
  const kind=R.pick(["more","fewer"]); const els=LP.map(([f,lp,b])=>[f,2*b+2*lp]);
  for(let t=0;t<100;t++){ const set=pickN(R,els,5); const hit=set.filter(x=>kind==="more"?x[1]>8:x[1]<8); if(hit.length!==1) continue; const a=hit[0];
    return mc(`In which molecule or ion does the central atom have <b>${kind} than eight</b> electrons around it?`,[tex(a[0]),`${a[1]} electrons around the central atom.`],set.filter(x=>x!==a).map(x=>[tex(x[0]),`${x[1]} electrons around the central atom.`])); }
  return null; }},

{id:"D.mystery", lec:"M4C2", title:"Find the mystery central atom E", ref:"Module 4, pp. 4-9",
 how:`<p>Questions like "$\\ce{EF4-}$ has two lone pairs on E, which element is E?":</p><ol><li>Terminal F (or Cl) atoms with one bond and three lone pairs have FC 0, so the whole charge sits on E.</li><li>Use FC on E: $\\text{FC} = V - (\\text{lone-pair electrons}) - (\\text{bonds})$. Solve for the valence electrons $V$: that is E's group.</li><li>Count electrons around E. More than 8 means E must be in period 3 or below: second-row atoms never expand.</li></ol>`,
 gen(R){ const combos=[[4,2,-1],[4,2,0],[2,3,0],[2,3,-1],[3,2,0],[4,1,0],[5,1,0],[3,1,0],[4,0,1],[4,0,-1],[5,0,0],[6,0,0],[6,0,-1],[2,2,0],[3,0,0],[5,1,-1],[4,1,1]];
  const [n,k,q]=R.pick(combos); const V=q+2*k+n; const around=2*n+2*k; const X=R.pick(["F","Cl"]);
  const groups={2:["Be","Mg"],3:["B","Al"],4:["C","Si","Ge"],5:["N","P","As"],6:["O","S","Se"],7:["F","Cl","Br","I"],8:["Xe","Kr"]};
  if(!groups[V]) return null; let ok=groups[V].filter(s=>around<=8||pos(s).period>=3).filter(s=>s!==X&&s!=="F");
  if(!ok.length) return null; const a=R.pick(ok);
  const wr=[]; Object.keys(groups).forEach(g=>{ if(+g===V) return; const s=R.pick(groups[g]); if(s!==X) wr.push([s,`${s} has ${g} valence electrons; E needs ${V}.`]); });
  if(around>8){ const p2=groups[V].find(s=>pos(s).period===2); if(p2) wr.unshift([p2,`${p2} has the right number of valence electrons, but it is in period 2 and can't have ${around} electrons around it.`]); }
  const f=`E${X}${n>1?n:""}${q===0?"":q>0?"+":"-"}`; const fT=ce(f.replace(/([+-])$/,"^$1"));
  return mc(`In ${fT}, E is bonded to ${n} ${X} atoms by single bonds and E has ${k} lone pair${k===1?"":"s"}. Which element could E be?`,[a,`FC on E must be ${q} (each ${X} is 0). ${q} $= V - ${2*k} - ${n}$, so $V = ${V}$. ${around>8?`${around} electrons around E also means period 3 or below. `:""}${a} fits.`],R.shuffle(wr)); }},

{id:"D.resonance", lec:"M4C3", title:"Equivalent resonance structures, select all", ref:"Module 4, pp. 10-14",
 how:`<p>Resonance structures keep every atom in the same place and only move electrons. They are <b>equivalent</b> when each one has the same formal charges on the same kind of atom, so they have the same energy and contribute equally.</p><ul><li>Equivalent: the double bond can sit on any one of two or three identical O atoms ($\\ce{O3}$, $\\ce{NO2-}$, $\\ce{NO3-}$, $\\ce{CO3^2-}$, carboxylates) or benzene.</li><li>Non-equivalent: the charge moves between different elements ($\\ce{SCN-}$, $\\ce{OCN-}$).</li><li>No resonance: only single bonds and no choice ($\\ce{NH4+}$, $\\ce{CH4}$).</li></ul>`,
 gen(R){ const ny=R.int(1,3); const items=[...pickN(R,RES_YES,ny).map(([f,w])=>[ce(f),true,w]),...pickN(R,RES_NO,5-ny).map(([f,w])=>[ce(f),false,w])];
  return {q:"Which of these have equivalent resonance structures (two or more structures with the same formal charges and energy)? Select all that apply. You may select more than one, one, or none of the options.",opts:R.shuffle(items),multi:true}; }},

{id:"D.bondorder", lec:"M4C3", title:"Bond order from resonance", ref:"Module 4, pp. 10-14",
 how:`<p>Bond order for one kind of bond $= \\frac{\\text{total bonds shared among those links}}{\\text{number of links}}$.</p><p>Nitrate: one N=O and two N–O in each structure, so 4 bonds over 3 links $= 1\\tfrac13$. Nitrite and ozone: 3 over 2 $= 1\\tfrac12$. No resonance: just count the bond.</p>`,
 gen(R){ const [f,b,v,why]=R.pick(BO); const all=[1,4/3,1.5,2,2.5,3].filter(x=>Math.abs(x-v)>1e-9);
  return mc(`What is the ${b} bond order in ${ce(f)}?`,[`$${frac(v)}$`,why],R.shuffle(all).map(x=>[`$${frac(x)}$`,"Share the bonds over all the equivalent links."])); }},

{id:"D.m4true", lec:"M4C1", title:"True or false: bonds, formal charge and resonance", ref:"Module 4, pp. 1-14",
 how:`<ul><li>Ionic bond: electrons are transferred and the ions attract. Covalent bond: a pair of electrons shared.</li><li>Formal charges add up to the overall charge. The best structure usually has the smallest formal charges, puts a negative one on the more electronegative atom and avoids like charges on neighbours.</li><li>C, N, O and F never have an expanded octet, and never an incomplete one when neutral. Period 3 and below can expand.</li><li>Resonance structures keep the atoms in place. Only equivalent ones contribute equally.</li></ul>`,
 gen(R){ const T=["Ionic bonds form when electrons are transferred from one atom to another.","A covalent bond is a pair of electrons shared by two atoms.","The formal charges in a structure add up to the overall charge of the species.","Second-row atoms such as C, N, O and F never have an expanded octet.","Atoms in period 3 and beyond can have more than eight electrons around them.","Equivalent resonance structures contribute equally to the real structure.","The most important structure usually has the smallest formal charges.","A negative formal charge is best placed on the more electronegative atom.","Resonance structures have the same arrangement of atoms."];
  const F=["A single covalent bond is one shared electron.","Ionic bonds come from the uneven sharing of electrons.","Every resonance structure of a species contributes equally.","Resonance structures differ in which atoms are bonded together.","Putting +1 formal charges on two neighbouring atoms makes a structure more important.","When working out formal charge, an atom owns all of the electrons in its bonds.","Formal charge is the real charge on an atom in the molecule.","Oxygen can have ten electrons around it if that lowers the formal charges.","Neutral C, N, O and F atoms are often found with fewer than eight electrons."];
  const fw={[F[0]]:"A single bond is a shared pair (2 electrons).",[F[1]]:"Ionic bonding is a transfer of electrons.",[F[2]]:"Only equivalent ones do.",[F[3]]:"Atoms stay put; only electrons move.",[F[4]]:"Like charges on neighbours should be avoided.",[F[5]]:"It owns half of each bond.",[F[6]]:"It is a bookkeeping number for comparing structures.",[F[7]]:"Second-row atoms never expand their octet.",[F[8]]:"C, N, O and F never have an incomplete octet when neutral."};
  const kind=R()<0.6?"true":"false"; const {one,rest}=TF(R,T,F,kind); const why=s=>T.includes(s)?"True.":"False. "+fw[s];
  if(R()<0.25){ const none=pickN(R,F,4); return mc("Pick the true statement.",["None of these statements is true.","Every one of the other statements is false."],none.map(s=>[s,"False. "+fw[s]])); }
  return mc(`Pick the <b>${kind==="true"?"true":"false"}</b> statement about bonding.`,[one,why(one)],rest.map(s=>[s,why(s)])); }}
]);
})();
