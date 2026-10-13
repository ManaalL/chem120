// Lesson building blocks. Each one is built around a learning technique with good
// evidence behind it: prediction before instruction, signalling of key ideas,
// retrieval practice with feedback, and confronting common misconceptions.
import { h, fromHTML, typeset, store } from '../ui/dom.js';
import { APPLICATIONS } from '../content/applications.js';

const LETTERS = 'ABCDEFGH';
const put = (ctx, el, wide = false) => { if (wide) el.classList.add('wide'); ctx.root.append(el); typeset(el); return el; };

// Plain lesson text (HTML with $math$, <mark> highlights and <dfn data-g> glossary terms).
export function add(ctx, markup) {
  const frag = fromHTML(markup);
  // Loose text (for example a $$display equation$$ between paragraphs) gets its own block,
  // so it lines up with the reading column and is typeset like everything else.
  for (const n of [...frag.childNodes]) {
    if (n.nodeType === 3 && n.textContent.trim()) { const d = document.createElement('div'); n.replaceWith(d); d.append(n); }
  }
  const nodes = [...frag.childNodes];
  ctx.root.append(frag);
  nodes.forEach((n) => n.nodeType === 1 && typeset(n));
}

export function objectives(ctx, items, minutes) {
  const box = h('section', { class: 'objectives', 'aria-label': 'Goals for this lesson' },
    h('h2', {}, `By the end you should be able to${minutes ? ` (about ${minutes} minutes)` : ''}`),
    h('ul', {}, items.map((t) => h('li', { html: t }))));
  put(ctx, box);
}

// Section heading. Sections drive the progress bar at the top of the lesson.
export function section(ctx, title) {
  const n = ctx.sections.length + 1;
  const id = `s${n}`;
  const el = h('h2', { id }, h('span', { class: 'sec-n' }, `Part ${n} of ${ctx.totalSections || '?'}`), title);
  ctx.sections.push({ id, title, el });
  ctx.root.append(el);
  return el;
}

// The one sentence to remember from a part. Collected into the Notes drawer.
export function key(ctx, markup, noteText) {
  const el = h('div', { class: 'key', 'data-note': '' },
    h('p', { class: 'label' }, h('i'), 'Key idea'),
    h('div', { class: 'text', html: markup }));
  ctx.keys.push({ el, html: noteText || markup });
  put(ctx, el);
}

function activity(kind, tag) {
  return h('section', { class: `activity ${kind}` }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), tag));
}

// Multiple choice with an explanation for every option, right or wrong.
export function check(ctx, { q, options, after }) {
  const box = activity('check', 'Quick check');
  box.append(h('p', { class: 'q', html: q }));
  const list = h('div', { class: 'choices' });
  const fb = h('div', { class: 'feedback', hidden: true, role: 'status', 'aria-live': 'polite' });
  let solved = false;
  options.forEach((o, i) => {
    const b = h('button', { type: 'button', class: 'choice' }, h('span', { class: 'letter' }, LETTERS[i]), h('span', { html: o.t }));
    b.addEventListener('click', () => {
      if (solved) return;
      b.classList.add(o.right ? 'right' : 'wrong');
      fb.hidden = false;
      fb.className = `feedback ${o.right ? 'ok' : 'no'}`;
      fb.innerHTML = `<p><b>${o.right ? 'Yes.' : 'Not this one.'}</b> ${o.why || ''}</p>${o.right && after ? `<p>${after}</p>` : ''}${o.right ? '' : '<p>Try another option.</p>'}`;
      typeset(fb);
      if (o.right) { solved = true; [...list.children].forEach((c) => c.setAttribute('disabled', '')); }
    });
    list.append(b);
  });
  box.append(list, fb);
  put(ctx, box);
}

