// Lesson 2.3 (ii): photoelectric effect. Animated light hitting a metal, live energy balance,
// and the plot of electron kinetic energy against frequency whose slope is h.
import { h, slider, select, toggle, readouts } from '../ui/dom.js';
import { Plot } from '../ui/plot.js';
import * as P from '../core/physics.js';

export function create({ metal = 'Na', lambda = 400 } = {}) {
  const canvas = h('canvas', { class: 'canvas-stage', 'aria-label': 'Light striking a metal surface and ejecting electrons' });
  const plotHolder = h('div', { class: 'pad' });
  const msg = h('p', { class: 'viewport-badge', style: { position: 'absolute', left: 'auto', right: '14px', top: '34px', maxWidth: '52%', textAlign: 'right', color: 'var(--warn)' } });
  const anim = h('div', { style: { position: 'relative' } }, canvas, msg);
  const el = h('div', {}, anim, h('div', { style: { borderTop: '1px solid var(--line)' } }, plotHolder));
  const plot = new Plot(plotHolder, { aspect: 0.42, xLabel: 'Frequency ν (10¹⁴ s⁻¹)', yLabel: 'KE (10⁻¹⁹ J)', ariaLabel: 'Kinetic energy of ejected electrons against light frequency' });

  const state = { metal, lambda, intensity: 0.6, others: false };
  const photons = [], electrons = [];
  let raf = 0, last = performance.now(), spawn = 0, W = 600, Hh = 260, visible = true;

  const metalObj = () => P.METALS.find((m) => m.id === state.metal);
  const calc = () => P.photoelectric(state.lambda * P.NM, metalObj().w * P.EV);

  const ro = readouts([
    { key: 'E', label: 'Photon energy, hν' },
    { key: 'w', label: 'Work function, w' },
    { key: 'th', label: 'Threshold λ<sub>0</sub> (ν<sub>0</sub>)' },
    { key: 'ke', label: 'Electron KE = hν − w' },
    { key: 'v', label: 'Electron speed' },
    { key: 'vs', label: 'Stopping voltage' },
  ]);

  function size() {
    W = anim.clientWidth || 600; Hh = Math.round(Math.max(220, Math.min(320, W * 0.42)));
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = Hh * dpr; canvas.style.height = `${Hh}px`;
    canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ro2 = new ResizeObserver(size); ro2.observe(anim);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });
  io.observe(anim);

  function frame(now) {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const c = canvas.getContext('2d');
    const res = calc();
    const rgb = P.wavelengthToRGB(state.lambda);
    const visibleLight = state.lambda >= 380 && state.lambda <= 780;
    const photonColour = visibleLight ? P.rgbCss(rgb) : state.lambda < 380 ? '#b9a8ff' : '#ff9b8a';
    // Geometry: lamp at upper left, metal slab lying flat near the bottom (as in the usual schematic).
    const plateL = W * 0.38, plateR = W * 0.7, plateY = Hh * 0.8;
    const lampX = 16, lampY = 18;

    // spawn photons in proportion to intensity; each heads for a random point on the slab
    spawn += dt * state.intensity * 26;
    while (spawn >= 1) {
      spawn -= 1;
      photons.push({ x: lampX + 30 + Math.random() * 10, y: lampY + 6 + Math.random() * 34, tx: plateL + 10 + Math.random() * (plateR - plateL - 20), t: 0 });
    }

    c.clearRect(0, 0, W, Hh);
    // lamp
    c.fillStyle = '#1b232d'; c.fillRect(lampX, lampY, 34, 46);
    c.fillStyle = photonColour; c.globalAlpha = 0.25 + 0.6 * state.intensity; c.fillRect(lampX + 30, lampY, 4, 46); c.globalAlpha = 1;
    c.fillStyle = '#6a7784'; c.font = '12px "IBM Plex Sans", sans-serif'; c.textAlign = 'left'; c.fillText('light', lampX, lampY + 62);
    // beam glow
    c.globalAlpha = 0.06 + 0.06 * state.intensity; c.fillStyle = photonColour;
    c.beginPath(); c.moveTo(lampX + 34, lampY); c.lineTo(plateR, plateY); c.lineTo(plateL, plateY); c.lineTo(lampX + 34, lampY + 46); c.fill(); c.globalAlpha = 1;
    // metal slab
    c.fillStyle = '#4a5666'; c.fillRect(plateL, plateY, plateR - plateL, 16);
    c.fillStyle = '#94a1b0'; c.font = '13px "IBM Plex Sans", sans-serif'; c.textAlign = 'center';
    c.fillText(metalObj().name, (plateL + plateR) / 2, plateY + 32 > Hh - 2 ? Hh - 4 : plateY + 32);

    // photons travel to the plate
    const speed = 300;
    for (let i = photons.length - 1; i >= 0; i--) {
      const p = photons[i];
      const tx = p.tx, ty = plateY;
      const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
      if (d < speed * dt) {
        photons.splice(i, 1);
        if (res.ejected) {
          const vis = 60 + Math.min(420, res.speed / 4000);
          const ang = -Math.PI / 2 + (Math.random() - 0.3) * 1.6;   // up and away from the surface
          electrons.push({ x: tx, y: ty - 2, vx: Math.cos(ang) * vis, vy: Math.sin(ang) * vis, life: 0 });
        }
        continue;
      }
      p.x += (dx / d) * speed * dt; p.y += (dy / d) * speed * dt; p.t += dt;
      // draw a short wiggle along the path
      c.strokeStyle = photonColour; c.lineWidth = 1.5; c.beginPath();
      for (let k = 0; k < 10; k++) {
        const s = k / 9, px = p.x - (dx / d) * 14 * s, py = p.y - (dy / d) * 14 * s;
        const off = Math.sin(s * Math.PI * 4 + p.t * 30) * 3;
        const nx = -dy / d, ny = dx / d;
        if (k === 0) c.moveTo(px + nx * off, py + ny * off); else c.lineTo(px + nx * off, py + ny * off);
      }
      c.stroke();
    }
    // electrons
    c.fillStyle = '#e6ebf0';
    for (let i = electrons.length - 1; i >= 0; i--) {
      const e = electrons[i];
      e.x += e.vx * dt; e.y += e.vy * dt; e.life += dt;
      if (e.x > W + 10 || e.y < -10 || e.y > Hh + 10) { electrons.splice(i, 1); continue; }
      c.beginPath(); c.arc(e.x, e.y, 3, 0, Math.PI * 2); c.fill();
    }
    c.fillStyle = '#94a1b0'; c.textAlign = 'right'; c.font = '12px "IBM Plex Sans", sans-serif';
    c.fillText(res.ejected ? 'white dots: ejected electrons' : '', W - 12, 20);
    raf = requestAnimationFrame(frame);
  }

  function update() {
    const m = metalObj(), res = calc();
    const nu = P.frequencyFromWavelength(state.lambda * P.NM);
    ro.set('E', `${P.sci(res.photonEnergy, 3)} J (${(res.photonEnergy / P.EV).toFixed(2)} eV)`);
    ro.set('w', `${P.sci(m.w * P.EV, 3)} J (${m.w.toFixed(2)} eV)`);
    ro.set('th', `${Math.round(res.thresholdWavelength / P.NM)} nm (${P.sci(res.thresholdFrequency, 3)} s⁻¹)`);
    ro.set('ke', res.ejected ? `${P.sci(res.ke, 3)} J` : 'none ejected');
    ro.set('v', res.ejected ? `${P.sci(res.speed, 3)} m s⁻¹` : '0');
    ro.set('vs', res.ejected ? `${res.stoppingVoltage.toFixed(2)} V` : '0');
    msg.innerHTML = res.ejected
      ? ''
      : `Each photon carries less energy than the work function. Brighter light sends more photons, but none can free an electron.`;

    // KE vs frequency (x in 1e14 Hz, y in 1e-19 J)
    const line = (mm) => { const nu0 = (mm.w * P.EV) / P.C.h / 1e14; return [[0, 0], [nu0, 0], [32, (P.C.h * (32 - nu0) * 1e14) / 1e-19]]; };
    const series = [];
    if (state.others) for (const mm of P.METALS) if (mm.id !== m.id) series.push({ data: line(mm), color: 'rgba(148,161,176,0.3)', width: 1 });
    series.push({ data: line(m), color: '#40c4e6', width: 2.5 });
    const x = nu / 1e14;
    plot.set({
      series,
      points: [{ x, y: res.ke / 1e-19, color: '#ff6a55', ring: '#0f1319', r: 6, label: `${state.lambda} nm` }],
      vlines: [{ x: res.thresholdFrequency / 1e14, color: 'rgba(223,231,239,0.5)', label: 'ν₀', dash: [3, 3] }],
      xRange: [0, 32], yRange: [-0.4, 14],
    });
  }

  const metalSel = select({ label: 'Metal', options: P.METALS.map((m) => ({ value: m.id, label: `${m.name} (w = ${m.w.toFixed(2)} eV)` })), value: state.metal, onChange: (v) => { state.metal = v; update(); } });
  const controls = h('div', {},
    metalSel,
    slider({ label: 'Wavelength of light', min: 100, max: 900, step: 1, value: state.lambda, format: (v) => `${v} nm`, onInput: (v) => { state.lambda = v; update(); } }),
    slider({ label: 'Intensity (brightness)', min: 0, max: 1, step: 0.01, value: state.intensity, format: (v) => `${Math.round(v * 100)}%`, onInput: (v) => { state.intensity = v; } }),
    toggle({ label: 'Show lines for the other metals', checked: false, onChange: (v) => { state.others = v; update(); } }),
    ro,
    h('p', { class: 'ctl-hint' }, 'Every metal\'s line has the same slope, Planck\'s constant h. Only the threshold ν₀ changes. Work functions are typical literature values; calcium uses the value from the module notes.'));

  size(); update();
  raf = requestAnimationFrame(frame);
  return {
    el, controls, title: 'Photoelectric effect', sub: 'Pick a metal, then change the light',
    dispose() { cancelAnimationFrame(raf); ro2.disconnect(); io.disconnect(); plot.dispose(); },
  };
}
