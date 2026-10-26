#!/usr/bin/env node
/* Copy check: generates thousands of problems from every generator, plus every exam, sample-test and example question,
   and compares them with the real assignment and test questions so nothing on the public site comes out identical or near-identical.
   The real questions are NOT in this repo: point REAL_DIR at the private transcription notes (assignments.md, tests.md).
   A match is flagged when the wording is very similar (word 3-gram overlap) AND the same numbers appear, or when the normalised text is equal.
   Usage: REAL_DIR=/home/claude/work/notes node tests/dupes.js [seedsPerDifficulty=500] */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,".."); const REAL=process.env.REAL_DIR||"/home/claude/work/notes";
const N=+process.argv[2]||500;
const ctx={console,Math,Date,JSON}; ctx.window=ctx; vm.createContext(ctx);
for(const f of ["assets/js/core.js","assets/js/chemcheck.js","assets/js/chemlib.js","assets/js/studydata.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8").replace(/M\.theme\(\);/,"").replace(/if\(window\.matchMedia\)\{[^\n]*\n/,""),ctx);
const M=ctx.C120;
/* real questions: the quoted **Text:** blocks under "## A2 Q1" / "## T1 Q3" headings */
const real=[];
for(const f of ["assignments.md","tests.md"]){ const p=path.join(REAL,f); if(!fs.existsSync(p)){ console.log("missing "+p+" (set REAL_DIR)"); process.exit(2); }
  const txt=fs.readFileSync(p,"utf8"); const parts=txt.split(/\n## (?=[AT]\d+ Q\d+)/);
  parts.slice(1).forEach(s=>{ const id=s.split("\n")[0].trim(); let body=s.split(/\*\*(?:Format|Submitted|My answer|Maps to|Answer)/)[0]; body=body.replace(/^.*\n/,""); real.push({id,text:body}); }); }
const SUB={"₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9","⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁻":"-","⁺":"+","−":"-","×":"x"};
const norm=s=>String(s).replace(/<[^>]+>/g," ").replace(/\\ce\{([^}]*)\}/g,"$1").replace(/\\(times|cdot)/g,"x").replace(/\\[a-zA-Z]+/g," ").replace(/[₀-₉⁰-⁹⁻⁺−×]/g,c=>SUB[c]||c).replace(/[{}$^_\\]/g,"").toLowerCase().replace(/[^a-z0-9.+\- ]+/g," ").replace(/\s+/g," ").trim();
const nums=s=>new Set((norm(s).match(/\d+(\.\d+)?/g)||[]).filter(x=>x.length>1||+x>9));
const grams=s=>{ const w=norm(s).split(" ").filter(x=>x.length>2); const g=new Set(); for(let i=0;i+2<w.length;i++) g.add(w.slice(i,i+3).join(" ")); return g; };
const R=real.map(r=>({...r,n:norm(r.text),g:grams(r.text),num:nums(r.text)}));
const jac=(a,b)=>{ if(!a.size||!b.size) return 0; let k=0; a.forEach(x=>{ if(b.has(x)) k++; }); return k/Math.min(a.size,b.size); };
const flags=[]; let checked=0;
function test(text,where){
  checked++; const n=norm(text); if(n.length<25) return; const g=grams(text), num=nums(text);
  for(const r of R){
    if(n===r.n){ flags.push(`${where} is identical to ${r.id}`); return; }
    const sim=jac(g,r.g); if(sim<0.5) continue;
    let same=0; num.forEach(x=>{ if(r.num.has(x)) same++; });
    if(sim>=0.8 || (sim>=0.5 && same>=2)) { flags.push(`${where} looks like ${r.id} (wording overlap ${(sim*100).toFixed(0)}%, ${same} shared numbers): "${n.slice(0,110)}"`); return; }
  }
}
for(const L of M.chapters){
  (L.exam||[]).forEach(q=>test(q.q+" "+q.opts.map(o=>o[0]).join(" "),q.id));
  (L.steps||[]).forEach((s,i)=>{ if(s.q) test(s.q+" "+(s.opts||[]).map(o=>o[0]).join(" "),`${L.id} step ${i+1}`); if(s.ex) test(s.ex.q,`${L.id} example step ${i+1}`); });
  for(const g of L.gens||[]) for(const d of [1,2,3]) for(let s=1;s<=N;s++){ let p; try{ p=g.gen(M.rng(s*104729+d),d); }catch(e){ continue; }
    const parts=p.parts||[{answer:p.answer}]; const opt=parts.map(x=>(x.answer.options||[]).join(" ")).join(" ");
    test(p.prompt+" "+opt,`${g.id} d${d} seed ${s}`); if(flags.length>200) break; }
}
(M.extras.review||[]).forEach(r=>test(r.q+" "+(r.opts||[]).map(o=>o[0]).join(" "),r.id));
(M.extras.examples||[]).forEach(r=>test(r.q,r.id));
if(process.env.SELFTEST){ const before=flags.length; test(real[9].text.replace(/6.0/,"6.0"),"selftest-exact"); test(real[9].text.replace("Nitrous oxide","Dinitrogen monoxide"),"selftest-edited"); console.log("self test flagged",flags.length-before,"of 2"); flags.length=before; }
console.log(`${real.length} real questions, ${checked} site questions checked`);
const uniq=[...new Set(flags.map(f=>f.replace(/ seed \d+/,"")))];
if(uniq.length){ console.log(`✗ ${uniq.length} too close:`); uniq.slice(0,60).forEach(f=>console.log("  ✗ "+f)); process.exit(1); }
console.log("✓ nothing on the site matches a real assignment or test question");
