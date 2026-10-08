import { tex } from '../ui/dom.js';
import { add, figure, check, choice } from './kit.js';
import { create as born } from '../widgets/born.js';

export const goal = 'Describe what the Schrödinger equation does, what $\\Psi$ and $|\\Psi|^2$ mean, and how quantum numbers arise.';

export function render(ctx) {
  add(ctx, tex`
    <h2>What the new theory needed</h2>
    <p>Lessons 2.5 and 2.6 left two requirements for any theory of the electron in an atom:</p>
    <ul>
      <li>it must include the electron's wave behaviour (de Broglie), and</li>
      <li>its answers must be probabilities, since exact paths cannot be known (Heisenberg).</li>
    </ul>
    <p>In 1926 Erwin Schrödinger proposed an equation that meets both.</p>

    <h2>The Schrödinger equation</h2>
    <p>For a single electron moving around a nucleus, the equation is:</p>
    $$-\frac{h^2}{8\pi^2 m_e}\left[\frac{\partial^2\Psi}{\partial x^2} + \frac{\partial^2\Psi}{\partial y^2} + \frac{\partial^2\Psi}{\partial z^2}\right] + V(x,y,z)\,\Psi = E\,\Psi$$
    <p>Each part has a meaning, even if the calculus is new to you:</p>
    $$\underbrace{-\frac{h^2}{8\pi^2 m_e}\nabla^2\Psi}_{\text{kinetic energy}} \;+\; \underbrace{V\,\Psi}_{\text{potential energy}} \;=\; \underbrace{E\,\Psi}_{\text{total energy}} \qquad V = \frac{(+e)(-e)}{4\pi\varepsilon_0\,r}$$
    <p>$\Psi$ (psi) is a function of position called the <strong>wavefunction</strong>. The second derivatives measure how sharply $\Psi$ curves, which is linked to the electron's kinetic energy. $V$ is the electric potential energy between the proton and electron, which depends only on the distance $r$ between them. $\varepsilon_0 = 8.854 \times 10^{-12}$ C<sup>2</sup> J<sup>−1</sup> m<sup>−1</sup> is the permittivity of vacuum.</p>
    <div class="callout"><p><b>What you need for this course.</b> You do not have to memorize, use or solve this equation. It is here so you know what it looks like and what it does. The solutions have been worked out, and the rest of the module uses them.</p></div>

    <h3>Why only certain energies work</h3>
    <p>The unknowns are $E$ and $\Psi$. The equation has sensible solutions, ones that stay finite and fade to zero far from the nucleus, only for certain values of $E$. Those are the allowed energies. Quantization is not assumed, as it was by Planck and Bohr. It comes out of the mathematics, the same way a drum skin can only vibrate in certain patterns. (Schrödinger's equation does resemble the equation for a vibrating drum skin, though nobody knows exactly how he arrived at it.)</p>
    <p>Nobody has derived the Schrödinger equation from deeper principles. It is accepted because every prediction made with it has matched experiment.</p>

    <h3>Spherical coordinates</h3>
    <p>Because $V$ depends only on $r$, it is easier to describe the electron's position by its distance $r$ from the nucleus and two angles, $\theta$ (measured down from the $z$ axis) and $\phi$ (measured around it in the $xy$ plane):</p>
    $$x = r\sin\theta\cos\phi \qquad y = r\sin\theta\sin\phi \qquad z = r\cos\theta \qquad r = \sqrt{x^2+y^2+z^2}$$

    <h2>What $\Psi$ means</h2>
    <p>$\Psi$ itself is just a mathematical function. It rises and falls like a wave and can be positive or negative, but it has no direct physical meaning. Its square does:</p>
    <div class="key-eq">
      $$|\Psi(x,y,z)|^2\,dV = \text{probability of finding the electron in a tiny volume } dV \text{ at } (x,y,z)$$
      <p class="where">This is the <strong>Born interpretation</strong>. Where $|\Psi|^2$ is large, the electron is likely to be found.</p>
    </div>
    <p>Schrödinger himself preferred a different reading: the electron is smeared out into a cloud of charge, and $|\Psi|^2$ is the density of that cloud. This runs into problems. Experiments never detect a fraction of an electron, and a single electron's cloud would repel itself, which the equation does not include. Electrons behave as indivisible things.</p>
    <p>The two pictures can be joined. Measure the electron's position once and you find it at one point. Measure again and it is somewhere else. Make thousands of measurements and plot every result: the dots pile up most thickly where $|\Psi|^2$ is largest, forming something that looks like a cloud. The "cloud" is a summary of many measurements, not a smeared-out electron. Chemists still talk about electron density and charge clouds, which is useful for molecules, but for one electron in hydrogen the cloud should not be taken literally.</p>
  `);

  figure(ctx, born(), '<b>Figure 2.7.</b> Each dot is one measurement of the electron\'s position on a thin slice through the atom. Build up 2000 measurements, then switch to the cloud view: it is the smooth version of the same pattern.');

  add(ctx, tex`
    <h2>What solving it gives for hydrogen</h2>
    <p>Solving the equation for hydrogen (done in later courses such as CHEM 356 or PHYS 234) gives many solutions. Each one is a stable state of the atom with three properties.</p>
    <h3>1. A wavefunction, called an orbital</h3>
    <p>An <strong>orbital</strong> is a wavefunction $\Psi$ for one electron. Its square, $|\Psi|^2$, gives the probability of finding the electron at each point. Orbitals differ in size, shape and orientation, and are usually shown as pictures rather than equations. Lesson 2.8 covers those pictures.</p>
    <h3>2. A set of quantum numbers</h3>
    <p>Each orbital is labelled by three integers that fall out of the mathematics:</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Symbol</th><th>Name</th><th>Tells you</th><th>Allowed values</th></tr></thead>
      <tbody>
        <tr><td>$n$</td><td>principal quantum number</td><td>size and energy</td><td>$1, 2, 3, \ldots$</td></tr>
        <tr><td>$l$</td><td>orbital angular momentum quantum number</td><td>shape</td><td>$0, 1, 2, \ldots, n-1$</td></tr>
        <tr><td>$m_l$</td><td>magnetic quantum number</td><td>orientation in space</td><td>$-l, \ldots, -1, 0, +1, \ldots, +l$</td></tr>
      </tbody>
    </table></div>
    <p>Values of $l$ have letter names: $l = 0, 1, 2, 3$ are $s, p, d, f$, then $g$, $h$ and onward. A $2p$ orbital has $n = 2$ and $l = 1$. For each $l$ there are $2l + 1$ values of $m_l$, so there are 1 $s$, 3 $p$ and 5 $d$ orbitals in a set.</p>
    <h3>3. A definite energy</h3>
    $$E_n = -\frac{R_H}{n^2} \qquad R_H = 2.179 \times 10^{-18}\ \text{J}$$
    <p>This is exactly Bohr's formula, now derived properly. In hydrogen the energy depends only on $n$, so all orbitals with the same $n$ have the same energy. Orbitals with equal energy are called <strong>degenerate</strong>. Shell $n$ contains $n^2$ orbitals.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>$n$</th><th>Allowed $l$</th><th>Orbitals</th><th>Count</th><th>Energy</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>0</td><td>1s</td><td>1</td><td>$-2.179 \times 10^{-18}$ J</td></tr>
        <tr><td>2</td><td>0, 1</td><td>2s; three 2p</td><td>4</td><td>$-0.545 \times 10^{-18}$ J</td></tr>
        <tr><td>3</td><td>0, 1, 2</td><td>3s; three 3p; five 3d</td><td>9</td><td>$-0.242 \times 10^{-18}$ J</td></tr>
      </tbody>
    </table></div>
    <p>Bohr's diagram had the right energies but only one state per level. The full picture has $n^2$ states at each level. In atoms with more than one electron the $s$, $p$ and $d$ orbitals of the same shell no longer share an energy; that comes in a later module.</p>
  `);

  choice(ctx, 'Which set of quantum numbers is <em>not</em> allowed?', [
    { text: '$n = 3,\\ l = 2,\\ m_l = -2$' },
    { text: '$n = 2,\\ l = 2,\\ m_l = 0$', right: true },
    { text: '$n = 4,\\ l = 0,\\ m_l = 0$' },
    { text: '$n = 2,\\ l = 1,\\ m_l = +1$' },
  ], '$l$ can be at most $n - 1$. With $n = 2$, $l$ can only be 0 or 1, so there is no $2d$ orbital.');
  check(ctx, 'How many orbitals are in the $n = 4$ shell of hydrogen, and what are they?', '$4^2 = 16$: one 4s ($l = 0$), three 4p ($l = 1$), five 4d ($l = 2$) and seven 4f ($l = 3$). All 16 have the same energy in hydrogen.');
}
