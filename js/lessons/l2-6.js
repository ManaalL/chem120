import { tex } from '../ui/dom.js';
import { add, figure, check } from './kit.js';
import { create as uncertainty } from '../widgets/uncertainty.js';

export const goal = 'Use $\\Delta x\\,\\Delta p \\ge h/4\\pi$ and explain why it rules out definite electron orbits.';

export function render(ctx) {
  add(ctx, tex`
    <h2>Measuring changes what you measure</h2>
    <p>Werner Heisenberg pointed out that an observer can never be fully separated from the system being observed. To see where an electron is, you have to hit it with something, such as a photon. That collision changes the electron's momentum by an amount you cannot predict. Measuring the momentum precisely instead disturbs the position. There is no way around this, however good the equipment.</p>
    <p>In 1927 Heisenberg put a number on the limit for position and momentum measured at the same time:</p>
    <div class="key-eq">
      $$\Delta x\,\Delta p \ \ge\ \frac{h}{4\pi} \qquad\Longrightarrow\qquad \Delta p \ \ge\ \frac{h}{4\pi\,\Delta x}$$
      <p class="where">$\Delta x$ is the uncertainty in position. $\Delta p = m\,\Delta v$ is the uncertainty in momentum. $h/4\pi = 5.27 \times 10^{-35}$ J s.</p>
    </div>
    <p>The product of the two uncertainties has a minimum. The more precisely you know where a particle is, the less precisely you can know where it is going, and the reverse.</p>
  `);

  figure(ctx, uncertainty(), '<b>Figure 2.6.</b> The particle\'s position spread (left) and the smallest possible momentum spread that goes with it (right). Narrow Δx and watch Δp widen.');

  add(ctx, tex`
    <h3>Worked example: an electron held inside an atom</h3>
    <p>A hydrogen atom is roughly 100 pm across, so an electron inside it has $\Delta x \approx 1 \times 10^{-10}$ m. What is the smallest possible uncertainty in its speed?</p>
    $$\Delta v \ge \frac{h}{4\pi\,m_e\,\Delta x} = \frac{6.626 \times 10^{-34}\ \text{J s}}{4\pi(9.109 \times 10^{-31}\ \text{kg})(1 \times 10^{-10}\ \text{m})} = 5.8 \times 10^{5}\ \text{m s}^{-1}$$
    <p>Bohr's model gives the electron a speed of $2.2 \times 10^{6}$ m s<sup>−1</sup> in the $n = 1$ orbit. The unavoidable uncertainty is about a quarter of that speed. A neat circular orbit, with a definite position and speed at every instant, is not possible.</p>

    <h3>The same calculation for a baseball</h3>
    <p>Locate a 0.145 kg baseball to within 1 µm ($\Delta x = 1 \times 10^{-6}$ m):</p>
    $$\Delta v \ge \frac{6.626 \times 10^{-34}}{4\pi(0.145)(1 \times 10^{-6})} = 3.6 \times 10^{-28}\ \text{m s}^{-1}$$
    <p>No instrument could detect that. For large objects the uncertainty principle changes nothing we can measure, which is why Newton's laws work so well for them.</p>

    <h2>What this means for electrons in atoms</h2>
    <p>Because position and momentum cannot both be known exactly, an electron does not have a definite path, or trajectory. Newton's laws need a starting position and velocity to predict a path, so they cannot be used for electrons in atoms.</p>
    <p>Physicists responded by changing the question. Instead of asking exactly where the electron is and how it moves, quantum theory asks <strong>where the electron is likely to be found</strong>. That shift to probability is built into Schrödinger's equation in the next lesson.</p>

    <div class="callout"><p><b>A common mix-up.</b> The uncertainty principle is not about clumsy instruments. Even a perfect measurement cannot beat $h/4\pi$. It reflects the wave nature from lesson 2.5: a wave squeezed into a small space must be built from many wavelengths, and so many momenta.</p></div>

    <h3>Going further: physics and philosophy</h3>
    <p>The historian Max Jammer argued that philosophical ideas helped shape quantum theory. Bohr attended lectures by the Danish philosopher Harald Høffding, who held that an observer is always part of the system being explained, never a detached spectator. Heisenberg later said that Bohr's way of thinking strongly influenced his own.</p>
  `);

  check(ctx, 'An electron\'s position is known to within 10 pm. What is the smallest uncertainty in its momentum?', '$\\Delta p \\ge h/(4\\pi\\Delta x) = (6.626 \\times 10^{-34})/(4\\pi \\times 1.0 \\times 10^{-11}) = 5.3 \\times 10^{-24}$ kg m s<sup>−1</sup>. Set Δx to 10 pm in Figure 2.6 to check.');
  check(ctx, 'An electron and a proton are each confined to boxes of the same size. Which one has the larger uncertainty in speed, and why?', 'For the same $\\Delta x$, $\\Delta p$ is the same, but $\\Delta v = \\Delta p/m$. The proton is about 1836 times heavier, so its speed uncertainty is about 1836 times smaller. Light particles are affected most.');
}
