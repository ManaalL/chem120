// Lesson 2.3 (iii): continuous, absorption and emission spectra of hydrogen.
import { h, segmented, toggle, readouts, bus } from '../ui/dom.js';
import * as P from '../core/physics.js';

// Measured wavelengths of hydrogen's visible lines (Bohr's formula with the course constants
// gives values within 0.1 nm of these).
export const BALMER = [{ n: 3, nm: 656.3 }, { n: 4, nm: 486.1 }, { n: 5, nm: 434.0 }, { n: 6, nm: 410.1 }];

export function create({ mode = 'emission' } = {}) {
  const strip = h('canvas', { class: 'spectro-strip', 'aria-label': 'Hydrogen spectrum' });
  const diagram = h('canvas', { class: 'canvas-stage', 'aria-label': 'Experiment diagram' });
  const el = h('div', { class: 'spectro' }, diagram, h('div', { style: { height: '14px' } }), strip);
  const state = { mode, labels: true };
  const ev = bus();
  const snap = () => ({ mode: state.mode, labels: state.labels });
  const lo = 380, hi = 750;

  function drawDiagram() {
    const w = el.clientWidth - 32 || 600, hh = 120, dpr = Math.min(2, devicePixelRatio || 1);
    diagram.width = w * dpr; diagram.height = hh * dpr; diagram.style.height = `${hh}px`; diagram.style.background = 'transparent';
    const c = diagram.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, hh);
    c.font = '13px "IBM Plex Sans", sans-serif'; c.textAlign = 'center'; c.fillStyle = '#94a1b0';
    const box = (x, y, bw, bh, fill, label, sub) => { c.fillStyle = fill; c.fillRect(x, y, bw, bh); c.strokeStyle = '#3a4757'; c.strokeRect(x + 0.5, y + 0.5, bw, bh); c.fillStyle = '#e4e9ee'; c.fillText(label, x + bw / 2, y + bh / 2 + 4); if (sub) { c.fillStyle = '#6a7784'; c.fillText(sub, x + bw / 2, y + bh + 16); } };
    const arrow = (x1, x2, y, col) => { c.strokeStyle = col; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x1, y); c.lineTo(x2 - 8, y); c.stroke(); c.setLineDash([]); c.fillStyle = col; c.beginPath(); c.moveTo(x2, y); c.lineTo(x2 - 9, y - 5); c.lineTo(x2 - 9, y + 5); c.fill(); };
    const y = 30;
    if (state.mode === 'continuous') {
      box(10, y, 90, 44, '#3a3320', 'White light', 'many λ');
      arrow(104, w * 0.55, y + 22, '#e4e9ee');
    } else if (state.mode === 'absorption') {
      box(10, y, 90, 44, '#3a3320', 'White light', 'many λ');
      arrow(104, w * 0.3, y + 22, '#e4e9ee');
      box(w * 0.3 + 4, y, 100, 44, '#1f2a36', 'H(g)', 'some λ absorbed');
      arrow(w * 0.3 + 108, w * 0.55, y + 22, '#c9d3de');
    } else {
      box(10, y, 110, 44, '#3d2522', 'Hot H(g)', 'atoms given energy');
      arrow(124, w * 0.55, y + 22, '#ff6a55');
    }
    // prism
    const px = w * 0.55 + 6;
    c.fillStyle = '#2b3747'; c.beginPath(); c.moveTo(px, y + 50); c.lineTo(px + 34, y - 6); c.lineTo(px + 68, y + 50); c.closePath(); c.fill();
    c.strokeStyle = '#55657a'; c.stroke();
    c.fillStyle = '#6a7784'; c.fillText('prism', px + 34, y + 70);
    // fanned output
    for (let i = 0; i <= 12; i++) {
      const nm = lo + ((hi - lo) * i) / 12;
      const show = state.mode !== 'emission' || BALMER.some((b) => Math.abs(b.nm - nm) < 15);
      if (!show) continue;
      c.strokeStyle = P.rgbCss(P.wavelengthToRGB(nm), 0.5); c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(px + 52, y + 26); c.lineTo(w - 10, y - 10 + i * 9); c.stroke();
    }
    c.fillStyle = '#94a1b0'; c.textAlign = 'right'; c.fillText('to the strip below', w - 10, hh - 6);
  }

  function drawStrip() {
    const w = el.clientWidth - 32 || 600, full = 106, hh = 64, dpr = Math.min(2, devicePixelRatio || 1);
    strip.width = w * dpr; strip.height = full * dpr; strip.style.width = '100%'; strip.style.height = `${full}px`;
    const c = strip.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, full);
    const X = (nm) => ((nm - lo) / (hi - lo)) * w;
    if (state.mode === 'emission') { c.fillStyle = '#000'; c.fillRect(0, 0, w, hh); }
    else {
      for (let x = 0; x < w; x++) { const nm = lo + ((hi - lo) * x) / w; c.fillStyle = P.rgbCss(P.wavelengthToRGB(nm)); c.fillRect(x, 0, 1, hh); }
    }
    if (state.mode !== 'continuous') {
      for (const b of BALMER) {
        const x = X(b.nm);
        if (state.mode === 'emission') {
          const col = P.rgbCss(P.wavelengthToRGB(b.nm));
          c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 12; c.fillRect(x - 1.5, 0, 3, hh); c.shadowBlur = 0;
        } else { c.fillStyle = '#000'; c.fillRect(x - 1.5, 0, 3, hh); }
        if (state.labels) {
          c.font = '12px "IBM Plex Sans", sans-serif'; c.textAlign = 'left';
          c.fillStyle = state.mode === 'emission' ? '#e4e9ee' : '#000';
          c.fillText(`${b.n}→2`, x + 5, 15);
        }
      }
    }
    // wavelength scale under the strip, with the line positions marked
    c.font = '11.5px "IBM Plex Sans", sans-serif'; c.textAlign = 'center'; c.fillStyle = '#6a7784';
    for (let nm = 400; nm <= 750; nm += 50) { const x = X(nm); c.fillRect(Math.min(x, w - 1), hh, 1, 5); if (nm === 750) { c.textAlign = 'right'; c.fillText('750 nm', w, hh + 17); c.textAlign = 'center'; } else c.fillText(`${nm}`, x, hh + 17); }
    if (state.mode !== 'continuous') {
      c.fillStyle = '#c9d3de';

      for (const b of BALMER) c.fillText(b.nm.toFixed(1), X(b.nm) + (b.n === 5 ? 6 : b.n === 6 ? -6 : 0), full - 3);
    }
  }

  const ro = readouts(BALMER.slice().reverse().map((b) => ({ key: b.n, label: `${b.nm.toFixed(1)} nm` })));
  function update() { update0(); ev.emit(snap()); }
  function update0() {
    drawDiagram(); drawStrip();
    for (const b of BALMER) {
      const E = Math.abs(P.transition(b.n, 2).dE);
      ro.set(b.n, state.labels ? `n = ${b.n} → 2, ${P.sci(E, 3)} J` : `${P.sci(E, 3)} J`);
    }
  }
  const resizeObs = new ResizeObserver(update); resizeObs.observe(el);

  const controls = h('div', {},
    segmented({ label: 'What reaches the prism', options: [{ value: 'continuous', label: 'White light' }, { value: 'absorption', label: 'Through H gas' }, { value: 'emission', label: 'From hot H' }], value: state.mode, onChange: (v) => { state.mode = v; update(); } }),
    toggle({ label: 'Label each line with its transition', checked: true, onChange: (v) => { state.labels = v; update(); } }),
    h('p', { class: 'ctl-section' }, 'Visible hydrogen lines and photon energies'), ro,
    h('p', { class: 'ctl-hint' }, 'The dark lines in the absorption spectrum sit at exactly the same wavelengths as the bright lines in the emission spectrum. The transition labels come from Bohr\'s model in lesson 2.4.'));
  update();
  return { onChange: ev.on, getState: () => snap(), el, controls, title: 'Hydrogen line spectra', sub: 'Only certain wavelengths are absorbed or emitted', dispose: () => resizeObs.disconnect() };
}
