// Checks the physics against known results and the worked values in the module notes.
// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../js/core/physics.js';
import * as H from '../js/core/hydrogen.js';

const close = (a, b, rel = 0.005, msg) => assert.ok(Math.abs(a - b) <= rel * Math.abs(b), `${msg ?? ''} expected ${b}, got ${a}`);

test('radial factors are normalised', () => {
  for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2]]) {
    let s = 0; const dr = 0.001;
    for (let r = dr / 2; r < 80; r += dr) s += H.rdf(n, l, r) * dr;
    close(s, 1, 0.001, `n=${n} l=${l}`);
  }
});

test('angular factors are normalised over the sphere', () => {
  const rand = H.mulberry32(3);
  for (const o of H.ORBITALS.filter((o) => o.n === 3 || o.id === '1s')) {
    let s = 0; const N = 200000;
    for (let i = 0; i < N; i++) {
      const z = 2 * rand() - 1, phi = 2 * Math.PI * rand(), q = Math.sqrt(1 - z * z);
      const v = H.psi(o, q * Math.cos(phi) * 2, q * Math.sin(phi) * 2, z * 2) / H.radial(o.n, o.l, 2);
      s += v * v;
    }
    close((s / N) * 4 * Math.PI, 1, 0.02, o.id);
  }
});

test('radial node counts and positions', () => {
  assert.equal(H.radialNodePositions(1, 0).length, 0);
  assert.equal(H.radialNodePositions(2, 1).length, 0);
  close(H.radialNodePositions(2, 0)[0], 2, 0.001);
  const n3s = H.radialNodePositions(3, 0);
  assert.equal(n3s.length, 2);
  close(n3s[0], 1.902, 0.002); close(n3s[1], 7.098, 0.002);
  close(H.radialNodePositions(3, 1)[0], 6, 0.001);
  for (const o of H.ORBITALS) assert.equal(H.radialNodePositions(o.n, o.l).length, H.radialNodes(o.n, o.l), o.id);
});

test('most probable radii', () => {
  close(H.mostProbableRadius(1, 0), 1, 0.003);              // 52.9 pm, the Bohr radius
  close(H.mostProbableRadius(2, 1), 4, 0.003);
  close(H.mostProbableRadius(3, 2), 9, 0.003);
  close(H.mostProbableRadius(2, 0), 3 + Math.sqrt(5), 0.003);
  assert.equal(H.rdfPeaks(3, 0).length, 3);                 // number of maxima = n - l
  assert.equal(H.rdfPeaks(3, 1).length, 2);
});

test('90% boundary surface for 1s sits near 2.66 a0', () => {
  const o = H.getOrbital('1s');
  const L = 6, size = 96;
  const t = H.enclosingThreshold(H.psiGrid(o, size, L), 0.9);
  close(t, H.psi(o, 2.661, 0, 0), 0.06);
});

test('sampled 1s cloud has mean radius 1.5 a0', () => {
  const { pos } = H.samplePoints(H.getOrbital('1s'), 40000);
  let s = 0;
  for (let i = 0; i < 40000; i++) s += Math.hypot(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]);
  close(s / 40000, 1.5, 0.02);
});

test('sampled 2pz cloud keeps phase sign of z', () => {
  const { pos, sign } = H.samplePoints(H.getOrbital('2pz'), 5000);
  for (let i = 0; i < 5000; i++) assert.equal(sign[i], pos[3 * i + 2] >= 0 ? 1 : -1);
});

test('hydrogen Balmer lines', () => {
  close(P.transition(3, 2).lambda / P.NM, 656.3, 0.001);
  close(P.transition(4, 2).lambda / P.NM, 486.1, 0.001);
  close(P.transition(5, 2).lambda / P.NM, 434.0, 0.001);
  close(P.transition(6, 2).lambda / P.NM, 410.1, 0.001);
  assert.equal(P.transition(5, 2).type, 'emission');
  assert.equal(P.transition(1, 3).type, 'absorption');
  assert.equal(P.transition(2, 1).series, 'Lyman');
});

test('photoelectric example: calcium at 400 nm', () => {
  const ca = P.METALS.find((m) => m.id === 'Ca');
  const r = P.photoelectric(400e-9, ca.w * P.EV);
  close(r.speed, 2.84e5, 0.005);
  assert.ok(!P.photoelectric(700e-9, ca.w * P.EV).ejected);
});

test('de Broglie example values', () => {
  close(P.deBroglie(P.C.me, 10), 7.27e-5, 0.003);
  close(P.deBroglie(2000, 10), 3.31e-38, 0.003);
  close(P.electronWavelength(200e3) / P.PM, 2.508, 0.003);   // 200 kV TEM
});

test('photon energy and frequency', () => {
  close(P.wavelengthFromFrequency(5.45e14) / P.NM, 550.1, 0.001);
  close(P.photonEnergy(0.122), 1.628e-24, 0.002);
  assert.equal(P.regionOf(550e-9), 'Visible');
  assert.equal(P.regionOf(0.122), 'Radio waves');
});

test('Wien peak', () => {
  close(P.wienPeak(5000) / P.NM, 579.6, 0.001);
});

test('scientific formatting', () => {
  assert.equal(P.sci(6.626e-34), '6.626 × 10⁻³⁴');
  assert.equal(P.sci(2.998e8, 4), '2.998 × 10⁸');
});

test('general radial function matches the table and stays normalised', () => {
  for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2]]) {
    for (const r of [0.3, 1.7, 4.2, 9]) close(H.radialGeneral(n, l, r), H.radial(n, l, r), 1e-9, `n=${n} l=${l} r=${r}`);
  }
  for (const [n, l] of [[4, 0], [4, 3], [5, 2], [6, 1]]) {
    let s = 0; const dr = 0.002;
    for (let r = dr / 2; r < 200; r += dr) s += H.rdf(n, l, r) * dr;
    close(s, 1, 0.001, `n=${n} l=${l}`);
    assert.equal(H.radialNodePositions(n, l).length, n - l - 1, `nodes n=${n} l=${l}`);
    assert.equal(H.rdfPeaks(n, l).length, n - l, `peaks n=${n} l=${l}`);
  }
  close(H.mostProbableRadius(4, 3), 16, 0.003);
});

test('quiz number parsing accepts common notations', async () => {
  const { parseNumber } = await import('../js/widgets/quiz.js');
  assert.equal(parseNumber('6.63e-34'), 6.63e-34);
  close(parseNumber('6.63x10^-34'), 6.63e-34, 1e-12);
  close(parseNumber('6.63 × 10⁻³⁴'), 6.63e-34, 1e-12);
  close(parseNumber('6.63*10^(-34)'), 6.63e-34, 1e-12);
  close(parseNumber('−2.18e-18'), -2.18e-18, 1e-12);
  assert.equal(parseNumber('486.1'), 486.1);
  assert.ok(Number.isNaN(parseNumber('abc')));
});

test('every practice problem generator gives a usable answer', async () => {
  const { GENERATORS } = await import('../js/widgets/quiz.js');
  for (const [topic, gens] of Object.entries(GENERATORS)) {
    gens.forEach((g, i) => {
      for (let k = 0; k < 200; k++) {
        const q = g();
        assert.ok(q.q && q.sol, `${topic}[${i}] missing text`);
        if (q.choices) assert.ok(q.correct >= 0 && q.correct < q.choices.length, `${topic}[${i}] bad choice index`);
        else assert.ok(Number.isFinite(q.answer), `${topic}[${i}] answer ${q.answer}`);
      }
    });
  }
});
