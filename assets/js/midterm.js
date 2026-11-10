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
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px;color:var(--mid)">${esc(T.label)} · ${M.fmtDate(T.date,{weekday:"long",month:"long",day:"numeric"})} · in class</p><h1>Test 2 prep: <em>Modules ${modsCovered.join(", ")}</em></h1><p class="lede">${esc(T.format)}. Covers ${esc(T.covers)}. ${esc(T.assumed)}</p></div><div class="count" id="count"></div></div>`;
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
const TABS=[["plan","How to study"],["official","Official samples"],["drills","Drills"],["exam","Practice test"],["samples","Site sample tests"],["examples","Course-notes examples"],["mistakes","Mistake log"]];
const DR=M.extras.drills||[];
const dstat=id=>{ const all=prefs.drills||(prefs.drills={}); return all[id]||(all[id]={s:0,b:0,r:0,t:0}); };
const learned=id=>dstat(id).b>=3;
const OFF=M.extras.official||[];
const offKey=(set,n)=>`OFF.${set}.${n}`;
const offPrefs=()=>prefs.off||(prefs.off={});
TABS.forEach(([k,t])=>sw.append(el("button",{class:"tab",type:"button","data-t":k,onclick:()=>go(k)},t)));
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer("Sample tests and course-notes example parallels are written for this site in the style of the CHEM 120 tests and course notes. No real test or assignment question is reproduced.");
function go(k,arg){ if(k==="drills") prefs.drillOpen=arg||null; M.$$(".tab",sw).forEach(b=>b.setAttribute("aria-selected",String(b.dataset.t===k))); ENGINE.cleanup(view); view.innerHTML=""; ({exam,samples,examples,mistakes,plan,official,drills}[k]||plan)(); history.replaceState(null,"","#"+k); }

function chapterPicker(onChange){
  const box=el("div",{class:"chips",style:"margin:8px 0 12px"});
  const b=el("button",{class:"chip",type:"button","aria-pressed":String(!!prefs.early)},"Also mix in chapters 2.1 and 2.2 (Test 1 material)");
  b.onclick=()=>{ prefs.early=!prefs.early; M.save(); onChange(); }; box.append(b); return box;
}

/* ---------- practice test ---------- */
function exam(){
  const host=el("div"); view.append(host);
  const mode=el("div",{class:"chips",style:"margin:0 0 10px"});
  [["test","Test mode: answers at the end"],["study","Study mode: check as you go, hints, show answer"]].forEach(([k,t])=>mode.append(el("button",{class:"chip",type:"button","aria-pressed":String((prefs.ptMode||"test")===k),onclick:()=>{ prefs.ptMode=k; M.save(); go("exam"); }},t)));
  view.insertBefore(mode,host);
  const studyPT=prefs.ptMode==="study";
  EXAM.mount(host,{key:studyPT?"test2-study":"test2",study:studyPT,title:studyPT?"Practice Test 2: study mode":"Practice Test 2",intro:"17 questions in the real split: 6 from Module 2, 6 from Module 3, 5 from Module 4 (pp. 1-14). Five options, one mark each, some select-all (graded correct minus incorrect), and numeric questions where you choose the closest answer. New questions every attempt. Nothing from the boxes that are not tested. Use the data sheet values only.",
    items:()=>EXAM.testPool(CHS(),"T2"), fixedSize:17, allowTimer:!studyPT, timeLimit:45,
    picker:(rerender)=>chapterPicker(rerender), select:selectSplit});
}

/* pick n questions in the real Test 2 split by module (6 / 6 / 5), spread over chapters */
function selectSplit(pool,n){
  const sp=T.split||{}; const keys=Object.keys(sp); if(!keys.length) return EXAM.selectTest(pool,n);
  const byMod=k=>pool.filter(q=>(M.chap(q.lec)||{}).module===k);
  let out=[]; keys.forEach(k=>{ const sub=byMod(k); const cand=EXAM.selectTest(sub,sub.length); const got=[];
    for(const q of cand){ if(got.length>=sp[k]) break; const mq=q.kind==="genmc"?EXAM.genToMC(q):q; if(mq) got.push(mq); }
    out=out.concat(got); });
  const extra=pool.filter(q=>!keys.includes((M.chap(q.lec)||{}).module)); if(out.length<n && extra.length) out=out.concat(EXAM.selectTest(extra,n-out.length));
  const order=k=>keys.indexOf((M.chap(k.lec)||{}).module); return out.slice(0,n).sort((a,b)=>order(a)-order(b));
}

