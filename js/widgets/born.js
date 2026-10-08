// Lesson 2.7: build up a probability picture one position measurement at a time (Born),
// or show the smooth density (Schrödinger's charge cloud).
import { h, segmented, button, readouts, katexString } from '../ui/dom.js';
import * as H from '../core/hydrogen.js';

const CHOICES = ['1s', '2s', '2pz', '3dz2'];

export function create() {
  const canvas = h('canvas', { 'aria-label': 'Cross-section through the atom in the xz plane', style: { width: '100%', aspectRatio: '1', display: 'block', background: '#05070a', borderRadius: '4px' } });
  const wrap = h('div', { style: { position: 'relative' } }, canvas,
    h('span', { style: { position: 'absolute', right: '8px', top: '50%', font: 'italic 14px var(--serif)', color: '#cfd8e1' } }, 'x'),
    h('span', { style: { position: 'absolute', left: '50%', top: '6px', font: 'italic 14px var(--serif)', color: '#cfd8e1' } }, 'z'));
  const el = h('div', { class: 'pad', style: { maxWidth: '560px', margin: '0 auto' } }, wrap);
  const state = { orb: '1s', mode: 'dots', pts: [], count: 0 };
  let N = 400, rnd = H.mulberry32(5);

  const L = () => H.extentFor(H.getOrbital(state.orb).n) * 0.8;
  let maxD = 1;
  function computeMax() {
    const o = H.getOrbital(state.orb), l = L(); maxD = 0;
    for (let j = 0; j < 160; j++) for (let i = 0; i < 160; i++) {
      const x = -l + (2 * l * i) / 159, z = -l + (2 * l * j) / 159;
      const p = H.psi(o, x, 0, z); if (p * p > maxD) maxD = p * p;
    }
  }
  // Rejection sampling on the xz plane: each accepted point is one "measurement".
  function measure(n) {
    const o = H.getOrbital(state.orb), l = L();
    let got = 0, guard = 0;
    while (got < n && guard < n * 4000) {
      guard++;
      const x = (rnd() * 2 - 1) * l, z = (rnd() * 2 - 1) * l;
      const p = H.psi(o, x, 0, z);
      if (rnd() * maxD < p * p) { state.pts.push([x / l, z / l, p >= 0]); got++; }
    }
    state.count += got;
    draw();
  }
  function draw() {
    const c = canvas.getContext('2d');
    const dpr = Math.min(2, devicePixelRatio || 1);
    N = Math.round((canvas.clientWidth || 400) * dpr);
    canvas.width = canvas.height = N;
    c.fillStyle = '#05070a'; c.fillRect(0, 0, N, N);
    const o = H.getOrbital(state.orb), l = L();
    if (state.mode === 'cloud' || state.mode === 'both') {
      const R = 220, img = c.createImageData(R, R);
      for (let j = 0; j < R; j++) for (let i = 0; i < R; i++) {
        const x = -l + (2 * l * (i + 0.5)) / R, z = l - (2 * l * (j + 0.5)) / R;
        const p = H.psi(o, x, 0, z), t = Math.pow((p * p) / maxD, 0.5);
        const k = (j * R + i) * 4;
        img.data[k] = 20 + 200 * t; img.data[k + 1] = 26 + 210 * t; img.data[k + 2] = 34 + 220 * t; img.data[k + 3] = state.mode === 'both' ? 150 : 255;
      }
      const tmp = document.createElement('canvas'); tmp.width = tmp.height = R; tmp.getContext('2d').putImageData(img, 0, 0);
      c.imageSmoothingEnabled = true; c.drawImage(tmp, 0, 0, N, N);
    }
    if (state.mode !== 'cloud') {
      const s = Math.max(1.4, N / 260);
      for (const [x, z, pos] of state.pts) {
        c.fillStyle = pos ? 'rgba(255,128,108,0.85)' : 'rgba(90,210,240,0.85)';
        c.fillRect(N / 2 + x * N / 2 - s / 2, N / 2 - z * N / 2 - s / 2, s, s);
      }
    }
    if (!state.count && state.mode === 'dots') {
      c.fillStyle = '#94a1b0'; c.textAlign = 'center'; c.font = `${Math.round(N / 30)}px "IBM Plex Sans", sans-serif`;
      c.fillText('No measurements yet.', N / 2, N * 0.38);
      c.fillText('Use the Measure buttons in the controls.', N / 2, N * 0.38 + N / 22);
    }
    // nucleus
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(N / 2, N / 2, Math.max(2, N / 200), 0, Math.PI * 2); c.fill();
    ro.set('n', state.count.toLocaleString('en-CA'));
    ro.set('size', `${Math.round(2 * l * H.A0_PM)} pm across`);
  }
  function reset() { state.pts = []; state.count = 0; rnd = H.mulberry32(5 + Math.floor(Math.random() * 1000)); computeMax(); draw(); }

  const ro = readouts([{ key: 'n', label: 'Measurements made' }, { key: 'size', label: 'Square shown' }]);
  const orbSeg = segmented({ label: 'Orbital', options: CHOICES.map((id) => ({ value: id, label: katexString(H.getOrbital(id).tex) })), value: state.orb, onChange: (v) => { state.orb = v; reset(); } });
  const controls = h('div', {},
    orbSeg,
    segmented({ label: 'Show', options: [{ value: 'dots', label: 'Measurements' }, { value: 'cloud', label: 'Cloud' }, { value: 'both', label: 'Both' }], value: state.mode, onChange: (v) => { state.mode = v; draw(); } }),
    h('p', { class: 'ctl-label', style: { margin: '0 0 6px', fontSize: '13.5px', color: 'var(--muted)' } }, 'Measure the position'),
    h('div', { class: 'btn-row' }, button('Once', () => measure(1), 'small'), button('10 times', () => measure(10), 'small'), button('100 times', () => measure(100), 'small'), button('2000 times', () => measure(2000), 'small primary'), button('Clear', reset, 'small ghost')),
    ro,
    h('p', { class: 'ctl-hint' }, 'Each dot is one measurement of the electron\'s position, on a thin slice through the nucleus. Dot colour shows the sign of Ψ at that spot. One dot tells you almost nothing; thousands reveal |Ψ|².'));
  const resizeObs = new ResizeObserver(draw); resizeObs.observe(canvas);
  computeMax(); draw();
  return { el, controls, title: 'Measuring an electron\'s position', sub: 'The Born interpretation, one dot at a time', dispose: () => resizeObs.disconnect() };
}
