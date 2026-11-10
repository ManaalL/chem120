/* CHEM 120 Interactive: Module 1 at the particle level.
   Scenarios (params.scenario):
     balance   reactant and product molecules with a coefficient stepper for each species and a live atom tally (p. 3: balanced
               equations obey conservation of mass). params: reaction, unbalanced:true (all coefficients start at 1)
     limiting  a box of params.a molecules of A and params.b of B that react in the balanced ratio until one runs out (pp. 18-19)
     precip    two beakers of ions mixed; ions that form an insoluble salt (solubility rules, p. 7) gather into a small rock-salt-like
               cluster, spectators stay in solution. params: reaction "AgNO3+NaCl" | "BaCl2+Na2SO4" | "Pb(NO3)2+KI" | "CaCl2+Na2CO3" | "NaCl+KNO3"
     atomecon  every reactant atom tinted (and marked with a circle or a square) by where it ends up: desired product or waste (pp. 27-29)
   Molecule shapes come from build() in molecule.mjs (VSEPR, p. 16 bond lengths); ions are plain spheres; molar masses are the data sheet's. */
import { THREE, Viewer, surfaceMaterial, arrow, palette } from "./viewer.mjs";
import { build, MOLS } from "./molecule.mjs";
import { elem } from "./chemdata.mjs";

/* ---------------- reactions ---------------- */
export const RX = {
  "h2-o2": { r: [["H2", 2], ["O2", 1]], p: [["H2O", 2]], ab: [6, 5] },
  "n2-h2": { r: [["N2", 1], ["H2", 3]], p: [["NH3", 2]], ab: [4, 9] },
  propane: { r: [["C3H8", 1], ["O2", 5]], p: [["CO2", 3], ["H2O", 4]], ab: [3, 10] },
  acetylene: { r: [["C2H2", 2], ["O2", 5]], p: [["CO2", 4], ["H2O", 2]], ab: [4, 5], notes: "Example 1-2 (p. 4)" },
  "k-br2": { r: [["K", 2], ["Br2", 1]], p: [["KBr", 2]], ab: [6, 5], notes: "Example 1-1 (p. 4)" },
  "li-n2": { r: [["Li", 6], ["N2", 1]], p: [["Li3N", 2]], ab: [12, 3] },
  "ch4-o2": { r: [["CH4", 1], ["O2", 2]], p: [["CO2", 1], ["H2O", 2]], ab: [3, 4] }
};
/* precipitation: ions in each beaker [ion, per formula unit], formula units per beaker */
const IONS = {
  "Ag+": { tex: "Ag+", html: "Ag<sup>+</sup>", q: 1, r: 0.27, c: "#b9bec6" }, "Na+": { tex: "Na+", html: "Na<sup>+</sup>", q: 1, r: 0.25, c: "#8d6fc4" },
  "K+": { tex: "K+", html: "K<sup>+</sup>", q: 1, r: 0.28, c: "#d98cb3" }, "Ba2+": { tex: "Ba^2+", html: "Ba<sup>2+</sup>", q: 2, r: 0.29, c: "#c8553d" },
  "Pb2+": { tex: "Pb^2+", html: "Pb<sup>2+</sup>", q: 2, r: 0.28, c: "#69727f" }, "Ca2+": { tex: "Ca^2+", html: "Ca<sup>2+</sup>", q: 2, r: 0.26, c: "#5f8f4a" },
  "NO3-": { tex: "NO3^-", html: "NO<sub>3</sub><sup>−</sup>", q: -1, r: 0.34, c: "#4f74c9" }, "Cl-": { tex: "Cl^-", html: "Cl<sup>−</sup>", q: -1, r: 0.33, c: "#3f9e5a" },
  "I-": { tex: "I^-", html: "I<sup>−</sup>", q: -1, r: 0.37, c: "#5b3a8c" }, "SO42-": { tex: "SO4^2-", html: "SO<sub>4</sub><sup>2−</sup>", q: -2, r: 0.37, c: "#d1ad2f" },
  "CO32-": { tex: "CO3^2-", html: "CO<sub>3</sub><sup>2−</sup>", q: -2, r: 0.35, c: "#4a5257" }
};
export const PRECIP = {
  "AgNO3+NaCl": { A: ["AgNO3", [["Ag+", 1], ["NO3-", 1]], 4], B: ["NaCl", [["Na+", 1], ["Cl-", 1]], 4], solid: "AgCl", mol: "AgNO3(aq) + NaCl(aq) -> AgCl(s) + NaNO3(aq)",
    full: "Ag+(aq) + NO3^-(aq) + Na+(aq) + Cl^-(aq) -> AgCl(s) + Na+(aq) + NO3^-(aq)", net: "Ag+(aq) + Cl^-(aq) -> AgCl(s)", notes: "Module 1, p. 3 (double displacement example)" },
  "BaCl2+Na2SO4": { A: ["BaCl2", [["Ba2+", 1], ["Cl-", 2]], 3], B: ["Na2SO4", [["Na+", 2], ["SO42-", 1]], 3], solid: "BaSO4", mol: "BaCl2(aq) + Na2SO4(aq) -> BaSO4(s) + 2NaCl(aq)",
    full: "Ba^2+(aq) + 2Cl^-(aq) + 2Na+(aq) + SO4^2-(aq) -> BaSO4(s) + 2Na+(aq) + 2Cl^-(aq)", net: "Ba^2+(aq) + SO4^2-(aq) -> BaSO4(s)" },
  "Pb(NO3)2+KI": { A: ["Pb(NO3)2", [["Pb2+", 1], ["NO3-", 2]], 2], B: ["KI", [["K+", 1], ["I-", 1]], 4], solid: "PbI2", mol: "Pb(NO3)2(aq) + 2KI(aq) -> PbI2(s) + 2KNO3(aq)",
    full: "Pb^2+(aq) + 2NO3^-(aq) + 2K+(aq) + 2I^-(aq) -> PbI2(s) + 2K+(aq) + 2NO3^-(aq)", net: "Pb^2+(aq) + 2I^-(aq) -> PbI2(s)" },
  "CaCl2+Na2CO3": { A: ["CaCl2", [["Ca2+", 1], ["Cl-", 2]], 3], B: ["Na2CO3", [["Na+", 2], ["CO32-", 1]], 3], solid: "CaCO3", mol: "CaCl2(aq) + Na2CO3(aq) -> CaCO3(s) + 2NaCl(aq)",
    full: "Ca^2+(aq) + 2Cl^-(aq) + 2Na+(aq) + CO3^2-(aq) -> CaCO3(s) + 2Na+(aq) + 2Cl^-(aq)", net: "Ca^2+(aq) + CO3^2-(aq) -> CaCO3(s)" },
  "NaCl+KNO3": { A: ["NaCl", [["Na+", 1], ["Cl-", 1]], 3], B: ["KNO3", [["K+", 1], ["NO3-", 1]], 3], solid: null, mol: "NaCl(aq) + KNO3(aq) -> no reaction",
    full: "Na+(aq) + Cl^-(aq) + K+(aq) + NO3^-(aq) -> no reaction", net: null }
};
/* solubility guidelines, Module 1 p. 7, in order of priority */
export function solubility(cat, an) {
  const G1 = ["Li+", "Na+", "K+", "Rb+", "Cs+"];
  if (G1.includes(cat)) return { sol: true, rule: 1, why: "salts of the alkali metals (group 1) are soluble" };
  if (cat === "NH4+") return { sol: true, rule: 2, why: "ammonium salts are soluble" };
  if (an === "NO3-") return { sol: true, rule: 3, why: "nitrates are soluble" };
  if (["Cl-", "Br-", "I-"].includes(an)) return ["Pb2+", "Ag+", "Hg+", "Hg22+"].includes(cat) ? { sol: false, rule: 4, why: "chlorides, bromides and iodides of lead, mercury and silver are not soluble" } : { sol: true, rule: 4, why: "chlorides, bromides and iodides are soluble (except Pb, Hg, Ag)" };
  if (an === "SO42-") return ["Ca2+", "Sr2+", "Ba2+", "Ag+", "Hg2+", "Hg22+", "Pb2+"].includes(cat) ? { sol: false, rule: 5, why: "sulfates of calcium, strontium, barium, silver, mercury and lead are not soluble" } : { sol: true, rule: 5, why: "sulfates are soluble (with those exceptions)" };
  if (["CO32-", "PO43-", "S2-"].includes(an)) return { sol: false, rule: 6, why: "carbonates, phosphates and sulfides are insoluble (except group 1 and ammonium)" };
  if (an === "OH-") return { sol: false, rule: 7, why: "hydroxides are insoluble or slightly soluble (except group 1)" };
  return { sol: true, rule: null, why: "no rule in the notes covers this pair" };
}
/* atom economy: which atoms of each reactant (by index in the built molecule) end up as waste */
export const AE = {
  "ethene-water": { r: [["C2H4", 1, []], ["H2O", 1, []]], p: [["C2H5OH", 1, true]], desired: "C2H5OH", label: "Addition: ethene + water → ethanol" },
  "methane-chlorine": { r: [["CH4", 1, [4]], ["Cl2", 1, [1]]], p: [["CH3Cl", 1, true], ["HCl", 1, false]], desired: "CH3Cl", label: "Substitution: methane + chlorine → chloromethane + HCl" },
  "ethanol-dehydration": { r: [["C2H5OH", 1, [2, 3, 8]]], p: [["C2H4", 1, true], ["H2O", 1, false]], desired: "C2H4", label: "Elimination: ethanol → ethene + water (Example 1-21, p. 29)" },
  haber: { r: [["N2", 1, []], ["H2", 3, []]], p: [["NH3", 2, true]], desired: "NH3", label: "Haber process: nitrogen + hydrogen → ammonia" }
};

