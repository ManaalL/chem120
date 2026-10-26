/* CHEM 120 Interactive: landing page. */
(function(){
"use strict";
const M=window.C120, C=M.COURSE, el=M.el, rich=M.rich, esc=M.esc, $=M.$;
M.nav("modules");
document.querySelectorAll(".sub,.how div").forEach(n=>{ if(n.innerHTML.includes("$")) n.innerHTML=rich(n.innerHTML); });
const reduce=M.reduceMotion();

/* ---------- Fig. 1: one plate, annotated by module (3D-style drawing) ---------- */
(function(){
  const W=620,H=440;
  const shade=(id,c0,c1,c2)=>`<radialGradient id="${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${c0}"/><stop offset=".45" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
  let g=`<svg class="fig" id="herofig" viewBox="0 0 ${W} ${H}" role="img" aria-label="A drawing with four numbered callouts, one for each module: a balanced reaction, a hydrogen orbital with Bohr orbits, an electronegativity trend and an ammonia molecule">
  <defs>${shade("gH","#ffffff","#e8e4dc","#a9a39a")}${shade("gO","#f3a69a","#cc4a3d","#7d2a22")}${shade("gC","#9aa2a6","#4a5257","#23282b")}${shade("gN","#a9bdf0","#4f74c9","#253f7c")}
    <linearGradient id="lobeP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--phase-pos)" stop-opacity=".95"/><stop offset="1" stop-color="var(--phase-pos)" stop-opacity=".6"/></linearGradient>
    <linearGradient id="lobeN" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--phase-neg)" stop-opacity=".95"/><stop offset="1" stop-color="var(--phase-neg)" stop-opacity=".6"/></linearGradient>
    <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#000" stroke-opacity=".28" stroke-width="2"/></pattern>
    <radialGradient id="lp" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity=".08"/></radialGradient>
  </defs>`;
  /* Module 2: 2p_z orbital and Bohr orbits around one nucleus */
  const cx=215, cy=205;
  g+=`<g id="atom">`;
  g+=`<line class="ax" x1="${cx-170}" y1="${cy+40}" x2="${cx+170}" y2="${cy-40}" style="opacity:.45"/><line class="ax" x1="${cx}" y1="${cy-160}" x2="${cx}" y2="${cy+160}" style="opacity:.45"/><text x="${cx+174}" y="${cy-42}" style="font-family:var(--display);font-style:italic;font-size:13px">x</text><text x="${cx+6}" y="${cy-150}" style="font-family:var(--display);font-style:italic;font-size:13px">z</text>`;
  const orbit=(rx,ry,cls)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(-13 ${cx} ${cy})" style="fill:none;stroke:var(--fig-stroke);stroke-width:1;stroke-opacity:.55;${cls}"/>`;
  g+=orbit(160,46,"")+orbit(100,29,"")+orbit(48,14,"stroke-dasharray:3 3");
  g+=`<path d="M${cx} ${cy} C ${cx-52} ${cy-34}, ${cx-48} ${cy-128}, ${cx} ${cy-132} C ${cx+48} ${cy-128}, ${cx+52} ${cy-34}, ${cx} ${cy} Z" fill="url(#lobeP)" stroke="var(--phase-pos)" stroke-width="1"/>`;
  g+=`<path d="M${cx} ${cy} C ${cx-52} ${cy+34}, ${cx-48} ${cy+128}, ${cx} ${cy+132} C ${cx+48} ${cy+128}, ${cx+52} ${cy+34}, ${cx} ${cy} Z" fill="url(#lobeN)" stroke="var(--phase-neg)" stroke-width="1"/><path d="M${cx} ${cy} C ${cx-52} ${cy+34}, ${cx-48} ${cy+128}, ${cx} ${cy+132} C ${cx+48} ${cy+128}, ${cx+52} ${cy+34}, ${cx} ${cy} Z" fill="url(#hatch)"/>`;
  g+=`<ellipse cx="${cx-16}" cy="${cy-96}" rx="10" ry="16" fill="#fff" opacity=".22"/>`;
  g+=`<circle cx="${cx}" cy="${cy-80}" r="10" style="fill:var(--phase-pos);stroke:#fff;stroke-width:1.5"/><text x="${cx}" y="${cy-76}" text-anchor="middle" style="fill:#fff;font:700 13px var(--mono)">+</text>`;
  g+=`<circle cx="${cx}" cy="${cy+80}" r="10" style="fill:var(--phase-neg);stroke:#fff;stroke-width:1.5"/><text x="${cx}" y="${cy+84.5}" text-anchor="middle" style="fill:#fff;font:700 13px var(--mono)">−</text>`;
  g+=`<circle cx="${cx}" cy="${cy}" r="7" fill="url(#gO)"/>`;
  g+=`<g id="e1"><circle r="6.5" style="fill:var(--paper);stroke:var(--accent);stroke-width:2"/><text y="3.5" text-anchor="middle" style="font:600 9px var(--mono);fill:var(--accent)">e⁻</text></g>`;
  g+=`<text x="${cx-150}" y="${cy+95}" style="font:500 10.5px var(--mono);fill:var(--ink2)">n = 3</text><text x="${cx-92}" y="${cy+62}" style="font:500 10.5px var(--mono);fill:var(--ink2)">n = 2</text>`;
  g+=`</g>`;
  /* Module 4: NH3 with its lone pair */
  const nx=505, ny=105; const atom=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${f})" stroke="rgba(0,0,0,.18)" stroke-width=".8"/>`;
  const bond=(x1,y1,x2,y2,w=6)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:#8e9a96;stroke-width:${w};stroke-linecap:round"/>`;
  g+=`<ellipse cx="${nx}" cy="${ny-40}" rx="14" ry="24" fill="url(#lp)" stroke="var(--accent)" stroke-opacity=".35"/><circle cx="${nx-4}" cy="${ny-46}" r="2.4" style="fill:var(--fig-stroke)"/><circle cx="${nx+4}" cy="${ny-46}" r="2.4" style="fill:var(--fig-stroke)"/>`;
  g+=bond(nx,ny,nx-44,ny+30)+bond(nx,ny,nx+46,ny+26)+bond(nx,ny,nx+6,ny+50,5);
  g+=atom(nx+6,ny+50,11,"gH")+atom(nx,ny,17,"gN")+atom(nx-44,ny+30,12,"gH")+atom(nx+46,ny+26,12,"gH");
  g+=`<text x="${nx}" y="${ny+4}" text-anchor="middle" style="fill:#fff;font:700 11px var(--sans)">N</text>`;
  g+=`<path d="M${nx-18} ${ny+12} Q ${nx-6} ${ny+30} ${nx+4} ${ny+30}" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:3 2"/>`;
  /* Module 3: electronegativity across period 2, drawn as isometric bars (Module 3, p. 15 values) */
  const EN=[["Li",1.0],["Be",1.5],["B",2.0],["C",2.5],["N",3.0],["O",3.5],["F",4.0]];
  const bx=402, by=330, dx=24, dy=-7, w=16, k=22;
  EN.forEach(([s,v],i)=>{ const x=bx+i*dx, y=by+i*dy, h=v*k;
    g+=`<path d="M${x} ${y} l${w} ${-w*0.35} l0 ${-h} l${-w} ${w*0.35} Z" style="fill:var(--m3);fill-opacity:.55;stroke:var(--m3);stroke-width:.8"/>`;
    g+=`<path d="M${x} ${y} l${-w*0.7} ${-w*0.35} l0 ${-h} l${w*0.7} ${w*0.35} Z" style="fill:var(--m3);fill-opacity:.85;stroke:var(--m3);stroke-width:.8"/>`;
    g+=`<path d="M${x} ${y-h} l${w} ${-w*0.35} l${-w*0.7} ${-w*0.35} l${-w} ${w*0.35} Z" style="fill:var(--m3);fill-opacity:.3;stroke:var(--m3);stroke-width:.8"/>`;
    g+=`<text x="${x}" y="${y+14}" text-anchor="middle" style="font:500 10px var(--mono)">${s}</text>`; });
  g+=`<text x="${bx-14}" y="${by+30}" style="font:500 10px var(--mono);fill:var(--m3)">electronegativity, period 2 →</text>`;
  /* Module 1: CH4 + 2 O2 -> CO2 + 2 H2O */
  const ry=400; let x=46;
  const ch4=(x0)=>bond(x0,ry,x0-13,ry-11,4)+bond(x0,ry,x0+13,ry-11,4)+bond(x0,ry,x0-11,ry+11,4)+bond(x0,ry,x0+11,ry+11,4)+atom(x0-13,ry-11,6,"gH")+atom(x0+13,ry-11,6,"gH")+atom(x0,ry,9,"gC")+atom(x0-11,ry+11,6,"gH")+atom(x0+11,ry+11,6,"gH");
  const o2=(x0)=>bond(x0-8,ry,x0+8,ry,5)+atom(x0-8,ry,8,"gO")+atom(x0+8,ry,8,"gO");
  const co2=(x0)=>bond(x0-15,ry,x0+15,ry,5)+atom(x0-15,ry,8,"gO")+atom(x0,ry,8.5,"gC")+atom(x0+15,ry,8,"gO");
  const h2o=(x0)=>bond(x0,ry,x0-11,ry+8,4)+bond(x0,ry,x0+11,ry+8,4)+atom(x0-11,ry+8,6,"gH")+atom(x0+11,ry+8,6,"gH")+atom(x0,ry,8.5,"gO");
  const op=(x0,t)=>`<text x="${x0}" y="${ry+5}" text-anchor="middle" style="font:500 15px var(--sans);fill:var(--ink2)">${t}</text>`;
  const co=(x0,t)=>`<text x="${x0}" y="${ry+5}" text-anchor="middle" style="font:600 13px var(--mono);fill:var(--m1)">${t}</text>`;
  g+=`<g transform="translate(${x} ${ry}) scale(1.35) translate(${-x} ${-ry})">`+ch4(x)+op(x+30,"+")+co(x+48,"2")+o2(x+68)+op(x+94,"→")+co2(x+126)+op(x+156,"+")+co(x+172,"2")+h2o(x+192)+`</g>`;
  /* callouts */
  const mods=Object.fromEntries(C.modules.map(u=>[u.id,u]));
  const CO=[["m1",x+296,ry,392,ry,"Reactions and stoichiometry","r"],["m2",cx+44,cy-110,98,42,"Quantum theory and the H atom","r"],["m3",bx+132,by-128,596,170,"Periodic trends","l"],["m4",nx-22,ny-30,410,28,"Bonding and shape","l"]];
  CO.forEach(([id,px,py,qx,qy,t,side])=>{ const u=mods[id]; const tx=side==="l"?qx-16:qx+16, an=side==="l"?"end":"start";
    g+=`<a class="co" href="module-${u.n}.html" style="--c:var(--${id})" aria-label="Module ${u.n}: ${esc(u.title)}"><line x1="${px}" y1="${py}" x2="${qx}" y2="${qy}" style="stroke:var(--c);stroke-width:1;stroke-dasharray:3 2"/><circle cx="${qx}" cy="${qy}" r="11" style="fill:var(--paper);stroke:var(--c);stroke-width:1.5"/><text x="${qx}" y="${qy+4}" text-anchor="middle" style="font-family:var(--mono);font-size:11px;font-weight:500;fill:var(--c)">${u.n}</text><text x="${tx}" y="${qy+4}" text-anchor="${an}" class="lbl">${t}</text></a>`; });
  g+=`</svg>`;
  const p=$("#plate"); p.innerHTML=g+`<figcaption><b>Fig. 1</b> One plate, four modules: a balanced combustion (1), a $2p_z$ orbital with its + and − lobes inside Bohr orbits (2), electronegativity rising across period 2 (3), and ammonia with its lone pair (4). Click a number to open that module. Drawn for this site; electronegativities from Module 3, p. 15.</figcaption>`;
  p.querySelector("figcaption").innerHTML=rich(p.querySelector("figcaption").innerHTML);
  const svg=$("#herofig"); svg.querySelectorAll("a.co").forEach(a=>{ a.addEventListener("mouseenter",()=>a.querySelector("circle").style.fill="var(--c)"); a.addEventListener("mouseleave",()=>a.querySelector("circle").style.fill="var(--paper)"); a.addEventListener("focus",()=>a.querySelector("circle").style.fill="var(--c)"); a.addEventListener("blur",()=>a.querySelector("circle").style.fill="var(--paper)"); });
  /* the electron travels the n = 3 orbit */
  const e1=$("#e1"); const th=-13*Math.PI/180; let t=0.8, last=performance.now();
  const place=()=>{ const ex=160*Math.cos(t), ey=46*Math.sin(t); const X=cx+ex*Math.cos(th)-ey*Math.sin(th), Y=cy+ex*Math.sin(th)+ey*Math.cos(th); e1.setAttribute("transform",`translate(${X.toFixed(1)},${Y.toFixed(1)})`); };
  place();
  if(!reduce){ let vis=true; new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis){ last=performance.now(); requestAnimationFrame(tick); } }).observe(svg);
    function tick(now){ if(!vis||document.hidden) return; t+=Math.min(.05,(now-last)/1000)*.45; last=now; place(); requestAnimationFrame(tick); } requestAnimationFrame(tick); document.addEventListener("visibilitychange",()=>{ if(!document.hidden&&vis){ last=performance.now(); requestAnimationFrame(tick); } }); }
})();

