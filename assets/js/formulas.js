/* CHEM 120 Interactive: formula and constants sheet. Reference, flashcards (Leitner boxes), fill in the blank, readiness per module, and a periodic table. */
(function(){
"use strict";
const M=window.C120, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("formulas");
const app=$("#app");
/* Leitner: box 1..5. Box 1 is due now. A right answer moves a card up one box, a miss sends it back to box 1. */
const INTERVAL_DAYS=[0,0,1,3,7,14]; // index = box
const all=[]; M.chapters.forEach(L=>(L.formulas||[]).forEach(f=>all.push({...f,lec:L.id,unit:L.module,L})));
const box=id=>((M.db().leitner[id]||{}).box||0); // 0 = never seen
function grade(id,ok){ const db=M.db(); const c=db.leitner[id]||{box:0,due:0,seen:0,right:0}; c.seen=(c.seen||0)+1; if(ok){ c.right=(c.right||0)+1; c.box=Math.min(5,Math.max(1,c.box)+1); } else c.box=1; c.due=Date.now()+INTERVAL_DAYS[c.box]*864e5; c.last=Date.now(); db.leitner[id]=c; M.save(); }
const due=id=>{ const c=M.db().leitner[id]; return !c||!c.box||c.due<=Date.now(); };
function readiness(list){ if(!list.length) return 0; return Math.round(list.reduce((s,f)=>s+Math.max(0,box(f.id)-1)/4,0)/list.length*100); }

const hash=new URLSearchParams(location.hash.slice(1));
const UNITS=C.modules.filter(u=>u.chapters.some(id=>M.chap(id)));
const prefs=M.db().prefs.formulas||(M.db().prefs.formulas={units:UNITS.map(u=>u.id),mode:"ref"});
if(hash.get("u")) prefs.units=[hash.get("u")];
prefs.units=prefs.units.filter(u=>UNITS.some(x=>x.id===u)); if(!prefs.units.length) prefs.units=UNITS.map(u=>u.id);
if(hash.get("mode")) prefs.mode=hash.get("mode");

const hero=el("section",{class:"hero slim"});
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px">Formula sheet · ${all.length} formulas, constants and rules from ${M.chapters.length} chapters</p><h1>Every formula and constant, <em>until it sticks</em>.</h1><p class="lede">Look things up with the course-notes page, run flashcards that bring back the ones you miss sooner, or fill in the missing piece. Readiness is the share of each module's cards you have moved up the boxes. The periodic table tab has every element's configuration, mass and trend values.</p></div><div class="card" style="min-width:260px"><b>Formula readiness</b><div id="ready" style="display:grid;gap:8px;margin-top:8px"></div></div></div>`;
app.append(hero);
const sub=el("div",{class:"subnav"}); const sw=el("div",{class:"wrap"}); sub.append(sw); app.append(sub);
[["ref","Reference"],["flash","Flashcards"],["fill","Fill in the blank"],["table","Periodic table"]].forEach(([k,t])=>sw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>{ prefs.mode=k; M.save(); draw(); }},t)));
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer("Leitner boxes are saved in this browser.");

function drawReady(){
  const r=$("#ready"); r.innerHTML="";
  UNITS.forEach(u=>{ const list=all.filter(f=>f.unit===u.id); if(!list.length) return; const p=readiness(list);
    r.append(el("div",{class:"row",style:`--c:var(--${u.id});gap:10px;flex-wrap:nowrap`,html:`<span class="ring sm" style="--p:${p};width:34px;height:34px"><span style="width:26px;height:26px;font-size:.6rem">${p}%</span></span><span class="small">Module ${u.n}: ${esc(u.short)}</span>`})); });
}
function unitChips(onChange){
  const chips=el("div",{class:"chips",style:"margin:0 0 12px"});
  UNITS.forEach(u=>{ if(!all.some(f=>f.unit===u.id)) return; const b=el("button",{class:"chip",type:"button",style:`--c:var(--${u.id})`,"aria-pressed":String(prefs.units.includes(u.id))},`Module ${u.n}`);
    b.onclick=()=>{ const i=prefs.units.indexOf(u.id); if(i>=0){ if(prefs.units.length>1) prefs.units.splice(i,1); } else prefs.units.push(u.id); M.save(); onChange(); }; chips.append(b); });
  return chips;
}
function fcard(f,extra){
  const c=el("div",{class:"fcard",style:`--c:var(--${f.unit})`});
  const bx=box(f.id);
  c.innerHTML=`<div class="row" style="gap:8px;justify-content:space-between"><span class="nm">${rich(f.name)}</span>${M.isNew(f.added||f.L.added,f.L.date)?'<span class="pill new">New</span>':""}</div><div class="tx">${M.tex(f.tex,true)}</div>${f.note?`<div class="nt">${rich(f.note)}</div>`:""}<span class="ref"><a href="${M.chURL(f.lec)}">Ch ${f.L.num}</a> · ${esc(M.refText(f.lec,f.ref))}${f.kind&&f.kind!=="formula"?` · ${f.kind}`:""}${bx?` · box ${bx} of 5`:""}</span>`;
  if(extra) c.append(extra); return c;
}

