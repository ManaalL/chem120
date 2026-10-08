// Applications page: the matrix of where Module 2 ideas show up, with a small calculator for each.
import { h, fromHTML, slider, readouts } from '../ui/dom.js';
import { APPLICATIONS } from '../content/applications.js';
import * as P from '../core/physics.js';

const LESSON_TITLES = { '2.1': 'Quantization', '2.2': 'Light', '2.3': 'Three experiments', '2.4': 'Bohr model', '2.5': 'de Broglie', '2.9': 'Spin' };

// Calculator builders keyed by application id.
const CALCS = {
  mri() {
    const ro = readouts([{ key: 'nu', label: 'Larmor frequency' }, { key: 'lam', label: 'Radio wavelength' }, { key: 'dE', label: 'Energy gap, ΔE = hν' }, { key: 'excess', label: 'Extra protons in lower state at 37 °C' }]);
    const upd = (B) => {
      const nu = 42.577e6 * B; const dE = P.C.h * nu; const kT = P.C.kB * 310;
      ro.set('nu', `${(nu / 1e6).toFixed(1)} MHz`); ro.set('lam', `${(P.C.c / nu).toFixed(2)} m`); ro.set('dE', `${P.sci(dE, 3)} J`);
      ro.set('excess', `about ${(dE / (2 * kT) * 1e6).toFixed(1)} per million`);
    };
    const s = slider({ label: 'Magnet strength, B', min: 0.5, max: 7, step: 0.1, value: 3, format: (v) => `${v.toFixed(1)} T`, onInput: upd });
    upd(3);
    return [h('h3', {}, 'Calculator: proton spin flip in an MRI magnet'), s, ro];
  },
  tem() {
    const ro = readouts([{ key: 'rel', label: 'Wavelength (relativistic)' }, { key: 'non', label: 'Wavelength (ignoring relativity)' }, { key: 'v', label: 'Electron speed' }]);
    const upd = (kV) => {
      const V = kV * 1e3; const g = 1 + (P.C.e * V) / (P.C.me * P.C.c ** 2);
      ro.set('rel', `${(P.electronWavelength(V, true) / P.PM).toFixed(2)} pm`);
      ro.set('non', `${(P.electronWavelength(V, false) / P.PM).toFixed(2)} pm`);
      ro.set('v', `${(Math.sqrt(1 - 1 / (g * g)) * 100).toFixed(1)}% of the speed of light`);
    };
    const s = slider({ label: 'Accelerating voltage', min: 10, max: 300, step: 5, value: 200, format: (v) => `${v} kV`, onInput: upd });
    upd(200);
    return [h('h3', {}, 'Calculator: electron wavelength in a microscope'), s, ro];
  },
  pdt() {
    const ro = readouts([{ key: 'E', label: 'Photon energy' }, { key: 'reg', label: 'Region' }, { key: 'o2', label: 'Compared with singlet oxygen (0.98 eV)' }]);
    const upd = (nm) => {
      const eV = P.photonEnergy(nm * 1e-9) / P.EV;
      ro.set('E', `${eV.toFixed(2)} eV (${P.sci(P.photonEnergy(nm * 1e-9), 3)} J)`);
      ro.set('reg', `${P.regionOf(nm * 1e-9)}${P.colourName(nm) ? `, ${P.colourName(nm)}` : ''}`);
      ro.set('o2', `${(eV / 0.98).toFixed(1)} times as much`);
    };
    const s = slider({ label: 'Laser wavelength', min: 400, max: 1300, step: 5, value: 630, format: (v) => `${v} nm`, onInput: upd });
    upd(630);
    return [h('h3', {}, 'Calculator: photon energy against the energy singlet oxygen needs'), s, ro, h('p', { class: 'ctl-hint' }, 'A photon only works if the drug can absorb it. Each photosensitizer has its own absorption band, so having enough energy is necessary but not enough.')];
  },
  oximetry() {
    const ro = readouts([{ key: 'sp', label: 'Estimated SpO₂ (110 − 25R)' }, { key: 'red', label: 'Photon energy at 660 nm' }, { key: 'ir', label: 'Photon energy at 940 nm' }]);
    const upd = (R) => {
      const sp = Math.max(0, Math.min(100, 110 - 25 * R));
      ro.set('sp', `${sp.toFixed(0)}%${sp < 90 ? ' (low)' : ''}`);
      ro.set('red', `${(P.photonEnergy(660e-9) / P.EV).toFixed(2)} eV`);
      ro.set('ir', `${(P.photonEnergy(940e-9) / P.EV).toFixed(2)} eV`);
    };
    const s = slider({ label: 'Measured ratio, R', min: 0.4, max: 1.6, step: 0.01, value: 0.6, format: (v) => v.toFixed(2), onInput: upd });
    upd(0.6);
    return [h('h3', {}, 'Calculator: from the red/infrared ratio to oxygen saturation'), s, ro, h('p', { class: 'ctl-hint' }, 'Textbook approximation only. Each device uses its own calibration curve.')];
  },
  gfp() {
    const state = { ex: 488, em: 507 };
    const ro = readouts([{ key: 'ex', label: 'Absorbed photon' }, { key: 'em', label: 'Emitted photon' }, { key: 'shift', label: 'Stokes shift' }]);
    const upd = () => {
      const a = P.photonEnergy(state.ex * 1e-9) / P.EV, b = P.photonEnergy(state.em * 1e-9) / P.EV;
      ro.set('ex', `${state.ex} nm, ${a.toFixed(3)} eV`); ro.set('em', `${state.em} nm, ${b.toFixed(3)} eV`);
      ro.set('shift', state.em > state.ex ? `${state.em - state.ex} nm; ${(a - b).toFixed(3)} eV lost as heat per photon` : 'emission must be at a longer wavelength');
    };
    const s1 = slider({ label: 'Excitation wavelength', min: 350, max: 600, step: 1, value: 488, format: (v) => `${v} nm`, onInput: (v) => { state.ex = v; upd(); } });
    const s2 = slider({ label: 'Emission wavelength', min: 380, max: 700, step: 1, value: 507, format: (v) => `${v} nm`, onInput: (v) => { state.em = v; upd(); } });
    upd();
    return [h('h3', {}, 'Calculator: Stokes shift'), s1, s2, ro];
  },
  photosynthesis() {
    const ro = readouts([{ key: 'E', label: 'Energy per photon' }, { key: 'mol', label: 'Energy per mole of photons' }, { key: 'atp', label: 'Compared with ATP hydrolysis (30.5 kJ mol⁻¹)' }]);
    const upd = (nm) => {
      const E = P.photonEnergy(nm * 1e-9);
      ro.set('E', `${P.sci(E, 3)} J`); ro.set('mol', `${(E * P.C.NA / 1000).toFixed(0)} kJ mol⁻¹`);
      ro.set('atp', `${(E * P.C.NA / 1000 / 30.5).toFixed(1)} times as much`);
    };
    const s = slider({ label: 'Wavelength', min: 400, max: 750, step: 1, value: 680, format: (v) => `${v} nm`, onInput: upd });
    upd(680);
    return [h('h3', {}, 'Calculator: energy delivered by light to a leaf'), s, ro];
  },
};

