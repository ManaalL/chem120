// Every guided simulation: what it shows, a key to its parts, and goal-based tasks.
// `when` receives the widget's reported state; a task ticks off the first time it is true.
const W = (name, fn = 'create', opts) => () => import(`../widgets/${name}.js`).then((m) => m[fn](opts));
const RED = '#ff6a55', TEAL = '#40c4e6', GOLD = '#f2c14e', WHITE = '#e6ebf0', GREY = '#94a1b0';

export const SIMS = {
  rampStairs: {
    title: 'Ramp and stairs',
    what: 'Give two balls the same energy. One can stop anywhere; the other only on a step.',
    load: W('ramp-stairs'),
    parts: [
      { label: 'White ball', color: WHITE, text: 'On a smooth ramp. Any height is allowed: this is classical physics.' },
      { label: 'Blue ball', color: TEAL, text: 'On stairs. It can only rest on a step: this is quantized energy, like an electron in an atom.' },
    ],
    tasks: [
      { do: 'Set the energy to between 50% and 59%.', when: (s) => s.mode === 'even' && s.p >= 0.5 && s.p < 0.6, then: 'The ramp ball sits at your exact energy, but the stairs ball is stuck on the 40% step. There is no step at 55%, so that energy is simply not allowed.' },
      { do: 'Raise the energy until the blue ball reaches step 3.', when: (s) => s.mode === 'even' && s.step >= 3, then: 'It jumped straight from one step to the next. Quantized energy changes in jumps, never smoothly.' },
      { do: 'Switch the steps to hydrogen spacing.', when: (s) => s.mode === 'hydrogen', then: 'In a real hydrogen atom the steps get closer together as you go up. You will see the formula behind this in lesson 2.4.' },
    ],
  },
  emWave: {
    title: 'Light as a wave',
    what: 'Change the wavelength and watch the frequency and the energy of each photon change with it.',
    load: W('em-wave'),
    parts: [
      { label: 'Electric field', color: TEAL, text: 'Moves up and down. Its colour matches the light when the wavelength is visible.' },
      { label: 'Magnetic field', color: RED, text: 'Moves side to side, at right angles to the electric field.' },
      { label: 'Spectrum bar', text: 'Every kind of light on one scale. Each mark is 100 times longer than the one before.' },
    ],
    tasks: [
      { do: 'Find red light, between 620 and 700 nm.', when: (s) => s.lambda >= 620e-9 && s.lambda <= 700e-9, then: 'Red light has the longest visible wavelength, so it has the lowest frequency and the least energy per photon of any visible colour.' },
      { do: 'Move to the X-ray region (about 1 nm or shorter).', when: (s) => s.lambda < 1e-8 && s.lambda > 1e-11, then: 'Each X-ray photon carries hundreds of times more energy than visible light. That is enough to break chemical bonds.' },
      { do: 'Find FM radio, with a wavelength of about 3 m.', when: (s) => s.lambda >= 2.5 && s.lambda <= 3.5, then: 'About 100 million waves pass each second (100 MHz). Each photon carries about a millionth of the energy of visible light.' },
    ],
  },
  blackbody: {
    title: 'Glowing objects',
    what: 'How bright a hot object is at each wavelength, according to Planck (solid) and to classical physics (dashed).',
    load: W('blackbody'),
    parts: [
      { label: 'Red curve', color: RED, text: 'Planck\'s law at your temperature. It matches experiments.' },
      { label: 'Dashed gold', color: GOLD, text: 'The classical prediction. It shoots up at short wavelengths, the "ultraviolet catastrophe".' },
      { label: 'Grey curves', color: GREY, text: '3000 K to 6000 K for comparison.' },
      { label: 'Light band', text: 'The visible range, 400 to 750 nm.' },
    ],
    tasks: [
      { do: 'Cool the object to room temperature, 350 K or less.', when: (s) => s.T <= 350, then: 'The peak is near 10 µm, deep in the infrared. You glow too, just not in colours your eyes can see. Thermal cameras see it.' },
      { do: 'Set 4000 K.', when: (s) => s.T >= 3950 && s.T <= 4050, then: 'Peak near 725 nm, at the red edge of the visible band. Hotter means the peak moves to shorter wavelengths.' },
      { do: 'Heat it to the temperature of the Sun\'s surface, about 5800 K.', when: (s) => s.T >= 5750 && s.T <= 5850, then: 'The peak sits near 500 nm, right in the middle of what we see. Notice the classical line still heads off to infinity on the left. Planck\'s curve comes back down.' },
    ],
  },
  photoelectric: {
    title: 'Photoelectric effect',
    what: 'Shine light on a metal. Electrons come out only if each photon carries enough energy.',
    load: W('photoelectric'),
    parts: [
      { label: 'Squiggles', text: 'Photons. Their colour shows the wavelength (violet for UV, pink for infrared).' },
      { label: 'White dots', color: WHITE, text: 'Electrons knocked out of the metal. Faster dots mean more kinetic energy.' },
      { label: 'Blue line', color: TEAL, text: 'Electron energy against light frequency. It is flat (zero) below the threshold, then rises in a straight line.' },
      { label: 'Red dot', color: RED, text: 'Where your current light sits on that line.' },
    ],
    tasks: [
      { do: 'With sodium, find the longest wavelength that still ejects electrons.', when: (s) => s.metal === 'Na' && s.ejected && s.lambda >= s.threshold - 4, then: 'About 525 nm, green light. Each photon there carries just 2.36 eV, sodium\'s work function. Go any longer and no single photon has enough.' },
      { do: 'Use light too long to eject electrons, and turn the brightness up past 95%.', when: (s) => !s.ejected && s.intensity >= 0.95, then: 'Still nothing. Brighter light means more photons, but each one is still too weak. One photon frees one electron; they can\'t team up.' },
      { do: 'Now use a wavelength that works and dim the light below 10%.', when: (s) => s.ejected && s.intensity <= 0.1, then: 'Electrons still come out straight away, just fewer of them. Their speed depends only on the wavelength. This is why light must come in packets.' },
      { do: 'Turn on the lines for the other metals.', when: (s) => s.others, then: 'Every line is parallel. The slope is Planck\'s constant h for every metal; only the threshold changes.' },
    ],
  },
  spectra: {
    title: 'Hydrogen\'s fingerprint',
    what: 'Pass light through a prism and see which wavelengths are there.',
    load: W('spectroscope', 'create', { mode: 'continuous' }),
    parts: [
      { label: 'Top', text: 'The experiment: a light source, a prism, and where the light goes.' },
      { label: 'Strip', text: 'What you would see on a screen, from 380 nm (violet) to 750 nm (red).' },
    ],
    tasks: [
      { do: 'Choose "Through H gas".', when: (s) => s.mode === 'absorption', then: 'Four thin dark lines. Hydrogen took in exactly those wavelengths and nothing else.' },
      { do: 'Choose "From hot H".', when: (s) => s.mode === 'emission', then: 'Bright lines at exactly the same four places. Atoms give out the same energies they take in.' },
      { do: 'Choose "White light" to compare.', when: (s) => s.mode === 'continuous', then: 'Every colour is present. Only atoms, with their quantized energy levels, pick out single lines.' },
    ],
  },
  bohr: {
    title: 'Electron jumps in hydrogen',
    what: 'Choose a starting and ending level, then run the jump. The energy diagram shows the same jump as an arrow.',
    load: W('bohr', 'create', { ni: 3, nf: 2 }),
    parts: [
      { label: 'Left', text: 'Bohr\'s picture: the electron (blue) on one of the allowed orbits. Sizes are squashed to fit.' },
      { label: 'Right', text: 'The energy ladder. Levels crowd together near E = 0 at the top.' },
      { label: 'Arrow', text: 'The jump. Its colour is the photon\'s colour if it is visible.' },
    ],
    tasks: [
      { do: 'Run the jump from n = 3 to n = 2.', when: (s) => s.last && s.last.from === 3 && s.last.to === 2, then: 'A photon at 656 nm comes out: hydrogen\'s red line. The electron lost energy, so the atom gave it away as light.' },
      { do: 'Find the jump that makes the 486 nm blue-green line, and run it.', when: (s) => s.last && s.last.from === 4 && s.last.to === 2, then: 'n = 4 to n = 2. All four visible lines end on n = 2. That group is the Balmer series.' },
      { do: 'Make the atom absorb light: run a jump upward.', when: (s) => s.last && s.last.type === 'absorption', then: 'The photon arrives first, then the electron moves up. Only a photon with exactly the right energy can do this.' },
      { do: 'Run 2 → 1 and read the wavelength.', when: (s) => s.last && s.last.from === 2 && s.last.to === 1, then: '121.6 nm, ultraviolet. Jumps down to n = 1 (the Lyman series) are too energetic for our eyes.' },
    ],
  },
  debroglie: {
    title: 'How big is a particle\'s wave?',
    what: 'Pick an object and a speed. The ruler shows its de Broglie wavelength next to things you know.',
    load: W('debroglie', 'createCalculator'),
    parts: [
      { label: 'Big number', text: 'λ = h/mv for your choice.' },
      { label: 'Ruler', text: 'Lengths from 10⁻⁴⁰ m to 1 m. The blue arrow is your wavelength.' },
    ],
    tasks: [
      { do: 'Switch to the baseball.', when: (s) => s.obj === 'ball', then: 'The arrow drops off the scale, around 10⁻³⁴ m. Nothing is that small, so a baseball never shows wave behaviour.' },
      { do: 'Choose the electron and press "Electron in an atom".', when: (s) => s.obj === 'e' && Math.abs(s.v - 2.19e6) / 2.19e6 < 0.05, then: 'About 330 pm. That is the same as the distance around a circle of radius 52.9 pm. One wavelength fits around the smallest Bohr orbit exactly.' },
      { do: 'Slow the electron down below 1100 m/s.', when: (s) => s.obj === 'e' && s.v <= 1100, then: 'Now its wavelength is around 0.7 µm, as long as red light. Slower or lighter means a longer wave.' },
    ],
  },
  diffraction: {
    title: 'Electrons through a crystal',
    what: 'Fire particles at a thin metal foil one at a time and watch where they land.',
    load: W('debroglie', 'createDiffraction'),
    parts: [
      { label: 'Left', text: 'Side view: the gun, the foil, and the screen. Faint lines show where the rings form.' },
      { label: 'Right', text: 'The screen, face on. Each dot is one particle arriving.' },
    ],
    tasks: [
      { do: 'Let at least 500 electrons hit the screen.', when: (s) => s.particle === 'e' && s.fired >= 500, then: 'Each electron lands at one spot, like a particle. Together they build rings, which only waves make.' },
      { do: 'Raise the voltage to 500 V or more.', when: (s) => s.particle === 'e' && s.V >= 500, then: 'Faster electrons have shorter wavelengths, so they bend less and the rings shrink.' },
      { do: 'Switch to baseballs.', when: (s) => s.particle === 'ball' && s.fired >= 50, then: 'One spot in the middle. A baseball\'s wavelength is far too small to bend around atoms.' },
    ],
  },
  ringWave: {
    title: 'A wave on an orbit',
    what: 'Wrap an electron wave around a circle. Only some numbers of wavelengths join up with themselves.',
    load: W('ring-wave'),
    parts: [
      { label: 'Dashed circle', text: 'The orbit.' },
      { label: 'Blue wave', color: TEAL, text: 'A wave that fits: it joins up and keeps going.' },
      { label: 'Gold wave', color: GOLD, text: 'A wave that doesn\'t fit. The red bar shows the mismatch where its ends meet.' },
    ],
    tasks: [
      { do: 'Set exactly 3 wavelengths.', when: (s) => s.fits && s.n === 3, then: 'It closes on itself. This is the n = 3 orbit in Bohr\'s model.' },
      { do: 'Try 3.5.', when: (s) => s.k >= 3.4 && s.k <= 3.6, then: 'The ends don\'t meet. Going around again, the wave would cancel itself out, so this orbit can\'t exist.' },
      { do: 'Find the smallest number that works.', when: (s) => s.fits && s.n === 1, then: 'One wavelength: the ground state, n = 1. Whole numbers only, which is where Bohr\'s quantization comes from.' },
    ],
  },
  uncertainty: {
    title: 'Pinning a particle down',
    what: 'Make the position more certain and see what happens to the momentum.',
    load: W('uncertainty'),
    parts: [
      { label: 'Blue curve', color: TEAL, text: 'Where the particle might be. Narrow means its position is well known.' },
      { label: 'Red curve', color: RED, text: 'What its momentum might be. Narrow means its speed is well known.' },
    ],
    tasks: [
      { do: 'Set Δx to about 100 pm, the size of a hydrogen atom.', when: (s) => s.particle === 'e' && s.dx >= 95 && s.dx <= 105, then: 'The speed is uncertain by about 580 km/s. An electron held inside an atom cannot have a definite speed or path.' },
      { do: 'Squeeze Δx down to 10 pm or less.', when: (s) => s.particle === 'e' && s.dx <= 10.5, then: 'The position curve got 10 times narrower and the momentum curve got 10 times wider. You can\'t narrow both.' },
      { do: 'Switch to a proton.', when: (s) => s.particle === 'p', then: 'Same momentum spread, but the proton is 1836 times heavier, so its speed is 1836 times less uncertain. Heavier things are less affected.' },
    ],
  },
  born: {
    title: 'Where is the electron?',
    what: 'Measure the electron\'s position again and again on a thin slice through the atom.',
    load: W('born'),
    parts: [
      { label: 'Each dot', text: 'One measurement. The electron was found at that spot.' },
      { label: 'Dot colour', text: 'Red where Ψ is positive, blue where it is negative.' },
      { label: 'Cloud view', text: 'The smooth version: Ψ² itself.' },
    ],
    tasks: [
      { do: 'Measure once.', when: (s) => s.count >= 1, then: 'One dot. A single measurement tells you almost nothing about where the electron usually is.' },
      { do: 'Keep going until you have 2000 measurements.', when: (s) => s.count >= 2000, then: 'A pattern appears, densest near the middle. That pattern is Ψ².' },
      { do: 'Switch to the Cloud view.', when: (s) => s.mode === 'cloud', then: 'The cloud is the smooth version of your dots. It is a map of likelihood, not a smeared-out electron.' },
      { do: 'Choose 2s and make at least 1500 measurements.', when: (s) => s.orb === '2s' && s.count >= 1500, then: 'See the empty ring? At 106 pm from the nucleus, Ψ = 0. The electron is never found there. That is a node.' },
    ],
  },
  qnBuilder: {
    title: 'Build an orbital from its quantum numbers',
    what: 'Pick n, then l, then mₗ. Rules decide what is allowed at each step.',
    load: W('qn-builder'),
    parts: [
      { label: 'Big label', text: 'The orbital your numbers describe.' },
      { label: 'Boxes', text: 'Every orbital in the shell. One row per l, one box per mₗ.' },
    ],
    tasks: [
      { do: 'Build a 3d orbital.', when: (s) => s.n === 3 && s.l === 2, then: 'n = 3 and l = 2. Its row has five boxes, one for each mₗ from −2 to +2.' },
      { do: 'With n = 2, try choosing l = 2.', when: (s) => s.n === 2 && s.invalid === 'l', then: 'Not allowed: l can be at most n − 1. That is why there is no 2d orbital.' },
      { do: 'Choose n = 4 and count the orbitals.', when: (s) => s.n === 4, then: '16 = 4². One 4s, three 4p, five 4d, seven 4f. In hydrogen they all have the same energy.' },
    ],
  },
  orbitalViews: {
    title: 'One orbital, several pictures',
    what: 'A 3D picture of the orbital on the left, and three graphs of how Ψ changes with distance on the right.',
    load: W('orbital-figures', 'createRepresentations', { orbital: '1s' }),
    parts: [
      { label: 'Red / blue', text: 'Where Ψ is positive (red) or negative (blue). Not charge.' },
      { label: 'Surface', text: 'Encloses 90% of the probability.' },
      { label: 'Graphs', text: 'R(r), R² and r²R² against distance. Dotted lines mark radial nodes.' },
    ],
    tasks: [
      { do: 'Pick 2s and turn on "Show nodes".', when: (s) => s.orbital === '2s' && s.nodes, then: 'A ghostly sphere at 106 pm. On the graph, R(r) crosses zero at exactly that distance. Same node, two pictures.' },
      { do: 'Switch the 3D view to "Scatter plot".', when: (s) => s.view === 'cloud', then: 'Each dot is a possible position. Dense regions are where Ψ² is large.' },
      { do: 'With nodes on, find the orbital whose angular nodes are cones, not planes.', when: (s) => s.orbital === '3dz2' && s.nodes, then: '3d_z². Its two angular nodes are cones, which is why it has a ring around the middle.' },
      { do: 'Pick 2pz and look at R(r) at r = 0.', when: (s) => s.orbital === '2pz', then: 'It starts at zero. Every p, d and f orbital has zero density at the nucleus. Only s orbitals reach it.' },
    ],
  },
  radialTool: {
    title: 'Radial graphs for any orbital',
    what: 'Choose n and l to see R, R² and the radial distribution function.',
    load: W('orbital-figures', 'createRadialTool', { n: 2, l: 0 }),
    parts: [
      { label: 'R(r)', text: 'Crosses zero at each radial node.' },
      { label: 'R²', text: 'Density along one line out from the nucleus.' },
      { label: 'r²R²', text: 'Chance of being at distance r in any direction. The red line is the most probable radius.' },
    ],
    tasks: [
      { do: 'Show 4s and count where R(r) crosses zero.', when: (s) => s.n === 4 && s.l === 0, then: 'Three crossings: n − l − 1 = 4 − 0 − 1 = 3 radial nodes. The RDF has 4 bumps, one more than the nodes.' },
      { do: 'Find the orbital in n = 4 with no radial nodes.', when: (s) => s.n === 4 && s.l === 3, then: '4f. When l = n − 1, all n − 1 nodes are angular, so there are none left over for the radial part.' },
      { do: 'Compare 3s with 3d.', when: (s) => s.n === 3 && s.l === 2, then: '3d has one smooth bump and no radial nodes. 3s has three bumps, and its innermost one reaches very close to the nucleus.' },
    ],
  },
  rdfBuilder: {
    title: 'Why the most likely distance is not zero',
    what: 'Slide a thin shell outward from the nucleus. Watch density, shell size and their product.',
    load: W('rdf-builder'),
    parts: [
      { label: 'Left', text: 'A slice through the atom. Brightness is density. The white ring is your shell.' },
      { label: 'Blue', color: TEAL, text: 'R²: density on a line. Highest at the nucleus for s orbitals.' },
      { label: 'Grey dashed', color: GREY, text: 'Shell size, growing as r².' },
      { label: 'White', color: WHITE, text: 'Their product, the radial distribution function.' },
    ],
    tasks: [
      { do: 'Move the shell right to the nucleus, below 3 pm.', when: (s) => s.r <= 3, then: 'Density is at its highest, but the shell has almost no size. Their product is almost zero.' },
      { do: 'Find the top of the white curve for 1s.', when: (s) => s.orb === '1s' && s.atPeak, then: '52.9 pm, the Bohr radius. Bohr\'s orbit radius turns out to be the most likely distance.' },
      { do: 'Switch to 2s and find where the white curve drops to zero between its bumps.', when: (s) => s.orb === '2s' && Math.abs(s.r - 106) <= 4, then: '106 pm: the radial node. The product is zero because the density there is zero.' },
    ],
  },
  sternGerlach: {
    title: 'Hydrogen atoms through a magnet',
    what: 'A beam of hydrogen atoms passes a magnet whose field gets stronger toward the north pole.',
    load: W('stern-gerlach'),
    parts: [
      { label: 'Orange dots', color: GOLD, text: 'Hydrogen atoms leaving the oven.' },
      { label: 'Magnet', text: 'Pointed north pole above, flat south pole below. This shape makes the field uneven.' },
      { label: 'Screen', text: 'Where the atoms land, seen face on.' },
    ],
    tasks: [
      { do: 'Watch about 200 atoms land.', when: (s) => s.mode === 'quantum' && s.grad > 0 && s.total >= 200, then: 'Two spots, about half the atoms in each. Nothing lands in between.' },
      { do: 'Switch to "Classical expectation".', when: (s) => s.mode === 'classical' && s.total >= 150, then: 'If atoms were tiny magnets pointing any which way, you would get a smear. That is not what experiments show.' },
      { do: 'Turn the field gradient off.', when: (s) => s.grad === 0 && s.total >= 50, then: 'One spot. With no uneven field, nothing pushes the atoms up or down.' },
    ],
  },
};
