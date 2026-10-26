/* CHEM 120 Interactive: core utilities shared by every page.
   - C120.chapter({...}) registers a chapter data file (data/M2C6.js)
   - storage with a versioned key and migrations (progress survives updates, and the old Module 2 site's progress carries over)
   - seeded random numbers so any generated problem can be recreated from its seed
   - text rendering: "$...$" and "$$...$$" become KaTeX, and \ce{...} inside them is chemistry (mhchem) */
(function(){
"use strict";
const M = window.C120 = window.C120 || {};
M.chapters = M.chapters || [];
M.chapter = function(L){ M.chapters.push(L); };
M.extras = M.extras || {review:[],examples:[],changelog:[]};
M.addReview = list => { M.extras.review.push(...list); };
M.addExamples = list => { M.extras.examples.push(...list); };

/* ---------- storage ---------- */
const STORE_KEY = "c120.v1";           // bump to c120.v2 and add a migration below when the shape changes
const MIGRATIONS = {                   // from-version -> function(old) returning the next version
  // 1: d => ({...d, schema:2})
};
const SCHEMA = 1;
function blank(){ return {schema:SCHEMA, ch:{}, stats:{}, leitner:{}, exam:{}, review:{}, mistakes:[], seen:{}, prefs:{}, predict:{}, legacy:null, created:Date.now()}; }
let DB = null;
function rawGet(k){ try{ const v=localStorage.getItem(k); return v==null?null:JSON.parse(v); }catch(e){ return null; } }
function rawSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } }
/* The first version of this site (Module 2 only) saved lesson progress under chem120.m2.*.
   Its lessons map onto the new Module 2 chapters. A chapter is marked done when every old lesson inside it was done.
   The old flashcards were different cards, so their boxes are kept under db.legacy instead of being thrown away. */
const OLD_LESSONS = {"2.1":["M2C1"],"2.2":["M2C1"],"2.3":["M2C2","M2C3"],"2.4":["M2C3"],"2.5":["M2C4"],"2.6":["M2C4"],"2.7":["M2C5"],"2.8":["M2C6","M2C7"],"2.9":["M2C8"],"2.10":["M2C8"]};
function fromOldSite(d){
  const prog = rawGet("chem120.m2.progress"), deck = rawGet("chem120.m2.deck"), tasks = rawGet("chem120.m2.tasks");
  if(!prog && !deck) return d;
  const done = (prog && prog.done) || {};
  const per = {};
  Object.entries(OLD_LESSONS).forEach(([old,chs])=>chs.forEach(c=>{ (per[c]=per[c]||[]).push(!!done[old]); }));
  Object.entries(per).forEach(([c,arr])=>{ if(arr.length && arr.every(Boolean)) d.ch[c] = {done:true,best:null,last:null,fromOldSite:true}; });
  d.legacy = {from:"chem120.m2", when:Date.now(), progress:prog||null, deck:deck||null, tasks:tasks||null};
  return d;
}
function load(){
  if(DB) return DB;
  let d = rawGet(STORE_KEY);
  let fresh = false;
  if(!d || typeof d!=="object"){ d = blank(); fresh = true; }
  while((d.schema||1) < SCHEMA && MIGRATIONS[d.schema||1]){ d = MIGRATIONS[d.schema||1](d); }
  DB = Object.assign(blank(), d, {schema:SCHEMA});
  if(fresh){ DB = fromOldSite(DB); rawSet(STORE_KEY, DB); }
  return DB;
}
M.db = () => load();
M.save = () => { rawSet(STORE_KEY, load()); };
M.resetAll = () => { DB = blank(); M.save(); };
M.exportData = () => JSON.stringify(load());
M.importData = s => { const d=JSON.parse(s); if(d && typeof d==="object"){ DB=null; rawSet(STORE_KEY,d); load(); M.save(); return true; } return false; };

