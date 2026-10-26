/* CHEM 120 Interactive: answer checker for chemistry.
   MC.check(typed, answer) -> {ok, close?, why?, parseError?}
   MC.preview(typed, type) -> {tex} | {error}
   Answer types (answer.type):
     num      {value, unit?, sf?, rel?, abs?, unitOptional?}  numbers with units; 6.02e23, 6.02 x 10^23 and 6.02×10^-3 all work.
              Any unit with the same dimensions is accepted and converted (kJ vs J, nm vs m). Wrong units are named.
              sf: the significant figures the answer should have. A right value with the wrong sig figs is marked "close", not right.
     int      {value}                                         an exact whole number (node counts, coefficients, electrons)
     formula  {answer:"SO4^2-", exact?, states?}              formulas and ions with charges. Same elements, counts and charge count as equal.
     equation {answer:"Ag+(aq) + Cl-(aq) -> AgCl(s)", states?, smallest?}  balanced equations, net ionic equations
     config   {answer:"[Ar] 4s2 3d10", form?:"short"|"full"|"any"}        electron configurations of atoms and ions
     qset     {answer:[n,l,ml,ms]} or {test:(q)=>true|"why"}  a set of quantum numbers typed like (3, 2, -1, +1/2)
     orbital  {answer:"3dxy" | ["3dxy","3dyz"]}               orbital or subshell labels
     list     {answer:[2,1,1,2]}                              comma-separated whole numbers, in order
     text     {accept:["bent","v-shaped"]}                    words, case and spacing ignored
   (mc, multi and firstline are handled by the problem widget.) */
