/* CHEM 120 Interactive: light and matter waves (Module 2).
   mountEmWave / fallbackEmWave (type "emwave", pp. 1-3): a travelling EM wave, E in the xy-plane and B in the xz-plane, a log-scale wavelength
     slider from gamma rays to radio, readout of lambda, nu = c/lambda, E = h nu per photon and per mole, region and colour, spectrum strip.
     params: {lambda: 550 (nm)}
   mountRingWave / fallbackRingWave (type "ringwave", pp. 12-14): a wave wrapped round a circular orbit; only whole numbers of wavelengths join up.
     params: {n: 3}
   mountSternGerlach / fallbackSternGerlach (type "sterngerlach", p. 32): beam of H atoms through an inhomogeneous magnet; classical smear vs two spots.
     params: {view: "classical"|"observed"}
   Also exports the light helpers (constants, wavelength to colour and region, number formatting, spectrum strips) used by bohr.mjs. */
import { THREE, Viewer, surfaceMaterial, palette, rod } from "./viewer.mjs";

/* data sheet constants (Module 2 pp. 2, 7, 10) */
export const K = { h: 6.626e-34, c: 2.998e8, NA: 6.022e23, RH: 2.179e-18, a0: 52.9 };
const reduce = () => !!(window.C120 && window.C120.reduceMotion && window.C120.reduceMotion());
const rich = (s) => (window.C120 && window.C120.rich ? window.C120.rich(s) : s);
function el(t, a = {}, ...k) { const e = document.createElement(t); for (const x in a) { if (a[x] == null) continue; if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; }
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- numbers ---------- */
/* 2.179 × 10<sup>−18</sup> */
export function sci(v, sig = 4) {
  if (!isFinite(v)) return "—"; if (v === 0) return "0";
  const neg = v < 0; v = Math.abs(v);
  let e = Math.floor(Math.log10(v)); let m = +(v / Math.pow(10, e)).toPrecision(sig);
  if (m >= 10) { m /= 10; e += 1; }
  const ms = m.toFixed(Math.max(0, sig - 1));
  return (neg ? "−" : "") + (e === 0 ? ms : `${ms} × 10<sup>${e < 0 ? "−" : ""}${Math.abs(e)}</sup>`);
}
/* a wavelength in nm as plain digits when that reads well, else scientific */
export function nmText(nm, sig = 4) { if (nm >= 0.01 && nm < 1e5) { const s = +nm.toPrecision(sig); return String(s); } return sci(nm, 3); }

/* ---------- the spectrum (Module 2, p. 3) ---------- */
/* region boundaries in nm, read from the chart on p. 3 (the chart's bands overlap, so the cut-offs are approximate) */
export const REGIONS = [
  { id: "gamma", name: "γ rays", short: "γ", max: 0.01 },
  { id: "xray", name: "X-rays", short: "X-ray", max: 1 },
  { id: "uv", name: "ultraviolet", short: "UV", max: 400 },
  { id: "vis", name: "visible", short: "vis", max: 750 },
  { id: "ir", name: "infrared", short: "IR", max: 1e6 },
  { id: "micro", name: "microwaves", short: "micro", max: 1e8 },
  { id: "radio", name: "radio waves", short: "radio", max: Infinity }
];
export const regionOf = (nm) => REGIONS.find((r) => nm < r.max) || REGIONS[REGIONS.length - 1];
export const isVisible = (nm) => nm >= 400 && nm <= 750;
/* colour names follow the visible bar on p. 3 (400 violet, 450 dark blue, 500 blue-green, 550 green, 570 yellow, 600 orange, 650+ red) */
export function colourName(nm) {
  if (!isVisible(nm)) return null;
  return nm < 425 ? "violet" : nm < 480 ? "blue" : nm < 500 ? "blue-green" : nm < 565 ? "green" : nm < 590 ? "yellow" : nm < 625 ? "orange" : "red";
}
/* approximate display colour of a visible wavelength (a standard RGB approximation, not from the notes) */
export function nmToRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 380 || nm > 780) return null;
  if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else r = 1;
  const f = nm < 420 ? 0.35 + 0.65 * (nm - 380) / 40 : nm > 700 ? 0.35 + 0.65 * (780 - nm) / 80 : 1;
  const c = (x) => Math.round(255 * Math.pow(x * f, 0.8));
  return [c(r), c(g), c(b)];
}
export function nmToCss(nm, fallback = "#9aa5a1") { const c = nmToRGB(nm); return c && isVisible(nm) ? `rgb(${c[0]},${c[1]},${c[2]})` : fallback; }
export function rainbowCSS(a = 400, b = 750) { const st = []; for (let x = a; x <= b + 0.01; x += (b - a) / 14) st.push(`${nmToCss(x)} ${(((x - a) / (b - a)) * 100).toFixed(1)}%`); return `linear-gradient(90deg, ${st.join(", ")})`; }
/* photon numbers for a wavelength in nm */
export function photon(nm) { const lm = nm * 1e-9; const nu = K.c / lm; const E = K.h * nu; return { nm, lm, nu, E, Emol: (E * K.NA) / 1000, region: regionOf(nm), colour: colourName(nm) }; }

/* ---------- EM wave ---------- */
const LMIN = -4, LMAX = 12; /* slider range: 1e-4 nm (gamma) to 1e12 nm (1 km radio) */
const clampNm = (nm) => clamp(isFinite(nm) && nm > 0 ? nm : 550, 10 ** LMIN, 10 ** LMAX);
class FnCurve extends THREE.Curve { constructor(f) { super(); this.f = f; } getPoint(t, o = new THREE.Vector3()) { return this.f(t, o); } }

