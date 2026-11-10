/* Chapter 2.3 (Mon Sep 28): Line spectra and the Bohr model. Course notes Module 2, pp. 8-12 (section 2.3 part iii and section 2.4).
   Continuous, absorption and emission spectra, the H lines on p. 8, Bohr's quantized orbits, E_n = -R_H/n^2,
   ΔE = -R_H(1/n_f^2 - 1/n_i^2) with the notes' sign (ΔE > 0 absorbed, < 0 emitted, photon energy = |ΔE|), and the problems with the model. */
(function(){
const M=C120, K=C120.chem.CONST;
const HC=K.h*K.c, RH=K.RH;
const En=n=>-RH/(n*n);
const dE=(ni,nf)=>-RH*(1/(nf*nf)-1/(ni*ni));
/* round to sf significant figures as a number (M.toSig loses digits below about 1e-17, so it is not used for energies) */
const sig=(v,sf)=>+(+v).toPrecision(sf);
const J=(v,sf=3)=>M.qty(v,sf,"J",{sci:true});
const S=(v,sf=3)=>M.qty(v,sf,"s^-1",{sci:true});
const HCTeX="(6.626\\times10^{-34}\\ \\mathrm{J\\,s})(2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}})";
/* answer a wavelength in nm below 1000 nm, otherwise in μm (keeps three significant figures easy to type) */
function lamAns(lam){ const nm=lam*1e9; return nm<1000?{value:nm,unit:"nm",word:"nanometres",tex:M.qty(nm,3,"nm")}:{value:lam*1e6,unit:"μm",word:"micrometres",tex:M.qty(lam*1e6,3,"μm")}; }
const region=lam=>{ const nm=lam*1e9; return nm<400?"ultraviolet":nm<=750?"visible":"infrared"; };
const COL=[["violet",400,450],["blue",450,495],["green",495,570],["yellow",570,590],["orange",590,620],["red",620,751]];
const colourOf=nm=>{ const c=COL.find(([n,a,b])=>nm>=a&&nm<b); return c?c[0]:null; };
function lamRGB(nm){
  let r=0,g=0,b=0;
  if(nm<440){ r=(440-nm)/60; b=1; } else if(nm<490){ g=(nm-440)/50; b=1; } else if(nm<510){ g=1; b=(510-nm)/20; } else if(nm<580){ r=(nm-510)/70; g=1; } else if(nm<645){ r=1; g=(645-nm)/65; } else { r=1; }
  const f=nm<420?0.35+0.65*(nm-380)/40:nm>700?0.35+0.65*(780-nm)/80:1;
  const c=x=>Math.round(255*Math.pow(Math.max(0,Math.min(1,x*f)),0.8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.append(e); return e; }
/* the ΔE line with numbers, in the notes' form */
const dETeX=(ni,nf,sf=4)=>`\\Delta E = -R_H\\left(\\dfrac{1}{n_f^2}-\\dfrac{1}{n_i^2}\\right) = -(2.179\\times10^{-18}\\ \\mathrm{J})\\left(\\dfrac{1}{${nf}^2}-\\dfrac{1}{${ni}^2}\\right) = ${J(dE(ni,nf),sf)}`;

M.chapter({
  id:"M2C3", module:"m2", n:3, num:"2.3", date:"2026-09-28", added:"2026-10-26", quiz:"T1",
  title:"Line spectra and the Bohr model", pages:"8-12", sections:["2.3","2.4"],
  summary:"Atoms absorb and emit light only at certain wavelengths, so their energy is quantized. Bohr's model gives the hydrogen levels $E_n = -R_H/n^2$; a jump between levels absorbs or emits one photon with energy $|\\Delta E|$. The model gets the energies right for the wrong reasons.",
  flags:[
    {ref:"p. 10", text:"The notes (and the data sheet) write $\\Delta E = h\\nu = -R_H\\left(\\frac{1}{n_f^2}-\\frac{1}{n_i^2}\\right)$. With this sign, $\\Delta E = E_f - E_i$ is negative for emission, but $h\\nu$ is always positive. So the equals sign only holds for absorption. In general the photon energy is $h\\nu = |\\Delta E|$, which is what the remarks on p. 10 say (photon energy $= E_{\\text{upper}} - E_{\\text{lower}}$)."}
  ],
  formulas:[
    {id:"M2C3.f.bohr-postulate", name:"Bohr's condition: quantized angular momentum", tex:"m v r = n\\left(\\frac{h}{2\\pi}\\right),\\quad n = 1, 2, 3, \\ldots", note:"Imposed by Bohr, not explained. $n = 1$ is the innermost orbit.", ref:"p. 9",
      blank:{tex:"mvr = n\\left(\\frac{h}{\\boxed{\\,?\\,}}\\right)", accept:["2π","2pi","2 pi","2*pi","2π"]}},
    {id:"M2C3.f.energy-levels", name:"Energy levels of the H atom", tex:"E_n = -\\frac{R_H}{n^2}", note:"Negative because $E = 0$ is the electron infinitely far away ($n = \\infty$).", ref:"p. 10",
      blank:{tex:"E_n = -\\frac{R_H}{\\boxed{\\,?\\,}}", accept:["n^2","n2","n²","n*n"]}},
    {id:"M2C3.f.rh", name:"Rydberg constant (energy form)", tex:"R_H = 2.179\\times10^{-18}\\ \\mathrm{J}", kind:"constant", note:"In joules in this course, not m⁻¹.", ref:"p. 10",
      blank:{tex:"R_H = \\boxed{\\,?\\,}\\ \\mathrm{J}", accept:["2.179e-18","2.179x10^-18","2.179×10^-18","2.179 x 10^-18","2.179*10^-18"]}},
    {id:"M2C3.f.a0", name:"Bohr radius", tex:"a_0 = 52.9\\ \\mathrm{pm}", kind:"constant", note:"The radius Bohr found for the $n = 1$ orbit.", ref:"p. 10"},
    {id:"M2C3.f.delta-e", name:"Energy change in a transition", tex:"\\Delta E = E_f - E_i = -R_H\\left(\\frac{1}{n_f^2}-\\frac{1}{n_i^2}\\right)", note:"$n_i$ = initial level, $n_f$ = final level.", ref:"p. 10",
      blank:{tex:"\\Delta E = -R_H\\left(\\frac{1}{\\boxed{\\,?\\,}}-\\frac{1}{n_i^2}\\right)", accept:["n_f^2","nf^2","nf2","n_f²","nf²"]}},
    {id:"M2C3.f.sign", name:"Sign of ΔE", tex:"\\Delta E > 0:\\ \\text{absorbed (up)} \\qquad \\Delta E < 0:\\ \\text{emitted (down)}", kind:"rule", ref:"p. 10"},
    {id:"M2C3.f.photon", name:"Energy of the photon absorbed or emitted", tex:"h\\nu = \\frac{hc}{\\lambda} = |\\Delta E| = E_{\\text{upper}} - E_{\\text{lower}}", note:"The photon's energy is always positive. Then $\\nu = |\\Delta E|/h$ and $\\lambda = hc/|\\Delta E|$.", ref:"p. 10",
      blank:{tex:"\\lambda = \\frac{hc}{\\boxed{\\,?\\,}}", accept:["|ΔE|","|dE|","ΔE","dE","|delta E|","delta E","|∆E|","∆E"]}},
    {id:"M2C3.f.lines", name:"Visible lines of hydrogen", tex:"410.1,\\ 434.0,\\ 486.1,\\ 656.3\\ \\mathrm{nm}", kind:"constant", note:"From $n = 6, 5, 4, 3$ down to $n = 2$.", ref:"p. 8"}
  ],
  glossary:[
    {id:"M2C3.t.continuous", term:"Continuous spectrum", def:"An unbroken rainbow: white light contains every wavelength.", ref:"p. 8"},
    {id:"M2C3.t.absorption", term:"Absorption spectrum", def:"A rainbow with dark lines, made when white light passes through a gas that absorbs certain wavelengths.", ref:"p. 8"},
    {id:"M2C3.t.emission", term:"Emission spectrum", def:"Bright lines on a dark background, from energized atoms giving off light. The lines sit at the same wavelengths as the absorption lines.", ref:"p. 8"},
    {id:"M2C3.t.level", term:"Energy level", def:"One of the allowed energies $E_n$ of the electron, labelled by the whole number $n$.", ref:"p. 10"},
    {id:"M2C3.t.rydberg", term:"Rydberg constant, $R_H$", def:"$2.179\\times10^{-18}$ J. The energy scale of the hydrogen levels: $E_n = -R_H/n^2$.", ref:"p. 10"},
    {id:"M2C3.t.bohr-radius", term:"Bohr radius, $a_0$", def:"52.9 pm, the radius of Bohr's $n = 1$ orbit. Later it turns out to be the most probable distance of a 1s electron from the nucleus.", ref:"p. 10"}
  ],
  figures:{
    bohr:{title:"The Bohr atom", cap:"Bohr's planetary picture (p. 9): the electron moves on circular orbits labelled by $n$, with energies $E_n = -R_H/n^2$ (p. 10). Move the electron between levels to absorb or emit a photon of energy $|\\Delta E|$. Remember the notes' warning (p. 11): the orbits are wrong, even though the energies are right.", ref:"pp. 9-11",
      model:{type:"bohr", params:{n:3, mode:"emit", maxN:6}},
      predict:{q:"The electron drops from $n = 3$ to $n = 2$. In another atom it drops from $n = 4$ to $n = 2$. Which photon has the <b>longer</b> wavelength?", opts:[["The one from $n = 3 \\to 2$",true,"It is the smaller energy gap, so the smaller photon energy and the longer wavelength (656 nm against 486 nm)."],["The one from $n = 4 \\to 2$",false,"A bigger drop means more energy, so a shorter wavelength."],["They have the same wavelength, since both end at $n = 2$",false,"The wavelength depends on the size of the jump, not only where it ends."]], keep:true, check:"Drop the electron from 3 to 2, then from 4 to 2, and compare the wavelengths and colours in the readout."}},
    ladder:{title:"Transitions on the energy ladder", cap:"The hydrogen levels drawn to scale from $E_n = -R_H/n^2$ (p. 10). Pick a starting and a final level. The readout uses the notes' sign: $\\Delta E = E_f - E_i$ is positive when a photon is absorbed and negative when one is emitted. The strip below shows where the line falls; grey ticks are the four lines printed on p. 8. Colours are approximate.", ref:"pp. 8-10",
      build(host,{PLOT,M}){
        let ni=4, nf=2;
        const ctl=PLOT.controls(host);
        const lv=[1,2,3,4,5,6].map(n=>[n,`${n}`]);
        PLOT.seg(ctl,{label:"Initial level n_i",items:lv,value:ni,onchange:v=>{ ni=v; draw(); }});
        PLOT.seg(ctl,{label:"Final level n_f",items:lv,value:nf,onchange:v=>{ nf=v; draw(); }});
        const lab=document.createElement("div"); lab.className="small muted"; lab.textContent="Top row: initial level. Bottom row: final level."; ctl.append(lab);
        const W=600,H=330,top=22,bot=20; const Y=E=>top+(-E)/(RH*1.04)*(H-top-bot);
        const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Energy levels of hydrogen"}); host.append(svg);
        sv("line",{x1:60,x2:60,y1:H-bot,y2:8,class:"ax"},svg);
        const tE=sv("text",{x:66,y:14,class:"lbl"},svg); tE.textContent="Energy";
        sv("line",{x1:100,x2:560,y1:Y(0),y2:Y(0),class:"lt dash"},svg);
        const t0=sv("text",{x:564,y:Y(0)+4,style:"font-size:11px;fill:var(--ink2)"},svg); t0.textContent="n = ∞, E = 0";
        for(let n=1;n<=6;n++){ const y=Y(En(n)); sv("line",{x1:100,x2:560,y1:y,y2:y,style:`stroke:var(--fig-stroke);stroke-width:${n===1?2.2:1.4}`},svg);
          const t=sv("text",{x:n%2||n<3?94:30,y:y+4,"text-anchor":"end",style:"font-size:11px;fill:var(--ink2)"},svg); t.setAttribute("x",n<=3?94:(n%2?94:58)); t.textContent=`n = ${n}`;
          if(n<=4){ const e=sv("text",{x:104,y:y-3,style:"font-size:10px;fill:var(--ink2)"},svg); e.textContent=`${(En(n)/1e-18).toFixed(3)}×10⁻¹⁸ J`; } }
        sv("defs",{},svg).innerHTML=`<marker id="m2c3ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--c,var(--accent))"/></marker>`;
        const arr=sv("line",{x1:330,x2:330,y1:0,y2:0,style:"stroke:var(--c,var(--accent));stroke-width:3","marker-end":"url(#m2c3ah)"},svg);
        const S2=sv("svg",{viewBox:"0 0 600 60",class:"fig",role:"img","aria-label":"Where the line falls in the spectrum"}); host.append(S2);
        const SX=nm=>40+(nm-350)/(800-350)*520;
        const gr=sv("linearGradient",{id:"m2c3vis"},S2); [380,450,500,550,600,650,700,750].forEach((nm,j)=>sv("stop",{offset:`${j/7*100}%`,"stop-color":lamRGB(nm)},gr));
        sv("rect",{x:SX(380),y:8,width:SX(750)-SX(380),height:22,style:"fill:url(#m2c3vis);opacity:.22"},S2);
        sv("rect",{x:SX(350),y:8,width:SX(800)-SX(350),height:22,style:"fill:none;stroke:var(--fig-axis);stroke-width:.6"},S2);
        [410.1,434.0,486.1,656.3].forEach(nm=>sv("line",{x1:SX(nm),x2:SX(nm),y1:8,y2:30,style:"stroke:var(--ink2);stroke-width:1;opacity:.6"},S2));
        [400,500,600,700].forEach(nm=>{ const t=sv("text",{x:SX(nm),y:44,"text-anchor":"middle",style:"font-size:10px;fill:var(--ink2)"},S2); t.textContent=`${nm} nm`; });
        const line=sv("line",{x1:0,x2:0,y1:4,y2:34,style:"stroke-width:4"},S2); const off=sv("text",{x:300,y:58,"text-anchor":"middle",style:"font-size:11px;fill:var(--ink2)"},S2);
        const out=PLOT.readout(host);
        function draw(){
          if(ni===nf){ arr.setAttribute("visibility","hidden"); line.setAttribute("visibility","hidden"); off.textContent=""; out.innerHTML="Pick two different levels."; return; }
          arr.setAttribute("visibility","visible");
          const x=150+(Math.min(ni,nf)-1)*70+(Math.max(ni,nf)-2)*10; arr.setAttribute("x1",x); arr.setAttribute("x2",x); arr.setAttribute("y1",Y(En(ni))); arr.setAttribute("y2",Y(En(nf)));
          const d=dE(ni,nf), lam=HC/Math.abs(d), nm=lam*1e9; const reg=region(lam);
          if(nm>=350&&nm<=800){ line.setAttribute("visibility","visible"); line.setAttribute("x1",SX(nm)); line.setAttribute("x2",SX(nm)); line.style.stroke=reg==="visible"?lamRGB(nm):"var(--fig-stroke)"; off.textContent=""; }
          else { line.setAttribute("visibility","hidden"); off.textContent=nm<350?`${nm.toFixed(1)} nm: off the left end (ultraviolet)`:`${nm.toFixed(0)} nm: off the right end (infrared)`; }
          out.innerHTML=M.rich(`$${dETeX(ni,nf)}$<br>${d>0?"<b>Positive: a photon is absorbed</b> (the electron moves up).":"<b>Negative: a photon is emitted</b> (the electron drops)."} Photon: $|\\Delta E| = ${J(Math.abs(d),4)}$, $\\lambda = hc/|\\Delta E| = ${lamAns(lam).tex}$ (${reg}${reg==="visible"?", "+colourOf(nm):""}).`);
        }
        draw();
      }}
  },
  gens:[
    {id:"M2C3.g.level-energy", title:"Energy of a hydrogen level", skill:"$E_n = -R_H/n^2$", ref:"p. 10",
      gen(R,d){
        if(d===3){ const n=R.int(2,9); const E=sig(En(n),4);
          return {prompt:`An electron in a hydrogen atom has an energy of $${J(E,4)}$. Which level $n$ is it in?`, answer:{type:"int",value:n},
            hint:"Solve $E_n = -R_H/n^2$ for $n$: $n = \\sqrt{R_H/|E|}$.",
            steps:[`$n^2 = \\dfrac{R_H}{|E_n|} = \\dfrac{2.179\\times10^{-18}\\ \\mathrm{J}}{${J(Math.abs(E),4)}} = ${(RH/Math.abs(E)).toFixed(2)}$`,`$n = \\sqrt{${(RH/Math.abs(E)).toFixed(2)}} = ${n}$`], answerTeX:`$n = ${n}$`}; }
        const n=R.int(1,d===1?6:8); const E=En(n);
        if(d===1) return {prompt:`What is the energy of the electron in the $n = ${n}$ level of a hydrogen atom? Give 4 significant figures.`,
          answer:{type:"num",value:E,unit:"J",sf:4}, hint:"$E_n = -R_H/n^2$ with $R_H = 2.179\\times10^{-18}$ J. The answer is negative.",
          steps:[`$E_{${n}} = -\\dfrac{2.179\\times10^{-18}\\ \\mathrm{J}}{${n}^2} = ${J(E,4)}$`,"Negative: the electron is bound. It would take energy to pull it away to $E = 0$."],
          answerTeX:`$${J(E,4)}$`, verify:{value:-2.179e-18/n/n}};
        const Em=E*K.NA/1000;
        return {prompt:`What is the energy of one mole of hydrogen atoms with the electron in the $n = ${n}$ level, in kJ mol⁻¹, to 4 significant figures?`,
          answer:{type:"num",value:Em,unit:"kJ/mol",sf:4}, hint:"$E_n = -R_H/n^2$ per atom, then multiply by $N_A$ and convert J to kJ.",
          steps:[`Per atom: $E_{${n}} = -R_H/${n}^2 = ${J(E,4)}$`,`Per mole: $(${J(E,4)})(6.022\\times10^{23}\\ \\mathrm{mol^{-1}}) = ${M.qty(E*K.NA,4,"J/mol",{sci:true})} = ${M.qty(Em,4,"kJ/mol")}$`],
          answerTeX:`$${M.qty(Em,4,"kJ/mol")}$`, verify:{value:-2.179e-18*6.022e23/1000/(n*n)}};
      }},
    {id:"M2C3.g.transition", title:"Absorbed or emitted, and what wavelength?", skill:"$\\Delta E = -R_H(1/n_f^2 - 1/n_i^2)$, then $\\lambda = hc/|\\Delta E|$", ref:"p. 10",
      gen(R,d){
        let ni, nf;
        if(d===1){ ni=R.int(3,6); nf=2; if(R()<0.3){ [ni,nf]=[nf,ni]; } }
        else { do{ ni=R.int(1,d===2?6:9); nf=R.int(1,d===2?6:9); }while(nf===ni||(d===3&&ni===9&&nf===3)); }
        const D=dE(ni,nf), up=D>0, lam=HC/Math.abs(D), nu=Math.abs(D)/K.h; const L=lamAns(lam);
        const p1={label:"Absorbed or emitted?",answer:{type:"mc",options:["absorbed","emitted"],correct:up?0:1,keep:true}};
        const steps=[`$n_i = ${ni}$, $n_f = ${nf}$.`,`$${dETeX(ni,nf)}$`,up?"$\\Delta E > 0$: the atom gains energy, so a photon is <b>absorbed</b>.":"$\\Delta E < 0$: the atom loses energy, so a photon is <b>emitted</b>.",`Photon energy $= |\\Delta E| = ${J(Math.abs(D),4)}$.`];
        if(d===3){ steps.push(`$\\nu = \\dfrac{|\\Delta E|}{h} = \\dfrac{${J(Math.abs(D),4)}}{6.626\\times10^{-34}\\ \\mathrm{J\\,s}} = ${S(nu,4)}$`);
          return {prompt:`In a hydrogen atom, the electron goes from the $n = ${ni}$ level to the $n = ${nf}$ level. Does the atom absorb or emit a photon? Give $\\Delta E = E_f - E_i$ with its sign, and the photon's frequency, both to 4 significant figures.`,
            parts:[p1,{label:"$\\Delta E = E_f - E_i$",answer:{type:"num",value:D,unit:"J",sf:4}},{label:"Frequency $\\nu$",answer:{type:"num",value:nu,unit:"s^-1",sf:4}}],
            hint:"Use the formula exactly as written, with $n_f$ first. Then $\\nu = |\\Delta E|/h$: a frequency is never negative.", steps,
            answerTeX:`${up?"Absorbed":"Emitted"}; $\\Delta E = ${J(D,4)}$; $\\nu = ${S(nu,4)}$`, verify:{values:[null,En(nf)-En(ni),Math.abs(En(nf)-En(ni))/K.h]}}; }
        steps.push(`$\\lambda = \\dfrac{hc}{|\\Delta E|} = \\dfrac{${HCTeX}}{${J(Math.abs(D),4)}} = ${M.qty(lam,4,"m",{sci:true})} = ${L.tex}$ (${region(lam)}).`);
        const parts=[p1]; if(d===2) parts.push({label:"$\\Delta E = E_f - E_i$",answer:{type:"num",value:D,unit:"J",sf:3}});
        parts.push({label:`Wavelength (${L.unit})`,answer:{type:"num",value:L.value,unit:L.unit,sf:3}});
        return {prompt:`In a hydrogen atom, the electron goes from the $n = ${ni}$ level to the $n = ${nf}$ level. Does the atom absorb or emit a photon?${d===2?" Give $\\Delta E = E_f - E_i$ with its sign.":""} Find the photon's wavelength in ${L.word}.`,
          parts, hint:"$\\Delta E = -R_H(1/n_f^2 - 1/n_i^2)$. Its sign tells you absorbed (+) or emitted (−). For the wavelength use the size of $\\Delta E$.", steps,
          answerTeX:`${up?"Absorbed":"Emitted"}${d===2?`; $\\Delta E = ${J(D)}$`:""}; $\\lambda = ${L.tex}$`,
          verify:{values:d===2?[null,En(nf)-En(ni),L.unit==="nm"?K.h*K.c/Math.abs(En(nf)-En(ni))*1e9:K.h*K.c/Math.abs(En(nf)-En(ni))*1e6]:[null,L.unit==="nm"?K.h*K.c/Math.abs(En(nf)-En(ni))*1e9:K.h*K.c/Math.abs(En(nf)-En(ni))*1e6]}};
      }},
    {id:"M2C3.g.find-n", title:"Find the starting or final level", skill:"Solve $\\Delta E = -R_H(1/n_f^2 - 1/n_i^2)$ for $n$", ref:"p. 10",
      gen(R,d){
        let ni, nf, given, up=false;
        if(d===1){ nf=2; ni=R.pick([3,4,6,7]); }
        else if(d===2){ nf=R.pick([1,2,3]); ni=R.int(nf+1,nf===1?6:7); }
        else { up=true; ni=R.pick([1,2]); nf=R.int(ni+1,ni===1?6:7); }
        const D=dE(ni,nf), E=Math.abs(D);
        let Eu;
        if(d===1){ Eu=sig(E,4); given=`by emitting a photon with an energy of $${J(Eu,4)}$`; }
        else { const lam=sig(HC/E*1e9,4); Eu=HC/(lam*1e-9); given=`${up?"by absorbing":"by emitting"} light of wavelength $${M.qty(lam,4,"nm")}$`; }
        const invNi=1/(nf*nf)-Eu/RH; /* emission: 1/ni^2 = 1/nf^2 - |ΔE|/R_H */
        const invNf=1/(ni*ni)-Eu/RH; /* absorption: 1/nf^2 = 1/ni^2 - |ΔE|/R_H */
        const val=up?invNf:invNi, ans=up?nf:ni;
        const prompt=up?`A hydrogen atom with its electron in $n = ${ni}$ is excited ${given}. Which level does the electron end up in?`:`In a hydrogen atom, the electron falls to the $n = ${nf}$ level ${given}. From which level did it fall?`;
        const steps=d===1?[`Photon energy $= |\\Delta E| = ${J(Eu,4)}$. Emission, so $\\Delta E = -${J(Eu,4)}$.`]:[`$|\\Delta E| = \\dfrac{hc}{\\lambda} = ${J(Eu,4)}$. ${up?"Absorption, so $\\Delta E$ is positive.":"Emission, so $\\Delta E$ is negative."}`];
        steps.push(up?`$+${J(Eu,4)} = -R_H\\left(\\dfrac{1}{n_f^2} - \\dfrac{1}{${ni}^2}\\right)$, so $\\dfrac{1}{n_f^2} = \\dfrac{1}{${ni}^2} - \\dfrac{${J(Eu,4)}}{2.179\\times10^{-18}\\ \\mathrm{J}} = ${val.toFixed(4)}$`
          :`$-${J(Eu,4)} = -R_H\\left(\\dfrac{1}{${nf}^2} - \\dfrac{1}{n_i^2}\\right)$, so $\\dfrac{1}{n_i^2} = \\dfrac{1}{${nf}^2} - \\dfrac{${J(Eu,4)}}{2.179\\times10^{-18}\\ \\mathrm{J}} = ${val.toFixed(4)}$`);
        steps.push(`$${up?"n_f":"n_i"} = \\sqrt{1/${val.toFixed(4)}} = ${(1/Math.sqrt(val)).toFixed(2)} \\approx ${ans}$`);
        return {prompt, answer:{type:"int",value:ans},
          hint:up?"Absorption: $\\Delta E$ is positive. Put the known $n_i$ in and solve for $1/n_f^2$.":"Emission: $\\Delta E$ is negative. Put $n_f$ in and solve for $1/n_i^2$.",
          steps, answerTeX:`$${up?"n_f":"n_i"} = ${ans}$`};
      }},
    {id:"M2C3.g.longest", title:"Longest and shortest wavelengths from a level", skill:"Smallest gap = longest wavelength", ref:"p. 10",
      gen(R,d){
        const n=R.int(d===1?3:4,d===3?7:6);
        if(d===2){ const k=n*(n-1)/2;
          return {prompt:`A sample of hydrogen atoms all start with the electron in $n = ${n}$. As they drop down to $n = 1$, in one jump or several, how many different wavelengths of light can be emitted?`, answer:{type:"int",value:k},
            hint:"Count every pair of levels from 1 to $n$: each pair is one possible jump, so one line.",
            steps:[`Every jump goes from a higher level to a lower one among $n = 1$ to $${n}$.`,`Number of pairs $= \\dfrac{${n}(${n}-1)}{2} = ${k}$.`,`For example from $n = ${n}$: ${Array.from({length:n-1},(_,i)=>`${n}→${n-1-i}`).join(", ")}; then from the lower levels, and so on.`], answerTeX:`${k}`}; }
        const longest=d===3?true:R.pick([true,false]); const nf=longest?n-1:1; const D=dE(n,nf), lam=HC/Math.abs(D), L=lamAns(lam);
        const parts=[]; if(d===3) parts.push({label:"Final level $n_f$",answer:{type:"int",value:nf}});
        parts.push({label:`Wavelength (${L.unit})`,answer:{type:"num",value:L.value,unit:L.unit,sf:3}});
        return {prompt:`An electron in a hydrogen atom is in the $n = ${n}$ level. What is the ${longest?"longest":"shortest"} wavelength of light it can emit in a single jump${d===3?", and which level does it land in":""}? Give the wavelength in ${L.word}.`,
          parts, hint:longest?"Longest wavelength = smallest photon energy = the smallest drop, which is to the level just below.":"Shortest wavelength = largest photon energy = the biggest drop, all the way to $n = 1$.",
          steps:[longest?`The smallest gap below $n = ${n}$ is to $n = ${n-1}$ (the levels get closer together as $n$ grows).`:`The largest drop from $n = ${n}$ is to $n = 1$.`,`$${dETeX(n,nf)}$ (emitted).`,`$\\lambda = \\dfrac{hc}{|\\Delta E|} = ${M.qty(lam,4,"m",{sci:true})} = ${L.tex}$ (${region(lam)}).`],
          answerTeX:`${d===3?`$n_f = ${nf}$, `:""}$\\lambda = ${L.tex}$`};
      }},
    {id:"M2C3.g.ionize", title:"Removing the electron completely", skill:"$n_f = \\infty$, where $E = 0$", ref:"p. 10",
      gen(R,d){
        const n=d===3?R.int(1,3):R.int(1,5); const E=RH/(n*n);
        const steps=[`Removing the electron means going to $n = \\infty$, where $E = 0$ (p. 10).`,`$\\Delta E = E_\\infty - E_{${n}} = 0 - \\left(-\\dfrac{R_H}{${n}^2}\\right) = ${J(E,4)}$ per atom.`];
        if(d===1) return {prompt:`How much energy is needed to remove the electron from a hydrogen atom whose electron is in the $n = ${n}$ level? Give 4 significant figures.`,
          answer:{type:"num",value:E,unit:"J",sf:4}, hint:"The final level is $n = \\infty$, where the energy is 0.", steps, answerTeX:`$${J(E,4)}$`, verify:{value:-dE(n,1e9)}};
        if(d===2){ const Em=E*K.NA/1000; steps.push(`Per mole: $\\times N_A = ${M.qty(E*K.NA,4,"J/mol",{sci:true})} = ${M.qty(Em,4,"kJ/mol")}$`);
          return {prompt:`How much energy, in kJ mol⁻¹, is needed to remove the electrons from one mole of hydrogen atoms that are all in the $n = ${n}$ level? Give 4 significant figures.`,
            answer:{type:"num",value:Em,unit:"kJ/mol",sf:4}, hint:"Find the energy per atom to reach $E = 0$, then multiply by $N_A$ and convert to kJ.", steps, answerTeX:`$${M.qty(Em,4,"kJ/mol")}$`, verify:{value:2.179e-18*6.022e23/1000/(n*n)}}; }
        const lam=HC/E, L=lamAns(lam); steps.push(`The photon must have at least this energy, so the longest wavelength is $\\lambda = \\dfrac{hc}{\\Delta E} = ${M.qty(lam,4,"m",{sci:true})} = ${L.tex}$.`);
        return {prompt:`What is the longest wavelength of light, in ${L.word}, that can remove the electron from a hydrogen atom in the $n = ${n}$ level?`,
          answer:{type:"num",value:L.value,unit:L.unit,sf:3}, hint:"Longest wavelength = smallest photon energy that still does the job: exactly enough to reach $E = 0$.", steps, answerTeX:`$${L.tex}$`, verify:{value:HC*n*n/RH*(L.unit==="nm"?1e9:1e6)}};
      }}
  ],
  exam:[
    {id:"M2C3.q1", ref:"p. 10", q:"Using $\\Delta E = -R_H\\left(\\frac{1}{n_f^2}-\\frac{1}{n_i^2}\\right)$, a student gets $\\Delta E = -4.09\\times10^{-19}$ J for a transition in hydrogen. What does the negative sign tell you?", opts:[
      ["A photon of energy $4.09\\times10^{-19}$ J is emitted.",true,"$\\Delta E = E_f - E_i < 0$: the atom ends lower and gives the energy away as light."],["A photon of energy $4.09\\times10^{-19}$ J is absorbed.",false,"Absorption gives a positive $\\Delta E$."],["The photon has negative energy.",false,"A photon's energy $h\\nu$ is always positive; it equals $|\\Delta E|$."],["The calculation is wrong: $\\Delta E$ cannot be negative.",false,"With this formula, every emission gives a negative $\\Delta E$."],["The electron has left the atom.",false,"That would mean going to $n = \\infty$, which needs energy."]]},
    {id:"M2C3.q2", ref:"p. 10", q:"Which transition in a hydrogen atom <b>emits</b> the photon with the shortest wavelength?", opts:[
      ["$n = 4 \\to n = 3$",false,"A small gap high up the ladder: long wavelength (infrared)."],["$n = 6 \\to n = 2$",false,"$|\\Delta E| = 0.222R_H$, smaller than the $2 \\to 1$ drop."],["$n = 2 \\to n = 1$",true,"$|\\Delta E| = R_H(1 - \\frac14) = 0.75R_H$, the largest here, so the shortest wavelength."],["$n = 3 \\to n = 2$",false,"$|\\Delta E| = 0.139R_H$: this is the red 656 nm line."],["$n = 1 \\to n = 3$",false,"Going up is absorption, not emission."]]},
    {id:"M2C3.q3", ref:"p. 10", q:"A hydrogen atom absorbs one photon, which lifts its electron from $n = 2$ to $n = 4$. What is the frequency of that photon?", opts:[
      ["$6.17\\times10^{14}$ s⁻¹",true,"$\\Delta E = R_H(\\frac14 - \\frac1{16}) = 4.086\\times10^{-19}$ J; $\\nu = \\Delta E/h$."],["$4.86\\times10^{-7}$ s⁻¹",false,"That is the wavelength in metres (486 nm) with a frequency unit."],["$8.22\\times10^{14}$ s⁻¹",false,"This uses $\\frac12 - \\frac14$: the $n$ values were not squared."],["$1.03\\times10^{15}$ s⁻¹",false,"This adds $\\frac14 + \\frac1{16}$ instead of subtracting."],["$-6.17\\times10^{14}$ s⁻¹",false,"Frequencies are never negative."]]},
    {id:"M2C3.q4", ref:"p. 8", q:"Which statement about the spectra of hydrogen is correct?", opts:[
      ["The dark lines in its absorption spectrum sit at the same wavelengths as the bright lines in its emission spectrum.",true,"Both come from jumps between the same levels."],["An emission spectrum is a full rainbow with a few dark lines.",false,"That describes an absorption spectrum."],["Hot hydrogen gas gives off a continuous spectrum.",false,"It gives only a few bright lines."],["Every element has the same set of lines.",false,"Each atom has its own unique set (p. 8)."],["The lines show that an atom's energy can take any value.",false,"They show the opposite: the energy is quantized."]]},
    {id:"M2C3.q5", ref:"p. 10", q:"Why are the energies $E_n = -R_H/n^2$ of the hydrogen levels negative?", opts:[
      ["Zero energy is chosen as the electron infinitely far from the nucleus, and the electron's energy drops as it gets closer.",true,"Every bound level is below that zero."],["The electron has a negative charge.",false,"The sign of the energy is not the sign of the charge."],["$R_H$ is a negative constant.",false,"$R_H = +2.179\\times10^{-18}$ J; the minus sign is in the formula."],["The electron is moving backwards in its orbit.",false,"Direction of motion doesn't enter the energy."],["Only the $n = 1$ level is negative; the others are positive.",false,"All the levels are negative and approach 0 as $n \\to \\infty$."]]},
    {id:"M2C3.q6", ref:"p. 12", multi:true, q:"Which are problems with Bohr's model of the hydrogen atom, according to the notes? Select all that apply.", opts:[
      ["It does not explain why angular momentum and energy are quantized; the conditions were imposed.",true,"Problem (1) on p. 12."],["It could not be extended to atoms other than hydrogen.",true,"Problem (2)."],["It does not explain why the atom does not give off radiation all the time.",true,"Problem (3): a charge moving in a circle should radiate."],["It predicts the wrong wavelengths for the hydrogen lines.",false,"The energies, and so the wavelengths, come out right."],["Its energy formula is different from the one the Schrödinger equation gives.",false,"Schrödinger's theory gives exactly the same $E_n$ (p. 18)."]]},
    {id:"M2C3.q7", ref:"p. 10", q:"A hydrogen atom gives off a 410 nm photon as its electron falls to $n = 2$. From which level did the electron fall?", opts:[
      ["$n = 3$",false,"$3 \\to 2$ gives 656 nm."],["$n = 4$",false,"$4 \\to 2$ gives 486 nm."],["$n = 5$",false,"$5 \\to 2$ gives 434 nm."],["$n = 6$",true,"$1/n_i^2 = \\frac14 - \\frac{hc/\\lambda}{R_H} = 0.0276$, so $n_i = 6.0$."],["$n = 7$",false,"$7 \\to 2$ gives 397 nm."]]},
    {id:"M2C3.q8", ref:"p. 9", q:"What did Bohr assume to get his stable orbits?", opts:[
      ["The electron's angular momentum $mvr$ can only be a whole number times $h/2\\pi$.",true,"$mvr = n(h/2\\pi)$."],["The electron's speed is always the speed of light.",false,"Not part of the model."],["The electron's energy can be any negative number.",false,"His result was the opposite: only $-R_H/n^2$."],["The electron moves in an orbital shaped like a dumbbell.",false,"Bohr used circular orbits; orbitals come later."],["The electron radiates energy continuously as it moves.",false,"Bohr's stable orbits do not radiate, which the model can't explain."]]}
  ],
  steps:[
    {type:"read", title:"Atoms absorb and emit only certain colours", ref:"p. 8", body:"<p>Shine white light through a prism and you get a <b>continuous spectrum</b>: every colour, no gaps. Put hydrogen gas in the way first, and dark lines appear: the gas absorbed a few exact wavelengths. That is an <b>absorption spectrum</b>.</p><p>Now heat the hydrogen (or pass a current through it) and look at the light it gives off. You see only a few bright lines on black: an <b>emission spectrum</b>. The bright lines sit at the same wavelengths as the dark ones.</p><p>Each element has its own set of lines, like a barcode. Astronomers use these barcodes to tell which elements are in a star (an application, not from the notes).</p>"},
    {type:"read", title:"Sharp lines mean the atom's energy is quantized", ref:"pp. 8-9", body:"<p>The photoelectric effect showed that a photon's energy is set by its colour. If an atom only absorbs or emits certain colours, it can only gain or lose certain amounts of energy. So the energy of the electron in an atom is quantized (p. 8).</p><p>The visible lines of hydrogen are at <b>410.1, 434.0, 486.1 and 656.3 nm</b> (violet, blue, blue-green and red). Any model of the atom has to explain these numbers.</p><p>That makes three experiments (p. 9): blackbody radiation (oscillator energies come in quanta), the photoelectric effect (light comes in photons, $E = h\\nu$) and line spectra (electron energies in atoms are restricted to special values).</p>"},
    {type:"read", title:"Bohr's model: quantized orbits and energies", ref:"pp. 9-10", body:"<p>Bohr pictured the electron going around the proton in a circle. He simply assumed that only orbits with angular momentum $mvr = n(h/2\\pi)$ are stable, with $n = 1, 2, 3, \\ldots$ From that he derived the energies:</p><div class=\"box def\"><b class=\"t\">Bohr's energy levels (p. 10)</b>$$E_n = -\\frac{R_H}{n^2} \\qquad R_H = 2.179\\times10^{-18}\\ \\mathrm{J}$$ The radius of the $n = 1$ orbit is $a_0 = 52.9$ pm, the Bohr radius.</div><p>Zero energy means the electron is infinitely far away ($n = \\infty$). Closer in, the electron has less energy, so every level is negative. $E_1 = -2.179\\times10^{-18}$ J is the lowest. As $n$ grows the levels crowd together just below zero, like the rungs of a ladder that get closer toward the top.</p>"},
    {type:"explore", title:"Move the electron between Bohr orbits", fig:"bohr", ref:"pp. 9-11", body:"<p>Move the electron down from a high level and watch the photon leave. Move it up and the atom has to absorb one. Try every drop that ends at $n = 2$: those are the visible lines from p. 8.</p>"},
    {type:"mcq", title:"Bigger drop, bluer light", q:"In hydrogen, which drop gives off the more energetic photon: $n = 2 \\to 1$ or $n = 6 \\to 2$?", opts:[["$n = 2 \\to 1$",true,"$|\\Delta E| = 0.75R_H$ against $0.22R_H$. The first gap is the biggest on the whole ladder."],["$n = 6 \\to 2$",false,"It spans more levels, but those upper levels are close together. The $2 \\to 1$ gap alone is bigger."],["They are the same",false,"The levels are not evenly spaced."]], after:"The $2 \\to 1$ photon is ultraviolet (122 nm). The $6 \\to 2$ photon is violet (410 nm)."},
    {type:"read", title:"Going up absorbs a photon; coming down emits one", ref:"p. 10", body:"<p>When the electron drops from a higher level to a lower one, the atom emits a photon carrying the difference. To go up, the atom must absorb a photon with exactly that difference. For hydrogen the notes write:</p><div class=\"box def\"><b class=\"t\">Transitions (p. 10)</b>$$\\Delta E = E_f - E_i = -R_H\\left(\\frac{1}{n_f^2}-\\frac{1}{n_i^2}\\right)$$ $\\Delta E > 0$: absorbed (up). $\\Delta E < 0$: emitted (down).<br>Photon: $h\\nu = \\dfrac{hc}{\\lambda} = |\\Delta E|$</div><p>Keep the sign when a question asks for $\\Delta E$ (Möbius does). Drop it when you find the photon's frequency or wavelength, because those are always positive. The data sheet prints $\\Delta E = h\\nu$, which is only true as a size.</p>"},
    {type:"example", title:"Absorbed or emitted, and the wavelength", ref:"p. 11 (like Example 2-4)", ex:{q:"The electron in a hydrogen atom moves from $n = 2$ to $n = 4$. Is light absorbed or emitted? What is its wavelength?", steps:[
      {t:"$n_i = 2$, $n_f = 4$",why:"Initial and final levels, in that order."},
      {t:"$\\Delta E = -(2.179\\times10^{-18}\\ \\mathrm{J})\\left(\\dfrac{1}{4^2} - \\dfrac{1}{2^2}\\right) = -(2.179\\times10^{-18})(0.0625 - 0.25) = +4.086\\times10^{-19}\\ \\mathrm{J}$",why:"The bracket is negative, so $\\Delta E$ is positive."},
      {t:"$\\Delta E > 0$: the atom gains energy, so light is <b>absorbed</b>.",why:"Going up always needs a photon."},
      {t:"$\\lambda = \\dfrac{hc}{|\\Delta E|} = \\dfrac{(6.626\\times10^{-34})(2.998\\times10^{8})}{4.086\\times10^{-19}\\ \\mathrm{J}} = 4.862\\times10^{-7}\\ \\mathrm{m} = 486\\ \\mathrm{nm}$",why:"Blue-green. It matches the 486.1 nm line on p. 8: the reverse jump, $4 \\to 2$, emits the same wavelength."}], ans:"Absorbed, $\\lambda = 486$ nm."}},
    {type:"try", title:"Absorbed or emitted?", gen:"M2C3.g.transition"},
    {type:"explore", title:"Read transitions off the ladder", fig:"ladder", ref:"pp. 8-10", body:"<p>The ladder is to scale. Set the final level to 2 and the initial level to 3, 4, 5, 6: you build the four lines on p. 8. Then end at $n = 1$ (all ultraviolet) and at $n = 3$ (all infrared).</p><p>Swap the two levels and watch only the sign of $\\Delta E$ change.</p>"},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the wavelength of light emitted when the electron in hydrogen drops from $n = 5$ to $n = 3$:", lines:["$n_i = 5$ and $n_f = 3$.","$\\Delta E = -R_H\\left(\\frac{1}{3^2} - \\frac{1}{5^2}\\right) = -1.550\\times10^{-19}$ J, so light is emitted.","$\\lambda = \\dfrac{hc}{\\Delta E} = \\dfrac{1.986\\times10^{-25}}{-1.550\\times10^{-19}} = -1.28\\times10^{-6}$ m","So $\\lambda = -1280$ nm, in the infrared."], wrong:2, why:"A wavelength can't be negative. The photon energy is $|\\Delta E|$, so $\\lambda = hc/|\\Delta E| = 1.28\\times10^{-6}$ m = 1280 nm (infrared)."},
    {type:"try", title:"Which level did it start in?", gen:"M2C3.g.find-n"},
    {type:"try", title:"Longest and shortest wavelengths", gen:"M2C3.g.longest"},
    {type:"read", title:"Bohr got the right energies for the wrong reasons", ref:"pp. 11-12", body:"<p>The notes are blunt (p. 11, and again on p. 18): <b>the Bohr model is wrong</b>. The electron does not travel on a fixed circular path. But the energies are right, and the model gave more evidence that energy and angular momentum are quantized.</p><p>Three problems (p. 12):</p><ol><li>It doesn't explain <i>why</i> the angular momentum and energy are quantized. The conditions were imposed.</li><li>It can't be extended to other atoms.</li><li>It doesn't explain why the atom doesn't radiate continuously (a charge going in a circle should).</li></ol><p>Two new ideas fixed this: particles behave like waves (de Broglie), and we can never know an electron's exact path (Heisenberg). That is the next chapter.</p>"},
    {type:"try", title:"Pull the electron off", gen:"M2C3.g.ionize"},
    {type:"try", title:"Energy of a level", gen:"M2C3.g.level-energy"},
    {type:"formulas", title:"Formulas to know"}
  ]
});
})();
