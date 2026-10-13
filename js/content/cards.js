// Recall cards for each lesson. Fronts are questions to answer from memory; backs are short.
// Math uses $...$ and is typeset when shown.
export const CARDS = {
  '2.1': [
    { front: 'What does it mean for energy to be quantized?', back: 'Only certain amounts are allowed, with nothing in between, like steps on a staircase.' },
    { front: 'When does a particle\'s energy become quantized?', back: 'When forces hold it inside a small region, like an electron held near a nucleus.' },
    { front: 'Why don\'t we notice quantized energy for a baseball?', back: 'The steps are far too small to measure for something that heavy. They only matter for very light particles in small spaces.' },
    { front: 'Piano or violin: which one can only play certain pitches?', back: 'The piano. Its keys give only certain notes; a violin can slide smoothly between them.' },
  ],
  '2.2': [
    { front: 'Write the equation linking wavelength, frequency and the speed of light.', back: '$\\lambda\\nu = c$, with $c = 2.998 \\times 10^{8}$ m s$^{-1}$.' },
    { front: 'If wavelength doubles, what happens to frequency?', back: 'It halves. They are inversely proportional.' },
    { front: 'Order the spectrum from shortest to longest wavelength.', back: 'Gamma, X-ray, UV, visible, infrared, microwave, radio.' },
    { front: 'What range of wavelengths is visible light?', back: 'About 400 nm (violet) to 750 nm (red).' },
    { front: 'Do X-rays travel faster than radio waves?', back: 'No. All electromagnetic radiation travels at $c$ in a vacuum.' },
  ],
  '2.3': [
    { front: 'Energy of one photon, two ways.', back: '$E = h\\nu = hc/\\lambda$' },
    { front: 'What problem did Planck solve, and what did he assume?', back: 'The blackbody (ultraviolet catastrophe) problem. He assumed oscillators only have energies $nh\\nu$.' },
    { front: 'Why doesn\'t bright red light eject electrons from zinc?', back: 'Each red photon has less energy than the work function. More photons doesn\'t help: one photon frees one electron.' },
    { front: 'Photoelectric energy balance.', back: '$E_\\text{photon} = w + KE_{e^-}$, with $w = h\\nu_0$.' },
    { front: 'What does brighter light change in the photoelectric effect?', back: 'The number of electrons ejected, not their speed.' },
    { front: 'What do line spectra show about atoms?', back: 'Atoms only absorb and emit certain energies, so their energy is quantized.' },
  ],
  '2.4': [
    { front: 'Energy of hydrogen level $n$.', back: '$E_n = -R_H/n^2$, with $R_H = 2.179 \\times 10^{-18}$ J.' },
    { front: 'Energy change for a transition.', back: '$\\Delta E = -R_H(1/n_f^2 - 1/n_i^2)$. Negative means a photon is emitted.' },
    { front: 'Why are hydrogen\'s energy levels negative?', back: 'Zero is set as the electron fully removed. A bound electron has less energy than that.' },
    { front: 'Which series ends on $n = 2$, and where is it?', back: 'The Balmer series, mostly visible light (656.3, 486.1, 434.0, 410.1 nm).' },
    { front: 'Name two problems with Bohr\'s model.', back: 'It assumes quantization without explaining it, and it fails for atoms with more than one electron. Electrons also don\'t follow fixed orbits.' },
  ],
  '2.5': [
    { front: 'de Broglie wavelength.', back: '$\\lambda = h/p = h/mv$' },
    { front: 'Why does an electron diffract but a baseball doesn\'t?', back: 'The electron\'s wavelength is about the size of atoms. A baseball\'s is about $10^{-34}$ m, smaller than any gap.' },
    { front: 'What experiment confirmed electrons act as waves?', back: 'Electron diffraction through metal crystals (Davisson and Germer; G. P. Thomson), 1927.' },
    { front: 'In the diffraction experiment, how does each electron arrive?', back: 'At a single point, like a particle. The ring pattern builds up from many electrons.' },
  ],
  '2.6': [
    { front: 'The uncertainty principle.', back: '$\\Delta x\\,\\Delta p \\ge h/4\\pi$' },
    { front: 'If you pin an electron down more precisely, what happens to its momentum?', back: 'It becomes more uncertain. The product of the two uncertainties has a minimum.' },
    { front: 'Is the uncertainty principle caused by bad instruments?', back: 'No. It holds even for perfect measurements. It comes from the wave nature of particles.' },
    { front: 'What does the uncertainty principle mean for electron orbits?', back: 'Electrons can\'t have definite paths, so we describe them with probabilities instead.' },
  ],
  '2.7': [
    { front: 'What does $\\Psi^2$ tell you?', back: 'The probability of finding the electron in a small volume at each point (Born interpretation).' },
    { front: 'Allowed values of $n$, $l$ and $m_l$.', back: '$n = 1, 2, 3, \\ldots$; $l = 0$ to $n - 1$; $m_l = -l$ to $+l$.' },
    { front: 'Letters for $l = 0, 1, 2, 3$.', back: 's, p, d, f' },
    { front: 'How many orbitals in shell $n$ of hydrogen? Same energy?', back: '$n^2$ orbitals, all with the same energy (degenerate).' },
    { front: 'Where does quantization come from in Schrödinger\'s theory?', back: 'Only certain energies give sensible solutions to the equation. It isn\'t assumed.' },
  ],
  '2.8': [
    { front: 'Number of radial nodes.', back: '$n - l - 1$' },
    { front: 'Number of angular nodes.', back: '$l$' },
    { front: 'Where is a 1s electron most likely to be found, counting all directions?', back: 'At 52.9 pm, the Bohr radius (peak of the radial distribution function).' },
    { front: 'Why is the RDF zero at the nucleus even for s orbitals?', back: 'It multiplies density by the shell size $r^2$, and a shell at $r = 0$ has no volume.' },
    { front: 'What do the two colours on an orbital mean?', back: 'The sign (phase) of $\\Psi$. Not charge.' },
    { front: 'How many maxima does the RDF of an orbital have?', back: '$n - l$' },
  ],
  '2.9': [
    { front: 'What did the Stern-Gerlach experiment show for hydrogen atoms?', back: 'The beam split into exactly two, showing a two-state magnetic property: spin.' },
    { front: 'Allowed values of $m_s$.', back: '$+\\tfrac12$ and $-\\tfrac12$' },
    { front: 'How many electron states in shell $n$?', back: '$2n^2$ ($n^2$ orbitals, two spin states each).' },
    { front: 'Why must the magnet\'s field be non-uniform?', back: 'Only a field that changes across the gap gives a net push that separates the two spin states.' },
  ],
  '2.10': [
    { front: 'List the four quantum numbers and what each tells you.', back: '$n$: size and energy. $l$: shape. $m_l$: orientation. $m_s$: spin direction.' },
    { front: 'Total nodes in an orbital.', back: '$n - 1$' },
  ],
};
