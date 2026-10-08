import { tex } from '../ui/dom.js';
import { add, figure, spotlight, check } from './kit.js';
import { create as emWave } from '../widgets/em-wave.js';

export const goal = `Explain and use the relationships between the wavelength, frequency and energy of light.`;

export function render(ctx) {
  add(ctx, tex`

    <h2>Light is a travelling electromagnetic field</h2>
    <p>Light is electromagnetic radiation. It carries energy through space as an electric field and a magnetic field that oscillate at the same frequency. The two fields point at right angles to each other, and both are at right angles to the direction the light travels.</p>
    <p>Electromagnetic radiation is produced whenever electric charges accelerate. In an old-style light bulb, the tungsten filament gets hot and its atoms vibrate rapidly. The moving charges send out oscillating fields, and those fields spread out as light.</p>
  `);

  figure(ctx, emWave(), '<b>Figure 2.2.</b> The electric field (E) and magnetic field (B) of a light wave. Use the slider or click the spectrum bar to change the wavelength. The read-outs update the frequency, period and photon energy.', { wide: true });

  add(ctx, tex`
    <h2>Describing a wave with three numbers</h2>
    <p>Freeze the wave at one instant and measure along it: the distance from one peak to the next is the <strong>wavelength</strong>, $\lambda$, in metres. Watch one point in space instead: the time for the field to return to its peak is the <strong>period</strong>, $T$, in seconds. The <strong>frequency</strong>, $\nu$, is how many peaks pass that point each second, so $\nu = 1/T$. Its unit is $\text{s}^{-1}$, also called the hertz (Hz).</p>
    <p>One full wavelength passes in one period, so the wave moves at $\lambda / T = \lambda\nu$. In a vacuum every kind of light moves at the same speed, $c$.</p>
    <div class="key-eq">
      $$\lambda \nu = c \qquad c = 2.998 \times 10^{8}\ \text{m s}^{-1}$$
      <p class="where">Wavelength and frequency are inversely proportional. Double one and the other halves.</p>
    </div>

    <h3>Worked example: a red laser pointer</h3>
    <p>A laser pointer emits light with $\lambda = 650$ nm. What is its frequency?</p>
    <p>Convert to metres first: $650\ \text{nm} = 650 \times 10^{-9}\ \text{m}$. Then</p>
    $$\nu = \frac{c}{\lambda} = \frac{2.998 \times 10^{8}\ \text{m s}^{-1}}{650 \times 10^{-9}\ \text{m}} = 4.61 \times 10^{14}\ \text{s}^{-1}$$
    <p>About 461 trillion peaks pass any point every second. The figure above gives the same value if you choose the red laser preset.</p>

    <h2>The electromagnetic spectrum</h2>
    <p>Light is grouped by wavelength. From shortest to longest: gamma rays, X-rays, ultraviolet, visible, infrared, microwaves and radio waves. Visible light covers only about 400 nm (violet) to 750 nm (red). Learn the order; it comes up again and again.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Region</th><th>Typical wavelength</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Gamma rays</td><td>below about 10 pm</td><td>Radioactive decay, PET imaging</td></tr>
        <tr><td>X-rays</td><td>10 pm to 10 nm</td><td>Medical imaging, crystal structures</td></tr>
        <tr><td>Ultraviolet</td><td>10 nm to 400 nm</td><td>Sunburn, sterilizing lamps</td></tr>
        <tr><td>Visible</td><td>400 nm to 750 nm</td><td>What our eyes detect</td></tr>
        <tr><td>Infrared</td><td>750 nm to 1 mm</td><td>Heat lamps, TV remotes, pulse oximeters</td></tr>
        <tr><td>Microwaves</td><td>1 mm to 10 cm</td><td>Microwave ovens, radar, Wi-Fi</td></tr>
        <tr><td>Radio waves</td><td>above about 10 cm</td><td>FM radio, MRI scanners</td></tr>
      </tbody>
    </table></div>
    <p>Lesson 2.3 shows that the energy carried by light depends on its frequency, $E = h\nu = hc/\lambda$. Shorter wavelength means more energy per photon. That is why gamma rays and X-rays can break chemical bonds and damage DNA, while radio waves pass through us harmlessly. The energy read-outs in Figure 2.2 already use this relationship.</p>
  `);

  spotlight(ctx, 'oximetry');
  spotlight(ctx, 'mri');

  check(ctx, 'Light has a frequency of $6.00 \\times 10^{14}$ Hz. What is its wavelength in nanometres, and what colour is it?',
    '$\\lambda = c/\\nu = (2.998 \\times 10^{8})/(6.00 \\times 10^{14}) = 5.00 \\times 10^{-7}$ m $= 500$ nm. That is in the blue-green part of the visible spectrum.');
  check(ctx, 'Put these in order from lowest to highest energy per photon: X-rays, microwaves, green light, infrared.',
    'Microwaves, infrared, green light, X-rays. Energy per photon increases as wavelength decreases.');
}
