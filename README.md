# CHEM 120/121 Module 2: Quantum Theory and the Hydrogen Atom

An interactive study site for Module 2 of CHEM 120/121 at the University of Waterloo. It covers all ten lessons, from quantization through spin, with a 3D orbital lab, experiment simulations, a practice problem generator and links to real uses in medicine and technology.

Every figure is computed live in the browser from the equations and constants in the module notes. Nothing is a pre-rendered image.

## What's in it

- **Lessons 2.1 to 2.10**, each built in short parts. Every lesson opens with a prediction to commit to and comes back to it at the end. Key phrases light up as you scroll and the main ideas collect into a Notes drawer. Each part is followed by something to do: a guided simulation with auto-checked "Try this" tasks, a step-by-step worked example followed by a similar problem with hints, a draw-your-guess graph, a sorting or matching task, or a quick check with an explanation for every option. Common misconceptions are named and corrected. Dotted words show a definition when tapped.
- **Review**: recall cards from every lesson on a spaced schedule (Leitner boxes), plus mixed practice problems with worked solutions.
- **Orbital lab**: all 14 hydrogen orbitals from 1s to 3d as boundary surfaces, point clouds, slice planes and node surfaces, linked to plots of R, R² and r²R², with challenges.
- **Experiments**: all 16 guided simulations in one place.
- **Applications**: MRI and NMR, cryo-electron microscopy, photodynamic therapy, pulse oximetry, GFP fluorescence and photosynthesis, each with a small calculator.
- **Reference sheet**: all formulas and constants.

## Running it

It is a static site with no build step. Serve the folder with any web server:

```
python3 -m http.server 8080
```

then open http://localhost:8080. (Opening `index.html` straight from disk will not work, because browsers block ES modules on `file://` URLs.)

All libraries are stored in `vendor/`, so the site works offline and does not depend on outside CDNs.

## Tests

The physics and wavefunction code is checked against known results and the worked values in the module notes:

```
npm test
```

Tests cover normalization of every radial and angular factor, node counts and positions, most probable radii, the 90% boundary surface of 1s, the Balmer line wavelengths, photoelectric and de Broglie examples, the general radial function for n up to 6, and every practice problem generator.

## How it is built

| Path | What it does |
| --- | --- |
| `js/core/physics.js` | Constants and formulas (photon energy, Bohr levels, photoelectric effect, de Broglie, uncertainty) |
| `js/core/hydrogen.js` | Hydrogen wavefunctions, node finding, radial distribution peaks, isosurface thresholds, |Ψ|² sampling |
| `js/widgets/orbital-engine.js` | Three.js orbital renderer: marching-cubes surfaces split by phase, point clouds, slice planes, nodes |
| `js/widgets/*.js` | One file per simulation; each reports its state so tasks can tick off |
| `js/learn/*.js` | Learning components: predictions, key ideas and notes, worked examples, draw-your-guess, sort and match, flashcards and the spaced review deck |
| `js/content/*.js` | Simulation guides and tasks, recall cards, glossary, applications |
| `js/lessons/l2-*.js` | Lesson text and the figures each lesson uses |
| `js/content/applications.js` | Application write-ups shared by lessons and the Applications page |
| `js/app.js` | Routing, page layout, progress tracking, and moving each figure's controls into the side panel |

Libraries: [Three.js](https://threejs.org) r170 (MIT), [KaTeX](https://katex.org) 0.16 (MIT), IBM Plex Sans and Fraunces (SIL Open Font License).

## Notes on content

- Explanations are written for this site. Equations, constants and lesson order follow the CHEM 120/121 module notes; the notes' text and figures are not reproduced.
- Accent colours come from hydrogen's emission lines: H-alpha red (656 nm) and H-beta cyan (486 nm) double as the + and − phase colours of a wavefunction.
- This is a study companion, not an official University of Waterloo resource.
