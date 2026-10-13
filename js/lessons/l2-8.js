import { add, section, key, check, predict, revisit, myth } from '../learn/blocks.js';
import { drawGuess, matchTask } from '../learn/interact.js';
import { sim } from '../learn/sim.js';
import * as H from '../core/hydrogen.js';

export const meta = {
  minutes: 25,
  objectives: [
    'Count the radial and angular <dfn data-g="node">nodes</dfn> of any orbital',
    'Recognize s, p and d orbitals from their pictures',
    'Sketch $R$, $R^2$ and $r^2R^2$ against $r$, and explain why they differ',
  ],
};

export function render(ctx) {
  const rmp = (n, l) => Math.round(H.mostProbableRadius(n, l) * H.A0_PM);
  predict(ctx, {
    id: '2.8',
    q: 'Counting every direction at once, at what distance from the nucleus is a 1s electron most likely to be found?',
    options: [
      { t: 'Right at the nucleus, r = 0' },
      { t: 'At 52.9 pm', right: true },
      { t: 'Equally likely at every distance' },
      { t: 'Far away, where the cloud is biggest' },
    ],
  });

  section(ctx, 'Nodes: where the electron never is');
  add(ctx, `
    <p>Each wavefunction splits into two parts, $\\Psi = R(r)\\,Y(\\theta, \\phi)$. $R$ says how $\\Psi$ changes with distance from the nucleus; $Y$ says how it changes with direction.</p>
    <p>A <dfn data-g="node">node</dfn> is a place where $\\Psi = 0$, so <mark>the electron is never found there</mark>. On either side of a node, $\\Psi$ has opposite signs.</p>
    <ul>
      <li><dfn data-g="angularnode">Angular nodes</dfn> are flat planes or cones through the nucleus. There are <mark>$l$</mark> of them.</li>
      <li><dfn data-g="radialnode">Radial nodes</dfn> are spheres around the nucleus. There are <mark>$n - l - 1$</mark> of them.</li>
      <li>Altogether, $n - 1$ nodes.</li>
    </ul>
  `);
  key(ctx, 'Angular nodes $= l$. Radial nodes $= n - l - 1$. Total $= n - 1$.');
  matchTask(ctx, {
    q: 'Match each orbital to its nodes.',
    pairs: [
      { a: '2s', b: '1 radial, 0 angular' },
      { a: '2p', b: '0 radial, 1 angular' },
      { a: '3s', b: '2 radial, 0 angular' },
      { a: '3p', b: '1 radial, 1 angular' },
      { a: '3d', b: '0 radial, 2 angular' },
    ],
    explain: 'Every orbital in the n = 3 shell has 2 nodes in total. Only how they split between radial and angular changes.',
  });

  section(ctx, 'Pictures of orbitals');
  add(ctx, `
    <p>A <strong>boundary surface</strong> encloses the region where the electron spends 90% of its time. It shows shape and direction. Its two colours show the <dfn data-g="phase">phase</dfn>, the sign of $\\Psi$. <mark>The colours are not electric charges.</mark></p>
    <ul>
      <li><strong>s</strong> orbitals are spheres.</li>
      <li><strong>p</strong> orbitals are two lobes of opposite sign, split by one nodal plane.</li>
      <li><strong>d</strong> orbitals mostly have four lobes and two nodal planes. 3d<sub>z²</sub> is the odd one: two lobes and a ring, split by two nodal cones.</li>
    </ul>
    <p>A <strong>scatter plot</strong> shows many possible electron positions as dots. Unlike the surface, it shows how likely each region is, including hollow shells at radial nodes.</p>
  `);
  sim(ctx, 'orbitalViews');

  section(ctx, 'Graphs of the radial part');
  add(ctx, '<p>Three graphs show how the orbital changes with distance $r$. Before you look at them, sketch your guess for the first one.</p>');
  drawGuess(ctx, {
    q: 'Sketch $R(r)$ for the 2s orbital, from the nucleus out to about 640 pm.',
    prompt: '2s has one radial node. The dashed line is zero. Drag from left to right.',
    xLabel: 'distance r (pm)', yLabel: 'R(r)', x0: 0, x1: 640, y0: -0.2, y1: 0.8, yZero: true,
    xTicks: [{ x: 106, label: '106' }, { x: 212, label: '212' }, { x: 424, label: '424' }],
    truth: (x) => H.radial(2, 0, x / H.A0_PM),
    explain: 'It starts at its highest value at the nucleus (s orbitals do), drops through zero at 106 pm (the radial node), dips slightly negative, and then fades back toward zero.',
  });
  add(ctx, `
    <ul>
      <li><strong>$R(r)$</strong> crosses zero once for each radial node. For s orbitals it is largest at $r = 0$; for every other orbital it starts at zero.</li>
      <li><strong>$R^2$</strong> is the density along one line out from the nucleus. For s orbitals it is highest at the nucleus.</li>
      <li><strong>$r^2R^2$</strong>, the <dfn data-g="rdf">radial distribution function</dfn>, is the chance of finding the electron at distance $r$ in any direction. Its tallest peak is the <mark>most probable radius</mark>.</li>
    </ul>
  `);
  sim(ctx, 'radialTool');

  section(ctx, 'Why the most likely distance isn\'t zero');
  add(ctx, `
    <p>This is the part that confuses almost everyone. For 1s, the density $R^2$ is highest at the nucleus. Yet the RDF says the most likely distance is 52.9 pm. How can both be true?</p>
    <p>Think of the electron's chance of being in a thin shell, like the skin of an onion, at distance $r$. That depends on two things: <mark>how dense the cloud is there</mark>, and <mark>how big the shell is</mark>. A shell near the nucleus is tiny. A shell far out is huge, but the cloud is thin there.</p>
  `);
  sim(ctx, 'rdfBuilder');
  key(ctx, '$$\\text{RDF} = \\underbrace{r^2}_{\\text{shell size}} \\times \\underbrace{R^2}_{\\text{density}}$$ For 1s the product peaks at <mark>52.9 pm, the Bohr radius</mark>, even though the density itself is highest at the nucleus.', 'RDF = shell size × density. For 1s it peaks at 52.9 pm even though density peaks at the nucleus.');
  add(ctx, `
    <div class="table-wrap"><table>
      <thead><tr><th>Orbital</th><th>1s</th><th>2s</th><th>2p</th><th>3s</th><th>3p</th><th>3d</th></tr></thead>
      <tbody><tr><td>Most probable radius (pm)</td><td>${rmp(1, 0)}</td><td>${rmp(2, 0)}</td><td>${rmp(2, 1)}</td><td>${rmp(3, 0)}</td><td>${rmp(3, 1)}</td><td>${rmp(3, 2)}</td></tr></tbody>
    </table></div>
    <p>Orbitals get bigger as $n$ grows. Within a shell, the most probable radius shrinks slightly as $l$ grows.</p>
  `);
  check(ctx, {
    q: 'An $R(r)$ graph starts at zero at the nucleus and crosses the axis twice. Which orbital is it?',
    options: [
      { t: '3s', why: 's orbitals start at their highest value, not at zero.' },
      { t: '3p', why: '3p has $n - l - 1 = 1$ radial node, so only one crossing.' },
      { t: '4p', right: true, why: 'Starts at zero, so $l > 0$. Two crossings means $n - l - 1 = 2$. With $l = 1$, $n = 4$.' },
      { t: '4d', why: '4d has $4 - 2 - 1 = 1$ radial node.' },
    ],
  });
  myth(ctx, {
    wrong: 'The red and blue lobes of a p orbital hold positive and negative charge.',
    right: 'The colours only show the sign of $\\Psi$. The electron is equally likely to be in either lobe, because probability depends on $\\Psi^2$. The signs matter later, when orbitals combine to form bonds.',
  });

  revisit(ctx, '2.8', 'At the nucleus the density is highest, but the shell there has no size, so the chance of being "at distance zero" is zero. The product of density and shell size peaks at 52.9 pm, the same radius as Bohr\'s first orbit.');
}
