// Practice problem generator for Module 2. Every question is generated with fresh numbers
// and comes with a worked solution.
import { h, select, typeset, button } from '../ui/dom.js';
import * as P from '../core/physics.js';
import * as H from '../core/hydrogen.js';

const r = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(r(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// LaTeX scientific notation: 6.626 \times 10^{-34}
export function texSci(x, d = 3) {
  if (x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -2 && e <= 3) return String(Number(x.toPrecision(d)));
  let m = Number((x / 10 ** e).toPrecision(d)), ee = e;
  if (Math.abs(m) >= 10) { m /= 10; ee++; }
  return `${m.toFixed(d - 1)} \\times 10^{${ee}}`;
}
const hc = P.C.h * P.C.c;

export const GENERATORS = {
  light: [
    () => {
      const nm = ri(200, 900); const nu = P.C.c / (nm * 1e-9);
      return { q: `Light has a wavelength of ${nm} nm. What is its frequency?`, answer: nu, unit: 's⁻¹',
        sol: `$\\nu = \\dfrac{c}{\\lambda} = \\dfrac{2.998 \\times 10^{8}\\ \\text{m s}^{-1}}{${nm} \\times 10^{-9}\\ \\text{m}} = ${texSci(nu)}\\ \\text{s}^{-1}$` };
    },
    () => {
      const nu = Number(r(3.5, 9.5).toFixed(2)) * 1e14; const nm = P.C.c / nu / 1e-9;
      return { q: `Light has a frequency of $${texSci(nu)}$ Hz. What is its wavelength in nanometres?`, answer: nm, unit: 'nm',
        sol: `$\\lambda = \\dfrac{c}{\\nu} = \\dfrac{2.998 \\times 10^{8}}{${texSci(nu)}} = ${texSci(nm * 1e-9)}$ m $= ${nm.toFixed(1)}$ nm${P.colourName(nm) ? `, which is ${P.colourName(nm)} light` : ''}.` };
    },
    () => {
      const nm = ri(150, 800); const E = hc / (nm * 1e-9);
      return { q: `What is the energy of one photon of ${nm} nm light, in joules?`, answer: E, unit: 'J',
        sol: `$E = \\dfrac{hc}{\\lambda} = \\dfrac{(6.626 \\times 10^{-34})(2.998 \\times 10^{8})}{${nm} \\times 10^{-9}} = ${texSci(E)}\\ \\text{J}$` };
    },
    () => {
      const cm = Number(r(1, 30).toFixed(1)); const E = hc / (cm * 1e-2); const mol = (E * P.C.NA);
      return { q: `Microwave radiation has a wavelength of ${cm} cm. What is the energy of one mole of these photons, in J mol⁻¹?`, answer: mol, unit: 'J mol⁻¹',
        sol: `One photon: $E = \\dfrac{hc}{\\lambda} = \\dfrac{1.986 \\times 10^{-25}\\ \\text{J m}}{${cm} \\times 10^{-2}\\ \\text{m}} = ${texSci(E)}$ J. One mole: $(${texSci(E)})(6.022 \\times 10^{23}) = ${texSci(mol)}$ J mol$^{-1}$.` };
    },
  ],
  photo: [
    () => {
      const m = pick(P.METALS.filter((x) => x.w < 4.7)); const w = m.w * P.EV;
      const lam0 = hc / w; const nm = Math.max(120, Math.round((lam0 / 1e-9) * r(0.45, 0.85)));
      const E = hc / (nm * 1e-9); const ke = E - w; const v = Math.sqrt((2 * ke) / P.C.me);
      return { q: `The work function of ${m.name.toLowerCase()} is $${texSci(w)}$ J. What is the speed of an electron ejected by ${nm} nm light? ($m_e = 9.109 \\times 10^{-31}$ kg)`, answer: v, unit: 'm s⁻¹',
        sol: `$E_\\text{photon} = hc/\\lambda = ${texSci(E)}$ J. $KE = E_\\text{photon} - w = ${texSci(E)} - ${texSci(w)} = ${texSci(ke)}$ J. $v = \\sqrt{2KE/m_e} = \\sqrt{\\dfrac{2(${texSci(ke)})}{9.109 \\times 10^{-31}}} = ${texSci(v)}$ m s$^{-1}$.` };
    },
    () => {
      const m = pick(P.METALS); const w = m.w * P.EV; const lam0 = hc / w / 1e-9;
      return { q: `${m.name} has a work function of $${texSci(w)}$ J. What is the longest wavelength of light that can eject electrons from it, in nm?`, answer: lam0, unit: 'nm',
        sol: `At threshold all the photon energy goes into the work function: $w = hc/\\lambda_0$, so $\\lambda_0 = hc/w = \\dfrac{1.986 \\times 10^{-25}}{${texSci(w)}} = ${texSci(lam0 * 1e-9)}$ m $= ${lam0.toFixed(0)}$ nm.` };
    },
    () => {
      const m = pick(P.METALS); const nm = ri(200, 700); const res = P.photoelectric(nm * 1e-9, m.w * P.EV);
      return { q: `Light of ${nm} nm shines on ${m.name.toLowerCase()} ($w = ${m.w.toFixed(2)}$ eV $= ${texSci(m.w * P.EV)}$ J). Are electrons ejected?`, choices: ['Yes', 'No'], correct: res.ejected ? 0 : 1,
        sol: `$E_\\text{photon} = hc/\\lambda = ${texSci(res.photonEnergy)}$ J, which is ${res.ejected ? 'greater' : 'less'} than $w$. ${res.ejected ? 'Electrons are ejected.' : 'No electrons are ejected, however bright the light.'}` };
    },
  ],
  bohr: [
    () => {
      let ni = ri(1, 6), nf = ri(1, 6); while (nf === ni) nf = ri(1, 6);
      const t = P.transition(ni, nf); const nm = t.lambda / 1e-9;
      return { q: `An electron in a hydrogen atom moves from $n = ${ni}$ to $n = ${nf}$. What is the wavelength of the photon involved, in nm?`, answer: nm, unit: 'nm',
        sol: `$\\Delta E = -R_H\\left(\\dfrac{1}{${nf}^2} - \\dfrac{1}{${ni}^2}\\right) = ${texSci(t.dE, 4)}$ J, so a photon is ${t.type === 'emission' ? 'emitted' : 'absorbed'}. $\\lambda = hc/|\\Delta E| = ${texSci(t.lambda, 4)}$ m $= ${nm.toFixed(1)}$ nm (${t.series} series, ${t.region.toLowerCase()}).` };
    },
    () => {
      let ni = ri(1, 6), nf = ri(1, 6); while (nf === ni) nf = ri(1, 6);
      const t = P.transition(ni, nf);
      return { q: `For a hydrogen atom going from $n = ${ni}$ to $n = ${nf}$, is a photon absorbed or emitted?`, choices: ['Absorbed', 'Emitted'], correct: t.type === 'absorption' ? 0 : 1,
        sol: `$n_f ${nf > ni ? '>' : '<'} n_i$, so $\\Delta E = ${texSci(t.dE, 4)}$ J is ${t.dE > 0 ? 'positive: energy must be absorbed' : 'negative: energy is released as a photon'}.` };
    },
    () => {
      const n = ri(2, 6); const E = -P.C.RH / (n * n);
      return { q: `What is the energy of a hydrogen electron in the $n = ${n}$ level, in joules?`, answer: E, unit: 'J',
        sol: `$E_n = -\\dfrac{R_H}{n^2} = -\\dfrac{2.179 \\times 10^{-18}}{${n * n}} = ${texSci(E, 4)}$ J` };
    },
  ],
  debroglie: [
    () => {
      const v = Number(r(1, 9).toFixed(1)) * 10 ** ri(5, 6); const lam = P.C.h / (P.C.me * v);
      return { q: `What is the de Broglie wavelength of an electron moving at $${texSci(v, 2)}$ m s⁻¹, in picometres?`, answer: lam / 1e-12, unit: 'pm',
        sol: `$\\lambda = \\dfrac{h}{m_e v} = \\dfrac{6.626 \\times 10^{-34}}{(9.109 \\times 10^{-31})(${texSci(v, 2)})} = ${texSci(lam)}$ m $= ${(lam / 1e-12).toPrecision(3)}$ pm` };
    },
    () => {
      const m = Number(r(0.05, 0.5).toFixed(3)); const v = ri(5, 45); const lam = P.C.h / (m * v);
      return { q: `What is the de Broglie wavelength of a ${m} kg ball moving at ${v} m s⁻¹?`, answer: lam, unit: 'm',
        sol: `$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.626 \\times 10^{-34}}{(${m})(${v})} = ${texSci(lam)}$ m, far too small to observe.` };
    },
    () => {
      const pm = ri(50, 500); const v = P.C.h / (P.C.me * pm * 1e-12);
      return { q: `What speed must an electron have for its de Broglie wavelength to be ${pm} pm?`, answer: v, unit: 'm s⁻¹',
        sol: `$v = \\dfrac{h}{m_e\\lambda} = \\dfrac{6.626 \\times 10^{-34}}{(9.109 \\times 10^{-31})(${pm} \\times 10^{-12})} = ${texSci(v)}$ m s$^{-1}$` };
    },
  ],
  hup: [
    () => {
      const pm = ri(20, 400); const dv = P.minSpeedSpread(pm * 1e-12, P.C.me);
      return { q: `An electron's position is known to within ${pm} pm. What is the smallest possible uncertainty in its speed?`, answer: dv, unit: 'm s⁻¹',
        sol: `$\\Delta v \\ge \\dfrac{h}{4\\pi m_e \\Delta x} = \\dfrac{6.626 \\times 10^{-34}}{4\\pi(9.109 \\times 10^{-31})(${pm} \\times 10^{-12})} = ${texSci(dv)}$ m s$^{-1}$` };
    },
  ],
  orbitals: [
    () => {
      const n = ri(2, 6), l = ri(0, n - 1); const name = `${n}${H.SUBSHELL[l]}`;
      return { q: `How many radial nodes does a ${name} orbital have?`, answer: n - l - 1, unit: '', exact: true,
        sol: `Radial nodes $= n - l - 1 = ${n} - ${l} - 1 = ${n - l - 1}$. (It also has $l = ${l}$ angular node${l === 1 ? '' : 's'}.)` };
    },
    () => {
      const n = ri(2, 6), l = ri(0, n - 1); const name = `${n}${H.SUBSHELL[l]}`;
      return { q: `How many maxima does the radial distribution function of a ${name} orbital have?`, answer: n - l, unit: '', exact: true,
        sol: `The number of maxima is $n - l = ${n} - ${l} = ${n - l}$, one more than the number of radial nodes.` };
    },
    () => {
      const n = ri(3, 6), l = ri(1, Math.min(3, n - 1)); const rn = n - l - 1;
      const right = `${n}${H.SUBSHELL[l]}`;
      const wrong = new Set();
      while (wrong.size < 3) { const nn = ri(2, 6), ll = ri(0, Math.min(3, nn - 1)); const nm = `${nn}${H.SUBSHELL[ll]}`; if (nm !== right && !(nn - ll - 1 === rn && ll === l)) wrong.add(nm); }
      const choices = [...wrong, right].sort(() => Math.random() - 0.5);
      return { q: `An orbital has ${rn} radial node${rn === 1 ? '' : 's'} and ${l} angular node${l === 1 ? '' : 's'}. Which orbital is it?`, choices, correct: choices.indexOf(right),
        sol: `Angular nodes give $l = ${l}$ (${H.SUBSHELL[l]}). Radial nodes $= n - l - 1 = ${rn}$, so $n = ${n}$. The orbital is ${right}.` };
    },
    () => {
      const n = ri(1, 5);
      return { q: `How many orbitals are there in the $n = ${n}$ shell of hydrogen?`, answer: n * n, unit: '', exact: true,
        sol: `The number of orbitals in shell $n$ is $n^2 = ${n * n}$, all with the same energy in hydrogen.` };
    },
  ],
};
const TOPICS = [
  { value: 'all', label: 'All topics' },
  { value: 'light', label: 'Wavelength, frequency and photon energy' },
  { value: 'photo', label: 'Photoelectric effect' },
  { value: 'bohr', label: 'Bohr model and transitions' },
  { value: 'debroglie', label: 'de Broglie wavelength' },
  { value: 'hup', label: 'Uncertainty principle' },
  { value: 'orbitals', label: 'Quantum numbers and nodes' },
];

// Accepts 6.63e-34, 6.63x10^-34, 6.63 × 10⁻³⁴, 6.63*10^-34
export function parseNumber(str) {
  const sup = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  let s = String(str).trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => '^' + m.split('').map((c) => sup[c]).join(''));
  s = s.replace(/−/g, '-').replace(/,/g, '').replace(/\s+/g, '');
  const m = s.match(/^([+-]?\d*\.?\d+)(?:[x×*·]10\^?\(?([+-]?\d+)\)?)?$/i);
  if (m) return Number(m[1]) * (m[2] !== undefined ? 10 ** Number(m[2]) : 1);
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export function create() {
  const el = h('div', { class: 'quiz' });
  const state = { topic: 'all', current: null, answered: false, right: 0, total: 0 };
  const score = h('span', { class: 'quiz-score' });
  const qEl = h('p', { class: 'quiz-q' });
  const body = h('div', {});
  const fb = h('div', { class: 'quiz-feedback', role: 'status', 'aria-live': 'polite' });
  const nextBtn = button('Next question', () => next(true), 'primary small');
  const topicSel = select({ label: 'Topic', options: TOPICS, value: 'all', onChange: (v) => { state.topic = v; next(true); } });
  topicSel.style.margin = '0'; topicSel.style.minWidth = '16em';
  el.append(h('div', { class: 'quiz-top' }, topicSel, score), qEl, body, fb, h('div', { class: 'btn-row', style: { marginTop: '14px' } }, nextBtn));

  function setScore() { score.textContent = state.total ? `${state.right} of ${state.total} correct this session` : 'Answer to start a score'; }

  function next(userAsked = true) {
    const keys = state.topic === 'all' ? Object.keys(GENERATORS) : [state.topic];
    const gen = pick(GENERATORS[pick(keys)]);
    state.current = gen(); state.answered = false;
    qEl.innerHTML = state.current.q;
    fb.className = 'quiz-feedback'; fb.innerHTML = '';
    body.replaceChildren();
    if (state.current.choices) {
      const list = h('div', { class: 'choices' });
      state.current.choices.forEach((c, i) => {
        const b = h('button', { type: 'button', class: 'choice' }, c);
        b.addEventListener('click', () => { if (state.answered) return; finish(i === state.current.correct); b.classList.add(i === state.current.correct ? 'right' : 'wrong'); if (i !== state.current.correct) list.children[state.current.correct].classList.add('right'); });
        list.append(b);
      });
      body.append(list);
    } else {
      const input = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Your answer', placeholder: state.current.exact ? 'a whole number' : 'e.g. 4.61e14', autocomplete: 'off' });
      const check = button('Check', () => submit(input.value), 'small');
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(input.value); });
      body.append(h('div', { class: 'quiz-input' }, input, state.current.unit ? h('span', { class: 'unit' }, state.current.unit) : null, check));
      if (userAsked) setTimeout(() => input.focus({ preventScroll: true }), 0);
    }
    typeset(el);
  }
  function submit(value) {
    if (state.answered) return;
    const x = parseNumber(value);
    if (!Number.isFinite(x)) { fb.className = 'quiz-feedback show wrong'; fb.innerHTML = '<p>Enter a number. Scientific notation works as 6.63e-34 or 6.63x10^-34.</p>'; return; }
    const a = state.current.answer;
    const ok = state.current.exact ? x === a : Math.abs(x - a) <= 0.015 * Math.abs(a);
    finish(ok, x);
  }
  function finish(ok, x) {
    state.answered = true; state.total++; if (ok) state.right++;
    setScore();
    const a = state.current.answer;
    fb.className = `quiz-feedback show ${ok ? 'right' : 'wrong'}`;
    let head = ok ? 'Correct.' : 'Not quite.';
    if (!ok && x !== undefined && Number.isFinite(x) && a) {
      const ratio = x / a;
      const lg = Math.log10(Math.abs(ratio));
      if (Math.abs(lg - Math.round(lg)) < 0.01 && Math.round(lg) !== 0) head += ` Your answer is off by a factor of 10${String(Math.round(lg)).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}; check unit conversions like nm to m.`;
      else if (ratio < 0) head += ' Check the sign.';
    }
    fb.innerHTML = `<p><strong>${head}</strong>${a !== undefined && !state.current.choices ? ` The answer is ${state.current.exact ? a : P.sci(a, 3)} ${state.current.unit}.` : ''}</p><p>${state.current.sol}</p>`;
    typeset(fb);
  }
  setScore(); next(false);
  return { el, title: 'Practice problems' };
}
