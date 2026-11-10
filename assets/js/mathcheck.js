/* MATH 127 Interactive: answer parsing and checking.
   parse(str) -> AST, evaluate(ast, vars), toTeX(ast), and check(userStr, spec).
   Equivalent forms are accepted by evaluating both expressions at several random points.
   Works in the browser (window.MC) and in Node (module.exports) for tests. */
(function(root){
"use strict";

const FUNCS = {
  sin:Math.sin, cos:Math.cos, tan:Math.tan,
  sec:x=>1/Math.cos(x), csc:x=>1/Math.sin(x), cot:x=>Math.cos(x)/Math.sin(x),
  arcsin:Math.asin, arccos:Math.acos, arctan:Math.atan,
  arcsec:x=>Math.acos(1/x), arccsc:x=>Math.asin(1/x), arccot:x=>(x===0?Math.PI/2:Math.atan(1/x)+(x<0?Math.PI:0)),
  ln:x=>Math.log(x), log:x=>Math.log10(x), exp:Math.exp, sqrt:Math.sqrt, abs:Math.abs,
  sinh:Math.sinh, cosh:Math.cosh, tanh:Math.tanh
};
const ALIAS = {asin:"arcsin",acos:"arccos",atan:"arctan",arcsine:"arcsin",arccosine:"arccos",arctangent:"arctan",absval:"abs",sgn:null};
const FUNC_NAMES = Object.keys(FUNCS).concat(Object.keys(ALIAS)).sort((a,b)=>b.length-a.length);
const GREEK = {pi:"\\pi",theta:"\\theta",alpha:"\\alpha",beta:"\\beta",lambda:"\\lambda",omega:"\\omega",phi:"\\phi",mu:"\\mu",sigma:"\\sigma",tau:"\\tau",delta:"\\delta",Delta:"\\Delta"};
const TEXFN = {sin:"\\sin",cos:"\\cos",tan:"\\tan",sec:"\\sec",csc:"\\csc",cot:"\\cot",arcsin:"\\arcsin",arccos:"\\arccos",arctan:"\\arctan",arcsec:"\\operatorname{arcsec}",arccsc:"\\operatorname{arccsc}",arccot:"\\operatorname{arccot}",ln:"\\ln",log:"\\log",exp:"\\exp",sinh:"\\sinh",cosh:"\\cosh",tanh:"\\tanh"};

function fact(n){
  if(!isFinite(n)) return NaN;
  if(n<0) return NaN;
  if(Math.abs(n-Math.round(n))<1e-9){ n=Math.round(n); if(n>170) return Infinity; let r=1; for(let i=2;i<=n;i++) r*=i; return r; }
  return gamma(n+1);
}
function gamma(z){ // Lanczos
  if(z<0.5) return Math.PI/(Math.sin(Math.PI*z)*gamma(1-z));
  z-=1; const g=7, c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  let x=c[0]; for(let i=1;i<g+2;i++) x+=c[i]/(z+i); const t=z+g+0.5;
  return Math.sqrt(2*Math.PI)*Math.pow(t,z+0.5)*Math.exp(-t)*x;
}

/* ---------- tokenizer ---------- */
function normalize(s){
  return String(s)
    .replace(/[−–—]/g,"-").replace(/[×⋅·]/g,"*").replace(/÷/g,"/")
    .replace(/π/g,"pi").replace(/θ/g,"theta").replace(/∞/g,"inf").replace(/√/g,"sqrt")
    .replace(/²/g,"^2").replace(/³/g,"^3").replace(/≤/g,"<=").replace(/≥/g,">=").replace(/∪/g," U ")
    .replace(/\*\*/g,"^").replace(/\\cdot/g,"*").replace(/\\left|\\right/g,"").replace(/\\pi/g,"pi").replace(/\\infty/g,"inf")
    .replace(/\\(sin|cos|tan|sec|csc|cot|ln|log|arcsin|arccos|arctan|exp|sqrt)/g,"$1")
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,"(($1)/($2))")
    .replace(/[{]/g,"(").replace(/[}]/g,")")
    .trim();
}
function tokenize(src){
  const s=normalize(src); const out=[]; let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){ i++; continue; }
    if(/[0-9.]/.test(c)){
      let j=i; while(j<s.length && /[0-9]/.test(s[j])) j++;
      if(s[j]==="."){ j++; while(j<s.length && /[0-9]/.test(s[j])) j++; }
      const txt=s.slice(i,j); if(txt===".") throw err("A dot on its own is not a number",i);
      // scientific notation like 2.5e-3 only when followed by digit/sign+digit, and "e" not followed by letter
      if((s[j]==="E") && /[+-]?\d/.test(s.slice(j+1,j+3))){ let k=j+1; if(/[+-]/.test(s[k])) k++; while(k<s.length&&/\d/.test(s[k])) k++; out.push({t:"num",v:parseFloat(s.slice(i,k)),txt:s.slice(i,k)}); i=k; continue; }
      out.push({t:"num",v:parseFloat(txt),txt}); i=j; continue;
    }
    if(/[A-Za-z]/.test(c)){
      let j=i; while(j<s.length && /[A-Za-z]/.test(s[j])) j++;
      const word=s.slice(i,j);
      // subscript like log_2 or x_0
      splitWord(word).forEach(w=>out.push(w));
      i=j;
      if(s[i]==="_"){ // subscript: log_b(...) base, or variable subscript
        let k=i+1, sub="";
        if(s[k]==="("){ let d=1; k++; const st=k; while(k<s.length&&d){ if(s[k]==="(") d++; else if(s[k]===")") d--; k++; } sub=s.slice(st,k-1); }
        else { const st=k; while(k<s.length && /[A-Za-z0-9.]/.test(s[k])) k++; sub=s.slice(st,k); }
        const last=out[out.length-1];
        if(last && last.t==="fn" && last.v==="log"){ last.base=sub; }
        else if(last && last.t==="id"){ last.v=last.v+"_"+sub; }
        i=k;
      }
      continue;
    }
    if(s.startsWith("<=",i)||s.startsWith(">=",i)){ out.push({t:"rel",v:s.slice(i,i+2)}); i+=2; continue; }
    if("+-*/^()[]|,!=<>'".includes(c)){ out.push({t:c==="="||c==="<"||c===">"?"rel":"op",v:c}); i++; continue; }
    throw err(`I don't recognise "${c}"`,i);
  }
  return out;
}
function err(msg,pos){ const e=new Error(msg); e.pos=pos; e.user=true; return e; }
const VAR_WORDS=["theta","alpha","beta","lambda","omega","phi","mu","sigma","tau","delta","Delta","pi","inf","infinity"];
function splitWord(w){
  // split a letter run into function names, greek words, and single-letter variables
  const out=[]; let i=0;
  while(i<w.length){
    let hit=null;
    for(const f of FUNC_NAMES){ if(w.startsWith(f,i)){ hit={t:"fn",v:ALIAS[f]||f}; i+=f.length; break; } }
    if(!hit){ for(const g of VAR_WORDS){ if(w.startsWith(g,i)){ hit= g==="inf"||g==="infinity"?{t:"num",v:Infinity,txt:"inf"}: g==="pi"?{t:"const",v:"pi"}:{t:"id",v:g}; i+=g.length; break; } } }
    if(!hit){ const ch=w[i]; hit= ch==="e"?{t:"const",v:"e"}:{t:"id",v:ch}; i++; }
    out.push(hit);
  }
  return out;
}

