# How the content is stored

Every chapter lives in its own file, `data/M2C6.js` (Module 2, chapter 6). Adding a chapter means adding one file, listing it in `data/course.js`, and running the build.

```
node build/build.js                         # validate everything, write assets/js/studydata.js and the module and quiz pages
node build/build.js --check --only M2C6     # validate one chapter
node tests/fuzz.js 300 --lec M2C6           # run every generator in M2C6 at 3 difficulties x 300 seeds
node tests/checker.test.js                  # the answer checker's own tests
python3 tests/walk.py M2C6                  # click through every step of the chapter in a headless browser
python3 tests/site.py                       # every page, laptop and phone, light and dark
```

## Stable IDs

IDs never change once published, because saved progress (first-try scores, Leitner boxes, mistake log, ratings) is keyed on them.

| Thing | Pattern | Example |
|---|---|---|
| Chapter | `M` + module + `C` + chapter | `M2C6` |
| Formula, constant or rule | `M2C6.f.<slug>` | `M2C6.f.radial-nodes` |
| Generator (problem type) | `M2C6.g.<slug>` | `M2C6.g.count-nodes` |
| Exam question | `M2C6.q<k>` | `M2C6.q3` |
| Glossary term | `M2C6.t.<slug>` | `M2C6.t.nodal-plane` |
| 3D model or figure | `M2C6.m.<figure key>` (made from the figure key) | `M2C6.m.lab` |
| Practice-test question | set + number | `PT2A.7` |
| Course-notes example parallel | `CN` + example number | `CN2-8` |

Never reuse or renumber an ID. To retire something, delete it (old progress for it is ignored).

## A chapter file

```js
C120.chapter({
  id:"M2C6", module:"m2", n:6, num:"2.6", date:"2026-10-07", added:"2026-10-26",  // date = the class; added = the day it went on the site
  quiz:"PC3",                        // the PC or test that first covers it (must match data/course.js)
  title:"Orbital shapes, phase and nodes", pages:"22-24", sections:["2.8"],
  summary:"One or two plain sentences.",
  flags:[{ref:"p. 21", text:"The notes write ... It should be ..."}],   // real errors in the course notes
  formulas:[ {id, name, tex, note?, ref:"p. 22", kind?:"formula"|"constant"|"rule", blank?:{tex, accept:[...]}} ],
  glossary:[ {id, term, def, ref} ],
  figures:{ key:{title, cap, ref, model:{type, params}, predict:{q, opts, check}} | {title, cap, ref, build(host, ctx){...}} },
  gens:[ {id, title, skill, ref, gen(R, d){ return problem; }} ],
  exam:[ {id, ref, q, opts:[[text, isCorrect, why], ...], multi?} ],
  steps:[ ... the chapter, in order ... ]
});
```

### Text, math and chemistry
All text fields accept HTML and `$...$` / `$$...$$` LaTeX (KaTeX). Chemistry goes inside math with mhchem: `$\\ce{SO4^2-}$`, `$\\ce{Ag+(aq) + Cl-(aq) -> AgCl(s)}$`. Inside JS strings, write backslashes twice. A literal dollar sign is `\\$`.

Refs are always course-notes pages written `"p. 14"` or `"pp. 14-15"`. The site shows them as "Module 2, p. 14". Data-sheet values use `ref:"data sheet"`. Anything not in the notes (VSEPR angles, outside data) says so in the text: "(standard value, not from the notes)".

### Formulas, constants and rules
`tex` is LaTeX without dollars. `kind:"constant"` for constants (give units in the tex), `kind:"rule"` for rules like the solubility rules or Hund's rule (tex can be `\\text{...}`). `blank` powers fill in the blank: `blank.tex` is the formula with one piece replaced by `\\boxed{\\,?\\,}` and `accept` lists every reasonable way to type the missing piece (compared ignoring case and spaces).

### Figures and 3D models
A 3D figure is `{title, cap, ref, model:{type, params}, predict:{q, opts:[[text, correct, why]], check}}`. Every 3D model must have a `predict` question: the model stays covered until it is answered. `check` is one sentence telling the reader what to turn or toggle to check their prediction.