/* ---------- the two official sample tests: enter your letters, get marked, get sent to the chapter ---------- */
function offStats(set){ const P=offPrefs()[set.id]||{}; let marks=0, done=0; const miss=[];
  set.qs.forEach(q=>{ const a=P[q.n]; const r=db.review[offKey(set.id,q.n)]; if(a!=null&&P._marked){ done++; const c=EXAM.creditSets(q.ans.split("").map(x=>"ABCDE".indexOf(x)),String(a).split("").map(x=>"ABCDE".indexOf(x))); marks+=c; if(c<1) miss.push({q,c}); else if(r==="shaky"||r==="no") miss.push({q,c}); } else if(r==="shaky"||r==="no") miss.push({q,c:null}); });
  return {marks,done,miss,marked:!!P._marked}; }
function official(){
  if(!OFF.length){ view.append(el("p",{class:"muted"},"No official samples loaded.")); return; }
  const intro=el("div",{class:"card"});
  intro.innerHTML=`<h2>The two official sample tests</h2><p style="margin:0 0 6px">These are the two sample papers posted on LEARN. Their questions are not on this site. Here is how to use them:</p>
   <ol class="plan" style="margin:6px 0 8px"><li>Print or open the PDF. Data sheet only, a real calculator, phone away, 45-minute timer.</li><li>Circle your answers on paper as you go, like the real bubble sheet.</li><li>When the timer ends, tap your letters in below and press <b>Mark it</b>. Select-all questions are marked the way CHEM 120 marks them: correct picks minus wrong picks.</li><li>For every miss, rate it and open the chapter link. The misses also go straight into <a href="#plan">your plan</a>.</li></ol>
   <p class="muted small" style="margin:0">The answer letters here are this site's own solutions. If one disagrees with the full solutions PDF on LEARN, trust the PDF. Questions marked "check" lean on a figure, so confirm those against the PDF.</p>`;
  view.append(intro);
  OFF.forEach(set=>{
    const P=offPrefs()[set.id]||(offPrefs()[set.id]={});
    const st=offStats(set);
    const card=el("div",{class:"card"}); view.append(card);
    card.append(el("div",{class:"row",style:"justify-content:space-between;gap:8px",html:`<h3 style="margin:0">${esc(set.title)} <span class="muted small">(${esc(set.sub)})</span></h3>${st.marked?`<span class="pill">${EXAM.fmtMarks(st.marks)} / ${set.qs.length}</span>`:""}`}));
    const tbl=el("div",{class:"offgrid"}); card.append(tbl);
    set.qs.forEach(q=>{
      const L=M.chap(q.lec); const row=el("div",{class:"offrow",style:L?`--c:var(--${L.module})`:""});
      const cur=String(P[q.n]||"");
      const head=el("div",{class:"offq",html:`<b>Q${q.n}</b> <span>${rich(q.topic)}</span>${q.multi?` <span class="pill">select all</span>`:""}${q.check?` <span class="pill">check</span>`:""}`});
      const pick=el("div",{class:"offpick",role:"group","aria-label":`Your answer to question ${q.n}`});
      "ABCDE".split("").forEach(Lt=>{ const on=cur.includes(Lt); const b=el("button",{type:"button",class:"offl"+(on?" sel":""),"aria-pressed":String(on)},Lt);
        b.onclick=()=>{ let v=String(P[q.n]||""); if(q.multi){ v=v.includes(Lt)?v.replace(Lt,""):[...v+Lt].sort().join(""); } else v=v===Lt?"":Lt; if(v) P[q.n]=v; else delete P[q.n]; M.save(); go("official"); }; pick.append(b); });
      row.append(head,pick);
      if(st.marked && P[q.n]!=null){
        const c=EXAM.creditSets(q.ans.split("").map(x=>"ABCDE".indexOf(x)),String(P[q.n]).split("").map(x=>"ABCDE".indexOf(x)));
        const res=el("div",{class:"offres "+(c>=1?"ok":c>0?"part":"no"),html:`${c>=1?"✓ Right":c>0?`Part marks: ${EXAM.fmtMarks(c)}`:"✗ Answer: "+q.ans.split("").join(", ")}`}); row.append(res);
      }
      const more=el("details",{class:"offmore"}); more.append(el("summary",{},"Answer and the idea"));
      more.append(el("div",{html:`<p><b>${q.ans.split("").join(", ")}</b>. ${rich(q.why)}</p>`}));
      const rate=el("div",{class:"row",style:"gap:6px;margin-top:6px"}); const rk=offKey(set.id,q.n); const rv=db.review[rk];
      [["got","Got it"],["shaky","Shaky"],["no","No idea"]].forEach(([k,t])=>rate.append(el("button",{class:"chip",type:"button","aria-pressed":String(rv===k),onclick:()=>{ db.review[rk]=k; M.save(); go("official"); }},t)));
      const dId=(set.drills||[])[q.n-1]; if(dId&&DR.find(d=>d.id===dId)) rate.append(el("button",{class:"sbtn",type:"button",onclick:()=>go("drills",dId)},"Practise this type"));
      if(L) rate.append(el("a",{class:"sbtn",href:M.chURL(L.id)},`Chapter ${L.num}: ${L.title.replace(/\$[^$]*\$/g,"").slice(0,40)}`));
      more.append(rate); row.append(more); tbl.append(row);
    });
    const act=el("div",{class:"row",style:"margin-top:10px"});
    act.append(el("button",{class:"btn",type:"button",onclick:()=>{ P._marked=true;
      set.qs.forEach(q=>{ const rk=offKey(set.id,q.n); if(P[q.n]==null) return; const c=EXAM.creditSets(q.ans.split("").map(x=>"ABCDE".indexOf(x)),String(P[q.n]).split("").map(x=>"ABCDE".indexOf(x))); if(!db.review[rk]||P._auto&&P._auto[q.n]) { db.review[rk]=c>=1?"got":"no"; (P._auto=P._auto||{})[q.n]=1; } });
      M.save(); go("official"); }},st.marked?"Mark it again":"Mark it"));
    act.append(el("button",{class:"btn ghost",type:"button",onclick:()=>{ if(!confirm("Clear your letters for this paper?")) return; offPrefs()[set.id]={}; set.qs.forEach(q=>{ const rk=offKey(set.id,q.n); if(P._auto&&P._auto[q.n]) delete db.review[rk]; }); M.save(); go("official"); }},"Clear my letters"));
    card.append(act);
    if(st.miss.length){ const box=el("div",{class:"relearn"}); box.append(el("b",{},"Relearn from this paper"));
      const byCh={}; st.miss.forEach(({q})=>{ (byCh[q.lec]=byCh[q.lec]||[]).push(q); });
      const ul=el("ul",{style:"margin:8px 0 0;padding-left:18px"});
      Object.keys(byCh).sort().forEach(id=>{ const L=M.chap(id); if(!L) return; const li=el("li",{html:`<b>${L.num} ${rich(L.title)}</b>: Q${byCh[id].map(q=>q.n).join(", Q")}. `}); li.append(el("a",{href:M.chURL(id)},"Open the chapter"));
        const ds=[...new Set(byCh[id].map(q=>(set.drills||[])[q.n-1]).filter(Boolean))]; ds.forEach(dId=>{ const d=DR.find(x=>x.id===dId); if(!d) return; li.append(document.createTextNode(" · ")); li.append(el("a",{href:"#drills",onclick:e=>{ e.preventDefault(); go("drills",dId); }},`Drill: ${d.title}${learned(dId)?" (learned)":""}`)); });
        ul.append(li); });
      box.append(ul); card.append(box); }
  });
}