/* ---------------- molecule templates ---------------- */
const EXTRA = {
  Br2: { name: "Bromine", formula: "Br2", center: "Br", ligands: [["Br", 1, 0, 3]], lp: 3 },
  C2H4: { name: "Ethene", formula: "C2H4", atoms: [["C", 0, 0, { h: 2 }], ["C", 1, 0, { h: 2 }]], bonds: [[0, 1, 2]] },
  CH3Cl: { name: "Chloromethane", formula: "CH3Cl", center: "C", ligands: [["Cl", 1, 0, 3], ["H", 1], ["H", 1], ["H", 1]], lp: 0 }
};
const ALIAS = { C2H5OH: "ethanol" };
const IONIC = { /* formula units drawn as touching ions (no bonds) */
  KBr: [["K", 0.42, -0.45, 0], ["Br", 0.46, 0.43, 0]],
  Li3N: [["N", 0.42, 0, 0], ["Li", 0.3, 0.72, 0], ["Li", 0.3, -0.36, 0.62], ["Li", 0.3, -0.36, -0.62]]
};
const ATOMONLY = { K: 0.42, Li: 0.34 };
const tcache = new Map();
export function template(f) {
  if (tcache.has(f)) return tcache.get(f);
  let atoms = [], bonds = [];
  if (IONIC[f]) atoms = IONIC[f].map(([el, r, x, z]) => ({ el, p: new THREE.Vector3(x, 0, z), r }));
  else if (ATOMONLY[f]) atoms = [{ el: f, p: new THREE.Vector3(), r: ATOMONLY[f] }];
  else {
    const spec = EXTRA[f] ? { key: f, ...EXTRA[f] } : { key: ALIAS[f] || f, ...MOLS[ALIAS[f] || f] };
    const m = build(spec);
    atoms = m.atoms.map((A) => ({ el: A.el, p: A.pos.clone(), r: elem(A.el).r * 0.95 }));
    bonds = m.bonds.map((B) => ({ a: B.a, b: B.b, ord: B.ord }));
    orient(atoms);
  }
  const cen = new THREE.Vector3(); atoms.forEach((A) => cen.add(A.p)); cen.multiplyScalar(1 / atoms.length); atoms.forEach((A) => A.p.sub(cen));
  /* bond cylinders in local coordinates; double and triple bonds as parallel rods in the drawing plane */
  const lines = [];
  bonds.forEach((B) => {
    const pa = atoms[B.a].p, pb = atoms[B.b].p; const ax = pb.clone().sub(pa).normalize();
    let side = new THREE.Vector3(0, 1, 0).cross(ax); if (side.lengthSq() < 1e-4) side = new THREE.Vector3(0, 0, 1).cross(ax); side.normalize();
    const n = Math.round(B.ord); const r = n > 1 ? 0.055 : 0.075;
    for (let k = 0; k < n; k++) { const o = side.clone().multiplyScalar((k - (n - 1) / 2) * 0.12); lines.push({ a: pa.clone().add(o), b: pb.clone().add(o), r }); }
  });
  let R = 0.3; atoms.forEach((A) => (R = Math.max(R, A.p.length() + A.r)));
  const t = { f, atoms, lines, R }; tcache.set(f, t); return t;
}
/* lay the molecule flat to the viewer: longest direction along x, molecular plane in x-z */
function orient(atoms) {
  if (atoms.length < 2) return;
  const cen = new THREE.Vector3(); atoms.forEach((A) => cen.add(A.p)); cen.multiplyScalar(1 / atoms.length);
  const P = atoms.map((A) => A.p.clone().sub(cen));
  let best = [0, 1], d = -1; for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const q = P[i].distanceToSquared(P[j]); if (q > d + 1e-6) { d = q; best = [i, j]; } }
  const ex = P[best[1]].clone().sub(P[best[0]]).normalize();
  let far = null, fd = 0.02; P.forEach((p) => { const perp = p.clone().sub(ex.clone().multiplyScalar(p.dot(ex))); if (perp.lengthSq() > fd) { fd = perp.lengthSq(); far = perp; } });
  const ez = far ? far.normalize() : (Math.abs(ex.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0)).sub(ex.clone().multiplyScalar(ex.z)).normalize();
  const ey = new THREE.Vector3().crossVectors(ez, ex).normalize(); ez.crossVectors(ex, ey);
  atoms.forEach((A, i) => { const p = P[i]; A.p.set(p.dot(ex), p.dot(ey), p.dot(ez)); });
}
export function countAtoms(f) { const o = {}; f.replace(/([A-Z][a-z]?)(\d*)/g, (m, e, n) => { o[e] = (o[e] || 0) + (n ? +n : 1); return m; }); return o; }
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const ce = (s) => `$\\ce{${s}}$`;
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------------- instanced drawing of many small molecules ---------------- */
class Pack {
  constructor(V) {
    this.V = V; this.sph = new THREE.SphereGeometry(1, 24, 16); this.cyl = new THREE.CylinderGeometry(1, 1, 1, 12, 1);
    this.mats = new Map(); this.meshes = new Map(); this.counts = new Map(); this.group = new THREE.Group(); V.scene.add(this.group);
    this.bondMat = surfaceMaterial(V.pal.dark ? "#9aa8a4" : "#8e9a96", { roughness: 0.5 });
    this.bonds = this.mesh("bond", this.cyl, this.bondMat, 64);
    this.M = new THREE.Matrix4(); this.Q = new THREE.Quaternion(); this.S = new THREE.Vector3(); this.A = new THREE.Vector3(); this.B = new THREE.Vector3(); this.D = new THREE.Vector3(); this.UP = new THREE.Vector3(0, 1, 0); this.col = new THREE.Color(); this.QI = new THREE.Quaternion();
  }
  mat(key, color, hatch) { if (!this.mats.has(key)) this.mats.set(key, surfaceMaterial(color, { roughness: 0.42, hatch, hatchScale: 2.2 })); return this.mats.get(key); }
  mesh(key, geo, mat, cap) {
    let m = this.meshes.get(key);
    if (m && m.instanceMatrix.count >= cap) return m;
    const n = Math.max(cap, m ? m.instanceMatrix.count * 2 : 0);
    if (m) { this.group.remove(m); m.dispose(); }
    m = new THREE.InstancedMesh(geo, mat, n); m.count = 0; m.frustumCulled = false; this.group.add(m); this.meshes.set(key, m); return m;
  }
  /* items: [{t, pos, q, s, colors?, hatch?, hide?}] */
  draw(items) {
    const cnt = this.counts; cnt.clear(); let nb = 0;
    for (const it of items) { if (it.hide || it.s <= 0.001) continue; const t = it.t; for (let i = 0; i < t.atoms.length; i++) { const k = this.key(it, i); cnt.set(k, (cnt.get(k) || 0) + 1); } nb += t.lines.length; }
    for (const [k, n] of cnt) { const [c, h] = k.split("|"); this.mesh(k, this.sph, this.mat(k, c, h === "h"), n); }
    this.bonds = this.mesh("bond", this.cyl, this.bondMat, Math.max(1, nb));
    const fill = new Map(); for (const k of this.meshes.keys()) fill.set(k, 0);
    const { M, Q, S, A, B, D, UP } = this;
    for (const it of items) {
      if (it.hide || it.s <= 0.001) continue; const t = it.t; const q = it.q || this.QI; const s = it.s ?? 1;
      for (let i = 0; i < t.atoms.length; i++) {
        const a = t.atoms[i]; const k = this.key(it, i); const m = this.meshes.get(k); const j = fill.get(k);
        A.copy(a.p).applyQuaternion(q).multiplyScalar(s).add(it.pos); S.setScalar(a.r * s * (it.rs || 1)); M.compose(A, this.QI, S); m.setMatrixAt(j, M); fill.set(k, j + 1);
      }
      for (const L of t.lines) {
        A.copy(L.a).applyQuaternion(q).multiplyScalar(s).add(it.pos); B.copy(L.b).applyQuaternion(q).multiplyScalar(s).add(it.pos);
        D.subVectors(B, A); const len = D.length(); Q.setFromUnitVectors(UP, D.multiplyScalar(1 / len)); S.set(L.r * s, len, L.r * s); A.add(B).multiplyScalar(0.5);
        M.compose(A, Q, S); const j = fill.get("bond"); this.bonds.setMatrixAt(j, M); fill.set("bond", j + 1);
      }
    }
    for (const [k, m] of this.meshes) { m.count = fill.get(k) || 0; m.instanceMatrix.needsUpdate = true; }
    this.V.requestRender();
  }
  key(it, i) { const c = it.colors ? it.colors[i] : it.t.atoms[i].c || elem(it.t.atoms[i].el).c; return c + "|" + (it.hatch && it.hatch[i] ? "h" : ""); }
  dispose() { this.mats.forEach((m) => m.dispose()); this.bondMat.dispose(); this.sph.dispose(); this.cyl.dispose(); this.meshes.forEach((m) => m.dispose()); }
}