/* ---------- parser (precedence climbing with implicit multiplication) ---------- */
function parse(src){
  const toks=tokenize(src); let p=0;
  if(!toks.length) throw err("Type an answer",0);
  const peek=()=>toks[p], next=()=>toks[p++];
  const isOp=(v)=>peek()&&peek().t==="op"&&peek().v===v;
  function expect(v){ if(!isOp(v)) throw err(`Missing "${v}"`,p); p++; }
  function parseExpr(){ return parseAdd(); }
  function parseAdd(){
    let left;
    if(isOp("-")){ next(); left={k:"neg",a:parseMul()}; }
    else if(isOp("+")){ next(); left=parseMul(); }
    else left=parseMul();
    while(isOp("+")||isOp("-")){ const o=next().v; const r=parseMul(); left={k:o==="+"?"add":"sub",a:left,b:r}; }
    return left;
  }
  function startsFactor(t){ if(!t) return false; if(t.t==="num"||t.t==="id"||t.t==="const"||t.t==="fn") return true; if(t.t==="op"&&(t.v==="("||t.v==="[")) return true; return false; }
  function parseMul(){
    let left=parseUnary();
    for(;;){
      if(isOp("*")||isOp("/")){ const o=next().v; const r=parseUnary(); left={k:o==="*"?"mul":"div",a:left,b:r}; continue; }
      // implicit multiplication
      const t=peek();
      if(startsFactor(t)){ const r=parsePow(); left={k:"mul",a:left,b:r,imp:true}; continue; }
      if(t&&t.t==="op"&&t.v==="|"&&absOpenOK()){ const r=parsePow(); left={k:"mul",a:left,b:r,imp:true}; continue; }
      break;
    }
    return left;
  }
  // an | after a complete factor is a closing bar unless we are not inside one
  let absDepth=0;
  function absOpenOK(){ return absDepth===0; }
  function parseUnary(){
    if(isOp("-")){ next(); return {k:"neg",a:parseUnary()}; }
    if(isOp("+")){ next(); return parseUnary(); }
    return parsePow();
  }
  function parsePow(){
    let base=parsePostfix();
    if(isOp("^")){ next(); let e; if(isOp("-")){ next(); e={k:"neg",a:parsePowOperand()}; } else e=parsePowOperand(); return {k:"pow",a:base,b:e}; }
    return base;
  }
  function parsePowOperand(){ // right-assoc
    let b=parsePostfix();
    if(isOp("^")){ next(); let e; if(isOp("-")){ next(); e={k:"neg",a:parsePowOperand()}; } else e=parsePowOperand(); return {k:"pow",a:b,b:e}; }
    return b;
  }
  function parsePostfix(){
    let a=parsePrimary();
    while(isOp("!")||isOp("'")){ const o=next().v; if(o==="!") a={k:"fact",a}; else a={k:"prime",a}; }
    return a;
  }
  function parsePrimary(){
    const t=next();
    if(!t) throw err("Your answer ends too early",p);
    if(t.t==="num") return {k:"num",v:t.v,txt:t.txt};
    if(t.t==="const") return {k:"const",v:t.v};
    if(t.t==="id") return {k:"var",v:t.v};
    if(t.t==="op"&&(t.v==="("||t.v==="[")){ const e=parseExpr(); const close=t.v==="("?")":"]"; if(isOp(close)||isOp(")")||isOp("]")) next(); else throw err(`Missing "${close}"`,p); return {k:"paren",a:e}; }
    if(t.t==="op"&&t.v==="|"){ absDepth++; const e=parseExpr(); absDepth--; if(!isOp("|")) throw err('Missing closing "|"',p); next(); return {k:"fn",f:"abs",a:e}; }
    if(t.t==="fn"){
      let f=t.v, power=null;
      // sin^2(x), sin^-1(x)
      if(isOp("^")){ next(); let neg=false; if(isOp("-")){ next(); neg=true; } const pt=next(); if(!pt||pt.t!=="num") throw err("Put the power on a function like sin^2(x)",p); power=neg?-pt.v:pt.v; }
      if(power===-1 && ["sin","cos","tan"].includes(f)){ f="arc"+f; power=null; }
      let arg;
      if(isOp("(")||isOp("[")){ next(); arg=parseExpr(); if(isOp(")")||isOp("]")) next(); else throw err('Missing ")"',p); }
      else if(isOp("|")){ arg=parsePrimary(); }
      else { // no brackets: take a run of numbers/variables/powers, like sin 2x or ln x
        if(!startsFactor(peek())) throw err(`${f} needs something to act on`,p);
        arg=parsePow();
        while(peek() && (peek().t==="num"||peek().t==="id"||peek().t==="const")){ arg={k:"mul",a:arg,b:parsePow(),imp:true}; }
      }
      let node={k:"fn",f,a:arg};
      if(t.base!=null){ node={k:"logb",base:parse(t.base),a:arg}; }
      if(power!=null) node={k:"pow",a:node,b:{k:"num",v:power,txt:String(power)}};
      return node;
    }
    if(t.t==="op") throw err(`Unexpected "${t.v}"`,p);
    if(t.t==="rel") throw err(`Unexpected "${t.v}"`,p);
    throw err("Something is off here",p);
  }
  const ast=parseExpr();
  if(p<toks.length){ const t=toks[p]; throw err(`Unexpected "${t.v===undefined?t.txt:t.v}"`,p); }
  return ast;
}

