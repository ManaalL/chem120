import { add, section, key, check, predict, revisit, myth, spotlight } from '../learn/blocks.js';
import { worked, yourTurn } from '../learn/worked.js';
import { drawGuess, matchTask } from '../learn/interact.js';
import { sim } from '../learn/sim.js';
import * as P from '../core/physics.js';

export const meta = {
  minutes: 25,
  objectives: [
    'Describe what each of the three key experiments showed',
    'Use $E = h\\nu = hc/\\lambda$ to find the energy of a photon',
    'Use $E_\\text{photon} = w + KE$ to explain when electrons leave a metal',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.3',
    q: 'A very bright red light shines on a metal and no electrons come out. What happens with a very dim ultraviolet light?',
    options: [
      { t: 'Still nothing. Dim light has even less energy.' },
      { t: 'Electrons come out straight away', right: true },
      { t: 'Electrons come out, but only after the light has been on a while' },
    ],
  });
  add(ctx, '<p>Three experiments around 1900 gave results that classical physics could not explain. Each one is a puzzle, followed by the idea that solved it.</p>');

  section(ctx, 'Puzzle 1: the colour of hot things');
  add(ctx, `
    <p>Everything glows because of its temperature. A stove element goes from dark to red to orange as it heats up. You glow too, but in infrared that your eyes can't see. An ideal glowing object is called a <dfn data-g="blackbody">blackbody</dfn>.</p>
    <p>Scientists measured how bright a hot object is at each wavelength. Before you look, try sketching what you think they found.</p>
  `);
  drawGuess(ctx, {
    q: 'An object at 5000 K glows. Sketch how bright it is at each wavelength.',
    xLabel: 'wavelength (µm)', yLabel: 'brightness', x0: 0.05, x1: 2.5, y0: 0, y1: 1.1,
    xTicks: [{ x: 0.5, label: '0.5' }, { x: 1, label: '1' }, { x: 1.5, label: '1.5' }, { x: 2, label: '2' }],
    truth: (x) => P.planck(x * 1e-6, 5000) / P.planck(P.wienPeak(5000), 5000),
    explain: 'The real curve starts near zero at very short wavelengths, rises steeply to a peak near 0.58 µm (580 nm, yellow light), then falls away slowly. Classical physics got the left side completely wrong: it predicted the curve would shoot up forever there.',
  });
  sim(ctx, 'blackbody');
  add(ctx, `
    <p>In 1900 Max Planck found a formula that matched the measurements exactly. To get it he had to assume something strange: <mark>the atoms in the glowing object can only hold energy in whole-number multiples of a small packet, $h\\nu$</mark>.</p>
  `);
  key(ctx, '$$E_\\text{osc} = nh\\nu \\qquad n = 0, 1, 2, \\ldots$$ Energy comes in packets of size $h\\nu$, where <dfn data-g="planck">Planck\'s constant</dfn> is $h = 6.626 \\times 10^{-34}$ J s.', 'Planck: energy comes in packets $nh\\nu$, with $h = 6.626 \\times 10^{-34}$ J s.');

  section(ctx, 'Puzzle 2: light knocking out electrons');
  add(ctx, `
    <p>Shine light on a clean metal and electrons can fly off its surface. This is the photoelectric effect. Experiments found three surprises:</p>
    <ul>
      <li>Below a certain frequency, called the <dfn data-g="threshold">threshold</dfn>, <mark>no electrons come out, no matter how bright the light</mark>.</li>
      <li>Above it, electrons come out instantly, even in very dim light.</li>
      <li>Brighter light gives more electrons, not faster ones. Faster electrons need higher frequency.</li>
    </ul>
    <p>Work through the tasks below to see each one for yourself.</p>
  `);
  sim(ctx, 'photoelectric');
  add(ctx, `
    <p>Einstein explained it in 1905. Light arrives as separate packets called <dfn data-g="photon">photons</dfn>. <mark>One photon gives all its energy to one electron.</mark> Part of that energy, the <dfn data-g="workfunction">work function</dfn> $w$, is spent pulling the electron free. Whatever is left over becomes the electron's kinetic energy.</p>
    <p>Think of a vending machine that only accepts one coin at a time and needs at least a two-dollar coin. A pile of quarters is worth more in total, but no single quarter is enough, so nothing comes out. One toonie works straight away. Dim UV light is a single toonie; bright red light is a big pile of quarters.</p>
  `);
  key(ctx, '$$E_\\text{photon} = h\\nu = \\frac{hc}{\\lambda}$$ $$E_\\text{photon} = w + KE_{e^-}$$ Each photon\'s energy depends only on its frequency. <mark>Brightness changes the number of photons, not their energy.</mark>', '$E = h\\nu = hc/\\lambda$, and $E_\\text{photon} = w + KE$. Brightness changes the number of photons, not their energy.');
  myth(ctx, {
    wrong: 'Brighter light has more energetic photons.',
    right: 'Brighter light has <em>more</em> photons. The energy of each one is set only by its colour (frequency).',
  });
  worked(ctx, {
    title: 'Electrons from potassium',
    problem: 'Potassium\'s work function is $3.68 \\times 10^{-19}$ J. How fast do electrons leave when 400 nm light shines on it? ($m_e = 9.109 \\times 10^{-31}$ kg)',
    steps: [
      { say: 'Find the energy of one 400 nm photon.', math: 'E = \\frac{hc}{\\lambda} = \\frac{(6.626 \\times 10^{-34})(2.998 \\times 10^{8})}{400 \\times 10^{-9}} = 4.97 \\times 10^{-19}\\ \\text{J}' },
      { say: 'Subtract the work function to get the leftover kinetic energy.', math: 'KE = 4.97 \\times 10^{-19} - 3.68 \\times 10^{-19} = 1.29 \\times 10^{-19}\\ \\text{J}', why: 'The photon has more energy than the work function, so electrons do come out. If $KE$ came out negative, no electrons would be ejected.' },
      { say: 'Use $KE = \\tfrac12 m_e v^2$ to find the speed.', math: 'v = \\sqrt{\\frac{2\\,KE}{m_e}} = \\sqrt{\\frac{2(1.29 \\times 10^{-19})}{9.109 \\times 10^{-31}}} = 5.3 \\times 10^{5}\\ \\text{m s}^{-1}' },
    ],
    answer: 'About 530 km per second. Check it: choose potassium and 400 nm in the simulation above.',
  });
  yourTurn(ctx, {
    problem: 'Sodium\'s work function is $3.78 \\times 10^{-19}$ J. Light of 350 nm hits sodium. How fast are the electrons?',
    steps: [
      { ask: 'Energy of one 350 nm photon, in joules:', answer: (6.626e-34 * 2.998e8) / 350e-9, unit: 'J', hint: '$E = hc/\\lambda$ with $\\lambda = 350 \\times 10^{-9}$ m. $hc = 1.986 \\times 10^{-25}$ J m.' },
      { ask: 'Kinetic energy left over, $KE = E - w$:', answer: (6.626e-34 * 2.998e8) / 350e-9 - 3.78e-19, unit: 'J', hint: 'Subtract $3.78 \\times 10^{-19}$ from your photon energy.' },
      { ask: 'Speed of the electron:', answer: Math.sqrt((2 * ((6.626e-34 * 2.998e8) / 350e-9 - 3.78e-19)) / 9.109e-31), unit: 'm s<sup>−1</sup>', hint: '$v = \\sqrt{2KE/m_e}$', tol: 0.03 },
    ],
    done: 'About $6.5 \\times 10^{5}$ m s<sup>−1</sup>. Shorter wavelength than the potassium example, and a similar work function, so the electrons leave faster.',
  });

  section(ctx, 'Puzzle 3: atoms have fingerprints');
  add(ctx, `
    <p>A prism spreads white light into a rainbow. Shine that light through hydrogen gas first and a few thin dark lines appear: the gas took out those exact colours. Heat the gas so it glows by itself and you see bright lines at <mark>exactly the same wavelengths</mark>, and nothing else.</p>
    <p>Since each wavelength means a fixed photon energy, an atom that only absorbs and emits certain wavelengths can only gain and lose certain amounts of energy.</p>
  `);
  sim(ctx, 'spectra');
  key(ctx, 'Each element has its own <dfn data-g="linespectrum">line spectrum</dfn>. <mark>Lines mean the energy of an atom is quantized.</mark>');
  check(ctx, {
    q: 'Hydrogen gives out red light at 656.3 nm. Which statement explains why it is that exact wavelength?',
    options: [
      { t: 'Hot hydrogen happens to be that colour', why: 'True as a description, but it doesn\'t explain why the colour is so precise.' },
      { t: 'The photon\'s energy equals the gap between two allowed energy levels in the atom', right: true, why: 'Exactly. A fixed energy gap means a fixed photon energy, and $E = hc/\\lambda$ turns that into one exact wavelength.' },
      { t: 'The prism only lets red light through', why: 'A prism spreads all colours out; it doesn\'t remove any.' },
    ],
  });

  section(ctx, 'Putting the three together');
  matchTask(ctx, {
    q: 'Match each experiment to what it showed.',
    pairs: [
      { a: 'Glowing hot objects (Planck)', b: 'Energy is given out in packets of $h\\nu$' },
      { a: 'Photoelectric effect (Einstein)', b: 'Light itself comes in photons with $E = h\\nu$' },
      { a: 'Line spectra of atoms', b: 'An atom\'s own energy is quantized' },
    ],
    explain: 'Planck\'s constant $h$ turned up in two completely different experiments. That convinced physicists quantization was real.',
  });
  spotlight(ctx, 'gfp');

  revisit(ctx, '2.3', 'One UV photon carries more energy than the work function of most metals, so even a few of them free electrons instantly. A red photon doesn\'t carry enough, and making the light brighter only adds more red photons. Each one still fails on its own.');
}