const CSS = `.ctl.pt{gap:8px}
.pt-eq{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center}
.pt-eq .op{font:600 1.1rem var(--display);color:var(--ink2)}
.pt-sp{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--rule);border-radius:8px;padding:3px 6px;background:var(--paper)}
.pt-sp .sbtn{width:28px;height:28px;border:1px solid var(--rule);border-radius:6px;background:var(--paper);cursor:pointer;font-weight:700;color:var(--ink)}
.pt-sp .sbtn:hover{border-color:var(--c,var(--accent))}
.pt-sp output{font:600 1rem var(--mono);min-width:1.5em;text-align:center;color:var(--head)}
table.pt-tab{justify-self:start;min-width:min(100%,360px);border-collapse:collapse;font-size:.88rem;font-variant-numeric:tabular-nums}
table.pt-tab th,table.pt-tab td{border-bottom:1px solid var(--rule);padding:3px 10px;text-align:center}
table.pt-tab th{font:500 .72rem var(--mono);letter-spacing:.04em;text-transform:uppercase;color:var(--ink2)}
table.pt-tab td.ok{color:var(--ok);font-weight:700} table.pt-tab td.no{color:var(--bad);font-weight:700}
.pt-read{font-size:.93rem;line-height:1.6;color:var(--ink2)} .pt-read b{color:var(--head)}
.pt-msg{padding:5px 9px;border-radius:6px;border-left:3px solid var(--rule);background:var(--fig-soft);font-size:.92rem}
.pt-msg.ok{border-color:var(--ok);background:var(--okSoft)} .pt-msg.warn{border-color:var(--warn);background:var(--warnSoft)}
.v3l.ion{font:600 .7rem var(--sans);color:var(--head);background:color-mix(in srgb,var(--paper) 78%,transparent);border-radius:4px;padding:0 3px;line-height:1.25}
.v3l.ion.spec{font-weight:500;color:var(--ink2)}
.v3l.ptlab{font:600 .8rem var(--sans);color:var(--head);text-align:center}
.v3l.ptop{font:600 1.15rem var(--display);color:var(--ink2)}
.v3l.ae-p,.v3l.ae-w{font:700 .62rem var(--sans);min-width:17px;height:17px;display:grid;place-items:center;padding:0 2px;border:1.5px solid}
.v3l.ae-p{border-radius:50%;color:var(--head);background:color-mix(in srgb,var(--paper) 70%,transparent);border-color:var(--c,var(--accent))}
.v3l.ae-w{border-radius:2px;color:var(--ink2);background:color-mix(in srgb,var(--paper) 70%,transparent);border-color:var(--ink2);border-style:dashed}
.pt-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:.86rem;color:var(--ink2);align-items:center}
.pt-leg .k{display:inline-grid;place-items:center;width:16px;height:16px;margin-right:5px;vertical-align:-3px;border:1.5px solid var(--ink2);font:700 .55rem var(--sans)}
.pt-leg .k.p{border-radius:50%;border-color:var(--c,var(--accent))} .pt-leg .k.w{border-style:dashed;border-radius:2px}
.v3d-fallback svg.pt-fb{max-width:560px}`;
let styleRefs = 0, styleEl = null;
function useStyle() { styleRefs++; if (!styleEl) { styleEl = document.createElement("style"); styleEl.dataset.c120 = "particles"; styleEl.textContent = CSS; document.head.append(styleEl); } return () => { if (--styleRefs <= 0 && styleEl) { styleEl.remove(); styleEl = null; styleRefs = 0; } }; }
const el = (t, a = {}, ...k) => { const e = document.createElement(t); for (const x in a) { if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };

/* ---------------- mount ---------------- */
export function mount(host, P = {}, ctx = {}) {
  const scen = ["balance", "limiting", "precip", "atomecon"].includes(P.scenario) ? P.scenario : "balance";
  const release = useStyle();
  const V = new Viewer(host, { label: P.label || "Particle view", cam: [0, -12, 3.5], target: [0, 0, 0], aspect: P.aspect || (scen === "precip" ? 0.6 : scen === "limiting" ? 0.58 : 0.48), minH: 240, maxH: 480, minD: 3, maxD: 60, fov: 30, onInteract: ctx.onInteract });
  const pack = new Pack(V);
  const ctl = el("div", { class: "ctl pt" }); host.append(ctl);
  const rich = window.C120.rich;
  const fit = (W, H, cx = 0, cz = 0, elev = 0.22) => {
    const cam = V.camera; const vf = THREE.MathUtils.degToRad(cam.fov) / 2; const tz = Math.tan(vf) / (cam.zoom || 1);
    const d = Math.max((H / 2) / tz, (W / 2) / (tz * cam.aspect)) * 1.12 + 1;
    const dir = new THREE.Vector3(0, -1, elev).normalize(); V.controls.maxDistance = Math.max(30, d * 2.5);
    V.setHome([cx + dir.x * d, dir.y * d, cz + dir.z * d], [cx, 0, cz]);
  };
  const api = { scen };
  const impl = { balance: Balance, limiting: Limiting, precip: Precip, atomecon: AtomEcon }[scen](V, pack, ctl, P, ctx, fit, rich);
  return {
    viewer: V,
    state: () => impl.state(),
    act: (name, ...a) => (impl[name] ? impl[name](...a) : null),
    dispose() { impl.stop && impl.stop(); V.dispose(); pack.dispose(); ctl.remove(); release(); }
  };
}
const emitter = (ctx, impl) => () => { if (ctx.onState) ctx.onState(impl.state()); };

/* lay copies of a template in a small grid (x across, z up), centred on cx */
function grid(t, n, cx, maxCols) {
  const cols = Math.min(maxCols || 3, Math.max(1, Math.ceil(Math.sqrt(n)))); const rows = Math.ceil(n / cols);
  const sx = 2 * t.R + 0.35, sz = 2 * Math.min(t.R, 0.9) + 0.45; const out = [];
  for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); const inRow = Math.min(cols, n - r * cols); out.push(new THREE.Vector3(cx + (c - (inRow - 1) / 2) * sx, 0, ((rows - 1) / 2 - r) * sz)); }
  return { pos: out, W: cols * sx, H: rows * sz };
}
const tiltQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.32, 0, -0.12));

