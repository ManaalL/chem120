// Hands-on question types: draw your guess on a graph, put things in order, match pairs.
import { h, typeset } from '../ui/dom.js';

const css = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
const card = (tag) => h('section', { class: 'activity' }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), tag));
const put = (ctx, el, wide) => { if (wide) el.classList.add('wide'); ctx.root.append(el); typeset(el); return el; };

/**
 * Draw your guess. The reader sketches a curve, then compares it with the real one.
 * truth(x) gives the real curve in plot units. Scoring compares shapes after scaling both
 * to the same height, so the reader is judged on shape, not on exact numbers.
 */
export function drawGuess(ctx, { q, prompt, xLabel, yLabel, x0, x1, y0 = 0, y1 = 1, truth, explain, xTicks = [], yZero = false, wide = true }) {
  const box = card('Draw your guess');
  box.append(h('p', { class: 'q', html: q }), h('p', { class: 'hint-line', html: prompt || 'Drag across the graph from left to right to sketch your curve.' }));
  const canvas = h('canvas', { role: 'img', 'aria-label': `Drawing area. ${xLabel} across, ${yLabel} up.` });
  const wrap = h('div', { class: 'draw-wrap' }, canvas);
  const legend = h('p', { class: 'draw-legend' }, h('span', {}, h('i', { style: { background: 'var(--violet)' } }), 'Your guess'));
  const fb = h('div', { class: 'feedback info', hidden: true });
  const reveal = h('button', { type: 'button', class: 'btn small primary', disabled: true }, 'Compare with the real curve');
  const clear = h('button', { type: 'button', class: 'btn small ghost' }, 'Clear and redraw');
  box.append(wrap, legend, h('div', { class: 'btn-row', style: { marginTop: '10px' } }, reveal, clear), fb);
  const N = 120;
  let guess = new Array(N + 1).fill(null);
  let shown = false;
  let W = 600, H = 300;
  const pad = { l: 44, r: 14, t: 14, b: 36 };
  const X = (i) => pad.l + (i / N) * (W - pad.l - pad.r);
  const Y = (v) => pad.t + (1 - (v - y0) / (y1 - y0)) * (H - pad.t - pad.b);
  const fromPx = (px, py) => {
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * N);
    const v = y0 + (1 - (py - pad.t) / (H - pad.t - pad.b)) * (y1 - y0);
    return [Math.max(0, Math.min(N, i)), Math.max(y0, Math.min(y1, v))];
  };
  const xOf = (i) => x0 + ((x1 - x0) * i) / N;

  function draw() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth || 600; H = Math.round(Math.max(220, Math.min(340, W * 0.5)));
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.height = `${H}px`;
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    const rule = css(canvas, '--rule'), muted = css(canvas, '--muted'), ink = css(canvas, '--ink');
    c.strokeStyle = rule; c.lineWidth = 1;
    for (let k = 0; k <= 4; k++) { const y = pad.t + (k / 4) * (H - pad.t - pad.b); c.beginPath(); c.moveTo(pad.l, y); c.lineTo(W - pad.r, y); c.stroke(); }
    c.strokeStyle = muted; c.beginPath(); c.moveTo(pad.l, pad.t); c.lineTo(pad.l, H - pad.b); c.lineTo(W - pad.r, H - pad.b); c.stroke();
    if (yZero) { c.setLineDash([4, 4]); c.beginPath(); c.moveTo(pad.l, Y(0)); c.lineTo(W - pad.r, Y(0)); c.stroke(); c.setLineDash([]); c.fillStyle = muted; c.textAlign = 'right'; c.font = '13px "Source Sans 3", sans-serif'; c.fillText('0', pad.l - 6, Y(0) + 4); }
    c.fillStyle = muted; c.font = '14px "Source Sans 3", sans-serif'; c.textAlign = 'center';
    c.fillText(xLabel, (pad.l + W - pad.r) / 2, H - 6);
    for (const t of xTicks) { const px = pad.l + ((t.x - x0) / (x1 - x0)) * (W - pad.l - pad.r); c.fillText(t.label, px, H - pad.b + 16); c.fillRect(px, H - pad.b, 1, 4); }
    c.save(); c.translate(14, (pad.t + H - pad.b) / 2); c.rotate(-Math.PI / 2); c.fillText(yLabel, 0, 0); c.restore();
    if (shown) {
      c.strokeStyle = ink; c.lineWidth = 3; c.beginPath();
      let first = true; let tmax = 0;
      for (let i = 0; i <= N; i++) tmax = Math.max(tmax, Math.abs(truth(xOf(i))));
      for (let i = 0; i <= 240; i++) { const x = x0 + ((x1 - x0) * i) / 240; const y = Y(truth(x)); const px = pad.l + (i / 240) * (W - pad.l - pad.r); if (first) { c.moveTo(px, y); first = false; } else c.lineTo(px, y); }
      c.stroke();
    }
    c.strokeStyle = css(canvas, '--violet'); c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath();
    let started = false;
    for (let i = 0; i <= N; i++) {
      if (guess[i] === null) { started = false; continue; }
      if (!started) { c.moveTo(X(i), Y(guess[i])); started = true; } else c.lineTo(X(i), Y(guess[i]));
    }
    c.stroke();
  }

  let drawing = false, last = null;
  canvas.addEventListener('pointerdown', (e) => { if (shown) return; drawing = true; canvas.setPointerCapture(e.pointerId); last = null; mark(e); });
  canvas.addEventListener('pointermove', (e) => { if (drawing) mark(e); });
  canvas.addEventListener('pointerup', () => { drawing = false; });
  function mark(e) {
    const r = canvas.getBoundingClientRect();
    const [i, v] = fromPx(e.clientX - r.left, e.clientY - r.top);
    if (last) { const [i0, v0] = last; const a = Math.min(i0, i), b = Math.max(i0, i); for (let k = a; k <= b; k++) guess[k] = b === a ? v : v0 + ((v - v0) * (k - i0)) / (i - i0); }
    else guess[i] = v;
    last = [i, v];
    reveal.disabled = guess.filter((g) => g !== null).length < N * 0.6;
    draw();
  }
  reveal.addEventListener('click', () => {
    shown = true; reveal.disabled = true;
    legend.append(h('span', {}, h('i', { style: { background: 'var(--ink)' } }), 'Real curve'));
    // fill small gaps, then compare shapes scaled to the same peak height
    const g = guess.slice();
    for (let i = 0; i <= N; i++) if (g[i] === null) { let a = i - 1; while (a >= 0 && g[a] === null) a--; let b = i + 1; while (b <= N && g[b] === null) b++; g[i] = a >= 0 && b <= N ? g[a] + ((g[b] - g[a]) * (i - a)) / (b - a) : a >= 0 ? g[a] : g[b]; }
    const t = g.map((_, i) => truth(xOf(i)));
    const gm = Math.max(...g.map(Math.abs)) || 1, tm = Math.max(...t.map(Math.abs)) || 1;
    let err = 0; for (let i = 0; i <= N; i++) err += Math.abs(g[i] / gm - t[i] / tm);
    err /= N + 1;
    const verdict = err < 0.12 ? 'Very close to the real shape.' : err < 0.25 ? 'You have the general idea. Compare where the curves differ.' : 'Quite different from the real curve. Look at what it does near each end.';
    fb.hidden = false; fb.innerHTML = `<p><b>${verdict}</b></p><p>${explain}</p>`;
    typeset(fb); draw();
  });
  clear.addEventListener('click', () => { guess = new Array(N + 1).fill(null); shown = false; reveal.disabled = true; fb.hidden = true; legend.replaceChildren(h('span', {}, h('i', { style: { background: 'var(--violet)' } }), 'Your guess')); draw(); });
  const ro = new ResizeObserver(draw); ro.observe(wrap);
  ctx.onCleanup?.(() => ro.disconnect());
  return put(ctx, box, wide);
}