/* ---------- evaluation ---------- */
function evaluate(n,env){
  switch(n.k){
    case "num": return n.v;
    case "const": return n.v==="pi"?Math.PI:Math.E;
    case "var": { if(env && n.v in env) return env[n.v]; throw err(`Unknown letter "${n.v}"`); }
    case "paren": return evaluate(n.a,env);
    case "neg": return -evaluate(n.a,env);
    case "add": return evaluate(n.a,env)+evaluate(n.b,env);
    case "sub": return evaluate(n.a,env)-evaluate(n.b,env);
    case "mul": return evaluate(n.a,env)*evaluate(n.b,env);
    case "div": return evaluate(n.a,env)/evaluate(n.b,env);
    case "pow": { const a=evaluate(n.a,env), b=evaluate(n.b,env); if(a<0 && Math.abs(b-Math.round(b))>1e-12){ // odd roots of negatives, e.g. x^(1/3)
        const q=1/b; if(Math.abs(q-Math.round(q))<1e-9 && Math.round(q)%2!==0) return -Math.pow(-a,b); return NaN; }
      return Math.pow(a,b); }
    case "fact": return fact(evaluate(n.a,env));
    case "fn": { const f=FUNCS[n.f]; if(!f) throw err(`Unknown function ${n.f}`); return f(evaluate(n.a,env)); }
    case "logb": return Math.log(evaluate(n.a,env))/Math.log(evaluate(n.base,env));
    case "prime": throw err("Use the derivative itself, not a prime symbol");
  }
  throw err("Can't evaluate this");
}
function vars(n,set=new Set()){
  if(!n) return set;
  if(n.k==="var") set.add(n.v);
  ["a","b","base"].forEach(k=>{ if(n[k]) vars(n[k],set); });
  return set;
}

