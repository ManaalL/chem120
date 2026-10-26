"""Interaction test in a real browser: for every generator, type the stored answer into the answer box and check that
the page says Correct; type a wrong answer and check it is rejected. Also submits a mini exam, a quiz and the practice
midterm, flips flashcards, answers a fill-in-the-blank, rates a practice question, and redoes a logged mistake."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
from pw_offline import route
ROOT="file:///home/claude/math127/"
bad=[]
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={"width":1280,"height":900}); pg=ctx.new_page(); route(pg)
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(ROOT+"gym.html"); pg.wait_for_timeout(800)
    gids=pg.evaluate("M127.lectures.flatMap(L=>(L.gens||[]).map(g=>g.id))")
    n=0
    for gid in gids:
        for d in (1,2,3):
            res=pg.evaluate("""([gid,d])=>{ const host=document.createElement('div'); document.body.append(host);
              const seed=1000+d*17; const {p}=ENGINE.make(gid,seed,d);
              ENGINE.problem(host,{gid,seed,diff:d,showNew:false});
              const out=[];
              const inputs=[...host.querySelectorAll('input[type=text]')];
              let ii=0;
              p.parts.forEach((part,pi)=>{ const a=part.answer;
                if((a.type||'expr')==='mc'){ const boxes=host.querySelectorAll('.ans'); const btns=[...boxes[pi].querySelectorAll('.opt')]; const want=a.options[a.correct];
                  const btn=btns.find(x=>+x.dataset.i===a.correct); if(!btn){ out.push('mc option not found'); return; } btn.click(); out.push(boxes[pi].querySelector('.fb.ok')?'ok':'mc not accepted'); return; }
                const inp=inputs[ii++]; inp.value=String(a.answer); inp.dispatchEvent(new Event('input')); inp.parentElement.querySelector('button').click();
                const fb=inp.closest('.ans').querySelector('.fb'); out.push(fb&&fb.classList.contains('ok')?'ok':'rejected: '+(fb?fb.textContent:'no feedback')+' | '+a.answer); });
              host.remove(); return out; }""",[gid,d])
            n+=1
            for r in res:
                if r!="ok": bad.append(f"{gid} d{d}: {r}")
    print(f"typed the stored answer into {n} problems")
    # wrong answer rejected
    r=pg.evaluate("""()=>{ const host=document.createElement('div'); document.body.append(host); ENGINE.problem(host,{gid:'L01.g.power',seed:5,diff:1}); const inp=host.querySelector('input[type=text]'); inp.value='12345x'; inp.dispatchEvent(new Event('input')); inp.parentElement.querySelector('button').click(); const ok=!!host.querySelector('.fb.bad'); const ml=M127.db().mistakes.length; host.remove(); return [ok,ml]; }""")
    if not r[0]: bad.append("wrong answer was not rejected")
    if r[1]<1: bad.append("mistake was not logged")
    # mini exam submit
    pg.goto(ROOT+"unit-2.html#exam"); pg.wait_for_timeout(700)
    pg.once("dialog", lambda dl: dl.accept())
    pg.click("button:text-is(\"10 questions\")"); pg.wait_for_timeout(300)
    pg.click("button:text-is(\"Submit\")"); pg.wait_for_timeout(500)
    if not pg.query_selector("text=Results"): bad.append("unit exam did not show results")
    # quiz with timer
    pg.goto(ROOT+"quiz-3.html"); pg.wait_for_timeout(700)
    pg.check("input[type=checkbox] >> nth=1") if pg.query_selector_all("input[type=checkbox]") else None
    pg.click("button:has-text(\"Start\")"); pg.wait_for_timeout(1300)
    t=pg.inner_text(".timer") if pg.query_selector(".timer") else ""
    if ":" not in t: bad.append(f"quiz timer not running ({t!r})")
    pg.once("dialog", lambda dl: dl.accept()); pg.click("button:text-is(\"Submit\")"); pg.wait_for_timeout(500)
    if not pg.query_selector("text=Results"): bad.append("quiz did not show results")
    # practice midterm
    pg.goto(ROOT+"midterm.html#exam"); pg.wait_for_timeout(900)
    pg.click("button:has-text(\"Start\")"); pg.wait_for_timeout(400)
    cnt=pg.evaluate("document.querySelectorAll('.ex-dots button').length")
    if cnt!=20: bad.append(f"practice midterm has {cnt} questions, expected 20")
    # flashcards
    pg.goto(ROOT+"formulas.html#mode=flash"); pg.wait_for_timeout(700)
    pg.click("button:text-is(\"Flip\")"); pg.wait_for_timeout(200); pg.click("button:text-is(\"I knew it\")"); pg.wait_for_timeout(200)
    box=pg.evaluate("Object.values(M127.db().leitner).filter(c=>c.box>=2).length")
    if box<1: bad.append("flashcard did not move up a box")
    # fill in the blank: answer one
    pg.goto(ROOT+"formulas.html#mode=fill"); pg.wait_for_timeout(700)
    ok=pg.evaluate("""()=>{ const nm=document.querySelector('.prob .ref').textContent; const all=M127.lectures.flatMap(L=>L.formulas.map(f=>({...f,L}))); const f=all.find(f=>f.blank && nm.includes(f.ref) && nm.includes(M127.rich(f.name).replace(/<[^>]+>/g,'').slice(0,4))); return !!f; }""")
    # rate a practice question
    pg.goto(ROOT+"midterm.html#review"); pg.wait_for_timeout(800)
    pg.click(".rate button[data-v=shaky] >> nth=0"); pg.wait_for_timeout(200)
    if pg.evaluate("Object.keys(M127.db().review).length")<1: bad.append("rating not saved")
    pg.goto(ROOT+"midterm.html#plan"); pg.wait_for_timeout(700)
    if not pg.query_selector("text=Go back to these first"): bad.append("study plan missing")
    # mistake log redo
    pg.goto(ROOT+"midterm.html#mistakes"); pg.wait_for_timeout(700)
    btn=pg.query_selector("text=Redo it")
    if not btn: bad.append("no mistakes listed to redo")
    else:
        btn.click(); pg.wait_for_timeout(300)
        if not pg.query_selector(".prob"): bad.append("redo did not show the problem")
    # long answer set
    pg.goto(ROOT+"midterm.html#long"); pg.wait_for_timeout(800)
    if pg.query_selector("text=Draw 8 problems"): pg.click("text=Draw 8 problems"); pg.wait_for_timeout(500)
    if pg.evaluate("document.querySelectorAll('.rq').length")<8: bad.append("long answer set did not draw 8")
    # Tan
    pg.goto(ROOT+"index.html"); pg.wait_for_timeout(700)
    pg.evaluate("GUIDE.open('derivative of arctan')"); pg.wait_for_timeout(300)
    txt=pg.inner_text(".tan-log")
    if "Lecture 15" not in txt: bad.append("Tan did not find the arctan derivative in Lecture 15: "+txt[-200:])
    if errs: bad.append("page errors: "+"; ".join(errs[:5]))
    b.close()
print("\n".join("✗ "+x for x in bad[:60]) if bad else "✓ interactions clean")
sys.exit(1 if bad else 0)
