/* CHEM 120 Interactive: the Bohr hydrogen atom (Module 2, pp. 9-11).
   A nucleus with circular orbits n = 1..maxN. The electron sits on one orbit; drag it to another (it snaps to the nearest n),
   tap an orbit, use the n up / n down buttons, the level buttons, the ladder beside the model, or the number keys.
   Each change shows the photon: absorbed (wavy arrow coming in) or emitted (wavy arrow going out), in its colour when visible,
   grey with the region name otherwise. Readout uses the notes' sign: dE = -R_H(1/nf^2 - 1/ni^2), positive = absorbed, negative = emitted.
   Beside it: an energy ladder with E_n in J (p. 10), the current transition drawn as an arrow, and a spectrum strip that collects the lines.
   Orbit radii r_n = n^2 a0 (a0 = 52.9 pm, p. 10; the formula itself is not printed in the notes). By default orbits n >= 4 are drawn
   closer together than to scale (labelled); "True scale" draws every orbit at n^2.
   params: {n: start level, mode: "free"|"emit"|"absorb", maxN: 6 (2..8)} */
import { THREE, Viewer, surfaceMaterial } from "./viewer.mjs";
import { K, sci, nmText, nmToCss, colourName, regionOf, isVisible, rainbowCSS } from "./waves.mjs";

