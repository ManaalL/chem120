/* MATH 127 Interactive: practice gym. Endless random problems from any lectures, three difficulties, accuracy by topic. */
(function(){
"use strict";
const M=window.M127, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("gym");
const app=$("#app");
const db=M.db(); const prefs=db.prefs.gym||(db.prefs.gym={lecs:M.lectures.map(L=>L.id),diff:2,mixed:false});
prefs.lecs=prefs.lecs.filter(id=>M.lec(id)); if(!prefs.lecs.length) prefs.lecs=M.lectures.map(L=>L.id);
const hero=el("section",{class:"hero slim"});
hero.innerHTML=`<div class="wrap"><div><p class="mono" style="margin:0 0 10px">Practice gym · ${M.lectures.reduce((n,L)=>n+(L.gens||[]).length,0)} problem types</p><h1>Reps until it's <em>automatic</em>.</h1><p class="lede">Pick lectures and a difficulty. Every problem has new numbers, a hint, a worked solution, and an answer box that accepts any equivalent form. Your first-try accuracy is tracked by topic, all-time.</p></div><div class="card" id="sess" style="min-width:240px"></div></div>`;
app.append(hero);
const view=el("div",{class:"wrap view"}); app.append(view);
M.footer();
let sess={right:0,total:0,streak:0};
const sc=$("#sess");
function drawSess(){ sc.innerHTML=`<b>This session</b><div class="row" style="gap:24px;margin-top:6px"><div><div class="big" style="font-size:2.2rem">${sess.right}/${sess.total}</div><div class="muted small">right first try</div></div><div><div class="big" style="font-size:2.2rem;color:var(--head)">${sess.streak}</div><div class="muted small">streak</div></div></div>`; }
drawSess();

const setup=el("div",{class:"card"}); view.append(setup);
setup.append(el("h2",{},"Choose what to practise"));
const unitRows=el("div",{style:"display:grid;gap:8px;margin:8px 0 12px"}); setup.append(unitRows);
function drawPick(){
  unitRows.innerHTML="";
  C.units.forEach(u=>{ const lecs=u.lectures.map(id=>M.lec(id)).filter(Boolean); if(!lecs.length) return;
    const row=el("div",{class:"row",style:`--c:var(--${u.id});gap:6px`});
    const allOn=lecs.every(L=>prefs.lecs.includes(L.id));
    row.append(el("button",{class:"chip",type:"button","aria-pressed":String(allOn),style:"min-width:72px",onclick:()=>{ if(allOn){ prefs.lecs=prefs.lecs.filter(id=>!u.lectures.includes(id)); if(!prefs.lecs.length) prefs.lecs=[lecs[0].id]; } else lecs.forEach(L=>{ if(!prefs.lecs.includes(L.id)) prefs.lecs.push(L.id); }); M.save(); drawPick(); }},`Unit ${u.n}`));
    lecs.forEach(L=>row.append(el("button",{class:"chip lec",type:"button","aria-pressed":String(prefs.lecs.includes(L.id)),title:L.title.replace(/\$[^$]*\$/g,""),onclick:()=>{ const i=prefs.lecs.indexOf(L.id); if(i>=0){ if(prefs.lecs.length>1) prefs.lecs.splice(i,1); } else prefs.lecs.push(L.id); M.save(); drawPick(); }},`L${L.n}`)));
    unitRows.append(row); });
  const q=el("div",{class:"row",style:"gap:6px"}); q.append(el("span",{class:"small muted"},"Quick picks:"));
  C.quizzes.filter(z=>z.lectures.some(id=>M.lec(id))).forEach(z=>q.append(el("button",{class:"sbtn",type:"button",onclick:()=>{ prefs.lecs=z.lectures.filter(id=>M.lec(id)); M.save(); drawPick(); }},z.midterm?"Midterm-only lectures":`Quiz ${z.n} lectures`)));
  q.append(el("button",{class:"sbtn",type:"button",onclick:()=>{ prefs.lecs=C.midterm.lectures.filter(id=>M.lec(id)); M.save(); drawPick(); }},"Everything on the midterm"));
  q.append(el("button",{class:"sbtn",type:"button",onclick:()=>{ const w=(window.GUIDE&&GUIDE.weak?GUIDE.weak():[]).slice(0,3).map(t=>t.lid); if(w.length){ prefs.lecs=w; M.save(); drawPick(); } else alert("No results yet. Do a few problems first."); }},"My weakest 3"));
  unitRows.append(q);
}
drawPick();
const dh=el("div",{style:"max-width:440px"}); setup.append(el("b",{},"Difficulty"),dh);
PLOT.seg(dh,{items:[[1,"Easy"],[2,"Medium"],[3,"Hard"],[0,"Mixed"]],value:prefs.mixed?0:prefs.diff,onchange:v=>{ if(v===0) prefs.mixed=true; else { prefs.mixed=false; prefs.diff=v; } M.save(); }});

const host=el("div",{style:"margin-top:16px"}); view.append(host);
function next(){
  host.innerHTML="";
  const gids=[]; prefs.lecs.forEach(id=>(M.lec(id).gens||[]).forEach(g=>gids.push(g.id)));
  // weight problem types you get wrong more often
  const st=M.db().stats; const w=gids.map(g=>{ const s=st[g]; return s&&s.ft?1+2*(1-s.fr/s.ft):1.5; }); let r=Math.random()*w.reduce((a,b)=>a+b,0), gid=gids[0]; for(let i=0;i<gids.length;i++){ r-=w[i]; if(r<=0){ gid=gids[i]; break; } }
  const diff=prefs.mixed?1+Math.floor(Math.random()*3):prefs.diff;
  ENGINE.problem(host,{gid,diff,diffLabel:true,showNew:false,onResult:ok=>{ sess.total++; if(ok){ sess.right++; sess.streak++; } else sess.streak=0; drawSess(); drawAcc(); }});
  host.append(el("div",{class:"row"},el("button",{class:"btn",type:"button",onclick:()=>{ next(); host.scrollIntoView({behavior:"smooth",block:"start"}); }},"Next problem")));
}
next();

const acc=el("div",{class:"card",style:"margin-top:20px"}); view.append(acc);
function drawAcc(){
  const st=M.db().stats; acc.innerHTML=""; acc.append(el("h2",{},"Accuracy by topic"),el("p",{class:"muted small"},"First-try accuracy for every problem type you have tried, all-time, weakest first. Includes problems from lecture chapters, unit practice and exams."));
  const rows=[]; M.lectures.forEach(L=>(L.gens||[]).forEach(g=>{ const s=st[g.id]; if(s&&s.ft) rows.push({g,L,s,f:s.fr/s.ft}); }));
  if(!rows.length){ acc.append(el("p",{class:"muted"},"Nothing yet. Answer a few problems and this fills in.")); return; }
  rows.sort((a,b)=>a.f-b.f||b.s.ft-a.s.ft);
  rows.forEach(({g,L,s,f})=>{ const col=f>=.8?"#2a7648":f>=.6?"#d9a12b":"#c0482f";
    acc.append(el("div",{class:"acc",style:`--c:var(--${L.unit})`,html:`<span><span class="pill">L${L.n}</span> ${rich(g.title)}</span><span class="bar"><i style="width:${Math.max(4,f*100)}%;background:${col}"></i></span><span class="n">${s.fr}/${s.ft}</span>`})); });
}
drawAcc();
})();
