/* Chapter 3.6 (Fri Oct 23): Electron affinity and electronegativity. Course notes Module 3, pp. 14-16 (section 3.5 D and E, and the summary).
   EA definition and sign convention, the C, O, F examples and O's second EA, the remarks and the EA table (p. 14),
   Pauling electronegativity and its table (p. 15), and the summary of trends (p. 16).
   EA and EN values come from C120.chem.EA and C120.chem.EN, which hold the notes' tables. */
(function(){
const M=C120;
const CH=M.chem;
const name=s=>CH.NAME[s];
const EA=CH.EA, EN=CH.EN;
const eaTxt=s=>EA[s]===null?"> 0":`${EA[s]>0?"+":""}${EA[s]}`;
/* main group: [symbol, period, group] for periods 1-6 */
const MAIN=[["H",1,1],["He",1,18]];
[["Li","Be","B","C","N","O","F","Ne"],["Na","Mg","Al","Si","P","S","Cl","Ar"],["K","Ca","Ga","Ge","As","Se","Br","Kr"],["Rb","Sr","In","Sn","Sb","Te","I","Xe"],["Cs","Ba","Tl","Pb","Bi","Po","At","Rn"]].forEach((row,i)=>row.forEach((s,j)=>MAIN.push([s,i+2,[1,2,13,14,15,16,17,18][j]])));
const at=s=>MAIN.find(x=>x[0]===s);
const GAINERS=[["F",-328],["Cl",-349],["Br",-325],["I",-295],["O",-141],["S",-200],["Se",-195],["C",-122]];

M.chapter({
  id:"M3C6", module:"m3", n:6, num:"3.6", date:"2026-10-23", added:"2026-10-26", quiz:"PC4",
  title:"Electron affinity and electronegativity", pages:"14-16", sections:["3.5"],
  summary:"Electron affinity is the energy change when a gas-phase atom gains an electron; a negative value means energy is released. Electronegativity (Pauling scale, H = 2.1, F = 4.0) is an atom's pull on electrons in a bond. Both rise from left to right and fall down a group, the opposite of atomic radius.",
  flags:[
    {ref:"p. 14", text:"The remarks say that group 2 atoms need energy to gain an electron. The table on the same page agrees only for Be and Mg (printed \"> 0\"). It gives small negative values (energy released) for Ca (−2), Sr (−5) and Ba (−14 kJ mol⁻¹). Read the remark as \"group 2 atoms release little or no energy\"."}
  ],
  formulas:[
    {id:"M3C6.f.ea", name:"Electron affinity", tex:"\\mathrm{X(g) + e^- \\rightarrow X^-(g)}\\qquad EA = \\text{energy change}", ref:"p. 14", note:"The first electron affinity. The notes report it in kJ mol⁻¹."},
    {id:"M3C6.f.sign", name:"Sign convention", tex:"EA < 0:\\ \\text{energy released}\\qquad EA > 0:\\ \\text{energy needed}", kind:"rule", ref:"p. 14",
      blank:{tex:"EA < 0 \\Rightarrow \\text{energy is } \\boxed{\\,?\\,}", accept:["released","given off","given out","evolved"]}},
    {id:"M3C6.f.cof", name:"First EAs of C, O and F", tex:"EA(\\mathrm{C}) = -122,\\quad EA(\\mathrm{O}) = -141,\\quad EA(\\mathrm{F}) = -328\\ \\mathrm{kJ\\,mol^{-1}}", kind:"constant", ref:"p. 14",
      blank:{tex:"EA(\\mathrm{F}) = \\boxed{\\,?\\,}\\ \\mathrm{kJ\\,mol^{-1}}", accept:["-328","−328"]}},
    {id:"M3C6.f.o2", name:"Second EA of oxygen", tex:"\\mathrm{O^-(g) + e^- \\rightarrow O^{2-}(g)}\\qquad EA(2) = +744\\ \\mathrm{kJ\\,mol^{-1}}", kind:"constant", ref:"p. 14", note:"Positive: pushing an electron onto an ion that is already negative takes energy."},
    {id:"M3C6.f.large", name:"\"Large\" EA", tex:"\\text{large EA} = \\text{a lot of energy released (very negative value)}", kind:"rule", ref:"p. 16", note:"So \"EA increases left to right\" means the values become more negative. A small EA releases little energy or needs energy."},
    {id:"M3C6.f.en", name:"Electronegativity (Pauling)", tex:"\\text{EN: power of an atom to attract electrons to itself};\\ \\ \\mathrm{H} = 2.1,\\ \\mathrm{F} = 4.0", kind:"constant", ref:"p. 15",
      blank:{tex:"\\text{Pauling EN of H (reference)} = \\boxed{\\,?\\,}", accept:["2.1"]}},
    {id:"M3C6.f.summary", name:"Summary of trends", tex:"IE,\\ EA,\\ EN:\\ \\uparrow \\text{ left to right},\\ \\downarrow \\text{ down a group}\\qquad \\text{radius}:\\ \\downarrow \\text{ left to right},\\ \\uparrow \\text{ down}", kind:"rule", ref:"p. 16",
      note:"Polarizability (Module 6) follows the radius pattern."}
  ],
  glossary:[
    {id:"M3C6.t.ea", term:"Electron affinity (EA)", def:"The energy change when an electron is added to a gas-phase atom: $\\mathrm{X(g) + e^- \\rightarrow X^-(g)}$. Negative means energy is released.", ref:"p. 14"},
    {id:"M3C6.t.ea2", term:"Second electron affinity", def:"The energy change for adding an electron to the anion: $\\mathrm{X^-(g) + e^- \\rightarrow X^{2-}(g)}$. For O it is +744 kJ mol⁻¹.", ref:"p. 14"},
    {id:"M3C6.t.en", term:"Electronegativity (EN)", def:"Pauling's measure of the power of an atom to attract electrons to itself. It helps decide whether two atoms share a pair of electrons equally.", ref:"p. 15"},
    {id:"M3C6.t.pauling", term:"Pauling scale", def:"The electronegativity scale used in the notes. H is the reference at 2.1; F is the highest at 4.0.", ref:"p. 15"},
    {id:"M3C6.t.polar", term:"Polarizability", def:"How easily an atom's electron cloud is distorted. It follows the radius trend; it is covered in Module 6.", ref:"p. 16"}
  ],
  figures:{
    ladder:{title:"Energy change when an atom gains an electron", cap:"Pick an element. The top line is the atom plus a free electron; the lower or upper line is the anion. A downward step means energy released (EA negative). Values from the notes' table (p. 14).", ref:"p. 14",
      build(host,{PLOT,M}){
        const LIST=["F","Cl","Br","I","O","S","C","Si","N","P","Li","Na","H","B","Al","Ca","Ba","Be","Mg","Ne","Ar"];
        let cur="Cl", two=false;
        const ctl=PLOT.controls(host);
        const sel=document.createElement("select"); sel.setAttribute("aria-label","Element");
        LIST.forEach(s=>{ const o=document.createElement("option"); o.value=s; o.textContent=`${s} (${CH.NAME[s]})`; if(s===cur) o.selected=true; sel.append(o); });
        sel.onchange=()=>{ cur=sel.value; if(cur!=="O") { two=false; tw.style.display="none"; } else tw.style.display=""; draw(); }; ctl.append(sel);
        const tw=document.createElement("div"); ctl.append(tw); tw.style.display="none";
        PLOT.seg(tw,{label:"Steps",items:[[false,"First EA"],[true,"O to O²⁻ (two steps)"]],value:false,onchange:v=>{ two=v; draw(); }});
        const svgHost=document.createElement("div"); host.append(svgHost); const out=PLOT.readout(host);
        const lvl=(y,txt,x0=120,x1=330)=>`<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" style="stroke:var(--fig-stroke);stroke-width:2.4"/><text x="${x1+8}" y="${y+4}" style="font-size:12px">${txt}</text>`;
        const arrow=(x,y0,y1,c)=>`<line x1="${x}" x2="${x}" y1="${y0}" y2="${y1+(y1>y0?-8:8)}" style="stroke:${c};stroke-width:2.4"/><path d="M${x-6} ${y1+(y1>y0?-10:10)} L${x} ${y1} L${x+6} ${y1+(y1>y0?-10:10)}" style="fill:${c}"/>`;
        function draw(){
          const W=470, k=0.3, neg=!two&&EA[cur]!==null&&EA[cur]<0; const H=two?290:190, base=two?250:neg?40:150; let g="";
          if(!two){
            const v=EA[cur]; const y1=v===null?base-40:base-v*k;
            g+=lvl(base,`${cur}(g) + e⁻`)+lvl(y1,`${cur}⁻(g)`);
            if(Math.abs(y1-base)>4) g+=arrow(220,base,y1,v===null||v>0?"var(--bad)":"var(--ok)");
            g+=`<text x="230" y="${(base+y1)/2+4}" style="font-size:12px">EA = ${eaTxt(cur)} kJ/mol</text>`;
            out.innerHTML=M.rich(v===null?`${CH.NAME[cur]}: printed as "> 0". Adding an electron needs energy${["Be","Mg"].includes(cur)?" (group 2: a full $s$ subshell)":["He","Ne","Ar","Kr","Xe","Rn"].includes(cur)?" (group 18: a full shell)":""}.`:v>0?`${CH.NAME[cur]}: $EA = +${v}$ kJ/mol. Nitrogen is the only atom in groups 13 to 17 of the table that needs energy.`:`${CH.NAME[cur]}: $EA = ${v}$ kJ/mol, so ${-v} kJ is released per mole of atoms.${cur==="Cl"?" The most negative value in the table.":cur==="F"?" Less negative than Cl ($-349$), even though F is higher in the group.":""}`);
          } else {
            const y1=base-(-141)*k, y2=y1-744*k;
            const top=Math.min(base,y2)-20, shift=top<30?30-top:0;
            g+=lvl(base+shift,"O(g) + 2e⁻")+lvl(y1+shift,"O⁻(g) + e⁻")+lvl(y2+shift,"O²⁻(g)");
            g+=arrow(170,base+shift,y1+shift,"var(--ok)")+arrow(260,y1+shift,y2+shift,"var(--bad)");
            g+=`<text x="60" y="${(base+y1)/2+shift+4}" style="font-size:12px">−141</text><text x="270" y="${(y1+y2)/2+shift+4}" style="font-size:12px">+744</text>`;
            out.innerHTML=M.rich("First step: $EA(1) = -141$ kJ/mol (released). Second step: $EA(2) = +744$ kJ/mol (needed), because the electron is pushed onto an ion that is already negative (p. 14). Overall the two steps add to $+603$ kJ/mol (this sum is worked out here; the notes print only the two steps).");
          }
          svgHost.innerHTML=`<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="Electron affinity energy diagram">${g}</svg>`;
        }
        draw();
      }},
    ea3d:{title:"Electron affinity across the main groups", cap:"Bar height shows how much energy is released when each atom gains an electron (the notes' table, p. 14). Atoms that need energy instead (printed \"> 0\", and N at +7) are short hatched stubs. The d block is not in the table.", ref:"p. 14",
      model:{type:"trends", params:{property:"ea", highlight:["F","Cl","N"]}},
      predict:{q:"Which releases more energy when it gains an electron: F or Cl?", opts:[["F, because it is higher in group 17",false,"The table gives F $-328$ and Cl $-349$ kJ mol⁻¹."],["Cl",true,"Cl ($-349$) is the most negative value in the table (p. 14)."],["They release the same amount",false,"The values differ by 21 kJ mol⁻¹."]], check:"Click F and Cl and read the two values; then click N."}},
    en3d:{title:"Electronegativity across the main groups", cap:"Pauling electronegativities from the notes' table (p. 15). Elements with no value printed in the notes are empty outlines.", ref:"p. 15",
      model:{type:"trends", params:{property:"en", highlight:["F","O","N","Cl"]}},
      predict:{q:"Which element is the most electronegative?", opts:[["F",true,"F = 4.0, the top of the Pauling scale (p. 15)."],["O",false,"O is second at 3.5."],["Cl",false,"Cl is 3.0."],["He",false,"The notes print no value for the noble gases."]], check:"Click along period 2, then down group 17."}},
    summary:{title:"Summary of periodic trends", cap:"The summary on p. 16. Pick a property to see which way it increases.", ref:"p. 16",
      build(host,{PLOT,M}){
        let prop="ie";
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Property",items:[["radius","Atomic radius"],["ie","Ionization energy"],["ea","Electron affinity"],["en","Electronegativity"]],value:prop,onchange:v=>{ prop=v; draw(); }});
        const svgHost=document.createElement("div"); host.append(svgHost); const out=PLOT.readout(host);
        const ROWS=[["H","","","","","","","He"],["Li","Be","B","C","N","O","F","Ne"],["Na","Mg","Al","Si","P","S","Cl","Ar"],["K","Ca","Ga","Ge","As","Se","Br","Kr"],["Rb","Sr","In","Sn","Sb","Te","I","Xe"],["Cs","Ba","Tl","Pb","Bi","Po","At","Rn"]];
        function draw(){
          const up=prop!=="radius"; const cw=44, ch=30, x0=40, y0=40; let g="";
          ROWS.forEach((r,i)=>r.forEach((s,j)=>{ if(!s) return; const t=up?(j/7+(5-i)/5)/2:((7-j)/7+i/5)/2;
            g+=`<rect x="${x0+j*cw}" y="${y0+i*ch}" width="${cw-3}" height="${ch-3}" rx="3" style="fill:color-mix(in srgb,var(--accent) ${Math.round(8+t*60)}%,var(--paper));stroke:var(--rule)"/><text x="${x0+j*cw+(cw-3)/2}" y="${y0+i*ch+19}" text-anchor="middle" style="font-size:12px">${s}</text>`; }));
          const ax=x0+8*cw+16, ay=y0+6*ch+16;
          g+= up?`<path d="M${x0} 22 L${x0+8*cw-10} 22" style="stroke:var(--ink);stroke-width:2"/><path d="M${x0+8*cw-16} 16 L${x0+8*cw-6} 22 L${x0+8*cw-16} 28" style="fill:var(--ink)"/><text x="${x0}" y="14" style="font-size:11px">increases left to right</text><path d="M${ax} ${y0+6*ch} L${ax} ${y0+6}" style="stroke:var(--ink);stroke-width:2"/><path d="M${ax-6} ${y0+14} L${ax} ${y0+4} L${ax+6} ${y0+14}" style="fill:var(--ink)"/><text x="${ax+8}" y="${y0+20}" style="font-size:11px">increases</text><text x="${ax+8}" y="${y0+34}" style="font-size:11px">going up</text>`
              :`<path d="M${x0+8*cw-10} ${ay} L${x0+6} ${ay}" style="stroke:var(--ink);stroke-width:2"/><path d="M${x0+14} ${ay-6} L${x0+4} ${ay} L${x0+14} ${ay+6}" style="fill:var(--ink)"/><text x="${x0+40}" y="${ay+16}" style="font-size:11px">increases right to left</text><path d="M${ax} ${y0} L${ax} ${y0+6*ch-8}" style="stroke:var(--ink);stroke-width:2"/><path d="M${ax-6} ${y0+6*ch-14} L${ax} ${y0+6*ch-4} L${ax+6} ${y0+6*ch-14}" style="fill:var(--ink)"/><text x="${ax+8}" y="${y0+6*ch-30}" style="font-size:11px">increases</text><text x="${ax+8}" y="${y0+6*ch-16}" style="font-size:11px">going down</text>`;
          svgHost.innerHTML=`<svg viewBox="0 0 ${ax+80} ${ay+26}" class="fig" role="img" aria-label="Trend summary">${g}</svg>`;
          out.innerHTML=M.rich({radius:"Atomic radius (and polarizability) decrease from left to right and increase from top to bottom (p. 16). Darker = larger here.",ie:"First ionization energy increases from left to right and decreases down a group (p. 16), with the dips after groups 2 and 15.",ea:"Electron affinity \"increases\" from left to right and decreases down a group (p. 16). Increase here means <b>more energy released</b>, so the values become more negative. Exceptions in the table: N (+7), groups 2 and 18, and Cl beyond F.",en:"Electronegativity increases from left to right and decreases down a group (p. 15). F, O, Cl and N are the most electronegative."}[prop]);
        }
        draw();
      }}
  },
  gens:[
    {id:"M3C6.g.ea-pick", title:"Read the electron affinity table", skill:"Sign convention and the EA table", ref:"p. 14",
      gen(R,d){
        const pool=MAIN.filter(x=>x[0] in EA);
        const kind=d===3&&R()<0.5?"needs":"most";
        let set, ans;
        for(let t=0;t<300;t++){
          if(kind==="needs"){ const pos=pool.filter(x=>EA[x[0]]===null||EA[x[0]]>0); const neg=pool.filter(x=>EA[x[0]]!==null&&EA[x[0]]<0); ans=R.pick(pos); set=R.shuffle([ans,...R.shuffle(neg).slice(0,4)]); if(set.map(x=>x[0]).sort().join()==="B,F,He,Li,O") continue; break; }   /* a sample test's own set */
          const pr=R.int(2,3), gr=R.pick([14,15,16,17]); const src=d===1?pool.filter(x=>x[1]===pr):d===2?pool.filter(x=>x[2]===gr):pool;
          if(src.length<4) continue;
          set=R.shuffle(src).slice(0,d===1?4:5); const nums=set.filter(x=>EA[x[0]]!==null).map(x=>EA[x[0]]);
          if(!nums.length) continue; const mn=Math.min(...nums); if(mn>=0) continue; if(nums.filter(v=>v===mn).length>1) continue; if(d===3&&!set.some(x=>["F","Cl","N"].includes(x[0]))) continue;
          ans=set.find(x=>EA[x[0]]===mn); break;
        }
        const why=set.map(([s])=>`${s}: $EA = ${eaTxt(s)}$ kJ/mol.`);
        return {prompt:kind==="needs"?"According to the notes' table, which of these atoms needs energy (rather than releasing it) when it gains an electron?":"According to the notes' table (p. 14), which of these atoms releases the <b>most</b> energy when a gas-phase atom gains an electron?",
          answer:{type:"mc",options:set.map(x=>x[0]),correct:set.indexOf(ans),why},
          hint:"Look the values up in the table on p. 14. Negative means energy released; the most negative value releases the most. \"> 0\" means energy is needed.",
          steps:[...why,kind==="needs"?`Only ${ans[0]} has a positive value (or "> 0"), so it needs energy.`:`The most negative value is ${ans[0]} (${eaTxt(ans[0])} kJ/mol), so it releases the most energy.`],
          answerTeX:ans[0]};
      }},
    {id:"M3C6.g.ea-energy", title:"Energy change when atoms gain electrons", skill:"EA times moles, with the sign", ref:"p. 14",
      gen(R,d){
        if(d===3){ const m=R.sig(1,20,3), mm=CH.MASS.O, n=m/mm, per=-141+744, E=n*per;
          return {prompt:`What is the total energy change, in kJ (with its sign), when ${M.toSig(m,3)} g of gas-phase O atoms are converted to $\\ce{O^2-(g)}$ ions? Use the notes' values for the first and second electron affinities of oxygen.`,
            answer:{type:"num",value:E,unit:"kJ",sf:3}, hint:"Two steps: $EA(1) = -141$ and $EA(2) = +744$ kJ mol⁻¹ (p. 14). Add them, then multiply by moles of O atoms.",
            steps:[`$n = \\dfrac{${M.toSig(m,3)}\\ \\mathrm{g}}{16.00\\ \\mathrm{g\\,mol^{-1}}} = ${M.toSig(n,4)}\\ \\mathrm{mol}$`,"$\\ce{O(g) + e- -> O-(g)}$: $-141$; $\\ce{O-(g) + e- -> O^2-(g)}$: $+744\\ \\mathrm{kJ\\,mol^{-1}}$","Per mole: $-141 + 744 = +603\\ \\mathrm{kJ\\,mol^{-1}}$ (energy needed overall)",`$\\Delta E = ${M.toSig(n,4)} \\times (+603) = ${M.toSig(E,3)}\\ \\mathrm{kJ}$`],
            answerTeX:`$+${M.qty(E,3,"kJ")}$`, verify:{value:m*(-141)/mm+m*744/mm}}; }
        const [s,ea]=R.pick(GAINERS);
        if(d===1){ const n=R.sig(0.1,2.5,3), E=n*ea;
          return {prompt:`What is the energy change, in kJ (with its sign), when ${M.toSig(n,3)} mol of gas-phase ${name(s).toLowerCase()} atoms each gain one electron? Use the notes' electron affinity.`,
            answer:{type:"num",value:E,unit:"kJ",sf:3}, hint:`$EA(\\mathrm{${s}}) = ${ea}$ kJ mol⁻¹ (p. 14). Negative means energy released.`,
            steps:[`$\\ce{${s}(g) + e- -> ${s}-(g)}$: $EA = ${ea}\\ \\mathrm{kJ\\,mol^{-1}}$`,`$\\Delta E = ${M.toSig(n,3)}\\ \\mathrm{mol} \\times (${ea}\\ \\mathrm{kJ\\,mol^{-1}}) = ${M.toSig(E,3)}\\ \\mathrm{kJ}$`,`Negative: ${M.toSig(-E,3)} kJ is released.`],
            answerTeX:`$${M.qty(E,3,"kJ")}$`, verify:{value:ea*n}}; }
        const mm=CH.MASS[s]; const m=R.sig(1,2.4*mm,3); const n=m/mm, E=n*ea;
        return {prompt:`What is the energy change, in kJ (with its sign), when ${M.toSig(m,3)} g of gas-phase ${name(s).toLowerCase()} atoms each gain one electron? Use the notes' electron affinity and the data-sheet molar mass.`,
          answer:{type:"num",value:E,unit:"kJ",sf:3}, hint:`Moles first ($M = ${mm}$ g/mol), then multiply by $EA = ${ea}$ kJ mol⁻¹.`,
          steps:[`$n = \\dfrac{${M.toSig(m,3)}\\ \\mathrm{g}}{${mm}\\ \\mathrm{g\\,mol^{-1}}} = ${M.toSig(n,4)}\\ \\mathrm{mol}$`,`$\\Delta E = ${M.toSig(n,4)}\\ \\mathrm{mol} \\times (${ea}\\ \\mathrm{kJ\\,mol^{-1}}) = ${M.toSig(E,3)}\\ \\mathrm{kJ}$`,`The minus sign says energy is released: ${M.toSig(-E,3)} kJ.`],
          answerTeX:`$${M.qty(E,3,"kJ")}$`, verify:{value:m*ea/mm}};
      }},
    {id:"M3C6.g.en-pick", title:"Most or least electronegative", skill:"Read the Pauling table and its trend", ref:"p. 15",
      gen(R,d){
        const pool=MAIN.filter(x=>x[0] in EN);
        let set, want, ans;
        for(let t=0;t<400;t++){
          want=R.pick(["most","least"]);
          if(d===1){ const p=R.int(2,3); set=R.shuffle(pool.filter(x=>x[1]===p)).slice(0,4); }
          else if(d===2){ const g=R.pick([1,2,15,16,17]); set=R.shuffle(pool.filter(x=>x[2]===g)).slice(0,R.int(3,4)); }
          else set=R.shuffle(pool).slice(0,5);
          if(set.length<3) continue; if(set.some(x=>x[0]==="Al")&&set.some(x=>x[0]==="Ga")) continue;
          const v=set.map(x=>EN[x[0]]); const ext=want==="most"?Math.max(...v):Math.min(...v); if(v.filter(x=>x===ext).length>1) continue;
          ans=set[v.indexOf(ext)];
          /* d3 mixes periods and groups: keep only sets where the trend alone decides (the answer is up-right of every other for "most", down-left for "least") */
          if(d===3){ const c=g=>g<=2?g:g-10; const [ , ap, ag]=ans; if(!set.every(([s,p,g])=>s===ans[0]||(want==="most"?(ap<=p&&c(ag)>=c(g)):(ap>=p&&c(ag)<=c(g))))) continue; }
          break;
        }
        const why=set.map(([s,p,g])=>`${s} (period ${p}, group ${g}): EN $= ${EN[s].toFixed(1)}$.`);
        return {prompt:`Which of these atoms is the <b>${want}</b> electronegative?`,
          answer:{type:"mc",options:set.map(x=>x[0]),correct:set.indexOf(ans),why},
          hint:"EN increases from left to right across a period and decreases down a group (p. 15). F is the top of the scale at 4.0.",
          steps:["Trend: EN increases left to right and decreases top to bottom (p. 15).",...why,`So the ${want} electronegative is ${ans[0]}.`],
          answerTeX:ans[0]};
      }},
    {id:"M3C6.g.trend", title:"Which way does it change?", skill:"Summary of trends, with the EA sign", ref:"p. 16",
      gen(R,d){
        const props=d===1?["radius","ie","en"]:d===2?["radius","ie","en","ea"]:["ea","ea","polar","ie","radius"];
        const prop=R.pick(props); const dir=R.pick(["across","down"]);
        const row=R.pick([2,3,4]); const grp=prop==="ea"?R.pick([1,17]):R.pick([1,2,14,15,16,17]);   /* EA down groups 2, 14, 15 and 16 does not follow the general trend in the p. 14 table */
        const rowEnds={2:["Li","F"],3:["Na","Cl"],4:["K","Br"]}[row];
        const where=dir==="across"?`from ${rowEnds[0]} to ${rowEnds[1]} across period ${row}`:prop==="ea"&&grp===17?"from Cl to At down group 17":`down group ${grp}`;
        const incAcross={radius:false,ie:true,en:true,ea:true,polar:false}[prop];
        const inc=dir==="across"?incAcross:!incAcross;
        const label={radius:"the atomic radius",ie:"the first ionization energy",en:"the electronegativity",ea:"the electron affinity values (as printed in the table)",polar:"the polarizability"}[prop];
        let options, correct;
        if(prop==="ea"){ options=["They become more negative (more energy released)","They become less negative (less energy released)","They do not change"]; correct=inc?0:1; }
        else { options=["It increases","It decreases","It does not change"]; correct=inc?0:1; }
        return {prompt:`In general, what happens to ${label} going ${where}?`,
          answer:{type:"mc",options,correct,keep:true},
          hint:prop==="ea"?"A \"larger\" EA means more energy released, which is a more negative number (p. 16).":"Radius and polarizability go one way; IE, EA and EN go the other (p. 16).",
          steps:["IE, EA and EN increase from left to right and decrease down a group; radius and polarizability do the opposite (p. 16).",prop==="ea"?`For EA, \"increase\" means more energy released, so the printed values become more negative. ${inc?"Here EA increases":"Here EA decreases"}.`:`Here ${label} ${inc?"increases":"decreases"}.`,prop==="ea"&&dir==="down"&&grp===17?"Table: Cl $-349$, Br $-325$, I $-295$, At $-270$. (F, at $-328$, is the exception at the top of the group.)":prop==="ea"&&dir==="down"?"Table: H $-73$, Li $-60$, Na $-53$, K $-48$, Rb $-47$, Cs $-46$.":prop==="ea"&&dir==="across"?"Exceptions in the table: N is +7, and the group 2 and 18 atoms release little or no energy.":""].filter(Boolean),
          answerTeX:options[correct]};
      }}
  ],
  exam:[
    {id:"M3C6.q1", ref:"p. 14", q:"According to the notes' table, which atom releases the most energy when it gains an electron?", opts:[["F",false,"$-328$ kJ mol⁻¹: large, but not the largest."],["Cl",true,"$-349$ kJ mol⁻¹, the most negative value in the table."],["O",false,"$-141$ kJ mol⁻¹."],["Br",false,"$-325$ kJ mol⁻¹."],["Ne",false,"Printed \"> 0\": it needs energy."]]},
    {id:"M3C6.q2", ref:"p. 14", q:"Which atom in groups 13 to 17 of the notes' table has a positive electron affinity?", opts:[["C",false,"$-122$ kJ mol⁻¹."],["N",true,"$+7$ kJ mol⁻¹: the only positive value in groups 13 to 17."],["B",false,"$-27$ kJ mol⁻¹."],["P",false,"$-72$ kJ mol⁻¹."],["O",false,"$-141$ kJ mol⁻¹."]]},
    {id:"M3C6.q3", ref:"p. 14", q:"For $\\ce{S(g) + e- -> S-(g)}$ the table gives $-200$ kJ mol⁻¹. What does the minus sign mean?", opts:[["200 kJ is released per mole of S atoms.",true,"Negative EA means energy is given out (p. 14)."],["200 kJ must be supplied per mole of S atoms.",false,"That would be a positive EA."],["Sulfur loses an electron.",false,"The process adds an electron."],["The S⁻ ion is higher in energy than S plus an electron.",false,"It is lower, which is why energy is released."],["The value is a second electron affinity.",false,"This is the first EA."]]},
    {id:"M3C6.q4", ref:"p. 14", q:"Oxygen's first EA is $-141$ kJ mol⁻¹ but its second is $+744$ kJ mol⁻¹. Why is the second one positive?", opts:[["The electron is being added to an ion that is already negative, which repels it.",true,"Pushing an electron onto $\\ce{O-}$ takes energy."],["$\\ce{O-}$ has a full shell.",false,"$\\ce{O-}$ is $2p^5$; the shell is not full yet."],["Second electron affinities are always the same as first ones.",false,"They differ a lot here."],["Oxygen is a metal.",false,"Oxygen is a nonmetal."],["The second electron goes into a $3s$ orbital.",false,"It completes $2p^6$."]]},
    {id:"M3C6.q5", ref:"p. 15", q:"Using the notes' Pauling values, which atom is the most electronegative?", opts:[["N",false,"3.0."],["O",true,"3.5, second only to F (not offered)."],["Cl",false,"3.0."],["S",false,"2.5."],["C",false,"2.5."]]},
    {id:"M3C6.q6", ref:"p. 16", multi:true, q:"Which of these generally increase from left to right across a period? Select all that apply.", opts:[["First ionization energy",true,"Yes, with the two dips."],["Electron affinity (energy released)",true,"Yes: values become more negative."],["Electronegativity",true,"Yes."],["Atomic radius",false,"Radius decreases across a period."],["Polarizability",false,"It follows radius and decreases."]]},
    {id:"M3C6.q7", ref:"p. 14", multi:true, q:"Which group 2 atoms does the notes' table list as needing energy (EA \"> 0\") to gain an electron? Select all that apply.", opts:[["Be",true,"Printed \"> 0\"."],["Mg",true,"Printed \"> 0\"."],["Ca",false,"The table gives $-2$ kJ mol⁻¹: a little energy is released."],["Sr",false,"$-5$ kJ mol⁻¹."],["Ba",false,"$-14$ kJ mol⁻¹."]]}
  ],
  steps:[
    {type:"read", title:"Electron affinity: the energy change on gaining an electron", ref:"p. 14", body:"<div class=\"box def\"><b class=\"t\">Electron affinity (p. 14)</b>The energy change when an electron is added to a gas-phase atom: $\\mathrm{X(g) + e^- \\rightarrow X^-(g)}$.</div><p>The sign tells you which way energy flows. <b>Negative: energy is released</b>, so the anion is lower in energy than the atom plus a free electron. Positive: energy has to be put in.</p><p>A ball rolling into a hollow gives off energy; that is a negative EA. Pushing a ball up a bump takes energy; that is a positive EA.</p>"},
    {type:"read", title:"First and second electron affinities", ref:"p. 14", body:"<p>The notes' examples, in kJ mol⁻¹:</p><table class=\"cn-table\"><tr><th>process</th><th>value</th></tr><tr><td>$\\ce{C(g) + e- -> C-(g)}$</td><td>$EA(1) = -122$</td></tr><tr><td>$\\ce{O(g) + e- -> O-(g)}$</td><td>$EA(1) = -141$</td></tr><tr><td>$\\ce{O-(g) + e- -> O^2-(g)}$</td><td>$EA(2) = +744$</td></tr><tr><td>$\\ce{F(g) + e- -> F-(g)}$</td><td>$EA(1) = -328$</td></tr></table><p>The second EA of oxygen is positive and large: the new electron is pushed onto an ion that is already negative.</p>"},
    {type:"mcq", title:"Write the right equation", q:"Which equation represents the first electron affinity of bromine?", opts:[["$\\ce{Br(g) + e- -> Br-(g)}$",true,"One electron added to a gas-phase atom."],["$\\ce{Br(g) -> Br+(g) + e-}$",false,"That is ionization."],["$\\ce{Br2(g) + 2e- -> 2Br-(g)}$",false,"EA is for single atoms, not $\\mathrm{Br_2}$."],["$\\ce{Br-(g) + e- -> Br^2-(g)}$",false,"That would be a second EA."],["$\\ce{Br(l) + e- -> Br-(aq)}$",false,"EA is defined for the gas phase."]]},
    {type:"explore", title:"Step down (or up) to the anion", fig:"ladder", ref:"p. 14", body:"<p>Compare Cl, F and N, then Be. Pick O and switch to the two-step view to see why $\\ce{O^2-}$ costs energy overall.</p>"},
    {type:"read", title:"The EA table and what it shows", ref:"p. 14", body:"<p>Values in kJ mol⁻¹ for the main groups (p. 14):</p><table class=\"cn-table\"><tr><th></th><th>1</th><th>2</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th></tr><tr><td>1</td><td>H −73</td><td></td><td></td><td></td><td></td><td></td><td></td><td>He > 0</td></tr><tr><td>2</td><td>Li −60</td><td>Be > 0</td><td>B −27</td><td>C −122</td><td>N +7</td><td>O −141</td><td>F −328</td><td>Ne > 0</td></tr><tr><td>3</td><td>Na −53</td><td>Mg > 0</td><td>Al −43</td><td>Si −134</td><td>P −72</td><td>S −200</td><td>Cl −349</td><td>Ar > 0</td></tr><tr><td>4</td><td>K −48</td><td>Ca −2</td><td>Ga −29</td><td>Ge −119</td><td>As −78</td><td>Se −195</td><td>Br −325</td><td>Kr > 0</td></tr><tr><td>5</td><td>Rb −47</td><td>Sr −5</td><td>In −29</td><td>Sn −107</td><td>Sb −103</td><td>Te −190</td><td>I −295</td><td>Xe > 0</td></tr><tr><td>6</td><td>Cs −46</td><td>Ba −14</td><td>Tl −19</td><td>Pb −35</td><td>Bi −91</td><td>Po −186</td><td>At −270</td><td>Rn > 0</td></tr></table><ul><li>Most atoms release energy. The exceptions are N, the group 18 atoms, and Be and Mg in group 2. The notes explain groups 2 and 18 this way: a full $ns^2$ subshell or a full shell does not \"want\" another electron. They give no reason for N.</li><li>Near the right end of a period (not group 18) a lot of energy is released: O and F have large EAs.</li><li>Near the left end only a little is released: Li, Na and K have small EAs.</li></ul><p>A caution about the notes: the remarks say group 2 atoms need energy, but the table gives small negative values for Ca, Sr and Ba. Only Be and Mg are \"> 0\".</p>"},
    {type:"explore", title:"Electron affinity in 3D", fig:"ea3d", ref:"p. 14", body:"<p>Turn the model to look along group 17: Cl releases more than F. Then find the gaps at N, group 2 and group 18. (The notes give the values but do not explain F against Cl. A common explanation, not from the notes: F's small $2p$ shell is crowded, so the extra electron feels more repulsion.)</p>"},
    {type:"try", title:"Read the EA table", gen:"M3C6.g.ea-pick"},
    {type:"example", title:"Energy released when chlorine atoms gain electrons", ref:"p. 14", ex:{q:"What is the energy change when 3.20 g of gas-phase Cl atoms each gain one electron?", steps:[{t:"$n = \\dfrac{3.20\\ \\mathrm{g}}{35.45\\ \\mathrm{g\\,mol^{-1}}} = 0.09027\\ \\mathrm{mol}$",why:"Data-sheet molar mass of Cl atoms (not $\\mathrm{Cl_2}$: the process is for single atoms)."},{t:"$\\ce{Cl(g) + e- -> Cl-(g)}$: $EA = -349\\ \\mathrm{kJ\\,mol^{-1}}$",why:"From the table on p. 14."},{t:"$\\Delta E = 0.09027\\ \\mathrm{mol} \\times (-349\\ \\mathrm{kJ\\,mol^{-1}}) = -31.5\\ \\mathrm{kJ}$",why:"Keep the sign. 3 significant figures, from 3.20 g."},{t:"The minus sign means 31.5 kJ is released.",why:"Negative EA: energy given out."}], ans:"$\\Delta E = -31.5$ kJ (31.5 kJ released).", ref:"p. 14"}},
    {type:"try", title:"Energy change on gaining electrons", gen:"M3C6.g.ea-energy"},
    {type:"read", title:"Electronegativity: pull on shared electrons", ref:"p. 15", body:"<div class=\"box def\"><b class=\"t\">Electronegativity (p. 15)</b>Linus Pauling's idea: the power of an atom to attract electrons to itself. It helps decide whether two atoms share a pair of electrons equally.</div><p>EA is about a lone gas-phase atom taking an electron. EN is about the tug of war between two atoms over the electrons in a bond (more in Module 4). Some Pauling values from the notes:</p><table class=\"cn-table\"><tr><th></th><th>1</th><th>2</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th></tr><tr><td>1</td><td>H 2.1</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>2</td><td>Li 1.0</td><td>Be 1.5</td><td>B 2.0</td><td>C 2.5</td><td>N 3.0</td><td>O 3.5</td><td>F 4.0</td></tr><tr><td>3</td><td>Na 0.9</td><td>Mg 1.2</td><td>Al 1.5</td><td></td><td>P 2.1</td><td>S 2.5</td><td>Cl 3.0</td></tr><tr><td>4</td><td>K 0.8</td><td>Ca 1.0</td><td>Ga 1.6</td><td></td><td>As 2.0</td><td>Se 2.4</td><td>Br 2.8</td></tr><tr><td>5</td><td>Rb 0.8</td><td>Sr 1.0</td><td></td><td></td><td></td><td>Te 2.1</td><td>I 2.5</td></tr><tr><td>6</td><td>Cs 0.8</td><td></td><td></td><td></td><td></td><td>Po 2.0</td><td>At 2.2</td></tr><tr><td>7</td><td>Fr 0.7</td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table><ul><li>H is the reference atom, set at 2.1.</li><li>F, O, Cl and N are the most electronegative.</li><li>s-block metals (not H) are about 1; d-block metals are about 1 to 2 (values not shown).</li><li>In the p block, EN is above 1 and increases left to right.</li></ul><p>The trend: EN <b>increases from left to right</b> and <b>decreases from top to bottom</b>. \"In general\": Ga (1.6) is a little above Al (1.5).</p>"},
    {type:"explore", title:"Electronegativity in 3D", fig:"en3d", ref:"p. 15", body:"<p>The tallest bars cluster at the top right (F, O, N, Cl). The shortest are at the bottom left (Cs, Fr).</p>"},
    {type:"try", title:"Most or least electronegative", gen:"M3C6.g.en-pick"},
    {type:"read", title:"One picture for all the trends", fig:"summary", ref:"p. 16", body:"<p>The summary on p. 16 puts the chapter together:</p><ul><li>Atomic radius (and polarizability) <b>decrease</b> from left to right and <b>increase</b> down a group.</li><li>First ionization energy, electron affinity and electronegativity <b>increase</b> from left to right and <b>decrease</b> down a group.</li></ul><p>One trap: a <b>large</b> EA means a lot of energy released, which is a very negative number. So when the notes say EA \"increases\" across a period, the printed values become <b>more negative</b>.</p>"},
    {type:"try", title:"Which way does it change?", gen:"M3C6.g.trend"},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the energy change when 4.00 g of Br(g) atoms gain electrons:", lines:["$\\ce{Br(g) + e- -> Br-(g)}$, $EA = -325\\ \\mathrm{kJ\\,mol^{-1}}$ (p. 14).","$n = 4.00\\ \\mathrm{g} \\div 79.90\\ \\mathrm{g\\,mol^{-1}} = 0.0501\\ \\mathrm{mol}$.","$\\Delta E = 0.0501\\ \\mathrm{mol} \\times 325\\ \\mathrm{kJ\\,mol^{-1}} = +16.3\\ \\mathrm{kJ}$.","So the energy change is $+16.3$ kJ."], wrong:2, why:"The sign was dropped. $\\Delta E = 0.0501 \\times (-325) = -16.3$ kJ: energy is released, so the change is negative."},
    {type:"formulas", title:"Rules and values to know"}
  ]
});
})();