const reduce = () => !!(window.C120 && window.C120.reduceMotion && window.C120.reduceMotion());
function el(t, a = {}, ...k) { const e = document.createElement(t); for (const x in a) { if (a[x] == null || a[x] === false) continue; if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; }
const NS = "http://www.w3.org/2000/svg";
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* series names are standard but not used in the notes */
const SERIES = { 1: "Lyman", 2: "Balmer", 3: "Paschen", 4: "Brackett", 5: "Pfund", 6: "Humphreys" };
/* measured Balmer lines printed on p. 8 */
const NOTES_LINES = { 3: 656.3, 4: 486.1, 5: 434.0, 6: 410.1 };
export const En = (n) => -K.RH / (n * n);
export function transition(ni, nf) {
  const dE = -K.RH * (1 / (nf * nf) - 1 / (ni * ni));
  const E = Math.abs(dE), nu = E / K.h, lam = (K.c / nu) * 1e9;
  return { ni, nf, dE, E, nu, lam, kind: dE > 0 ? "absorbed" : "emitted", region: regionOf(lam), colour: colourName(lam), series: SERIES[Math.min(ni, nf)] || "" };
}
const SUP2 = "²";
function regionText(T, short) {
  if (T.colour) return `visible, <span class="swatch" style="background:${nmToCss(T.lam)}"></span> ${T.colour}`;
  return `${T.region.name}${short ? "" : " (not visible)"}`;
}

/* ---------- the panel: state, ladder, readout, spectrum, buttons. `makeVisual` draws the atom (3D, or 2D without WebGL) ---------- */
function panel(host, P, ctx, makeVisual) {
  const maxN = clamp(Math.round(+P.maxN || 6), 2, 8);
  const mode = ["emit", "absorb"].includes(P.mode) ? P.mode : "free";
  const startN = clamp(Math.round(+P.n || (mode === "emit" ? maxN : 1)), 1, maxN);
  const st = { n: startN, mode, maxN, trueScale: !!P.trueScale, last: null, lines: new Map() };
  const cq = el("div", { class: "bh-cq" }), grid = el("div", { class: "bh" }), left = el("div", { class: "bh-main" }), side = el("div", { class: "bh-side" });
  grid.append(left, side); cq.append(grid); host.append(cq);
  const api = { st, request: (n, o) => go(n, o) };
  const vis = makeVisual(left, api);

  /* ---------- energy ladder (p. 10) ---------- */
  const W = 210, Hh = 360, yTop = 30, yBot = 338, xa = 18, xb = 100;
  const yE = (E) => yTop + (E / En(1)) * (yBot - yTop);
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", `0 0 ${W} ${Hh}`); svg.setAttribute("class", "fig"); svg.setAttribute("role", "group"); svg.setAttribute("aria-label", "Energy levels of the hydrogen atom. Choose a level to move the electron there.");
  side.append(el("div", { class: "spec-cap", html: "energy levels, E<sub>n</sub> = −R<sub>H</sub>/n² (p. 10)" }), svg);
  const sv = (tag, at, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); parent.append(e); return e; };
  function ladder() {
    svg.innerHTML = "";
    sv("line", { x1: 8, y1: yBot + 8, x2: 8, y2: yTop - 16, class: "ax" }); sv("path", { d: `M4 ${yTop - 10} L8 ${yTop - 20} L12 ${yTop - 10} Z`, style: "fill:var(--fig-axis)" });
    const t0 = sv("text", { x: 14, y: yTop - 18 }); t0.textContent = "Energy";
    sv("line", { x1: xa, y1: yTop, x2: xb, y2: yTop, class: "ln dash" });
    const tz = sv("text", { x: xb + 6, y: yTop + 4 }); tz.textContent = "0 (n = ∞)";
    const th = sv("text", { x: W - 4, y: yTop - 18, "text-anchor": "end" }); th.textContent = "Eₙ / 10⁻¹⁸ J";
    /* labels pushed apart so they never overlap; leader lines to the true level */
    const ys = []; let prev = yTop + 2;
    for (let n = maxN; n >= 1; n--) { const y = yE(En(n)); const ly = Math.max(y, prev + 13.5); ys[n] = [y, ly]; prev = ly; }
    for (let n = 1; n <= maxN; n++) {
      const [y, ly] = ys[n]; const on = n === st.n; const allowed = canGo(n);
      const g = sv("g", { class: "lv" + (allowed || on ? "" : " off"), tabindex: on ? "-1" : "0", role: "button", "aria-label": `n = ${n}, E = ${(En(n) * 1e18).toFixed(3)} times ten to the minus 18 joules${on ? ", the electron is here" : allowed ? "" : ", not allowed in this mode"}` });
      sv("rect", { x: 0, y: ly - 8, width: W, height: 13, rx: 3, class: "hit" }, g);
      sv("line", { x1: xa, y1: y, x2: xb, y2: y, style: `stroke:${on ? "var(--c,var(--accent))" : "var(--fig-stroke)"};stroke-width:${on ? 3 : n === 1 ? 2.2 : 1.4}` }, g);
      if (Math.abs(ly - y) > 0.5) sv("path", { d: `M${xb} ${y} L${xb + 6} ${ly}`, class: "lt" }, g);
      const tn = sv("text", { x: xb + 9, y: ly + 3.5, style: on ? "fill:var(--c,var(--accent));font-weight:700" : "" }, g); tn.textContent = `n = ${n}`;
      const tv = sv("text", { x: W - 4, y: ly + 3.5, "text-anchor": "end" }, g); tv.textContent = (En(n) * 1e18).toFixed(3).replace("-", "−");
      if (on) sv("circle", { cx: xa + 16, cy: y, r: 4.5, style: "fill:var(--phase-neg);stroke:var(--paper);stroke-width:1.2" }, g);
      const fire = () => { if (n !== st.n) go(n); };
      g.addEventListener("click", fire); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); } });
    }
    const T = st.last;
    if (T) {
      const x = xa + 52, y1 = yE(En(T.ni)), y2 = yE(En(T.nf)); const col = T.colour ? nmToCss(T.lam) : "var(--ink2)"; const dir = y2 > y1 ? 1 : -1;
      sv("line", { x1: x, y1, x2: x, y2: y2 - dir * 7, style: `stroke:${col};stroke-width:2.6` });
      sv("path", { d: `M${x - 5} ${y2 - dir * 8} L${x} ${y2} L${x + 5} ${y2 - dir * 8} Z`, style: `fill:${col}` });
      const tl = sv("text", { x: x - 6, y: (y1 + y2) / 2 + 4, "text-anchor": "end" }); tl.textContent = T.kind === "emitted" ? "emit" : "absorb";
    }
  }

  /* ---------- controls ---------- */
  const ctl = el("div", { class: "ctl bh-ctl" }); host.append(ctl);
  const row = el("div", { class: "row" }); ctl.append(row);
  const down = el("button", { type: "button", class: "btn sm ghost" }, "n down"); down.onclick = () => go(st.n - 1);
  const up = el("button", { type: "button", class: "btn sm ghost" }, "n up"); up.onclick = () => go(st.n + 1);
  row.append(down, up);
  const lv = el("div", { class: "chips", role: "group", "aria-label": "Send the electron to level n" }); lv.append(el("span", { class: "small muted" }, "go to n ="));
  const lvb = []; for (let n = 1; n <= maxN; n++) { const b = el("button", { type: "button", class: "chip" }, String(n)); b.onclick = () => go(n); lvb[n] = b; lv.append(b); }
  row.append(lv);
  const scaleB = el("button", { type: "button", class: "chip", "aria-pressed": String(st.trueScale) }, "True scale (r = n²a₀)");
  scaleB.onclick = () => { st.trueScale = !st.trueScale; scaleB.setAttribute("aria-pressed", String(st.trueScale)); vis.setScale(st.trueScale); emit(); };
  row.append(scaleB);
  const again = el("button", { type: "button", class: "chip" }, ""); again.onclick = () => reset(mode === "emit" ? maxN : 1); row.append(again);
  const msg = el("div", { class: "bh-msg", "aria-live": "polite" }); ctl.append(msg);
  const out = el("div", { class: "readout bh-out", "aria-live": "polite" }); ctl.append(out);
  /* spectrum strips */
  const spec = el("div", { class: "spec bh-spec" }); ctl.append(spec);
  const absMode = mode === "absorb";
  const lamMin = transition(maxN, 1).lam * 0.9, lamMax = transition(maxN, maxN - 1).lam * 1.12;
  const fl = (nm) => ((Math.log10(nm) - Math.log10(lamMin)) / (Math.log10(lamMax) - Math.log10(lamMin))) * 100;
  const fv = (nm) => ((nm - 400) / 350) * 100;
  const head = el("div", { class: "row" }, el("b", { class: "small" }, absMode ? "Lines absorbed so far" : "Lines emitted so far"));
  const clr = el("button", { type: "button", class: "chip" }, "Clear"); clr.onclick = () => { st.lines.clear(); drawSpec(); emit(); }; head.append(clr);
  const visLabs = el("div", { class: "spec-labs" });
  const visStrip = el("div", { class: "spec-strip" + (absMode ? " abs" : ""), role: "img" }); if (absMode) visStrip.style.background = rainbowCSS();
  const visAx = el("div", { class: "spec-axis" }); [400, 450, 500, 550, 600, 650, 700, 750].forEach((x) => { const s = el("span", {}, String(x)); s.style.left = fv(x) + "%"; visAx.append(s); });
  const regLabs = el("div", { class: "spec-labs" });
  [["UV", lamMin, 400], ["visible", 400, 750], ["IR", 750, lamMax]].forEach(([t, a, b]) => { const s = el("span", {}, t); s.style.left = (fl(a) + fl(b)) / 2 + "%"; regLabs.append(s); });
  const logStrip = el("div", { class: "spec-strip" + (absMode ? " abs" : ""), role: "img" });
  const vb = el("div", { class: "spec-band" }); vb.style.left = fl(400) + "%"; vb.style.width = fl(750) - fl(400) + "%"; vb.style.background = rainbowCSS(); logStrip.append(vb);
  const logAx = el("div", { class: "spec-axis" }); [100, 200, 500, 1000, 2000, 5000, 10000].filter((x) => x > lamMin && x < lamMax).forEach((x) => { const s = el("span", {}, x >= 1000 ? x / 1000 + " µm" : x + " nm"); s.style.left = fl(x) + "%"; logAx.append(s); });
  const list = el("div", { class: "small muted" });
  spec.append(head, el("div", { class: "spec-cap" }, absMode ? "visible part, 400 to 750 nm: dark lines on the rainbow (an absorption spectrum, p. 8)" : "visible part, 400 to 750 nm, as on p. 8 (nm)"), visLabs, visStrip, visAx,
    el("div", { class: "spec-cap" }, "every line, log scale (UV and IR lines are drawn dashed grey)"), regLabs, logStrip, logAx, list);
  function drawSpec() {
    visStrip.querySelectorAll(".spec-line").forEach((x) => x.remove()); logStrip.querySelectorAll(".spec-line").forEach((x) => x.remove()); visLabs.innerHTML = "";
    const L = [...st.lines.values()].sort((a, b) => a.lam - b.lam);
    for (const T of L) {
      const cls = "spec-line " + (T.colour ? "vis" : T.lam < 400 ? "uv" : "ir"); const title = `${T.ni} → ${T.nf}: ${T.lam.toFixed(1)} nm`;
      const a = el("div", { class: cls, title }); a.style.left = fl(T.lam) + "%"; if (T.colour) a.style.background = nmToCss(T.lam); logStrip.append(a);
      if (isVisible(T.lam)) { const b = el("div", { class: cls, title }); b.style.left = fv(T.lam) + "%"; b.style.background = nmToCss(T.lam); visStrip.append(b); const s = el("span", {}, T.lam.toFixed(0)); s.style.left = fv(T.lam) + "%"; visLabs.append(s); }
    }
    visStrip.setAttribute("aria-label", "Visible lines: " + (L.filter((T) => isVisible(T.lam)).map((T) => T.lam.toFixed(1) + " nm").join(", ") || "none yet"));
    logStrip.setAttribute("aria-label", "All lines: " + (L.map((T) => T.lam.toFixed(1) + " nm").join(", ") || "none yet"));
    list.innerHTML = L.length ? L.map((T) => `${T.ni}→${T.nf} ${nmText(T.lam, 4)} nm${T.series ? " (" + T.series + ")" : ""}`).join(" · ") + (L.some((T) => T.series) ? ". Series names are standard, not from the notes." : "") : absMode ? "Move the electron up to absorb photons." : "Move the electron down to emit photons. Try 3 → 2, 4 → 2, 5 → 2 and 6 → 2 for the four visible lines on p. 8.";
  }
  function canGo(n) { return n >= 1 && n <= maxN && n !== st.n && !(mode === "emit" && n > st.n) && !(mode === "absorb" && n < st.n); }
  function buttons() {
    down.disabled = !canGo(st.n - 1); up.disabled = !canGo(st.n + 1);
    for (let n = 1; n <= maxN; n++) { lvb[n].disabled = !canGo(n) && n !== st.n; lvb[n].setAttribute("aria-pressed", String(n === st.n)); }
    const stuck = (mode === "emit" && st.n === 1) || (mode === "absorb" && st.n === maxN);
    again.style.display = mode === "free" ? "none" : ""; again.textContent = mode === "emit" ? `Start again at n = ${maxN}` : `Start again at n = 1`; again.classList.toggle("btn", false);
    if (stuck) msg.textContent = mode === "emit" ? "The electron is in the lowest level, n = 1, and cannot drop further. Start again to emit more lines." : `The electron is at the highest level shown, n = ${maxN}. Start again to absorb more.`;
  }
  const lineE = (n) => `−R<sub>H</sub>/${n}${SUP2} = −(2.179 × 10<sup>−18</sup> J)/${n}${SUP2} = ${sci(En(n), 4)} J`;
  function readout() {
    const T = st.last;
    if (!T) { out.innerHTML = `<div><b>Electron in n = ${st.n}</b>: E<sub>${st.n}</sub> = ${lineE(st.n)}</div><div class="muted">Drag the electron to another orbit, tap a level on the ladder, use the buttons, or press a number key on the model.${mode === "emit" ? " Emission mode: the electron can only drop to lower levels." : mode === "absorb" ? " Absorption mode: the electron can only move up." : ""}</div>`; return; }
    const r = (n) => +(n * n * K.a0).toPrecision(3);
    const notes = T.nf === 2 && NOTES_LINES[T.ni] ? `<div class="muted">The notes (p. 8) show this line at ${NOTES_LINES[T.ni]} nm. The ${Math.abs(T.lam - NOTES_LINES[T.ni]).toFixed(1)} nm difference is because R<sub>H</sub> here uses the electron mass rather than the reduced mass (p. 11).</div>` : "";
    out.innerHTML = `<div><b>n = ${T.ni} → n = ${T.nf}</b>: a photon is <b>${T.kind}</b> (ΔE ${T.dE > 0 ? "> 0" : "< 0"})</div>
      <div>E<sub>i</sub> = ${lineE(T.ni)}</div>
      <div>E<sub>f</sub> = ${lineE(T.nf)}</div>
      <div>ΔE = E<sub>f</sub> − E<sub>i</sub> = −R<sub>H</sub>(1/n<sub>f</sub>${SUP2} − 1/n<sub>i</sub>${SUP2}) = −(2.179 × 10<sup>−18</sup> J)(1/${T.nf}${SUP2} − 1/${T.ni}${SUP2}) = <b>${sci(T.dE, 4)} J</b></div>
      <div>photon energy hν = |ΔE| = ${sci(T.E, 4)} J; &nbsp;ν = |ΔE|/h = ${sci(T.nu, 4)} s<sup>−1</sup>; &nbsp;<b>λ = c/ν = ${nmText(T.lam, 4)} nm</b></div>
      <div>region: <b>${regionText(T)}</b>${T.series ? ` · ${T.series} series (lines ending on n = ${Math.min(T.ni, T.nf)})` : ""}</div>${notes}
      <div class="muted">The notes write ΔE = hν (p. 10); for emission ΔE is negative, so the photon carries |ΔE|. Orbit radius r = n²a₀: ${r(T.ni)} pm → ${r(T.nf)} pm (a₀ = 52.9 pm is on p. 10; r = n²a₀ is not printed in the notes).</div>`;
  }
  function go(nf, o = {}) {
    nf = Math.round(nf);
    if (nf === st.n) { vis.place(st.n, o.theta); return; }
    if (nf < 1 || nf > maxN) { vis.place(st.n, o.theta); msg.textContent = nf < 1 ? "n = 1 is the lowest level." : `This model shows levels up to n = ${maxN}.`; return; }
    if (!canGo(nf)) { vis.place(st.n, o.theta); msg.textContent = mode === "emit" ? "Emission mode: the electron can only drop to a lower level (that is when light is given out)." : "Absorption mode: the electron can only move up to a higher level (by absorbing light)."; return; }
    const T = transition(st.n, nf); st.n = nf; st.last = T; msg.textContent = "";
    if ((absMode && T.kind === "absorbed") || (!absMode && T.kind === "emitted")) { const k = `${T.ni}-${T.nf}`; st.lines.set(k, T); }
    vis.show(T, o.theta);
    ladder(); readout(); drawSpec(); buttons(); emit();
  }
  function reset(n) { st.n = n; st.last = null; msg.textContent = ""; vis.place(n); vis.clearPhoton(); ladder(); readout(); buttons(); emit(); }
  function emit() { if (ctx.onState) ctx.onState(state()); }
  const state = () => ({ n: st.n, mode, maxN, trueScale: st.trueScale, last: st.last && { ni: st.last.ni, nf: st.last.nf, dE: st.last.dE, E: st.last.E, nu: st.last.nu, lambda: st.last.lam, kind: st.last.kind, region: st.last.region.id }, lines: [...st.lines.values()].map((T) => ({ ni: T.ni, nf: T.nf, lambda: T.lam })) });
  vis.place(st.n); ladder(); readout(); drawSpec(); buttons();
  return { go, reset, state, viewer: vis.V, dispose() { vis.dispose(); cq.remove(); ctl.remove(); } };
}

