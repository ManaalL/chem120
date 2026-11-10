/* CHEM 120 Interactive: an ionic lattice and the Coulomb estimate of the lattice energy (Module 4, p. 15).
   A rock-salt (NaCl-type) arrangement, 4 x 4 x 4 ions, cations and anions as spheres sized to the ionic radii printed on p. 15
   (LiF 68 and 136 pm, NaCl 97 and 181 pm, ZnO 74 and 140 pm), every sphere marked + / − (or 2+ / 2−) on its surface.
   One cation-anion pair is see-through with the distance r0 = r+ + r- drawn between the centres.
   Readout: q1q2 (units of e), r0, dH ~ A N_A q1 q2 / (4 pi eps0 r0) with A = 1.7476 (the notes' Madelung constant for the NaCl structure),
   next to the notes' values. ZnO is drawn as rock salt, as the notes' estimate assumes (real ZnO has a different structure).
   params: {pair: "NaCl", pairs: ["LiF","NaCl","ZnO"], spread: 1, cell: false} */
import { THREE, Viewer, palette } from "./viewer.mjs";

const reduce = () => !!(window.C120 && window.C120.reduceMotion && window.C120.reduceMotion());
function el(t, a = {}, ...k) { const e = document.createElement(t); for (const x in a) { if (a[x] == null || a[x] === false) continue; if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; }
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* Module 4, p. 15 */
export const PAIRS = {
  LiF: { cat: "Li", an: "F", q: 1, rp: 68, rm: 136, dH: -1036 },
  NaCl: { cat: "Na", an: "Cl", q: 1, rp: 97, rm: 181, dH: -781 },
  ZnO: { cat: "Zn", an: "O", q: 2, rp: 74, rm: 140, dH: -4059 }
};
export const MADELUNG = 1.7476, EPS0 = 8.854e-12, E_CH = 1.602e-19, NA = 6.022e23;
/* electrostatic estimate in kJ/mol: A N_A q1 q2 e^2 / (4 pi eps0 r0) */
export function coulomb(key) { const d = PAIRS[key]; const r0 = (d.rp + d.rm) * 1e-12; return (MADELUNG * NA * (-d.q * d.q) * E_CH * E_CH) / (4 * Math.PI * EPS0 * r0) / 1000; }
const chg = (q, s) => (q > 1 ? q : "") + (s > 0 ? "+" : "−");
const ionTex = (d, s) => `${d[s > 0 ? "cat" : "an"]}<sup>${chg(d.q, s)}</sup>`;
const mn = (v) => String(v).replace("-", "−");
const fmtK = (v) => (v < 0 ? "−" : "") + Math.round(Math.abs(v)).toLocaleString("en-CA");

function readoutHTML(key) {
  const d = PAIRS[key], est = coulomb(key), r0 = d.rp + d.rm;
  const sub = `(1.7476)(6.022 × 10<sup>23</sup> mol<sup>−1</sup>)(${mn(-d.q * d.q)})(1.602 × 10<sup>−19</sup> C)<sup>2</sup> / [4π(8.854 × 10<sup>−12</sup> C<sup>2</sup> J<sup>−1</sup> m<sup>−1</sup>)(${r0} × 10<sup>−12</sup> m)]`;
  return `<div><b>${ionTex(d, 1)} and ${ionTex(d, -1)}</b>: q₁q₂ = (${chg(d.q, 1).replace(/^\+$/, "+1").replace(/^2\+$/, "+2")})(${chg(d.q, -1).replace(/^−$/, "−1").replace(/^2−$/, "−2")}) = <b>${mn(-d.q * d.q)}</b> (in units of e) · r₀ = r₊ + r₋ = ${d.rp} + ${d.rm} = <b>${r0} pm</b></div>
    <div>ΔH<sub>lattice</sub> ≈ A N<sub>A</sub> q₁q₂ / (4πε₀r₀) = ${sub} = <b>${fmtK(est)} kJ mol<sup>−1</sup></b></div>
    <div class="lt-bars" style="--c:var(--accent)">
      <div class="lt-bar"><span>estimate ${fmtK(est)}</span><i style="width:100%"></i></div>
      <div class="lt-bar"><span>notes&nbsp;&nbsp;&nbsp;${fmtK(d.dH)}</span><i class="n" style="width:${((d.dH / est) * 100).toFixed(1)}%"></i></div></div>
    <div class="muted small">A = 1.7476 is the Madelung constant the notes give for crystals with the NaCl structure (p. 15), and each q is written in units of e, so the formula uses q₁q₂ × e².${key === "ZnO" ? " ZnO is drawn as rock salt, as the notes' estimate assumes; real ZnO has a different structure, so its A is different and this estimate is only rough." : ""} The estimate is ${((est / d.dH - 1) * 100).toFixed(0)}% larger in size than the notes' value: the formula overestimates because it counts only the attraction and repulsion between point charges and ignores the repulsion between the ions' electron clouds.</div>`;
}
function table(keys, cur, onPick) {
  const t = el("table", { class: "lt-tab" });
  t.innerHTML = `<thead><tr><th>solid</th><th>q₁q₂</th><th>r₀ / pm</th><th>estimate / kJ mol⁻¹</th><th>notes / kJ mol⁻¹</th><th>ratio</th></tr></thead>`;
  const tb = el("tbody");
  keys.forEach((k) => { const d = PAIRS[k], est = coulomb(k); const tr = el("tr", { class: k === cur ? "on" : null, tabindex: onPick ? "0" : null, "aria-current": k === cur ? "true" : null });
    tr.innerHTML = `<td>${k}</td><td>${mn(-d.q * d.q)}</td><td>${d.rp + d.rm}</td><td>${fmtK(est)}</td><td>${fmtK(d.dH)}</td><td>${(est / d.dH).toFixed(2)}</td>`;
    if (onPick) { tr.onclick = () => onPick(k); tr.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(k); } }; }
    tb.append(tr); });
  t.append(tb); const w = el("div", { class: "lt-scroll" }); w.append(t); return w;
}

