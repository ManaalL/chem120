/* CHEM 120 Interactive: figure, example, question and problem widgets used by every page.
   A generator returns {prompt, answer|parts, hint, steps, answerTeX}. Typed answers are checked by MC.check() (chemcheck.js).
   3D figures ({model:{type, params}}) load lazily when they scroll near the screen and are disposed when they leave the page.
   A figure with `predict` stays covered until the prediction is answered: predict, then turn the model and check. */
(function(){
"use strict";
const M=window.C120, el=M.el, rich=M.rich, esc=M.esc;
const E=window.ENGINE={};

const FORMAT_HELP={
  num:"Type a number with its unit, like 4.09e-19 J, 4.09 x 10^-19 J or 486 nm. Any matching unit works (kJ or J, nm or m). Sig figs are checked separately.",
  int:"Type a whole number.",
  formula:"Type a formula like Na2SO4, Ca(OH)2 or an ion like SO4^2- or Fe^3+ (use ^ for the charge).",
  equation:"Type the equation with -> for the arrow and spaces around each +, like Ag+(aq) + Cl-(aq) -> AgCl(s).",
  config:"Type subshells like 1s2 2s2 2p6, or use a noble-gas core like [Ar] 4s2 3d10.",
  qset:"Type n, l, ml and ms in order, like (3, 2, -1, +1/2).",
  orbital:"Type an orbital like 2p_z, 3d_xy or 4s.",
  list:"Type whole numbers separated by commas, like 2, 1, 1, 2.",
  text:"Type a word or short phrase."
};
const PLACEHOLDER={num:"e.g. 4.09e-19 J",int:"e.g. 3",formula:"e.g. SO4^2-",equation:"e.g. A + B -> C",config:"e.g. [Ne] 3s2 3p3",qset:"e.g. (3, 2, -1, +1/2)",orbital:"e.g. 3d_xy",list:"e.g. 2, 1, 1, 2",text:"type here"};
E.FORMAT_HELP=FORMAT_HELP;

/* ---------- 3D lifecycle ---------- */
const LIVE=new Set();
let modP=null;
const loadModels=()=>modP||(modP=import(new URL("assets/js/3d/index.mjs",document.baseURI.replace(/[^/]*$/,"")).href).catch(e=>{ modP=null; throw e; }));
E.cleanup=function(root){ for(const m of [...LIVE]){ if(!root||!m.host.isConnected||root.contains(m.host)){ try{ m.ctrl&&m.ctrl.dispose&&m.ctrl.dispose(); }catch(e){ console.error(e); } LIVE.delete(m); } } };
/* dispose models whose figure has left the page (chapter step changes, tab switches) */
const mo=new MutationObserver(()=>{ for(const m of [...LIVE]){ if(!m.host.isConnected){ try{ m.ctrl&&m.ctrl.dispose(); }catch(e){} LIVE.delete(m); } } });
if(document.body) mo.observe(document.body,{childList:true,subtree:true}); else document.addEventListener("DOMContentLoaded",()=>mo.observe(document.body,{childList:true,subtree:true}));
E.liveCount=()=>LIVE.size;
function mount3D(body, spec, ctx, hold){
  const wait=el("div",{class:"v3d-wait"},"The 3D model loads when you scroll here.");
  body.append(wait);
  const rec={host:body,ctrl:null}; let started=false;
  const go=()=>{ if(started) return; started=true; io.disconnect(); wait.textContent="Loading the 3D model…";
    loadModels().then(R=>R.mountModel(body,spec.type,spec.params||{},ctx)).then(ctrl=>{ wait.remove(); rec.ctrl=ctrl; if(!body.isConnected){ try{ ctrl.dispose(); }catch(e){} return; } LIVE.add(rec); })
      .catch(err=>{ console.error(err); wait.textContent="This 3D model could not load. Check your connection and refresh."; }); };
  const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)) go(); },{rootMargin:"250px"});
  if(!hold) io.observe(wait); else wait.textContent="The 3D model appears after your prediction.";
  return {start:()=>{ if(hold){ hold=false; wait.textContent="The 3D model loads when you scroll here."; io.observe(wait); } }};
}

