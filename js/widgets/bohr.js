// Lesson 2.4: Bohr atom with animated transitions beside an energy-level diagram.
import * as THREE from 'three';
import { createStage, textSprite } from '../ui/stage.js';
import { h, segmented, readouts, button, bus } from '../ui/dom.js';
import * as P from '../core/physics.js';

const NMAX = 6;
const rVis = (n) => 0.34 * Math.pow(n, 1.25);   // compressed; true radii grow as n^2

export function create({ ni = 3, nf = 2 } = {}) {
  const vp = h('div', { class: 'viewport', style: { aspectRatio: 'auto', height: '100%', minHeight: '380px' } }, h('p', { class: 'viewport-note' }, 'Orbit sizes are compressed. Real Bohr radii grow as n².'));
  const diag = h('canvas', { class: 'energy-diagram', 'aria-label': 'Energy level diagram for hydrogen' });
  const diagWrap = h('div', { style: { padding: '12px', position: 'relative' } }, diag);
  const el = h('div', { class: 'widget-row' }, vp, diagWrap);
  const state = { ni, nf, n: ni, anim: null, angle: 0 };
  const ev = bus();
  const snap = () => ({ ni: state.ni, nf: state.nf, last: state.lastRun || null });

  const stage = createStage(vp, { position: [0, -7.4, 6.8], target: [0, 0, 0], zUp: true, minDistance: 3, maxDistance: 14 });
  let electron, photon, photonMat, rings = [];
  if (stage) {
    const { scene } = stage;
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 16), new THREE.MeshStandardMaterial({ color: 0xff6a55, emissive: 0x401510 })));
    for (let n = 1; n <= NMAX; n++) {
      const g = new THREE.RingGeometry(rVis(n) - 0.006, rVis(n) + 0.006, 128);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x55657a, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }));
      scene.add(m); rings.push(m);
      const s = textSprite(THREE, `n = ${n}`, { scale: 0.2, color: '#94a1b0' });
      s.position.set(rVis(n) + 0.02, -0.05, 0.12); scene.add(s);
    }
    electron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 12), new THREE.MeshStandardMaterial({ color: 0x40c4e6, emissive: 0x0d3a48 }));
    scene.add(electron);
    photonMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    photon = new THREE.Line(new THREE.BufferGeometry(), photonMat);
    photon.visible = false; scene.add(photon);
  }

  const ro = readouts([
    { key: 'Ei', label: 'E<sub>i</sub> = −R<sub>H</sub>/n<sub>i</sub>²' },
    { key: 'Ef', label: 'E<sub>f</sub> = −R<sub>H</sub>/n<sub>f</sub>²' },
    { key: 'dE', label: 'ΔE = E<sub>f</sub> − E<sub>i</sub>' },
    { key: 'type', label: 'Photon is' },
    { key: 'lambda', label: 'Photon wavelength' },
    { key: 'series', label: 'Series' },
    { key: 'r', label: 'Orbit radius, n<sub>f</sub>² a<sub>0</sub>' },
  ]);

  function photonColour(t) {
    const nm = t.lambda / P.NM;
    if (nm >= 380 && nm <= 750) return P.wavelengthToRGB(nm);
    return nm < 380 ? [185, 168, 255] : [255, 155, 138];
  }

  function drawDiagram() {
    const w = diagWrap.clientWidth - 24 || 360, hh = 400, dpr = Math.min(2, devicePixelRatio || 1);
    diag.width = w * dpr; diag.height = hh * dpr; diag.style.height = `${hh}px`;
    const c = diag.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, hh);
    const top = 24, bottom = hh - 20;
    const Y = (E) => top + ((0 - E) / P.C.RH) * (bottom - top);  // E from 0 (top) to -RH (bottom)
    c.font = '12.5px "IBM Plex Sans", sans-serif';
    // zero line
    c.strokeStyle = '#3a4757'; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(60, Y(0)); c.lineTo(w - 10, Y(0)); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#6a7784'; c.textAlign = 'left'; c.fillText('E = 0 (n = ∞, electron removed)', 64, Y(0) - 6);
    for (let n = 1; n <= NMAX; n++) {
      const y = Y(P.levelEnergy(n));
      const active = n === state.ni || n === state.nf;
      c.strokeStyle = active ? '#e4e9ee' : '#55657a'; c.lineWidth = active ? 2 : 1.2;
      c.beginPath(); c.moveTo(60, y); c.lineTo(w - 130, y); c.stroke();
      // upper levels crowd together, so only label them when they are in use
      if (n <= 4 || active) { c.fillStyle = active ? '#e4e9ee' : '#94a1b0'; c.textAlign = 'right'; c.fillText(`n = ${n}`, 52, y + 4); }
      if (n <= 3 || active) { c.textAlign = 'left'; c.fillStyle = '#6a7784'; c.fillText(`${P.sci(P.levelEnergy(n), 3)} J`, w - 124, y + 4); }
    }
    if (state.ni !== state.nf) {
      const t = P.transition(state.ni, state.nf);
      const y1 = Y(P.levelEnergy(state.ni)), y2 = Y(P.levelEnergy(state.nf));
      const x = 60 + (w - 190) * 0.5;
      const col = P.rgbCss(photonColour(t));
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y2 + (y2 > y1 ? -8 : 8)); c.stroke();
      c.beginPath(); c.moveTo(x, y2); c.lineTo(x - 6, y2 + (y2 > y1 ? -10 : 10)); c.lineTo(x + 6, y2 + (y2 > y1 ? -10 : 10)); c.fill();
      c.textAlign = 'left'; c.fillText(`${Math.round(t.lambda / P.NM)} nm, ${t.type}`, x + 10, (y1 + y2) / 2 + 4);
    }
  }

  function update() { update0(); ev.emit(snap()); }
  function update0() {
    const t = P.transition(state.ni, state.nf);
    ro.set('Ei', `${P.sci(P.levelEnergy(state.ni), 4)} J`);
    ro.set('Ef', `${P.sci(P.levelEnergy(state.nf), 4)} J`);
    if (t.type === 'none') {
      ['dE', 'lambda', 'series'].forEach((k) => ro.set(k, 'none')); ro.set('type', 'no photon (same level)');
    } else {
      const nm = t.lambda / P.NM;
      const col = P.colourName(nm);
      ro.set('dE', `${P.sci(t.dE, 4)} J`);
      ro.set('type', t.type === 'emission' ? 'emitted (ΔE < 0)' : 'absorbed (ΔE > 0)');
      ro.set('lambda', `${nm.toFixed(1)} nm, ${t.region.toLowerCase()}${col ? ` (${col})` : ''}`);
      ro.set('series', `${t.series} (lower level n = ${Math.min(state.ni, state.nf)})`);
    }
    ro.set('r', `${Math.round(state.nf * state.nf * 52.9)} pm`);
    drawDiagram();
    rings.forEach((r, i) => { r.material.color.set(i + 1 === state.ni || i + 1 === state.nf ? 0xc9d3de : 0x55657a); });
  }

  function run() {
    if (state.ni === state.nf || !stage) return;
    const t = P.transition(state.ni, state.nf);
    const [r, g, b] = photonColour(t);
    photonMat.color.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    state.n = state.ni;
    state.anim = { t: 0, type: t.type, from: state.ni, to: state.nf };
  }

  function photonPath(origin, dir, len, phase) {
    const pts = [];
    const nrm = new THREE.Vector3(-dir.y, dir.x, 0);
    for (let i = 0; i <= 40; i++) {
      const s = i / 40;
      const p = origin.clone().addScaledVector(dir, s * len).addScaledVector(nrm, Math.sin(s * Math.PI * 6 + phase) * 0.06).add(new THREE.Vector3(0, 0, Math.cos(s * Math.PI * 6 + phase) * 0.03));
      pts.push(p);
    }
    photon.geometry.setFromPoints(pts);
  }

  if (stage) stage.start((dt) => {
    let radius = rVis(state.n);
    state.angle += dt * (2.4 / Math.pow(radius / 0.34, 1.5));
    const a = state.anim;
    if (a) {
      a.t += dt;
      const dirOut = new THREE.Vector3(Math.cos(state.angle), Math.sin(state.angle), 0);
      if (a.type === 'absorption') {
        // photon comes in, then the electron jumps up
        if (a.t < 0.9) {
          const pos = new THREE.Vector3(Math.cos(state.angle), Math.sin(state.angle), 0).multiplyScalar(rVis(a.from));
          const start = pos.clone().addScaledVector(dirOut, 3.2 * (1 - a.t / 0.9));
          photon.visible = true; photonPath(start, dirOut, 0.7, a.t * 30);
        } else {
          photon.visible = false;
          const f = Math.min(1, (a.t - 0.9) / 0.5);
          radius = rVis(a.from) + (rVis(a.to) - rVis(a.from)) * (f * f * (3 - 2 * f));
          if (f >= 1) { state.n = a.to; state.lastRun = { from: a.from, to: a.to, type: a.type, at: Date.now() }; state.anim = null; ev.emit(snap()); }
        }
      } else {
        // electron drops, then a photon leaves
        const f = Math.min(1, a.t / 0.5);
        radius = rVis(a.from) + (rVis(a.to) - rVis(a.from)) * (f * f * (3 - 2 * f));
        if (f >= 1) {
          const k = (a.t - 0.5) / 1.0;
          const pos = dirOut.clone().multiplyScalar(rVis(a.to));
          photon.visible = true; photonPath(pos.clone().addScaledVector(dirOut, 3.4 * k), dirOut, 0.7, a.t * 30);
          if (k >= 1) { photon.visible = false; state.n = a.to; state.lastRun = { from: a.from, to: a.to, type: a.type, at: Date.now() }; state.anim = null; ev.emit(snap()); }
        }
      }
    }
    electron.position.set(Math.cos(state.angle) * radius, Math.sin(state.angle) * radius, 0);
  });

  const opts = Array.from({ length: NMAX }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const segI = segmented({ label: 'Start level, n<sub>i</sub>', options: opts, value: state.ni, onChange: (v) => { state.ni = v; state.n = v; state.anim = null; if (photon) photon.visible = false; update(); } });
  const segF = segmented({ label: 'End level, n<sub>f</sub>', options: opts, value: state.nf, onChange: (v) => { state.nf = v; update(); } });
  segI.querySelector('.ctl-label').innerHTML = 'Start level, n<sub>i</sub>';
  segF.querySelector('.ctl-label').innerHTML = 'End level, n<sub>f</sub>';
  const presets = h('div', { class: 'btn-row' },
    [[3, 2], [4, 2], [5, 2], [6, 2], [2, 1], [1, 3]].map(([a, b]) => button(`${a}→${b}`, () => { state.ni = a; state.nf = b; state.n = a; segI.set(a); segF.set(b); update(); run(); }, 'small')));
  const controls = h('div', {}, segI, segF, h('div', { class: 'btn-row' }, button('Run transition', run, 'primary small')), h('p', { class: 'ctl-section' }, 'Quick picks'), presets, ro);

  const resizeObs = new ResizeObserver(drawDiagram); resizeObs.observe(diagWrap);
  update();
  return { onChange: ev.on, getState: () => snap(), el, controls, title: 'Bohr transitions', sub: 'Choose two levels, then run the jump', dispose() { stage?.dispose(); resizeObs.disconnect(); } };
}
