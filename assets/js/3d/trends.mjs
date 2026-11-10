/* CHEM 120 Interactive: periodic trends as a 3D bar landscape (Module 3, pp. 10-16).
   Periods 1 to 6, groups 1 to 18 (main group and d block; La sits in group 3 as in the notes' table, the f block is left out).
   Properties:
     en  Pauling electronegativity, Module 3 p. 15 table (window.C120.chem.EN). Elements with no printed value: empty outlines.
     ea  electron affinity, Module 3 p. 14 table (window.C120.chem.EA). Bar height = energy released (-EA). Values printed as "> 0"
         (and N, +7) need energy instead: short hatched stubs. d block: not in the table, empty outlines.
     radius  metallic radius for metals, covalent radius for nonmetals (p. 16 footnote a). The notes print no table, so these are
         standard reference values (not from the notes). Noble gases and At: no value, empty outlines.
     ie  first ionization energy, NIST values rounded to kJ/mol (not from the notes, except Mg = 738, p. 11).
   params: {property:"radius"|"ie"|"ea"|"en", choices:[...], highlight:["Na","Cl"]} */
import { THREE, Viewer, surfaceMaterial, arrow, palette } from "./viewer.mjs";

export const BLOCK = { s: "#6d8fb8", p: "#5f9e72", d: "#c4903c" };
/* standard values, not from the notes */
const RADIUS = { H: 37, Li: 152, Be: 112, B: 88, C: 77, N: 70, O: 66, F: 64, Na: 186, Mg: 160, Al: 143, Si: 117, P: 110, S: 104, Cl: 99, K: 227, Ca: 197, Sc: 162, Ti: 147, V: 134, Cr: 128, Mn: 127, Fe: 126, Co: 125, Ni: 124, Cu: 128, Zn: 134, Ga: 135, Ge: 122, As: 121, Se: 117, Br: 114, Rb: 248, Sr: 215, Y: 180, Zr: 160, Nb: 146, Mo: 139, Tc: 136, Ru: 134, Rh: 134, Pd: 137, Ag: 144, Cd: 151, In: 167, Sn: 158, Sb: 141, Te: 137, I: 133, Cs: 265, Ba: 222, La: 187, Hf: 159, Ta: 146, W: 139, Re: 137, Os: 135, Ir: 136, Pt: 139, Au: 144, Hg: 151, Tl: 170, Pb: 175, Bi: 170, Po: 167 };
const IE1 = { H: 1312, He: 2372, Li: 520, Be: 900, B: 801, C: 1086, N: 1402, O: 1314, F: 1681, Ne: 2081, Na: 496, Mg: 738, Al: 578, Si: 787, P: 1012, S: 1000, Cl: 1251, Ar: 1521, K: 419, Ca: 590, Sc: 633, Ti: 659, V: 651, Cr: 653, Mn: 717, Fe: 763, Co: 760, Ni: 737, Cu: 746, Zn: 906, Ga: 579, Ge: 762, As: 947, Se: 941, Br: 1140, Kr: 1351, Rb: 403, Sr: 550, Y: 600, Zr: 640, Nb: 652, Mo: 684, Tc: 702, Ru: 710, Rh: 720, Pd: 804, Ag: 731, Cd: 868, In: 558, Sn: 709, Sb: 834, Te: 869, I: 1008, Xe: 1170, Cs: 376, Ba: 503, La: 538, Hf: 659, Ta: 761, W: 770, Re: 760, Os: 840, Ir: 880, Pt: 870, Au: 890, Hg: 1007, Tl: 589, Pb: 716, Bi: 703, Po: 812, At: 899, Rn: 1037 };
const PROPS = {
  radius: { name: "Atomic radius", unit: "pm", max: 270, step: 50, src: "standard value, not from the notes", what: "Bar height: atomic radius in pm (metallic radius for metals, covalent radius for nonmetals; standard values, not from the notes). Noble gases have no value of either kind, so they are outlines.",
    across: "radius decreases across a period (p. 10)", down: "radius increases down a group (p. 10)" },
  ie: { name: "First ionization energy", unit: "kJ/mol", max: 2400, step: 500, src: "standard value (NIST), not from the notes", what: "Bar height: first ionization energy, X(g) → X⁺(g) + e⁻, in kJ/mol (standard NIST values, not from the notes; only Mg = 738 is printed, p. 11).",
    across: "IE generally increases across a period, with dips at Mg → Al and P → S (pp. 11-13)", down: "IE decreases down a group (p. 11)" },
  ea: { name: "Electron affinity", unit: "kJ/mol", max: 360, step: 100, src: "Module 3, p. 14 table", what: "Bar height: energy released when X(g) + e⁻ → X⁻(g), i.e. −EA, in kJ/mol (Module 3, p. 14 table). Hatched stubs: EA printed as \"> 0\" (or N, +7): energy is needed. The notes give no d-block values (outlines).",
    across: "more energy released toward the right (EA more negative), except group 18 (p. 14)", down: "less energy released down a group (p. 16)" },
  en: { name: "Electronegativity", unit: "", max: 4.0, step: 1, src: "Module 3, p. 15 table (Pauling scale)", what: "Bar height: Pauling electronegativity (Module 3, p. 15 table). Outlines: no value printed in the notes (noble gases, Si, Ge, In, Sn, Sb, Tl, Pb, Bi, Ba and the whole d block).",
    across: "EN increases across a period (p. 15)", down: "EN decreases down a group (p. 15)" }
};
const HMAX = 3.2;
function elements() {
  const C = window.C120.chem; const out = [];
  for (let z = 1; z <= 86; z++) { if (z >= 58 && z <= 71) continue; const p = C.position(z); if (!p.group) continue; out.push({ z, sym: C.sym(z), name: C.NAME[C.sym(z)] || { La: "Lanthanum" }[C.sym(z)] || C.sym(z), period: p.period, group: p.group, block: p.block === "f" ? "d" : p.block }); }
  return out;
}
/* value for a property: {v (bar quantity), kind:"bar"|"stub"|"none", text, src} */
function valueOf(prop, E) {
  const C = window.C120.chem; const s = E.sym;
  if (prop === "radius") { const v = RADIUS[s]; return v == null ? { kind: "none", text: E.group === 18 ? "no covalent or metallic radius (noble gas)" : "no reliable value", src: "" } : { v, kind: "bar", text: `${v} pm (${E.block === "d" || ["Li", "Be", "Na", "Mg", "Al", "K", "Ca", "Ga", "Rb", "Sr", "In", "Sn", "Cs", "Ba", "Tl", "Pb", "Bi", "Po"].includes(s) ? "metallic" : "covalent"} radius)`, src: PROPS.radius.src }; }
  if (prop === "ie") { const v = IE1[s]; return v == null ? { kind: "none", text: "no value", src: "" } : { v, kind: "bar", text: `${v} kJ/mol`, src: s === "Mg" ? "Module 3, p. 11" : PROPS.ie.src }; }
  if (prop === "en") { const v = C.EN[s]; return v == null ? { kind: "none", text: "no value printed in the notes", src: "Module 3, p. 15 table" } : { v, kind: "bar", text: v.toFixed(1), src: PROPS.en.src }; }
  if (!(s in C.EA)) return { kind: "none", text: "not in the notes' table (main-group elements only)", src: "Module 3, p. 14" };
  const ea = C.EA[s];
  if (ea == null) return { kind: "stub", stub: "> 0", text: "printed as > 0: energy is needed to add an electron", src: PROPS.ea.src };
  if (ea > 0) return { kind: "stub", stub: "+" + ea, text: `+${ea} kJ/mol: energy is needed to add an electron`, src: PROPS.ea.src };
  return { v: -ea, kind: "bar", text: `EA = −${-ea} kJ/mol (${-ea} kJ/mol released)`, src: PROPS.ea.src };
}
const X = (g) => g - 9.5, Y = (p) => 3.5 - p;