/* ---------- reference ---------- */
function reference(){
  const search=el("input",{type:"search",placeholder:"Search, like photon, nodes, E-factor or Planck","aria-label":"Search formulas, constants and rules",style:"min-width:min(320px,100%)"});
  const top=el("div",{class:"row",style:"margin-bottom:6px"}); top.append(search);
  view.append(top, unitChips(draw));
  const out=el("div"); view.append(out);
  const norm=s=>String(s).toLowerCase().replace(/\\[a-z]+/g,m=>" "+m.slice(1)+" ").replace(/[^a-z0-9]+/g," ");
  function list(){
    out.innerHTML=""; const q=norm(search.value).trim();
    UNITS.forEach(u=>{ if(!prefs.units.includes(u.id)) return;
      const fs=all.filter(f=>f.unit===u.id && (!q || q.split(" ").every(w=>norm(f.name+" "+(f.note||"")+" "+f.tex+" "+(f.kind||"")+" chapter "+f.L.num).includes(w))));
      if(!fs.length) return;
      const s=el("section",{class:"fs-unit",style:`--c:var(--${u.id})`});
      s.append(el("h2",{html:`${M.ICON[u.id]}Module ${u.n}: ${esc(u.title)} <span class="pill">${readiness(all.filter(f=>f.unit===u.id))}% ready</span>`}));
      u.chapters.forEach(id=>{ const lf=fs.filter(f=>f.lec===id); if(!lf.length) return; const L=M.chap(id);
        s.append(el("h3",{class:"mono",style:"margin:14px 0 8px;font-family:var(--mono);font-size:.74rem;font-weight:500;color:var(--c)"},`${L.num} · ${M.fmtDate(L.date)} · ${L.title.replace(/\$[^$]*\$/g,"")} · pp. ${L.pages}`));
        const g=el("div",{class:"fs-grid"}); lf.forEach(f=>g.append(fcard(f))); s.append(g); });
      out.append(s); });
    if(!out.children.length) out.append(el("p",{class:"muted"},"Nothing matches. Try one word, like photon or nodes."));
  }
  search.addEventListener("input",list); list();
}