export function render(ctx, arg) {
  const main = h('article', { class: 'prose' });
  ctx.main.append(main);
  const matrix = `<div class="table-wrap"><table class="matrix"><thead><tr><th>Application</th><th>Module 2 idea behind it</th><th>Lessons</th></tr></thead><tbody>${APPLICATIONS.map((a) => `<tr><td><a href="#/applications/${a.id}">${a.title}</a></td><td>${a.idea}</td><td>${a.lessons.map((l) => `<a href="#/lesson/${l}">${l} ${LESSON_TITLES[l] || ''}</a>`).join('<br>')}</td></tr>`).join('')}</tbody></table></div>`;
  main.append(
    h('header', { class: 'lesson-head' },
      h('p', { class: 'kicker' }, 'Tools'),
      h('h1', {}, 'Applications in medicine and technology'),
      h('p', { class: 'goal' }, 'The physics of Module 2 sits under several tools used in hospitals and labs. Each entry links back to the lessons it depends on.')),
    fromHTML(matrix));
  for (const a of APPLICATIONS) {
    const card = h('section', { class: 'app-card', id: a.id },
      h('h2', {}, a.title),
      h('p', { class: 'app-meta' }, `Builds on lesson${a.lessons.length > 1 ? 's' : ''} ${a.lessons.join(' and ')}`),
      fromHTML(a.body));
    if (CALCS[a.id]) card.append(h('div', { class: 'mini-calc' }, CALCS[a.id]()));
    main.append(card);
  }
}