/* ---------- a figure plate ---------- */
let figN=0;
E.figure = function(host, fig, ctx={}){
  const f=el("figure",{class:"plate"+(fig.model?" p3d":"")});
  if(fig.predict) f.classList.add("cover");
  const body=el("div",{class:"fig-body"}); f.append(body);
  const n=ctx.figNo||(++figN);
  const cap=el("figcaption",{rich:`<b>Fig. ${n}</b> ${fig.cap||""}${fig.ref?` <span class="ref">${esc(fig.refText||fig.ref)}</span>`:""}`}); f.append(cap);
  let pred=null;
  if(fig.predict){
    pred=el("div",{class:"predict"});
    pred.append(el("div",{class:"kicker"},"Predict first"));
    const veil=el("div",{class:"veil",html:`<div><b>Make your prediction first</b>Answer the question above, then turn the model to check.<br><button type="button" class="sbtn" style="margin-top:8px">Skip and show it</button></div>`});
    const reveal=()=>{ veil.remove(); f.classList.remove("cover"); if(starter) starter.start(); };
    veil.querySelector("button").onclick=reveal;
    f.append(veil);
    E.mcq(pred,{...fig.predict,q:fig.predict.q},ok=>{ reveal(); ctx.onPredict&&ctx.onPredict(ok); });
    if(fig.predict.check) pred.append(el("p",{class:"small muted",style:"margin:6px 0 0",rich:`<b>Then check:</b> ${fig.predict.check}`}));
  }
  if(pred) host.append(pred);
  host.append(f);
  let starter=null;
  const cx={PLOT:window.PLOT, M, cap, ...ctx};
  if(fig.model){
    const spec=typeof fig.model==="function"?fig.model(cx):fig.model;
    starter=mount3D(body, spec, {onState:ctx.onState, onInteract:ctx.onInteract}, !!fig.predict);
  } else {
    try{ fig.build(body, cx); }catch(e){ console.error(e); body.append(el("p",{class:"muted"},"This figure failed to load.")); }
  }
  return f;
};

/* ---------- step-through worked example ---------- */
E.example = function(host, ex){
  const box=el("div",{class:"wx"});
  box.append(el("div",{class:"kicker"},"Worked example"+(ex.ref?` · ${ex.ref}`:"")));
  box.append(el("div",{class:"q",rich:ex.q}));
  const ol=el("ol"); box.append(ol);
  const lis=ex.steps.map((s,i)=>{ const li=el("li",{class:i?"hidden":""}); li.innerHTML=rich(typeof s==="string"?s:s.t)+(s.why?`<span class="why">${rich(s.why)}</span>`:""); ol.append(li); return li; });
  let shown=1;
  const row=el("div",{class:"row",style:"margin-top:6px"});
  const nextB=el("button",{class:"btn sm",type:"button"},"Next step");
  const allB=el("button",{class:"btn ghost sm",type:"button"},"Show all steps");
  const upd=()=>{ lis.forEach((li,i)=>li.classList.toggle("hidden",i>=shown)); nextB.disabled=shown>=lis.length; nextB.textContent=shown>=lis.length?"Done":`Next step (${shown+1} of ${lis.length})`; if(shown>=lis.length && ex.ans) ansEl.hidden=false; };
  nextB.onclick=()=>{ shown=Math.min(lis.length,shown+1); upd(); };
  allB.onclick=()=>{ shown=lis.length; upd(); };
  row.append(nextB,allB); box.append(row);
  const ansEl=el("div",{class:"box",hidden:true,rich:ex.ans?`<b class="t">Answer</b>${ex.ans}`:""}); box.append(ansEl);
  host.append(box); upd();
  return box;
};

/* ---------- multiple choice (single or select-all) ----------
   q: {q, opts:[[text, correct, why]], multi, after, keep} */