// Commit to a prediction before reading. It is revisited at the end of the lesson.
const PKEY = 'chem120.m2.predictions';
export function predict(ctx, { id, q, options, intro }) {
  const box = activity('predict', 'Predict first');
  box.append(h('p', { class: 'q', html: q }), h('p', { class: 'hint-line' }, intro || 'Make your best guess. Being wrong first helps the right answer stick. We come back to this at the end.'));
  const list = h('div', { class: 'choices' });
  const fb = h('div', { class: 'feedback info', hidden: true });
  const saved = store.get(PKEY, {})[id];
  const choose = (i, quiet) => {
    [...list.children].forEach((c, j) => { c.classList.toggle('picked', j === i); c.setAttribute('disabled', ''); });
    fb.hidden = false;
    fb.innerHTML = '<p><b>Locked in.</b> Keep your guess in mind as you read. The answer is at the end of the lesson.</p>';
    if (!quiet) { const all = store.get(PKEY, {}); all[id] = i; store.set(PKEY, all); }
    ctx.predictions[id] = i;
  };
  options.forEach((o, i) => {
    const b = h('button', { type: 'button', class: 'choice' }, h('span', { class: 'letter' }, LETTERS[i]), h('span', { html: o.t }));
    b.addEventListener('click', () => choose(i));
    list.append(b);
  });
  box.append(list, fb);
  ctx.predictDefs[id] = { q, options };
  put(ctx, box);
  if (saved !== undefined && saved < options.length) choose(saved, true);
}
export function revisit(ctx, id, explain) {
  const def = ctx.predictDefs[id];
  const box = activity('predict revisit', 'Back to your prediction');
  const right = def.options.findIndex((o) => o.right);
  const yours = h('p', { class: 'yours' });
  const body = h('div', { class: 'feedback info', html: `<p><b>Answer: ${LETTERS[right]}.</b> ${def.options[right].t}</p><p>${explain}</p>` });
  box.append(h('p', { class: 'q', html: def.q }), yours, body);
  const refresh = () => {
    const mine = ctx.predictions[id];
    if (mine === undefined) yours.textContent = 'You skipped the prediction. Try answering it from memory now before reading on.';
    else if (mine === right) yours.textContent = `You predicted ${LETTERS[mine]}. That was right from the start.`;
    else yours.textContent = `You predicted ${LETTERS[mine]}: "${def.options[mine].t.replace(/<[^>]+>/g, '').replace(/\$/g, '')}". That is a very common first guess. Here is what changes it.`;
  };
  refresh();
  ctx.onReach(box, refresh);
  put(ctx, box);
}

// Refutation: name the tempting wrong idea, then correct it.
export function myth(ctx, { wrong, right }) {
  const box = activity('myth', 'Common mix-up');
  box.append(h('div', { class: 'cols' },
    h('div', { class: 'wrongway' }, h('h4', {}, 'It is tempting to think'), h('p', { html: wrong })),
    h('div', { class: 'rightway' }, h('h4', {}, 'What actually happens'), h('p', { html: right }))));
  put(ctx, box);
}

// Clickable timeline. Each step reveals one sentence.
export function timeline(ctx, items, prompt) {
  const box = activity('timeline-act', 'Explore');
  box.append(h('p', { class: 'q' }, prompt));
  const detail = h('div', { class: 'timeline-detail', 'aria-live': 'polite' });
  const list = h('ol', { class: 'timeline' });
  const buttons = items.map((it, i) => {
    const b = h('button', { type: 'button', 'aria-pressed': 'false' }, h('b', {}, it.year), it.who);
    b.addEventListener('click', () => {
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      detail.innerHTML = `<p>${it.what}${it.lesson ? ` <a href="#/lesson/${it.lesson}">Lesson ${it.lesson}</a>` : ''}</p>`;
      typeset(detail);
    });
    list.append(h('li', {}, b));
    return b;
  });
  box.append(list, detail);
  put(ctx, box, true);
  buttons[0].click();
}

export function spotlight(ctx, id) {
  const a = APPLICATIONS.find((x) => x.id === id);
  const d = h('details', { class: 'spotlight' },
    h('summary', {}, h('span', {}, 'Where this is used'), h('strong', {}, a.title)),
    h('div', { class: 'body' }, fromHTML(a.spotlight), h('p', {}, h('a', { href: `#/applications/${a.id}` }, `More on ${a.short}, with a calculator`))));
  put(ctx, d);
}

// An equation whose parts can be tapped to explain what each one means.
// parts: { cls: { name, text } }; the TeX uses \htmlClass{eq-part cls}{...}
export function equationExplorer(ctx, { q, texSrc, parts, intro }) {
  const box = activity('eq-explore', 'Explore the equation');
  box.append(h('p', { class: 'q', html: q }));
  if (intro) box.append(h('p', { class: 'hint-line', html: intro }));
  const eq = h('div', { class: 'eq-display' });
  try { eq.innerHTML = window.katex.renderToString(texSrc, { displayMode: true, trust: (c) => c.command === '\\htmlClass', strict: false, throwOnError: false }); }
  catch { eq.textContent = texSrc; }
  const explain = h('div', { class: 'eq-explain', 'aria-live': 'polite' }, h('p', {}, 'Tap a coloured part of the equation, or a button below.'));
  const chips = h('div', { class: 'eq-chips' });
  const select = (cls) => {
    eq.querySelectorAll('.eq-part').forEach((el) => el.classList.toggle('on', el.classList.contains(cls)));
    chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cls === cls)));
    explain.innerHTML = `<p><b>${parts[cls].name}.</b> ${parts[cls].text}</p>`;
    typeset(explain);
  };
  for (const [cls, p] of Object.entries(parts)) {
    const b = h('button', { type: 'button', class: 'btn small', 'data-cls': cls, 'aria-pressed': 'false', html: p.name });
    b.addEventListener('click', () => select(cls));
    chips.append(b);
  }
  eq.addEventListener('click', (e) => {
    const part = e.target.closest('.eq-part');
    if (!part) return;
    const cls = [...part.classList].find((c) => parts[c]);
    if (cls) select(cls);
  });
  box.append(eq, chips, explain);
  put(ctx, box);
}