/* stats per problem generator (gid) */
M.recordAttempt = function(gid, ok, first){
  const db=load(); const s = db.stats[gid] || (db.stats[gid]={right:0,total:0,fr:0,ft:0,last:0});
  s.total++; if(ok) s.right++; if(first){ s.ft++; if(ok) s.fr++; } s.last=Date.now(); M.save();
};
M.logMistake = function(entry){
  const db=load(); db.mistakes = db.mistakes.filter(m=>!((m.gid && m.gid===entry.gid && m.seed===entry.seed) || (m.mc && m.mc===entry.mc)));
  db.mistakes.unshift({...entry, when:Date.now(), fixed:false}); db.mistakes = db.mistakes.slice(0,300); M.save();
};
M.fixMistake = function(gid, seed){ const db=load(); const m=db.mistakes.find(x=>x.gid===gid && x.seed===seed); if(m){ m.fixed=true; m.fixedAt=Date.now(); M.save(); } };
M.chState = id => { const db=load(); return db.ch[id] || (db.ch[id]={done:false,best:null,last:null}); };

/* ---------- random ---------- */
M.rng = function(seed){
  let s = (seed>>>0) || 0x9e3779b9;
  const next = () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14)>>>0) / 4294967296; };
  const R = () => next();
  R.int = (a,b) => a + Math.floor(next()*(b-a+1));
  R.nz = (a,b) => { let v=0; while(v===0) v=R.int(a,b); return v; };
  R.pick = arr => arr[Math.floor(next()*arr.length)];
  R.sign = () => next()<0.5?-1:1;
  R.shuffle = arr => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(next()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  R.real = (a,b,dp=2) => +(a + next()*(b-a)).toFixed(dp);
  /* a measured value with exactly `sf` significant figures between a and b, e.g. R.sig(1,9,3) -> 4.27 */
  R.sig = (a,b,sf=3) => +M.toSig(a + next()*(b-a), sf);
  R.seed = seed;
  return R;
};
M.newSeed = () => (Math.random()*2**31)>>>0;

/* ---------- text and math ---------- */
const esc = M.esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
M.tex = function(t, display=false){
  if(window.katex){ try{ return katex.renderToString(t,{displayMode:display,throwOnError:false,strict:"ignore",trust:false}); }catch(e){} }
  return `<code class="tex">${esc(t)}</code>`;
};
/* chemistry shorthand: M.ce("SO4^2-") renders the formula with mhchem */
M.ce = (t, display=false) => M.tex(`\\ce{${t}}`, display);
/* rich(): turns $..$ and $$..$$ into KaTeX. Text outside math is trusted HTML written by the site author. */
M.rich = function(s){
  if(s==null) return "";
  s = String(s);
  let out="", i=0;
  while(i<s.length){
    if(s[i]==="\\" && s[i+1]==="$"){ out+="$"; i+=2; continue; }
    if(s[i]==="$"){
      const disp = s[i+1]==="$"; const open = disp?2:1;
      const close = s.indexOf(disp?"$$":"$", i+open);
      if(close<0){ out+=s.slice(i); break; }
      out += M.tex(s.slice(i+open, close), disp); i = close+open; continue;
    }
    out += s[i]; i++;
  }
  return out;
};
/* el(tag, attrs, ...children) */
M.el = function(tag, attrs={}, ...kids){
  const e=document.createElement(tag);
  for(const k in attrs){ const v=attrs[k]; if(v==null||v===false) continue;
    if(k==="html") e.innerHTML=v; else if(k==="rich") e.innerHTML=M.rich(v); else if(k.startsWith("on")) e.addEventListener(k.slice(2),v); else if(k==="style"&&typeof v==="object") Object.assign(e.style,v); else e.setAttribute(k,v===true?"":v); }
  kids.flat().forEach(c=>{ if(c==null||c===false) return; e.append(c.nodeType?c:document.createTextNode(String(c))); });
  return e;
};
M.$ = (s,r=document)=>r.querySelector(s);
M.$$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
M.shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
M.reduceMotion = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

