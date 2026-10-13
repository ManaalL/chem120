import { add, section, key, check, predict, revisit, myth, spotlight } from '../learn/blocks.js';
import { worked, yourTurn } from '../learn/worked.js';
import { sim } from '../learn/sim.js';

const h = 6.626e-34, me = 9.109e-31;

export const meta = {
  minutes: 18,
  objectives: [
    'Calculate the wavelength of a moving particle with $\\lambda = h/mv$',
    'Explain why electrons show wave behaviour and baseballs don\'t',
    'Describe the experiment that proved electrons behave as waves',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.5',
    q: 'Light makes rings when it passes through a tiny gap, because it is a wave. If you fire electrons through gaps between atoms, what do you think you\'ll see?',
    options: [
      { t: 'Just a spot where the electrons hit, like bullets' },
      { t: 'Rings, like light makes', right: true },
      { t: 'Nothing; electrons can\'t pass between atoms' },
    ],
  });

  section(ctx, 'Light is a wave and a particle');
  add(ctx, `
    <p>By the 1920s light had two personalities. When it passes through a narrow gap it spreads out and makes rings, called <dfn data-g="diffraction">diffraction</dfn>. Only waves do that. In the photoelectric effect it acts like separate particles, photons. <mark>Which one you see depends on the experiment.</mark></p>
  `);

  section(ctx, 'de Broglie\'s idea: particles are waves too');
  add(ctx, `
    <p>In 1924 Louis de Broglie flipped it around. If light, a wave, can act like particles, maybe particles can act like waves. A particle with mass $m$ moving at speed $v$ has <dfn data-g="momentum">momentum</dfn> $p = mv$. He proposed it has a wavelength:</p>
  `);
  key(ctx, '$$\\lambda = \\frac{h}{p} = \\frac{h}{mv}$$ Because $h$ is so tiny, the wavelength is <mark>only big enough to matter when $mv$ is tiny too</mark>, as for an electron.', '$\\lambda = h/mv$. Only noticeable for very light particles like electrons.');
  sim(ctx, 'debroglie');
  worked(ctx, {
    title: 'An electron and a baseball',
    problem: 'Find the wavelength of an electron at $1.0 \\times 10^{6}$ m s<sup>−1</sup>, and of a 0.145 kg baseball at 40 m s<sup>−1</sup>.',
    steps: [
      { say: 'Electron: put its mass and speed into $\\lambda = h/mv$.', math: '\\lambda = \\frac{6.626 \\times 10^{-34}}{(9.109 \\times 10^{-31})(1.0 \\times 10^{6})} = 7.3 \\times 10^{-10}\\ \\text{m} = 730\\ \\text{pm}', why: 'J s is the same as kg m² s⁻¹, so dividing by kg × m s⁻¹ leaves metres.' },
      { say: 'Baseball: same formula.', math: '\\lambda = \\frac{6.626 \\times 10^{-34}}{(0.145)(40)} = 1.1 \\times 10^{-34}\\ \\text{m}' },
      { say: 'Compare each with the size of an atom, about $10^{-10}$ m.', why: 'Diffraction only happens when the wavelength is similar to the size of the gap. Atoms in a crystal make gaps about $10^{-10}$ m wide.' },
    ],
    answer: 'The electron\'s wavelength is a few atoms wide, so crystals can diffract it. The baseball\'s is $10^{24}$ times smaller than an atom. Nothing could ever diffract it.',
  });
  yourTurn(ctx, {
    problem: 'A proton ($m = 1.673 \\times 10^{-27}$ kg) moves at $2.0 \\times 10^{4}$ m s<sup>−1</sup>. What is its de Broglie wavelength?',
    steps: [
      { ask: 'Momentum, $p = mv$:', answer: 1.673e-27 * 2e4, unit: 'kg m s<sup>−1</sup>', hint: 'Multiply $1.673 \\times 10^{-27}$ by $2.0 \\times 10^{4}$.' },
      { ask: 'Wavelength, $\\lambda = h/p$, in picometres:', answer: h / (1.673e-27 * 2e4) / 1e-12, unit: 'pm', hint: 'Divide $6.626 \\times 10^{-34}$ by your momentum to get metres, then divide by $10^{-12}$.' },
    ],
    done: 'About 20 pm, small but still within reach of atom-sized gaps. Protons and even whole atoms have been diffracted.',
  });

  section(ctx, 'The proof: electrons make rings');
  add(ctx, `
    <p>In 1927, two teams fired electrons at thin metal crystals. Davisson and Germer in the US bounced them off nickel; G. P. Thomson in Scotland sent them through gold foil. Both saw <mark>diffraction patterns, exactly like a wave would make</mark>. The gaps between the metal's atoms acted as the slits.</p>
    <p>Watch closely: each electron arrives at one spot, like a particle. The wave pattern only appears as more arrive.</p>
  `);
  sim(ctx, 'diffraction');
  key(ctx, 'An electron is neither a tiny ball nor a spread-out wave. <mark>It acts like a particle when it is detected and like a wave when it travels.</mark> Any full description of an electron in an atom has to include its wave behaviour.');
  myth(ctx, {
    wrong: 'Each electron splits up and goes through many gaps at once, and the pieces land in different places.',
    right: 'Each electron is always detected whole, at a single point. The wave describes <em>where it is likely to land</em>. That is the idea lesson 2.7 builds on.',
  });

  section(ctx, 'Waves explain Bohr\'s rule');
  add(ctx, `
    <p>Remember that Bohr had to assume only some orbits are allowed. de Broglie's idea explains why. Wrap an electron wave around a circular orbit. <mark>It only joins up with itself if a whole number of wavelengths fits.</mark> Anything else cancels itself out.</p>
  `);
  sim(ctx, 'ringWave');
  add(ctx, `
    <p>Fitting $n$ wavelengths around a circle means $2\\pi r = n\\lambda$. Put in $\\lambda = h/m_ev$ and rearrange:</p>
    $$m_e v r = n\\,\\frac{h}{2\\pi}$$
    <p>That is exactly Bohr's rule. Quantization comes from waves fitting, the same reason a guitar string only plays certain notes. The orbit picture is still wrong, but this idea, that <mark>confined waves only come in certain patterns</mark>, carries straight on to lesson 2.7.</p>
  `);
  check(ctx, {
    q: 'An electron and a proton move at the same speed. Which has the longer wavelength?',
    options: [
      { t: 'The proton, because it is bigger', why: 'Size doesn\'t appear in $\\lambda = h/mv$. Mass does, and more mass means a shorter wavelength.' },
      { t: 'The electron, by about 1836 times', right: true, why: 'Same speed, but the electron is 1836 times lighter, so its wavelength is 1836 times longer.' },
      { t: 'They are the same, because the speeds are the same', why: 'Wavelength depends on momentum, $mv$, not on speed alone.' },
    ],
  });
  spotlight(ctx, 'tem');

  revisit(ctx, '2.5', 'Electrons fired at a thin crystal make rings, just like light through a tiny gap. Each one lands as a single dot, but together they build up a wave pattern. Electrons are waves as well as particles.');
  void me;
}
