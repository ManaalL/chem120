// Lesson list for Module 2. Each lesson module exports `render(ctx)`.
export const LESSONS = [
  { id: '2.1', title: 'Energy in atoms is quantized', desc: 'Why classical physics breaks down inside atoms', load: () => import('./l2-1.js') },
  { id: '2.2', title: 'The nature of light', desc: 'Wavelength, frequency, energy and the spectrum', load: () => import('./l2-2.js') },
  { id: '2.3', title: 'Three experiments that forced quantum theory', desc: 'Blackbody radiation, the photoelectric effect, line spectra', load: () => import('./l2-3.js') },
  { id: '2.4', title: "Bohr's model of the hydrogen atom", desc: 'Quantized orbits and the hydrogen spectrum', load: () => import('./l2-4.js') },
  { id: '2.5', title: "de Broglie's hypothesis", desc: 'Particles with mass also behave as waves', load: () => import('./l2-5.js') },
  { id: '2.6', title: 'The Heisenberg uncertainty principle', desc: 'Position and momentum limit each other', load: () => import('./l2-6.js') },
  { id: '2.7', title: 'The Schrödinger equation', desc: 'Wavefunctions and what Ψ² means', load: () => import('./l2-7.js') },
  { id: '2.8', title: 'Picturing hydrogen wavefunctions', desc: 'Quantum numbers, nodes and five kinds of plot', load: () => import('./l2-8.js') },
  { id: '2.9', title: 'Electron spin', desc: 'The Stern-Gerlach experiment and m_s', load: () => import('./l2-9.js') },
  { id: '2.10', title: 'Putting it all together', desc: 'Summary table, self-check and practice problems', load: () => import('./l2-10.js') },
];
export const lessonIndex = (id) => LESSONS.findIndex((l) => l.id === id);
