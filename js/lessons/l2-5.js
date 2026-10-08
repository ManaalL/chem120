import { tex } from '../ui/dom.js';
import { add, figure, spotlight, check } from './kit.js';
import { createCalculator, createDiffraction } from '../widgets/debroglie.js';

export const goal = 'Calculate the de Broglie wavelength of a moving particle and explain why wave behaviour matters for electrons but not for everyday objects.';

export function render(ctx) {
  add(ctx, tex`
    <h2>Two ideas that replaced Bohr's model</h2>
    <p>Bohr's model matched hydrogen's spectrum but could not say why the energy is quantized. The breakthrough came from two ideas in the 1920s. The first, covered here, is that electrons behave like waves. The second, in lesson 2.6, is that their exact behaviour can never be fully known.</p>

    <h2>Light already had two faces</h2>
    <p>By the 1920s it was clear that light behaves as a wave in some experiments and as a stream of particles in others.</p>
    <ul>
      <li><strong>Diffraction</strong> shows light acting as a wave. When light passes through a gap or around an obstacle about the same size as its wavelength, it spreads out and forms a pattern of bright and dark rings where waves add together or cancel.</li>
      <li><strong>The photoelectric effect</strong> shows light acting as particles, photons that each deliver a fixed packet of energy.</li>
    </ul>

    <h2>de Broglie's hypothesis</h2>
    <p>In 1924 Louis de Broglie reasoned that if light, which we think of as a wave, can act like particles, then particles might act like waves. A particle of mass $m$ moving at speed $v$ has momentum $p = mv$. Using Einstein's theory of relativity, de Broglie argued that such a particle has a wavelength:</p>
    <div class="key-eq">
      $$\lambda_{dB} = \frac{h}{p} = \frac{h}{mv}$$
      <p class="where">$\lambda_{dB}$ is the de Broglie wavelength. Use SI units: mass in kg, speed in m s<sup>−1</sup>, giving $\lambda$ in m.</p>
    </div>
    <p>Because $h$ is so small, the wavelength is noticeable only when $mv$ is also very small. That points straight at electrons.</p>
  `);

  figure(ctx, createCalculator(), '<b>Figure 2.5a.</b> The de Broglie wavelength on a scale from 10<sup>−40</sup> m to 1 m. Compare an electron with a baseball at the same speed.');

  add(ctx, tex`
    <h3>Worked example: an electron and a baseball</h3>
    <p>Find the de Broglie wavelength of an electron moving at $1.0 \times 10^{6}$ m s<sup>−1</sup>, and of a 0.145 kg baseball thrown at 40 m s<sup>−1</sup>.</p>
    $$\lambda_{e^-} = \frac{6.626 \times 10^{-34}\ \text{J s}}{(9.109 \times 10^{-31}\ \text{kg})(1.0 \times 10^{6}\ \text{m s}^{-1})} = 7.3 \times 10^{-10}\ \text{m} = 730\ \text{pm}$$
    $$\lambda_\text{ball} = \frac{6.626 \times 10^{-34}\ \text{J s}}{(0.145\ \text{kg})(40\ \text{m s}^{-1})} = 1.1 \times 10^{-34}\ \text{m}$$
    <p>The electron's wavelength is a few times the spacing between atoms in a solid, so a crystal can diffract it. The baseball's wavelength is about $10^{19}$ times smaller than a proton. No gap could ever be that narrow, which is why we never see baseballs diffract. (J s is the same as kg m<sup>2</sup> s<sup>−1</sup>, so the units cancel to metres.)</p>

    <h2>Electrons do diffract</h2>
    <p>In 1927 two groups confirmed de Broglie's idea. Clinton Davisson and Lester Germer in the United States bounced electrons off a nickel crystal, and George Paget Thomson in Scotland sent electrons through thin metal foils. Both saw diffraction patterns, exactly as if the electrons were waves. The regular gaps between atoms in the metal acted as the openings. The electrons' speed had to be chosen so their wavelength matched those gaps.</p>
  `);

  figure(ctx, createDiffraction(), '<b>Figure 2.5b.</b> Electrons fired through a thin metal foil. Each one arrives at a single point. Keep firing and the dots build up rings. Switch to baseballs: their wavelength is so short that the rings collapse into one spot.');

  add(ctx, tex`
    <h2>So what is an electron?</h2>
    <p>In some experiments electrons act like particles: each one lands at a single point. In others they act like waves: many of them together make an interference pattern. A particle is a small thing in one place; a wave is spread out. Nothing can be both in the everyday sense.</p>
    <p>The working answer is that an electron is neither. It is something our everyday ideas of "particle" and "wave" each describe only in part, depending on the experiment. Our intuition was built from large objects, so it is not surprising that it fails here.</p>
    <div class="callout"><p><b>The main point of this lesson.</b> A complete description of an electron in an atom must include its wave behaviour. Schrödinger's equation in lesson 2.7 does exactly that.</p></div>

    <h3>Going further: a wave explanation for Bohr's rule</h3>
    <p>de Broglie's idea explains the rule Bohr had to assume. Picture an electron wave wrapped around a circular orbit. It only fits if a whole number of wavelengths matches the circumference, otherwise the wave cancels itself out:</p>
    $$2\pi r = n\lambda = n\frac{h}{m_e v} \quad\Longrightarrow\quad m_e v r = n\frac{h}{2\pi}$$
    <p>That is Bohr's angular momentum condition. Quantization appears because only certain waves fit, the same reason a guitar string only plays certain notes. The orbit picture itself is still wrong, but the idea that confined waves have only certain allowed patterns carries straight into lesson 2.7.</p>
  `);

  spotlight(ctx, 'tem');
  spotlight(ctx, 'photosynthesis');

  check(ctx, 'A proton and an electron move at the same speed. Which has the longer de Broglie wavelength, and by roughly how much?', 'The electron. $\\lambda = h/mv$, so at equal speed the lighter particle has the longer wavelength. The proton is about 1836 times heavier, so the electron\'s wavelength is about 1836 times longer.');
  check(ctx, 'What speed would an electron need for its de Broglie wavelength to equal 100 pm, about the size of an atom?', '$v = h/(m\\lambda) = (6.626 \\times 10^{-34})/[(9.109 \\times 10^{-31})(1.00 \\times 10^{-10})] = 7.27 \\times 10^{6}$ m s<sup>−1</sup>, about 2.4% of the speed of light.');
}
