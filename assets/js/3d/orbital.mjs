/* CHEM 120 Interactive: hydrogen orbital lab.
   Every surface, cloud and slice is computed from the hydrogen wavefunctions in Module 2, p. 21 (Psi = R(r) Y(theta, phi)).
   Views: boundary surface (90% of the probability), probability point cloud sampled from |Psi|^2, slice plane.
   Phase: + lobes warm and solid, - lobes cool and hatched, each lobe labelled + or -. Nodes: radial spheres, angular planes and cones.
   The radial distribution plot is linked to the 3D view: drag along r and the same shell lights up in the orbital.
   params: {orbital:"2pz", mode:"surface"|"cloud"|"slice", picker:"list"|"qn"|"none", choices:[ids], nodes, radial:"rdf"|"R"|"R2"|false, fraction:0.9} */
import { THREE, Viewer, surfaceMaterial, dotTexture, palette } from "./viewer.mjs";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import * as H from "./hydrogen.mjs";

const WORLD = 1.25;
const gridCache = new Map();
function gridFor(orb) {
  const res = orb.n >= 4 ? 84 : orb.n === 3 ? 80 : orb.n === 2 ? 66 : 56;
  const key = `${orb.id}:${res}`;
  if (!gridCache.has(key)) { const L = H.extentFor(orb.n); gridCache.set(key, { res, L, field: H.psiGrid(orb, res, L), thr: new Map() }); }
  if (gridCache.size > 12) gridCache.delete(gridCache.keys().next().value);
  return gridCache.get(key);
}
/* connected lobes above the threshold, on a coarse grid, for the + and - labels */
function lobes(orb, thr, L) {
  const N = 34, half = N / 2, f = new Float32Array(N * N * N);
  let i = 0;
  for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let m = 0; m < N; m++) {
    const x = ((m - half + 0.5) / half) * L, y = ((j - half + 0.5) / half) * L, z = ((k - half + 0.5) / half) * L;
    f[i++] = H.psi(orb, x, y, z);
  }
  const seen = new Uint8Array(f.length), out = [];
  const idx = (m, j, k) => m + N * (j + N * k);
  for (let s = 0; s < f.length; s++) {
    if (seen[s] || Math.abs(f[s]) < thr) continue;
    const sign = Math.sign(f[s]); const stack = [s]; seen[s] = 1; let best = s, n = 0, cx = 0, cy = 0, cz = 0, wsum = 0;
    while (stack.length) {
      const c = stack.pop(); n++; if (Math.abs(f[c]) > Math.abs(f[best])) best = c;
      { const w = Math.abs(f[c]); const mm = c % N, jj = Math.floor(c / N) % N, kk = Math.floor(c / (N * N)); cx += w * mm; cy += w * jj; cz += w * kk; wsum += w; }
      const m = c % N, j = Math.floor(c / N) % N, k = Math.floor(c / (N * N));
      for (const [dm, dj, dk] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) {
        const a = m + dm, b = j + dj, cc = k + dk; if (a < 0 || b < 0 || cc < 0 || a >= N || b >= N || cc >= N) continue;
        const q = idx(a, b, cc); if (!seen[q] && Math.abs(f[q]) >= thr && Math.sign(f[q]) === sign) { seen[q] = 1; stack.push(q); }
      }
    }
    if (n < 3) continue;
    let m = best % N, j = Math.floor(best / N) % N, k = Math.floor(best / (N * N));
    const qm = Math.round(cx / wsum), qj = Math.round(cy / wsum), qk = Math.round(cz / wsum); const qv = f[idx(qm, qj, qk)];
    if (Math.sign(qv) === sign && Math.abs(qv) >= thr) { m = qm; j = qj; k = qk; }
    out.push({ sign, x: ((m - half + 0.5) / half) * L, y: ((j - half + 0.5) / half) * L, z: ((k - half + 0.5) / half) * L, size: n });
  }
  return out;
}