function emReadout(nm) {
  const p = photon(nm);
  const sw = p.colour ? `<span class="swatch" style="background:${nmToCss(nm)}"></span> ` : "";
  const reg = p.colour ? `<b>visible</b>, ${sw}${p.colour}` : `<b>${p.region.name}</b>${nm > 380 && nm < 400 ? " (just beyond violet)" : nm > 750 && nm < 800 ? " (just beyond red)" : ""}`;
  return `<div><b>λ = ${nmText(nm)} nm</b> = ${sci(p.lm, 4)} m &nbsp;·&nbsp; ${reg}</div>
    <div>ν = c/λ = (2.998 × 10<sup>8</sup> m s<sup>−1</sup>)/(${sci(p.lm, 4)} m) = <b>${sci(p.nu, 4)} s<sup>−1</sup></b></div>
    <div>energy of one photon: E = hν = (6.626 × 10<sup>−34</sup> J s)(${sci(p.nu, 4)} s<sup>−1</sup>) = <b>${sci(p.E, 4)} J</b></div>
    <div>per mole of photons: E × N<sub>A</sub> = <b>${p.Emol >= 0.01 && p.Emol < 1e7 ? (+p.Emol.toPrecision(4)).toLocaleString("en-CA") : sci(p.Emol, 4)} kJ mol<sup>−1</sup></b></div>`;
}

/* full-range strip (log scale) with a magnified visible bar under it, and a marker. onPick(nm) when clicked or dragged */
function emStrip(host, onPick) {
  const f = (nm) => ((Math.log10(nm) - LMIN) / (LMAX - LMIN)) * 100;
  const wrap = el("div", { class: "spec em" });
  const bands = el("div", { class: "spec-bands", role: "img", "aria-label": "Electromagnetic spectrum, wavelength on a log scale" });
  let lo = 10 ** LMIN;
  REGIONS.forEach((R, i) => { const hi = Math.min(R.max, 10 ** LMAX); const b = el("div", { class: "band b" + (i % 2) + (R.id === "vis" ? " vis" : "") }, R.id === "vis" ? "" : R.short); b.style.left = f(lo) + "%"; b.style.width = (f(hi) - f(lo)) + "%"; if (R.id === "vis") b.style.background = rainbowCSS(); b.title = R.name; bands.append(b); lo = hi; });
  const mark = el("div", { class: "spec-mark" }); bands.append(mark);
  const axis = el("div", { class: "spec-axis" });
  [[1e-3, "1 pm"], [1, "1 nm"], [1e3, "1 µm"], [1e6, "1 mm"], [1e9, "1 m"], [1e12, "1 km"]].forEach(([nm, t]) => { const s = el("span", {}, t); s.style.left = f(nm) + "%"; axis.append(s); });
  const visCap = el("div", { class: "spec-cap" }, "visible region, 400 to 750 nm (p. 3)");
  const vis = el("div", { class: "spec-strip vis" }); vis.style.background = rainbowCSS();
  const vmark = el("div", { class: "spec-mark" }); vis.append(vmark);
  const vaxis = el("div", { class: "spec-axis" });
  [400, 450, 500, 550, 600, 650, 700, 750].forEach((x) => { const s = el("span", {}, String(x)); s.style.left = ((x - 400) / 350) * 100 + "%"; vaxis.append(s); });
  wrap.append(el("div", { class: "spec-cap" }, "the whole spectrum (log scale; increasing wavelength →, increasing energy ←)"), bands, axis, visCap, vis, vaxis);
  host.append(wrap);
  const pick = (node, toNm) => { let on = false; const at = (e) => { const r = node.getBoundingClientRect(); onPick(toNm(clamp((e.clientX - r.left) / r.width, 0, 1))); };
    node.addEventListener("pointerdown", (e) => { on = true; node.setPointerCapture(e.pointerId); at(e); });
    node.addEventListener("pointermove", (e) => { if (on) at(e); });
    node.addEventListener("pointerup", () => { on = false; }); node.addEventListener("pointercancel", () => { on = false; }); };
  if (onPick) { pick(bands, (t) => 10 ** (LMIN + t * (LMAX - LMIN))); pick(vis, (t) => 400 + 350 * t); bands.style.cursor = vis.style.cursor = "pointer"; }
  return { set(nm) { mark.style.left = f(nm) + "%"; const v = isVisible(nm); vmark.style.display = v ? "" : "none"; if (v) vmark.style.left = ((nm - 400) / 350) * 100 + "%"; }, el: wrap };
}