| type | params | what it shows |
|---|---|---|
| `orbital` | `orbital:"3dz2"`, `mode:"surface"|"cloud"|"slice"`, `picker:"list"|"qn"|"none"`, `choices:[ids]`, `nodes:true`, `radial:"rdf"|"R"|"R2"|false`, `maxN:4` | hydrogen orbitals from the real wavefunctions; + and − lobes labelled and hatched; nodes; linked radial plot |
| `molecule` | `molecule:"H2O"`, `choices:[keys]`, `geo:"electron"|"molecular"`, `fc`, `partial`, `dipoles`, `lp`, `measure`, `mode:"builder"`, `polarity:false`, `fcToggle:false`, `geoToggle:false` | molecules from `assets/js/3d/molecules.mjs` (VSEPR, formal charges, resonance forms, dipoles, angle measuring, build your own) |
| `lattice` | `pair:"NaCl"`, `pairs:["LiF","NaCl","ZnO"]` | rock-salt lattice, nearest-neighbour distance, Coulomb estimate of lattice energy vs the notes' values |
| `bohr` | `n:3`, `mode:"free"|"emit"|"absorb"` | Bohr atom: drag the electron between levels; the photon's energy, wavelength and colour; energy ladder; line spectrum builds up |
| `emwave` | `lambda:550` (nm) | electric and magnetic fields of a light wave; wavelength slider across the spectrum; frequency and photon energy |
| `ringwave` | `n:3` | de Broglie standing wave on a circular orbit: only whole numbers of wavelengths fit |
| `sterngerlach` | | a beam of H atoms splitting into two in a magnetic field (spin) |
| `aufbau` | `element:"Fe"`, `ion:0`, `maxZ:36` | energy-level diagram next to 3D orbitals that fill as electrons are added (Aufbau, Pauli, Hund), Cr and Cu exceptions, ions |
| `shells` | `compare:["2s","2p"]` | radial probability of 1s (core) against 2s or 2p: penetration and shielding |
| `trends` | `property:"radius"|"ie"|"ea"|"en"`, `choices:[...]` | the periodic table as a 3D bar landscape; click an element for its value and source |
| `particles` | `scenario:"balance"|"limiting"|"precip"|"atomecon"`, `reaction:key` | Module 1 particle views: balancing, limiting reagent, precipitation, atom economy |

`particles` reactions (keys): balancing and limiting reagent use `h2-o2` (2H2 + O2 → 2H2O), `n2-h2` (N2 + 3H2 → 2NH3), `propane` (C3H8 + 5O2 → 3CO2 + 4H2O), `acetylene` (2C2H2 + 5O2 → 4CO2 + 2H2O), `k-br2` (2K + Br2 → 2KBr), `li-n2` (6Li + N2 → 2Li3N), `ch4-o2` (CH4 + 2O2 → CO2 + 2H2O). Extra params: `a`, `b` (starting particle counts for limiting), `unbalanced:true` (balancing starts with all coefficients 1). Precipitation uses `reaction:"AgNO3+NaCl"`, `"BaCl2+Na2SO4"`, `"Pb(NO3)2+KI"`, `"CaCl2+Na2CO3"`, `"NaCl+KNO3"` (no precipitate). Atom economy uses `ethene-water` (C2H4 + H2O → C2H5OH), `methane-chlorine` (CH4 + Cl2 → CH3Cl + HCl), `ethanol-dehydration` (C2H5OH → C2H4 + H2O), `haber` (N2 + 3H2 → 2NH3).

`aufbau` params: `element:"Fe"` (start), `charge:0`, `maxZ:36`, `mode:"build"|"show"` (build = add electrons one at a time and get told when Pauli or Hund is broken). `trends` params: `property:"radius"|"ie"|"en"|"ea"`, `choices:[...]`, `highlight:["Na","Cl"]`. `shells` params: `compare:["2s","2p"]` or `["3s","3p","3d"]`. `bohr` params: `n:3`, `mode:"free"|"emit"|"absorb"`, `maxN:6`. `emwave` params: `lambda:550` (nm). `ringwave` params: `n:3`. `lattice` params: `pair:"NaCl"`, `pairs:["LiF","NaCl","ZnO"]`.

A 2D figure is `{title, cap, ref, build(host, {PLOT, M}){...}}` using `PLOT.graph`, `PLOT.slider`, `PLOT.seg` (see `assets/js/plot.js`). Use 2D figures for graphs and simulations that are not spatial (photoelectric effect, blackbody curve, mole map).

