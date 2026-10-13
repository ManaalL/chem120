// Lesson 2.7: pick n, then l, then m_l, and see which choices are allowed and why.
// The box diagram shows every orbital in the shell, with the one you built highlighted.
import { h, bus } from '../ui/dom.js';

const L = ['s', 'p', 'd', 'f'];
const SHAPES = { s: 'sphere', p: 'two lobes (dumbbell)', d: 'mostly four lobes', f: 'many lobes' };

export function create() {
  const state = { n: 2, l: 1, ml: 0, invalid: null };
  const ev = bus();
  const snap = () => ({ ...state });
  const box = h('div', { class: 'pad' });
  const el = h('div', {}, box);
  const msg = h('p', { class: 'ctl-hint', style: { minHeight: '2.8em', fontSize: '14px' }, 'aria-live': 'polite' });
  const rowN = h('div', { class: 'btn-row' });
  const rowL = h('div', { class: 'btn-row' });
  const rowM = h('div', { class: 'btn-row' });
  const controls = h('div', {},
    h('p', { class: 'ctl-label', style: { margin: '0 0 6px' } }, '1. Choose n (shell)'), rowN,
    h('p', { class: 'ctl-label', style: { margin: '6px 0 6px' } }, '2. Choose l (shape)'), rowL,
    h('p', { class: 'ctl-label', style: { margin: '6px 0 6px' } }, '3. Choose mₗ (orientation)'), rowM, msg);

  const btn = (label, on, allowed, click) => {
    const b = h('button', { type: 'button', class: 'orb-btn', 'aria-pressed': String(on), style: allowed ? {} : { opacity: 0.45, textDecoration: 'line-through' } }, label);
    b.addEventListener('click', click);
    return b;
  };
  function render() {
    rowN.replaceChildren(...[1, 2, 3, 4].map((n) => btn(String(n), state.n === n, true, () => { state.n = n; if (state.l > n - 1) state.l = n - 1; if (Math.abs(state.ml) > state.l) state.ml = 0; state.invalid = null; msg.textContent = ''; render(); })));
    rowL.replaceChildren(...[0, 1, 2, 3].map((l) => btn(`${l} (${L[l]})`, state.l === l, l <= state.n - 1, () => {
      if (l > state.n - 1) { state.invalid = 'l'; msg.innerHTML = `<span style="color:var(--plus)">Not allowed.</span> l can be at most n − 1 = ${state.n - 1}. There is no ${state.n}${L[l]} orbital.`; ev.emit(snap()); return; }
      state.l = l; if (Math.abs(state.ml) > l) state.ml = 0; state.invalid = null; msg.textContent = ''; render();
    })));
    rowM.replaceChildren(...[-3, -2, -1, 0, 1, 2, 3].map((m) => btn(m > 0 ? `+${m}` : String(m), state.ml === m, Math.abs(m) <= state.l, () => {
      if (Math.abs(m) > state.l) { state.invalid = 'ml'; msg.innerHTML = `<span style="color:var(--plus)">Not allowed.</span> mₗ runs from −l to +l, so with l = ${state.l} it can only be ${state.l === 0 ? '0' : `−${state.l} to +${state.l}`}.`; ev.emit(snap()); return; }
      state.ml = m; state.invalid = null; msg.textContent = ''; render();
    })));
    drawShell();
    ev.emit(snap());
  }
  function drawShell() {
    const n = state.n;
    const name = `${n}${L[state.l]}`;
    const rows = [];
    for (let l = 0; l < n; l++) {
      const cells = [];
      for (let m = -l; m <= l; m++) {
        const on = l === state.l && m === state.ml;
        cells.push(h('span', { style: { display: 'inline-grid', placeItems: 'center', width: '40px', height: '34px', border: `1.5px solid ${on ? 'var(--minus)' : 'var(--line)'}`, background: on ? 'rgba(64,196,230,0.18)' : 'transparent', color: on ? 'var(--text)' : 'var(--muted)', fontSize: '12.5px', borderRadius: '4px' } }, m > 0 ? `+${m}` : String(m)));
      }
      rows.push(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 8px', flexWrap: 'wrap' } },
        h('span', { style: { width: '3.6em', color: l === state.l ? 'var(--text)' : 'var(--muted)', fontWeight: 500 } }, `${n}${L[l]}`),
        h('span', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } }, cells),
        h('span', { style: { color: 'var(--faint)', fontSize: '13px' } }, `${2 * l + 1} orbital${l ? 's' : ''}`)));
    }
    box.replaceChildren(
      h('p', { style: { margin: '0 0 4px', color: 'var(--muted)', fontSize: '14px' } }, 'You built'),
      h('p', { style: { margin: '0 0 6px', font: '400 2.2rem/1.1 var(--serif)' } }, `a ${name} orbital`),
      h('p', { style: { margin: '0 0 18px', color: 'var(--muted)', fontSize: '14.5px' } }, `n = ${n}, l = ${state.l}, mₗ = ${state.ml}. Shape: ${SHAPES[L[state.l]]}. Energy depends only on n: E = −R_H/${n * n}.`),
      h('p', { style: { margin: '0 0 8px', color: 'var(--text)', fontWeight: 500, fontSize: '14.5px' } }, `Every orbital in shell n = ${n}`),
      ...rows,
      h('p', { style: { margin: '10px 0 0', color: 'var(--muted)', fontSize: '14px' } }, `Total: ${n * n} orbitals, all with the same energy in hydrogen. With two spin states each, ${2 * n * n} electron states.`));
  }
  render();
  return { onChange: ev.on, getState: snap, el, controls, dispose() {} };
}
