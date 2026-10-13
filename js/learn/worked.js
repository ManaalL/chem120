// Worked examples shown one step at a time, then a matching problem the reader solves
// step by step with hints. Studying a worked example and then solving a similar problem
// (with support that fades) is one of the best-supported ways to learn problem solving.
import { h, typeset } from '../ui/dom.js';
import { parseNumber } from '../widgets/quiz.js';
import { sci } from '../core/physics.js';

const put = (ctx, el) => { el.classList.add('activity'); ctx.root.append(el); typeset(el); return el; };

/**
 * steps: [{ say: html, math: tex, why: html }]
 */
export function worked(ctx, { title, problem, steps, answer }) {
  const box = h('section', { class: 'worked' }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), 'Worked example'));
  box.append(h('p', { class: 'q', html: title }), h('p', { html: problem }));
  const list = h('ol', { class: 'steps' });
  const ans = h('p', { class: 'answer-line', hidden: true, html: answer });
  const btn = h('button', { type: 'button', class: 'btn small primary' }, 'Show step 1');
  const all = h('button', { type: 'button', class: 'btn small ghost' }, 'Show all');
  let shown = 0;
  const showNext = () => {
    if (shown >= steps.length) return;
    const s = steps[shown++];
    const li = h('li', {}, h('div', {},
      h('p', { class: 'say', html: s.say }),
      s.math ? h('div', { html: `$$${s.math}$$` }) : null,
      s.why ? h('details', {}, h('summary', { style: { cursor: 'pointer', color: 'var(--accent)', fontSize: '15px' } }, 'Why this step?'), h('p', { class: 'why', html: s.why })) : null));
    list.append(li);
    typeset(li);
    if (shown === steps.length) { ans.hidden = false; typeset(ans); btn.hidden = true; all.hidden = true; }
    else btn.textContent = `Show step ${shown + 1}`;
  };
  btn.addEventListener('click', showNext);
  all.addEventListener('click', () => { while (shown < steps.length) showNext(); });
  box.append(list, ans, h('div', { class: 'btn-row', style: { marginTop: '12px' } }, btn, all));
  return put(ctx, box);
}

/**
 * The reader works a problem in steps. Each step checks a number, gives a hint after a
 * wrong try, and can be revealed if they are stuck.
 * steps: [{ ask: html, answer: number, unit, tol (fraction, default 0.02), hint: html, show: html }]
 */
export function yourTurn(ctx, { title, problem, steps, done }) {
  const box = h('section', { class: 'your-turn' }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), 'Your turn'));
  box.append(h('p', { class: 'q', html: title || 'Try a similar one' }), h('p', { html: problem }),
    h('p', { class: 'hint-line' }, 'Type numbers like 4.61e14 or 4.61x10^14. Answers within about 2% count.'));
  const list = h('ol', { class: 'steps' });
  const end = h('div', { class: 'answer-line', hidden: true, html: done || 'Done. You solved it step by step.' });
  box.append(list, end);
  let at = 0;
  const items = steps.map((s, i) => {
    const input = h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': `Answer for step ${i + 1}` });
    const res = h('p', { class: 'step-result', 'aria-live': 'polite' });
    const checkBtn = h('button', { type: 'button', class: 'btn small primary' }, 'Check');
    const showBtn = h('button', { type: 'button', class: 'btn small ghost' }, 'Show me');
    const row = h('div', { class: 'num-input' }, input, s.unit ? h('span', { class: 'unit', html: s.unit }) : null, checkBtn, showBtn);
    const li = h('li', { hidden: i > 0 }, h('div', {}, h('p', { class: 'say', html: s.ask }), row, res));
    let tries = 0;
    const finish = (how) => {
      row.classList.add('right'); input.setAttribute('readonly', ''); checkBtn.hidden = true; showBtn.hidden = true;
      res.className = 'step-result ok';
      res.innerHTML = how === 'shown' ? `The answer is ${fmt(s.answer)} ${s.unit || ''}. ${s.show || ''}` : `Correct. ${s.show || ''}`;
      typeset(res);
      at = i + 1;
      if (items[at]) { items[at].li.hidden = false; typeset(items[at].li); }
      else { end.hidden = false; typeset(end); }
    };
    const check = () => {
      const x = parseNumber(input.value);
      if (!Number.isFinite(x)) { res.className = 'step-result no'; res.textContent = 'Enter a number.'; return; }
      const tol = s.tol ?? 0.02;
      if (Math.abs(x - s.answer) <= tol * Math.abs(s.answer || 1)) return finish('right');
      tries++;
      res.className = 'step-result no';
      let msg = 'Not yet. ';
      const lg = Math.log10(Math.abs(x / s.answer));
      if (Number.isFinite(lg) && Math.abs(lg - Math.round(lg)) < 0.02 && Math.round(lg) !== 0) msg += `You're off by a power of ten (10^${Math.round(lg)}). Check unit conversions. `;
      else if (x * s.answer < 0) msg += 'Check the sign. ';
      res.innerHTML = msg + (tries >= 1 && s.hint ? `Hint: ${s.hint}` : '');
      typeset(res);
    };
    checkBtn.addEventListener('click', check);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    showBtn.addEventListener('click', () => { input.value = fmt(s.answer); finish('shown'); });
    list.append(li);
    return { li };
  });
  return put(ctx, box);
}

const fmt = (x) => (Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-2 && x !== 0) ? sci(x, 3) : String(Number(x.toPrecision(4))));
