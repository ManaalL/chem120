/* MATH 127 Interactive: midterm prep.
   Practice midterm · Long answer (course-notes problems) · Prof's practice questions · Mistake log · Study plan */
(function(){
"use strict";
const M=window.M127, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("midterm");
document.documentElement.style.setProperty("--c","var(--mid)");
const app=$("#app"); const db=M.db();
const prefs=db.prefs.midterm||(db.prefs.midterm={units:C.units.map(u=>u.id),date:null,laUnits:null,laSet:null,set:"PQ2",showLN:false});
const MT=C.midterm;
const examAt=()=>prefs.date?new Date(prefs.date+"T19:00"):new Date(MT.date+"T"+MT.time);
const REV=M.extras.review||[], LA=M.extras.longAnswer||[];
const unitOfLec=id=>C.units.find(u=>u.lectures.includes(id));

/* hero + countdown */
const hero=el("section",{class:"hero slim"});
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--mid)">Midterm · ${M.fmtDate(MT.date,{weekday:"long",month:"long",day:"numeric"})} · 7:00 to 8:50 pm · ${MT.weight}</p><h1>Midterm prep: <em>Lectures 1 to 17</em></h1><p class="lede">${esc(MT.format)}. It covers ${esc(MT.covers)}. Every long answer question comes straight from the course notes: examples, mid-section exercises, and end-of-section and end-of-chapter problems. Marks come off for missing steps and bad notation, so practise writing full solutions.</p></div><div class="count" id="count"></div></div>`;
app.append(hero);
function count(){ const box=$("#count"); const ms=examAt()-new Date(); const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5);
  box.innerHTML=ms>0?`<div class="big">${d}</div><div class="muted">day${d===1?"":"s"}, ${h} hour${h===1?"":"s"} to go</div><div class="small muted" style="margin-top:4px">${examAt().toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}, ${examAt().toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"})}</div>`:`<div class="big">Done</div><div class="muted">This date has passed.</div>`;
  const ch=el("button",{class:"sbtn",type:"button",style:"margin-top:8px"},prefs.date?"Back to the midterm date":"Use a different date"); ch.onclick=()=>{ if(prefs.date){ prefs.date=null; M.save(); count(); return; } const inp=el("input",{type:"date","aria-label":"Exam date"}); ch.replaceWith(inp); inp.focus(); inp.onchange=()=>{ if(inp.value){ prefs.date=inp.value; M.save(); count(); } }; }; box.append(ch); }
count(); setInterval(count,60000);

