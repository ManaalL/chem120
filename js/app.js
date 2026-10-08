// App shell: hash routing, the three-column module layout, progress tracking,
// and moving each widget's controls between the inspector and the page.
import { h, typeset, store } from './ui/dom.js';
import { LESSONS, lessonIndex } from './lessons/registry.js';

const app = document.getElementById('app');
const WIDE = window.matchMedia('(min-width: 1241px)');
let cleanups = [];

// ---------- progress ----------
const PKEY = 'chem120.m2.progress';
export const progress = {
  get() { return store.get(PKEY, { visited: {}, done: {} }); },
  visit(id) { const p = this.get(); p.visited[id] = true; store.set(PKEY, p); },
  toggleDone(id) { const p = this.get(); p.done[id] = !p.done[id]; p.visited[id] = true; store.set(PKEY, p); return p.done[id]; },
};

// ---------- shared pieces ----------
export function spectrumStrip() {
  const strip = h('div', { class: 'spectrum-strip', role: 'img', 'aria-label': 'Visible emission lines of hydrogen at 410.1, 434.0, 486.1 and 656.3 nanometres' });
  const lines = [[410.1, '#7e00db'], [434.0, '#2a00ff'], [486.1, '#00ccff'], [656.3, '#ff0000']];
  const lo = 380, hi = 720;
  for (const [nm, col] of lines) {
    strip.append(h('span', { class: 'line', 'data-nm': `${nm.toFixed(1)} nm`, style: { left: `${((nm - lo) / (hi - lo)) * 100}%`, background: col, boxShadow: `0 0 10px 2px ${col}` } }));
  }
  strip.append(h('span', { class: 'scale' }, 'Hydrogen emission, 380 to 720 nm'));
  return strip;
}

function sidebar(currentKey) {
  const p = progress.get();
  const done = LESSONS.filter((l) => p.done[l.id]).length;
  const nav = h('nav', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Module 2 contents' },
    h('h2', {}, 'Module 2'),
    h('p', { class: 'progress-line' }, `${done} of ${LESSONS.length} lessons marked done`),
    h('div', { class: 'progress-bar', 'aria-hidden': 'true' }, h('span', { style: { width: `${(done / LESSONS.length) * 100}%` } })),
    h('ol', { class: 'toc' }, LESSONS.map((l) => h('li', {},
      h('a', { href: `#/lesson/${l.id}`, 'aria-current': currentKey === l.id ? 'page' : null },
        h('span', { class: `dot ${p.done[l.id] ? 'done' : p.visited[l.id] ? 'visited' : ''}`, 'aria-label': p.done[l.id] ? 'done' : p.visited[l.id] ? 'visited' : 'not started' }),
        h('span', { class: 'num' }, l.id),
        h('span', {}, l.title))))),
    h('p', { class: 'toc-group' }, 'Tools'),
    h('ul', { class: 'toc' },
      [['lab', 'Orbital lab'], ['sandbox', 'Experiments'], ['applications', 'Applications in medicine and tech'], ['reference', 'Formulas and constants']].map(([k, t]) =>
        h('li', {}, h('a', { href: `#/${k}`, 'aria-current': currentKey === k ? 'page' : null }, h('span'), h('span'), h('span', {}, t))))),
  );
  return nav;
}

// Builds the module layout and returns a context object for views to render into.
function shell(currentKey, { inspector = true, wide = false } = {}) {
  const content = h('main', { class: `content ${wide ? 'wide' : ''}`, id: 'main', tabindex: '-1' });
  const insTitle = h('h2', { class: 'inspector-title' });
  const insSub = h('p', { class: 'inspector-sub' });
  const insBody = h('div', {});
  const ins = inspector ? h('aside', { class: 'inspector', 'aria-label': 'Controls and live values' }, insTitle, insSub, insBody) : null;
  const root = h('div', { class: `shell ${inspector ? '' : 'no-inspector'}` }, sidebar(currentKey), content, ins);
  app.append(root);

  const panels = [];
  let active = null;
  const ratios = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
    let best = null, bestR = 0;
    for (const p of panels) { const r = ratios.get(p.anchor) || 0; if (r > bestR) { best = p; bestR = r; } }
    if (best && best !== active) activate(best);
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

  function activate(p) {
    active = p;
    for (const q of panels) q.controls.classList.toggle('active', q === p);
    insTitle.textContent = p.title || '';
    insSub.textContent = p.sub || '';
  }
  function layout() {
    const toInspector = inspector && WIDE.matches;
    for (const p of panels) {
      if (toInspector) { insBody.append(p.controls); p.inline.hidden = true; }
      else { p.inline.append(p.controls); p.inline.hidden = false; }
    }
    if (toInspector && !active && panels[0]) activate(panels[0]);
    if (!panels.length && ins) { insTitle.textContent = 'Controls'; insBody.replaceChildren(h('p', { class: 'inspector-empty' }, 'This page has no live controls. Widgets further down the module put their settings here.')); }
  }
  const onMQ = () => layout();
  WIDE.addEventListener('change', onMQ);
  cleanups.push(() => { io.disconnect(); WIDE.removeEventListener('change', onMQ); });

  return {
    main: content,
    onCleanup: (fn) => cleanups.push(fn),
    // anchor: the widget frame; controls: element holding its settings and read-outs
    panel(anchor, controls, title, sub) {
      controls.classList.add('panel-controls');
      const inline = h('div', { class: 'inline-controls', hidden: true });
      anchor.after(inline);
      const p = { anchor, controls, title, sub, inline };
      panels.push(p);
      io.observe(anchor);
      layout();
      return p;
    },
    layout,
    typeset: () => typeset(content),
  };
}

