#!/usr/bin/env node
/* Build script for CHEM 120 Interactive.
   1. Loads data/course.js, data/M*C*.js (one file per chapter), data/review/*.js, data/examples/*.js, data/changelog.js
   2. Validates them: unique stable IDs, required fields, module and quiz references, dates, page refs, steps that point at real
      figures and generators, every 3D model has a "predict first" question
   3. Writes assets/js/studydata.js: one file that every page loads (the data files concatenated, so generator functions survive)
   4. Writes module-N.html and quiz-<id>.html from the templates in build/templates
   Usage: node build/build.js            (build)
          node build/build.js --check    (validate only)
          node build/build.js --check --only M2C6 */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..");
const D=p=>path.join(ROOT,p);
const checkOnly=process.argv.includes("--check");

function listJS(dir){ const p=D(dir); if(!fs.existsSync(p)) return []; return fs.readdirSync(p).filter(f=>f.endsWith(".js")&&!f.startsWith("_")).sort().map(f=>path.join(dir,f)); }
const oi=process.argv.indexOf("--only"); const ONLY=oi>0?process.argv[oi+1].split(","):null;
const CH_RE=/\/M\dC\d+\.js$/;
let files=[ "data/course.js", ...listJS("data").filter(f=>CH_RE.test(f)).sort((a,b)=>{ const k=f=>{ const m=f.match(/M(\d)C(\d+)/); return +m[1]*100+ +m[2]; }; return k(a)-k(b); }), ...listJS("data/review"), ...listJS("data/examples"), "data/changelog.js" ].filter(f=>fs.existsSync(D(f)));
if(ONLY){ files=["data/course.js"]; for(const id of ONLY){ for(const c of [`data/${id}.js`,`data/_${id}.js`,`data/review/${id}.js`,`data/examples/${id}.js`]) if(fs.existsSync(D(c))) { files.push(c); break; } } }  /* drafts named data/_M1C3.js can be checked with --only M1C3 */

