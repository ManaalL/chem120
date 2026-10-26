/* CHEM 120 Interactive: Test 2 prep.
   Practice test (real format) · Sample tests (fixed versions written for this site) · Course-notes examples · Mistake log · Study plan */
(function(){
"use strict";
const M=window.C120, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("midterm");
document.documentElement.style.setProperty("--c","var(--mid)");
const app=$("#app"); const db=M.db();
const T=C.test;
const prefs=db.prefs.test2||(db.prefs.test2={mods:["m2","m3","m4"],date:null,time:null,set:null,showLN:false,early:false});
const examAt=()=>new Date((prefs.date||T.date)+"T"+(prefs.time||T.time));
const REV=M.extras.review||[], EXS=M.extras.examples||[];
const CHS=()=>T.chapters.concat(prefs.early?T.alsoReview:[]).filter(id=>M.chap(id));
const modOf=id=>C.modules.find(u=>u.chapters.includes(id));

/* hero + countdown */
const hero=el("section",{class:"hero slim"});
const modsCovered=[...new Set(T.chapters.map(id=>modOf(id).n))];
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--mid)">${esc(T.label)} · ${M.fmtDate(T.date,{weekday:"long",month:"long",day:"numeric"})} · in class</p><h1>Test 2 prep: <em>Modules ${modsCovered.join(", ")}</em></h1><p class="lede">Assumed format: ${esc(T.format)}. Assumed coverage: ${esc(T.covers)}. ${esc(T.assumed)}</p></div><div class="count" id="count"></div></div>`;
app.append(hero);
function count(){ const box=$("#count"); const ms=examAt()-new Date(); const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5);
  box.innerHTML=ms>0?`<div class="big">${d}</div><div class="muted">day${d===1?"":"s"}, ${h} hour${h===1?"":"s"} to go</div><div class="small muted" style="margin-top:4px">${examAt().toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}, ${examAt().toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"})}</div>`:`<div class="big">Done</div><div class="muted">This date has passed.</div>`;
  const ch=el("button",{class:"sbtn",type:"button",style:"margin-top:8px"},prefs.date||prefs.time?"Back to Nov 11, 8:30 am":"Change the date or time");
  ch.onclick=()=>{ if(prefs.date||prefs.time){ prefs.date=null; prefs.time=null; M.save(); count(); return; }
    const d=el("input",{type:"date","aria-label":"Test date",value:T.date}); const t=el("input",{type:"time","aria-label":"Test time",value:T.time}); const ok=el("button",{class:"sbtn",type:"button"},"Save");
    ok.onclick=()=>{ prefs.date=d.value||T.date; prefs.time=t.value||T.time; M.save(); count(); }; ch.replaceWith(el("div",{class:"row",style:"justify-content:center;margin-top:8px;gap:6px"},d,t,ok)); };
  box.append(ch); }
count(); setInterval(count,60000);

