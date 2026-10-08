// Lesson 2.5: de Broglie wavelength calculator with a size ruler, and electron diffraction.
import { h, slider, select, readouts, button, segmented } from '../ui/dom.js';
import * as P from '../core/physics.js';

const OBJECTS = [
  { id: 'e', name: 'Electron', m: P.C.me },
  { id: 'p', name: 'Proton', m: P.C.mp },
  { id: 'he', name: 'Helium atom', m: 6.646e-27 },
  { id: 'ball', name: 'Baseball (0.145 kg)', m: 0.145 },
  { id: 'car', name: 'Car (2000 kg)', m: 2000 },
];
const SIZES = [
  { m: 1.7e-15, label: 'proton' },
  { m: 1e-10, label: 'atom' },
  { m: 5e-7, label: 'visible light' },
  { m: 7e-5, label: 'human hair' },
];

export function createCalculator({ obj = 'e', v = 1e6 } = {}) {
  const ruler = h('canvas', { class: 'canvas-stage', 'aria-label': 'Log scale of lengths with the de Broglie wavelength marked' });
  const big = h('p', { class: 'big-readout', style: { margin: '0 0 4px' } });
  const sub = h('p', { style: { color: 'var(--muted)', margin: 0, fontSize: '14.5px' } });
  const el = h('div', { class: 'pad' }, big, sub, h('div', { style: { height: '12px' } }), ruler);
  const state = { obj, logv: Math.log10(v) };
  const LO = -40, HI = 0;

  function draw(lambda) {
    const w = el.clientWidth - 32 || 600, hh = 110, dpr = Math.min(2, devicePixelRatio || 1);
    ruler.width = w * dpr; ruler.height = hh * dpr; ruler.style.height = `${hh}px`;
    const c = ruler.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, hh);
    const X = (m) => ((Math.log10(m) - LO) / (HI - LO)) * (w - 20) + 10;
    c.strokeStyle = '#3a4757'; c.beginPath(); c.moveTo(10, 60); c.lineTo(w - 10, 60); c.stroke();
    c.font = '11px "IBM Plex Sans", sans-serif'; c.fillStyle = '#6a7784'; c.textAlign = 'center';
    for (let e = LO; e <= HI; e += 5) { const x = X(10 ** e); c.fillRect(x, 56, 1, 8); c.textAlign = e === LO ? 'left' : e === HI ? 'right' : 'center'; c.fillText(`10${sup(e)} m`, e === LO ? x - 4 : e === HI ? x + 4 : x, 80); }
    c.fillStyle = '#94a1b0'; c.font = '12px "IBM Plex Sans", sans-serif';
    SIZES.forEach((s, i) => { const x = X(s.m); c.fillStyle = '#55657a'; c.fillRect(x - 0.5, 44, 1, 16); c.fillStyle = '#94a1b0'; c.save(); c.translate(x, 40); c.rotate(-0.6); c.textAlign = 'left'; c.fillText(s.label, 0, 0); c.restore(); void i; });
    const xl = Math.max(10, Math.min(w - 10, X(lambda)));
    c.fillStyle = '#40c4e6'; c.beginPath(); c.moveTo(xl, 64); c.lineTo(xl - 6, 76); c.lineTo(xl + 6, 76); c.fill();
    c.font = '12.5px "IBM Plex Sans", sans-serif'; c.textAlign = xl > w * 0.8 ? 'right' : 'left';
    c.fillText('λ', xl + (xl > w * 0.8 ? -8 : 8), 98);
  }
  const sup = (n) => String(n).split('').map((ch) => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' })[ch]).join('');

  const ro = readouts([
    { key: 'm', label: 'Mass, m' },
    { key: 'v', label: 'Speed, v' },
    { key: 'p', label: 'Momentum, p = mv' },
    { key: 'l', label: 'λ = h/mv' },
  ]);
  function update() {
    const o = OBJECTS.find((x) => x.id === state.obj);
    const v = 10 ** state.logv;
    const lambda = P.deBroglie(o.m, v);
    big.textContent = `λ = ${lambda > 1e-15 ? P.formatLength(lambda, 3) : P.sci(lambda, 3) + ' m'}`;
    const atom = lambda / 1e-10;
    sub.textContent = atom > 0.1 && atom < 100
      ? `About ${atom.toPrecision(2)} times the size of an atom. Waves this size diffract off crystals.`
      : atom >= 100 ? 'Much larger than an atom.' : `${P.sci(1 / atom, 2)} times smaller than an atom. No gap is narrow enough to show diffraction.`;
    ro.set('m', `${P.sci(o.m, 4)} kg`);
    ro.set('v', `${P.sci(v, 3)} m s⁻¹${v > 3e7 && o.id === 'e' ? ' (relativity starts to matter)' : ''}`);
    ro.set('p', `${P.sci(o.m * v, 3)} kg m s⁻¹`);
    ro.set('l', `${P.sci(lambda, 4)} m`);
    draw(lambda);
  }
  const resizeObs = new ResizeObserver(update); resizeObs.observe(el);
  const sp = slider({ label: 'Speed', min: -1, max: 8, step: 0.01, value: state.logv, format: (v) => `${P.sci(10 ** v, 3)} m s⁻¹`, onInput: (v) => { state.logv = v; update(); } });
  const controls = h('div', {},
    select({ label: 'Object', options: OBJECTS.map((o) => ({ value: o.id, label: o.name })), value: state.obj, onChange: (v) => { state.obj = v; update(); } }),
    sp,
    h('div', { class: 'btn-row' }, button('10 m/s', () => { state.logv = 1; sp.set(1); update(); }, 'small'), button('Highway speed', () => { state.logv = Math.log10(28); sp.set(state.logv); update(); }, 'small'), button('Electron in an atom', () => { state.obj = 'e'; state.logv = Math.log10(2.19e6); sp.set(state.logv); controls.querySelector('select').value = 'e'; update(); }, 'small')),
    ro);
  update();
  return { el, controls, title: 'de Broglie wavelength', sub: 'Any moving mass has a wavelength', dispose: () => resizeObs.disconnect() };
}

