// Physical constants and the formulas used across Module 2.
// Values match the CHEM 120/121 module notes so that answers line up with course work.

export const C = {
  h: 6.626e-34,        // Planck's constant, J s
  c: 2.998e8,          // speed of light, m/s
  me: 9.109e-31,       // electron mass, kg
  mp: 1.6726e-27,      // proton mass, kg
  e: 1.602e-19,        // elementary charge, C
  RH: 2.179e-18,       // Rydberg constant (energy form), J
  a0: 52.9e-12,        // Bohr radius, m
  NA: 6.022e23,        // Avogadro's number, 1/mol
  kB: 1.3806e-23,      // Boltzmann's constant, J/K
  eps0: 8.854e-12,     // permittivity of vacuum, C^2 J^-1 m^-1
  wien: 2.898e-3,      // Wien displacement constant, m K
};

export const NM = 1e-9;
export const PM = 1e-12;
export const EV = C.e; // 1 eV in joules

// ---------- Light ----------

export const frequencyFromWavelength = (lambda) => C.c / lambda;
export const wavelengthFromFrequency = (nu) => C.c / nu;
export const photonEnergy = (lambda) => (C.h * C.c) / lambda;           // J per photon
export const molarPhotonEnergy = (lambda) => photonEnergy(lambda) * C.NA; // J per mol

// Region boundaries follow the module's spectrum chart (wavelength in metres).
const REGIONS = [
  { name: 'Gamma rays', max: 1e-11 },
  { name: 'X-rays', max: 1e-8 },
  { name: 'Ultraviolet', max: 400e-9 },
  { name: 'Visible', max: 750e-9 },
  { name: 'Infrared', max: 1e-3 },
  { name: 'Microwaves', max: 1e-1 },
  { name: 'Radio waves', max: Infinity },
];
export function regionOf(lambda) {
  return REGIONS.find((r) => lambda < r.max).name;
}

// Visible colour names for 400 to 750 nm.
export function colourName(nm) {
  if (nm < 400 || nm > 750) return null;
  if (nm < 450) return 'violet';
  if (nm < 495) return 'blue';
  if (nm < 520) return 'cyan';
  if (nm < 565) return 'green';
  if (nm < 590) return 'yellow';
  if (nm < 625) return 'orange';
  return 'red';
}

// Approximate perceived colour of a single wavelength (nm). Returns [r,g,b] 0..255.
// Based on the widely used piecewise approximation by Dan Bruton.
export function wavelengthToRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  let f = 0;
  if (nm >= 380 && nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
  else if (nm >= 420 && nm <= 700) f = 1;
  else if (nm > 700 && nm <= 780) f = 0.3 + (0.7 * (780 - nm)) / 80;
  const gamma = 0.8;
  const ch = (v) => (v === 0 ? 0 : Math.round(255 * Math.pow(v * f, gamma)));
  return [ch(r), ch(g), ch(b)];
}
export const rgbCss = ([r, g, b], a = 1) => `rgba(${r},${g},${b},${a})`;

// ---------- Blackbody ----------

// Planck's law in the form given in the module notes (energy density per wavelength).
export function planck(lambda, T) {
  const x = (C.h * C.c) / (lambda * C.kB * T);
  if (x > 700) return 0;
  return ((8 * Math.PI * C.h * C.c) / Math.pow(lambda, 5)) / Math.expm1(x);
}
// Classical Rayleigh-Jeans prediction for the same quantity.
export const rayleighJeans = (lambda, T) => (8 * Math.PI * C.kB * T) / Math.pow(lambda, 4);
export const wienPeak = (T) => C.wien / T;

// ---------- Photoelectric effect ----------

// Work functions in eV. Typical literature values; real surfaces vary by a few tenths of an eV.
// Calcium is set to the value used in the module notes (4.60e-19 J).
export const METALS = [
  { id: 'Cs', name: 'Caesium', w: 2.14 },
  { id: 'K', name: 'Potassium', w: 2.30 },
  { id: 'Na', name: 'Sodium', w: 2.36 },
  { id: 'Ca', name: 'Calcium', w: 4.60e-19 / EV },
  { id: 'Mg', name: 'Magnesium', w: 3.66 },
  { id: 'Zn', name: 'Zinc', w: 4.33 },
  { id: 'Cu', name: 'Copper', w: 4.65 },
  { id: 'Pt', name: 'Platinum', w: 5.65 },
];