/* ================= balance ================= */
function Balance(V, pack, ctl, P, ctx, fit, rich) {
  const key = RX[P.reaction] ? P.reaction : "h2-o2"; const R = RX[key];
  const sp = [...R.r.map(([f, c]) => ({ f, ok: c, side: 0 })), ...R.p.map(([f, c]) => ({ f, ok: c, side: 1 }))];
  sp.forEach((s) => { s.c = P.unbalanced ? 1 : s.ok; s.t = template(s.f); s.n = countAtoms(s.f); });
  const els = [...new Set(sp.flatMap((s) => Object.keys(s.n)))];
  let labels = [], arrowObj = null; const amat = surfaceMaterial(V.pal.axis, { roughness: 0.5 });
  const self = { state };
  const emit = emitter(ctx, self);
  function layout(refit) {
    labels.forEach((l) => l.remove()); labels = [];
    const groups = sp.map((s) => ({ s, g: grid(s.t, s.c, 0, s.t.R > 1.2 ? 2 : 3) }));
    const gap = 1.1, arrowW = 2.2; let x = 0; const items = []; let H = 0;
    const xs = [];
    groups.forEach((G, i) => { if (i > 0) x += sp[i].side !== sp[i - 1].side ? arrowW : gap; xs.push(x + G.g.W / 2); x += G.g.W; H = Math.max(H, G.g.H); });
    const W = x; const off = -W / 2;
    groups.forEach((G, i) => {
      const cx = xs[i] + off; G.g.pos.forEach((p) => items.push({ t: G.s.t, pos: p.add(new THREE.Vector3(cx, 0, 0)), q: tiltQ, s: 1 }));
      labels.push(V.label(`<b>${G.s.c}</b> ${rich(ce(G.s.f))}`, new THREE.Vector3(cx, 0, -H / 2 - 0.55), "ptlab"));
      if (i > 0 && sp[i].side === sp[i - 1].side) labels.push(V.label("+", new THREE.Vector3(xs[i] + off - groups[i].g.W / 2 - gap / 2, 0, 0), "ptop"));
    });
    const iA = sp.findIndex((s) => s.side === 1); const ax = xs[iA] + off - groups[iA].g.W / 2 - arrowW / 2;
    if (arrowObj) { V.scene.remove(arrowObj); arrowObj.traverse((o) => o.geometry && o.geometry.dispose()); }
    arrowObj = arrow(new THREE.Vector3(ax - 0.7, 0, 0), new THREE.Vector3(ax + 0.7, 0, 0), 0.05, amat, 3.2); V.scene.add(arrowObj);
    pack.draw(items);
    if (refit) fit(W + 0.6, H + 1.6, 0, -0.3);
  }
  /* controls */
  const eq = el("div", { class: "pt-eq", role: "group", "aria-label": "Coefficients" }); ctl.append(eq);
  sp.forEach((s, i) => {
    if (i > 0) eq.append(el("span", { class: "op", "aria-hidden": "true" }, sp[i].side !== sp[i - 1].side ? "→" : "+"));
    const out = el("output", { "aria-live": "polite" }, String(s.c));
    const m = el("button", { type: "button", class: "sbtn", "aria-label": `Fewer ${s.f}` }, "−"), p = el("button", { type: "button", class: "sbtn", "aria-label": `More ${s.f}` }, "+");
    m.onclick = () => setC(i, s.c - 1); p.onclick = () => setC(i, s.c + 1);
    s.out = out; eq.append(el("span", { class: "pt-sp" }, m, out, p, el("span", { html: rich(ce(s.f)) })));
  });
  const reset = el("button", { type: "button", class: "chip" }, "All back to 1"); reset.onclick = () => { sp.forEach((s, i) => setC(i, 1, true)); layout(true); refresh(); emit(); };
  eq.append(reset);
  const tab = el("table", { class: "pt-tab", "aria-label": "Atom tally" }); ctl.append(tab);
  const msg = el("div", { class: "pt-msg", "aria-live": "polite" }); ctl.append(msg);
  if (R.notes) ctl.append(el("div", { class: "small muted" }, `This reaction appears in the notes as ${R.notes}.`));
  function setC(i, c, quiet) { c = Math.max(1, Math.min(12, c)); sp[i].c = c; sp[i].out.textContent = c; if (quiet) return; layout(true); refresh(); emit(); }
  function tally() { const L = {}, Rr = {}; els.forEach((e) => { L[e] = 0; Rr[e] = 0; }); sp.forEach((s) => { for (const e in s.n) (s.side ? Rr : L)[e] += s.c * s.n[e]; }); return { L, R: Rr }; }
  function refresh() {
    const { L, R: Rr } = tally(); const ok = els.every((e) => L[e] === Rr[e]); const g = sp.reduce((a, s) => gcd(a, s.c), 0);
    tab.innerHTML = `<tr><th>Atom</th><th>Reactants</th><th>Products</th><th>Same?</th></tr>` + els.map((e) => `<tr><td><b>${e}</b></td><td>${L[e]}</td><td>${Rr[e]}</td><td class="${L[e] === Rr[e] ? "ok" : "no"}">${L[e] === Rr[e] ? "✓ yes" : "✗ no"}</td></tr>`).join("");
    const eqTex = sp.map((s, i) => (i > 0 ? (sp[i].side !== sp[i - 1].side ? " -> " : " + ") : "") + (s.c > 1 ? s.c + " " : "") + s.f).join("");
    if (ok && g === 1) { msg.className = "pt-msg ok"; msg.innerHTML = rich(`Balanced with the smallest whole numbers: ${ce(eqTex)}. Every atom on the left is on the right, so mass is conserved.`); }
    else if (ok) { msg.className = "pt-msg warn"; msg.innerHTML = rich(`Balanced, but every coefficient can be divided by ${g}. Use the smallest whole numbers.`); }
    else { const bad = els.filter((e) => L[e] !== Rr[e]); msg.className = "pt-msg"; msg.innerHTML = rich(`Not balanced yet: ${bad.map((e) => `${e} has ${L[e]} on the left and ${Rr[e]} on the right`).join("; ")}.`); }
  }
  function state() { const { L, R: Rr } = tally(); const ok = els.every((e) => L[e] === Rr[e]); return { scenario: "balance", reaction: key, coefficients: sp.map((s) => s.c), balanced: ok, smallest: ok && sp.reduce((a, s) => gcd(a, s.c), 0) === 1, left: L, right: Rr }; }
  V.theme((p) => { amat.color.set(p.axis); pack.bondMat.color.set(p.dark ? "#9aa8a4" : "#8e9a96"); }, false);
  layout(true); refresh();
  self.setC = (i, c) => { setC(i, c); return state(); };
  return self;
}