export function createDiffraction() {
  const side = h('canvas', { class: 'canvas-stage', 'aria-label': 'Side view of electron gun, foil and screen' });
  const screen = h('canvas', { 'aria-label': 'Detector screen showing where electrons landed', style: { width: '100%', aspectRatio: '1', background: '#05070a', borderRadius: '4px' } });
  const el = h('div', { class: 'widget-row' }, h('div', { class: 'pad' }, side), h('div', { class: 'pad' }, screen));
  const state = { particle: 'e', V: 150, d: 0.21, rate: 120, hits: [], fired: 0 };
  let raf = 0, last = performance.now(), acc = 0, visible = true;
  const flights = [];

  const lambda = () => state.particle === 'e' ? P.electronWavelength(state.V, false) : P.deBroglie(0.145, 40);
  // Ring angles from the Bragg condition, 2d sin(theta) = n lambda; the beam is turned through 2 theta.
  const rings = () => {
    const l = lambda(), out = [];
    for (const n of [1, 2]) { const s = (n * l) / (2 * state.d * 1e-9); if (s < 1) out.push({ n, two: 2 * Math.asin(s) }); }
    return out;
  };
  const D = 1; // screen distance (scaled so the screen half-width is 1)
  const ringR = (two) => D * Math.tan(two) * 1.2;

  function sampleHit() {
    const rs = rings();
    const r = Math.random();
    let rad = 0, sd = 0.02;
    if (r < 0.28 || !rs.length) { rad = Math.abs(gauss()) * 0.03; }
    else if (r < 0.82 || rs.length < 2) { rad = ringR(rs[0].two); sd = 0.025; }
    else { rad = ringR(rs[1].two); sd = 0.03; }
    rad += gauss() * sd * (rad > 0.05 ? 1 : 0);
    const a = Math.random() * Math.PI * 2;
    return [Math.cos(a) * rad, Math.sin(a) * rad];
  }
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  function sizeCanvases() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = side.parentElement.clientWidth - 32 || 300, hh = Math.round(w * 0.8);
    side.width = w * dpr; side.height = hh * dpr; side.style.height = `${hh}px`;
    const sw = screen.parentElement.clientWidth - 32 || 300;
    screen.width = sw * dpr; screen.height = sw * dpr;
    redrawScreen();
  }
  function redrawScreen() {
    const c = screen.getContext('2d'); const W = screen.width;
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#05070a'; c.fillRect(0, 0, W, W);
    c.fillStyle = 'rgba(120,220,255,0.55)';
    for (const [x, y] of state.hits) plot(c, W, x, y);
  }
  const plot = (c, W, x, y) => { const px = W / 2 + (x / 1.05) * (W / 2), py = W / 2 + (y / 1.05) * (W / 2); c.fillRect(px - 1, py - 1, 2.2, 2.2); };

  function frame(now) {
    raf = 0; if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    acc += dt * state.rate;
    const sc = screen.getContext('2d'); sc.setTransform(1, 0, 0, 1, 0, 0); sc.fillStyle = 'rgba(120,220,255,0.55)';
    while (acc >= 1 && state.hits.length < 12000) {
      acc -= 1; const hit = sampleHit(); state.hits.push(hit); state.fired++; plot(sc, screen.width, hit[0], hit[1]);
      if (flights.length < 30) flights.push({ t: 0, hit });
    }
    // side view
    const c = side.getContext('2d'); const dpr = Math.min(2, devicePixelRatio || 1);
    const w = side.width / dpr, hh = side.height / dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, hh);
    const cy = hh / 2, gunX = 12, foilX = w * 0.38, scrX = w - 18;
    c.fillStyle = '#2b3747'; c.fillRect(gunX, cy - 14, 46, 28); c.fillStyle = '#94a1b0'; c.font = '12px "IBM Plex Sans", sans-serif'; c.textAlign = 'center';
    c.fillText(state.particle === 'e' ? 'electron gun' : 'pitching machine', gunX + 23, cy + 32);
    c.fillStyle = '#7d8b9c'; c.fillRect(foilX - 2, cy - hh * 0.32, 4, hh * 0.64); c.fillText('metal foil', foilX, cy - hh * 0.36);
    c.fillStyle = '#3a4757'; c.fillRect(scrX, 10, 6, hh - 20); c.fillText('screen', scrX - 10, hh - 4);
    // ring rays
    c.strokeStyle = 'rgba(64,196,230,0.18)';
    for (const r of rings()) {
      const yoff = Math.tan(r.two) * (scrX - foilX);
      for (const s of [1, -1]) { c.beginPath(); c.moveTo(foilX, cy); c.lineTo(scrX, cy + s * Math.min(hh, yoff)); c.stroke(); }
    }
    c.fillStyle = '#c9eefa';
    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]; f.t += dt * 1.6;
      let x, y;
      if (f.t < 0.5) { x = gunX + 46 + (foilX - gunX - 46) * (f.t / 0.5); y = cy; }
      else { const k = (f.t - 0.5) / 0.5; x = foilX + (scrX - foilX) * k; y = cy + f.hit[1] / 1.05 * (hh / 2 - 12) * k; }
      if (f.t >= 1) { flights.splice(i, 1); continue; }
      c.beginPath(); c.arc(x, y, 2.2, 0, Math.PI * 2); c.fill();
    }
    ro.set('n', state.fired.toLocaleString('en-CA'));
    raf = requestAnimationFrame(frame);
  }

  const ro = readouts([
    { key: 'l', label: 'de Broglie wavelength' },
    { key: 'ratio', label: 'λ compared with spacing d' },
    { key: 'ang', label: 'First ring angle, 2θ' },
    { key: 'n', label: 'Particles detected' },
  ]);
  function update() {
    const l = lambda(); const rs = rings();
    ro.set('l', P.sci(l, 3) + ' m');
    ro.set('ratio', `λ/d = ${P.sci(l / (state.d * 1e-9), 2)}`);
    ro.set('ang', rs.length ? `${(rs[0].two * 180 / Math.PI).toFixed(1)}°` : 'no ring (λ > 2d)');
    if (state.particle === 'ball') ro.set('ang', '≈ 0°, every ball lands in one spot');
    vSl.hidden = state.particle !== 'e';
  }
  function clear() { state.hits = []; state.fired = 0; redrawScreen(); }

  const vSl = slider({ label: 'Accelerating voltage', min: 20, max: 600, step: 5, value: state.V, format: (v) => `${v} V`, onInput: (v) => { state.V = v; clear(); update(); } });
  const controls = h('div', {},
    segmented({ label: 'Fire', options: [{ value: 'e', label: 'Electrons' }, { value: 'ball', label: 'Baseballs' }], value: 'e', onChange: (v) => { state.particle = v; clear(); update(); } }),
    vSl,
    slider({ label: 'Atom spacing in the foil, d', min: 0.1, max: 0.4, step: 0.005, value: state.d, format: (v) => `${(v * 1000).toFixed(0)} pm`, onInput: (v) => { state.d = v; clear(); update(); } }),
    slider({ label: 'Firing rate', min: 10, max: 600, step: 10, value: state.rate, format: (v) => `${v} per second`, onInput: (v) => { state.rate = v; } }),
    h('div', { class: 'btn-row' }, button('Clear screen', clear, 'small')),
    ro,
    h('p', { class: 'ctl-hint' }, 'Each particle lands at one point, like a particle. Only after many arrive does the ring pattern of a wave appear. Higher voltage means faster electrons, a shorter wavelength and smaller rings.'));

  const resizeObs = new ResizeObserver(sizeCanvases); resizeObs.observe(el);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }); io.observe(el);
  update();
  raf = requestAnimationFrame(frame);
  return { el, controls, title: 'Electron diffraction', sub: 'Fire particles at a thin crystal', dispose() { cancelAnimationFrame(raf); resizeObs.disconnect(); io.disconnect(); } };
}
