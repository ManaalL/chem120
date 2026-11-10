"""Step through every step of the given chapters in headless Chromium (WebGL on), at laptop and phone widths, light and dark.
For each step: answer the predict question, wait for any 3D model to render, check it is not a blank canvas, check for page
errors, broken math, NaN/undefined and horizontal overflow, and check that models from the previous step were freed.
Usage: python3 tests/walk.py M2C6,M2C7 [--shots] [--fast]   (all chapters if no ids)"""
import sys, re, json
from common import *
from playwright.sync_api import sync_playwright
args=[a for a in sys.argv[1:] if not a.startswith("--")]
shots="--shots" in sys.argv; fast="--fast" in sys.argv
course=open(os.path.join(os.path.dirname(__file__),"..","data","course.js")).read()
bad=0; n3d=0
with sync_playwright() as p:
    b=p.chromium.launch(args=GL_ARGS)
    combos=[("light",1280,900),("dark",390,844)] if not fast else [("light",1280,900)]
    for theme,w,h in combos:
        ctx,pg,errs=new_page(b,theme,w,h)
        pg.goto(ROOT+"index.html"); pg.wait_for_timeout(400)
        ids=args[0].split(",") if args else pg.evaluate("C120.chapters.map(L=>L.id)")
        for cid in ids:
            mod=cid[1]
            pg.goto(f"{ROOT}module-{mod}.html#{cid}"); pg.wait_for_timeout(500)
            if not pg.evaluate(f"!!C120.chap('{cid}')"): print("✗ no chapter",cid); bad+=1; continue
            n=pg.evaluate(f"C120.chap('{cid}').steps.length")
            for i in range(n):
                errs.clear()
                pg.evaluate(f"UNIT_OPEN('{cid}',{i})"); pg.wait_for_timeout(200)
                problems=[]
                live=pg.evaluate("window.C120_3D?window.C120_3D.live.size:0")
                if live>0: problems.append(f"{live} 3D models still alive from the previous step")
                if pg.query_selector(".predict .opt"):
                    pg.click(".predict .opt >> nth=0"); pg.wait_for_timeout(150)
                if pg.query_selector(".fig-body .v3d-wait, .fig-body .v3d"):
                    n3d+=1
                    try: pg.wait_for_selector(".v3d[data-ready], .v3d-fallback", timeout=25000)
                    except Exception: problems.append("3D model did not render within 25 s")
                    pg.wait_for_timeout(250)
                    v=pg.query_selector(".v3d canvas")
                    if v and blank_canvas(v): problems.append("3D canvas is blank")
                    tri=pg.evaluate("window.C120_3D?[...window.C120_3D.live].map(v=>v.renderer.info.render.triangles+v.renderer.info.render.points+v.renderer.info.render.lines):[]")
                    if tri and min(tri)==0: problems.append(f"3D renderer drew nothing {tri}")
                info=pg.evaluate(CHECK)
                if errs: problems.append("errors: "+"; ".join(errs[:3]))
                if info["bad"]: problems.append("undefined/NaN text")
                if info["kerr"]: problems.append(f"{info['kerr']} KaTeX errors")
                if info["raw"]: problems.append(f"unrendered math {info['raw']}")
                if info["over"]: problems.append(f"horizontal overflow ({info['w']}px)")
                if problems: bad+=1; print(f"✗ {cid} step {i+1} [{theme} {w}px]: "+" | ".join(problems))
                if shots and theme=="light": pg.screenshot(path=f"/home/claude/work/shots/walk-{cid}-{i+1}.png")
            pg.evaluate("document.querySelector('[data-t=chapters]').click()"); pg.wait_for_timeout(250)
            live=pg.evaluate("window.C120_3D?window.C120_3D.live.size:0")
            if live: bad+=1; print(f"✗ {cid}: {live} 3D models not freed after leaving the chapter")
        ctx.close()
    b.close()
print(f"checked {n3d} 3D steps")
print("✓ walk clean" if not bad else f"✗ {bad} issues")
sys.exit(1 if bad else 0)