/* ---------- module cards ---------- */
const db=M.db();
const box=$("#mods");
let totalCh=0, nextCh=null;
C.modules.forEach(u=>{
  const chs=u.chapters.map(id=>M.chap(id)).filter(Boolean); totalCh+=chs.length;
  if(u.upcoming){ box.insertAdjacentHTML("beforeend",`<div class="mod" style="--c:var(--ink2);opacity:.75"><div class="top">${M.ICON[u.id]}<div><div class="num">Module ${u.n} · coming</div><h3>${esc(u.title)}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">${esc(u.topics[0])}</p></div>`); return; }
  const done=chs.filter(L=>M.chState(L.id).done).length; const pct=chs.length?Math.round(done/chs.length*100):0;
  if(!nextCh){ const L=chs.find(L=>!M.chState(L.id).done); if(L) nextCh=L; }
  const tests=[...new Set(u.chapters.map(id=>M.assessLabel(M.firstTest(id))).filter(Boolean))];
  const e=db.exam["unit-"+u.id];
  const isNew=chs.some(L=>M.isNew(L.added,L.date));
  const n3=chs.reduce((n,L)=>n+Object.values(L.figures||{}).filter(f=>f.model).length,0);
  box.insertAdjacentHTML("beforeend",`<a class="mod" href="module-${u.n}.html" style="--c:var(--${u.id})"><div class="top">${M.ICON[u.id]}<div><div class="num">Module ${u.n} · ${u.chapters.length} chapters${isNew?' <span class="pill new">New</span>':""}</div><h3>${esc(u.title)}</h3></div></div>
    <ul>${u.topics.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
    <div class="qrow">${tests.map(q=>`<span class="pill">${q}</span>`).join("")}${n3?`<span class="pill" style="--c:var(--head)">${n3} 3D models</span>`:""}</div>
    <div class="prog"><span class="ring" style="--p:${pct}"><span>${done}/${chs.length}</span></span><span>chapters done${e?`<br>mini exam best: <b>${e.best}%</b>`:""}</span><span class="go">Open</span></div></a>`);
});
const T=C.test; const tAt=new Date(T.date+"T"+T.time); const tDays=Math.ceil((tAt-new Date())/864e5);
const me=db.exam.test2;
box.insertAdjacentHTML("beforeend",`<a class="mod mid" href="midterm.html" style="--c:var(--mid)"><div class="top"><span class="icon">${M.ICON.mid}</span><div><div class="num">${esc(T.label)} · ${M.fmtDate(T.date,{weekday:"short",month:"short",day:"numeric"})}, 8:30 am (assumed)</div><h3>Test 2 prep</h3></div></div>
  <p style="margin:0">Practice tests in the real format (multiple choice, five options, some select-all, 45 minutes), worked parallels of every course-notes example, a mistake log you can redo with the same numbers, and a study plan built from your results.</p>
  <div class="prog"><span class="pill">${tDays>0?tDays+" days to go":tDays===0?"Today":"Done"}</span><span class="pill">${(M.extras.review||[]).length} practice-test questions</span><span class="pill">${(M.extras.examples||[]).length} course-notes examples</span>${me?`<span>practice test best: <b>${me.best}%</b></span>`:""}<span class="go">Open</span></div></a>`);