/* heat map of Psi on a plane, phase coloured, negative region hatched, nodal lines drawn */
export function sliceCanvas(orb, axis, off, L, N, canvas, pal, translucent) {
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext("2d"); const img = ctx.createImageData(N, N); const vals = new Float32Array(N * N); let max = 0;
  for (let j = 0; j < N; j++) { const v = L - (2 * L * (j + 0.5)) / N; for (let i = 0; i < N; i++) { const u = -L + (2 * L * (i + 0.5)) / N; let x, y, z;
    if (axis === "xy") { x = u; y = v; z = off; } else if (axis === "yz") { y = u; z = v; x = off; } else { x = u; z = v; y = off; }
    const p = H.psi(orb, x, y, z); vals[j * N + i] = p; if (p * p > max) max = p * p; } }
  const P = new THREE.Color(pal.pos), Ng = new THREE.Color(pal.neg), bg = new THREE.Color(pal.paper);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, p = vals[k]; let t = max > 1e-14 ? Math.pow((p * p) / max, 0.42) : 0;
    const c = p >= 0 ? P : Ng;
    let r = bg.r + (c.r - bg.r) * t, g = bg.g + (c.g - bg.g) * t, b = bg.b + (c.b - bg.b) * t;
    if (p < 0 && t > 0.06 && ((i + j) % 9) < 2) { r *= 0.62; g *= 0.62; b *= 0.62; }
    if (max > 1e-14 && i < N - 1 && j < N - 1) { const th = Math.sqrt(max) * 2e-4, a = vals[k], br = vals[k + 1], bd = vals[k + N];
      if ((a > th && br < -th) || (a < -th && br > th) || (a > th && bd < -th) || (a < -th && bd > th)) { const ink = new THREE.Color(pal.stroke); r = ink.r; g = ink.g; b = ink.b; t = 1; } }
    img.data[k * 4] = r * 255; img.data[k * 4 + 1] = g * 255; img.data[k * 4 + 2] = b * 255; img.data[k * 4 + 3] = translucent ? Math.round(40 + 215 * Math.min(1, t * 1.4)) : 255;
  }
  ctx.putImageData(img, 0, 0);
  return { vals, max };
}

const ORDER = ["1s", "2s", "2px", "2py", "2pz", "3s", "3px", "3py", "3pz", "3dxy", "3dyz", "3dxz", "3dx2y2", "3dz2"];
/* real orbital used for a given ml (the notes draw real orbitals; p_z and d_z2 are ml = 0, the others combine +ml and -ml) */
const ML_TO_ANG = { 1: { 0: "pz", 1: "px", "-1": "py" }, 2: { 0: "dz2", 1: "dxz", "-1": "dyz", 2: "dx2y2", "-2": "dxy" } };