E.mcq = function(host, q, onAnswer){
  const box=el("div");
  if(q.q) box.append(el("div",{class:"ex-q",rich:q.q}));
  const opts=el("div",{class:"opts"}); box.append(opts);
  const fb=el("div");
  const order=q.keep?q.opts.map((o,i)=>i):M.shuffle(q.opts.map((o,i)=>i));
  let done=false; const sel=new Set();
  order.forEach(i=>{ const o=q.opts[i]; const b=el("button",{class:"opt",type:"button",rich:o[0]});
    b.onclick=()=>{ if(done) return;
      if(q.multi){ if(sel.has(i)){ sel.delete(i); b.classList.remove("sel"); b.setAttribute("aria-pressed","false"); } else { sel.add(i); b.classList.add("sel"); b.setAttribute("aria-pressed","true"); } return; }
      finish(new Set([i])); };
    if(q.multi) b.setAttribute("aria-pressed","false");
    b.dataset.i=i; opts.append(b); });
  let sub=null;
  if(q.multi){ box.append(el("p",{class:"muted small"},"Select all that apply (one, more than one, or none), then check.")); sub=el("button",{class:"btn sm",type:"button",onclick:()=>{ if(!done) finish(sel); }},"Check"); box.append(sub); }
  box.append(fb);
  function finish(chosen){
    done=true; if(sub) sub.disabled=true;
    const right=new Set(q.opts.map((o,i)=>o[1]?i:-1).filter(i=>i>=0));
    const ok = chosen.size===right.size && [...chosen].every(i=>right.has(i));
    M.$$(".opt",opts).forEach(b=>{ const i=+b.dataset.i; b.disabled=true; if(right.has(i)) b.classList.add("right"); else if(chosen.has(i)) b.classList.add("wrong"); });
    const why=[...chosen].map(i=>q.opts[i][2]).filter(Boolean);
    const rightWhy=q.opts.filter(o=>o[1]&&o[2]).map(o=>o[2]);
    fb.className="fb "+(ok?"ok":"bad");
    fb.innerHTML=`<b>${ok?"Right.":"Not quite."}</b>`+rich((ok?why:why.concat(rightWhy)).filter((v,i,a)=>a.indexOf(v)===i).join(" "))+(q.after?`<p style="margin:6px 0 0">${rich(q.after)}</p>`:"");
    onAnswer&&onAnswer(ok);
  }
  host.append(box);
  return box;
};

/* ---------- "find the first line with a mistake" ----------
   q: {q, lines:[tex strings], wrong:index or -1 for "no mistake", why} */
E.firstline = function(host, q, onAnswer){
  const box=el("div",{class:"fl"}); if(q.q) box.append(el("div",{class:"ex-q",rich:q.q}));
  const ol=el("ol",{class:"fl-lines"}); box.append(ol); const fb=el("div"); let done=false;
  const pick=i=>{ if(done) return; done=true; const ok=i===q.wrong; M.$$("button",ol).forEach((b,k)=>{ b.disabled=true; if(k===q.wrong) b.classList.add("wrong-line"); if(k===i && !ok) b.classList.add("picked"); });
    fb.className="fb "+(ok?"ok":"bad"); fb.innerHTML=`<b>${ok?"Right.":"Not quite."}</b>`+rich(q.wrong<0?"Every line is correct.":`The first mistake is line ${q.wrong+1}. ${q.why||""}`); onAnswer&&onAnswer(ok); };
  q.lines.forEach((t,i)=>{ const li=el("li"); const b=el("button",{type:"button",class:"opt",rich:t}); b.onclick=()=>pick(i); li.append(b); ol.append(li); });
  if(q.allowNone!==false){ const nb=el("button",{type:"button",class:"sbtn"},"Every line is correct"); nb.onclick=()=>pick(-1); box.append(nb); }
  box.append(fb); host.append(box); return box;
};

/* ---------- a generated problem ----------
   opts: {gid, seed, diff, onResult(ok, first), showNew, diffLabel, fromMistakes, onSolved} */
