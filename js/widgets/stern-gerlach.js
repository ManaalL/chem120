// Lesson 2.9: Stern-Gerlach. A beam of H atoms passes a non-uniform magnetic field and
// splits into two (quantum result) instead of smearing out (classical expectation).
import { h, slider, segmented, readouts, button, bus } from '../ui/dom.js';

export function create() {
  const side = h('canvas', { class: 'canvas-stage', 'aria-label': 'Side view of the Stern-Gerlach apparatus' });
  const screen = h('canvas', { 'aria-label': 'Collector screen, front view', style: { width: '100%', aspectRatio: '1', background: '#05070a', borderRadius: '4px', display: 'block' } });
  const el = h('div', { class: 'widget-row', style: { gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)' } }, h('div', { class: 'pad' }, side), h('div', { class: 'pad' }, h('p', { class: 'graph-title', style: { margin: '0 0 6px' } }, 'Collector screen, front view'), screen));
  const state = { grad: 0.8, mode: 'quantum', hits: [], up: 0, down: 0 };
  const ev = bus();
  const snap = () => ({ mode: state.mode, grad: state.grad, total: state.up + state.down });
  const atoms = [];
  let raf = 0, last = performance.now(), acc = 0, visible = true, emitTick = 0;
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  // Final vertical offset on the screen as a fraction of the screen half-height.
  function deflection() {
    if (state.mode === 'quantum') {
      const s = Math.random() < 0.5 ? 1 : -1;
      return { s, y: s * 0.62 * state.grad };
    }
    // classical: a magnet pointing any direction gives a continuous spread (cos of a random tilt)
    const c = 2 * Math.random() - 1;
    return { s: c >= 0 ? 1 : -1, y: c * 0.62 * state.grad };
  }

  function size() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = side.parentElement.clientWidth - 32 || 400, hh = Math.round(Math.max(200, w * 0.5));
    side.width = w * dpr; side.height = hh * dpr; side.style.height = `${hh}px`;
    const sw = screen.clientWidth || 200; screen.width = screen.height = sw * dpr;
    redraw();
  }
  function plotHit(c, W, x, y) {
    c.fillRect(W / 2 + x * W * 0.42 - 1, W / 2 - y * W * 0.46 - 1, 2.2, 2.2);
  }
  function redraw() {
    const c = screen.getContext('2d'), W = screen.width;
    c.fillStyle = '#05070a'; c.fillRect(0, 0, W, W);
    c.strokeStyle = '#1f2833'; c.beginPath(); c.moveTo(0, W / 2); c.lineTo(W, W / 2); c.stroke();
    c.fillStyle = 'rgba(255,190,120,0.6)';
    for (const [x, y] of state.hits) plotHit(c, W, x, y);
  }

  function frame(now) {
    raf = 0; if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    acc += dt * 90;
    while (acc >= 1) { acc -= 1; const d = deflection(); atoms.push({ t: 0, d, x0: gauss() * 0.12, jitter: gauss() * 0.025 }); }
    const dpr = Math.min(2, devicePixelRatio || 1);
    const c = side.getContext('2d'); const w = side.width / dpr, hh = side.height / dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, hh);
    const cy = hh / 2, ovenX = 10, slitX = w * 0.16, magA = w * 0.27, magB = w * 0.62, scrX = w - 14;
    c.font = '12px "IBM Plex Sans", sans-serif'; c.textAlign = 'center'; c.fillStyle = '#94a1b0';
    c.fillStyle = '#3d2522'; c.fillRect(ovenX, cy - 18, 40, 36); c.fillStyle = '#c9d3de'; c.fillText('oven', ovenX + 20, cy + 4);
    c.fillStyle = '#3a4757'; c.fillRect(slitX, cy - 40, 4, 34); c.fillRect(slitX, cy + 6, 4, 34);
    // magnet: pointed north pole above, flat south pole below
    const gap = 30;
    c.fillStyle = '#5a2a28'; c.beginPath(); c.moveTo(magA, cy - gap - 46); c.lineTo(magB, cy - gap - 46); c.lineTo(magB, cy - gap - 12); c.lineTo((magA + magB) / 2, cy - gap + 6); c.lineTo(magA, cy - gap - 12); c.closePath(); c.fill();
    c.fillStyle = '#23384a'; c.fillRect(magA, cy + gap, magB - magA, 40);
    c.fillStyle = '#e4e9ee'; c.fillText('N', (magA + magB) / 2, cy - gap - 22); c.fillText('S', (magA + magB) / 2, cy + gap + 25);
    c.fillStyle = '#6a7784'; c.fillText(state.grad > 0 ? 'non-uniform field' : 'magnet off', (magA + magB) / 2, cy + gap + 58 > hh ? hh - 4 : cy + gap + 58);
    c.fillStyle = '#3a4757'; c.fillRect(scrX, 8, 6, hh - 16);
    // atoms
    const sc = screen.getContext('2d'); sc.fillStyle = 'rgba(255,190,120,0.6)';
    c.fillStyle = '#ffbe78';
    for (let i = atoms.length - 1; i >= 0; i--) {
      const a = atoms[i]; a.t += dt * 0.9;
      const x = ovenX + 40 + (scrX - ovenX - 40) * a.t;
      // vertical position: straight until the magnet, curving inside it, straight after
      const u = Math.min(1, Math.max(0, (x - magA) / (magB - magA)));
      const after = Math.max(0, (x - magB) / (scrX - magB));
      const yInMag = u * u * 0.3, yAfter = 0.3 + after * 0.7;
      const f = x < magB ? yInMag : yAfter;
      const y = cy - a.d.y * (hh / 2 - 14) * f;
      if (a.t >= 1) {
        atoms.splice(i, 1);
        const hx = a.x0, hy = a.d.y + a.jitter;
        state.hits.push([hx, hy]); if (a.d.s > 0) state.up++; else state.down++;
        if (state.hits.length > 9000) state.hits.shift();
        plotHit(sc, screen.width, hx, hy);
        continue;
      }
      c.globalAlpha = 0.85; c.beginPath(); c.arc(x, y, 1.8, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
    }
    const total = state.up + state.down;
    if (++emitTick % 15 === 0) ev.emit(snap());
    ro.set('total', total.toLocaleString('en-CA'));
    if (state.mode === 'quantum' && state.grad > 0) {
      ro.set('up', `${state.up.toLocaleString('en-CA')} (${total ? Math.round((100 * state.up) / total) : 0}%)`);
      ro.set('down', `${state.down.toLocaleString('en-CA')} (${total ? Math.round((100 * state.down) / total) : 0}%)`);
    } else { ro.set('up', state.grad > 0 ? 'spread out' : 'one spot'); ro.set('down', state.grad > 0 ? 'spread out' : 'one spot'); }
    raf = requestAnimationFrame(frame);
  }

  const ro = readouts([{ key: 'total', label: 'Atoms detected' }, { key: 'up', label: 'Upper spot (m<sub>s</sub> = +½)' }, { key: 'down', label: 'Lower spot (m<sub>s</sub> = −½)' }]);
  function clear() { state.hits = []; state.up = 0; state.down = 0; redraw(); }
  const controls = h('div', {},
    segmented({ label: 'Model', options: [{ value: 'quantum', label: 'What happens' }, { value: 'classical', label: 'Classical expectation' }], value: state.mode, onChange: (v) => { state.mode = v; clear(); } }),
    slider({ label: 'Field gradient', min: 0, max: 1, step: 0.01, value: state.grad, format: (v) => (v === 0 ? 'off' : `${Math.round(v * 100)}%`), onInput: (v) => { state.grad = v; }, onChange: () => clear() }),
    h('div', { class: 'btn-row' }, button('Clear screen', clear, 'small')),
    ro,
    h('p', { class: 'ctl-hint' }, 'If each atom were a tiny bar magnet pointing in a random direction, the beam would smear into a line. It splits into exactly two spots, about half the atoms in each.'));

  const resizeObs = new ResizeObserver(size); resizeObs.observe(el);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }); io.observe(el);
  raf = requestAnimationFrame(frame);
  return { onChange: ev.on, getState: () => snap(), el, controls, title: 'Stern-Gerlach experiment', sub: 'Send hydrogen atoms through a magnet', dispose() { cancelAnimationFrame(raf); resizeObs.disconnect(); io.disconnect(); } };
}
