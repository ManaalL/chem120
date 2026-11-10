#!/usr/bin/env node
/* Drill test: runs every Test 2 drill generator many times.
   Fails on: no question, fewer than 4 options, repeated option text, not exactly one correct answer (single-answer drills),
   NaN / undefined / [object in any text, and TeX that KaTeX + mhchem can't render.
   Usage: node tests/drills.js [seeds=2000] */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,".."); const N=+process.argv[2]||2000;
let katex=null; for(const base of [null,"/home/claude/work/node_modules"]){ try{ const opt=base?{paths:[base]}:undefined; katex=require(require.resolve("katex",opt)); require(require.resolve("katex/contrib/mhchem",opt)); break; }catch(e){ katex=null; } }
const ctx={console,Math,Date,JSON}; ctx.window=ctx; vm.createContext(ctx);
for(const f of ["assets/js/core.js","assets/js/chemcheck.js","assets/js/chemlib.js","assets/js/studydata.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8").replace(/M\.theme\(\);/,"").replace(/if\(window\.matchMedia\)\{[^\n]*\n/,""),ctx);
const M=ctx.C120; const fails=[]; const F=(w,m)=>{ if(fails.length<60) fails.push(`${w}: ${m}`); };
const texOK=(s,w)=>{ if(!katex) return; s=String(s); const re=/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g; let m; while((m=re.exec(s))){ try{ katex.renderToString(m[1]||m[2],{throwOnError:true,strict:"ignore"}); }catch(e){ F(w,"TeX: "+e.message.slice(0,80)+" in "+(m[1]||m[2]).slice(0,60)); } } };
const D=M.extras.drills||[]; let total=0;
for(const d of D){ let nulls=0; if(!M.chap(d.lec)) F(d.id,"chapter "+d.lec+" missing"); texOK(d.how,d.id+" how");
  for(let k=1;k<=N;k++){ let q; try{ q=d.gen(M.rng(k*2654435761>>>0)); }catch(e){ F(`${d.id} seed ${k}`,"threw "+e.message); continue; }
    if(!q){ nulls++; continue; } total++; const w=`${d.id} seed ${k}`;
    const all=[q.q,...q.opts.flat()].join(" | "); if(/undefined|NaN|\[object|Infinity/.test(all)) F(w,"bad text: "+all.slice(0,160));
    if(q.opts.length<4) F(w,`only ${q.opts.length} options`);
    if(new Set(q.opts.map(o=>o[0])).size!==q.opts.length) F(w,"repeated option text");
    const nc=q.opts.filter(o=>o[1]).length; if(!q.multi && nc!==1) F(w,`${nc} correct options`);
    if(k<=200){ texOK(q.q,w); q.opts.forEach(o=>{ texOK(o[0],w); texOK(o[2],w); }); } }
  if(nulls>N*0.05) F(d.id,`${nulls} of ${N} seeds made no question`); }
console.log(`${D.length} drills, ${total} questions checked`);
if(fails.length){ console.log(fails.join("\n")); console.log("✗ drill test failed"); process.exit(1); } else console.log("✓ drill test passes");