E.make = function(gid, seed, diff){
  const g=M.gen(gid); if(!g) throw new Error("No generator "+gid);
  const R=M.rng(seed);
  const p=g.gen(R, diff||2);
  if(p.answer && !p.parts) p.parts=[{answer:p.answer}];
  return {g, p};
};
E.problem = function(host, opts){
  const gid=opts.gid; let seed=opts.seed!=null?opts.seed:M.newSeed(); const diff=opts.diff||2;
  const card=el("div",{class:"prob"});
  const info=M.gen(gid); const L=M.chap(info.chapter), U=M.mod(L.module);
  card.style.setProperty("--c",`var(--${U.id})`);
  host.append(card);
  function render(){
    card.innerHTML="";
    let made; try{ made=E.make(gid,seed,diff); }catch(e){ console.error(e); card.append(el("p",{class:"muted"},"This problem failed to generate.")); return; }
    const {g,p}=made;
    const head=el("div",{class:"ph"},
      el("span",{class:"pill"},`Ch ${L.num}`),
      el("span",{class:"ref",rich:`${g.title}${g.ref?" · "+M.refText(L.id,g.ref):""}`}),
      opts.diffLabel?el("span",{class:"ref"},["","Easy","Medium","Hard"][diff]):null);
    card.append(head);
    card.append(el("div",{class:"stmt",rich:p.prompt}));
    const parts=p.parts||[];
    let firstDone=false; const state=parts.map(()=>({ok:false,tries:0}));
    parts.forEach((part,pi)=>{
      const a=part.answer; const t=a.type||"num";
      const box=el("div",{class:"ans"});
      if(part.label||parts.length>1) box.append(el("label",{rich:part.label||`Part ${pi+1}`}));
      if(t==="mc"||t==="multi"){
        const host2=el("div"); box.append(host2);
        const q={q:"",opts:a.options.map((o,i)=>[o,t==="multi"?a.correct.includes(i):i===a.correct,(a.why||[])[i]||""]),keep:a.keep,multi:t==="multi"};
        E.mcq(host2,q,ok=>{ state[pi].ok=ok; state[pi].tries++; settle(); });
      } else if(t==="firstline"){
        const host2=el("div"); box.append(host2);
        E.firstline(host2,{q:"",lines:a.lines,wrong:a.wrong,why:a.why},ok=>{ state[pi].ok=ok; state[pi].tries++; settle(); });
      } else {
        const row=el("div",{class:"inrow"});
        const lab=(part.label?part.label.replace(/\$[^$]*\$/g,"").replace(/<[^>]+>/g,"")+" ":"")+"your answer";
        const inp=el("input",{type:"text",autocomplete:"off",autocapitalize:"off",spellcheck:"false","aria-label":lab,placeholder:a.placeholder||PLACEHOLDER[t]||""});
        const chk=el("button",{class:"btn",type:"button"},"Check");
        row.append(inp,chk); box.append(row);
        const pre=el("div",{class:"pre","aria-live":"polite"}); box.append(pre);
        const fb=el("div"); box.append(fb);
        const upd=()=>{ const r=MC.preview(inp.value,t); if(r.error){ pre.className="pre err"; pre.textContent=r.error; } else { pre.className="pre"; pre.innerHTML=r.tex?`<span class="lab">You typed</span>`+M.tex(r.tex):`<span class="lab">Preview</span>`; } };
        inp.addEventListener("input",upd); upd();
        const doCheck=()=>{
          const r=MC.check(inp.value,a);
          if(r.parseError){ fb.className="fb warn"; fb.innerHTML=`<b>I can't read that yet.</b>${esc(r.why||"")}`; return; }
          state[pi].tries++; state[pi].ok=r.ok;
          if(r.ok){ fb.className="fb ok"; fb.innerHTML=`<b>Correct.</b>${part.okNote?rich(part.okNote):""}${r.note?esc(r.note):""}`; inp.disabled=true; chk.disabled=true; }
          else { fb.className="fb "+(r.close?"warn":"bad"); fb.innerHTML=`<b>${r.sf?"Almost: sig figs.":r.close?"Close.":"Not yet."}</b>${esc(r.why||"Try again, use the hint, or open the solution.")}`; }
          settle();
        };
        chk.onclick=doCheck; inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); doCheck(); } });
        box.append(el("div",{class:"fmt"},a.help||FORMAT_HELP[t]||""));
      }
      card.append(box);
    });
    const tools=el("div",{class:"row",style:"margin-top:8px"});
    const hintB=el("button",{class:"sbtn",type:"button"},"Hint");
    const solB=el("button",{class:"sbtn",type:"button"},"Show solution");
    tools.append(hintB,solB);
    if(opts.showNew!==false){ tools.append(el("span",{class:"spacer"}), el("button",{class:"sbtn",type:"button",onclick:()=>{ seed=M.newSeed(); render(); opts.onNew&&opts.onNew(); }},"New numbers")); }
    card.append(tools);
    const hintBox=el("div",{class:"box note",hidden:true,rich:`<b class="t">Hint</b>${p.hint||"Look back at this chapter's key idea."}`});
    const sol=el("div",{class:"sol",hidden:true});
    sol.innerHTML=`<b>Worked solution</b><ol>${(p.steps||[]).map(s=>`<li>${rich(s)}</li>`).join("")}</ol>`+(p.answerTeX?`<div class="box"><b class="t">Answer</b>${rich(p.answerTeX)}</div>`:"")+(g.ref?`<p class="ref">${esc(M.refText(L.id,g.ref))}</p>`:"");
    card.append(hintBox,sol);
    let usedHelp=false;
    hintB.onclick=()=>{ hintBox.hidden=!hintBox.hidden; usedHelp=true; };
    solB.onclick=()=>{ sol.hidden=!sol.hidden; if(!firstDone){ firstDone=true; record(false,true); } usedHelp=true; };
    function record(ok, gaveUp){
      M.recordAttempt(gid, ok, true);
      if(!ok) M.logMistake({gid, seed, diff, lec:L.id, gaveUp:!!gaveUp});
      opts.onResult&&opts.onResult(ok, true);
    }
    function settle(){
      if(!firstDone && state.every(s=>s.tries>0)){ firstDone=true; const ok=state.every(s=>s.ok)&&!usedHelp; record(ok); }
      if(state.every(s=>s.ok)){ if(opts.fromMistakes) M.fixMistake(gid,seed); opts.onSolved&&opts.onSolved(); }
    }
  }
  render();
  return card;
};

