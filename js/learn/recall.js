// Flashcard recall: read the question, answer it in your head, then check and rate yourself.
// Ratings feed the spaced review deck on the Review page.
import { h, typeset } from '../ui/dom.js';
import { rate } from './deck.js';

export function flashcards(container, cards, { title, onDone } = {}) {
  const box = h('div', { class: 'flash' });
  container.append(box);
  let i = 0;
  const results = cards.map(() => null);
  const dots = h('div', { class: 'flash-dots', 'aria-hidden': 'true' }, cards.map(() => h('i')));
  const front = h('p', { class: 'front' });
  const back = h('div', { class: 'back', hidden: true });
  const cardEl = h('div', { class: 'flash-card', 'aria-live': 'polite' }, front, back);
  const showBtn = h('button', { type: 'button', class: 'btn small primary' }, 'Show answer');
  const gotBtn = h('button', { type: 'button', class: 'btn small', hidden: true }, 'I got it');
  const againBtn = h('button', { type: 'button', class: 'btn small', hidden: true }, 'Not yet');
  const count = h('span');
  box.append(title ? h('p', { class: 'q' }, title) : null, cardEl, h('div', { class: 'flash-meta' }, h('div', { class: 'btn-row', style: { margin: 0 } }, showBtn, gotBtn, againBtn), h('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } }, count, dots)));

  function render() {
    [...dots.children].forEach((d, k) => { d.className = results[k] === true ? 'got' : results[k] === false ? 'again' : ''; if (k === i) d.classList.add('now'); });
    if (i >= cards.length) {
      const got = results.filter(Boolean).length;
      front.textContent = `Done: ${got} of ${cards.length} recalled.`;
      back.hidden = false;
      back.innerHTML = got === cards.length
        ? '<p>All of them. These cards will come back on the Review page in a few days, which is when recalling them again does the most good.</p>'
        : '<p>The ones marked "Not yet" come back first on the Review page. Trying again after a gap works better than rereading now.</p>';
      showBtn.hidden = false; showBtn.textContent = 'Go through again'; gotBtn.hidden = againBtn.hidden = true;
      count.textContent = '';
      onDone?.(got);
      return;
    }
    const c = cards[i];
    front.innerHTML = c.front; back.innerHTML = c.back; back.hidden = true;
    showBtn.hidden = false; showBtn.textContent = 'Show answer'; gotBtn.hidden = againBtn.hidden = true;
    count.textContent = `${i + 1} of ${cards.length}`;
    typeset(cardEl);
  }
  showBtn.addEventListener('click', () => {
    if (i >= cards.length) { i = 0; results.fill(null); render(); return; }
    back.hidden = false; showBtn.hidden = true; gotBtn.hidden = againBtn.hidden = false; gotBtn.focus({ preventScroll: true });
  });
  const answer = (ok) => { results[i] = ok; if (cards[i].id) rate(cards[i].id, ok); i++; render(); };
  gotBtn.addEventListener('click', () => answer(true));
  againBtn.addEventListener('click', () => answer(false));
  render();
  return box;
}