[["formulas.html","formulas","Formula sheet","Every formula, constant and rule with its page. Reference, flashcards with spaced repetition, fill in the blank, and a periodic table."],["gym.html","gym","Practice gym","Endless problems from any chapters you pick, easy to hard, with your accuracy by topic."],["quiz.html","quiz","Quiz prep","Timed practice on exactly one Participation Challenge's chapters, in the Möbius format."]].forEach(([href,ic,t,d])=>{
  box.insertAdjacentHTML("beforeend",`<a class="mod" href="${href}" style="--c:var(--accent)"><div class="top"><span class="icon">${M.ICON[ic]}</span><div><div class="num">Tools</div><h3>${t}</h3></div></div><p style="margin:0;color:var(--ink2);font-size:.95rem">${d}</p><div class="prog"><span class="go">Open</span></div></a>`); });
const nForm=M.chapters.reduce((n,L)=>n+(L.formulas||[]).length,0), nGen=M.chapters.reduce((n,L)=>n+(L.gens||[]).length,0), nEx=M.chapters.reduce((n,L)=>n+(L.exam||[]).length,0), n3D=M.chapters.reduce((n,L)=>n+Object.values(L.figures||{}).filter(f=>f.model).length,0);
$("#counts").innerHTML=`<span><b>${totalCh}</b>chapters</span><span><b>${n3D}</b>3D models</span><span><b>${nForm}</b>formulas and rules</span><span><b>${nGen}</b>problem types</span><span><b>${nEx}</b>exam Qs</span>`;
if(nextCh && Object.keys(db.ch).length){ $("#continueBtn").textContent=`Continue with ${nextCh.num}`; $("#continueBtn").href=M.chURL(nextCh.id); }

