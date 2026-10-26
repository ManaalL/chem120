/* CHEM 120 Interactive: shared chemistry data and helpers for generators and figures.
   Molar masses: CHEM 120/121 data sheet (as printed). Constants: data sheet. Electronegativities: Module 3, p. 15. Electron affinities: Module 3, p. 14.
   Loaded on every page after chemcheck.js and before studydata.js. */
(function(){
"use strict";
const M=window.C120=window.C120||{};
const CH=M.chem={};
CH.CONST={h:6.626e-34, c:2.998e8, NA:6.022e23, RH:2.179e-18, me:9.109e-31, e:1.602e-19, a0pm:52.9, amu:1.6605e-27, R:8.3145};
/* data sheet atomic masses (g/mol), exactly as printed */
CH.MASS={"H":1.008,"He":4.003,"Li":6.941,"Be":9.012,"B":10.81,"C":12.01,"N":14.01,"O":16.0,"F":19.0,"Ne":20.18,"Na":22.99,"Mg":24.31,"Al":26.98,"Si":28.09,"P":30.97,"S":32.07,"Cl":35.45,"Ar":39.95,"K":39.1,"Ca":40.08,"Sc":44.96,"Ti":47.88,"V":50.94,"Cr":52.0,"Mn":54.94,"Fe":55.85,"Co":58.93,"Ni":58.69,"Cu":63.55,"Zn":65.38,"Ga":69.72,"Ge":72.59,"As":74.92,"Se":78.96,"Br":79.9,"Kr":83.8,"Rb":85.47,"Sr":87.62,"Y":88.91,"Zr":91.22,"Nb":92.91,"Mo":95.94,"Tc":98.0,"Ru":101.1,"Rh":102.9,"Pd":106.4,"Ag":107.9,"Cd":112.4,"In":114.8,"Sn":118.7,"Sb":121.8,"Te":127.6,"I":126.9,"Xe":131.3,"Cs":132.9,"Ba":137.3,"Hf":178.5,"Ta":180.9,"W":183.9,"Re":186.2,"Os":190.2,"Ir":192.2,"Pt":195.1,"Au":197.0,"Hg":200.6,"Tl":204.4,"Pb":207.2,"Bi":209.0,"Po":209.0,"At":210.0,"Rn":222.0,"Fr":223.0,"Ra":226.0};
CH.NAME={"H":"Hydrogen","He":"Helium","Li":"Lithium","Be":"Beryllium","B":"Boron","C":"Carbon","N":"Nitrogen","O":"Oxygen","F":"Fluorine","Ne":"Neon","Na":"Sodium","Mg":"Magnesium","Al":"Aluminum","Si":"Silicon","P":"Phosphorus","S":"Sulfur","Cl":"Chlorine","Ar":"Argon","K":"Potassium","Ca":"Calcium","Sc":"Scandium","Ti":"Titanium","V":"Vanadium","Cr":"Chromium","Mn":"Manganese","Fe":"Iron","Co":"Cobalt","Ni":"Nickel","Cu":"Copper","Zn":"Zinc","Ga":"Gallium","Ge":"Germanium","As":"Arsenic","Se":"Selenium","Br":"Bromine","Kr":"Krypton","Rb":"Rubidium","Sr":"Strontium","Y":"Yttrium","Zr":"Zirconium","Nb":"Niobium","Mo":"Molybdenum","Tc":"Technetium","Ru":"Ruthenium","Rh":"Rhodium","Pd":"Palladium","Ag":"Silver","Cd":"Cadmium","In":"Indium","Sn":"Tin","Sb":"Antimony","Te":"Tellurium","I":"Iodine","Xe":"Xenon","Cs":"Cesium","Ba":"Barium","Hf":"Hafnium","Ta":"Tantalum","W":"Tungsten","Re":"Rhenium","Os":"Osmium","Ir":"Iridium","Pt":"Platinum","Au":"Gold","Hg":"Mercury","Tl":"Thallium","Pb":"Lead","Bi":"Bismuth","Po":"Polonium","At":"Astatine","Rn":"Radon","Fr":"Fr","Ra":"Ra","Rf":"Rf","Db":"Db","Sg":"Sg","Bh":"Bh","Hs":"Hs","Mt":"Mt","Ds":"Ds","Rg":"Rg","Cn":"Cn"};
const SYMS="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr".split(" ");
CH.SYMS=SYMS; CH.Z=s=>SYMS.indexOf(s)+1; CH.sym=z=>SYMS[z-1];
/* molar mass from a formula, summed with data-sheet masses. Returns {value, terms:[[sym,count,mass]]} */
CH.molarMass=function(f){ const r=window.MC.parseSpecies(f); if(r.error) throw new Error(r.error+" in "+f); let v=0; const terms=[]; for(const k of Object.keys(r.counts)){ const m=CH.MASS[k]; if(m==null) throw new Error("no data-sheet mass for "+k); v+=m*r.counts[k]; terms.push([k,r.counts[k],m]); } return {value:v,terms}; };
CH.mm=f=>CH.molarMass(f).value;
/* the working shown in solutions: "2(22.99) + 32.07 + 4(16.00) = 142.05 g/mol" */
CH.mmWork=function(f,dp=2){ const r=CH.molarMass(f); return r.terms.map(([k,n,m])=>n>1?`${n}(${m.toPrecision(4)})`:`${m.toPrecision(4)}`).join(" + ")+` = ${r.value.toFixed(dp)}\\ \\mathrm{g\\,mol^{-1}}`; };
/* ---------- periodic table ---------- */
CH.position=function(z){ /* period, group, block for the main table (lanthanides and actinides marked f) */
  const P=[[1,2],[3,10],[11,18],[19,36],[37,54],[55,86],[87,118]]; let period=P.findIndex(([a,b])=>z>=a&&z<=b)+1;
  const start=P[period-1][0]; const k=z-start; let group, block;
  if(period===1){ group=z===1?1:18; block="s"; }
  else if(period<=3){ group=k<2?k+1:k+10; block=k<2?"s":"p"; }
  else if(period<=5){ group=k+1; block=k<2?"s":k<12?"d":"p"; }
  else { if(k<2){ group=k+1; block="s"; } else if(k<16){ group=null; block="f"; } else { group=k-13; block=group<=12?"d":"p"; } if(z===57||z===89){ group=3; block="d"; } }
  return {period, group, block};
};
/* ---------- electron configurations (Module 3, pp. 3-8) ---------- */
CH.ORDER=["1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"];
const CAP={s:2,p:6,d:10,f:14};
/* ground-state exceptions in the notes' table (p. 6) up to Z = 56; the notes ask you to know Cr and Cu */
CH.EXCEPTIONS={Cr:{"4s":1,"3d":5},Cu:{"4s":1,"3d":10},Nb:{"5s":1,"4d":4},Mo:{"5s":1,"4d":5},Ru:{"5s":1,"4d":7},Rh:{"5s":1,"4d":8},Pd:{"5s":0,"4d":10},Ag:{"5s":1,"4d":10}};
CH.MUST_KNOW_EXCEPTIONS=["Cr","Cu"];
CH.occupancy=function(z){ const occ={}; let left=z; for(const sub of CH.ORDER){ if(left<=0) break; const c=Math.min(CAP[sub[1]],left); occ[sub]=c; left-=c; } const s=CH.sym(z); if(CH.EXCEPTIONS[s]) Object.assign(occ,CH.EXCEPTIONS[s]); Object.keys(occ).forEach(k=>{ if(!occ[k]) delete occ[k]; }); return occ; };
const subKey=k=>{ const n=+k[0], l="spdf".indexOf(k[1]); return [n,l]; };
/* cations lose electrons from the highest n first, then the highest l (p. 8) */
CH.ionOccupancy=function(z,charge){ const occ=CH.occupancy(z+(charge<0?-charge:0)); if(charge<=0){ if(charge<0){ /* anion: add electrons in Aufbau order */ return CH.occupancy(z-charge); } return occ; }
  let rm=charge; while(rm>0){ const keys=Object.keys(occ).filter(k=>occ[k]>0).sort((a,b)=>{ const [na,la]=subKey(a),[nb,lb]=subKey(b); return nb-na||lb-la; }); const k=keys[0]; occ[k]--; if(!occ[k]) delete occ[k]; rm--; } return occ; };
const NOBLE=[["He",2],["Ne",10],["Ar",18],["Kr",36],["Xe",54],["Rn",86]];
/* written in the order the notes use: filling order (4s before 3d) */
CH.configString=function(occ,{short=false,tex=false}={}){
  const total=Object.values(occ).reduce((a,b)=>a+b,0);
  let keys=CH.ORDER.filter(k=>occ[k]); let core=null;
  if(short){ for(const [g,zg] of NOBLE){ const co=CH.occupancy(zg); const inside=Object.keys(co).every(k=>occ[k]===co[k]); if(inside && zg<total) core=[g,zg,co]; } if(core) keys=keys.filter(k=>!(core[2][k]&&occ[k]===core[2][k])); }
  const body=keys.map(k=>tex?`${k}^{${occ[k]}}`:`${k}${occ[k]}`).join(tex?"\\,":" ");
  const c=core?(tex?`[\\mathrm{${core[0]}}]\\,`:`[${core[0]}] `):"";
  return (c+body).trim()||(tex?"[\\mathrm{"+core[0]+"}]":"["+core[0]+"]");
};
CH.config=(z,charge=0,opt={})=>CH.configString(CH.ionOccupancy(z,charge),opt);
/* unpaired electrons by Hund's rule */
CH.unpaired=function(occ){ let u=0; for(const k in occ){ const n=occ[k], orb=CAP[k[1]]/2; u+= n<=orb? n : 2*orb-n; } return u; };
/* ---------- tables from the notes ---------- */
CH.EN={H:2.1,Li:1.0,Be:1.5,B:2.0,C:2.5,N:3.0,O:3.5,F:4.0,Na:0.9,Mg:1.2,Al:1.5,P:2.1,S:2.5,Cl:3.0,K:0.8,Ca:1.0,Ga:1.6,As:2.0,Se:2.4,Br:2.8,Rb:0.8,Sr:1.0,Te:2.1,I:2.5,Cs:0.8,Po:2.0,At:2.2,Fr:0.7};
/* electron affinity, kJ/mol (Module 3, p. 14). null = printed as "> 0" */
CH.EA={H:-73,He:null,Li:-60,Be:null,B:-27,C:-122,N:7,O:-141,F:-328,Ne:null,Na:-53,Mg:null,Al:-43,Si:-134,P:-72,S:-200,Cl:-349,Ar:null,K:-48,Ca:-2,Ga:-29,Ge:-119,As:-78,Se:-195,Br:-325,Kr:null,Rb:-47,Sr:-5,In:-29,Sn:-107,Sb:-103,Te:-190,I:-295,Xe:null,Cs:-46,Ba:-14,Tl:-19,Pb:-35,Bi:-91,Po:-186,At:-270,Rn:null};
/* ---------- formatting ---------- */
CH.ce=f=>`\\ce{${f}}`;
})();