/* ================= limiting reagent ================= */
function Limiting(V, pack, ctl, P, ctx, fit, rich) {
  const key = RX[P.reaction] ? P.reaction : "h2-o2"; const R = RX[key];
  const [[fA, cA], [fB, cB]] = R.r; const prods = R.p;
  const a0 = Math.max(1, Math.min(24, P.a ?? R.ab[0])), b0 = Math.max(1, Math.min(24, P.b ?? R.ab[1]));
  const tA = template(fA), tB = template(fB);
  const self = { state }; const emit = emitter(ctx, self);
  let parts = [], made = {}, sets = 0, busy = false, stopAnim = null;
  const boxMat = new THREE.LineBasicMaterial({ color: V.pal.axis, transparent: true, opacity: 0.7 }); let box = null;
  const maxR = Math.max(tA.R, tB.R, ...prods.map(([f]) => template(f).R));
  const cell = 1.7 * Math.min(maxR, 1.6) + 0.45;
  function setup() {
    const N = a0 + b0; const nx = Math.ceil(Math.sqrt(N * 1.6)), nz = Math.ceil(N / nx);
    const W = nx * cell, H = nz * cell, D = cell * 1.2;
    const r = rng(17 + a0 * 31 + b0); const cells = [];
    for (let i = 0; i < nx * nz; i++) cells.push(i);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
    parts = [];
    for (let k = 0; k < N; k++) {
      const c = cells[k]; const ix = c % nx, iz = Math.floor(c / nx);
      const pos = new THREE.Vector3(-W / 2 + (ix + 0.5) * cell + (r() - 0.5) * cell * 0.3, (r() - 0.5) * D * 0.4, -H / 2 + (iz + 0.5) * cell + (r() - 0.5) * cell * 0.3);
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler((r() - 0.5) * 1.6, (r() - 0.5) * 1.2, r() * 6.28));
      parts.push({ f: k < a0 ? fA : fB, t: k < a0 ? tA : tB, pos, q, s: 1 });
    }
    made = {}; prods.forEach(([f]) => (made[f] = 0)); sets = 0;
    if (box) { V.scene.remove(box); box.geometry.dispose(); }
    box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W + 0.4, D + 0.6, H + 0.4)), boxMat); V.scene.add(box);
    pack.draw(parts); fit(W + 2.4, H + 2.4, 0, -0.2, 0.3); refresh();
  }
  const left = (f) => parts.filter((p) => p.f === f && !p.gone).length;
  const canReact = () => left(fA) >= cA && left(fB) >= cB;
  function planSet() {
    const As = parts.filter((p) => p.f === fA && !p.gone && !p.busy), Bs = parts.filter((p) => p.f === fB && !p.gone && !p.busy);
    if (As.length < cA || Bs.length < cB) return null;
    const seed = As[0]; const near = (arr, n, c) => arr.slice().sort((x, y) => x.pos.distanceToSquared(c) - y.pos.distanceToSquared(c)).slice(0, n);
    const useA = near(As, cA, seed.pos); const cen = useA.reduce((v, p) => v.add(p.pos), new THREE.Vector3()).multiplyScalar(1 / cA);
    const useB = near(Bs, cB, cen); const all = useA.concat(useB); all.forEach((p) => (p.busy = true));
    const c2 = all.reduce((v, p) => v.add(p.pos), new THREE.Vector3()).multiplyScalar(1 / all.length);
    /* products take the places the reactant molecules had (no overlaps); any extra ones sit near the middle of the set */
    const out = []; let k = 0; const slots = all.map((p) => p.pos.clone());
    prods.forEach(([f, n]) => { for (let i = 0; i < n; i++) { const pos = k < slots.length ? slots[k] : c2.clone().add(new THREE.Vector3(0.5 * (k - slots.length), -0.6, 0.3)); out.push({ f, t: template(f), pos, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0.2 * k, 0.9 * k)), s: 0, prod: true }); k++; } });
    return { use: all, start: all.map((p) => p.pos.clone()), cen: c2, out };
  }
  function run(n) {
    if (busy) return; const plans = []; for (let i = 0; i < n; i++) { const p = planSet(); if (!p) break; plans.push(p); }
    if (!plans.length) { refresh(true); return; }
    plans.forEach((p) => parts.push(...p.out));
    const finish = () => { plans.forEach((p) => { p.use.forEach((q) => { q.gone = true; q.busy = false; q.s = 0; }); p.out.forEach((o) => { o.s = 1; made[o.f]++; }); }); sets += plans.length; busy = false; pack.draw(parts); refresh(); emit(); };
    if (window.C120.reduceMotion()) return finish();
    busy = true; let t = 0;
    stopAnim = V.animate((dt) => {
      t = Math.min(1, t + dt / 0.9); const m = Math.min(1, t / 0.6), e = m * m * (3 - 2 * m), g = Math.max(0, (t - 0.55) / 0.45);
      plans.forEach((p) => { p.use.forEach((q, i) => { q.pos.lerpVectors(p.start[i], p.cen, e * 0.85); q.s = 1 - Math.max(0, (t - 0.45) / 0.3); }); p.out.forEach((o) => (o.s = Math.min(1, g * g * (3 - 2 * g)))); });
      pack.draw(parts);
      if (t >= 1) { finish(); return false; } return true;
    });
  }
  /* controls */
  const row = el("div", { class: "row" }); ctl.append(row);
  const b1 = el("button", { type: "button", class: "btn sm" }, "React one set"); b1.onclick = () => run(1);
  const b2 = el("button", { type: "button", class: "btn sm ghost" }, "React all"); b2.onclick = () => run(99);
  const b3 = el("button", { type: "button", class: "chip" }, "Start again"); b3.onclick = () => { if (busy) return; setup(); emit(); };
  row.append(b1, b2, b3);
  const eqLine = el("div", { class: "pt-read" }); ctl.append(eqLine);
  const sw = (f) => { const t = template(f); const els = [...new Set(t.atoms.map((A) => A.el))]; return `<span>${els.map((e) => `<i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${elem(e).c};margin-right:2px;vertical-align:-1px;border:1px solid var(--rule)"></i>`).join("")} ${rich(ce(f))}</span>`; };
  ctl.append(el("div", { class: "pt-leg", html: [fA, fB, ...prods.map(([f]) => f)].map(sw).join("") }));
  const tab = el("table", { class: "pt-tab", "aria-label": "Particle counts" }); ctl.append(tab);
  const msg = el("div", { class: "pt-msg", "aria-live": "polite" }); ctl.append(msg);
  const eqTex = R.r.map(([f, c]) => (c > 1 ? c + " " : "") + f).join(" + ") + " -> " + prods.map(([f, c]) => (c > 1 ? c + " " : "") + f).join(" + ");
  eqLine.innerHTML = rich(`Balanced equation: ${ce(eqTex)}. One set = ${cA} ${ce(fA)} + ${cB} ${ce(fB)}.`);
  function refresh(tried) {
    const la = left(fA), lb = left(fB);
    tab.innerHTML = `<tr><th></th><th>At start</th><th>Now</th></tr><tr><td>${rich(ce(fA))}</td><td>${a0}</td><td>${la}</td></tr><tr><td>${rich(ce(fB))}</td><td>${b0}</td><td>${lb}</td></tr>` + prods.map(([f]) => `<tr><td>${rich(ce(f))}</td><td>0</td><td>${made[f]}</td></tr>`).join("");
    b1.disabled = b2.disabled = !canReact();
    /* the mole-ratio answer (each particle could stand for 1 mol) */
    const sA = a0 / cA, sB = b0 / cB; const lim = sA < sB ? fA : sB < sA ? fB : null;
    const ratio = `Needed ratio ${ce(fA)} : ${ce(fB)} = ${cA} : ${cB}; you have ${a0} : ${b0}${a0 % b0 && b0 % a0 ? ` (${(a0 / b0).toFixed(2)} : 1)` : ""}.`;
    if (canReact()) { msg.className = "pt-msg"; msg.innerHTML = rich(`${ratio} ${sets ? `${sets} set${sets > 1 ? "s" : ""} reacted so far.` : "Predict which reactant runs out first, then react."}`); return; }
    const exA = la, exB = lb; const done = lim ? (lim === fA ? exB : exA) : 0;
    const prodTxt = prods.map(([f]) => `${made[f]} ${ce(f)}`).join(" and ");
    const needB = (a0 * cB) / cA; const molTxt = `In moles (let each particle stand for 1 mol): ${a0} mol ${ce(fA)} needs ${+needB.toFixed(2)} mol ${ce(fB)}, and you have ${b0} mol. `;
    let t = `${ratio} ${molTxt}<b>${lim ? ce(lim) : "Neither"}</b> ${lim ? "is the limiting reagent: it runs out first" : "is in excess: both run out together (a stoichiometric mixture)"}. `;
    if (lim) t += `Excess left: <b>${lim === fA ? exB : exA} ${ce(lim === fA ? fB : fA)}</b>. `;
    t += `Product formed (theoretical yield): <b>${prodTxt}</b>.`;
    const leftLim = lim === fA ? exA : lim === fB ? exB : 0;
    if (leftLim) t += ` (${leftLim} ${ce(lim)} ${leftLim > 1 ? "are" : "is"} left but cannot make a whole set; with moles of particles all of it would react, making ${prods.map(([f, n]) => `${+((lim === fA ? a0 / cA : b0 / cB) * n).toFixed(2)} ${ce(f)}`).join(" and ")} per ${lim === fA ? a0 : b0} ${ce(lim)}.)`;
    msg.className = "pt-msg ok"; msg.innerHTML = rich(t);
    void done; void tried;
  }
  function state() { const sA = a0 / cA, sB = b0 / cB; return { scenario: "limiting", reaction: key, a: left(fA), b: left(fB), made: { ...made }, sets, finished: !canReact(), limiting: sA < sB ? fA : sB < sA ? fB : null }; }
  V.theme((p) => { boxMat.color.set(p.axis); pack.bondMat.color.set(p.dark ? "#9aa8a4" : "#8e9a96"); }, false);
  setup();
  self.react = (n) => { run(n || 1); return state(); };
  self.stop = () => { if (stopAnim) stopAnim(); };
  return self;
}

