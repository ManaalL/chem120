import { tex } from '../ui/dom.js';
import { add, figure, check, choice } from './kit.js';
import { createRepresentations, createRadialTool } from '../widgets/orbital-figures.js';
import * as H from '../core/hydrogen.js';

export const goal = 'Tell $s$, $p$ and $d$ orbitals apart from their pictures, count their nodes, and sketch $R$, $R^2$ and $r^2R^2$ against $r$.';

export function render(ctx) {
  const rmp = (n, l) => Math.round(H.mostProbableRadius(n, l) * H.A0_PM);
  add(ctx, tex`
    <h2>One orbital, several pictures</h2>
    <p>Hydrogen's wavefunctions depend on three coordinates, so no single graph can show everything about one. Each wavefunction splits into two parts:</p>
    <div class="key-eq">
      $$\Psi(r,\theta,\phi) = R(r)\;Y(\theta,\phi)$$
      <p class="where">$R(r)$ is the <strong>radial factor</strong>: how $\Psi$ changes with distance from the nucleus. $Y(\theta,\phi)$ is the <strong>angular factor</strong>: how it changes with direction.</p>
    </div>
    <p>Chemists use five kinds of picture, each showing a different part of the story: boundary surfaces, scatter plots, and three graphs of the radial factor. You do not need to memorize the wavefunctions themselves. The <a href="#/lab">orbital lab</a> draws all of them from the formulas in the course table.</p>

    <h2>Nodes</h2>
    <p>A <strong>node</strong> is a place where $\Psi = 0$, so the probability of finding the electron there, $|\Psi|^2$, is zero. On either side of a node, $\Psi$ has opposite signs.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Kind of node</th><th>What it looks like</th><th>Where $\Psi = 0$</th><th>How many</th></tr></thead>
      <tbody>
        <tr><td>Angular</td><td>a flat plane or a cone through the nucleus</td><td>$Y(\theta,\phi) = 0$</td><td>$l$</td></tr>
        <tr><td>Radial</td><td>a sphere centred on the nucleus</td><td>$R(r) = 0$</td><td>$n - l - 1$</td></tr>
        <tr><td>Total</td><td></td><td></td><td>$n - 1$</td></tr>
      </tbody>
    </table></div>

    <h2>Boundary surfaces and scatter plots</h2>
    <p>A <strong>boundary surface</strong> (sometimes called a balloon picture) encloses the region where the electron spends most of its time, usually 90% or 95%. It shows an orbital's shape and orientation but not how the probability varies inside. The colours of the lobes show the sign, or <strong>phase</strong>, of $\Psi$. Here red is positive and blue is negative. The signs are not electric charges.</p>
    <ul>
      <li><strong>$s$ orbitals</strong> are spheres. They have no angular nodes.</li>
      <li><strong>$p$ orbitals</strong> have two lobes of opposite phase, a dumbbell shape, separated by one nodal plane. $p_x$, $p_y$ and $p_z$ point along the three axes.</li>
      <li><strong>$d$ orbitals</strong> have two angular nodes. For $d_{xy}$, $d_{yz}$, $d_{xz}$ and $d_{x^2-y^2}$ these are two planes, giving four lobes. For $d_{z^2}$ they are two cones, giving two lobes along $z$ and a ring around the middle.</li>
    </ul>
    <p>A <strong>scatter plot</strong> (probability density plot) puts a dot at many sampled positions of the electron. Dense regions are where $|\Psi|^2$ is large. Unlike a boundary surface, it shows how the probability changes from place to place, including hollow shells at radial nodes.</p>
  `);

  figure(ctx, createRepresentations(), '<b>Figure 2.8a.</b> Pick an orbital and switch between its boundary surface and scatter plot. The three radial graphs on the right belong to the same orbital. Try 3s with nodes on: the radial node spheres sit exactly where the graphs cross zero.', { wide: true });

  add(ctx, tex`
    <h3>Real orbitals and $m_l$</h3>
    <p>The orbitals chemists draw, such as $p_x$ and $p_y$, are real-valued combinations of the solutions labelled by $m_l$. $p_z$ corresponds to $m_l = 0$, while $p_x$ and $p_y$ are each built from $m_l = +1$ and $m_l = -1$ together. The count is what matters: three $p$ orbitals for three values of $m_l$, five $d$ orbitals for five.</p>

    <h2>The radial graphs</h2>
    <h3>Radial factor, $R(r)$ against $r$</h3>
    <p>This graph shows how the radial part of the wavefunction changes with distance.</p>
    <ul>
      <li>$R(r)$ dies away exponentially at large $r$.</li>
      <li>It crosses the axis $n - l - 1$ times. Each crossing is a radial node. The start and end of the curve are not nodes.</li>
      <li>For $s$ orbitals ($l = 0$), $R$ is largest at $r = 0$. For $p$, $d$ and higher ($l > 0$), $R = 0$ at $r = 0$.</li>
    </ul>

    <h3>Radial electron density, $R(r)^2$ against $r$</h3>
    <p>Squaring removes the sign. This graph shows how the probability of finding the electron, or the density of the electron cloud, changes as you move out from the nucleus in one particular direction.</p>
    <ul>
      <li>It has $n - l$ maxima, which get smaller as $r$ increases, and $n - l - 1$ zeros between them.</li>
      <li>For $s$ orbitals the density is highest right at the nucleus. An $s$ electron <em>penetrates</em> all the way in. For $p$, $d$ and $f$ orbitals the density at the nucleus is zero.</li>
    </ul>

    <h3>Radial distribution function, $r^2R(r)^2$ against $r$</h3>
    <p>The RDF gives the total probability of finding the electron anywhere in a thin spherical shell at distance $r$, in every direction at once. That is usually what we want to know about the size of an orbital.</p>
    <ul>
      <li>Every RDF starts at zero at $r = 0$, even for $s$ orbitals.</li>
      <li>It has $n - l$ maxima, and they generally get larger as $r$ increases.</li>
      <li>The highest peak is the <strong>most probable radius</strong>, $r_\text{mp}$. For 1s it is exactly the Bohr radius, $a_0 = 52.9$ pm.</li>
      <li>$r_\text{mp}$ grows with $n$. Within one shell it shrinks slightly as $l$ increases.</li>
    </ul>
    <div class="table-wrap"><table>
      <thead><tr><th>Orbital</th><th>1s</th><th>2s</th><th>2p</th><th>3s</th><th>3p</th><th>3d</th></tr></thead>
      <tbody><tr><td>$r_\text{mp}$ (pm)</td><td>${rmp(1, 0)}</td><td>${rmp(2, 0)}</td><td>${rmp(2, 1)}</td><td>${rmp(3, 0)}</td><td>${rmp(3, 1)}</td><td>${rmp(3, 2)}</td></tr></tbody>
    </table></div>
    <p>These were calculated from the wavefunctions. Values read off printed graphs are rounder approximations.</p>

    <h3>Why the extra factor of $r^2$?</h3>
    <p>$|\Psi|^2\,dV$ is the probability in a small volume near one point. To get the probability anywhere in a shell between $r$ and $r + \Delta r$, multiply by the shell's volume:</p>
    $$V_\text{shell} = \tfrac{4}{3}\pi(r + \Delta r)^3 - \tfrac{4}{3}\pi r^3 = 4\pi r^2\Delta r + 4\pi r(\Delta r)^2 + \tfrac{4}{3}\pi(\Delta r)^3 \approx 4\pi r^2\,\Delta r$$
    <p>The last step drops terms with $(\Delta r)^2$ and $(\Delta r)^3$, which are tiny when $\Delta r$ is small. For 1s, $\Psi = (1/4\pi)^{1/2}R(r)$, so the shell probability is $|\Psi|^2 4\pi r^2\Delta r = r^2 R^2\Delta r$. Some books plot $4\pi r^2R^2$ instead; the extra $4\pi$ only rescales the graph. The result holds for every orbital.</p>
    <p>The $r^2$ factor is why the RDF of 1s is zero at the nucleus even though $R^2$ is largest there: the density is high, but the shell at $r = 0$ has no volume.</p>
  `);

  figure(ctx, createRadialTool(), '<b>Figure 2.8b.</b> Radial graphs for any orbital up to n = 6. Use it to check sketches for 4s, 4p, 4d or 5d.');

  choice(ctx, 'An $R(r)$ graph starts at zero at the nucleus and crosses the axis twice. Which orbital could it be?', [
    { text: '3s' }, { text: '3p' }, { text: '4p', right: true }, { text: '4d' },
  ], 'Starting at zero means $l > 0$. Two crossings means $n - l - 1 = 2$. 4p fits ($4 - 1 - 1 = 2$). 3s starts at a maximum, 3p has one crossing and 4d has one.');
  check(ctx, 'How many radial and angular nodes does a 5d orbital have? How many maxima does its RDF have?', 'Angular nodes $= l = 2$. Radial nodes $= n - l - 1 = 5 - 2 - 1 = 2$. Total $= 4 = n - 1$. Its RDF has $n - l = 3$ maxima. Check with Figure 2.8b.');
  check(ctx, 'What do the + and − signs (or red and blue) on the lobes of a $p$ orbital mean?', 'They show the sign of $\\Psi$ in each region, not electric charge. The electron is equally likely to be in either lobe because probability depends on $|\\Psi|^2$. The signs matter later, when orbitals on different atoms combine to form bonds.');
}
