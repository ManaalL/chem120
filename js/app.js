// App shell: hash routing, lesson pages with reading aids, and the tool pages.
import { h, typeset, store } from './ui/dom.js';
import { LESSONS, lessonIndex } from './lessons/registry.js';
import { attachReadingAids, attachGlossary } from './learn/chrome.js';
import { flashcards } from './learn/recall.js';
import { allCards, deckStats } from './learn/deck.js';

const app = document.getElementById('app');
let cleanups = [];

// ---------- progress ----------
const PKEY = 'chem120.m2.progress';
export const progress = {
  get() { return store.get(PKEY, { visited: {}, done: {} }); },
  visit(id) { const p = this.get(); p.visited[id] = true; store.set(PKEY, p); },
  setDone(id, v) { const p = this.get(); p.done[id] = v; p.visited[id] = true; store.set(PKEY, p); return v; },
};

function refreshReviewBadge() {
  const a = document.querySelector('.nav a[data-route="review"]');
  if (!a) return;
  a.querySelector('.review-count')?.remove();
  const due = deckStats().due;
  if (due) a.append(h('span', { class: 'review-count', 'aria-label': `${due} cards due` }, String(due)));
}

function tocSide(currentKey) {
  const p = progress.get();
  const done = LESSONS.filter((l) => p.done[l.id]).length;
  return h('nav', { class: 'toc-side', id: 'sidebar', 'aria-label': 'Module 2 contents' },
    h('h2', {}, 'Module 2'),
    h('p', { class: 'progress-line' }, `${done} of ${LESSONS.length} lessons done`),
    h('div', { class: 'progress-bar', 'aria-hidden': 'true' }, h('span', { style: { width: `${(done / LESSONS.length) * 100}%` } })),
    h('ol', { class: 'toc' }, LESSONS.map((l) => h('li', {},
      h('a', { href: `#/lesson/${l.id}`, 'aria-current': currentKey === l.id ? 'page' : null },
        h('span', { class: `dot ${p.done[l.id] ? 'done' : p.visited[l.id] ? 'visited' : ''}`, 'aria-label': p.done[l.id] ? 'done' : p.visited[l.id] ? 'started' : 'not started' }),
        h('span', { class: 'num' }, l.id),
        h('span', {}, l.title))))),
    h('p', { class: 'toc-group' }, 'Practise and explore'),
    h('ul', { class: 'toc' },
      [['review', 'Review cards'], ['lab', 'Orbital lab'], ['sandbox', 'All experiments'], ['applications', 'Medicine and tech'], ['reference', 'Formulas and constants']].map(([k, t]) =>
        h('li', {}, h('a', { href: `#/${k}` }, h('span'), h('span'), h('span', {}, t))))));
}

// ---------- lesson page ----------
async function renderLesson(id) {
  const i = lessonIndex(id);
  if (i < 0) return notFound();
  const meta = LESSONS[i];
  progress.visit(id);
  const root = h('main', { class: 'lesson-main', id: 'main', tabindex: '-1' });
  const wrap = h('div', { class: 'lesson-wrap' }, tocSide(id), h('div', { style: { minWidth: 0 } }, root));
  app.append(wrap);
  const mod = await meta.load();

  const ctx = {
    root, prose: root, lessonId: id, title: meta.title,
    sections: [], keys: [], predictions: {}, predictDefs: {}, reachHooks: [],
    onReach(el, fn) { this.reachHooks.push({ el, fn }); },
    onCleanup: (fn) => cleanups.push(fn),
  };

  root.append(h('header', { class: 'lesson-head' },
    h('p', { class: 'kicker' }, `Module 2, lesson ${id} of 2.10`),
    h('h1', {}, meta.title),
    mod.meta?.minutes ? h('p', { class: 'meta' }, `About ${mod.meta.minutes} minutes. Tap any word with a dotted underline for a quick definition.`) : null));
  if (mod.meta?.objectives) {
    root.append(h('section', { class: 'objectives', 'aria-label': 'Goals for this lesson' },
      h('h2', {}, 'By the end of this lesson you can'),
      h('ul', {}, mod.meta.objectives.map((t) => h('li', { html: t })))));
  }

  typeset(root);
  await mod.render(ctx);

  // number the parts now that we know how many there are
  ctx.sections.forEach((s, k) => { s.el.querySelector('.sec-n').textContent = `Part ${k + 1} of ${ctx.sections.length}`; });

  // ----- end of lesson: summary, recall, next -----
  const end = h('section', { 'aria-labelledby': 'wrap-h' });
  ctx.endEl = end;
  root.append(end);
  end.append(h('h2', { id: 'wrap-h' }, h('span', { class: 'sec-n' }, 'Wrap-up'), 'What to take away'));
  if (ctx.keys.length) end.append(h('ol', { class: 'summary-list' }, ctx.keys.map((k) => h('li', { html: k.html }))));
  const cards = allCards().filter((c) => c.lesson === id);
  if (cards.length) {
    const box = h('section', { class: 'activity' }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), 'Recall from memory'),
      h('p', { class: 'hint-line', style: { marginTop: 0 } }, 'Scroll up out of sight of the text, answer each one in your head, then check. Pulling an answer out of memory makes it stick far better than reading it again.'));
    end.append(box);
    flashcards(box, cards);
  }
  const prev = LESSONS[i - 1], next = LESSONS[i + 1];
  const isDone = !!progress.get().done[id];
  const doneBtn = h('button', { type: 'button', class: 'btn done-btn', 'aria-pressed': String(isDone) }, isDone ? 'Lesson done' : 'Mark lesson done');
  doneBtn.addEventListener('click', () => {
    const d = progress.setDone(id, !progress.get().done[id]);
    doneBtn.setAttribute('aria-pressed', String(d));
    doneBtn.textContent = d ? 'Lesson done' : 'Mark lesson done';
    document.getElementById('sidebar').replaceWith(tocSide(id));
  });
  end.append(h('nav', { class: 'lesson-foot', 'aria-label': 'Lesson navigation' },
    prev ? h('a', { class: 'btn', href: `#/lesson/${prev.id}` }, `Back to ${prev.id}`) : h('span'),
    doneBtn,
    next ? h('a', { class: 'btn primary', href: `#/lesson/${next.id}` }, `Next: ${next.id} ${next.title}`) : h('a', { class: 'btn primary', href: '#/review' }, 'Go to review')));
  typeset(end);
  refreshReviewBadge();
  end.addEventListener('click', () => setTimeout(refreshReviewBadge, 50));

  cleanups.push(attachReadingAids(ctx, root));
  document.title = `${id} ${meta.title} · CHEM 120/121`;
}