/* a texture with the charge printed several times round the sphere, so the sign never depends on colour alone */
function glyphTexture(text) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 256);
  g.fillStyle = "#3a3a3a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `700 ${text.length > 1 ? 50 : 66}px "Source Sans 3", Arial, sans-serif`;
  for (let i = 0; i < 6; i++) g.fillText(text, (i + 0.5) * (512 / 6), 128);
  g.font = `700 ${text.length > 1 ? 40 : 52}px "Source Sans 3", Arial, sans-serif`;
  for (let i = 0; i < 4; i++) { g.fillText(text, (i + 0.25) * 128, 64); g.fillText(text, (i + 0.75) * 128, 192); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function mount(host, P = {}, ctx = {}) {
  const keys = (P.pairs || ["LiF", "NaCl", "ZnO"]).filter((k) => PAIRS[k]);
  const st = { pair: PAIRS[P.pair] ? P.pair : keys.includes("NaCl") ? "NaCl" : keys[0], spread: clamp(+P.spread || 1, 1, 2.5), cell: !!P.cell };
  const S = 1 / 200, N = 4;
  const V = new Viewer(host, { label: "Rock-salt lattice of cations and anions", cam: [6.2, -12.4, 7.2], aspect: P.aspect || 0.72, minD: 4, maxD: 48, onInteract: ctx.onInteract });
  const cur = { rp: PAIRS[st.pair].rp, rm: PAIRS[st.pair].rm };
  const sites = []; for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) sites.push({ i, j, k, cat: (i + j + k) % 2 === 0 });
  const catSites = sites.filter((s) => s.cat), anSites = sites.filter((s) => !s.cat);
  const geo = new THREE.SphereGeometry(1, 28, 18).rotateX(Math.PI / 2), geoHi = new THREE.SphereGeometry(1, 36, 24).rotateX(Math.PI / 2);
  const texCache = {}; const tex = (t) => texCache[t] || (texCache[t] = glyphTexture(t));
  const matC = new THREE.MeshStandardMaterial({ color: V.pal.pos, roughness: 0.5, map: tex("+") }), matA = new THREE.MeshStandardMaterial({ color: V.pal.neg, roughness: 0.5, map: tex("−") });
  const instC = new THREE.InstancedMesh(geo, matC, catSites.length), instA = new THREE.InstancedMesh(geo, matA, anSites.length);
  const group = new THREE.Group(); group.add(instC, instA); V.add(group);
  /* the measured pair sits on the top front edge, at the corner nearest the camera: cation (3,0,3) and anion (2,0,3); in the unit cell (2,0,2) and (1,0,2) */
  const pairC = () => (st.cell ? { i: 2, j: 0, k: 2 } : { i: 3, j: 0, k: 3 }), pairA = () => (st.cell ? { i: 1, j: 0, k: 2 } : { i: 2, j: 0, k: 3 });
  const isP = (s, p) => s.i === p.i && s.j === p.j && s.k === p.k;
  const hiC = new THREE.Mesh(geoHi, matC.clone()), hiA = new THREE.Mesh(geoHi, matA.clone());
  /* the measured pair is tinted with the accent colour so it stands out */
  [hiC, hiA].forEach((m) => { m.material.emissive = new THREE.Color(V.pal.accent); m.material.emissiveIntensity = 0.22; group.add(m); });
  const lineMat = new THREE.MeshBasicMaterial({ color: V.pal.head }), tipMat = new THREE.MeshBasicMaterial({ color: V.pal.accent });
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 14);
  const rodP = new THREE.Mesh(unitCyl, lineMat), rodM = new THREE.Mesh(unitCyl, lineMat); rodP.renderOrder = rodM.renderOrder = 6; group.add(rodP, rodM);
  /* a dimension line in front of the pair, so the measurement is never hidden behind other ions */
  const dimMat = new THREE.MeshBasicMaterial({ color: V.pal.head }), leadMat = new THREE.MeshBasicMaterial({ color: V.pal.axis, transparent: true, opacity: 0.7 });
  const dimP = new THREE.Mesh(unitCyl, dimMat), dimM = new THREE.Mesh(unitCyl, dimMat), leadC = new THREE.Mesh(unitCyl, leadMat), leadA = new THREE.Mesh(unitCyl, leadMat); group.add(dimP, dimM, leadC, leadA);
  const dots = [0, 1, 2, 3, 4, 5].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), tipMat); m.renderOrder = 7; group.add(m); return m; });
  const cellBox = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), new THREE.LineBasicMaterial({ color: V.pal.stroke })); group.add(cellBox);
  const labC = V.label("", new THREE.Vector3(), "ion"), labA = V.label("", new THREE.Vector3(), "ion");
  const labP = V.label("", new THREE.Vector3(), "tag"), labM = V.label("", new THREE.Vector3(), "tag"), lab0 = V.label("", new THREE.Vector3(), "tag");
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), VP = new THREE.Vector3(), VS = new THREE.Vector3(), ZERO = new THREE.Vector3(0, 0, 0), UP = new THREE.Vector3(0, 1, 0), XDIR = new THREE.Vector3(1, 0, 0);
  const pos = (s, d, c, o) => o.set((s.i - c) * d, (s.j - c) * d, (s.k - c) * d);
  const inCell = (s) => s.i <= 2 && s.j <= 2 && s.k <= 2;
  function layout() {
    const r0 = (cur.rp + cur.rm) * S, d = r0 * st.spread, c = st.cell ? 1 : 1.5, PC = pairC(), PA = pairA();
    const put = (inst, list, r) => { list.forEach((s, n) => { const show = (!st.cell || inCell(s)) && !isP(s, PC) && !isP(s, PA); pos(s, d, c, VP); VS.setScalar(show ? r * S : 0); M4.compose(VP, Q.identity(), VS); inst.setMatrixAt(n, M4); }); inst.instanceMatrix.needsUpdate = true; inst.computeBoundingSphere(); };
    put(instC, catSites, cur.rp); put(instA, anSites, cur.rm);
    const C = pos(PC, d, c, new THREE.Vector3()), A = pos(PA, d, c, new THREE.Vector3());
    hiC.position.copy(C); hiC.scale.setScalar(cur.rp * S); hiA.position.copy(A); hiA.scale.setScalar(cur.rm * S);
    const u = A.clone().sub(C).normalize(), rw = 0.028;
    const seg = (m, a, b) => { m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.set(rw, a.distanceTo(b), rw); m.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize()); };
    const Pend = C.clone().addScaledVector(u, cur.rp * S), Mend = A.clone().addScaledVector(u, -cur.rm * S);
    seg(rodP, C, Pend); seg(rodM, Mend, A);
    const front = -Math.max(cur.rp, cur.rm) * S - 0.35, off = new THREE.Vector3(0, front, 0);
    const Cf = C.clone().add(off), Af = A.clone().add(off), Pf = Pend.clone().add(off), Mf = Mend.clone().add(off);
    const seg2 = (m, a, b, w) => { seg(m, a, b); m.scale.x = m.scale.z = w; };
    seg2(dimP, Cf, Pf, 0.024); seg2(dimM, Mf, Af, 0.024); seg2(leadC, C, Cf, 0.008); seg2(leadA, A, Af, 0.008);
    [C, A, Pend, Cf, Af, Pf].forEach((v, n) => { dots[n].position.copy(v); dots[n].scale.setScalar(n < 3 ? 0.05 : 0.045); });
    dots[2].visible = dots[5].visible = st.spread < 1.001;
    cellBox.visible = st.cell; cellBox.scale.setScalar(2 * d); cellBox.position.set((1 - c) * d, (1 - c) * d, (1 - c) * d);
    const D = PAIRS[st.pair];
    labC.pos.copy(C).add(new THREE.Vector3(0, 0, cur.rp * S + 0.16)); labC.set(ionTex(D, 1));
    labA.pos.copy(A).add(new THREE.Vector3(0, 0, cur.rm * S + 0.16)); labA.set(ionTex(D, -1));
    labP.pos.copy(Cf).addScaledVector(u, -0.2).add(new THREE.Vector3(0, 0, 0.24)); labP.set(`r₊ = ${D.rp} pm`);
    labM.pos.copy(Af).addScaledVector(u, 0.2).add(new THREE.Vector3(0, 0, 0.24)); labM.set(`r₋ = ${D.rm} pm`);
    lab0.pos.copy(Cf).lerp(Af, 0.5).add(new THREE.Vector3(0, 0, -0.42)); lab0.set(`r₀ = r₊ + r₋ = ${D.rp + D.rm} pm${st.spread > 1.001 ? " when touching" : ""}`);
    V.requestRender();
  }
  function setMaps() { const q = PAIRS[st.pair].q; [matC, hiC.material].forEach((m) => { m.map = tex(q > 1 ? "2+" : "+"); m.needsUpdate = true; }); [matA, hiA.material].forEach((m) => { m.map = tex(q > 1 ? "2−" : "−"); m.needsUpdate = true; }); }
  V.theme((p) => { [matC, hiC.material].forEach((m) => m.color.set(p.pos)); [matA, hiA.material].forEach((m) => m.color.set(p.neg)); lineMat.color.set(p.head); dimMat.color.set(p.head); leadMat.color.set(p.axis); tipMat.color.set(p.accent); [hiC, hiA].forEach((m) => m.material.emissive.set(p.accent)); cellBox.material.color.set(p.stroke); }, false);
  let stop = null;
  function setPair(k) {
    if (!PAIRS[k]) return; st.pair = k; setMaps();
    if (stop) { stop(); stop = null; }
    const from = { ...cur }, to = { rp: PAIRS[k].rp, rm: PAIRS[k].rm };
    if (reduce()) { Object.assign(cur, to); layout(); }
    else { let t = 0; stop = V.animate((dt) => { t = Math.min(1, t + dt / 0.45); const e = t * t * (3 - 2 * t); cur.rp = from.rp + (to.rp - from.rp) * e; cur.rm = from.rm + (to.rm - from.rm) * e; layout(); if (t >= 1) stop = null; return t < 1; }); }
    seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
    info(); emit();
  }
  /* controls */
  const ctl = el("div", { class: "ctl lt" }); host.append(ctl);
  const row = el("div", { class: "row" }); ctl.append(row);
  const seg = el("div", { class: "seg", role: "group", "aria-label": "Ionic solid" });
  keys.forEach((k) => { const b = el("button", { type: "button", "data-k": k, "aria-pressed": String(k === st.pair) }, k); b.onclick = () => setPair(k); seg.append(b); });
  row.append(seg);
  const cellB = el("button", { type: "button", class: "chip", "aria-pressed": String(st.cell) }, "Show one unit cell");
  cellB.onclick = () => { st.cell = !st.cell; cellB.setAttribute("aria-pressed", String(st.cell)); layout(); emit(); }; row.append(cellB);
  window.PLOT.slider(ctl, { label: "Spread the ions apart (for viewing only)", min: 1, max: 2.5, step: 0.05, value: st.spread, fmt: (v) => (+v === 1 ? "touching" : "× " + (+v).toFixed(2)), oninput: (v) => { st.spread = v; layout(); emit(); } });
  const out = el("div", { class: "readout lt-out", "aria-live": "polite" }); ctl.append(out);
  const tabHost = el("div"); ctl.append(tabHost);
  ctl.append(el("div", { class: "small muted", html: `Spheres are drawn to the ionic radii on p. 15 (1 pm on screen is the same for all three solids, so LiF really is the smallest). Every cation is printed with + (or 2+) and every anion with − (or 2−). The tinted pair at the front corner is measured on the line in front of it: r₀ = r₊ + r₋, the distance between the centres of touching ions.` }));
  function info() { out.innerHTML = readoutHTML(st.pair); tabHost.innerHTML = ""; tabHost.append(table(keys, st.pair, (k) => setPair(k))); }
  function emit() { if (ctx.onState) ctx.onState({ pair: st.pair, spread: st.spread, cell: st.cell }); }
  setMaps(); layout(); info();
  return { viewer: V, state: () => ({ pair: st.pair, spread: st.spread, cell: st.cell, r0: PAIRS[st.pair].rp + PAIRS[st.pair].rm, estimate: coulomb(st.pair), notes: PAIRS[st.pair].dH }), set: (p) => { if (p.pair) setPair(p.pair); }, dispose() { if (stop) stop(); Object.values(texCache).forEach((t) => t.dispose()); unitCyl.dispose(); V.dispose(); ctl.remove(); } };
}