const sub=el("div",{class:"subnav"}); const sw=el("div",{class:"wrap"}); sub.append(sw); app.append(sub);
const TABS=[["exam","Practice midterm"],["long","Long answer"],["review","Prof's practice questions"],["mistakes","Mistake log"],["plan","Study plan"]];
TABS.forEach(([k,t])=>sw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer("Practice questions are from the MATH 127 practice quizzes and practice midterms. Answers without an official key were worked out for this site.");
function go(k){ M.$$(".tab",sw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); view.innerHTML=""; ({exam,long,review,mistakes,plan}[k]||exam)(); history.replaceState(null,"","#"+k); }

function unitPicker(key,onChange){
  const box=el("div",{class:"chips",style:"margin:8px 0 12px"}); const sel=prefs[key]||(prefs[key]=C.units.map(u=>u.id));
  C.units.forEach(u=>{ if(!u.lectures.some(id=>M.lec(id))) return; const b=el("button",{class:"chip",type:"button",style:`--c:var(--${u.id})`,"aria-pressed":String(sel.includes(u.id))},`Unit ${u.n}: ${u.short}`);
    b.onclick=()=>{ const i=sel.indexOf(u.id); if(i>=0){ if(sel.length>1) sel.splice(i,1); } else sel.push(u.id); M.save(); onChange(); }; box.append(b); });
  return box;
}

/* ---------- practice midterm ---------- */
function exam(){
  const host=el("div"); view.append(host);
  const items=()=>{ const out=[]; M.lectures.forEach(L=>{ if(!prefs.units.includes(L.unit)) return; (L.exam||[]).forEach(q=>out.push({...q,kind:"mc",lec:L.id})); (L.gens||[]).forEach(g=>out.push({kind:"gen",gid:g.id,lec:L.id,diff:R3(),id:g.id})); }); return out; };
  const R3=()=>2+Math.round(Math.random());
  EXAM.mount(host,{key:"midterm",title:"Practice midterm",intro:"12 multiple choice like the real thing, then 8 problems you answer in the box (medium and hard). Pick the units to include. For the full long-answer experience, do a set on the Long answer tab afterwards.",
    items, fixedSize:20, allowTimer:true, timeLimit:110,
    picker:(rerender)=>unitPicker("units",rerender),
    select:(pool)=>{ const take=(arr,n)=>{ const by={}; M.shuffle(arr).forEach(q=>(by[q.lec]=by[q.lec]||[]).push(q)); const keys=M.shuffle(Object.keys(by)); const out=[]; while(out.length<n){ let add=false; for(const k of keys){ if(by[k].length&&out.length<n){ out.push(by[k].pop()); add=true; } } if(!add) break; } return out; };
      return [...take(pool.filter(q=>q.kind==="mc"),12),...take(pool.filter(q=>q.kind==="gen"),8)]; }});
}

/* ---------- long answer ---------- */
function long(){
  const intro=el("div",{class:"card"});
  const rated=LA.filter(r=>db.review[r.id]).length;
  intro.innerHTML=`<h2>Long answer: straight from the course notes</h2><p class="muted" style="margin:0 0 6px">${LA.length} examples, exercises and problems from chapters 1 and 2 of the course notes, each with a full solution. Write your solution on paper the way a marker wants it (every step, correct notation), then compare line by line and rate yourself. You have rated ${rated} so far.</p>`;
  view.append(intro);
  const mode=el("div",{style:"max-width:420px;margin:0 0 10px"}); intro.append(mode);
  let m=prefs.laMode||"set";
  PLOT.seg(mode,{items:[["set","Practice set of 8"],["browse","Browse all"]],value:m,onchange:v=>{ prefs.laMode=v; M.save(); go("long"); }});
  intro.append(unitPicker("laUnits",()=>go("long")));
  const lnRow=el("label",{class:"row small",style:"gap:6px"}); const lb=el("input",{type:"checkbox"}); lb.checked=!!prefs.showLN; lb.onchange=()=>{ prefs.showLN=lb.checked; M.save(); go("long"); }; lnRow.append(lb,document.createTextNode("Include section 2.4.5 (exponential growth and decay), which was not lectured")); intro.append(lnRow);
  const pool=LA.filter(r=>{ const u=unitOfLec(r.lec); return u&&prefs.laUnits.includes(u.id)&&(prefs.showLN||!r.notLectured); });
  const host=el("div"); view.append(host);
  if(m==="set"){
    const key="laSet"; let set=(prefs[key]||[]).filter(id=>pool.some(r=>r.id===id));
    const draw=()=>{ // weight: unrated and shaky/no first, spread over lectures
      const w=r=>{ const v=db.review[r.id]; return v==="no"?4:v==="shaky"?3:!v?2:0.4; };
      const by={}; M.shuffle(pool).forEach(r=>(by[r.lec]=by[r.lec]||[]).push(r)); Object.values(by).forEach(a=>a.sort((x,y)=>w(y)-w(x)));
      const keys=M.shuffle(Object.keys(by)); const out=[]; while(out.length<8){ let add=false; for(const k of keys){ if(by[k].length&&out.length<8){ out.push(by[k].shift().id); add=true; } } if(!add) break; }
      prefs[key]=out; M.save(); go("long"); };
    if(!set.length){ host.append(el("button",{class:"btn",type:"button",onclick:draw},"Draw 8 problems")); return; }
    const score=()=>{ const v=set.map(id=>db.review[id]); const got=v.filter(x=>x==="got").length, sh=v.filter(x=>x==="shaky").length; return {got,sh,done:v.filter(Boolean).length}; };
    const sc=el("div",{class:"stat3"}); const upd=()=>{ const s=score(); sc.innerHTML=`<span>Rated <b>${s.done}</b> of ${set.length}</span><span><b>${s.got}</b> got it</span><span><b>${s.sh}</b> shaky</span>${s.done===set.length?`<span>Self-marked score: <b>${Math.round((s.got+s.sh*.5)/set.length*100)}%</b></span>`:""}`; };
    host.append(el("div",{class:"row"},el("button",{class:"btn ghost",type:"button",onclick:draw},"Draw a new set"),sc));
    set.forEach((id,i)=>{ const r=LA.find(x=>x.id===id); host.append(el("p",{class:"kicker",style:"margin:16px 0 4px"},`Problem ${i+1} of ${set.length}`), ENGINE.reviewCard(r,{onRate:upd})); });
    upd();
  } else {
    const fl=el("div",{class:"row",style:"gap:6px;margin:6px 0 10px"});
    let filt=prefs.laFilter||"all";
    [["all","All"],["un","Not rated"],["weak","Shaky or no idea"],["example","Examples"],["exercise","Exercises"],["problem","Section problems"],["chapter","Chapter problems"]].forEach(([k,t])=>fl.append(el("button",{class:"chip",type:"button","aria-pressed":String(filt===k),onclick:()=>{ prefs.laFilter=k; M.save(); go("long"); }},t)));
    host.append(fl);
    const list=pool.filter(r=>filt==="all"||(filt==="un"&&!db.review[r.id])||(filt==="weak"&&/shaky|no/.test(db.review[r.id]||""))||r.kind===filt).sort((a,b)=>(M.lec(a.lec)?.n||99)-(M.lec(b.lec)?.n||99));
    host.append(el("p",{class:"muted small"},`${list.length} problems`));
    let shown=0; const more=el("button",{class:"btn ghost",type:"button"},"Show more");
    const add=()=>{ list.slice(shown,shown+25).forEach(r=>more.before(ENGINE.reviewCard(r))); shown+=25; if(shown>=list.length) more.remove(); };
    host.append(more); more.onclick=add; add();
  }
}

/* ---------- prof's practice questions ---------- */
function review(){
  const sets=[...new Set(REV.map(r=>r.set))];
  const label=s=>s.startsWith("PQ")?`Practice Quiz ${s.slice(2)}`:s==="PMA"?"Practice Midterm A":s==="PMB"?"Practice Midterm B":s;
  if(!sets.length){ view.append(el("p",{class:"muted"},"No practice questions loaded.")); return; }
  if(!sets.includes(prefs.set)) prefs.set=sets.includes("PMA")?"PMA":sets[0];
  const tot=REV.length, v=REV.map(r=>db.review[r.id]); const got=v.filter(x=>x==="got").length, sh=v.filter(x=>x==="shaky").length, no=v.filter(x=>x==="no").length;
  const intro=el("div",{class:"card"});
  intro.innerHTML=`<h2>The prof's practice questions</h2><p class="muted" style="margin:0 0 6px">Every question from the practice quizzes and both practice midterms. Answer on paper first, then open the answer and rate yourself honestly. Shaky and no idea go into your study plan.</p>
   <div class="bar"><i style="width:${got/tot*100}%;background:#2a7648"></i><i style="width:${sh/tot*100}%;background:#d9a12b"></i><i style="width:${no/tot*100}%;background:#b0342c"></i></div>
   <div class="stat3"><span><b>${got}</b> got it</span><span><b>${sh}</b> shaky</span><span><b>${no}</b> no idea</span><span><b>${tot-got-sh-no}</b> not rated yet</span></div>`;
  const bar=el("div",{class:"chips",style:"margin:6px 0"});
  sets.forEach(s=>{ const n=REV.filter(r=>r.set===s).length; bar.append(el("button",{class:"chip",type:"button","aria-pressed":String(s===prefs.set),onclick:()=>{ prefs.set=s; M.save(); go("review"); }},`${label(s)} (${n})`)); });
  let showAll=false; const tg=el("button",{class:"sbtn",type:"button"},"Show all answers");
  intro.append(bar,tg); view.append(intro);
  const list=el("div"); view.append(list);
  const draw=()=>{ list.innerHTML=""; REV.filter(r=>r.set===prefs.set).forEach(r=>list.append(ENGINE.reviewCard(r,{showAll}))); };
  tg.onclick=()=>{ showAll=!showAll; tg.textContent=showAll?"Hide all answers":"Show all answers"; draw(); };
  draw();
}

/* ---------- mistake log ---------- */
function mistakes(){
  const all=db.mistakes||[]; let f=prefs.mf||"open";
  const open=all.filter(m=>!m.fixed), fixed=all.filter(m=>m.fixed);
  const c=el("div",{class:"card"});
  c.innerHTML=`<h2>Mistake log</h2><p class="muted" style="margin:0 0 8px">Every problem you got wrong on the first try, or gave up on, anywhere on the site. Redo one with the same numbers. Solve it and it moves to Fixed.</p><div class="stat3"><span><b>${open.length}</b> to redo</span><span><b>${fixed.length}</b> fixed</span></div>`;
  const row=el("div",{class:"row"});
  [["open","To redo"],["fixed","Fixed"]].forEach(([k,t])=>row.append(el("button",{class:"chip",type:"button","aria-pressed":String(f===k),onclick:()=>{ prefs.mf=k; M.save(); go("mistakes"); }},t)));
  if(fixed.length) row.append(el("button",{class:"sbtn",type:"button",onclick:()=>{ db.mistakes=open; M.save(); go("mistakes"); }},"Clear fixed"));
  c.append(row); view.append(c);
  const list=f==="open"?open:fixed;
  if(!list.length){ view.append(el("p",{class:"muted"},f==="open"?"Nothing to redo. Problems you miss will show up here.":"Nothing fixed yet.")); return; }
  list.slice(0,60).forEach(m=>{
    const L=M.lec(m.lec); if(!L) return;
    const wrap=el("div",{class:"card",style:`--c:var(--${L.unit})`});
    const when=new Date(m.when).toLocaleDateString("en-CA",{month:"short",day:"numeric"});
    const title=m.gid?(M.gen(m.gid)||{}).title:"Multiple choice";
    wrap.append(el("div",{class:"row",style:"gap:8px;margin-bottom:6px",html:`<span class="pill">Lecture ${L.n}</span><b>${rich(title||"")}</b><span class="ref">missed ${when}${m.src?" · "+esc(m.src):""}${m.gaveUp?" · opened the solution":""}${m.fixed?" · fixed":""}</span>`}));
    const host=el("div"); wrap.append(host);
    const redo=el("button",{class:"btn sm",type:"button",onclick:()=>{ redo.remove(); host.innerHTML="";
      if(m.gid && M.gen(m.gid)) ENGINE.problem(host,{gid:m.gid,seed:m.seed,diff:m.diff||2,fromMistakes:true,showNew:false,onSolved:()=>{ M.fixMistake(m.gid,m.seed); }});
      else if(m.mc){ let q=null; M.lectures.forEach(LL=>(LL.exam||[]).forEach(x=>{ if(x.id===m.mc) q=x; })); if(q) ENGINE.mcq(host,q,ok=>{ if(ok){ m.fixed=true; m.fixedAt=Date.now(); M.save(); } }); } }},m.fixed?"Try it again":"Redo it");
    wrap.append(redo); view.append(wrap); });
}

/* ---------- study plan ---------- */
function plan(){
  const ms=examAt()-new Date(); const daysLeft=Math.max(0,Math.ceil(ms/864e5));
  const lecs=MT.lectures.map(id=>M.lec(id)).filter(Boolean);
  const weak=(window.GUIDE&&GUIDE.weak?GUIDE.weak():[]).filter(t=>MT.lectures.includes(t.lid));
  const lf=L=>(L.formulas||[]); const boxOf=id=>((db.leitner[id]||{}).box||0);
  const ready=L=>{ const f=lf(L); return f.length?f.reduce((s,x)=>s+Math.max(0,boxOf(x.id)-1)/4,0)/f.length:1; };
  const score=L=>{ const w=weak.find(t=>t.lid===L.id); const st=M.chState(L.id); let s=0, why=[];
    if(w){ s+=w.w*2; if(w.total) why.push(`${w.right} of ${w.total} right first try`); if(w.shaky) why.push("practice questions rated shaky or no idea"); }
    if(!st.done){ s+=2.5; why.push("chapter not finished"); } else if(st.best!=null && st.best<.7){ s+=1.5; why.push(`chapter best ${Math.round(st.best*100)}%`); }
    const r=ready(L); if(r<.5){ s+=(1-r)*2; why.push(`formulas ${Math.round(r*100)}% ready`); }
    const openM=(db.mistakes||[]).filter(m=>!m.fixed&&m.lec===L.id).length; if(openM){ s+=Math.min(2,openM*.5); why.push(`${openM} mistake${openM>1?"s":""} to redo`); }
    const laU=LA.filter(r=>r.lec===L.id&&!r.notLectured), laR=laU.filter(r=>db.review[r.id]).length; if(laU.length&&laR<3){ s+=.8; why.push(`${laR} of ${laU.length} course-notes problems rated`); }
    return {L,s,why}; };
  const ranked=lecs.map(score).sort((a,b)=>b.s-a.s);
  const c=el("div",{class:"card"});
  const ex=db.exam||{};
  const unitBest=C.units.filter(u=>u.lectures.some(id=>M.lec(id))).map(u=>`<span>Unit ${u.n} mini exam: <b>${ex["unit-"+u.id]?ex["unit-"+u.id].best+"%":"not taken"}</b></span>`).join("");
  const allF=lecs.flatMap(lf); const fr=allF.length?Math.round(allF.reduce((s,x)=>s+Math.max(0,boxOf(x.id)-1)/4,0)/allF.length*100):0;
  c.innerHTML=`<h2>My study plan</h2><p class="muted">Built from your chapter scores, problem accuracy, exams, ratings, formula boxes and mistake log. It changes every time you do something.</p>
   <div class="stat3"><span>Study days left, counting today: <b>${daysLeft}</b></span><span>Chapters done: <b>${lecs.filter(L=>M.chState(L.id).done).length} of ${lecs.length}</b></span><span>Formula readiness: <b>${fr}%</b></span><span>Practice midterm: <b>${ex.midterm?ex.midterm.best+"%":"not taken"}</b></span><span>Mistakes to redo: <b>${(db.mistakes||[]).filter(m=>!m.fixed).length}</b></span></div><div class="stat3">${unitBest}</div>`;
  view.append(c);
  const top=ranked.filter(x=>x.s>0).slice(0,8);
  const pc=el("div",{class:"card"}); pc.append(el("h3",{},"Go back to these first"));
  if(!top.length) pc.append(el("p",{},"Everything looks solid. Take the practice midterm and a long-answer set to make sure."));
  const ol=el("ol",{class:"plan"});
  top.forEach(({L,why})=>{ const li=el("li",{style:`--c:var(--${L.unit})`});
    li.innerHTML=`<b>Lecture ${L.n}: ${rich(L.title)}</b> <span class="why">(${esc(why.join("; "))})</span>`;
    li.append(el("div",{class:"row",style:"gap:6px;margin-top:4px"},el("a",{class:"sbtn",href:M.lecURL(L.id)},"Open the chapter"),el("a",{class:"sbtn",href:`formulas.html#u=${L.unit}&mode=flash`},"Drill its formulas"),el("a",{class:"sbtn",href:`unit-${M.unit(L.unit).n}.html#practice`},"Practise the unit")));
    ol.append(li); });
  pc.append(ol); view.append(pc);
  // day by day
  if(daysLeft>0){
    const dd=el("div",{class:"card"}); dd.append(el("h3",{},"Day by day until the midterm"));
    const order=ranked.map(x=>x.L); const days=Math.max(1,daysLeft-1); const per=Math.max(1,Math.ceil(order.length/days));
    const ul=el("ol",{class:"plan"}); const start=M.today();
    for(let d=0; d<daysLeft; d++){
      const date=new Date(start.getTime()+d*864e5); const label=date.toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"});
      let html;
      if(d===daysLeft-1) html=`<b>${label}</b>: practice midterm with the timer, then one long-answer set of 8. Run flashcards for anything still in box 1 or 2. Sleep.`;
      else { const chunk=order.slice(d*per,(d+1)*per); html=chunk.length?`<b>${label}</b>: ${chunk.map(L=>`<a href="${M.lecURL(L.id)}">L${L.n} ${esc(L.title.replace(/\$[^$]*\$/g,"").slice(0,48))}</a>`).join(", ")}. Redo its mistakes, do 4 course-notes problems from it, and 10 minutes of flashcards.`:`<b>${label}</b>: mixed practice in the <a href="gym.html">gym</a> (hard), plus the prof's practice questions you rated shaky.`; }
      ul.append(el("li",{html})); }
    dd.append(ul); view.append(dd);
  }
  const unrated=REV.filter(r=>!db.review[r.id]).length;
  if(unrated) view.append(el("div",{class:"card",html:`<b>${unrated} of the prof's practice questions are not rated yet.</b> Rating them makes this plan more accurate. <a href="#review" onclick="event.preventDefault();document.querySelector('[data-t=review]').click()">Rate them</a>.`}));
}

const h=location.hash.slice(1); go(TABS.some(t=>t[0]===h)?h:"exam");
window.addEventListener("hashchange",()=>{ const k=location.hash.slice(1); if(TABS.some(t=>t[0]===k)) go(k); });
})();