const sub=el("div",{class:"subnav"}); const sw=el("div",{class:"wrap"}); sub.append(sw); app.append(sub);
const TABS=[["exam","Practice test"],["samples","Sample tests"],["examples","Course-notes examples"],["mistakes","Mistake log"],["plan","Study plan"]];
TABS.forEach(([k,t])=>sw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer("Sample tests and course-notes example parallels are written for this site in the style of the CHEM 120 tests and course notes. No real test or assignment question is reproduced.");
function go(k){ M.$$(".tab",sw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); ENGINE.cleanup(view); view.innerHTML=""; ({exam,samples,examples,mistakes,plan}[k]||exam)(); history.replaceState(null,"","#"+k); }

function chapterPicker(onChange){
  const box=el("div",{class:"chips",style:"margin:8px 0 12px"});
  const b=el("button",{class:"chip",type:"button","aria-pressed":String(!!prefs.early)},"Also review chapters 2.1 to 2.3 (Test 1 material)");
  b.onclick=()=>{ prefs.early=!prefs.early; M.save(); onChange(); }; box.append(b); return box;
}

/* ---------- practice test ---------- */
function exam(){
  const host=el("div"); view.append(host);
  EXAM.mount(host,{key:"test2",title:"Practice Test 2",intro:"15 questions in the test format: five options, one mark each, a few select-all, and numeric questions where you choose the closest answer. New questions every attempt. Use the data sheet values only. Afterwards you get a breakdown by chapter and a list of what to relearn.",
    items:()=>EXAM.testPool(CHS()), fixedSize:15, allowTimer:true, timeLimit:45,
    picker:(rerender)=>chapterPicker(rerender), select:EXAM.selectTest});
}

/* ---------- fixed sample tests ---------- */
function samples(){
  const sets=[...new Set(REV.map(r=>r.set))];
  const label=s=>(REV.find(r=>r.set===s)||{}).setLabel||s;
  if(!sets.length){ view.append(el("p",{class:"muted"},"No sample tests loaded yet.")); return; }
  if(!sets.includes(prefs.set)) prefs.set=sets[0];
  const tot=REV.length, v=REV.map(r=>db.review[r.id]); const got=v.filter(x=>x==="got").length, sh=v.filter(x=>x==="shaky").length, no=v.filter(x=>x==="no").length;
  const intro=el("div",{class:"card"});
  intro.innerHTML=`<h2>Sample tests</h2><p class="muted" style="margin:0 0 6px">Fixed versions written for this site in the real format, so you can take a whole test on paper, mark it, and rate each question. Answer first, then open the answer and rate yourself honestly. Shaky and no idea go into your study plan.</p>
   <div class="bar"><i style="width:${got/tot*100}%;background:#2a7648"></i><i style="width:${sh/tot*100}%;background:#d9a12b"></i><i style="width:${no/tot*100}%;background:#b0342c"></i></div>
   <div class="stat3"><span><b>${got}</b> got it</span><span><b>${sh}</b> shaky</span><span><b>${no}</b> no idea</span><span><b>${tot-got-sh-no}</b> not rated yet</span></div>`;
  const bar=el("div",{class:"chips",style:"margin:6px 0"});
  sets.forEach(s=>{ const n=REV.filter(r=>r.set===s).length; bar.append(el("button",{class:"chip",type:"button","aria-pressed":String(s===prefs.set),onclick:()=>{ prefs.set=s; M.save(); go("samples"); }},`${label(s)} (${n})`)); });
  let showAll=false; const tg=el("button",{class:"sbtn",type:"button"},"Show all answers");
  const timed=el("button",{class:"sbtn",type:"button"},"Take it as a timed test");
  intro.append(bar,el("div",{class:"row"},tg,timed)); view.append(intro);
  const list=el("div"); view.append(list);
  const draw=()=>{ list.innerHTML=""; REV.filter(r=>r.set===prefs.set).forEach((r,i)=>{ list.append(el("p",{class:"kicker",style:"margin:14px 0 4px"},`Question ${i+1}`), ENGINE.reviewCard(r,{showAll})); }); };
  tg.onclick=()=>{ showAll=!showAll; tg.textContent=showAll?"Hide all answers":"Show all answers"; draw(); };
  timed.onclick=()=>{ ENGINE.cleanup(view); view.innerHTML=""; const host=el("div"); view.append(host); const items=REV.filter(r=>r.set===prefs.set).map(r=>({...r,kind:"mc",keep:true}));
    EXAM.mount(host,{key:"sample-"+prefs.set,title:label(prefs.set),intro:"The fixed version, in order, with the 45-minute timer if you want it.",items,fixedSize:items.length,allowTimer:true,timeLimit:45,select:p=>p}); };
  draw();
}

/* ---------- course-notes examples ---------- */
function examples(){
  const intro=el("div",{class:"card"});
  const rated=EXS.filter(r=>db.review[r.id]).length;
  intro.innerHTML=`<h2>Every course-notes example, with a full solution</h2><p class="muted" style="margin:0 0 6px">The course notes leave most examples blank for class. Here is a parallel version of each numbered example (same skill, new numbers or a new species) with a worked solution, labelled with the example number and page. Work it on paper, compare line by line, and rate yourself. You have rated ${rated} of ${EXS.length}.</p>`;
  view.append(intro);
  const mods=[...new Set(EXS.map(r=>(modOf(r.lec)||{}).id).filter(Boolean))];
  let pick=prefs.exMod&&mods.includes(prefs.exMod)?prefs.exMod:"all"; let filt=prefs.exFilter||"all";
  const row=el("div",{class:"chips",style:"margin:6px 0"});
  [["all","All modules"],...mods.map(m=>[m,`Module ${m.slice(1)}`])].forEach(([k,t])=>row.append(el("button",{class:"chip",type:"button","aria-pressed":String(pick===k),onclick:()=>{ prefs.exMod=k; M.save(); go("examples"); }},t)));
  const row2=el("div",{class:"chips",style:"margin:6px 0"});
  [["all","Everything"],["un","Not rated"],["weak","Shaky or no idea"]].forEach(([k,t])=>row2.append(el("button",{class:"chip",type:"button","aria-pressed":String(filt===k),onclick:()=>{ prefs.exFilter=k; M.save(); go("examples"); }},t)));
  intro.append(row,row2);
  const list=EXS.filter(r=>(pick==="all"||(modOf(r.lec)||{}).id===pick)&&(filt==="all"||(filt==="un"&&!db.review[r.id])||(filt==="weak"&&/shaky|no/.test(db.review[r.id]||""))));
  view.append(el("p",{class:"muted small"},`${list.length} examples`));
  let shown=0; const more=el("button",{class:"btn ghost",type:"button"},"Show more");
  const add=()=>{ list.slice(shown,shown+20).forEach(r=>more.before(ENGINE.reviewCard({...r,a:r.ans,steps:r.sol,src:r.src}))); shown+=20; if(shown>=list.length) more.remove(); };
  view.append(more); more.onclick=add; add();
}

/* ---------- mistake log ---------- */
function mistakes(){
  const all=db.mistakes||[]; let f=prefs.mf||"open";
  const open=all.filter(m=>!m.fixed), fixed=all.filter(m=>m.fixed);
  const c=el("div",{class:"card"});
  c.innerHTML=`<h2>Mistake log</h2><p class="muted" style="margin:0 0 8px">Every problem you got wrong on the first try, or opened the solution for, anywhere on the site. Redo it with exactly the same numbers. Solve it and it moves to Fixed.</p><div class="stat3"><span><b>${open.length}</b> to redo</span><span><b>${fixed.length}</b> fixed</span></div>`;
  const row=el("div",{class:"row"});
  [["open","To redo"],["fixed","Fixed"]].forEach(([k,t])=>row.append(el("button",{class:"chip",type:"button","aria-pressed":String(f===k),onclick:()=>{ prefs.mf=k; M.save(); go("mistakes"); }},t)));
  if(fixed.length) row.append(el("button",{class:"sbtn",type:"button",onclick:()=>{ db.mistakes=open; M.save(); go("mistakes"); }},"Clear fixed"));
  c.append(row); view.append(c);
  const list=f==="open"?open:fixed;
  if(!list.length){ view.append(el("p",{class:"muted"},f==="open"?"Nothing to redo. Problems you miss will show up here.":"Nothing fixed yet.")); return; }
  list.slice(0,80).forEach(m=>{
    const L=M.chap(m.lec); if(!L) return;
    const wrap=el("div",{class:"card",style:`--c:var(--${L.module})`});
    const when=new Date(m.when).toLocaleDateString("en-CA",{month:"short",day:"numeric"});
    const title=m.gid?(M.gen(m.gid)||{}).title:"Multiple choice";
    wrap.append(el("div",{class:"row",style:"gap:8px;margin-bottom:6px",html:`<span class="pill">Ch ${L.num}</span><b>${rich(title||"")}</b><span class="ref">missed ${when}${m.src?" · "+esc(m.src):""}${m.gaveUp?" · opened the solution":""}${m.fixed?" · fixed":""}</span>`}));
    const host=el("div"); wrap.append(host);
    const redo=el("button",{class:"btn sm",type:"button",onclick:()=>{ redo.remove(); host.innerHTML="";
      if(m.gid && M.gen(m.gid)) ENGINE.problem(host,{gid:m.gid,seed:m.seed,diff:m.diff||2,fromMistakes:true,showNew:false,onSolved:()=>{ M.fixMistake(m.gid,m.seed); }});
      else if(m.mc){ let q=null; M.chapters.forEach(LL=>(LL.exam||[]).forEach(x=>{ if(x.id===m.mc) q=x; })); REV.forEach(x=>{ if(x.id===m.mc) q=x; }); if(q) ENGINE.mcq(host,q,ok=>{ if(ok){ m.fixed=true; m.fixedAt=Date.now(); M.save(); } }); } }},m.fixed?"Try it again":"Redo it");
    wrap.append(redo); view.append(wrap); });
}

/* ---------- study plan ---------- */
function plan(){
  const ms=examAt()-new Date(); const daysLeft=Math.max(0,Math.ceil(ms/864e5));
  const lecs=T.chapters.map(id=>M.chap(id)).filter(Boolean);
  const weak=(window.GUIDE&&GUIDE.weak?GUIDE.weak():[]);
  const lf=L=>(L.formulas||[]); const boxOf=id=>((db.leitner[id]||{}).box||0);
  const ready=L=>{ const f=lf(L); return f.length?f.reduce((s,x)=>s+Math.max(0,boxOf(x.id)-1)/4,0)/f.length:1; };
  const score=L=>{ const w=weak.find(t=>t.lid===L.id); const st=M.chState(L.id); let s=0; const why=[];
    if(w){ s+=w.w*2; if(w.total) why.push(`${w.right} of ${w.total} right first try`); if(w.shaky) why.push("questions rated shaky or no idea"); }
    if(M.upcoming(L)){ s+=1; why.push("not taught yet: do it right after class"); }
    else if(!st.done){ s+=2.5; why.push("chapter not finished"); } else if(st.best!=null && st.best<.7){ s+=1.5; why.push(`chapter best ${Math.round(st.best*100)}%`); }
    const r=ready(L); if(r<.5){ s+=(1-r)*2; why.push(`formulas ${Math.round(r*100)}% ready`); }
    const openM=(db.mistakes||[]).filter(m=>!m.fixed&&m.lec===L.id).length; if(openM){ s+=Math.min(2,openM*.5); why.push(`${openM} mistake${openM>1?"s":""} to redo`); }
    const ex=EXS.filter(r=>r.lec===L.id), exR=ex.filter(r=>db.review[r.id]).length; if(ex.length&&exR<Math.min(2,ex.length)){ s+=.8; why.push(`${exR} of ${ex.length} course-notes examples rated`); }
    return {L,s,why}; };
  const ranked=lecs.map(score).sort((a,b)=>b.s-a.s);
  const ex=db.exam||{};
  const c=el("div",{class:"card"});
  const modBest=C.modules.filter(u=>u.chapters.some(id=>T.chapters.includes(id)&&M.chap(id))).map(u=>`<span>Module ${u.n} mini exam: <b>${ex["unit-"+u.id]?ex["unit-"+u.id].best+"%":"not taken"}</b></span>`).join("");
  const allF=lecs.flatMap(lf); const fr=allF.length?Math.round(allF.reduce((s,x)=>s+Math.max(0,boxOf(x.id)-1)/4,0)/allF.length*100):0;
  c.innerHTML=`<h2>My study plan</h2><p class="muted">Built from your chapter scores, problem accuracy, practice tests, ratings, formula boxes and mistake log. It changes every time you do something.</p>
   <div class="stat3"><span>Study days left, counting today: <b>${daysLeft}</b></span><span>Chapters done: <b>${lecs.filter(L=>M.chState(L.id).done).length} of ${lecs.length}</b></span><span>Formula readiness: <b>${fr}%</b></span><span>Practice test: <b>${ex.test2?ex.test2.best+"%":"not taken"}</b></span><span>Mistakes to redo: <b>${(db.mistakes||[]).filter(m=>!m.fixed).length}</b></span></div><div class="stat3">${modBest}</div>`;
  view.append(c);
  const top=ranked.filter(x=>x.s>0).slice(0,8);
  const pc=el("div",{class:"card"}); pc.append(el("h3",{},"Go back to these first"));
  if(!top.length) pc.append(el("p",{},"Everything looks solid. Take a practice test with the timer and a sample test on paper to make sure."));
  const ol=el("ol",{class:"plan"});
  top.forEach(({L,why})=>{ const u=M.mod(L.module); const li=el("li",{style:`--c:var(--${L.module})`});
    li.innerHTML=`<b>${L.num} ${rich(L.title)}</b> <span class="why">(${esc(why.join("; "))})</span>`;
    li.append(el("div",{class:"row",style:"gap:6px;margin-top:4px"},el("a",{class:"sbtn",href:M.chURL(L.id)},"Open the chapter"),el("a",{class:"sbtn",href:`formulas.html#u=${L.module}&mode=flash`},"Drill its formulas"),el("a",{class:"sbtn",href:`module-${u.n}.html#practice`},"Practise the module")));
    ol.append(li); });
  pc.append(ol); view.append(pc);
  if(daysLeft>0){
    const dd=el("div",{class:"card"}); dd.append(el("h3",{},"Day by day until Test 2"));
    const order=ranked.map(x=>x.L); const days=Math.max(1,daysLeft-1); const per=Math.max(1,Math.ceil(order.length/days));
    const ul=el("ol",{class:"plan"}); const start=M.today();
    for(let d=0; d<daysLeft; d++){
      const date=new Date(start.getTime()+d*864e5); const lab=date.toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"});
      let html;
      if(d===daysLeft-1) html=`<b>${lab}</b>: one practice test with the 45-minute timer, then redo every question you missed. Flashcards for anything still in box 1 or 2. Sleep.`;
      else { const chunk=order.slice(d*per,(d+1)*per); html=chunk.length?`<b>${lab}</b>: ${chunk.map(L=>`<a href="${M.chURL(L.id)}">${L.num} ${esc(L.title.replace(/\$[^$]*\$/g,"").slice(0,48))}</a>`).join(", ")}. Redo its mistakes, work its course-notes examples, turn its 3D models once more, and 10 minutes of flashcards.`:`<b>${lab}</b>: mixed hard practice in the <a href="gym.html">gym</a>, plus the sample-test questions you rated shaky.`; }
      ul.append(el("li",{html})); }
    dd.append(ul); view.append(dd);
  }
  const unrated=REV.filter(r=>!db.review[r.id]).length;
  if(unrated) view.append(el("div",{class:"card",html:`<b>${unrated} sample-test questions are not rated yet.</b> Rating them makes this plan more accurate. <a href="#samples" onclick="event.preventDefault();document.querySelector('[data-t=samples]').click()">Rate them</a>.`}));
}

const h=location.hash.slice(1); go(TABS.some(t=>t[0]===h)?h:"exam");
window.addEventListener("hashchange",()=>{ const k=location.hash.slice(1); if(TABS.some(t=>t[0]===k)) go(k); });
})();