/* ---------- class timeline ---------- */
(function(){
  const tl=$("#tl"); const today=M.today();
  C.assessments.filter(q=>q.chapters.length).forEach(q=>{
    const b=el("div",{class:"tl-blk",style:`--n:${q.chapters.length}`});
    b.append(el("div",{class:"bh",html:`<b>${M.assessLabel(q)}</b> · ${M.fmtDate(q.date)}`}));
    const row=el("div",{class:"tl-row"});
    q.chapters.forEach(id=>{ const L=M.chap(id); const r=C.schedule.find(x=>x[0]===id); const u=C.modules.find(u=>u.chapters.includes(id));
      const done=L&&M.chState(id).done; const c=u?`var(--${u.id})`:"var(--ink2)"; const future=r&&M.parseDate(r[1])>today;
      const a=el(L?"a":"span",{class:"tl-l"+(done?" done":"")+(L&&!future?"":" todo"),style:`--c:${c}`,href:L?M.chURL(id):null,title:r?`${u.n}.${+id.split("C")[1]} ${r[2]}`:id},
        el("span",{class:"d"},`${u.n}.${+id.split("C")[1]}`), el("span",{class:"dt"},r?M.fmtDate(r[1]):""));
      if(L&&M.isNew(L.added,L.date)) a.append(el("span",{class:"nw"},"NEW")); else if(future && (M.parseDate(r[1])-today)/864e5<=7) a.append(el("span",{class:"nw",style:"background:var(--ink2)"},"SOON"));
      row.append(a); });
    b.append(row); tl.append(b);
  });
})();

/* ---------- question of the day ---------- */
(function(){
  const pool=[]; M.chapters.forEach(L=>{ if(M.upcoming(L)) return; (L.exam||[]).forEach(q=>pool.push({...q,lec:L.id})); });
  if(!pool.length) return;
  const day=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
  const q=pool[(day*7919)%pool.length]; const L=M.chap(q.lec), u=M.mod(L.module);
  const host=$("#qod"); host.style.setProperty("--c",`var(--${u.id})`);
  host.append(el("span",{class:"pill"},`Chapter ${L.num} · Module ${u.n}`));
  ENGINE.mcq(host,q,ok=>{ if(!ok) host.append(el("p",{style:"margin:6px 0 0"},el("a",{href:M.chURL(L.id)},`Review chapter ${L.num}: ${L.title.replace(/\$[^$]*\$/g,"")}`))); });
})();

/* ---------- changelog ---------- */
const log=$("#log");
(M.extras.changelog||[]).slice(0,8).forEach(c=>log.append(el("li",{html:`<span class="when">${M.fmtDate(c.date)}</span>${rich(c.text)}`})));
$("#built").textContent=M.BUILT?`Last rebuilt ${new Date(M.BUILT).toLocaleString("en-CA",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}.`:"";
M.footer();
})();
