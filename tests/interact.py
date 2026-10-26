"""Interaction test in a real browser:
- for every generator at every difficulty, type the stored answer into the real answer box (or click the right option) and
  check that the page says Correct; type a wrong number and check it is rejected
- submits a module mini exam, a PC practice quiz with the timer, and a Test 2 practice test (checks 15 questions)
- flips a flashcard, answers a fill-in-the-blank, rates a sample-test question, opens the study plan, redoes a logged mistake
- asks Ev a question and checks it finds the right chapter"""
import sys, json
from common import *
from playwright.sync_api import sync_playwright
bad=[]
TYPE_JS="""([gid,d])=>{ const host=document.createElement('div'); document.body.append(host);
  const seed=1000+d*17; const {p}=ENGINE.make(gid,seed,d);
  ENGINE.problem(host,{gid,seed,diff:d,showNew:false});
  const out=[]; const boxes=[...host.querySelectorAll('.ans')];
  p.parts.forEach((part,pi)=>{ const a=part.answer, t=a.type||'num'; const box=boxes[pi];
    if(t==='mc'||t==='multi'){ const want=t==='multi'?a.correct:[a.correct]; [...box.querySelectorAll('.opt')].forEach(b=>{ if(want.includes(+b.dataset.i)) b.click(); });
      if(t==='multi'){ const c=[...box.querySelectorAll('button')].find(b=>b.textContent==='Check'); c&&c.click(); }
      out.push(box.querySelector('.fb.ok')?'ok':'mc not accepted'); return; }
    if(t==='firstline'){ if(a.wrong<0){ [...box.querySelectorAll('button')].find(b=>/Every line/.test(b.textContent)).click(); } else box.querySelectorAll('.fl-lines .opt')[a.wrong].click(); out.push(box.querySelector('.fb.ok')?'ok':'firstline not accepted'); return; }
    let s; if(t==='num'){ s=MC.fmtSig(+a.value,a.sf||4)+(a.unit?' '+a.unit:''); } else if(t==='int') s=String(a.value); else if(t==='list') s=a.answer.join(', '); else if(t==='text') s=a.accept[0]; else if(t==='qset'){ if(!a.answer){ out.push('ok'); return; } const w=a.answer; s=`(${w[0]}, ${w[1]}, ${w[2]}${w[3]!=null?', '+(w[3]>0?'+1/2':'-1/2'):''})`; } else s=Array.isArray(a.answer)?a.answer[0]:a.answer;
    const inp=box.querySelector('input[type=text]'); inp.value=s; inp.dispatchEvent(new Event('input')); box.querySelector('.inrow button').click();
    const fb=box.querySelector('.fb'); out.push(fb&&fb.classList.contains('ok')?'ok':'rejected: '+(fb?fb.textContent:'no feedback')+' | typed '+s); });
  host.remove(); return out; }"""