/* ================= precipitation ================= */
function Precip(V, pack, ctl, P, ctx, fit, rich) {
  const key = PRECIP[P.reaction] ? P.reaction : "AgNO3+NaCl"; const Rx = PRECIP[key];
  const self = { state }; const emit = emitter(ctx, self);
  const glass = new THREE.MeshStandardMaterial({ color: "#9fbecb", transparent: true, opacity: 0.1, roughness: 0.2, side: THREE.DoubleSide, depthWrite: false });
  const water = new THREE.MeshStandardMaterial({ color: "#7fb3d5", transparent: true, opacity: 0.13, roughness: 0.3, depthWrite: false });
  const rimMat = new THREE.LineBasicMaterial({ color: V.pal.axis });
  const RB = 1.3, HB = 2.7, HW = 2.1;
  function beaker() {
    const g = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(RB, RB, HB, 40, 1, true), glass); wall.rotation.x = Math.PI / 2; wall.position.z = HB / 2;
    const bot = new THREE.Mesh(new THREE.CircleGeometry(RB, 40), glass);
    const wat = new THREE.Mesh(new THREE.CylinderGeometry(RB * 0.97, RB * 0.97, HW, 40), water); wat.rotation.x = Math.PI / 2; wat.position.z = HW / 2;
    const ring = (z) => { const pts = []; for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * RB, Math.sin(a) * RB, z)); } return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rimMat); };
    g.add(wall, bot, wat, ring(HB), ring(0)); g.userData.water = wat; return g;
  }
  const X1 = -1.75, X2 = 1.75; const bk1 = beaker(), bk2 = beaker(); bk1.position.x = X1; bk2.position.x = X2; V.scene.add(bk1, bk2);
  let ions = [], labs = [], tags = [], mixed = false, busy = false, stopAnim = null;
  const r = rng(5);
  const spot = (cx, rad, used, zmin = 0.4) => { for (let k = 0; k < 120; k++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (rad - 0.35); const p = new THREE.Vector3(cx + Math.cos(a) * d, Math.sin(a) * d * 0.7, zmin + r() * (HW - 0.35 - zmin)); if (used.every((q) => q.distanceTo(p) > 0.7)) { used.push(p); return p; } } const p = new THREE.Vector3(cx + (r() - 0.5) * rad, (r() - 0.5) * 0.4, 0.4 + r() * (HW - 0.7)); used.push(p); return p; };
  /* which ions precipitate: test the two new pairs with the solubility rules */
  const catA = Rx.A[1][0][0], anA = Rx.A[1][1][0], catB = Rx.B[1][0][0], anB = Rx.B[1][1][0];
  const s1 = solubility(catA, anB), s2 = solubility(catB, anA);
  const pptIons = !s1.sol ? [catA, anB] : !s2.sol ? [catB, anA] : [];
  function setup() {
    ions.forEach(() => {}); labs.forEach((l) => l.remove()); tags.forEach((l) => l.remove()); labs = []; tags = []; ions = [];
    const used1 = [], used2 = [];
    const add = (spec, which, cx, used) => { for (let u = 0; u < spec[2]; u++) spec[1].forEach(([ion, n]) => { for (let k = 0; k < n; k++) { const I = IONS[ion]; const p = spot(cx, RB, used); ions.push({ ion, which, t: { atoms: [{ el: ion, p: new THREE.Vector3(), r: I.r * 0.82, c: I.c }], lines: [], R: I.r }, pos: p, home: p.clone(), s: 1 }); } }); };
    add(Rx.A, 1, X1, used1); add(Rx.B, 2, X2, used2);
    ions.forEach((o) => { o.lab = V.label(IONS[o.ion].html, o.pos.clone().add(new THREE.Vector3(0, -0.05, IONS[o.ion].r + 0.2)), "ion"); labs.push(o.lab); });
    tags.push(V.label(`Beaker 1: ${rich(ce(Rx.A[0] + "(aq)"))}`, new THREE.Vector3(X1, 0, -0.45), "ptlab"), V.label(`Beaker 2: ${rich(ce(Rx.B[0] + "(aq)"))}`, new THREE.Vector3(X2, 0, -0.45), "ptlab"));
    bk1.position.set(X1, 0, 0); bk1.scale.set(1, 1, 1); bk2.position.set(X2, 0, 0); bk2.rotation.set(0, 0, 0); bk2.visible = true;
    mixed = false; pack.draw(ions); fit(X2 - X1 + 2 * RB + 0.6, HB + 2.2, 0, HB / 2 + 0.2, 0.32); refresh();
  }
  function plan() {
    /* final spots in the wider mixed beaker; the precipitate packs into a small rock-salt-like block on the bottom */
    const RM = RB * 1.32, used = []; const pIons = ions.filter((o) => pptIons.includes(o.ion)); const cats = pIons.filter((o) => IONS[o.ion].q > 0), ans = pIons.filter((o) => IONS[o.ion].q < 0);
    const n = pIons.length; const dims = n === 8 ? [2, 2, 2] : n === 6 ? [3, 2, 1] : [Math.ceil(n / 2), 2, 1];
    const d = cats.length ? IONS[cats[0].ion].r + IONS[ans[0].ion].r : 0.6; const sites = [];
    for (let k = 0; k < dims[2]; k++) for (let j = 0; j < dims[1]; j++) for (let i = 0; i < dims[0]; i++) sites.push({ p: new THREE.Vector3((i - (dims[0] - 1) / 2) * d, (j - (dims[1] - 1) / 2) * d, 0.05 + IONS[(ans[0] || cats[0] || { ion: "Cl-" }).ion].r + k * d), even: (i + j + k) % 2 === 0 });
    const ev = sites.filter((s) => s.even), od = sites.filter((s) => !s.even);
    const cSites = ev.slice(0, cats.length), aSites = ev.slice(cats.length).concat(od).slice(0, ans.length);
    cats.forEach((o, i) => { o.target = cSites[i].p.clone(); o.ppt = true; used.push(o.target); }); ans.forEach((o, i) => { o.target = aSites[i].p.clone(); o.ppt = true; used.push(o.target); });
    const zTop = pIons.length ? Math.max(...pIons.map((o) => o.target.z)) + 0.75 : 0.4;
    ions.forEach((o) => { o.start = o.pos.clone(); if (!o.ppt) o.target = spot(0, RM, used, Math.min(zTop, 1.2)); o.mid = o.target.clone(); });
  }
  function mix() {
    if (mixed || busy) return; plan(); tags.forEach((l) => l.remove()); tags = [];
    const end = () => { ions.forEach((o) => o.pos.copy(o.target)); bk1.position.set(0, 0, 0); bk1.scale.set(1.32, 1.32, 1); bk2.visible = false; mixed = true; busy = false; pack.draw(ions); syncLabels(); refresh(); emit(); };
    if (window.C120.reduceMotion()) return end();
    busy = true; let t = 0; const ctrl = new THREE.Vector3(0.4, 0, HB + 1.1); const tmp = new THREE.Vector3();
    stopAnim = V.animate((dt) => {
      t = Math.min(1, t + dt / 2.6);
      const a = Math.min(1, t / 0.6), ea = a * a * (3 - 2 * a), b = Math.max(0, (t - 0.62) / 0.38), eb = b * b * (3 - 2 * b);
      bk1.position.x = X1 * (1 - ea); const sc = 1 + 0.32 * ea; bk1.scale.set(sc, sc, 1);
      const up = Math.sin(Math.min(1, a * 1.15) * Math.PI); bk2.position.set(X2 + 0.65 * up, 0, 2.35 * up); bk2.rotation.y = -1.25 * up; bk2.visible = a < 0.98;
      ions.forEach((o) => {
        const pourT = o.which === 2 ? Math.max(0, Math.min(1, (a - 0.3) / 0.6)) : ea;
        const settle = o.ppt ? eb : 0;
        if (o.which === 2) { const u = pourT; tmp.copy(o.start).multiplyScalar((1 - u) * (1 - u)).addScaledVector(ctrl, 2 * u * (1 - u)).addScaledVector(o.ppt ? o.mid : o.target, u * u); o.pos.copy(tmp); }
        else o.pos.lerpVectors(o.start, o.ppt ? o.mid : o.target, pourT);
        if (o.ppt && a >= 1) o.pos.lerpVectors(o.midP || (o.midP = o.pos.clone()), o.target, settle);
      });
      pack.draw(ions); syncLabels();
      if (t >= 1) { end(); return false; } return true;
    });
    /* before settling, precipitating ions first spread through the mixed solution like the others */
    const used = []; ions.forEach((o) => { if (o.ppt) { o.mid = spot(0, RB * 1.32, used); o.midP = null; } else used.push(o.target); });
  }
  function syncLabels() { ions.forEach((o) => { o.lab.pos.copy(o.pos); o.lab.pos.z += IONS[o.ion].r + 0.2; o.lab.visible = !(mixed && o.ppt); }); V.requestRender(); }
  /* controls */
  const row = el("div", { class: "row" }); ctl.append(row);
  const bm = el("button", { type: "button", class: "btn sm" }, "Mix"); bm.onclick = () => mix();
  const br = el("button", { type: "button", class: "chip" }, "Start again"); br.onclick = () => { if (busy) return; setup(); emit(); };
  row.append(bm, br);
  const leg = el("div", { class: "pt-leg" }); ctl.append(leg);
  const read = el("div", { class: "pt-read", "aria-live": "polite" }); ctl.append(read);
  const uniq = [...new Set(ions.length ? ions.map((o) => o.ion) : [...Rx.A[1], ...Rx.B[1]].map((x) => x[0]))];
  leg.innerHTML = uniq.map((i) => `<span><i style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${IONS[i].c};margin-right:5px;vertical-align:-1px;border:1px solid var(--rule)"></i>${IONS[i].html}</span>`).join("") + `<span class="muted">water is implied</span>`;
  function refresh() {
    bm.disabled = mixed;
    if (!mixed) { read.innerHTML = rich(`Each beaker holds a dissolved ionic compound, so its ions move separately: ${ce(Rx.A[0] + "(aq)")} gives ${Rx.A[1].map(([i]) => ce(IONS[i].tex)).join(" and ")}; ${ce(Rx.B[0] + "(aq)")} gives ${Rx.B[1].map(([i]) => ce(IONS[i].tex)).join(" and ")}. Predict: when you mix them, do any new cation–anion pair break the solubility rules (p. 7)?`); return; }
    const pair = (c, a, s) => `${ce(IONS[c].tex)} with ${ce(IONS[a].tex)}: ${s.sol ? "soluble" : "<b>insoluble</b>"} (rule ${s.rule}: ${s.why})`;
    const spect = uniq.filter((i) => !pptIons.includes(i));
    let t = `New pairs: ${pair(catA, anB, s1)}; ${pair(catB, anA, s2)}.<br>`;
    t += `Molecular: ${ce(Rx.mol)}<br>Full ionic: ${ce(Rx.full)}<br>`;
    if (Rx.net) t += `Spectator ions: ${spect.map((i) => ce(IONS[i].tex)).join(", ")} (they are on both sides and do nothing).<br>Net ionic: <b>${ce(Rx.net)}</b>`;
    else t += `<b>No precipitate.</b> Every combination is soluble, so all four ions stay dissolved: every ion is a spectator and there is no net ionic equation.`;
    read.innerHTML = rich(t);
    if (Rx.solid) tags.push(V.label(`${rich(ce(Rx.solid + "(s)"))} precipitate`, new THREE.Vector3(0, 0, -0.45), "ptlab"));
    else tags.push(V.label("no precipitate: all ions stay dissolved", new THREE.Vector3(0, 0, -0.45), "ptlab"));
  }
  function state() { return { scenario: "precip", reaction: key, mixed, precipitate: Rx.solid, spectators: [...new Set(ions.map((o) => o.ion))].filter((i) => !pptIons.includes(i)), clustered: ions.filter((o) => o.ppt).length }; }
  V.theme((p) => { rimMat.color.set(p.axis); }, false);
  setup();
  self.mix = () => { mix(); return state(); };
  self.stop = () => { if (stopAnim) stopAnim(); };
  return self;
}

