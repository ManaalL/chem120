import { tex, h } from '../ui/dom.js';
import { add, check } from './kit.js';
import { create as quiz } from '../widgets/quiz.js';
import * as H from '../core/hydrogen.js';
import { C } from '../core/physics.js';
import { texSci } from '../widgets/quiz.js';

export const goal = 'Pull the module together and practise every kind of calculation in it.';

export function render(ctx) {
  const rows = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2]].map(([n, l]) => {
    const name = `${n}${H.SUBSHELL[l]}`;
    const ml = Array.from({ length: 2 * l + 1 }, (_, i) => i - l).map((m) => (m > 0 ? `+${m}` : m)).join(', ');
    return `<tr><td>${name}</td><td>${n}</td><td>${l}</td><td>${ml}</td><td>$${texSci(-C.RH / (n * n), 4)}$ J</td><td>${n - l - 1}</td><td>${l}</td><td>${n - 1}</td><td>${Math.round(H.mostProbableRadius(n, l) * H.A0_PM)} pm</td></tr>`;
  }).join('');

  add(ctx, tex`
    <h2>Why so much time on one atom</h2>
    <p>Orbitals are everywhere in chemistry. Chemists use them to describe, electron by electron, how atoms and molecules are built. Most of what we know about orbitals comes from hydrogen, the one atom whose Schrödinger equation can be solved exactly. That is why this module stays with hydrogen until the picture is complete.</p>

    <h2>The quantum model of hydrogen in four statements</h2>
    <ol>
      <li>The electron occupies an <strong>orbital</strong>, a wavefunction with a particular size, shape and orientation. The orbital gives the probability of finding the electron, not a path.</li>
      <li>The lowest-energy orbital is 1s. It is spherical, and the most probable distance of its electron from the nucleus is $a_0 = 52.9$ pm.</li>
      <li>Each state of the electron is labelled by four quantum numbers: $n$, $l$, $m_l$ and $m_s$.</li>
      <li>The energy depends only on $n$: $E_n = -R_H/n^2$.</li>
    </ol>

    <h2>Summary table</h2>
    <p>Notice that the energy rises with the total number of nodes.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Orbital</th><th>$n$</th><th>$l$</th><th>$m_l$ values</th><th>Energy</th><th>Radial nodes<br>$n-l-1$</th><th>Angular nodes<br>$l$</th><th>Total nodes<br>$n-1$</th><th>$r_\text{mp}$</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>

    <h2>Practice problems</h2>
    <p>Every question is generated with new numbers and has a worked solution. Answers within 1.5% count as correct. Type scientific notation as <code>6.63e-34</code> or <code>6.63x10^-34</code>.</p>
  `);

  const q = quiz();
  ctx.prose.append(q.el);

  add(ctx, tex`<h2>Check your understanding</h2><p>Before moving on, make sure you can answer these. Try each one before opening the answer.</p>`);
  const qa = [
    ['What does "quantized" mean for the energy of the electron in a hydrogen atom?', 'Its energy can only take certain values, $E_n = -R_H/n^2$, with nothing allowed in between.'],
    ['What are the three experiments that led to quantum theory, and what did each show?', 'Blackbody radiation (energy is emitted in packets $nh\\nu$), the photoelectric effect (light comes in photons with $E = h\\nu$), and atomic line spectra (atoms only absorb and emit certain energies).'],
    ['What is the significance of the Schrödinger equation?', 'It treats the electron as a wave and gives probabilities. Its solutions give the allowed energies and the orbitals, and quantization comes out of the mathematics instead of being assumed.'],
    ['What is an orbital?', 'A wavefunction $\\Psi$ for one electron. $|\\Psi|^2$ gives the probability of finding the electron at each point in space.'],
    ['What are the allowed values of $n$, $l$ and $m_l$, and how are they related?', '$n = 1, 2, 3, \\ldots$; $l = 0$ to $n - 1$; $m_l = -l$ to $+l$ in whole steps. $m_s = \\pm\\frac12$.'],
    ['What is a node? How many radial and angular nodes does an orbital have?', 'A place where $\\Psi = 0$. Angular nodes (planes or cones) number $l$; radial nodes (spheres) number $n - l - 1$; the total is $n - 1$.'],
    ['How do the size and energy of an orbital change with $n$?', 'Both increase with $n$. Orbitals get larger (the most probable radius grows roughly as $n^2$) and the energy rises toward zero, with levels closer together at high $n$.'],
    ['What does a plot of $R^2$ against $r$ tell you, and what does a plot of $r^2R^2$ against $r$ tell you?', '$R^2$ gives the probability density along one direction from the nucleus. $r^2R^2$, the radial distribution function, gives the probability of finding the electron in a thin shell at distance $r$; its highest peak is the most probable radius.'],
    ['What do the + and − signs, or two colours, on the lobes of an orbital mean?', 'The sign (phase) of $\\Psi$ in that region. They are not charges.'],
  ];
  for (const [question, answer] of qa) check(ctx, question, answer);

  ctx.prose.append(h('div', { class: 'callout' }, h('p', { html: '<b>If this feels strange, that is expected.</b> The founders of quantum theory argued about what it meant for decades. Heisenberg wrote to Pauli in 1926 that the more he thought about the physical side of Schrödinger\'s theory, the more he disliked it. The mathematics works, and every experiment agrees with it.' })));
}
