// Experiments: every guided simulation on its own page.
import { h } from '../ui/dom.js';
import { mountSim } from '../learn/sim.js';

const LIST = [
  ['photoelectric', 'Photoelectric effect', '2.3'], ['blackbody', 'Glowing objects', '2.3'], ['spectra', 'Hydrogen spectra', '2.3'],
  ['bohr', 'Electron jumps', '2.4'], ['diffraction', 'Electron diffraction', '2.5'], ['ringWave', 'Wave on an orbit', '2.5'],
  ['debroglie', 'Particle wavelengths', '2.5'], ['uncertainty', 'Uncertainty', '2.6'], ['born', 'Position measurements', '2.7'],
  ['qnBuilder', 'Quantum numbers', '2.7'], ['orbitalViews', 'Orbital pictures', '2.8'], ['rdfBuilder', 'Most likely distance', '2.8'],
  ['radialTool', 'Radial graphs', '2.8'], ['sternGerlach', 'Stern-Gerlach', '2.9'], ['emWave', 'Light as a wave', '2.2'], ['rampStairs', 'Ramp and stairs', '2.1'],
];

export function render(ctx, arg) {
  const current = LIST.find((e) => e[0] === arg) || LIST[0];
  const page = h('div', { class: 'page', style: { maxWidth: '68rem' } });
  ctx.main.append(page);
  page.append(h('header', { class: 'page-head' },
    h('p', { class: 'kicker' }, 'Explore'),
    h('h1', {}, 'Experiments'),
    h('p', { class: 'goal' }, 'Every simulation from the lessons. Each has a key to what you are looking at and a short list of things to try. The lesson it comes from explains the idea behind it.')),
    h('nav', { class: 'tabs', 'aria-label': 'Choose an experiment' }, LIST.map(([k, label]) => h('a', { href: `#/sandbox/${k}`, 'aria-selected': String(k === current[0]) }, label))));
  const s = mountSim(page, current[0]);
  ctx.onCleanup(() => s.dispose());
  page.append(h('p', { class: 'fig-cap' }, 'Comes from ', h('a', { href: `#/lesson/${current[2]}` }, `lesson ${current[2]}`), '.'));
}