/* ---------- LaTeX ---------- */
function prec(n){ switch(n.k){ case "add": case "sub": return 1; case "neg": return 2; case "mul": case "div": return 3; case "pow": return 5; case "fact": return 6; default: return 9; } }
function texNum(n){ if(n.v===Infinity) return "\\infty"; return n.txt!=null?n.txt:String(n.v); }
function toTeX(n){
  const w=(c,min)=>prec(c)<min?`\\left(${toTeX(c)}\\right)`:toTeX(c);
  switch(n.k){
    case "num": return texNum(n);
    case "const": return n.v==="pi"?"\\pi":"e";
    case "var": { const [b,sub]=n.v.split("_"); const base=GREEK[b]||b; return sub!=null?`${base}_{${sub}}`:base; }
    case "paren": return `\\left(${toTeX(n.a)}\\right)`;
    case "neg": return "-"+w(n.a,3);
    case "add": return toTeX(n.a)+"+"+w(n.b,2);
    case "sub": return toTeX(n.a)+"-"+w(n.b,2);
    case "mul": {
      const a=w(n.a,3), b=w(n.b,3.5);
      const needDot = !n.imp || (/[0-9.]$/.test(a) && /^[0-9.]/.test(b)) || (n.b.k==="num");
      return a+(needDot?" \\cdot ":" ")+b; }
    case "div": return `\\frac{${toTeX(strip(n.a))}}{${toTeX(strip(n.b))}}`;
    case "pow": {
      if(n.a.k==="fn" && TEXFN[n.a.f] && n.b.k==="num" && n.b.v>0) return `${TEXFN[n.a.f]}^{${texNum(n.b)}}\\left(${toTeX(n.a.a)}\\right)`;
      const base = (n.a.k==="num"||n.a.k==="var"||n.a.k==="const"||n.a.k==="paren"||(n.a.k==="fn"&&n.a.f==="abs"))?toTeX(n.a):`\\left(${toTeX(n.a)}\\right)`;
      return `${base}^{${toTeX(strip(n.b))}}`; }
    case "fact": return w(n.a,6)+"!";
    case "fn": {
      if(n.f==="abs") return `\\left|${toTeX(n.a)}\\right|`;
      if(n.f==="sqrt") return `\\sqrt{${toTeX(strip(n.a))}}`;
      if(n.f==="exp") return `e^{${toTeX(strip(n.a))}}`;
      return `${TEXFN[n.f]||"\\operatorname{"+n.f+"}"}\\left(${toTeX(strip(n.a))}\\right)`; }
    case "logb": return `\\log_{${toTeX(n.base)}}\\left(${toTeX(strip(n.a))}\\right)`;
    case "prime": return toTeX(n.a)+"'";
  }
  return "?";
}
function strip(n){ return n.k==="paren"?n.a:n; }