const CSS = `.tr-wrap{container-type:inline-size}
.tr-wrap .v3l.tsym{font:600 .66rem var(--sans);color:var(--head);text-shadow:0 0 3px var(--paper),0 0 2px var(--paper)}
.tr-wrap .v3l.tsym.hl{font-size:.74rem;color:var(--c,var(--accent))}
.tr-wrap .v3l.tsym.dim{opacity:.35}
.tr-wrap .v3l .tstub{font:500 .6rem var(--mono);color:var(--ink2)}
.tr-wrap .v3l.ttick{font:500 .64rem var(--mono);color:var(--ink2)}
.tr-wrap .v3l.tnum{font:500 .62rem var(--mono);color:var(--ink2)}
.tr-wrap .v3l.ttrend{font:600 .76rem var(--sans);color:var(--head);background:color-mix(in srgb,var(--paper) 88%,transparent);border:1px solid var(--rule);border-radius:5px;padding:1px 6px;white-space:normal;max-width:240px;text-align:center}
@container (max-width:560px){ .tr-wrap .v3l.tsym:not(.hl),.tr-wrap .v3l .tstub,.tr-wrap .v3l.tnum{display:none} .tr-wrap .v3l.ttrend{max-width:170px;font-size:.7rem} }
.ctl.tr{gap:8px}
.tr .seg button{white-space:nowrap;flex:0 0 auto}
.tr-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:.84rem;color:var(--ink2);align-items:center}
.tr-leg i{display:inline-block;width:13px;height:13px;border-radius:2px;margin-right:5px;vertical-align:-2px;border:1px solid color-mix(in srgb,var(--ink) 25%,transparent)}
.tr-leg i.hat{background:repeating-linear-gradient(45deg,var(--ink2) 0 1.5px,transparent 1.5px 4px)}
.tr-leg i.out{background:none;border:1.5px dashed var(--ink2)}
.tr-read{font-size:.93rem;line-height:1.55;color:var(--ink2)} .tr-read b{color:var(--head)}
.tr-what{font-size:.86rem}`;
let styleRefs = 0, styleEl = null;
function useStyle() { styleRefs++; if (!styleEl) { styleEl = document.createElement("style"); styleEl.dataset.c120 = "trends"; styleEl.textContent = CSS; document.head.append(styleEl); } return () => { if (--styleRefs <= 0 && styleEl) { styleEl.remove(); styleEl = null; styleRefs = 0; } }; }

