/* CHEM 120 Interactive: electron configurations and the Aufbau procedure (Module 3, pp. 2-9).
   Left: orbital boxes in the notes' filling order (n + l rule, p. 3), with spin arrows.
   Right: the occupied orbitals in 3D around the nucleus, grouped by subshell (s spheres, p dumbbells on x, y, z, d four-lobed),
   drawn as angular shapes |Y| scaled with n^2 like hydrogen orbitals (sizes are schematic), with up / down arrows for electrons.
   The correct answer always comes from window.C120.chem (occupancy, ionOccupancy, configString, unpaired), which holds the Cr and Cu
   exceptions (p. 7) and the ion rules (p. 8: anions add by n + l; cations lose highest n first, then highest l).
   params: {element:"Fe" | 26, charge:0 (or ion:0), maxZ:36, mode:"show"|"build"} */
import { THREE, Viewer, surfaceMaterial, palette } from "./viewer.mjs";

const SUBS = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p"];
const NORB = { s: 1, p: 3, d: 5 };
const CAP = { s: 2, p: 6, d: 10 };
const ORB = { s: ["s"], p: ["px", "py", "pz"], d: ["dxy", "dyz", "dxz", "dx2y2", "dz2"] };
const ORBTEX = { s: "", px: "_x", py: "_y", pz: "_z", dxy: "_{xy}", dyz: "_{yz}", dxz: "_{xz}", dx2y2: "_{x^2-y^2}", dz2: "_{z^2}" };
/* real angular parts (unnormalised, maximum |f| = 1 on the unit sphere) */
const ANG = { s: () => 1, px: (x) => x, py: (x, y) => y, pz: (x, y, z) => z, dxy: (x, y) => 2 * x * y, dyz: (x, y, z) => 2 * y * z, dxz: (x, y, z) => 2 * x * z, dx2y2: (x, y) => x * x - y * y, dz2: (x, y, z) => (3 * z * z - 1) / 2 };
/* where each orbital's electron arrows sit (along one of its lobes) */
const MARK = { s: [1, -1, 0.9], px: [1, 0, 0], py: [0, 1, 0], pz: [0, 0, 1], dxy: [1, 1, 0], dyz: [0, 1, 1], dxz: [1, 0, 1], dx2y2: [0, -1, 0], dz2: [0, 0, -1] };
/* block colours (s, p, d), shared with the trends model; mid tones that read in light and dark */
export const BLOCK = { s: "#6d8fb8", p: "#5f9e72", d: "#c4903c" };
const NAMES = () => window.C120.chem.NAME;
const CH = () => window.C120.chem;
const lOf = (k) => k[1];
const nOf = (k) => +k[0];
const mrm = (s) => s.replace(/(\d)([spdf])/g, "$1\\mathrm{$2}");

/* ---------- styles (shared by every aufbau figure on the page; removed with the last one) ---------- */
const CSS = `.au-wrap{container-type:inline-size}
.au-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:12px;align-items:start}
@container (max-width:600px){.au-grid{grid-template-columns:minmax(0,1fr)}}
.au-diag{border:1px solid var(--rule);border-radius:8px;background:var(--paper);padding:6px 4px 2px}
.au-diag svg{display:block;width:100%;height:auto;max-height:420px}
.au-box rect.bx{fill:var(--paper);stroke:var(--fig-stroke);stroke-width:1.1}
.au-build .au-box{cursor:pointer}
.au-box:focus{outline:none}.au-box:focus-visible rect.bx{stroke:var(--c,var(--accent));stroke-width:2.6}
.au-box.bad rect.bx{stroke:var(--bad);stroke-width:2;stroke-dasharray:3 2;fill:var(--badSoft)}
.au-box.warn rect.bx{stroke:var(--warn);stroke-width:2;stroke-dasharray:5 2;fill:var(--warnSoft)}
.au-e{stroke:var(--head);stroke-width:1.7;fill:none;stroke-linecap:round;stroke-linejoin:round}
.au-hl{fill:var(--c,var(--accent));fill-opacity:.13}
.au-skip{fill:var(--bad);fill-opacity:.1}
.fig text.au-lab{font:600 12.5px var(--sans);fill:var(--head)}
.fig text.au-lab.on{fill:var(--c,var(--accent))}
.fig text.au-lab.badt{fill:var(--bad)}
.fig text.au-mk{font:700 11px var(--mono)}
.ctl.au{gap:8px}
.au .seg button{white-space:nowrap;flex:0 0 auto}
.au .seg.chg button{min-width:38px;padding:5px 6px;font-family:var(--mono);font-size:.84rem}
.au-read{line-height:1.6;font-size:.93rem;color:var(--ink2)} .au-read b{color:var(--head)}
.au-read .cfg{color:var(--ink);font-size:1.02rem}
.au-msgs{display:grid;gap:4px;margin:0;padding:0;list-style:none;font-size:.9rem}
.au-msgs li{padding:4px 8px;border-radius:6px;border-left:3px solid var(--rule);background:var(--fig-soft)}
.au-msgs li.bad{border-color:var(--bad);background:var(--badSoft)} .au-msgs li.warn{border-color:var(--warn);background:var(--warnSoft)} .au-msgs li.ok{border-color:var(--ok);background:var(--okSoft)}
.v3l.au-tag{font:600 .74rem var(--mono);color:var(--c,var(--accent));background:color-mix(in srgb,var(--paper) 85%,transparent);padding:0 4px;border-radius:4px}
.v3l.au-nuc{font:500 .68rem var(--mono);color:var(--ink2)}`;
let styleRefs = 0, styleEl = null;
function useStyle() { styleRefs++; if (!styleEl) { styleEl = document.createElement("style"); styleEl.dataset.c120 = "aufbau"; styleEl.textContent = CSS; document.head.append(styleEl); } return () => { styleRefs--; if (styleRefs <= 0 && styleEl) { styleEl.remove(); styleEl = null; styleRefs = 0; } }; }

