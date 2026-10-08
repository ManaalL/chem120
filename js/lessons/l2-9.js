import { tex } from '../ui/dom.js';
import { add, figure, spotlight, check } from './kit.js';
import { create as sternGerlach } from '../widgets/stern-gerlach.js';

export const goal = 'Describe the Stern-Gerlach experiment and explain why a fourth quantum number, $m_s$, is needed.';

export function render(ctx) {
  add(ctx, tex`
    <h2>Three quantum numbers are not enough</h2>
    <p>Schrödinger's equation describes the electron in hydrogen with three quantum numbers: $n$, $l$ and $m_l$. As successful as it is, that picture is incomplete. An experiment with a magnet shows that the electron has one more property.</p>

    <h2>The Stern-Gerlach experiment</h2>
    <p>Otto Stern and Walther Gerlach first did this experiment in 1922 with silver atoms. In 1927 Phipps and Taylor repeated it with hydrogen atoms in their ground state. A beam of atoms passes between the poles of a magnet shaped so that the field is stronger near one pole than the other. A uniform field would only twist a tiny magnet. A field that changes across the gap also pushes on it, up or down depending on which way the tiny magnet points.</p>
    <p>If each atom were a tiny magnet pointing in a random direction, the beam should smear into a continuous band on the screen. Instead it splits into <strong>exactly two</strong> separate beams.</p>
  `);

  figure(ctx, sternGerlach(), '<b>Figure 2.9.</b> A beam of hydrogen atoms passing a non-uniform magnetic field. Compare what happens with the classical expectation, and turn the field off to see the single undeflected spot.', { wide: true });

  add(ctx, tex`
    <h2>What splits the beam</h2>
    <p>Ground-state hydrogen has its electron in 1s, where $l = 0$. With no orbital angular momentum, the orbital motion cannot make the atom magnetic. Something else must. The atoms behave like tiny magnets that can point only two ways: attracted toward the north pole or pushed away from it.</p>
    <p>The electron behaves as if it were spinning on an axis through its centre, and a spinning charge acts as a small magnet. This property is called <strong>spin</strong>. The picture of a spinning ball is only a way to visualize it. Spin is a built-in property of the electron, like its charge and mass, and the electron is not literally rotating.</p>
    <div class="key-eq">
      $$s = \tfrac12 \qquad m_s = +\tfrac12\ \ (\text{"spin up"}) \quad\text{or}\quad m_s = -\tfrac12\ \ (\text{"spin down"})$$
      <p class="where">Electrons are spin-½ particles. Every electron has $s = \frac12$, and there are only two possible spin states, given by $m_s$.</p>
    </div>
    <p>The state of an electron in an atom is now described by four quantum numbers: $n$, $l$, $m_l$ and $m_s$. Each orbital can hold an electron in either spin state, so each shell of hydrogen has $2n^2$ possible electron states.</p>

    <h3>Where spin comes from in theory</h3>
    <p>Spin does not appear in Schrödinger's equation. It was found by experiment first. In 1928 Paul Dirac wrote a version of quantum mechanics consistent with Einstein's relativity, and spin appeared in it naturally alongside the other quantum numbers. Dirac and Schrödinger shared the 1933 Nobel Prize in Physics.</p>

    <h3>Other particles have spin too</h3>
    <div class="table-wrap"><table>
      <thead><tr><th>Particle</th><th>Spin</th></tr></thead>
      <tbody>
        <tr><td>Electron, proton, neutron</td><td>½</td></tr>
        <tr><td>Photon</td><td>1</td></tr>
        <tr><td>$^{12}$C nucleus</td><td>0</td></tr>
        <tr><td>$^{13}$C nucleus</td><td>½</td></tr>
        <tr><td>$^{127}$I nucleus</td><td>$\tfrac52$</td></tr>
      </tbody>
    </table></div>
    <p>Nuclei with non-zero spin, such as $^1$H and $^{13}$C, respond to magnetic fields. That is the basis of MRI and NMR spectroscopy.</p>
  `);

  spotlight(ctx, 'mri');

  check(ctx, 'How many different electron states (sets of $n$, $l$, $m_l$, $m_s$) are possible in the $n = 2$ shell?', 'There are $n^2 = 4$ orbitals (2s and three 2p), each with two spin states, so $2n^2 = 8$ states.');
  check(ctx, 'Why does the Stern-Gerlach magnet need a non-uniform field?', 'In a uniform field the forces on the two ends of a tiny magnet are equal and opposite, so the magnet is twisted but not moved. Only a field that gets stronger in one direction gives a net push, which separates the two spin states.');
}