export function mount(host, P = {}, ctx = {}) {
  const C = window.C120.chem; const rich = window.C120.rich;
  const el = (t, a = {}, ...k) => { const e = document.createElement(t); for (const x in a) { if (x === "html") e.innerHTML = a[x]; else if (x.startsWith("on")) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); } k.forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };
  const release = useStyle();
  const choices = (P.choices && P.choices.length ? P.choices : ["radius", "ie", "ea", "en"]).filter((k) => PROPS[k]);
  const hlSet = new Set(P.highlight || []);
  const ELS = elements(); const bySym = Object.fromEntries(ELS.map((E) => [E.sym, E]));
  const st = { prop: PROPS[P.property] ? P.property : choices[0], sel: (P.highlight && bySym[P.highlight[0]]) ? P.highlight[0] : null, focus: null };
  const wrap = el("div", { class: "tr-wrap" }); host.append(wrap);
  const HOME = { pos: [-1.5, -15.6, 15.6], target: [0, -0.2, 0.2] };
  const V = new Viewer(wrap, { label: P.label || "Periodic table as a bar landscape", cam: HOME.pos, target: HOME.target, aspect: P.aspect || 0.62, minH: 190, maxH: 520, minD: 5, maxD: 48, fov: 34, onInteract: ctx.onInteract });
  const pal = () => V.pal;
  /* base plate and cell outlines */
  const base = new THREE.Mesh(new THREE.BoxGeometry(18.6, 6.6, 0.06), new THREE.MeshStandardMaterial({ color: pal().soft, roughness: 0.9 }));
  base.position.set(0, 0, -0.04); V.scene.add(base);
  const front = new THREE.DirectionalLight(0xffffff, 0.7); front.position.set(-3, -8, 4); V.scene.add(front);
  /* bars: one instanced box for normal bars, one for faded bars (outside the current focus) */
  const boxG = new THREE.BoxGeometry(1, 1, 1); boxG.translate(0, 0, 0.5);
  const barMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0 });
  const fadeMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false });
  const bars = new THREE.InstancedMesh(boxG, barMat, ELS.length), faded = new THREE.InstancedMesh(boxG, fadeMat, ELS.length);
  [bars, faded].forEach((m) => { m.count = 0; V.scene.add(m); });
  let barIds = [], fadeIds = [];
  const stubs = new THREE.Group(); V.scene.add(stubs);
  const hatchMats = { s: surfaceMaterial(BLOCK.s, { hatch: true, hatchScale: 7 }), p: surfaceMaterial(BLOCK.p, { hatch: true, hatchScale: 7 }), d: surfaceMaterial(BLOCK.d, { hatch: true, hatchScale: 7 }) };
  const stubFade = { s: surfaceMaterial(BLOCK.s, { hatch: true, hatchScale: 7, opacity: 0.18, depthWrite: false }), p: surfaceMaterial(BLOCK.p, { hatch: true, hatchScale: 7, opacity: 0.18, depthWrite: false }), d: surfaceMaterial(BLOCK.d, { hatch: true, hatchScale: 7, opacity: 0.18, depthWrite: false }) };
  const outlineMat = new THREE.LineDashedMaterial({ color: pal().axis, dashSize: 0.08, gapSize: 0.06 });
  let outlines = null;
  const selMat = new THREE.LineBasicMaterial({ color: pal().head });
  const selBox = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1).translate(0, 0, 0.5)), selMat); selBox.visible = false; V.scene.add(selBox);
  const hlMat = new THREE.LineBasicMaterial({ color: pal().accent });
  const hlBoxes = new THREE.Group(); V.scene.add(hlBoxes);
  const scaleG = new THREE.Group(); V.scene.add(scaleG);
  const trendG = new THREE.Group(); V.scene.add(trendG);
  let symLabels = [], stubLabels = [], tickLabels = [], trendLabels = [];
  /* group and period numbers */
  const numLabels = [];
  for (let g = 1; g <= 18; g++) numLabels.push(V.label(String(g), new THREE.Vector3(X(g), Y(6) - 0.85, 0), "tnum"));
  for (let p = 1; p <= 6; p++) numLabels.push(V.label(`n = ${p}`, new THREE.Vector3(X(1) - 1.1, Y(p), 0), "tnum"));
  const col = new THREE.Color();
  const heightOf = (val) => (val.kind === "bar" ? Math.max(0.05, (val.v / PROPS[st.prop].max) * HMAX) : val.kind === "stub" ? 0.22 : 0);
  const inFocus = (E) => !st.focus || (st.focus === "p3" ? E.period === 3 : E.group === 1);

  function build() {
    const M = new THREE.Matrix4(); barIds = []; fadeIds = [];
    stubs.children.slice().forEach((o) => { stubs.remove(o); o.geometry.dispose(); });
    symLabels.forEach((l) => l.remove()); stubLabels.forEach((l) => l.remove()); symLabels = []; stubLabels = [];
    const outPts = [];
    ELS.forEach((E) => {
      const val = valueOf(st.prop, E); const h = heightOf(val); const f = inFocus(E); const x = X(E.group), y = Y(E.period);
      if (val.kind === "bar") {
        const tgt = f ? bars : faded; const ids = f ? barIds : fadeIds; const i = ids.length; ids.push(E.sym);
        M.makeScale(0.84, 0.84, h).setPosition(x, y, 0); tgt.setMatrixAt(i, M); col.set(BLOCK[E.block]); tgt.setColorAt(i, col);
      } else if (val.kind === "stub") {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.84, h).translate(0, 0, h / 2), (f ? hatchMats : stubFade)[E.block]); m.position.set(x, y, 0); m.userData.sym = E.sym; stubs.add(m);
      } else {
        const a = 0.42, hz = 0.22; const c = [[-a, -a], [a, -a], [a, a], [-a, a]];
        for (let k = 0; k < 4; k++) { const [x1, y1] = c[k], [x2, y2] = c[(k + 1) % 4]; outPts.push(x + x1, y + y1, 0.01, x + x2, y + y2, 0.01, x + x1, y + y1, hz, x + x2, y + y2, hz, x + x1, y + y1, 0.01, x + x1, y + y1, hz); }
      }
      const cls = "tsym" + (hlSet.has(E.sym) || E.sym === st.sel ? " hl" : "") + (f ? "" : " dim");
      const L = V.label(val.kind === "stub" && f ? `${E.sym} <span class="tstub">${val.stub.replace(">", "&gt;")}</span>` : E.sym, new THREE.Vector3(x, y, h + (val.kind === "stub" ? 0.42 : 0.24)), cls); L.sym = E.sym; symLabels.push(L);
    });
    bars.count = barIds.length; faded.count = fadeIds.length;
    [bars, faded].forEach((m) => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.computeBoundingSphere(); });
    if (outlines) { V.scene.remove(outlines); outlines.geometry.dispose(); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(outPts, 3));
    outlines = new THREE.LineSegments(g, outlineMat); outlines.computeLineDistances(); V.scene.add(outlines);
    /* highlighted elements get a thin outline */
    hlBoxes.children.slice().forEach((o) => { hlBoxes.remove(o); o.geometry.dispose(); });
    hlSet.forEach((s) => { const E = bySym[s]; if (!E) return; const h = Math.max(0.22, heightOf(valueOf(st.prop, E))); const b = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.96, 0.96, h + 0.04).translate(0, 0, (h + 0.04) / 2)), hlMat); b.position.set(X(E.group), Y(E.period), 0); hlBoxes.add(b); });
    buildScale(); buildTrend(); select(st.sel, true); legend(); V.requestRender();
  }
  /* vertical scale pole at the back-left corner */
  function buildScale() {
    scaleG.children.slice().forEach((o) => { scaleG.remove(o); o.geometry.dispose(); }); tickLabels.forEach((l) => l.remove()); tickLabels = [];
    const pr = PROPS[st.prop]; const x0 = X(18) + 1.0, y0 = Y(1) + 0.3; const pts = [x0, y0, 0, x0, y0, HMAX * (Math.floor(pr.max / pr.step) * pr.step / pr.max) + 0.05];
    for (let v = 0; v <= pr.max + 1e-9; v += pr.step) { const z = (v / pr.max) * HMAX; pts.push(x0, y0, z, x0 + 0.25, y0, z); tickLabels.push(V.label(st.prop === "en" ? v.toFixed(1) : String(v), new THREE.Vector3(x0 + 0.75, y0, z), "ttick")); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    scaleG.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: pal().axis })));
    tickLabels.push(V.label(pr.unit || "Pauling", new THREE.Vector3(x0, y0, HMAX + 0.5), "ttick"));
  }
  function buildTrend() {
    trendG.children.slice().forEach((o) => { trendG.remove(o); o.traverse((q) => q.geometry && q.geometry.dispose()); }); trendLabels.forEach((l) => l.remove()); trendLabels = [];
    if (!st.focus) return;
    const m = surfaceMaterial(pal().head, { roughness: 0.5 }); trendG.userData.mat && trendG.userData.mat.dispose(); trendG.userData.mat = m;
    const row = ELS.filter(inFocus); const top = Math.max(0.4, ...row.map((E) => heightOf(valueOf(st.prop, E)))) + 0.75;
    let a, b, mid;
    if (st.focus === "p3") { a = new THREE.Vector3(X(1), Y(3), top); b = new THREE.Vector3(X(18), Y(3), top); }
    else { a = new THREE.Vector3(X(1), Y(1), top); b = new THREE.Vector3(X(1), Y(6), top); }
    trendG.add(arrow(a, b, 0.05, m, 3.4)); mid = a.clone().lerp(b, 0.5); mid.z += 0.55;
    const pr = PROPS[st.prop];
    trendLabels.push(V.label(st.focus === "p3" ? `Across period 3: ${pr.across}` : `Down group 1: ${pr.down}`, mid, "ttrend"));
  }
  function select(sym, quiet) {
    st.sel = sym && bySym[sym] ? sym : null;
    symLabels.forEach((L) => L.el.classList.toggle("hl", hlSet.has(L.sym) || L.sym === st.sel));
    if (!st.sel) { selBox.visible = false; info.innerHTML = rich(`Tap or click a bar (or use the list) to read its value.`); if (elSel) elSel.value = ""; V.requestRender(); return; }
    const E = bySym[st.sel]; const val = valueOf(st.prop, E); const h = Math.max(0.22, heightOf(val));
    selBox.visible = true; selBox.position.set(X(E.group), Y(E.period), 0); selBox.scale.set(1.0, 1.0, h + 0.06);
    if (elSel) elSel.value = st.sel;
    const pr = PROPS[st.prop];
    info.innerHTML = rich(`<b>${E.sym}</b>, ${E.name.toLowerCase()} &nbsp;($Z = ${E.z}$; period ${E.period}, group ${E.group}, ${E.block} block${E.sym === "He" ? ", 1s², placed with the noble gases" : ""})<br>${pr.name}: <b>${val.text}</b>${val.src ? ` <span class="muted">(${val.src})</span>` : ""}`);
    if (!quiet) emit();
    V.requestRender();
  }
  const camTo = (pos, target) => {
    const c = V.controls, cam = V.camera; const p0 = cam.position.clone(), t0 = c.target.clone(); const p1 = new THREE.Vector3(...pos), t1 = new THREE.Vector3(...target);
    if (window.C120.reduceMotion()) { cam.position.copy(p1); c.target.copy(t1); c.update(); V.requestRender(); return; }
    let t = 0; V.animate((dt) => { t = Math.min(1, t + dt / 0.9); const e = t * t * (3 - 2 * t); cam.position.lerpVectors(p0, p1, e); c.target.lerpVectors(t0, t1, e); c.update(); return t < 1; });
  };
  function setFocus(f) {
    st.focus = st.focus === f ? null : f; segV.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === (st.focus || "all"))));
    build();
    if (st.focus === "p3") camTo([0.3, Y(3) - 17.5, 9.8], [0, Y(3) + 0.4, 0.7]);
    else if (st.focus === "g1") camTo([X(1) - 10.5, -3.2, 6.8], [X(1), 0, 1.2]);
    else camTo(HOME.pos, HOME.target);
    emit();
  }
  V.onTap((ev) => {
    const hits = V.pick(ev, [bars, faded, stubs]); if (!hits.length) return;
    const h = hits[0]; let sym = null;
    if (h.object === bars) sym = barIds[h.instanceId]; else if (h.object === faded) sym = fadeIds[h.instanceId]; else sym = h.object.userData.sym;
    if (sym) select(sym);
  });
  V.theme((p) => { base.material.color.set(p.soft); outlineMat.color.set(p.axis); selMat.color.set(p.head); hlMat.color.set(p.accent); buildScale(); buildTrend(); }, false);

  /* ---------- controls ---------- */
  const ctl = el("div", { class: "ctl tr" }); wrap.append(ctl);
  const r1 = el("div", { class: "row" }); ctl.append(r1);
  let segP = null;
  if (choices.length > 1) {
    segP = el("div", { class: "seg sm", role: "group", "aria-label": "Property" });
    choices.forEach((k) => { const b = el("button", { type: "button", "aria-pressed": String(k === st.prop), "data-k": k }, PROPS[k].name); b.onclick = () => { st.prop = k; segP.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); build(); emit(); }; segP.append(b); });
    r1.append(segP);
  }
  const r2 = el("div", { class: "row" }); ctl.append(r2);
  const segV = el("div", { class: "seg sm", role: "group", "aria-label": "View" });
  [["all", "Whole table"], ["p3", "Across period 3"], ["g1", "Down group 1"]].forEach(([f, t]) => { const b = el("button", { type: "button", "data-f": f, "aria-pressed": String(f === "all") }, t); b.onclick = () => setFocus(f === "all" ? st.focus : f); segV.append(b); });
  r2.append(segV);
  const elSel = el("select", { "aria-label": "Element" }); elSel.append(el("option", { value: "" }, "Pick an element…"));
  ELS.slice().sort((a, b) => a.z - b.z).forEach((E) => elSel.append(el("option", { value: E.sym }, `${E.z} ${E.sym} (${E.name.toLowerCase()})`)));
  elSel.onchange = () => select(elSel.value || null);
  r2.append(elSel);
  const leg = el("div", { class: "tr-leg", "aria-label": "Legend" }); ctl.append(leg);
  function legend() {
    const showStub = st.prop === "ea";
    leg.innerHTML = `<span><i style="background:${BLOCK.s}"></i>s block</span><span><i style="background:${BLOCK.p}"></i>p block</span><span><i style="background:${BLOCK.d}"></i>d block</span>${showStub ? `<span><i class="hat" style="background-color:${BLOCK.p}"></i>energy needed (printed "&gt; 0", N +7)</span>` : ""}<span><i class="out"></i>no value</span>`;
    what.innerHTML = rich(PROPS[st.prop].what);
  }
  const info = el("div", { class: "tr-read", "aria-live": "polite" }); ctl.append(info);
  const what = el("div", { class: "small muted tr-what" }); ctl.append(what);
  function emit() { if (ctx.onState) ctx.onState(state()); }
  function state() { const E = st.sel && bySym[st.sel]; const val = E ? valueOf(st.prop, E) : null; return { property: st.prop, selected: st.sel, value: val ? (val.kind === "bar" ? (st.prop === "ea" ? -val.v : val.v) : val.stub || null) : null, source: val ? val.src : null, focus: st.focus }; }
  build();
  return {
    viewer: V, state,
    select: (s) => { select(s); return state(); },
    set(p) { if (p.property && PROPS[p.property]) { st.prop = p.property; if (segP) segP.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.k === st.prop))); build(); } if (p.focus !== undefined) setFocus(p.focus || (st.focus || "all")); if (p.select) select(p.select); },
    dispose() { numLabels.forEach((l) => l.remove()); V.dispose(); wrap.remove(); release(); }
  };
}

