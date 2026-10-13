// Spaced review. Each card sits in a box from 1 to 5. Getting it right moves it up a box
// and pushes the next review further away; missing it sends it back to box 1.
// This is the Leitner system, a simple form of spaced retrieval practice.
import { store } from '../ui/dom.js';
import { CARDS } from '../content/cards.js';

const KEY = 'chem120.m2.deck';
const DAY = 24 * 3600 * 1000;
export const INTERVAL_DAYS = [0, 0, 1, 3, 7, 16]; // index = box

export function allCards() {
  return Object.entries(CARDS).flatMap(([lesson, list]) => list.map((c, i) => ({ ...c, id: `${lesson}#${i}`, lesson })));
}
export function loadDeck() { return store.get(KEY, {}); }
function saveDeck(d) { store.set(KEY, d); }

export function rate(cardId, gotIt) {
  const d = loadDeck();
  const cur = d[cardId] || { box: 0 };
  const box = gotIt ? Math.min(5, Math.max(1, cur.box) + 1) : 1;
  d[cardId] = { box, due: Date.now() + INTERVAL_DAYS[box] * DAY, seen: (cur.seen || 0) + 1 };
  saveDeck(d);
  return d[cardId];
}

// Cards that have been seen at least once and are due now.
export function dueCards() {
  const d = loadDeck(), now = Date.now();
  return allCards().filter((c) => d[c.id] && d[c.id].due <= now);
}
export function deckStats() {
  const d = loadDeck(), now = Date.now();
  const cards = allCards();
  const seen = cards.filter((c) => d[c.id]);
  const boxes = [1, 2, 3, 4, 5].map((b) => seen.filter((c) => d[c.id].box === b).length);
  return { total: cards.length, seen: seen.length, due: seen.filter((c) => d[c.id].due <= now).length, boxes };
}
