/* CHEM 120 Interactive: molecules in 3D.
   build(spec) turns a molecule from molecules.mjs into 3D coordinates:
     single-centre molecules use the ideal VSEPR directions (Module 4, p. 18 table; angles are standard geometry, not printed in the notes)
     multi-centre molecules start from their 2D drawing and are relaxed so every atom keeps its VSEPR angles and the bond lengths from the p. 16 table
   mount(host, params) shows one molecule with toggles: lone pairs, electron vs molecular geometry, formal charges, partial charges, bond dipoles,
   resonance forms, angle measuring (click two bonds), and a build-your-own mode. */
import { THREE, Viewer, surfaceMaterial, rod, arrow, arcLine, palette } from "./viewer.mjs";
import { ELEM, elem, en, bondLength, DOMAINS, LP_SLOTS, shapeOf } from "./chemdata.mjs";
import { MOLS, RESONANCE } from "./molecules.mjs";
export { MOLS, RESONANCE };
const V3 = (a) => new THREE.Vector3(...a);

/* ---------------- building coordinates ---------------- */
export function build(spec) {
  if (typeof spec === "string") { const k = spec; spec = MOLS[k]; if (!spec) throw new Error("No molecule " + k); spec = { key: k, ...spec }; }
  return spec.center ? buildCentre(spec) : buildGraph(spec);
}
function lpOf(el, fc, ordSum) { return Math.max(0, Math.round((elem(el).val - fc - ordSum) / 2)); }
function buildCentre(s) {
  const nL = s.ligands.length, sn = nL + s.lp;
  const dirs = DOMAINS[Math.max(1, sn)].map(V3);
  const lpSlots = (LP_SLOTS[sn] || {})[s.lp] || [];
  const free = dirs.map((d, i) => i).filter((i) => !lpSlots.includes(i));
  const atoms = [{ el: s.center, pos: new THREE.Vector3(), fc: s.fc || 0, lp: s.lp }];
  const bonds = [], lps = [];
  s.ligands.forEach((L, i) => {
    const [el, ord, fc = 0, lp] = L; const d = dirs[free[i]];
    const len = bondLength(s.center, el, ord).v;
    atoms.push({ el, pos: d.clone().multiplyScalar(len), fc, lp: el === "X" ? 0 : lp != null ? lp : lpOf(el, fc, ord) });
    bonds.push({ a: 0, b: i + 1, ord });
  });
  lpSlots.forEach((k) => lps.push({ atom: 0, dir: dirs[k].clone() }));
  /* lone pairs on outer atoms point away from the centre, spread around the bond */
  atoms.forEach((A, i) => { if (i === 0 || !A.lp) return; outerLonePairs(A, A.pos.clone().normalize(), lps, i); });
  const shape = shapeOf(sn, s.lp);
  return { spec: s, atoms, bonds, lps, centre: 0, sn, nlp: s.lp, eg: shape[0], mg: shape[1], angles: shape[2], domainDirs: dirs, lpSlots };
}
function outerLonePairs(A, out, lps, i) {
  /* a terminal atom: its bond points back along -out; its lone pairs sit at VSEPR angles around +out */
  const n = A.lp; if (!n) return;
  let perp = new THREE.Vector3(0, 0, 1).cross(out); if (perp.lengthSq() < 1e-6) perp = new THREE.Vector3(1, 0, 0).cross(out); perp.normalize();
  const alpha = n === 1 ? 0 : n === 2 ? Math.PI / 3 : (70.53 * Math.PI) / 180;
  for (let k = 0; k < n; k++) {
    const q = new THREE.Quaternion().setFromAxisAngle(out, (2 * Math.PI * k) / n + (n === 2 ? Math.PI / 2 : 0));
    const side = perp.clone().applyQuaternion(q);
    lps.push({ atom: i, dir: out.clone().multiplyScalar(Math.cos(alpha)).add(side.multiplyScalar(Math.sin(alpha))).normalize() });
  }
}
const IDEAL = { 1: 180, 2: 180, 3: 120, 4: 109.47 };
function buildGraph(s) {
  const atoms = s.atoms.map(([el, x, y, o = {}]) => ({ el, x2: x, y2: y, fc: o.fc || 0, lpGiven: o.lp, h: o.h || 0 }));
  const bonds = s.bonds.map(([a, b, ord]) => ({ a, b, ord }));
  const nHeavy = atoms.length;
  /* add hydrogens */
  atoms.slice(0, nHeavy).forEach((A, i) => { for (let k = 0; k < A.h; k++) { atoms.push({ el: "H", fc: 0, h: 0, parent: i }); bonds.push({ a: i, b: atoms.length - 1, ord: 1 }); } });
  const nb = atoms.map(() => []); bonds.forEach((B) => { nb[B.a].push(B.b); nb[B.b].push(B.a); });
  const ordSum = atoms.map((_, i) => bonds.filter((B) => B.a === i || B.b === i).reduce((t, B) => t + B.ord, 0));
  atoms.forEach((A, i) => { A.lp = A.lpGiven != null ? A.lpGiven : A.el === "H" ? 0 : lpOf(A.el, A.fc, ordSum[i]); A.sn = nb[i].length + A.lp; });
  /* lone pair pseudo-atoms take part in the relaxation so angles come out right */
  const P = atoms.map((A, i) => (A.parent == null ? new THREE.Vector3(A.x2 * 1.45, A.y2 * 1.45, (Math.sin(i * 12.9898) * 0.15)) : null));
  const rnd = mul(7);
  atoms.forEach((A, i) => { if (A.parent != null) { const p = P[A.parent]; const away = new THREE.Vector3(); nb[A.parent].forEach((j) => { if (P[j]) away.add(p.clone().sub(P[j])); }); if (away.lengthSq() < 1e-6) away.set(rnd() - 0.5, rnd() - 0.5, 0); away.normalize(); away.z += (rnd() - 0.5) * 1.6; P[i] = p.clone().add(away.normalize().multiplyScalar(1.1)); } });
  const lpPts = []; atoms.forEach((A, i) => { for (let k = 0; k < A.lp; k++) { const p = P[i].clone().add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(0.6)); lpPts.push({ atom: i, p }); } });
  const pts = P.concat(lpPts.map((l) => l.p));
  const C = []; // [i, j, target, stiffness]
  const dist = (i, j) => (i < atoms.length && j < atoms.length ? bondLength(atoms[i].el, atoms[j].el, bonds.find((B) => (B.a === i && B.b === j) || (B.a === j && B.b === i)).ord).v : 0.6);
  bonds.forEach((B) => C.push([B.a, B.b, dist(B.a, B.b), 1]));
  lpPts.forEach((l, k) => C.push([l.atom, atoms.length + k, 0.6, 1]));
  /* 1-3 constraints from VSEPR angles around each atom (domains = neighbours + lone pairs) */
  atoms.forEach((A, i) => {
    const doms = nb[i].map((j) => ({ idx: j, len: dist(i, j) })).concat(lpPts.map((l, k) => ({ l, k })).filter((x) => x.l.atom === i).map((x) => ({ idx: atoms.length + x.k, len: 0.6 })));
    const th = (IDEAL[Math.min(4, doms.length)] || 109.47) * Math.PI / 180;
    for (let u = 0; u < doms.length; u++) for (let v = u + 1; v < doms.length; v++) { const a = doms[u].len, b = doms[v].len; C.push([doms[u].idx, doms[v].idx, Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(th)), 0.6]); }
  });
  /* planarity and cis/trans across double bonds: keep the 2D side relationships */
  bonds.filter((B) => B.ord === 2).forEach((B) => {
    const sa = nb[B.a].filter((j) => j !== B.b), sb = nb[B.b].filter((j) => j !== B.a);
    sa.forEach((p) => sb.forEach((q) => {
      const side = (k) => { const A0 = P[B.a], B0 = P[B.b]; const d = B0.clone().sub(A0); const w = P[k].clone().sub(A0); return Math.sign(d.x * w.y - d.y * w.x); };
      const cis = side(p) === side(q);
      const l1 = dist(p, B.a), l2 = dist(B.a, B.b), l3 = dist(B.b, q);
      C.push([p, q, d14(l1, l2, l3, 120, 120, cis ? 0 : 180), 0.5]);
    }));
  });
  /* relax: position based, with soft repulsion between atoms that are not bonded or 1-3 */
  const close = new Set(C.map((c) => c[0] + "," + c[1]).concat(C.map((c) => c[1] + "," + c[0])));
  const N = pts.length;
  for (let it = 0; it < 900; it++) {
    for (const [i, j, t, k] of C) { const d = pts[j].clone().sub(pts[i]); const L = d.length() || 1e-6; const f = ((L - t) / L) * 0.5 * k; pts[i].addScaledVector(d, f); pts[j].addScaledVector(d, -f); }
    if (it % 3 === 0) for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { if (close.has(i + "," + j)) continue; const d = pts[j].clone().sub(pts[i]); const L = d.length() || 1e-6; const min = i >= atoms.length || j >= atoms.length ? 1.2 : (atoms[i].el === "H" || atoms[j].el === "H" ? 1.9 : 2.4); if (L < min) { const f = ((L - min) / L) * 0.25; pts[i].addScaledVector(d, f); pts[j].addScaledVector(d, -f); } }
  }
  /* centre on the heavy atoms */
  const cen = new THREE.Vector3(); for (let i = 0; i < nHeavy; i++) cen.add(pts[i]); cen.multiplyScalar(1 / nHeavy);
  pts.forEach((p) => p.sub(cen));
  atoms.forEach((A, i) => { A.pos = pts[i]; });
  const lps = lpPts.map((l, k) => ({ atom: l.atom, dir: pts[atoms.length + k].clone().sub(pts[l.atom]).normalize() }));
  /* centre atom for shape naming: the heavy atom with most neighbours */
  let centre = 0; atoms.forEach((A, i) => { if (A.el !== "H" && nb[i].length + A.lp > nb[centre].length + atoms[centre].lp) centre = i; });
  const sh = shapeOf(atoms[centre].sn, atoms[centre].lp);
  return { spec: s, atoms, bonds, lps, centre, sn: atoms[centre].sn, nlp: atoms[centre].lp, eg: sh[0], mg: sh[1], angles: sh[2], graph: true, nHeavy };
}
function d14(l1, l2, l3, a1, a2, dih) {
  const r = (x) => (x * Math.PI) / 180;
  const p1 = new THREE.Vector3(0, 0, 0), p2 = new THREE.Vector3(l2, 0, 0);
  const p0 = new THREE.Vector3(l1 * Math.cos(r(180 - a1)) * -1, l1 * Math.sin(r(180 - a1)), 0);
  const p3 = new THREE.Vector3(l2 + l3 * Math.cos(r(180 - a2)), l3 * Math.sin(r(180 - a2)) * Math.cos(r(dih)), l3 * Math.sin(r(180 - a2)) * Math.sin(r(dih)));
  return p0.distanceTo(p3);
}
function mul(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* angle (degrees) between bonds b1 and b2 that share an atom */
export function bondAngle(mol, b1, b2) {
  const s = [b1.a, b1.b].find((x) => x === b2.a || x === b2.b); if (s == null) return null;
  const o1 = b1.a === s ? b1.b : b1.a, o2 = b2.a === s ? b2.b : b2.a;
  const u = mol.atoms[o1].pos.clone().sub(mol.atoms[s].pos), v = mol.atoms[o2].pos.clone().sub(mol.atoms[s].pos);
  return { deg: (u.angleTo(v) * 180) / Math.PI, s, u, v };
}
/* bond dipoles: vector from the less to the more electronegative atom, length = difference in EN (notes values) */
export function dipoles(mol) {
  const list = []; const net = new THREE.Vector3();
  mol.bonds.forEach((B) => { const A = mol.atoms[B.a], Bt = mol.atoms[B.b]; const ea = en(A.el), eb = en(Bt.el); if (!ea || !eb) return; const d = eb.v - ea.v; if (Math.abs(d) < 0.05) return;
    const from = d > 0 ? B.a : B.b, to = d > 0 ? B.b : B.a; const v = mol.atoms[to].pos.clone().sub(mol.atoms[from].pos).normalize().multiplyScalar(Math.abs(d)); list.push({ from, to, v, dEN: Math.abs(d), bond: B }); net.add(v); });
  return { list, net };
}

/* ---------------- drawing ---------------- */
const BOND_R = 0.075;
export function draw(V, mol, opt = {}) {
  const g = new THREE.Group(); const pal = V.pal;
  const atomMats = {}; const am = (el) => atomMats[el] || (atomMats[el] = surfaceMaterial(elem(el).c, { roughness: 0.38 }));
  const bondMat = surfaceMaterial(pal.dark ? "#9aa8a4" : "#8e9a96", { roughness: 0.5 });
  const dashMat = surfaceMaterial(pal.dark ? "#9aa8a4" : "#8e9a96", { roughness: 0.5, opacity: 0.45 });
  const atomObjs = mol.atoms.map((A, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(elem(A.el).r * (opt.scale || 1), 36, 24), am(A.el)); m.position.copy(A.pos); m.userData = { atom: i }; g.add(m); return m; });
  const bondObjs = [];
  mol.bonds.forEach((B, k) => {
    const pa = mol.atoms[B.a].pos, pb = mol.atoms[B.b].pos; const grp = new THREE.Group(); grp.userData = { bond: k };
    const ord = B.ordShow != null ? B.ordShow : B.ord;
    const axis = pb.clone().sub(pa).normalize();
    let side = new THREE.Vector3(0, 0, 1).cross(axis); if (side.lengthSq() < 1e-4) side = new THREE.Vector3(1, 0, 0).cross(axis); side.normalize();
    /* keep double bonds in the molecular plane when there is one */
    const ref = mol.atoms.find((A, i) => i !== B.a && i !== B.b && A.pos.distanceTo(pa) < 1.8 && Math.abs(A.pos.clone().sub(pa).normalize().dot(axis)) < 0.95);
    if (ref) { const w = ref.pos.clone().sub(pa); side = w.sub(axis.clone().multiplyScalar(w.dot(axis))).normalize(); }
    const whole = Math.floor(ord + 1e-6), frac = ord - whole;
    const lines = whole + (frac > 0.05 ? 1 : 0);
    const off = 0.115;
    for (let n = 0; n < lines; n++) {
      const o = (n - (lines - 1) / 2) * off; const sh = side.clone().multiplyScalar(o);
      const isPartial = n === lines - 1 && frac > 0.05;
      const r = lines > 1 ? BOND_R * 0.72 : BOND_R;
      if (isPartial) { const segs = 5; for (let s = 0; s < segs; s++) { const t0 = 0.18 + (0.64 * s) / segs, t1 = t0 + 0.64 / segs * 0.55; grp.add(rod(pa.clone().lerp(pb, t0).add(sh), pa.clone().lerp(pb, t1).add(sh), r, dashMat, 10)); } }
      else grp.add(rod(pa.clone().add(sh), pb.clone().add(sh), r, bondMat, 16));
    }
    /* a fat invisible hit target so bonds are easy to click on a phone */
    const hit = rod(pa, pb, 0.22, new THREE.MeshBasicMaterial({ visible: false }), 8); hit.userData = { bond: k }; grp.add(hit);
    g.add(grp); bondObjs.push(grp);
  });
  /* lone pairs: a translucent lobe with two electron dots */
  const lpG = new THREE.Group(); const lpMat = surfaceMaterial(pal.accent, { opacity: 0.22, depthWrite: false, roughness: 0.6 });
  const eMat = new THREE.MeshBasicMaterial({ color: pal.stroke });
  mol.lps.forEach((L) => {
    const A = mol.atoms[L.atom]; const base = A.pos.clone(); const r0 = elem(A.el).r;
    const outer = L.atom !== mol.centre; const lobe = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), lpMat); lobe.scale.set(outer ? 0.15 : 0.2, outer ? 0.15 : 0.2, outer ? 0.27 : 0.38);
    lobe.position.copy(base).addScaledVector(L.dir, r0 + (outer ? 0.2 : 0.3)); lobe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), L.dir);
    lpG.add(lobe);
    const perp = new THREE.Vector3(0, 0, 1).cross(L.dir); if (perp.lengthSq() < 1e-4) perp.set(1, 0, 0); perp.normalize().multiplyScalar(0.07);
    for (const s of [1, -1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(outer ? 0.028 : 0.035, 10, 8), eMat); e.position.copy(lobe.position).addScaledVector(L.dir, outer ? 0.03 : 0.06).add(perp.clone().multiplyScalar(s)); lpG.add(e); }
  });
  g.add(lpG);
  return { group: g, atomObjs, bondObjs, lpGroup: lpG };
}