### Steps (the chapter)
| type | fields | what it shows |
|---|---|---|
| `read` | title, body, fig?, ref | key idea in plain words |
| `example` | title, ex:{q, steps:[{t, why}], ans, ref}, fig? | worked example revealed one step at a time |
| `explore` | title, fig, body | a 3D model or simulation with instructions (its predict question comes first) |
| `mcq` | title, q, opts, multi?, after? | concept check, counts toward the first-try score |
| `firstline` | title, q, lines:[...], wrong:index, why | find the first line with a mistake |
| `try` | title, gen, diff? | a generated problem, counts toward the first-try score |
| `formulas` | title | the chapter's formula cards |

### Generators
`gen(R, d)` gets a seeded random source `R` (`R.int(a,b)`, `R.pick(arr)`, `R.shuffle(arr)`, `R.real(a,b,dp)`, `R.sig(a,b,sf)`) and difficulty `d` (1 easy, 2 medium, 3 hard). The same seed always gives the same problem, so the mistake log can recreate it. It returns:

```js
{
  prompt:"What is the energy of one photon of 486 nm light?",
  answer:{type:"num", value:4.087e-19, unit:"J", sf:3},     // or parts:[{label, answer}, ...]
  hint:"...",
  steps:["$E = \\frac{hc}{\\lambda}$", "..."],               // the worked solution, one string per line
  answerTeX:"$4.09\\times10^{-19}\\ \\mathrm{J}$",
  verify:{value:4.087e-19}                                     // optional independent check run by tests/fuzz.js
}
```

Answer types (`assets/js/chemcheck.js`):

| type | fields | accepts |
|---|---|---|
| `num` | `value`, `unit?`, `sf?`, `rel?` (default 0.01), `abs?`, `unitOptional?` | `6.02e23`, `6.02 x 10^23`, `6.02×10²³`; any unit with the same dimensions (kJ/J, nm/m, M/mol/L). Right value with wrong sig figs is "close". |
| `int` | `value` | an exact whole number |
| `formula` | `answer:"SO4^2-"` (or a list), `exact?`, `states?` | formulas, ions with charges (`Fe^3+`, `Fe3+`, `SO4 2-`), hydrates |
| `equation` | `answer`, `states?` | balanced or net ionic equations, any order of species |
| `config` | `answer`, `form:"short"|"full"|"any"` | `1s2 2s2 2p6`, `[Ar] 4s2 3d10`, any subshell order |
| `qset` | `answer:[n,l,ml,ms]` or `test:(q)=>true or "why not"`, `needMs?` | `(3, 2, -1, +1/2)` |
| `orbital` | `answer` (or list) | `3d_xy`, `3dxy`, `2pz` |
| `list` | `answer:[2,1,1,2]` | comma-separated whole numbers in order (balancing coefficients) |
| `text` | `accept:[...]` | words, case and hyphens ignored |
| `mc` | `options`, `correct`, `why?` | one choice |
| `multi` | `options`, `correct:[...]` | select all that apply |
| `firstline` | `lines`, `wrong`, `why` | click the first line with a mistake |

Constants come from the data sheet (Module 2 notes agree): $h = 6.626\times10^{-34}$ J s, $c = 2.998\times10^{8}$ m s⁻¹, $N_A = 6.022\times10^{23}$ mol⁻¹, $R_H = 2.179\times10^{-18}$ J, $m_e = 9.109\times10^{-31}$ kg, molar masses from the data sheet. Never format stored numbers like `1e-19` in prompts; use `M.numTeX(v, sf)` and `M.qty(v, sf, unit)`.

`verify` lets the fuzz test check the answer without trusting the generator: `{value:n}` recomputes the number another way.

### Practice tests and course-notes examples
`data/review/*.js` call `C120.addReview([...])` with `{id, set, src, lec, kind:"mc", q, opts:[[text, correct, why]], multi?, steps?}` (practice tests written for this site in the real test format).
`data/examples/*.js` call `C120.addExamples([...])` with `{id, src, lec, page, q, sol:[...], ans}`: a parallel version of each numbered course-notes example (new numbers, same skill) with a full solution, citing the example number and page.

Real quiz, assignment and test questions are never copied onto the site. They decide what the generators and exam questions emphasise.

## Writing rules
Plain and direct, grade 12 reading level. No em dashes. No filler or hype words (genuinely, straightforward, seamless, robust, delve, leverage, unlock, navigate, landscape, game-changing). Titles are declarative and scientific. Explain from first principles with a plain analogy before the technical detail. Rewrite the notes in your own words: never copy course-notes sentences, figures or example text. Follow the notes for every formula, constant and definition, and cite the page. Flag real errors in the notes with `flags`.
