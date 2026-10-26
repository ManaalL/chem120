/* CHEM 120 Interactive: exam engine for mini exams, quiz prep and the practice tests.
   Items: {kind:"mc", id, lec, q, opts:[[text,correct,why]], multi} or {kind:"gen", gid, seed, diff, lec}.
   No feedback until submit. Then a breakdown by lecture and a list of what to relearn.
   cfg: {key, title, intro, items | build(sel)->items, sizes, picker:[{id,label}], timeLimit (min), timed:true} */
(function(){
"use strict";
const M=window.C120, el=M.el, rich=M.rich, esc=M.esc;

function topicLabel(lid){ const L=M.chap(lid); return L?`${L.num} ${L.title.replace(/\$[^$]*\$/g,"")}`:lid; }
function correctMC(q,a){ if(a==null) return false; const right=q.opts.map((o,i)=>o[1]?i:-1).filter(i=>i>=0); const sel=Array.isArray(a)?a:[a]; return sel.length===right.length && sel.every(i=>right.includes(i)); }
function pick(items,n){
  if(n>=items.length) return M.shuffle(items);
  const by={}; M.shuffle(items).forEach(q=>{ (by[q.lec]=by[q.lec]||[]).push(q); });
  const keys=M.shuffle(Object.keys(by)), out=[];
  while(out.length<n){ let added=false; for(const k of keys){ if(by[k].length && out.length<n){ out.push(by[k].pop()); added=true; } } if(!added) break; }
  return M.shuffle(out);
}

function mount(root,cfg){
  let qs=[], ans=[], flags=[], cur=0, timer=null, endAt=0, timed=!!cfg.timed;
  root.innerHTML=""; const wrap=el("div",{class:"ex"}); root.append(wrap);
  const saved=()=>M.db().exam[cfg.key];
  function pool(){ return typeof cfg.items==="function"?cfg.items():cfg.items; }
  function start(){
    stopTimer(); wrap.innerHTML="";
    const s=saved(); const c=el("div",{class:"card"});
    const items=pool();
    c.innerHTML=`<h2>${esc(cfg.title)}</h2>${cfg.intro?`<p>${rich(cfg.intro)}</p>`:""}
      <p class="muted">Like the real thing: no hints or feedback until you submit. You can skip, flag questions to come back to, and change answers. Afterwards you get a breakdown by chapter and a list of what to relearn.</p>
      ${s?`<p><b>Last attempt:</b> ${s.last}% &nbsp; <b>Best:</b> ${s.best}% &nbsp; <span class="muted">(${s.attempts} attempt${s.attempts>1?"s":""})</span></p>`:""}`;
    if(cfg.picker) c.append(cfg.picker(()=>start()));
    if(cfg.allowTimer){
      const lab=el("label",{class:"row",style:"margin:4px 0 10px;font-weight:600"});
      const cb=el("input",{type:"checkbox"}); cb.checked=timed; cb.onchange=()=>{ timed=cb.checked; };
      lab.append(cb, document.createTextNode(` Time me (${cfg.timeLimit} minutes, like the real one)`)); c.append(lab);
    }
    const row=el("div",{class:"row"});
    const sizes=(cfg.sizes||[10]).filter(n=>n<items.length);
    sizes.forEach(n=>row.append(el("button",{class:"btn",type:"button",onclick:()=>begin(items,n)},`${n} questions`)));
    row.append(el("button",{class:"btn"+(sizes.length?" ghost":""),type:"button",disabled:items.length?null:"disabled",onclick:()=>begin(items,cfg.fixedSize||items.length)},cfg.fixedSize?`Start (${Math.min(cfg.fixedSize,items.length)} questions)`:`All ${items.length} questions`));
    c.append(row); wrap.append(c);
    if(s && s.topics) wrap.append(breakdown(s.topics));
  }
  function begin(items,n){
    const chosen = cfg.select? cfg.select(items,n) : pick(items,n);
    qs=chosen.map(q=>{ if(q.kind==="gen"){ const seed=q.seed!=null?q.seed:M.newSeed(); let made=null; try{ made=ENGINE.make(q.gid,seed,q.diff||2); }catch(e){ console.error(e); } return {...q,seed,made}; } return {...q,order:q.keep?q.opts.map((o,i)=>i):M.shuffle(q.opts.map((o,i)=>i))}; }).filter(q=>q.kind!=="gen"||q.made);
    ans=qs.map(q=>q.kind==="gen"?q.made.p.parts.map(()=>""):(q.multi?[]:null)); flags=qs.map(()=>false); cur=0;
    if(timed && cfg.timeLimit){ endAt=Date.now()+cfg.timeLimit*60000; timer=setInterval(tick,1000); }
    show(); root.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function stopTimer(){ if(timer){ clearInterval(timer); timer=null; } }
  function tick(){ const t=root.querySelector(".timer"); const left=Math.max(0,endAt-Date.now()); if(t){ const m=Math.floor(left/60000), s=Math.floor(left%60000/1000); t.textContent=`${m}:${String(s).padStart(2,"0")}`; t.classList.toggle("low",left<5*60000); } if(left<=0){ stopTimer(); submit(true); } }
  const answered=i=>{ const a=ans[i]; if(qs[i].kind==="gen") return a.some(x=>String(x).trim()); return Array.isArray(a)?a.length>0:a!=null; };
  function show(){
    wrap.innerHTML=""; const q=qs[cur]; const c=el("div",{class:"card"});
    const n=qs.filter((_,i)=>answered(i)).length;
    c.innerHTML=`<div class="row" style="justify-content:space-between"><b>Question ${cur+1} of ${qs.length}</b>${timer?`<span class="timer" aria-live="off">--:--</span>`:""}<span class="muted">${n} answered</span></div><div class="ex-prog"><i style="width:${n/qs.length*100}%"></i></div>`;
    if(q.kind==="gen"){
      const p=q.made.p; c.append(el("div",{class:"ex-q",rich:p.prompt}));
      p.parts.forEach((part,pi)=>{ const a=part.answer, t=a.type||"expr";
        const box=el("div",{class:"ans"}); if(part.label||p.parts.length>1) box.append(el("label",{rich:part.label||`Part ${pi+1}`}));
        if(t==="mc"){ a.options.forEach((o,oi)=>{ const b=el("button",{class:"ex-opt"+(ans[cur][pi]===String(oi)?" sel":""),type:"button"},el("span",{class:"l"},"ABCDEF"[oi]),el("span",{rich:o})); b.onclick=()=>{ ans[cur][pi]= ans[cur][pi]===String(oi)?"":String(oi); show(); }; box.append(b); }); }
        else if(t==="multi"){ box.append(el("p",{class:"muted small"},"Select all that apply.")); const cur0=String(ans[cur][pi]||"").split(",").filter(Boolean); a.options.forEach((o,oi)=>{ const on=cur0.includes(String(oi)); const b=el("button",{class:"ex-opt"+(on?" sel":""),type:"button","aria-pressed":String(on)},el("span",{class:"l"},"ABCDEF"[oi]),el("span",{rich:o})); b.onclick=()=>{ const set=new Set(String(ans[cur][pi]||"").split(",").filter(Boolean)); if(set.has(String(oi))) set.delete(String(oi)); else set.add(String(oi)); ans[cur][pi]=[...set].sort().join(","); show(); }; box.append(b); }); }
        else if(t==="firstline"){ box.append(el("p",{class:"muted small"},"Click the first line with a mistake.")); a.lines.forEach((ln,li)=>{ const b=el("button",{class:"ex-opt"+(ans[cur][pi]===String(li)?" sel":""),type:"button"},el("span",{class:"l"},String(li+1)),el("span",{rich:ln})); b.onclick=()=>{ ans[cur][pi]=ans[cur][pi]===String(li)?"":String(li); show(); }; box.append(b); }); }
        else { const inp=el("input",{type:"text",autocomplete:"off",spellcheck:"false",value:ans[cur][pi],"aria-label":"Your answer"}); const pre=el("div",{class:"pre"});
          const upd=()=>{ ans[cur][pi]=inp.value; const r=MC.preview(inp.value,t); if(r.error){ pre.className="pre err"; pre.textContent=r.error; } else { pre.className="pre"; pre.innerHTML=r.tex?M.tex(r.tex):`<span class="lab">Preview</span>`; } };
          inp.addEventListener("input",()=>{ upd(); dots(); }); upd(); const row=el("div",{class:"inrow"}); row.append(inp); box.append(row,pre); }
        c.append(box); });
    } else {
      c.append(el("div",{class:"ex-q",rich:q.q}));
      if(q.multi) c.append(el("p",{class:"muted small"},"Select all that apply."));
      q.order.forEach((oi,k)=>{ const o=q.opts[oi]; const sel=q.multi?ans[cur].includes(oi):ans[cur]===oi;
        const b=el("button",{class:"ex-opt"+(sel?" sel":""),type:"button"},el("span",{class:"l"},"ABCDEF"[k]),el("span",{rich:o[0]}));
        b.onclick=()=>{ if(q.multi){ const a=ans[cur]; const j=a.indexOf(oi); if(j>=0) a.splice(j,1); else a.push(oi); } else ans[cur]= ans[cur]===oi?null:oi; show(); };
        c.append(b); });
    }
    const fl=el("button",{class:"sbtn",type:"button",onclick:()=>{ flags[cur]=!flags[cur]; show(); }}, flags[cur]?"Flagged":"Flag to come back");
    const nav=el("div",{class:"row",style:"justify-content:space-between;margin-top:12px"});
    const left=el("div",{class:"row"}); left.append(el("button",{class:"btn ghost",type:"button",disabled:cur===0?"disabled":null,onclick:()=>{ cur--; show(); }},"Back"), fl);
    const right=el("div",{class:"row"});
    if(cur<qs.length-1) right.append(el("button",{class:"btn",type:"button",onclick:()=>{ cur++; show(); }},answered(cur)?"Next":"Skip"));
    right.append(el("button",{class:cur<qs.length-1?"btn ghost":"btn",type:"button",onclick:()=>submit(false)},"Submit"));
    nav.append(left,right); c.append(nav);
    const d=el("div",{class:"ex-dots","aria-label":"Jump to question"}); c.append(d);
    function dots(){ d.innerHTML=""; qs.forEach((_,i)=>{ const b=el("button",{type:"button",class:(answered(i)?"ans ":"")+(i===cur?"cur ":"")+(flags[i]?"flg":""),"aria-label":`Question ${i+1}`},String(i+1)); b.onclick=()=>{ cur=i; show(); }; d.append(b); }); }
    dots();
    wrap.append(c); if(timer) tick();
  }
  function grade(i){
    const q=qs[i];
    if(q.kind==="gen"){ const p=q.made.p; return p.parts.every((part,pi)=>{ const a=part.answer, t=a.type||"num"; if(t==="mc") return ans[i][pi]===String(a.correct); if(t==="multi") return String(ans[i][pi]||"")===a.correct.slice().sort().map(String).join(","); if(t==="firstline") return ans[i][pi]===String(a.wrong); const r=MC.check(ans[i][pi],a); return r.ok; }); }
    return correctMC(q,ans[i]);
  }
  function submit(auto){
    const un=qs.filter((_,i)=>!answered(i)).length, fl=flags.filter(Boolean).length;
    if(!auto && (un||fl) && !confirm(`${un?`${un} unanswered`:""}${un&&fl?" and ":""}${fl?`${fl} flagged`:""}. Submit anyway?`)) return;
    stopTimer();
    const topics={}; let right=0; const res=qs.map((q,i)=>grade(i));
    qs.forEach((q,i)=>{ const ok=res[i]; if(ok) right++; topics[q.lec]=topics[q.lec]||{right:0,total:0}; topics[q.lec].total++; if(ok) topics[q.lec].right++;
      if(q.kind==="gen"){ M.recordAttempt(q.gid,ok,true); if(!ok) M.logMistake({gid:q.gid,seed:q.seed,diff:q.diff||2,lec:q.lec,src:cfg.title}); }
      else if(!ok) M.logMistake({mc:q.id,lec:q.lec,src:cfg.title}); });
    const pct=Math.round(right/qs.length*100);
    const db=M.db(); const prev=db.exam[cfg.key]||{best:0,attempts:0};
    db.exam[cfg.key]={last:pct,best:Math.max(prev.best||0,pct),attempts:(prev.attempts||0)+1,topics,when:Date.now(),n:qs.length}; M.save();
    results(right,pct,topics,prev,res,auto);
  }
  function breakdown(topics){
    const c=el("div",{class:"card"}); c.append(el("h3",{},"By chapter"));
    Object.keys(topics).sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true})).forEach(k=>{ const t=topics[k], f=t.right/t.total; const col=f>=.8?"#2a7648":f>=.6?"#d9a12b":"#c0482f";
      c.append(el("div",{class:"acc",html:`<span>${esc(topicLabel(k))}</span><span class="bar"><i style="width:${Math.max(4,f*100)}%;background:${col}"></i></span><span class="n">${t.right}/${t.total}</span>`})); });
    return c;
  }
  function results(right,pct,topics,prev,res,auto){
    wrap.innerHTML=""; const s=saved(); const c=el("div",{class:"card"});
    const msg=pct>=85?"Strong. You know this material.":pct>=70?"Solid, with a few gaps to close.":pct>=50?"Getting there. Work on the chapters below.":"This needs another pass. Start with the weakest chapter below.";
    c.innerHTML=`<h2>Results${auto?" (time's up)":""}</h2><div class="ex-score"><div><div class="big">${right}/${qs.length}</div><div class="muted">correct (${pct}%)</div></div><div><div class="big" style="color:var(--head)">${s.best}%</div><div class="muted">${prev.attempts?(pct>(prev.best||0)?"new personal best":"your best"):"your first score"}</div></div></div><p>${msg}</p>`;
    const weak=Object.keys(topics).map(k=>({k,...topics[k],f:topics[k].right/topics[k].total})).filter(t=>t.f<.75).sort((a,b)=>a.f-b.f);
    if(weak.length){ const box=el("div",{class:"relearn"}); box.append(el("b",{},"Relearn these")); const ul=el("ul",{style:"margin:8px 0 0;padding-left:18px"});
      weak.forEach(t=>{ const li=el("li",{html:`<b>${esc(topicLabel(t.k))}</b>: ${t.right} of ${t.total} right. `}); li.append(el("a",{href:M.chURL(t.k)},"Open the chapter")); ul.append(li); });
      box.append(ul); c.append(box); }
    else c.append(el("p",{style:"font-weight:600;color:var(--ok)"},"Nothing below 75% in any chapter."));
    const row=el("div",{class:"row",style:"margin-top:8px"});
    row.append(el("button",{class:"btn",type:"button",onclick:()=>begin(pool(),qs.length)},"Retake with new questions"));
    const missed=qs.filter((q,i)=>!res[i]);
    if(missed.length) row.append(el("button",{class:"btn ghost",type:"button",onclick:()=>{ qs=missed.map(q=>q.kind==="gen"?{...q}:{...q,order:M.shuffle(q.opts.map((o,i)=>i))}); ans=qs.map(q=>q.kind==="gen"?q.made.p.parts.map(()=>""):(q.multi?[]:null)); flags=qs.map(()=>false); cur=0; show(); }},`Redo the ${missed.length} I missed`));
    row.append(el("button",{class:"btn ghost",type:"button",onclick:start},"Back to start"));
    c.append(row); wrap.append(c, breakdown(topics));
    const rv=el("div",{class:"card rev"}); rv.append(el("h3",{},"Every question, with the answer"));
    qs.forEach((q,i)=>{ const ok=res[i], blank=!answered(i); const d=el("details");
      let body="";
      if(q.kind==="gen"){ const p=q.made.p; body=`<p><b>Your answer:</b> ${p.parts.map((pt,pi)=>{ const a=ans[i][pi]; if(!a) return "(blank)"; const ty=pt.answer.type||"num"; if(ty==="mc") return rich(pt.answer.options[+a]); if(ty==="multi") return a.split(",").map(k=>rich(pt.answer.options[+k])).join("; "); if(ty==="firstline") return "line "+(+a+1); const pv=MC.preview(a,pt.answer.type); return pv.tex?M.tex(pv.tex):esc(a); }).join("; ")}</p>${p.answerTeX?`<p class="right"><b>Answer:</b> ${rich(p.answerTeX)}</p>`:""}<ol>${(p.steps||[]).map(s=>`<li>${rich(s)}</li>`).join("")}</ol>`;
        d.innerHTML=`<summary><span class="mk ${blank?"skip":ok?"ok":"no"}">${blank?"–":ok?"✓":"✗"}</span><span>${rich(p.prompt)} <span class="pill">Ch ${M.chap(q.lec).num}</span></span></summary><div class="body">${body}</div>`; }
      else { const ri=q.opts.map((o,j)=>o[1]?j:-1).filter(j=>j>=0); const yours=q.multi?ans[i]:(ans[i]==null?[]:[ans[i]]);
        body=`${yours.length&&!ok?`<p style="color:var(--bad)"><b>You chose:</b> ${yours.map(j=>rich(q.opts[j][0])).join("; ")}</p>`:""}<p style="color:var(--ok)"><b>Answer:</b> ${ri.map(j=>rich(q.opts[j][0])).join("; ")}</p><p>${rich(ri.map(j=>q.opts[j][2]).filter(Boolean).join(" "))}</p>${q.ref?`<p class="ref">${esc(M.refText(q.lec,q.ref))}</p>`:""}`;
        d.innerHTML=`<summary><span class="mk ${blank?"skip":ok?"ok":"no"}">${blank?"–":ok?"✓":"✗"}</span><span>${rich(q.q)} <span class="pill">Ch ${M.chap(q.lec).num}</span></span></summary><div class="body">${body}</div>`; }
      rv.append(d); });
    wrap.append(rv); root.scrollIntoView({behavior:"smooth",block:"start"});
  }
  start();
  return {restart:start};
}
window.EXAM={mount, correctMC};
})();
