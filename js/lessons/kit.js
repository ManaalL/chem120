// Building blocks for lesson pages.
import { h, fromHTML } from '../ui/dom.js';
import { APPLICATIONS } from '../content/applications.js';

// Appends raw HTML (with $...$ math) to the lesson body.
export function add(ctx, markup) {
  ctx.prose.append(fromHTML(markup));
}

// Places a widget in a figure frame and registers its controls with the inspector.
// widget: { el, controls, title, sub, dispose }
export function figure(ctx, widget, caption, { wide = false } = {}) {
  const frame = h('div', { class: 'fig-frame' }, widget.el);
  const fig = h('figure', { class: `fig ${wide ? 'wide' : ''}` }, frame);
  if (caption) fig.append(h('figcaption', { class: 'fig-cap', html: caption }));
  ctx.prose.append(fig);
  if (widget.controls) ctx.panel(frame, widget.controls, widget.title, widget.sub);
  if (widget.dispose) ctx.onCleanup(widget.dispose);
  widget.mounted?.();
  return fig;
}

// Expandable application panel drawn from the shared applications content.
export function spotlight(ctx, id) {
  const a = APPLICATIONS.find((x) => x.id === id);
  const d = h('details', { class: 'spotlight' },
    h('summary', {}, h('span', {}, 'Application'), h('strong', {}, a.title)),
    h('div', { class: 'body' }, fromHTML(a.spotlight), h('p', {}, h('a', { href: `#/applications/${a.id}` }, `More on ${a.short}, with a calculator`))));
  ctx.prose.append(d);
}

// Question with a hidden answer the reader reveals.
export function check(ctx, question, answer) {
  const box = h('div', { class: 'check' });
  const btn = h('button', { type: 'button', class: 'btn small' }, 'Show answer');
  btn.addEventListener('click', () => {
    const open = box.classList.toggle('open');
    btn.textContent = open ? 'Hide answer' : 'Show answer';
  });
  box.append(h('p', { class: 'q', html: question }), btn, h('div', { class: 'a', html: answer }));
  ctx.prose.append(box);
}

// Multiple choice with feedback on each option.
export function choice(ctx, question, options, explain) {
  const box = h('div', { class: 'check' }, h('p', { class: 'q', html: question }));
  const list = h('div', { class: 'choices' });
  const fb = h('div', { class: 'a', html: explain });
  options.forEach((o) => {
    const b = h('button', { type: 'button', class: 'choice', html: o.text });
    b.addEventListener('click', () => {
      b.classList.add(o.right ? 'right' : 'wrong');
      if (o.right) box.classList.add('open');
    });
    list.append(b);
  });
  box.append(list, fb);
  ctx.prose.append(box);
}
