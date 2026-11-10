/* CHEM 120 Interactive: penetration and shielding (Module 3, pp. 1-4 and 10-12), drawn with hydrogen-like functions.
   A radial plot of r^2 R^2 for 1s (the core) and the compared orbitals (2s and 2p by default; 3s, 3p, 3d also), with the probability
   of each compared orbital inside the cut-off radius shaded and integrated numerically. Beside it in 3D, nested see-through spherical
   shells at the most probable radii, cut open so the inner ones show, including the small inner humps (2s inside the 1s shell).
   The notes describe shielding in words only; the curves here are hydrogen-atom functions (Z = 1, hydrogen.mjs) used as a picture.
   params: {compare: ["2s","2p"] | ["3s","3p","3d"] | any of 2s 2p 3s 3p 3d, r: cut-off radius in a0 (default 1, the 1s most probable radius)} */
import { THREE, Viewer, surfaceMaterial } from "./viewer.mjs";
import * as H from "./hydrogen.mjs";

function el(t, a = {}, ...k) { const e = document.createElement(t); for (const x in a) { if (a[x] == null || a[x] === false) continue; if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; }
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ORB = { "1s": [1, 0], "2s": [2, 0], "2p": [2, 1], "3s": [3, 0], "3p": [3, 1], "3d": [3, 2] };
const CHOICES = ["2s", "2p", "3s", "3p", "3d"];
/* colour plus a dash pattern, so curves never rely on colour alone */
const STYLE = { "1s": { css: "var(--ink2)", pal: "ink2", dash: "" }, "2s": { css: "var(--phase-pos)", pal: "pos", dash: "" }, "2p": { css: "var(--phase-neg)", pal: "neg", dash: "8 4" },
  "3s": { css: "var(--phase-pos)", pal: "pos", dash: "" }, "3p": { css: "var(--phase-neg)", pal: "neg", dash: "8 4" }, "3d": { css: "var(--warn)", pal: "warn", dash: "2 3" } };
const f = (id) => (r) => H.rdf(ORB[id][0], ORB[id][1], r);
/* probability inside radius rc: Simpson's rule on r^2 R^2, divided by the integral to 80 a0 (which is 1 to within 1e-6) */
function integrate(fn, a, b, n = 2000) { n += n % 2; const h = (b - a) / n; let s = fn(a) + fn(b); for (let i = 1; i < n; i++) s += fn(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; }
const totals = {}; const total = (id) => totals[id] || (totals[id] = integrate(f(id), 0, 80, 8000));
export const fracInside = (id, rc) => integrate(f(id), 0, rc, 1200) / total(id);
const PK = {}; export const peaks = (id) => PK[id] || (PK[id] = H.rdfPeaks(ORB[id][0], ORB[id][1]));
const mainPeak = (id) => peaks(id).reduce((b, p) => (p.value > b.value ? p : b));
const normCompare = (c) => { const L = (Array.isArray(c) ? c : typeof c === "string" ? c.split(/[ ,]+/) : ["2s", "2p"]).filter((x) => CHOICES.includes(x)); return L.length ? [...new Set(L)].slice(0, 3) : ["2s", "2p"]; };

/* ---------- the plot and readout (used with and without WebGL) ---------- */
function plotPanel(host, st, onCut) {
  const plotHost = el("div", { class: "sh-plot" }); host.append(plotHost);
  const zoomSeg = el("div", { class: "seg sm", role: "group", "aria-label": "Plot range" });
  [["all", "Whole range"], ["zoom", "Zoom in: r < 4 a₀"]].forEach(([k, t]) => { const b = el("button", { type: "button", "aria-pressed": String(st.zoom === (k === "zoom")) }, t); b.onclick = () => { st.zoom = k === "zoom"; zoomSeg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw(); }; zoomSeg.append(b); });
  host.insertBefore(zoomSeg, plotHost);
  let G = null, shades = {}, vl = null, cutLab = null;
  function draw() {
    plotHost.innerHTML = "";
    const n3 = st.compare.some((id) => id[0] === "3");
    const xmax = st.zoom ? 4 : n3 ? 24 : 13;
    let ymax = 0.6;
    if (st.zoom) { ymax = 0; st.compare.forEach((id) => { for (let i = 0; i <= 200; i++) ymax = Math.max(ymax, f(id)((i / 200) * xmax)); }); ymax *= 1.3; }
    G = window.PLOT.graph(plotHost, { x: [0, xmax], y: [0, ymax], w: 560, h: 240, xlabel: "r / a₀", ylabel: "r²R²", grid: true, label: "Radial probability of the 1s core and the compared orbitals", ystep: window.PLOT.niceStep(ymax, 4), xstep: st.zoom ? 0.5 : n3 ? 2 : 1 });
    /* keep curves inside the axes when the 1s peak runs off the top of the zoomed view */
    const NSV = "http://www.w3.org/2000/svg", cid = "shclip" + Math.random().toString(36).slice(2, 7);
    const defs = document.createElementNS(NSV, "defs"), cp = document.createElementNS(NSV, "clipPath"), rect = document.createElementNS(NSV, "rect");
    cp.setAttribute("id", cid); rect.setAttribute("x", G.X(0)); rect.setAttribute("y", G.Y(ymax)); rect.setAttribute("width", G.X(xmax) - G.X(0)); rect.setAttribute("height", G.Y(0) - G.Y(ymax)); cp.append(rect); defs.append(cp); G.svg.prepend(defs);
    G.layer.main.setAttribute("clip-path", `url(#${cid})`); G.layer.back.setAttribute("clip-path", `url(#${cid})`);
    /* 1s core: filled grey */
    const core = G.area(f("1s"), 0, xmax, { noNeg: true }); core.style.setProperty("--c", "var(--fig-axis)"); core.querySelectorAll("path").forEach((p) => p.style.fillOpacity = ".18");
    const p1 = G.fn(f("1s"), { cls: "cv" }); p1.style.stroke = "var(--ink2)"; p1.style.strokeWidth = "2.6";
    shades = {};
    st.compare.forEach((id) => { const s = G.area(f(id), 0, st.r, { noNeg: true }); s.style.setProperty("--c", STYLE[id].css); s.querySelectorAll("path").forEach((p) => p.style.fillOpacity = ".32"); shades[id] = s;
      const p = G.fn(f(id), { cls: "cv" }); p.style.stroke = STYLE[id].css; p.style.strokeWidth = "2.4"; if (STYLE[id].dash) p.style.strokeDasharray = STYLE[id].dash; });
    /* curve labels at the main peaks, or at the right edge when the peak is off the plot */
    const lab = (id, txt) => { const pk = mainPeak(id); let x = pk.r, y = pk.value; if (x > xmax * 0.96 || y > ymax) { x = Math.min(xmax * 0.86, x); y = Math.min(f(id)(x), ymax * 0.92); } const t = G.label(x, y, txt, { cls: "lbl", dx: 6, dy: -6 }); t.style.fill = STYLE[id].css; };
    if (st.zoom) { const t = G.label(1.12, ymax * 0.84, "1s core (runs off the top)", { cls: "lbl", dx: 0, dy: 0 }); t.style.fill = "var(--ink2)"; } else { const t = G.label(1.45, f("1s")(1.45), "1s (core)", { cls: "lbl", dx: 6, dy: -2 }); t.style.fill = "var(--ink2)"; }
    st.compare.forEach((id) => lab(id, id));
    if (!st.zoom) st.compare.forEach((id) => { peaks(id).filter((p) => p !== mainPeak(id) && p.r < xmax).forEach((p) => { const t = G.label(p.r < 1.5 ? p.r + 0.75 : p.r, p.value, "inner hump", { cls: "lblc", dx: 4, dy: -4 }); t.style.fill = STYLE[id].css; }); });
    vl = G.line(st.r, 0, st.r, ymax, { cls: "tan dash", layer: G.layer.front });
    const cutY = st.zoom ? ymax * 0.62 : ymax; cutLab = G.label(st.r, cutY, "", { cls: "lblc", dx: 5, dy: 12 }); cutLab.y0 = cutY;
    G.handle(st.r, 0, { axis: "x", bounds: [0.1, xmax], step: xmax / 100, label: "Cut-off radius", onMove: (x) => setCut(x, true) });
    setCut(st.r, false);
  }
  function setCut(x, user) {
    st.r = clamp(x, 0.1, 30);
    st.compare.forEach((id) => shades[id] && shades[id].update(f(id), 0, st.r));
    if (vl) vl.set(st.r, 0, st.r, G.y1); if (cutLab) { cutLab.set(st.r, cutLab.y0, `r = ${st.r.toFixed(2)} a₀`); }
    onCut(st.r, user);
  }
  draw();
  return { draw, setCut };
}
function readoutHTML(st) {
  const rc = st.r, pm = Math.round(rc * H.A0_PM);
  const rows = st.compare.map((id) => { const fr = fracInside(id, rc), pk = mainPeak(id), inner = peaks(id).filter((p) => p !== pk);
    return `<div><span class="swatch" style="background:${STYLE[id].css}"></span> <b>${id}</b>: <b>${(fr * 100).toFixed(fr < 0.01 ? 2 : 1)}%</b> of its probability lies inside r = ${rc.toFixed(2)} a₀ · most probable r = ${pk.r.toFixed(2)} a₀ (${Math.round(pk.r * H.A0_PM)} pm)${inner.length ? ` · inner hump${inner.length > 1 ? "s" : ""} at ${inner.map((p) => p.r.toFixed(2)).join(" and ")} a₀` : " · no inner hump"}</div>`; }).join("");
  const s1 = fracInside("1s", rc);
  const order = [...st.compare].sort((a, b) => fracInside(b, rc) - fracInside(a, rc));
  return `${rows}<div class="muted">For comparison, the 1s core itself has ${(s1 * 100).toFixed(1)}% inside r = ${rc.toFixed(2)} a₀ (${pm} pm). ${Math.abs(rc - 1) < 0.005 ? "1 a₀ is the 1s most probable radius." : ""}</div>
    ${rc <= 2 ? `<div>More probability inside the core: ${order.join(" &gt; ")}. An electron that spends more time inside the 1s core is shielded less by it and feels more of the nuclear charge, so it is lower in energy: within a shell s &lt; p &lt; d in a many-electron atom (p. 2). This link is a picture, not from the notes.</div>` : `<div class="muted">At r = ${rc.toFixed(1)} a₀ you are well outside the 1s core (most of the 1s probability is inside about 2 a₀), so these numbers no longer say how much each orbital gets inside the core. Move the cut-off back to about 1 a₀.</div>`}`;
}
function picker(host, st, onChange) {
  const row = el("div", { class: "row" });
  const chips = el("div", { class: "chips", role: "group", "aria-label": "Orbitals to compare with the 1s core" }); chips.append(el("span", { class: "small muted" }, "compare with the 1s core:"));
  CHOICES.forEach((id) => { const b = el("button", { type: "button", class: "chip", "aria-pressed": String(st.compare.includes(id)) }, id);
    b.onclick = () => { const on = st.compare.includes(id); if (on && st.compare.length === 1) return; st.compare = on ? st.compare.filter((x) => x !== id) : [...st.compare, id].slice(-3); st.compare.sort((a, b) => CHOICES.indexOf(a) - CHOICES.indexOf(b)); chips.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(st.compare.includes(x.textContent)))); onChange(); };
    chips.append(b); });
  row.append(chips);
  const reset = el("button", { type: "button", class: "chip" }, "Cut-off at the 1s peak (1 a₀)"); row.append(reset);
  host.append(row); return reset;
}
const CAPTION = `The notes explain shielding and penetration in words only (pp. 2, 4, 10, 12) and give no radial functions for many-electron atoms. These curves are hydrogen-atom functions (Z = 1, from Module 2) used as a picture, not a calculation for a real atom. In a real atom the 1s orbital is pulled in closer by the larger nuclear charge (p. 2), but the comparison between s, p and d is the same.`;