export function mount(host, P = {}, ctx = {}) {
  const el = (t, a = {}, ...k) => { const e = document.createElement(t); for (const x in a) { if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };
  const rich = window.C120.rich;
  const st = { orbital: P.orbital || "2pz", mode: P.mode || "surface", nodes: !!P.nodes, labels: P.labels !== false, axes: true, fraction: P.fraction || 0.9, r: null, sliceAxis: P.sliceAxis || "xz", trueScale: false };
  const V = new Viewer(host, { label: P.label || "Hydrogen orbital", cam: [3.6, 2.6, 2.0], aspect: P.aspect || 0.78, onInteract: ctx.onInteract });
  const root = new THREE.Group(); V.add(root);
  const axes = V.axes(WORLD * 1.18);
  const pal = () => V.pal;
  const matP = surfaceMaterial(pal().pos, { opacity: 0.92, side: THREE.DoubleSide, roughness: 0.42 });
  const matN = surfaceMaterial(pal().neg, { opacity: 0.92, side: THREE.DoubleSide, roughness: 0.42, hatch: true, hatchScale: 9 });
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  let mcP = null, mcN = null, cloudP = null, cloudN = null, shell = null, nodesG = new THREE.Group(), lobeLabels = [], thr = 0;
  root.add(nodesG);
  const sliceCv = document.createElement("canvas"); const sliceTex = new THREE.CanvasTexture(sliceCv); sliceTex.colorSpace = THREE.SRGBColorSpace;
  const sliceMesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * WORLD, 2 * WORLD), new THREE.MeshBasicMaterial({ map: sliceTex, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  sliceMesh.renderOrder = 10; root.add(sliceMesh);
  const frameMat = new THREE.LineBasicMaterial({ color: pal().axis });
  sliceMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2 * WORLD, 2 * WORLD)), frameMat));
  const orb = () => H.getOrbital(st.orbital);
  const extent = () => (st.trueScale ? H.extentFor(Math.max(3, orb().n)) : H.extentFor(orb().n));
  const scale = () => WORLD / extent();

  function build() {
    const o = orb(), g = gridFor(o);
    if (!g.thr.has(st.fraction)) g.thr.set(st.fraction, H.enclosingThreshold(g.field, st.fraction));
    thr = g.thr.get(st.fraction);
    if (!mcP || mcP.resolution !== g.res) {
      [mcP, mcN].forEach((m) => { if (m) { root.remove(m); m.geometry.dispose(); } });
      mcP = new MarchingCubes(g.res, matP, false, false, 120000); mcN = new MarchingCubes(g.res, matN, false, false, 120000);
      mcP.frustumCulled = mcN.frustumCulled = false; root.add(mcP, mcN);
    }
    const fp = mcP.field, fn = mcN.field; for (let i = 0; i < g.field.length; i++) { fp[i] = g.field[i]; fn[i] = -g.field[i]; }
    mcP.isolation = mcN.isolation = thr; mcP.update(); mcN.update();
    const s = g.L * scale(); mcP.scale.setScalar(s); mcN.scale.setScalar(s);
    lobeLabels.forEach((l) => l.remove()); lobeLabels = [];
    for (const lb of lobes(o, thr, g.L)) { const k = scale(); lobeLabels.push(V.label(lb.sign > 0 ? "+" : "−", new THREE.Vector3(lb.x * k, lb.y * k, lb.z * k), "phase " + (lb.sign > 0 ? "pos" : "neg"))); }
    buildCloud(); buildNodes(); updateSlice(); vis(); readout(); drawPlot();
  }
  function buildCloud() {
    [cloudP, cloudN].forEach((c) => { if (c) { root.remove(c); c.geometry.dispose(); c.material.dispose(); } }); cloudP = cloudN = null;
    if (st.mode !== "cloud") return;
    const n = P.points || (matchMedia("(max-width: 600px)").matches ? 22000 : 40000);
    const { pos, sign } = H.samplePoints(orb(), n, 11); const s = scale();
    const make = (sg, tex, color) => { const arr = []; for (let i = 0; i < sign.length; i++) if (sign[i] === sg) arr.push(pos[3 * i] * s, pos[3 * i + 1] * s, pos[3 * i + 2] * s);
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.026, map: tex, color, transparent: true, opacity: 0.8, depthWrite: false, sizeAttenuation: true })); };
    cloudP = make(1, dotTexture(), pal().pos); cloudN = make(-1, ringTexture(), pal().neg); root.add(cloudP, cloudN);
  }
  function buildNodes() {
    nodesG.children.slice().forEach((c) => { nodesG.remove(c); c.geometry && c.geometry.dispose(); c.material && c.material.dispose(); });
    if (!st.nodes) return;
    const o = orb(), s = scale(), ink = pal().stroke;
    const surf = () => new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
    const line = () => new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.45 });
    for (const r of H.radialNodePositions(o.n, o.l)) { nodesG.add(new THREE.Mesh(new THREE.SphereGeometry(r * s, 48, 32), surf())); const w = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(r * s, 20, 10)), line()); w.material.opacity = 0.18; nodesG.add(w); }
    const E = WORLD * 0.95;
    const plane = (nv) => { const g = new THREE.PlaneGeometry(2 * E, 2 * E); const m = new THREE.Mesh(g, surf()); m.lookAt(...nv); const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), line()); e.lookAt(...nv); nodesG.add(m, e); };
    ({ px: [[1, 0, 0]], py: [[0, 1, 0]], pz: [[0, 0, 1]], dxy: [[1, 0, 0], [0, 1, 0]], dyz: [[0, 1, 0], [0, 0, 1]], dxz: [[1, 0, 0], [0, 0, 1]], dx2y2: [[1, -1, 0], [1, 1, 0]] }[o.ang] || []).forEach(plane);
    if (o.ang === "dz2") { const h = E, rad = h * Math.SQRT2; for (const d of [1, -1]) { const g = new THREE.ConeGeometry(rad, h, 64, 1, true); const m = new THREE.Mesh(g, surf()); m.rotation.x = d > 0 ? -Math.PI / 2 : Math.PI / 2; m.position.z = (d * h) / 2; nodesG.add(m); const rim = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 64 }, (_, i) => new THREE.Vector3(rad * Math.cos((i / 64) * 2 * Math.PI), rad * Math.sin((i / 64) * 2 * Math.PI), d * h))), line()); nodesG.add(rim); } }
  }
  function updateSlice() {
    const on = st.mode === "slice"; sliceMesh.visible = on;
    const cl = on ? [clip] : [];
    [matP, matN].forEach((m) => { m.clippingPlanes = cl; m.needsUpdate = true; });
    nodesG.traverse((o) => { if (o.material) { o.material.clippingPlanes = cl; o.material.needsUpdate = true; } });
    lobeLabels.forEach((l) => { l.visible = st.labels && (on ? sideOK(l.pos) : st.mode !== "cloud" || true); });
    if (!on) return;
    sliceCanvas(orb(), st.sliceAxis, 0, extent(), 220, sliceCv, pal(), true); sliceTex.needsUpdate = true;
    sliceMesh.rotation.set(0, 0, 0); sliceMesh.position.set(0, 0, 0);
    if (st.sliceAxis === "xy") clip.normal.set(0, 0, -1); else if (st.sliceAxis === "yz") { sliceMesh.rotation.set(Math.PI / 2, Math.PI / 2, 0); clip.normal.set(-1, 0, 0); } else { sliceMesh.rotation.set(Math.PI / 2, 0, 0); clip.normal.set(0, -1, 0); }
    clip.constant = 0;
  }
  const sideOK = (p) => clip.normal.dot(p) + clip.constant >= -1e-6;
  function vis() {
    const surfOn = st.mode !== "cloud" || st.r != null;
    mcP.visible = mcN.visible = st.mode !== "cloud";
    const inner = H.radialNodePositions(orb().n, orb().l).length > 0;
    const op = st.mode === "slice" ? 0.55 : inner ? 0.62 : 0.92;
    matP.opacity = matN.opacity = op; matP.depthWrite = matN.depthWrite = op > 0.9;
    lobeLabels.forEach((l) => { l.visible = st.labels && (st.mode !== "slice" || sideOK(l.pos)); });
    axes.setVisible(st.axes);
    V.requestRender();
  }
  /* the shell at radius r picked on the radial plot */
  function setShell(r) {
    st.r = r; if (shell) { root.remove(shell); shell.geometry.dispose(); shell.material.dispose(); shell = null; }
    if (r == null) return V.requestRender();
    const s = scale();
    shell = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.004, r * s), 48, 32), new THREE.MeshBasicMaterial({ color: pal().accent, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
    const w = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(Math.max(0.004, r * s), 24, 12)), new THREE.LineBasicMaterial({ color: pal().accent, transparent: true, opacity: 0.55 }));
    shell.add(w); root.add(shell); V.requestRender();
  }
  V.theme((p) => { matP.color.set(p.pos); matN.color.set(p.neg); frameMat.color.set(p.axis); if (cloudP) { cloudP.material.color.set(p.pos); cloudN.material.color.set(p.neg); } if (st.mode === "slice") updateSlice(); buildNodes(); if (st.r != null) setShell(st.r); drawPlot(); }, false);

  /* ---------- controls under the canvas ---------- */
  const ctl = el("div", { class: "ctl o3" }); host.append(ctl);
  const pickRow = el("div", { class: "o3-pick" }); ctl.append(pickRow);
  function drawPicker() {
    pickRow.innerHTML = "";
    if (P.picker === "none") return;
    if (P.picker === "qn") {
      const o = orb(); const mlNow = Object.entries(ML_TO_ANG[o.l] || { 0: "s" }).find(([, a]) => a === o.ang); const ml = o.l === 0 ? 0 : +(mlNow ? mlNow[0] : 0);
      const mk = (lab, vals, cur, on) => { const w = el("label", { class: "qn" }, el("span", { html: rich(lab) })); const s = el("select", { "aria-label": lab.replace(/\$/g, "") }); vals.forEach((v) => { const op = el("option", { value: v }, String(v)); if (v === cur) op.selected = true; s.append(op); }); s.onchange = () => on(+s.value); w.append(s); return w; };
      const maxN = P.maxN || 4;
      pickRow.append(mk("$n$", Array.from({ length: maxN }, (_, i) => i + 1), o.n, (n) => { const l = Math.min(o.l, n - 1); setOrb(H.orbitalFor(n, l, l === o.l ? o.ang : null).id); }));
      pickRow.append(mk("$l$", Array.from({ length: Math.min(3, o.n) }, (_, i) => i), o.l, (l) => setOrb(H.orbitalFor(o.n, l).id)));
      pickRow.append(mk("$m_l$", Array.from({ length: 2 * o.l + 1 }, (_, i) => i - o.l), ml, (m) => setOrb(H.orbitalFor(o.n, o.l, o.l ? ML_TO_ANG[o.l][m] : "s").id)));
      pickRow.append(el("span", { class: "small muted qnnote", html: rich(`Showing $${o.tex}$. ${o.l === 0 ? "" : o.ang === "pz" || o.ang === "dz2" ? "This is the $m_l = 0$ orbital." : "Real orbitals like this one combine $+m_l$ and $-m_l$, so the label is a convention."}${o.l > 2 ? "" : ""}`) }));
      return;
    }
    const ids = P.choices || ORDER;
    const seg = el("div", { class: "chips orbs", role: "group", "aria-label": "Choose an orbital" });
    ids.forEach((id) => { const o = H.getOrbital(id); const b = el("button", { type: "button", class: "chip", "aria-pressed": String(id === st.orbital), html: rich(`$${o.tex}$`) }); b.onclick = () => setOrb(id); seg.append(b); });
    pickRow.append(seg);
  }
  const modeRow = el("div", { class: "row" }); ctl.append(modeRow);
  const segM = el("div", { class: "seg", role: "group", "aria-label": "View" });
  [["surface", "Surface"], ["cloud", "Point cloud"], ["slice", "Slice"]].forEach(([k, t]) => { const b = el("button", { type: "button", "aria-pressed": String(st.mode === k) }, t); b.onclick = () => { st.mode = k; segM.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); buildCloud(); updateSlice(); vis(); emit(); }; segM.append(b); });
  modeRow.append(segM);
  const tog = (t, key, fn) => { const b = el("button", { type: "button", class: "chip", "aria-pressed": String(!!st[key]) }, t); b.onclick = () => { st[key] = !st[key]; b.setAttribute("aria-pressed", String(st[key])); fn(); emit(); }; modeRow.append(b); return b; };
  tog("Nodes", "nodes", () => buildNodes());
  tog("+ / − labels", "labels", () => vis());
  tog("Axes", "axes", () => vis());
  const sliceSel = el("select", { "aria-label": "Slice plane" }); ["xz", "xy", "yz"].forEach((a) => sliceSel.append(el("option", { value: a }, a + " plane"))); sliceSel.value = st.sliceAxis; sliceSel.onchange = () => { st.sliceAxis = sliceSel.value; updateSlice(); vis(); };
  modeRow.append(sliceSel);
  const info = el("div", { class: "o3-info", "aria-live": "polite" }); ctl.append(info);
  function readout() {
    const o = orb(); const rn = H.radialNodePositions(o.n, o.l); const rmp = H.mostProbableRadius(o.n, o.l);
    info.innerHTML = rich(`<b>$${o.tex}$</b> &nbsp; $n=${o.n}$, $l=${o.l}$ &nbsp;·&nbsp; radial nodes $n-l-1 = ${rn.length}$${rn.length ? ` (at ${rn.map((r) => r.toFixed(2) + " a₀").join(", ")})` : ""} &nbsp;·&nbsp; angular nodes $l = ${o.l}$ (${o.l === 0 ? "none" : o.ang === "dz2" ? "two cones" : o.l === 1 ? "one plane" : "two planes"}) &nbsp;·&nbsp; most probable $r$ ≈ ${(rmp * 52.9).toFixed(0)} pm`);
  }
  /* ---------- linked radial plot ---------- */
  let plot = null, plotHost = null, cursor = null;
  if (P.radial !== false && window.PLOT) {
    plotHost = el("div", { class: "o3-plot" }); ctl.append(plotHost);
    const pkind = el("div", { class: "seg sm", role: "group", "aria-label": "Radial plot" }); st.plot = P.radial || "rdf";
    [["R", "$R(r)$"], ["R2", "$R^2$"], ["rdf", "$r^2R^2$"]].forEach(([k, t]) => { const b = el("button", { type: "button", "aria-pressed": String(st.plot === k), html: rich(t) }); b.onclick = () => { st.plot = k; pkind.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); drawPlot(); }; pkind.append(b); });
    ctl.insertBefore(pkind, plotHost);
  }
  function drawPlot() {
    if (!plotHost) return;
    plotHost.innerHTML = "";
    const o = orb(), Lr = Math.min(extent(), o.n * o.n * 2.2 + 6);
    const f = st.plot === "R" ? (r) => H.radial(o.n, o.l, r) : st.plot === "R2" ? (r) => H.radial(o.n, o.l, r) ** 2 : (r) => H.rdf(o.n, o.l, r);
    let ymax = 0, ymin = 0; for (let i = 0; i <= 400; i++) { const v = f((i / 400) * Lr); ymax = Math.max(ymax, v); ymin = Math.min(ymin, v); }
    const pad = (ymax - ymin) * 0.12 || 0.1;
    const G = window.PLOT.graph(plotHost, { x: [0, Lr], y: [Math.min(0, ymin - pad * (ymin < 0)), ymax + pad], w: 560, h: 210, xlabel: "r / a₀", ylabel: st.plot === "R" ? "R(r)" : st.plot === "R2" ? "R²" : "r²R²", label: "Radial plot linked to the 3D view", grid: true, ystep: window.PLOT.niceStep(ymax - Math.min(0, ymin), 4) });
    G.fn(f, { cls: "cv c" });
    H.radialNodePositions(o.n, o.l).forEach((r) => { G.line(r, G.y0, r, G.y1, { cls: "lt dash" }); });
    if (st.plot === "rdf") { const rm = H.mostProbableRadius(o.n, o.l); G.line(rm, 0, rm, f(rm), { cls: "tan dash" }); G.label(rm, f(rm), "r_mp", { cls: "lblc", dx: 6, dy: -6 }); }
    H.radialNodePositions(o.n, o.l).forEach((r) => G.label(r, G.y1, "node", { cls: "lblc", dx: 4, dy: 12 }));
    const r0 = st.r != null ? st.r : H.mostProbableRadius(o.n, o.l);
    const lab = el("div", { class: "small muted" }, st.r != null ? `r = ${st.r.toFixed(1)} a₀ = ${(st.r * 52.9).toFixed(0)} pm` : "Drag the point along r. The same distance lights up as a sphere in the 3D view.");
    cursor = G.handle(r0, f(r0), { f, bounds: [0.05, Lr], step: Lr / 120, label: "Distance from the nucleus, r", onMove: (x) => { setShell(x); lab.textContent = `r = ${x.toFixed(1)} a₀ = ${(x * 52.9).toFixed(0)} pm`; emit(); } });
    plotHost.append(lab);
  }
  function setOrb(id) { st.orbital = id; setShell(null); drawPicker(); build(); vis(); emit(); }
  function emit() { if (ctx.onState) ctx.onState({ orbital: st.orbital, mode: st.mode, nodes: st.nodes, r: st.r }); }
  drawPicker(); build();
  return {
    viewer: V,
    set(p) { if (p.orbital) setOrb(p.orbital); if (p.mode) { st.mode = p.mode; buildCloud(); updateSlice(); vis(); } },
    state: () => ({ ...st }),
    dispose() { gridCache.size > 8 && gridCache.clear(); V.dispose(); ctl.remove(); }
  };
}

