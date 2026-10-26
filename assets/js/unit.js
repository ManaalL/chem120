/* CHEM 120 Interactive: module page. One page per module, with tabs:
   Chapters (grouped by the quiz or test that first covers them) · Explore (every 3D model and simulation) · Practice (endless) · Mini exam · Glossary.
   URL hash: #M2C6 opens chapter 2.6, #M2C6.3 opens its 4th step, #explore #practice #exam #glossary open tabs. */
(function(){
"use strict";
const M=window.C120, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
const UID=document.documentElement.getAttribute("data-unit");
const U=M.mod(UID);
document.documentElement.style.setProperty("--c",`var(--${UID})`);
const LECS=U.chapters.map(id=>M.chap(id)).filter(Boolean);
const quizOf=id=>C.assessments.find(q=>q.chapters.includes(id));
const asgOf=id=>(C.assignments||[]).filter(a=>a.chapters.includes(id)).map(a=>a.id);

M.nav("modules");
const app=$("#app");
/* hero */
const done=LECS.filter(L=>M.chState(L.id).done).length;
const hero=el("section",{class:"hero slim"});
const tests=[...new Set(U.chapters.map(id=>M.assessLabel(quizOf(id))).filter(Boolean))];
const nModels=LECS.reduce((n,L)=>n+Object.values(L.figures||{}).filter(f=>f.model).length,0);
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--c)">Module ${U.n} · course notes pp. 1 to ${U.pages} · ${tests.join(", ")}</p>
  <h1>${esc(U.title)}</h1><p class="lede">${U.topics.map(esc).join(". ")}.</p>
  <div class="counts"><span><b>${LECS.length}</b>chapters</span><span><b>${nModels}</b>3D models</span><span><b>${LECS.reduce((n,L)=>n+(L.formulas||[]).length,0)}</b>formulas and rules</span><span><b>${LECS.reduce((n,L)=>n+(L.gens||[]).length,0)}</b>problem types</span><span><b>${LECS.reduce((n,L)=>n+(L.exam||[]).length,0)}</b>exam questions</span></div></div>
  <div class="card" style="min-width:230px;display:flex;gap:14px;align-items:center"><span class="ring" style="--p:${LECS.length?Math.round(done/LECS.length*100):0}"><span>${done}/${LECS.length}</span></span><div><b>Chapters done</b><div class="muted small">${M.db().exam["unit-"+UID]?`Mini exam best: <b>${M.db().exam["unit-"+UID].best}%</b>`:"Mini exam not taken yet"}</div></div></div></div>`;
app.append(hero);
const sub=el("div",{class:"subnav"}); const subw=el("div",{class:"wrap"}); sub.append(subw); app.append(sub);
const TABS=[["chapters","Chapters"],["explore","Explore 3D"],["practice","Practice"],["exam","Mini exam"],["glossary","Glossary"]];
TABS.forEach(([k,t])=>subw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer();

let RUN=null; // {id, first:{}}
function clear(){ ENGINE.cleanup(view); view.innerHTML=""; }
function setTab(k){ M.$$(".tab",subw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); }
function go(k){ RUN=null; hero.hidden=false; setTab(k); clear(); ({chapters,explore,practice,exam,glossary}[k]||chapters)(); history.replaceState(null,"",k==="chapters"?location.pathname:"#"+k); window.scrollTo({top:0}); }

/* ---------- chapter list, grouped by quiz or test ---------- */
function chapters(){
  view.append(el("p",{class:"muted",style:"max-width:46em"},"Each chapter follows one class in the course notes: the key ideas in plain words, a worked example you step through, a 3D model or simulation you predict and then check, and problems with new numbers every time. Your first-try score is saved, so you can come back and beat it."));
  const groups=[];
  C.assessments.forEach(q=>{ const ids=U.chapters.filter(id=>q.chapters.includes(id)); if(ids.length) groups.push({q,ids}); });
  groups.forEach(({q,ids})=>{
    const g=el("section",{class:"qgroup"});
    const label=M.assessLabel(q);
    g.append(el("h3",{html:`<span class="pill" style="--c:var(--head)">${label}</span> ${q.label==="Test 2 only"?"New for Test 2 (not on a PC)":`First tested on ${label}`} <span class="ref">${M.fmtDate(q.date,{weekday:"short",month:"short",day:"numeric"})} · ${esc(q.covers)}</span>`}));
    const ul=el("ul",{class:"chlist"});
    ids.forEach(id=>{ const L=M.chap(id); const r=C.schedule.find(x=>x[0]===id);
      if(!L){ ul.append(el("li",{},el("div",{class:"chitem",style:"cursor:default;opacity:.7"},el("span",{class:"chnum"},`${U.n}.${+id.split("C")[1]}`),el("h4",{},r?r[2]:id),el("span",{class:"pill",style:"--c:var(--ink2)"},"Coming"),el("span",{class:"meta m"},`${r?M.fmtDate(r[1],{weekday:"short",month:"short",day:"numeric"}):""} · pp. ${r?r[3]:""}`)))); return; }
      const st=M.chState(id); const soon=M.upcoming(L);
      const b=el("button",{class:"chitem",type:"button",onclick:()=>openChapter(id,0)},
        el("span",{class:"chnum"},L.num), el("h4",{rich:L.title}),
        M.isNew(L.added,L.date)?el("span",{class:"pill new"},"New"):soon?el("span",{class:"pill",style:"--c:var(--ink2)"},"Before class"):(st.done?el("span",{class:"best"},st.best==null?"Done":`Best ${Math.round((st.best||0)*100)}%`):el("span")),
        el("span",{class:"meta m"},`${M.fmtDate(L.date,{weekday:"short",month:"short",day:"numeric"})} · notes pp. ${L.pages} · ${(L.steps||[]).length} steps${asgOf(id).length?" · "+asgOf(id).join(", "):""}`),
        el("span",{class:"meta",rich:L.summary}));
      ul.append(el("li",{},b)); });
    g.append(ul); view.append(g);
  });
  const reset=el("button",{class:"sbtn",type:"button",onclick:()=>{ if(confirm(`Clear your saved chapter scores for Module ${U.n}?`)){ LECS.forEach(L=>{ delete M.db().ch[L.id]; }); M.save(); go("chapters"); } }},"Reset this module's chapter scores");
  view.append(el("p",{style:"margin-top:20px"},reset));
}

/* ---------- a chapter ---------- */
function stepper(L,si){ const bar=el("div",{class:"steps","aria-hidden":"true"}); L.steps.forEach((_,i)=>bar.append(el("i",{class:i<si?"on":i===si?"cur":""}))); return bar; }
function record(key,ok){ if(!RUN) return; if(!(key in RUN.first)) RUN.first[key]=!!ok; }
function figNo(L,key){ return Object.keys(L.figures||{}).indexOf(key)+1; }
function openChapter(id,si){
  const L=M.chap(id); if(!L) return go("chapters");
  if(!RUN||RUN.id!==id) RUN={id,first:{}};
  setTab("chapters"); hero.hidden=true; clear(); window.scrollTo({top:0});
  history.replaceState(null,"","#"+id+(si?"."+si:""));
  const s=L.steps[si];
  const crumb=el("div",{class:"crumb"},
    el("button",{class:"back",type:"button",onclick:()=>go("chapters")},"All chapters"),
    el("h1",{rich:`${L.num} ${L.title}`}),
    el("span",{class:"ref"},`${M.fmtDate(L.date,{weekday:"short",month:"short",day:"numeric"})} · Module ${U.n}, pp. ${L.pages} · step ${si+1} of ${L.steps.length}`),
    stepper(L,si));
  view.append(crumb);
  const hasFig=!!s.fig;
  const stage=el("div",{class:"stage"+(hasFig?"":" wide")});
  const left=el("div"), panel=el("div",{class:"panel"});
  if(hasFig){ stage.append(left,panel); } else stage.append(panel);
  view.append(stage);
  panel.append(el("div",{class:"kicker"},{read:"Key idea",example:"Worked example",explore:"Explore in 3D",mcq:"Check yourself",try:"Your turn",formulas:"Formulas and rules",firstline:"Find the mistake"}[s.type]||""));
  panel.append(el("h2",{rich:s.title||""}));
  if(si===0 && (L.flags||[]).length){ panel.append(flagsBox(L)); }
  const next=el("button",{class:"btn",type:"button",onclick:()=>{ if(si+1<L.steps.length) openChapter(id,si+1); else finish(L); }}, si+1<L.steps.length?"Continue":"Finish chapter");
  const back=el("button",{class:"btn ghost",type:"button",onclick:()=>{ if(si>0) openChapter(id,si-1); else go("chapters"); }}, si>0?"Back":"All chapters");
  if(hasFig){ const f=L.figures[s.fig]; ENGINE.figure(left,{...f,refText:f.ref?M.refText(L.id,f.ref):""},{unit:UID,figNo:figNo(L,s.fig),onPredict:ok=>record("p"+si,ok)}); }
  if(s.body) panel.append(el("div",{rich:s.body}));
  if(s.type==="example"){ ENGINE.example(panel,s.ex); }
  if(s.type==="mcq"){ ENGINE.mcq(panel,s,ok=>record(si,ok)); }
  if(s.type==="firstline"){ ENGINE.firstline(panel,s,ok=>record(si,ok)); }
  if(s.type==="try"){ ENGINE.problem(panel,{gid:s.gen,diff:s.diff||2,onResult:(ok)=>record(si,ok),onNew:()=>{}}); }
  if(s.type==="formulas"){ panel.append(formulaList(L)); }
  if(s.ref) panel.append(el("p",{class:"ref",style:"margin-top:10px"},`Course notes, ${M.refText(L.id,s.ref)}`));
  panel.append(el("div",{class:"navrow"},back,next));
}
function flagsBox(L){ const d=el("div",{class:"flag"}); d.innerHTML=`<b>Heads up about the notes.</b> ${L.flags.map(f=>`${rich(f.text)} <span class="ref">(${esc(M.refText(L.id,f.ref))})</span>`).join(" ")}`; return d; }
function formulaList(L){
  const g=el("div",{class:"fs-grid",style:"grid-template-columns:minmax(0,1fr)"});
  (L.formulas||[]).forEach(f=>{ const c=el("div",{class:"fcard"}); c.innerHTML=`<div class="nm">${rich(f.name)}</div><div class="tx">${M.tex(f.tex,true)}</div>${f.note?`<div class="nt">${rich(f.note)}</div>`:""}<span class="ref">${esc(M.refText(L.id,f.ref))}</span>`; g.append(c); });
  const box=el("div"); box.append(g, el("p",{class:"muted small",style:"margin-top:8px",html:`Drill these on the <a href="formulas.html#u=${UID}">formula sheet</a> with flashcards and fill-in-the-blank.`})); return box;
}
function finish(L){
  const v=Object.values(RUN.first); const right=v.filter(Boolean).length, total=v.length;
  const frac=total?right/total:1; const st=M.chState(L.id); const prev=st.best;
  st.done=true; st.last=frac; if(st.best==null||frac>st.best) st.best=frac; st.when=Date.now(); M.save();
  clear(); window.scrollTo({top:0});
  const i=LECS.indexOf(L); const nx=LECS[i+1];
  const box=el("div",{class:"card",style:"max-width:760px"});
  box.innerHTML=`<p class="kicker">Chapter ${L.num} complete</p><h1 style="font-size:2rem;margin-bottom:14px">${rich(L.title)}</h1>
   <div class="row" style="gap:28px;margin:10px 0 18px"><div><div class="big">${right}/${total}</div><div class="muted small">right on the first try (predictions count)</div></div><div><div class="big" style="color:var(--head)">${Math.round((st.best||0)*100)}%</div><div class="muted small">${prev==null?"your best so far":frac>prev?"new personal best":"your best"}</div></div></div>
   <p>${rich(L.summary)}</p>`;
  if((L.flags||[]).length) box.append(flagsBox(L));
  const row=el("div",{class:"row",style:"margin-top:14px"});
  if(nx) row.append(el("button",{class:"btn",type:"button",onclick:()=>{ RUN=null; openChapter(nx.id,0); }},`Start chapter ${nx.num}`));
  else row.append(el("button",{class:"btn",type:"button",onclick:()=>go("exam")},"Take the mini exam"));
  row.append(el("button",{class:"btn ghost",type:"button",onclick:()=>{ RUN=null; openChapter(L.id,0); }},"Replay"),el("button",{class:"btn ghost",type:"button",onclick:()=>{ go("practice"); }},"Practise this module"));
  box.append(row); view.append(box);
  RUN=null;
}

/* ---------- explore: every 3D model and simulation in the module ---------- */
function explore(){
  view.append(el("p",{class:"muted",style:"max-width:46em"},"Every 3D model and simulation in this module in one place. Each one loads when you scroll to it. Answer the prediction first, then turn the model to check."));
  const only=el("div",{class:"chips",style:"margin:0 0 12px"}); let filter="all";
  const grid=el("div",{class:"grid2 gallery"});
  [["all","Everything"],["3d","3D models only"],["2d","Simulations and graphs"]].forEach(([k,t])=>{ const b=el("button",{class:"chip",type:"button","aria-pressed":String(k===filter)},t); b.onclick=()=>{ filter=k; only.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b))); draw(); }; only.append(b); });
  view.append(only,grid);
  function draw(){
    ENGINE.cleanup(grid); grid.innerHTML="";
    LECS.forEach(L=>Object.entries(L.figures||{}).forEach(([k,f])=>{
      if(filter==="3d"&&!f.model) return; if(filter==="2d"&&f.model) return;
      const c=el("div"); c.append(el("div",{class:"row",style:"margin:0 0 6px"},el("span",{class:"pill"},`Ch ${L.num}`),f.model?el("span",{class:"pill",style:"--c:var(--head)"},"3D"):null,el("b",{rich:f.title||k})));
      ENGINE.figure(c,{...f,refText:f.ref?M.refText(L.id,f.ref):""},{unit:UID,figNo:figNo(L,k)}); c.append(el("p",{class:"small",style:"margin-top:6px"},el("a",{href:"#"+L.id,onclick:e=>{ e.preventDefault(); RUN=null; openChapter(L.id,Math.max(0,L.steps.findIndex(s=>s.fig===k))); }},`Open it in chapter ${L.num}`)));
      grid.append(c); }));
  }
  draw();
}

/* ---------- practice: endless problems from this module ---------- */
function practice(){
  if(!LECS.length){ view.append(el("p",{class:"muted"},"This module's chapters haven't been added yet.")); return; }
  const db=M.db(); const prefs=db.prefs["practice-"+UID]||(db.prefs["practice-"+UID]={lecs:LECS.map(L=>L.id),diff:2});
  prefs.lecs=prefs.lecs.filter(id=>M.chap(id)); if(!prefs.lecs.length) prefs.lecs=LECS.map(L=>L.id);
  const top=el("div",{class:"card"});
  top.append(el("h2",{},"Endless practice"),el("p",{class:"muted"},"New numbers every time. Pick chapters and a difficulty. Wrong first tries go to your mistake log on the Test 2 prep page, so you can redo them with the same numbers."));
  const chips=el("div",{class:"chips",style:"margin:6px 0 10px"});
  LECS.forEach(L=>{ const b=el("button",{class:"chip lec",type:"button","aria-pressed":String(prefs.lecs.includes(L.id)),title:L.title},L.num); b.onclick=()=>{ const i=prefs.lecs.indexOf(L.id); if(i>=0){ if(prefs.lecs.length>1) prefs.lecs.splice(i,1); } else prefs.lecs.push(L.id); b.setAttribute("aria-pressed",String(prefs.lecs.includes(L.id))); M.save(); }; chips.append(b); });
  top.append(chips);
  const segHost=el("div",{style:"max-width:360px"}); top.append(segHost);
  PLOT.seg(segHost,{items:[[1,"Easy"],[2,"Medium"],[3,"Hard"]],value:prefs.diff,onchange:v=>{ prefs.diff=v; M.save(); }});
  const tally=el("div",{class:"stat3",style:"margin-top:10px"}); top.append(tally);
  view.append(top);
  const host=el("div"); view.append(host);
  let right=0,total=0;
  const upd=()=>{ tally.innerHTML=`<span>This session: <b>${right}</b> of <b>${total}</b> right first try</span>`; };
  function nextProb(){
    host.innerHTML="";
    const gids=[]; prefs.lecs.forEach(id=>(M.chap(id).gens||[]).forEach(g=>gids.push(g.id)));
    if(!gids.length){ host.append(el("p",{class:"muted"},"No problems here yet.")); return; }
    const gid=gids[Math.floor(Math.random()*gids.length)];
    ENGINE.problem(host,{gid,diff:prefs.diff,diffLabel:true,showNew:false,onResult:ok=>{ total++; if(ok) right++; upd(); }});
    host.append(el("div",{class:"row"},el("button",{class:"btn",type:"button",onclick:nextProb},"Next problem")));
  }
  upd(); nextProb();
}

/* ---------- mini exam ---------- */
function exam(){
  const items=[]; LECS.forEach(L=>(L.exam||[]).forEach(q=>items.push({...q,kind:"mc",lec:L.id})));
  LECS.forEach(L=>(L.gens||[]).slice(0,3).forEach(g=>items.push({kind:"gen",gid:g.id,lec:L.id,diff:2,id:g.id})));
  const host=el("div"); view.append(host);
  EXAM.mount(host,{key:"unit-"+UID,title:`Module ${U.n} mini exam`,intro:`${items.length} questions in the bank: multiple choice like the tests, plus problems with new numbers like the online assignments.`,items,sizes:[10,20]});
}

/* ---------- glossary ---------- */
function glossary(){
  const search=el("input",{type:"search",placeholder:"Find a term","aria-label":"Find a term",style:"min-width:240px"});
  view.append(el("div",{class:"row",style:"margin-bottom:14px"},el("h2",{},"Glossary"),el("span",{class:"spacer"}),search));
  const box=el("div",{class:"gl"}); view.append(box);
  function draw(q=""){
    box.innerHTML="";
    LECS.forEach(L=>{ const items=(L.glossary||[]).filter(g=>!q||(g.term+" "+g.def).toLowerCase().includes(q)); if(!items.length) return;
      const s=el("section"); s.append(el("h3",{rich:`${L.num} ${L.title}`}));
      items.forEach(g=>s.append(el("div",{class:"gi",html:`<b>${rich(g.term)}</b> <span class="ref">${esc(g.ref?M.refText(L.id,g.ref):"")}</span><p>${rich(g.def)}</p>`})));
      box.append(s); });
    if(!box.children.length) box.append(el("p",{class:"muted"},"No match. Try a shorter word."));
  }
  search.addEventListener("input",()=>draw(search.value.trim().toLowerCase())); draw();
}

/* ---------- routing ---------- */
window.UNIT_OPEN=(id,si)=>{ RUN=null; openChapter(id,si||0); };
function fromHash(){
  const h=location.hash.slice(1);
  const m=h.match(/^(M\dC\d+)(?:\.(\d+))?$/);
  if(m && LECS.some(L=>L.id===m[1])){ RUN=null; openChapter(m[1],Math.min(+(m[2]||0),M.chap(m[1]).steps.length-1)); return; }
  if(TABS.some(t=>t[0]===h)) return go(h);
  go("chapters");
}
window.addEventListener("hashchange",()=>{ const h=location.hash.slice(1); const m=h.match(/^(M\dC\d+)(?:\.(\d+))?$/); if(m && RUN && RUN.id===m[1]) return; fromHash(); });
fromHash();
})();