/**
 * Put items in order. Drag with the handle, or use the arrow buttons.
 * items: [{ id, label }] in the correct order; they are shuffled for the reader.
 */
export function sortTask(ctx, { q, items, ends = ['', ''], explain }) {
  const box = card('Put these in order');
  box.append(h('p', { class: 'q', html: q }));
  let order = items.slice();
  do { order.sort(() => Math.random() - 0.5); } while (order.every((x, i) => x.id === items[i].id));
  const list = h('ol', { class: 'sort-list' });
  const fb = h('div', { class: 'feedback', hidden: true, 'aria-live': 'polite' });
  const checkBtn = h('button', { type: 'button', class: 'btn small primary' }, 'Check my order');
  box.append(h('p', { class: 'sort-ends' }, h('span', { html: `Top: ${ends[0]}` }), h('span', { html: `Bottom: ${ends[1]}` })), list, h('div', { class: 'btn-row', style: { marginTop: '10px' } }, checkBtn), fb);

  function render() {
    list.replaceChildren(...order.map((it, i) => {
      const up = h('button', { type: 'button', 'aria-label': `Move ${it.label} up`, disabled: i === 0 }, '↑');
      const dn = h('button', { type: 'button', 'aria-label': `Move ${it.label} down`, disabled: i === order.length - 1 }, '↓');
      up.addEventListener('click', () => { swap(i, i - 1); });
      dn.addEventListener('click', () => { swap(i, i + 1); });
      const li = h('li', { class: 'sort-item', 'data-id': it.id }, h('span', { class: 'grip', 'aria-hidden': 'true' }, '⠿'), h('span', { class: 'lbl', html: it.label }), h('span', { class: 'mv' }, up, dn));
      li.querySelector('.grip').addEventListener('pointerdown', (e) => startDrag(e, li, i));
      return li;
    }));
    typeset(list);
  }
  function swap(a, b) { [order[a], order[b]] = [order[b], order[a]]; fb.hidden = true; render(); list.children[b]?.querySelector(b < a ? '.mv button' : '.mv button:last-child')?.focus(); }
  function startDrag(e, li, from) {
    e.preventDefault();
    li.classList.add('dragging');
    const move = (ev) => {
      const rows = [...list.children];
      const y = ev.clientY;
      let to = rows.findIndex((r) => { const b = r.getBoundingClientRect(); return y < b.top + b.height / 2; });
      if (to === -1) to = rows.length - 1;
      const cur = order.findIndex((x) => x.id === li.dataset.id);
      if (to !== cur) { const [it] = order.splice(cur, 1); order.splice(to, 0, it); const ids = order.map((x) => x.id); rows.sort((a, b) => ids.indexOf(a.dataset.id) - ids.indexOf(b.dataset.id)).forEach((r) => list.append(r)); }
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); fb.hidden = true; render(); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    void from;
  }
  checkBtn.addEventListener('click', () => {
    let right = 0;
    [...list.children].forEach((li, i) => { const ok = li.dataset.id === items[i].id; li.classList.toggle('right', ok); li.classList.toggle('wrong', !ok); if (ok) right++; });
    fb.hidden = false;
    const all = right === items.length;
    fb.className = `feedback ${all ? 'ok' : 'no'}`;
    fb.innerHTML = all ? `<p><b>All in the right order.</b> ${explain}</p>` : `<p><b>${right} of ${items.length} in the right place.</b> The green ones are correct. Move the red ones and check again.</p>`;
    typeset(fb);
  });
  render();
  return put(ctx, box);
}

