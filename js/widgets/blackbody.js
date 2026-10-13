// Lesson 2.3 (i): Planck's law against the classical Rayleigh-Jeans prediction.
import { h, slider, toggle, readouts, bus } from '../ui/dom.js';
import { Plot } from '../ui/plot.js';
import * as P from '../core/physics.js';

// Rough appearance of a glowing object at temperature T.
function glowColour(T) {
  if (T < 800) return 'no visible glow (infrared only)';
  if (T < 1300) return 'dull red';
  if (T < 2500) return 'orange';
  if (T < 4500) return 'yellow-white';
  if (T < 6500) return 'white';
  return 'blue-white';
}

export function create({ T = 5000 } = {}) {
  const holder = h('div', { class: 'pad' });
  const el = h('div', {}, holder);
  const plot = new Plot(holder, { aspect: 0.55, xLabel: 'Wavelength (µm)', yLabel: 'Intensity (relative)', yFormat: (v) => +v.toFixed(2), ariaLabel: 'Blackbody intensity against wavelength' });
  const state = { T, refs: true, rj: true };
  const ev = bus();
  const snap = () => ({ T: state.T, rj: state.rj, refs: state.refs });

  const ro = readouts([
    { key: 'peak', label: 'Peak wavelength, λ<sub>max</sub>' },
    { key: 'region', label: 'Peak lies in' },
    { key: 'glow', label: 'Looks like' },
    { key: 'power', label: 'Total power vs 300 K (∝ T⁴)' },
  ]);

  function update() { update0(); ev.emit(snap()); }
  function update0() {
    const T = state.T;
    const peak = P.wienPeak(T);
    const peakUm = peak * 1e6;
    const xmax = Math.max(3, Math.min(30, peakUm * 3.2));
    // From 3000 K up, everything shares one scale (the 6000 K peak) so curves can be compared.
    // Below 3000 K the curve would vanish on that scale, so it is scaled to its own peak instead.
    const shared = T >= 3000;
    const scale = shared ? P.planck(P.wienPeak(6000), 6000) : P.planck(peak, T);
    plot.o.yLabel = shared ? 'Intensity (6000 K peak = 1)' : 'Intensity (this curve\'s peak = 1)';
    const curve = (t) => {
      const out = [];
      for (let i = 1; i <= 500; i++) { const um = (xmax * i) / 500; out.push([um, P.planck(um * 1e-6, t) / scale]); }
      return out;
    };
    const series = [];
    if (state.refs && shared) for (const t of [3000, 4000, 5000, 6000]) if (t !== T) series.push({ data: curve(t), color: 'rgba(148,161,176,0.35)', width: 1 });
    series.push({ data: curve(T), color: '#ff6a55', width: 2.5 });
    if (state.rj) {
      const rj = [];
      for (let i = 1; i <= 500; i++) { const um = (xmax * i) / 500; rj.push([um, P.rayleighJeans(um * 1e-6, T) / scale]); }
      series.push({ data: rj, color: '#f2c14e', width: 1.5, dash: [6, 5] });
    }
    const ymax = 1.15;
    plot.set({
      series,
      bands: [{ from: 0.4, to: 0.75, color: 'rgba(255,255,255,0.05)' }],
      vlines: [
        { x: peakUm, color: '#ff6a55', dash: [3, 3], label: `λmax = ${peak < 1e-6 ? Math.round(peak * 1e9) + ' nm' : peakUm.toFixed(2) + ' µm'}`, align: peakUm > xmax * 0.6 ? 'right' : 'left' },
        { x: 0.4, color: 'rgba(255,255,255,0.25)', dash: [2, 3], label: 'visible', row: 1 },
      ],
      xRange: [0, xmax], yRange: [0, ymax],
    });
    ro.set('peak', peak < 1e-6 ? `${Math.round(peak * 1e9)} nm` : `${peakUm.toFixed(2)} µm`);
    ro.set('region', P.regionOf(peak));
    ro.set('glow', glowColour(T));
    ro.set('power', `${((T / 300) ** 4).toLocaleString('en-CA', { maximumFractionDigits: 0 })} ×`);
  }

  const controls = h('div', {},
    slider({ label: 'Temperature', min: 300, max: 6000, step: 50, value: state.T, format: (v) => `${v} K`, onInput: (v) => { state.T = v; update(); } }),
    h('div', { class: 'toggles' },
      toggle({ label: 'Classical prediction', checked: true, onChange: (v) => { state.rj = v; update(); } }),
      toggle({ label: 'Other temperatures', checked: true, onChange: (v) => { state.refs = v; update(); } })),
    ro,
    h('p', { class: 'ctl-hint' }, 'The dashed line is the Rayleigh-Jeans law. It matches at long wavelengths and climbs without limit at short ones, the "ultraviolet catastrophe". Planck\'s curve turns over and falls to zero.'));
  update();
  return { onChange: ev.on, getState: () => snap(), el, controls, title: 'Blackbody radiation', sub: "Planck's law against classical physics", dispose: () => plot.dispose() };
}
