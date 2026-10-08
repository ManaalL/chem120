import { tex } from '../ui/dom.js';
import { add, figure, spotlight, check, choice } from './kit.js';
import { create as bohr } from '../widgets/bohr.js';

export const goal = 'Use Bohr\'s energy formula to find the energy and wavelength of light absorbed or emitted by a hydrogen atom, and explain why the model had to be replaced.';

export function render(ctx) {
  add(ctx, tex`
    <h2>Bohr's assumptions</h2>
    <p>In 1913 Niels Bohr proposed a model of hydrogen built to match its line spectrum. He pictured the electron moving in a circle of radius $r$ around the proton at speed $v$, held there by electric attraction. He then added a rule with no classical justification: only orbits whose angular momentum is a whole-number multiple of $h/2\pi$ are allowed.</p>
    <div class="key-eq">
      $$\underbrace{m_e v r}_{\text{angular momentum}} = n\,\frac{h}{2\pi} \qquad n = 1, 2, 3, \ldots$$
      <p class="where">The integer $n$ labels the orbits. $n = 1$ is the innermost.</p>
    </div>
    <p>He also assumed that an electron in an allowed orbit does not give off light. Light is emitted or absorbed only when the electron jumps from one allowed orbit to another.</p>
    <p>Bohr combined the angular momentum rule with a force balance (the inward electric pull $e^2/4\pi\varepsilon_0 r^2$ equals $m_e v^2/r$). Eliminating $v$ and $r$ takes some algebra, which you are not responsible for, and gives the energy of the electron in orbit $n$:</p>
    <div class="key-eq">
      $$E_n = -\frac{R_H}{n^2}$$
      $$R_H = \frac{m_e e^4}{8\varepsilon_0^2 h^2} = 2.179 \times 10^{-18}\ \text{J}$$
      <p class="where">$R_H$ is the Rydberg constant. Bohr also found the orbits have radius $r_n = n^2 a_0$, where $a_0 = 52.9$ pm is the <strong>Bohr radius</strong>.</p>
    </div>

    <h3>Why the energies are negative</h3>
    <p>The zero of energy is chosen as the electron infinitely far from the nucleus ($n = \infty$). Bringing the electron closer releases energy, so every bound state sits below zero. The more negative the energy, the more tightly the electron is held. The ground state, $n = 1$, has $E_1 = -2.179 \times 10^{-18}$ J. As $n$ grows the levels crowd together toward zero.</p>
  `);

  figure(ctx, bohr(), '<b>Figure 2.4.</b> Pick a start and end level and run the transition. Moving down emits a photon; moving up needs one to be absorbed first. The quick picks <i>n</i> = 3, 4, 5, 6 → 2 give hydrogen\'s four visible lines.', { wide: true });

  add(ctx, tex`
    <h2>Energy of a transition</h2>
    <p>When the electron moves from level $n_i$ to level $n_f$, the atom's energy changes by $\Delta E = E_f - E_i$. That energy is carried by a single photon with $|\Delta E| = h\nu$:</p>
    <div class="key-eq">
      $$\Delta E = h\nu = -R_H\left(\frac{1}{n_f^{2}} - \frac{1}{n_i^{2}}\right)$$
      <p class="where">If $\Delta E < 0$ the electron dropped down and a photon was <strong>emitted</strong>. If $\Delta E > 0$ the electron moved up and a photon was <strong>absorbed</strong>. The photon's wavelength is $\lambda = hc/|\Delta E|$.</p>
    </div>

    <h3>Worked example: from n = 4 to n = 2</h3>
    <p>Is light absorbed or emitted, and at what wavelength?</p>
    $$\Delta E = -(2.179 \times 10^{-18}\ \text{J})\left(\frac{1}{2^2} - \frac{1}{4^2}\right) = -(2.179 \times 10^{-18})(0.1875) = -4.086 \times 10^{-19}\ \text{J}$$
    <p>$\Delta E$ is negative, so a photon is emitted.</p>
    $$\lambda = \frac{hc}{|\Delta E|} = \frac{(6.626 \times 10^{-34})(2.998 \times 10^{8})}{4.086 \times 10^{-19}} = 4.862 \times 10^{-7}\ \text{m} = 486.2\ \text{nm}$$
    <p>This is the blue-green line in hydrogen's spectrum from lesson 2.3, measured at 486.1 nm. The 0.1 nm difference comes from rounding in the constants and from treating the proton as fixed (see the note on the Rydberg constant below).</p>

    <h3>Spectral series</h3>
    <p>Transitions are grouped by the level they end on (for emission) or start from (for absorption).</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Series</th><th>Lower level</th><th>Region</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Lyman</td><td>$n = 1$</td><td>Ultraviolet</td><td>$2 \to 1$: 121.6 nm</td></tr>
        <tr><td>Balmer</td><td>$n = 2$</td><td>Visible and near UV</td><td>$3 \to 2$: 656.3 nm</td></tr>
        <tr><td>Paschen</td><td>$n = 3$</td><td>Infrared</td><td>$4 \to 3$: 1875 nm</td></tr>
        <tr><td>Brackett</td><td>$n = 4$</td><td>Infrared</td><td>$5 \to 4$: 4052 nm</td></tr>
      </tbody>
    </table></div>

    <h3>A note on the Rydberg constant</h3>
    <p>The formula for $R_H$ above treats the proton as fixed in place. A more exact version replaces the electron mass with the reduced mass of the electron-proton pair, $\mu = m_e m_p/(m_e + m_p) = 9.104 \times 10^{-31}$ kg. The correction is about 0.05%, which is why the course gives $R_H$ as an approximation.</p>

    <h2>What was wrong with Bohr's model</h2>
    <p>Bohr's formula gives the correct hydrogen energies and predicts every line in its spectrum. The model behind it is still wrong:</p>
    <ul>
      <li>It does not explain <em>why</em> angular momentum is quantized. The rule was imposed to make the answer come out right.</li>
      <li>It fails for any atom with more than one electron, even helium.</li>
      <li>Classical physics says an electron moving in a circle is accelerating and should radiate energy continuously, spiralling into the nucleus. Bohr simply declared that this does not happen.</li>
      <li>Electrons do not move in fixed orbits. Lesson 2.6 shows that a definite path is not something an electron can have.</li>
    </ul>
    <p>Bohr reached the right energies for the wrong reasons. His work still mattered: it was more evidence that quantities like energy and angular momentum are quantized in atoms. The real explanation needed two new ideas, covered next: electrons behave like waves (lesson 2.5), and their exact behaviour cannot be known (lesson 2.6).</p>
  `);

  spotlight(ctx, 'pdt');

  check(ctx, 'Hydrogen\'s visible emission lines are at 410.1, 434.0, 486.1 and 656.3 nm. Which transition produces each one?', '656.3 nm is $3 \\to 2$, 486.1 nm is $4 \\to 2$, 434.0 nm is $5 \\to 2$ and 410.1 nm is $6 \\to 2$. All four end on $n = 2$, so they belong to the Balmer series. Use the quick picks in Figure 2.4 to check.');
  choice(ctx, 'How much energy does it take to remove the electron completely from a ground-state hydrogen atom?', [
    { text: '$2.179 \\times 10^{-18}$ J per atom', right: true },
    { text: '$1.634 \\times 10^{-18}$ J per atom' },
    { text: '$0.545 \\times 10^{-18}$ J per atom' },
    { text: 'It depends on the photon\'s intensity' },
  ], 'Removing the electron means going from $n = 1$ to $n = \\infty$: $\\Delta E = -R_H(0 - 1/1^2) = +R_H = 2.179 \\times 10^{-18}$ J. Per mole that is 1312 kJ, the ionization energy of hydrogen. $1.634 \\times 10^{-18}$ J is the $1 \\to 2$ jump, not ionization.');
}