/* ---------- flashcards ---------- */
function flash(){
  view.append(unitChips(draw));
  const pool=()=>all.filter(f=>prefs.units.includes(f.unit));
  const wrap=el("div",{class:"flash"}); view.append(wrap);
  const stats=el("div",{class:"boxes"});
  let queue=[], cur=null, sess={right:0,total:0};
  function build(){ const p=pool(); const d=p.filter(f=>due(f.id)).sort((a,b)=>box(a.id)-box(b.id)||Math.random()-.5); queue=d.length?d:[]; }
  function counts(){ const p=pool(); stats.innerHTML=[1,2,3,4,5].map(b=>`<span>Box ${b}: <b>${p.filter(f=>box(f.id)===b).length}</b></span>`).join("")+`<span>New: <b>${p.filter(f=>!box(f.id)).length}</b></span><span>Due now: <b>${p.filter(f=>due(f.id)).length}</b></span>`; }
  function show(){
    wrap.innerHTML=""; counts(); wrap.append(stats);
    if(!queue.length){ wrap.append(el("div",{class:"flashcard",html:`<div class="nm">Nothing due right now</div><p class="muted">Every card in these units is resting in a higher box. This session: ${sess.right} of ${sess.total}.</p>`}), el("div",{class:"row",style:"justify-content:center;margin-top:12px"},el("button",{class:"btn ghost",type:"button",onclick:()=>{ queue=M.shuffle(pool()); show(); }},"Review all of them anyway"))); return; }
    cur=queue.shift(); const f=cur;
    const card=el("div",{class:"flashcard",style:`--c:var(--${f.unit})`});
    card.innerHTML=`<span class="pill">Ch ${f.L.num} · ${box(f.id)?"box "+box(f.id):"new card"}</span><div class="nm">${rich(f.name)}</div><p class="muted small" style="margin:0">${f.kind==="constant"?"Say the value with its units, then flip.":f.kind==="rule"?"State the rule, then flip.":"Say or write the formula, then flip."}</p>`;
    const ans=el("div",{hidden:true,html:`<div class="tx">${M.tex(f.tex,true)}</div>${f.note?`<div class="nt muted small">${rich(f.note)}</div>`:""}<div class="ref">${esc(M.refText(f.lec,f.ref))}</div>`});
    card.append(ans);
    const row=el("div",{class:"row",style:"justify-content:center;margin-top:14px"});
    const flip=el("button",{class:"btn",type:"button",onclick:()=>{ ans.hidden=false; flip.remove(); row.append(el("button",{class:"btn ghost",type:"button",style:"--c:var(--bad)",onclick:()=>{ grade(f.id,false); sess.total++; queue.splice(Math.min(3,queue.length),0,f); drawReady(); show(); }},"I missed it"), el("button",{class:"btn",type:"button",style:"--c:var(--ok)",onclick:()=>{ grade(f.id,true); sess.total++; sess.right++; drawReady(); show(); }},"I knew it")); }},"Flip");
    row.append(flip);
    wrap.append(card,row, el("p",{class:"muted small",style:"text-align:center;margin-top:10px"},`${queue.length} more due in this session. Missed cards come back within a few cards, then tomorrow.`));
  }
  build(); show();
}

/* ---------- fill in the blank ---------- */
function fill(){
  view.append(unitChips(draw));
  const pool=()=>all.filter(f=>prefs.units.includes(f.unit) && f.blank);
  const host=el("div",{style:"max-width:760px"}); view.append(host);
  let sess={right:0,total:0};
  const normT=s=>String(s).toLowerCase().replace(/\s+|\*|\\cdot|\\,/g,"").replace(/\\left|\\right/g,"");
  function next(){
    host.innerHTML="";
    const p=pool(); if(!p.length){ host.append(el("p",{class:"muted"},"No fill-in-the-blank cards in these units yet.")); return; }
    const d=p.filter(f=>due(f.id)); const f=(d.length?d:p).sort((a,b)=>box(a.id)-box(b.id)+Math.random()-.5)[0];
    const B=f.blank;
    const card=el("div",{class:"prob",style:`--c:var(--${f.unit})`});
    card.append(el("div",{class:"ph",html:`<span class="pill">Ch ${f.L.num}</span><span class="ref">${rich(f.name)} · ${esc(M.refText(f.lec,f.ref))}</span>`}));
    card.append(el("div",{class:"stmt",html:M.tex(B.tex,true)}));
    const a=el("div",{class:"ans"}); const row=el("div",{class:"inrow"});
    const inp=el("input",{type:"text",autocomplete:"off",spellcheck:"false","aria-label":"The missing piece",placeholder:"type the missing piece"});
    const chk=el("button",{class:"btn",type:"button"},"Check"); row.append(inp,chk); a.append(row);
    const pre=el("div",{class:"pre"});
    const fb=el("div"); a.append(fb); card.append(a);
    let done=false;
    const check=()=>{ if(done) return; let ok;
      { const v=normT(inp.value); if(!v){ fb.className="fb warn"; fb.innerHTML="<b>Type the missing piece first.</b>"; return; } ok=(B.accept||[]).some(x=>normT(x)===v); }
      done=true; grade(f.id,ok); sess.total++; if(ok) sess.right++; drawReady();
      fb.className="fb "+(ok?"ok":"bad"); fb.innerHTML=`<b>${ok?"Right.":"Not quite."}</b>The full formula:${M.tex(f.tex,true)}${f.note?rich(f.note):""}`;
      inp.disabled=true; chk.disabled=true; nx.focus(); tally(); };
    chk.onclick=check; inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); if(done) next(); else check(); } });
    const nx=el("button",{class:"btn ghost",type:"button",onclick:next},"Next formula");
    const giveup=el("button",{class:"sbtn",type:"button",onclick:()=>{ if(done) return; done=true; grade(f.id,false); sess.total++; fb.className="fb bad"; fb.innerHTML=`<b>Here it is.</b>${M.tex(f.tex,true)}`; inp.disabled=true; chk.disabled=true; tally(); }},"Show me");
    card.append(el("div",{class:"row",style:"margin-top:8px"},giveup,el("span",{class:"spacer"}),nx));
    const t=el("p",{class:"muted small"}); function tally(){ t.textContent=`This session: ${sess.right} of ${sess.total} right. Each answer moves the card in its Leitner box, same as the flashcards.`; } tally();
    host.append(card,t); inp.focus();
  }
  next();
}

