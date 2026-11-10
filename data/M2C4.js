/* Chapter 2.4 (Wed Sep 30): de Broglie and the uncertainty principle. Course notes Module 2, pp. 12-15 (sections 2.5 and 2.6).
   Wave-particle duality of light, de Broglie's λ = h/(mv), electron diffraction, the Heisenberg uncertainty principle Δx Δp ≥ h/(4π), Δp = mΔv. */
(function(){
const M=C120, K=C120.chem.CONST;
const MP=1.673e-27;                    /* proton mass, p. 11 prints 1.6726219e-27 kg; rounded to 4 sig figs here */
const AMU=K.amu;                       /* 1 amu = 1.6605e-27 kg (data sheet) */
const J=(v,sf=3)=>M.qty(v,sf,"J",{sci:true});
const MS=(v,sf=3)=>M.qty(v,sf,"m/s",{sci:Math.abs(v)>=1e4||Math.abs(v)<0.01});
/* a length in a sensible unit, as TeX */
function lenTeX(L,sf=3){ if(L<1e-15||L>=1e3) return M.qty(L,sf,"m",{sci:true}); if(L<1e-9) return M.qty(L*1e12,sf,"pm"); if(L<1e-6) return M.qty(L*1e9,sf,"nm"); if(L<1e-3) return M.qty(L*1e6,sf,"μm"); return M.qty(L,sf,"m",{sci:true}); }
/* answer a length in pm, nm or m so the number is easy to type with 3 sig figs */
function lenAns(L){ if(L<1e-15||L>=1e-3) return {value:L,unit:"m",word:"metres"}; if(L<1e-9) return {value:L*1e12,unit:"pm",word:"picometres"}; if(L<1e-6) return {value:L*1e9,unit:"nm",word:"nanometres"}; return {value:L*1e6,unit:"μm",word:"micrometres"}; }
const ansTeX=a=>M.qty(a.value,3,a.unit,{sci:a.unit==="m"});
/* a speed answer: km/s between 1000 and 9999 m/s so three significant figures are unambiguous to type; any speed unit is accepted */
const vAns=v=>v>=999.5&&v<9999.5?{type:"num",value:v/1000,unit:"km/s",sf:3}:{type:"num",value:v,unit:"m/s",sf:3};
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.append(e); return e; }
const GASES=[["He","a helium atom",4.003],["Ne","a neon atom",20.18],["Ar","an argon atom",39.95],["N2","a nitrogen molecule, $\\ce{N2}$",28.02],["H2","a hydrogen molecule, $\\ce{H2}$",2.016]];

M.chapter({
  id:"M2C4", module:"m2", n:4, num:"2.4", date:"2026-09-30", added:"2026-10-26", quiz:"PC3",
  title:"de Broglie and the uncertainty principle", pages:"12-15", sections:["2.5","2.6"],
  summary:"Light acts as a wave in some experiments and as particles in others, and de Broglie proposed that matter does the same: anything with momentum $p = mv$ has a wavelength $\\lambda = h/(mv)$. Heisenberg showed that position and momentum can't both be known exactly ($\\Delta x\\,\\Delta p \\ge h/4\\pi$), so for electrons we can only ask where they probably are.",
  flags:[
    {ref:"p. 14", text:"After Example 2-5 the notes say a 73 μm hole is realistic \"on the atomic scale\". 73 μm is about a million times bigger than an atom ($a_0$ = 52.9 pm). The point is that a hole that size can actually be made, so electrons this slow could be diffracted. A hole for the car would have to be $10^{-38}$ m, which is impossible."}
  ],
  formulas:[
    {id:"M2C4.f.debroglie", name:"de Broglie wavelength", tex:"\\lambda_{dB} = \\frac{h}{p} = \\frac{h}{mv}", note:"SI units: $m$ in kg, $v$ in m s⁻¹, $\\lambda$ in m.", ref:"p. 13",
      blank:{tex:"\\lambda_{dB} = \\frac{h}{\\boxed{\\,?\\,}}", accept:["mv","p","m v","m*v","m·v"]}},
    {id:"M2C4.f.momentum", name:"Momentum", tex:"p = mv", ref:"p. 13"},
    {id:"M2C4.f.hup", name:"Heisenberg uncertainty principle", tex:"\\Delta x\\,\\Delta p \\ge \\frac{h}{4\\pi}", note:"So $\\Delta p \\ge h/(4\\pi\\Delta x)$: the better you know where it is, the worse you know where it's going.", ref:"p. 15",
      blank:{tex:"\\Delta x\\,\\Delta p \\ge \\frac{h}{\\boxed{\\,?\\,}}", accept:["4π","4pi","4 pi","4*pi","4π"]}},
    {id:"M2C4.f.dp", name:"Uncertainty in momentum", tex:"\\Delta p = m\\,\\Delta v", note:"So the smallest possible $\\Delta v = h/(4\\pi m\\,\\Delta x)$.", ref:"p. 15",
      blank:{tex:"\\Delta p = \\boxed{\\,?\\,}\\,\\Delta v", accept:["m","mass"]}},
    {id:"M2C4.f.mp", name:"Proton mass", tex:"m_p = 1.6726219\\times10^{-27}\\ \\mathrm{kg}", kind:"constant", note:"Printed only in the Are You Wondering box on p. 11. Problems here round it to $1.673\\times10^{-27}$ kg and give it in the question. One amu is $1.6605\\times10^{-27}$ kg (data sheet). Not tested on Test 2: a question about a proton would give you its mass.", ref:"p. 11", notOn:["T2"]},
    {id:"M2C4.f.duality", name:"Evidence for each side of light", tex:"\\text{diffraction} \\Rightarrow \\text{wave};\\quad \\text{photoelectric effect} \\Rightarrow \\text{particles}", kind:"rule", note:"Diffraction needs an opening about as big as the wavelength.", ref:"p. 12"}
  ],
  glossary:[
    {id:"M2C4.t.duality", term:"Wave-particle duality", def:"Light, and matter too, shows wave behaviour in some experiments (diffraction) and particle behaviour in others (photoelectric effect).", ref:"p. 12"},
    {id:"M2C4.t.diffraction", term:"Diffraction", def:"Spreading of a wave through an opening about as big as its wavelength, giving a pattern of bright and dark rings from interference.", ref:"p. 12"},
    {id:"M2C4.t.debroglie", term:"de Broglie wavelength", def:"The wavelength of a moving particle, $\\lambda = h/(mv)$.", ref:"p. 13"},
    {id:"M2C4.t.momentum", term:"Momentum, $p$", def:"Mass times speed, $p = mv$, in kg m s⁻¹.", ref:"p. 13"},
    {id:"M2C4.t.hup", term:"Heisenberg uncertainty principle", def:"Position and momentum can't both be known exactly at the same time: $\\Delta x\\,\\Delta p \\ge h/4\\pi$.", ref:"p. 15"},
    {id:"M2C4.t.most-probable", term:"Most probable behaviour", def:"Because exact paths can't be known, quantum theory asks where a particle is likely to be, not exactly where it is.", ref:"p. 15"}
  ],
  figures:{
    dbcalc:{title:"How big is a de Broglie wavelength?", cap:"$\\lambda = h/(mv)$ (p. 13) for four objects. The ruler is logarithmic, from $10^{-40}$ m to 1 m. Landmarks: the Bohr radius, 52.9 pm (p. 10); visible light, 400 to 750 nm (p. 3); the 73 μm hole from Example 2-5 (p. 14). Masses: electron (p. 7), proton (p. 11), helium atom from 4.003 amu (data sheet), car (p. 14). Speeds stay well below the speed of light.", ref:"pp. 13-14",
      build(host,{PLOT,M}){
        const OBJ=[["e","electron",K.me],["p","proton",MP],["He","He atom",4.003*AMU],["car","2000 kg car",2000]];
        let oi=0, lg=6; const ctl=PLOT.controls(host);
        PLOT.seg(ctl,{label:"Object",items:OBJ.map((o,i)=>[i,o[1]]),value:oi,onchange:v=>{ oi=v; draw(); }});
        PLOT.slider(ctl,{label:"Speed",min:0,max:7,step:0.05,value:lg,fmt:v=>M.rich(`$${MS(+M.toSig(Math.pow(10,v),3))}$`),oninput:v=>{ lg=v; draw(); }});
        const W=600,H=130,L=24,Rr=W-16,a=-40,b=0; const X=v=>L+(v-a)/(b-a)*(Rr-L);
        const svg=sv("svg",{viewBox:`0 0 ${W} ${H}`,class:"fig",role:"img","aria-label":"Log ruler of wavelengths"}); host.append(svg);
        sv("line",{x1:L,x2:Rr,y1:70,y2:70,class:"ax"},svg);
        for(let v=a;v<=b;v+=5){ sv("line",{x1:X(v),x2:X(v),y1:66,y2:74,class:"ax"},svg); const t=sv("text",{x:X(v),y:88,"text-anchor":"middle",style:"font-size:10px;fill:var(--ink2)"},svg); t.textContent=v===0?"1 m":`10^${v}`; }
        const lmk=[[Math.log10(52.9e-12),"a₀"],[Math.log10(5.5e-7),"visible"],[Math.log10(73e-6),"73 μm"]];
        lmk.forEach(([v,t],i)=>{ sv("line",{x1:X(v),x2:X(v),y1:56,y2:70,style:"stroke:var(--ink2);stroke-width:1"},svg); const tt=sv("text",{x:X(v),y:50-i*11,"text-anchor":"middle",style:"font-size:10px;fill:var(--ink2)"},svg); tt.textContent=t; });
        const mk=sv("path",{d:"",style:"fill:var(--c,var(--accent))"},svg); const ml=sv("text",{x:0,y:112,"text-anchor":"middle",class:"lblc"},svg);
        const out=PLOT.readout(host);
        function draw(){
          const [,name,m]=OBJ[oi]; const v=+M.toSig(Math.pow(10,lg),3), p=m*v, lam=K.h/p; const g=Math.max(a,Math.min(b,Math.log10(lam))); const x=X(g);
          mk.setAttribute("d",`M${x} 72 l-7 14 h14 z`); ml.setAttribute("x",Math.max(40,Math.min(W-40,x))); ml.textContent="λ";
          const cmp=lam>1e-3?"bigger than a millimetre":lam>73e-6*0.3&&lam<73e-6*3?"about the size of the 73 μm hole in Example 2-5":lam>3e-7&&lam<1e-6?"about the wavelength of visible light":lam>5e-12&&lam<5e-10?"about the size of an atom (compare $a_0$ = 52.9 pm), so atoms in a crystal can diffract it":lam<1e-20?"far smaller than anything that could act as a hole: no diffraction can ever be seen":"";
          out.innerHTML=M.rich(`${name} at $${MS(v)}$: $p = mv = ${M.qty(p,3,"kg m/s",{sci:true})}$, $\\lambda = h/p = ${lenTeX(lam)}$${cmp?`, ${cmp}`:""}.`);
        }
        draw();
      }},
    ring:{title:"A standing wave on a Bohr orbit", cap:"A link the notes do not make (not from the notes): put de Broglie's $\\lambda = h/(mv)$ (p. 13) into Bohr's condition $mvr = n(h/2\\pi)$ (p. 9) and you get $2\\pi r = n\\lambda$. The orbit's circumference holds a whole number of wavelengths, so the wave joins up with itself. This explains problem (1) on p. 12, why the orbits are quantized, but the orbit picture itself is still wrong.", ref:"pp. 9-13",
      model:{type:"ringwave", params:{n:3}},
      predict:{q:"An electron wave runs around a circular orbit and must join up with itself smoothly. Which numbers of wavelengths can fit around the orbit?", opts:[["Only whole numbers: 1, 2, 3, ...",true,"Any other number leaves the wave out of step with itself after one lap, and it cancels out."],["Any number, for example 3.5",false,"With 3.5 wavelengths the crest meets a trough after one lap."],["Only even numbers",false,"Odd numbers fit too: 3 wavelengths join up perfectly."]], keep:true, check:"Step n up and down and watch the wave close on itself each time."}},
    hup:{title:"The uncertainty trade-off", cap:"The smallest possible uncertainty in speed, $\\Delta v = h/(4\\pi m\\,\\Delta x)$ (p. 15), for an electron and for a proton, against how well the position is known. Both axes are logarithmic: each step is a factor of 10. The dashed line marks $\\Delta x = a_0 = 52.9$ pm, about the size of an H atom (p. 10).", ref:"pp. 10-15",
      build(host,{PLOT,M}){
        const fe=x=>Math.log10(K.h/(4*Math.PI*K.me*Math.pow(10,x))), fp=x=>Math.log10(K.h/(4*Math.PI*MP*Math.pow(10,x)));
        const G=PLOT.graph(host,{x:[-12.5,-5.5],y:[-2.5,8.5],w:560,h:300,xlabel:"log₁₀(Δx / m)",ylabel:"log₁₀(Δv / m s⁻¹)",label:"Minimum speed uncertainty against position uncertainty",xstep:1,ystep:1});
        G.fn(fe,{cls:"cv c"}); G.fn(fp,{cls:"cv",dash:"6 4"});
        G.label(-12.3,fe(-12.3)-0.6,"electron",{cls:"lblc"}); G.label(-12.3,fp(-12.3)-0.6,"proton",{cls:"lblc"});
        G.vline(Math.log10(52.9e-12)); G.label(Math.log10(52.9e-12),8.1,"a₀",{cls:"lblc",dx:4});
        const out=PLOT.readout(host);
        const show=x=>{ const dx=Math.pow(10,x), ve=K.h/(4*Math.PI*K.me*dx), vp=K.h/(4*Math.PI*MP*dx);
          out.innerHTML=M.rich(`$\\Delta x = ${lenTeX(dx)}$: electron $\\Delta v \\ge ${MS(ve)}$; proton $\\Delta v \\ge ${MS(vp)}$. Squeeze $\\Delta x$ by 10 and $\\Delta v$ grows by 10.`); };
        G.handle(Math.log10(52.9e-12),fe(Math.log10(52.9e-12)),{f:fe,bounds:[-12.4,-5.6],step:0.05,label:"Position uncertainty",onMove:x=>show(x)});
        show(Math.log10(52.9e-12));
      }}
  },
  gens:[
    {id:"M2C4.g.db-lambda", title:"de Broglie wavelength", skill:"$\\lambda = h/(mv)$ in SI units", ref:"p. 13",
      gen(R,d){
        let m, v, who, mWork=[];
        if(d===1){ m=K.me; v=R.sig(1.0,9.9,3)*Math.pow(10,R.int(3,6)); who=`an electron ($m_e = 9.109\\times10^{-31}$ kg)`; mWork=[`$m = 9.109\\times10^{-31}$ kg`]; }
        else if(d===2){ const [f,name,mm]=R.pick(GASES); v=R.int(30,200)*10; m=mm/1000/K.NA; who=`${name} (molar mass $${mm}$ g mol⁻¹)`; mWork=[`Mass of one particle: $m = \\dfrac{${mm}\\ \\mathrm{g\\,mol^{-1}}}{6.022\\times10^{23}\\ \\mathrm{mol^{-1}}} = ${M.qty(mm/K.NA,4,"g",{sci:true})} = ${M.qty(m,4,"kg",{sci:true})}$`]; }
        else { const o=R.pick([["a 0.145 kg baseball",0.145,R.sig(25,45,3)],["a 57.0 g tennis ball",0.0570,R.sig(20,60,3)],["a 2.50 g bullet",0.00250,R.sig(300,900,3)],["a 70.0 kg sprinter",70.0,R.sig(8.0,11.0,3)]]); who=o[0]; m=o[1]; v=o[2]; mWork=[`$m = ${M.qty(m,3,"kg")}$ (SI units: kg)`]; }
        const lam=K.h/(m*v), A=lenAns(lam);
        return {prompt:`What is the de Broglie wavelength of ${who} moving at $${MS(v)}$? Give it in ${A.word}.`,
          answer:{type:"num",value:A.value,unit:A.unit,sf:3},
          hint:"$\\lambda = h/(mv)$. Mass must be in kg, so the J s, kg and m s⁻¹ combine to metres.",
          steps:[...mWork,`$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626\\times10^{-34}\\ \\mathrm{J\\,s}}{(${M.qty(m,4,"kg",{sci:true})})(${MS(v)})} = ${M.qty(lam,4,"m",{sci:true})}$`,`$\\lambda = ${ansTeX(A)}$${d===3?". Far too small to ever see diffraction.":""}`],
          answerTeX:`$${ansTeX(A)}$`, verify:{value:(K.h/m/v)*(A.unit==="pm"?1e12:A.unit==="nm"?1e9:A.unit==="μm"?1e6:1)}};
      }},
    {id:"M2C4.g.db-speed", title:"Speed for a given de Broglie wavelength", skill:"Rearrange to $v = h/(m\\lambda)$", ref:"p. 13",
      gen(R,d){
        let m=K.me, who="an electron", mTeX="9.109\\times10^{-31}\\ \\mathrm{kg}", lam, lamShow;
        if(d===2){ m=MP; who="a proton"; mTeX="1.673\\times10^{-27}\\ \\mathrm{kg}"; const x=R.sig(1.0,95,3); lam=x*1e-12; lamShow=M.qty(x,3,"pm"); }
        else { const u=R.pick(["nm","pm","um"]); if(u==="nm"){ const x=R.sig(0.15,450,3); lam=x*1e-9; lamShow=M.qty(x,3,"nm"); } else if(u==="pm"){ const x=R.sig(110,950,3); lam=x*1e-12; lamShow=M.qty(x,3,"pm"); } else { const x=R.sig(1.5,95,3); lam=x*1e-6; lamShow=M.qty(x,3,"μm"); } }
        const v=K.h/(m*lam);
        const steps=[`$\\lambda = ${lamShow} = ${M.qty(lam,3,"m",{sci:true})}$`,`$v = \\dfrac{h}{m\\lambda} = \\dfrac{6.626\\times10^{-34}\\ \\mathrm{J\\,s}}{(${mTeX})(${M.qty(lam,3,"m",{sci:true})})} = ${MS(v)}$`];
        if(d===3){ const ke=0.5*m*v*v; steps.push(`$KE = \\tfrac12 mv^2 = \\tfrac12(${mTeX})(${MS(v,4)})^2 = ${J(ke)}$`);
          return {prompt:`An electron has a de Broglie wavelength of $${lamShow}$. What are its speed and its kinetic energy? ($m_e = 9.109\\times10^{-31}$ kg)`,
            parts:[{label:"Speed",answer:vAns(v)},{label:"Kinetic energy",answer:{type:"num",value:ke,unit:"J",sf:3}}],
            hint:"$v = h/(m\\lambda)$, then $KE = \\frac12 mv^2$.", steps, answerTeX:`$v = ${MS(v)}$, $KE = ${J(ke)}$`, verify:{values:[K.h/m/lam/(v>=999.5&&v<9999.5?1000:1),K.h*K.h/(2*m*lam*lam)]}}; }
        return {prompt:`What speed must ${who} have for its de Broglie wavelength to be $${lamShow}$? ($m = ${mTeX}$)`,
          answer:vAns(v), hint:"Rearrange $\\lambda = h/(mv)$ to $v = h/(m\\lambda)$, with $\\lambda$ in metres.", steps,
          answerTeX:`$${MS(v)}$`, verify:{value:K.h/m/lam/(v>=999.5&&v<9999.5?1000:1)}};
      }},
    {id:"M2C4.g.from-ke", title:"de Broglie wavelength from kinetic energy", skill:"$KE \\to v \\to \\lambda$", ref:"pp. 6-13",
      gen(R,d){
        if(d===3){ const w=R.sig(3.0,5.0,3)*1e-19; const lam0=K.h*K.c/w; const nm=R.int(150,Math.floor(0.75*lam0*1e9)); const E=K.h*K.c/(nm*1e-9), ke=E-w, v=Math.sqrt(2*ke/K.me), L=K.h/(K.me*v), A=lenAns(L);
          return {prompt:`Light of wavelength $${M.qty(nm,3,"nm")}$ ejects electrons from a metal whose work function is $${J(w)}$. What is the de Broglie wavelength of the fastest ejected electrons? Give it in ${A.word}.`,
            answer:{type:"num",value:A.value,unit:A.unit,sf:3}, hint:"Chain three chapters: $KE = hc/\\lambda - w$, then $v = \\sqrt{2KE/m_e}$, then $\\lambda_{dB} = h/(m_e v)$.",
            steps:[`$E_{\\text{photon}} = hc/\\lambda = ${J(E,4)}$`,`$KE = E - w = ${J(ke,4)}$`,`$v = \\sqrt{2KE/m_e} = ${MS(v,4)}$`,`$\\lambda_{dB} = \\dfrac{h}{m_e v} = ${M.qty(L,4,"m",{sci:true})} = ${ansTeX(A)}$`],
            answerTeX:`$${ansTeX(A)}$`, verify:{value:K.h/Math.sqrt(2*K.me*ke)*(A.unit==="pm"?1e12:A.unit==="nm"?1e9:1e6)}}; }
        const m=d===1?K.me:MP, who=d===1?"An electron":"A proton", mTeX=d===1?"9.109\\times10^{-31}\\ \\mathrm{kg}":"1.673\\times10^{-27}\\ \\mathrm{kg}";
        const ke=R.sig(1.0,9.9,3)*Math.pow(10,d===1?R.int(-20,-17):R.int(-21,-18)); const v=Math.sqrt(2*ke/m), L=K.h/(m*v), A=lenAns(L);
        return {prompt:`${who} ($m = ${mTeX}$) has a kinetic energy of $${J(ke)}$. What is its de Broglie wavelength, in ${A.word}?`,
          answer:{type:"num",value:A.value,unit:A.unit,sf:3}, hint:"Find the speed from $KE = \\frac12 mv^2$ first.",
          steps:[`$v = \\sqrt{\\dfrac{2KE}{m}} = \\sqrt{\\dfrac{2(${J(ke)})}{${mTeX}}} = ${MS(v,4)}$`,`$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626\\times10^{-34}}{(${mTeX})(${MS(v,4)})} = ${M.qty(L,4,"m",{sci:true})} = ${ansTeX(A)}$`],
          answerTeX:`$${ansTeX(A)}$`, verify:{value:K.h/Math.sqrt(2*m*ke)*(A.unit==="pm"?1e12:A.unit==="nm"?1e9:A.unit==="μm"?1e6:1)}};
      }},
    {id:"M2C4.g.uncertainty", title:"Heisenberg uncertainty", skill:"$\\Delta x\\,\\Delta p \\ge h/4\\pi$ with $\\Delta p = m\\Delta v$", ref:"p. 15",
      gen(R,d){
        const H4="\\dfrac{h}{4\\pi}";
        if(d===1){ const u=R.pick(["pm","nm"]); const x=u==="pm"?R.sig(20,900,3):R.sig(1.0,50,3); const dx=x*(u==="pm"?1e-12:1e-9); const dp=K.h/(4*Math.PI*dx), dv=dp/K.me;
          return {prompt:`The position of an electron is known to within $\\Delta x = ${M.qty(x,3,u)}$. What is the smallest possible uncertainty in its speed? ($m_e = 9.109\\times10^{-31}$ kg)`,
            answer:vAns(dv), hint:"$\\Delta p \\ge h/(4\\pi\\Delta x)$, then $\\Delta v = \\Delta p/m$. The smallest value is the equals case.",
            steps:[`$\\Delta x = ${M.qty(dx,3,"m",{sci:true})}$`,`$\\Delta p = ${H4}\\cdot\\dfrac{1}{\\Delta x} = \\dfrac{6.626\\times10^{-34}\\ \\mathrm{J\\,s}}{4\\pi(${M.qty(dx,3,"m",{sci:true})})} = ${M.qty(dp,4,"kg m/s",{sci:true})}$`,`$\\Delta v = \\dfrac{\\Delta p}{m_e} = \\dfrac{${M.qty(dp,4,"kg m/s",{sci:true})}}{9.109\\times10^{-31}\\ \\mathrm{kg}} = ${MS(dv)}$`],
            answerTeX:`$\\Delta v \\ge ${MS(dv)}$`, verify:{value:6.626e-34/(4*Math.PI*K.me*dx)/(dv>=999.5&&dv<9999.5?1000:1)}}; }
        if(d===2){ const dv=R.sig(1.0,9.9,3)*Math.pow(10,R.int(3,6)); const dp=K.me*dv, dx=K.h/(4*Math.PI*dp), A=lenAns(dx);
          return {prompt:`The speed of an electron is known to within $\\Delta v = ${MS(dv)}$. What is the smallest possible uncertainty in its position, in ${A.word}?`,
            parts:[{label:"Uncertainty in momentum $\\Delta p$",answer:{type:"num",value:dp,unit:"kg m/s",sf:3}},{label:`$\\Delta x$ (${A.unit})`,answer:{type:"num",value:A.value,unit:A.unit,sf:3}}],
            hint:"$\\Delta p = m\\Delta v$, then $\\Delta x \\ge h/(4\\pi\\Delta p)$.",
            steps:[`$\\Delta p = m_e\\Delta v = (9.109\\times10^{-31}\\ \\mathrm{kg})(${MS(dv)}) = ${M.qty(dp,3,"kg m/s",{sci:true})}$`,`$\\Delta x = \\dfrac{h}{4\\pi\\Delta p} = \\dfrac{6.626\\times10^{-34}}{4\\pi(${M.qty(dp,4,"kg m/s",{sci:true})})} = ${M.qty(dx,4,"m",{sci:true})} = ${ansTeX(A)}$`],
            answerTeX:`$\\Delta p = ${M.qty(dp,3,"kg m/s",{sci:true})}$, $\\Delta x \\ge ${ansTeX(A)}$`, verify:{values:[K.me*dv,K.h/(4*Math.PI*K.me*dv)*(A.unit==="pm"?1e12:A.unit==="nm"?1e9:A.unit==="μm"?1e6:1)]}}; }
        const v=R.sig(1.0,5.0,3)*1e6; const pc=R.pick([1,2,5,10]); const dv=v*pc/100; const dx=K.h/(4*Math.PI*K.me*dv), A=lenAns(dx);
        return {prompt:`An electron moves at $${MS(v)}$, and its speed is known to within ${pc}%. What is the smallest possible uncertainty in its position, in ${A.word}? Compare it with the Bohr radius, 52.9 pm.`,
          answer:{type:"num",value:A.value,unit:A.unit,sf:3}, hint:`${pc}% of the speed is $\\Delta v$. Then $\\Delta x \\ge h/(4\\pi m\\Delta v)$.`,
          steps:[`$\\Delta v = ${pc/100}\\times${MS(v)} = ${MS(dv)}$`,`$\\Delta x = \\dfrac{h}{4\\pi m_e\\Delta v} = \\dfrac{6.626\\times10^{-34}}{4\\pi(9.109\\times10^{-31})(${MS(dv)})} = ${M.qty(dx,4,"m",{sci:true})} = ${ansTeX(A)}$`,`That is about ${M.toSig(dx/52.9e-12,2)} times $a_0$. ${dx>52.9e-12?"Bigger than the atom: we can't say where in the atom the electron is.":"Smaller than the atom, but only because the speed is so uncertain."}`],
          answerTeX:`$\\Delta x \\ge ${ansTeX(A)}$`, verify:{value:6.626e-34/(4*Math.PI*9.109e-31*dv)*(A.unit==="pm"?1e12:A.unit==="nm"?1e9:A.unit==="μm"?1e6:1)}};
      }},
    {id:"M2C4.g.compare", title:"Wave or particle? Which wavelength is longest?", skill:"Duality evidence; $\\lambda \\propto 1/(mv)$", ref:"pp. 12-14",
      gen(R,d){
        if(d===1){ const E=R.pick([["Light passing through a tiny hole makes a pattern of bright and dark rings on a screen.",0,"Rings come from interference: wave behaviour (p. 12)."],["Light knocks electrons out of a metal instantly, and only above a threshold frequency.",1,"Energy arrives in photons: particle behaviour (p. 6)."],["A beam of electrons passing through a thin metal foil makes rings on a screen.",0,"Diffraction of electrons: electrons behaving as waves (p. 13)."],["An electron microscope forms an image using a beam of electrons.",0,"It works because of the wave properties of electrons (p. 13)."],["Each photon gives all of its energy, $h\\nu$, to a single electron.",1,"A localized bundle of energy: particle behaviour (p. 6)."]]);
          return {prompt:`Which behaviour does this observation show? <br><i>${E[0]}</i>`, answer:{type:"mc",options:["wave behaviour","particle behaviour"],correct:E[1],keep:true},
            hint:"Interference and diffraction patterns mean waves. Energy delivered in single localized bundles means particles.", steps:[E[2]], answerTeX:E[1]?"particle behaviour":"wave behaviour"}; }
        const POOL=[["an electron",K.me,[1e4,5e6]],["a proton",MP,[1e3,1e6]],["a helium atom",4.003*AMU,[200,2000]],["an argon atom",39.95*AMU,[200,800]],["a 0.145 kg baseball",0.145,[10,45]]];
        const k=d===2?3:4; let pick, ps, guard=0;
        do{ pick=R.shuffle(POOL).slice(0,k).map(([n,m,[a,b]])=>{ const v=+M.toSig(Math.pow(10,R.real(Math.log10(a),Math.log10(b),3)),2); return {n,m,v,p:m*v}; }); ps=pick.map(o=>o.p).sort((a,b)=>a-b); guard++; } while(guard<100 && ps.some((p,i)=>i&&p/ps[i-1]<1.6));
        const longest=d===2?true:R.pick([true,false]); const best=pick.reduce((A,B)=>longest?(B.p<A.p?B:A):(B.p>A.p?B:A));
        return {prompt:`Which of these has the ${longest?"longest":"shortest"} de Broglie wavelength?`,
          answer:{type:"mc",options:pick.map(o=>`${o.n} at $${MS(o.v,2)}$`),correct:pick.indexOf(best)},
          hint:`$\\lambda = h/(mv)$: the ${longest?"smallest":"largest"} momentum $mv$ gives the ${longest?"longest":"shortest"} wavelength.`,
          steps:[...pick.map(o=>`${o.n}: $p = mv = ${M.qty(o.p,3,"kg m/s",{sci:true})}$, $\\lambda = ${lenTeX(K.h/o.p)}$`),`The ${longest?"smallest":"largest"} $p$ is ${best.n}.`],
          answerTeX:`${best.n}`};
      }}
  ],
  exam:[
    {id:"M2C4.q1", ref:"p. 13", q:"What is the de Broglie wavelength of an electron moving at $2.50\\times10^{6}$ m s⁻¹?", opts:[
      ["$2.91\\times10^{-10}$ m",true,"$\\lambda = h/(m_e v) = (6.626\\times10^{-34})/[(9.109\\times10^{-31})(2.50\\times10^{6})]$."],["$2.91\\times10^{-13}$ m",false,"The mass was put in grams instead of kilograms."],["$1.58\\times10^{-13}$ m",false,"This uses the proton mass."],["$3.44\\times10^{9}$ m",false,"This is $mv/h$, upside down."],["$7.27\\times10^{-4}$ m",false,"This is the wavelength at 1 m s⁻¹, not $2.50\\times10^{6}$ m s⁻¹."]]},
    {id:"M2C4.q2", ref:"p. 14", q:"Why is diffraction never seen for a moving car?", opts:[
      ["Its de Broglie wavelength is so tiny that no opening could be comparable to it.",true,"About $10^{-38}$ m at everyday speeds (Example 2-5)."],["Cars have no momentum.",false,"A moving car has a large momentum, which is why its wavelength is so small."],["Only charged particles have a de Broglie wavelength.",false,"Any moving mass has one."],["Its de Broglie wavelength is too long.",false,"The bigger $mv$ is, the shorter $\\lambda$ is."],["Diffraction only happens to light.",false,"Electrons diffract too (p. 13)."]]},
    {id:"M2C4.q3", ref:"p. 15", q:"The uncertainty in the position of a particle is made 10 times smaller. What is the smallest possible uncertainty in its momentum now?", opts:[
      ["10 times larger",true,"$\\Delta p \\ge h/(4\\pi\\Delta x)$: $\\Delta p$ goes as $1/\\Delta x$."],["10 times smaller",false,"Position and momentum trade off; they can't both shrink."],["Unchanged",false,"The product has a fixed lower limit, so $\\Delta p$ must grow."],["100 times larger",false,"There is no square in the relationship."],["Zero",false,"$\\Delta p$ can never be zero while $\\Delta x$ is finite."]]},
    {id:"M2C4.q4", ref:"p. 13", q:"Which experiment confirmed de Broglie's idea that electrons have wave properties?", opts:[
      ["A beam of electrons was diffracted by a thin metal foil.",true,"In 1927; the gaps between atoms act as holes."],["Electrons were ejected from a metal by ultraviolet light.",false,"That is the photoelectric effect, which shows light's particle side."],["Hydrogen gas gave off light at only four visible wavelengths.",false,"That shows quantized energies, not electron waves."],["Hot solids glowed with a peaked spectrum.",false,"That is blackbody radiation."],["A beam of H atoms split in two in a magnetic field.",false,"That shows electron spin (p. 32)."]]},
    {id:"M2C4.q5", ref:"p. 15", q:"The position of an electron is known to within 100 pm. What is the smallest possible uncertainty in its speed?", opts:[
      ["$5.79\\times10^{5}$ m s⁻¹",true,"$\\Delta v = h/(4\\pi m_e\\Delta x) = 6.626\\times10^{-34}/[4\\pi(9.109\\times10^{-31})(1.00\\times10^{-10})]$."],["$7.27\\times10^{6}$ m s⁻¹",false,"The $4\\pi$ was left out."],["$1.16\\times10^{6}$ m s⁻¹",false,"This uses $2\\pi$ instead of $4\\pi$."],["$5.27\\times10^{-25}$ m s⁻¹",false,"That is $\\Delta p$ in kg m s⁻¹, not $\\Delta v$."],["579 m s⁻¹",false,"This uses 100 nm instead of 100 pm."]]},
    {id:"M2C4.q6", ref:"p. 15", q:"What does the uncertainty principle mean for describing electrons in atoms?", opts:[
      ["We can't know an electron's exact path, so we describe where it most probably is.",true,"That is the shift to probability on p. 15."],["Electrons move on exact circular orbits that we can't measure yet.",false,"There is no exact path to measure."],["Electrons have no momentum inside an atom.",false,"They have momentum; it just can't be known exactly together with position."],["Better instruments will eventually remove the uncertainty.",false,"The limit comes from nature, not from poor instruments."],["Newton's laws describe electrons exactly once the uncertainty is included.",false,"The notes say Newton's laws become useless for atoms."]]}
  ],
  steps:[
    {type:"read", title:"Light behaves as a wave in some experiments and as particles in others", ref:"p. 12", body:"<p>Einstein showed that light has a <b>wave-particle duality</b>:</p><ul><li><b>Diffraction</b>: light through a small hole spreads into bright and dark rings. Only waves interfere like that, so light is a wave.</li><li><b>The photoelectric effect</b>: light delivers its energy in single photons, $h\\nu$ each. So light is particles.</li></ul><p>Diffraction only shows up when the hole or slit is about as big as the wavelength. Ocean waves bend around a gap between rocks; they don't bend noticeably around a city block.</p>"},
    {type:"read", title:"de Broglie: anything that moves has a wavelength", ref:"p. 13", body:"<p>In 1924 de Broglie turned the argument around: if light can act like particles, particles should act like waves. A particle of mass $m$ moving at speed $v$ has momentum $p = mv$ and a wavelength</p><div class=\"box def\"><b class=\"t\">de Broglie wavelength (p. 13)</b>$$\\lambda_{dB} = \\frac{h}{p} = \\frac{h}{mv}$$ Use SI units: kg, m s⁻¹, J s. Then $\\lambda$ comes out in metres.</div><p>Because $h$ is so small, $\\lambda$ is only noticeable when $mv$ is tiny, as for an electron. In 1927 a beam of electrons was diffracted by a thin metal foil, with the gaps between atoms acting as the holes. Electron microscopes use this wave behaviour every day.</p>"},
    {type:"example", title:"An electron and a tennis ball", ref:"p. 14 (like Example 2-5)", ex:{q:"Find the de Broglie wavelength of (a) an electron moving at $1.20\\times10^{6}$ m s⁻¹ and (b) a 57.0 g tennis ball moving at 50.0 m s⁻¹.", steps:[
      {t:"(a) $\\lambda = \\dfrac{h}{m_e v} = \\dfrac{6.626\\times10^{-34}\\ \\mathrm{J\\,s}}{(9.109\\times10^{-31}\\ \\mathrm{kg})(1.20\\times10^{6}\\ \\mathrm{m\\,s^{-1}})}$",why:"1 J s = 1 kg m² s⁻¹, so the answer is in m."},
      {t:"$\\lambda = 6.06\\times10^{-10}\\ \\mathrm{m} = 606\\ \\mathrm{pm}$",why:"A few times the size of an atom: atoms in a crystal can diffract it."},
      {t:"(b) $m = 57.0\\ \\mathrm{g} = 0.0570\\ \\mathrm{kg}$",why:"The mass must be in kg."},
      {t:"$\\lambda = \\dfrac{6.626\\times10^{-34}}{(0.0570)(50.0)} = 2.32\\times10^{-34}\\ \\mathrm{m}$",why:"About $10^{24}$ times smaller than an atom. No hole could ever be that small, so the ball never shows wave behaviour."}], ans:"(a) $6.06\\times10^{-10}$ m (606 pm); (b) $2.32\\times10^{-34}$ m."}},
    {type:"try", title:"de Broglie wavelength", gen:"M2C4.g.db-lambda"},
    {type:"explore", title:"Compare wavelengths across sizes", fig:"dbcalc", ref:"pp. 13-14", body:"<p>Pick the electron and slide its speed. Around $10^{6}$ to $10^{7}$ m s⁻¹ its wavelength is about the size of an atom: that is the range electron diffraction and electron microscopes use. Now pick the car. No speed brings its wavelength anywhere near the ruler's landmarks.</p>"},
    {type:"mcq", title:"Why electrons, not baseballs", q:"Why does wave behaviour matter for electrons in atoms but not for a thrown baseball?", opts:[["An electron's mass is so small that its wavelength is comparable to the size of an atom.",true,"$\\lambda = h/(mv)$ is only large when $mv$ is tiny."],["Baseballs travel too slowly to have a wavelength.",false,"Slower would actually make the wavelength longer; the huge mass is what makes it tiny."],["Only charged objects have a de Broglie wavelength.",false,"Any moving mass has one."]], after:"The notes put it this way (p. 13): a complete description of an electron in an atom must include wave-particle duality."},
    {type:"read", title:"An electron is neither a wave nor a particle", ref:"p. 13", body:"<p>How can one thing be a spread-out wave and a localized particle? The notes' answer: it is neither. It is something else, and our brains, built for everyday objects, have no picture for it.</p><p>Think of a cone in a closed box. Look through a hole in the top and you see a circle. Look through a hole in the side and you see a triangle. Both views are honest, and neither is the whole object. Waves and particles are two views of the electron, and which one you see depends on the experiment.</p>"},
    {type:"explore", title:"Fit a wave around an orbit", fig:"ring", ref:"pp. 9-13", body:"<p>This connects two formulas from the notes (the connection itself is not in the notes). A wave that runs around a circle must meet itself in step after one lap, so the circumference must hold a whole number of wavelengths: $2\\pi r = n\\lambda$. Put in $\\lambda = h/(mv)$ and you get Bohr's $mvr = n(h/2\\pi)$. The quantization Bohr had to assume falls out of the wave idea.</p>"},
    {type:"try", title:"Speed for a given wavelength", gen:"M2C4.g.db-speed"},
    {type:"read", title:"Position and momentum can't both be known exactly", ref:"p. 15", body:"<p>Heisenberg realized that measuring a system disturbs it. For example (an illustration, not from the notes), to see where an electron is you have to bounce something off it, such as a photon, and that kick changes its momentum by an amount you can't know. His result:</p><div class=\"box def\"><b class=\"t\">Uncertainty principle (p. 15)</b>$$\\Delta x\\,\\Delta p \\ge \\frac{h}{4\\pi} \\qquad \\Delta p = m\\,\\Delta v$$</div><p>It's like finding a ball in a dark room by throwing tennis balls at it: the moment you hear a hit, you know where it was, but you've also knocked it somewhere new.</p><p>So an electron has no exact trajectory we could ever know, and Newton's laws are no use for atoms. Quantum theory asks a different question: <b>what is the most probable behaviour?</b></p>"},
    {type:"example", title:"How uncertain is an electron's speed in an atom?", ref:"p. 15", ex:{q:"An electron is confined to a region with $\\Delta x = 50.0$ pm, about the size of a hydrogen atom. What is the smallest possible uncertainty in its speed?", steps:[
      {t:"$\\Delta x = 50.0\\ \\mathrm{pm} = 5.00\\times10^{-11}\\ \\mathrm{m}$",why:"SI units."},
      {t:"$\\Delta p \\ge \\dfrac{h}{4\\pi\\Delta x} = \\dfrac{6.626\\times10^{-34}\\ \\mathrm{J\\,s}}{4\\pi(5.00\\times10^{-11}\\ \\mathrm{m})} = 1.055\\times10^{-24}\\ \\mathrm{kg\\,m\\,s^{-1}}$",why:"The smallest value is the equals case."},
      {t:"$\\Delta v = \\dfrac{\\Delta p}{m_e} = \\dfrac{1.055\\times10^{-24}}{9.109\\times10^{-31}\\ \\mathrm{kg}} = 1.16\\times10^{6}\\ \\mathrm{m\\,s^{-1}}$",why:"$\\Delta p = m\\Delta v$."},
      {t:"An uncertainty of more than a million metres per second.",why:"That is comparable to the speed itself: Bohr's model puts the $n = 1$ electron at about $2.2\\times10^{6}$ m s⁻¹ (standard value, not from the notes). So tracking a path is hopeless."}], ans:"$\\Delta v \\ge 1.16\\times10^{6}$ m s⁻¹."}},
    {type:"explore", title:"Squeeze the position, lose the speed", fig:"hup", ref:"pp. 10-15", body:"<p>Drag the point along the electron line. Every factor of 10 you gain in position costs a factor of 10 in speed. The proton line sits lower because its mass is about 1800 times larger: the same $\\Delta p$ means a much smaller $\\Delta v$.</p>"},
    {type:"try", title:"Uncertainty principle", gen:"M2C4.g.uncertainty"},
    {type:"firstline", title:"Find the first mistake", q:"A student finds the de Broglie wavelength of a helium atom (4.003 g mol⁻¹) moving at 1500 m s⁻¹:", lines:["Mass of one atom: $m = \\dfrac{4.003\\ \\mathrm{g\\,mol^{-1}}}{6.022\\times10^{23}\\ \\mathrm{mol^{-1}}} = 6.647\\times10^{-24}$ g","$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626\\times10^{-34}}{(6.647\\times10^{-24})(1500)}$","$\\lambda = 6.65\\times10^{-14}$ m"], wrong:1, why:"The mass must be in kilograms: $6.647\\times10^{-27}$ kg. Then $\\lambda = 6.65\\times10^{-11}$ m = 66.5 pm."},
    {type:"try", title:"Wavelength from kinetic energy", gen:"M2C4.g.from-ke"},
    {type:"formulas", title:"Formulas to know"}
  ]
});
})();
