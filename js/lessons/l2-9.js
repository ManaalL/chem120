import { add, section, key, check, predict, revisit, myth, spotlight } from '../learn/blocks.js';
import { sim } from '../learn/sim.js';

export const meta = {
  minutes: 12,
  objectives: [
    'Describe the Stern-Gerlach experiment and what it showed',
    'State the allowed values of the spin quantum number $m_s$',
    'Count the electron states in a shell',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.9',
    q: 'A beam of hydrogen atoms passes between the poles of a magnet. What pattern do they make on a screen?',
    options: [
      { t: 'One spot in the middle' },
      { t: 'A smooth smear from top to bottom' },
      { t: 'Exactly two spots', right: true },
      { t: 'A ring' },
    ],
  });

  section(ctx, 'A beam of atoms splits in two');
  add(ctx, `
    <p>Schrödinger's three quantum numbers, $n$, $l$ and $m_l$, describe hydrogen's electron almost completely. A magnet shows one thing is missing.</p>
    <p>In the Stern-Gerlach experiment, a beam of atoms passes between two magnet poles. One pole is pointed, so the field is <mark>stronger near it than near the other</mark>. A tiny magnet in an uneven field gets pushed up or down, depending on which way it points.</p>
    <p>Ground-state hydrogen has its electron in 1s, where $l = 0$, so its orbit gives it no magnetism at all. It should pass straight through. Run it.</p>
  `);
  sim(ctx, 'sternGerlach');
  add(ctx, '<p>The beam splits into <mark>exactly two</mark>. If each atom were a tiny bar magnet pointing in any direction, you would get a smear. Instead each atom is pushed fully up or fully down.</p>');

  section(ctx, 'Spin');
  add(ctx, `
    <p>The electron itself acts like a tiny magnet with only two possible settings. This property is called <dfn data-g="spin">spin</dfn>. It is often pictured as the electron spinning like a top, since a spinning charge is magnetic, but that is only a picture. Spin is a built-in property, like charge or mass.</p>
  `);
  key(ctx, '$$m_s = +\\tfrac12 \\ (\\text{spin up}) \\quad\\text{or}\\quad m_s = -\\tfrac12 \\ (\\text{spin down})$$ An electron in an atom is fully described by <mark>four quantum numbers: $n$, $l$, $m_l$ and $m_s$</mark>.', 'Spin: $m_s = +\\tfrac12$ or $-\\tfrac12$. Four quantum numbers describe an electron: $n$, $l$, $m_l$, $m_s$.');
  add(ctx, `
    <p>Spin does not come out of Schrödinger's equation. It was found by experiment first. In 1928 Paul Dirac wrote a version of quantum theory that agrees with Einstein's relativity, and spin appeared in it on its own.</p>
  `);
  check(ctx, {
    q: 'How many different electron states (sets of $n$, $l$, $m_l$, $m_s$) are there in the $n = 2$ shell?',
    options: [
      { t: '4', why: 'That is the number of orbitals ($n^2$). Each one has two spin states.' },
      { t: '8', right: true, why: '$n^2 = 4$ orbitals, each with spin up or spin down: $2n^2 = 8$.' },
      { t: '2', why: 'Two spin states for each orbital, but there are four orbitals in $n = 2$.' },
    ],
  });
  myth(ctx, {
    wrong: 'Spin means the electron is literally a little ball rotating on its axis.',
    right: 'The rotating-ball picture is a helpful image for a magnetic property, but it can\'t be literally true. Spin is a basic property of the electron with only two values.',
  });
  add(ctx, '<p>Protons have spin ½ too. The same two-state flip, driven by radio waves, is what an MRI scanner detects.</p>');
  spotlight(ctx, 'mri');

  revisit(ctx, '2.9', 'Two spots, with about half the atoms in each. The electron\'s spin has only two possible values, $m_s = +\\tfrac12$ and $-\\tfrac12$, so the atoms are pushed one of two ways and never in between.');
}