export function mountEmWave(host, P = {}, ctx = {}) {
  const st = { lambda: clampNm(+P.lambda || 550), playing: !reduce() && P.play !== false };
  const V = new Viewer(host, { label: "Electromagnetic wave: the electric field in the xy-plane, the magnetic field in the xz-plane", zUp: false, cam: [1.55, 1.2, 4.6], target: [0.05, 0, 0], aspect: P.aspect || 0.6, minD: 2, maxD: 12, onInteract: ctx.onInteract });
  const X0 = -1.55, X1 = 1.55, A = 0.5;
  const clip = [new THREE.Plane(new THREE.Vector3(1, 0, 0), -X0), new THREE.Plane(new THREE.Vector3(-1, 0, 0), X1)];
  const pal = () => V.pal;
  const mk = (c) => { const m = surfaceMaterial(c, { roughness: 0.5 }); m.clippingPlanes = clip; return m; };
  const matE = mk(pal().neg), matB = mk(pal().pos);
  const fillE = new THREE.MeshBasicMaterial({ color: pal().neg, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, clippingPlanes: clip });
  const fillB = fillE.clone(); fillB.color.set(pal().pos); fillB.clippingPlanes = clip;
  const hatE = new THREE.LineBasicMaterial({ color: pal().neg, transparent: true, opacity: 0.55, clippingPlanes: clip });
  const hatB = hatE.clone(); hatB.color.set(pal().pos); hatB.clippingPlanes = clip;
  const axMat = new THREE.MeshBasicMaterial({ color: pal().axis });
  const inkMat = new THREE.MeshBasicMaterial({ color: pal().stroke });
  /* axes from the origin at the left end, as drawn on p. 1 */
  const axes = new THREE.Group(); V.add(axes);
  const axis = (a, b) => { const g = new THREE.Group(); const A3 = new THREE.Vector3(...a), B3 = new THREE.Vector3(...b); g.add(rod(A3, B3, 0.006, axMat, 8)); const d = B3.clone().sub(A3).normalize(); const c = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.09, 14), axMat); c.position.copy(B3); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); g.add(c); axes.add(g); };
  axis([X0 - 0.1, 0, 0], [X1 + 0.32, 0, 0]); axis([X0, -0.72, 0], [X0, 0.8, 0]); axis([X0, 0, -0.72], [X0, 0, 0.82]);
  V.label("<i>x</i>", new THREE.Vector3(X1 + 0.45, 0, 0), "axis"); V.label("<i>y</i>", new THREE.Vector3(X0, 0.93, 0), "axis"); V.label("<i>z</i>", new THREE.Vector3(X0, 0, 0.96), "axis");
  V.label("direction of travel, speed <i>c</i>", new THREE.Vector3(X1 - 0.2, -0.62, 0), "nlab");
  const labE = V.label("<b>E</b> electric field", new THREE.Vector3(X0 - 0.12, A + 0.04, 0), "tag fieldE");
  const labB = V.label("<b>B</b> magnetic field", new THREE.Vector3(X0 - 0.3, -0.12, A + 0.05), "tag fieldB");
  const wave = new THREE.Group(); V.add(wave);
  const brk = new THREE.Group(); V.add(brk);
  const labL = V.label("λ", new THREE.Vector3(), "tag lam");
  let Ld = 1, shift = 0;
  const drawnL = (nm) => 0.5 + ((Math.log10(nm) - LMIN) / (LMAX - LMIN)) * 1.0; /* drawn wavelength: grows a little with lambda; never to scale */
  function clearG(g) { g.children.slice().forEach((o) => { g.remove(o); o.traverse((x) => { if (x.geometry) x.geometry.dispose(); }); }); }
  function field(ax, mat, fill, hat) {
    const xa = X0 - Ld - 0.02, xb = X1 + 0.02, k = (2 * Math.PI) / Ld;
    const val = (x) => A * Math.sin(k * x);
    const put = (o, x, v) => (ax === "y" ? o.set(x, v, 0) : o.set(x, 0, v));
    const segs = Math.min(720, Math.ceil(((xb - xa) / Ld) * 64));
    wave.add(new THREE.Mesh(new THREE.TubeGeometry(new FnCurve((t, o) => { const x = xa + (xb - xa) * t; return put(o, x, val(x)); }), segs, 0.015, 6, false), mat));
    const pos = new Float32Array((segs + 1) * 6), idx = [], v = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) { const x = xa + ((xb - xa) * i) / segs; pos[i * 6] = x; put(v, x, val(x)); pos[i * 6 + 3] = v.x; pos[i * 6 + 4] = v.y; pos[i * 6 + 5] = v.z; if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); wave.add(new THREE.Mesh(g, fill));
    const hp = []; const step = Ld / 16;
    for (let x = Math.ceil(xa / step) * step; x <= xb; x += step) { put(v, x, val(x)); hp.push(x, 0, 0, v.x, v.y, v.z); }
    const hg = new THREE.BufferGeometry(); hg.setAttribute("position", new THREE.Float32BufferAttribute(hp, 3)); wave.add(new THREE.LineSegments(hg, hat));
  }
  function build() {
    Ld = drawnL(st.lambda); shift = shift % Ld;
    clearG(wave); field("y", matE, fillE, hatE); field("z", matB, fillB, hatB); wave.position.x = shift;
    /* bracket from crest to crest above the electric field (fixed in space; the wave slides under it) */
    clearG(brk);
    const x0 = Ld / 4 + Math.ceil((X0 + 0.25 - Ld / 4) / Ld) * Ld, y = A + 0.16;
    brk.add(rod([x0, y, 0], [x0 + Ld, y, 0], 0.006, inkMat, 8), rod([x0, y - 0.07, 0], [x0, y + 0.03, 0], 0.006, inkMat, 8), rod([x0 + Ld, y - 0.07, 0], [x0 + Ld, y + 0.03, 0], 0.006, inkMat, 8));
    labL.pos.set(x0 + Ld / 2, y + 0.1, 0);
    V.requestRender();
  }
  V.theme((p) => { matE.color.set(p.neg); matB.color.set(p.pos); fillE.color.set(p.neg); fillB.color.set(p.pos); hatE.color.set(p.neg); hatB.color.set(p.pos); axMat.color.set(p.axis); inkMat.color.set(p.stroke); }, false);
  let stopAnim = null;
  function play() { if (stopAnim) stopAnim(); stopAnim = null; if (!st.playing) return; stopAnim = V.animate((dt) => { if (!st.playing) return false; shift = (shift + dt * 0.28 * Ld) % Ld; wave.position.x = shift; return true; }); }

  /* controls */
  const ctl = el("div", { class: "ctl wv" }); host.append(ctl);
  const sl = window.PLOT.slider(ctl, { label: "Wavelength λ (log scale)", min: LMIN, max: LMAX, step: 0.01, value: Math.log10(st.lambda), fmt: (v) => nmText(10 ** v, 3) + " nm", oninput: (v) => set(10 ** v, true) });
  sl.setAttribute("aria-valuetext", nmText(st.lambda) + " nanometres");
  const row = el("div", { class: "row" }); ctl.append(row);
  const presets = el("div", { class: "chips", role: "group", "aria-label": "Example wavelengths" });
  [[1e-3, "γ ray"], [0.1, "X-ray"], [250, "UV"], [550.1, "green, Example 2-1"], [1e4, "infrared"], [1e7, "microwave"], [1e9, "radio"]].forEach(([nm, t]) => { const b = el("button", { type: "button", class: "chip" }, t); b.onclick = () => set(nm); presets.append(b); });
  row.append(presets);
  const pb = el("button", { type: "button", class: "chip", "aria-pressed": String(!st.playing) }, st.playing ? "Pause" : "Play");
  if (reduce()) { pb.disabled = true; pb.title = "Motion is reduced on this device"; }
  pb.onclick = () => { st.playing = !st.playing; pb.textContent = st.playing ? "Pause" : "Play"; pb.setAttribute("aria-pressed", String(!st.playing)); play(); emit(); };
  row.append(pb);
  const out = el("div", { class: "readout wv-out", "aria-live": "polite" }); ctl.append(out);
  const strip = emStrip(ctl, (nm) => set(nm));
  ctl.append(el("div", { class: "small muted", html: `<span class="swatch" style="background:var(--phase-neg)"></span> <b>E</b>, the electric field, oscillates in the xy-plane; <span class="swatch" style="background:var(--phase-pos)"></span> <b>B</b>, the magnetic field, oscillates in the xz-plane at the same frequency and in step (p. 1). The drawing is not to scale: real wavelengths run from about 10<sup>−12</sup> m to kilometres, so the drawn wave only gets a little longer as λ grows. Region boundaries are approximate (chart on p. 3); colour swatches are an approximation (not from the notes).` }));
  function readout() { out.innerHTML = emReadout(st.lambda); strip.set(st.lambda); }
  function set(nm, fromSlider) { st.lambda = clampNm(nm); if (!fromSlider) sl.set(Math.log10(st.lambda)); sl.setAttribute("aria-valuetext", nmText(st.lambda) + " nanometres"); build(); readout(); emit(); }
  function emit() { if (ctx.onState) ctx.onState({ lambda: st.lambda, region: regionOf(st.lambda).id, playing: st.playing }); }
  build(); readout(); play();
  return { viewer: V, state: () => ({ lambda: st.lambda, playing: st.playing, region: regionOf(st.lambda).id, nu: photon(st.lambda).nu, E: photon(st.lambda).E }), set: (p) => { if (p.lambda) set(+p.lambda); }, dispose() { if (stopAnim) stopAnim(); V.dispose(); ctl.remove(); } };
}