/* load everything into a sandbox that looks like a browser window */
const ctx={console,Math,Date,JSON}; ctx.window=ctx; vm.createContext(ctx);
for(const f of ["core.js","chemcheck.js","chemlib.js"]) vm.runInContext(fs.readFileSync(D("assets/js/"+f),"utf8").replace(/M\.theme\(\);/,"").replace(/if\(window\.matchMedia\)\{[^\n]*\n/,""),ctx,{filename:f});
const sources=[];
for(const f of files){ const src=fs.readFileSync(D(f),"utf8"); try{ vm.runInContext(src,ctx,{filename:f}); }catch(e){ console.error(`\n✗ ${f} failed to load:\n  ${e.stack.split("\n").slice(0,3).join("\n  ")}`); process.exit(1); } sources.push([f,src]); }
const M=ctx.C120, C=M.COURSE;

/* ---------- validation ---------- */
const errors=[], warns=[];
const E=(m)=>errors.push(m), W=(m)=>warns.push(m);
const ids=new Map();
const claim=(id,where)=>{ if(!id||typeof id!=="string") return E(`${where}: missing id`); if(ids.has(id)) E(`Duplicate id "${id}" in ${where} (also in ${ids.get(id)})`); ids.set(id,where); };
const isDate=s=>/^\d{4}-\d\d-\d\d$/.test(s||"");
const modIds=new Set(C.modules.map(u=>u.id)), asIds=new Set(C.assessments.map(q=>q.id));
const sched=new Map(C.schedule.map(r=>[r[0],r]));
const chIds=new Set();
const REF_RE=/^pp?\. \d+(\s*(to|-|and|,)\s*\d+)?$/;
M.chapters.sort((a,b)=>(+a.id[1])*100+a.n-((+b.id[1])*100+b.n));
const MODEL_TYPES=new Set(["orbital","molecule","lattice","bohr","emwave","ringwave","aufbau","shells","trends","particles","sterngerlach"]);
let nModels=0;
for(const L of M.chapters){
  const w=`${L.id||"?"}`;
  claim(L.id,w); chIds.add(L.id);
  if(!/^M\dC\d+$/.test(L.id)) E(`${w}: id must look like M2C6`);
  ["title","date","added","module","quiz","summary","num","pages"].forEach(k=>{ if(!L[k]) E(`${w}: missing ${k}`); });
  if(L.num!==`${L.id[1]}.${L.n}`) E(`${w}: num should be "${L.id[1]}.${L.n}"`);
  if(!isDate(L.date)) E(`${w}: date must be YYYY-MM-DD`); if(!isDate(L.added)) E(`${w}: added must be YYYY-MM-DD`);
  if(!modIds.has(L.module)) E(`${w}: unknown module ${L.module}`);
  if(!asIds.has(L.quiz)) E(`${w}: unknown quiz ${L.quiz}`);
  const u=C.modules.find(x=>x.id===L.module); if(u && !u.chapters.includes(L.id)) E(`${w}: module ${L.module} does not list ${L.id} in data/course.js`);
  const q=C.assessments.find(x=>x.id===L.quiz); if(q && !q.chapters.includes(L.id)) E(`${w}: assessment ${L.quiz} does not list ${L.id} in data/course.js`);
  const sr=sched.get(L.id); if(!sr) E(`${w}: not in the schedule in data/course.js`); else { if(sr[1]!==L.date) W(`${w}: date ${L.date} differs from the schedule (${sr[1]})`); if(sr[3]!==L.pages) W(`${w}: pages ${L.pages} differ from the schedule (${sr[3]})`); }
  const pre=L.id+".";
  const refOK=(r,where)=>{ if(!r) return W(`${where} has no page ref`); if(!REF_RE.test(r) && !/^(data sheet|Data sheet|not from the notes)/.test(r)) W(`${where}: ref "${r}" should look like "p. 14" or "pp. 14-15"`); };
  (L.formulas||[]).forEach(f=>{ claim(f.id,`${w} formula`); if(!f.id.startsWith(pre+"f.")) E(`${w}: formula id ${f.id} should start with ${pre}f.`); if(!f.tex||!f.name) E(`${w}: formula ${f.id} needs name and tex`); refOK(f.ref,`${w}: formula ${f.id}`); if(f.added&&!isDate(f.added)) E(`${w}: formula ${f.id} added date`); if(f.blank && !(f.blank.tex && (f.blank.accept||[]).length)) E(`${w}: formula ${f.id} blank needs tex and accept[]`); });
  (L.glossary||[]).forEach(g=>{ claim(g.id,`${w} glossary`); if(!g.id.startsWith(pre+"t.")) E(`${w}: glossary id ${g.id} should start with ${pre}t.`); if(!g.term||!g.def) E(`${w}: glossary ${g.id} needs term and def`); });
  (L.gens||[]).forEach(g=>{ claim(g.id,`${w} generator`); if(!g.id.startsWith(pre+"g.")) E(`${w}: generator id ${g.id} should start with ${pre}g.`); if(typeof g.gen!=="function") E(`${w}: generator ${g.id} has no gen()`); if(!g.title) E(`${w}: generator ${g.id} needs a title`); refOK(g.ref,`${w}: generator ${g.id}`); });
  (L.exam||[]).forEach(x=>{ claim(x.id,`${w} exam`); if(!x.id.startsWith(pre+"q")) E(`${w}: exam id ${x.id} should start with ${pre}q`); if(!x.q||!Array.isArray(x.opts)||x.opts.length<2) E(`${w}: exam ${x.id} needs q and opts`); else if(!x.multi && !x.opts.some(o=>o[1])) E(`${w}: exam ${x.id} has no correct option`); else if(!x.multi && x.opts.filter(o=>o[1]).length>1) E(`${w}: exam ${x.id} has several correct options but is not multi`); });
  const figs=L.figures||{};
  let has3D=0;
  Object.keys(figs).forEach(k=>{ const f=figs[k]; claim(`${L.id}.m.${k}`,`${w} figure`);
    if(f.model){ has3D++; nModels++; const t=typeof f.model==="function"?null:f.model.type; if(t && !MODEL_TYPES.has(t)) E(`${w}: figure ${k} uses unknown model type ${t}`); if(!f.predict) E(`${w}: 3D figure ${k} needs a predict question`); }
    else if(typeof f.build!=="function") E(`${w}: figure ${k} needs build() or model`);
    if(!f.cap) W(`${w}: figure ${k} has no caption`);
    if(f.predict && (!f.predict.q || !(f.predict.opts||[]).some(o=>o[1]))) E(`${w}: figure ${k} predict needs q and a correct option`); });
  if(!Object.keys(figs).length) E(`${w}: needs at least one 3D model or interactive figure`);
  if(!(L.gens||[]).length) E(`${w}: needs at least one problem generator`);
  (L.steps||[]).forEach((s,i)=>{ const sw=`${w} step ${i+1}`;
    if(!["read","example","explore","mcq","try","formulas","firstline"].includes(s.type)) E(`${sw}: unknown type ${s.type}`);
    if(s.fig && !figs[s.fig]) E(`${sw}: figure "${s.fig}" not defined`);
    if(s.type==="explore" && !s.fig) E(`${sw}: explore steps need a fig`);
    if(s.type==="try" && !(L.gens||[]).some(g=>g.id===s.gen)) E(`${sw}: generator "${s.gen}" not in this chapter`);
    if(s.type==="mcq" && (!s.opts||(!s.multi && !s.opts.some(o=>o[1])))) E(`${sw}: mcq needs a correct option`);
    if(s.type==="firstline" && (!Array.isArray(s.lines)||s.wrong==null)) E(`${sw}: firstline needs lines[] and wrong`);
    if(s.type==="example" && (!s.ex||!s.ex.steps||!s.ex.steps.length)) E(`${sw}: example needs ex.steps`); });
  if(!(L.steps||[]).some(s=>s.type==="example")) W(`${w}: no worked example step`);
  (L.flags||[]).forEach(f=>{ if(!f.ref||!f.text) E(`${w}: flags need ref and text`); });
}
for(const u of C.modules) for(const l of u.chapters) if(!chIds.has(l) && !sched.has(l)) E(`module ${u.id}: chapter ${l} is not in the schedule`);
(M.extras.review||[]).forEach(r=>{ claim(r.id,`review ${r.src||""}`); if(r.lec && !chIds.has(r.lec)) W(`review ${r.id}: chapter ${r.lec} has no data file yet`); if(!r.q||!(r.a||r.opts)) E(`review ${r.id}: needs q and a`); if(r.opts && !r.multi && r.opts.filter(o=>o[1]).length!==1) E(`review ${r.id}: single-answer question needs exactly one correct option`); });
(M.extras.examples||[]).forEach(r=>{ claim(r.id,`example`); if(r.lec && !chIds.has(r.lec)) W(`example ${r.id}: chapter ${r.lec} has no data file yet`); if(!r.q||!r.sol) E(`example ${r.id}: needs q and sol`); });

warns.forEach(w=>console.log("  ! "+w));
if(errors.length){ console.error(`\n✗ ${errors.length} problem${errors.length>1?"s":""} found:`); errors.forEach(e=>console.error("  ✗ "+e)); process.exit(1); }
const count=k=>M.chapters.reduce((n,L)=>n+(L[k]||[]).length,0);
console.log(`✓ ${M.chapters.length} chapters · ${count("formulas")} formulas · ${count("gens")} generators · ${count("exam")} exam questions · ${nModels} 3D models · ${M.extras.review.length} practice questions · ${M.extras.examples.length} course-notes examples`);
if(checkOnly||ONLY) process.exit(0);

/* ---------- write studydata.js ---------- */
const stamp=new Date().toISOString();
let out=`/* GENERATED by build/build.js on ${stamp}. Do not edit: change the files in data/ and rebuild. */\n`;
out+=`window.C120=window.C120||{};C120.BUILT=${JSON.stringify(stamp)};\n`;
for(const [f,src] of sources){ out+=`\n/* ===== ${f} ===== */\n${src}\n`; }
fs.writeFileSync(D("assets/js/studydata.js"),out);
console.log(`✓ wrote assets/js/studydata.js (${(out.length/1024).toFixed(0)} KB)`);

/* ---------- pages from templates ---------- */
const tpl=n=>fs.readFileSync(D(`build/templates/${n}`),"utf8");
const head=tpl("head.html");
const unitT=tpl("module.html").replace("{{HEAD}}",head);
C.modules.filter(u=>u.chapters.some(id=>chIds.has(id))).forEach(u=>{ fs.writeFileSync(D(`module-${u.n}.html`), unitT.replace(/\{\{UNIT\}\}/g,u.id).replace(/\{\{N\}\}/g,u.n).replace(/\{\{TITLE\}\}/g,u.title)); });
console.log(`✓ wrote module pages`);
const quizT=tpl("quizpage.html").replace("{{HEAD}}",head);
C.assessments.filter(q=>q.chapters.some(id=>chIds.has(id))).forEach(q=>fs.writeFileSync(D(`quiz-${q.id.toLowerCase()}.html`), quizT.replace(/\{\{QUIZ\}\}/g,q.id).replace(/\{\{LABEL\}\}/g,M.assessLabel(q))));
console.log(`✓ wrote quiz pages`);
for(const pg of ["index","formulas","gym","quiz","midterm"]){ const f=`build/templates/${pg}.html`; if(fs.existsSync(D(f))) fs.writeFileSync(D(`${pg}.html`), tpl(`${pg}.html`).replace("{{HEAD}}",head)); }
console.log(`✓ wrote top-level pages`);
