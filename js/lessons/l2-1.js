import { tex } from '../ui/dom.js';
import { add, figure, spotlight, choice } from './kit.js';
import { create as rampStairs } from '../widgets/ramp-stairs.js';

export const goal = `Classical physics predicts that an electron near a nucleus could have any energy at all. Experiments show it can't. This lesson sets up the idea the rest of the module explains.`;

export function render(ctx) {
  add(ctx, tex`

    <h2>Classical physics stops working inside atoms</h2>
    <p>The laws of motion written down by Newton, and later reworked by Lagrange and Hamilton, describe a thrown ball, a swinging pendulum and the orbit of a planet very well. Those laws were built from observing large objects. When physicists in the late 1800s tried to apply them to electrons inside atoms, the predictions disagreed with experiments again and again.</p>
    <p>The disagreement was not a small correction. Classical physics said a heated object should glow with infinite brightness in the ultraviolet, that dim light should eventually knock electrons out of any metal, and that atoms should give off a smooth rainbow of colours. None of that happens.</p>

    <div class="key-eq">
      <p style="margin:14px 0"><strong>The central idea of Module 2.</strong> When a particle such as an electron is held in a small region of space by the forces acting on it, its total energy is restricted to certain allowed values. Energy that comes only in allowed values is called <strong>quantized</strong>.</p>
    </div>

    <h2>A ramp and a staircase</h2>
    <p>A ball rolling up a smooth ramp can stop at any height, so its gravitational energy can take any value in a range. A ball on a staircase can only rest on a step. Its energy jumps from one allowed value to the next with nothing in between. An electron bound to a nucleus behaves like the ball on the stairs.</p>
  `);

  figure(ctx, rampStairs(), '<b>Figure 2.1.</b> Give both balls the same energy. The ramp ball tracks it exactly; the stair ball stays on the highest step it can reach. Switch to hydrogen spacing to see the pattern of the real H atom energy levels, which crowd together near the top.');

  add(ctx, tex`
    <h2>Why we never notice the steps in everyday life</h2>
    <p>Everything is quantized in principle, including a ball on a ramp. The steps are just far too small to see. For an electron in an atom, the gaps between allowed energies are around $10^{-19}$ to $10^{-18}$ J. That sounds tiny, but the electron's mass is only $9.109 \times 10^{-31}$ kg, so on its scale the gaps are large. For a 0.1 kg ball the gaps would be smaller than anything we could ever measure, so its energy looks smooth.</p>
    <p>This is why the module keeps returning to one question: <em>how big is the particle, and how tightly is it confined?</em> Small mass and small space make quantum effects large.</p>

    <h2>Every clue came from light meeting matter</h2>
    <p>Quantum theory was assembled over about 30 years. Each step came from an experiment where light was absorbed or given off by matter, or from an idea needed to explain one.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Year</th><th>Who</th><th>What changed</th><th>Lesson</th></tr></thead>
      <tbody>
        <tr><td>1900</td><td>Planck</td><td>Glowing solids emit energy in packets of size $h\nu$</td><td><a href="#/lesson/2.3">2.3</a></td></tr>
        <tr><td>1905</td><td>Einstein</td><td>Light itself arrives as photons, $E = h\nu$</td><td><a href="#/lesson/2.3">2.3</a></td></tr>
        <tr><td>1913</td><td>Bohr</td><td>Hydrogen's electron is limited to certain orbits and energies</td><td><a href="#/lesson/2.4">2.4</a></td></tr>
        <tr><td>1922</td><td>Stern and Gerlach</td><td>A beam of atoms splits in two in a magnetic field</td><td><a href="#/lesson/2.9">2.9</a></td></tr>
        <tr><td>1924</td><td>de Broglie</td><td>Electrons and other particles have a wavelength</td><td><a href="#/lesson/2.5">2.5</a></td></tr>
        <tr><td>1926</td><td>Schrödinger</td><td>A wave equation gives the allowed energies and orbitals</td><td><a href="#/lesson/2.7">2.7</a></td></tr>
        <tr><td>1927</td><td>Heisenberg</td><td>Position and momentum cannot both be known exactly</td><td><a href="#/lesson/2.6">2.6</a></td></tr>
      </tbody>
    </table></div>
    <p>Lesson 2.2 reviews light itself, since every experiment in the list depends on it.</p>
  `);

  spotlight(ctx, 'photosynthesis');

  choice(ctx, 'Which of these energies is quantized in a way you could actually measure?', [
    { text: 'A ball rolling to a stop partway up a ramp' },
    { text: 'The electron in a hydrogen atom', right: true },
    { text: 'A cup of coffee cooling on a desk' },
    { text: 'A car braking at a red light' },
  ], 'The electron is light and held in a tiny space, so the gaps between its allowed energies are large enough to measure. The other three are quantized too in principle, but their steps are far too small to detect.');
}
