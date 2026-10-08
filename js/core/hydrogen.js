// Hydrogen atom wavefunctions, Psi = R(r) * Y(theta, phi).
// Distances are in units of the Bohr radius a0 unless a name says otherwise.
// Radial factors and real angular factors match the table in the module notes,
// with the 2s sign chosen so R(0) > 0 (the sign of a whole wavefunction is arbitrary).

export const A0_PM = 52.9;

const SQPI = Math.sqrt(Math.PI);
const S_NORM = 1 / (2 * SQPI);                 // 0.2821
const P_NORM = Math.sqrt(3) / (2 * SQPI);      // 0.4886
const D1_NORM = Math.sqrt(15) / (2 * SQPI);    // xy, yz, xz
const D2_NORM = Math.sqrt(15) / (4 * SQPI);    // x2 - y2
const DZ_NORM = Math.sqrt(5) / (4 * SQPI);     // z2

export function radial(n, l, r) {
  switch (`${n}${l}`) {
    case '10': return 2 * Math.exp(-r);
    case '20': return (1 / (2 * Math.SQRT2)) * (2 - r) * Math.exp(-r / 2);
    case '21': return (1 / (2 * Math.sqrt(6))) * r * Math.exp(-r / 2);
    case '30': return (2 / (81 * Math.sqrt(3))) * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3);
    case '31': return (4 / (81 * Math.sqrt(6))) * r * (6 - r) * Math.exp(-r / 3);
    case '32': return (4 / (81 * Math.sqrt(30))) * r * r * Math.exp(-r / 3);
    default: return radialGeneral(n, l, r);
  }
}

// General hydrogen radial function for any n and l < n, using associated Laguerre polynomials.
// Sign is chosen so R > 0 close to the nucleus, matching the table above.
const fact = (k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
function laguerre(k, a, x) {
  // generalized Laguerre L_k^a(x) by recurrence
  if (k === 0) return 1;
  let L0 = 1, L1 = 1 + a - x;
  for (let i = 1; i < k; i++) { const L2 = ((2 * i + 1 + a - x) * L1 - (i + a) * L0) / (i + 1); L0 = L1; L1 = L2; }
  return L1;
}
export function radialGeneral(n, l, r) {
  if (l < 0 || l >= n) throw new Error(`l must be between 0 and n-1 (n=${n}, l=${l})`);
  const rho = (2 * r) / n;
  const norm = Math.sqrt(((2 / n) ** 3 * fact(n - l - 1)) / (2 * n * fact(n + l)));
  return norm * Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho);
}

// Real angular factors written with Cartesian ratios, as in the notes.
// Each function takes x, y, z and r (r > 0).
const ANGULAR = {
  s: () => S_NORM,
  px: (x, y, z, r) => P_NORM * x / r,
  py: (x, y, z, r) => P_NORM * y / r,
  pz: (x, y, z, r) => P_NORM * z / r,
  dxy: (x, y, z, r) => D1_NORM * x * y / (r * r),
  dyz: (x, y, z, r) => D1_NORM * y * z / (r * r),
  dxz: (x, y, z, r) => D1_NORM * x * z / (r * r),
  dx2y2: (x, y, z, r) => D2_NORM * (x * x - y * y) / (r * r),
  dz2: (x, y, z, r) => DZ_NORM * (3 * z * z - r * r) / (r * r),
};

// Largest |Y| for each angular type, used for rejection sampling.
const ANGULAR_MAX = { s: S_NORM, px: P_NORM, py: P_NORM, pz: P_NORM, dxy: D1_NORM / 2, dyz: D1_NORM / 2, dxz: D1_NORM / 2, dx2y2: D2_NORM, dz2: 2 * DZ_NORM };

// The 14 orbitals the lab offers. `ml` notes which m_l values a real orbital is built from.
export const ORBITALS = [
  { id: '1s', n: 1, l: 0, ang: 's', tex: '1s', ml: '0' },
  { id: '2s', n: 2, l: 0, ang: 's', tex: '2s', ml: '0' },
  { id: '2px', n: 2, l: 1, ang: 'px', tex: '2p_x', ml: '+1 and −1 combined' },
  { id: '2py', n: 2, l: 1, ang: 'py', tex: '2p_y', ml: '+1 and −1 combined' },
  { id: '2pz', n: 2, l: 1, ang: 'pz', tex: '2p_z', ml: '0' },
  { id: '3s', n: 3, l: 0, ang: 's', tex: '3s', ml: '0' },
  { id: '3px', n: 3, l: 1, ang: 'px', tex: '3p_x', ml: '+1 and −1 combined' },
  { id: '3py', n: 3, l: 1, ang: 'py', tex: '3p_y', ml: '+1 and −1 combined' },
  { id: '3pz', n: 3, l: 1, ang: 'pz', tex: '3p_z', ml: '0' },
  { id: '3dxy', n: 3, l: 2, ang: 'dxy', tex: '3d_{xy}', ml: '+2 and −2 combined' },
  { id: '3dyz', n: 3, l: 2, ang: 'dyz', tex: '3d_{yz}', ml: '+1 and −1 combined' },
  { id: '3dxz', n: 3, l: 2, ang: 'dxz', tex: '3d_{xz}', ml: '+1 and −1 combined' },
  { id: '3dx2y2', n: 3, l: 2, ang: 'dx2y2', tex: '3d_{x^2-y^2}', ml: '+2 and −2 combined' },
  { id: '3dz2', n: 3, l: 2, ang: 'dz2', tex: '3d_{z^2}', ml: '0' },
];
export const getOrbital = (id) => ORBITALS.find((o) => o.id === id);