/* 2D fallback: one face of the lattice (4 x 4) to scale, with + and − on every ion, the measured pair, and the same table */
export function fallback(host, P = {}, ctx = {}) {
  const keys = (P.pairs || ["LiF", "NaCl", "ZnO"]).filter((k) => PAIRS[k]);
  let key = PAIRS[P.pair] ? P.pair : keys.includes("NaCl") ? "NaCl" : keys[0];
  const wrap = el("div", { class: "v3d-fallback lt-fb" }); host.append(wrap);
  const fig = el("div"); const seg = el("div", { class: "seg", role: "group", "aria-label": "Ionic solid" }); const out = el("div", { class: "readout lt-out" }); const tab = el("div");
  keys.forEach((k) => { const b = el("button", { type: "button", "aria-pressed": String(k === key) }, k); b.onclick = () => { key = k; seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw(); }; seg.append(b); });
  wrap.append(seg, fig, out, tab, el("p", { class: "small muted" }, "3D needs WebGL, which is off in this browser, so here is one face of the rock-salt lattice, drawn to the ionic radii on p. 15."));
  function draw() {
    const d = PAIRS[key], s = 0.32, r0 = (d.rp + d.rm) * s, W = 4 * r0 + 40, c0 = 20 + r0 / 2; let g = `<svg viewBox="0 0 ${W.toFixed(0)} ${W.toFixed(0)}" class="fig" role="img" aria-label="One face of the ${key} lattice">`;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const cat = (i + j) % 2 === 0; const r = (cat ? d.rp : d.rm) * s; const x = c0 + i * r0, y = c0 + j * r0; const pair = j === 3 && (i === 1 || i === 2);
      g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" style="fill:var(${cat ? "--phase-pos" : "--phase-neg"});fill-opacity:${pair ? 0.45 : 0.9};stroke:var(--fig-stroke);stroke-width:.8"/><text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" class="lbl" style="fill:#fff">${chg(d.q, cat ? 1 : -1)}</text>`; }
    const y = c0 + 3 * r0, xa = c0 + r0, xb = c0 + 2 * r0; const catLeft = (1 + 3) % 2 === 0;
    g += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" style="stroke:var(--head);stroke-width:2.4"/><text x="${(xa + xb) / 2}" y="${y - (catLeft ? d.rp : d.rm) * s * 0.2 - 6}" text-anchor="middle" class="lbl">r₀ = ${d.rp + d.rm} pm</text></svg>`;
    fig.innerHTML = g; out.innerHTML = readoutHTML(key); tab.innerHTML = ""; tab.append(table(keys, key, null));
  }
  draw();
  return { state: () => ({ pair: key }), dispose() { wrap.remove(); } };
}