let ringTex = null;
function ringTexture() {
  if (ringTex) return ringTex;
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  g.strokeStyle = "rgba(255,255,255,1)"; g.lineWidth = 9; g.beginPath(); g.arc(32, 32, 22, 0, Math.PI * 2); g.stroke();
  ringTex = new THREE.CanvasTexture(c); return ringTex;
}

/* 2D fallback when WebGL is off: an xz slice with phase colours, hatching, nodal lines and + / - labels */
export function fallback(host, P = {}) {
  const pal = palette(host); const o = H.getOrbital(P.orbital || "2pz");
  const wrap = document.createElement("div"); wrap.className = "v3d-fallback";
  const cv = document.createElement("canvas"); sliceCanvas(o, "xz", 0, H.extentFor(o.n), 260, cv, pal, false);
  cv.style.width = "100%"; cv.style.maxWidth = "360px"; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", `Cross-section of the ${o.id} orbital through the nucleus`);
  wrap.append(cv);
  const p = document.createElement("p"); p.className = "small muted";
  p.innerHTML = window.C120.rich(`3D needs WebGL, which is off in this browser, so here is a flat cut through the nucleus (xz plane) of $${o.tex}$. Warm = + phase, cool and hatched = − phase, dark lines = nodes. Radial nodes: ${o.n - o.l - 1}. Angular nodes: ${o.l}.`);
  wrap.append(p); host.append(wrap);
  return { dispose() { wrap.remove(); } };
}
