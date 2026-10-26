/* MATH 127 Interactive: quiz prep. quiz.html lists the quizzes; quiz-N.html is the prep page for one quiz. */
(function(){
"use strict";
const M=window.M127, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("quiz");
const app=$("#app");
const QID=document.documentElement.getAttribute("data-quiz");
const quizzes=C.quizzes.filter(q=>!q.midterm && q.n>=2);
const hasData=q=>q.lectures.some(id=>M.lec(id));

if(!QID){ /* ---------- hub ---------- */
  const hero=el("section",{class:"hero slim"});
  hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px">Quiz prep · weekly quizzes, Mondays 5:30 to 6:20 pm</p><h1>One page for <em>each quiz</em>.</h1><p class="lede">Every quiz from Quiz 2 on has 8 multiple choice questions worth 1 mark each, then about 4 long answer questions worth 2 to 4 marks. Long answers come straight from the course notes. Each page drills exactly the lectures that quiz adds, with an optional 50-minute timer.</p></div></div>`;
  app.append(hero);
  const w=el("div",{class:"wrap view"}); app.append(w);
  const g=el("div",{class:"mods"}); w.append(g);
  const today=M.today();
  quizzes.forEach(q=>{ const ready=hasData(q); const past=M.parseDate(q.date)<today; const best=(M.db().exam["quiz-"+q.id]||{}).best;
    const lecs=q.lectures.map(id=>{ const r=C.schedule.find(x=>x[0]===id); return `L${+id.slice(1)}`; }).join(", ");
    const units=[...new Set(q.lectures.map(id=>C.units.find(u=>u.lectures.includes(id))).filter(Boolean))];
    const c=units[0]?`var(--${units[0].id})`:"var(--ink2)";
    g.insertAdjacentHTML("beforeend",ready?`<a class="mod" href="quiz-${q.n}.html" style="--c:${c}"><div class="top"><span class="icon">${M.ICON.quiz}</span><div><div class="num">${M.fmtDate(q.date,{weekday:"short",month:"short",day:"numeric"})}${past?" · written":""}</div><h3>Quiz ${q.n}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">Adds ${lecs}. Covers ${esc(q.covers)}.</p><div class="prog">${best!=null?`<span>practice best: <b>${best}%</b></span>`:"<span>not practised yet</span>"}<span class="go">Open</span></div></a>`
      :`<div class="mod" style="--c:var(--ink2);opacity:.7"><div class="top"><span class="icon">${M.ICON.quiz}</span><div><div class="num">${M.fmtDate(q.date,{weekday:"short",month:"short",day:"numeric"})}</div><h3>Quiz ${q.n}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">Will cover ${lecs} (${esc(q.covers)}). This page opens once those lectures are added.</p></div>`); });
  w.append(el("p",{class:"muted",style:"margin-top:18px",html:`Quiz 1 was the high school diagnostic. Its practice version is on the <a href="midterm.html#review">Midterm prep</a> page with the other practice questions.`}));
  M.footer(); return;
}

/* ---------- one quiz ---------- */
const Q=C.quizzes.find(q=>q.id===QID);
const db=M.db(); const prefs=db.prefs["quiz-"+QID]||(db.prefs["quiz-"+QID]={cum:false});
const lecsNew=Q.lectures.filter(id=>M.lec(id));
const allBefore=()=>{ const out=[]; for(const q of C.quizzes){ q.lectures.forEach(id=>{ if(M.lec(id)) out.push(id); }); if(q.id===QID) break; } return out; };
const LECS=()=>prefs.cum?allBefore():lecsNew;
const U=C.units.find(u=>u.lectures.includes(lecsNew[0]))||C.units[0];
document.documentElement.style.setProperty("--c",`var(--${U.id})`);
const hero=el("section",{class:"hero slim"});
const days=Math.ceil((M.parseDate(Q.date)-M.today())/864e5);
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--c)">Quiz ${Q.n} · ${M.fmtDate(Q.date,{weekday:"long",month:"long",day:"numeric"})} · 5:30 to 6:20 pm · ${Q.weight}</p><h1>Quiz ${Q.n} prep</h1><p class="lede">Covers ${esc(Q.covers)}. New since the last quiz: ${lecsNew.map(id=>{ const L=M.lec(id); return `<a href="${M.lecURL(id)}">Lecture ${L.n}</a>`; }).join(", ")}. Quizzes are cumulative, so switch on earlier lectures when you want the full range.</p></div>
  <div class="count"><div class="big" style="color:var(--c)">${days>0?days:days===0?"Today":"Done"}</div><div class="muted">${days>0?`day${days===1?"":"s"} to go`:days===0?"Good luck.":"Already written. Still good review for the final."}</div></div></div>`;
app.append(hero);
const sub=el("div",{class:"subnav"}); const sw=el("div",{class:"wrap"}); sub.append(sw); app.append(sub);
const TABS=[["quiz","Practice quiz"],["problems","Problems"],["prof","Prof's practice quiz"],["formulas","Formulas"]];
TABS.forEach(([k,t])=>sw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
const cum=el("label",{class:"row small",style:"margin-left:auto;gap:6px"}); const cb=el("input",{type:"checkbox"}); cb.checked=prefs.cum; cb.onchange=()=>{ prefs.cum=cb.checked; M.save(); go(cur); };
cum.append(cb,document.createTextNode("Include earlier lectures")); sw.append(cum);
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer();
let cur="quiz";
function go(k){ cur=k; M.$$(".tab",sw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); view.innerHTML=""; ({quiz,problems,prof,formulas}[k])(); history.replaceState(null,"","#"+k); }

function quiz(){
  const host=el("div"); view.append(host);
  const items=()=>{ const out=[]; LECS().forEach(id=>{ const L=M.lec(id); (L.exam||[]).forEach(q=>out.push({...q,kind:"mc",lec:id})); (L.gens||[]).forEach(g=>out.push({kind:"gen",gid:g.id,lec:id,diff:2,id:g.id})); }); return out; };
  EXAM.mount(host,{key:"quiz-"+QID,title:`Practice Quiz ${Q.n}`,intro:`Same shape as the real one: 8 multiple choice, then 4 short-answer problems in place of the long answers. ${prefs.cum?"Drawn from every lecture up to this quiz.":"Drawn from the lectures this quiz adds."} Write your long-answer working on paper as if a marker will read it.`,
    items, fixedSize:12, allowTimer:true, timeLimit:50,
    select:(pool)=>{ const mc=pool.filter(q=>q.kind==="mc"), gen=pool.filter(q=>q.kind==="gen");
      const take=(arr,n)=>{ const by={}; M.shuffle(arr).forEach(q=>(by[q.lec]=by[q.lec]||[]).push(q)); const keys=M.shuffle(Object.keys(by)); const out=[]; while(out.length<n){ let add=false; for(const k of keys){ if(by[k].length&&out.length<n){ out.push(by[k].pop()); add=true; } } if(!add) break; } return out; };
      return [...take(mc,8),...take(gen,4)]; }});
}
function problems(){
  const top=el("div",{class:"card"}); top.append(el("h2",{},"Endless problems"),el("p",{class:"muted small"},`From ${LECS().map(id=>"L"+(+id.slice(1))).join(", ")}. New numbers every time.`));
  const dh=el("div",{style:"max-width:360px"}); top.append(dh); let diff=2; PLOT.seg(dh,{items:[[1,"Easy"],[2,"Medium"],[3,"Hard"]],value:2,onchange:v=>{ diff=v; }});
  view.append(top); const host=el("div"); view.append(host);
  function next(){ host.innerHTML=""; const gids=[]; LECS().forEach(id=>(M.lec(id).gens||[]).forEach(g=>gids.push(g.id))); ENGINE.problem(host,{gid:gids[Math.floor(Math.random()*gids.length)],diff,diffLabel:true,showNew:false}); host.append(el("button",{class:"btn",type:"button",onclick:next},"Next problem")); }
  next();
}
function prof(){
  const set=Q.practice; const items=(M.extras.review||[]).filter(r=>r.set===set);
  if(!items.length){ view.append(el("p",{class:"muted"},"The practice quiz for this one isn't on the site.")); return; }
  view.append(el("p",{class:"muted",style:"max-width:46em"},`Practice Quiz ${Q.n} from the prof, question by question. Answer on paper first, then open the answer and rate yourself. Ratings feed your study plan on the Midterm prep page.`));
  items.forEach(r=>view.append(window.REVIEW_CARD?REVIEW_CARD(r):el("div")));
}
function formulas(){
  const g=el("div",{class:"fs-grid"});
  LECS().forEach(id=>{ const L=M.lec(id); (L.formulas||[]).forEach(f=>{ const c=el("div",{class:"fcard",style:`--c:var(--${L.unit})`}); c.innerHTML=`<div class="nm">${rich(f.name)}</div><div class="tx">${M.tex(f.tex,true)}</div>${f.note?`<div class="nt">${rich(f.note)}</div>`:""}<span class="ref">Lecture ${L.n}, ${esc(f.ref||"")}</span>`; g.append(c); }); });
  view.append(el("p",{class:"muted",html:`Drill these with flashcards on the <a href="formulas.html#mode=flash">formula sheet</a>.`}),g);
}
const h=location.hash.slice(1); go(TABS.some(t=>t[0]===h)?h:"quiz");
window.addEventListener("hashchange",()=>{ const k=location.hash.slice(1); if(TABS.some(t=>t[0]===k)&&k!==cur) go(k); });
})();