/* 2D fallback: the same table as a flat grid of cells shaded by value */
export function fallback(host, P = {}) {
  const release = useStyle(); const prop = PROPS[P.property] ? P.property : (P.choices && P.choices[0]) || "en"; const pr = PROPS[prop];
  const cw = 30, ch = 34, W = 18 * cw + 20, H = 6 * ch + 46;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="${pr.name} on the periodic table">`;
  elements().forEach((E) => {
    const val = valueOf(prop, E); const x = 10 + (E.group - 1) * cw, y = 10 + (E.period - 1) * ch;
    const h = val.kind === "bar" ? Math.max(2, (val.v / pr.max) * (ch - 14)) : val.kind === "stub" ? 4 : 0;
    s += `<rect x="${x + 1}" y="${y + 1}" width="${cw - 2}" height="${ch - 2}" rx="2" style="fill:var(--paper);stroke:var(--rule)${val.kind === "none" ? ";stroke-dasharray:3 2;stroke:var(--ink2)" : ""}"/>`;
    if (h) s += `<rect x="${x + 3}" y="${y + ch - 3 - h}" width="${cw - 6}" height="${h}" style="fill:${BLOCK[E.block]}${val.kind === "stub" ? ";opacity:.5" : ""}"/>`;
    s += `<text x="${x + cw / 2}" y="${y + 12}" text-anchor="middle" style="font-size:9.5px;fill:var(--head)">${E.sym}</text>`;
  });
  s += `<text x="10" y="${H - 12}" style="font-size:10px">bar inside each cell = ${pr.name.toLowerCase()}${pr.unit ? " (" + pr.unit + ")" : ""}; dashed cell = no value</text></svg>`;
  const w = document.createElement("div"); w.className = "v3d-fallback";
  w.innerHTML = `<div style="width:100%;overflow-x:auto">${s}</div><p class="small muted">${window.C120.rich(`3D needs WebGL, which is off in this browser, so each cell shows its value as a small bar. ${pr.what}`)}</p>`;
  host.append(w); return { dispose() { w.remove(); release(); } };
}
