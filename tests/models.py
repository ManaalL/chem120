"""Every 3D figure on the site, on its own: renders with WebGL (not blank, no console errors), frees everything on dispose,
and shows a 2D fallback (not a blank box) with WebGL turned off. Usage: python3 tests/models.py [--shots]"""
import sys, json
from urllib.parse import quote
from common import *
from playwright.sync_api import sync_playwright
shots="--shots" in sys.argv
bad=[]
with sync_playwright() as p:
    b=p.chromium.launch(args=GL_ARGS)
    ctx,pg,errs=new_page(b,"light",900,1000)
    pg.goto(ROOT+"index.html"); pg.wait_for_timeout(500)
    figs=pg.evaluate("""C120.chapters.flatMap(L=>Object.entries(L.figures||{}).filter(([k,f])=>f.model&&typeof f.model!=='function').map(([k,f])=>({id:L.id+'.m.'+k,type:f.model.type,params:f.model.params||{}})))""")
    print(len(figs),"3D figures")
    for f in figs:
        for gl in (True,False):
            errs.clear()
            url=f"{ROOT}tests/sandbox.html?{'' if gl else 'nowebgl=1&'}type={f['type']}&p={quote(json.dumps(f['params']))}"
            pg.goto(url)
            try: pg.wait_for_selector(".v3d[data-ready]" if gl else ".v3d-fallback", timeout=25000)
            except Exception: bad.append(f"{f['id']} {'webgl' if gl else 'fallback'}: did not appear"); continue
            pg.wait_for_timeout(300)
            if gl:
                c=pg.query_selector(".v3d canvas")
                if c and blank_canvas(c): bad.append(f"{f['id']}: blank canvas")
                left=pg.evaluate("(window.MODEL.dispose(), window.C120_3D.live.size)")
                if left: bad.append(f"{f['id']}: {left} viewers alive after dispose")
                if pg.evaluate("document.querySelectorAll('.v3d, .ctl').length"): bad.append(f"{f['id']}: DOM left behind after dispose")
            else:
                fb=pg.query_selector(".v3d-fallback")
                if fb and blank_canvas(fb): bad.append(f"{f['id']}: blank fallback")
            if errs: bad.append(f"{f['id']} {'webgl' if gl else 'fallback'}: "+"; ".join(errs[:3]))
            if shots: pg.screenshot(path=f"/home/claude/work/shots/model-{f['id']}-{'gl' if gl else 'nogl'}.png")
    b.close()
print("\n".join("✗ "+x for x in bad[:80]) if bad else "✓ models clean")
sys.exit(1 if bad else 0)