(function(){
"use strict";
const MC = window.MC = {};

/* ---------------- numbers ---------------- */
const SUP = {"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁻":"-","⁺":"+"};
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const desup = s => String(s).replace(/[₀-₉]/g,c=>String(SUB.indexOf(c))).replace(/[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>"^"+m.replace(/./g,c=>SUP[c])).replace(/[⁻⁺]/g,c=>SUP[c]);
function cleanNum(s){
  return desup(s).replace(/\u2212/g,"-").replace(/[\u00d7\u2715\u2a2f]/g,"x").replace(/\s+/g," ").trim();
}
/* split "6.02 x 10^23 mol^-1" into the number part and the unit part */
const NUM_RE = /^([+-]?(?:\d{1,3}(?:,\d{3})+(?:\.\d*)?|\d+\.?\d*|\.\d+))(?:\s*(?:[eE]\s*([+-]?\d+)|\s*(?:x|\*|·)\s*10\s*(?:\^|\*\*)\s*\(?\s*([+-]?\d+)\s*\)?))?/;
const POW_ONLY = /^10\s*(?:\^|\*\*)\s*\(?\s*([+-]?\d+)\s*\)?/;
function sigFigs(mant){
  let s=mant.replace(/^[+-]/,"").replace(/,/g,"");
  const hasDot=s.includes(".");
  let digits=s.replace(".","");
  digits=digits.replace(/^0+/,"");
  if(!digits) return {min:1,max:1}; // "0" or "0.00": treat as 1
  if(hasDot){ return {min:digits.length,max:digits.length}; }
  const trimmed=digits.replace(/0+$/,"");
  return {min:trimmed.length||1,max:digits.length};
}
MC.parseQuantity = function(str){
  const s=cleanNum(str);
  if(!s) return {error:"Type an answer."};
  let m=s.match(NUM_RE), value, mant, rest, ex=0;
  if(m){ mant=m[1]; ex=m[2]!=null?+m[2]:m[3]!=null?+m[3]:0; value=parseFloat(mant.replace(/,/g,""))*Math.pow(10,ex); rest=s.slice(m[0].length); }
  else { const p=s.match(POW_ONLY); if(!p) return {error:"Start with a number, like 4.27e-19 or 4.27 x 10^-19."}; mant="1"; ex=+p[1]; value=Math.pow(10,ex); rest=s.slice(p[0].length); }
  if(!isFinite(value)) return {error:"That number is too big to read."};
  const sf=sigFigs(mant);
  const unitStr=rest.trim();
  let unit=null;
  if(unitStr){ unit=parseUnit(unitStr); if(unit.error) return {error:unit.error}; }
  return {value, sf, mant, ex, unitStr, unit};
};

/* ---------------- units ----------------
   dimension vector: [m, kg, s, mol, K, A]; counts (atoms, photons...) are dimensionless */
const D = (m=0,kg=0,s=0,mol=0,K=0,A=0)=>[m,kg,s,mol,K,A];
const UNITS = {
  "m":[1,D(1)], "Å":[1e-10,D(1)], "A°":[1e-10,D(1)], "angstrom":[1e-10,D(1)],
  "g":[1e-3,D(0,1)], "u":[1.66054e-27,D(0,1)], "amu":[1.66054e-27,D(0,1)], "Da":[1.66054e-27,D(0,1)], "t":[1000,D(0,1)], "tonne":[1000,D(0,1)], "tonnes":[1000,D(0,1)],
  "s":[1,D(0,0,1)], "min":[60,D(0,0,1)], "h":[3600,D(0,0,1)], "hr":[3600,D(0,0,1)],
  "Hz":[1,D(0,0,-1)],
  "mol":[1,D(0,0,0,1)],
  "K":[1,D(0,0,0,0,1)],
  "J":[1,D(2,1,-2)], "eV":[1.602e-19,D(2,1,-2)], "cal":[4.184,D(2,1,-2)],
  "W":[1,D(2,1,-3)],
  "C":[1,D(0,0,1,0,0,1)], "A":[1,D(0,0,0,0,0,1)],
  "L":[1e-3,D(3)], "l":[1e-3,D(3)],
  "M":[1000,D(-3,0,0,1)],
  "N":[1,D(1,1,-2)], "Pa":[1,D(-1,1,-2)], "atm":[101325,D(-1,1,-2)],
  "%":[0.01,D()], "ppm":[1e-6,D()],
  "photon":[1,D()], "photons":[1,D()], "atom":[1,D()], "atoms":[1,D()], "molecule":[1,D()], "molecules":[1,D()],
  "electron":[1,D()], "electrons":[1,D()], "ion":[1,D()], "ions":[1,D()], "particle":[1,D()], "particles":[1,D()], "e-":[1,D()],
  "rad":[1,D()], "°":[Math.PI/180,D()], "deg":[Math.PI/180,D()], "degrees":[Math.PI/180,D()]
};
const PREFIX = {"p":1e-12,"n":1e-9,"μ":1e-6,"µ":1e-6,"u":1e-6,"m":1e-3,"c":1e-2,"d":1e-1,"k":1e3,"M":1e6,"G":1e9,"T":1e12};
/* units that take prefixes */
const PREFIXABLE = new Set(["m","g","s","Hz","mol","J","eV","L","l","M","C","A","W","N","Pa"]);
function lookUnit(tok){
  if(UNITS[tok]) return UNITS[tok];
  for(let k=1;k<=2;k++){ const p=tok.slice(0,k), r=tok.slice(k); if(PREFIX[p]!=null && PREFIXABLE.has(r)) return [PREFIX[p]*UNITS[r][0], UNITS[r][1]]; }
  return null;
}
function parseUnit(str){
  let s=desup(str).replace(/\u2212/g,"-").replace(/·|⋅|\*/g," ").replace(/\bper\b/g,"/").trim();
  s=s.replace(/^\(|\)$/g,"");
  let scale=1, dim=D();
  let sign=1;
  const parts=s.split("/");
  if(parts.length>2) return {error:"Use at most one / in a unit, like kJ/mol or J s/mol (or write mol^-1)."};
  for(let pi=0;pi<parts.length;pi++){
    const side=pi===0?1:-1;
    const toks=parts[pi].trim().replace(/\(|\)/g," ").split(/\s+/).filter(Boolean);
    if(pi===1 && !toks.length) return {error:"Something is missing after the /."};
    for(const t0 of toks){
      let m=t0.match(/^([A-Za-zÅμµ°%°-]+?)(?:\^?\(?([+-]?\d+)\)?)?$/);
      if(!m) return {error:`I can't read the unit "${t0}".`};
      let name=m[1], p=m[2]!=null?+m[2]:1;
      if(name==="e-"){ continue; }
      const u=lookUnit(name);
      if(!u) return {error:`I don't know the unit "${name}". Try kJ, nm, g/mol, mol/L, s^-1.`};
      scale*=Math.pow(u[0],p*side);
      for(let i=0;i<6;i++) dim[i]+=u[1][i]*p*side;
    }
  }
  return {scale, dim, text:str.trim()};
}
MC.parseUnit = parseUnit;
const dimEq=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<1e-9);
const DIM_NAMES=[["energy",D(2,1,-2)],["energy per mole",D(2,1,-2,-1)],["length",D(1)],["frequency",D(0,0,-1)],["time",D(0,0,1)],["mass",D(0,1)],["amount (moles)",D(0,0,0,1)],["concentration",D(-3,0,0,1)],["volume",D(3)],["molar mass",D(0,1,0,-1)],["speed",D(1,0,-1)],["momentum",D(1,1,-1)],["a pure number",D()],["per mole",D(0,0,0,-1)]];
const dimName=d=>{ const f=DIM_NAMES.find(x=>dimEq(x[1],d)); return f?f[0]:"a different quantity"; };
function unitTeX(text){
  if(!text) return "";
  let s=desup(text).replace(/\u2212/g,"-").trim();
  const parts=s.split("/");
  const fmt=(t,neg)=>t.trim().replace(/\(|\)/g," ").split(/\s+|·|\*/).filter(Boolean).map(tok=>{ const m=tok.match(/^([A-Za-zÅμµ°%-]+?)(?:\^?\(?([+-]?\d+)\)?)?$/); if(!m) return tok; let n=m[1].replace(/μ|µ/g,"\\mu ").replace(/Å/g,"\\mathring{A}").replace(/%/g,"\\%"); let p=m[2]!=null?+m[2]:1; if(neg) p=-p; return p===1?n:`${n}^{${p}}`; }).join("\\,");
  return `\\mathrm{${fmt(parts[0],false)}${parts[1]?"\\,"+fmt(parts[1],true):""}}`;
}
MC.unitTeX = unitTeX;
function numTeX(q){
  const mant=q.mant.replace(/,/g,"");
  const base=mant.replace(/^-/,"\u2212");
  const n=q.ex?`${mant.replace(/^-/,"-")}\\times10^{${q.ex}}`:mant;
  return n;
}

/* ---------------- formulas ---------------- */
const ELEMENTS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr".split(" ");
const ELSET = new Set(ELEMENTS);
MC.ELEMENTS = ELEMENTS;
/* parse one species: "Ca(OH)2", "SO4^2-", "Fe^3+", "CuSO4·5H2O", "NO3-", "e-", "H2O(l)" */
function parseSpecies(str){
  let s=desup(String(str)).replace(/\u2212/g,"-").trim();
  if(!s) return {error:"Type a formula."};
  let state=null;
  const st=s.match(/\((s|l|g|aq)\)\s*$/i);
  if(st){ state=st[1].toLowerCase(); s=s.slice(0,st.index).trim(); }
  if(/^e\s*\^?\s*-$/.test(s)) return {counts:{},charge:-1,state,electron:true,norm:"e-"};
  let charge=0;
  // charge: ^2-, ^-2, ^+, trailing " 2-", trailing "-" or "+" or "3+" after a closing element/digit
  let m=s.match(/\^\s*\(?\s*(\d*)\s*([+-])\s*\)?\s*$/) || s.match(/\^\s*\(?\s*([+-])\s*(\d*)\s*\)?\s*$/);
  if(m){ const num=m[1]&&/\d/.test(m[1])?+m[1]:(m[2]&&/\d/.test(m[2])?+m[2]:1); const sg=(m[2]==="-"||m[1]==="-")?-1:1; charge=sg*num; s=s.slice(0,m.index).trim(); }
  else {
    m=s.match(/\s+(\d*)([+-])$/);
    if(m){ charge=(m[2]==="-"?-1:1)*(m[1]?+m[1]:1); s=s.slice(0,m.index).trim(); }
    else { m=s.match(/([+-]+)$/); if(m){ charge=(m[1][0]==="-"?-1:1)*m[1].length; s=s.slice(0,m.index).trim();
      /* typed without ^: "Fe3+" means Fe^3+, "SO42-" means SO4^2-, but "NH4+" and "NO3-" keep their subscripts */
      const mono=s.match(/^([A-Z][a-z]?)(\d)$/); const tail=s.match(/([A-Z][a-z]?|\))(\d{2,})$/);
      if(mono && ELSET.has(mono[1]) && m[1].length===1){ charge=Math.sign(charge)*(+mono[2]); s=mono[1]; }
      else if(tail && m[1].length===1){ const d=tail[2]; charge=Math.sign(charge)*(+d.slice(-1)); s=s.slice(0,s.length-1); } } }
  }
  // hydrates
  const pieces=s.split(/\s*[·•.*]\s*(?=\d*[A-Z(])/);
  const counts={};
  for(const pc of pieces){
    let p=pc.trim(); let mult=1; const mm=p.match(/^(\d+)(?=[A-Z(])/); if(mm){ mult=+mm[1]; p=p.slice(mm[0].length); }
    const r=parseGroup(p,0); if(r.error) return r; if(r.i!==p.length) return {error:`I can't read "${p.slice(r.i)}" in that formula.`};
    for(const k in r.counts) counts[k]=(counts[k]||0)+r.counts[k]*mult;
  }
  if(!Object.keys(counts).length) return {error:"Type a formula with element symbols, like Na2SO4."};
  return {counts,charge,state,norm:s};
}
function parseGroup(s,i){
  const counts={};
  while(i<s.length){
    const c=s[i];
    if(c==="("||c==="["){ const close=c==="("?")":"]"; const r=parseGroup(s,i+1); if(r.error) return r; if(s[r.i]!==close) return {error:"A bracket is not closed."}; i=r.i+1; let n=""; while(/\d/.test(s[i]||"")) n+=s[i++]; const k=n?+n:1; for(const e in r.counts) counts[e]=(counts[e]||0)+r.counts[e]*k; continue; }
    if(c===")"||c==="]") return {counts,i};
    if(/[A-Z]/.test(c)){ let sym=c; if(/[a-z]/.test(s[i+1]||"") && ELSET.has(c+s[i+1])) sym=c+s[i+1]; else if(/[a-z]/.test(s[i+1]||"") && !ELSET.has(c)) return {error:`"${c+s[i+1]}" is not an element symbol.`};
      if(!ELSET.has(sym)) return {error:`"${sym}" is not an element symbol.`};
      i+=sym.length; let n=""; while(/\d/.test(s[i]||"")) n+=s[i++]; counts[sym]=(counts[sym]||0)+(n?+n:1); continue; }
    if(/[a-z]/.test(c)) return {error:`Element symbols start with a capital letter ("${c}" should be "${c.toUpperCase()}"?).`};
    if(c===" ") { i++; continue; }
    return {error:`I can't read "${c}" in that formula.`};
  }
  return {counts,i};
}
MC.parseSpecies = parseSpecies;
const sameCounts=(a,b)=>{ const ka=Object.keys(a), kb=Object.keys(b); return ka.length===kb.length && ka.every(k=>a[k]===b[k]); };
/* mhchem text for a typed formula: keep what was typed, tidy charges to ^2- */
function ceText(str){
  let s=desup(String(str)).replace(/\u2212/g,"-").replace(/→|⟶|=>|-->/g,"->").replace(/·|•/g,"*");
  return s;
}
MC.ceText = ceText;

/* ---------------- equations ---------------- */
function parseEquation(str){
  let s=desup(String(str)).replace(/\u2212/g,"-").replace(/→|⟶|=>|-->|=/g,"->");
  const sides=s.split("->");
  if(sides.length!==2) return {error:"Write one arrow, like A + B -> C (type -> for the arrow)."};
  const out=[];
  for(const side of sides){
    const terms=side.trim().split(/\s+\+\s+/).map(t=>t.trim()).filter(Boolean);
    if(!terms.length) return {error:"One side of the equation is empty."};
    const list=[];
    for(const t of terms){
      const m=t.match(/^(\d+)\s*(?=[A-Z(e])/); const coef=m?+m[1]:1; const sp=parseSpecies(m?t.slice(m[0].length):t);
      if(sp.error) return {error:`${sp.error} (in "${t}")`};
      list.push({coef,sp});
    }
    out.push(list);
  }
  return {left:out[0], right:out[1]};
}
MC.parseEquation = parseEquation;
const spKey=sp=>Object.keys(sp.counts).sort().map(k=>k+sp.counts[k]).join("")+"|"+sp.charge;
function eqCompare(a,b,opt){
  // a: student, b: expected. compare as multisets on each side
  const side=(L)=>{ const m={}; L.forEach(t=>{ const k=spKey(t.sp); m[k]=(m[k]||0)+t.coef; }); return m; };
  const al=side(a.left), ar=side(a.right), bl=side(b.left), br=side(b.right);
  const keysEq=(x,y)=>{ const kx=Object.keys(x).sort(), ky=Object.keys(y).sort(); return kx.length===ky.length && kx.every((k,i)=>k===ky[i]); };
  if(!keysEq(al,bl)||!keysEq(ar,br)){
    if(keysEq(al,br)&&keysEq(ar,bl)) return {ok:false,why:"Your reactants and products are swapped."};
    // spectator check: student includes extra species that cancel
    return {ok:false,why:"The species are not the ones expected. Check which ions actually react, and the formulas and charges."};
  }
  const ratios=[]; for(const k in al) ratios.push(al[k]/bl[k]); for(const k in ar) ratios.push(ar[k]/br[k]);
  const r0=ratios[0]; const prop=ratios.every(r=>Math.abs(r-r0)<1e-9);
  if(!prop) return {ok:false,why:"Right species, but the coefficients don't balance the same way. Count each atom and the total charge on both sides."};
  if(Math.abs(r0-1)>1e-9) return {ok:false,close:true,why:r0>1?"Balanced, but not with the smallest whole-number coefficients. Divide through.":"Balanced, but the coefficients must be whole numbers."};
  if(opt&&opt.states){ const st=L=>L.map(t=>spKey(t.sp)+"("+(t.sp.state||"")+")").sort().join(","); if(st(a.left)!==st(b.left)||st(a.right)!==st(b.right)) return {ok:false,close:true,why:"Species and coefficients are right. Check the physical states: (s), (l), (g), (aq)."}; }
  return {ok:true};
}

/* ---------------- electron configurations ---------------- */
const L_OF={s:0,p:1,d:2,f:3}; const CAP=[2,6,10,14];
const NOBLE={He:"1s2",Ne:"1s2 2s2 2p6",Ar:"1s2 2s2 2p6 3s2 3p6",Kr:"1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6",Xe:"1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6",Rn:"1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6"};
const NOBLE_Z={He:2,Ne:10,Ar:18,Kr:36,Xe:54,Rn:86};
function parseConfig(str){
  let s=desup(String(str)).replace(/\u2212/g,"-").replace(/\^/g,"").replace(/[{}]/g,"").trim();
  if(!s) return {error:"Type a configuration, like 1s2 2s2 2p3 or [Ne] 3s2 3p3."};
  let core=null;
  const cm=s.match(/^\[\s*([A-Z][a-z]?)\s*\]/);
  const occ={};
  if(cm){ core=cm[1]; if(!NOBLE[core]) return {error:`[${core}] is not a noble-gas core. Use [He], [Ne], [Ar], [Kr], [Xe] or [Rn].`}; s=s.slice(cm[0].length); const r=parseConfig(NOBLE[core]); Object.assign(occ,r.occ); }
  s=s.trim();
  const joined=s.replace(/[\s,]+/g,"");
  /* read n, letter, count; when digits run straight into the next subshell ("3d104s2"), the last digit is the next n */
  const list=[]; let i=0;
  while(i<joined.length){
    const n=joined[i], l=joined[i+1];
    if(!/\d/.test(n)||!/[spdf]/.test(l||"")) return {error:`I can't read "${joined.slice(i,i+4)}". Write subshells like 4s2 or 3d^10, separated by spaces.`};
    let j=i+2, d=""; while(/\d/.test(joined[j]||"")) d+=joined[j++];
    if(/[spdf]/.test(joined[j]||"") && d.length>=2){ d=d.slice(0,-1); j--; }
    if(!d) return {error:`Add the number of electrons after ${n}${l}.`};
    const tok=`${n}${l}${d}`; list.push([tok,n,l,d]); i=j;
  }
  for(const mm of list){ const n=+mm[1], l=L_OF[mm[2]], e=+mm[3]; if(l>=n) return {error:`There is no ${n}${mm[2]} subshell (l must be less than n).`}; if(e>CAP[l]) return {error:`A ${mm[2]} subshell holds at most ${CAP[l]} electrons.`}; const k=`${n}${mm[2]}`; if(occ[k]!=null && !core) return {error:`${k} appears twice.`}; occ[k]=(occ[k]||0)+e; if(occ[k]>CAP[l]) return {error:`${k} would hold more than ${CAP[l]} electrons.`}; }
  const total=Object.values(occ).reduce((a,b)=>a+b,0);
  return {occ,core,total,list:list.map(x=>x[0])};
}
MC.parseConfig = parseConfig;
function configTeX(str){
  const r=parseConfig(str); if(r.error) return null;
  let t=r.core?`[\\mathrm{${r.core}}]\\,`:"";
  t+=r.list.map(x=>{ const m=x.match(/(\d)([spdf])(\d+)/); return `${m[1]}${m[2]}^{${m[3]}}`; }).join("\\,");
  return t;
}
MC.configTeX = configTeX;
MC.expandConfig = s => parseConfig(s).occ;
function configCompare(a,b,form){
  const ka=Object.keys(a.occ).filter(k=>a.occ[k]>0), kb=Object.keys(b.occ).filter(k=>b.occ[k]>0);
  const same = ka.length===kb.length && ka.every(k=>a.occ[k]===b.occ[k]);
  if(!same){
    if(a.total!==b.total) return {ok:false,why:`You placed ${a.total} electrons; this needs ${b.total}.`};
    return {ok:false,why:"Right number of electrons, but they are in the wrong subshells. Check the filling order (and, for ions, which electrons leave first)."};
  }
  if(form==="short"){ const coreZ=b.core?NOBLE_Z[b.core]:0; if(!a.core) return {ok:false,close:true,why:`Right configuration. The question asks for the noble-gas shorthand: start with [${b.core||"..."}].`}; if(a.core!==b.core) return {ok:false,close:true,why:`Right configuration, but use the nearest noble-gas core, [${b.core}].`}; }
  if(form==="full" && a.core) return {ok:false,close:true,why:"Right configuration. The question asks for the full (complete) configuration, without a noble-gas core."};
  return {ok:true};
}

/* ---------------- quantum numbers ---------------- */
function parseQset(str){
  let s=desup(String(str)).replace(/\u2212/g,"-").replace(/[()\[\]{}]/g," ").replace(/[a-z_]+\s*=\s*/gi,"").trim();
  const parts=s.split(/[\s,;]+/).filter(Boolean);
  if(parts.length<3||parts.length>4) return {error:"Type 3 or 4 numbers in order n, l, ml, ms, like (3, 2, -1, +1/2)."};
  const val=p=>{ if(/^[+-]?\d+\/\d+$/.test(p)){ const [a,b]=p.split("/"); return +a/+b; } if(/^[+-]?\d*\.?\d+$/.test(p)) return +p; return NaN; };
  const v=parts.map(val); if(v.some(x=>!isFinite(x))) return {error:"Use numbers only, with ms as +1/2 or -1/2."};
  return {n:v[0],l:v[1],ml:v[2],ms:v.length>3?v[3]:null,len:v.length};
}
MC.parseQset = parseQset;
function qsetValid(q){
  if(!Number.isInteger(q.n)||q.n<1) return "n must be a positive whole number.";
  if(!Number.isInteger(q.l)||q.l<0||q.l>q.n-1) return `l must be a whole number from 0 to n − 1 (here 0 to ${q.n-1}).`;
  if(!Number.isInteger(q.ml)||Math.abs(q.ml)>q.l) return `ml must be a whole number from −l to +l (here ${-q.l} to ${q.l}).`;
  if(q.ms!=null && Math.abs(Math.abs(q.ms)-0.5)>1e-9) return "ms must be +1/2 or −1/2.";
  return true;
}
MC.qsetValid = qsetValid;

/* ---------------- labels and text ---------------- */
const normOrb = s => desup(String(s)).toLowerCase().replace(/[\s_{}^]/g,"").replace(/x2-y2|x\^2-y\^2/g,"x2-y2").replace(/z\^2/g,"z2");
const normText = s => String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[-_]/g," ").replace(/\s+/g," ").replace(/[.!]+$/,"").trim();
MC.normText = normText;

/* ---------------- preview ---------------- */
MC.preview = function(str, type){
  const s=String(str||"").trim(); if(!s) return {};
  try{
    if(type==="num"||type==="int"){
      const q=MC.parseQuantity(s); if(q.error) return {error:q.error};
      return {tex:numTeX(q)+(q.unitStr?"\\ "+unitTeX(q.unitStr):"")};
    }
    if(type==="formula"){ const r=parseSpecies(s); if(r.error) return {error:r.error}; return {tex:`\\ce{${ceText(s)}}`}; }
    if(type==="equation"){ const r=parseEquation(s); if(r.error) return {error:r.error}; return {tex:`\\ce{${ceText(s)}}`}; }
    if(type==="config"){ const r=parseConfig(s); if(r.error) return {error:r.error}; return {tex:configTeX(s)+`\\quad(${r.total}\\ \\mathrm{e^-})`}; }
    if(type==="qset"){ const q=parseQset(s); if(q.error) return {error:q.error}; const f=x=>x==null?"":(Math.abs(x)===0.5?(x>0?"+\\tfrac12":"-\\tfrac12"):String(x)); return {tex:`(n,\\ l,\\ m_l${q.ms!=null?",\\ m_s":""}) = (${q.n},\\ ${q.l},\\ ${q.ml}${q.ms!=null?",\\ "+f(q.ms):""})`}; }
    if(type==="orbital"){ const m=normOrb(s).match(/^(\d)([spdf])(.*)$/); if(!m) return {error:"Write an orbital like 3d_xy, 2p_z or 4s."}; let sub=m[3].replace("x2-y2","x^2-y^2").replace("z2","z^2"); return {tex:`${m[1]}${m[2]}${sub?`_{${sub}}`:""}`}; }
    if(type==="list"){ const v=s.split(/[\s,;]+/).filter(Boolean); if(v.some(x=>!/^-?\d+$/.test(x))) return {error:"Whole numbers separated by commas, like 2, 1, 1, 2."}; return {tex:v.join(",\\ ")}; }
  }catch(e){ return {error:"I can't read that yet."}; }
  return {};
};

/* ---------------- check ---------------- */
MC.check = function(str, a){
  const t=a.type||"num"; const s=String(str==null?"":str).trim();
  if(!s) return {parseError:true,why:"Type an answer first."};
  if(t==="num"||t==="int"){
    const q=MC.parseQuantity(s); if(q.error) return {parseError:true,why:q.error};
    let v=q.value;
    const want=+a.value;
    if(t==="int"){ if(q.unit && !a.unit) {} return Math.abs(v-want)<1e-9?{ok:true}:{ok:false,why:a.wrongWhy||"Not that number."}; }
    let unitNote="";
    if(a.unit){
      const exp=parseUnit(a.unit);
      if(q.unit){
        if(!dimEq(q.unit.dim,exp.dim)) return {ok:false,why:`Your unit (${q.unitStr}) measures ${dimName(q.unit.dim)}, but the answer is ${dimName(exp.dim)}. Expected units like ${a.unit}.`};
        v=v*q.unit.scale/exp.scale;
        if(q.unitStr.replace(/\s/g,"")!==a.unit.replace(/\s/g,"")) unitNote=` (${a.unit}: ${MC.fmt(v)})`;
      } else if(!(a.unitOptional || a.unit==="%")){
        const ok=Math.abs(v-want)<=Math.max(a.abs||0,(a.rel!=null?a.rel:0.01)*Math.abs(want));
        return {ok:false,close:true,why:ok?`Right number. Add the unit: ${a.unit}.`:`Add a unit (like ${a.unit}) so the answer can be checked.`};
      }
    } else if(q.unit && !dimEq(q.unit.dim,D())) {
      // expected a pure number but a unit was typed: compare the number as typed
    }
    const rel=a.rel!=null?a.rel:0.01, abs=a.abs||0;
    const err=Math.abs(v-want), tolv=Math.max(abs,rel*Math.abs(want));
    if(err<=tolv || (want===0 && err<1e-12)){
      if(a.sf && !(q.sf.min<=a.sf && a.sf<=q.sf.max)){
        const gave=q.sf.min===q.sf.max?q.sf.min:`${q.sf.min} to ${q.sf.max}`;
        return {ok:false,close:true,sf:true,why:`Right value, wrong significant figures: give ${a.sf} sig figs (you gave ${gave}). For example ${MC.fmtSig(want,a.sf)}${a.unit?" "+a.unit:""}.`};
      }
      return {ok:true,note:unitNote};
    }
    if(want!==0){
      const ratio=v/want;
      const near=x=>Math.abs(ratio-x)<0.02*Math.abs(x);
      if(near(1000)||near(0.001)) return {ok:false,close:true,why:"Off by a factor of 1000. Check a unit prefix (J vs kJ, g vs kg, mL vs L)."};
      if(near(1e9)||near(1e-9)) return {ok:false,close:true,why:"Off by a factor of 10^9. Check the nm to m conversion."};
      if(near(-1)) return {ok:false,close:true,why:"Right size, wrong sign."};
      if(near(6.022e23)||near(1/6.022e23)) return {ok:false,close:true,why:"Off by Avogadro's number. Per photon (or atom) or per mole?"};
      if(near(10)||near(0.1)) return {ok:false,close:true,why:"Off by a factor of 10. Check the power of ten."};
      if(Math.abs(ratio-1)<0.05) return {ok:false,close:true,why:"Close, but outside rounding. Keep more digits in the middle steps, and use the data-sheet constants."};
    }
    return {ok:false,why:a.wrongWhy||"Not yet. Use the hint, or open the solution."};
  }
  if(t==="formula"){
    const r=parseSpecies(s); if(r.error) return {parseError:true,why:r.error};
    const answers=Array.isArray(a.answer)?a.answer:[a.answer];
    for(const ans of answers){ const e=parseSpecies(ans);
      if(sameCounts(r.counts,e.counts)){
        if(r.charge!==e.charge) return {ok:false,close:true,why:`Right atoms, wrong charge. ${e.charge===0?"It should be neutral.":"Check the charge."}`};
        if(a.exact && r.norm.replace(/\s/g,"")!==e.norm.replace(/\s/g,"")) return {ok:false,close:true,why:`Right atoms and charge. Write it the usual way: ${ans}.`};
        if(a.states && (r.state||"")!==(e.state||"")) return {ok:false,close:true,why:"Right formula. Check the physical state."};
        return {ok:true};
      } }
    return {ok:false,why:a.wrongWhy||"Not that formula. Count each element, and check the charge."};
  }
  if(t==="equation"){
    const r=parseEquation(s); if(r.error) return {parseError:true,why:r.error};
    const e=parseEquation(a.answer); return eqCompare(r,e,a);
  }
  if(t==="config"){
    const r=parseConfig(s); if(r.error) return {parseError:true,why:r.error};
    const answers=Array.isArray(a.answer)?a.answer:[a.answer];
    let last=null;
    for(const ans of answers){ const e=parseConfig(ans); const c=configCompare(r,e,a.form||"any"); if(c.ok) return c; last=c; }
    return last;
  }
  if(t==="qset"){
    const q=parseQset(s); if(q.error) return {parseError:true,why:q.error};
    const valid=qsetValid(q); if(valid!==true) return {ok:false,why:`That set is not allowed: ${valid}`};
    if(a.needMs && q.ms==null) return {parseError:true,why:"Include ms as the fourth number (+1/2 or -1/2)."};
    if(a.test){ const r=a.test(q); return r===true?{ok:true}:{ok:false,why:r||"Allowed set, but it doesn't describe this electron."}; }
    const w=a.answer; const ok=q.n===w[0]&&q.l===w[1]&&q.ml===w[2]&&(w[3]==null||q.ms===w[3]);
    return ok?{ok:true}:{ok:false,why:"An allowed set, but not this one."};
  }
  if(t==="orbital"){
    const answers=Array.isArray(a.answer)?a.answer:[a.answer];
    return answers.some(x=>normOrb(x)===normOrb(s))?{ok:true}:{ok:false,why:a.wrongWhy||"Not that orbital. Check n, the letter for l, and the subscript."};
  }
  if(t==="list"){
    const v=s.split(/[\s,;]+/).filter(Boolean).map(Number); if(v.some(x=>!Number.isInteger(x))) return {parseError:true,why:"Whole numbers separated by commas."};
    const w=a.answer; if(v.length!==w.length) return {ok:false,why:`Give ${w.length} numbers.`};
    if(v.every((x,i)=>x===w[i])) return {ok:true};
    const r0=v[0]/w[0]; if(v.every((x,i)=>Math.abs(x/w[i]-r0)<1e-9)) return {ok:false,close:true,why:"Balanced, but use the smallest whole numbers."};
    return {ok:false,why:a.wrongWhy||"Not yet. Count each atom on both sides."};
  }
  if(t==="text"){
    const n=normText(s); return (a.accept||[]).some(x=>normText(x)===n)?{ok:true}:{ok:false,why:a.wrongWhy||"Not the word expected."};
  }
  return {parseError:true,why:"Unknown answer type."};
};
MC.fmt = v => { const a=Math.abs(v); if(a!==0&&(a<0.01||a>=1e4)) return v.toExponential(3); return String(+v.toPrecision(4)); };
MC.fmtSig = (v,sf) => { const a=Math.abs(v); if(a!==0&&(a<0.01||a>=1e4)){ let e=Math.floor(Math.log10(a)); let m=(v/Math.pow(10,e)).toFixed(sf-1); if(Math.abs(+m)>=10){ e++; m=(v/Math.pow(10,e)).toFixed(sf-1); } return `${m}e${e}`; } const e=Math.floor(Math.log10(a||1)); const dp=Math.max(0,sf-1-e); return (Math.round(v*Math.pow(10,dp))/Math.pow(10,dp)).toFixed(dp); };
})();
