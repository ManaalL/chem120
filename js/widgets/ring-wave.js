// Lesson 2.5: an electron wave wrapped around a ring only joins up with itself when a whole
// number of wavelengths fits. That is de Broglie's explanation of Bohr's allowed orbits.
import { h, slider, readouts, bus, reducedMotion } from '../ui/dom.js';

export function create({ k = 2.6 } = {}) {
  const canvas = h('canvas', { class: 'canvas-stage', 'aria-label': 'A wave drawn around a circular orbit' });
  const el = h('div', { style: { position: 'relative' } }, canvas);
  const state = { k };
  const ev = bus();
  const fits = () => Math.abs(state.k - Math.round(state.k)) < 0.03 && Math.round(state.k) >= 1;
  const snap = () => ({ k: state.k, fits: fits(), n: Math.round(state.k) });
  let raf = 0, t = 0, last = performance.now(), visible = true;

  function draw() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = el.clientWidth || 600, H = Math.round(Math.min(420, Math.max(280, W * 0.6)));
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = `${H}px`; }
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 + 6, R = Math.min(W, H) * 0.32, A = R * 0.16;
    const ok = fits();
    // orbit and nucleus
    c.strokeStyle = 'rgba(148,161,176,0.35)'; c.setLineDash([4, 5]); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#ff6a55'; c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.fill();
    // the wave: amplitude oscillates in time; for a non-integer k the end does not meet the start
    const amp = A * (reducedMotion() ? 1 : Math.cos(t * 2.2));
    c.lineWidth = 3; c.strokeStyle = ok ? '#40c4e6' : '#f2c14e'; c.beginPath();
    const N = 600;
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2;
      const r = R + amp * Math.sin(state.k * th);
      const x = cx + r * Math.cos(th - Math.PI / 2), y = cy + r * Math.sin(th - Math.PI / 2);
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
    if (!ok) {
      // show the mismatch where the wave meets its own start
      const rEnd = R + amp * Math.sin(state.k * Math.PI * 2);
      const y0 = cy - R, y1 = cy - rEnd;
      c.strokeStyle = '#ff6a55'; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - 10, y0); c.lineTo(cx + 10, y0); c.moveTo(cx, y0); c.lineTo(cx, y1); c.stroke();
      c.fillStyle = '#ff6a55'; c.font = '13px "IBM Plex Sans", sans-serif'; c.textAlign = 'left';
      c.fillText('the ends don\'t meet', cx + 14, Math.min(y0, y1) - 6);
    }
    c.fillStyle = ok ? '#6fd39a' : '#f2c14e'; c.font = '500 15px "IBM Plex Sans", sans-serif'; c.textAlign = 'center';
    c.fillText(ok ? `${Math.round(state.k)} whole wavelength${Math.round(state.k) === 1 ? '' : 's'}: the wave joins up and keeps itself going` : `${state.k.toFixed(2)} wavelengths: the wave cancels itself out`, cx, 22);
  }
  function frame(now) {
    raf = 0; if (!visible) return;
    t += Math.min(0.05, (now - last) / 1000); last = now;
    draw();
    raf = requestAnimationFrame(frame);
  }
  const ro = readouts([{ key: 'k', label: 'Wavelengths around the orbit' }, { key: 'fit', label: 'Allowed orbit?' }, { key: 'L', label: 'Angular momentum, m<sub>e</sub>vr' }]);
  function update() {
    const ok = fits();
    ro.set('k', state.k.toFixed(2));
    ro.set('fit', ok ? `Yes, n = ${Math.round(state.k)}` : 'No');
    ro.set('L', ok ? `${Math.round(state.k)} × h/2π` : 'not a whole multiple of h/2π');
    draw();
    ev.emit(snap());
  }
  const sl = slider({ label: 'Number of wavelengths that fit around the orbit', min: 0.5, max: 6.5, step: 0.01, value: state.k, format: (v) => v.toFixed(2), onInput: (v) => { state.k = v; update(); } });
  const controls = h('div', {}, sl, ro, h('p', { class: 'ctl-hint' }, 'Drag slowly. The wave only closes on itself at whole numbers. The slider snaps a little near them.'));
  sl.input.addEventListener('change', () => { const r = Math.round(state.k); if (Math.abs(state.k - r) < 0.08 && r >= 1) { state.k = r; sl.set(r); update(); } });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });
  io.observe(el);
  const rs = new ResizeObserver(draw); rs.observe(el);
  update();
  raf = requestAnimationFrame(frame);
  return { onChange: ev.on, getState: snap, el, controls, dispose() { cancelAnimationFrame(raf); io.disconnect(); rs.disconnect(); } };
}
