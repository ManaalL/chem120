// Reading aids for lesson pages: highlights that light up as you scroll, key ideas that
// collect into a Notes drawer, a progress bar by part, and glossary popovers.
import { h, typeset, reducedMotion } from '../ui/dom.js';
import { GLOSSARY } from '../content/glossary.js';

export function attachReadingAids(ctx, barHost) {
  const cleanups = [];

  // ----- highlights -----
  const marks = [...ctx.root.querySelectorAll('mark')];
  if (reducedMotion()) marks.forEach((m) => m.classList.add('lit'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('lit'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -30% 0px' });
    marks.forEach((m) => io.observe(m));
    cleanups.push(() => io.disconnect());
  }

  // ----- lesson bar -----
  const segs = ctx.sections.map((s) => {
    const fill = h('span');
    const a = h('a', { href: `#${s.id}`, title: s.title, 'aria-label': `Part: ${s.title}` }, fill);
    a.addEventListener('click', (e) => { e.preventDefault(); s.el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' }); });
    return { ...s, a, fill };
  });
  const where = h('span', { class: 'where' });
  const count = h('span', { class: 'count' }, '0');
  const notesBtn = h('button', { type: 'button', class: 'btn small notes-btn', 'aria-haspopup': 'dialog' }, 'Notes ', count);
  const bar = h('div', { class: 'lesson-bar full' }, where, h('div', { class: 'seg-track' }, segs.map((s) => s.a)), notesBtn);
  barHost.prepend(bar);

  // ----- notes drawer -----
  const list = h('ol', { class: 'notes-list' });
  const empty = h('p', { class: 'notes-empty' }, 'Key ideas appear here as you scroll past them.');
  const closeBtn = h('button', { type: 'button', class: 'btn small' }, 'Close');
  const drawer = h('aside', { class: 'notes-drawer', role: 'dialog', 'aria-label': 'Your notes for this lesson', 'aria-modal': 'true' },
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' } }, h('h2', {}, 'Your notes'), closeBtn),
    h('p', { class: 'sub' }, 'The key ideas you have read so far in this lesson.'), empty, list);
  const scrim = h('div', { class: 'scrim', hidden: true });
  document.body.append(drawer, scrim);
  const open = () => { drawer.classList.add('open'); scrim.hidden = false; closeBtn.focus(); };
  const close = () => { drawer.classList.remove('open'); scrim.hidden = true; notesBtn.focus({ preventScroll: true }); };
  notesBtn.addEventListener('click', open); closeBtn.addEventListener('click', close); scrim.addEventListener('click', close);
  const onKey = (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => { drawer.remove(); scrim.remove(); document.removeEventListener('keydown', onKey); });

  const collected = new Set();
  const addNote = (k, quiet) => {
    if (collected.has(k)) return;
    collected.add(k);
    const sec = [...ctx.sections].reverse().find((s) => s.el.compareDocumentPosition(k.el) & Node.DOCUMENT_POSITION_FOLLOWING);
    const li = h('li', { html: k.html }, h('a', { href: '#', onclick: (e) => { e.preventDefault(); close(); k.el.scrollIntoView({ block: 'center' }); } }, sec ? `From: ${sec.title}` : 'Go to it'));
    // keep notes in reading order
    const idx = ctx.keys.indexOf(k);
    const after = [...list.children].find((c) => Number(c.dataset.i) > idx);
    li.dataset.i = idx;
    list.insertBefore(li, after || null);
    typeset(li);
    empty.hidden = true;
    count.textContent = String(collected.size);
    if (!quiet) { notesBtn.classList.remove('pulse'); void notesBtn.offsetWidth; notesBtn.classList.add('pulse'); }
  };
  const kio = new IntersectionObserver((es) => es.forEach((e) => {
    // count a key idea once its top has scrolled above the middle of the screen
    if (e.isIntersecting || e.boundingClientRect.top < 0) { const k = ctx.keys.find((x) => x.el === e.target); if (k) { addNote(k); kio.unobserve(e.target); } }
  }), { rootMargin: '0px 0px -45% 0px' });
  ctx.keys.forEach((k) => kio.observe(k.el));
  cleanups.push(() => kio.disconnect());

  // ----- progress through parts -----
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const vh = window.innerHeight, line = vh * 0.35;
      let current = null;
      segs.forEach((s, i) => {
        const top = s.el.getBoundingClientRect().top;
        const next = segs[i + 1]?.el.getBoundingClientRect().top ?? ctx.endEl.getBoundingClientRect().top;
        const f = Math.max(0, Math.min(1, (line - top) / Math.max(1, next - top)));
        s.fill.style.width = `${f * 100}%`;
        if (top < line) current = s;
      });
      where.innerHTML = current ? `<b>${ctx.lessonId}</b>&ensp;${current.title}` : `<b>${ctx.lessonId}</b>&ensp;${ctx.title}`;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
  onScroll();

  // ----- reached hooks (e.g. prediction revisit refreshes when scrolled to) -----
  if (ctx.reachHooks.length) {
    const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) ctx.reachHooks.filter((r) => r.el === e.target).forEach((r) => r.fn()); }));
    ctx.reachHooks.forEach((r) => rio.observe(r.el));
    cleanups.push(() => rio.disconnect());
  }

  cleanups.push(attachGlossary(ctx.root));
  return () => cleanups.forEach((f) => f());
}

// Tap or hover a <dfn data-g="key"> to see a short definition.
export function attachGlossary(root) {
  const pop = h('div', { class: 'gloss-pop', role: 'tooltip', hidden: true });
  document.body.append(pop);
  let current = null;
  const show = (el) => {
    const g = GLOSSARY[el.dataset.g];
    if (!g) return;
    current = el;
    pop.innerHTML = `<b>${g.term}</b>${g.def}`;
    pop.hidden = false;
    const r = el.getBoundingClientRect();
    const w = pop.offsetWidth;
    const left = Math.max(16, Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - w - 16));
    pop.style.left = `${left}px`;
    pop.style.top = `${window.scrollY + r.bottom + 8}px`;
  };
  const hide = () => { pop.hidden = true; current = null; };
  root.querySelectorAll('dfn[data-g]').forEach((el) => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.addEventListener('mouseenter', () => show(el));
    el.addEventListener('mouseleave', () => { if (current === el && !el.dataset.pinned) hide(); });
    el.addEventListener('focus', () => show(el));
    el.addEventListener('blur', hide);
    el.addEventListener('click', (e) => { e.stopPropagation(); if (current === el && !pop.hidden && el.dataset.pinned) { delete el.dataset.pinned; hide(); } else { el.dataset.pinned = '1'; show(el); } });
  });
  const away = () => { root.querySelectorAll('dfn[data-pinned]').forEach((d) => delete d.dataset.pinned); hide(); };
  document.addEventListener('click', away);
  window.addEventListener('scroll', hide, { passive: true });
  return () => { pop.remove(); document.removeEventListener('click', away); window.removeEventListener('scroll', hide); };
}
