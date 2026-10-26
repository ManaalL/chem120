"""Open every page at laptop and phone widths, in light and dark mode, and report errors, broken math, NaN/undefined text and horizontal overflow.
Also clicks through every tab. Usage: python3 tests/site.py [--shots]"""
import sys, glob, os
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
from pw_offline import route
ROOT="/home/claude/math127/"
shots="--shots" in sys.argv
pages=["index.html","formulas.html","formulas.html#mode=flash","formulas.html#mode=fill","gym.html","quiz.html","midterm.html"]
pages+= [os.path.basename(p) for p in sorted(glob.glob(ROOT+"unit-*.html"))]
pages+= [os.path.basename(p) for p in sorted(glob.glob(ROOT+"quiz-*.html"))]
tabs={"midterm.html":["exam","long","review","mistakes","plan"],"unit":["lectures","explore","practice","exam","glossary"],"quiz-":["quiz","problems","prof","formulas"]}
bad=0
CHECK="""()=>{ const t=document.body.innerText; return {bad:/\\bundefined\\b|\\bNaN\\b|\\[object/.test(t), kerr:document.querySelectorAll('.katex-error').length, raw:(t.match(/\\$[^$\\n]{1,60}\\$/g)||[]).slice(0,2), over:document.documentElement.scrollWidth>window.innerWidth+1, w:document.documentElement.scrollWidth}; }"""
with sync_playwright() as p:
    b=p.chromium.launch()
    for theme,w,h in [("light",1280,900),("dark",1280,900),("light",390,844),("dark",390,844)]:
        ctx=b.new_context(viewport={"width":w,"height":h}, color_scheme=theme)
        pg=ctx.new_page(); route(pg)
        errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append("console: "+m.text) if m.type=="error" else None)
        for page in pages:
            variants=[None]
            for k,v in tabs.items():
                if page.startswith(k): variants=v
            for tab in variants:
                errs.clear()
                url=ROOT+page+("#"+tab if tab else "")
                pg.goto("file://"+url); pg.wait_for_timeout(600)
                info=pg.evaluate(CHECK)
                probs=[]
                if errs: probs.append("errors: "+" | ".join(errs[:3]))
                if info["bad"]: probs.append("undefined/NaN in text")
                if info["kerr"]: probs.append(f"{info['kerr']} KaTeX errors")
                if info["raw"]: probs.append(f"unrendered math {info['raw']}")
                if info["over"]: probs.append(f"horizontal overflow ({info['w']}px)")
                if probs:
                    bad+=1; print(f"✗ {page}{'#'+tab if tab else ''} [{theme} {w}px]: "+"; ".join(probs))
                if shots:
                    name=(page.replace('.html','')+('-'+tab if tab else '')).replace('#','-').replace('=','-')
                    pg.screenshot(path=f"/home/claude/work/shots/site-{name}-{theme}-{w}.png")
        ctx.close()
    b.close()
print("✓ site clean" if not bad else f"✗ {bad} issues")
sys.exit(1 if bad else 0)
