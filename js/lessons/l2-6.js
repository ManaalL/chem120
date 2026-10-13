import { add, section, key, check, predict, revisit, myth } from '../learn/blocks.js';
import { worked, yourTurn } from '../learn/worked.js';
import { sim } from '../learn/sim.js';

const H4PI = 6.626e-34 / (4 * Math.PI), me = 9.109e-31;

export const meta = {
  minutes: 15,
  objectives: [
    'Use $\\Delta x\\,\\Delta p \\ge h/4\\pi$ to find the smallest possible uncertainty',
    'Explain why this rules out neat electron orbits',
    'Explain why we never notice it for everyday objects',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.6',
    q: 'Suppose you could pin down exactly where an electron is. How well could you know its speed at the same moment?',
    options: [
      { t: 'Just as exactly, with a good enough instrument' },
      { t: 'Not at all: its speed would be completely uncertain', right: true },
      { t: 'It would have to be standing still' },
    ],
  });

  section(ctx, 'Looking changes what you look at');
  add(ctx, `
    <p>To see where an electron is, you have to bounce something off it, like a photon. That collision gives the electron an unpredictable kick, changing its momentum. Try to measure the momentum carefully instead, and you lose track of the position.</p>
    <p>Imagine finding a marble on a dark floor by sweeping a stick around. The moment you touch it, you know where it was, but you have knocked it rolling in some direction you can't predict.</p>
    <p>In 1927 Werner Heisenberg put a number on the limit:</p>
  `);
  key(ctx, '$$\\Delta x\\,\\Delta p \\ge \\frac{h}{4\\pi}$$ The <dfn data-g="uncertainty">uncertainty</dfn> in position times the uncertainty in momentum can never be smaller than $h/4\\pi$. <mark>Narrow one, and the other must widen.</mark>', '$\\Delta x\\,\\Delta p \\ge h/4\\pi$. Narrow one uncertainty and the other must widen.');
  add(ctx, '<p>Since $p = mv$, a momentum spread means a speed spread: $\\Delta p = m\\,\\Delta v$.</p>');
  sim(ctx, 'uncertainty');

  section(ctx, 'An electron inside an atom');
  worked(ctx, {
    title: 'How uncertain is the speed of an electron in hydrogen?',
    problem: 'A hydrogen atom is about 100 pm across, so an electron inside has $\\Delta x \\approx 1 \\times 10^{-10}$ m. Find the smallest possible $\\Delta v$.',
    steps: [
      { say: 'Rearrange: $\\Delta p \\ge h/(4\\pi\\Delta x)$, and $\\Delta v = \\Delta p / m$.', math: '\\Delta v \\ge \\frac{h}{4\\pi\\, m_e\\, \\Delta x}' },
      { say: 'Put in the numbers.', math: '\\Delta v \\ge \\frac{6.626 \\times 10^{-34}}{4\\pi(9.109 \\times 10^{-31})(1 \\times 10^{-10})} = 5.8 \\times 10^{5}\\ \\text{m s}^{-1}' },
      { say: 'Compare with Bohr\'s speed for the $n = 1$ orbit, $2.2 \\times 10^{6}$ m s<sup>−1</sup>.', why: 'The uncertainty is about a quarter of the whole speed. You couldn\'t say how fast the electron is going, so you can\'t trace a neat circle either.' },
    ],
    answer: 'At least 580 km per second of uncertainty. <mark>A definite orbit is impossible.</mark>',
  });
  yourTurn(ctx, {
    problem: 'Now a 0.145 kg baseball whose position is known to within 1 µm ($1 \\times 10^{-6}$ m). Find the smallest $\\Delta v$.',
    steps: [
      { ask: '$\\Delta v \\ge h / (4\\pi m \\Delta x)$:', answer: H4PI / (0.145 * 1e-6), unit: 'm s<sup>−1</sup>', hint: '$4\\pi \\times 0.145 \\times 10^{-6} = 1.82 \\times 10^{-6}$. Divide $6.626 \\times 10^{-34}$ by that.' },
    ],
    done: 'About $3.6 \\times 10^{-28}$ m s<sup>−1</sup>. No instrument could ever notice that. For big objects the uncertainty principle changes nothing we can measure.',
  });
  check(ctx, {
    q: 'An electron and a proton are each known to be somewhere in a 10 pm space. Which has the bigger uncertainty in speed?',
    options: [
      { t: 'The proton', why: 'Same $\\Delta x$ gives the same $\\Delta p$. But $\\Delta v = \\Delta p/m$, and the proton is heavier.' },
      { t: 'The electron', right: true, why: '$\\Delta v = \\Delta p / m$. The electron is 1836 times lighter, so its speed is 1836 times more uncertain.' },
      { t: 'They are the same', why: 'Their momentum uncertainties match, but their masses don\'t.' },
    ],
  });

  section(ctx, 'From paths to probabilities');
  add(ctx, `
    <p>To predict a path, Newton's laws need a starting position and a starting velocity. For an electron in an atom you can't have both. So instead of asking <em>where exactly is the electron and where is it going</em>, quantum theory asks <mark>where is the electron likely to be found</mark>.</p>
  `);
  key(ctx, 'Electrons in atoms don\'t have paths. We describe them with <mark>probabilities</mark>, which is what the Schrödinger equation (lesson 2.7) gives us.');
  myth(ctx, {
    wrong: 'The uncertainty principle just means our instruments are not good enough yet.',
    right: 'Even a perfect measurement can\'t beat $h/4\\pi$. It comes from the wave nature of particles: a wave squeezed into a small space has to be built from a wide spread of wavelengths, and so a wide spread of momenta.',
  });

  revisit(ctx, '2.6', 'If $\\Delta x$ shrank to zero, $\\Delta p \\ge h/(4\\pi \\cdot 0)$ would be infinite. Knowing the position exactly means knowing nothing about the speed. In practice, the narrower you pin it down, the wider the speed spread gets.');
  void me;
}