/* ---------------- the figure ---------------- */
export function mount(host, P = {}, ctx = {}) {
  const el = (t, a = {}, ...k) => { const e = document.createElement(t); for (const x in a) { if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };
  const rich = window.C120.rich;
  const st = { key: P.molecule || "H2O", lp: P.lp !== false, geo: P.geo || "molecular", fc: !!P.fc, partial: !!P.partial, dip: !!P.dipoles, labels: P.labels !== false, form: 0, hybrid: false, sel: [], builder: P.mode === "builder" ? { center: "A", lig: "X", nb: 4, nlp: 0 } : null };
  const V = new Viewer(host, { label: P.label || "Molecule", cam: [5.2, 3.6, 2.6], minD: 2.5, maxD: 20, aspect: P.aspect || 0.72, onInteract: ctx.onInteract });
  let mol = null, D = null, extras = new THREE.Group(); V.add(extras);
  let atomLabels = [], extraLabels = [];
  const info = el("div", { class: "mol-info", "aria-live": "polite" });
  const angleOut = el("div", { class: "small mol-angle", "aria-live": "polite" });
  const ctl = el("div", { class: "ctl mol" }); host.append(ctl);

  function specFor() {
    if (st.builder) { const b = st.builder; return { name: "Your molecule", formula: `${b.center}${b.lig}${b.nb > 1 ? b.nb : ""}${b.nlp ? "E" + (b.nlp > 1 ? b.nlp : "") : ""}`, center: b.center, ligands: Array.from({ length: b.nb }, () => [b.lig, 1]), lp: b.nlp, generic: true }; }
    return { key: st.key, ...MOLS[st.key] };
  }
  function rebuild(animateFrom) {
    const s = specFor(); const prev = mol;
    mol = build(s);
    const R = s.resonance && RESONANCE[s.resonance];
    if (R) applyForm(R);
    if (D) V.remove(D.group);
    D = draw(V, mol); V.add(D.group);
    atomLabels.forEach((l) => l.remove()); atomLabels = mol.atoms.map((A, i) => V.label(A.el, A.pos.clone(), "atomlab"));
    if (!animateFrom) fit();
    if (animateFrom && prev && !window.C120.reduceMotion()) morph(prev);
    clearSel(); refresh();
  }
  /* builder: slide atoms from the old shape into the new one */
  function morph(prev) {
    const start = mol.atoms.map((A, i) => (prev.atoms[i] ? prev.atoms[i].pos.clone() : new THREE.Vector3()));
    const end = mol.atoms.map((A) => A.pos.clone()); let t = 0;
    V.animate((dt) => { t = Math.min(1, t + dt / 0.45); const e = t * t * (3 - 2 * t); mol.atoms.forEach((A, i) => A.pos.copy(start[i]).lerp(end[i], e)); if (D) { V.remove(D.group); } D = draw(V, mol); V.add(D.group); atomLabels.forEach((L, i) => L.pos.copy(mol.atoms[i].pos)); refresh(true); return t < 1; });
  }
  function applyForm(R) {
    const f = R.forms[st.form] || R.forms[0];
    if (st.hybrid) { mol.bonds.forEach((B, k) => { B.ordShow = R.forms.reduce((t, F) => t + F.ord[k], 0) / R.forms.length; }); }
    else mol.bonds.forEach((B, k) => { if (f.ord[k] != null) { B.ord = f.ord[k]; B.ordShow = f.ord[k]; } });
    mol.atoms.forEach((A, i) => { if (f.fc[i] != null) A.fc = st.hybrid ? R.forms.reduce((t, F) => t + (F.fc[i] || 0), 0) / R.forms.length : f.fc[i]; });
    /* lone pairs follow the form */
    if (!st.hybrid) { const sum = mol.atoms.map((_, i) => mol.bonds.filter((B) => B.a === i || B.b === i).reduce((t, B) => t + B.ord, 0)); const keep = mol.lps.filter((L) => L.atom === mol.centre); mol.lps = keep; mol.atoms.forEach((A, i) => { if (i === mol.centre) return; A.lp = lpOf(A.el, A.fc, sum[i]); outerLonePairs(A, A.pos.clone().sub(mol.atoms[mol.centre].pos).normalize(), mol.lps, i); }); }
  }
  function refresh(quick) {
    if (!D) return;
    const s = specFor();
    D.lpGroup.visible = st.lp;
    extras.children.slice().forEach((o) => V.remove(o)); extraLabels.forEach((l) => l.remove()); extraLabels = [];
    /* electron or molecular geometry: a faint polyhedron through the domain tips (atoms, plus lone pairs for electron geometry) */
    if (st.geo && mol.atoms.length > 2 && !mol.graph) {
      const C = mol.atoms[mol.centre].pos; const tips = [];
      mol.bonds.forEach((B) => { const o = B.a === mol.centre ? B.b : B.a; tips.push(mol.atoms[o].pos.clone()); });
      if (st.geo === "electron") mol.lps.filter((L) => L.atom === mol.centre).forEach((L) => tips.push(C.clone().addScaledVector(L.dir, 1.25)));
      if (tips.length >= 3) { const mat = new THREE.LineBasicMaterial({ color: V.pal.accent, transparent: true, opacity: 0.55 }); for (let i = 0; i < tips.length; i++) for (let j = i + 1; j < tips.length; j++) { const a = tips[i].clone().sub(C), b = tips[j].clone().sub(C); const ang = a.angleTo(b) * 180 / Math.PI; if (ang < 125 && ang > 60) extras.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([tips[i], tips[j]]), mat)); } }
    }
    atomLabels.forEach((L, i) => { const A = mol.atoms[i]; let t = A.el === "A" ? "A" : A.el === "X" ? "X" : A.el;
      if (st.fc && Math.abs(A.fc) > 1e-6) t += `<sup class="fc">${fcText(A.fc)}</sup>`;
      L.set(t); L.visible = st.labels && !(mol.graph && mol.atoms.length > 8 && (A.el === "C" || A.el === "H") && !(st.fc && A.fc)); L.pos.copy(A.pos); });
    /* partial charges and dipoles */
    if (st.partial || st.dip) {
      const dp = dipoles(mol); const sign = mol.atoms.map(() => 0);
      dp.list.forEach((d) => { sign[d.to] -= d.dEN; sign[d.from] += d.dEN; });
      if (st.partial) mol.atoms.forEach((A, i) => { if (Math.abs(sign[i]) < 0.05) return; const r0 = elem(A.el).r; const off = i === mol.centre ? A.pos.clone().add(new THREE.Vector3(0.0, -r0 - 0.18, -r0 - 0.12)) : A.pos.clone().add(A.pos.clone().sub(mol.atoms[mol.centre].pos).normalize().multiplyScalar(r0 + 0.2)).add(new THREE.Vector3(0, 0, r0 + 0.12)); extraLabels.push(V.label(sign[i] > 0 ? "δ+" : "δ−", off, "delta " + (sign[i] > 0 ? "pos" : "neg"))); });
      if (st.dip) {
        const m = surfaceMaterial(V.pal.accent, { roughness: 0.5 });
        dp.list.forEach((d) => { const a = mol.atoms[d.from].pos, b = mol.atoms[d.to].pos; const dir = b.clone().sub(a).normalize(); let side = new THREE.Vector3(0, 0, 1).cross(dir); if (side.lengthSq() < 1e-3) side.set(1, 0, 0); side.normalize().multiplyScalar(0.3);
          const L = Math.min(a.distanceTo(b) * 0.8, 0.45 + d.dEN * 0.5); const mid = a.clone().lerp(b, 0.5).add(side); const s0 = mid.clone().addScaledVector(dir, -L / 2), s1 = mid.clone().addScaledVector(dir, L / 2);
          const ar = arrow(s0, s1, 0.025, m, 3.4); extras.add(ar);
          const cross = rod(s0.clone().addScaledVector(dir, 0.1).addScaledVector(side.clone().normalize(), -0.07), s0.clone().addScaledVector(dir, 0.1).addScaledVector(side.clone().normalize(), 0.07), 0.018, m, 8); extras.add(cross); });
        const net = dp.net; const nm = surfaceMaterial(V.pal.head, { roughness: 0.5 });
        if (net.length() > 0.08) { const c0 = mol.atoms[mol.centre].pos.clone(); const dir = net.clone().normalize(); const len = Math.min(2.2, 0.7 + net.length() * 0.9); const start = c0.clone().addScaledVector(dir, -len * 0.5); extras.add(arrow(start, start.clone().addScaledVector(dir, len), 0.05, nm, 3.2)); extraLabels.push(V.label("net dipole", start.clone().addScaledVector(dir, len + 0.25), "netlab")); }
      }
    }
    V.requestRender();
    if (quick) return;
    drawInfo(s);
  }
  const fcText = (f) => { if (Math.abs(f - Math.round(f)) < 1e-6) return f > 0 ? `+${f}` : `−${-f}`; const n = Math.round(f * 6); const fr = { 2: "1/3", 3: "1/2", 4: "2/3" }[Math.abs(n)] || Math.abs(f).toFixed(2); return (f > 0 ? "+" : "−") + fr; };
  function drawInfo(s) {
    const dp = (st.dip || st.partial) ? dipoles(mol) : null;
    const polar = dp ? dp.net.length() > 0.08 : null;
    const name = s.generic ? `<b>${s.formula}</b>` : `<b>${s.name}</b>, $\\ce{${s.formula}}$`;
    const shp = mol.graph ? `${mol.atoms.length} atoms` : `${mol.sn} electron group${mol.sn === 1 ? "" : "s"} on ${s.center === "A" ? "A" : s.center} (${mol.bonds.length} bonded, ${mol.nlp} lone pair${mol.nlp === 1 ? "" : "s"}) · electron geometry: <b>${mol.eg}</b> · molecular geometry: <b>${mol.mg}</b>${mol.angles.length ? ` · ideal angles ${mol.angles.map((a) => a + "°").join(", ")}` : ""}`;
    info.innerHTML = rich(`${name} &nbsp; ${shp}${polar != null ? ` · <b>${polar ? "polar" : "non-polar"}</b>` : ""}${s.outside ? ' <span class="pill" style="--c:var(--ink2)">example not in the notes</span>' : s.notes ? ` <span class="ref">${s.notes}</span>` : ""}`);
    const R = s.resonance && RESONANCE[s.resonance];
    if (resRow) { resRow.innerHTML = ""; if (R) { const seg = el("div", { class: "seg", role: "group", "aria-label": "Resonance form" }); R.forms.forEach((F, i) => { const b = el("button", { type: "button", "aria-pressed": String(!st.hybrid && st.form === i) }, `Form ${i + 1}${R.major && R.major.includes(i) ? " (major)" : ""}`); b.onclick = () => { st.form = i; st.hybrid = false; rebuild(); }; seg.append(b); }); const h = el("button", { type: "button", "aria-pressed": String(st.hybrid) }, "Hybrid"); h.onclick = () => { st.hybrid = true; rebuild(); }; seg.append(h); resRow.append(seg, el("div", { class: "small muted", html: rich(R.note) })); } }
  }
  /* ---------- measuring angles: tap two bonds ---------- */
  function clearSel() { st.sel = []; angleOut.innerHTML = P.measure === false ? "" : "Tap two bonds that share an atom to measure the angle between them."; }
  V.onTap((ev) => {
    if (P.measure === false || !D) return;
    const hits = V.pick(ev, D.bondObjs); if (!hits.length) { clearSel(); extrasAngle(); return; }
    let o = hits[0].object; while (o && o.userData.bond == null) o = o.parent; const k = o.userData.bond;
    st.sel = st.sel.filter((x) => x !== k).concat(k).slice(-2);
    if (st.sel.length === 2) { const r = bondAngle(mol, mol.bonds[st.sel[0]], mol.bonds[st.sel[1]]); if (!r) { angleOut.textContent = "Those two bonds don't share an atom. Pick two bonds on the same atom."; st.sel = [k]; return extrasAngle(); }
      const ideal = !mol.graph ? nearestIdeal(r.deg) : null;
      angleOut.innerHTML = rich(`Angle at ${mol.atoms[r.s].el}: <b>${r.deg.toFixed(1)}°</b>${ideal ? ` (ideal VSEPR angle; real molecules can differ slightly)` : ""}`); extrasAngle(r);
      if (ctx.onState) ctx.onState({ measured: Math.round(r.deg * 10) / 10 });
    } else { angleOut.textContent = "Now tap a second bond on the same atom."; extrasAngle(); }
  });
  let angG = null, angLab = null;
  function extrasAngle(r) { if (angG) { V.remove(angG); angG = null; } if (angLab) { angLab.remove(); angLab = null; }
    D && D.bondObjs.forEach((g, i) => g.children.forEach((m) => { if (m.material && m.material.emissive) m.material.emissive.set(st.sel.includes(i) ? V.pal.accent : 0x000000); }));
    if (!r) return V.requestRender();
    const c = mol.atoms[r.s].pos; angG = arcLine(c, r.u, r.v, 0.55, new THREE.LineBasicMaterial({ color: V.pal.accent })); V.add(angG);
    const mid = r.u.clone().normalize().add(r.v.clone().normalize()).normalize().multiplyScalar(0.85).add(c); angLab = V.label(`${r.deg.toFixed(1)}°`, mid, "anglab"); V.requestRender(); }
  function fit() { let R = 0.8; mol.atoms.forEach((A) => { R = Math.max(R, A.pos.length() + elem(A.el).r); }); const d = R * 3.1 + 1.6; const dir = new THREE.Vector3(...(P.cam || [5.2, 3.6, 2.6])).normalize(); V.controls.maxDistance = Math.max(20, d * 2.5); V.setHome(dir.multiplyScalar(d).toArray()); }
  const nearestIdeal = (d) => [90, 109.5, 120, 180].find((a) => Math.abs(a - d) < 1);

  /* ---------- controls ---------- */
  let resRow = null;
  if (P.choices && P.choices.length > 1) {
    const sel = el("select", { "aria-label": "Molecule" }); P.choices.forEach((k) => { const m = MOLS[k]; sel.append(el("option", { value: k }, `${m.name} (${m.formula.replace(/\^/g, "")})`)); }); sel.value = st.key;
    sel.onchange = () => { st.key = sel.value; st.form = 0; st.hybrid = false; rebuild(); emit(); };
    ctl.append(el("label", { class: "row small" }, el("b", {}, "Molecule "), sel));
  }
  if (st.builder) {
    const b = st.builder; const row = el("div", { class: "row builder" });
    const step = (lab, key, min, max) => { const w = el("div", { class: "stepper" }); const out = el("output", {}, String(b[key])); const m = el("button", { type: "button", class: "sbtn", "aria-label": "Fewer " + lab }, "−"); const p = el("button", { type: "button", class: "sbtn", "aria-label": "More " + lab }, "+");
      const set = (v) => { const tot = (key === "nb" ? v : b.nb) + (key === "nlp" ? v : b.nlp); if (v < min || v > max || tot > 6 || tot < 2) return; b[key] = v; out.textContent = v; rebuild(true); emit(); };
      m.onclick = () => set(b[key] - 1); p.onclick = () => set(b[key] + 1); w.append(el("span", { class: "small" }, lab), m, out, p); return w; };
    row.append(step("Bonded atoms", "nb", 1, 6), step("Lone pairs", "nlp", 0, 3));
    const cs = el("select", { "aria-label": "Central atom" }); ["A", "C", "N", "O", "S", "P", "Cl", "Br", "I", "Xe"].forEach((x) => cs.append(el("option", { value: x }, x === "A" ? "A (any)" : x))); cs.onchange = () => { b.center = cs.value; rebuild(); };
    const ls = el("select", { "aria-label": "Outer atom" }); ["X", "H", "F", "Cl", "O"].forEach((x) => ls.append(el("option", { value: x }, x === "X" ? "X (any)" : x))); ls.onchange = () => { b.lig = ls.value; rebuild(); };
    row.append(el("label", { class: "small" }, "Centre ", cs), el("label", { class: "small" }, "Outer ", ls));
    ctl.append(row);
  }
  const tg = el("div", { class: "row" }); ctl.append(tg);
  const tog = (t, key, on) => { const x = el("button", { type: "button", class: "chip", "aria-pressed": String(!!st[key]) }, t); x.onclick = () => { st[key] = !st[key]; x.setAttribute("aria-pressed", String(st[key])); on ? on() : refresh(); emit(); }; tg.append(x); return x; };
  if (P.geoToggle !== false && !(MOLS[st.key] && MOLS[st.key].atoms && !st.builder)) { const seg = el("div", { class: "seg", role: "group", "aria-label": "Geometry" }); [["electron", "Electron geometry"], ["molecular", "Molecular geometry"]].forEach(([k, t]) => { const x = el("button", { type: "button", "aria-pressed": String(st.geo === k) }, t); x.onclick = () => { st.geo = k; seg.querySelectorAll("button").forEach((y) => y.setAttribute("aria-pressed", String(y === x))); refresh(); emit(); }; seg.append(x); }); tg.append(seg); }
  tog("Lone pairs", "lp");
  tog("Atom labels", "labels");
  if (P.fcToggle !== false) tog("Formal charges", "fc");
  if (P.polarity !== false) { tog("δ+ / δ−", "partial"); tog("Dipoles", "dip"); }
  resRow = el("div", { class: "res" }); ctl.append(resRow);
  ctl.append(info, angleOut);
  function emit() { if (ctx.onState) ctx.onState({ molecule: st.key, geo: st.geo, builder: st.builder ? { ...st.builder } : null, shape: mol && mol.mg }); }
  V.theme(() => { if (mol) rebuild(); }, false);
  rebuild();
  return { viewer: V, mol: () => mol, state: () => ({ ...st }), set(p) { Object.assign(st, p); rebuild(); }, dispose() { V.dispose(); ctl.remove(); } };
}