export const SUBSHELL = ['s', 'p', 'd', 'f', 'g', 'h'];
export const radialNodes = (n, l) => n - l - 1;
export const angularNodes = (l) => l;

// Psi at a Cartesian point (units of a0).
export function psi(orb, x, y, z) {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r < 1e-9) return orb.l === 0 ? radial(orb.n, 0, 0) * S_NORM : 0;
  return radial(orb.n, orb.l, r) * ANGULAR[orb.ang](x, y, z, r);
}

export const rdf = (n, l, r) => { const R = radial(n, l, r); return r * r * R * R; };

// Half-width (in a0) of a box that holds at least 99.5% of the probability.
export const extentFor = (n) => ({ 1: 6, 2: 15, 3: 26 }[n]);

// Positions where R(r) = 0, found by scanning for sign changes then bisecting.
export function radialNodePositions(n, l, rMax = 3 * n * n + 12) {
  const roots = [];
  const f = (r) => radial(n, l, r);
  const step = 0.01;
  let prev = f(step);
  for (let r = 2 * step; r < rMax; r += step) {
    const cur = f(r);
    if (prev === 0 || prev * cur < 0) {
      let a = r - step, b = r;
      for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; }
      roots.push((a + b) / 2);
    }
    prev = cur;
  }
  return roots;
}

// Peaks of the radial distribution function r^2 R^2. The largest is the most probable radius.
export function rdfPeaks(n, l, rMax = 3 * n * n + 12) {
  const step = 0.002 * n;
  const peaks = [];
  let a = rdf(n, l, 0), b = rdf(n, l, step);
  for (let r = 2 * step; r < rMax; r += step) {
    const c = rdf(n, l, r);
    if (b > a && b >= c) peaks.push({ r: r - step, value: b });
    a = b; b = c;
  }
  return peaks;
}
export function mostProbableRadius(n, l) {
  const peaks = rdfPeaks(n, l);
  return peaks.reduce((best, p) => (p.value > best.value ? p : best)).r;
}

// Builds a cubic grid of Psi values covering [-L, L]^3.
export function psiGrid(orb, size, L) {
  const field = new Float32Array(size * size * size);
  const half = size / 2;
  let i = 0;
  for (let k = 0; k < size; k++) {
    const z = ((k - half) / half) * L;
    for (let j = 0; j < size; j++) {
      const y = ((j - half) / half) * L;
      for (let m = 0; m < size; m++) {
        const x = ((m - half) / half) * L;
        field[i++] = psi(orb, x, y, z);
      }
    }
  }
  return field;
}

// |Psi| value whose surface encloses the given fraction of the probability.
// Works on a grid: sort voxels by density and add them up until the fraction is reached.
export function enclosingThreshold(field, fraction) {
  const dens = new Float32Array(field.length);
  let total = 0;
  for (let i = 0; i < field.length; i++) { const d = field[i] * field[i]; dens[i] = d; total += d; }
  dens.sort();
  let acc = 0;
  const target = fraction * total;
  for (let i = dens.length - 1; i >= 0; i--) {
    acc += dens[i];
    if (acc >= target) return Math.sqrt(dens[i]);
  }
  return 0;
}

// Small seeded random generator so point clouds look the same on every load.
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Samples points distributed as |Psi|^2. Because Psi = R*Y, the radius and the direction
// can be sampled separately: r from r^2 R^2 by inverse CDF, direction by rejection on Y^2.
// Returns Float32Array positions (a0) and Int8Array phase signs.
export function samplePoints(orb, count, seed = 7) {
  const rand = mulberry32(seed);
  const rMax = extentFor(orb.n) * 1.6;
  const N = 4000;
  const cdf = new Float64Array(N + 1);
  const dr = rMax / N;
  for (let i = 1; i <= N; i++) cdf[i] = cdf[i - 1] + rdf(orb.n, orb.l, (i - 0.5) * dr) * dr;
  const total = cdf[N];
  const pos = new Float32Array(count * 3);
  const sign = new Int8Array(count);
  const Y = ANGULAR[orb.ang];
  const ymax2 = ANGULAR_MAX[orb.ang] ** 2;
  for (let p = 0; p < count; p++) {
    // radius
    const u = rand() * total;
    let lo = 0, hi = N;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid; else hi = mid; }
    const r = (lo + (u - cdf[lo]) / (cdf[hi] - cdf[lo] || 1)) * dr;
    // direction
    let x, y, z, yv;
    for (;;) {
      z = 2 * rand() - 1;
      const phi = 2 * Math.PI * rand();
      const s = Math.sqrt(1 - z * z);
      x = s * Math.cos(phi); y = s * Math.sin(phi);
      yv = Y(x, y, z, 1);
      if (rand() * ymax2 <= yv * yv) break;
    }
    pos[p * 3] = x * r; pos[p * 3 + 1] = y * r; pos[p * 3 + 2] = z * r;
    const R = radial(orb.n, orb.l, r);
    sign[p] = R * yv >= 0 ? 1 : -1;
  }
  return { pos, sign };
}