/* ---------- numbers for chemistry generators ---------- */
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }
M.gcd = gcd;
/* round to sf significant figures and return a plain string (never "1e-7" style) */
M.toSig = function(v, sf=3){
  if(!isFinite(v)) return String(v);
  if(v===0) return sf>1?"0."+"0".repeat(sf-1):"0";
  const e=Math.floor(Math.log10(Math.abs(v)));
  const dp=sf-1-e;
  const r=Math.round(v*Math.pow(10,dp))/Math.pow(10,dp);
  if(dp>0) return r.toFixed(Math.min(dp,20));
  return String(Math.round(r));
};
/* scientific notation parts: M.sci(0.000123,3) -> {m:"1.23", e:-4} */
M.sci = function(v, sf=3){
  if(v===0) return {m:M.toSig(0,sf), e:0};
  let e=Math.floor(Math.log10(Math.abs(v)));
  let m=v/Math.pow(10,e);
  let ms=m.toFixed(sf-1);
  if(Math.abs(+ms)>=10){ e+=1; ms=(v/Math.pow(10,e)).toFixed(sf-1); }
  return {m:ms, e};
};
/* LaTeX for a number: plain when 0.01 <= |v| < 10000, otherwise a x 10^n */
M.numTeX = function(v, sf=3, opt={}){
  const a=Math.abs(v);
  if(!opt.sci && (a===0 || (a>=0.01 && a<1e4))) return M.toSig(v,sf).replace("-","-");
  const {m,e}=M.sci(v,sf);
  return `${m}\\times10^{${e}}`;
};
/* the same number as a student would type it: 6.02e23 */
M.numTyped = function(v, sf=3){
  const a=Math.abs(v);
  if(a===0 || (a>=0.01 && a<1e4)) return M.toSig(v,sf);
  const {m,e}=M.sci(v,sf); return `${m}e${e}`;
};
/* unit LaTeX: "kJ/mol" -> \mathrm{kJ\,mol^{-1}} (simple forms the site uses) */
M.unitTeX = function(u){
  if(!u) return "";
  const map={"kJ/mol":"kJ\\,mol^{-1}","J/mol":"J\\,mol^{-1}","g/mol":"g\\,mol^{-1}","m/s":"m\\,s^{-1}","s^-1":"s^{-1}","mol/L":"mol\\,L^{-1}","J/photon":"J\\,photon^{-1}","kg m/s":"kg\\,m\\,s^{-1}","J s":"J\\,s","mol^-1":"mol^{-1}"};
  const t=map[u]||u.replace(/\^(-?\d+)/g,"^{$1}").replace(/\s+/g,"\\,");
  return `\\mathrm{${t.replace(/μ/g,"\\mu ").replace(/Å/g,"\\mathring{A}")}}`;
};
M.qty = (v, sf, u, opt) => `${M.numTeX(v,sf,opt)}${u?"\\ "+M.unitTeX(u):""}`;
M.frac = function(n,d=1){ if(d<0){ n=-n; d=-d; } const g=gcd(n,d); n/=g; d/=g; if(d===1) return String(n); return (n<0?"-":"")+`\\frac{${Math.abs(n)}}{${d}}`; };
M.num = (v,dp=4) => { if(Math.abs(v-Math.round(v))<1e-10) return String(Math.round(v)); return String(+v.toFixed(dp)); };

/* ---------- dates ---------- */
M.today = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),d.getDate()); };
M.parseDate = s => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };
M.fmtDate = (s,opt={month:"short",day:"numeric"}) => M.parseDate(s).toLocaleDateString("en-CA",opt);
M.LAUNCH = "2026-10-26";
M.recent = (s, days=7) => { if(!s) return false; const d=M.parseDate(s); const age=(M.today()-d)/864e5; return age < days && age > -1; };
/* "new this week": a chapter taught in the last 7 days, or anything added to the site in the last 7 days after launch */
M.isNew = (added, classDate) => M.recent(classDate) || (added && added>M.LAUNCH && M.recent(added));
M.upcoming = ch => ch && ch.date && M.parseDate(ch.date) > M.today();

