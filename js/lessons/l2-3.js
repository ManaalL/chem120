import { tex } from '../ui/dom.js';
import { add, figure, spotlight, check } from './kit.js';
import { create as blackbody } from '../widgets/blackbody.js';
import { create as photoelectric } from '../widgets/photoelectric.js';
import { create as spectroscope } from '../widgets/spectroscope.js';

export const goal = 'Summarize the three experiments that showed energy at the atomic level is quantized, and use $E = h\\nu$.';

export function render(ctx) {
  add(ctx, tex`
    <p>Each of these experiments shone light on matter, or collected light coming from it, and got a result classical physics could not explain. Together they made the case that energy at the scale of atoms comes in packets.</p>

    <h2>1. Blackbody radiation (Planck, 1900)</h2>
    <p>Every object gives off electromagnetic radiation because of its temperature. At 300 K, about room temperature, the radiation is mostly in the mid-infrared, which is why thermal cameras can see people in the dark. An idealized object that absorbs all light falling on it and emits only because of its temperature is called a <strong>blackbody</strong>.</p>
    <p><strong>The experiment.</strong> From the 1850s on, physicists heated solids, passed the emitted light through a prism and measured the intensity at each wavelength. The curves always rose to a peak and then fell. Hotter objects peaked at shorter wavelengths, which is why a stove element glows red and then orange as it heats.</p>
    <p><strong>The problem.</strong> Classical physics, through the Rayleigh-Jeans law, predicted that intensity should keep rising as wavelength shrinks. At short wavelengths the predicted intensity goes to infinity, a failure later nicknamed the ultraviolet catastrophe. Try it in the figure.</p>
  `);

  figure(ctx, blackbody(), '<b>Figure 2.3a.</b> Planck\'s law (solid) against the classical prediction (dashed). Raise the temperature and watch the peak move to shorter wavelengths, into the visible range near 5000 K.');

  add(ctx, tex`
    <p><strong>Planck's fix.</strong> In 1900 Max Planck matched the measured curves by making two assumptions that seemed strange at the time:</p>
    <ol>
      <li>Light of frequency $\nu$ is produced by groups of atoms in the solid that oscillate at that same frequency.</li>
      <li>The energy of an oscillating group can only be a whole-number multiple of a basic amount, $h\nu$.</li>
    </ol>
    <div class="key-eq">
      $$E_\text{osc} = n h \nu \qquad n = 0, 1, 2, \ldots \qquad h = 6.626 \times 10^{-34}\ \text{J s}$$
      <p class="where">The oscillator can hold $0$, $h\nu$, $2h\nu$, and so on, but never anything in between. This was the first proposal that energy is quantized.</p>
    </div>
    <p>Planck found that his formula reproduced the experiments only when $h$ had the value above, now called <strong>Planck's constant</strong>. On everyday scales a step of $h\nu$ is far too small to notice. On the atomic scale, where energies are around $10^{-19}$ J, it is not small at all. You do not need Planck's full intensity formula in this course; the figure uses it for you.</p>

    <h2>2. The photoelectric effect (Einstein, 1905)</h2>
    <p><strong>The experiment.</strong> Heinrich Hertz noticed in 1887 that light shining on a metal can knock electrons out of its surface. Later experiments measured the kinetic energy of those electrons while changing the light's frequency and its intensity.</p>
    <p><strong>What was observed.</strong></p>
    <ol>
      <li>Electrons come out only if the light's frequency is above a threshold $\nu_0$ that depends on the metal. Below it, nothing happens however bright the light.</li>
      <li>Above the threshold, the electrons' kinetic energy rises in a straight line with frequency. The slope of that line is $6.626 \times 10^{-34}$ J s, Planck's constant again.</li>
      <li>Above the threshold, electrons leave immediately, even in very dim light. Brighter light gives more electrons, not faster ones.</li>
    </ol>
    <p>If light's energy were spread smoothly across the wave, dim light should need time to build up enough energy in one spot to free an electron. No delay was ever seen. Observations 1 and 2 say the energy of light is proportional to its frequency. Observation 3 says that energy arrives concentrated in one place.</p>
    <p><strong>Einstein's explanation.</strong> Light is made of particle-like packets called <strong>photons</strong>, each carrying energy</p>
    <div class="key-eq">
      $$E_\text{photon} = h\nu = \frac{hc}{\lambda}$$
    </div>
    <p>One photon gives all its energy to one electron. Part of it, the <strong>work function</strong> $w$, is used to pull the electron free of the metal. Whatever is left becomes the electron's kinetic energy:</p>
    <div class="key-eq">
      $$E_\text{photon} = w + KE_{e^-} \qquad w = h\nu_0 = \frac{hc}{\lambda_0} \qquad KE_{e^-} = \tfrac12 m_e v^2$$
      <p class="where">$\nu_0$ and $\lambda_0$ are the threshold frequency and wavelength. $m_e = 9.109 \times 10^{-31}$ kg.</p>
    </div>
    <p>Einstein won the 1921 Nobel Prize in Physics for this. Planck's constant showing up in a second, unrelated experiment convinced many physicists that the quantum idea was real.</p>
  `);

  figure(ctx, photoelectric(), '<b>Figure 2.3b.</b> The photoelectric effect. Lower the intensity to almost nothing and electrons still come out instantly, as long as the wavelength is short enough. Raise the wavelength past the threshold and they stop, however bright the light.');

  add(ctx, tex`
    <h3>Worked example: photon energy of a germicidal lamp</h3>
    <p>Ultraviolet lamps used to disinfect water emit at 254 nm. Find the energy of one photon and of one mole of photons.</p>
    $$E = \frac{hc}{\lambda} = \frac{(6.626 \times 10^{-34}\ \text{J s})(2.998 \times 10^{8}\ \text{m s}^{-1})}{254 \times 10^{-9}\ \text{m}} = 7.82 \times 10^{-19}\ \text{J}$$
    $$E_\text{mol} = (7.82 \times 10^{-19}\ \text{J})(6.022 \times 10^{23}\ \text{mol}^{-1}) = 4.71 \times 10^{5}\ \text{J mol}^{-1} = 471\ \text{kJ mol}^{-1}$$
    <p>That is more than the energy of a typical carbon-carbon single bond (about 350 kJ mol<sup>−1</sup>), which is why this light damages the DNA of microbes.</p>

    <h3>Worked example: electrons from potassium</h3>
    <p>Potassium has a work function of 2.30 eV, or $3.68 \times 10^{-19}$ J. How fast are electrons ejected by 400 nm light?</p>
    $$E_\text{photon} = \frac{hc}{\lambda} = \frac{1.986 \times 10^{-25}\ \text{J m}}{400 \times 10^{-9}\ \text{m}} = 4.97 \times 10^{-19}\ \text{J}$$
    $$KE = E_\text{photon} - w = 4.97 \times 10^{-19} - 3.68 \times 10^{-19} = 1.28 \times 10^{-19}\ \text{J}$$
    $$v = \sqrt{\frac{2\,KE}{m_e}} = \sqrt{\frac{2(1.28 \times 10^{-19}\ \text{J})}{9.109 \times 10^{-31}\ \text{kg}}} = 5.3 \times 10^{5}\ \text{m s}^{-1}$$
    <p>Choose potassium and 400 nm in Figure 2.3b to check.</p>
  `);

  add(ctx, tex`
    <h2>3. Line spectra of atoms</h2>
    <p><strong>The experiment.</strong> A prism spreads white light into a continuous rainbow. Put a sample of hydrogen gas between the lamp and the prism and thin dark lines appear in the rainbow: the gas has absorbed a few particular wavelengths. Now give the gas energy, with heat or an electric discharge, and look at the light it gives off. Instead of a rainbow you see only a few bright lines, at exactly the wavelengths that were missing before.</p>
    <p><strong>What it means.</strong> The photoelectric effect showed that a photon's energy is set by its wavelength. If an atom absorbs and emits only certain wavelengths, it can only take in and give out certain amounts of energy. Each element has its own set of lines, like a fingerprint. Line spectra were the most direct evidence that the energy of an atom is quantized.</p>
  `);

  figure(ctx, spectroscope(), '<b>Figure 2.3c.</b> Hydrogen\'s visible lines at 410.1, 434.0, 486.1 and 656.3 nm. Compare the absorption and emission patterns.');

  add(ctx, tex`
    <h2>Summary of the three experiments</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Experiment</th><th>What was seen</th><th>Key idea</th></tr></thead>
      <tbody>
        <tr><td>Blackbody radiation<br>Planck, 1900</td><td>Intensity curves with a peak that classical physics could not produce</td><td>Oscillating atoms only have energies $E = nh\nu$</td></tr>
        <tr><td>Photoelectric effect<br>Einstein, 1905</td><td>A threshold frequency; electron energy rises linearly with $\nu$ with slope $h$</td><td>Light comes in photons, $E = h\nu$</td></tr>
        <tr><td>Line spectra</td><td>Atoms absorb and emit only certain wavelengths</td><td>An atom's energy is restricted to certain values</td></tr>
      </tbody>
    </table></div>
    <p>The obvious next question is <em>which</em> energies hydrogen is allowed, and why. Bohr gave the first answer in lesson 2.4.</p>
  `);

  spotlight(ctx, 'gfp');
  spotlight(ctx, 'oximetry');

  check(ctx, 'Using $E = h\\nu$ and $\\lambda\\nu = c$, show that $E = hc/\\lambda$.', 'From $\\lambda\\nu = c$, $\\nu = c/\\lambda$. Substitute into $E = h\\nu$ to get $E = hc/\\lambda$. Energy is inversely proportional to wavelength.');
  check(ctx, 'Red light does not eject electrons from zinc, even from a very bright red laser. A weak ultraviolet lamp does. Why?', 'Each red photon has less energy than zinc\'s work function (about 4.3 eV), so no single photon can free an electron. A brighter laser only sends more of these too-weak photons. Each UV photon has more than 4.3 eV, so even a few of them free electrons.');
}