/* ---------- chemistry helpers ---------- */
function targetOcc(Z, charge) { const C = CH(); const e = Z - charge; if (e <= 0) return {}; return charge === 0 ? C.occupancy(Z) : C.ionOccupancy(Z, charge); }
/* boxes from an occupancy: Hund's rule, all spin-up first, then pair with spin-down */
function canonical(occ) {
  const B = {}; SUBS.forEach((k) => { const n = NORB[lOf(k)]; B[k] = Array.from({ length: n }, () => []); const e = occ[k] || 0; for (let i = 0; i < e; i++) B[k][i < n ? i : i - n].push(i < n ? "u" : "d"); });
  return B;
}
function emptyBoxes() { return canonical({}); }
const countOf = (B) => SUBS.reduce((t, k) => t + B[k].reduce((a, b) => a + b.length, 0), 0);
const occOf = (B) => { const o = {}; SUBS.forEach((k) => { const c = B[k].reduce((a, b) => a + b.length, 0); if (c) o[k] = c; }); return o; };
function texConfig(occ, short) { const C = CH(); const tot = Object.values(occ).reduce((a, b) => a + b, 0); if (!tot) return "\\text{no electrons}"; return mrm(C.configString(occ, { short, tex: true })); }
/* check a built arrangement against the ground state */
function checkBuild(B, tgt, tgtTotal) {
  const msgs = [], bad = new Map(), skip = new Set();
  SUBS.forEach((k) => B[k].forEach((box, i) => { if (box.length === 2 && box[0] === box[1]) { bad.set(k + ":" + i, "bad"); msgs.push(["bad", `Pauli: the ${k} box ${B[k].length > 1 ? i + 1 + " " : ""}has two electrons with the same spin (${box[0] === "u" ? "↑↑" : "↓↓"}). Two electrons in one orbital must have opposite spins (p. 3).`]); } }));
  SUBS.forEach((k) => {
    const boxes = B[k]; if (boxes.length < 2) return;
    const empty = boxes.some((b) => !b.length), paired = boxes.map((b, i) => (b.length === 2 ? i : -1)).filter((i) => i >= 0);
    if (empty && paired.length) { paired.forEach((i) => { if (!bad.has(k + ":" + i)) bad.set(k + ":" + i, "warn"); }); msgs.push(["warn", `Hund: in ${k} you paired electrons while another ${k} box is still empty. Put one electron in each ${k} box first (p. 4).`]); }
    const singles = boxes.map((b) => (b.length === 1 ? b[0] : null)).filter(Boolean);
    if (singles.length > 1 && new Set(singles).size > 1) { boxes.forEach((b, i) => { if (b.length === 1 && !bad.has(k + ":" + i)) bad.set(k + ":" + i, "warn"); }); msgs.push(["warn", `Hund: the unpaired ${k} electrons should all have parallel spins (all ↑ or all ↓), like arrangement B on p. 4.`]); }
  });
  /* Aufbau: an electron sits above a subshell that is not full, where the ground state has no such gap */
  const occ = occOf(B);
  SUBS.forEach((k, i) => {
    if (!occ[k]) return;
    for (let j = 0; j < i; j++) { const lo = SUBS[j]; const full = CAP[lOf(lo)];
      if ((occ[lo] || 0) < full && !((tgt[lo] || 0) < full && (tgt[k] || 0) > 0)) { if (!skip.has(lo)) { skip.add(lo); msgs.push(["bad", `Aufbau: there are electrons in ${k} but ${lo} is not full yet. Fill ${lo} first (n + ℓ rule, p. 3).`]); } } }
  });
  const n = countOf(B);
  if (n > tgtTotal) msgs.push(["bad", `Too many electrons: this species has ${tgtTotal}, and you placed ${n}.`]);
  const same = SUBS.every((k) => (occ[k] || 0) === (tgt[k] || 0));
  const ok = same && !msgs.length && n === tgtTotal;
  return { msgs, bad, skip, ok, same, n };
}