/* ---------- periodic table ---------- */
const STARRED=["Cr","Cu","Nb","Mo","Ru","Rh","Pd","Ag","Pt","Au","La","Gd","Ac","Th","Pa","U","Np","Cm"];
function table(){
  const CH=M.chem; let color=prefs.ptColor||"block", sel=prefs.ptSel||"Fe";
  const intro=el("p",{class:"muted",style:"max-width:52em",html:rich("Every element from the data sheet, with its molar mass as printed. Click one for its ground-state configuration (Module 3, pp. 3-7), its block, and the electronegativity (p. 15) and electron affinity (p. 14) values from the notes. Starred elements are the configuration exceptions the notes mark on p. 6; you only need Cr and Cu.")});
  const seg=el("div",{style:"max-width:560px;margin:0 0 12px"});
  PLOT.seg(seg,{label:"Colour by",items:[["block","Block (s, p, d, f)"],["en","Electronegativity"],["ea","Electron affinity"]],value:color,onchange:v=>{ color=v; prefs.ptColor=v; M.save(); draw(); }});
  const grid=el("div",{class:"ptable",role:"grid","aria-label":"Periodic table"});
  const detail=el("div",{class:"card ptd","aria-live":"polite"});
  const legend=el("div",{class:"small muted pt-leg"});
  view.append(intro,seg,grid,legend,detail);
  const pos=z=>{ const p=CH.position(z); if(p.block==="f"){ const row=p.period===6?9:10; const col=z-(p.period===6?57:89)+3; return {row,col}; } return {row:p.period,col:p.group}; };
  const enMin=0.7, enMax=4.0;
  function fill(sym){ const z=CH.Z(sym); const p=CH.position(z);
    if(color==="block") return `var(--blk-${p.block})`;
    if(color==="en"){ const v=CH.EN[sym]; if(v==null) return "transparent"; const t=(v-enMin)/(enMax-enMin); return `color-mix(in srgb,var(--m3) ${Math.round(12+t*78)}%,var(--paper))`; }
    const v=CH.EA[sym]; if(v===undefined) return "transparent"; if(v===null||v>0) return "repeating-linear-gradient(45deg,var(--fig-soft),var(--fig-soft) 3px,var(--rule) 3px,var(--rule) 5px)"; const t=Math.min(1,-v/349); return `color-mix(in srgb,var(--m4) ${Math.round(10+t*80)}%,var(--paper))`; }
  function draw(){
    grid.innerHTML="";
    for(let z=1;z<=103;z++){ const sym=CH.sym(z); const {row,col}=pos(z); const m=CH.MASS[sym];
      const b=el("button",{type:"button",class:"pt-el"+(sym===sel?" on":"")+(STARRED.includes(sym)?" star":""),style:`grid-row:${row};grid-column:${col};background:${fill(sym)}`,"aria-label":`${CH.NAME[sym]||sym}, Z = ${z}`,"aria-pressed":String(sym===sel)},
        el("span",{class:"z"},String(z)),el("span",{class:"s"},sym),el("span",{class:"m"},m!=null?(m>=100?m.toFixed(1):m.toPrecision(4)):""));
      b.onclick=()=>{ sel=sym; prefs.ptSel=sym; M.save(); draw(); }; grid.append(b); }
    grid.append(el("div",{class:"pt-gap",style:"grid-row:9;grid-column:1 / span 2"},"57-71"),el("div",{class:"pt-gap",style:"grid-row:10;grid-column:1 / span 2"},"89-103"));
    legend.innerHTML=color==="block"?`<span class="sw" style="background:var(--blk-s)"></span>s block <span class="sw" style="background:var(--blk-p)"></span>p block <span class="sw" style="background:var(--blk-d)"></span>d block <span class="sw" style="background:var(--blk-f)"></span>f block`:color==="en"?`Darker = more electronegative (Pauling values printed in Module 3, p. 15; blank = no value printed).`:`Darker = more energy released when an electron is added (Module 3, p. 14). Striped = printed as "> 0" or positive (energy needed). Blank = not in the table.`;
    const z=CH.Z(sel), p=CH.position(z); const occ=z<=56||(z>=72&&z<=86)?CH.occupancy(z):null; const star=STARRED.includes(sel);
    const cfgOK=occ && !(star && !CH.EXCEPTIONS[sel]);
    const en=CH.EN[sel], ea=CH.EA[sel];
    detail.innerHTML=`<div class="row" style="gap:14px;align-items:flex-start"><div class="pt-big"><span>${z}</span><b>${sel}</b><span>${CH.MASS[sel]!=null?CH.MASS[sel]:"no mass printed"}</span></div><div style="flex:1;min-width:240px">
      <h3>${esc(CH.NAME[sel]||sel)}</h3><p class="small muted" style="margin:0 0 6px">Period ${p.period}${p.group?`, group ${p.group}`:""}, ${p.block} block · molar mass ${CH.MASS[sel]!=null?CH.MASS[sel]+" g/mol (data sheet)":"not printed on the data sheet"}</p>
      ${cfgOK?`<p style="margin:0 0 4px">${M.tex(CH.configString(occ,{tex:true}))}</p><p style="margin:0 0 4px">${M.tex(CH.configString(occ,{short:true,tex:true}))}</p><p class="small" style="margin:0 0 6px">${CH.unpaired(occ)} unpaired electron${CH.unpaired(occ)===1?"":"s"}: ${CH.unpaired(occ)?"paramagnetic":"diamagnetic"}${star?` · <b>exception</b>${CH.MUST_KNOW_EXCEPTIONS.includes(sel)?" (one of the two to know)":" (starred in the notes, not one you need to know)"}`:""}</p>`:`<p class="small muted">${star?"Starred in the notes (p. 6) as an exception. Its configuration is outside this course.":"Configuration not shown: lanthanides and actinides are outside this course."}</p>`}
      <p class="small" style="margin:0">Electronegativity: <b>${en!=null?en:"not printed in the notes"}</b> · Electron affinity: <b>${ea===undefined?"not in the notes' table":ea===null?"> 0 (energy needed)":ea+" kJ/mol"}</b></p>
      <p class="small" style="margin:6px 0 0">${M.chap("M3C2")?`<a href="${M.chURL("M3C2")}">Filling order (3.2)</a> · `:""}${M.chap("M3C5")?`<a href="${M.chURL("M3C5")}">Radius and ionization energy (3.5)</a> · `:""}${M.chap("M3C6")?`<a href="${M.chURL("M3C6")}">Electron affinity and electronegativity (3.6)</a>`:""}</p></div></div>`;
  }
  draw();
}

function draw(){
  M.$$(".tab",sw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===prefs.mode)));
  view.innerHTML=""; drawReady();
  ({ref:reference,flash,fill,table}[prefs.mode]||reference)();
  history.replaceState(null,"","#mode="+prefs.mode);
}
draw();
window.addEventListener("hashchange",()=>{ const h=new URLSearchParams(location.hash.slice(1)); if(h.get("u")){ prefs.units=[h.get("u")]; } if(h.get("mode")&&h.get("mode")!==prefs.mode){ prefs.mode=h.get("mode"); draw(); } else if(h.get("u")) draw(); });
})();