/* ---------- drills: one per question type on the official samples, endless new questions ---------- */
function drills(){
  const open=prefs.drillOpen&&DR.find(d=>d.id===prefs.drillOpen);
  if(open) return drillRun(open);
  const nL=DR.filter(d=>learned(d.id)).length;
  const offUse={}; OFF.forEach(set=>(set.drills||[]).forEach(id=>{ offUse[id]=(offUse[id]||0)+1; }));
  const intro=el("div",{class:"card"});
  intro.innerHTML=`<h2>Drills</h2><p style="margin:0 0 6px">One drill for each kind of question the two official samples ask. Each one starts with how to think about it, then gives you new questions of that kind for as long as you want, with the reason on every option. Three right in a row and it counts as learned.</p>
   <div class="bar"><i style="width:${nL/DR.length*100}%;background:var(--ok)"></i></div><div class="stat3"><span><b>${nL}</b> of ${DR.length} learned</span><span>Start with the ones marked with how many official sample questions use them.</span></div>`;
  view.append(intro);
  C.modules.filter(u=>DR.some(d=>(M.chap(d.lec)||{}).module===u.id)).forEach(u=>{
    const c=el("div",{class:"card",style:`--c:var(--${u.id})`}); c.append(el("h3",{},`Module ${u.n}: ${u.title} (${(T.split||{})[u.id]||""} questions on the test)`));
    const g=el("div",{class:"drillgrid"});
    DR.filter(d=>(M.chap(d.lec)||{}).module===u.id).forEach(d=>{ const st=dstat(d.id), L=M.chap(d.lec);
      const b=el("button",{type:"button",class:"drillcard"+(learned(d.id)?" done":""),onclick:()=>go("drills",d.id)});
      b.innerHTML=`<span class="dt">${rich(d.title)}</span><span class="dm">Ch ${L?L.num:""}${offUse[d.id]?` · on the samples ${offUse[d.id]}×`:""}</span><span class="ds">${learned(d.id)?"✓ learned":st.t?`streak ${st.s}/3 · ${st.r}/${st.t} right`:"not started"}</span>`;
      g.append(b); });
    c.append(g); view.append(c); });
}
function drillRun(d){
  const L=M.chap(d.lec), st=dstat(d.id);
  const top=el("div",{class:"row",style:"justify-content:space-between;margin:4px 0 10px"});
  top.append(el("button",{class:"sbtn",type:"button",onclick:()=>go("drills")},"← All drills"));
  if(L) top.append(el("a",{class:"sbtn",href:M.chURL(L.id)},`Chapter ${L.num}`));
  view.append(top);
  const how=el("div",{class:"card",style:L?`--c:var(--${L.module})`:""});
  how.append(el("p",{class:"kicker",style:"margin:0 0 4px"},`How to think about it · ${d.ref||""}`), el("h2",{style:"margin:0 0 8px"},el("span",{rich:d.title})), el("div",{class:"how",rich:d.how}));
  view.append(how);
  const card=el("div",{class:"card"}); view.append(card);
  const status=el("div",{class:"row",style:"justify-content:space-between;margin-bottom:6px"}); card.append(status);
  const host=el("div"); card.append(host);
  const paint=()=>{ status.innerHTML=`<b>Streak: ${st.s}/3</b>${learned(d.id)?` <span class="pill" style="--c:var(--ok)">learned</span>`:""}<span class="muted small">${st.r} of ${st.t} right so far</span>`; };
  const next=()=>{ ENGINE.cleanup(host); host.innerHTML=""; let q=null; for(let t=0;t<20&&!q;t++){ try{ q=d.gen(M.rng(M.newSeed())); }catch(e){ console.error(e); } }
    if(!q){ host.append(el("p",{class:"muted"},"Couldn't make a question. Try again.")); return; }
    ENGINE.mcq(host,q,ok=>{ st.t++; if(ok){ st.r++; st.s++; st.b=Math.max(st.b,st.s); } else st.s=0; M.save(); paint();
      const row=el("div",{class:"row",style:"margin-top:10px"}); row.append(el("button",{class:"btn",type:"button",onclick:next},st.s>=3&&!ok?"Next":"Next question"));
      if(st.s===3) row.append(el("span",{style:"font-weight:600;color:var(--ok)"},"Three in a row. Keep going or pick another drill."));
      if(!ok) row.append(el("span",{class:"muted small"},"Read the reason on the right answer, then try a fresh one."));
      host.append(row); }); };
  paint(); next();
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
  const studyB=el("button",{class:"btn sm",type:"button"},"Study mode: check as you go, with hints");
  intro.append(bar,el("div",{class:"row"},studyB,timed,tg),el("p",{class:"muted small",style:"margin:6px 0 0"},"Study mode lets you check each answer the moment you pick it, open a hint if you're stuck, or show the answer with the reason for every option. Site sample test 1 has a hand-written hint on every question.")); view.append(intro);
  const list=el("div"); view.append(list);
  const draw=()=>{ list.innerHTML=""; REV.filter(r=>r.set===prefs.set).forEach((r,i)=>{ list.append(el("p",{class:"kicker",style:"margin:14px 0 4px"},`Question ${i+1}`), ENGINE.reviewCard(r,{showAll})); }); };
  tg.onclick=()=>{ showAll=!showAll; tg.textContent=showAll?"Hide all answers":"Show all answers"; draw(); };
  timed.onclick=()=>{ ENGINE.cleanup(view); view.innerHTML=""; const host=el("div"); view.append(host); const items=REV.filter(r=>r.set===prefs.set).map(r=>({...r,kind:"mc",keep:true}));
    EXAM.mount(host,{key:"sample-"+prefs.set,title:label(prefs.set),intro:"The fixed version, in order, with the 45-minute timer if you want it.",items,fixedSize:items.length,allowTimer:true,timeLimit:45,select:p=>p}); };
  studyB.onclick=()=>{ ENGINE.cleanup(view); view.innerHTML=""; const host=el("div"); view.append(host); const items=REV.filter(r=>r.set===prefs.set).map(r=>({...r,kind:"mc",keep:true}));
    view.prepend(el("button",{class:"sbtn",type:"button",style:"margin:4px 0 10px",onclick:()=>go("samples")},"← Back to the sample tests"));
    EXAM.mount(host,{key:"study-"+prefs.set,title:label(prefs.set)+": study mode",intro:"No timer. Pick an answer, then press Check my answer to see right away if it's right and why. Stuck? Open the hint. Really lost? Show the answer. Your score counts your first check on each question, and 0 for any question where you looked at the answer first.",items,fixedSize:items.length,study:true,select:p=>p}); };
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

/* ---------- how to study: what's on it, tonight's plan, and what to go back to ---------- */
function plan(){
  const ms=examAt()-new Date(); const hrs=ms/36e5; const daysLeft=Math.max(0,Math.ceil(ms/864e5));
  const lecs=T.chapters.map(id=>M.chap(id)).filter(Boolean);
  /* what's on it */
  const w=el("div",{class:"card"});
  w.innerHTML=`<h2>What's on Test 2</h2>
   <div class="split3">${C.modules.filter(u=>(T.split||{})[u.id]).map(u=>`<div style="--c:var(--${u.id})"><b>${T.split[u.id]}</b><span>Module ${u.n}</span><small>${u.id==="m2"?"focus pp. 9-35":u.id==="m4"?"pp. 1-14 only":"all of it"}</small></div>`).join("")}</div>
   <p style="margin:10px 0 4px">${esc(T.format)}.</p>
   <p class="small" style="margin:4px 0"><b>Not tested:</b> ${T.notTested.map(esc).join("; ")}.</p>
   <p class="small muted" style="margin:4px 0">If a question doesn't say "select all", it has exactly one answer. Select-all is marked correct picks minus wrong picks, so only pick the ones you're sure of. Fill in your test version and bubble as you go: there is no extra time at the end. Bring your seat number written down, pens, pencils and your own calculator.</p>`;
  view.append(w);
  /* status helpers */
  const offSt=OFF.map(set=>({set,...offStats(set)}));
  const unlearned=DR.filter(d=>!learned(d.id));
  const offUse={}; OFF.forEach(set=>(set.drills||[]).forEach(id=>{ offUse[id]=(offUse[id]||0)+1; }));
  const missDrills=[...new Set(offSt.flatMap(o=>o.miss.map(({q})=>(o.set.drills||[])[q.n-1]).filter(Boolean)))].filter(id=>!learned(id));
  const dlink=id=>{ const d=DR.find(x=>x.id===id); return d?`<a href="#drills" data-drill="${id}">${esc(d.title.replace(/\$[^$]*\$/g,""))}</a>`:""; };
  const tn=el("div",{class:"card"});
  const steps=[];
  const st=(t,done,body)=>steps.push(`<li class="${done?"done":""}"><b>${t}</b>${done?" <span class=\"pill\" style=\"--c:var(--ok)\">done</span>":""}<div class="small">${rich(body)}</div></li>`);
  const [o1,o2]=offSt;
  if(o1) st(`${o1.set.title}, on paper (45 min)`,o1.marked,`Data sheet only, real calculator, phone away, timer on. Then <a href="#official" data-tab="official">tap your letters in</a> and press Mark it.${o1.marked?` You got <b>${EXAM.fmtMarks(o1.marks)} / ${o1.set.qs.length}</b>.`:""}`);
  st("Fix what you missed (30 to 45 min)",o1&&o1.marked&&!o1.miss.some(({q})=>!learned((o1.set.drills||[])[q.n-1])),o1&&o1.marked?(o1.miss.length?`For each miss, read the answer, then do its drill until you get 3 in a row: ${[...new Set(o1.miss.map(({q})=>(o1.set.drills||[])[q.n-1]).filter(Boolean))].map(id=>dlink(id)+(learned(id)?" ✓":"")).join(", ")}.`:"Nothing missed. Go straight to the next paper."):"Mark the first paper and the drills for your misses show up here.");
  if(o2) st(`${o2.set.title}, on paper (45 min)`,o2.marked,`Same rules. Then mark it.${o2.marked?` You got <b>${EXAM.fmtMarks(o2.marks)} / ${o2.set.qs.length}</b>.`:""}`);
  st("Fix those misses too (30 min)",o2&&o2.marked&&!o2.miss.some(({q})=>!learned((o2.set.drills||[])[q.n-1])),o2&&o2.marked?(o2.miss.length?`Drills: ${[...new Set(o2.miss.map(({q})=>(o2.set.drills||[])[q.n-1]).filter(Boolean))].map(id=>dlink(id)+(learned(id)?" ✓":"")).join(", ")}.`:"Nothing missed."):"Shows up once the second paper is marked.");
  const most=unlearned.slice().sort((a,b)=>(offUse[b.id]||0)-(offUse[a.id]||0)).slice(0,6);
  st("Drills for the question types you haven't locked in yet (30 to 60 min)",!unlearned.length,unlearned.length?`${unlearned.length} of ${DR.length} not learned yet. Most used on the samples first: ${most.map(d=>dlink(d.id)).join(", ")}. <a href="#drills" data-tab="drills">All drills</a>.`:"All of them learned.");
  const pt=(db.exam||{}).test2;
  st("One more full test with the timer, if you have the energy (45 min)",!!pt,`The <a href="#exam" data-tab="exam">practice test</a> (17 new questions, the real 6/6/5 split) or a <a href="#samples" data-tab="samples">site sample test</a>.${pt?` Best so far: <b>${pt.best}%</b>.`:""}`);
  st("Before bed: formulas (10 min)",false,`<a href="formulas.html#mode=flash">Flashcards</a> for $E_n=-R_H/n^2$, $\\Delta E$, $\\lambda = h/mv$, $\\Delta x\\,\\Delta p \\ge h/4\\pi$, node counts and formal charge. Then sleep: a rested brain beats one more hour.`);
  st("Morning: the know-cold list (10 min)",false,`Angular nodes $= l$, radial $= n-l-1$, RDF peaks $= n-l$. In hydrogen energy depends only on $n$. Cr $4s^1 3d^5$ and Cu $4s^1 3d^{10}$. Ions lose 4s before 3d. IE dips at groups 13 and 16. Cl has the most negative EA in the table; N, Be, Mg and noble gases are above zero. FC $= V - $ lone-pair electrons $-$ bonds. Period 2 never expands; B and Be can be short of 8.`);
  tn.innerHTML=`<h2>${hrs<40?"Your plan for tonight":"Your plan"}</h2><p class="muted" style="margin:0 0 8px">${hrs>0?`${Math.floor(hrs)} hours to go.`:"Test time has passed."} The steps tick themselves off as you do them on this site.</p><ol class="plan tonight">${steps.join("")}</ol>`;
  M.$$("a[data-drill]",tn).forEach(a=>a.onclick=e=>{ e.preventDefault(); go("drills",a.dataset.drill); });
  M.$$("a[data-tab]",tn).forEach(a=>a.onclick=e=>{ e.preventDefault(); go(a.dataset.tab); });
  view.append(tn);
  planRank(lecs,daysLeft,hrs);
}
/* ---------- study plan ---------- */
function planRank(lecs,daysLeft,hrs){
  const weak=(window.GUIDE&&GUIDE.weak?GUIDE.weak():[]);
  const lf=L=>(L.formulas||[]); const boxOf=id=>((db.leitner[id]||{}).box||0);
  const ready=L=>{ const f=lf(L); return f.length?f.reduce((s,x)=>s+Math.max(0,boxOf(x.id)-1)/4,0)/f.length:1; };
  const score=L=>{ const w=weak.find(t=>t.lid===L.id); const st=M.chState(L.id); let s=0; const why=[];
    if(w){ s+=w.w*2; if(w.total) why.push(`${w.right} of ${w.total} right first try`); if(w.shaky) why.push("questions rated shaky or no idea"); }
    if(M.upcoming(L)){ s+=1; why.push("not taught yet: do it right after class"); }
    else if(!st.done){ s+=2.5; why.push("chapter not finished"); } else if(st.best!=null && st.best<.7){ s+=1.5; why.push(`chapter best ${Math.round(st.best*100)}%`); }
    const r=ready(L); if(r<.5){ s+=(1-r)*2; why.push(`formulas ${Math.round(r*100)}% ready`); }
    const openM=(db.mistakes||[]).filter(m=>!m.fixed&&m.lec===L.id).length; if(openM){ s+=Math.min(2,openM*.5); why.push(`${openM} mistake${openM>1?"s":""} to redo`); }
    const offMiss=OFF.reduce((n,set)=>n+set.qs.filter(q=>q.lec===L.id&&/shaky|no/.test(db.review[offKey(set.id,q.n)]||"")).length,0); if(offMiss){ s+=offMiss*1.5; why.push(`${offMiss} official sample question${offMiss>1?"s":""} missed or shaky`); }
    const dl=DR.filter(d=>d.lec===L.id&&!learned(d.id)).length; if(dl){ s+=dl*.4; why.push(`${dl} drill${dl>1?"s":""} not learned`); }
    const ex=EXS.filter(r=>r.lec===L.id), exR=ex.filter(r=>db.review[r.id]).length; if(ex.length&&exR<Math.min(2,ex.length)){ s+=.8; why.push(`${exR} of ${ex.length} course-notes examples rated`); }
    return {L,s,why}; };
  const ranked=lecs.map(score).sort((a,b)=>b.s-a.s);
  const ex=db.exam||{};
  const c=el("div",{class:"card"});
  const modBest=C.modules.filter(u=>u.chapters.some(id=>T.chapters.includes(id)&&M.chap(id))).map(u=>`<span>Module ${u.n} mini exam: <b>${ex["unit-"+u.id]?ex["unit-"+u.id].best+"%":"not taken"}</b></span>`).join("");
  const allF=lecs.flatMap(lf); const fr=allF.length?Math.round(allF.reduce((s,x)=>s+Math.max(0,boxOf(x.id)-1)/4,0)/allF.length*100):0;
  c.innerHTML=`<h3>Where you stand</h3><p class="muted">Built from your chapter scores, the official samples, drills, practice tests, ratings, formula boxes and mistake log. It changes every time you do something.</p>
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
  if(daysLeft>1 && hrs>=40){
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