export function fallbackEmWave(host, P = {}) {
  const nm = clampNm(+P.lambda || 550);
  const wrap = el("div", { class: "v3d-fallback wv-fb" });
  const W = 420, H = 190, x0 = 40, x1 = 400, y0 = 100, A = 52, L = 150;
  let e = "", b = "";
  for (let x = 0; x <= x1 - x0; x += 3) { const s = Math.sin((2 * Math.PI * x) / L); e += `${x ? "L" : "M"}${x0 + x} ${y0 - A * s} `; b += `${x ? "L" : "M"}${x0 + x - 0.55 * A * s} ${y0 + 0.45 * A * s} `; }
  const c1 = x0 + L / 4;
  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="An electromagnetic wave: electric field up and down, magnetic field at right angles, wavelength marked">
    <line x1="${x0 - 6}" y1="${y0}" x2="${x1 + 12}" y2="${y0}" class="ax"/><line x1="${x0}" y1="${y0 + 66}" x2="${x0}" y2="${y0 - 70}" class="ax"/><line x1="${x0 + 30}" y1="${y0 - 26}" x2="${x0 - 32}" y2="${y0 + 28}" class="ax"/>
    <text x="${x1 + 14}" y="${y0 + 4}">x</text><text x="${x0 + 4}" y="${y0 - 72}">y</text><text x="${x0 - 44}" y="${y0 + 40}">z</text>
    <path d="${e}" style="fill:none;stroke:var(--phase-neg);stroke-width:2.4"/><path d="${b}" style="fill:none;stroke:var(--phase-pos);stroke-width:2;stroke-dasharray:6 3"/>
    <path d="M${c1} ${y0 - A - 12} v-6 H${c1 + L} v6" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.4"/><text x="${c1 + L / 2}" y="${y0 - A - 24}" text-anchor="middle" class="lbl">λ</text>
    <text x="${x0 + 8}" y="${y0 - A + 4}" class="lbl" style="fill:var(--phase-neg)">E</text><text x="${x0 - 30}" y="${y0 + 58}" class="lbl" style="fill:var(--phase-pos)">B (dashed)</text></svg>`;
  const out = el("div", { class: "readout wv-out", html: emReadout(nm) });
  const p = el("p", { class: "small muted" }, "3D needs WebGL, which is off in this browser, so here is a flat drawing: the electric field E (solid) and the magnetic field B (dashed) oscillate at right angles to each other and to the direction of travel x, with the same wavelength.");
  wrap.append(out); const s = emStrip(wrap, null); s.set(nm); wrap.append(p);
  host.append(wrap);
  return { state: () => ({ lambda: nm }), dispose() { wrap.remove(); } };
}

/* ---------- de Broglie wave on a ring ---------- */
function ringReadout(n) {
  const k = Math.round(n), ok = Math.abs(n - k) < 1e-9 && k >= 1;
  const frac = n - Math.floor(n);
  if (ok) {
    const r = k * k * K.a0, lam = (2 * Math.PI * r) / k;
    return `<div><b class="ok">allowed: n = ${k}</b>. Exactly ${k} wavelength${k > 1 ? "s" : ""} fit round the orbit: 2πr = ${k}λ. After one lap the wave lands on itself, so it is a standing wave.</div>
      <div class="muted">Bohr's condition mvr = nh/2π (p. 9) together with de Broglie's λ = h/mv (p. 13) gives 2πr = nλ; the notes do not write this step. For the Bohr orbit with n = ${k}, r = n²a₀ = ${(+r.toPrecision(3))} pm and λ = 2πr/n = ${(+lam.toPrecision(3))} pm (not from the notes).</div>`;
  }
  return `<div><b class="bad">not allowed: n = ${n.toFixed(2)}</b>. ${n.toFixed(2)} wavelengths round the orbit is not a whole number, so 2πr = nλ fails.</div>
    <div class="muted">After one lap the wave is out of step with itself by ${frac.toFixed(2)} of a wavelength: the ends do not join, and on the next lap the wave would not land on itself, so it cancels out. Only n = 1, 2, 3, … give a wave that fits (2πr = nλ is not printed in the notes).</div>`;
}
export function mountRingWave(host, P = {}, ctx = {}) {
  const st = { n: clamp(+P.n || 3, 1, 8), ghost: P.ghost !== false, playing: !reduce() };
  const V = new Viewer(host, { label: "A de Broglie wave wrapped round a circular orbit", cam: [0.45, -3.9, 2.6], aspect: P.aspect || 0.62, minD: 2, maxD: 10, onInteract: ctx.onInteract });
  const R = 1, A = 0.2;
  const ringMat = new THREE.MeshBasicMaterial({ color: V.pal.axis, transparent: true, opacity: 0.8 });
  V.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.007, 6, 160), ringMat));
  const nucMat = surfaceMaterial(V.pal.pos); const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), nucMat); V.add(nuc);
  V.label("+", new THREE.Vector3(0, 0, 0.13), "nlab nuc");
  V.label("orbit, radius <i>r</i>", new THREE.Vector3(-R * 0.62, -R * 0.62, -0.32), "nlab");
  const waveMat = surfaceMaterial(V.pal.accent, { roughness: 0.45 });
  const ghostMat = new THREE.MeshBasicMaterial({ color: V.pal.ink2, transparent: true, opacity: 0.5, depthWrite: false });
  const fillMat = new THREE.MeshBasicMaterial({ color: V.pal.accent, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false });
  const gapMat = new THREE.MeshBasicMaterial({ color: V.pal.bad });
  const g = new THREE.Group(); V.add(g);
  const status = V.label("", new THREE.Vector3(0, 0, 0.95), "tag ring-status");
  const gapLab = V.label("ends don't join", new THREE.Vector3(R + 0.2, 0, A + 0.1), "tag bad");
  const startLab = V.label("start", new THREE.Vector3(R + 0.1, 0, A + 0.08), "nlab");
  function clearG() { g.children.slice().forEach((o) => { g.remove(o); if (o.geometry) o.geometry.dispose(); }); }
  const pt = (phi, o, rr = R) => o.set(rr * Math.cos(phi), rr * Math.sin(phi), A * Math.cos(st.n * phi));
  function build() {
    clearG();
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new FnCurve((t, o) => pt(t * 2 * Math.PI, o)), 360, 0.022, 7, false), waveMat));
    if (st.ghost) g.add(new THREE.Mesh(new THREE.TubeGeometry(new FnCurve((t, o) => pt(2 * Math.PI + t * 2 * Math.PI, o)), 360, 0.012, 5, false), ghostMat));
    const N = 240, pos = new Float32Array((N + 1) * 6), idx = [], v = new THREE.Vector3();
    for (let i = 0; i <= N; i++) { const ph = (i / N) * 2 * Math.PI; pt(ph, v); pos.set([R * Math.cos(ph), R * Math.sin(ph), 0, v.x, v.y, v.z], i * 6); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const fg = new THREE.BufferGeometry(); fg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); fg.setIndex(idx); g.add(new THREE.Mesh(fg, fillMat));
    const k = Math.round(st.n), ok = Math.abs(st.n - k) < 1e-9;
    const zEnd = A * Math.cos(2 * Math.PI * st.n);
    if (!ok) { const gr = rod([R + 0.045, 0, zEnd], [R + 0.045, 0, A], 0.011, gapMat, 10); if (Math.abs(A - zEnd) > 0.004) g.add(gr); const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), gapMat); dot.position.set(R, 0, zEnd); g.add(dot); }
    gapLab.visible = !ok; gapLab.pos.set(R + 0.42, 0, (A + zEnd) / 2 - 0.02);
    startLab.visible = !ok;
    status.set(ok ? `allowed: n = ${k}` : `not allowed: n = ${st.n.toFixed(2)}`); status.el.classList.toggle("ok", ok); status.el.classList.toggle("bad", !ok);
    g.scale.z = 1; V.requestRender();
  }
  V.theme((p) => { ringMat.color.set(p.axis); nucMat.color.set(p.pos); waveMat.color.set(p.accent); ghostMat.color.set(p.ink2); fillMat.color.set(p.accent); gapMat.color.set(p.bad); }, false);
  let stop = null, t0 = 0;
  function play() { if (stop) stop(); stop = null; g.scale.z = 1; const ok = Math.abs(st.n - Math.round(st.n)) < 1e-9; if (!st.playing || !ok) { V.requestRender(); return; } t0 = 0; stop = V.animate((dt) => { if (!st.playing) { g.scale.z = 1; return false; } t0 += dt; g.scale.z = Math.cos(t0 * 1.7); return true; }); }
  const ctl = el("div", { class: "ctl wv" }); host.append(ctl);
  const sl = window.PLOT.slider(ctl, { label: "Number of wavelengths round the orbit, n", min: 1, max: 8, step: 0.01, value: st.n, fmt: (v) => (+v).toFixed(2), oninput: (v) => set(v, true) });
  const row = el("div", { class: "row" }); ctl.append(row);
  const snap = el("button", { type: "button", class: "btn sm ghost" }, "Nearest whole number"); snap.onclick = () => set(Math.max(1, Math.round(st.n))); row.append(snap);
  const minus = el("button", { type: "button", class: "chip", "aria-label": "n minus 0.1" }, "−0.1"); minus.onclick = () => set(Math.round((st.n - 0.1) * 100) / 100); row.append(minus);
  const plus = el("button", { type: "button", class: "chip", "aria-label": "n plus 0.1" }, "+0.1"); plus.onclick = () => set(Math.round((st.n + 0.1) * 100) / 100); row.append(plus);
  const gh = el("button", { type: "button", class: "chip", "aria-pressed": String(st.ghost) }, "Show the second lap"); gh.onclick = () => { st.ghost = !st.ghost; gh.setAttribute("aria-pressed", String(st.ghost)); build(); }; row.append(gh);
  const pb = el("button", { type: "button", class: "chip", "aria-pressed": String(!st.playing) }, st.playing ? "Pause" : "Play"); if (reduce()) pb.disabled = true;
  pb.onclick = () => { st.playing = !st.playing; pb.textContent = st.playing ? "Pause" : "Play"; pb.setAttribute("aria-pressed", String(!st.playing)); play(); }; row.append(pb);
  const out = el("div", { class: "readout wv-out", "aria-live": "polite" }); ctl.append(out);
  ctl.append(el("div", { class: "small muted" }, "The grey thinner line is the second time round the orbit. When n is a whole number it lies exactly on the first lap (hidden inside it) and the wave stands still apart from breathing up and down."));
  function set(n, fromSlider) { n = clamp(+n, 1, 8); if (Math.abs(n - Math.round(n)) < 0.02) n = Math.round(n); st.n = n; sl.set(n); build(); out.innerHTML = ringReadout(n); play(); if (ctx.onState) ctx.onState({ n, allowed: Number.isInteger(n) }); }
  set(st.n);
  return { viewer: V, state: () => ({ n: st.n, allowed: Number.isInteger(st.n), ghost: st.ghost }), set: (p) => { if (p.n != null) set(p.n); }, dispose() { if (stop) stop(); V.dispose(); ctl.remove(); } };
}
export function fallbackRingWave(host, P = {}) {
  let n = clamp(+P.n || 3, 1, 8); if (Math.abs(n - Math.round(n)) < 0.02) n = Math.round(n);
  const W = 300, c = 150, R = 95, a = 22; let d = "";
  for (let i = 0; i <= 720; i++) { const ph = (i / 720) * 2 * Math.PI; const r = R + a * Math.cos(n * ph); d += `${i ? "L" : "M"}${(c + r * Math.cos(ph)).toFixed(1)} ${(c - r * Math.sin(ph)).toFixed(1)} `; }
  const ok = Number.isInteger(n); const rEnd = R + a * Math.cos(2 * Math.PI * n);
  const wrap = el("div", { class: "v3d-fallback" });
  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${W}" class="fig" role="img" aria-label="A wave wrapped round a circle, ${ok ? "joining itself" : "not joining itself"}"><circle cx="${c}" cy="${c}" r="${R}" style="fill:none;stroke:var(--fig-axis);stroke-dasharray:4 3"/><circle cx="${c}" cy="${c}" r="5" style="fill:var(--phase-pos)"/><text x="${c}" y="${c - 9}" text-anchor="middle" class="lbl">+</text>
    <path d="${d}" style="fill:none;stroke:var(--c,var(--accent));stroke-width:2.4"/>${ok ? "" : `<line x1="${c + rEnd}" y1="${c}" x2="${c + R + a}" y2="${c}" style="stroke:var(--bad);stroke-width:3"/><text x="${c + R + a - 6}" y="${c - 10}" text-anchor="end" class="lbl" style="fill:var(--bad)">gap</text>`}
    <text x="${c}" y="${c + 34}" text-anchor="middle" class="lbl" style="fill:${ok ? "var(--ok)" : "var(--bad)"}">${ok ? "allowed: n = " + n : "not allowed: n = " + n.toFixed(2)}</text></svg>`;
  wrap.append(el("div", { class: "readout wv-out", html: ringReadout(n) }), el("p", { class: "small muted" }, "3D needs WebGL, which is off in this browser, so here is a flat drawing: the wave is drawn as a wiggle in and out of the orbit. It joins itself only when a whole number of wavelengths fits round the orbit."));
  host.append(wrap); return { state: () => ({ n }), dispose() { wrap.remove(); } };
}