export function photoelectric(lambda, workFunctionJ) {
  const E = photonEnergy(lambda);
  const ke = E - workFunctionJ;
  const ejected = ke >= 0;
  return {
    photonEnergy: E,
    ke: ejected ? ke : 0,
    ejected,
    speed: ejected ? Math.sqrt((2 * ke) / C.me) : 0,
    stoppingVoltage: ejected ? ke / C.e : 0,
    thresholdFrequency: workFunctionJ / C.h,
    thresholdWavelength: (C.h * C.c) / workFunctionJ,
  };
}

// ---------- Bohr model and hydrogen energy levels ----------

export const levelEnergy = (n) => -C.RH / (n * n);

const SERIES = ['Lyman', 'Balmer', 'Paschen', 'Brackett', 'Pfund', 'Humphreys'];
export const seriesName = (nLower) => SERIES[nLower - 1] || `n = ${nLower} series`;

// Transition from ni to nf. dE > 0 means a photon is absorbed, dE < 0 means one is emitted.
export function transition(ni, nf) {
  const dE = -C.RH * (1 / (nf * nf) - 1 / (ni * ni));
  const lambda = dE === 0 ? Infinity : (C.h * C.c) / Math.abs(dE);
  return {
    dE,
    type: dE > 0 ? 'absorption' : dE < 0 ? 'emission' : 'none',
    lambda,
    frequency: Math.abs(dE) / C.h,
    series: seriesName(Math.min(ni, nf)),
    region: dE === 0 ? null : regionOf(lambda),
  };
}

// Bohr orbit radius (r = n^2 a0) and speed from mvr = nh/2pi.
export const bohrRadius = (n) => n * n * C.a0;
export const bohrSpeed = (n) => (n * C.h) / (2 * Math.PI * C.me * bohrRadius(n));

// ---------- de Broglie ----------

export const deBroglie = (m, v) => C.h / (m * v);

// Electron wavelength after acceleration through V volts.
// Relativistic form matters above roughly 10 kV (electron microscopes run at 100 to 300 kV).
export function electronWavelength(V, relativistic = true) {
  const eV = C.e * V;
  if (!relativistic) return C.h / Math.sqrt(2 * C.me * eV);
  const mc2 = C.me * C.c * C.c;
  return C.h / Math.sqrt(2 * C.me * eV * (1 + eV / (2 * mc2)));
}

// ---------- Heisenberg ----------

export const minMomentumSpread = (dx) => C.h / (4 * Math.PI * dx);
export const minSpeedSpread = (dx, m) => minMomentumSpread(dx) / m;

// ---------- Formatting ----------

const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

// 6.626e-34 -> "6.626 × 10⁻³⁴"
export function sci(x, digits = 4) {
  if (x === 0) return '0';
  if (!isFinite(x)) return '∞';
  const exp = Math.floor(Math.log10(Math.abs(x)));
  if (exp >= -2 && exp <= 3) return Number(x.toPrecision(digits)).toString();
  let mant = x / Math.pow(10, exp);
  let e = exp;
  let m = Number(mant.toPrecision(digits));
  if (Math.abs(m) >= 10) { m = m / 10; e += 1; }
  const es = String(e).split('').map((ch) => SUP[ch]).join('');
  return `${m.toFixed(Math.max(0, digits - 1)).replace(/\.?0+$/, '')} × 10${es}`;
}

// Picks a sensible SI prefix for lengths given in metres.
export function formatLength(m, digits = 4) {
  const a = Math.abs(m);
  const units = [
    [1e3, 'km'], [1, 'm'], [1e-2, 'cm'], [1e-3, 'mm'], [1e-6, 'µm'], [1e-9, 'nm'], [1e-12, 'pm'], [1e-15, 'fm'],
  ];
  for (const [f, u] of units) {
    if (a >= f) return `${Number((m / f).toPrecision(digits))} ${u}`;
  }
  return `${sci(m, digits)} m`;
}