// ---------- views ----------
async function renderHome() {
  const { renderHome: r } = await import('./views/home.js');
  const main = h('main', { id: 'main', tabindex: '-1' });
  app.append(main);
  r({ main, onCleanup: (fn) => cleanups.push(fn), spectrumStrip, progress });
  document.title = 'Quantum Theory and the H Atom · CHEM 120/121';
}

async function renderLesson(id) {
  const i = lessonIndex(id);
  if (i < 0) return notFound();
  const meta = LESSONS[i];
  progress.visit(id);
  const ctx = shell(id);
  const mod = await meta.load();
  const prose = h('article', { class: 'prose' });
  ctx.main.append(prose);
  prose.append(h('header', { class: 'lesson-head' },
    h('p', { class: 'kicker' }, `Lesson ${meta.id} of Module 2`),
    h('h1', {}, meta.title),
    mod.goal ? h('p', { class: 'goal', html: mod.goal }) : null));
  ctx.prose = prose;
  await mod.render(ctx);
  // footer
  const prev = LESSONS[i - 1], next = LESSONS[i + 1];
  const isDone = progress.get().done[id];
  const doneBtn = h('button', { type: 'button', class: 'btn done-btn', 'aria-pressed': String(!!isDone) }, isDone ? 'Marked done' : 'Mark lesson done');
  doneBtn.addEventListener('click', () => {
    const d = progress.toggleDone(id);
    doneBtn.setAttribute('aria-pressed', String(d));
    doneBtn.textContent = d ? 'Marked done' : 'Mark lesson done';
    const old = document.getElementById('sidebar');
    old.replaceWith(sidebar(id));
  });
  prose.append(h('nav', { class: 'lesson-foot', 'aria-label': 'Lesson navigation' },
    prev ? h('a', { class: 'btn', href: `#/lesson/${prev.id}` }, `Back to ${prev.id}`) : h('span'),
    doneBtn,
    next ? h('a', { class: 'btn primary', href: `#/lesson/${next.id}` }, `Continue to ${next.id}`) : h('a', { class: 'btn primary', href: '#/lab' }, 'Open the orbital lab')));
  ctx.typeset();
  document.title = `${meta.id} ${meta.title} · CHEM 120/121`;
}

async function renderTool(key, arg) {
  const files = { lab: './views/lab.js', sandbox: './views/sandbox.js', applications: './views/applications.js', reference: './views/reference.js' };
  const titles = { lab: 'Orbital lab', sandbox: 'Experiments', applications: 'Applications in medicine and tech', reference: 'Formulas and constants' };
  const mod = await import(files[key]);
  const ctx = shell(key, { inspector: key === 'lab' || key === 'sandbox', wide: key === 'lab' });
  await mod.render(ctx, arg);
  ctx.typeset();
  document.title = `${titles[key]} · CHEM 120/121`;
}

function notFound() {
  app.append(h('main', { class: 'content prose', id: 'main' }, h('h1', {}, 'Page not found'), h('p', {}, h('a', { href: '#/' }, 'Go to the module home page'))));
}

let routing = 0;
async function route() {
  const ticket = ++routing;
  for (const fn of cleanups.splice(0)) { try { fn(); } catch (e) { console.error(e); } }
  app.replaceChildren();
  document.body.classList.remove('toc-open');
  tocBtn.setAttribute('aria-expanded', 'false');
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const key = parts[0] || '';
  document.querySelectorAll('.nav a').forEach((a) => a.setAttribute('aria-current', a.dataset.route === key ? 'page' : 'false'));
  tocBtn.hidden = key === '';
  try {
    if (key === '') await renderHome();
    else if (key === 'lesson') await renderLesson(parts[1] || '2.1');
    else if (['lab', 'sandbox', 'applications', 'reference'].includes(key)) await renderTool(key, parts[1]);
    else notFound();
  } catch (e) {
    console.error(e);
    if (ticket === routing) app.append(h('main', { class: 'content prose' }, h('h1', {}, 'Something went wrong loading this page'), h('p', {}, String(e.message || e)), h('p', {}, 'Reloading the page usually fixes it.')));
  }
  if (ticket !== routing) return;
  window.scrollTo(0, 0);
  // Deep links such as #/applications/mri scroll to that section.
  if (key === 'applications' && parts[1]) document.getElementById(parts[1])?.scrollIntoView({ block: 'start' });
}

const tocBtn = document.querySelector('.toc-toggle');
tocBtn.addEventListener('click', () => {
  const open = document.body.classList.toggle('toc-open');
  tocBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('toc-open'); });

window.addEventListener('hashchange', route);
// KaTeX loads with `defer`; wait for it before the first render so math typesets.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
