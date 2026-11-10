/* CHEM 120 Interactive: element and bond data for the 3D models.
   Electronegativities: Pauling values printed in Module 3, p. 15 (30 values). Where the notes print no value, a standard Pauling value is used and marked src:"ref".
   Bond lengths: Module 4, p. 16 table (pm). Other bonds use standard covalent radii (marked as estimates). */
export const EN_NOTES = { H: 2.1, Li: 1.0, Be: 1.5, B: 2.0, C: 2.5, N: 3.0, O: 3.5, F: 4.0, Na: 0.9, Mg: 1.2, Al: 1.5, P: 2.1, S: 2.5, Cl: 3.0, K: 0.8, Ca: 1.0, Ga: 1.6, As: 2.0, Se: 2.4, Br: 2.8, Rb: 0.8, Sr: 1.0, Te: 2.1, I: 2.5, Cs: 0.8, Po: 2.0, At: 2.2, Fr: 0.7 };
const EN_REF = { Si: 1.8, Xe: 2.6, Kr: 3.0, Ge: 1.8, Sn: 1.8, Sb: 1.9, Ba: 0.9, Zn: 1.6 };
export const en = (el) => (EN_NOTES[el] != null ? { v: EN_NOTES[el], src: "notes" } : EN_REF[el] != null ? { v: EN_REF[el], src: "ref" } : null);

/* display colours (muted textbook palette) and display radii (A, for ball-and-stick) */
export const ELEM = {
  H: { c: "#e9e6df", r: 0.20, cov: 0.31, val: 1 }, He: { c: "#d9f2f2", r: 0.22, cov: 0.28, val: 2 },
  Li: { c: "#b98fd6", r: 0.34, cov: 1.28, val: 1 }, Be: { c: "#9fbf6a", r: 0.30, cov: 0.96, val: 2 }, B: { c: "#e0a98a", r: 0.30, cov: 0.84, val: 3 },
  C: { c: "#4a5257", r: 0.30, cov: 0.76, val: 4 }, N: { c: "#4f74c9", r: 0.29, cov: 0.71, val: 5 }, O: { c: "#cc4a3d", r: 0.29, cov: 0.66, val: 6 },
  F: { c: "#8cc56b", r: 0.27, cov: 0.57, val: 7 }, Ne: { c: "#b3e3f5", r: 0.26, cov: 0.58, val: 8 },
  Na: { c: "#8d6fc4", r: 0.38, cov: 1.66, val: 1 }, Mg: { c: "#7fa35a", r: 0.36, cov: 1.41, val: 2 }, Al: { c: "#a7a0a0", r: 0.36, cov: 1.21, val: 3 },
  Si: { c: "#c9b28b", r: 0.35, cov: 1.11, val: 4 }, P: { c: "#e08a3c", r: 0.35, cov: 1.07, val: 5 }, S: { c: "#d8b93a", r: 0.35, cov: 1.05, val: 6 },
  Cl: { c: "#3f9e5a", r: 0.34, cov: 1.02, val: 7 }, Ar: { c: "#80c8db", r: 0.33, cov: 1.06, val: 8 },
  K: { c: "#7a5bb5", r: 0.42, cov: 2.03, val: 1 }, Ca: { c: "#5f8f4a", r: 0.40, cov: 1.76, val: 2 }, Zn: { c: "#8088a8", r: 0.36, cov: 1.22, val: 2 },
  Ga: { c: "#b88d8d", r: 0.36, cov: 1.22, val: 3 }, Ge: { c: "#8f9a8f", r: 0.36, cov: 1.20, val: 4 }, As: { c: "#a678c2", r: 0.36, cov: 1.19, val: 5 },
  Se: { c: "#e0952e", r: 0.36, cov: 1.20, val: 6 }, Br: { c: "#9c3a2f", r: 0.36, cov: 1.20, val: 7 }, Kr: { c: "#6fbfd6", r: 0.36, cov: 1.16, val: 8 },
  I: { c: "#7a3d96", r: 0.39, cov: 1.39, val: 7 }, Xe: { c: "#4fa7b8", r: 0.39, cov: 1.40, val: 8 }, Te: { c: "#c08a3a", r: 0.38, cov: 1.38, val: 6 },
  A: { c: "#6b7f8a", r: 0.33, cov: 1.0, val: 8 }, X: { c: "#9aa7a0", r: 0.28, cov: 0.8, val: 7 }
};
export const elem = (s) => ELEM[s] || ELEM.A;

