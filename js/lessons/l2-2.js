import { add, section, key, check, predict, revisit, myth, spotlight } from '../learn/blocks.js';
import { worked, yourTurn } from '../learn/worked.js';
import { sortTask } from '../learn/interact.js';
import { sim } from '../learn/sim.js';

export const meta = {
  minutes: 15,
  objectives: [
    'Use $\\lambda\\nu = c$ to turn a wavelength into a frequency and back',
    'Put the parts of the electromagnetic spectrum in order',
    'Say which kind of light carries more energy per photon, and why',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.2',
    q: 'Red light and blue light both travel at the same speed. Which one wiggles more times per second?',
    options: [
      { t: 'Red light' },
      { t: 'Blue light', right: true },
      { t: 'They wiggle the same number of times' },
    ],
  });

  section(ctx, 'Light is a travelling wave');
  add(ctx, `
    <p>Light is <mark>electromagnetic radiation</mark>: an electric field and a magnetic field that rise and fall together as they travel. The two fields are at right angles to each other and to the direction the light moves.</p>
    <p>Anything with electric charge that speeds up or slows down sends out these waves. In an old light bulb, the hot filament's atoms jiggle rapidly and the jiggling charges give off light.</p>
  `);
  sim(ctx, 'emWave');

  section(ctx, 'Three numbers describe a wave');
  add(ctx, `
    <p><strong>Wavelength</strong>, $\\lambda$ (lambda): the distance from one peak to the next, in metres. For visible light we usually use nanometres, $1\\ \\text{nm} = 10^{-9}$ m.</p>
    <p><strong>Frequency</strong>, $\\nu$ (nu): how many peaks pass a point each second. Its unit is $\\text{s}^{-1}$, also called hertz (Hz).</p>
    <p><strong>Speed</strong>, $c$: in a vacuum every kind of light travels at the same speed, $2.998 \\times 10^{8}$ m s<sup>−1</sup>.</p>
    <p>One full wavelength passes by in the time it takes one peak to arrive, so the speed is wavelength times frequency.</p>
  `);
  key(ctx, '$$\\lambda\\nu = c$$ Wavelength and frequency are <mark>inversely proportional</mark>. Short waves wiggle fast; long waves wiggle slowly.', '$\\lambda\\nu = c$. Shorter wavelength means higher frequency.');

  worked(ctx, {
    title: 'A red laser pointer',
    problem: 'A laser pointer gives out light with a wavelength of 650 nm. What is its frequency?',
    steps: [
      { say: 'Turn the wavelength into metres.', math: '650\\ \\text{nm} = 650 \\times 10^{-9}\\ \\text{m} = 6.50 \\times 10^{-7}\\ \\text{m}', why: 'The speed of light is in metres per second, so the wavelength has to be in metres for the units to cancel.' },
      { say: 'Rearrange $\\lambda\\nu = c$ to get the frequency on its own.', math: '\\nu = \\frac{c}{\\lambda}' },
      { say: 'Put in the numbers.', math: '\\nu = \\frac{2.998 \\times 10^{8}\\ \\text{m s}^{-1}}{6.50 \\times 10^{-7}\\ \\text{m}} = 4.61 \\times 10^{14}\\ \\text{s}^{-1}', why: 'The metres cancel, leaving s⁻¹, which is the unit of frequency.' },
    ],
    answer: 'About 461 trillion peaks pass any point every second: $\\nu = 4.61 \\times 10^{14}$ Hz.',
  });
  yourTurn(ctx, {
    problem: 'Green light from a laser has a wavelength of 532 nm. Find its frequency.',
    steps: [
      { ask: 'First, the wavelength in metres:', answer: 532e-9, unit: 'm', hint: '1 nm is $10^{-9}$ m, so 532 nm is $532 \\times 10^{-9}$ m.' },
      { ask: 'Now the frequency, $\\nu = c/\\lambda$:', answer: 2.998e8 / 532e-9, unit: 's<sup>−1</sup>', hint: 'Divide $2.998 \\times 10^{8}$ by your wavelength in metres.', show: 'Higher than the red laser, because green light has a shorter wavelength.' },
    ],
    done: '$\\nu = 5.64 \\times 10^{14}$ s<sup>−1</sup>. Shorter wavelength than red, so higher frequency.',
  });

  section(ctx, 'The electromagnetic spectrum');
  add(ctx, `
    <p>All of these are the same thing, electromagnetic radiation, at different wavelengths. Visible light is a thin slice, from about <mark>400 nm (violet) to 750 nm (red)</mark>.</p>
  `);
  sortTask(ctx, {
    q: 'Put these in order from shortest wavelength to longest.',
    ends: ['shortest wavelength', 'longest wavelength'],
    items: [
      { id: 'g', label: 'Gamma rays' }, { id: 'x', label: 'X-rays' }, { id: 'uv', label: 'Ultraviolet' }, { id: 'vis', label: 'Visible light' },
      { id: 'ir', label: 'Infrared' }, { id: 'mw', label: 'Microwaves' }, { id: 'r', label: 'Radio waves' },
    ],
    explain: 'One way to remember it: going down the list, the waves get longer and each photon carries less energy.',
  });
  add(ctx, `
    <p>Lesson 2.3 shows that each packet of light, a <dfn data-g="photon">photon</dfn>, carries energy $E = h\\nu$. Higher frequency means more energy. That is why X-rays and ultraviolet can damage DNA while radio waves pass through you harmlessly.</p>
  `);
  key(ctx, '<mark>Shorter wavelength = higher frequency = more energy per photon.</mark> Gamma rays are at one end, radio waves at the other.');
  myth(ctx, {
    wrong: 'X-rays and gamma rays travel faster than radio waves because they are more powerful.',
    right: 'All electromagnetic radiation travels at exactly the same speed, $c$, in a vacuum. Only the wavelength and frequency change.',
  });
  check(ctx, {
    q: 'Light A has twice the wavelength of light B. How do their frequencies compare?',
    options: [
      { t: 'A has twice the frequency of B', why: 'If both travel at the same speed and A\'s waves are longer, fewer of them pass each second.' },
      { t: 'A has half the frequency of B', right: true, why: '$\\nu = c/\\lambda$. Doubling $\\lambda$ halves $\\nu$.' },
      { t: 'They have the same frequency', why: 'They have the same speed, not the same frequency.' },
    ],
  });
  spotlight(ctx, 'oximetry');

  revisit(ctx, '2.2', 'Blue light has a shorter wavelength than red light (about 450 nm against 650 nm). Since both travel at the same speed and $\\nu = c/\\lambda$, the shorter blue waves pass by more often: about $6.7 \\times 10^{14}$ times per second against $4.6 \\times 10^{14}$ for red.');
}
