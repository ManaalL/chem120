"""Open every page and tab at laptop and phone widths, in light and dark mode, and report errors, broken math, NaN/undefined
text and horizontal overflow. Usage: python3 tests/site.py [--shots]"""
import sys, glob
from common import *
from playwright.sync_api import sync_playwright
R=os.path.join(os.path.dirname(__file__),"..")
shots="--shots" in sys.argv
pages=["index.html","formulas.html","formulas.html#mode=flash","formulas.html#mode=fill","formulas.html#mode=table","gym.html","quiz.html","midterm.html"]
pages+=[os.path.basename(p) for p in sorted(glob.glob(R+"/module-*.html"))]+[os.path.basename(p) for p in sorted(glob.glob(R+"/quiz-*.html"))]
tabs={"midterm.html":["exam","samples","examples","mistakes","plan"],"module-":["chapters","explore","practice","exam","glossary"],"quiz-":["quiz","problems","formulas"]}
bad=0
with sync_playwright() as p:
    b=p.chromium.launch(args=GL_ARGS)
    for theme,w,h in [("light",1280,900),("dark",1280,900),("light",390,844),("dark",390,844)]:
        ctx,pg,errs=new_page(b,theme,w,h)
        for page in pages:
            variants=[None]
            for k,v in tabs.items():
                if page.startswith(k): variants=v
            for tab in variants:
                errs.clear()
                pg.goto(ROOT+page+("#"+tab if tab else "")); pg.wait_for_timeout(700)
                if tab=="explore": pg.mouse.wheel(0,1500); pg.wait_for_timeout(500)
                info=pg.evaluate(CHECK); probs=[]
                if errs: probs.append("errors: "+" | ".join(errs[:3]))
                if info["bad"]: probs.append("undefined/NaN in text")
                if info["kerr"]: probs.append(f"{info['kerr']} KaTeX errors")
                if info["raw"]: probs.append(f"unrendered math {info['raw']}")
                if info["over"]: probs.append(f"horizontal overflow ({info['w']}px)")
                if probs: bad+=1; print(f"✗ {page}{'#'+tab if tab else ''} [{theme} {w}px]: "+"; ".join(probs))
                if shots:
                    name=(page.replace('.html','')+('-'+tab if tab else '')).replace('#','-').replace('=','-')
                    pg.screenshot(path=f"/home/claude/work/shots/site-{name}-{theme}-{w}.png")
        ctx.close()
    b.close()
print("✓ site clean" if not bad else f"✗ {bad} issues")
sys.exit(1 if bad else 0)
