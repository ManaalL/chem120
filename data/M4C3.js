/* Chapter 4.3 (Fri Oct 30): Resonance and bond order. Course notes Module 4, pp. 10-14 (section 4.3).
   Chlorate's equal bonds (149 pm, p. 10), resonance structures, equivalent and non-equivalent forms, major and minor contributors by formal charge,
   delocalised electrons and the rules for drawing resonance structures (p. 12), Examples 4-5 to 4-8. Bond order of the hybrid = the average over equivalent forms (p. 11). */
(function(){
const M=C120;
const tm=n=>n<0?`-${-n}`:n>0?`+${n}`:"0";
const word=(n,w)=>`${n} ${w}${n===1?"":"s"}`;
const choose=(n,k)=>{ let r=1; for(let i=1;i<=k;i++) r=r*(n-k+i)/i; return Math.round(r); };
const frac=(a,b)=>{ const g=M.gcd(a,b); a/=g; b/=g; if(b===1) return String(a); const w=Math.floor(a/b), r=a%b; return w?`${w}\\tfrac{${r}}{${b}}`:`\\tfrac{${r}}{${b}}`; };
/* p. 16 table (pm) for the resonance bonds used here */
const LEN={"O–O":[145,121],"N–O":[136,120],"C–O":[143,120],"C–C":[154,134],"C–N":[147,128],"N–N":[145,123]};

M.chapter({
  id:"M4C3", module:"m4", n:3, num:"4.3", date:"2026-10-30", added:"2026-10-26", quiz:"PC5",
  title:"Resonance and bond order", pages:"10-14", sections:["4.3"],
  summary:"When one Lewis structure can't show where the electrons are, draw every valid arrangement of the electrons over the same skeleton. Equivalent structures contribute equally and the real species is their average; non-equivalent ones are ranked by formal charge into major and minor contributors.",
  flags:[],
  formulas:[
    {id:"M4C3.f.resonance", name:"Resonance structures", tex:"\\text{same arrangement of atoms, different arrangement of electrons} \\quad (\\longleftrightarrow)", kind:"rule", ref:"p. 10"},
    {id:"M4C3.f.average", name:"The real structure is the average", tex:"\\text{equivalent resonance structures} \\Rightarrow \\text{actual structure} = \\text{their average}", kind:"rule", ref:"p. 11",
      blank:{tex:"\\text{actual structure} = \\boxed{\\,?\\,}\\ \\text{of the equivalent resonance structures}", accept:["average","the average","mean","the mean"]}},
    {id:"M4C3.f.bond-order", name:"Bond order in the hybrid", tex:"\\text{bond order} = \\dfrac{\\text{bonds (counting double = 2) to the equivalent atoms in one structure}}{\\text{number of equivalent positions}}", ref:"p. 11",
      note:"Not printed as a formula in the notes: it is the p. 11 averaging rule applied to the bonds. $\\ce{NO3-}$: $(2+1+1)/3 = 1\\tfrac13$. The data sheet's $\\tfrac12(n_b - n_a)$ is for molecular orbital theory, which these pages don't use.",
      blank:{tex:"\\ce{NO3-}:\\ \\text{bond order} = \\dfrac{2+1+1}{\\boxed{\\,?\\,}}", accept:["3","three"]}},
    {id:"M4C3.f.equivalent", name:"Equivalent or non-equivalent?", tex:"\\text{same formal charges} \\Rightarrow \\text{equal contributors};\\quad \\text{different} \\Rightarrow \\text{major and minor}", kind:"rule", ref:"p. 10",
      note:"Use the formal-charge rules from p. 4 to rank non-equivalent structures: smallest charges, negative charge on the more electronegative atom, no like charges side by side."},
    {id:"M4C3.f.delocal", name:"Which electrons move", tex:"\\text{lone pairs and } \\pi \\text{ bonds may move; single } (\\sigma) \\text{ bonds never break}", kind:"rule", ref:"p. 12",
      blank:{tex:"\\text{Electrons in single } (\\boxed{\\,?\\,}) \\text{ bonds are never delocalized}", accept:["sigma","σ","σ bonds","sigma bonds"]}},
    {id:"M4C3.f.need-pi", name:"No multiple bond, no resonance", tex:"\\text{resonance structures exist only if there is a double or triple bond}", kind:"rule", ref:"p. 12",
      note:"Not every structure with a double or triple bond has resonance structures, though."},
    {id:"M4C3.f.clo3", name:"Cl–O bond length in chlorate", tex:"\\ce{ClO3-}:\\ \\text{all three Cl–O} = 149\\ \\mathrm{pm}", kind:"constant", ref:"p. 10"}
  ],
  glossary:[
    {id:"M4C3.t.resonance", term:"Resonance structures", def:"Lewis structures with the same arrangement of atoms but a different arrangement of electrons, joined by a double-headed arrow.", ref:"p. 10"},
    {id:"M4C3.t.hybrid", term:"Resonance hybrid", def:"The real molecule or ion: an average of its resonance structures (weighted toward the major contributors). It does not switch between them.", ref:"p. 11"},
    {id:"M4C3.t.equivalent", term:"Equivalent resonance structures", def:"Resonance structures with the same energy and the same formal-charge pattern. They contribute equally.", ref:"p. 10"},
    {id:"M4C3.t.major-minor", term:"Major and minor contributors", def:"In non-equivalent resonance structures, the one with the better formal charges (major) counts more than the others (minor).", ref:"p. 10"},
    {id:"M4C3.t.delocalized", term:"Delocalized electrons", def:"Electrons spread over several neighbouring atoms instead of sitting in one bond or on one atom. Only lone-pair and pi electrons can be delocalized.", ref:"p. 12"},
    {id:"M4C3.t.sigma-pi", term:"Sigma and pi bonds", def:"In these notes: a single bond is a sigma bond; the second and third bonds of a double or triple bond are pi bonds.", ref:"p. 12"},
    {id:"M4C3.t.bond-order", term:"Bond order", def:"The number of bonds between two atoms: 1 single, 2 double, 3 triple. In a resonance hybrid it can be a fraction, the average over the equivalent structures.", ref:"pp. 11, 16"}
  ],
  figures:{
    hybrid:{title:"Resonance forms and the hybrid", cap:"Step through the resonance forms, then press Hybrid: dashed partial bonds show the averaged bond order and the formal charges become fractions. Non-equivalent sets mark the major form. Ions from pp. 10-14, plus carbonate, formate and thiocyanate (marked as not in the notes).", ref:"pp. 10-14",
      model:{type:"molecule", params:{molecule:"NO3m", fc:true, choices:["NO3m","ClO3m","CO3m","O3","NO2m","HCOOm","CH3COOm","allyl","OCNr","N3mR","SCNm"], polarity:false, geoToggle:false}},
      predict:{q:"The nitrate ion has three resonance forms, each with one N=O and two N–O bonds. What is the bond order of each N–O bond in the real ion?", opts:[["1",false,"That ignores the double bond, which is spread over all three positions."],["$1\\tfrac13$",true,"4 bonds shared by 3 positions: $(2+1+1)/3 = 1\\tfrac13$."],["$1\\tfrac12$",false,"That is nitrite, $\\ce{NO2-}$: 3 bonds over 2 positions."],["2",false,"Only one of the three bonds is double in any form."]], check:"Press Hybrid and look at the dashed second line on every N–O bond. Then step through Form 1, 2 and 3."}},
    range:{title:"Where does a resonance bond fall?", cap:"The single, double and triple bond lengths are from the p. 16 table. A resonance bond with a bond order between 1 and 2 lands between the single and double values. The dot is a straight-line estimate (not from the notes); the notes only ask for the range.", ref:"pp. 13, 16",
      build(host,{PLOT,M}){
        const SP=[["O₃","O–O",1.5],["NO₂⁻","N–O",1.5],["NO₃⁻","N–O",4/3],["CO₃²⁻","C–O",4/3],["HCOO⁻","C–O",1.5],["allyl⁺","C–C",1.5]];
        const TRI={"C–C":120,"C–N":116,"N–N":110};
        let sp=0, bo=SP[0][2];
        const svgHost=document.createElement("div"); host.append(svgHost);
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Species",items:SP.map((x,i)=>[i,x[0]]),value:0,onchange:v=>{ sp=+v; bo=SP[sp][2]; sl.set(bo); draw(); }});
        const sl=PLOT.slider(ctl,{label:"Bond order",min:1,max:2,step:0.01,value:bo,fmt:v=>(+v).toFixed(2),oninput:v=>{ bo=v; draw(); }});
        const out=PLOT.readout(host);
        function draw(){
          const [name,pair,trueBo]=SP[sp]; const [Ls,Ld]=LEN[pair]; const Lt=TRI[pair];
          const W=620,H=150,x0=100,x1=160; const X=v=>30+(v-x0)/(x1-x0)*(W-60);
          const est=Ls+(bo-1)*(Ld-Ls);
          let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${pair} bond lengths">`;
          g+=`<line x1="${X(x0)}" y1="90" x2="${X(x1)}" y2="90" class="ax"/>`;
          for(let v=100;v<=160;v+=10) g+=`<line x1="${X(v)}" y1="86" x2="${X(v)}" y2="94" class="ax"/><text x="${X(v)}" y="112" text-anchor="middle">${v}</text>`;
          g+=`<text x="${X(x1)}" y="132" text-anchor="end">bond length / pm</text>`;
          g+=`<rect x="${X(Ld)}" y="78" width="${X(Ls)-X(Ld)}" height="24" class="shade"/>`;
          const mark=(v,lab,dy)=>`<line x1="${X(v)}" y1="60" x2="${X(v)}" y2="100" class="ln"/><text x="${X(v)}" y="${52+dy}" text-anchor="middle" class="lbl">${lab} ${v}</text>`;
          const p=pair.split("–");
          g+=mark(Ls,`${p[0]}–${p[1]}`,0)+mark(Ld,`${p[0]}=${p[1]}`,-18);
          if(Lt) g+=mark(Lt,`${p[0]}≡${p[1]}`,0);
          g+=`<circle cx="${X(est)}" cy="90" r="7" class="dot"/>`;
          svgHost.innerHTML=g+`</svg>`;
          out.innerHTML=M.rich(`${name}: bond order in the hybrid $\\approx ${trueBo.toFixed(2)}$. Range from the p. 16 table: <b>${Ld} to ${Ls} pm</b>. At bond order ${(+bo).toFixed(2)}, a straight-line estimate gives ${est.toFixed(0)} pm (estimate only).`);
        }
        draw();
      }}
  },
  gens:[
    {id:"M4C3.g.count-forms", title:"Count the forms and find the bond order", skill:"Equivalent structures and their average", ref:"pp. 10-11",
      gen(R,d){
        /* [species, structure in words, bond, positions k, double bonds m] */
        const POOL={1:[["NO2^-","one N=O and one N–O⁻","N–O",2,1],["O3","one O=O and one O–O⁻ (central O is $+1$)","O–O",2,1],["CO3^2-","one C=O and two C–O⁻","C–O",3,1],["NO3^-","one N=O and two N–O⁻ (N is $+1$)","N–O",3,1],["HCOO^-","C–H, one C=O and one C–O⁻","C–O",2,1]],
                    2:[["CH3COO^-","C–CH₃, one C=O and one C–O⁻","C–O",2,1],["SO3^2-","one S=O and two S–O⁻, with a lone pair on S","S–O",3,1],["ClO2^-","one Cl=O and one Cl–O⁻, with two lone pairs on Cl","Cl–O",2,1],["ClO3^-","two Cl=O and one Cl–O⁻ (the structure on p. 10)","Cl–O",3,2],["PO4^3-","one P=O and three P–O⁻","P–O",4,1]],
                    3:[["SO4^2-","two S=O and two S–O⁻","S–O",4,2],["ClO4^-","three Cl=O and one Cl–O⁻","Cl–O",4,3],["HCO3^-","one C–OH, one C=O and one C–O⁻ (only the two O atoms without H take part)","C–O",2,1],["HNO3","one N–OH, one N=O and one N–O⁻ (only the two O atoms without H take part)","N–O",2,1]]};
        const [f,desc,bond,k,m]=R.pick(POOL[d]);
        const n=choose(k,m); const tot=2*m+(k-m); const bo=tot/k;
        let count=0; for(let mask=0;mask<(1<<k);mask++){ let c=0; for(let i=0;i<k;i++) if(mask&(1<<i)) c++; if(c===m) count++; }
        return {prompt:`$\\ce{${f}}$ can be drawn with ${desc}. (a) How many equivalent resonance structures are there? (b) What is the bond order of each of the ${k} equivalent ${bond} bonds in the hybrid? Give a decimal.`,
          parts:[{label:"(a) Equivalent structures",answer:{type:"int",value:n}},{label:"(b) Bond order",answer:{type:"num",value:bo,rel:0.006}}],
          hint:"The skeleton stays fixed; only the double bonds move. Count the ways to choose which O atoms get the double bonds. For the bond order, add up all the bonds to those atoms in one structure (a double bond counts 2) and share them equally.",
          steps:[`There are ${k} equivalent positions and ${word(m,"double bond")} to place among them.`,m===1?`The double bond can go to any of the ${k}: ${n} structures, all with the same formal charges, so they are equivalent.`:`Choose which ${m} of the ${k} positions get a double bond: ${n} ways. Every one has the same formal charges, so they are equivalent.`,`Bonds to those atoms in one structure: $${m}(2) + ${k-m}(1) = ${tot}$.`,`Averaged over ${k} positions (p. 11): $${tot}/${k} = ${frac(tot,k)} \\approx ${bo.toFixed(2)}$.`],
          answerTeX:`(a) ${n}; (b) $${frac(tot,k)}\\approx ${bo.toFixed(2)}$`, verify:{value:count}};
      }},
    {id:"M4C3.g.length-range", title:"Predict a range for a resonance bond", skill:"Use the p. 16 table", ref:"pp. 13, 16",
      gen(R,d){
        const POOL={1:[["O3","O–O","ozone"],["NO2^-","N–O","the nitrite ion"],["HCOO^-","C–O","the formate ion"]],
                    2:[["NO3^-","N–O","the nitrate ion"],["CO3^2-","C–O","the carbonate ion"],["CH3COO^-","C–O","the acetate ion"],["CH2CHCH2^+","C–C","the allyl cation"]],
                    3:[["NO3^-","N–O","the nitrate ion"],["CO3^2-","C–O","the carbonate ion"]]};
        const [f,bond,name]=R.pick(POOL[d]); const [Ls,Ld]=LEN[bond]; const p=bond.split("–");
        const parts=[{label:"Shortest possible (pm)",answer:{type:"num",value:Ld,unit:"pm",abs:0.6}},{label:"Longest possible (pm)",answer:{type:"num",value:Ls,unit:"pm",abs:0.6}}];
        const steps=[`The ${bond} bonds in ${name} are all equal: each is an average of single and double (bond order between 1 and 2).`,`p. 16: $\\ce{${p[0]}-${p[1]}}$ is ${Ls} pm and $\\ce{${p[0]}=${p[1]}}$ is ${Ld} pm.`,`So each bond is between ${Ld} pm and ${Ls} pm.`];
        if(d===3){ parts.push({label:"Closer to",answer:{type:"mc",options:[`the single-bond length (${Ls} pm)`,`the double-bond length (${Ld} pm)`],correct:0,keep:true}}); steps.push("Bond order $1\\tfrac13$ is nearer 1 than 2, so the length is nearer the single-bond value."); }
        return {prompt:`Use the bond length table on p. 16 to predict the range for the ${bond} bond length in ${name}, $\\ce{${f}}$.${d===3?" Is it closer to the single-bond or the double-bond length?":""}`,
          parts, hint:"Draw the resonance structures. Each equal bond is part single, part double, so its length lies between the single and the double values in the table.",
          steps, answerTeX:`between ${Ld} and ${Ls} pm${d===3?", closer to the single bond":""}`};
      }},
    {id:"M4C3.g.major-minor", title:"Pick the major contributor", skill:"Rank resonance structures by formal charge", ref:"pp. 4, 10",
      gen(R,d){
        const S=[
          ["the cyanate ion, $\\ce{OCN-}$",[["$\\ce{O-C#N}$","O $-1$, C $0$, N $0$","Charges at most $\\pm1$, and the $-1$ is on O, the more electronegative atom: major."],["$\\ce{O=C=N}$","O $0$, C $0$, N $-1$","Charges are small, but the $-1$ is on N, which is less electronegative than O: minor."],["$\\ce{O#C-N}$","O $+1$, C $0$, N $-2$","A $-2$: minor, and the least important."]]],
          ["the thiocyanate ion, $\\ce{SCN-}$",[["$\\ce{S=C=N}$","S $0$, C $0$, N $-1$","$-1$ on N, the more electronegative atom (N 3.0, S 2.5): major."],["$\\ce{S-C#N}$","S $-1$, C $0$, N $0$","$-1$ on the less electronegative S: minor."],["$\\ce{S#C-N}$","S $+1$, C $0$, N $-2$","A $-2$: least important."]]],
          ["the azide ion, $\\ce{N3-}$",[["$\\ce{N=N=N}$","$-1$, $+1$, $-1$","Every charge is $\\pm1$: major."],["$\\ce{N#N-N}$","$0$, $+1$, $-2$","A $-2$: minor."]]],
          ["formamide, $\\ce{HCONH2}$",[["$\\ce{H2N-CH=O}$","all $0$","No formal charges at all: major."],["$\\ce{H2N=CH-O}$","N $+1$, O $-1$","Made by moving the N lone pair in and the C=O pi bond onto O. Charges appear: minor."]]],
          ["the enolate ion, $\\ce{CH2CHO-}$",[["$\\ce{CH2=CH-O}$","O $-1$","The $-1$ sits on O, the more electronegative atom: major."],["$\\ce{CH2-CH=O}$","end C $-1$","The $-1$ sits on C, which is less electronegative than O: minor."]]],
          ["dinitrogen monoxide, $\\ce{N2O}$",[["$\\ce{N#N-O}$","$0$, $+1$, $-1$","$\\pm1$ with $-1$ on O: major."],["$\\ce{N=N=O}$","$-1$, $+1$, $0$","$\\pm1$ but $-1$ on N: minor."],["$\\ce{N-N#O}$","$-2$, $+1$, $+1$","A $-2$: least important."]]]
        ];
        const pool=d===1?[S[0],S[2],S[3]]:d===2?S.slice(0,5):S;
        const [sp,list]=R.pick(pool);
        const idx=R.shuffle(list.map((x,i)=>i));
        return {prompt:`Below are resonance structures of ${sp}, each with its formal charges (lone pairs not drawn). Which is the major contributor?`,
          answer:{type:"mc",options:idx.map(i=>`${list[i][0]} (FC: ${list[i][1]})`),correct:idx.indexOf(0),why:idx.map(i=>list[i][2])},
          hint:"Non-equivalent structures are ranked with the p. 4 rules: smallest formal charges first, then the negative charge on the more electronegative atom, and no like charges side by side.",
          steps:[...list.map(x=>`${x[0]}: ${x[1]}. ${x[2]}`),`Major contributor: ${list[0][0]}.`],
          answerTeX:list[0][0]};
      }},
    {id:"M4C3.g.resonance-type", title:"One structure, equal forms, or major and minor?", skill:"Classify the bonding picture", ref:"pp. 10-13",
      gen(R,d){
        const T=["A single Lewis structure (no resonance)","Equivalent resonance structures (equal contributors)","Major and minor resonance contributors"];
        const P=[["NO3^-",1,"one N=O can sit on any of the three O atoms, and every form has the same charges"],["CO3^2-",1,"the C=O can sit on any of the three O atoms"],["O3",1,"O=O–O and O–O=O have the same charges"],["NO2^-",1,"two mirror-image forms"],["HCOO^-",1,"the C=O and C–O⁻ swap"],["CH2CHCH2^+",1,"the + charge and the C=C swap ends"],["C6H6",1,"pi bonds alternating around a ring can shift by one position"],
          ["OCN^-",2,"the forms put the charge on different atoms (O or N), so they differ in energy"],["SCN^-",2,"the forms put the charge on S or on N"],["N3^-",2,"one form has charges $-1, +1, -1$, the others have a $-2$"],["N2O",2,"the forms put the $-1$ on O or on N"],
          ["CH4",0,"no double or triple bond, so no resonance (p. 12)"],["H2O",0,"no double or triple bond"],["NH3",0,"no double or triple bond"],["CH3OH",0,"only single bonds"],["C2H6",0,"only single bonds"],["NH4^+",0,"only single bonds"],["C2H4",0,"a C=C, but no lone pair, charge or electronegative atom next to it to move electrons toward"]];
        const pool=d===1?P.filter(x=>["NO3^-","O3","NO2^-","OCN^-","CH4","H2O","NH3"].includes(x[0])):d===2?P.filter(x=>x[0]!=="C2H4"&&x[0]!=="C6H6"):P;
        const [f,ans,why]=R.pick(pool);
        return {prompt:`Is $\\ce{${f}}$ best described by a single Lewis structure, by equivalent resonance structures, or by major and minor resonance contributors?`,
          answer:{type:"mc",options:T,correct:ans,keep:true},
          hint:"No double or triple bond means no resonance. If there are several forms, compare their formal charges: same pattern means equivalent; different means major and minor.",
          steps:[`$\\ce{${f}}$: ${why}.`,`So: ${T[ans].toLowerCase()}.`],
          answerTeX:T[ans]};
      }},
    {id:"M4C3.g.can-resonate", title:"Which species have resonance structures?", skill:"Need a pi bond next to something that can move", ref:"p. 12",
      gen(R,d){
        const YES=[["NO2^-","lone pair on O next to the N=O pi bond"],["O3","lone pair next to the O=O pi bond"],["CO3^2-","O⁻ lone pairs next to the C=O"],["HCOO^-","O⁻ lone pair next to the C=O"],["CH2CHCH2^+","pi bond next to a positive charge"],["C6H6","pi bonds alternating around a ring"],["N3^-","lone pairs next to N=N pi bonds"],["OCN^-","lone pair next to a pi bond"]];
        const NO=[["CH4","only single bonds"],["H2O","only single bonds"],["NH3","only single bonds"],["CH3OH","only single bonds"],["C2H6","only single bonds"],["NH4^+","only single bonds"],["HF","only a single bond"],["CH3NH2","only single bonds"]];
        const ny=d===1?1:R.int(1,3); const nn=5-ny;
        const pick=R.shuffle(R.shuffle(YES).slice(0,ny).map(x=>[...x,true]).concat(R.shuffle(NO).slice(0,nn).map(x=>[...x,false])));
        return {prompt:"Which of these have resonance structures? Select all that apply.",
          answer:{type:"multi",options:pick.map(x=>`$\\ce{${x[0]}}$`),correct:pick.map((x,i)=>x[2]?i:-1).filter(i=>i>=0),why:pick.map(x=>x[1])},
          hint:"Resonance needs a double or triple bond (p. 12), with something next to it that can shift: a lone pair, a positive charge, an electronegative atom, or another pi bond in a ring.",
          steps:pick.map(x=>`$\\ce{${x[0]}}$: ${x[1]}, so ${x[2]?"yes":"no"}.`),
          answerTeX:pick.filter(x=>x[2]).map(x=>`$\\ce{${x[0]}}$`).join(", ")};
      }}
  ],
  exam:[
    {id:"M4C3.q1", ref:"p. 10", q:"All three Cl–O bonds in the chlorate ion, $\\ce{ClO3-}$, measure 149 pm. Which explanation fits?", opts:[["The ion flips quickly between three structures, so the bonds look equal on average.",false,"The hybrid is one structure; it does not switch back and forth."],["The real ion is an average of three equivalent resonance structures, with the negative charge spread over all three O atoms.",true,"p. 10: the bonds are equal and the $-1$ is shared."],["Two Cl–O bonds are double and one is single, as one Lewis structure shows.",false,"Then two bonds would be shorter than the third, which is not what is measured."],["Cl has an incomplete octet.",false,"Cl here has 12 electrons in the p. 10 structure."],["The O atoms are bonded to each other in a ring.",false,"Each O is bonded only to Cl."]]},
    {id:"M4C3.q2", ref:"p. 10", q:"Which statement about resonance structures is correct?", opts:[["They have different arrangements of atoms.",false,"The atoms stay put; only electrons move."],["They have the same arrangement of atoms but a different distribution of electrons.",true,"The p. 10 definition."],["Only one of them is real; the others are drawing mistakes.",false,"The real species is the average of all of them."],["They can only be drawn for ions.",false,"Ozone is neutral and has two (Example 4-6)."],["They are formed by breaking single bonds.",false,"Single (sigma) bonds never break in resonance (p. 12)."]]},
    {id:"M4C3.q3", ref:"p. 11", q:"What is the N–O bond order in the nitrate ion, $\\ce{NO3-}$?", opts:[["1",false,"Each structure has one double bond, shared among three positions."],["$1\\tfrac13$",true,"$(2+1+1)/3 = 4/3$."],["$1\\tfrac12$",false,"That is nitrite, with two positions."],["$1\\tfrac23$",false,"That would need two double bonds per structure, which N can't hold (2nd row, max 8)."],["2",false,"Only one N=O per structure."]]},
    {id:"M4C3.q4", ref:"pp. 13, 16", q:"Ozone, $\\ce{O3}$, is not cyclic. Using the p. 16 table (O–O 145 pm, O=O 121 pm), what range should each O–O bond length fall in?", opts:[["Less than 121 pm",false,"Shorter than a double bond would need a bond order above 2."],["Between 121 and 145 pm",true,"Bond order $1\\tfrac12$: between single and double (Example 4-6)."],["Exactly 145 pm",false,"That ignores the double bond shared between the two positions."],["Exactly 121 pm",false,"Each bond is only half double."],["Greater than 145 pm",false,"That would be weaker than a single bond."]]},
    {id:"M4C3.q5", ref:"pp. 4, 13", q:"Cyanate, $\\ce{OCN-}$, has three resonance structures. Which is the major contributor?", opts:[["$\\ce{O-C#N}$ with $-1$ on O",true,"Charges are $\\pm1$ at most and the $-1$ is on O, the more electronegative atom (p. 4 uses this ion)."],["$\\ce{O=C=N}$ with $-1$ on N",false,"A valid form, but the $-1$ is on the less electronegative N: minor."],["$\\ce{O#C-N}$ with $+1$ on O and $-2$ on N",false,"A $-2$ makes it the least important."],["All three contribute equally.",false,"Their formal charges differ, so they are not equivalent."],["None: cyanate has no resonance.",false,"It has multiple bonds next to lone pairs, so it does."]]},
    {id:"M4C3.q6", ref:"p. 12", multi:true, q:"Which electrons can be delocalized when you draw resonance structures? Select all that apply.", opts:[["Lone-pair electrons",true,"A lone pair can become a pi bond."],["Electrons in pi bonds (the second and third bonds of a double or triple bond)",true,"A pi bond can become a lone pair or shift to a neighbouring pair of atoms."],["Electrons in single (sigma) bonds",false,"Single bonds are never broken in resonance."],["Core electrons",false,"Lewis structures only show valence electrons."]]},
    {id:"M4C3.q7", ref:"pp. 10-14", q:"Which species is described by major and minor resonance contributors rather than equivalent ones?", opts:[["$\\ce{NO3-}$",false,"Three equivalent forms."],["$\\ce{O3}$",false,"Two equivalent forms."],["$\\ce{N3-}$",true,"The form with charges $-1, +1, -1$ is major; the forms with a $-2$ are minor."],["$\\ce{CO3^2-}$",false,"Three equivalent forms."],["$\\ce{CH2CHCH2+}$",false,"Two equivalent forms: the + charge swaps ends."]]}
  ],
  steps:[
    {type:"read", title:"One drawing can't show chlorate", ref:"p. 10", body:"<p>The chlorate ion, $\\ce{ClO3-}$, is usually drawn with two Cl=O double bonds and one Cl–O⁻ single bond. That drawing makes two predictions: two bonds should be shorter than the third, and only one O should carry the negative charge.</p><p>Both are wrong. All three Cl–O bonds measure <b>149 pm</b>, and the negative charge is spread over all three O atoms (p. 10).</p><p>The fix is to draw all three ways to place the electrons: the single bond (and the $-1$) can sit on any of the three O atoms. These are <b>resonance structures</b>.</p>"},
    {type:"read", title:"Resonance structures and the hybrid", ref:"pp. 10-11", body:"<div class=\"box def\"><b class=\"t\">Resonance structures (p. 10)</b>Same arrangement of atoms, different arrangement of electrons. They are joined by a double-headed arrow, $\\longleftrightarrow$.</div><p>Electrons are really clouds of density, not dots in fixed places (Module 2). A Lewis structure can only put them in one place at a time, so when the density is spread over several bonds we need several drawings (p. 11).</p><p>Think of a mule. It is not a horse on Mondays and a donkey on Tuesdays; it is always a bit of both. The real ion, the <b>resonance hybrid</b>, is the same: one structure, the average of the drawings, all the time.</p><div class=\"box\"><b class=\"t\">Rule (p. 11)</b>When the resonance structures are equivalent, the actual structure is their average.</div>"},
    {type:"explore", title:"Step through the forms, then see the hybrid", fig:"hybrid", ref:"pp. 10-14", body:"<p>For each ion, click Form 1, 2, 3, then Hybrid. Watch the double bond move and the formal charges follow it.</p><ul><li>$\\ce{NO3-}$, $\\ce{CO3^2-}$, $\\ce{ClO3-}$: three equivalent forms.</li><li>$\\ce{O3}$, $\\ce{NO2-}$, formate, acetate, the allyl cation: two equivalent forms.</li><li>Cyanate, azide and thiocyanate: forms that are <i>not</i> equivalent. One is labelled major.</li></ul>"},
    {type:"read", title:"Equivalent or not: check the formal charges", ref:"p. 10", body:"<table class=\"cn-table\"><tr><th>Equivalent structures</th><th>Non-equivalent structures</th></tr><tr><td>Same energy, same stability</td><td>Different energies and stabilities</td></tr><tr><td>Each contributes equally</td><td>A <b>major</b> contributor and one or more <b>minor</b> ones</td></tr></table><p>To tell which you have, compare the formal charges (p. 10). If every structure has the same pattern of charges, just on different atoms of the same element, they are equivalent. If the charges differ, use the p. 4 rules to rank them.</p><p>Bond order follows from the averaging rule. Add the bonds to the equivalent atoms in one structure and share them out. $\\ce{NO3-}$: $(2+1+1)/3 = 1\\tfrac13$. (The data sheet's $\\tfrac12(n_b-n_a)$ is for molecular orbital theory, which these pages don't use.)</p>"},
    {type:"try", title:"Count the forms, find the bond order", gen:"M4C3.g.count-forms"},
    {type:"read", title:"Rules for moving electrons", ref:"p. 12", body:"<ul><li>The skeleton never changes. <b>Never break a single (sigma) bond</b>.</li><li>Every resonance structure must be a proper Lewis structure (octets, H with 2, formal charges added up).</li><li>Only <b>lone pairs</b> and <b>pi bonds</b> (the second and third bonds of a double or triple bond) can be <b>delocalized</b>: shared over several neighbouring atoms.</li><li>Resonance needs a double or triple bond. But not every molecule with one has resonance structures.</li></ul><p>Three moves to try: a lone pair becomes a pi bond; a pi bond becomes a lone pair; a pi bond shifts to the next pair of atoms. Look for a lone pair next to a pi bond, a lone pair or pi bond next to a positive charge, a pi bond to an electronegative atom, or pi bonds alternating around a ring.</p>"},
    {type:"mcq", title:"A legal resonance move", q:"Starting from O=O–O⁻ for ozone, which change gives another valid resonance structure?", opts:[["Turn a lone pair on the O⁻ end into a new O=O bond, and turn the old O=O pi bond into a lone pair on the other end.",true,"Lone pair to pi bond and pi bond to lone pair: the skeleton and the electron count stay the same, giving ⁻O–O=O."],["Move the end O atom so it bonds to both other atoms in a ring.",false,"The atoms can't move, and ozone is not cyclic (Example 4-6)."],["Break one O–O single bond and put the electrons on O.",false,"Single (sigma) bonds are never broken."],["Add a lone pair to the central O.",false,"That adds electrons; the count must stay at 18."]], after:"Example 4-5 (p. 11) asks for exactly these moves on chlorate: a lone pair on O becomes a Cl=O bond while a Cl=O pi bond becomes a lone pair on another O."},
    {type:"example", title:"Carbonate: forms, bond order and bond length", ref:"pp. 11-16 (like Example 4-6)", ex:{q:"The carbonate ion, $\\ce{CO3^2-}$, has C bonded to three O atoms. (a) How many equivalent resonance structures does it have? (b) What is the C–O bond order? (c) Use the p. 16 table to predict a range for the C–O length.", steps:[{t:"Valence electrons: $4 + 3(6) + 2 = 24$. Fragments: C with 4 bonds, so one C=O and two C–O⁻.",why:"$\\ce{C}$: $4-(0+4)=0$. Each $\\ce{O-}$: $6-(6+1)=-1$. Sum $-2$."},{t:"The C=O can be on any of the three O atoms: 3 structures, each with C 0 and two O at $-1$.",why:"Same charges, so they are equivalent."},{t:"Bonds to O in one structure: $2+1+1 = 4$, shared by 3 positions: bond order $4/3 = 1\\tfrac13$.",why:"The real ion is the average (p. 11). Each O carries $-\\tfrac23$."},{t:"p. 16: C–O 143 pm, C=O 120 pm. Each C–O in carbonate is between 120 and 143 pm.",why:"Bond order between 1 and 2 means a length between the single and double values."}], ans:"(a) 3; (b) $1\\tfrac13$; (c) between 120 and 143 pm."}},
    {type:"explore", title:"Place the bond on the length scale", fig:"range", ref:"pp. 13, 16", body:"<p>Pick ozone: the shaded band from 121 to 145 pm is the answer to Example 4-6. Then pick nitrate and nitrite. Nitrate's bond order is lower ($1\\tfrac13$ vs $1\\tfrac12$), so its N–O bonds should be a little longer.</p>"},
    {type:"try", title:"Predict a bond length range", gen:"M4C3.g.length-range"},
    {type:"example", title:"Major and minor: formamide", ref:"pp. 4, 12 (like Example 4-7)", ex:{q:"Formamide is $\\ce{H2N-CH=O}$ with a lone pair on N and two on O. Draw a second resonance structure and decide which is the major contributor.", steps:[{t:"Look for a pattern from p. 12: the N lone pair is next to the C=O pi bond.",why:"A lone pair next to a pi bond can shift."},{t:"Move the N lone pair into a C=N bond and the C=O pi bond onto O as a third lone pair: $\\ce{H2N=CH-O}$.",why:"Single bonds untouched; the atom positions are the same."},{t:"Formal charges: first structure all 0. Second: N $5-(0+4)=+1$, O $6-(6+1)=-1$.",why:"Both sum to 0."},{t:"The first has the smaller formal charges, so it is the major contributor; the second is minor.",why:"Non-equivalent structures are ranked with the p. 4 rules."}], ans:"$\\ce{H2N-CH=O}$ (all 0) is major; $\\ce{H2N=CH-O}$ ($+1$ on N, $-1$ on O) is minor."}},
    {type:"try", title:"Pick the major contributor", gen:"M4C3.g.major-minor"},
    {type:"try", title:"Single, equivalent, or major and minor?", gen:"M4C3.g.resonance-type"},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the S–O bond order in sulfate, drawn with two S=O and two S–O⁻:", lines:["The two double bonds can sit on any two of the four O atoms.","That gives 6 equivalent resonance structures.","Bonds from S to O in one structure: $2 + 2 = 4$.","Bond order in the hybrid: $4 \\div 4 = 1$."], wrong:2, why:"Each double bond counts as 2: $2(2) + 2(1) = 6$. The bond order is $6/4 = 1\\tfrac12$."},
    {type:"try", title:"Which have resonance?", gen:"M4C3.g.can-resonate", diff:2},
    {type:"formulas", title:"Rules to know"}
  ]
});
})();
