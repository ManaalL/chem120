/* Chapter 2.1 (Fri Sep 25): Light and the electromagnetic spectrum. Course notes Module 2, pp. 1-3 (sections 2.1 and 2.2).
   Quantization as the big idea, light as an electromagnetic wave, wavelength, period and frequency, c = λν, the regions of the spectrum and the visible colours. */
(function(){
const M=C120, K=C120.chem.CONST;
const LOG=Math.log10;
/* regions of the spectrum, by log10(wavelength / m). Boundaries are read from the chart on p. 3, where neighbouring bands overlap;
   gamma/X-ray sits in the middle of the overlap. The microwave/radio band edge is put at about 30 cm so that a microwave oven (12 cm)
   reads as microwaves. Generators only use wavelengths well inside a band (SAFE in M2C1.g.region), so these edges never decide an answer. */
const REG=[
  {k:"gamma", name:"gamma rays", lo:-16, hi:-12},
  {k:"x", name:"X-rays", lo:-12, hi:-9},
  {k:"uv", name:"ultraviolet", lo:-9, hi:LOG(4e-7)},
  {k:"vis", name:"visible", lo:LOG(4e-7), hi:LOG(7.5e-7)},
  {k:"ir", name:"infrared", lo:LOG(7.5e-7), hi:-3},
  {k:"mw", name:"microwaves", lo:-3, hi:-0.5},
  {k:"radio", name:"radio waves", lo:-0.5, hi:4.5}
];
const NAMES=REG.map(r=>r.name);
const regionOf=lam=>{ const g=LOG(lam); return REG.find(r=>g>=r.lo&&g<r.hi)||(g<-12?REG[0]:REG[6]); };
/* visible colours, approximate boundaries read from the colour bar on p. 3 */
const COL=[["violet",400,450],["blue",450,495],["green",495,570],["yellow",570,590],["orange",590,620],["red",620,750]];
const COLNAMES=COL.map(c=>c[0]);
const colourOf=nm=>{ const c=COL.find(([n,a,b])=>nm>=a&&nm<b); return c?c[0]:null; };
/* safe picks well inside each colour band, so rounding never changes the colour */
const COLPICK={violet:[405,438],blue:[455,486],green:[505,560],yellow:[574,586],orange:[596,614],red:[632,720]};
/* approximate display colour of a wavelength (not from the notes) */
function lamRGB(nm){
  let r=0,g=0,b=0;
  if(nm<440){ r=(440-nm)/60; b=1; } else if(nm<490){ g=(nm-440)/50; b=1; } else if(nm<510){ g=1; b=(510-nm)/20; } else if(nm<580){ r=(nm-510)/70; g=1; } else if(nm<645){ r=1; g=(645-nm)/65; } else { r=1; }
  const f=nm<420?0.35+0.65*(nm-380)/40:nm>700?0.35+0.65*(780-nm)/80:1;
  const c=x=>Math.round(255*Math.pow(Math.max(0,Math.min(1,x*f)),0.8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.append(e); return e; }
/* a wavelength in a sensible unit, as TeX */
function lamTeX(lam,sf=3){
  if(lam<1e-12) return M.qty(lam,sf,"m",{sci:true});
  if(lam<1e-9) return M.qty(lam*1e12,sf,"pm");
  if(lam<1e-6) return M.qty(lam*1e9,sf,"nm");
  if(lam<1e-3) return M.qty(lam*1e6,sf,"μm");
  if(lam<1e-2) return M.qty(lam*1e3,sf,"mm");
  if(lam<1) return M.qty(lam*100,sf,"cm");
  if(lam<1e3) return M.qty(lam,sf,"m");
  return M.qty(lam/1e3,sf,"km");
}
const sci=(v,sf=3)=>M.numTeX(v,sf,{sci:true});

M.chapter({
  id:"M2C1", module:"m2", n:1, num:"2.1", date:"2026-09-25", added:"2026-10-26", quiz:"T1",
  title:"Light and the electromagnetic spectrum", pages:"1-3", sections:["2.1","2.2"],
  summary:"Light is a travelling wave of electric and magnetic fields. Its wavelength and frequency are tied together by $\\lambda\\nu = c$, and the spectrum is sorted by wavelength, from gamma rays (short, high energy) to radio waves (long, low energy).",
  flags:[],
  formulas:[
    {id:"M2C1.f.wave-eq", name:"Wavelength-frequency relationship", tex:"\\lambda\\nu = c", note:"$\\lambda$ in m, $\\nu$ in s⁻¹ (Hz), $c$ = speed of light. So $\\lambda = c/\\nu$ and $\\nu = c/\\lambda$.", ref:"p. 2",
      blank:{tex:"\\lambda\\nu = \\boxed{\\,?\\,}", accept:["c","speed of light","2.998e8","2.998x10^8"]}},
    {id:"M2C1.f.freq-period", name:"Frequency from the period", tex:"\\nu = \\frac{1}{T}", note:"$T$ is the time for the field to return to its maximum, in seconds.", ref:"p. 2",
      blank:{tex:"\\nu = \\frac{1}{\\boxed{\\,?\\,}}", accept:["T","period"]}},
    {id:"M2C1.f.c", name:"Speed of light", tex:"c = 2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}", kind:"constant", ref:"p. 2",
      blank:{tex:"c = \\boxed{\\,?\\,}\\ \\mathrm{m\\,s^{-1}}", accept:["2.998e8","2.998x10^8","2.998×10^8","2.998*10^8","2.998 x 10^8"]}},
    {id:"M2C1.f.hz", name:"Hertz", tex:"1\\ \\mathrm{Hz} = 1\\ \\mathrm{s^{-1}}", kind:"constant", ref:"p. 2"},
    {id:"M2C1.f.nm", name:"Nanometre", tex:"1\\ \\mathrm{nm} = 10^{-9}\\ \\mathrm{m}", kind:"constant", ref:"p. 3",
      blank:{tex:"1\\ \\mathrm{nm} = \\boxed{\\,?\\,}\\ \\mathrm{m}", accept:["10^-9","1e-9","10^(-9)","1x10^-9","1×10^-9","10-9"]}},
    {id:"M2C1.f.visible", name:"Visible range", tex:"\\lambda \\approx 400\\text{ to }750\\ \\mathrm{nm}", kind:"rule", note:"Violet at the short end, red at the long end.", ref:"p. 3"},
    {id:"M2C1.f.order", name:"Order of the regions (increasing wavelength)", tex:"\\gamma\\text{ rays} < \\text{X-rays} < \\text{UV} < \\text{visible} < \\text{IR} < \\text{microwaves} < \\text{radio}", kind:"rule", note:"Frequency and photon energy increase in the opposite direction.", ref:"p. 3"}
  ],
  glossary:[
    {id:"M2C1.t.quantization", term:"Quantization", def:"An electron held in a small region by the forces on it can only have certain energies, not any value in between.", ref:"p. 1"},
    {id:"M2C1.t.em-radiation", term:"Electromagnetic radiation", def:"Light: an electric field and a magnetic field oscillating at the same frequency, at right angles to each other, carrying energy through space.", ref:"p. 1"},
    {id:"M2C1.t.wavelength", term:"Wavelength, $\\lambda$", def:"The distance between neighbouring maxima of the wave, in metres.", ref:"p. 2"},
    {id:"M2C1.t.period", term:"Period, $T$", def:"The time it takes the field at one point to return to its maximum, in seconds.", ref:"p. 2"},
    {id:"M2C1.t.frequency", term:"Frequency, $\\nu$", def:"How many times per second the field at one point reaches its maximum. $\\nu = 1/T$, in s⁻¹ or Hz.", ref:"p. 2"},
    {id:"M2C1.t.visible", term:"Visible region", def:"The narrow band of wavelengths our eyes detect, about 400 nm (violet) to 750 nm (red).", ref:"p. 3"}
  ],
  figures:{
    wave:{title:"An electromagnetic wave", cap:"The electric field and the magnetic field oscillate at the same frequency, at right angles to each other and to the direction of travel (p. 1). Change the wavelength and the frequency changes with it, because $\\lambda\\nu = c$ (p. 2). The photon energy shown in the readout comes in the next chapter.", ref:"pp. 1-3",
      model:{type:"emwave", params:{lambda:700}},
      predict:{q:"You shorten the wavelength from 700 nm (red) to 400 nm (violet). What happens to the frequency?", opts:[["It goes up, by a factor of 700/400 = 1.75",true,"$\\nu = c/\\lambda$: a shorter wavelength means more crests pass each second."],["It goes down by the same factor",false,"That would make $\\lambda\\nu$ smaller, but it must stay equal to $c$."],["It stays the same: only the colour changes",false,"Colour is set by wavelength, and wavelength and frequency always change together."]], keep:true, check:"Drag the wavelength slider from 700 nm to 400 nm and watch the frequency readout."}},
    spectrum:{title:"The electromagnetic spectrum", cap:"Slide along the spectrum on a log scale (each tick is a factor of 100). The readout gives the frequency from $\\nu = c/\\lambda$ and the region. In the chart on p. 3 neighbouring regions overlap, so the boundaries here are approximate. In the visible band the colour names follow the colour bar on p. 3; the displayed colours are approximate.", ref:"pp. 2-3",
      build(host,{PLOT,M}){
        let g=LOG(5.5e-7);
        const ctl=PLOT.controls(host);
        const W=600,H=170,x0=-16,x1=4.5,L=20,Rr=W-12; const X=v=>L+(v-x0)/(x1-x0)*(Rr-L);
        const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Electromagnetic spectrum on a log scale"}); host.append(svg);
        REG.forEach((r,i)=>{ const a=X(Math.max(r.lo,x0)), b=X(Math.min(r.hi,x1));
          const rect=sv("rect",{x:a,y:28,width:b-a,height:34,style:`fill:var(--c);fill-opacity:${i%2?0.10:0.22};stroke:var(--fig-axis);stroke-width:.6`},svg);
          if(r.k==="vis"){ const gr=sv("linearGradient",{id:"m2c1vis"},svg); [400,450,500,550,600,650,700,750].forEach((nm,j)=>sv("stop",{offset:`${j/7*100}%`,"stop-color":lamRGB(nm)},gr)); rect.setAttribute("style","fill:url(#m2c1vis);stroke:var(--fig-axis);stroke-width:.6"); }
          if(r.k!=="vis"){ const t=sv("text",{x:(a+b)/2,y:i%2?12:23,"text-anchor":"middle",class:"lbl",style:"font-size:11px"},svg); t.textContent=r.name.replace("ultraviolet","UV").replace("infrared","IR"); } });
        sv("line",{x1:L,x2:Rr,y1:62,y2:62,class:"ax"},svg);
        for(let v=-16;v<=4;v+=2){ sv("line",{x1:X(v),x2:X(v),y1:62,y2:67,class:"ax"},svg); const t=sv("text",{x:X(v),y:80,"text-anchor":"middle",style:"font-size:10px;fill:var(--ink2)"},svg); t.textContent=`10${String(v).replace("-","⁻").replace(/\d/g,d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[d])}`; }
        const tl=sv("text",{x:Rr,y:96,"text-anchor":"end",style:"font-size:10px;fill:var(--ink2)"},svg); tl.textContent="wavelength λ / m  →  longer, lower energy";
        const tr=sv("text",{x:L,y:96,style:"font-size:10px;fill:var(--ink2)"},svg); tr.textContent="← higher frequency, higher energy";
        /* enlarged visible bar */
        const vb0=150,vb1=W-150; const VX=nm=>vb0+(nm-400)/350*(vb1-vb0);
        sv("rect",{x:vb0,y:116,width:vb1-vb0,height:18,style:"fill:url(#m2c1vis);stroke:var(--fig-axis);stroke-width:.6"},svg);
        [400,450,500,550,600,650,700,750].forEach(nm=>{ const t=sv("text",{x:VX(nm),y:148,"text-anchor":"middle",style:"font-size:10px;fill:var(--ink2)"},svg); t.textContent=nm; });
        const vt=sv("text",{x:vb1+6,y:129,style:"font-size:10px;fill:var(--ink2)"},svg); vt.textContent="nm (visible)";
        sv("line",{x1:X(LOG(4e-7)),y1:62,x2:vb0,y2:116,class:"lt dash"},svg); sv("line",{x1:X(LOG(7.5e-7)),y1:62,x2:vb1,y2:116,class:"lt dash"},svg);
        const mk=sv("path",{d:"",style:"fill:var(--fig-stroke)"},svg); const mk2=sv("line",{x1:0,x2:0,y1:26,y2:64,style:"stroke:var(--fig-stroke);stroke-width:2"},svg);
        const vm=sv("path",{d:"",style:"fill:var(--fig-stroke)"},svg);
        const out=PLOT.readout(host);
        PLOT.slider(ctl,{label:"Wavelength (log scale)",min:-15,max:4,step:0.02,value:g,fmt:v=>M.rich(`$${lamTeX(Math.pow(10,v))}$`),oninput:v=>{ g=v; draw(); }});
        function draw(){
          const lam=Math.pow(10,g), nu=K.c/lam, r=regionOf(lam), x=X(g);
          mk.setAttribute("d",`M${x} 62 l-6 10 h12 z`); mk2.setAttribute("x1",x); mk2.setAttribute("x2",x);
          const nm=lam*1e9; const vis=r.k==="vis";
          vm.setAttribute("d",vis?`M${VX(nm)} 114 l-6 -9 h12 z`:"");
          out.innerHTML=M.rich(`$\\lambda = ${lamTeX(lam)}$ &nbsp; $\\nu = c/\\lambda = ${M.qty(nu,3,"s^-1",{sci:true})}$ &nbsp; <b>${r.name}</b>${vis?` (${colourOf(nm)||"edge of visible"})`:""}`);
        }
        draw();
      }}
  },
  gens:[
    {id:"M2C1.g.lambda-from-nu", title:"Wavelength from frequency", skill:"Use $\\lambda = c/\\nu$ and convert units", ref:"p. 2",
      gen(R,d){
        let nu, lam, unit, word, nuTeX;
        if(d===1){ const want=R.int(405,720)*1e-9; nu=R.sig(K.c/want*0.999,K.c/want*1.001,3); nuTeX=M.qty(nu,3,"Hz",{sci:true}); unit="nm"; word="nanometres"; }
        else if(d===2){ const reg=R.pick([[1.2e-8,3.5e-7],[1.5e-6,2e-4],[2e-11,8e-10]]); const want=Math.pow(10,R.real(LOG(reg[0]),LOG(reg[1]),3)); nu=R.sig(K.c/want,K.c/want*1.0001,3); nuTeX=M.qty(nu,3,"s^-1",{sci:true}); unit=(K.c/nu<1e-6)?R.pick(["nm","m"]):"m"; word=unit==="nm"?"nanometres":"metres"; }
        else { const mhz=R.pick([true,false]); if(mhz){ const v=R.sig(88,108,3); nu=v*1e6; nuTeX=M.qty(v,3,"MHz"); unit="m"; word="metres"; } else { const v=R.sig(1.0,9.5,3); nu=v*1e9; nuTeX=M.qty(v,3,"GHz"); unit="cm"; word="centimetres"; } }
        lam=K.c/nu; const scale={nm:1e9,m:1,cm:100}[unit]; const val=lam*scale;
        const T=1/nu;
        const conv=d===3?(unit==="m"?`$\\nu = ${nuTeX} = ${M.qty(nu,3,"s^-1",{sci:true})}$ (1 MHz = $10^{6}$ Hz).`:`$\\nu = ${nuTeX} = ${M.qty(nu,3,"s^-1",{sci:true})}$ (1 GHz = $10^{9}$ Hz).`):`$\\nu = ${M.qty(nu,3,"s^-1",{sci:true})}$ (1 Hz = 1 s⁻¹).`;
        return {prompt:`What is the wavelength, in ${word}, of electromagnetic radiation with a frequency of $${nuTeX}$?`,
          answer:{type:"num", value:val, unit, sf:3},
          hint:"Rearrange $\\lambda\\nu = c$ to $\\lambda = c/\\nu$. Work in m and s⁻¹, then convert.",
          steps:[conv,`$\\lambda = \\dfrac{c}{\\nu} = \\dfrac{2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}}{${M.qty(nu,3,"s^-1",{sci:true})}} = ${M.qty(lam,4,"m",{sci:true})}$`,
            unit==="m"?`Already in metres: $\\lambda = ${M.qty(val,3,"m")}$.`:unit==="nm"?`$1\\ \\mathrm{nm} = 10^{-9}\\ \\mathrm{m}$, so $\\lambda = ${M.qty(val,3,"nm")}$.`:`$1\\ \\mathrm{cm} = 10^{-2}\\ \\mathrm{m}$, so $\\lambda = ${M.qty(val,3,"cm")}$.`,
            `Region: ${regionOf(lam).name}.`],
          answerTeX:`$${M.qty(val,3,unit)}$`,
          verify:{value:K.c*T*scale}};
      }},
    {id:"M2C1.g.nu-from-lambda", title:"Frequency from wavelength", skill:"Use $\\nu = c/\\lambda$ (and $T = 1/\\nu$)", ref:"p. 2",
      gen(R,d){
        let lam, lamShow;
        if(d===1){ const nm=R.int(405,725); lam=nm*1e-9; lamShow=M.qty(nm,3,"nm"); }
        else { const pick=R.pick(d===2?["um","cm","mm"]:["um","cm","pm"]);
          if(pick==="um"){ const v=R.sig(1.5,85,3); lam=v*1e-6; lamShow=M.qty(v,3,"μm"); }
          else if(pick==="cm"){ const v=R.sig(1.2,35,3); lam=v*1e-2; lamShow=M.qty(v,3,"cm"); }
          else if(pick==="mm"){ const v=R.sig(1.2,9.5,3); lam=v*1e-3; lamShow=M.qty(v,3,"mm"); }
          else { const v=R.sig(12,95,3); lam=v*1e-12; lamShow=M.qty(v,3,"pm"); } }
        const nu=K.c/lam, T=1/nu;
        const steps=[`Convert to metres: $\\lambda = ${lamShow} = ${M.qty(lam,3,"m",{sci:true})}$.`,`$\\nu = \\dfrac{c}{\\lambda} = \\dfrac{2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}}{${M.qty(lam,3,"m",{sci:true})}} = ${M.qty(nu,3,"s^-1",{sci:true})}$`];
        const nuA={type:"num", value:nu, unit:"s^-1", sf:3};
        if(d===3){ steps.push(`$T = \\dfrac{1}{\\nu} = ${M.qty(T,3,"s",{sci:true})}$`);
          return {prompt:`Radiation has a wavelength of $${lamShow}$. What are its frequency and its period?`,
            parts:[{label:"Frequency $\\nu$",answer:nuA},{label:"Period $T$",answer:{type:"num",value:T,unit:"s",sf:3}}],
            hint:"$\\nu = c/\\lambda$ with $\\lambda$ in metres, then $T = 1/\\nu$.", steps,
            answerTeX:`$\\nu = ${M.qty(nu,3,"s^-1",{sci:true})}$, $T = ${M.qty(T,3,"s",{sci:true})}$`,
            verify:{values:[K.c/lam, lam/K.c]}}; }
        return {prompt:`What is the frequency of light with a wavelength of $${lamShow}$?`, answer:nuA,
          hint:"Convert the wavelength to metres first, then $\\nu = c/\\lambda$.", steps,
          answerTeX:`$${M.qty(nu,3,"s^-1",{sci:true})}$`, verify:{value:1/(lam/K.c)}};
      }},
    {id:"M2C1.g.region", title:"Name the region of the spectrum", skill:"Place a wavelength or frequency on the spectrum", ref:"p. 3",
      gen(R,d){
        const SAFE={gamma:[-15,-13.3],x:[-10.7,-9.2],uv:[-7.9,-6.5],vis:[LOG(4.2e-7),LOG(7.3e-7)],ir:[-5.8,-3.8],mw:[-2.9,-2.1],radio:[0.3,3.3]};
        const r=R.pick(REG); const g=R.real(SAFE[r.k][0],SAFE[r.k][1],3); const lam=+M.toSig(Math.pow(10,g),3);
        let given;
        if(d===1) given=`a wavelength of $${M.qty(lam,3,"m",{sci:true})}$`;
        else if(d===2) given=`a wavelength of $${lamTeX(lam)}$`;
        else given=`a frequency of $${M.qty(K.c/lam,3,"s^-1",{sci:true})}$`;
        const steps=d===3?[`$\\lambda = c/\\nu = ${M.qty(lam,3,"m",{sci:true})}$.`]:[`In metres, $\\lambda = ${M.qty(lam,3,"m",{sci:true})}$.`];
        steps.push(`On the chart on p. 3 this sits in the ${r.name} band (order by wavelength: gamma, X-ray, UV, visible, IR, microwave, radio).`);
        return {prompt:`Electromagnetic radiation has ${given}. Which region of the spectrum is it in?`,
          answer:{type:"mc", options:NAMES, correct:REG.indexOf(r), keep:true},
          hint:d===3?"First find the wavelength with $\\lambda = c/\\nu$.":"Write the wavelength in metres and compare its power of ten with the chart on p. 3. Visible is 400 to 750 nm.",
          steps, answerTeX:r.name};
      }},
    {id:"M2C1.g.order", title:"Compare regions of the spectrum", skill:"Wavelength, frequency and energy order", ref:"p. 3",
      gen(R,d){
        const prop=d===1?"longer wavelength":d===2?R.pick(["higher frequency","shorter wavelength"]):R.pick(["higher frequency","more energy per photon","longer wavelength","lower frequency"]);
        const k=d===3?3:2; const idx=R.shuffle([0,1,2,3,4,5,6]).slice(0,k);
        const wantLong=/longer|lower/.test(prop);
        const best=wantLong?Math.max(...idx):Math.min(...idx);
        const SUP={"longer wavelength":"the longest wavelength","shorter wavelength":"the shortest wavelength","higher frequency":"the highest frequency","lower frequency":"the lowest frequency","more energy per photon":"the most energy per photon"};
        return {prompt:`Which of these has ${k===2?(prop.startsWith("more")?prop:"the "+prop):SUP[prop]}?`,
          answer:{type:"mc", options:idx.map(i=>NAMES[i]), correct:idx.indexOf(best)},
          hint:"Order by wavelength: gamma rays (shortest), X-rays, ultraviolet, visible, infrared, microwaves, radio waves (longest). Frequency and photon energy go the other way.",
          steps:[`From shortest to longest wavelength: ${idx.slice().sort((a,b)=>a-b).map(i=>NAMES[i]).join(", ")}.`, wantLong?`The ${prop} belongs to the one furthest toward radio waves.`:`Shorter wavelength means higher frequency and more energy per photon (p. 3), so pick the one furthest toward gamma rays.`, `Answer: ${NAMES[best]}.`],
          answerTeX:NAMES[best]};
      }},
    {id:"M2C1.g.colour", title:"Wavelength and colour of visible light", skill:"$\\lambda = c/\\nu$, then read the colour", ref:"pp. 2-3",
      gen(R,d){
        const col=R.pick(COLNAMES); const [a,b]=COLPICK[col]; const want=R.int(a,b)*1e-9;
        const nu=+M.toSig(K.c/want,d===3?4:3); const lam=K.c/nu, nm=lam*1e9; const c=colourOf(nm);
        return {prompt:`Light has a frequency of $${M.qty(nu,d===3?4:3,"Hz",{sci:true})}$. What is its wavelength in nanometres, and what colour is it?`,
          parts:[{label:"Wavelength",answer:{type:"num",value:nm,unit:"nm",sf:3}},{label:"Colour",answer:{type:"mc",options:COLNAMES,correct:COLNAMES.indexOf(c),keep:true}}],
          hint:"$\\lambda = c/\\nu$, then convert metres to nm ($1\\ \\mathrm{nm} = 10^{-9}\\ \\mathrm{m}$) and read the colour bar on p. 3.",
          steps:[`$\\lambda = \\dfrac{2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}}{${M.qty(nu,4,"s^-1",{sci:true})}} = ${M.qty(lam,4,"m",{sci:true})} = ${M.qty(nm,3,"nm")}$`,`On the colour bar (p. 3), roughly: violet near 400, blue near 450 to 490, green near 500 to 570, yellow near 570 to 590, orange near 600, red from about 620 to 750 nm. (The bar has no sharp edges; these ranges are approximate.)`,`$${M.qty(nm,3,"nm")}$ is ${c}.`],
          answerTeX:`$${M.qty(nm,3,"nm")}$, ${c}`, verify:{values:[K.c*1e9/nu,null]}};
      }}
  ],
  exam:[
    {id:"M2C1.q1", ref:"p. 3", q:"Which statement about the electromagnetic spectrum is <b>false</b>?", opts:[
      ["Microwaves have longer wavelengths than visible light.",false,"True: microwaves sit on the long-wavelength side of visible."],
      ["A gamma-ray photon carries more energy than a radio-wave photon.",false,"True: shorter wavelength, higher energy (p. 3)."],
      ["Infrared light has a higher frequency than green light.",true,"False: infrared has a longer wavelength than visible light, so it has the lower frequency."],
      ["X-rays have shorter wavelengths than ultraviolet light.",false,"True: X-rays are next to gamma rays at the short end."],
      ["In a vacuum, radio waves and X-rays travel at the same speed.",false,"True: every kind of light travels at $c$."]]},
    {id:"M2C1.q2", ref:"p. 2", q:"The frequency of a light wave is tripled. What happens to its wavelength?", opts:[
      ["It is tripled.",false,"That would make $\\lambda\\nu = 9c$."],["It is divided by 3.",true,"$\\lambda = c/\\nu$: three times the frequency, one third the wavelength."],["It does not change.",false,"$\\lambda$ and $\\nu$ always change together, since their product is fixed at $c$."],["It is multiplied by 9.",false,"There is no square in $\\lambda\\nu = c$."],["It is divided by 9.",false,"There is no square in $\\lambda\\nu = c$."]]},
    {id:"M2C1.q3", ref:"p. 2", q:"A radio station broadcasts at 99.9 MHz. What is the wavelength of its signal?", opts:[
      ["3.00 m",true,"$\\lambda = (2.998\\times10^{8})/(9.99\\times10^{7}\\ \\mathrm{s^{-1}}) = 3.00\\ \\mathrm{m}$."],["$3.00\\times10^{6}$ m",false,"This uses 99.9 Hz: the M (mega, $10^{6}$) was dropped."],["$3.00\\times10^{3}$ m",false,"This treats MHz as kHz ($10^{3}$)."],["0.333 m",false,"This is $\\nu/c$, the reciprocal of the right answer."],["$3.00\\times10^{16}$ m",false,"This multiplies $c$ by $\\nu$ instead of dividing."]]},
    {id:"M2C1.q4", ref:"pp. 2-3", q:"What colour is light with a frequency of $6.50\\times10^{14}$ Hz?", opts:[
      ["violet",false,"Violet is near 400 nm, which needs about $7.5\\times10^{14}$ Hz."],["blue",true,"$\\lambda = c/\\nu = 461$ nm: blue on the colour bar on p. 3."],["green",false,"Green is near 500 to 570 nm."],["yellow",false,"Yellow is near 570 to 590 nm."],["red",false,"Red is 620 nm and longer, which is a lower frequency."]]},
    {id:"M2C1.q5", ref:"p. 2", q:"At one point in space, the electric field of a light wave reaches its maximum every $2.00\\times10^{-15}$ s. What is the wavelength?", opts:[
      ["600 nm",true,"$\\nu = 1/T = 5.00\\times10^{14}\\ \\mathrm{s^{-1}}$, so $\\lambda = c/\\nu = 6.00\\times10^{-7}$ m = 600 nm."],["60.0 nm",false,"A power of ten was lost converting m to nm."],["6.00 nm",false,"Two powers of ten were lost."],["$1.50\\times10^{23}$ m",false,"This is $c/T$; it should be $cT$ (because $\\nu = 1/T$)."],["$6.67\\times10^{-24}$ m",false,"This is $T/c$."]]},
    {id:"M2C1.q6", ref:"p. 3", q:"Which list is in order from <b>longest</b> to <b>shortest</b> wavelength?", opts:[
      ["radio waves, microwaves, infrared",true,"Moving from the long end of the spectrum toward visible."],["X-rays, ultraviolet, visible",false,"This goes from shortest to longest."],["visible, infrared, ultraviolet",false,"Infrared is longer than visible, and UV is shorter."],["infrared, visible, microwaves",false,"Microwaves are longer than infrared."],["gamma rays, radio waves, X-rays",false,"Gamma rays are the shortest of all."]]},
    {id:"M2C1.q7", ref:"p. 1", q:"What is the key idea of quantum theory stated in the box on p. 1?", opts:[
      ["An electron held in a small region of space can only have certain special energies.",true,"This is quantization."],["An electron can have any energy, as long as it stays near the nucleus.",false,"That is the classical picture the box contradicts."],["Light always behaves as a wave.",false,"Later chapters show light also behaves as particles."],["Newton's laws describe electrons in atoms exactly.",false,"The notes say these laws do not hold at the atomic level."],["The energy of light depends on its brightness.",false,"Photon energy depends on frequency, not brightness (next chapter)."]]}
  ],
  steps:[
    {type:"read", title:"Electrons in atoms can only have certain energies", ref:"p. 1", body:"<p>The whole module builds toward one surprising fact (p. 1): when an electron is held in a small region of space, like an atom, its energy can only take certain special values. This is called <b>quantization</b>.</p><p>Think of a ramp and a staircase. On a ramp you can stand at any height. On a staircase you can only stand on a step. Everyday objects behave like they are on a ramp. Electrons in atoms are on a staircase.</p><p>Classical physics (Newton's laws) has no staircase, so it fails for atoms. The evidence for the steps came from experiments where light meets matter. So first we need the basic facts about light.</p>"},
    {type:"read", title:"Light is an oscillating electric and magnetic field", ref:"p. 1", body:"<p>Light is <b>electromagnetic radiation</b>: it carries energy through space. It has an electric field that oscillates at some frequency, and a magnetic field that oscillates at the same frequency, at right angles to the electric field. Both are at right angles to the direction the light travels.</p><p>Light is made whenever charges accelerate. In a light bulb, the atoms of the hot filament vibrate back and forth, and those moving charges send out the waves.</p>"},
    {type:"explore", title:"Watch the two fields travel together", fig:"wave", ref:"pp. 1-3", body:"<p>Rotate the wave. The electric field goes up and down in one plane, the magnetic field goes side to side in the plane at right angles, and their crests line up.</p><p>Slide the wavelength from red to violet. The crests crowd together and the frequency readout climbs.</p>"},
    {type:"read", title:"Wavelength, period and frequency are linked by c", ref:"p. 2", body:"<p>Freeze the wave at one instant: the distance from one crest to the next is the <b>wavelength</b> $\\lambda$ (in m). Instead, watch one point in space: the time between crests is the <b>period</b> $T$ (in s), and the number of crests per second is the <b>frequency</b> $\\nu$.</p><div class=\"box def\"><b class=\"t\">The relationships (p. 2)</b>$$\\nu = \\frac{1}{T} \\qquad \\lambda\\nu = c \\qquad c = 2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}$$ The unit of frequency is s⁻¹, also called the hertz: 1 Hz = 1 s⁻¹.</div><p>Picture waves passing a dock. If each wave is 2 m long and 3 pass every second, the waves move 6 m each second. For light that speed is always $c$, so a short wavelength must come with a high frequency.</p><p>Always put $\\lambda$ in metres before using $c$. 1 nm = $10^{-9}$ m (p. 3).</p>"},
    {type:"mcq", title:"Wavelength and frequency move in opposite directions", q:"Light A has twice the wavelength of light B. How do their frequencies compare?", opts:[["A has half the frequency of B.",true,"$\\nu = c/\\lambda$, and $c$ is the same for both."],["A has twice the frequency of B.",false,"That would double $\\lambda\\nu$, but it must equal $c$ for both."],["They have the same frequency.",false,"Different wavelengths in a vacuum always mean different frequencies."]], after:"Speed is the one thing that never changes: every kind of light travels at $c$ in a vacuum."},
    {type:"example", title:"Find the wavelength and colour from a frequency", ref:"p. 2 (like Example 2-1)", ex:{q:"What is the wavelength, in nm, of light with a frequency of $6.38\\times10^{14}$ Hz? What colour is it?", steps:[
      {t:"$\\lambda = \\dfrac{c}{\\nu}$",why:"Rearrange $\\lambda\\nu = c$ (p. 2)."},
      {t:"$\\lambda = \\dfrac{2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}}{6.38\\times10^{14}\\ \\mathrm{s^{-1}}} = 4.699\\times10^{-7}\\ \\mathrm{m}$",why:"Hz is s⁻¹, so the seconds cancel and metres are left."},
      {t:"$4.699\\times10^{-7}\\ \\mathrm{m}\\times\\dfrac{1\\ \\mathrm{nm}}{10^{-9}\\ \\mathrm{m}} = 470.\\ \\mathrm{nm}$",why:"Three significant figures, like the frequency."},
      {t:"470 nm lies between 450 and 495 nm on the colour bar on p. 3: blue.",why:"Visible light runs from about 400 nm (violet) to 750 nm (red)."}], ans:"$\\lambda = 470.\\ \\mathrm{nm}$, blue light."}},
    {type:"try", title:"Wavelength from frequency", gen:"M2C1.g.lambda-from-nu"},
    {type:"read", title:"The spectrum is sorted by wavelength", ref:"p. 3", body:"<p>All light is the same kind of wave. The regions of the <b>electromagnetic spectrum</b> differ only in wavelength. From longest to shortest:</p><p style=\"text-align:center\"><b>radio waves → microwaves → infrared → visible → ultraviolet → X-rays → gamma rays</b></p><p>Frequency rises in the same direction, and so does the energy the light carries: the shorter the wavelength, the higher the energy. That is why X-rays and gamma rays can damage tissue and radio waves can't.</p><p>Visible light is a thin slice, about 400 nm (violet) to 750 nm (red). Know the order of the regions and the visible range by heart.</p>"},
    {type:"explore", title:"Slide across the whole spectrum", fig:"spectrum", ref:"pp. 2-3", body:"<p>The scale is logarithmic: each tick is 100 times the one before, so the whole spectrum fits on one line. Find where the visible band sits and notice how tiny it is.</p><p>Set the wavelength to about 12 cm (a microwave oven) and to about 0.1 nm (an X-ray). Compare the frequencies.</p>"},
    {type:"try", title:"Which region is it?", gen:"M2C1.g.region"},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the wavelength of the 2.45 GHz microwaves used in a microwave oven:", lines:["$\\lambda = c/\\nu$","$\\nu = 2.45\\ \\mathrm{GHz} = 2.45\\times10^{6}\\ \\mathrm{s^{-1}}$","$\\lambda = (2.998\\times10^{8})/(2.45\\times10^{6}) = 122\\ \\mathrm{m}$","So the wavelength is 122 m, in the radio region."], wrong:1, why:"Giga means $10^{9}$, not $10^{6}$. So $\\nu = 2.45\\times10^{9}\\ \\mathrm{s^{-1}}$ and $\\lambda = 0.122$ m = 12.2 cm, a microwave."},
    {type:"try", title:"Wavelength and colour", gen:"M2C1.g.colour"},
    {type:"try", title:"Frequency from wavelength", gen:"M2C1.g.nu-from-lambda"},
    {type:"try", title:"Compare regions", gen:"M2C1.g.order"},
    {type:"formulas", title:"Formulas and facts to know"}
  ]
});
})();