/* ================= atom economy ================= */
function AtomEcon(V, pack, ctl, P, ctx, fit, rich) {
  const key = AE[P.reaction] ? P.reaction : "methane-chlorine"; const Rx = AE[key];
  const self = { state }; const emit = emitter(ctx, self);
  let labs = [], arrowObj = null; const amat = surfaceMaterial(V.pal.axis, { roughness: 0.5 });
  const C = window.C120.chem;
  let tint = { p: V.pal.accent, w: V.pal.dark ? "#8a8f8c" : "#9a9d98" };
  const st = { products: true };
  function layout() {
    labs.forEach((l) => l.remove()); labs = [];
    const groups = []; Rx.r.forEach(([f, n, waste]) => groups.push({ f, n, side: 0, waste })); if (st.products) Rx.p.forEach(([f, n, des]) => groups.push({ f, n, side: 1, des }));
    groups.forEach((G) => { G.t = template(G.f); G.g = grid(G.t, G.n, 0, 3); });
    const gap = 1.0, aw = 2.2; let x = 0; const xs = []; let H = 0;
    groups.forEach((G, i) => { if (i > 0) x += G.side !== groups[i - 1].side ? aw : gap; xs.push(x + G.g.W / 2); x += G.g.W; H = Math.max(H, G.g.H); });
    const off = -x / 2; const items = [];
    groups.forEach((G, i) => {
      const cx = xs[i] + off;
      G.g.pos.forEach((p, k) => {
        const isW = (a) => (G.side ? !G.des : (G.waste || []).includes(a));
        const colors = G.t.atoms.map((A, a) => (isW(a) ? tint.w : tint.p)); const hatch = G.t.atoms.map((A, a) => isW(a));
        const pos = p.add(new THREE.Vector3(cx, 0, 0)); items.push({ t: G.t, pos, q: tiltQ, s: 1, colors, hatch });
        G.t.atoms.forEach((A, a) => labs.push(V.label(A.el, A.p.clone().applyQuaternion(tiltQ).add(pos).add(new THREE.Vector3(0, -A.r - 0.05, 0)), isW(a) ? "ae-w" : "ae-p")));
      });
      labs.push(V.label(`${G.n > 1 ? `<b>${G.n}</b> ` : ""}${rich(ce(G.f))}${G.side ? (G.des ? " (desired)" : " (waste)") : ""}`, new THREE.Vector3(cx, 0, -H / 2 - 0.6), "ptlab"));
      if (i > 0 && G.side === groups[i - 1].side) labs.push(V.label("+", new THREE.Vector3(xs[i] + off - G.g.W / 2 - gap / 2, 0, 0), "ptop"));
    });
    if (arrowObj) { V.scene.remove(arrowObj); arrowObj.traverse((o) => o.geometry && o.geometry.dispose()); arrowObj = null; }
    const iA = groups.findIndex((G) => G.side === 1);
    if (iA > 0) { const ax = xs[iA] + off - groups[iA].g.W / 2 - aw / 2; arrowObj = arrow(new THREE.Vector3(ax - 0.7, 0, 0), new THREE.Vector3(ax + 0.7, 0, 0), 0.05, amat, 3.2); V.scene.add(arrowObj); }
    pack.draw(items); fit(x + 0.6, H + 1.8, 0, -0.3);
  }
  /* numbers */
  const mR = Rx.r.map(([f, n]) => ({ f, n, m: C.mm(f) })); const des = Rx.p.find((p) => p[2]); const mD = { f: des[0], n: des[1], m: C.mm(des[0]) };
  const tot = mR.reduce((t, x) => t + x.n * x.m, 0); const ae = (100 * mD.n * mD.m) / tot;
  const waste = Rx.p.filter((p) => !p[2]).map(([f, n]) => ({ f, n, m: C.mm(f) }));
  /* controls */
  const row = el("div", { class: "row" }); ctl.append(row);
  const tb = el("button", { type: "button", class: "chip", "aria-pressed": "true" }, "Show products"); tb.onclick = () => { st.products = !st.products; tb.setAttribute("aria-pressed", String(st.products)); layout(); emit(); };
  row.append(el("b", { class: "small" }, Rx.label), tb);
  ctl.append(el("div", { class: "pt-leg", html: `<span><span class="k p">C</span>atom ends up in the desired product (circle, solid)</span><span><span class="k w">H</span>atom ends up in waste (square, hatched)</span>` }));
  const read = el("div", { class: "pt-read" }); ctl.append(read);
  const f2 = (v) => v.toFixed(2);
  const sum = mR.map((x) => `${x.n > 1 ? x.n + "(" + f2(x.m) + ")" : f2(x.m)}`).join(" + ");
  let t = `$\\%\\,\\text{AE} = \\dfrac{\\text{mass of desired product}}{\\text{mass of reactants}} \\times 100 = \\dfrac{${mD.n > 1 ? mD.n + "(" + f2(mD.m) + ")" : f2(mD.m)}}{${sum}} \\times 100 = ${ae.toFixed(1)}\\%$`;
  t += `<br><span class="small">Molar masses from the data sheet (g/mol). Atom economy uses the balanced equation only, so it ignores yield, excess reagents and solvents (p. 28).</span><br>`;
  if (!waste.length) t += `E-factor idea: no by-product is formed, so at 100% yield there is no waste from the reaction itself (E-factor = 0). Real processes still make waste from solvents and unreacted material.`;
  else if (waste.every((w) => w.f === "H2O")) t += `E-factor idea: the only by-product is water. The notes leave the mass of water out of the waste (p. 28), so the E-factor from the reaction itself would be 0 even though the atom economy is only ${ae.toFixed(1)}%. Example 1-21 asks exactly this question; check the expected answer with your instructor.`;
  else { const wm = waste.reduce((s, w) => s + w.n * w.m, 0); t += `E-factor idea: ${waste.map((w) => ce(w.f)).join(", ")} is waste, so the E-factor is above 0. At 100% yield it would be ${f2(wm)} g of waste per ${f2(mD.n * mD.m)} g of product = ${(wm / (mD.n * mD.m)).toFixed(2)} (mass of waste ÷ mass of product, p. 28; water would not count).`; }
  read.innerHTML = rich(t);
  function state() { return { scenario: "atomecon", reaction: key, atomEconomy: +ae.toFixed(2), desired: mD.f, waste: waste.map((w) => w.f), products: st.products }; }
  V.theme((p) => { amat.color.set(p.axis); tint = { p: p.accent, w: p.dark ? "#8a8f8c" : "#9a9d98" }; layout(); }, false);
  layout();
  return self;
}