// ---------- tool pages ----------
const TOOLS = {
  home: { file: './views/home.js', title: 'Quantum Theory and the H Atom · CHEM 120/121' },
  lab: { file: './views/lab.js', title: 'Orbital lab · CHEM 120/121' },
  sandbox: { file: './views/sandbox.js', title: 'Experiments · CHEM 120/121' },
  review: { file: './views/review.js', title: 'Review · CHEM 120/121' },
  applications: { file: './views/applications.js', title: 'Medicine and tech · CHEM 120/121' },
  reference: { file: './views/reference.js', title: 'Formulas and constants · CHEM 120/121' },
};
async function renderTool(key, arg) {
  const mod = await import(TOOLS[key].file);
  const main = h('main', { id: 'main', tabindex: '-1' });
  app.append(main);
  const ctx = { main, onCleanup: (fn) => cleanups.push(fn), progress, refreshReviewBadge };
  await mod.render(ctx, arg);
  typeset(main);
  cleanups.push(attachGlossary(main));
  document.title = TOOLS[key].title;
}

function notFound() {
  app.append(h('main', { class: 'page', id: 'main' }, h('h1', {}, 'Page not found'), h('p', {}, h('a', { href: '#/' }, 'Go to the module home page'))));
}

let routing = 0;
async function route() {
  const ticket = ++routing;
  for (const fn of cleanups.splice(0)) { try { fn(); } catch (e) { console.error(e); } }
  app.replaceChildren();
  document.body.classList.remove('toc-open');
  tocBtn.setAttribute('aria-expanded', 'false');
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const key = parts[0] || 'home';
  document.querySelectorAll('.nav a').forEach((a) => a.setAttribute('aria-current', a.dataset.route === key ? 'page' : 'false'));
  tocBtn.hidden = key !== 'lesson';
  try {
    if (key === 'lesson') await renderLesson(parts[1] || '2.1');
    else if (TOOLS[key]) await renderTool(key, parts[1]);
    else notFound();
  } catch (e) {
    console.error(e);
    if (ticket === routing) app.append(h('main', { class: 'page' }, h('h1', {}, 'This page didn\'t load'), h('p', {}, String(e.message || e)), h('p', {}, 'Reloading the page usually fixes it.')));
  }
  if (ticket !== routing) return;
  window.scrollTo(0, 0);
  if (key === 'applications' && parts[1]) document.getElementById(parts[1])?.scrollIntoView({ block: 'start' });
  refreshReviewBadge();
}

const tocBtn = document.querySelector('.toc-toggle');
tocBtn.addEventListener('click', () => {
  const open = document.body.classList.toggle('toc-open');
  tocBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('toc-open'); });
document.addEventListener('click', (e) => { if (document.body.classList.contains('toc-open') && !e.target.closest('#sidebar, .toc-toggle')) document.body.classList.remove('toc-open'); });

window.addEventListener('hashchange', route);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
