// Formula and constant reference sheet.
import { h, fromHTML, tex } from '../ui/dom.js';

const CONSTANTS = [
  ['Planck\'s constant', 'h', '6.626 \\times 10^{-34}\\ \\text{J s}'],
  ['Speed of light', 'c', '2.998 \\times 10^{8}\\ \\text{m s}^{-1}'],
  ['Electron mass', 'm_e', '9.109 \\times 10^{-31}\\ \\text{kg}'],
  ['Proton mass', 'm_p', '1.673 \\times 10^{-27}\\ \\text{kg}'],
  ['Elementary charge', 'e', '1.602 \\times 10^{-19}\\ \\text{C}'],
  ['Rydberg constant', 'R_H', '2.179 \\times 10^{-18}\\ \\text{J}'],
  ['Bohr radius', 'a_0', '52.9\\ \\text{pm} = 5.29 \\times 10^{-11}\\ \\text{m}'],
  ['Avogadro\'s number', 'N_A', '6.022 \\times 10^{23}\\ \\text{mol}^{-1}'],
  ['Boltzmann\'s constant', 'k', '1.3806 \\times 10^{-23}\\ \\text{J K}^{-1}'],
  ['Permittivity of vacuum', '\\varepsilon_0', '8.854 \\times 10^{-12}\\ \\text{C}^2\\,\\text{J}^{-1}\\,\\text{m}^{-1}'],
];

const FORMULAS = [
  ['Wavelength and frequency', '\\lambda\\nu = c \\qquad \\nu = 1/T', '2.2'],
  ['Photon energy', 'E = h\\nu = \\dfrac{hc}{\\lambda}', '2.3'],
  ['Planck\'s oscillators', 'E_\\text{osc} = nh\\nu,\\quad n = 0, 1, 2, \\ldots', '2.3'],
  ['Photoelectric effect', 'E_\\text{photon} = w + KE_{e^-} \\qquad KE = \\tfrac12 m_e v^2', '2.3'],
  ['Work function and threshold', 'w = h\\nu_0 = \\dfrac{hc}{\\lambda_0}', '2.3'],
  ['Bohr angular momentum', 'm_e v r = n\\dfrac{h}{2\\pi}', '2.4'],
  ['Hydrogen energy levels', 'E_n = -\\dfrac{R_H}{n^2}', '2.4'],
  ['Hydrogen transitions', '\\Delta E = h\\nu = -R_H\\left(\\dfrac{1}{n_f^2} - \\dfrac{1}{n_i^2}\\right)', '2.4'],
  ['de Broglie wavelength', '\\lambda = \\dfrac{h}{p} = \\dfrac{h}{mv}', '2.5'],
  ['Uncertainty principle', '\\Delta x\\,\\Delta p \\ge \\dfrac{h}{4\\pi} \\qquad \\Delta p = m\\,\\Delta v', '2.6'],
  ['Schrödinger equation', '-\\dfrac{h^2}{8\\pi^2 m_e}\\nabla^2\\Psi + V\\Psi = E\\Psi', '2.7'],
  ['Born interpretation', '|\\Psi|^2\\,dV = \\text{probability in } dV', '2.7'],
  ['Quantum numbers', 'n = 1, 2, \\ldots \\quad l = 0, \\ldots, n-1 \\quad m_l = -l, \\ldots, +l \\quad m_s = \\pm\\tfrac12', '2.7'],
  ['Wavefunction factors', '\\Psi = R(r)\\,Y(\\theta,\\phi)', '2.8'],
  ['Nodes', '\\text{radial} = n - l - 1 \\quad \\text{angular} = l \\quad \\text{total} = n - 1', '2.8'],
  ['Radial distribution function', '\\text{RDF} \\propto r^2 R(r)^2 \\qquad r_\\text{mp}(1s) = a_0', '2.8'],
  ['Spherical coordinates', 'x = r\\sin\\theta\\cos\\phi \\quad y = r\\sin\\theta\\sin\\phi \\quad z = r\\cos\\theta', '2.7'],
  ['Orbitals per shell', 'n^2 \\text{ orbitals}, \\quad 2n^2 \\text{ electron states}', '2.9'],
];

export function render(ctx) {
  const main = h('article', { class: 'prose', style: { maxWidth: '60rem' } });
  ctx.main.append(main);
  main.append(h('header', { class: 'lesson-head' },
    h('p', { class: 'kicker' }, 'Tools'),
    h('h1', {}, 'Formulas and constants'),
    h('p', { class: 'goal' }, 'Everything Module 2 uses, with the lesson where each one is introduced. Constants use the values from the module notes.')));

  main.append(fromHTML(tex`<h2>Constants</h2>
    <div class="table-wrap"><table><thead><tr><th>Quantity</th><th>Symbol</th><th>Value</th></tr></thead><tbody>
    ${CONSTANTS.map(([n, s, v]) => `<tr><td>${n}</td><td>$${s}$</td><td>$${v}$</td></tr>`).join('')}
    </tbody></table></div>
    <h2>Formulas</h2>`));

  const grid = h('div', { class: 'ref-grid' });
  for (const [name, f, lesson] of FORMULAS) {
    grid.append(h('div', { class: 'ref-item' }, h('h3', {}, name), fromHTML(`$$${f}$$`), h('p', {}, 'Lesson ', h('a', { href: `#/lesson/${lesson}` }, lesson))));
  }
  main.append(grid);

  main.append(fromHTML(tex`<h2>Unit conversions</h2>
    <div class="table-wrap"><table><tbody>
      <tr><td>1 nm</td><td>$10^{-9}$ m</td></tr>
      <tr><td>1 pm</td><td>$10^{-12}$ m</td></tr>
      <tr><td>1 Å</td><td>$10^{-10}$ m = 100 pm</td></tr>
      <tr><td>1 Hz</td><td>1 s$^{-1}$</td></tr>
      <tr><td>1 eV</td><td>$1.602 \times 10^{-19}$ J</td></tr>
      <tr><td>1 J s</td><td>1 kg m$^2$ s$^{-1}$</td></tr>
      <tr><td>$hc$</td><td>$1.986 \times 10^{-25}$ J m</td></tr>
    </tbody></table></div>
    <h2>Order of the electromagnetic spectrum</h2>
    <p>Shortest wavelength (highest energy) to longest: gamma rays, X-rays, ultraviolet, visible (about 400 to 750 nm), infrared, microwaves, radio waves.</p>`));
}