/* ---------------- 2D fallbacks ---------------- */
function svgMol(t, cx, cy, S, colorsOf, marks) {
  let s = ""; const P = t.atoms.map((A) => [cx + A.p.x * S, cy - A.p.z * S]);
  t.lines.forEach((L) => { s += `<line x1="${cx + L.a.x * S}" y1="${cy - L.a.z * S}" x2="${cx + L.b.x * S}" y2="${cy - L.b.z * S}" style="stroke:var(--fig-axis);stroke-width:${L.r * S * 1.4}"/>`; });
  t.atoms.forEach((A, i) => { const c = colorsOf ? colorsOf(i) : A.c || elem(A.el).c; const m = marks && marks(i); s += `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="${A.r * S}" style="fill:${c};stroke:var(--fig-stroke);stroke-width:.8${m === "w" ? ";stroke-dasharray:2 1.5" : ""}"/>`; if (m) s += m === "w" ? `<rect x="${P[i][0] - 5}" y="${P[i][1] - 5}" width="10" height="10" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.2"/>` : `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="5" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.2"/>`; });
  return s;
}
export function fallback(host, P = {}) {
  const release = useStyle(); const rich = window.C120.rich; const scen = P.scenario || "balance";
  const w = document.createElement("div"); w.className = "v3d-fallback"; let svg = "", txt = "";
  const W = 520, S = 26;
  if (scen === "precip") {
    const Rx = PRECIP[P.reaction] || PRECIP["AgNO3+NaCl"]; const H = 190;
    svg = `<svg viewBox="0 0 ${W} ${H}" class="fig pt-fb" role="img" aria-label="Two beakers of ions before and after mixing">`;
    const beak = (x, list) => { let s = `<path d="M${x - 60} 30V160H${x + 60}V30" style="fill:var(--fig-soft);stroke:var(--fig-stroke);stroke-width:1.5"/>`; list.forEach((ion, i) => { const I = IONS[ion]; const cx = x - 40 + (i % 4) * 27, cy = 60 + Math.floor(i / 4) * 32; s += `<circle cx="${cx}" cy="${cy}" r="${I.r * 34}" style="fill:${I.c};stroke:var(--fig-stroke);stroke-width:.8"/><text x="${cx}" y="${cy + I.r * 34 + 10}" text-anchor="middle" style="font-size:9px">${ion.replace(/(\d?)([+-])$/, (m, n, s) => (n || "") + (s === "+" ? "+" : "−"))}</text>`; }); return s; };
    const list = (spec) => spec[1].flatMap(([i, n]) => Array(n).fill(i)).concat(spec[1].flatMap(([i, n]) => Array(n).fill(i))).slice(0, 8);
    svg += beak(110, list(Rx.A)) + beak(410, list(Rx.B)) + `<text x="110" y="180" text-anchor="middle">${Rx.A[0]}(aq)</text><text x="410" y="180" text-anchor="middle">${Rx.B[0]}(aq)</text><path d="M200 95H320" style="stroke:var(--fig-stroke);stroke-width:1.5"/><path d="M312 90L321 95L312 100" style="fill:none;stroke:var(--fig-stroke);stroke-width:1.5"/><text x="260" y="85" text-anchor="middle">mix</text></svg>`;
    txt = Rx.net ? `On mixing, ${rich(`$\\ce{${Rx.solid}}$`)} precipitates. Net ionic equation: ${rich(`$\\ce{${Rx.net}}$`)}; the other ions are spectators.` : `On mixing, every combination is soluble (rules 1 and 3), so nothing precipitates and every ion is a spectator.`;
  } else if (scen === "atomecon") {
    const Rx = AE[P.reaction] || AE["methane-chlorine"]; const H = 150; let x = 30;
    svg = `<svg viewBox="0 0 ${W} ${H}" class="fig pt-fb" role="img" aria-label="Reactant atoms marked by where they end up">`;
    Rx.r.forEach(([f, n, waste]) => { const t = template(f); for (let k = 0; k < Math.min(n, 3); k++) { const cx = x + t.R * S; svg += svgMol(t, cx, 70, S, (i) => (waste.includes(i) ? "#9a9d98" : "var(--c,var(--accent))"), (i) => (waste.includes(i) ? "w" : "p")); x += 2 * t.R * S + 14; } svg += `<text x="${x - t.R * S - 7}" y="130" text-anchor="middle">${n > 1 ? n + " " : ""}${f}</text>`; x += 10; });
    svg += `<text x="${x}" y="74">→ ${Rx.desired} (circles) + waste (squares)</text></svg>`;
    txt = `Circled atoms end up in the desired product; atoms in squares end up as waste.`;
  } else {
    const R = RX[P.reaction] || RX["h2-o2"]; const H = 160; let x = 20;
    svg = `<svg viewBox="0 0 ${W} ${H}" class="fig pt-fb" role="img" aria-label="Molecules in the balanced equation">`;
    const sides = [R.r, R.p];
    sides.forEach((side, si) => { side.forEach(([f, c], j) => { const t = template(f); const n = scen === "limiting" ? (si ? 0 : (P[j ? "b" : "a"] ?? R.ab[j])) : c; const show = Math.min(n, 4); for (let k = 0; k < show; k++) { const cx = x + t.R * S * 0.8, cy = 50 + (k % 2) * 46; svg += svgMol(t, cx, cy, S * 0.8, null, null); if (k % 2 === 1 || k === show - 1) x += 2 * t.R * S * 0.8 + 8; } svg += `<text x="${x - 20}" y="148" text-anchor="middle">${n}${f}</text>`; x += 14; }); if (!si && scen !== "limiting") { svg += `<text x="${x}" y="78" style="font-size:16px">→</text>`; x += 28; } });
    svg += `</svg>`;
    const eq = R.r.map(([f, c]) => (c > 1 ? c : "") + f).join(" + ") + " -> " + R.p.map(([f, c]) => (c > 1 ? c : "") + f).join(" + ");
    txt = scen === "limiting" ? `Starting particles drawn (up to 4 of each). Balanced: ${rich(`$\\ce{${eq}}$`)}. Compare the ratio you have with the ratio in the equation to find the limiting reagent.` : `Balanced: ${rich(`$\\ce{${eq}}$`)}. Count each kind of atom on both sides: the numbers match.`;
  }
  w.innerHTML = `<div style="width:100%;overflow-x:auto">${svg}</div><p class="small muted">3D needs WebGL, which is off in this browser, so this is a flat drawing. ${txt}</p>`;
  host.append(w); return { dispose() { w.remove(); release(); } };
}
