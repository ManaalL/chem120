import { add, section, key, check, predict, revisit, myth, equationExplorer } from '../learn/blocks.js';
import { sim } from '../learn/sim.js';

export const meta = {
  minutes: 18,
  objectives: [
    'Say in plain words what the Schrödinger equation does',
    'Explain what $\\Psi$ and $\\Psi^2$ mean',
    'Use the rules for $n$, $l$ and $m_l$ to tell which orbitals exist',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.7',
    q: 'Pictures often show an electron as a fuzzy "cloud" around the nucleus. What does that cloud actually show?',
    options: [
      { t: 'The electron smeared out into a thin mist' },
      { t: 'A map of where the electron is likely to be found', right: true },
      { t: 'The path the electron travels around the nucleus' },
      { t: 'Many electrons spread around the atom' },
    ],
  });

  section(ctx, 'An equation for electron waves');
  add(ctx, `
    <p>Lessons 2.5 and 2.6 set two rules for any good theory of the electron: it has to treat the electron as a wave, and its answers have to be probabilities. In 1926 Erwin Schrödinger wrote down an equation that does both.</p>
    <p>You don't need to solve it, or memorize it, in this course. But it helps to know what each piece means. Tap the parts.</p>
  `);
  equationExplorer(ctx, {
    q: 'The Schrödinger equation for hydrogen\'s electron',
    texSrc: String.raw`\htmlClass{eq-part ke}{-\frac{h^2}{8\pi^2 m_e}\nabla^2\Psi} \;+\; \htmlClass{eq-part pe}{V\,\Psi} \;=\; \htmlClass{eq-part te}{E\,\Psi}`,
    parts: {
      ke: { name: 'Kinetic energy part', text: 'Measures how sharply the wave $\\Psi$ curves in space. A more tightly curved wave means more kinetic energy. The symbol $\\nabla^2$ just means "how much it curves in all three directions".' },
      pe: { name: 'Potential energy part', text: '$V$ is the electric attraction between the proton and electron, $V = -e^2/4\\pi\\varepsilon_0 r$. It gets more negative the closer the electron is to the nucleus.' },
      te: { name: 'Total energy', text: '$E$ is the total energy of the electron. The equation only has sensible solutions for certain values of $E$. Those are the allowed energies.' },
    },
    intro: 'In words: kinetic energy + potential energy = total energy, written for a wave.',
  });
  add(ctx, `
    <p>Here is the important part. The unknowns are $E$ and $\\Psi$. <mark>The equation only has sensible solutions for certain values of $E$</mark>, ones where the wave fades to zero far from the nucleus instead of blowing up. So quantization isn't assumed, the way Bohr had to. It falls out of the maths, the same way a drum skin can only vibrate in certain patterns.</p>
  `);
  key(ctx, 'Solving the Schrödinger equation gives the allowed energies and, for each one, a <dfn data-g="wavefunction">wavefunction</dfn> $\\Psi$. <mark>Quantization comes out of the equation, not from an assumption.</mark>');

  section(ctx, 'What Ψ means');
  add(ctx, `
    <p>$\\Psi$ itself is a wave that can be positive or negative. It can't be measured directly. Its square can:</p>
  `);
  key(ctx, '$$\\Psi^2 \\to \\text{probability of finding the electron at each point}$$ Where $\\Psi^2$ is large, <mark>the electron is likely to be found</mark>. This is the Born interpretation.', '$\\Psi^2$ gives the probability of finding the electron at each point (Born interpretation).');
  add(ctx, `
    <p>Measure the electron's position once and you find it at a single spot. Measure again and it is somewhere else. Plot thousands of measurements and the dots pile up most where $\\Psi^2$ is biggest. Try it.</p>
  `);
  sim(ctx, 'born');
  myth(ctx, {
    wrong: 'The electron is spread out like a cloud of charge.',
    right: 'An electron is always found whole, at one point. The "cloud" is a summary of many measurements: a map of likelihood. Schrödinger himself first thought the electron was smeared out, but experiments never find part of an electron.',
  });

  section(ctx, 'Quantum numbers label the orbitals');
  add(ctx, `
    <p>Each solution for hydrogen is called an <dfn data-g="orbital">orbital</dfn>. Every orbital is labelled by three whole numbers that come out of the maths:</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Symbol</th><th>Tells you</th><th>Allowed values</th></tr></thead>
      <tbody>
        <tr><td>$n$</td><td>size and energy</td><td>$1, 2, 3, \\ldots$</td></tr>
        <tr><td>$l$</td><td>shape</td><td>$0$ up to $n - 1$</td></tr>
        <tr><td>$m_l$</td><td>which way it points</td><td>$-l$ up to $+l$</td></tr>
      </tbody>
    </table></div>
    <p>Values of $l$ have letters: <mark>$l = 0, 1, 2, 3$ are s, p, d, f</mark>. So a 3d orbital has $n = 3$ and $l = 2$. Build some below and try breaking the rules.</p>
  `);
  sim(ctx, 'qnBuilder');
  check(ctx, {
    q: 'Which set of quantum numbers is <em>not</em> allowed?',
    options: [
      { t: '$n = 3,\\ l = 2,\\ m_l = -2$', why: 'Allowed: $l \\le n - 1 = 2$ and $m_l$ is between $-2$ and $+2$. This is a 3d orbital.' },
      { t: '$n = 2,\\ l = 2,\\ m_l = 0$', right: true, why: '$l$ can be at most $n - 1 = 1$. There is no 2d orbital.' },
      { t: '$n = 4,\\ l = 0,\\ m_l = 0$', why: 'Allowed. This is the 4s orbital.' },
      { t: '$n = 2,\\ l = 1,\\ m_l = +1$', why: 'Allowed. This is one of the three 2p orbitals.' },
    ],
  });

  section(ctx, 'Same energy for the whole shell');
  add(ctx, `
    <p>The energies that come out are exactly Bohr's: $E_n = -R_H/n^2$. They depend only on $n$. So every orbital in a shell has the same energy. Orbitals with equal energy are called <dfn data-g="degenerate">degenerate</dfn>.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>$n$</th><th>Orbitals</th><th>How many</th><th>Energy</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>1s</td><td>1</td><td>$-2.179 \\times 10^{-18}$ J</td></tr>
        <tr><td>2</td><td>2s, three 2p</td><td>4</td><td>$-0.545 \\times 10^{-18}$ J</td></tr>
        <tr><td>3</td><td>3s, three 3p, five 3d</td><td>9</td><td>$-0.242 \\times 10^{-18}$ J</td></tr>
      </tbody>
    </table></div>
  `);
  key(ctx, 'Shell $n$ has <mark>$n^2$ orbitals</mark>, and in hydrogen they all have the same energy.');

  revisit(ctx, '2.7', 'The cloud is a probability map, $\\Psi^2$. Dense regions are where measurements usually find the electron. Each single measurement finds the whole electron at one point.');
}