/* ---------- comparing expressions ---------- */
function rng(seed){ let s=seed>>>0||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>17; s^=s<<5; s>>>=0; return s/4294967296; }; }
const CONST_LETTERS=["C","K","A","B","D"];
/* spec: {vars:["x"], domain:{x:[a,b]} or [a,b], plusC:bool, consts:["C"]}  */
function sameExpr(userAst, rightAst, spec={}){
  let vlist = spec.vars || [...vars(rightAst)].filter(v=>!CONST_LETTERS.includes(v));
  if(!spec.vars && !vlist.length) vlist=[...vars(userAst)].filter(v=>!CONST_LETTERS.includes(v)); // answer is a constant: any variables must cancel
  const consts = spec.consts || [...vars(rightAst)].filter(v=>CONST_LETTERS.includes(v) && !(spec.plusC && v==="C")); // with plusC, a "+ C" in the stored answer is the arbitrary constant
  const uv=[...vars(userAst)];
  // rename the user's own arbitrary constant to match the expected one (A e^{2x} vs C e^{2x})
  let ren={};
  if(consts.length===1){ const theirs=uv.filter(v=>CONST_LETTERS.includes(v)&&!vlist.includes(v)); if(theirs.length===1 && theirs[0]!==consts[0]) ren[theirs[0]]=consts[0]; }
  const extra=uv.map(v=>ren[v]||v).filter(v=>!vlist.includes(v)&&!consts.includes(v));
  if(spec.plusC && extra.length===1 && CONST_LETTERS.includes(extra[0])){ ren[extra.find(()=>true)]="C"; }
  const extra2=uv.map(v=>ren[v]||v).filter(v=>!vlist.includes(v)&&!consts.includes(v)&&!(spec.plusC&&v==="C"));
  if(extra2.length) return {ok:false,why:`Your answer uses "${extra2[0]}", which isn't in this problem.`};
  const dom = spec.domain || [-3,3];
  const R=rng(spec.seed||12345);
  let good=0, tried=0, diffs=[];
  const userHasC = uv.some(v=>(ren[v]||v)==="C");
  while(good<8 && tried<200){
    tried++;
    const env={};
    vlist.forEach(v=>{ const d=Array.isArray(dom)?dom:(dom[v]||[-3,3]); env[v]=d[0]+(d[1]-d[0])*(0.05+0.9*R()); });
    consts.forEach(c=>env[c]=0.5+2*R());
    const uenv={...env}; Object.keys(ren).forEach(k=>{ uenv[k]=env[ren[k]]; });
    if(spec.plusC){ uenv.C=0; if(!consts.includes("C")) env.C=0; Object.keys(ren).forEach(k=>{ if(ren[k]==="C") uenv[k]=0; }); }
    let a,b; try{ a=evaluate(userAst,uenv); b=evaluate(rightAst,env); }catch(e){ return {ok:false,why:e.message}; }
    if(!isFinite(a)||!isFinite(b)||isNaN(a)||isNaN(b)) continue;
    good++;
    if(spec.plusC) diffs.push(a-b);
    else { const tol=1e-6*Math.max(1,Math.abs(a),Math.abs(b)); if(Math.abs(a-b)>tol) return {ok:false}; }
  }
  if(good<4){
    const hasAbs=n=>!!n&&(n.k==="fn"&&n.f==="abs"||["a","b","base"].some(k=>hasAbs(n[k])));
    if(hasAbs(rightAst)&&!hasAbs(userAst)) return {ok:false,why:"Your answer isn't defined everywhere the right answer is. Check for missing absolute value bars, for example ln|x| instead of ln(x)."};
    return {ok:false,why:"I couldn't evaluate your answer at enough points. Check brackets and the domain."};
  }
  if(spec.plusC){
    const d0=diffs[0]; const ok=diffs.every(d=>Math.abs(d-d0)<=1e-6*Math.max(1,Math.abs(d0)));
    if(!ok) return {ok:false};
    if(!userHasC) return {ok:false,missingC:true,why:"Right family of functions, but you left off the constant. Add + C."};
  }
  return {ok:true};
}