E.terms = function(){ const out=[]; M.chapters.forEach(L=>(L.glossary||[]).forEach(g=>out.push({...g,lec:L.id,unit:L.module}))); return out; };
})();

/* ---------- a practice question you rate yourself on (practice tests and course-notes examples) ----------
   r: {id, src, lec, kind:"mc"|"long", q, opts?, multi?, a?, steps?, note?, page?} */
(function(){
const M=window.C120, el=M.el, rich=M.rich, esc=M.esc;
ENGINE.reviewCard=function(r,opts={}){
  const L=r.lec?M.chap(r.lec):null; const u=L?M.mod(L.module):null;
  const d=el("div",{class:"rq",style:`--c:var(--${u?u.id:"ink2"})`});
  const rating=()=>M.db().review[r.id];
  const meta=[r.src?`<span class="pill" style="--c:var(--head)">${esc(r.src)}</span>`:"", L?`<span class="pill">Ch ${L.num}</span>`:"", r.page?`<span class="ref">${esc(r.page)}</span>`:""].join(" ");
  d.innerHTML=`<div class="row" style="gap:6px;margin-bottom:6px">${meta}</div><div class="q">${rich(r.q)}</div>`;
  if(r.opts){ const ol=el("ol",{type:"A",style:"margin:6px 0 0;padding-left:24px"}); r.opts.forEach(o=>{ const li=el("li",{rich:o[0]}); li.dataset.ok=o[1]?"1":""; ol.append(li); }); d.append(ol); if(r.multi) d.append(el("p",{class:"small muted",style:"margin:4px 0 0"},"Select all that apply.")); }
  const ans=el("div",{class:"a",hidden:!opts.showAll});
  const sol=r.steps||r.sol;
  let body="";
  if(r.opts){ const right=r.opts.map((o,i)=>o[1]?String.fromCharCode(65+i):null).filter(Boolean); body+=`<p style="margin:0 0 4px"><b>Answer: ${right.length?right.join(", "):"none of them"}</b></p>${r.opts.filter(o=>o[2]).map(o=>`<div class="small"><b>${rich(o[0])}</b>: ${rich(o[2])}</div>`).join("")}`; }
  if(r.a||r.ans) body+=`<p style="margin:4px 0"><b>Answer:</b> ${rich(r.a||r.ans)}</p>`;
  if(sol&&sol.length) body+=`<ol style="margin:6px 0 0;padding-left:22px">${sol.map(s=>`<li>${rich(s)}</li>`).join("")}</ol>`;
  if(r.note) body+=`<p class="small" style="margin:6px 0 0;color:var(--warn)">${rich(r.note)}</p>`;
  ans.innerHTML=body; d.append(ans);
  const meta2=el("div",{class:"meta"});
  const sb=el("button",{class:"sbtn",type:"button"},opts.showAll?"Hide answer":"Show answer");
  sb.onclick=()=>{ ans.hidden=!ans.hidden; sb.textContent=ans.hidden?"Show answer":"Hide answer"; if(!ans.hidden&&r.opts) d.querySelectorAll("li[data-ok='1']").forEach(li=>li.style.color="var(--ok)"); };
  meta2.append(sb);
  if(L) meta2.append(el("a",{class:"sbtn",href:M.chURL(L.id)},"Open the chapter"));
  if(window.GUIDE) meta2.append(el("button",{class:"sbtn",type:"button",onclick:()=>GUIDE.open(String(r.q).replace(/<[^>]+>/g," ").replace(/\$/g,"").slice(0,160))},"Ask Ev"));
  const rate=el("span",{class:"rate",role:"group","aria-label":"How well did you know this?"});
  [["got","Got it"],["shaky","Shaky"],["no","No idea"]].forEach(([v,t])=>{ const b=el("button",{type:"button","data-v":v,"aria-pressed":String(rating()===v)},t); b.onclick=()=>{ const db=M.db(); if(db.review[r.id]===v) delete db.review[r.id]; else db.review[r.id]=v; db.rlec=db.rlec||{}; if(r.lec) db.rlec[r.id]=r.lec; M.save(); rate.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(db.review[r.id]===x.dataset.v))); opts.onRate&&opts.onRate(); }; rate.append(b); });
  meta2.append(rate); d.append(meta2);
  return d;
};
window.REVIEW_CARD=ENGINE.reviewCard;
})();
