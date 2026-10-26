# CHEM 120 Interactive

An interactive study site for CHEM 120 at the University of Waterloo, Fall 2026.

Manaal Lakhani, Honours Sciences @ UWaterloo, built with help from Claude.

## What's here

- **Modules** (`module-1.html` to `module-4.html`): one page per course-notes module. Chapters follow the classes and are grouped by the Participation Challenge or test that first covers them. Each chapter has the key ideas, a worked example you step through, 3D models you predict and then turn, and generated practice problems. Each module also has Explore 3D, Practice, Mini exam and Glossary tabs.
- **3D models**: hydrogen orbitals computed from the real wavefunctions (surface, point cloud, slice, nodes, phase, linked radial plot), molecules from VSEPR (lone pairs, electron vs molecular geometry, formal charges, resonance, dipoles, angle measuring, build your own), the Bohr atom, light waves, de Broglie waves, Stern-Gerlach, a rock-salt lattice, shielding shells, the Aufbau filler, a periodic trend landscape, and particle views for Module 1. Each one loads only when it scrolls into view and has a 2D fallback without WebGL.
- **Formula sheet** (`formulas.html`): every formula, constant and rule with its module and page. Reference, Leitner flashcards, fill in the blank, readiness per module, and a periodic table with configurations and the notes' electronegativity and electron affinity values.
- **Practice gym** (`gym.html`): endless problems from any chapters, easy to hard, with accuracy by topic.
- **Quiz prep** (`quiz.html`, `quiz-pc1.html` ...): practice in each Participation Challenge's or test's format, with a timer.
- **Test 2 prep** (`midterm.html`): practice tests in the real format, two fixed sample tests, a worked parallel of every course-notes example, a mistake log and a study plan with a countdown.
- **Ev**: the electron in the corner. Drag it between energy levels to see the photon, or tap it to search the course material.

Progress is saved in your browser only.

## How it's built

Plain HTML, CSS and JavaScript with no framework. Math and chemistry are rendered with KaTeX and mhchem; 3D uses Three.js r170. All libraries load from cdnjs or jsDelivr with pinned versions. Each chapter is one file in `data/` (for example `data/M2C6.js`). `build/build.js` validates every data file and writes `assets/js/studydata.js` plus the module and quiz pages. See [docs/DATA.md](docs/DATA.md) for the format and [docs/UPDATING.md](docs/UPDATING.md) for adding a chapter.

```
node build/build.js                 # validate and build
node tests/checker.test.js          # the chemistry answer checker
node tests/fuzz.js 300              # every generator at 3 difficulties x 300 seeds, every answer checked
python3 -m http.server 8123 &       # the browser tests need a local server
python3 tests/walk.py               # every chapter step, laptop and phone, light and dark, 3D renders and frees memory
python3 tests/models.py             # every 3D model with WebGL and with its 2D fallback
python3 tests/interact.py           # answers typed into the real pages, exams, flashcards, mistake log, Ev
python3 tests/site.py               # every page and tab
```

## Sources

Formulas, constants, rules and page numbers follow the Fall 2026 CHEM 120/121 course notes (Modules 1 to 4) and the CHEM 120/121 data sheet. Explanations, figures, examples and problems are written for this site; the course notes' text and figures are not reproduced. Values the notes don't print (VSEPR bond angles, atomic radii, first ionization energies) are standard reference values and are labelled that way. Real assignment and test questions are not reproduced; `tests/dupes.js` checks that nothing on the site comes out identical to them.

This is an independent study aid, not an official University of Waterloo resource.
