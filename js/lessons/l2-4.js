import { add, section, key, check, predict, revisit, myth, spotlight } from '../learn/blocks.js';
import { worked, yourTurn } from '../learn/worked.js';
import { sortTask } from '../learn/interact.js';
import { sim } from '../learn/sim.js';

const RH = 2.179e-18, HC = 6.626e-34 * 2.998e8;

export const meta = {
  minutes: 20,
  objectives: [
    'Find the energy of any level in hydrogen with $E_n = -R_H/n^2$',
    'Work out the wavelength of light given out or taken in when the electron jumps',
    'Say what Bohr got right and why his model was still replaced',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.4',
    q: 'An electron in a hydrogen atom drops from level 3 to level 2. What comes out?',
    options: [
      { t: 'The electron itself flies out of the atom' },
      { t: 'One photon with one exact wavelength', right: true },
      { t: 'A burst of light of every colour' },
      { t: 'Nothing; dropping down doesn\'t release anything' },
    ],
  });

  section(ctx, 'Bohr\'s rule: only some orbits are allowed');
  add(ctx, `
    <p>In 1913 Niels Bohr built a model of hydrogen to explain its line spectrum. He pictured the electron circling the proton, like a planet around the Sun, held in by electric attraction. Then he added a rule nobody could yet justify: <mark>only certain orbits are allowed</mark>, labelled $n = 1, 2, 3, \\ldots$</p>
    <p>He also said the electron does not give off light while it stays in an allowed orbit. <mark>Light is given out or taken in only when it jumps between orbits.</mark></p>
  `);
  sim(ctx, 'bohr');

  section(ctx, 'The energy ladder');
  add(ctx, `
    <p>From his rule Bohr worked out the energy of the electron in each orbit. You don't need the derivation, just the result:</p>
  `);
  key(ctx, '$$E_n = -\\frac{R_H}{n^2}$$ $$R_H = 2.179 \\times 10^{-18}\\ \\text{J}$$ <mark>Every level has a negative energy</mark>, and the levels get closer together as $n$ grows.', '$E_n = -R_H/n^2$, with $R_H = 2.179 \\times 10^{-18}$ J. Levels are negative and crowd together at high $n$.');
  add(ctx, `
    <h3>Why negative?</h3>
    <p>Zero is chosen as the electron completely pulled away from the proton ($n = \\infty$). A bound electron has less energy than that, so its energy is below zero. The more negative, the more tightly it is held. The <dfn data-g="groundstate">ground state</dfn>, $n = 1$, is the lowest: $E_1 = -2.179 \\times 10^{-18}$ J.</p>
    <p>Bohr also found that the orbits have radius $r_n = n^2 a_0$, where $a_0 = 52.9$ pm is the <dfn data-g="bohrradius">Bohr radius</dfn>.</p>
  `);
  check(ctx, {
    q: 'Which level has the highest (least negative) energy?',
    options: [
      { t: '$n = 1$', why: '$E_1 = -R_H$ is the most negative. That is the lowest level, not the highest.' },
      { t: '$n = 2$', why: '$E_2 = -R_H/4$. Higher than $n = 1$, but $n = 5$ is higher still.' },
      { t: '$n = 5$', right: true, why: '$E_5 = -R_H/25$ is the closest to zero, so it is the highest of these.' },
    ],
  });

  section(ctx, 'Working out the colour of a jump');
  add(ctx, `
    <p>When the electron jumps from level $n_i$ to level $n_f$, the atom's energy changes by $\\Delta E = E_f - E_i$. <mark>One photon carries exactly that energy.</mark></p>
  `);
  key(ctx, '$$\\Delta E = -R_H\\left(\\frac{1}{n_f^{2}} - \\frac{1}{n_i^{2}}\\right)$$ $$\\lambda = \\frac{hc}{|\\Delta E|}$$ $\\Delta E$ negative: a photon is <dfn data-g="emission">emitted</dfn>. $\\Delta E$ positive: a photon is <dfn data-g="absorption">absorbed</dfn>.', '$\\Delta E = -R_H(1/n_f^2 - 1/n_i^2)$; $\\lambda = hc/|\\Delta E|$. Negative $\\Delta E$ means emission.');
  worked(ctx, {
    title: 'From n = 4 to n = 2',
    problem: 'Is light absorbed or emitted, and what is its wavelength?',
    steps: [
      { say: 'Put $n_i = 4$ and $n_f = 2$ into the formula.', math: '\\Delta E = -(2.179 \\times 10^{-18})\\left(\\frac{1}{2^2} - \\frac{1}{4^2}\\right) = -(2.179 \\times 10^{-18})(0.1875)' },
      { say: 'Multiply out.', math: '\\Delta E = -4.086 \\times 10^{-19}\\ \\text{J}', why: 'Negative, so the atom lost energy. It went somewhere: into a photon. This is emission.' },
      { say: 'Turn the energy into a wavelength. Use the size of $\\Delta E$, without the minus sign.', math: '\\lambda = \\frac{hc}{|\\Delta E|} = \\frac{(6.626 \\times 10^{-34})(2.998 \\times 10^{8})}{4.086 \\times 10^{-19}} = 4.862 \\times 10^{-7}\\ \\text{m}' },
    ],
    answer: '486 nm, blue-green: one of hydrogen\'s four visible lines. (Measured: 486.1 nm. The tiny difference comes from rounding the constants.)',
  });
  yourTurn(ctx, {
    problem: 'An electron drops from $n = 5$ to $n = 2$. Find the wavelength of the photon.',
    steps: [
      { ask: 'First, $\\frac{1}{n_f^2} - \\frac{1}{n_i^2}$ (a plain number):', answer: 1 / 4 - 1 / 25, unit: '', hint: '$\\frac14 - \\frac1{25} = 0.25 - 0.04$' },
      { ask: '$\\Delta E$ in joules (include the sign):', answer: -RH * (1 / 4 - 1 / 25), unit: 'J', hint: 'Multiply your number by $-2.179 \\times 10^{-18}$.' },
      { ask: 'Wavelength in nanometres:', answer: HC / (RH * (1 / 4 - 1 / 25)) / 1e-9, unit: 'nm', hint: '$\\lambda = hc/|\\Delta E|$ gives metres. Divide by $10^{-9}$ for nm.' },
    ],
    done: '434 nm, violet. Run 5 → 2 in the simulation to check.',
  });
  sortTask(ctx, {
    q: 'Order these jumps by the energy of the photon they give out, smallest first.',
    ends: ['least energy', 'most energy'],
    items: [
      { id: '32', label: '$n = 3 \\to 2$' },
      { id: '42', label: '$n = 4 \\to 2$' },
      { id: '21', label: '$n = 2 \\to 1$' },
      { id: '31', label: '$n = 3 \\to 1$' },
    ],
    explain: 'Jumps that end on $n = 1$ are much bigger because the gap from $n = 2$ down to $n = 1$ is the largest on the ladder. Those photons are ultraviolet.',
  });

  section(ctx, 'Families of lines');
  add(ctx, `
    <p>Lines are grouped by the level they end on.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Series</th><th>Ends on</th><th>Region</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Lyman</td><td>$n = 1$</td><td>Ultraviolet</td><td>$2 \\to 1$: 121.6 nm</td></tr>
        <tr><td>Balmer</td><td>$n = 2$</td><td>Visible</td><td>$3 \\to 2$: 656.3 nm</td></tr>
        <tr><td>Paschen</td><td>$n = 3$</td><td>Infrared</td><td>$4 \\to 3$: 1875 nm</td></tr>
        <tr><td>Brackett</td><td>$n = 4$</td><td>Infrared</td><td>$5 \\to 4$: 4052 nm</td></tr>
      </tbody>
    </table></div>
  `);

  section(ctx, 'What Bohr got wrong');
  add(ctx, `
    <p>Bohr's formula gives exactly the right energies for hydrogen. The picture behind it is wrong, though:</p>
    <ul>
      <li>He <mark>assumed</mark> only some orbits are allowed without explaining why.</li>
      <li>It fails for every atom with more than one electron, even helium.</li>
      <li>Classical physics says a circling electron should give off light constantly and spiral into the nucleus. Bohr just said it doesn't.</li>
    </ul>
  `);
  myth(ctx, {
    wrong: 'Electrons travel around the nucleus in neat circular orbits, like planets.',
    right: 'Electrons don\'t follow paths at all. Lesson 2.6 shows a definite path is impossible, and lesson 2.8 shows what replaces orbits: orbitals, which describe where the electron is likely to be.',
  });
  key(ctx, 'Bohr got the <mark>right energies for the wrong reasons</mark>. The real explanation needs electron waves (2.5) and uncertainty (2.6).');
  spotlight(ctx, 'pdt');

  revisit(ctx, '2.4', 'The electron loses exactly $E_3 - E_2 = 3.03 \\times 10^{-19}$ J, and that energy leaves as one photon of one wavelength: 656 nm, red. The atom stays together; only light comes out.');
}
