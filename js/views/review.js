// Review: spaced recall of cards from studied lessons, plus mixed practice problems.
import { h } from '../ui/dom.js';
import { flashcards } from '../learn/recall.js';
import { allCards, dueCards, deckStats, loadDeck, INTERVAL_DAYS } from '../learn/deck.js';
import { LESSONS } from '../lessons/registry.js';
import { create as quiz } from '../widgets/quiz.js';

export function render(ctx) {
  const page = h('div', { class: 'page' });
  ctx.main.append(page);
  const st = deckStats();
  page.append(h('header', { class: 'page-head' },
    h('p', { class: 'kicker' }, 'Practise'),
    h('h1', {}, 'Review'),
    h('p', { class: 'goal' }, 'Short, spaced recall sessions. Cards you know come back after longer and longer gaps; cards you miss come back soon. A few minutes here every couple of days does more than hours of rereading the night before a test.')));

  page.append(h('div', { class: 'review-stats' },
    h('div', {}, h('b', {}, String(st.due)), 'cards due now'),
    h('div', {}, h('b', {}, `${st.seen} / ${st.total}`), 'cards started'),
    h('div', {}, h('b', {}, String(st.boxes[3] + st.boxes[4])), 'cards well learned')));
  const max = Math.max(1, ...st.boxes);
  page.append(h('p', { class: 'ctl-label', style: { margin: '6px 0 4px', fontSize: '14px', color: 'var(--muted)' } }, 'Where your cards are. Box 1 comes back every session; box 5 waits about two weeks.'),
    h('div', { class: 'boxes', 'aria-label': `Cards per box: ${st.boxes.join(', ')}` }, st.boxes.map((n, i) => h('div', { style: { height: `${8 + (56 * n) / max}px`, background: i >= 3 ? 'var(--ok)' : i >= 1 ? 'var(--accent)' : 'var(--warn)', opacity: n ? 1 : 0.25 } }, h('span', {}, `Box ${i + 1}: ${n}`)))));

  const deckHost = h('section', { class: 'activity', style: { marginTop: '34px' } }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), 'Recall session'));
  page.append(deckHost);
  const due = dueCards();
  if (due.length) {
    flashcards(deckHost, shuffle(due).slice(0, 12), { onDone: () => ctx.refreshReviewBadge?.() });
  } else if (st.seen === 0) {
    deckHost.append(h('p', { class: 'q' }, 'No cards yet.'), h('p', {}, 'Each lesson ends with recall cards. Once you have rated them, they show up here on a schedule. Start with ', h('a', { href: '#/lesson/2.1' }, 'lesson 2.1'), ', or pick a lesson below to study its cards now.'));
  } else {
    const d = loadDeck();
    const next = Math.min(...Object.values(d).map((x) => x.due));
    const days = Math.max(0, Math.ceil((next - Date.now()) / 86400000));
    deckHost.append(h('p', { class: 'q' }, 'Nothing due right now.'), h('p', {}, `Your next cards come back ${days <= 1 ? 'tomorrow' : `in ${days} days`}. Waiting is part of the method: recalling something just as you are starting to forget it is what makes it last. You can still study a lesson's cards below.`));
  }

  page.append(h('h2', {}, 'Study one lesson\'s cards'));
  const picker = h('div', { class: 'tabs' });
  const host = h('section', { class: 'activity', hidden: true });
  LESSONS.forEach((l) => {
    const cards = allCards().filter((c) => c.lesson === l.id);
    if (!cards.length) return;
    const a = h('a', { href: '#', 'aria-selected': 'false' }, `${l.id} (${cards.length})`);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      picker.querySelectorAll('a').forEach((x) => x.setAttribute('aria-selected', String(x === a)));
      host.hidden = false; host.replaceChildren(h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), `${l.id} ${l.title}`));
      flashcards(host, cards, { onDone: () => ctx.refreshReviewBadge?.() });
    });
    picker.append(a);
  });
  page.append(picker, host);

  page.append(h('h2', {}, 'Mixed practice problems'));
  page.append(h('p', {}, 'Problems from every topic, shuffled. Working out which idea a problem needs is a skill in itself, and mixing topics trains it.'));
  const qbox = h('section', { class: 'activity' });
  qbox.append(quiz().el);
  page.append(qbox);
  page.append(h('p', { class: 'ctl-hint', style: { marginTop: '24px' } }, `Review schedule: box 1 every session, then ${INTERVAL_DAYS.slice(2).join(', ')} days. Your progress is saved in this browser only.`));
}

function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
