/* MATH 127 Interactive: landing page. */
(function(){
"use strict";
const M=window.M127, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("units");
document.querySelectorAll(".sub,.how div").forEach(n=>{ if(n.innerHTML.includes("$")) n.innerHTML=rich(n.innerHTML); });
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Fig. 1: one curve, annotated by unit ---------- */
(function(){
  const f=t=>2.1+1.25*Math.sin(.75*t)+.35*Math.sin(1.9*t+.4), df=t=>1.25*.75*Math.cos(.75*t)+.35*1.9*Math.cos(1.9*t+.4);
  const X=t=>40+t*36, Y=v=>300-v*55;
  let g=`<svg class="fig" id="herofig" viewBox="0 0 620 440" role="img" aria-label="A curve annotated with callouts that link to each unit">`;
  // grid + axes
  for(let t=0;t<=10;t++) g+=`<line class="gr" x1="${X(t)}" y1="40" x2="${X(t)}" y2="300"/>`;
  for(let v=0;v<=4;v++) g+=`<line class="gr" x1="40" y1="${Y(v)}" x2="400" y2="${Y(v)}"/>`;
  g+=`<line class="ax" x1="40" y1="300" x2="404" y2="300"/><line class="ax" x1="40" y1="36" x2="40" y2="300"/><text x="404" y="314" text-anchor="end">t</text><text x="46" y="44">f(t)</text>`;
  // unit 2: left Riemann sum
  const a=.4, b=4.4, n=5, dt=(b-a)/n;
  for(let i=0;i<n;i++){ const t=a+i*dt, h=f(t); g+=`<rect x="${X(t)}" y="${Y(h)}" width="${dt*36}" height="${300-Y(h)}" style="fill:var(--u2);fill-opacity:.14;stroke:var(--u2);stroke-width:1"/>`; }
  // curve
  let d=""; for(let i=0;i<=200;i++){ const t=i/20; d+=(i?"L":"M")+X(t).toFixed(1)+" "+Y(f(t)).toFixed(1); } g+=`<path class="cv" d="${d}"/>`;
  // unit 1: tangent line at a point (static) + Tan riding the curve (animated)
  const t1=7.1; const m1=df(t1);
  g+=`<line x1="${X(t1-1.6)}" y1="${Y(f(t1)-1.6*m1)}" x2="${X(t1+1.6)}" y2="${Y(f(t1)+1.6*m1)}" style="stroke:var(--u1);stroke-width:1.6"/><circle cx="${X(t1)}" cy="${Y(f(t1))}" r="4.5" style="fill:var(--paper);stroke:var(--u1);stroke-width:2"/>`;
  g+=`<g id="rider"><line id="rtan" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:3 2"/><circle id="rdot" r="5" style="fill:var(--accent)"/><text id="rlab" class="lblc" style="fill:var(--accent)"></text></g>`;
  // insets
  const inset=(cx,cy,r,id,body)=>`<g><circle cx="${cx}" cy="${cy}" r="${r+5}" style="fill:var(--${id});fill-opacity:.07"/><circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--paper);stroke:var(--fig-stroke);stroke-width:1"/><clipPath id="cl${id}"><circle cx="${cx}" cy="${cy}" r="${r-1}"/></clipPath><g clip-path="url(#cl${id})">${body}</g></g>`;
  const ax=(cx,cy,r)=>`<line class="ax" x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}" style="opacity:.5"/><line class="ax" x1="${cx}" y1="${cy-r}" x2="${cx}" y2="${cy+r}" style="opacity:.5"/>`;
  // u3: |x| with its corner
  { const cx=528,cy=96,r=44; g+=inset(cx,cy,r,"u3",ax(cx,cy+16,r)+`<path d="M${cx-34} ${cy-18} L${cx} ${cy+16} L${cx+34} ${cy-18}" style="fill:none;stroke:var(--u3);stroke-width:2.2;stroke-linejoin:round"/><circle cx="${cx}" cy="${cy+16}" r="3" style="fill:var(--u3)"/><text x="${cx+6}" y="${cy-20}" style="font-size:10px">|x|</text>`); }
  // u4: e^x and ln x mirrored in y = x
  { const cx=528,cy=208,r=44; let e="",l=""; for(let i=0;i<=40;i++){ const x=-2.2+i*0.1; const yy=Math.exp(x); if(yy<2.6){ e+=(e?"L":"M")+(cx+x*14).toFixed(1)+" "+(cy-yy*14).toFixed(1); } } for(let i=1;i<=60;i++){ const x=0.05+i*0.05; l+=(i>1?"L":"M")+(cx+x*14).toFixed(1)+" "+(cy-Math.log(x)*14).toFixed(1); }
    g+=inset(cx,cy,r,"u4",ax(cx,cy,r)+`<line x1="${cx-40}" y1="${cy+40}" x2="${cx+40}" y2="${cy-40}" style="stroke:var(--fig-stroke);stroke-width:1;stroke-dasharray:2 2"/><path d="${e}" style="fill:none;stroke:var(--u4);stroke-width:2"/><path d="${l}" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.6"/><text x="${cx-30}" y="${cy-22}" style="font-size:10px;fill:var(--u4)">eˣ</text><text x="${cx+18}" y="${cy+6}" style="font-size:10px">ln x</text>`); }
  // u5: unit circle and sine
  { const cx=528,cy=320,r=44; let s=""; for(let i=0;i<=60;i++){ const x=i/60*Math.PI*2; s+=(i?"L":"M")+(cx-8+x*7.5).toFixed(1)+" "+(cy-Math.sin(x)*16).toFixed(1); }
    g+=inset(cx,cy,r,"u5",`<circle cx="${cx-22}" cy="${cy}" r="16" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.2"/><line x1="${cx-22}" y1="${cy}" x2="${cx-22+16*Math.cos(1)}" y2="${cy-16*Math.sin(1)}" style="stroke:var(--u5);stroke-width:1.6"/><circle cx="${cx-22+16*Math.cos(1)}" cy="${cy-16*Math.sin(1)}" r="2.4" style="fill:var(--u5)"/><line class="ax" x1="${cx-8}" y1="${cy}" x2="${cx+40}" y2="${cy}" style="opacity:.5"/><path d="${s}" style="fill:none;stroke:var(--u5);stroke-width:2"/>`); }
  // u6: implicit curve (circle) with tangent
  { const cx=420,cy=382,r=40; const th=.9, R=22, px=cx+R*Math.cos(th), py=cy-R*Math.sin(th), mx=-Math.cos(th)/Math.sin(th);
    g+=inset(cx,cy,r,"u6",ax(cx,cy,r)+`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.6"/><line x1="${px-30}" y1="${py+30*mx}" x2="${px+30}" y2="${py-30*mx}" style="stroke:var(--u6);stroke-width:1.8"/><circle cx="${px}" cy="${py}" r="3" style="fill:var(--paper);stroke:var(--u6);stroke-width:1.8"/><text x="${cx-30}" y="${cy+30}" style="font-size:9px;fill:var(--u6)">dy/dx = −x/y</text>`); }
  // callouts
  const units=Object.fromEntries(C.units.map(u=>[u.id,u]));
  const CO=[["u1",X(t1),Y(f(t1)),120,22,"Rates of change","r"],["u2",X(1.9),Y(f(1.9))+40,116,360,"Net change","r"],["u3",498,64,446,22,"Piecewise and inverse","l"],["u4",494,180,446,150,"Exp and log","l"],["u5",490,296,446,262,"Trig","l"],["u6",392,356,248,412,"Implicit","r"]];
  CO.forEach(([id,px,py,cx,cy,t,side])=>{ const u=units[id];
    const tx=side==="l"?cx-16:cx+16, an=side==="l"?"end":"start";
    g+=`<a class="co" href="unit-${u.n}.html" style="--c:var(--${id})" aria-label="Unit ${u.n}: ${esc(u.title)}"><line x1="${px}" y1="${py}" x2="${cx}" y2="${cy}" style="stroke:var(--c);stroke-width:1;stroke-dasharray:3 2"/><circle cx="${cx}" cy="${cy}" r="11" style="fill:var(--paper);stroke:var(--c);stroke-width:1.5"/><text x="${cx}" y="${cy+4}" text-anchor="middle" style="font-family:var(--mono);font-size:11px;font-weight:500;fill:var(--c)">${u.n}</text><text x="${tx}" y="${cy+4}" text-anchor="${an}" class="lbl">${t}</text></a>`; });
  g+=`<text x="612" y="434" text-anchor="end">schematic · drag nothing, click a number</text></svg>`;
  const p=$("#plate"); p.innerHTML=g+`<figcaption><b>Fig. 1</b> One curve, annotated by unit. The moving point carries its tangent line and shows the slope where it stands, like Tan in the corner. Click a number to open that unit.</figcaption>`;
  const svg=$("#herofig"); svg.querySelectorAll("a.co").forEach(a=>{ a.addEventListener("mouseenter",()=>a.querySelector("circle").style.fill="var(--c)"); a.addEventListener("mouseleave",()=>a.querySelector("circle").style.fill="var(--paper)"); });
  const rd=$("#rdot"), rt=$("#rtan"), rl=$("#rlab");
  let t=0.6, dir=1, last=performance.now();
  function place(){ const y=f(t), m=df(t); const sx=X(t), sy=Y(y); rd.setAttribute("cx",sx); rd.setAttribute("cy",sy);
    const s=m*55/36, L=26/Math.sqrt(1+s*s); rt.setAttribute("x1",sx-L); rt.setAttribute("y1",sy+s*L); rt.setAttribute("x2",sx+L); rt.setAttribute("y2",sy-s*L);
    rl.setAttribute("x",sx+8); rl.setAttribute("y",sy-12); rl.textContent=`slope ${m>=0?"+":"−"}${Math.abs(m).toFixed(2)}`; }
  function tick(now){ const dt=Math.min(.05,(now-last)/1000); last=now; t+=dir*.55*dt; if(t>9.6){ t=9.6; dir=-1; } if(t<.4){ t=.4; dir=1; } place(); requestAnimationFrame(tick); }
  place(); if(!reduce) requestAnimationFrame(tick);
})();

/* ---------- unit cards ---------- */
const db=M.db();
const box=$("#mods");
let totalLec=0, nextLec=null;
const quizLabel=id=>{ const q=C.quizzes.find(q=>q.lectures.includes(id)); return q?(q.midterm?"Midterm":"Quiz "+q.n):""; };
C.units.forEach(u=>{
  const lecs=u.lectures.map(id=>M.lec(id)).filter(Boolean); totalLec+=lecs.length;
  const done=lecs.filter(L=>M.chState(L.id).done).length; const pct=lecs.length?Math.round(done/lecs.length*100):0;
  if(!nextLec){ const L=lecs.find(L=>!M.chState(L.id).done); if(L) nextLec=L; }
  const quizzes=[...new Set(u.lectures.map(quizLabel).filter(Boolean))];
  const e=db.exam["unit-"+u.id];
  const isNew=lecs.some(L=>M.isNew(L.added,L.date));
  box.insertAdjacentHTML("beforeend",`<a class="mod" href="unit-${u.n}.html" style="--c:var(--${u.id})"><div class="top"><span class="icon">${M.ICON[u.id]}</span><div><div class="num">Unit ${u.n} · L${u.lectures.map(id=>+id.slice(1)).join(", ")}${isNew?' <span class="pill new">New</span>':""}</div><h3>${esc(u.title)}</h3></div></div>
    <ul>${u.topics.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
    <div class="qrow">${quizzes.map(q=>`<span class="pill">${q}</span>`).join("")}</div>
    <div class="prog"><span class="ring" style="--p:${pct}"><span>${done}/${lecs.length}</span></span><span>chapters done${e?`<br>mini exam best: <b>${e.best}%</b>`:""}</span><span class="go">Open</span></div></a>`);
});
const mtDays=Math.ceil((new Date(C.midterm.date+"T"+C.midterm.time)-new Date())/864e5);
const me=db.exam.midterm;
box.insertAdjacentHTML("beforeend",`<a class="mod mid" href="midterm.html" style="--c:var(--mid)"><div class="top"><span class="icon">${M.ICON.mid}</span><div><div class="num">Lectures 1 to 17 · ${M.fmtDate(C.midterm.date,{weekday:"short",month:"short",day:"numeric"})}, 7:00 pm</div><h3>Midterm prep</h3></div></div>
  <p style="margin:0">A practice midterm in the real format (12 multiple choice, 8 long answer), every practice question from the prof with answers to check against, the course-notes problems the long answers come from, a mistake log, and a study plan built from your results.</p>
  <div class="prog"><span class="pill">${mtDays>0?mtDays+" days to go":mtDays===0?"Today":"Done"}</span><span class="pill">${(M.extras.review||[]).length} practice questions</span><span class="pill">${(M.COUNTS&&M.COUNTS.longAnswer)||0} course-notes problems</span>${me?`<span>practice midterm best: <b>${me.best}%</b></span>`:""}<span class="go">Open</span></div></a>`);
[["formulas.html","formulas","Formula sheet","Every formula from every lecture. Reference, flashcards with spaced repetition, and fill in the blank."],["gym.html","gym","Practice gym","Endless problems from any lectures you pick, with easy, medium and hard, and your accuracy by topic."],["quiz.html","quiz","Quiz prep","Timed practice on exactly one quiz's lectures, in the quiz format."]].forEach(([href,ic,t,d])=>{
  box.insertAdjacentHTML("beforeend",`<a class="mod" href="${href}" style="--c:var(--accent)"><div class="top"><span class="icon">${M.ICON[ic]}</span><div><div class="num">Tools</div><h3>${t}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">${d}</p><div class="prog"><span class="go">Open</span></div></a>`); });
const nForm=M.lectures.reduce((n,L)=>n+(L.formulas||[]).length,0), nGen=M.lectures.reduce((n,L)=>n+(L.gens||[]).length,0), nEx=M.lectures.reduce((n,L)=>n+(L.exam||[]).length,0);
$("#counts").innerHTML=`<span><b>${totalLec}</b>lectures</span><span><b>${nForm}</b>formulas</span><span><b>${nGen}</b>problem types</span><span><b>${nEx}</b>exam Qs</span><span><b>${(M.extras.review||[]).length+((M.COUNTS&&M.COUNTS.longAnswer)||0)}</b>practice Qs</span>`;
if(nextLec && Object.keys(db.ch).length){ $("#continueBtn").textContent=`Continue with Lecture ${nextLec.n}`; $("#continueBtn").href=M.lecURL(nextLec.id); }

/* ---------- lecture timeline ---------- */
(function(){
  const tl=$("#tl"); const today=M.today();
  // show every quiz block up to and including the first block that is still in the future
  const blocks=[]; for(const q of C.quizzes){ if(!q.lectures.length) continue; blocks.push(q); if(M.parseDate(q.date)>today && q.lectures.every(id=>!M.lec(id))) break; }
  blocks.forEach(q=>{
    const b=el("div",{class:"tl-blk",style:`--n:${q.lectures.length}`});
    b.append(el("div",{class:"bh",html:`<b>${q.midterm?"Midterm":"Quiz "+q.n}</b> · ${M.fmtDate(q.date)}`}));
    const row=el("div",{class:"tl-row"});
    q.lectures.forEach(id=>{ const L=M.lec(id); const r=C.schedule.find(x=>x[0]===id); const u=C.units.find(u=>u.lectures.includes(id));
      const done=L&&M.chState(id).done; const c=u?`var(--${u.id})`:"var(--ink2)";
      const a=el(L?"a":"span",{class:"tl-l"+(done?" done":"")+(L?"":" todo"),style:`--c:${c}`,href:L?M.lecURL(id):null,title:r?`Lecture ${+id.slice(1)}: ${r[2]}`:id},
        el("span",{class:"d"},String(+id.slice(1))), el("span",{class:"dt"},r?M.fmtDate(r[1]):""));
      if(L&&M.isNew(L.added,L.date)) a.append(el("span",{class:"nw"},"NEW")); else if(!L && r && (M.parseDate(r[1])-today)/864e5<=7) a.append(el("span",{class:"nw",style:"background:var(--ink2)"},"SOON"));
      row.append(a); });
    b.append(row); tl.append(b);
  });
})();

/* ---------- question of the day ---------- */
(function(){
  const pool=[]; M.lectures.forEach(L=>(L.exam||[]).forEach(q=>pool.push({...q,lec:L.id})));
  if(!pool.length) return;
  const day=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
  const q=pool[(day*7919)%pool.length]; const L=M.lec(q.lec), u=M.unit(L.unit);
  const host=$("#qod"); host.style.setProperty("--c",`var(--${u.id})`);
  host.append(el("span",{class:"pill"},`Lecture ${L.n} · Unit ${u.n}`));
  ENGINE.mcq(host,q,ok=>{ if(!ok) host.append(el("p",{style:"margin:6px 0 0"},el("a",{href:M.lecURL(L.id)},`Review Lecture ${L.n}: ${L.title.replace(/\$[^$]*\$/g,"")}`))); });
})();

/* ---------- changelog ---------- */
const log=$("#log");
(M.extras.changelog||[]).slice(0,8).forEach(c=>log.append(el("li",{html:`<span class="when">${M.fmtDate(c.date)}</span>${rich(c.text)}`})));
$("#built").textContent=M.BUILT?`Last rebuilt ${new Date(M.BUILT).toLocaleString("en-CA",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}.`:"";
M.footer();
})();
