// Orbital lab: the full 3D orbital view with slice panel, linked radial plots and controls.
import { h, katexString, slider, segmented, toggle, readouts, button } from '../ui/dom.js';
import { OrbitalView, sliceImage, PHASE } from '../widgets/orbital-engine.js';
import { RadialGraphs } from '../widgets/radial-graphs.js';
import * as H from '../core/hydrogen.js';
import { C, sci } from '../core/physics.js';

const ANGULAR_NODE_TEXT = {
  s: 'none',
  px: 'one plane, x = 0',
  py: 'one plane, y = 0',
  pz: 'one plane, z = 0',
  dxy: 'two planes, x = 0 and y = 0',
  dyz: 'two planes, y = 0 and z = 0',
  dxz: 'two planes, x = 0 and z = 0',
  dx2y2: 'two planes, x = y and x = −y',
  dz2: 'two cones at 54.7° from the z axis',
};

export function render(ctx, arg) {
  const startId = H.getOrbital(arg) ? arg : '3dz2';
  const main = ctx.main;

  const badge = h('div', { class: 'viewport-badge' });
  const vp = h('div', { class: 'viewport lab-viewport' }, badge, h('p', { class: 'viewport-note' }, 'Drag to rotate. Scroll or pinch to zoom.'));
  const legend = h('p', { class: 'legend' },
    h('span', {}, h('i', { style: { background: PHASE.plus } }), 'Ψ positive'),
    h('span', {}, h('i', { style: { background: PHASE.minus } }), 'Ψ negative'),
    h('span', {}, 'Colours show the sign of Ψ, not electric charge.'));

  // slice panel
  const sliceCanvas = h('canvas', { width: 280, height: 280, 'aria-label': 'Cross-section of electron density' });
  const sliceAxes = h('div', { class: 'slice-axes', 'aria-hidden': 'true' });
  const probe = h('p', { class: 'slice-probe' }, 'Move over the slice to read values.');
  const sliceBody = h('div', {});
  const slicePanel = h('section', { class: 'slice-panel' }, h('h3', {}, 'Cross-section'), sliceBody);
  const graphsPanel = h('section', { class: 'graphs-panel' }, h('h3', {}, 'Radial plots for this orbital'));
  main.append(
    h('div', { class: 'lab-grid' },
      vp, legend,
      h('div', { class: 'lab-lower' }, slicePanel, graphsPanel)));

  const graphs = new RadialGraphs(graphsPanel);
  const view = new OrbitalView(vp, { orbital: startId, surface: true, cloud: false, autoRotate: false, nodes: false, aspect: 0.55 });
  ctx.onCleanup(() => { view.dispose(); graphs.dispose(); });

  // ---------- controls ----------
  const controls = h('div', {});
  const picker = h('div', { class: 'orbital-picker', role: 'group', 'aria-label': 'Orbital' });
  const orbButtons = {};
  for (const n of [1, 2, 3]) {
    const row = h('div', { class: 'orbital-row' }, h('span', { class: 'shell-label' }, `n = ${n}`));
    for (const o of H.ORBITALS.filter((x) => x.n === n)) {
      const b = h('button', { type: 'button', class: 'orb-btn', 'aria-pressed': String(o.id === startId), 'aria-label': o.id, html: katexString(o.tex) });
      b.addEventListener('click', () => choose(o.id));
      orbButtons[o.id] = b;
      row.append(b);
    }
    picker.append(row);
  }

  const state = { ...view.o };
  const set = (patch) => { Object.assign(state, patch); view.set(patch); };

  const tSurface = toggle({ label: 'Surface', checked: true, onChange: (v) => set({ surface: v }) });
  const tCloud = toggle({ label: 'Point cloud', checked: false, onChange: (v) => set({ cloud: v }) });
  const tSlice = toggle({ label: 'Slice', checked: false, onChange: (v) => { set({ slice: v }); refreshSlice(); } });
  const tNodes = toggle({ label: 'Nodes', checked: false, onChange: (v) => set({ nodes: v }) });
  const tAxes = toggle({ label: 'Axes', checked: true, onChange: (v) => set({ axes: v }) });
  const tRotate = toggle({ label: 'Rotate', checked: false, onChange: (v) => set({ autoRotate: v }) });
  const tScale = toggle({ label: 'Show true relative size (same box for every orbital)', checked: false, onChange: (v) => { set({ trueScale: v }); offset.input.max = String(extentPm()); refreshSlice(); } });

  const frac = slider({ label: 'Probability inside surface', min: 50, max: 99, step: 1, value: 90, format: (v) => `${v}%`, onChange: (v) => set({ fraction: v / 100 }), hint: 'Course diagrams usually use 90% or 95%.' });
  const pts = slider({ label: 'Points sampled', min: 10000, max: 100000, step: 5000, value: 50000, format: (v) => v.toLocaleString('en-CA'), onChange: (v) => set({ points: v }) });
  const axis = segmented({ label: 'Slice plane', options: [{ value: 'xz', label: 'xz' }, { value: 'xy', label: 'xy' }, { value: 'yz', label: 'yz' }], value: 'xz', onChange: (v) => { set({ sliceAxis: v }); refreshSlice(); } });
  const extentPm = () => Math.round((state.trueScale ? H.extentFor(3) : H.extentFor(H.getOrbital(state.orbital).n)) * H.A0_PM);
  const offset = slider({ label: 'Plane position', min: -extentPm(), max: extentPm(), step: 5, value: 0, format: (v) => `${v} pm`, onInput: (v) => { set({ sliceOffset: v / H.A0_PM }); refreshSlice(); } });
  const tCut = toggle({ label: 'Cut away the near half', checked: true, onChange: (v) => set({ cutaway: v }) });

  const ro = readouts([
    { key: 'qn', label: 'Quantum numbers' },
    { key: 'ml', label: 'm<sub>l</sub>' },
    { key: 'E', label: 'Energy' },
    { key: 'rn', label: 'Radial nodes' },
    { key: 'an', label: 'Angular nodes' },
    { key: 'tn', label: 'Total nodes' },
    { key: 'rmp', label: 'Most probable radius' },
    { key: 'deg', label: 'Orbitals in this shell' },
    { key: 'box', label: 'Box shown' },
  ]);

  controls.append(
    h('p', { class: 'ctl-section' }, 'Orbital'), picker,
    h('p', { class: 'ctl-section' }, 'Show'),
    h('div', { class: 'toggles' }, tSurface, tCloud, tSlice, tNodes, tAxes, tRotate), tScale,
    h('p', { class: 'ctl-section' }, 'Boundary surface and cloud'), frac, pts,
    h('p', { class: 'ctl-section' }, 'Slice'), axis, offset, tCut,
    h('div', { class: 'btn-row' }, button('Reset view', () => view.resetView(), 'small'), button('Save image', saveImage, 'small')),
    h('p', { class: 'ctl-section' }, 'Values'), ro,
  );
  ctx.panel(vp, controls, 'Orbital controls', 'Pick an orbital, then change how it is drawn.');

  function choose(id) {
    for (const [k, b] of Object.entries(orbButtons)) b.setAttribute('aria-pressed', String(k === id));
    const prevN = H.getOrbital(state.orbital).n;
    set({ orbital: id });
    if (H.getOrbital(id).n !== prevN && !state.trueScale) {
      const m = extentPm();
      offset.input.min = String(-m); offset.input.max = String(m);
      offset.set(0); set({ sliceOffset: 0 });
    }
    history.replaceState(null, '', `#/lab/${id}`);
    refresh();
  }

  function refresh() {
    const orb = H.getOrbital(state.orbital);
    badge.innerHTML = `${katexString(orb.tex)}<br><span>n = ${orb.n}, l = ${orb.l}</span>`;
    const { nodes, rmp } = graphs.update(orb.n, orb.l);
    const E = -C.RH / (orb.n * orb.n);
    ro.set('qn', `n = ${orb.n}, l = ${orb.l} (${H.SUBSHELL[orb.l]})`);
    ro.set('ml', orb.ml);
    ro.set('E', `${sci(E, 4)} J`);
    ro.set('rn', nodes.length ? `${nodes.length} at ${nodes.map((x) => Math.round(x)).join(', ')} pm` : '0');
    ro.set('an', `${orb.l}: ${ANGULAR_NODE_TEXT[orb.ang]}`);
    ro.set('tn', `${orb.n - 1}`);
    ro.set('rmp', `${Math.round(rmp)} pm (${(rmp / H.A0_PM).toFixed(2)} a<sub>0</sub>)`);
    ro.set('deg', `${orb.n * orb.n}, all with the same energy`);
    ro.set('box', `±${extentPm()} pm`);
    refreshSlice();
  }

  // ---------- 2D slice panel ----------
  let last = null;
  function refreshSlice() {
    if (!state.slice) {
      sliceBody.replaceChildren(
        h('p', { class: 'inspector-empty' }, 'A slice shows electron density on one flat plane through the atom, with nodal lines drawn in white.'),
        button('Turn on slice', () => { tSlice.querySelector('input').click(); }, 'small'));
      return;
    }
    if (!sliceBody.contains(sliceCanvas)) sliceBody.replaceChildren(h('div', { class: 'slice-canvas-wrap' }, sliceCanvas, sliceAxes), probe);
    const orb = H.getOrbital(state.orbital);
    const L = state.trueScale ? H.extentFor(3) : H.extentFor(orb.n);
    last = sliceImage(orb, state.sliceAxis, state.sliceOffset, L, 280, sliceCanvas);
    const [u, v] = state.sliceAxis.split('');
    sliceAxes.replaceChildren(h('span', { style: { right: '6px', top: '50%' } }, u), h('span', { style: { left: '50%', top: '4px' } }, v));
    if (last.max < 1e-14) probe.textContent = 'This whole plane is a nodal plane. Ψ = 0 everywhere on it, so the chance of finding the electron here is zero.';
    else probe.textContent = 'Move over the slice to read values.';
  }
  sliceCanvas.addEventListener('pointermove', (e) => {
    if (!last || last.max < 1e-14) return;
    const rect = sliceCanvas.getBoundingClientRect();
    const i = Math.floor(((e.clientX - rect.left) / rect.width) * last.N);
    const j = Math.floor(((e.clientY - rect.top) / rect.height) * last.N);
    if (i < 0 || j < 0 || i >= last.N || j >= last.N) return;
    const L = last.L;
    const uu = (-L + (2 * L * (i + 0.5)) / last.N) * H.A0_PM;
    const vv = (L - (2 * L * (j + 0.5)) / last.N) * H.A0_PM;
    const w = state.sliceOffset * H.A0_PM;
    const r = Math.sqrt(uu * uu + vv * vv + w * w);
    const p = last.values[j * last.N + i];
    const [a, b] = state.sliceAxis.split('');
    probe.textContent = `${a} = ${Math.round(uu)} pm, ${b} = ${Math.round(vv)} pm, r = ${Math.round(r)} pm. Ψ is ${p >= 0 ? 'positive' : 'negative'}; density is ${Math.round((100 * p * p) / last.max)}% of the highest on this plane.`;
  });

  function saveImage() {
    const url = view.snapshot();
    if (!url) return;
    const a = h('a', { href: url, download: `hydrogen-${state.orbital}.png` });
    document.body.append(a); a.click(); a.remove();
  }

  refresh();
}
