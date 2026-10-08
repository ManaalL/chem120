// Landing page: live orbital hero, spectrum strip, module grid, lesson list and tools.
import { h, katexString } from '../ui/dom.js';
import { LESSONS } from '../lessons/registry.js';
import { OrbitalView } from '../widgets/orbital-engine.js';

const HERO_ORBITALS = [
  { id: '2pz', tex: '2p_z' },
  { id: '3dz2', tex: '3d_{z^2}' },
  { id: '3dxy', tex: '3d_{xy}' },
  { id: '3pz', tex: '3p_z' },
];

export function renderHome({ main, onCleanup, spectrumStrip, progress }) {
  const p = progress.get();
  const started = Object.keys(p.visited).length > 0;
  const next = LESSONS.find((l) => !p.done[l.id]) || LESSONS[0];

  const viewport = h('div', { class: 'hero-viewport' });
  const caption = h('p', { class: 'hero-caption' });
  const switcher = h('div', { class: 'hero-switch', role: 'group', 'aria-label': 'Choose an orbital' });
  viewport.append(caption, switcher);

  main.append(
    h('section', { class: 'home-hero' },
      h('div', {},
        h('p', { class: 'course' }, 'CHEM 120/121, University of Waterloo. Module 2'),
        h('h1', {}, 'Quantum theory and the hydrogen atom'),
        h('p', { class: 'lede' }, 'An electron held by a nucleus can only have certain energies. This module builds that idea from the experiments that forced it, through Bohr and de Broglie, to orbitals like the one shown here. Every figure here is computed live from the equations in the course.'),
        h('div', { class: 'hero-actions' },
          h('a', { class: 'btn primary', href: `#/lesson/${next.id}` }, started ? `Continue with ${next.id}` : 'Start at lesson 2.1'),
          h('a', { class: 'btn', href: '#/lab' }, 'Open the orbital lab'))),
      viewport),
    spectrumStrip(),
  );

  // Hero orbital: a sampled point cloud, rotating slowly.
  const view = new OrbitalView(viewport, { orbital: '3dz2', surface: false, cloud: true, points: 36000, axes: false, autoRotate: true });
  onCleanup(() => view.dispose());
  const buttons = HERO_ORBITALS.map((o) => {
    const b = h('button', { type: 'button', 'aria-pressed': String(o.id === '3dz2'), html: katexString(o.tex) });
    b.addEventListener('click', () => {
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      view.set({ orbital: o.id });
      setCaption(o);
    });
    switcher.append(b);
    return b;
  });
  const setCaption = (o) => { caption.innerHTML = `Hydrogen ${katexString(o.tex)} orbital as 36,000 sampled electron positions. Drag to rotate.`; };
  setCaption(HERO_ORBITALS[1]);

  // Module grid
  const others = [1, 3, 4, 5];
  main.append(h('section', { class: 'home-section', 'aria-labelledby': 'modules-h' },
    h('h2', { id: 'modules-h' }, 'Course modules'),
    h('p', { class: 'sub' }, 'Module 2 is built. Other modules get added here as they are made.'),
    h('div', { class: 'module-grid' },
      h('a', { class: 'module-tile active', href: '#/lesson/2.1' },
        h('span', { class: 'num' }, '2'),
        h('h3', {}, 'Quantum theory and the H atom'),
        h('p', {}, 'Ten lessons, a 3D orbital lab, five experiment simulations and a practice problem generator.'),
        h('span', { class: 'state' }, `${Object.keys(p.done).filter((k) => p.done[k]).length} of 10 lessons done`)),
      others.map((n) => h('div', { class: 'module-tile', 'aria-disabled': 'true' }, h('span', { class: 'num' }, String(n)), h('span', { class: 'state' }, 'Not built yet'))),
    )));

  // Lessons
  main.append(h('section', { class: 'home-section', 'aria-labelledby': 'lessons-h' },
    h('h2', { id: 'lessons-h' }, 'Module 2 lessons'),
    h('p', { class: 'sub' }, 'The lessons follow the order of the module notes. Each one has at least one figure you can change.'),
    h('ol', { class: 'lesson-list' }, LESSONS.map((l) => h('li', {},
      h('a', { href: `#/lesson/${l.id}` },
        h('span', { class: 'n' }, l.id),
        h('span', { class: 't' }, l.title, h('span', { class: 'd' }, l.desc)),
        h('span', { class: 'n' }, p.done[l.id] ? 'Done' : '')))))));

  // Tools
  main.append(h('section', { class: 'home-section', 'aria-labelledby': 'tools-h' },
    h('h2', { id: 'tools-h' }, 'Tools'),
    h('p', { class: 'sub' }, 'Use these alongside the lessons or on their own when reviewing.'),
    h('div', { class: 'tools-grid' },
      tool('#/lab', 'Orbital lab', 'All 14 orbitals from 1s to 3d as boundary surfaces, point clouds and slices, linked to their radial plots.'),
      tool('#/sandbox', 'Experiments', 'Photoelectric effect, blackbody radiation, hydrogen spectra, electron diffraction and Stern-Gerlach.'),
      tool('#/applications', 'Applications', 'Where these ideas show up in MRI, electron microscopy, pulse oximetry, fluorescence and cancer treatment.'),
      tool('#/reference', 'Formulas and constants', 'Every equation and constant from the module on one page.'))));

  main.append(h('footer', { class: 'site-foot' },
    h('p', {}, 'Made as a study companion for CHEM 120/121 Module 2. It is not an official University of Waterloo resource. Explanations are written for this site; equations and constants follow the module notes.'),
    h('p', {}, 'For more orbital pictures, the course notes point to ', h('a', { href: 'https://winter.group.shef.ac.uk/orbitron/', rel: 'noopener' }, 'The Orbitron'), ' by Mark Winter at the University of Sheffield.')));
}

function tool(href, title, text) {
  return h('a', { class: 'tool-link', href }, h('h3', {}, title), h('p', {}, text));
}
