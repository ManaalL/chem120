import { h } from '../ui/dom.js';
import { add, section, key } from '../learn/blocks.js';
import { matchTask, sortTask } from '../learn/interact.js';
import { create as quiz, texSci } from '../widgets/quiz.js';
import * as H from '../core/hydrogen.js';
import { C } from '../core/physics.js';

export const meta = {
  minutes: 20,
  objectives: [
    'Retell the story of the module from the first experiments to spin',
    'Pick the right equation for each kind of problem',
    'Solve mixed problems without being told which topic they come from',
  ],
};

export function render(ctx) {
  section(ctx, 'The story in one line each');
  add(ctx, '<p>Try to put the story back together from memory before checking.</p>');
  sortTask(ctx, {
    q: 'Order these ideas in the sequence the module tells them.',
    ends: ['first', 'last'],
    items: [
      { id: 'a', label: 'Hot objects and light hitting metal show energy comes in packets' },
      { id: 'b', label: 'Hydrogen\'s line spectrum shows its energy levels are fixed' },
      { id: 'c', label: 'Bohr gets the right energies with fixed orbits' },
      { id: 'd', label: 'Electrons turn out to be waves' },
      { id: 'e', label: 'Exact paths turn out to be impossible' },
      { id: 'f', label: 'Schrödinger\'s equation gives orbitals and probabilities' },
      { id: 'g', label: 'A magnet reveals a fourth quantum number, spin' },
    ],
    explain: 'Each step answered a question left open by the one before.',
  });

  section(ctx, 'Which equation for which job?');
  matchTask(ctx, {
    q: 'Match each question to the equation you would use.',
    pairs: [
      { a: 'What is the frequency of 500 nm light?', b: '$\\lambda\\nu = c$' },
      { a: 'How much energy does one photon carry?', b: '$E = h\\nu = hc/\\lambda$' },
      { a: 'How fast are electrons ejected from a metal?', b: '$E_\\text{photon} = w + \\tfrac12 m_e v^2$' },
      { a: 'What colour does hydrogen give off for $4 \\to 2$?', b: '$\\Delta E = -R_H(1/n_f^2 - 1/n_i^2)$' },
      { a: 'What is the wavelength of a moving electron?', b: '$\\lambda = h/mv$' },
      { a: 'How uncertain is the speed of a trapped electron?', b: '$\\Delta x\\,\\Delta p \\ge h/4\\pi$' },
    ],
    explain: 'Most problems in this module are one of these six, sometimes two chained together.',
  });

  section(ctx, 'Summary table');
  const rows = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2]].map(([n, l]) => {
    const ml = Array.from({ length: 2 * l + 1 }, (_, i) => i - l).map((m) => (m > 0 ? `+${m}` : m)).join(', ');
    return `<tr><td>${n}${H.SUBSHELL[l]}</td><td>${n}</td><td>${l}</td><td>${ml}</td><td>$${texSci(-C.RH / (n * n), 4)}$ J</td><td>${n - l - 1}</td><td>${l}</td><td>${n - 1}</td><td>${Math.round(H.mostProbableRadius(n, l) * H.A0_PM)} pm</td></tr>`;
  }).join('');
  add(ctx, `<div class="table-wrap"><table>
      <thead><tr><th>Orbital</th><th>$n$</th><th>$l$</th><th>$m_l$</th><th>Energy</th><th>Radial nodes</th><th>Angular nodes</th><th>Total</th><th>Most probable $r$</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p>Notice: energy depends only on $n$, and so does the total number of nodes. <mark>More nodes, higher energy.</mark></p>`);
  key(ctx, 'The quantum model in four statements: the electron occupies an <mark>orbital</mark> that gives probabilities, not a path; the lowest is 1s with most probable radius 52.9 pm; each state has four quantum numbers $n$, $l$, $m_l$, $m_s$; and in hydrogen the energy is $E_n = -R_H/n^2$.', 'Orbitals give probabilities; 1s peaks at 52.9 pm; four quantum numbers; $E_n = -R_H/n^2$.');

  section(ctx, 'Mixed practice');
  add(ctx, '<p>These questions are shuffled across every topic, so you have to work out which idea applies before you solve it. That is harder than practising one topic at a time, and it is what tests feel like. Every question has fresh numbers and a worked solution.</p>');
  const box = h('section', { class: 'activity wide' }, h('p', { class: 'tag' }, h('span', { class: 'tag-dot' }), 'Practice problems'));
  box.append(quiz().el);
  ctx.root.append(box);
  add(ctx, '<p>For spaced practice over the next days, the <a href="#/review">Review page</a> brings back the recall cards from every lesson you have studied, at the moment you are about to forget them.</p>');
}
