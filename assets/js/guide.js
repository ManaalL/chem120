/* Ev: the study guide for CHEM 120 Interactive.
   Ev is an electron on the hydrogen energy levels (E_n = -R_H/n^2, Module 2, p. 10). Drag Ev up or down a level, or use the arrow keys,
   and the photon it absorbs or emits appears with its wavelength and colour. Tap Ev to open the chat. The chat works offline: it searches the
   formulas, glossary, chapters and practice questions in studydata.js and links back to the chapter.
   Optional: a Claude API key (saved only in this browser) lets Ev explain things in its own words. */
(function(){
"use strict";
const M=window.C120||{}; const C=M.COURSE||{modules:[]};
const esc=M.esc||(s=>String(s)), rich=M.rich||(s=>esc(s));
const PAGE_UNIT=(document.documentElement.getAttribute("data-unit")||"").trim();
const APIKEY="c120.claude-key", MODELKEY="c120.claude-model";

/* ---------- the character ---------- */
function evSVG(size=40){
  return `<svg class="ev-svg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="var(--paper)" stroke="var(--accent)" stroke-width="2.4"/><circle cx="20" cy="20" r="11" fill="none" stroke="var(--accent)" stroke-width=".8" stroke-dasharray="1.8 1.6"/><text x="20" y="25" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-style="italic" font-weight="600" font-size="15" fill="var(--head)">e</text><text x="27" y="17" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--accent)">−</text></svg>`;
}
window.EV_SVG=evSVG;

const css=`
.tan-dock{position:fixed;left:14px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:45;width:270px;height:112px;pointer-events:none;font-family:var(--mono)}
.tan-dock::before{content:"";position:absolute;inset:20px 0 0 0;border-radius:12px;background:color-mix(in srgb,var(--paper) 86%,transparent);border:1px solid var(--rule);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:0 8px 24px -14px rgba(20,48,43,.45)}
.tan-dock svg.track{position:absolute;left:0;top:20px;width:100%;height:92px;pointer-events:auto;cursor:pointer;overflow:visible}
.tan-dock svg.track line.lv{stroke:var(--fig-stroke);stroke-width:1.2} .tan-dock svg.track text{font:400 9px var(--mono);fill:var(--ink2)} .tan-dock svg.track path.ph{fill:none;stroke-width:1.8} .tan-dock svg.track line.arr{stroke:var(--ink2);stroke-width:1;stroke-dasharray:2 2}
.tan-dock svg.track path.c{fill:none;stroke:var(--fig-stroke);stroke-width:1.6}
.tan-dock svg.track line.ax{stroke:var(--rule);stroke-width:1}
.tan-dock svg.track line.tl{stroke:var(--accent);stroke-width:1.4;stroke-dasharray:3 2}
.tan-me{position:absolute;left:0;top:0;width:40px;height:40px;padding:0;border:0;background:none;cursor:grab;pointer-events:auto;touch-action:none;transform:translate(-20px,-20px)}
.tan-me:active{cursor:grabbing}
.tan-me:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:50%}
.tan-ro{position:absolute;right:10px;top:26px;text-align:right;line-height:1.35;font-size:10.5px;color:var(--ink2);letter-spacing:.03em;pointer-events:none}
.tan-ro b{color:var(--accent);font-weight:500}
.tan-cap{position:absolute;left:0;bottom:108px;font-size:10.5px;line-height:1.3;color:var(--ink2);background:var(--paper);border:1px solid var(--rule);border-radius:6px;padding:3px 7px;white-space:nowrap;opacity:0;transform:translateY(4px);transition:opacity .3s,transform .3s;pointer-events:none}
.tan-dock.show-cap .tan-cap,.tan-dock:hover .tan-cap{opacity:1;transform:none}
.tan-panel{position:fixed;left:18px;bottom:calc(122px + env(safe-area-inset-bottom,0px));z-index:60;width:min(400px,calc(100vw - 36px));height:min(600px,calc(100vh - 150px));background:var(--paper);color:var(--ink);border:1px solid var(--rule);border-radius:12px;box-shadow:0 18px 50px rgba(15,50,42,.28);display:none;flex-direction:column;overflow:hidden;font-family:var(--sans);font-size:15.5px;line-height:1.45}
.tan-panel.open{display:flex}
.tan-hd{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--accentSoft);border-bottom:1px solid var(--rule)}
.tan-hd b{font-family:var(--display);font-size:1.12rem;color:var(--head);display:block;line-height:1.1;font-weight:600}
.tan-hd span{font:400 .72rem var(--mono);color:var(--ink2);letter-spacing:.03em;text-transform:uppercase}
.tan-hd button{background:none;border:0;font-size:1.2rem;cursor:pointer;color:var(--ink2);padding:4px 8px;border-radius:8px}
.tan-hd .tan-gear{margin-left:auto;font-size:.82rem;font-family:var(--mono)}
.tan-hd button:hover{background:color-mix(in srgb,var(--accent) 14%,transparent)}
.tan-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.tan-msg{max-width:94%;padding:9px 12px;border-radius:12px;word-wrap:break-word}
.tan-msg.tan{background:var(--fig-soft);border:1px solid var(--rule);border-bottom-left-radius:4px;align-self:flex-start}
.tan-msg.me{background:var(--accent);color:var(--accentInk);border-bottom-right-radius:4px;align-self:flex-end}
.tan-msg p{margin:0 0 6px}.tan-msg p:last-child{margin:0}
.tan-msg ul{margin:4px 0 6px;padding-left:18px}
.tan-card{background:var(--paper);border:1px solid var(--rule);border-radius:8px;padding:8px 10px;margin-top:6px;overflow-x:auto}
.tan-card .t{font-weight:700;color:var(--head)}
.tan-card .src{font:400 .7rem var(--mono);color:var(--ink2);margin:1px 0 4px;letter-spacing:.02em}
.tan-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.tan-actions a,.tan-actions button{font:600 .82rem var(--sans);border:1px solid var(--rule);background:var(--paper);color:var(--accent);border-radius:12px;padding:3px 9px;cursor:pointer;text-decoration:none}
.tan-actions a:hover,.tan-actions button:hover{border-color:var(--accent)}
.tan-opt{display:block;width:100%;text-align:left;margin:5px 0 0;padding:7px 10px;border:1px solid var(--rule);background:var(--paper);border-radius:8px;cursor:pointer;font:inherit;color:var(--ink)}
.tan-opt:hover:not([disabled]){border-color:var(--accent)}
.tan-opt.right{background:var(--okSoft);border-color:var(--ok)}.tan-opt.wrong{background:var(--badSoft);border-color:var(--bad)}
.tan-chips{display:flex;gap:6px;flex-wrap:wrap;padding:8px 12px 0}
.tan-chips button{font:600 .8rem var(--sans);border:1px solid var(--rule);background:var(--paper);color:var(--accent);border-radius:14px;padding:4px 10px;cursor:pointer}
.tan-in{display:flex;gap:6px;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--rule)}
.tan-in input{flex:1;min-width:0;border:1px solid var(--rule);border-radius:10px;padding:8px 11px;font:inherit;background:var(--paper);color:var(--ink)}
.tan-in button{border:0;background:var(--accent);color:var(--accentInk);border-radius:10px;padding:0 14px;font:700 .95rem var(--sans);cursor:pointer}
.tan-set{padding:12px;border-bottom:1px solid var(--rule);background:var(--fig-soft);font-size:.9rem;display:none}
.tan-set.open{display:block}
.tan-set input{width:100%;margin:6px 0;border:1px solid var(--rule);border-radius:8px;padding:6px 8px;font:inherit;background:var(--paper);color:var(--ink)}
.tan-set button{border:1px solid var(--rule);background:var(--paper);border-radius:8px;padding:4px 10px;cursor:pointer;font:600 .85rem var(--sans);color:var(--accent)}
.tan-typing{display:inline-flex;gap:3px}.tan-typing i{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:tandot 1s infinite}.tan-typing i:nth-child(2){animation-delay:.15s}.tan-typing i:nth-child(3){animation-delay:.3s}
@keyframes tandot{0%,100%{opacity:.25}50%{opacity:1}}
.tan-msg .prob{margin:6px 0 0;padding:12px}
@media (max-width:600px){ body{padding-bottom:76px} .tan-dock{width:52px;height:52px;left:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px))} .tan-dock::before{inset:0;border-radius:50%} .tan-dock svg.track,.tan-ro,.tan-cap{display:none} .tan-me{left:26px!important;top:26px!important;width:40px;height:40px;transform:translate(-20px,-20px)} .tan-panel{left:8px;right:8px;width:auto;bottom:calc(84px + env(safe-area-inset-bottom,0px));height:min(72vh,580px)} }
@media (prefers-reduced-motion: reduce){ .tan-typing i{animation:none} }
`;

/* ---------- search over the course material ---------- */
const STOP=new Set("a an the of and or to in on for is are was were be been it its this that these those with by as at from what which who why how when where does do did can could should would will may might must about into than then there their they them your you i me my we our us not no yes vs versus difference explain describe define definition mean means meaning tell give show please ev help some any all each other also more most very just like find formula rule".split(" "));
const SYN={photons:"photon",light:"photon",wavelengths:"wavelength",frequencies:"frequency",orbitals:"orbital",nodes:"node",nodal:"node",configurations:"configuration",config:"configuration",electrons:"electron","e-":"electron",ions:"ion",moles:"mole",mol:"mole",molarity:"concentration",concentrations:"concentration",yields:"yield",limiting:"limiting",reagent:"reactant",reagents:"reactant",reactants:"reactant",precipitate:"precipitation",precipitates:"precipitation",insoluble:"solubility",soluble:"solubility",solubilities:"solubility",acids:"acid",bases:"base",vsepr:"vsepr",shapes:"shape",geometry:"shape",geometries:"shape",dipoles:"dipole",polarity:"polar",lewis:"lewis",resonance:"resonance",formal:"formal",electronegativity:"electronegativity",en:"electronegativity",ea:"affinity",ie:"ionization",ionisation:"ionization",radii:"radius",radius:"radius",bohr:"bohr",rydberg:"bohr",broglie:"broglie",heisenberg:"uncertainty",schrodinger:"schrodinger",quantum:"quantum",spin:"spin",hund:"hund",pauli:"pauli",aufbau:"aufbau",paramagnetic:"paramagnetic",diamagnetic:"diamagnetic",lattice:"lattice",bonds:"bond",bonding:"bond","%ae":"atom",economy:"economy",efactor:"factor"};
function stem(w){ if(SYN[w]) return SYN[w]; if(w.length>5&&w.endsWith("ies")) return w.slice(0,-3)+"y"; if(w.length>4&&w.endsWith("s")&&!/(ss|us|is)$/.test(w)) return w.slice(0,-1); if(w.length>6&&w.endsWith("ing")) return w.slice(0,-3); return w; }
function plain(s){ return String(s||"").replace(/\$[^$]*\$/g,m=>" "+m.replace(/\\(frac|left|right|cdot|qquad|quad|text|mathrm|operatorname)/g," ").replace(/\\([a-zA-Z]+)/g," $1 ").replace(/[{}$^_\\]/g," ")+" ").replace(/<[^>]+>/g," "); }
function toks(s){ return plain(s).toLowerCase().replace(/[^a-z0-9/ ]+/g," ").split(/\s+/).filter(w=>w&&!STOP.has(w)).map(stem).filter(w=>w.length>1||/\d/.test(w)); }
const DOCS=[];
function add(d){ d.tt=toks(d.title); d.bt=toks(d.text); DOCS.push(d); }
(M.chapters||[]).forEach(L=>{
  (L.formulas||[]).forEach(f=>add({kind:"formula",title:f.name,text:(f.note||"")+" "+(f.kind||"")+" "+plain("$"+f.tex+"$"),tex:f.tex,lec:L.id,ref:f.ref,id:f.id}));
  (L.glossary||[]).forEach(g=>add({kind:"term",title:g.term,text:g.def,lec:L.id,ref:g.ref}));
  (L.steps||[]).forEach((s,i)=>{ if(s.type==="read"||s.type==="explore") add({kind:"idea",title:s.title,text:s.body||"",lec:L.id,step:i,ref:s.ref}); });
  Object.entries(L.figures||{}).forEach(([k,f])=>{ if(f.model) add({kind:"model",title:f.title||k,text:f.cap||"",lec:L.id,step:Math.max(0,(L.steps||[]).findIndex(s=>s.fig===k)),ref:f.ref}); });
  add({kind:"lecture",title:`Chapter ${L.num} ${L.title}`,text:L.summary+" "+(L.sections||[]).join(" "),lec:L.id});
});
(M.extras&&M.extras.review||[]).forEach(r=>add({kind:"review",title:plain(r.q).slice(0,140),text:plain((r.opts||[]).filter(o=>o[1]).map(o=>o[0]+" "+(o[2]||"")).join(" ")+" "+(r.a||"")),lec:r.lec,src:r.src||"Sample test",q:r.q,a:(r.opts||[]).filter(o=>o[1]).map(o=>o[0]).join("; ")+(r.opts&&r.opts.some(o=>o[2])?": "+r.opts.filter(o=>o[1]).map(o=>o[2]).join(" "):""),id:r.id}));
(M.extras&&M.extras.examples||[]).forEach(r=>add({kind:"review",title:plain(r.q).slice(0,140),text:plain((r.sol||[]).join(" ")+" "+r.ans),lec:r.lec,src:r.src,q:r.q,a:r.ans,id:r.id}));
const DF={}; DOCS.forEach(d=>new Set([...d.tt,...d.bt]).forEach(t=>DF[t]=(DF[t]||0)+1));
const idf=t=>Math.log(1+DOCS.length/((DF[t]||0)+.5));
function search(q,n=5){
  const qt=[...new Set(toks(q))]; if(!qt.length) return [];
  return DOCS.map(d=>{ let s=0,hit=0; qt.forEach(t=>{ const inT=d.tt.includes(t), cb=d.bt.filter(x=>x===t).length; if(inT||cb) hit++; s+=idf(t)*((inT?3:0)+Math.min(2,cb)*.6); });
    if(d.kind==="formula") s*=1.15; if(d.kind==="lecture") s*=.6; if(d.kind==="review") s*=.8;
    const L=M.chap&&M.chap(d.lec); if(PAGE_UNIT&&L&&L.module===PAGE_UNIT) s*=1.1;
    s*=(.45+.55*hit/qt.length); return {d,s}; }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,n);
}
window.EV_SEARCH=search;

/* ---------- UI ---------- */
let panel,log,input,setBox,built=false,hist=[];
const RH=2.179e-18, HPL=6.626e-34, CL=2.998e8;
const lam=(ni,nf)=>HPL*CL/Math.abs(RH*(1/(nf*nf)-1/(ni*ni)))*1e9; // nm
function lamColour(nm){ if(nm<380) return ["var(--ink2)","ultraviolet"]; if(nm>750) return ["var(--ink2)","infrared"]; const c=nm<450?"#7b4fd6":nm<495?"#2f6fd6":nm<520?"#1fa3a8":nm<565?"#3b9a3b":nm<590?"#c9a417":nm<625?"#e07a1f":"#d23b2b"; const n=nm<450?"violet":nm<495?"blue":nm<520?"cyan":nm<565?"green":nm<590?"yellow":nm<625?"orange":"red"; return [c,n]; }
function dock(){
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  const d=document.createElement("div"); d.className="tan-dock";
  d.innerHTML=`<div class="tan-cap">Ev, an electron in hydrogen · drag me between levels, or tap to ask</div><svg class="track" viewBox="0 0 270 92" preserveAspectRatio="none" aria-hidden="true"></svg><button class="tan-me" type="button" aria-label="Ev, your study guide: an electron in a hydrogen atom. Click to ask a question. Up and down arrow keys move Ev between energy levels.">${evSVG(40)}</button><div class="tan-ro"></div>`;
  const svg=d.querySelector("svg.track"), me=d.querySelector(".tan-me"), ro=d.querySelector(".tan-ro");
  const NMAX=6; let W=270,H=92;
  /* level heights follow E_n = -R_H/n^2: n = 1 at the bottom, the rest crowd toward 0 at the top */
  const yOf=n=>{ const e=-1/(n*n); return 8+(H-16)*(-e); };
  const LX0=26, LX1=118;
  let n=2, y=yOf(2), drag=false, moved=false, idle=0, phT=0, ph=null, last=performance.now();
  function draw(){
    const r=svg.getBoundingClientRect(); W=r.width||270; H=r.height||92; svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
    let g=""; for(let k=1;k<=NMAX;k++){ const yy=yOf(k); g+=`<line class="lv" x1="${LX0}" y1="${yy}" x2="${LX1}" y2="${yy}" style="stroke-opacity:${k===n?1:.45}"/>`; if(k<=3) g+=`<text x="${LX0-6}" y="${yy+(k===3?5:3)}" text-anchor="end">n=${k}</text>`; } g+=`<text x="${LX0-6}" y="${yOf(5)-2}" text-anchor="end">4-6</text>`;
    if(ph){ const [col]=lamColour(ph.nm); const y0=ph.y; const len=Math.min(120,W-LX1-14), x0=LX1+4; let p=""; const waves=Math.max(3,Math.min(9,Math.round(2600/ph.nm))); for(let i=0;i<=60;i++){ const t=i/60; p+=(i?"L":"M")+(x0+t*len*ph.k).toFixed(1)+" "+(y0+4*Math.sin(t*waves*Math.PI*2)).toFixed(1); } g+=`<path class="ph" d="${p}" style="stroke:${col};opacity:${(1-Math.max(0,ph.k-0.85)/0.15).toFixed(2)}"/>`; }
    svg.innerHTML=g;
  }
  function place(){ me.style.left=((LX0+LX1)/2)+"px"; me.style.top=(20+y)+"px"; }
  function readout(from,to){
    if(from===to){ ro.innerHTML=`n = <b>${to}</b><br>E = ${(-RH/(to*to)*1e19).toFixed(2)}×10⁻¹⁹ J`; return; }
    const nm=lam(from,to); const [,cn]=lamColour(nm); const em=to<from;
    ro.innerHTML=`${from} → ${to}: <b>${nm<1e4?nm.toFixed(0)+" nm":(nm/1000).toFixed(1)+" μm"}</b><br>${cn}, ${em?"emitted":"absorbed"}`;
  }
  function jump(to){ to=Math.max(1,Math.min(NMAX,to)); const from=n; if(to===from){ y=yOf(n); place(); return; } n=to; const nm=lam(from,to); ph={nm,y:(yOf(from)+yOf(to))/2,k:reduce?1:0}; readout(from,to); y=yOf(n); place(); draw(); idle=0; }
  function tick(t){
    const dt=Math.min(.05,(t-last)/1000); last=t;
    if(ph && ph.k<1 && !reduce){ ph.k=Math.min(1.15,ph.k+dt*1.6); draw(); if(ph.k>=1.15){ ph=null; draw(); } }
    if(!drag && !reduce && !(panel&&panel.classList.contains("open"))){ idle+=dt; if(idle>6){ idle=0; jump(n>1?n-1:3); } }
    requestAnimationFrame(tick);
  }
  me.addEventListener("pointerdown",e=>{ me.setPointerCapture(e.pointerId); drag=true; moved=false; idle=0; d.sy=e.clientY; d.sn=n; });
  me.addEventListener("pointermove",e=>{ if(!drag) return; if(Math.abs(e.clientY-d.sy)>4) moved=true; if(moved){ const r=svg.getBoundingClientRect(); y=Math.max(4,Math.min(H-4,e.clientY-r.top)); place(); d.classList.add("show-cap"); } });
  me.addEventListener("pointerup",()=>{ drag=false; d.classList.remove("show-cap"); if(!moved){ toggle(); return; } let best=1,bd=1e9; for(let k=1;k<=NMAX;k++){ const dd=Math.abs(yOf(k)-y); if(dd<bd){ bd=dd; best=k; } } const from=d.sn; n=from; jump(best); });
  me.addEventListener("click",e=>{ if(e.detail===0) toggle(); });
  me.addEventListener("keydown",e=>{ if(e.key==="ArrowUp"||e.key==="ArrowDown"){ e.preventDefault(); jump(n+(e.key==="ArrowUp"?1:-1)); } });
  window.addEventListener("resize",()=>{ draw(); y=yOf(n); place(); });
  setTimeout(()=>{ draw(); y=yOf(n); place(); readout(n,n); d.classList.add("show-cap"); setTimeout(()=>d.classList.remove("show-cap"),5000); },60);
  requestAnimationFrame(tick);
  return d;
}
function build(){
  if(built) return; built=true;
  const st=document.createElement("style"); st.textContent=css; document.head.append(st);
  const fab=dock();
  panel=document.createElement("section"); panel.className="tan-panel"; panel.setAttribute("aria-label","Ev study guide chat");
  panel.innerHTML=`<div class="tan-hd">${evSVG(36)}<div><b>Ev</b><span>an electron who knows CHEM 120</span></div><button class="tan-gear" type="button" title="Settings" aria-label="Settings">KEY</button><button class="tan-x" type="button" aria-label="Close">×</button></div>
   <div class="tan-set"></div><div class="tan-log" aria-live="polite"></div><div class="tan-chips"></div>
   <form class="tan-in"><input type="text" placeholder="Ask about any formula, rule or idea…" aria-label="Ask Ev a question" autocomplete="off"><button type="submit">Ask</button></form>`;
  document.body.append(fab,panel);
  log=panel.querySelector(".tan-log"); input=panel.querySelector("input"); setBox=panel.querySelector(".tan-set");
  panel.querySelector(".tan-x").onclick=close;
  panel.querySelector(".tan-gear").onclick=settings;
  panel.querySelector("form").addEventListener("submit",e=>{ e.preventDefault(); const q=input.value.trim(); if(!q) return; input.value=""; ask(q); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&panel.classList.contains("open")) close(); });
  const chips=panel.querySelector(".tan-chips");
  [["Quiz me",()=>ask("quiz me")],["Give me a problem",()=>ask("give me a problem")],["What should I study?",()=>ask("what should I study?")],["Test 2 countdown",()=>ask("how long until test 2")]].forEach(([t,f])=>{ const b=document.createElement("button"); b.type="button"; b.textContent=t; b.onclick=f; chips.append(b); });
  greet();
}
function open(prefill){ build(); panel.classList.add("open"); if(prefill) ask(prefill); setTimeout(()=>input.focus(),50); }
function close(){ if(panel) panel.classList.remove("open"); }
function toggle(){ build(); panel.classList.contains("open")?close():open(); }
function say(html,who="tan"){ const d=document.createElement("div"); d.className="tan-msg "+who; d.innerHTML=html; log.append(d); log.scrollTop=log.scrollHeight; return d; }
function greet(){
  const U=PAGE_UNIT&&M.mod?M.mod(PAGE_UNIT):null;
  say(`<p>Hi, I'm <b>Ev</b>, an electron in a hydrogen atom. Drag me up or down a level and I'll show you the photon I absorb or emit.</p><p>${U?`You're in Module ${U.n}. Ask me for any formula, rule or idea from it, or from any other module.`:"Ask me for any formula, rule or idea from CHEM 120."} Try "photoelectric effect", "radial nodes", "E-factor", "Hund's rule", "VSEPR T-shaped", or tap a button below.</p>`);
}
function lecLink(lid,step){ return M.chURL?M.chURL(lid,step):"#"; }
function card(d){
  const L=M.chap(d.lec); const src=L?`Chapter ${L.num} · ${M.refText(L.id,d.ref)}`:(d.src||"");
  let body="";
  if(d.kind==="formula") body=`<div>${M.tex(d.tex,true)}</div>${d.text.trim()?`<div class="small">${rich((M.formula(d.id)||{}).note||"")}</div>`:""}`;
  else if(d.kind==="review") body=`<div>${rich(d.q)}</div><details><summary>Answer</summary>${rich(d.a)}</details>`;
  else body=`<div>${rich(String(d.text).slice(0,420))}${String(d.text).length>420?"…":""}</div>`;
  return `<div class="tan-card"><div class="t">${rich(d.kind==="review"?d.src:d.title)}</div><div class="src">${esc(src)}</div>${body}<div class="tan-actions">${L?`<a href="${lecLink(d.lec,d.step)}">Open chapter ${L.num}</a>`:""}</div></div>`;
}
function reply(html){ const el=say(html); el.querySelectorAll("button[data-q]").forEach(b=>b.onclick=()=>ask(b.dataset.q)); hist.push({role:"assistant",content:el.textContent.slice(0,600)}); return el; }
function ask(q){
  build(); if(!panel.classList.contains("open")) panel.classList.add("open");
  say(esc(q),"me"); hist.push({role:"user",content:q}); hist=hist.slice(-8);
  const lq=q.toLowerCase().trim();
  if(/^(hi|hey|hello|yo)\b/.test(lq)&&lq.length<20) return reply(`<p>Hi. What are you working on?</p>`);
  if(/\b(thanks|thank you|ty)\b/.test(lq)&&lq.length<30) return reply(`<p>Any time.</p>`);
  if(/what can you do|how do you work|^help$/.test(lq)) return reply(`<p>I can:</p><ul><li>Find any formula, constant, rule or definition, with the module and page</li><li>Point you to the 3D model for a topic</li><li>Quiz you with a multiple choice question</li><li>Give you a problem with new numbers</li><li>Tell you what to study, based on your results</li><li>Count down to Test 2</li></ul><p>${key()?"You added a Claude key, so I also explain things in my own words.":"With a Claude API key (KEY, above) I can also explain things in my own words."}</p>`);
  if(/quiz me|test me|ask me a question/.test(lq)) return quiz();
  if(/give me a problem|practice problem|another problem|new problem/.test(lq)) return problem();
  if(/what should i (study|review|learn|focus)|weak|relearn|struggl/.test(lq)) return reply(plan());
  if(/midterm|countdown|how long|days until|when is/.test(lq)&&/midterm|exam|test|countdown/.test(lq)) return reply(countdown());
  if(/test ?2/.test(lq)&&/when|how long|countdown|date/.test(lq)) return reply(countdown());
  return answer(q);
}
function answer(q){
  const hits=search(q,6);
  if(key()) return ai(q,hits);
  if(!hits.length||hits[0].s<2) return reply(`<p>I couldn't find that in the course notes. Try one key word from your notes, like "work function", "radial node", "limiting reactant", "Hund", "formal charge" or "dipole".</p>`);
  const top=hits[0]; const rel=hits.slice(1).filter(x=>x.s>top.s*.35&&x.d.title!==top.d.title).slice(0,3);
  const second=rel.find(x=>x.d.kind===top.d.kind&&x.s>top.s*.7);
  return reply(card(top.d)+(second?card(second.d):"")+(rel.length?`<div class="tan-actions" style="margin-top:8px"><span class="small muted" style="align-self:center">Related:</span>${rel.filter(x=>x!==second).map(x=>`<button type="button" data-q="${esc(plain(x.d.title).trim())}">${esc(plain(x.d.title).trim().slice(0,40))}</button>`).join("")}</div>`:""));
}
function pool(){ const out=[]; (M.chapters||[]).forEach(L=>{ if(PAGE_UNIT&&L.module!==PAGE_UNIT) return; (L.exam||[]).forEach(x=>out.push({...x,lec:L.id})); }); if(!out.length) (M.chapters||[]).forEach(L=>(L.exam||[]).forEach(x=>out.push({...x,lec:L.id}))); return out; }
function quiz(){
  const P=pool(); if(!P.length) return reply("<p>No questions loaded yet.</p>");
  const q=P[Math.floor(Math.random()*P.length)]; const L=M.chap(q.lec);
  const el=say(`<p class="small muted">Chapter ${L.num}${q.multi?" · select all that apply":""}</p><p><b>${rich(q.q)}</b></p>`);
  const order=M.shuffle(q.opts.map((o,i)=>i)); const chosen=new Set();
  const finish=()=>{ el.querySelectorAll(".tan-opt").forEach(b=>{ b.disabled=true; const i=+b.dataset.i; if(q.opts[i][1]) b.classList.add("right"); else if(chosen.has(i)) b.classList.add("wrong"); });
    const ok=window.EXAM?EXAM.correctMC(q,q.multi?[...chosen]:[...chosen][0]):false;
    const why=q.opts.filter(o=>o[1]).map(o=>o[2]).filter(Boolean).join(" ");
    reply(`<p><b>${ok?"Yes.":"Not quite."}</b> ${rich(why)}</p><div class="tan-actions">${ok?"":`<a href="${lecLink(q.lec)}">Review chapter ${L.num}</a>`}<button type="button" data-q="quiz me">Another one</button></div>`); };
  order.forEach(i=>{ const b=document.createElement("button"); b.type="button"; b.className="tan-opt"; b.dataset.i=i; b.innerHTML=rich(q.opts[i][0]); b.onclick=()=>{ if(q.multi){ chosen.has(i)?chosen.delete(i):chosen.add(i); b.style.borderColor=chosen.has(i)?"var(--accent)":""; } else { chosen.add(i); finish(); } }; el.append(b); });
  if(q.multi){ const c=document.createElement("button"); c.type="button"; c.className="tan-opt"; c.style.textAlign="center"; c.style.fontWeight="700"; c.textContent="Check"; c.onclick=()=>{ c.remove(); finish(); }; el.append(c); }
  log.scrollTop=log.scrollHeight;
}
function problem(){
  if(!window.ENGINE) return reply(`<p>Problems open on the module pages and in the <a href="gym.html">Practice gym</a>.</p>`);
  const gids=[]; (M.chapters||[]).forEach(L=>{ if(PAGE_UNIT&&L.module!==PAGE_UNIT) return; (L.gens||[]).forEach(g=>gids.push(g.id)); });
  if(!gids.length) return reply("<p>No problems loaded on this page.</p>");
  const el=say(""); ENGINE.problem(el,{gid:gids[Math.floor(Math.random()*gids.length)],diff:2});
  const a=document.createElement("div"); a.className="tan-actions"; a.innerHTML=`<button type="button" data-q="give me a problem">Another problem</button>`; a.querySelector("button").onclick=()=>ask("give me a problem"); el.append(a);
  log.scrollTop=log.scrollHeight;
}
function weak(){
  const db=M.db(); const by={};
  const add=(lid,r,t,w=1)=>{ if(!lid) return; by[lid]=by[lid]||{lid,right:0,total:0,shaky:0}; by[lid].right+=r; by[lid].total+=t; };
  Object.values(db.exam||{}).forEach(e=>Object.entries(e.topics||{}).forEach(([lid,t])=>add(lid,t.right,t.total)));
  Object.entries(db.stats||{}).forEach(([gid,s])=>add(gid.split(".")[0],s.fr,s.ft));
  Object.entries(db.review||{}).forEach(([rid,v])=>{ const r=(M.extras.review||[]).find(x=>x.id===rid)||(M.extras.examples||[]).find(x=>x.id===rid)||((db.rlec||{})[rid]?{lec:db.rlec[rid]}:null); if(r&&r.lec&&(v==="shaky"||v==="no")){ by[r.lec]=by[r.lec]||{lid:r.lec,right:0,total:0,shaky:0}; by[r.lec].shaky+=v==="no"?2:1; } });
  return Object.values(by).filter(t=>M.chap(t.lid)).map(t=>({...t,w:(t.total?(1-t.right/t.total)*Math.min(t.total,12):0)+t.shaky})).filter(t=>t.w>0).sort((a,b)=>b.w-a.w);
}
window.EV_WEAK=weak;
function plan(){
  const w=weak().slice(0,5);
  if(!w.length) return `<p>I don't have results for you yet. Try some problems, a mini exam, or rate yourself on the sample tests on the <a href="midterm.html#samples">Test 2 prep</a> page, and I'll tell you where to go back to.</p>`;
  return `<p>Based on your results, go back to these first:</p><ul>${w.map(t=>{ const L=M.chap(t.lid); return `<li><a href="${lecLink(t.lid)}">${L.num} ${rich(L.title)}</a> <span class="small muted">(${t.total?`${t.right} of ${t.total} right first try`:""}${t.shaky?`${t.total?", ":""}rated shaky or no idea`:""})</span></li>`; }).join("")}</ul><p>The full plan is on the <a href="midterm.html#plan">Test 2 prep</a> page.</p>`;
}
function countdown(){
  const T=C.test; if(!T) return "<p>No test date set.</p>";
  let p={}; try{ p=(M.db().prefs.test2)||{}; }catch(e){}
  const at=new Date((p.date||T.date)+"T"+(p.time||T.time)); const ms=at-new Date();
  if(ms<0) return `<p>${esc(T.label)} was on ${at.toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}.</p>`;
  const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5);
  return `<p><b>${d} day${d===1?"":"s"} and ${h} hour${h===1?"":"s"}</b> until ${esc(T.label)}: ${at.toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}, ${at.toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"})}. Assumed coverage: ${esc(T.covers)}.</p><div class="tan-actions"><a href="midterm.html">Open Test 2 prep</a></div>`;
}

/* ---------- optional Claude key ---------- */
function key(){ try{ return localStorage.getItem(APIKEY)||""; }catch(e){ return ""; } }
function settings(){
  setBox.classList.toggle("open"); const k=key();
  setBox.innerHTML=`<b>Answers in Ev's own words (optional)</b><p style="margin:4px 0">Ev searches the site's course material by default. If you add a Claude API key, Ev also writes explanations in plain language, based on the matching chapters. The key is saved only in this browser and sent only to Anthropic. Don't do this on a shared computer.</p>
   ${k?`<p style="margin:4px 0">A key is saved (ending …${esc(k.slice(-4))}).</p><button type="button" data-a="rm">Remove key</button>`:`<input type="password" placeholder="sk-ant-..." aria-label="Claude API key"><button type="button" data-a="save">Save key</button>`}`;
  const sv=setBox.querySelector('[data-a="save"]'); if(sv) sv.onclick=()=>{ const v=setBox.querySelector("input").value.trim(); if(!/^sk-/.test(v)){ say("<p>That doesn't look like a Claude API key. They start with sk-.</p>"); return; } try{ localStorage.setItem(APIKEY,v); }catch(e){} setBox.classList.remove("open"); say("<p>Key saved. I'll explain things in my own words now.</p>"); };
  const rm=setBox.querySelector('[data-a="rm"]'); if(rm) rm.onclick=()=>{ try{ localStorage.removeItem(APIKEY); }catch(e){} setBox.classList.remove("open"); say("<p>Key removed. Back to searching your notes.</p>"); };
}
function md(s){ return rich(esc(s).replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>")).split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join(""); }
async function ai(q,hits){
  const wait=say(`<span class="tan-typing"><i></i><i></i><i></i></span>`);
  const ctx=hits.slice(0,6).map(x=>{ const L=M.chap(x.d.lec); return `[${x.d.kind}] ${plain(x.d.title)} (${L?M.refText(L.id,x.d.ref):"?"}): ${x.d.kind==="formula"?x.d.tex+" "+x.d.text:plain(x.d.text).slice(0,600)}`; }).join("\n");
  const system=`You are Ev, a study guide for CHEM 120 (University of Waterloo, Fall 2026). Answer using the course material in <notes>. If the notes don't cover it, say so briefly and give a short standard answer marked as beyond the notes. Be plain and concise: 2 to 6 sentences or a short worked example. Use LaTeX between single dollar signs for math, and \\ce{} for chemical formulas. Use the data-sheet constants (h = 6.626e-34 J s, c = 2.998e8 m/s, R_H = 2.179e-18 J, N_A = 6.022e23). Mention the module and page when given. No em dashes. Never invent page numbers.`;
  const msgs=hist.slice(0,-1).slice(-6).map(h=>({role:h.role,content:h.content}));
  msgs.push({role:"user",content:`<notes>\n${ctx||"(no matching notes)"}\n</notes>\n\nQuestion: ${q}`});
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":key(),"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:(localStorage.getItem(MODELKEY)||"claude-haiku-5-5"),max_tokens:700,system,messages:msgs})});
    const data=await r.json(); wait.remove();
    if(!r.ok) throw new Error((data&&data.error&&data.error.message)||("HTTP "+r.status));
    const text=(data.content||[]).filter(c=>c.type==="text").map(c=>c.text).join("\n").trim();
    const top=hits[0]; const L=top&&M.chap(top.d.lec);
    return reply(md(text)+(L?`<div class="tan-actions"><a href="${lecLink(top.d.lec,top.d.step)}">Open chapter ${L.num}</a></div>`:""));
  }catch(err){ wait.remove(); say(`<p>I couldn't reach Claude (${esc(err.message||err)}). Here's what your notes say:</p>`); const k=key(); try{ localStorage.removeItem(APIKEY); }catch(e){} const res=answer(q); try{ localStorage.setItem(APIKEY,k); }catch(e){} return res; }
}

window.GUIDE={open,close,ask,quiz,search,weak};
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",build); else build();
})();
