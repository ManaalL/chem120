/* CHEM 120 Interactive: quiz prep. quiz.html lists the Participation Challenges and tests; quiz-<id>.html is the prep page for one. */
(function(){
"use strict";
const M=window.C120, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("quiz");
const app=$("#app");
const QID=document.documentElement.getAttribute("data-quiz");
const hasData=q=>q.chapters.some(id=>M.chap(id));
const FORMAT={pc:"Participation Challenges are timed (60 minutes) and single attempt, on Möbius. This practice version mixes typed numeric answers with units and sig figs, fill-ins and multiple choice, like the Möbius assignments.",
  test:"Tests are multiple choice with five options, 1 mark each, some select-all, on a bubble sheet with a scientific calculator and the data sheet. Numeric questions say \"choose the closest answer\"."};

if(!QID){ /* ---------- hub ---------- */
  const hero=el("section",{class:"hero slim"});
  hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px">Quiz prep · Participation Challenges and tests</p><h1>One page for <em>each quiz</em>.</h1><p class="lede">Each page drills exactly the chapters that PC or test adds, in its real format, with an optional timer: 60 minutes for a PC, 45 for a test. Real quiz and assignment questions are never copied here: they only decided what the practice emphasises.</p></div></div>`;
  app.append(hero);
  const w=el("div",{class:"wrap view"}); app.append(w);
  const g=el("div",{class:"mods"}); w.append(g);
  const today=M.today();
  C.assessments.filter(q=>q.kind!=="final").forEach(q=>{ const ready=hasData(q); const past=M.parseDate(q.date)<today; const best=(M.db().exam["quiz-"+q.id]||{}).best;
    const chs=q.chapters.map(id=>{ const r=C.schedule.find(x=>x[0]===id); return r?`${id[1]}.${+id.split("C")[1]}`:id; }).join(", ");
    const mod=C.modules.find(u=>u.chapters.includes(q.chapters[0]));
    const c=mod?`var(--${mod.id})`:"var(--ink2)";
    const lab=M.assessLabel(q);
    g.insertAdjacentHTML("beforeend",ready?`<a class="mod" href="quiz-${q.id.toLowerCase()}.html" style="--c:${c}"><div class="top"><span class="icon">${M.ICON.quiz}</span><div><div class="num">${M.fmtDate(q.date,{weekday:"short",month:"short",day:"numeric"})}${past?" · written":""}</div><h3>${lab}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">Adds chapters ${chs}. Covers ${esc(q.covers)}.</p><div class="prog">${best!=null?`<span>practice best: <b>${best}%</b></span>`:"<span>not practised yet</span>"}<span class="go">Open</span></div></a>`
      :`<div class="mod" style="--c:var(--ink2);opacity:.7"><div class="top"><span class="icon">${M.ICON.quiz}</span><div><div class="num">${M.fmtDate(q.date,{weekday:"short",month:"short",day:"numeric"})}</div><h3>${lab}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">Covers ${esc(q.covers)}. This page opens once those notes are added.</p></div>`); });
  w.append(el("p",{class:"muted",style:"margin-top:18px",html:`For Test 2, use <a href="midterm.html">Test 2 prep</a>: full practice tests, the course-notes examples, your mistake log and a study plan.`}));
  M.footer(); return;
}

/* ---------- one quiz ---------- */
const Q=M.assess(QID);
const isTest=Q.kind==="test";
const db=M.db(); const prefs=db.prefs["quiz-"+QID]||(db.prefs["quiz-"+QID]={cum:false});
const lecsNew=Q.chapters.filter(id=>M.chap(id));
const allBefore=()=>{ const out=[]; for(const q of C.assessments){ q.chapters.forEach(id=>{ if(M.chap(id)) out.push(id); }); if(q.id===QID) break; } return out; };
const testChapters=()=>QID==="T2"?C.test.chapters.filter(id=>M.chap(id)):allBefore();
const LECS=()=>isTest?testChapters():prefs.cum?allBefore():lecsNew;
const U=C.modules.find(u=>u.chapters.includes(lecsNew[0]))||C.modules[0];
document.documentElement.style.setProperty("--c",`var(--${U.id})`);
const hero=el("section",{class:"hero slim"});
const days=Math.ceil((M.parseDate(Q.date)-M.today())/864e5);
const lab=M.assessLabel(Q);
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--c)">${lab} · ${M.fmtDate(Q.date,{weekday:"long",month:"long",day:"numeric"})}${Q.kind==="pc"?" · due 9:00 pm":""}</p><h1>${lab} prep</h1><p class="lede">Covers ${esc(Q.covers)}. New chapters: ${lecsNew.map(id=>{ const L=M.chap(id); return `<a href="${M.chURL(id)}">${L.num}</a>`; }).join(", ")}. ${FORMAT[Q.kind]||""}</p></div>
  <div class="count"><div class="big" style="color:var(--c)">${days>0?days:days===0?"Today":"Done"}</div><div class="muted">${days>0?`day${days===1?"":"s"} to go`:days===0?"Good luck.":"Already written. Still good review for Test 2 and the final."}</div></div></div>`;
app.append(hero);
const sub=el("div",{class:"subnav"}); const sw=el("div",{class:"wrap"}); sub.append(sw); app.append(sub);
const TABS=[["quiz",isTest?"Practice test":"Practice quiz"],["problems","Problems"],["formulas","Formulas"]];
TABS.forEach(([k,t])=>sw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
if(!isTest){ const cum=el("label",{class:"row small",style:"margin-left:auto;gap:6px"}); const cb=el("input",{type:"checkbox"}); cb.checked=prefs.cum; cb.onchange=()=>{ prefs.cum=cb.checked; M.save(); go(cur); }; cum.append(cb,document.createTextNode("Include earlier chapters")); sw.append(cum); }
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer();
let cur="quiz";
function go(k){ cur=k; M.$$(".tab",sw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); ENGINE.cleanup(view); view.innerHTML=""; ({quiz,problems,formulas}[k])(); history.replaceState(null,"","#"+k); }

function quiz(){
  const host=el("div"); view.append(host);
  if(isTest){
    EXAM.mount(host,{key:"quiz-"+QID,title:`Practice ${lab}`,intro:`15 multiple choice questions in the test format: five options, one mark each, a few select-all. Numeric questions give the answer and four tempting wrong ones, like the real test. ${QID==="T2"?"Drawn from everything after Test 1.":"Drawn from Module 1 and Module 2 up to the Bohr model."}`,
      items:()=>EXAM.testPool(LECS()), fixedSize:15, allowTimer:true, timeLimit:45, select:EXAM.selectTest});
    return;
  }
  const items=()=>{ const out=[]; LECS().forEach(id=>{ const L=M.chap(id); (L.exam||[]).forEach(q=>out.push({...q,kind:"mc",lec:id})); (L.gens||[]).forEach(g=>out.push({kind:"gen",gid:g.id,lec:id,diff:2,id:g.id})); }); return out; };
  EXAM.mount(host,{key:"quiz-"+QID,title:`Practice ${lab}`,intro:`10 questions like a Participation Challenge: 7 typed answers (numbers with units and sig figs, formulas, configurations) and 3 multiple choice. ${prefs.cum?"Drawn from every chapter up to this PC.":"Drawn from the chapters this PC adds."} Like the real one, you get one attempt and no feedback until you submit.`,
    items, fixedSize:10, allowTimer:true, timeLimit:60,
    select:(pool)=>{ const mc=pool.filter(q=>q.kind==="mc"), gen=pool.filter(q=>q.kind==="gen"); return [...EXAM.spread(gen,7),...EXAM.spread(mc,3)]; }});
}
function problems(){
  const top=el("div",{class:"card"}); top.append(el("h2",{},"Endless problems"),el("p",{class:"muted small"},`From chapters ${LECS().map(id=>M.chap(id).num).join(", ")}. New numbers every time.`));
  const dh=el("div",{style:"max-width:360px"}); top.append(dh); let diff=2; PLOT.seg(dh,{items:[[1,"Easy"],[2,"Medium"],[3,"Hard"]],value:2,onchange:v=>{ diff=v; }});
  view.append(top); const host=el("div"); view.append(host);
  function next(){ host.innerHTML=""; const gids=[]; LECS().forEach(id=>(M.chap(id).gens||[]).forEach(g=>gids.push(g.id))); if(!gids.length){ host.append(el("p",{class:"muted"},"No problems yet.")); return; } ENGINE.problem(host,{gid:gids[Math.floor(Math.random()*gids.length)],diff,diffLabel:true,showNew:false}); host.append(el("button",{class:"btn",type:"button",onclick:next},"Next problem")); }
  next();
}
function formulas(){
  const g=el("div",{class:"fs-grid"});
  LECS().forEach(id=>{ const L=M.chap(id); (L.formulas||[]).forEach(f=>{ const c=el("div",{class:"fcard",style:`--c:var(--${L.module})`}); c.innerHTML=`<div class="nm">${rich(f.name)}</div><div class="tx">${M.tex(f.tex,true)}</div>${f.note?`<div class="nt">${rich(f.note)}</div>`:""}<span class="ref">Ch ${L.num} · ${esc(M.refText(L.id,f.ref))}</span>`; g.append(c); }); });
  view.append(el("p",{class:"muted",html:`Drill these with flashcards on the <a href="formulas.html#mode=flash">formula sheet</a>. Remember what the data sheet gives you (constants, $E=h\\nu$, $c=\\lambda\\nu$, $\\lambda=h/p$, $E_n=-R_H/n^2$) and what it doesn't (the photoelectric equation, node rules, %AE and E-factor).`.replace(/\$[^$]+\$/g,m=>M.tex(m.slice(1,-1)))}),g);
}
const h=location.hash.slice(1); go(TABS.some(t=>t[0]===h)?h:"quiz");
window.addEventListener("hashchange",()=>{ const k=location.hash.slice(1); if(TABS.some(t=>t[0]===k)&&k!==cur) go(k); });
})();
