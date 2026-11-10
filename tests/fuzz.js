#!/usr/bin/env node
/* Fuzz test for every problem generator and every piece of TeX on the site.
   - runs each generator at each difficulty with many seeds
   - fails on NaN, undefined, [object, Infinity, empty prompts or answers
   - types the stored answer the way a student would and checks that the checker marks it right
   - checks that a clearly wrong answer is marked wrong
   - if a problem has verify:{value}, checks the stored number against it independently
   - renders every $...$ with KaTeX + mhchem (throwOnError) to catch broken TeX
   Usage: node tests/fuzz.js [seedsPerDifficulty=300] [--lec M2C6,M2C7]   (needs katex@0.16.9 in /home/claude/work/node_modules or NODE_PATH) */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..");
let katex=null; for(const base of [null,"/home/claude/work/node_modules"]){ try{ const opt=base?{paths:[base]}:undefined; katex=require(require.resolve("katex",opt)); require(require.resolve("katex/contrib/mhchem",opt)); break; }catch(e){ katex=null; } }
if(!katex) console.log("katex not installed; skipping TeX checks");
const N=+process.argv[2]||300;
const ctx={console,Math,Date,JSON}; ctx.window=ctx; ctx.globalThis=ctx; vm.createContext(ctx);
const load=f=>vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8").replace(/M\.theme\(\);/,"").replace(/if\(window\.matchMedia\)\{[^\n]*\n/,""),ctx,{filename:f});
load("assets/js/core.js"); load("assets/js/chemcheck.js"); load("assets/js/chemlib.js");
const li=process.argv.indexOf("--lec");
if(li>0){ load("data/course.js"); process.argv[li+1].split(",").forEach(id=>load(fs.existsSync(path.join(ROOT,`data/${id}.js`))?`data/${id}.js`:`data/_${id}.js`)); } else load("assets/js/studydata.js");
const M=ctx.C120, MC=ctx.MC;
const fails=[]; let nProb=0, nTex=0, nVer=0;
const F=(w,m)=>{ if(fails.length<400) fails.push(`${w}: ${m}`); };
function texCheck(s,w){
  if(!katex||s==null) return; s=String(s); let i=0;
  while(i<s.length){
    if(s[i]==="\\"&&s[i+1]==="$"){ i+=2; continue; }
    if(s[i]==="$"){ const d=s[i+1]==="$", o=d?2:1; const c=s.indexOf(d?"$$":"$",i+o); if(c<0){ F(w,`unclosed $ in: ${s.slice(i,i+60)}`); return; }
      const t=s.slice(i+o,c); nTex++; try{ katex.renderToString(t,{displayMode:d,throwOnError:true,strict:"ignore"}); }catch(e){ F(w,`TeX error "${e.message.slice(0,90)}" in $${t.slice(0,80)}$`); } i=c+o; continue; }
    i++;
  }
}
const bad=s=>/undefined|NaN|\[object|Infinity|function\s*\(/.test(String(s));
/* what a careful student would type for a stored answer */
function typed(a){
  const t=a.type||"num";
  if(t==="num"){ const v=MC.fmtSig(+a.value,a.sf||4); return a.unit?`${v} ${a.unit}`:v; }
  if(t==="int") return String(a.value);
  if(t==="formula"||t==="equation"||t==="config"||t==="orbital") return Array.isArray(a.answer)?a.answer[0]:a.answer;
  if(t==="qset"){ if(a.answer){ const w=a.answer; return `(${w[0]}, ${w[1]}, ${w[2]}${w[3]!=null?", "+(w[3]>0?"+1/2":"-1/2"):""})`; } return a.sample||null; }
  if(t==="list") return a.answer.join(", ");
  if(t==="text") return a.accept[0];
  return null;
}
function wrong(a){
  const t=a.type||"num";
  if(t==="num"){ const v=MC.fmtSig(+a.value*1.37+(a.value===0?1:0),a.sf||4); return a.unit?`${v} ${a.unit}`:v; }
  if(t==="int") return String(+a.value+1);
  if(t==="list") return a.answer.map((x,i)=>i===0?x+1:x).join(", ");
  if(t==="text") return "zzzz";
  return null;
}
function checkPart(a,w){
  const t=a.type||"num";
  if(t==="mc"){ if(!Array.isArray(a.options)||a.correct==null||a.correct<0||a.correct>=a.options.length) F(w,"mc correct index out of range"); a.options.forEach(o=>{ if(bad(o)) F(w,`bad option text ${o}`); texCheck(o,w); }); if(new Set(a.options.map(String)).size!==a.options.length) F(w,`duplicate mc options: ${a.options.join(" | ")}`); return; }
  if(t==="multi"){ if(!Array.isArray(a.correct)||a.correct.some(i=>i<0||i>=a.options.length)) F(w,"multi correct out of range"); a.options.forEach(o=>texCheck(o,w)); if(new Set(a.options.map(String)).size!==a.options.length) F(w,`duplicate options`); return; }
  if(t==="firstline"){ if(a.wrong<-1||a.wrong>=a.lines.length) F(w,"firstline wrong index out of range"); a.lines.forEach(l=>texCheck(l,w)); return; }
  if(t==="num"&&(!isFinite(+a.value))) return F(w,`answer value not finite: ${a.value}`);
  if(t==="num"&&a.unit){ const u=MC.parseUnit(a.unit); if(u.error) F(w,`bad unit "${a.unit}": ${u.error}`); }
  const s=typed(a); if(s==null){ if(t!=="qset") F(w,`can't type answer type ${t}`); return; }
  const r=MC.check(s,a); if(!r.ok) F(w,`stored answer "${s}" is not accepted (${r.why||"?"})`);
  const x=wrong(a); if(x!=null){ const r2=MC.check(x,a); if(r2.ok) F(w,`wrong answer "${x}" accepted`); }
}
const only=process.argv.includes("--lec")?process.argv[li+1].split(","):null;
for(const L of M.chapters){
  if(only && !only.includes(L.id)) continue;
  /* every bit of TeX in the static content */
  const walk=(o,w)=>{ if(o==null) return; if(typeof o==="string"){ texCheck(o,w); if(bad(o)) F(w,`bad text ${o.slice(0,60)}`); return; } if(typeof o==="function") return; if(Array.isArray(o)) return o.forEach((x,i)=>walk(x,w)); if(typeof o==="object") for(const k in o){ if(k==="gen"||k==="build"||k==="model") continue; walk(o[k],`${w}.${k}`); } };
  walk({summary:L.summary,flags:L.flags,formulas:L.formulas,glossary:L.glossary,exam:L.exam,steps:L.steps},L.id);
  Object.entries(L.figures||{}).forEach(([k,f])=>walk({cap:f.cap,predict:f.predict,title:f.title},`${L.id}.fig.${k}`));
  (L.formulas||[]).forEach(f=>{ texCheck(`$${f.tex}$`,f.id); if(f.blank) texCheck(`$${f.blank.tex}$`,f.id+" blank"); });
  for(const g of L.gens||[]){
    for(const d of [1,2,3]) for(let s=1;s<=N;s++){
      const w=`${g.id} d${d} seed ${s}`; let p;
      try{ p=g.gen(M.rng(s*7919+d),d); }catch(e){ F(w,`threw ${e.message}`); continue; }
      nProb++;
      if(!p||!p.prompt) { F(w,"empty prompt"); continue; }
      const parts=p.parts||(p.answer?[{answer:p.answer}]:[]); if(!parts.length){ F(w,"no answer"); continue; }
      for(const k of ["prompt","hint","answerTeX"]){ if(p[k]!=null){ if(bad(p[k])) F(w,`${k} contains bad text: ${String(p[k]).slice(0,100)}`); texCheck(p[k],`${w} ${k}`); } }
      (p.steps||[]).forEach((st,i)=>{ if(bad(st)) F(w,`step ${i+1} bad text: ${String(st).slice(0,80)}`); texCheck(st,`${w} step ${i+1}`); });
      parts.forEach((pt,i)=>{ if(pt.label){ texCheck(pt.label,w); if(bad(pt.label)) F(w,"bad label"); } checkPart(pt.answer,`${w} part ${i+1}`); });
      if(p.verify && p.verify.value!=null){ nVer++; const a=parts[0].answer; const v=+a.value, t=+p.verify.value; if(Math.abs(v-t)>1e-6*Math.max(1e-300,Math.abs(t))+ (Math.abs(t)<1e-12?1e-15:0)) F(w,`verify failed: stored ${v}, independent ${t}`); }
      if(p.verify && p.verify.values){ nVer++; parts.forEach((pt,i)=>{ const t=p.verify.values[i]; if(t==null) return; const v=+pt.answer.value; if(Math.abs(v-t)>1e-6*Math.abs(t)) F(w,`verify part ${i+1} failed: stored ${v}, independent ${t}`); }); }
    }
  }
}
(M.extras.review||[]).forEach(r=>{ texCheck(r.q,r.id); (r.opts||[]).forEach(o=>{ texCheck(o[0],r.id); texCheck(o[2],r.id); }); (r.steps||[]).forEach(s=>texCheck(s,r.id)); });
(M.extras.examples||[]).forEach(r=>{ texCheck(r.q,r.id); (r.sol||[]).forEach(s=>texCheck(s,r.id)); texCheck(r.ans,r.id); });
console.log(`${nProb} generated problems, ${nVer} independent checks, ${nTex} TeX snippets`);
if(fails.length){ console.log(`✗ ${fails.length} problems:`); fails.slice(0,80).forEach(f=>console.log("  ✗ "+f)); process.exit(1); }
console.log("✓ fuzz clean");