/* ---------- the box diagram (SVG) ---------- */
const BW = 24, BH = 21, GAP = 3, ROWH = 26, TOP = 16, LABX = 50;
const COLX = { s: 58, p: 92, d: 183 };
const rowY = (i) => TOP + (SUBS.length - 1 - i) * ROWH;
function arrowPath(x, y, up) { /* half-headed arrow, as drawn in the notes */
  return up ? `M${x} ${y + BH - 3.5}V${y + 3.5}M${x - 3.2} ${y + 8}L${x} ${y + 3.5}L${x + 3.2} ${y + 8}` : `M${x} ${y + 3.5}V${y + BH - 3.5}M${x - 3.2} ${y + BH - 8}L${x} ${y + BH - 3.5}L${x + 3.2} ${y + BH - 8}`;
}
function diagramSVG(B, o = {}) {
  const W = 326, H = TOP + SUBS.length * ROWH + 10;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="fig" role="${o.build ? "group" : "img"}" aria-label="${o.aria || "Orbital boxes in filling order"}">`;
  s += `<line x1="14" y1="${H - 12}" x2="14" y2="${TOP + 4}" class="ax"/><path d="M10 ${TOP + 12}L14 ${TOP + 3}L18 ${TOP + 12}" class="ax" fill="none"/>`;
  s += `<text transform="translate(26 ${H / 2 + 40}) rotate(-90)" class="au-mk" style="fill:var(--ink2);font-weight:500">filling order (n + ℓ rule)</text>`;
  SUBS.forEach((k, i) => {
    const y = rowY(i); const l = lOf(k); const hl = o.hl && o.hl.has(k); const sk = o.skip && o.skip.has(k);
    if (hl || sk) s += `<rect x="36" y="${y - 2}" width="${W - 38}" height="${BH + 4}" rx="4" class="${sk ? "au-skip" : "au-hl"}"/>`;
    s += `<text x="${LABX}" y="${y + 14.5}" text-anchor="end" class="au-lab${hl ? " on" : ""}${sk ? " badt" : ""}">${k}</text>`;
    B[k].forEach((box, j) => {
      const x = COLX[l] + j * (BW + GAP); const st = o.bad && o.bad.get(k + ":" + j);
      const nm = l === "s" ? k : `${k}${ORB[l][j].slice(1)}`;
      const al = `${nm} orbital, ${box.length ? box.map((e) => (e === "u" ? "spin up" : "spin down")).join(" and ") : "empty"}`;
      s += `<g class="au-box${st ? " " + st : ""}" data-k="${k}" data-i="${j}"${o.build ? ` tabindex="0" role="button" aria-label="${al}. Press Enter to use the selected tool."` : ` aria-label="${al}"`}><rect class="bx" x="${x}" y="${y}" width="${BW}" height="${BH}" rx="2"/>`;
      if (box.length === 1) s += `<path class="au-e" d="${arrowPath(x + BW / 2, y, box[0] === "u")}"/>`;
      else if (box.length === 2) { s += `<path class="au-e" d="${arrowPath(x + BW / 2 - 4.6, y, box[0] === "u")}"/><path class="au-e" d="${arrowPath(x + BW / 2 + 4.6, y, box[1] === "u")}"/>`; }
      if (st === "bad") s += `<text x="${x + BW - 1}" y="${y - 1}" class="au-mk" style="fill:var(--bad)">!</text>`;
      s += `</g>`;
    });
  });
  return s + `</svg>`;
}

/* ---------- 3D orbitals ---------- */
function lobeGeometry(ang) {
  if (ang === "s") return new THREE.SphereGeometry(1, 32, 20);
  const g = new THREE.SphereGeometry(1, 48, 32); const p = g.attributes.position; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); const f = Math.abs(ANG[ang](v.x, v.y, v.z)); p.setXYZ(i, v.x * f, v.y * f, v.z * f); }
  g.computeVertexNormals(); return g;
}
function cssVar(host, n, d) { const v = getComputedStyle(host).getPropertyValue(n).trim(); return v || d; }

export function mount(host, P = {}, ctx = {}) {
  const C = CH(); const rich = window.C120.rich;
  const el = (t, a = {}, ...k) => { const e = document.createElement(t); for (const x in a) { if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };
  const release = useStyle();
  const maxZ = Math.max(2, Math.min(54, P.maxZ || 36));
  const z0 = typeof P.element === "number" ? P.element : P.element ? C.Z(P.element) : 26;
  const st = { Z: Math.min(maxZ, Math.max(1, z0 || 26)), charge: clampQ(P.charge ?? P.ion ?? 0), mode: P.mode === "build" ? "build" : "show", scale: "n2", inner: true, spins: true, tool: "u", build: emptyBoxes(), hist: [], last: null, solved: false };
  function clampQ(q) { return Math.max(-3, Math.min(3, Math.round(+q || 0))); }
  const wrap = el("div", { class: "au-wrap" }); host.append(wrap);
  const grid = el("div", { class: "au-grid" }); wrap.append(grid);
  const diag = el("div", { class: "au-diag" }); grid.append(diag);
  const right = el("div", { class: "au-3d" }); grid.append(right);
  const V = new Viewer(right, { label: P.label || "Occupied orbitals around the nucleus", cam: [4.1, 3.1, 2.4], aspect: P.aspect || 0.92, minH: 280, maxH: 460, onInteract: ctx.onInteract });
  const axes = V.axes(1.38);
  /* one mesh per orbital of every subshell, made once and shown or hidden */
  const geos = {}; ["s", "px", "py", "pz", "dxy", "dyz", "dxz", "dx2y2", "dz2"].forEach((a) => (geos[a] = lobeGeometry(a)));
  const mk = (c, op) => surfaceMaterial(c, { opacity: op, depthWrite: false, side: THREE.DoubleSide, roughness: 0.6 });
  const mats = { s: mk(BLOCK.s, 0.1), p: mk(BLOCK.p, 0.15), d: mk(BLOCK.d, 0.15), hs: mk(BLOCK.s, 0.32), hp: mk(BLOCK.p, 0.5), hd: mk(BLOCK.d, 0.5), core: mk(V.pal.axis, 0.06) };
  const meshes = {};
  SUBS.forEach((k, si) => { meshes[k] = ORB[lOf(k)].map((a) => { const m = new THREE.Mesh(geos[a], mats[lOf(k)]); m.visible = false; m.renderOrder = 20 - si; V.scene.add(m); return m; }); });
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.03, 20, 14), new THREE.MeshBasicMaterial({ color: V.pal.head })); V.scene.add(nuc);
  /* electron arrows: two instanced meshes (shaft and head) sharing instance matrices */
  const MAXE = 64;
  const shaftG = new THREE.CylinderGeometry(0.11, 0.11, 0.62, 10); shaftG.translate(0, -0.12, 0);
  const headG = new THREE.ConeGeometry(0.3, 0.42, 14); headG.translate(0, 0.29, 0);
  const eMat = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0 });
  const shafts = new THREE.InstancedMesh(shaftG, eMat, MAXE), heads = new THREE.InstancedMesh(headG, eMat, MAXE);
  [shafts, heads].forEach((m) => { m.count = 0; m.frustumCulled = false; m.renderOrder = 30; V.scene.add(m); });
  let tags = [];
  V.theme((p) => { mats.core.color.set(p.axis); nuc.material.color.set(p.head); draw3D(); }, false);

  const tgtOcc = () => targetOcc(st.Z, st.charge);
  const nElec = () => Math.max(0, st.Z - st.charge);
  /* subshells to highlight: where the ion differs from the atom, otherwise the last one being filled */
  function highlight(occ) {
    const hl = new Set();
    if (st.mode === "build") { if (st.last) hl.add(st.last); return hl; }
    const neu = C.occupancy(st.Z);
    if (st.charge !== 0) SUBS.forEach((k) => { if ((neu[k] || 0) !== (occ[k] || 0)) hl.add(k); });
    if (!hl.size) { const ks = SUBS.filter((k) => occ[k]); if (ks.length) hl.add(ks[ks.length - 1]); }
    return hl;
  }
  const boxesNow = () => (st.mode === "build" ? st.build : canonical(tgtOcc()));
  let lastCount = null;
  function draw3D() {
    const B = boxesNow(); const occ = occOf(B); const hl = highlight(occ);
    const occd = SUBS.filter((k) => occ[k]);
    const maxN = occd.length ? Math.max(...occd.map(nOf)) : 1;
    const R = (n) => (st.scale === "n2" ? n * n : n);
    const k0 = 1.12 / R(maxN);
    /* core = completely filled subshells below the outermost shell (not d being filled) */
    const isCore = (k) => nOf(k) < maxN && occ[k] === CAP[lOf(k)] && !hl.has(k) && !(lOf(k) === "d" && nOf(k) === maxN - 1 && occd.some((q) => nOf(q) === maxN && lOf(q) !== "s"));
    SUBS.forEach((k) => meshes[k].forEach((m, j) => {
      const on = !!occ[k] && B[k][j].length > 0 && (st.inner || !isCore(k));
      m.visible = on; if (!on) return;
      m.scale.setScalar(R(nOf(k)) * k0);
      m.material = hl.has(k) ? mats["h" + lOf(k)] : isCore(k) ? mats.core : mats[lOf(k)];
    }));
    tags.forEach((t) => t.remove()); tags = [];
    let e = 0; const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), Pp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), zp = new THREE.Vector3(0, 0, 1), zm = new THREE.Vector3(0, 0, -1);
    const Lm = 0.13; const col = new THREE.Color();
    SUBS.forEach((k) => {
      if (!occ[k] || (!st.inner && isCore(k))) return;
      const r = R(nOf(k)) * k0;
      ORB[lOf(k)].forEach((a, j) => {
        const box = B[k][j]; if (!box.length) return;
        const d = new THREE.Vector3(...MARK[a]).normalize();
        let perp = new THREE.Vector3().crossVectors(d, zp); if (perp.lengthSq() < 1e-4) perp.set(1, 0, 0); perp.normalize();
        const base = d.clone().multiplyScalar(r + 0.07);
        box.forEach((sp, q) => {
          if (!st.spins || e >= MAXE) return;
          Pp.copy(base).addScaledVector(perp, box.length === 2 ? (q ? 0.045 : -0.045) : 0);
          Q.setFromUnitVectors(up, sp === "u" ? zp : zm); S.setScalar(Lm);
          M.compose(Pp, Q, S); shafts.setMatrixAt(e, M); heads.setMatrixAt(e, M);
          col.set(hl.has(k) ? V.pal.accent : V.pal.head); shafts.setColorAt(e, col); heads.setColorAt(e, col);
          e++;
        });
      });
      if (hl.has(k) || (r > 0.32 && lOf(k) !== "s")) {
        const a = ORB[lOf(k)][lOf(k) === "d" ? 0 : lOf(k) === "p" ? 2 : 0]; const d = new THREE.Vector3(...MARK[a]).normalize();
        tags.push(V.label(`$${mrm(k)}$${hl.has(k) && st.mode === "show" ? (st.charge > 0 && (C.occupancy(st.Z)[k] || 0) > (occ[k] || 0) ? " (lost e⁻)" : st.charge < 0 && (C.occupancy(st.Z)[k] || 0) < (occ[k] || 0) ? " (gained e⁻)" : " (filling)") : ""}`, d.multiplyScalar(r + 0.24), "au-tag"));
      }
    });
    shafts.count = heads.count = e;
    [shafts, heads].forEach((m) => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; });
    /* the newest electron drops in (skipped with reduced motion) */
    if (lastCount != null && e === lastCount + 1 && !window.C120.reduceMotion() && st.spins) dropIn(e - 1);
    lastCount = e;
    V.requestRender();
  }
  function dropIn(idx) {
    const M0 = new THREE.Matrix4(); shafts.getMatrixAt(idx, M0); const P0 = new THREE.Vector3(), Q0 = new THREE.Quaternion(), S0 = new THREE.Vector3(); M0.decompose(P0, Q0, S0);
    const start = P0.clone().multiplyScalar(1.6); const M = new THREE.Matrix4(); const Pp = new THREE.Vector3(); let t = 0;
    V.animate((dt) => { if (idx >= shafts.count) return false; t = Math.min(1, t + dt / 0.4); const e = 1 - Math.pow(1 - t, 3); Pp.copy(start).lerp(P0, e); M.compose(Pp, Q0, S0); shafts.setMatrixAt(idx, M); heads.setMatrixAt(idx, M); shafts.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true; return t < 1; });
  }

  /* ---------- controls ---------- */
  const ctl = el("div", { class: "ctl au" }); wrap.append(ctl);
  const row1 = el("div", { class: "row" }); ctl.append(row1);
  const sel = el("select", { "aria-label": "Element" });
  for (let z = 1; z <= maxZ; z++) sel.append(el("option", { value: z }, `${z} ${C.sym(z)} (${NAMES()[C.sym(z)].toLowerCase()})`));
  sel.value = st.Z; sel.onchange = () => setZ(+sel.value);
  row1.append(el("label", { class: "small" }, el("span", {}, "Element"), sel));
  const segQ = el("div", { class: "seg sm chg", role: "group", "aria-label": "Ion charge" });
  [3, 2, 1, 0, -1, -2, -3].forEach((q) => { const b = el("button", { type: "button", "data-q": q, "aria-pressed": String(q === st.charge), title: q === 0 ? "neutral atom" : `${q > 0 ? "cation" : "anion"}, charge ${q > 0 ? "+" : "−"}${Math.abs(q)}` }, q === 0 ? "0" : (q > 0 ? "+" : "−") + Math.abs(q)); b.onclick = () => setQ(q); segQ.append(b); });
  row1.append(el("span", { class: "small", style: "font-weight:600" }, "Charge"), segQ);
  const row2 = el("div", { class: "row" }); ctl.append(row2);
  const segM = el("div", { class: "seg sm", role: "group", "aria-label": "Mode" });
  [["show", "Ground state"], ["build", "Build it yourself"]].forEach(([m, t]) => { const b = el("button", { type: "button", "aria-pressed": String(st.mode === m) }, t); b.onclick = () => setMode(m); segM.append(b); });
  row2.append(segM);
  const bAdd = el("button", { type: "button", class: "btn sm ghost" }, "Add electron");
  const bRem = el("button", { type: "button", class: "btn sm ghost" }, "Remove electron");
  bAdd.onclick = () => (st.mode === "build" ? buildNext() : setZ(st.Z + 1, true));
  bRem.onclick = () => (st.mode === "build" ? undo() : setZ(st.Z - 1, true));
  row2.append(bAdd, bRem);
  const buildRow = el("div", { class: "row" }); ctl.append(buildRow);
  const segT = el("div", { class: "seg sm", role: "group", "aria-label": "What a click on a box does" });
  [["u", "↑ up", "Place a spin-up electron"], ["d", "↓ down", "Place a spin-down electron"], ["x", "Erase", "Remove an electron"]].forEach(([k, t, a]) => { const b = el("button", { type: "button", "aria-pressed": String(st.tool === k), "aria-label": a, title: a }, t); b.onclick = () => { st.tool = k; segT.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }; segT.append(b); });
  const bClear = el("button", { type: "button", class: "chip" }, "Clear"); bClear.onclick = () => { st.build = emptyBoxes(); st.hist = []; st.last = null; refresh(); emit(); };
  const bAns = el("button", { type: "button", class: "chip" }, "Show answer"); bAns.onclick = () => { st.build = canonical(tgtOcc()); st.hist = []; SUBS.forEach((k) => st.build[k].forEach((b, i) => b.forEach(() => st.hist.push([k, i])))); st.last = null; st.shown = true; refresh(); emit(); };
  buildRow.append(el("span", { class: "small", style: "font-weight:600" }, "Click a box:"), segT, bClear, bAns);
  const row3 = el("div", { class: "row" }); ctl.append(row3);
  const tog = (t, key, title) => { const b = el("button", { type: "button", class: "chip", "aria-pressed": String(!!st[key]), title }, t); b.onclick = () => { st[key] = !st[key]; b.setAttribute("aria-pressed", String(st[key])); draw3D(); }; row3.append(b); return b; };
  tog("Inner shells", "inner", "Show filled inner subshells (faint grey)");
  tog("Electron arrows", "spins", "Show an up or down arrow for each electron");
  const segS = el("div", { class: "seg sm", role: "group", "aria-label": "Orbital sizes" });
  [["n2", "Size ∝ n²"], ["n", "Size ∝ n"]].forEach(([k, t]) => { const b = el("button", { type: "button", "aria-pressed": String(st.scale === k) }, t); b.onclick = () => { st.scale = k; segS.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw3D(); }; segS.append(b); });
  row3.append(segS);
  const read = el("div", { class: "au-read", "aria-live": "polite" }); ctl.append(read);
  const msgs = el("ul", { class: "au-msgs", "aria-live": "polite" }); ctl.append(msgs);
  ctl.append(el("div", { class: "small muted", html: rich("Shapes are the angular parts of hydrogen-like orbitals ($s$ sphere; $p_x, p_y, p_z$ dumbbells; five $d$ orbitals), with size growing as $n^2$ as for hydrogen (<i>Size ∝ n</i> spreads the shells out evenly so inner ones are easier to see). In a real many-electron atom every orbital shrinks as $Z$ grows (p. 2), so sizes here are schematic (not from the notes). <i>Add / Remove electron</i> steps to the next or previous element in show mode; use <i>Charge</i> for ions.") }));

  /* diagram clicks and keys (build mode) */
  const onDiag = (ev) => { if (st.mode !== "build") return; const g = ev.target.closest && ev.target.closest(".au-box"); if (!g) return; if (ev.type === "keydown") { if (ev.key !== "Enter" && ev.key !== " ") return; ev.preventDefault(); } place(g.dataset.k, +g.dataset.i, true); };
  diag.addEventListener("click", onDiag); diag.addEventListener("keydown", onDiag);
  function place(k, i, fromUser) {
    const box = st.build[k][i];
    if (st.tool === "x") { if (!box.length) return; box.pop(); for (let n = st.hist.length - 1; n >= 0; n--) if (st.hist[n][0] === k && st.hist[n][1] === i) { st.hist.splice(n, 1); break; } }
    else { if (box.length >= 2) { flash(`An orbital (one box) holds at most two electrons (Pauli, p. 3). This ${k} box is full.`); return; } box.push(st.tool); st.hist.push([k, i]); }
    st.last = k; refresh(fromUser ? [k, i] : null); emit();
  }
  let flashMsg = null; function flash(t) { flashMsg = t; refresh(); flashMsg = null; }
  function buildNext() {
    const tgt = tgtOcc(); const occ = occOf(st.build);
    const k = SUBS.find((q) => (occ[q] || 0) < (tgt[q] || 0));
    if (!k) { flash(countOf(st.build) >= nElec() ? "All the electrons are placed." : "Fix the boxes marked in red or yellow first, then try again."); return; }
    const boxes = st.build[k]; let i = boxes.findIndex((b) => !b.length);
    let spin = "u";
    if (i < 0) { i = boxes.findIndex((b) => b.length === 1); spin = boxes[i][0] === "u" ? "d" : "u"; }
    else { const s1 = boxes.find((b) => b.length === 1); spin = s1 ? s1[0] : "u"; }
    boxes[i].push(spin); st.hist.push([k, i]); st.last = k; refresh(); emit();
  }
  function undo() { const h = st.hist.pop(); if (!h) return; const box = st.build[h[0]][h[1]]; box.pop(); st.last = st.hist.length ? st.hist[st.hist.length - 1][0] : null; refresh(); emit(); }
  function setZ(z, step) { z = Math.max(1, Math.min(maxZ, z)); if (z - st.charge < 0) return; st.Z = z; sel.value = z; if (st.mode === "build") { st.build = emptyBoxes(); st.hist = []; st.last = null; } if (!step) lastCount = null; refresh(); emit(); }
  function setQ(q) { if (st.Z - q < 0) { flash(`${C.sym(st.Z)} has only ${st.Z} electron${st.Z > 1 ? "s" : ""} to lose.`); return; } st.charge = q; segQ.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.q === q))); if (st.mode === "build") { st.build = emptyBoxes(); st.hist = []; st.last = null; } lastCount = null; refresh(); emit(); }
  function setMode(m) { st.mode = m; segM.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String((i === 0) === (m === "show")))); st.build = emptyBoxes(); st.hist = []; st.last = null; lastCount = null; refresh(); emit(); }

  const speciesTex = () => { const s = C.sym(st.Z); const q = st.charge; return `\\mathrm{${s}}${q ? `^{${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "-"}}` : ""}`; };
  function refresh(focusBox) {
    const tgt = tgtOcc(), N = nElec(); const build = st.mode === "build";
    const res = build ? checkBuild(st.build, tgt, N) : null;
    const B = boxesNow(); const occ = occOf(B);
    diag.classList.toggle("au-build", build);
    diag.innerHTML = diagramSVG(B, { build, hl: highlight(occ), bad: res && res.bad, skip: res && res.skip, aria: build ? "Orbital boxes: click a box to place an electron" : `Orbital boxes for ${C.sym(st.Z)}` });
    if (focusBox) { const g = diag.querySelector(`.au-box[data-k="${focusBox[0]}"][data-i="${focusBox[1]}"]`); if (g && document.activeElement && document.activeElement.closest && document.activeElement.closest(".au-diag")) g.focus({ preventScroll: true }); }
    buildRow.style.display = build ? "" : "none";
    bAdd.textContent = build ? "Place next electron" : "Add electron"; bRem.textContent = build ? "Undo" : "Remove electron";
    bAdd.disabled = build ? false : st.Z >= maxZ; bRem.disabled = build ? !st.hist.length : st.Z <= 1 || st.Z - 1 - st.charge < 0;
    segQ.querySelectorAll("button").forEach((b) => { b.disabled = st.Z - +b.dataset.q < 0; });
    /* readout */
    const sym = C.sym(st.Z), name = NAMES()[sym]; const q = st.charge;
    const who = `<b>$${speciesTex()}$</b> &nbsp;${name.toLowerCase()}${q ? (q > 0 ? " cation" : " anion") : " atom"}, $Z = ${st.Z}$, ${N} electron${N === 1 ? "" : "s"}`;
    let lines = [who];
    const showOcc = build ? (res.ok ? tgt : null) : tgt;
    if (showOcc) {
      const up = C.unpaired(showOcc);
      lines.push(`Full: <span class="cfg">$${texConfig(showOcc, false)}$</span>`);
      if (N > 2) lines.push(`Noble-gas core: <span class="cfg">$${texConfig(showOcc, true)}$</span>`);
      lines.push(N ? `<b>${up}</b> unpaired electron${up === 1 ? "" : "s"}, so ${sym}${q ? (q > 0 ? "<sup>" + (q > 1 ? q : "") + "+</sup>" : "<sup>" + (-q > 1 ? -q : "") + "−</sup>") : ""} is <b>${up ? "paramagnetic" : "diamagnetic"}</b> (${up ? "it has a magnetic moment" : "all electrons paired"}, p. 9).` : "A bare nucleus: nothing to fill.");
    } else lines.push(`Target: place ${N} electron${N === 1 ? "" : "s"} for $${speciesTex()}$. Placed so far: <b>${res.n}</b>.`);
    read.innerHTML = rich(lines.join("<br>"));
    /* notes and rule messages */
    const items = [];
    if (flashMsg) items.push(["bad", flashMsg]);
    if (build) {
      res.msgs.forEach((m) => items.push(m));
      if (res.ok) items.push(["ok", `Correct: that is the ground state of $${speciesTex()}$.${st.shown ? " (shown by the answer button)" : ""}`]);
      else if (!res.msgs.length && res.n === N && !res.same) items.push(["warn", mismatch(tgt)]);
    }
    if (!build || res.ok) notesFor(tgt).forEach((t) => items.push(["", t]));
    msgs.innerHTML = items.map(([c, t]) => `<li class="${c}">${rich(t)}</li>`).join("");
    if (!build) st.shown = false;
    draw3D();
  }
  function mismatch(tgt) {
    const sym = C.sym(st.Z); const aufbauOcc = st.charge === 0 ? aufbauOnly(st.Z) : null;
    const mine = occOf(st.build);
    if (aufbauOcc && SUBS.every((k) => (mine[k] || 0) === (aufbauOcc[k] || 0))) return `That is what the $n + \\ell$ rule predicts, but ${sym} is one of the two exceptions you need to know (p. 7). Experiment gives $${texConfig(tgt, true)}$.`;
    if (st.charge > 0) return `Right number of electrons, but not the ground state. For a cation, write the neutral atom first, then remove electrons from the highest $n$ first (and the highest $\\ell$ when $n$ ties), p. 8.`;
    return `Right number of electrons, but not the lowest-energy arrangement yet. Check which subshell each electron is in.`;
  }
  function aufbauOnly(z) { const o = {}; let left = z; for (const k of C.ORDER) { if (left <= 0) break; const c = Math.min(CAP[k[1]] || 14, left); o[k] = c; left -= c; } return o; }
  function notesFor(tgt) {
    const C2 = C; const sym = C2.sym(st.Z); const out = [];
    if (st.charge === 0 && C2.EXCEPTIONS[sym]) {
      const a = aufbauOnly(st.Z);
      out.push(C2.MUST_KNOW_EXCEPTIONS.includes(sym) ? `Exception (p. 7): the $n + \\ell$ rule predicts $${texConfig(a, true)}$, but experiment gives $${texConfig(tgt, true)}$. Cr and Cu are the only exceptions for $Z \\le 36$, and you should know them.` : `This is one of the many exceptions above $Z = 36$; you are not expected to know these (p. 7). The rule predicts $${texConfig(a, true)}$.`);
    }
    if (st.charge > 0) {
      const neu = C2.occupancy(st.Z); const lost = SUBS.filter((k) => (neu[k] || 0) > (tgt[k] || 0));
      out.push(`Cation (p. 8): start from $\\mathrm{${sym}}$ = $${texConfig(neu, true)}$ and remove ${st.charge} electron${st.charge > 1 ? "s" : ""} from the highest $n$ first (highest $\\ell$ if $n$ ties): from ${lost.map((k) => `$${mrm(k)}$`).join(" and ")}.${lost.some((k) => lOf(k) === "s") && SUBS.some((k) => lOf(k) === "d" && tgt[k]) ? " For d-block atoms the $ns$ electrons go first." : ""}`);
      const iso = C2.sym(st.Z - st.charge); if (iso && SUBS.some((k) => lOf(k) === "d" && (tgt[k] || 0)) && C2.config(st.Z - st.charge, 0) !== C2.configString(tgt)) out.push(`Not the same as neutral ${iso} (also ${st.Z - st.charge} electrons, $${texConfig(C2.occupancy(st.Z - st.charge), true)}$): applying the $n + \\ell$ rule blindly to the electron count gives the wrong answer (p. 8).`);
    }
    if (st.charge < 0) out.push(`Anion (p. 8): start from the neutral atom and add ${-st.charge} electron${st.charge < -1 ? "s" : ""} by the $n + \\ell$ rule.`);
    return out;
  }
  function emit() { if (ctx.onState) ctx.onState(state()); }
  function state() { const tgt = tgtOcc(); const res = st.mode === "build" ? checkBuild(st.build, tgt, nElec()) : null; return { element: C.sym(st.Z), Z: st.Z, charge: st.charge, mode: st.mode, electrons: nElec(), config: nElec() ? C.configString(tgt) : "", short: nElec() > 2 ? C.configString(tgt, { short: true }) : nElec() ? C.configString(tgt) : "", unpaired: C.unpaired(tgt), magnetic: C.unpaired(tgt) ? "paramagnetic" : "diamagnetic", placed: st.mode === "build" ? res.n : null, violations: res ? res.msgs.map((m) => m[1].split(":")[0]) : [], correct: res ? res.ok : null }; }
  refresh();
  return {
    viewer: V, state,
    set(p) { if (p.mode && p.mode !== st.mode) setMode(p.mode); if (p.charge != null) setQ(clampQ(p.charge)); if (p.element != null) setZ(typeof p.element === "number" ? p.element : C.Z(p.element)); },
    /* for tests: place an electron in a box as if clicked */
    click(k, i, spin) { if (spin) st.tool = spin; place(k, i, false); return state(); },
    dispose() { diag.removeEventListener("click", onDiag); diag.removeEventListener("keydown", onDiag); V.dispose(); wrap.remove(); release(); }
  };
}

/* 2D fallback: the box diagram and the configuration in words */
export function fallback(host, P = {}) {
  const C = CH(); const release = useStyle();
  const z = typeof P.element === "number" ? P.element : P.element ? C.Z(P.element) : 26; const q = Math.max(-3, Math.min(3, P.charge ?? P.ion ?? 0));
  const occ = targetOcc(z, q); const w = document.createElement("div"); w.className = "v3d-fallback";
  const sym = C.sym(z); const up = C.unpaired(occ);
  w.innerHTML = `<div style="width:100%;max-width:360px">${diagramSVG(canonical(occ), { aria: `Orbital boxes for ${sym}` })}</div><p class="small muted">${window.C120.rich(`3D needs WebGL, which is off in this browser, so here are the orbital boxes in filling order. $\\mathrm{${sym}}${q ? `^{${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "-"}}` : ""}$: $${texConfig(occ, true)}$, ${up} unpaired electron${up === 1 ? "" : "s"} (${up ? "paramagnetic" : "diamagnetic"}).`)}</p>`;
  host.append(w);
  return { dispose() { w.remove(); release(); } };
}