/* display radius in units of a0: n^2 to scale, or n^2 up to n = 3 then closer spacing (labelled) */
const dispR = (n, trueScale) => (trueScale || n <= 3 ? n * n : 9 + 3 * (n - 3));

/* ---------- 3D atom ---------- */
function visual3D(P, ctx) {
  return (left, api) => {
    const st = api.st, maxN = st.maxN, RMAX = 1.5;
    const V = new Viewer(left, { label: "Bohr model of the hydrogen atom. Drag the electron to another orbit, or press a number key to send it to that level", cam: [0.6, -4.25, 3.05], aspect: P.aspect || 0.8, minH: 280, minD: 1.6, maxD: 12, onInteract: ctx.onInteract });
    const unit = () => RMAX / dispR(maxN, st.trueScale);
    const Rw = (n) => dispR(n, st.trueScale) * unit();
    let theta = P.theta != null ? +P.theta : 0.72 * Math.PI;
    const orbMat = new THREE.MeshBasicMaterial({ color: V.pal.axis, transparent: true, opacity: 0.75 });
    const hiMat = new THREE.MeshBasicMaterial({ color: V.pal.accent });
    const ghostMat = new THREE.MeshBasicMaterial({ color: V.pal.accent, transparent: true, opacity: 0.45 });
    const orbits = new THREE.Group(); V.add(orbits);
    let hi = null, ghost = null, ghostN = 0; const orbLabs = [];
    const nucMat = surfaceMaterial(V.pal.pos), eMat = surfaceMaterial(V.pal.neg);
    const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.024, 24, 16), nucMat); V.add(nuc);
    V.label("+", new THREE.Vector3(0, 0, 0.085), "nlab nuc");
    const eR = 0.036; const electron = new THREE.Mesh(new THREE.SphereGeometry(eR, 28, 18), eMat); V.add(electron);
    const eLab = V.label("e⁻", new THREE.Vector3(), "elab");
    const scaleLab = V.label("", new THREE.Vector3(0, RMAX + 0.16, 0), "nlab");
    const torus = (r, tube, mat) => new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, Math.max(48, Math.round(r * 150))), mat);
    const labAng = (n) => -0.6 * Math.PI + 0.15 * Math.PI * (n - 1);
    function buildOrbits() {
      orbits.children.slice().forEach((o) => { orbits.remove(o); o.geometry.dispose(); });
      orbLabs.forEach((l) => l.remove()); orbLabs.length = 0;
      for (let n = 1; n <= maxN; n++) { const r = Rw(n); orbits.add(torus(r, 0.0055, orbMat)); const a = labAng(n); orbLabs[n] = V.label(`n = ${n}`, new THREE.Vector3((r + 0.07) * Math.cos(a), (r + 0.07) * Math.sin(a), 0), "orb"); }
      scaleLab.set(st.trueScale ? "true scale: r = n²a₀" : "orbits n ≥ 4 drawn closer together than to scale"); scaleLab.pos.set(0, RMAX + 0.18, 0);
      setHi(st.n);
    }
    function setHi(n) { if (hi) { V.remove(hi); } hi = torus(Rw(n), 0.011, hiMat); V.add(hi); orbLabs.forEach((l, k) => l && l.el.classList.toggle("on", k === n)); }
    function setGhost(n) { if (n === ghostN) return; ghostN = n; if (ghost) { V.remove(ghost); ghost = null; } if (n) { ghost = torus(Rw(n), 0.016, ghostMat); V.add(ghost); } }
    const posAt = (r, th = theta, o = new THREE.Vector3()) => o.set(r * Math.cos(th), r * Math.sin(th), 0);
    function setE(r) { posAt(r, theta, electron.position); eLab.pos.copy(electron.position).add(new THREE.Vector3(0, 0, 0.085)); V.requestRender(); }
    /* the photon: a wavy tube with a cone head */
    let photon = null, lastT = null;
    function clearPhoton() { if (photon) { V.remove(photon.g); photon.lab.remove(); photon = null; } lastT = null; V.requestRender(); }
    function makePhoton(T, at) {
      if (photon) { V.remove(photon.g); photon.lab.remove(); photon = null; }
      const dir = new THREE.Vector3(0.36 * Math.cos(theta), 0.36 * Math.sin(theta), 1).normalize();
      const wig = new THREE.Vector3(-Math.sin(theta), Math.cos(theta), 0);
      const L = 0.82, far = at.clone().addScaledVector(dir, L);
      const inc = T.kind === "absorbed";
      const S = inc ? far : at.clone().addScaledVector(dir, eR + 0.03), E = inc ? at.clone().addScaledVector(dir, eR + 0.012) : far;
      const u = E.clone().sub(S).normalize(); const headL = 0.085; const Eb = E.clone().addScaledVector(u, -headL);
      const len = S.distanceTo(Eb), per = clamp(0.034 * Math.pow(T.lam / 100, 0.45), 0.03, 0.19), amp = 0.03;
      const segs = 150, rad = 6;
      const curve = new (class extends THREE.Curve { getPoint(t, o = new THREE.Vector3()) { const env = Math.min(1, t / 0.06, (1 - t) / 0.08); return o.copy(S).lerp(Eb, t).addScaledVector(wig, amp * env * Math.sin((2 * Math.PI * t * len) / per)); } })();
      const col = T.colour ? nmToCss(T.lam) : V.pal.ink2;
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.55 });
      const g = new THREE.Group();
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, 0.011, rad, false), mat); g.add(tube);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.03, headL, 18), mat); cone.position.copy(Eb).addScaledVector(u, headL / 2); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), u); g.add(cone);
      V.add(g);
      const lab = V.label(`${T.kind} · ${nmText(T.lam, 4)} nm · ${T.colour || T.region.name}`, far.clone().addScaledVector(dir, 0.1), "tag photon");
      const total = segs * rad * 6;
      photon = { g, lab, reveal(f) { const k = Math.round(clamp(f, 0, 1) * segs); tube.geometry.setDrawRange(0, k * rad * 6 || 0); if (f >= 1) tube.geometry.setDrawRange(0, total); cone.visible = f >= 1; lab.visible = f >= 0.98; V.requestRender(); } };
      lastT = T; return photon;
    }
    let stop = null, endFn = null;
    function finish() { if (stop) { stop(); stop = null; } if (endFn) { const f = endFn; endFn = null; f(); } }
    const ease = (u) => u * u * (3 - 2 * u);
    function show(T, th) {
      finish(); if (th != null) theta = th;
      const r0 = Rw(T.ni), r1 = Rw(T.nf);
      const ph = makePhoton(T, posAt(T.kind === "absorbed" ? r0 : r1)); setHi(T.nf); setGhost(0);
      const end = () => { setE(r1); ph.reveal(1); };
      if (reduce()) return end();
      setE(r0); ph.reveal(0); endFn = end; let t = 0; const D = 1.3;
      stop = V.animate((dt) => { t += dt / D; const k = Math.min(1, t);
        if (T.kind === "absorbed") { ph.reveal(k / 0.55); setE(r0 + (r1 - r0) * ease(clamp((k - 0.55) / 0.45, 0, 1))); }
        else { setE(r0 + (r1 - r0) * ease(clamp(k / 0.45, 0, 1))); ph.reveal((k - 0.45) / 0.55); }
        if (k >= 1) { stop = null; endFn = null; end(); return false; } return true; });
    }
    function place(n, th) { finish(); if (th != null) theta = th; setHi(n); setGhost(0); setE(Rw(n)); }
    function setScale() { finish(); buildOrbits(); setE(Rw(st.n)); if (lastT) { const T = lastT; makePhoton(T, posAt(T.kind === "absorbed" ? Rw(T.ni) : Rw(T.nf))).reveal(1); } }
    V.theme((p) => { orbMat.color.set(p.axis); hiMat.color.set(p.accent); ghostMat.color.set(p.accent); nucMat.color.set(p.pos); eMat.color.set(p.neg); if (lastT && !lastT.colour && photon) photon.g.traverse((o) => o.material && o.material.color.set(p.ink2)); }, false);

    /* dragging the electron: capture-phase listener on the wrapper so the orbit controls never start */
    const cv = V.renderer.domElement, ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hitP = new THREE.Vector3(), tmp = new THREE.Vector3();
    let drag = null, justDragged = false;
    const toPlane = (e) => { const r = cv.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, V.camera); return ray.ray.intersectPlane(plane, hitP); };
    const nearestN = (r) => { let best = 1, d = Infinity; for (let n = 1; n <= maxN; n++) { const x = Math.abs(Rw(n) - r); if (x < d) { d = x; best = n; } } return { n: best, d }; };
    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const r = cv.getBoundingClientRect(); tmp.copy(electron.position).project(V.camera);
      const sx = ((tmp.x + 1) / 2) * r.width + r.left, sy = ((1 - tmp.y) / 2) * r.height + r.top;
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > (e.pointerType === "touch" ? 30 : 20)) return;
      e.stopPropagation(); e.preventDefault(); finish();
      drag = { id: e.pointerId }; cv.setPointerCapture(e.pointerId); V.wrap.classList.add("grab");
    };
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return; if (!toPlane(e)) return;
      const rr = clamp(Math.hypot(hitP.x, hitP.y), Rw(1) * 0.6, RMAX * 1.08); theta = Math.atan2(hitP.y, hitP.x); setE(rr);
      const { n } = nearestN(rr); setGhost(n !== st.n ? n : 0);
    };
    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return; drag = null; V.wrap.classList.remove("grab"); justDragged = true; setTimeout(() => (justDragged = false), 0);
      const rr = Math.hypot(electron.position.x, electron.position.y); setGhost(0);
      api.request(nearestN(rr).n, { theta });
    };
    V.wrap.addEventListener("pointerdown", onDown, true); cv.addEventListener("pointermove", onMove); cv.addEventListener("pointerup", onUp); cv.addEventListener("pointercancel", onUp);
    /* tap on an orbit sends the electron there */
    V.onTap((e) => { if (justDragged || drag) return; if (!toPlane(e)) return; const rr = Math.hypot(hitP.x, hitP.y); const { n, d } = nearestN(rr); if (d < 0.07 && n !== st.n) api.request(n, { theta: Math.atan2(hitP.y, hitP.x) }); });
    const onKey = (e) => { if (/^[1-9]$/.test(e.key)) { const n = +e.key; if (n <= maxN) { e.preventDefault(); api.request(n); } } else if (e.key === "PageUp") { e.preventDefault(); api.request(st.n + 1); } else if (e.key === "PageDown") { e.preventDefault(); api.request(st.n - 1); } };
    V.wrap.addEventListener("keydown", onKey);
    V.disposers.push(() => { V.wrap.removeEventListener("pointerdown", onDown, true); cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerup", onUp); cv.removeEventListener("pointercancel", onUp); V.wrap.removeEventListener("keydown", onKey); });
    buildOrbits();
    return { V, show, place, setScale, clearPhoton, dispose() { finish(); V.dispose(); } };
  };
}

