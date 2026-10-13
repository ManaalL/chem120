// Lesson 2.2: electromagnetic wave with E and B fields, a log-scale spectrum bar and live conversions.
import * as THREE from 'three';
import { createStage, textSprite } from '../ui/stage.js';
import { h, slider, readouts, button, bus } from '../ui/dom.js';
import * as P from '../core/physics.js';

const REGION_BLOCKS = [
  { name: 'γ rays', from: -16, to: -11, color: '#2b3a5c' },
  { name: 'X-rays', from: -11, to: -8, color: '#2f4a4a' },
  { name: 'UV', from: -8, to: Math.log10(400e-9), color: '#3d3360' },
  { name: '', from: Math.log10(400e-9), to: Math.log10(750e-9), color: 'visible' },
  { name: 'Infrared', from: Math.log10(750e-9), to: -3, color: '#4d2c2c' },
  { name: 'Microwave', from: -3, to: -1, color: '#2c4636' },
  { name: 'Radio', from: -1, to: 4, color: '#463f2a' },
];

const PRESETS = [
  { label: 'FM radio', lambda: P.C.c / 100e6 },
  { label: 'Microwave oven', lambda: P.C.c / 2.45e9 },
  { label: 'Red laser', lambda: 650e-9 },
  { label: 'Green laser', lambda: 532e-9 },
  { label: 'UV lamp', lambda: 254e-9 },
  { label: 'Medical X-ray', lambda: 0.02e-9 },
];

