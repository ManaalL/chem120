// Experiments: each simulation on its own, full width, with controls in the inspector.
import { h } from '../ui/dom.js';

const EXPERIMENTS = [
  { id: 'photoelectric', label: 'Photoelectric effect', lesson: '2.3', load: async () => (await import('../widgets/photoelectric.js')).create() },
  { id: 'blackbody', label: 'Blackbody radiation', lesson: '2.3', load: async () => (await import('../widgets/blackbody.js')).create() },
  { id: 'spectra', label: 'Hydrogen spectra', lesson: '2.3', load: async () => (await import('../widgets/spectroscope.js')).create() },
  { id: 'bohr', label: 'Bohr transitions', lesson: '2.4', load: async () => (await import('../widgets/bohr.js')).create() },
  { id: 'diffraction', label: 'Electron diffraction', lesson: '2.5', load: async () => (await import('../widgets/debroglie.js')).createDiffraction() },
  { id: 'uncertainty', label: 'Uncertainty principle', lesson: '2.6', load: async () => (await import('../widgets/uncertainty.js')).create() },
  { id: 'born', label: 'Position measurements', lesson: '2.7', load: async () => (await import('../widgets/born.js')).create() },
  { id: 'stern-gerlach', label: 'Stern-Gerlach', lesson: '2.9', load: async () => (await import('../widgets/stern-gerlach.js')).create() },
  { id: 'em', label: 'Light and the spectrum', lesson: '2.2', load: async () => (await import('../widgets/em-wave.js')).create() },
];

export async function render(ctx, arg) {
  const current = EXPERIMENTS.find((e) => e.id === arg) || EXPERIMENTS[0];
  const main = h('div', { class: 'prose', style: { maxWidth: '62rem' } });
  ctx.main.append(main);
  main.append(
    h('header', { class: 'lesson-head' },
      h('p', { class: 'kicker' }, 'Tools'),
      h('h1', {}, 'Experiments'),
      h('p', { class: 'goal' }, 'Every simulation from the lessons, on its own. Each one is computed from the same equations used in the module.')),
    h('nav', { class: 'tabs', 'aria-label': 'Experiments', role: 'tablist' },
      EXPERIMENTS.map((e) => h('a', { href: `#/sandbox/${e.id}`, role: 'tab', 'aria-selected': String(e === current), style: { textDecoration: 'none', font: '500 14.5px var(--sans)', color: e === current ? 'var(--text)' : 'var(--muted)', padding: '10px 14px', borderBottom: e === current ? '2px solid var(--minus)' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' } }, e.label))));
  const widget = await current.load();
  const frame = h('div', { class: 'fig-frame' }, widget.el);
  main.append(h('figure', { class: 'fig', style: { marginTop: '0' } }, frame,
    h('figcaption', { class: 'fig-cap' }, 'From lesson ', h('a', { href: `#/lesson/${current.lesson}` }, current.lesson), '. The lesson explains what to look for.')));
  ctx.panel(frame, widget.controls, widget.title, widget.sub);
  ctx.onCleanup(() => widget.dispose?.());
}
