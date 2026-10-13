// Lesson 2.8: why the radial distribution function peaks away from the nucleus.
// Density along one line (R²) times the size of a shell (∝ r²) gives the RDF (r²R²).
import { h, slider, segmented, readouts, bus } from '../ui/dom.js';
import { Plot } from '../ui/plot.js';
import * as H from '../core/hydrogen.js';

const ORBS = { '1s': [1, 0, 260], '2s': [2, 0, 800], '2p': [2, 1, 800] };

export function create({ orb = '1s' } = {}) {
  const pic = h('canvas', { 'aria-label': 'Cross-section of the atom with a thin shell at the chosen distance', style: { width: '100%', aspectRatio: '1', display: 'block' } });
  const plotBox = h('div', { class: 'pad' });
  const el = h('div', { class: 'widget-row', style: { gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.4fr)' } }, h('div', { class: 'pad' }, pic), plotBox);
  const plot = new Plot(plotBox, { aspect: 0.62, xLabel: 'r (pm)', yLabel: 'each curve scaled to peak 1', hideY: true, padding: { l: 24 } });
  const state = { orb, r: 120 };
  const bg = document.createElement('canvas');
  let bgKey = '';
  const ev = bus();
  const peakPm = () => { const [n, l] = ORBS[state.orb]; return H.mostProbableRadius(n, l) * H.A0_PM; };
  const snap = () => ({ orb: state.orb, r: state.r, atPeak: Math.abs(state.r - peakPm()) <= 4 });
  const ro = readouts([
    { key: 'd', label: 'Density on a line, R² (blue)' },
    { key: 's', label: 'Size of the shell, ∝ r² (grey)' },
    { key: 'p', label: 'Product, the RDF (white)' },
  ]);

  function curves() {
    const [n, l, rmax] = ORBS[state.orb];
    const R2 = [], S = [], P = [];
    let mR = 0, mS = 0, mP = 0;
    for (let i = 0; i <= 400; i++) {
      const rpm = (rmax * i) / 400, r = rpm / H.A0_PM;
      const R = H.radial(n, l, r);
      R2.push([rpm, R * R]); S.push([rpm, r * r]); P.push([rpm, r * r * R * R]);
      mR = Math.max(mR, R * R); mS = Math.max(mS, r * r); mP = Math.max(mP, r * r * R * R);
    }
    const norm = (arr, m) => arr.map(([x, y]) => [x, y / m]);
    return { R2: norm(R2, mR), S: norm(S, mS), P: norm(P, mP), mR, mS, mP, rmax, n, l };
  }
  function drawPic(cv) {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = pic.clientWidth || 260;
    if (pic.width !== Math.round(W * dpr)) pic.width = pic.height = Math.round(W * dpr);
    const c = pic.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = '#0a0e13'; c.fillRect(0, 0, W, W);
    const cx = W / 2, scale = (W / 2 - 8) / cv.rmax;
    // density as a soft glow, drawn once per orbital and size, then reused
    const keyBg = `${state.orb}:${W}`;
    if (bgKey !== keyBg) {
      bgKey = keyBg;
      const N = Math.round(W * dpr);
      bg.width = bg.height = N;
      const bc = bg.getContext('2d'), img = bc.createImageData(N, N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const x = (i / dpr - cx) / scale, y = (j / dpr - cx) / scale;
        const rpm = Math.hypot(x, y); const R = H.radial(cv.n, cv.l, rpm / H.A0_PM);
        let d = (R * R) / cv.mR;
        if (cv.l === 1) d *= ((y * y) / (rpm * rpm || 1)) * 3; // p: brighter along the vertical axis
        const t = Math.pow(Math.min(1, d), 0.45);
        const k = (j * N + i) * 4;
        img.data[k] = 10 + 54 * t; img.data[k + 1] = 14 + 182 * t; img.data[k + 2] = 19 + 211 * t; img.data[k + 3] = 255;
      }
      bc.putImageData(img, 0, 0);
    }
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(bg, 0, 0); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    // the thin shell at r
    c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(2, 10 * scale * 0.6);
    c.globalAlpha = 0.85; c.beginPath(); c.arc(cx, cx, state.r * scale, 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1;
    c.fillStyle = '#ff6a55'; c.beginPath(); c.arc(cx, cx, 3, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#cfd8e1'; c.font = '12px "IBM Plex Sans", sans-serif'; c.textAlign = 'left';
    c.fillText(`shell at r = ${Math.round(state.r)} pm`, 8, 16);
  }
  function update() {
    const cv = curves();
    if (state.r > cv.rmax) state.r = cv.rmax;
    const r = state.r / H.A0_PM, R = H.radial(cv.n, cv.l, r);
    plot.set({
      series: [
        { data: cv.S, color: 'rgba(148,161,176,0.7)', width: 1.5, dash: [5, 4] },
        { data: cv.R2, color: '#40c4e6', width: 2 },
        { data: cv.P, color: '#e6ebf0', width: 2.5, fill: 'rgba(230,235,240,0.08)' },
      ],
      vlines: [{ x: state.r, color: '#ff6a55', dash: [], width: 1.5, label: `${Math.round(state.r)} pm`, align: state.r > cv.rmax * 0.7 ? 'right' : 'left' }],
      xRange: [0, cv.rmax], yRange: [0, 1.1],
    });
    ro.set('d', `${Math.round((100 * R * R) / cv.mR)}% of its maximum`);
    ro.set('s', `${Math.round((100 * r * r) / cv.mS)}% of the largest shown`);
    ro.set('p', `${Math.round((100 * r * r * R * R) / cv.mP)}% of its peak`);
    drawPic(cv);
    ev.emit(snap());
  }
  const sl = slider({ label: 'Distance from the nucleus, r', min: 0, max: 260, step: 1, value: state.r, format: (v) => `${v} pm`, onInput: (v) => { state.r = v; update(); } });
  const controls = h('div', {},
    segmented({ label: 'Orbital', options: Object.keys(ORBS).map((k) => ({ value: k, label: k })), value: state.orb, onChange: (v) => { state.orb = v; sl.input.max = String(ORBS[v][2]); update(); } }),
    sl, ro,
    h('p', { class: 'ctl-hint' }, 'The white curve is the blue curve multiplied by the grey one. Near the nucleus the density is high but the shell is tiny. Far out the shell is huge but the density is almost zero. The product peaks in between.'));
  const rs = new ResizeObserver(() => drawPic(curves())); rs.observe(pic);
  update();
  return { onChange: ev.on, getState: snap, el, controls, dispose() { plot.dispose(); rs.disconnect(); } };
}