export function mount(host, P = {}, ctx = {}) {
  const st = { compare: normCompare(P.compare), r: clamp(+P.r || 1, 0.1, 30), zoom: !!P.zoom, cut: P.cut !== false };
  const V = new Viewer(host, { label: "Nested shells at the most probable radii of the 1s core and the compared orbitals, the front half cut away", cam: [1.5, -4.9, 2.6], aspect: P.aspect || 0.6, minD: 1.5, maxD: 14, onInteract: ctx.onInteract });
  const g = new THREE.Group(); V.add(g);
  /* the front half (y < 0) is cut away, so every shell shows as a ring on the cut plane */
  const clip = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)];
  const nucMat = surfaceMaterial(V.pal.pos); const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.025, 20, 14), nucMat); V.add(nuc);
  V.label("+", new THREE.Vector3(0, -0.02, 0.075), "nlab nuc");
  let labs = []; let unit = 1; let cutDisc = null;
  function clearG() { g.children.slice().forEach((o) => { g.remove(o); o.traverse((x) => { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); }); }); labs.forEach((l) => l.remove()); labs = []; cutDisc = null; }
  const onPlane = (R, a) => { const rr = R < 0.3 ? R + 0.11 : R; return new THREE.Vector3(rr * Math.cos(a), -0.02, rr * Math.sin(a)); };
  function shell(r, color, opacity, hatch, labText, labAng, tube) {
    const R = r * unit;
    const m = surfaceMaterial(color, { opacity, side: THREE.DoubleSide, depthWrite: false, hatch, hatchScale: 16, roughness: 0.6 });
    if (st.cut) m.clippingPlanes = clip;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), m); mesh.renderOrder = Math.round(100 - R * 20); g.add(mesh);
    if (st.cut) { const ring = new THREE.Mesh(new THREE.TorusGeometry(R, tube, 6, Math.max(48, Math.round(R * 160))), new THREE.MeshBasicMaterial({ color })); ring.rotation.x = Math.PI / 2; g.add(ring); }
    if (labText) labs.push(V.label(labText, onPlane(R, labAng), "tag shlab"));
  }
  function build() {
    clearG();
    const outer = Math.max(...st.compare.map((id) => mainPeak(id).r)); unit = 1.3 / outer;
    const pal = V.pal;
    shell(1, pal.ink2, 0.3, true, "1s core", Math.PI / 2, 0.011);
    st.compare.forEach((id, i) => { const col = pal[STYLE[id].pal]; const pk = mainPeak(id);
      shell(pk.r, col, 0.12, false, id, 0.5 - i * 0.42, 0.012);
      peaks(id).filter((p) => p !== pk).forEach((p, k) => shell(p.r, col, 0.24, false, k === 0 && p.r < 1.2 ? `${id} inner hump` : null, -Math.PI / 2 - i * 0.5, 0.008)); });
    setCut3D(st.r);
  }
  /* the cut-off radius from the plot: a shaded disc on the cut plane */
  function setCut3D(r) {
    if (cutDisc) { g.remove(cutDisc); cutDisc.traverse((x) => { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); }); cutDisc = null; }
    const R = r * unit; if (R > 1.9) return V.requestRender();
    cutDisc = new THREE.Mesh(new THREE.CircleGeometry(R, 72), new THREE.MeshBasicMaterial({ color: V.pal.accent, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }));
    cutDisc.rotation.x = Math.PI / 2; cutDisc.position.y = -0.005; cutDisc.renderOrder = 200;
    const pts = []; for (let i = 0; i <= 96; i++) { const a = (i / 96) * 2 * Math.PI; pts.push(new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), 0)); }
    const edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: V.pal.accent, dashSize: 0.04, gapSize: 0.03 })); edge.computeLineDistances(); cutDisc.add(edge);
    g.add(cutDisc); V.requestRender();
  }
  V.theme(() => build(), false);
  const ctl = el("div", { class: "ctl sh" }); host.append(ctl);
  const reset = picker(ctl, st, () => { plot.draw(); build(); info(); emit(); });
  const cutB = el("button", { type: "button", class: "chip", "aria-pressed": String(st.cut) }, "Cut away the front half"); cutB.onclick = () => { st.cut = !st.cut; cutB.setAttribute("aria-pressed", String(st.cut)); build(); }; reset.after(cutB);
  const out = el("div", { class: "readout sh-out", "aria-live": "polite" });
  const plot = plotPanel(ctl, st, (r, user) => { setCut3D(r); info(); if (user) emit(); });
  reset.onclick = () => plot.setCut(1, true) || plot.draw();
  ctl.append(out);
  ctl.append(el("div", { class: "small muted" }, "In 3D: one see-through shell at each orbital's most probable radius (the 1s core is grey and hatched), smaller shells at the inner humps, with the front half cut away so each shell shows as a ring. The shaded disc is the region inside the cut-off radius from the plot. " + CAPTION));
  function info() { out.innerHTML = readoutHTML(st); }
  function emit() { if (ctx.onState) ctx.onState({ compare: [...st.compare], r: st.r, inside: Object.fromEntries(st.compare.map((id) => [id, fracInside(id, st.r)])) }); }
  build(); info();
  return { viewer: V, state: () => ({ compare: [...st.compare], r: st.r, zoom: st.zoom, inside: Object.fromEntries(st.compare.map((id) => [id, fracInside(id, st.r)])) }), set: (p) => { if (p.compare) { st.compare = normCompare(p.compare); plot.draw(); build(); info(); } if (p.r != null) plot.setCut(+p.r, true); }, dispose() { clearG(); V.dispose(); ctl.remove(); } };
}

export function fallback(host, P = {}, ctx = {}) {
  const st = { compare: normCompare(P.compare), r: clamp(+P.r || 1, 0.1, 30), zoom: !!P.zoom };
  const wrap = el("div", { class: "v3d-fallback sh-fb" }); wrap.style.justifyItems = "stretch"; host.append(wrap);
  wrap.append(el("p", { class: "small muted" }, "3D needs WebGL, which is off in this browser. The radial plot below holds the same information as the 3D shells: drag the dashed line to change the cut-off radius."));
  const out = el("div", { class: "readout sh-out" });
  const reset = picker(wrap, st, () => { plot.draw(); out.innerHTML = readoutHTML(st); });
  const plot = plotPanel(wrap, st, () => { out.innerHTML = readoutHTML(st); });
  reset.onclick = () => plot.setCut(1, true) || plot.draw();
  wrap.append(out, el("p", { class: "small muted" }, CAPTION)); out.innerHTML = readoutHTML(st);
  return { state: () => ({ compare: [...st.compare], r: st.r }), dispose() { wrap.remove(); } };
}