with sync_playwright() as p:
    b=p.chromium.launch(args=GL_ARGS); ctx,pg,errs=new_page(b)
    pg.goto(ROOT+"gym.html"); pg.wait_for_timeout(800)
    gids=pg.evaluate("C120.chapters.flatMap(L=>(L.gens||[]).map(g=>g.id))")
    n=0
    for gid in gids:
        for d in (1,2,3):
            res=pg.evaluate(TYPE_JS,[gid,d]); n+=1
            for r in res:
                if r!="ok": bad.append(f"{gid} d{d}: {r}")
    print(f"typed the stored answer into {n} problems on the real page")
    r=pg.evaluate("""()=>{ const gid=C120.chapters.flatMap(L=>(L.gens||[])).map(g=>g.id).find(id=>{ const {p}=ENGINE.make(id,3,2); return (p.parts[0].answer.type||'num')==='num'; }); if(!gid) return [true,1];
      const host=document.createElement('div'); document.body.append(host); ENGINE.problem(host,{gid,seed:3,diff:2}); const inp=host.querySelector('input[type=text]'); inp.value='123456789'; inp.dispatchEvent(new Event('input')); host.querySelector('.inrow button').click(); const ok=!!host.querySelector('.fb.bad,.fb.warn'); const ml=C120.db().mistakes.length; host.remove(); return [ok,ml]; }""")
    if not r[0]: bad.append("wrong answer was not rejected")
    if r[1]<1: bad.append("mistake was not logged")
    mods=pg.evaluate("C120.COURSE.modules.filter(u=>u.chapters.some(id=>C120.chap(id))).map(u=>u.n)")
    for m in mods:
        pg.goto(f"{ROOT}module-{m}.html#exam"); pg.wait_for_timeout(700)
        pg.once("dialog", lambda dl: dl.accept())
        btn=pg.query_selector("button:text-is(\"10 questions\")") or pg.query_selector(".ex .btn")
        btn.click(); pg.wait_for_timeout(300)
        pg.click("button:text-is(\"Submit\")"); pg.wait_for_timeout(500)
        if not pg.query_selector("text=Results"): bad.append(f"module {m} exam did not show results")
    quizzes=pg.evaluate("C120.COURSE.assessments.filter(q=>q.kind==='pc'&&q.chapters.some(id=>C120.chap(id))).map(q=>q.id.toLowerCase())")
    if quizzes:
        pg.goto(f"{ROOT}quiz-{quizzes[0]}.html"); pg.wait_for_timeout(700)
        pg.check("text=Time me"); pg.click("button:has-text(\"Start\")"); pg.wait_for_timeout(1300)
        t=pg.inner_text(".timer") if pg.query_selector(".timer") else ""
        if ":" not in t: bad.append(f"PC timer not running ({t!r})")
        pg.once("dialog", lambda dl: dl.accept()); pg.click("button:text-is(\"Submit\")"); pg.wait_for_timeout(500)
        if not pg.query_selector("text=Results"): bad.append("PC practice did not show results")
    pg.goto(ROOT+"midterm.html#exam"); pg.wait_for_timeout(900)
    pg.click("button:has-text(\"Start\")"); pg.wait_for_timeout(500)
    cnt=pg.evaluate("document.querySelectorAll('.ex-dots button').length")
    if cnt!=15: bad.append(f"practice test has {cnt} questions, expected 15")
    opts=pg.evaluate("[...document.querySelectorAll('.ex-opt')].length")
    if opts<4: bad.append(f"practice test question shows {opts} options")
    pg.goto(ROOT+"formulas.html#mode=flash"); pg.wait_for_timeout(700)
    pg.click("button:text-is(\"Flip\")"); pg.wait_for_timeout(200); pg.click("button:text-is(\"I knew it\")"); pg.wait_for_timeout(200)
    if pg.evaluate("Object.values(C120.db().leitner).filter(c=>c.box>=2).length")<1: bad.append("flashcard did not move up a box")
    pg.goto(ROOT+"formulas.html#mode=fill"); pg.wait_for_timeout(700)
    acc=pg.evaluate("""()=>{ const tx=document.querySelector('.prob .stmt').textContent; const all=C120.chapters.flatMap(L=>(L.formulas||[]).filter(f=>f.blank)); for(const f of all){ const h=document.createElement('div'); h.innerHTML=C120.tex(f.blank.tex,true); if(h.textContent===tx) return f.blank.accept[0]; } return null; }""")
    if acc is None: bad.append("fill-in-the-blank card not found")
    else:
        pg.fill(".prob input[type=text]",acc); pg.click(".prob .inrow button"); pg.wait_for_timeout(200)
        if not pg.query_selector(".prob .fb.ok"): bad.append(f"fill-in-the-blank rejected its own accepted answer {acc!r}")
    if pg.evaluate("(C120.extras.review||[]).length"):
        pg.goto(ROOT+"midterm.html#samples"); pg.wait_for_timeout(800)
        pg.click(".rate button[data-v=shaky] >> nth=0"); pg.wait_for_timeout(200)
        if pg.evaluate("Object.keys(C120.db().review).length")<1: bad.append("rating not saved")
    pg.goto(ROOT+"midterm.html#plan"); pg.wait_for_timeout(700)
    if not pg.query_selector("text=Go back to these first"): bad.append("study plan missing")
    pg.goto(ROOT+"midterm.html#mistakes"); pg.wait_for_timeout(700)
    btn=pg.query_selector("text=Redo it")
    if not btn: bad.append("no mistakes listed to redo")
    else:
        btn.click(); pg.wait_for_timeout(300)
        if not pg.query_selector(".prob, .opts"): bad.append("redo did not show the problem")
    if pg.evaluate("(C120.extras.examples||[]).length"):
        pg.goto(ROOT+"midterm.html#examples"); pg.wait_for_timeout(700)
        if pg.evaluate("document.querySelectorAll('.rq').length")<1: bad.append("course-notes examples tab is empty")
    pg.goto(ROOT+"index.html"); pg.wait_for_timeout(700)
    pg.evaluate("GUIDE.open('radial nodes')"); pg.wait_for_timeout(300)
    txt=pg.inner_text(".tan-log")
    if "2.6" not in txt: bad.append("Ev did not find radial nodes in chapter 2.6: "+txt[-200:])
    if errs: bad.append("page errors: "+"; ".join(errs[:5]))
    b.close()
print("\n".join("✗ "+x for x in bad[:80]) if bad else "✓ interactions clean")
sys.exit(1 if bad else 0)
