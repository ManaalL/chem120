// Lesson 2.8 widgets: the five representations of one orbital, and a radial plot tool for any n, l.
import { h, katexString, segmented, readouts, toggle } from '../ui/dom.js';
import { OrbitalView, PHASE } from './orbital-engine.js';
import { RadialGraphs } from './radial-graphs.js';
import * as H from '../core/hydrogen.js';

function orbitalPicker(current, onPick) {
  const wrap = h('div', { class: 'orbital-picker', role: 'group', 'aria-label': 'Orbital' });
  const buttons = {};
  for (const n of [1, 2, 3]) {
    const row = h('div', { class: 'orbital-row' }, h('span', { class: 'shell-label' }, `n = ${n}`));
    for (const o of H.ORBITALS.filter((x) => x.n === n)) {
      const b = h('button', { type: 'button', class: 'orb-btn', 'aria-pressed': String(o.id === current), 'aria-label': o.id, html: katexString(o.tex) });
      b.addEventListener('click', () => { Object.entries(buttons).forEach(([k, x]) => x.setAttribute('aria-pressed', String(k === o.id))); onPick(o.id); });
      buttons[o.id] = b; row.append(b);
    }
    wrap.append(row);
  }
  return wrap;
}

export function createRepresentations({ orbital = '3pz' } = {}) {
  // The 3D view stretches to the full height of the column of graphs beside it.
  const vp = h('div', { class: 'viewport', style: { aspectRatio: 'auto', height: '100%', minHeight: '380px' } });
  const badge = h('div', { class: 'viewport-badge' }); vp.append(badge);
  const graphsBox = h('div', { class: 'pad' });
  const el = h('div', { class: 'widget-row' }, vp, graphsBox);
  const graphs = new RadialGraphs(graphsBox, { compact: true });
  graphs.el.style.gridTemplateColumns = '1fr';
  const view = new OrbitalView(vp, { orbital, surface: true, cloud: false, autoRotate: true, points: 30000 });
  const state = { orbital, mode: 'surface' };

  const ro = readouts([
    { key: 'qn', label: 'n, l' },
    { key: 'rn', label: 'Radial nodes, n − l − 1' },
    { key: 'an', label: 'Angular nodes, l' },
    { key: 'max', label: 'Maxima in R², n − l' },
    { key: 'rmp', label: 'Most probable radius' },
  ]);
  function update() {
    const o = H.getOrbital(state.orbital);
    badge.innerHTML = katexString(o.tex);
    const { nodes, rmp } = graphs.update(o.n, o.l);
    ro.set('qn', `n = ${o.n}, l = ${o.l}`);
    ro.set('rn', nodes.length ? `${nodes.length} (at ${nodes.map((x) => Math.round(x)).join(', ')} pm)` : '0');
    ro.set('an', `${o.l}`);
    ro.set('max', `${o.n - o.l}`);
    ro.set('rmp', `${Math.round(rmp)} pm`);
  }
  const controls = h('div', {},
    orbitalPicker(orbital, (id) => { state.orbital = id; view.set({ orbital: id }); update(); }),
    segmented({ label: '3D view', options: [{ value: 'surface', label: 'Boundary surface' }, { value: 'cloud', label: 'Scatter plot' }, { value: 'both', label: 'Both' }], value: 'surface', onChange: (v) => { view.set({ surface: v !== 'cloud', cloud: v !== 'surface' }); } }),
    toggle({ label: 'Show nodes', checked: false, onChange: (v) => view.set({ nodes: v }) }),
    h('p', { class: 'legend' }, h('span', {}, h('i', { style: { background: PHASE.plus } }), 'Ψ > 0'), h('span', {}, h('i', { style: { background: PHASE.minus } }), 'Ψ < 0')),
    ro);
  update();
  return { el, controls, title: 'Five views of one orbital', sub: '3D on the left, radial plots on the right', dispose() { view.dispose(); graphs.dispose(); } };
}

export function createRadialTool({ n = 4, l = 0 } = {}) {
  const box = h('div', { class: 'pad' });
  const graphs = new RadialGraphs(box);
  const state = { n, l };
  const ro = readouts([
    { key: 'name', label: 'Orbital' },
    { key: 'rn', label: 'Radial nodes, n − l − 1' },
    { key: 'an', label: 'Angular nodes, l' },
    { key: 'tn', label: 'Total nodes, n − 1' },
    { key: 'max', label: 'Maxima in R² and RDF, n − l' },
    { key: 'zero', label: 'R at the nucleus' },
    { key: 'rmp', label: 'Most probable radius' },
  ]);
  const lHolder = h('div', {});
  function lSeg() {
    lHolder.replaceChildren(segmented({ label: 'l (shape)', options: Array.from({ length: state.n }, (_, i) => ({ value: i, label: `${i} (${H.SUBSHELL[i]})` })), value: state.l, onChange: (v) => { state.l = v; update(); } }));
  }
  function update() {
    const { nodes, rmp } = graphs.update(state.n, state.l);
    ro.set('name', `${state.n}${H.SUBSHELL[state.l]}`);
    ro.set('rn', `${nodes.length}`);
    ro.set('an', `${state.l}`);
    ro.set('tn', `${state.n - 1}`);
    ro.set('max', `${state.n - state.l}`);
    ro.set('zero', state.l === 0 ? 'largest value (s orbitals reach the nucleus)' : 'zero');
    ro.set('rmp', `${Math.round(rmp)} pm`);
  }
  const controls = h('div', {},
    segmented({ label: 'n (size and energy)', options: [1, 2, 3, 4, 5, 6].map((v) => ({ value: v, label: String(v) })), value: state.n, onChange: (v) => { state.n = v; if (state.l >= v) state.l = v - 1; lSeg(); update(); } }),
    lHolder, ro,
    h('p', { class: 'ctl-hint' }, 'Radial plots depend only on n and l, so every p orbital of one shell shares the same plots. Use this to check sketches for orbitals beyond n = 3.'));
  lSeg(); update();
  return { el: box, controls, title: 'Radial plots for any orbital', sub: 'n from 1 to 6, any allowed l', dispose: () => graphs.dispose() };
}