/* ---------- intervals and sets ---------- */
function parseNumber(s){ const a=parse(s); const v=evaluate(a,{}); return v; }
function parseIntervals(src){
  let s=normalize(src).replace(/\bR\b/g,"(-inf,inf)").replace(/all real numbers|all reals/i,"(-inf,inf)");
  s=s.replace(/^\s*x\s*(\\in|in)\s*/i,"");
  if(/^\s*(none|no solution|empty|\{\s*\})\s*$/i.test(s)) return [];
  // inequality forms: a<x<b, x<a, x>=b, combined with "or"/"and"
  if(/[<>]/.test(s)){
    const parts=s.split(/\s+or\s+|\s*,\s*or\s*|\s+U\s+/i);
    return merge(parts.map(ineqToInterval));
  }
  const parts=s.split(/\s*U\s*|\s+u\s+|\s*∪\s*/);
  return merge(parts.map(part=>{
    const m=part.trim().match(/^([\(\[])\s*(.+?)\s*,\s*(.+?)\s*([\)\]])$/);
    if(!m) throw err(`Write intervals like (0, 4] or (-inf, 2) U (3, inf)`);
    return {lo:parseNumber(m[2]),hi:parseNumber(m[3]),loIn:m[1]==="[",hiIn:m[4]==="]"};
  }));
}
function ineqToInterval(p){
  const s=p.trim();
  const chain=s.match(/^(.+?)(<=|<)\s*([a-z])\s*(<=|<)(.+)$/i);
  if(chain) return {lo:parseNumber(chain[1]),hi:parseNumber(chain[5]),loIn:chain[2]==="<=",hiIn:chain[4]==="<="};
  const chain2=s.match(/^(.+?)(>=|>)\s*([a-z])\s*(>=|>)(.+)$/i);
  if(chain2) return {lo:parseNumber(chain2[5]),hi:parseNumber(chain2[1]),loIn:chain2[4]===">=",hiIn:chain2[2]===">="};
  let m=s.match(/^([a-z])\s*(<=|<|>=|>)\s*(.+)$/i);
  if(m){ const v=parseNumber(m[3]); return m[2][0]==="<"?{lo:-Infinity,hi:v,loIn:false,hiIn:m[2]==="<="}:{lo:v,hi:Infinity,loIn:m[2]===">=",hiIn:false}; }
  m=s.match(/^(.+?)\s*(<=|<|>=|>)\s*([a-z])$/i);
  if(m){ const v=parseNumber(m[1]); return m[2][0]===">"?{lo:-Infinity,hi:v,loIn:false,hiIn:m[2]===">="}:{lo:v,hi:Infinity,loIn:m[2]==="<=",hiIn:false}; }
  throw err("Write it like 0 < x < 4, or as intervals like (0, 4)");
}
function merge(list){ return list.sort((a,b)=>a.lo-b.lo); }
function sameIntervals(a,b,tol=1e-6){
  if(a.length!==b.length) return false;
  for(let i=0;i<a.length;i++){
    const x=a[i], y=b[i];
    const eq=(p,q)=>p===q || Math.abs(p-q)<=tol*Math.max(1,Math.abs(q));
    if(!eq(x.lo,y.lo)||!eq(x.hi,y.hi)) return false;
    if(isFinite(y.lo) && x.loIn!==y.loIn) return false;
    if(isFinite(y.hi) && x.hiIn!==y.hiIn) return false;
  }
  return true;
}
function intervalsTeX(list){
  if(!list.length) return "\\varnothing";
  const n=v=>v===Infinity?"\\infty":v===-Infinity?"-\\infty":fmtNum(v);
  return list.map(I=>`${I.loIn?"[":"("}${n(I.lo)}, ${n(I.hi)}${I.hiIn?"]":")"}`).join(" \\cup ");
}
function fmtNum(v){ if(Math.abs(v-Math.round(v))<1e-9) return String(Math.round(v)); return String(+v.toFixed(4)); }
function parseList(src){
  let s=normalize(src).replace(/^\s*[a-z]\s*=\s*/i,"").replace(/\s+(and|or)\s+/gi,",").replace(/[{}]/g,"");
  s=s.replace(/\b[a-z]\s*=\s*/gi,"");
  if(/^\s*(none|no solution)\s*$/i.test(s)) return [];
  return splitTop(s).map(t=>evaluate(parse(t),{}));
}
function splitTop(s){ const out=[]; let d=0, cur=""; for(const ch of s){ if(ch==="("||ch==="[") d++; if(ch===")"||ch==="]") d--; if(ch===","&&d===0){ out.push(cur); cur=""; } else cur+=ch; } if(cur.trim()) out.push(cur); return out.map(x=>x.trim()).filter(Boolean); }

