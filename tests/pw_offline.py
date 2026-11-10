"""Playwright helpers: serve CDN files (KaTeX, Three.js, Google Fonts) from local copies so pages render offline in tests.
Needs: npm i three@0.170.0 katex@0.16.9 @fontsource/... in /home/claude/work (see docs/UPDATING.md)."""
import re, pathlib, os
NM=pathlib.Path(os.environ.get("NODE_MODULES","/home/claude/work/node_modules"))
FONTCSS=(pathlib.Path("/home/claude/work/fonts.css").read_text() if pathlib.Path("/home/claude/work/fonts.css").exists() else "")
CT={".css":"text/css",".js":"application/javascript",".mjs":"application/javascript",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf"}
def _file(route,p):
    p=pathlib.Path(p)
    if p.exists(): return route.fulfill(status=200, content_type=CT.get(p.suffix,"application/octet-stream"), body=p.read_bytes(), headers={"Access-Control-Allow-Origin":"*"})
    return route.fulfill(status=404, body="")
def route(page):
    def handler(route):
        url=route.request.url
        if "fonts.googleapis.com" in url: return route.fulfill(status=200, content_type="text/css", body=FONTCSS)
        if url.startswith("http://fonts.local/"):
            name=url.rsplit("/",1)[1]; hits=list(NM.glob(f"@fontsource/*/files/{name}"))
            return _file(route,hits[0]) if hits else route.fulfill(status=404,body="")
        if "fonts.gstatic.com" in url: return route.fulfill(status=404, body="")
        m=re.search(r"KaTeX/0\.16\.9/(.*)$", url) or re.search(r"katex@0\.16\.9/dist/(.*)$", url)
        if m: return _file(route, NM/"katex"/"dist"/m.group(1))
        m=re.search(r"three@0\.170\.0/(.*)$", url)
        if m: return _file(route, NM/"three"/m.group(1))
        if url.startswith("https://api.anthropic.com"): return route.fulfill(status=401, body="{}")
        return route.continue_()
    page.route("**/*", handler)