/* 2D fallback: a wedge-and-dash style drawing of the projection, with the shape name */
export function fallback(host, P = {}) {
  const key = P.molecule || "H2O"; const mol = build(key); const s = MOLS[key]; const pal = palette(host);
  const pts = mol.atoms.map((A) => [A.pos.x + A.pos.y * 0.25, A.pos.z - A.pos.y * 0.15, A.pos.y]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const S = 70, W = 340, H = 240; const X = (x) => W / 2 + (x - cx) * S, Y = (y) => H / 2 - (y - cy) * S;
  let g = `<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${s.name}, drawn flat">`;
  mol.bonds.forEach((B) => { const a = pts[B.a], b = pts[B.b]; const back = (a[2] + b[2]) / 2 > 0.3; g += `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" style="stroke:var(--fig-stroke);stroke-width:${back ? 1.5 : 3};${back ? "stroke-dasharray:4 3" : ""}"/>`; });
  mol.atoms.forEach((A, i) => { const p = pts[i]; g += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${elem(A.el).r * 40}" style="fill:${elem(A.el).c};stroke:var(--fig-stroke);stroke-width:1"/><text x="${X(p[0])}" y="${Y(p[1]) + 4}" text-anchor="middle" class="lbl" style="fill:#fff;font-size:11px">${A.el}</text>`; });
  g += `</svg>`;
  const w = document.createElement("div"); w.className = "v3d-fallback";
  w.innerHTML = g + `<p class="small muted">3D needs WebGL, which is off in this browser. Flat drawing: dashed bonds point away from you. ${mol.graph ? "" : `Electron geometry: ${mol.eg}. Molecular geometry: ${mol.mg}.`}</p>`;
  host.append(w); return { dispose() { w.remove(); } };
}
