/* Chapter 2.2 (Mon Sep 28): Blackbody radiation and the photoelectric effect. Course notes Module 2, pp. 4-7 (section 2.3, parts i and ii).
   Planck's quanta (E_osc = nhν), h, photon energy E = hν = hc/λ, per mole of photons, the photoelectric observations,
   Einstein's E_photon = w + KE, work function and threshold. The photoelectric relation is NOT on the data sheet. */
(function(){
const M=C120, K=C120.chem.CONST;
const HC=K.h*K.c;
/* work functions in J. Calcium is from the notes (p. 7); the others are standard values (not from the notes). */
const METALS=[
  {sym:"Cs", name:"cesium", w:3.43e-19},
  {sym:"K", name:"potassium", w:3.67e-19},
  {sym:"Na", name:"sodium", w:3.78e-19},
  {sym:"Ca", name:"calcium", w:4.60e-19, notes:true},
  {sym:"Mg", name:"magnesium", w:5.86e-19},
  {sym:"Zn", name:"zinc", w:6.94e-19}
];
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.append(e); return e; }
function lamRGB(nm){
  let r=0,g=0,b=0;
  if(nm<440){ r=(440-nm)/60; b=1; } else if(nm<490){ g=(nm-440)/50; b=1; } else if(nm<510){ g=1; b=(510-nm)/20; } else if(nm<580){ r=(nm-510)/70; g=1; } else if(nm<645){ r=1; g=(645-nm)/65; } else { r=1; }
  const f=nm<420?0.35+0.65*(nm-380)/40:nm>700?0.35+0.65*(780-nm)/80:1;
  const c=x=>Math.round(255*Math.pow(Math.max(0,Math.min(1,x*f)),0.8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
const J=(v,sf=3)=>M.qty(v,sf,"J",{sci:true});
const S=(v,sf=3)=>M.qty(v,sf,"s^-1",{sci:true});
const HCTeX="(6.626\\times10^{-34}\\ \\mathrm{J\\,s})(2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}})";
/* Planck's law as printed on p. 5 (not examinable): I = (8πhc/λ⁵)/(e^{hc/λkT} − 1). k = 1.3806e-23 J/K (p. 5). */
const KB=1.3806e-23;
const planck=(lam,T)=>8*Math.PI*HC/Math.pow(lam,5)/(Math.exp(HC/(lam*KB*T))-1);
const rj=(lam,T)=>8*Math.PI*KB*T/Math.pow(lam,4);

M.chapter({
  id:"M2C2", module:"m2", n:2, num:"2.2", date:"2026-09-28", added:"2026-10-26", quiz:"T1",
  title:"Blackbody radiation and the photoelectric effect", pages:"4-7", sections:["2.3"],
  summary:"Planck explained the glow of hot objects by letting oscillating atoms have only whole numbers of energy quanta, $E_{\\text{osc}} = nh\\nu$. Einstein used the same $h$ to explain the photoelectric effect: light comes in photons of energy $E = h\\nu$, and a photon frees an electron only if $h\\nu$ is at least the work function $w$.",
  flags:[
    {ref:"p. 4", text:"The notes say classical theory could not explain why \"a maximum wavelength was observed in the intensity profile\". What the curves show is a maximum <i>intensity</i>: each curve peaks at one wavelength and falls back toward zero on both sides. Classical theory predicts intensity rising without limit as the wavelength gets shorter, with no peak at all."}
  ],
  formulas:[
    {id:"M2C2.f.planck-osc", name:"Planck's allowed oscillator energies", tex:"E_{\\text{osc}} = nh\\nu,\\quad n = 0, 1, 2, \\ldots", note:"So the energy can be $0$, $h\\nu$, $2h\\nu$, ... and nothing in between. This was the first suggestion that energy is quantized.", ref:"p. 4",
      blank:{tex:"E_{\\text{osc}} = n\\,\\boxed{\\,?\\,}\\,\\nu", accept:["h","planck's constant"]}},
    {id:"M2C2.f.h", name:"Planck's constant", tex:"h = 6.626\\times10^{-34}\\ \\mathrm{J\\,s}", kind:"constant", ref:"p. 5",
      blank:{tex:"h = \\boxed{\\,?\\,}\\ \\mathrm{J\\,s}", accept:["6.626e-34","6.626x10^-34","6.626×10^-34","6.626 x 10^-34","6.626*10^-34"]}},
    {id:"M2C2.f.photon", name:"Energy of one photon", tex:"E_{\\text{photon}} = h\\nu", ref:"p. 6",
      blank:{tex:"E_{\\text{photon}} = \\boxed{\\,?\\,}", accept:["hν","hv","h nu","h*nu","hnu","h·ν","h*v"]}},
    {id:"M2C2.f.photon-lambda", name:"Photon energy from wavelength", tex:"E = \\frac{hc}{\\lambda}", note:"From $E = h\\nu$ and $\\nu = c/\\lambda$ (the \"For you to try\" on p. 5). Shorter wavelength, more energy.", ref:"p. 5",
      blank:{tex:"E = \\frac{hc}{\\boxed{\\,?\\,}}", accept:["λ","lambda","wavelength"]}},
    {id:"M2C2.f.per-mole", name:"Energy of one mole of photons", tex:"E_{\\text{mol}} = N_A\\,E_{\\text{photon}}", note:"$N_A = 6.022\\times10^{23}\\ \\mathrm{mol^{-1}}$ (p. 5). Usually given in kJ mol⁻¹, as in Example 2-2.", ref:"p. 7",
      blank:{tex:"E_{\\text{mol}} = \\boxed{\\,?\\,}\\,E_{\\text{photon}}", accept:["NA","N_A","avogadro's number","6.022e23","N A"]}},
    {id:"M2C2.f.photoelectric", name:"Photoelectric equation (energy conservation)", tex:"E_{\\text{photon}} = w + (KE)_{e^-}", note:"So $(KE)_{e^-} = h\\nu - w$. <b>Not on the data sheet</b>: memorise it.", ref:"p. 6",
      blank:{tex:"(KE)_{e^-} = h\\nu - \\boxed{\\,?\\,}", accept:["w","work function","phi","φ","Φ"]}},
    {id:"M2C2.f.work-function", name:"Work function and threshold", tex:"w = h\\nu_0 = \\frac{hc}{\\lambda_0}", note:"$w$ is the minimum energy needed to remove an electron from the surface. $\\nu_0$ is the threshold frequency, $\\lambda_0$ the threshold wavelength (the longest that still works).", ref:"p. 6",
      blank:{tex:"w = h\\,\\boxed{\\,?\\,}", accept:["ν0","v0","nu0","ν_0","nu_0","v_0"]}},
    {id:"M2C2.f.ke", name:"Kinetic energy of the ejected electron", tex:"(KE)_{e^-} = \\tfrac12 m_e v^2", ref:"p. 6",
      blank:{tex:"(KE)_{e^-} = \\tfrac12\\,m_e\\,\\boxed{\\,?\\,}", accept:["v^2","v2","v²"]}},
    {id:"M2C2.f.me", name:"Electron mass", tex:"m_e = 9.109\\times10^{-31}\\ \\mathrm{kg}", kind:"constant", ref:"p. 7"},
    {id:"M2C2.f.slope", name:"Slope of the KE vs frequency graph", tex:"\\text{slope of } (KE)_{e^-} \\text{ vs } \\nu = h", kind:"rule", note:"The line starts at $\\nu_0$ on the axis; below $\\nu_0$ no electrons come out.", ref:"p. 6"}
  ],
  glossary:[
    {id:"M2C2.t.blackbody", term:"Blackbody radiation", def:"The light given off by a heated solid. Its intensity peaks at one wavelength that depends on the temperature, not on what the solid is made of.", ref:"p. 4"},
    {id:"M2C2.t.quantum", term:"Quantum", def:"The smallest allowed amount of energy at a given frequency, $h\\nu$. Energy changes come in whole numbers of quanta.", ref:"pp. 4-5"},
    {id:"M2C2.t.planck-constant", term:"Planck's constant, $h$", def:"$6.626\\times10^{-34}$ J s. The number that links the energy of a quantum to its frequency.", ref:"p. 5"},
    {id:"M2C2.t.photon", term:"Photon", def:"A particle-like bundle of light with energy $h\\nu$. Einstein's explanation of the photoelectric effect.", ref:"p. 6"},
    {id:"M2C2.t.photoelectric", term:"Photoelectric effect", def:"Light shining on a metal knocks electrons out of its surface, but only if the light's frequency is above a threshold.", ref:"p. 5"},
    {id:"M2C2.t.work-function", term:"Work function, $w$", def:"The minimum energy needed to remove an electron from the surface of a metal.", ref:"p. 6"},
    {id:"M2C2.t.threshold", term:"Threshold frequency $\\nu_0$ and wavelength $\\lambda_0$", def:"The lowest frequency (longest wavelength) of light that can eject electrons: $h\\nu_0 = hc/\\lambda_0 = w$.", ref:"p. 6"}
  ],
  figures:{
    blackbody:{title:"Blackbody curves: Planck against classical theory", cap:"Intensity of light from a hot solid at each wavelength, from Planck's formula on p. 5 (you don't need to use it). Faint dashed curves are 3000, 4000 and 5000 K, as in the graph on p. 4. The steep grey curve is the classical prediction (the Rayleigh-Jeans law; its formula is not from the notes). Intensities are relative: the 5000 K peak is set to 1.", ref:"pp. 4-5",
      build(host,{PLOT,M}){
        let T=5000; const ctl=PLOT.controls(host);
        let ref=0; for(let i=1;i<=600;i++){ ref=Math.max(ref,planck(i*0.005e-6,5000)); }
        const f=Tk=>x=>x<=0.02?0:planck(x*1e-6,Tk)/ref;
        const G=PLOT.graph(host,{x:[0,3],y:[0,2.6],w:560,h:300,xlabel:"λ / μm",ylabel:"relative intensity",label:"Blackbody intensity against wavelength",xstep:0.5,ystep:0.5});
        const vb=sv("rect",{x:G.X(0.40),y:G.pad.t,width:G.X(0.75)-G.X(0.40),height:G.H-G.pad.t-G.pad.b,style:"fill:url(#m2c2vis);opacity:.35"},G.layer.back);
        const gr=sv("linearGradient",{id:"m2c2vis"},G.svg); [400,450,500,550,600,650,700,750].forEach((nm,j)=>sv("stop",{offset:`${j/7*100}%`,"stop-color":lamRGB(nm)},gr));
        G.label(0.12,2.45,"UV",{cls:"lblc"}); G.label(0.46,2.45,"visible",{cls:"lblc"}); G.label(1.3,2.45,"infrared",{cls:"lblc"});
        [3000,4000,5000].forEach(t=>G.fn(f(t),{cls:"lt dash"}));
        const cl=G.fn(x=>x<=0.05?NaN:rj(x*1e-6,T)/ref,{cls:"cv",color:"var(--ink2)",dash:"6 4"});
        const cv=G.fn(f(T),{cls:"cv c",width:2.6});
        const pk=G.dot(1,0,{filled:true}); const pl=G.label(1,0,"",{cls:"lblc",dx:8,dy:-6});
        const out=PLOT.readout(host);
        PLOT.slider(ctl,{label:"Temperature",min:2500,max:6000,step:100,value:T,fmt:v=>`${v} K`,oninput:v=>{ T=v; draw(); }});
        function draw(){
          cv.update(f(T)); cl.update(x=>x<=0.05?NaN:rj(x*1e-6,T)/ref);
          let best=0,bx=0; for(let i=1;i<=3000;i++){ const x=i*0.001, y=f(T)(x); if(y>best){ best=y; bx=x; } }
          pk.set(bx,best); pl.set(bx,best,`peak ${Math.round(bx*1000)} nm`);
          const where=bx<0.40?"ultraviolet":bx<0.75?"visible":"infrared";
          out.innerHTML=M.rich(`<b>${T} K</b>: the peak is at about ${Math.round(bx*1000)} nm (${where}). Hotter means a taller peak at a shorter wavelength. The classical curve has no peak: it keeps rising as $\\lambda$ shrinks.`);
        }
        draw();
      }},
    photo:{title:"Photoelectric effect simulator", cap:"Pick a metal, a wavelength and a brightness. Each photon carries $E = hc/\\lambda$ (p. 5). If $E \\ge w$ an electron leaves with $KE = E - w$ (p. 6). The graph is $KE_{\\max}$ against frequency: flat at zero up to $\\nu_0$, then a straight line of slope $h$. The calcium work function is from p. 7; the other work functions are standard values (not from the notes). One electron per absorbed photon is a simplification.", ref:"pp. 5-7",
      build(host,{PLOT,M}){
        let mi=3, nm=400, I=60;
        const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Metal",items:METALS.map((m,i)=>[i,m.sym]),value:mi,onchange:v=>{ mi=v; setMetal(); draw(); }});
        PLOT.slider(ctl,{label:"Wavelength",min:150,max:750,step:1,value:nm,fmt:v=>`${v} nm`,oninput:v=>{ nm=v; draw(); }});
        PLOT.slider(ctl,{label:"Brightness (intensity)",min:0,max:100,step:20,value:I,fmt:v=>`${v}%`,oninput:v=>{ I=v; draw(); }});
        const W=600,H=170; const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Light hitting a metal surface"}); host.append(svg);
        sv("rect",{x:150,y:120,width:300,height:40,rx:3,style:"fill:var(--fig-soft);stroke:var(--fig-stroke);stroke-width:1.2"},svg);
        const mlab=sv("text",{x:300,y:145,"text-anchor":"middle",class:"lbl"},svg);
        const gPh=sv("g",{},svg), gEl=sv("g",{},svg);
        const lamLab=sv("text",{x:20,y:20,class:"lblc"},svg);
        const G=PLOT.graph(host,{x:[0,21],y:[-0.8,10.5],w:560,h:250,xlabel:"ν / 10¹⁴ s⁻¹",ylabel:"KE max / 10⁻¹⁹ J",label:"Maximum kinetic energy against frequency",xstep:2,ystep:2});
        const ke=nu0=>x=>x<nu0?0:0.6626*(x-nu0);
        const curve=G.fn(ke(5),{cls:"cv c"});
        const th=G.dot(5,0,{r:4}); const thl=G.label(5,0,"ν₀",{cls:"lblc",dx:-4,dy:16});
        const cur=G.dot(5,0,{filled:true,r:5.5});
        const out=PLOT.readout(host);
        function setMetal(){ const m=METALS[mi]; const nu0=m.w/K.h/1e14; curve.update(ke(nu0)); th.set(nu0,0); thl.set(nu0,0); mlab.textContent=`${m.name} metal, w = ${(m.w/1e-19).toFixed(2)}×10⁻¹⁹ J${m.notes?" (p. 7)":""}`; }
        function wavy(x0,y0,x1,y1,col){ const n=60, dx=x1-x0, dy=y1-y0, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L; let d=""; for(let i=0;i<=n;i++){ const t=i/n, a=Math.sin(t*Math.PI*2*6)*5; const x=x0+dx*t-uy*a, y=y0+dy*t+ux*a; d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)+" "; } sv("path",{d,style:`fill:none;stroke:${col};stroke-width:2`},gPh); sv("path",{d:`M${x1} ${y1} l${(-ux*9+uy*5).toFixed(1)} ${(-uy*9-ux*5).toFixed(1)} l${(-uy*10).toFixed(1)} ${(ux*10).toFixed(1)} z`,style:`fill:${col}`},gPh); }
        function draw(){
          const m=METALS[mi], lam=nm*1e-9, E=HC/lam, kE=E-m.w, nu=K.c/lam/1e14;
          const col=nm>=380&&nm<=750?lamRGB(nm):"var(--ink2)";
          lamLab.textContent=`${nm} nm${nm<400?" (ultraviolet)":""}`;
          gPh.innerHTML=""; gEl.innerHTML="";
          const nPh=Math.round(I/20);
          for(let i=0;i<nPh;i++) wavy(40+i*34,28,190+i*46,116,col);
          const vmax=Math.sqrt(2*(HC/150e-9-METALS[0].w)/K.me);
          if(kE>=0) for(let i=0;i<nPh;i++){ const v=Math.sqrt(2*kE/K.me), len=14+110*v/vmax; const x0=230+i*46, y0=118; const x1=x0+len*0.8, y1=y0-len*0.75; sv("line",{x1:x0,y1:y0,x2:x1,y2:y1,style:"stroke:var(--fig-stroke);stroke-width:1.6"},gEl); sv("circle",{cx:x1,cy:y1,r:5,style:"fill:var(--paper);stroke:var(--fig-stroke);stroke-width:1.5"},gEl); const t=sv("text",{x:x1+7,y:y1-4,style:"font-size:10px;fill:var(--ink2)"},gEl); t.textContent="e⁻"; }
          cur.set(Math.min(21,nu),Math.max(0,kE/1e-19));
          let txt=`Photon: $E = hc/\\lambda = ${J(E)}$. Metal: $w = ${J(m.w)}$, so $\\lambda_0 = hc/w = ${Math.round(HC/m.w*1e9)}\\ \\mathrm{nm}$.<br>`;
          if(kE>=0){ const v=Math.sqrt(2*kE/K.me); txt+=`$KE_{\\max} = E - w = ${J(kE)}$, so $v = \\sqrt{2KE/m_e} = ${M.qty(v,3,"m/s",{sci:true})}$.`+(I?" Brighter light sends more photons, so more electrons, but each one's maximum KE stays the same.":" No light, no electrons."); }
          else txt+=`<b>No electrons</b>: $E < w$ for every photon, so even the brightest light of this colour ejects nothing.`;
          out.innerHTML=M.rich(txt);
        }
        setMetal(); draw();
      }}
  },
  gens:[
    {id:"M2C2.g.photon-energy", title:"Energy of a photon and of a mole of photons", skill:"$E = hc/\\lambda$, then $\\times N_A$", ref:"pp. 5-7",
      gen(R,d){
        if(d===3){
          const nmW=R.int(125,950); const Em=+M.toSig(K.NA*HC/(nmW*1e-9)/1000,3); const Ep=Em*1000/K.NA; const lam=HC/Ep, nm=lam*1e9;
          return {prompt:`One mole of photons of a certain light carries $${M.qty(Em,3,"kJ/mol")}$. Find the wavelength of the light in nanometres.`,
            answer:{type:"num",value:nm,unit:"nm",sf:3},
            hint:"Get the energy of one photon first: kJ to J, then divide by $N_A$. Then $\\lambda = hc/E$.",
            steps:[`$E_{\\text{mol}} = ${M.qty(Em,3,"kJ/mol")} = ${M.qty(Em*1000,3,"J/mol",{sci:true})}$`,`$E_{\\text{photon}} = \\dfrac{${M.qty(Em*1000,3,"J/mol",{sci:true})}}{6.022\\times10^{23}\\ \\mathrm{mol^{-1}}} = ${J(Ep,4)}$`,`$\\lambda = \\dfrac{hc}{E} = \\dfrac{${HCTeX}}{${J(Ep,4)}} = ${M.qty(lam,4,"m",{sci:true})}$`,`$\\lambda = ${M.qty(nm,3,"nm")}$`],
            answerTeX:`$${M.qty(nm,3,"nm")}$`, verify:{value:K.NA*K.h*K.c/(Em*1000)*1e9}};
        }
        let lam, show;
        if(d===1){ const v=R.int(200,700); lam=v*1e-9; show=M.qty(v,3,"nm"); }
        else { const u=R.pick(["cm","um","nm"]); if(u==="cm"){ const v=R.sig(1.5,30,3); lam=v*1e-2; show=M.qty(v,3,"cm"); } else if(u==="um"){ const v=R.sig(1.5,80,3); lam=v*1e-6; show=M.qty(v,3,"μm"); } else { const v=R.int(125,390); lam=v*1e-9; show=M.qty(v,3,"nm"); } }
        const E=HC/lam, Em=E*K.NA/1000;
        const steps=[`$\\lambda = ${show} = ${M.qty(lam,3,"m",{sci:true})}$`,`$E = \\dfrac{hc}{\\lambda} = \\dfrac{${HCTeX}}{${M.qty(lam,3,"m",{sci:true})}} = ${J(E,4)}$ per photon`];
        if(d===1) return {prompt:`What is the energy, in joules, of one photon of light with a wavelength of $${show}$?`,
          answer:{type:"num",value:E,unit:"J",sf:3}, hint:"$E = hc/\\lambda$ with $\\lambda$ in metres.", steps,
          answerTeX:`$${J(E)}$`, verify:{value:K.h*(K.c/lam)}};
        steps.push(`One mole: $E_{\\text{mol}} = N_A E = (6.022\\times10^{23}\\ \\mathrm{mol^{-1}})(${J(E,4)}) = ${M.qty(E*K.NA,4,"J/mol",{sci:true})} = ${M.qty(Em,3,"kJ/mol",{sci:true})}$`);
        return {prompt:`Radiation has a wavelength of $${show}$. What is the energy of one photon, and of one mole of these photons?`,
          parts:[{label:"One photon",answer:{type:"num",value:E,unit:"J",sf:3}},{label:"One mole of photons",answer:{type:"num",value:Em,unit:"kJ/mol",sf:3}}],
          hint:"Photon: $E = hc/\\lambda$ (metres!). Mole: multiply by $N_A$, then J to kJ.", steps,
          answerTeX:`$${J(E)}$ per photon, $${M.qty(Em,3,"kJ/mol",{sci:true})}$`, verify:{values:[K.h*(K.c/lam),K.h*(K.c/lam)*K.NA/1000]}};
      }},
    {id:"M2C2.g.threshold", title:"Work function and threshold", skill:"$w = h\\nu_0 = hc/\\lambda_0$", ref:"p. 6",
      gen(R,d){
        if(d===1){ const w=R.sig(2.9,8.5,3)*1e-19; const lam0=HC/w;
          return {prompt:`A metal has a work function of $${J(w)}$. What is the longest wavelength of light, in nm, that can still eject electrons from it?`,
            answer:{type:"num",value:lam0*1e9,unit:"nm",sf:3}, hint:"The threshold photon has exactly $E = w$, so $\\lambda_0 = hc/w$.",
            steps:[`At threshold, $\\dfrac{hc}{\\lambda_0} = w$, so $\\lambda_0 = \\dfrac{hc}{w}$.`,`$\\lambda_0 = \\dfrac{${HCTeX}}{${J(w)}} = ${M.qty(lam0,4,"m",{sci:true})}$`,`$\\lambda_0 = ${M.qty(lam0*1e9,3,"nm")}$. Longer wavelengths eject nothing.`],
            answerTeX:`$${M.qty(lam0*1e9,3,"nm")}$`, verify:{value:K.c/(w/K.h)*1e9}}; }
        if(d===2){ const nm=R.int(220,680); const lam0=nm*1e-9; const w=HC/lam0, nu0=K.c/lam0;
          return {prompt:`A metal surface has a threshold wavelength of $${M.qty(nm,3,"nm")}$. What are its work function and its threshold frequency?`,
            parts:[{label:"Work function $w$",answer:{type:"num",value:w,unit:"J",sf:3}},{label:"Threshold frequency $\\nu_0$",answer:{type:"num",value:nu0,unit:"s^-1",sf:3}}],
            hint:"$w = hc/\\lambda_0$ and $\\nu_0 = c/\\lambda_0$ (or $w/h$).",
            steps:[`$w = \\dfrac{hc}{\\lambda_0} = \\dfrac{${HCTeX}}{${M.qty(lam0,3,"m",{sci:true})}} = ${J(w)}$`,`$\\nu_0 = \\dfrac{w}{h} = ${S(nu0)}$ (the same as $c/\\lambda_0$).`],
            answerTeX:`$w = ${J(w)}$, $\\nu_0 = ${S(nu0)}$`, verify:{values:[K.h*nu0,(HC/lam0)/K.h]}}; }
        const nu0=R.sig(4.6,13,3)*1e14; const w=K.h*nu0, lam0=K.c/nu0;
        return {prompt:`Electrons are ejected from a metal only when the light's frequency is above $${S(nu0)}$. What are the threshold wavelength, in nm, and the work function, in J?`,
          parts:[{label:"Threshold wavelength $\\lambda_0$",answer:{type:"num",value:lam0*1e9,unit:"nm",sf:3}},{label:"Work function $w$",answer:{type:"num",value:w,unit:"J",sf:3}}],
          hint:"$\\lambda_0 = c/\\nu_0$ and $w = h\\nu_0$.",
          steps:[`$\\lambda_0 = \\dfrac{c}{\\nu_0} = \\dfrac{2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}}}{${S(nu0)}} = ${M.qty(lam0,4,"m",{sci:true})} = ${M.qty(lam0*1e9,3,"nm")}$`,`$w = h\\nu_0 = (6.626\\times10^{-34}\\ \\mathrm{J\\,s})(${S(nu0)}) = ${J(w)}$`],
          answerTeX:`$\\lambda_0 = ${M.qty(lam0*1e9,3,"nm")}$, $w = ${J(w)}$`, verify:{values:[HC/w*1e9,HC/lam0]}};
      }},
    {id:"M2C2.g.max-ke", title:"Maximum kinetic energy of an ejected electron", skill:"$(KE)_{e^-} = h\\nu - w$", ref:"p. 6",
      gen(R,d){
        if(d===3){ const nm=R.int(180,400); const lam=nm*1e-9, E=HC/lam; const ke=+M.toSig(R.real(0.25,0.6,3)*E,3); const w=E-ke, lam0=HC/w;
          return {prompt:`Light of wavelength $${M.qty(nm,3,"nm")}$ ejects electrons from a metal with a maximum kinetic energy of $${J(ke)}$. What are the work function of the metal and its threshold wavelength?`,
            parts:[{label:"Work function $w$",answer:{type:"num",value:w,unit:"J",sf:3}},{label:"Threshold wavelength $\\lambda_0$",answer:{type:"num",value:lam0*1e9,unit:"nm",sf:3}}],
            hint:"Rearrange $E_{\\text{photon}} = w + KE$ to $w = E_{\\text{photon}} - KE$. Then $\\lambda_0 = hc/w$.",
            steps:[`$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = ${J(E,4)}$`,`$w = E_{\\text{photon}} - KE = ${J(E,4)} - ${J(ke)} = ${J(w)}$`,`$\\lambda_0 = \\dfrac{hc}{w} = ${M.qty(lam0,4,"m",{sci:true})} = ${M.qty(lam0*1e9,3,"nm")}$`],
            answerTeX:`$w = ${J(w)}$, $\\lambda_0 = ${M.qty(lam0*1e9,3,"nm")}$`, verify:{values:[K.h*K.c/lam-ke,K.h*K.c/(K.h*K.c/lam-ke)*1e9]}}; }
        let w, lam0, given;
        if(d===1){ w=R.sig(3.0,6.5,3)*1e-19; lam0=HC/w; given=`A metal has a work function of $${J(w)}$.`; }
        else { const n0=R.int(300,650); lam0=n0*1e-9; w=HC/lam0; given=`A metal has a threshold wavelength of $${M.qty(n0,3,"nm")}$.`; }
        const nm=R.int(150,Math.floor(0.8*lam0*1e9)); const lam=nm*1e-9, E=HC/lam, ke=E-w;
        const st=d===1?[`$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = \\dfrac{${HCTeX}}{${M.qty(lam,3,"m",{sci:true})}} = ${J(E,4)}$`,`$(KE)_{e^-} = E_{\\text{photon}} - w = ${J(E,4)} - ${J(w)} = ${J(ke)}$`]
          :[`$w = \\dfrac{hc}{\\lambda_0} = ${J(w,4)}$`,`$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = ${J(E,4)}$`,`$(KE)_{e^-} = E_{\\text{photon}} - w = ${J(ke)}$ (in one line: $hc\\left(\\frac{1}{\\lambda}-\\frac{1}{\\lambda_0}\\right)$).`];
        return {prompt:`${given} It is lit with $${M.qty(nm,3,"nm")}$ light. Find the largest kinetic energy an ejected electron can have.`,
          answer:{type:"num",value:ke,unit:"J",sf:3},
          hint:"$(KE)_{e^-} = E_{\\text{photon}} - w$, with $E_{\\text{photon}} = hc/\\lambda$." +(d===2?" Get $w$ from $hc/\\lambda_0$.":""),
          steps:st, answerTeX:`$${J(ke)}$`, verify:{value:HC*(1/lam-1/lam0)}};
      }},
    {id:"M2C2.g.speed", title:"Speed of an ejected electron", skill:"$KE = h\\nu - w$, then $v = \\sqrt{2KE/m_e}$", ref:"pp. 6-7",
      gen(R,d){
        if(d===3){ const w=R.sig(3.2,5.5,3)*1e-19; const v=R.sig(3.0,9.5,3)*1e5; const ke=0.5*K.me*v*v; const E=w+ke, lam=HC/E;
          return {prompt:`Electrons leave a metal surface ($w = ${J(w)}$) with a maximum speed of $${M.qty(v,3,"m/s",{sci:true})}$. What wavelength of light, in nm, was used? ($m_e = 9.109\\times10^{-31}$ kg)`,
            answer:{type:"num",value:lam*1e9,unit:"nm",sf:3}, hint:"Work backwards: $KE = \\frac12 m_e v^2$, then $E_{\\text{photon}} = w + KE$, then $\\lambda = hc/E$.",
            steps:[`$KE = \\tfrac12 m_e v^2 = \\tfrac12(9.109\\times10^{-31}\\ \\mathrm{kg})(${M.qty(v,3,"m/s",{sci:true})})^2 = ${J(ke,4)}$`,`$E_{\\text{photon}} = w + KE = ${J(w)} + ${J(ke,4)} = ${J(E,4)}$`,`$\\lambda = \\dfrac{hc}{E} = ${M.qty(lam,4,"m",{sci:true})} = ${M.qty(lam*1e9,3,"nm")}$`],
            answerTeX:`$${M.qty(lam*1e9,3,"nm")}$`, verify:{value:K.h*K.c/(w+K.me*v*v/2)*1e9}}; }
        let w, lam0, given;
        if(d===1){ w=R.sig(3.0,5.5,3)*1e-19; lam0=HC/w; given=`A metal has a work function of $${J(w)}$.`; }
        else { const n0=R.int(320,640); lam0=n0*1e-9; w=HC/lam0; given=`The threshold wavelength of a metal is $${M.qty(n0,3,"nm")}$.`; }
        const nm=R.int(160,Math.floor(0.8*lam0*1e9)); const lam=nm*1e-9, E=HC/lam, ke=E-w, v=Math.sqrt(2*ke/K.me);
        return {prompt:`${given} Light of wavelength $${M.qty(nm,3,"nm")}$ shines on it. What is the maximum speed of the ejected electrons? ($m_e = 9.109\\times10^{-31}$ kg)`,
          answer:{type:"num",value:v,unit:"m/s",sf:3},
          hint:"Three steps: $E = hc/\\lambda$, $KE = E - w$, then solve $KE = \\frac12 m_e v^2$ for $v$.",
          steps:[...(d===2?[`$w = hc/\\lambda_0 = ${J(w,4)}$`]:[]),`$E_{\\text{photon}} = hc/\\lambda = ${J(E,4)}$`,`$KE = E - w = ${J(ke,4)}$`,`$v = \\sqrt{\\dfrac{2KE}{m_e}} = \\sqrt{\\dfrac{2(${J(ke,4)})}{9.109\\times10^{-31}\\ \\mathrm{kg}}} = ${M.qty(v,3,"m/s",{sci:true})}$`,"Units: J/kg = m²/s², so the square root is in m/s."],
          answerTeX:`$${M.qty(v,3,"m/s",{sci:true})}$`, verify:{value:Math.sqrt(2*HC*(1/lam-1/lam0)/K.me)}};
      }},
    {id:"M2C2.g.ejected", title:"Will electrons be ejected?", skill:"Compare $h\\nu$ with $w$; intensity vs frequency", ref:"p. 6",
      gen(R,d){
        const okLam=(lam,list)=>list.every(m=>Math.abs(HC/lam-m.w)/m.w>0.07);
        if(d===3){ let list, nm, guard=0; do{ list=R.shuffle(METALS).slice(0,4); nm=R.int(200,620); guard++; } while(guard<200 && !(okLam(nm*1e-9,list) && list.some(m=>HC/(nm*1e-9)>m.w) && list.some(m=>HC/(nm*1e-9)<m.w)));
          const E=HC/(nm*1e-9); const corr=list.map((m,i)=>E>m.w?i:-1).filter(i=>i>=0);
          return {prompt:`Light of wavelength $${M.qty(nm,3,"nm")}$ shines on four clean metal surfaces. Which of them eject electrons? Select all that apply. (Work functions are standard values, not from the notes, except calcium.)`,
            answer:{type:"multi",options:list.map(m=>`${m.name}, $w = ${J(m.w)}$`),correct:corr},
            hint:"Find the photon energy $E = hc/\\lambda$. Electrons come out wherever $E > w$.",
            steps:[`$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = ${J(E)}$`,...list.map(m=>`${m.name}: $w = ${J(m.w)}$, ${E>m.w?"$E > w$, ejected.":"$E < w$, nothing."}`)],
            answerTeX:corr.map(i=>list[i].name).join(", ")}; }
        let m, nm, guard=0; do{ m=R.pick(METALS); nm=R.int(180,720); guard++; } while(guard<200 && !okLam(nm*1e-9,[m]));
        const E=HC/(nm*1e-9), yes=E>m.w;
        const p1={label:"Are electrons ejected?",answer:{type:"mc",options:["Yes","No"],correct:yes?0:1,keep:true}};
        const steps=[`$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = ${J(E)}$`,`$w = ${J(m.w)}$ for ${m.name}${m.notes?" (p. 7)":" (standard value, not from the notes)"}.`,yes?"$E > w$: each photon has enough energy to free an electron.":"$E < w$: no single photon has enough energy, so no electrons come out."];
        if(d===1) return {prompt:`Light of wavelength $${M.qty(nm,3,"nm")}$ shines on ${m.name} metal ($w = ${J(m.w)}$). Are electrons ejected?`,
          parts:[p1], hint:"Compare the energy of one photon, $hc/\\lambda$, with the work function.", steps, answerTeX:yes?"Yes":"No"};
        const opts=["More electrons come out, each with the same maximum KE","The same number come out, each with 4 times the KE","Still no electrons come out","Electrons come out, but only after a delay"];
        steps.push(yes?"Brighter light means more photons each second, not more energetic photons. Each electron's maximum KE is set by $h\\nu - w$ only. (That more electrons come out is the standard result; the notes stress that KE does not change.)":"Brighter light means more photons, but each still has $E < w$. Intensity can't make up for low frequency (p. 6).");
        return {prompt:`Light of wavelength $${M.qty(nm,3,"nm")}$ shines on ${m.name} metal ($w = ${J(m.w)}$). Are electrons ejected? What happens if the light is made 4 times brighter, with the same wavelength?`,
          parts:[p1,{label:"4 times brighter",answer:{type:"mc",options:opts,correct:yes?0:2,keep:true}}],
          hint:"Only frequency (or wavelength) decides whether one photon can free an electron. Brightness only changes how many photons arrive.", steps,
          answerTeX:yes?"Yes. More electrons, same maximum KE.":"No. Still none."};
      }},
    {id:"M2C2.g.planck", title:"Planck's quanta", skill:"$E_{\\text{osc}} = nh\\nu$", ref:"pp. 4-5",
      gen(R,d){
        const nu=R.sig(1.2,9.8,3)*1e13; const q=K.h*nu;
        if(d===1) return {prompt:`A group of atoms in a hot solid oscillates at $${S(nu)}$. According to Planck, what is the smallest amount by which its energy can change?`,
          answer:{type:"num",value:q,unit:"J",sf:3}, hint:"Allowed energies are $0, h\\nu, 2h\\nu, \\ldots$ The smallest step is one quantum.",
          steps:["Allowed energies: $E_{\\text{osc}} = nh\\nu$ with $n = 0, 1, 2, \\ldots$ (p. 4).","Neighbouring values differ by one quantum, $h\\nu$.",`$h\\nu = (6.626\\times10^{-34}\\ \\mathrm{J\\,s})(${S(nu)}) = ${J(q)}$`],
          answerTeX:`$${J(q)}$`, verify:{value:6.626e-34*nu}};
        if(d===2){ const n=R.int(2,9); const fr=R.shuffle([0.5,0.25,0.75,-0.5]).slice(0,3); const vals=[n,...fr.map(f=>n+f)];
          const opts=vals.map(k=>`$${J(k*q)}$`); const order=R.shuffle([0,1,2,3]);
          return {prompt:`Atoms in a solid oscillate at $${S(nu)}$. Which of these could be the oscillation energy of the group, according to Planck?`,
            answer:{type:"mc",options:order.map(i=>opts[i]),correct:order.indexOf(0)},
            hint:`Only whole-number multiples of $h\\nu = ${J(q)}$ are allowed. Divide each option by $h\\nu$.`,
            steps:[`One quantum: $h\\nu = ${J(q,4)}$.`,...vals.map(k=>`$${J(k*q)} \\div h\\nu = ${M.num(k,2)}$${Number.isInteger(k)?": a whole number, allowed.":": not a whole number, not allowed."}`)],
            answerTeX:opts[0]}; }
        const n=R.int(11,40); const E=+M.toSig(n*q,4);
        return {prompt:`An oscillator in a hot solid has frequency $${S(nu)}$ and energy $${J(E,4)}$. How many quanta of energy does it have (what is $n$)?`,
          answer:{type:"int",value:n}, hint:"$E_{\\text{osc}} = nh\\nu$, so $n = E/(h\\nu)$.",
          steps:[`$h\\nu = ${J(q,4)}$`,`$n = \\dfrac{E}{h\\nu} = \\dfrac{${J(E,4)}}{${J(q,4)}} = ${(E/q).toFixed(2)} \\approx ${n}$`], answerTeX:`$n = ${n}$`};
      }}
  ],
  exam:[
    {id:"M2C2.q1", ref:"p. 6", q:"Light above the threshold frequency shines on a metal. The intensity is doubled and the frequency is kept the same. What happens?", opts:[
      ["The maximum kinetic energy of the ejected electrons doubles.",false,"KE depends on $h\\nu - w$ only, not on intensity."],["More electrons are ejected, with the same maximum kinetic energy.",true,"More photons each second, each with the same $h\\nu$."],["No electrons are ejected until enough energy builds up.",false,"No time delay is seen, even for dim light (p. 6)."],["The threshold frequency is halved.",false,"$\\nu_0 = w/h$ belongs to the metal, not to the light."],["The work function of the metal doubles.",false,"The work function is a property of the metal."]]},
    {id:"M2C2.q2", ref:"p. 6", q:"A graph of the maximum kinetic energy of ejected electrons against the frequency of the light is a straight line above $\\nu_0$. What is its slope?", opts:[
      ["Planck's constant, $h$",true,"$KE = h\\nu - w$ has the form $y = mx + b$ with $m = h$."],["The work function, $w$",false,"$w$ sets where the line starts, not its slope."],["The speed of light, $c$",false,"$c$ appears only if you plot against $1/\\lambda$."],["The threshold frequency, $\\nu_0$",false,"$\\nu_0$ is where the line meets the axis."],["The electron mass, $m_e$",false,"$m_e$ only matters when you convert KE to a speed."]]},
    {id:"M2C2.q3", ref:"p. 6", q:"A metal has a work function of $4.10\\times10^{-19}$ J. What is the longest wavelength of light that can eject electrons from it?", opts:[
      ["$4.85\\times10^{-7}$ m",true,"$\\lambda_0 = hc/w = 4.85\\times10^{-7}$ m (485 nm)."],["$6.19\\times10^{14}$ m",false,"That is the threshold frequency $w/h$ in s⁻¹, with the wrong unit."],["$2.06\\times10^{6}$ m",false,"That is $w/(hc)$, the reciprocal of $\\lambda_0$."],["$1.62\\times10^{-15}$ m",false,"This is $h/w$: the factor $c$ is missing."],["4.85 nm",false,"Right digits, but $4.85\\times10^{-7}$ m is 485 nm."]]},
    {id:"M2C2.q4", ref:"p. 6", q:"A metal ejects no electrons when the light is longer than 540 nm. What is the largest kinetic energy of an electron ejected by 365 nm light?", opts:[
      ["$1.76\\times10^{-19}$ J",true,"$hc(1/365\\text{ nm} - 1/540\\text{ nm}) = 1.76\\times10^{-19}$ J."],["$5.44\\times10^{-19}$ J",false,"That is the energy of a 365 nm photon, before subtracting $w$."],["$3.68\\times10^{-19}$ J",false,"That is the work function, $hc/\\lambda_0$."],["$9.12\\times10^{-19}$ J",false,"This adds $w$ to the photon energy instead of subtracting it."],["$1.76\\times10^{-28}$ J",false,"The wavelengths were left in nm instead of m."]]},
    {id:"M2C2.q5", ref:"p. 6", multi:true, q:"Which statements about the photoelectric effect are true? Select all that apply.", opts:[
      ["Below the threshold frequency, no electrons are ejected however bright the light is.",true,"Observation 1 on p. 6."],["Above the threshold, the maximum kinetic energy of the electrons rises in proportion to $\\nu - \\nu_0$.",true,"$KE = h\\nu - h\\nu_0$."],["Dim light above the threshold ejects electrons only after a delay.",false,"Electrons come out instantly (observation 3)."],["The work function is the minimum energy needed to remove an electron from the surface.",true,"Definition on p. 6."],["The effect shows that light behaves only as a wave.",false,"It shows the particle side: energy comes in photons."]]},
    {id:"M2C2.q6", ref:"p. 4", q:"What did classical theory fail to explain about blackbody radiation?", opts:[
      ["The intensity rises to a peak at one wavelength and then falls at shorter wavelengths.",true,"Classical theory predicts the intensity keeps rising as $\\lambda$ shrinks, with no peak."],["Hot objects give off light at all.",false,"Classical physics expected accelerating charges to give off light."],["The colour of the light depends on what the solid is made of.",false,"The notes say the profile does not depend on the composition."],["Light travels at $2.998\\times10^{8}$ m s⁻¹.",false,"The speed of light was not the problem."],["Light can be split into colours by a prism.",false,"That is ordinary wave optics."]]},
    {id:"M2C2.q7", ref:"pp. 4-5", q:"According to Planck, a group of atoms oscillating at frequency $\\nu$ can have which energies?", opts:[
      ["$0,\\ h\\nu,\\ 2h\\nu,\\ 3h\\nu, \\ldots$",true,"$E_{\\text{osc}} = nh\\nu$ with $n$ a whole number."],["Any energy from 0 up to $h\\nu$",false,"That is continuous energy, which Planck ruled out."],["$h\\nu/2,\\ h\\nu/3,\\ h\\nu/4, \\ldots$",false,"Fractions of a quantum are not allowed."],["Only exactly $h\\nu$",false,"Any whole number of quanta is allowed, including zero."],["Any energy, as long as $\\nu$ is high enough",false,"The steps exist at every frequency."]]},
    {id:"M2C2.q8", ref:"p. 7", q:"What is the energy of one mole of photons of 250 nm ultraviolet light?", opts:[
      ["479 kJ mol⁻¹",true,"$E = hc/\\lambda = 7.95\\times10^{-19}$ J; $\\times N_A = 4.79\\times10^{5}$ J mol⁻¹."],["$7.95\\times10^{-22}$ kJ mol⁻¹",false,"That is the energy of one photon (in kJ), not one mole."],["$4.79\\times10^{5}$ kJ mol⁻¹",false,"That number is in J mol⁻¹; divide by 1000 for kJ."],["$1.32\\times10^{-45}$ kJ mol⁻¹",false,"This divides by $N_A$ instead of multiplying."],["0.479 kJ mol⁻¹",false,"Off by 1000."]]}
  ],
  steps:[
    {type:"read", title:"Three experiments showed that energy comes in steps", ref:"p. 4", body:"<p>Three experiments, all about light meeting matter, forced physicists to accept that energy is quantized at the atomic level: <b>blackbody radiation</b>, the <b>photoelectric effect</b> and the <b>line spectra of atoms</b>. This chapter covers the first two.</p><p>Heat a solid and it glows. Pass that light through a prism, measure the intensity at each wavelength, and you get a smooth curve with a peak. The shape depends on the temperature, not on what the solid is made of. Classical theory predicted that the intensity would keep climbing as the wavelength got shorter, with no peak. It could not explain the real curves.</p>"},
    {type:"explore", title:"Heat the solid and watch the peak move", fig:"blackbody", ref:"pp. 4-5", body:"<p>Drag the temperature up. The peak gets taller and slides toward shorter wavelengths: from infrared at 3000 K into the visible near 5000 K. That is why a stove element glows dull red and the Sun looks white.</p><p>Compare the coloured curve with the grey classical curve. They agree at long wavelengths and part ways badly at short ones.</p>"},
    {type:"read", title:"Planck: energy comes in whole quanta of size hν", ref:"pp. 4-6", body:"<p>In 1900 Planck matched the curves by assuming that atoms oscillating at frequency $\\nu$ can only have certain energies:</p><div class=\"box def\"><b class=\"t\">Planck's assumption (p. 4)</b>$$E_{\\text{osc}} = nh\\nu,\\quad n = 0, 1, 2, \\ldots \\qquad h = 6.626\\times10^{-34}\\ \\mathrm{J\\,s}$$</div><p>So the energy is $0$, $h\\nu$, $2h\\nu$, and so on, never in between. It's like a vending machine that only takes whole coins: you can pay one coin or two, never one and a half. Each coin here is a <b>quantum</b> of energy, $h\\nu$.</p><p>Einstein later applied the same idea to light itself (p. 6). One <b>photon</b> of frequency $\\nu$ carries $$E = h\\nu = \\frac{hc}{\\lambda}$$ (the second form uses $\\nu = c/\\lambda$; this is the \"For you to try\" on p. 5). A mole of photons carries $N_A$ times as much, with $N_A = 6.022\\times10^{23}\\ \\mathrm{mol^{-1}}$.</p>"},
    {type:"example", title:"Energy of a photon and of a mole of photons", ref:"p. 7 (like Example 2-2)", ex:{q:"A germicidal lamp gives off ultraviolet light of wavelength 254 nm. What is the energy of one photon, in joules, and of one mole of these photons, in kJ mol⁻¹?", steps:[
      {t:"$\\lambda = 254\\ \\mathrm{nm} = 2.54\\times10^{-7}\\ \\mathrm{m}$",why:"$h$ and $c$ are in SI units, so $\\lambda$ must be in metres."},
      {t:"$E = \\dfrac{hc}{\\lambda} = \\dfrac{(6.626\\times10^{-34}\\ \\mathrm{J\\,s})(2.998\\times10^{8}\\ \\mathrm{m\\,s^{-1}})}{2.54\\times10^{-7}\\ \\mathrm{m}} = 7.82\\times10^{-19}\\ \\mathrm{J}$",why:"s and m cancel, leaving J. That is per photon."},
      {t:"$E_{\\text{mol}} = (7.821\\times10^{-19}\\ \\mathrm{J})(6.022\\times10^{23}\\ \\mathrm{mol^{-1}}) = 4.71\\times10^{5}\\ \\mathrm{J\\,mol^{-1}}$",why:"Keep an extra digit from the last step and round at the end."},
      {t:"$4.71\\times10^{5}\\ \\mathrm{J\\,mol^{-1}} = 471\\ \\mathrm{kJ\\,mol^{-1}}$",why:"Divide by 1000. A tiny number per photon becomes a chemistry-sized number per mole."}], ans:"$7.82\\times10^{-19}$ J per photon; 471 kJ mol⁻¹."}},
    {type:"try", title:"Photon energy", gen:"M2C2.g.photon-energy"},
    {type:"read", title:"Light knocks electrons out of a metal, but only above a threshold", ref:"pp. 5-6", body:"<p>In the photoelectric effect, light hits a clean metal surface and electrons fly out. Measuring their maximum kinetic energy against the light's frequency and intensity gave three observations (p. 6):</p><ol><li>No electrons come out unless the frequency is above a <b>threshold frequency</b> $\\nu_0$, however bright the light.</li><li>Above $\\nu_0$, the kinetic energy rises in a straight line with $\\nu$. The slope is exactly $h$.</li><li>Above $\\nu_0$, electrons come out instantly, even with dim light.</li></ol><p>If light were a smooth wave, bright red light should eventually shake an electron loose, and dim light should take time to build up enough energy. Neither happens.</p>"},
    {type:"explore", title:"Run the photoelectric experiment", fig:"photo", ref:"pp. 5-7", body:"<p>Start with calcium and 400 nm light. Then:</p><ul><li>Slide the wavelength up until the electrons stop. That is $\\lambda_0$ for calcium.</li><li>Below threshold, turn the brightness to 100%. Still nothing.</li><li>Above threshold, change the brightness. The number of electrons changes; the length of each arrow (their speed) does not.</li><li>Switch metals. The line on the graph shifts sideways but keeps the same slope, $h$.</li></ul>"},
    {type:"mcq", title:"Frequency decides, brightness counts", q:"Bright red light ejects no electrons from a metal, but dim violet light does. Why?", opts:[["Each violet photon has more energy than the work function; each red photon has less.",true,"$E = h\\nu$: violet has the higher frequency. One photon frees one electron, so photon energy is what matters."],["Violet light has a higher intensity than red light.",false,"The red light is the brighter one here."],["Red light is absorbed by the metal and violet light is not.",false,"Both are absorbed; only violet photons have enough energy."]], after:"Brightness only changes how many photons arrive each second. It never makes one photon stronger."},
    {type:"read", title:"Einstein: one photon, one electron, energy conserved", ref:"p. 6", body:"<p>Einstein (1905) said light's energy is packed into photons of energy $h\\nu$. A photon gives all its energy to one electron. Part of it frees the electron from the metal; the rest becomes kinetic energy:</p><div class=\"box def\"><b class=\"t\">Photoelectric equation (p. 6)</b>$$E_{\\text{photon}} = w + (KE)_{e^-} \\qquad w = h\\nu_0 = \\frac{hc}{\\lambda_0} \\qquad (KE)_{e^-} = \\tfrac12 m_e v^2$$</div><p>The <b>work function</b> $w$ is the minimum energy needed to free an electron. It's like a toll to leave: whatever is left after paying is the electron's kinetic energy. If the photon can't pay the toll, the electron stays.</p><p>The data sheet gives $E = h\\nu$ and $KE = \\frac12 mv^2$ but <b>not</b> $E_{\\text{photon}} = w + KE$. Memorise it.</p>"},
    {type:"example", title:"Kinetic energy and speed of an ejected electron", ref:"p. 7 (like Example 2-3)", ex:{q:"A metal has a work function of $3.70\\times10^{-19}$ J. It is lit with 405 nm violet light. What are the maximum kinetic energy and the maximum speed of the ejected electrons? ($m_e = 9.109\\times10^{-31}$ kg)", steps:[
      {t:"$E_{\\text{photon}} = \\dfrac{hc}{\\lambda} = \\dfrac{(6.626\\times10^{-34})(2.998\\times10^{8})}{4.05\\times10^{-7}\\ \\mathrm{m}} = 4.905\\times10^{-19}\\ \\mathrm{J}$",why:"Check first that $E > w$, so electrons do come out."},
      {t:"$KE = E - w = 4.905\\times10^{-19} - 3.70\\times10^{-19} = 1.20\\times10^{-19}\\ \\mathrm{J}$",why:"Energy conservation: $E_{\\text{photon}} = w + KE$."},
      {t:"$v = \\sqrt{\\dfrac{2KE}{m_e}} = \\sqrt{\\dfrac{2(1.205\\times10^{-19}\\ \\mathrm{J})}{9.109\\times10^{-31}\\ \\mathrm{kg}}}$",why:"Rearrange $KE = \\frac12 m_e v^2$."},
      {t:"$v = \\sqrt{2.646\\times10^{11}\\ \\mathrm{m^2\\,s^{-2}}} = 5.14\\times10^{5}\\ \\mathrm{m\\,s^{-1}}$",why:"1 J = 1 kg m² s⁻², so J/kg is m² s⁻²."}], ans:"$KE = 1.20\\times10^{-19}$ J; $v = 5.14\\times10^{5}$ m s⁻¹."}},
    {type:"try", title:"Maximum kinetic energy", gen:"M2C2.g.max-ke"},
    {type:"firstline", title:"Find the first mistake", q:"The threshold wavelength of a metal is 450 nm. A student finds the maximum KE of electrons ejected by 300 nm light:", lines:["$E_{\\text{photon}} = hc/(3.00\\times10^{-7}\\ \\mathrm{m}) = 6.62\\times10^{-19}$ J","$w = hc/(4.50\\times10^{-7}\\ \\mathrm{m}) = 4.41\\times10^{-19}$ J","$KE = E_{\\text{photon}} + w = 1.10\\times10^{-18}$ J","The electrons have $1.10\\times10^{-18}$ J of kinetic energy."], wrong:2, why:"Freeing the electron uses up $w$, so subtract it: $KE = 6.62\\times10^{-19} - 4.41\\times10^{-19} = 2.21\\times10^{-19}$ J."},
    {type:"try", title:"Work function and threshold", gen:"M2C2.g.threshold"},
    {type:"try", title:"Speed of an ejected electron", gen:"M2C2.g.speed"},
    {type:"try", title:"Will electrons come out?", gen:"M2C2.g.ejected", diff:2},
    {type:"formulas", title:"Formulas to know"}
  ]
});
})();
