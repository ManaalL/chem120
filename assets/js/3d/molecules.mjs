/* CHEM 120 Interactive: the molecules used in Module 4 (and a few for Module 1), as data.
   Two forms:
   - single centre: {center, ligands:[[el, bondOrder, formalCharge?, lonePairs?]], lp, fc?}  geometry from the VSEPR table (Module 4, p. 18)
   - graph: {atoms:[[el, x, y, {fc, lp, h}]], bonds:[[i, j, order]]}  2D drawing coordinates; hydrogens added where h is given; the 3D shape is relaxed from VSEPR angles
   `notes` = where the molecule appears in the course notes. `outside:true` = an extra example not in the notes (used only to show a shape the notes draw without an example). */
export const MOLS = {
  /* ---- VSEPR set: every row of the p. 18 table ---- */
  CO2: { name: "Carbon dioxide", formula: "CO2", center: "C", ligands: [["O", 2, 0, 2], ["O", 2, 0, 2]], lp: 0, notes: "Module 4, p. 2 and p. 20" },
  BF3: { name: "Boron trifluoride", formula: "BF3", center: "B", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 0, notes: "Module 4, p. 5 (incomplete octet)" },
  SO2: { name: "Sulfur dioxide", formula: "SO2", center: "S", ligands: [["O", 2, 0, 2], ["O", 1, -1, 3]], lp: 1, fc: 1, notes: "Module 4, p. 14 (Example 4-8)", resonance: "SO2" },
  O3: { name: "Ozone", formula: "O3", center: "O", ligands: [["O", 2, 0, 2], ["O", 1, -1, 3]], lp: 1, fc: 1, notes: "Module 4, p. 13 (Example 4-6)", resonance: "O3" },
  NO2m: { name: "Nitrite ion", formula: "NO2^-", center: "N", ligands: [["O", 2, 0, 2], ["O", 1, -1, 3]], lp: 1, charge: -1, notes: "Module 4, p. 12", resonance: "NO2m" },
  CH4: { name: "Methane", formula: "CH4", center: "C", ligands: [["H", 1], ["H", 1], ["H", 1], ["H", 1]], lp: 0, notes: "Module 4, p. 19 to 20" },
  CCl4: { name: "Carbon tetrachloride", formula: "CCl4", center: "C", ligands: [["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 0, notes: "Module 4, p. 2 and p. 20" },
  NH3: { name: "Ammonia", formula: "NH3", center: "N", ligands: [["H", 1], ["H", 1], ["H", 1]], lp: 1, notes: "Module 4, p. 1" },
  ClO3m: { name: "Chlorate ion", formula: "ClO3^-", center: "Cl", ligands: [["O", 2, 0, 2], ["O", 2, 0, 2], ["O", 1, -1, 3]], lp: 1, charge: -1, notes: "Module 4, p. 10 to 11", resonance: "ClO3m" },
  H2O: { name: "Water", formula: "H2O", center: "O", ligands: [["H", 1], ["H", 1]], lp: 2, notes: "Module 4, p. 19" },
  PCl5: { name: "Phosphorus pentachloride", formula: "PCl5", center: "P", ligands: [["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 0, outside: true },
  SF4: { name: "Sulfur tetrafluoride", formula: "SF4", center: "S", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 1, outside: true },
  ClF3: { name: "Chlorine trifluoride", formula: "ClF3", center: "Cl", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 2, notes: "Module 4, p. 20 (Example 4-9)" },
  BrF3: { name: "Bromine trifluoride", formula: "BrF3", center: "Br", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 2, notes: "Module 4, p. 5" },
  XeF2: { name: "Xenon difluoride", formula: "XeF2", center: "Xe", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 3, outside: true },
  SF6: { name: "Sulfur hexafluoride", formula: "SF6", center: "S", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 0, outside: true },
  BrF5: { name: "Bromine pentafluoride", formula: "BrF5", center: "Br", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 1, notes: "Module 4, p. 20 (Example 4-9)" },
  XeF4: { name: "Xenon tetrafluoride", formula: "XeF4", center: "Xe", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 2, notes: "Module 4, p. 5" },
  ICl4m: { name: "Tetrachloroiodate ion", formula: "ICl4^-", center: "I", ligands: [["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 2, fc: -1, charge: -1, notes: "Module 4, p. 5" },
  AX3E3: { name: "AX3E3 (no common example)", formula: "AX3E3", center: "A", ligands: [["X", 1], ["X", 1], ["X", 1]], lp: 3, generic: true, notes: "Module 4, p. 18 (last row)" },
  /* ---- more single-centre molecules from the notes ---- */
  H2CO: { name: "Formaldehyde", formula: "H2CO", center: "C", ligands: [["O", 2, 0, 2], ["H", 1], ["H", 1]], lp: 0, notes: "Module 4, p. 3" },
  SO3: { name: "Sulfur trioxide", formula: "SO3", center: "S", ligands: [["O", 2, 0, 2], ["O", 1, -1, 3], ["O", 1, -1, 3]], lp: 0, fc: 2, notes: "Module 4, p. 20 (Example 4-9)" },
  NO3m: { name: "Nitrate ion", formula: "NO3^-", center: "N", ligands: [["O", 2, 0, 2], ["O", 1, -1, 3], ["O", 1, -1, 3]], lp: 0, fc: 1, charge: -1, notes: "Module 4, p. 4", resonance: "NO3m" },
  SOCl2: { name: "Thionyl chloride", formula: "SOCl2", center: "S", ligands: [["O", 1, -1, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 1, fc: 1, notes: "Module 4, p. 4" },
  POCl3: { name: "Phosphoryl chloride", formula: "POCl3", center: "P", ligands: [["O", 1, -1, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 0, fc: 1, notes: "Module 4, p. 20 (Example 4-9)" },
  HCl: { name: "Hydrogen chloride", formula: "HCl", center: "Cl", ligands: [["H", 1]], lp: 3, notes: "Module 4, p. 19" },
  Cl2: { name: "Chlorine", formula: "Cl2", center: "Cl", ligands: [["Cl", 1, 0, 3]], lp: 3, notes: "Module 4, p. 19" },
  H2: { name: "Hydrogen", formula: "H2", center: "H", ligands: [["H", 1]], lp: 0, notes: "Module 4, p. 1" },
  /* ---- multi-centre (graph) ---- */
  HCN: { name: "Hydrogen cyanide", formula: "HCN", atoms: [["H", -1, 0], ["C", 0, 0], ["N", 1, 0, { lp: 1 }]], bonds: [[0, 1, 1], [1, 2, 3]], notes: "Module 4, p. 4" },
  HOCN: { name: "Cyanic acid", formula: "HOCN", atoms: [["H", -1.6, -0.6], ["O", -0.8, 0, { lp: 2 }], ["C", 0.3, 0], ["N", 1.4, 0, { lp: 1 }]], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 3]], notes: "Module 4, p. 13 (Example 4-7)" },
  OCNm: { name: "Cyanate ion", formula: "OCN^-", atoms: [["O", -1, 0, { fc: -1, lp: 3 }], ["C", 0, 0], ["N", 1, 0, { lp: 1 }]], bonds: [[0, 1, 1], [1, 2, 3]], charge: -1, notes: "Module 4, p. 4 and p. 13" },
  N3m: { name: "Azide ion", formula: "N3^-", atoms: [["N", -1, 0, { fc: -1, lp: 2 }], ["N", 0, 0, { fc: 1 }], ["N", 1, 0, { fc: -1, lp: 2 }]], bonds: [[0, 1, 2], [1, 2, 2]], charge: -1, notes: "Module 4, p. 14 (Example 4-8)", resonance: "N3m" },
  CH3CN: { name: "Acetonitrile", formula: "CH3CN", atoms: [["C", -1, 0, { h: 3 }], ["C", 0, 0], ["N", 1, 0, { lp: 1 }]], bonds: [[0, 1, 1], [1, 2, 3]], notes: "Module 4, p. 20 (Example 4-9)" },
  CH3COOm: { name: "Acetate ion", formula: "CH3COO^-", atoms: [["C", -0.9, -0.5, { h: 3 }], ["C", 0, 0], ["O", 0, 1, { lp: 2 }], ["O", 0.9, -0.5, { fc: -1, lp: 3 }]], bonds: [[0, 1, 1], [1, 2, 2], [1, 3, 1]], charge: -1, notes: "Module 4, p. 20 (Example 4-9)", resonance: "CH3COOm" },
  HNO3: { name: "Nitric acid", formula: "HNO3", atoms: [["N", 0, 0, { fc: 1 }], ["O", 0, 1, { lp: 2 }], ["O", 0.87, -0.5, { fc: -1, lp: 3 }], ["O", -0.87, -0.5, { lp: 2 }], ["H", -1.8, -0.2]], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [3, 4, 1]], notes: "Module 4, p. 14 (Example 4-8)" },
  H2SO4: { name: "Sulfuric acid", formula: "H2SO4", atoms: [["S", 0, 0, { fc: 2 }], ["O", 0, 1, { fc: -1, lp: 3 }], ["O", 0, -1, { fc: -1, lp: 3 }], ["O", 1, 0, { lp: 2 }], ["O", -1, 0, { lp: 2 }], ["H", 1.8, 0.4], ["H", -1.8, -0.4]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [3, 5, 1], [4, 6, 1]], notes: "Module 4, p. 4" },
  allyl: { name: "Allyl cation", formula: "CH2CHCH2^+", atoms: [["C", -1, -0.5, { h: 2 }], ["C", 0, 0, { h: 1 }], ["C", 1, -0.5, { h: 2, fc: 1 }]], bonds: [[0, 1, 2], [1, 2, 1]], charge: 1, notes: "Module 4, p. 14 (Example 4-8)", resonance: "allyl" },
  CH3CH2NO2: { name: "Nitroethane", formula: "CH3CH2NO2", atoms: [["C", -1.7, 0, { h: 3 }], ["C", -0.85, 0.5, { h: 2 }], ["N", 0, 0, { fc: 1 }], ["O", 0, -1, { fc: -1, lp: 3 }], ["O", 0.85, 0.5, { lp: 2 }]], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [2, 4, 2]], notes: "Module 4, p. 4" },
  /* ---- line structures (Module 4, p. 21 to 22): 2D zigzag drawing coordinates ---- */
  butane: { name: "Butane", formula: "C4H10", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5, { h: 2 }], ["C", 1.73, 0, { h: 2 }], ["C", 2.6, 0.5, { h: 3 }]], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1]], notes: "Module 4, p. 22 (Example 4-12)" },
  isobutanol: { name: "Isobutanol (2-methylpropan-1-ol)", formula: "C4H10O", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5, { h: 1 }], ["C", 0.87, 1.5, { h: 3 }], ["C", 1.73, 0, { h: 2 }], ["O", 2.6, 0.5, { h: 1, lp: 2 }]], bonds: [[0, 1, 1], [1, 2, 1], [1, 3, 1], [3, 4, 1]], notes: "Module 4, p. 22 (Example 4-11)" },
  methoxyethane: { name: "Methoxyethane", formula: "C3H8O", atoms: [["C", 0, 0, { h: 3 }], ["O", 0.87, 0.5, { lp: 2 }], ["C", 1.73, 0, { h: 2 }], ["C", 2.6, 0.5, { h: 3 }]], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1]], notes: "Module 4, p. 22 (Example 4-12)" },
  butanone: { name: "Butanone", formula: "C4H8O", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5], ["O", 0.87, 1.5, { lp: 2 }], ["C", 1.73, 0, { h: 2 }], ["C", 2.6, 0.5, { h: 3 }]], bonds: [[0, 1, 1], [1, 2, 2], [1, 3, 1], [3, 4, 1]], notes: "Module 4, p. 22 (Example 4-12)" },
  but3enamide: { name: "But-3-enamide", formula: "C4H7NO", atoms: [["C", 0, 0, { h: 2 }], ["C", 0.87, 0.5, { h: 1 }], ["C", 1.73, 0, { h: 2 }], ["C", 2.6, 0.5], ["O", 2.6, 1.5, { lp: 2 }], ["N", 3.46, 0, { h: 2, lp: 1 }]], bonds: [[0, 1, 2], [1, 2, 1], [2, 3, 1], [3, 4, 2], [3, 5, 1]], notes: "Module 4, p. 22 (Example 4-11)" },
  methylcyclopentene: { name: "1-Methylcyclopentene", formula: "C6H10", atoms: [["C", 0, 0], ["C", 0.31, 0.95, { h: 1 }], ["C", 1.31, 0.95, { h: 2 }], ["C", 1.62, 0, { h: 2 }], ["C", 0.81, -0.59, { h: 2 }], ["C", -0.95, -0.31, { h: 3 }]], bonds: [[0, 1, 2], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 0, 1], [0, 5, 1]], notes: "Module 4, p. 22 (Example 4-11)" },
  aniline: { name: "Aniline", formula: "C6H7N", atoms: [["C", 0, 0], ["C", 0.87, 0.5, { h: 1 }], ["C", 1.73, 0, { h: 1 }], ["C", 1.73, -1, { h: 1 }], ["C", 0.87, -1.5, { h: 1 }], ["C", 0, -1, { h: 1 }], ["N", -0.87, 0.5, { h: 2, lp: 1 }]], bonds: [[0, 1, 2], [1, 2, 1], [2, 3, 2], [3, 4, 1], [4, 5, 2], [5, 0, 1], [0, 6, 1]], notes: "Module 4, p. 22 (Example 4-12)" },
  butenethiol: { name: "(E)-But-2-ene-1-thiol", formula: "C4H8S", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5, { h: 1 }], ["C", 1.73, 0, { h: 1 }], ["C", 2.6, 0.5, { h: 2 }], ["S", 3.46, 0, { h: 1, lp: 2 }]], bonds: [[0, 1, 1], [1, 2, 2], [2, 3, 1], [3, 4, 1]], notes: "Module 4, p. 21 (Example 4-10)" },
  nitropropane: { name: "2-Nitropropane", formula: "C3H7NO2", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5, { h: 1 }], ["C", 1.73, 0, { h: 3 }], ["N", 0.87, 1.5, { fc: 1 }], ["O", 0, 2, { fc: -1, lp: 3 }], ["O", 1.73, 2, { lp: 2 }]], bonds: [[0, 1, 1], [1, 2, 1], [1, 3, 1], [3, 4, 1], [3, 5, 2]], notes: "Module 4, p. 3" },
  ethanol: { name: "Ethanol", formula: "C2H6O", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5, { h: 2 }], ["O", 1.73, 0, { h: 1, lp: 2 }]], bonds: [[0, 1, 1], [1, 2, 1]] },
  /* ---- Module 1 small molecules (reaction boxes) ---- */
  O2: { name: "Oxygen", formula: "O2", center: "O", ligands: [["O", 2, 0, 2]], lp: 2 },
  N2: { name: "Nitrogen", formula: "N2", center: "N", ligands: [["N", 3, 0, 1]], lp: 1 },
  C2H2: { name: "Acetylene", formula: "C2H2", atoms: [["C", 0, 0, { h: 1 }], ["C", 1, 0, { h: 1 }]], bonds: [[0, 1, 3]] },
  C3H8: { name: "Propane", formula: "C3H8", atoms: [["C", 0, 0, { h: 3 }], ["C", 0.87, 0.5, { h: 2 }], ["C", 1.73, 0, { h: 3 }]], bonds: [[0, 1, 1], [1, 2, 1]] },
  CO: { name: "Carbon monoxide", formula: "CO", center: "C", ligands: [["O", 3, 1, 1]], lp: 1, fc: -1 },
  /* ---- added for Module 4 chapters 4.2 to 4.6 (single-centre forms so resonance forms switch cleanly) ---- */
  OCNr: { name: "Cyanate ion", formula: "OCN^-", center: "C", ligands: [["O", 1, -1, 3], ["N", 3, 0, 1]], lp: 0, charge: -1, notes: "Module 4, p. 4 and p. 13 (Example 4-7)", resonance: "OCNr" },
  SCNm: { name: "Thiocyanate ion", formula: "SCN^-", center: "C", ligands: [["S", 2, 0, 2], ["N", 2, -1, 2]], lp: 0, charge: -1, outside: true, resonance: "SCNm" },
  N2O: { name: "Dinitrogen monoxide", formula: "N2O", center: "N", ligands: [["N", 3, 0, 1], ["O", 1, -1, 3]], lp: 0, fc: 1, outside: true, resonance: "N2O" },
  N3mR: { name: "Azide ion", formula: "N3^-", center: "N", ligands: [["N", 2, -1, 2], ["N", 2, -1, 2]], lp: 0, fc: 1, charge: -1, notes: "Module 4, p. 14 (Example 4-8)", resonance: "N3mR" },
  CO3m: { name: "Carbonate ion", formula: "CO3^2-", center: "C", ligands: [["O", 2, 0, 2], ["O", 1, -1, 3], ["O", 1, -1, 3]], lp: 0, charge: -2, outside: true, resonance: "CO3m" },
  HCOOm: { name: "Formate ion", formula: "HCOO^-", center: "C", ligands: [["H", 1], ["O", 2, 0, 2], ["O", 1, -1, 3]], lp: 0, charge: -1, outside: true, resonance: "HCOOm" },
  SOCl2x: { name: "Thionyl chloride (S=O form)", formula: "SOCl2", center: "S", ligands: [["O", 2, 0, 2], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 1, notes: "Module 4, p. 8 (Example 4-2)" },
  SO2Cl2: { name: "Sulfuryl chloride", formula: "SO2Cl2", center: "S", ligands: [["O", 2, 0, 2], ["O", 2, 0, 2], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 0, outside: true },
  PCl3: { name: "Phosphorus trichloride", formula: "PCl3", center: "P", ligands: [["Cl", 1, 0, 3], ["Cl", 1, 0, 3], ["Cl", 1, 0, 3]], lp: 1, outside: true },
  CH3Cl: { name: "Chloromethane", formula: "CH3Cl", center: "C", ligands: [["Cl", 1, 0, 3], ["H", 1], ["H", 1], ["H", 1]], lp: 0, outside: true },
  CH2Cl2: { name: "Dichloromethane", formula: "CH2Cl2", center: "C", ligands: [["Cl", 1, 0, 3], ["H", 1], ["H", 1], ["Cl", 1, 0, 3]], lp: 0, outside: true },
  CS2: { name: "Carbon disulfide", formula: "CS2", center: "C", ligands: [["S", 2, 0, 2], ["S", 2, 0, 2]], lp: 0, outside: true },
  OCS: { name: "Carbonyl sulfide", formula: "OCS", center: "C", ligands: [["O", 2, 0, 2], ["S", 2, 0, 2]], lp: 0, outside: true },
  OF2: { name: "Oxygen difluoride", formula: "OF2", center: "O", ligands: [["F", 1, 0, 3], ["F", 1, 0, 3]], lp: 2, outside: true }
};

/* resonance forms: for each form, bond orders (same bond order as `bonds` in the built molecule) and formal charges by atom index.
   Single-centre molecules list ligands in order; atom 0 is the centre. Module 4, p. 10 to 14. */
export const RESONANCE = {
  NO3m: { forms: [{ ord: [2, 1, 1], fc: [1, 0, -1, -1] }, { ord: [1, 2, 1], fc: [1, -1, 0, -1] }, { ord: [1, 1, 2], fc: [1, -1, -1, 0] }], equal: true, note: "Three equivalent forms. Each N–O bond is $1\\tfrac{1}{3}$ in the hybrid and each O carries $-\\tfrac{1}{3}$." },
  ClO3m: { forms: [{ ord: [2, 2, 1], fc: [0, 0, 0, -1] }, { ord: [2, 1, 2], fc: [0, 0, -1, 0] }, { ord: [1, 2, 2], fc: [0, -1, 0, 0] }], equal: true, note: "All three Cl–O bonds are measured at 149 pm (Module 4, p. 10), so the real ion is the average of the three forms." },
  O3: { forms: [{ ord: [2, 1], fc: [1, 0, -1] }, { ord: [1, 2], fc: [1, -1, 0] }], equal: true, note: "Two equivalent forms, so both O–O bonds are equal: between O–O (145 pm) and O=O (121 pm) from the p. 16 table." },
  SO2: { forms: [{ ord: [2, 1], fc: [1, 0, -1] }, { ord: [1, 2], fc: [1, -1, 0] }], equal: true, note: "Two equivalent forms with the octet rule kept on S." },
  NO2m: { forms: [{ ord: [2, 1], fc: [0, 0, -1] }, { ord: [1, 2], fc: [0, -1, 0] }], equal: true, note: "Two equivalent forms; each N–O bond is $1\\tfrac{1}{2}$." },
  N3m: { forms: [{ ord: [2, 2], fc: [-1, 1, -1] }, { ord: [1, 3], fc: [-2, 1, 0] }, { ord: [3, 1], fc: [0, 1, -2] }], equal: false, major: [0], note: "The form with two double bonds keeps the formal charges smallest, so it is the major contributor." },
  CH3COOm: { forms: [{ ord: [1, 2, 1], fc: [0, 0, 0, -1] }, { ord: [1, 1, 2], fc: [0, 0, -1, 0] }], equal: true, note: "The two C–O bonds become equal; each O carries $-\\tfrac{1}{2}$." },
  allyl: { forms: [{ ord: [2, 1], fc: [0, 0, 1] }, { ord: [1, 2], fc: [1, 0, 0] }], equal: true, note: "The + charge is shared by the two end carbons." },
  /* added for Module 4, chapter 4.3 (atom 0 is the centre; then the ligands in order) */
  OCNr: { forms: [{ ord: [1, 3], fc: [0, -1, 0] }, { ord: [2, 2], fc: [0, 0, -1] }, { ord: [3, 1], fc: [0, 1, -2] }], equal: false, major: [0], note: "Not equivalent. Form 1 puts the −1 on O, the more electronegative atom (Module 4, p. 4), so it is the major contributor. Form 3 has a −2 and a +1, so it matters least." },
  SCNm: { forms: [{ ord: [2, 2], fc: [0, 0, -1] }, { ord: [1, 3], fc: [0, -1, 0] }, { ord: [3, 1], fc: [0, 1, -2] }], equal: false, major: [0], note: "Not equivalent. N (3.0) is more electronegative than S (2.5) (Module 3, p. 15), so by the formal-charge rules the form with −1 on N is the major contributor." },
  N2O: { forms: [{ ord: [3, 1], fc: [1, 0, -1] }, { ord: [2, 2], fc: [1, -1, 0] }, { ord: [1, 3], fc: [1, -2, 1] }], equal: false, major: [0], note: "Not equivalent. Form 1 keeps the charges at ±1 and puts the −1 on O, the most electronegative atom, so it is the major contributor." },
  N3mR: { forms: [{ ord: [2, 2], fc: [1, -1, -1] }, { ord: [1, 3], fc: [1, -2, 0] }, { ord: [3, 1], fc: [1, 0, -2] }], equal: false, major: [0], note: "The form with two double bonds keeps every formal charge at ±1, so it is the major contributor. The other two have a −2." },
  CO3m: { forms: [{ ord: [2, 1, 1], fc: [0, 0, -1, -1] }, { ord: [1, 2, 1], fc: [0, -1, 0, -1] }, { ord: [1, 1, 2], fc: [0, -1, -1, 0] }], equal: true, note: "Three equivalent forms. Each C–O bond is $1\\tfrac{1}{3}$ in the hybrid and each O carries $-\\tfrac{2}{3}$." },
  HCOOm: { forms: [{ ord: [1, 2, 1], fc: [0, 0, 0, -1] }, { ord: [1, 1, 2], fc: [0, 0, -1, 0] }], equal: true, note: "Two equivalent forms. Both C–O bonds are $1\\tfrac{1}{2}$ and each O carries $-\\tfrac{1}{2}$." }
};