/* Module 4, p. 16 (pm) */
export const BOND_PM = {
  "H-H": 74, "C-H": 110, "H-N": 100, "H-O": 97, "F-H": 92, "H-S": 132, "Cl-H": 127, "Br-H": 141, "H-I": 161,
  "C-C": 154, "C=C": 134, "C#C": 120, "C-N": 147, "C=N": 128, "C#N": 116, "C-O": 143, "C=O": 120, "C-Cl": 178,
  "N-N": 145, "N=N": 123, "N#N": 110, "N-O": 136, "N=O": 120, "O-O": 145, "O=O": 121, "F-F": 143, "Cl-Cl": 199, "Br-Br": 228, "I-I": 266
};
export const BOND_KJ = {
  "H-H": 436, "C-H": 414, "H-N": 389, "H-O": 464, "F-H": 565, "H-S": 368, "Cl-H": 431, "Br-H": 364, "H-I": 297,
  "C-C": 347, "C=C": 611, "C#C": 837, "C-N": 305, "C=N": 615, "C#N": 891, "C-O": 360, "C=O": 736, "C-Cl": 339,
  "N-N": 163, "N=N": 418, "N#N": 946, "N-O": 222, "N=O": 590, "O-O": 142, "O=O": 498, "F-F": 159, "Cl-Cl": 243, "Br-Br": 193, "I-I": 151
};
export const bondKey = (a, b, order) => { const [x, y] = [a, b].sort(); return `${x}${order >= 3 ? "#" : order >= 2 ? "=" : "-"}${y}`; };
/* bond length in angstroms. fractional orders (resonance) interpolate. */
export function bondLength(a, b, order = 1) {
  const lo = Math.floor(order), hi = Math.ceil(order);
  const one = (o) => { const k = bondKey(a, b, o); if (BOND_PM[k]) return { v: BOND_PM[k] / 100, src: "notes" }; const f = o >= 3 ? 0.78 : o >= 2 ? 0.87 : 1; return { v: (elem(a).cov + elem(b).cov) * f, src: "est" }; };
  if (lo === hi) return one(lo);
  const A = one(lo), B = one(hi); const t = order - lo; return { v: A.v + (B.v - A.v) * t, src: A.src === "notes" && B.src === "notes" ? "notes" : "est" };
}

/* ideal VSEPR directions (not printed in the notes; standard geometry). index i = steric number */
const s3 = Math.sqrt(3) / 2;
export const DOMAINS = {
  1: [[0, 0, 1]],
  2: [[0, 0, 1], [0, 0, -1]],
  3: [[1, 0, 0], [-0.5, s3, 0], [-0.5, -s3, 0]],
  4: [[0, 0, 1], [0.9428, 0, -1 / 3], [-0.4714, 0.8165, -1 / 3], [-0.4714, -0.8165, -1 / 3]],
  5: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-0.5, s3, 0], [-0.5, -s3, 0]],
  6: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0]]
};
/* which domain slots the lone pairs take (Module 4, p. 18 drawings): equatorial first for 5 groups; trans pairs for 6 groups */
export const LP_SLOTS = {
  2: { 0: [], 1: [1] },
  3: { 0: [], 1: [0], 2: [0, 1] },
  4: { 0: [], 1: [0], 2: [0, 1], 3: [0, 1, 2] },
  5: { 0: [], 1: [2], 2: [2, 3], 3: [2, 3, 4] },
  6: { 0: [], 1: [1], 2: [0, 1], 3: [0, 1, 4] }
};
export const SHAPES = {
  "2-0": ["linear", "linear", [180]], "2-1": ["linear", "linear", []],
  "3-0": ["trigonal planar", "trigonal planar", [120]], "3-1": ["trigonal planar", "bent (V-shaped)", [120]], "3-2": ["trigonal planar", "linear", []],
  "4-0": ["tetrahedral", "tetrahedral", [109.5]], "4-1": ["tetrahedral", "trigonal pyramidal", [109.5]], "4-2": ["tetrahedral", "bent (V-shaped)", [109.5]], "4-3": ["tetrahedral", "linear", []],
  "5-0": ["trigonal bipyramidal", "trigonal bipyramidal", [90, 120, 180]], "5-1": ["trigonal bipyramidal", "see-saw", [90, 120, 180]], "5-2": ["trigonal bipyramidal", "T-shaped", [90, 180]], "5-3": ["trigonal bipyramidal", "linear", [180]],
  "6-0": ["octahedral", "octahedral", [90, 180]], "6-1": ["octahedral", "square pyramidal", [90, 180]], "6-2": ["octahedral", "square planar", [90, 180]], "6-3": ["octahedral", "T-shaped", [90, 180]]
};
export const shapeOf = (sn, lp) => SHAPES[`${sn}-${lp}`] || ["", "", []];