/* ---------- Stern-Gerlach ---------- */
const SG_TEXT = {
  classical: `<b>What classical physics predicts:</b> if the electron's tiny magnet could point in any direction, each atom would be pushed up or down by a different amount, anywhere between the two extremes. The beam would spread into one continuous smear on the screen.`,
  observed: `<b>What is observed:</b> the beam splits into exactly two (p. 32). The H atoms act like tiny magnets that are either attracted to or repelled by the north pole, so the electron has only two spin states: $m_s = +\\tfrac12$ (spin up) and $m_s = -\\tfrac12$ (spin down). Which spot is called $+\\tfrac12$ is a choice of labels here; the point is that there are two.`
};
export function mountSternGerlach(host, P = {}, ctx = {}) {
  const st = { view: P.view === "observed" ? "observed" : "classical" };
  const V = new Viewer(host, { label: "Stern-Gerlach experiment: a beam of hydrogen atoms passes a magnet and hits a screen", cam: [-0.75, -4.6, 1.75], target: [0.2, 0, -0.05], aspect: P.aspect || 0.56, minD: 2.5, maxD: 14, onInteract: ctx.onInteract });
  const pal = () => V.pal;
  const metal = surfaceMaterial(pal().axis, { roughness: 0.6 });
  const nMat = surfaceMaterial(pal().pos, { roughness: 0.5 }), sMat = surfaceMaterial(pal().neg, { roughness: 0.5 });
  const beamMat = surfaceMaterial(pal().accent, { roughness: 0.45 });
  const faintMat = new THREE.MeshBasicMaterial({ color: pal().accent, transparent: true, opacity: 0.35, depthWrite: false });
  const screenMat = new THREE.MeshBasicMaterial({ color: pal().paper, side: THREE.DoubleSide });
  const edgeMat = new THREE.LineBasicMaterial({ color: pal().stroke });
  const spotMat = surfaceMaterial(pal().head, { roughness: 0.5 });
  const smearMat = new THREE.MeshBasicMaterial({ color: pal().accent, transparent: true, opacity: 0.75, depthWrite: false });
  /* oven */
  const oven = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.46), metal); oven.position.set(-2.1, 0, 0); V.add(oven);
  const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 20), new THREE.MeshBasicMaterial({ color: 0x222222 })); mouth.rotation.z = Math.PI / 2; mouth.position.set(-1.86, 0, 0); V.add(mouth);
  /* magnet: N pole flat (top), S pole a wedge pointing at the beam (bottom), as drawn on p. 32 */
  const MX = 0.65, gapTop = 0.25, tip = -0.22;
  const nPole = new THREE.Mesh(new THREE.BoxGeometry(2 * MX, 0.62, 0.36), nMat); nPole.position.set(0, 0, gapTop + 0.18); V.add(nPole);
  const sh = new THREE.Shape(); sh.moveTo(-0.31, -0.62); sh.lineTo(0.31, -0.62); sh.lineTo(0.31, -0.42); sh.lineTo(0, tip); sh.lineTo(-0.31, -0.42); sh.closePath();
  const sg = new THREE.ExtrudeGeometry(sh, { depth: 2 * MX, bevelEnabled: false }); sg.applyMatrix4(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0))); sg.translate(-MX, 0, 0); sg.computeVertexNormals();
  const sPole = new THREE.Mesh(sg, sMat); V.add(sPole);
  V.label("N", new THREE.Vector3(-0.1, -0.33, gapTop + 0.18), "tag pole"); V.label("S", new THREE.Vector3(-0.1, -0.33, -0.5), "tag pole");
  V.label("magnet", new THREE.Vector3(0, 0, gapTop + 0.48), "nlab"); V.label("oven", new THREE.Vector3(-2.1, 0, 0.36), "nlab"); V.label("beam of H atoms", new THREE.Vector3(-1.3, 0, -0.2), "nlab");
  /* screen */
  const SX = 1.9;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.5), screenMat); scr.rotation.y = Math.PI / 2; scr.position.set(SX, 0, 0); V.add(scr);
  const se = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.0, 1.5)), edgeMat); se.rotation.y = Math.PI / 2; se.position.copy(scr.position); V.add(se);
  V.label("screen", new THREE.Vector3(SX, 0, 0.88), "nlab");
  /* beam paths: straight to the magnet, curving inside it (constant force), straight after it */
  const kq = 0.42 / (MX * 2) ** 2 / (1 + 2 * (SX - MX) / (2 * MX));
  const zOf = (x, f) => { const u = x + MX; if (u <= 0) return 0; if (x <= MX) return f * kq * u * u; return f * kq * (4 * MX * MX + 4 * MX * (x - MX)); };
  const xs = -1.86, xe = SX - 0.01;
  const path = (f, r, mat) => new THREE.Mesh(new THREE.TubeGeometry(new FnCurve((t, o) => { const x = xs + (xe - xs) * t; return o.set(x, 0, zOf(x, f)); }), 120, r, 6, false), mat);
  const classical = new THREE.Group(), observed = new THREE.Group(); V.add(classical, observed);
  classical.add(path(0, 0.014, beamMat));
  [-1, -0.72, -0.45, -0.2, 0.2, 0.45, 0.72, 1].forEach((f) => classical.add(path(f, 0.008, faintMat)));
  const smear = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.84, 6, 16), smearMat); smear.rotation.x = Math.PI / 2; smear.scale.set(0.35, 1, 1); smear.position.set(SX - 0.025, 0, 0); classical.add(smear);
  observed.add(path(1, 0.014, beamMat), path(-1, 0.014, beamMat));
  const zs = zOf(xe, 1);
  [1, -1].forEach((f) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), spotMat); s.scale.set(0.35, 1, 1); s.position.set(SX - 0.025, 0, f * zs); observed.add(s); });
  const labUp = V.label("$m_s = +\\tfrac12$", new THREE.Vector3(SX + 0.05, -0.5, zs + 0.02), "tag spin"), labDn = V.label("$m_s = -\\tfrac12$", new THREE.Vector3(SX + 0.05, -0.5, -zs - 0.02), "tag spin");
  const labSmear = V.label("one smear", new THREE.Vector3(SX + 0.05, -0.5, 0), "tag spin");
  V.theme((p) => { metal.color.set(p.axis); nMat.color.set(p.pos); sMat.color.set(p.neg); beamMat.color.set(p.accent); faintMat.color.set(p.accent); screenMat.color.set(p.paper); edgeMat.color.set(p.stroke); spotMat.color.set(p.head); smearMat.color.set(p.accent); }, false);
  const ctl = el("div", { class: "ctl wv" }); host.append(ctl);
  const seg = el("div", { class: "seg", role: "group", "aria-label": "Which result to show" });
  [["classical", "What classical physics predicts"], ["observed", "What is observed"]].forEach(([k, t]) => { const b = el("button", { type: "button", "aria-pressed": String(st.view === k) }, t); b.onclick = () => setView(k); seg.append(b); });
  ctl.append(seg);
  const out = el("div", { class: "sg-out small", "aria-live": "polite" }); ctl.append(out);
  function setView(k) { st.view = k; seg.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String((i === 0) === (k === "classical")))); classical.visible = k === "classical"; observed.visible = k === "observed"; labUp.visible = labDn.visible = k === "observed"; labSmear.visible = k === "classical"; out.innerHTML = rich(SG_TEXT[k]); V.requestRender(); if (ctx.onState) ctx.onState({ view: k }); }
  setView(st.view);
  return { viewer: V, state: () => ({ view: st.view }), set: (p) => p.view && setView(p.view), dispose() { V.dispose(); ctl.remove(); } };
}
export function fallbackSternGerlach(host, P = {}) {
  const wrap = el("div", { class: "v3d-fallback" });
  wrap.innerHTML = `<svg viewBox="0 0 420 200" class="fig" role="img" aria-label="Side view: a beam of H atoms passes between a flat N pole and a wedge-shaped S pole and splits into two spots on a screen">
    <rect x="12" y="82" width="44" height="36" style="fill:var(--fig-axis)"/><text x="34" y="134" text-anchor="middle">oven</text>
    <rect x="140" y="36" width="120" height="40" style="fill:var(--phase-pos)"/><text x="200" y="61" text-anchor="middle" class="lbl" style="fill:#fff">N</text>
    <path d="M140 172 H260 V150 L200 122 L140 150 Z" style="fill:var(--phase-neg)"/><text x="200" y="164" text-anchor="middle" class="lbl" style="fill:#fff">S</text>
    <path d="M56 100 H140 Q200 100 260 88 L370 64" style="fill:none;stroke:var(--c,var(--accent));stroke-width:2.4"/><path d="M140 100 Q200 100 260 112 L370 136" style="fill:none;stroke:var(--c,var(--accent));stroke-width:2.4"/>
    <line x1="372" y1="24" x2="372" y2="176" style="stroke:var(--fig-stroke);stroke-width:2"/><rect x="368" y="70" width="8" height="60" rx="4" style="fill:var(--c,var(--accent));opacity:.25"/>
    <circle cx="372" cy="64" r="6" style="fill:var(--head)"/><circle cx="372" cy="136" r="6" style="fill:var(--head)"/>
    <text x="380" y="60">+½</text><text x="380" y="148">−½</text><text x="372" y="190" text-anchor="middle">screen</text><text x="98" y="94" text-anchor="middle">H atoms</text></svg>`;
  wrap.append(el("p", { class: "small muted", html: rich("3D needs WebGL, which is off in this browser, so here is a side view. Classical physics predicts one continuous smear (the faint band on the screen); what is observed is two separate spots, $m_s = +\\tfrac12$ and $m_s = -\\tfrac12$ (p. 32).") }));
  host.append(wrap); return { dispose() { wrap.remove(); } };
}
