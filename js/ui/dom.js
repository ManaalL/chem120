// Small DOM helpers shared by every view and widget.

// h('div', {class: 'x', onclick: fn}, child, 'text', [more])
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

// Raw template tag: keeps backslashes so LaTeX can be written as-is inside lesson text.
export const tex = String.raw;

export function fromHTML(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content;
}

// Renders $...$ and $$...$$ inside an element with KaTeX (loaded globally).
export function typeset(el) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
  });
}
export function katexString(src, display = false) {
  if (!window.katex) return src;
  return window.katex.renderToString(src, { throwOnError: false, displayMode: display });
}

let uid = 0;
const nextId = (p) => `${p}-${++uid}`;

// Labelled range input with a live value read-out.
// onInput fires while dragging; onChange fires on release (use it for expensive updates).
export function slider({ label, min, max, step = 1, value, format = (v) => v, onInput, onChange, hint }) {
  const id = nextId('s');
  const out = h('output', { for: id, class: 'ctl-value', html: format(value) });
  const input = h('input', { type: 'range', id, min, max, step, value });
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.innerHTML = format(v);
    onInput?.(v);
  });
  input.addEventListener('change', () => onChange?.(Number(input.value)));
  const wrap = h('div', { class: 'ctl' },
    h('div', { class: 'ctl-head' }, h('label', { for: id }, label), out),
    input,
    hint ? h('p', { class: 'ctl-hint' }, hint) : null,
  );
  wrap.input = input;
  wrap.set = (v) => { input.value = v; out.innerHTML = format(Number(v)); };
  return wrap;
}

// Segmented control. options: [{value, label}]
export function segmented({ label, options, value, onChange }) {
  const group = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': label });
  let current = value;
  const buttons = options.map((o) => {
    const b = h('button', { type: 'button', role: 'radio', 'aria-checked': String(o.value === value), class: 'seg-btn', html: o.label });
    b.addEventListener('click', () => set(o.value, true));
    group.append(b);
    return b;
  });
  function set(v, fire) {
    current = v;
    buttons.forEach((b, i) => b.setAttribute('aria-checked', String(options[i].value === v)));
    if (fire) onChange?.(v);
  }
  const wrap = h('div', { class: 'ctl' }, label ? h('div', { class: 'ctl-head' }, h('span', { class: 'ctl-label' }, label)) : null, group);
  wrap.set = (v) => set(v, false);
  wrap.get = () => current;
  return wrap;
}

export function select({ label, options, value, onChange }) {
  const id = nextId('sel');
  const s = h('select', { id }, options.map((o) => h('option', { value: o.value, selected: o.value === value }, o.label)));
  s.addEventListener('change', () => onChange?.(s.value));
  const wrap = h('div', { class: 'ctl' }, h('div', { class: 'ctl-head' }, h('label', { for: id }, label)), s);
  wrap.el = s;
  return wrap;
}

export function toggle({ label, checked = false, onChange }) {
  const id = nextId('t');
  const input = h('input', { type: 'checkbox', id, checked });
  input.addEventListener('change', () => onChange?.(input.checked));
  return h('label', { class: 'toggle', for: id }, input, h('span', { class: 'toggle-track', 'aria-hidden': 'true' }), h('span', {}, label));
}

export function button(label, onClick, cls = '') {
  return h('button', { type: 'button', class: `btn ${cls}`, onclick: onClick, html: label });
}

// Read-out table. rows: [{key, label}] ; returns element with .set(key, html)
export function readouts(rows) {
  const cells = {};
  const dl = h('dl', { class: 'readouts' });
  for (const r of rows) {
    const dd = h('dd', { html: r.value ?? '' });
    cells[r.key] = dd;
    dl.append(h('div', { class: 'ro' }, h('dt', { html: r.label }), dd));
  }
  dl.set = (k, v) => { if (cells[k]) cells[k].innerHTML = v; };
  return dl;
}

export function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
export function lerp(a, b, t) { return a + (b - a) * t; }

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Safe localStorage access. Some browsers block storage; the site still works without it.
export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};
