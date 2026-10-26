"""Step through every chapter step of the given lectures in headless Chromium and report page errors.
Usage: python3 tests/walk.py L07,L08 [--shots]   (screenshots go to /home/claude/work/shots/walk-<id>-<step>.png)"""
import sys, re, json
sys.path.insert(0, __file__.rsplit("/",1)[0])
from playwright.sync_api import sync_playwright
from pw_offline import route
ROOT="file:///home/claude/math127/"
ids=sys.argv[1].split(",")
shots="--shots" in sys.argv
course=open("/home/claude/math127/data/course.js").read()
units={}
for m in re.finditer(r'\{id:"(u\d)", n:(\d)[^\n]*?lectures:\[([^\]]*)\]', course):
    for l in re.findall(r'"(L\d\d)"', m.group(3)): units[l]=m.group(2)
bad=0
with sync_playwright() as p:
    b=p.chromium.launch()
    for theme,w,h in [("light",1280,900),("dark",390,844)]:
        ctx=b.new_context(viewport={"width":w,"height":h}, color_scheme=theme)
        pg=ctx.new_page(); route(pg)
        errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append("console: "+m.text) if m.type=="error" else None)
        for lid in ids:
            u=units.get(lid)
            if not u: print("no unit for",lid); bad+=1; continue
            pg.goto(f"{ROOT}unit-{u}.html#{lid}"); pg.wait_for_timeout(500)
            n=pg.evaluate(f"M127.lec('{lid}').steps.length")
            for i in range(n):
                errs.clear()
                pg.evaluate(f"UNIT_OPEN('{lid}',{i})"); pg.wait_for_timeout(250)
                info=pg.evaluate("""()=>{ const svg=[...document.querySelectorAll('.plate svg.fig')]; const paths=svg.map(s=>s.querySelectorAll('path,line,circle,rect').length);
                  const txt=document.querySelector('#app').innerText; const raw=[...document.querySelectorAll('.panel')].map(p=>p.innerHTML).join(' ');
                  return {paths, bad:/undefined|NaN|\\[object/.test(txt), dollars:(txt.match(/\\$/g)||[]).length, katexErr:document.querySelectorAll('.katex-error').length, overflow:document.documentElement.scrollWidth>window.innerWidth+1}; }""")
                problems=[]
                if errs: problems.append("errors: "+"; ".join(errs[:3]))
                if any(c<3 for c in info["paths"]): problems.append(f"empty figure {info['paths']}")
                if info["bad"]: problems.append("undefined/NaN text")
                if info["katexErr"]: problems.append(f"{info['katexErr']} KaTeX errors")
                if info["overflow"]: problems.append("horizontal overflow")
                if problems: bad+=1; print(f"✗ {lid} step {i+1} [{theme} {w}px]: "+" | ".join(problems))
                if shots and theme=="light": pg.screenshot(path=f"/home/claude/work/shots/walk-{lid}-{i+1}.png")
            # practice + explore tabs
            for tab in ["explore","practice","exam","glossary"]:
                errs.clear(); pg.goto(f"{ROOT}unit-{u}.html#{tab}"); pg.wait_for_timeout(400)
                if errs: bad+=1; print(f"✗ unit {u} tab {tab} [{theme}]: {errs[:3]}")
                ov=pg.evaluate("document.documentElement.scrollWidth>window.innerWidth+1")
                if ov: bad+=1; print(f"✗ unit {u} tab {tab} [{theme} {w}px]: horizontal overflow")
        ctx.close()
    b.close()
print("✓ walk clean" if not bad else f"✗ {bad} issues")
sys.exit(1 if bad else 0)
