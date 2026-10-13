// Guided simulation card: the simulation, its controls, a key to what you are looking at,
// and "Try this" tasks that tick themselves off when you reach each goal.
// Goal-directed exploration with explanation teaches much more than free play alone.
import { h, typeset, store } from '../ui/dom.js';
import { SIMS } from '../content/sims.js';

const TKEY = 'chem120.m2.tasks';

export function mountSim(container, key, { compact = false } = {}) {
  const def = SIMS[key];
  if (!def) throw new Error(`Unknown simulation ${key}`);
  const progress = h('span', { class: 'sim-progress' });
  const stage = h('div', { class: 'sim-stage' }, h('div', { class: 'pad', style: { color: 'var(--muted)' } }, 'Loading simulation…'));
  const controls = h('div', { class: 'sim-controls' });
  const guide = h('div', { class: 'sim-guide' });
  const card = h('section', { class: 'sim instrument', 'aria-label': def.title },
    h('header', { class: 'sim-head' }, h('div', {}, h('h3', {}, def.title), h('p', { html: def.what })), progress),
    stage,
    h('div', { class: 'sim-body' }, controls, guide),
    def.foot ? h('p', { class: 'sim-foot', html: def.foot }) : null);
  container.append(card);

  const saved = store.get(TKEY, {})[key] || [];
  const done = def.tasks.map((_, i) => !!saved[i]);
  const setProgress = () => { const n = done.filter(Boolean).length; progress.textContent = n === def.tasks.length ? 'All tasks done' : `${n} of ${def.tasks.length} tasks done`; };

  if (def.parts?.length) {
    guide.append(h('h4', {}, 'What you are looking at'), h('dl', { class: 'parts' }, def.parts.map((p) => h('div', {},
      h('dt', {}, p.color ? h('i', { style: { background: p.color } }) : null, p.label), h('dd', { html: p.text })))));
  }
  const items = def.tasks.map((t, i) => h('li', { class: done[i] ? 'done' : '' }, h('div', {}, h('div', { class: 'do', html: t.do }), h('div', { class: 'then', html: `<b>Done.</b> ${t.then}` }))));
  guide.append(h('h4', {}, 'Try this'), h('ol', { class: 'tasks' }, items));
  setProgress();

  let widget = null, off = null, disposed = false;
  const ready = def.load().then((w) => {
    if (disposed) { w.dispose?.(); return; }
    widget = w;
    stage.replaceChildren(w.el);
    controls.replaceChildren(w.controls);
    typeset(card);
    off = w.onChange?.((s) => {
      def.tasks.forEach((t, i) => {
        if (done[i]) return;
        let ok = false; try { ok = t.when(s); } catch { ok = false; }
        if (ok) {
          done[i] = true; items[i].classList.add('done'); typeset(items[i]);
          const all = store.get(TKEY, {}); all[key] = done; store.set(TKEY, all);
          setProgress();
        }
      });
    });
  }).catch((e) => { console.error(e); stage.replaceChildren(h('p', { class: 'pad' }, 'This simulation could not load. Reloading the page usually fixes it.')); });

  return { el: card, ready, dispose() { disposed = true; off?.(); widget?.dispose?.(); } };
}

// Lesson helper: place a guided simulation in the lesson at full breakout width.
export function sim(ctx, key, opts) {
  const holder = h('div', { class: 'wide' });
  ctx.root.append(holder);
  const s = mountSim(holder, key, opts);
  ctx.onCleanup(() => s.dispose());
  return s;
}