export function create({ initial = 550e-9 } = {}) {
  const el = h('div', {});
  const vp = h('div', { class: 'viewport' }, h('p', { class: 'viewport-note' }, 'The wave is drawn with the same shape at every wavelength. Read the scale from the panel.'));
  const bar = h('canvas', { class: 'canvas-stage', height: 64, 'aria-label': 'Electromagnetic spectrum on a logarithmic scale. Click to choose a wavelength.', role: 'slider' });
  const barWrap = h('div', { style: { padding: '12px 16px 14px', borderTop: '1px solid var(--line)' } }, bar);
  el.append(vp, barWrap);

  const state = { log: Math.log10(initial), t: 0 };
  const ev = bus();
  const snap = () => ({ lambda: 10 ** state.log });
  const stage = createStage(vp, { position: [3.2, 2.4, 6.2], target: [0, 0, 0], minDistance: 4, maxDistance: 14 });
  const N = 240, L = 6.4, CYCLES = 2.5;
  let eLine, bLine, eStems, bStems, eMat;
  if (stage) {
    const { scene } = stage;
    const axisMat = new THREE.LineBasicMaterial({ color: 0x55657a });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-L / 2 - 0.3, 0, 0), new THREE.Vector3(L / 2 + 0.6, 0, 0)]), axisMat));
    eMat = new THREE.LineBasicMaterial({ color: 0x40c4e6 });
    eLine = new THREE.Line(new THREE.BufferGeometry(), eMat);
    bLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff6a55 }));
    eStems = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x40c4e6, transparent: true, opacity: 0.35 }));
    bStems = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff6a55, transparent: true, opacity: 0.35 }));
    scene.add(eLine, bLine, eStems, bStems);
    const le = textSprite(THREE, 'Electric field E', { color: '#c9d3de', scale: 0.28 }); le.position.set(-L / 2 - 0.2, 1.45, 0); scene.add(le);
    const lb = textSprite(THREE, 'Magnetic field B', { color: '#ff8a78', scale: 0.28 }); lb.position.set(-L / 2 + 0.2, 0, 1.5); scene.add(lb);
    const lx = textSprite(THREE, 'direction of travel', { color: '#94a1b0', scale: 0.24 }); lx.position.set(L / 2 - 0.2, -0.3, 0); scene.add(lx);
    const lam = textSprite(THREE, 'λ', { color: '#e6ebf0', scale: 0.4, font: 'italic 500 48px "Fraunces", serif' }); lam.position.set(-L / 2 + L / CYCLES * 0.75, -1.62, 0); scene.add(lam);
    const brk = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-L / 2 + L / CYCLES * 0.25, -1.3, 0), new THREE.Vector3(-L / 2 + L / CYCLES * 1.25, -1.3, 0)]), new THREE.LineBasicMaterial({ color: 0xe6ebf0 }));
    scene.add(brk);
  }

  function waves(phase) {
    const e = [], b = [], es = [], bs = [];
    const k = (2 * Math.PI * CYCLES) / L;
    for (let i = 0; i <= N; i++) {
      const x = -L / 2 + (L * i) / N;
      const a = Math.sin(k * (x + L / 2) - phase);
      e.push(new THREE.Vector3(x, a, 0)); b.push(new THREE.Vector3(x, 0, a));
      if (i % 6 === 0) { es.push(x, 0, 0, x, a, 0); bs.push(x, 0, 0, x, 0, a); }
    }
    eLine.geometry.setFromPoints(e); bLine.geometry.setFromPoints(b);
    eStems.geometry.setAttribute('position', new THREE.Float32BufferAttribute(es, 3));
    bStems.geometry.setAttribute('position', new THREE.Float32BufferAttribute(bs, 3));
  }

  const ro = readouts([
    { key: 'lambda', label: 'Wavelength λ' },
    { key: 'nu', label: 'Frequency ν = c/λ' },
    { key: 'T', label: 'Period T = 1/ν' },
    { key: 'E', label: 'Energy per photon' },
    { key: 'eV', label: 'Same, in eV' },
    { key: 'mol', label: 'Energy per mole of photons' },
    { key: 'region', label: 'Region' },
  ]);
  const swatch = h('div', { style: { height: '10px', borderRadius: '3px', margin: '4px 0 14px', background: 'transparent', border: '1px solid var(--line)' } });

  function drawBar() {
    const w = bar.clientWidth || 600; const dpr = Math.min(2, devicePixelRatio || 1);
    bar.width = w * dpr; bar.height = 64 * dpr; bar.style.height = '64px';
    const c = bar.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const X = (lg) => ((lg + 16) / 20) * w;
    c.clearRect(0, 0, w, 64);
    for (const r of REGION_BLOCKS) {
      if (r.color === 'visible') {
        const g = c.createLinearGradient(X(r.from), 0, X(r.to), 0);
        for (let i = 0; i <= 10; i++) g.addColorStop(i / 10, P.rgbCss(P.wavelengthToRGB(400 + 35 * i)));
        c.fillStyle = g;
      } else c.fillStyle = r.color;
      c.fillRect(X(r.from), 8, X(r.to) - X(r.from), 26);
      if (r.name) { c.fillStyle = '#c9d3de'; c.font = '12px "IBM Plex Sans", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; if (X(r.to) - X(r.from) > 40) c.fillText(r.name, (X(r.from) + X(r.to)) / 2, 21); }
    }
    c.fillStyle = '#6a7784'; c.font = '11px "IBM Plex Sans", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
    for (let lg = -16; lg <= 4; lg += 2) { const x = X(lg); c.fillRect(x, 34, 1, 5); c.fillText(`10${toSup(lg)} m`, Math.min(w - 20, Math.max(20, x)), 41); }
    const x = X(state.log);
    c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x, 6); c.lineTo(x - 6, 0); c.lineTo(x + 6, 0); c.closePath(); c.fill();
    c.fillRect(x - 1, 6, 2, 30);
  }
  const toSup = (n) => String(n).split('').map((ch) => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' })[ch]).join('');

  function setFromBar(e) {
    const r = bar.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    state.log = -16 + 20 * f; sl.set(state.log); update();
  }
  let dragging = false;
  bar.addEventListener('pointerdown', (e) => { dragging = true; bar.setPointerCapture(e.pointerId); setFromBar(e); });
  bar.addEventListener('pointermove', (e) => { if (dragging) setFromBar(e); });
  bar.addEventListener('pointerup', () => { dragging = false; });
  new ResizeObserver(drawBar).observe(barWrap);

  function update() { update0(); ev.emit(snap()); }
  function update0() {
    const lambda = Math.pow(10, state.log);
    const nu = P.frequencyFromWavelength(lambda);
    const E = P.photonEnergy(lambda);
    const nm = lambda / P.NM;
    ro.set('lambda', P.formatLength(lambda));
    ro.set('nu', `${P.sci(nu, 4)} s⁻¹`);
    ro.set('T', `${P.sci(1 / nu, 4)} s`);
    ro.set('E', `${P.sci(E, 4)} J`);
    ro.set('eV', `${P.sci(E / P.EV, 4)} eV`);
    ro.set('mol', `${P.sci(P.molarPhotonEnergy(lambda) / 1000, 4)} kJ mol⁻¹`);
    const col = P.colourName(nm);
    ro.set('region', `${P.regionOf(lambda)}${col ? `, ${col}` : ''}`);
    if (col) { const rgb = P.wavelengthToRGB(nm); swatch.style.background = P.rgbCss(rgb); eMat?.color.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, THREE.SRGBColorSpace); }
    else { swatch.style.background = 'transparent'; eMat?.color.set(0x40c4e6); }
    drawBar();
  }

  const sl = slider({ label: 'Wavelength (log scale)', min: -16, max: 4, step: 0.005, value: state.log, format: (v) => P.formatLength(Math.pow(10, v)), onInput: (v) => { state.log = v; update(); } });
  const presets = h('div', { class: 'btn-row' }, PRESETS.map((p) => button(p.label, () => { state.log = Math.log10(p.lambda); sl.set(state.log); update(); }, 'small')));
  const controls = h('div', {}, sl, swatch, presets, ro);

  if (stage) stage.start((dt) => { state.t += dt * 2.2; waves(state.t); });
  update();
  return { onChange: ev.on, getState: () => snap(), el, controls, title: 'Electromagnetic wave', sub: 'Change λ and watch ν and E follow', dispose: () => stage?.dispose() };
}