/**
 * Match pairs. Tap an item on the left, then its partner on the right.
 * pairs: [{ a: html, b: html }]; the right column is shuffled.
 */
const PAIR_COLOURS = ['#0b6e8a', '#c23f2a', '#5b48c8', '#18784b', '#93600c', '#8a3f8f', '#3a6fb0'];
export function matchTask(ctx, { q, pairs, explain }) {
  const box = card('Match them up');
  box.append(h('p', { class: 'q', html: q }), h('p', { class: 'hint-line' }, 'Tap something on the left, then its partner on the right.'));
  const right = pairs.map((p, i) => ({ ...p, i })).sort(() => Math.random() - 0.5);
  const links = new Map(); // left index -> right original index
  let sel = null;
  const leftEls = pairs.map((p, i) => h('button', { type: 'button', class: 'match-item', html: p.a, 'data-i': i }));
  const rightEls = right.map((p) => h('button', { type: 'button', class: 'match-item', html: p.b, 'data-i': p.i }));
  const fb = h('div', { class: 'feedback', hidden: true, 'aria-live': 'polite' });
  const checkBtn = h('button', { type: 'button', class: 'btn small primary', disabled: true }, 'Check matches');
  box.append(h('div', { class: 'match-grid' }, h('div', { class: 'match-col' }, leftEls), h('div', { class: 'match-col' }, rightEls)), h('div', { class: 'btn-row', style: { marginTop: '10px' } }, checkBtn), fb);
  const paint = () => {
    leftEls.forEach((el, i) => {
      el.classList.toggle('sel', sel === i); el.querySelector('.pair')?.remove(); el.classList.remove('right', 'wrong');
      if (links.has(i)) el.append(h('span', { class: 'pair', style: { background: PAIR_COLOURS[i % 7] } }, String(i + 1)));
    });
    rightEls.forEach((el) => {
      el.querySelector('.pair')?.remove(); el.classList.remove('right', 'wrong');
      const ri = Number(el.dataset.i);
      const li = [...links.entries()].find(([, r]) => r === ri)?.[0];
      if (li !== undefined) el.append(h('span', { class: 'pair', style: { background: PAIR_COLOURS[li % 7] } }, String(li + 1)));
    });
    checkBtn.disabled = links.size < pairs.length;
  };
  leftEls.forEach((el, i) => el.addEventListener('click', () => { sel = sel === i ? null : i; fb.hidden = true; paint(); }));
  rightEls.forEach((el) => el.addEventListener('click', () => {
    if (sel === null) { fb.hidden = false; fb.className = 'feedback info'; fb.innerHTML = '<p>Pick something on the left first.</p>'; return; }
    const ri = Number(el.dataset.i);
    for (const [k, v] of links) if (v === ri) links.delete(k);
    links.set(sel, ri); sel = null; fb.hidden = true; paint();
  }));
  checkBtn.addEventListener('click', () => {
    let ok = 0;
    for (const [li, ri] of links) { const good = li === ri; if (good) ok++; leftEls[li].classList.add(good ? 'right' : 'wrong'); rightEls.find((e) => Number(e.dataset.i) === ri).classList.add(good ? 'right' : 'wrong'); }
    fb.hidden = false;
    const all = ok === pairs.length;
    fb.className = `feedback ${all ? 'ok' : 'no'}`;
    fb.innerHTML = all ? `<p><b>All matched.</b> ${explain || ''}</p>` : `<p><b>${ok} of ${pairs.length} correct.</b> Tap a red one on the left and pick a new partner.</p>`;
    if (!all) { for (const [li, ri] of [...links]) if (li !== ri) links.delete(li); checkBtn.disabled = true; }
    typeset(fb);
  });
  return put(ctx, box);
}
