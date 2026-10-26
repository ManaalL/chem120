"""Shared helpers for the browser tests. Pages are served over HTTP (ES modules don't load from file://).
Start a server first:  cd /home/claude/chem120 && python3 -m http.server 8123   (or set PORT)."""
import os, sys, io
sys.path.insert(0, os.path.dirname(__file__))
from pw_offline import route
PORT=os.environ.get("PORT","8123")
ROOT=f"http://localhost:{PORT}/"
GL_ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
CHECK="""()=>{ const t=document.body.innerText; return {bad:/\\bundefined\\b|\\bNaN\\b|\\[object|Infinity/.test(t), kerr:document.querySelectorAll('.katex-error').length, raw:(t.match(/\\$[^$\\n]{1,60}\\$/g)||[]).slice(0,2), over:document.documentElement.scrollWidth>window.innerWidth+1, w:document.documentElement.scrollWidth}; }"""
def blank_canvas(el_handle):
    """True if a rendered element is (nearly) one flat colour."""
    from PIL import Image, ImageStat
    png=el_handle.screenshot()
    im=Image.open(io.BytesIO(png)).convert("L")
    st=ImageStat.Stat(im)
    return st.stddev[0] < 4
def new_page(b, theme="light", w=1280, h=900):
    ctx=b.new_context(viewport={"width":w,"height":h}, color_scheme=theme)
    pg=ctx.new_page(); route(pg); errs=[]
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append("console: "+m.text) if m.type=="error" else None)
    return ctx, pg, errs
