// Lesson 2.6: squeezing the position spread widens the momentum spread.
import { h, slider, select, readouts, bus } from '../ui/dom.js';
import { Plot } from '../ui/plot.js';
import * as P from '../core/physics.js';

const PARTICLES = [
  { id: 'e', name: 'Electron', m: P.C.me },
  { id: 'p', name: 'Proton', m: P.C.mp },
];

export function create() {
  const left = h('div', { class: 'pad' }), right = h('div', { class: 'pad' });
  const el = h('div', { class: 'widget-row' }, left, right);
  left.prepend(h('p', { class: 'graph-title', style: { margin: '0 0 4px' } }, 'Where the particle might be'));
  right.prepend(h('p', { class: 'graph-title', style: { margin: '0 0 4px' } }, 'What its momentum might be'));
  const px = new Plot(left, { aspect: 0.7, xLabel: 'position x (pm)', yLabel: 'probability', hideY: true, padding: { l: 22 } });
  const pp = new Plot(right, { aspect: 0.7, xLabel: 'momentum p (10⁻²⁴ kg m s⁻¹)', yLabel: 'probability', hideY: true, padding: { l: 22 } });
  const state = { logdx: Math.log10(50), particle: 'e' };
  const ev = bus();
  const snap = () => ({ dx: 10 ** state.logdx, particle: state.particle });

  const ro = readouts([
    { key: 'dx', label: 'Δx' },
    { key: 'dp', label: 'Smallest Δp = h/(4πΔx)' },
    { key: 'dv', label: 'Smallest Δv = Δp/m' },
    { key: 'cmp', label: 'Compared with' },
  ]);

  const gaussian = (x, s) => Math.exp(-(x * x) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));

  function update() { update0(); ev.emit(snap()); }
  function update0() {
    const dx = 10 ** state.logdx * 1e-12;
    const dp = P.minMomentumSpread(dx);
    const m = PARTICLES.find((p) => p.id === state.particle).m;
    const dv = dp / m;
    const sx = dx / 1e-12, sp = dp / 1e-24;
    const xs = [], ps = [];
    for (let i = 0; i <= 400; i++) {
      const x = -400 + (800 * i) / 400; xs.push([x, gaussian(x, sx)]);
      const p = -6 + (12 * i) / 400; ps.push([p, gaussian(p, sp)]);
    }
    px.set({ series: [{ data: xs, color: '#40c4e6', fill: 'rgba(64,196,230,0.15)' }], vlines: [{ x: -sx, color: '#94a1b0' }, { x: sx, color: '#94a1b0', label: '±Δx' }], xRange: [-400, 400], yRange: [0, gaussian(0, 10) * 1.05] });
    pp.set({ series: [{ data: ps, color: '#ff6a55', fill: 'rgba(255,106,85,0.15)' }], vlines: [{ x: -sp, color: '#94a1b0' }, { x: sp, color: '#94a1b0', label: '±Δp' }], xRange: [-6, 6], yRange: [0, gaussian(0, P.minMomentumSpread(200e-12) / 1e-24) * 1.05] });
    ro.set('dx', `${(dx / 1e-12).toFixed(1)} pm`);
    ro.set('dp', `${P.sci(dp, 3)} kg m s⁻¹`);
    ro.set('dv', `${P.sci(dv, 3)} m s⁻¹`);
    ro.set('cmp', dv > 1e5 ? `${(dv / P.C.c * 100).toPrecision(2)}% of the speed of light` : `about ${Math.round(dv * 3.6).toLocaleString('en-CA')} km/h`);
  }

  const controls = h('div', {},
    select({ label: 'Particle', options: PARTICLES.map((p) => ({ value: p.id, label: p.name })), value: 'e', onChange: (v) => { state.particle = v; update(); } }),
    slider({ label: 'Position uncertainty, Δx', min: 1, max: Math.log10(200), step: 0.005, value: state.logdx, format: (v) => `${(10 ** v).toFixed(1)} pm`, onInput: (v) => { state.logdx = v; update(); } }),
    ro,
    h('p', { class: 'ctl-hint' }, 'An H atom is about 100 pm across. Pin an electron down to that size and its speed becomes uncertain by hundreds of kilometres per second.'));
  update();
  return { onChange: ev.on, getState: () => snap(), el, controls, title: 'Uncertainty principle', sub: 'Narrow one distribution and the other widens', dispose() { px.dispose(); pp.dispose(); } };
}