/* strip "y =", "f(x) =", "dy/dx =" from the front of an expression answer */
function stripLHS(s){
  return String(s).replace(/^\s*(y|f\s*\(\s*[a-z]\s*\)|[a-zA-Z]\s*\(\s*[a-z]\s*\)|dy\s*\/\s*dx|dy|y\s*'|L\s*\(\s*x\s*\))\s*=\s*/,"");
}

/* ---------- top-level check ----------
   spec.type: "expr" (default) | "num" | "interval" | "list" | "eq-line"
   spec.answer: string (ascii math) for expr/num/list; intervals as a string too.
   num: spec.tol (absolute) or spec.rel (relative, default 1e-3 when decimal allowed) */
function check(user, spec){
  const type=spec.type||"expr";
  try{
    if(!String(user).trim()) return {ok:false,why:"Type an answer first."};
    if(type==="num"){
      const s=stripLHS(user);
      const v=evaluate(parse(s),{});
      const r=typeof spec.answer==="number"?spec.answer:evaluate(parse(String(spec.answer)),{});
      const tol = spec.tol!=null?spec.tol: Math.max(1e-9, (spec.rel!=null?spec.rel:5e-4)*Math.abs(r));
      if(!isFinite(v)) return {ok:false,why:"That doesn't evaluate to a number."};
      if(Math.abs(v-r)<=tol) return {ok:true};
      if(spec.rel==null && spec.tol==null && Math.abs(v-r)<=Math.max(0.02*Math.abs(r),0.006)) return {ok:false,close:true,why:"Close. Check your rounding: keep more decimal places."};
      return {ok:false};
    }
    if(type==="interval"){
      const a=parseIntervals(user), b=parseIntervals(spec.answer);
      return {ok:sameIntervals(a,b)};
    }
    if(type==="list"){
      const a=parseList(user).sort((x,y)=>x-y), b=(Array.isArray(spec.answer)?spec.answer.map(Number):parseList(spec.answer)).sort((x,y)=>x-y);
      if(a.length!==b.length) return {ok:false,why:a.length<b.length?"You're missing at least one value.":"You have too many values."};
      const ok=a.every((v,i)=>Math.abs(v-b[i])<=(spec.tol!=null?spec.tol:1e-6*Math.max(1,Math.abs(b[i]))));
      return {ok};
    }
    // expressions
    const ua=parse(stripLHS(user)), ra=parse(stripLHS(spec.answer));
    const res=sameExpr(ua,ra,spec);
    if(res.ok && spec.form && !spec.form(String(user))) return {ok:false,why:spec.formWhy||"Equivalent, but not in the form the question asks for."};
    return res;
  }catch(e){
    if(e.user) return {ok:false,parseError:true,why:e.message};
    return {ok:false,parseError:true,why:"I couldn't read that. Check the brackets."};
  }
}

/* preview: LaTeX for what the student typed, or an error message */
function preview(user, type){
  const s=String(user||"").trim(); if(!s) return {tex:""};
  try{
    if(type==="interval"){ return {tex:intervalsTeX(parseIntervals(s))}; }
    if(type==="list"){ const parts=splitTop(normalize(s).replace(/^\s*[a-z]\s*=\s*/i,"")); return {tex:parts.map(p=>toTeX(parse(p))).join(",\\; ")}; }
    const m=String(s).match(/^\s*(y|f\s*\(\s*[a-z]\s*\)|[a-zA-Z]\s*\(\s*[a-z]\s*\)|dy\s*\/\s*dx|y\s*')\s*=\s*/);
    const lhs=m?m[1].replace(/\s+/g,"").replace("dy/dx","\\frac{dy}{dx}")+" = ":"";
    return {tex:lhs+toTeX(parse(stripLHS(s)))};
  }catch(e){ return {error:e.user?e.message:"Can't read that yet"}; }
}

const API={parse,evaluate,toTeX,check,preview,vars,sameExpr,parseIntervals,intervalsTeX,parseList,fact,normalize,tokenize};
if(typeof module!=="undefined"&&module.exports) module.exports=API; else root.MC=API;
})(typeof window!=="undefined"?window:globalThis);