/* ---------- lookups (filled once studydata is present) ---------- */
M.chap = id => M.chapters.find(l=>l.id===id);
M.lec = M.chap;                                   // older name, used by shared widgets
M.mod = id => (M.COURSE&&M.COURSE.modules||[]).find(u=>u.id===id);
M.unit = M.mod;
M.modOf = cid => { const L=M.chap(cid); return L?M.mod(L.module):null; };
M.gen = gid => { for(const L of M.chapters){ const g=(L.gens||[]).find(x=>x.id===gid); if(g) return {...g, lecture:L.id, chapter:L.id}; } return null; };
M.formula = fid => { for(const L of M.chapters){ const f=(L.formulas||[]).find(x=>x.id===fid); if(f) return {...f, chapter:L.id}; } return null; };
M.chURL = (cid, step) => { const L=M.chap(cid); if(!L) return "#"; const u=M.mod(L.module); return `module-${u.n}.html#${cid}${step!=null?"."+step:""}`; };
M.lecURL = M.chURL;
M.chLabel = cid => { const L=M.chap(cid); return L?`${L.num} ${L.title.replace(/\$[^$]*\$/g,"")}`:cid; };
M.refText = (cid, ref) => { const L=M.chap(cid); const n=L?M.mod(L.module).n:"?"; return `Module ${n}${ref?", "+ref:""}`; };
M.assess = id => (M.COURSE&&M.COURSE.assessments||[]).find(a=>a.id===id);
M.firstTest = cid => (M.COURSE.assessments||[]).find(a=>a.chapters.includes(cid));
M.assessLabel = a => a ? (a.kind==="pc"?`PC ${a.n}`:a.kind==="test"?`Test ${a.n}`:a.kind==="final"?"Final exam":a.id) : "";

/* ---------- theme toggle + nav ---------- */
M.theme = function(){
  const saved = rawGet("c120.theme");
  if(saved==="dark"||saved==="light") document.documentElement.setAttribute("data-theme",saved);
};
M.isDark = () => { const t=document.documentElement.getAttribute("data-theme"); return t? t==="dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); };
M.toggleTheme = function(){
  const nx = M.isDark()?"light":"dark"; document.documentElement.setAttribute("data-theme",nx); rawSet("c120.theme",nx);
  document.dispatchEvent(new CustomEvent("c120-theme"));
};
if(window.matchMedia){ try{ matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>document.dispatchEvent(new CustomEvent("c120-theme"))); }catch(e){} }
M.theme();
/* logo: a nucleus with two electron orbits, drawn like a textbook figure */
M.LOGO = `<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><ellipse cx="15" cy="15" rx="13" ry="5.2" fill="none" stroke="var(--accent)" stroke-width="1.3" transform="rotate(-30 15 15)"/><ellipse cx="15" cy="15" rx="13" ry="5.2" fill="none" stroke="var(--accent)" stroke-width="1.3" transform="rotate(30 15 15)" opacity=".75"/><circle cx="15" cy="15" r="3.1" fill="var(--accent)"/><circle cx="25.2" cy="9.1" r="1.9" fill="var(--paper)" stroke="var(--accent)" stroke-width="1.3"/></svg>`;
M.nav = function(current){
  const items=[["index.html#modules","Modules","modules"],["formulas.html","Formulas","formulas"],["gym.html","Practice gym","gym"],["quiz.html","Quiz prep","quiz"],["midterm.html","Test 2 prep","midterm"]];
  const h=document.createElement("header"); h.className="nav";
  h.innerHTML=`<div class="wrap"><a class="logo" href="index.html">${M.LOGO}<span>CHEM 120 Interactive</span></a><nav aria-label="Site">${items.map(([href,t,k])=>`<a href="${href}"${k===current?' aria-current="page"':""}>${t}</a>`).join("")}<button type="button" onclick="window.GUIDE&&GUIDE.open()">Ask Ev</button><button type="button" class="themebtn" aria-label="Switch light or dark mode" title="Light or dark" onclick="C120.toggleTheme()"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 2.5 A7.5 7.5 0 0 1 10 17.5 Z" fill="currentColor"/></svg></button></nav></div>`;
  document.body.prepend(h);
};
M.footer = function(extra=""){
  const f=document.createElement("footer"); f.className="wrap foot";
  f.innerHTML=`An independent study aid for CHEM 120 at the University of Waterloo, built by Manaal Lakhani with help from Claude. It is not an official University of Waterloo resource; check everything against your course notes and LEARN. Explanations, figures and problems are written for this site; formulas, constants and rules follow the Fall 2026 CHEM 120/121 course notes and data sheet, cited by module and page. Values marked "not from the notes" come from standard references. Progress is saved only in this browser. ${extra}`;
  document.body.append(f);
};
})();