/* ---------- 2D atom (no WebGL) ---------- */
function visual2D() {
  return (left, api) => {
    const st = api.st, maxN = st.maxN, S = 300, c = S / 2, RM = 128; let theta = 0.72 * Math.PI, lastT = null;
    const box = el("div", { class: "bh-2d" }); left.append(box);
    const unit = () => RM / dispR(maxN, st.trueScale);
    function draw() {
      const R = (n) => dispR(n, st.trueScale) * unit();
      let s = `<svg viewBox="0 0 ${S} ${S + 16}" class="fig" role="img" aria-label="Bohr orbits seen from above, electron in n = ${st.n}">`;
      for (let n = 1; n <= maxN; n++) { const on = n === st.n; s += `<circle cx="${c}" cy="${c}" r="${R(n).toFixed(1)}" style="fill:none;stroke:${on ? "var(--c,var(--accent))" : "var(--fig-axis)"};stroke-width:${on ? 2.4 : 1}"/>`; const a = -0.6 * Math.PI + 0.15 * Math.PI * (n - 1); s += `<text x="${(c + (R(n) + 4) * Math.cos(a)).toFixed(1)}" y="${(c - (R(n) + 4) * Math.sin(a) + 4).toFixed(1)}" style="font-size:9px">${n}</text>`; }
      s += `<circle cx="${c}" cy="${c}" r="3.5" style="fill:var(--phase-pos)"/>`;
      const ex = c + R(st.n) * Math.cos(theta), ey = c - R(st.n) * Math.sin(theta);
      const T = lastT;
      if (T) { const inc = T.kind === "absorbed"; const at = inc ? R(T.ni) : R(T.nf); const ax = c + at * Math.cos(theta), ay = c - at * Math.sin(theta); const dx = Math.cos(theta), dy = -Math.sin(theta); const fx = ax + dx * 70, fy = ay + dy * 70; const col = T.colour ? nmToCss(T.lam) : "var(--ink2)";
        let d = ""; for (let i = 0; i <= 60; i++) { const t = i / 60, w = 5 * Math.sin(t * 6 * Math.PI) * Math.min(1, (1 - t) / 0.1, t / 0.1); const px = (inc ? fx : ax) + ((inc ? ax : fx) - (inc ? fx : ax)) * t - dy * w, py = (inc ? fy : ay) + ((inc ? ay : fy) - (inc ? fy : ay)) * t + dx * w; d += `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)} `; }
        const hx = inc ? ax : fx, hy = inc ? ay : fy, ux = inc ? -dx : dx, uy = inc ? -dy : dy;
        s += `<path d="${d}" style="fill:none;stroke:${col};stroke-width:2.2"/><path d="M${hx} ${hy} L${hx - ux * 9 - uy * 5} ${hy - uy * 9 + ux * 5} L${hx - ux * 9 + uy * 5} ${hy - uy * 9 - ux * 5} Z" style="fill:${col}"/>`;
        s += `<text x="${c}" y="${S + 12}" text-anchor="middle" class="lbl">${T.kind}: ${nmText(T.lam, 4)} nm, ${T.colour || T.region.name}</text>`; }
      s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="5" style="fill:var(--phase-neg)"/><text x="${(ex + 7).toFixed(1)}" y="${(ey - 6).toFixed(1)}" class="lbl">e⁻</text></svg>`;
      box.innerHTML = s + `<p class="small muted">3D needs WebGL, which is off in this browser, so the orbits are drawn flat, seen from above${st.trueScale ? " at true scale (r = n²a₀)" : "; orbits n ≥ 4 are drawn closer together than to scale"}. Use the buttons or the ladder to move the electron.</p>`;
    }
    return { V: null, show(T) { lastT = T; draw(); }, place() { draw(); }, setScale() { draw(); }, clearPhoton() { lastT = null; draw(); }, dispose() { box.remove(); } };
  };
}

export function mount(host, P = {}, ctx = {}) {
  const p = panel(host, P, ctx, visual3D(P, ctx));
  return { viewer: p.viewer, state: p.state, set: (q) => { if (q.n != null) p.go(+q.n); }, go: p.go, reset: p.reset, dispose: p.dispose };
}
export function fallback(host, P = {}, ctx = {}) {
  const p = panel(host, P, ctx, visual2D());
  return { state: p.state, go: p.go, dispose: p.dispose };
}
