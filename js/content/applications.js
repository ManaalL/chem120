// Real-world uses of the Module 2 ideas. `spotlight` appears inside lessons;
// `body` appears on the Applications page next to a calculator.
// Numbers here were checked against standard references; see notes in each body.
import { tex } from '../ui/dom.js';

export const APPLICATIONS = [
  {
    id: 'mri',
    title: 'MRI and NMR spectroscopy',
    short: 'MRI',
    lessons: ['2.9', '2.2'],
    idea: 'Two spin states split in a magnetic field; radio photons flip between them',
    spotlight: tex`<p>A hydrogen nucleus (a proton) is also a spin-½ particle, so like the electron in the Stern-Gerlach experiment it has exactly two spin states, labelled $m_I = +\tfrac12$ and $m_I = -\tfrac12$. In an MRI magnet the two states have slightly different energies. A 3 T scanner flips protons between them with radio waves at about 128 MHz. Water and fat are full of protons, which is why MRI images soft tissue so well.</p>`,
    body: tex`
      <p>The electron's spin quantum number is $m_s$. Nuclei have their own spin, written $I$ with states $m_I$. The proton has $I = \tfrac12$, so it has the same two-state pattern as the electron. With no magnetic field the two states have the same energy. In a field $B_0$ they separate by</p>
      $$\Delta E = h\,\nu_L \qquad \nu_L = \frac{\gamma}{2\pi} B_0 = (42.58\ \text{MHz T}^{-1})\,B_0$$
      <p>where $\nu_L$ is the Larmor frequency. Clinical scanners run at 1.5 T or 3 T, which puts $\nu_L$ at about 64 or 128 MHz. That is in the radio part of the spectrum from lesson 2.2, with a wavelength of a few metres. Each photon carries very little energy, so at body temperature the lower state holds only about 5 to 10 extra protons per million. The signal is measurable because water holds about $7 \times 10^{28}$ hydrogen nuclei per cubic metre.</p>
      <p>The scanner sends a radio pulse that tips the spins, then listens as they return. Different tissues return at different rates (the relaxation times $T_1$ and $T_2$), and that difference is what produces contrast between, for example, grey matter, white matter and fluid. Magnetic field gradients make $\nu_L$ depend on position, which is how the signal is turned into a 3D image.</p>
      <p>Chemists use the same physics in NMR spectroscopy, where small shifts in $\nu_L$ reveal how each hydrogen in a molecule is bonded.</p>`,
  },
  {
    id: 'tem',
    title: 'Electron microscopy and cryo-EM',
    short: 'electron microscopy',
    lessons: ['2.5'],
    idea: 'Fast electrons have picometre de Broglie wavelengths',
    spotlight: tex`<p>Light microscopes cannot resolve detail much smaller than about half the wavelength of visible light, roughly 200 nm. Electrons accelerated through 200 kV have a de Broglie wavelength of about 2.5 pm, tens of thousands of times shorter. Cryo-electron microscopy uses this to image frozen proteins and viruses close to atomic detail. Its developers shared the 2017 Nobel Prize in Chemistry.</p>`,
    body: tex`
      <p>An electron accelerated from rest through a potential difference $V$ gains kinetic energy $eV$. Its momentum sets its de Broglie wavelength, $\lambda = h/p$. At low voltages the classical result is enough:</p>
      $$\lambda = \frac{h}{\sqrt{2 m_e e V}}$$
      <p>Microscopes run at 100 to 300 kV. At these energies electrons move at more than half the speed of light, so the relativistic form is needed:</p>
      $$\lambda = \frac{h}{\sqrt{2 m_e e V\left(1 + \dfrac{eV}{2 m_e c^2}\right)}}$$
      <p>At 200 kV this gives 2.51 pm. The wavelength is not what limits the picture in practice. Imperfect magnetic lenses, radiation damage to the sample and sample motion matter more. The sharpest cryo-EM protein structures reach about 1.2 Å (120 pm), enough to see individual atoms in favourable cases. Freezing the sample quickly in a thin layer of glassy ice keeps the molecules in their natural shape and protects them from the beam.</p>
      <p>Cryo-EM is now a standard tool in drug development. It was used to solve the structure of the SARS-CoV-2 spike protein within weeks of the virus's genome being published in early 2020.</p>`,
  },
  {
    id: 'pdt',
    title: 'Photodynamic therapy and medical lasers',
    short: 'photodynamic therapy',
    lessons: ['2.3', '2.4'],
    idea: 'A drug absorbs a specific photon energy and passes it to oxygen',
    spotlight: tex`<p>In photodynamic therapy, a light-sensitive drug collects in a tumour. Red laser light, often near 630 nm, is shone on the area. Each absorbed photon lifts a drug molecule to an excited state. The drug hands that energy to an oxygen molecule, making a reactive form called singlet oxygen ($^1\text{O}_2$) that damages the cells around it. Only the right photon energy starts this chain, which is the same quantized absorption you see in line spectra.</p>`,
    body: tex`
      <p>Molecules absorb light only when the photon energy matches a gap between two of their energy levels, as hydrogen does in lesson 2.3. Photodynamic therapy uses a drug, called a photosensitizer, chosen to absorb red light. One approved example, porfimer sodium, is activated at 630 nm.</p>
      <p>After absorbing a photon, the photosensitizer moves into a longer-lived excited state (a triplet state). From there it can transfer its energy to an ordinary oxygen molecule, which is converted to singlet oxygen. Singlet oxygen sits about 0.98 eV above normal oxygen and reacts with nearby proteins and lipids. It survives for only a short time in cells, so the damage stays within a small distance of where it formed.</p>
      <p>Red and near-infrared light are used because tissue absorbs and scatters them less than blue light, so they reach a few millimetres deeper. A 630 nm photon carries about 1.97 eV, comfortably more than singlet oxygen needs.</p>
      <p>Surgical lasers work on a related idea. A laser emits photons of one energy, and each tissue absorbs some energies more than others. Carbon dioxide lasers at 10.6 µm are absorbed strongly by water, so they cut and seal soft tissue with little spread.</p>`,
  },
  {
    id: 'oximetry',
    title: 'Pulse oximetry',
    short: 'pulse oximetry',
    lessons: ['2.2', '2.3'],
    idea: 'Oxygenated and deoxygenated hemoglobin absorb red and infrared differently',
    spotlight: tex`<p>A pulse oximeter clipped to a finger shines two lights through it: red at 660 nm and infrared at 940 nm. Hemoglobin without oxygen absorbs more of the red light. Hemoglobin carrying oxygen absorbs more of the infrared. Comparing how much of each wavelength gets through, beat by beat, gives the percentage of hemoglobin carrying oxygen.</p>`,
    body: tex`
      <p>Hemoglobin's colour comes from electronic transitions in its heme groups. When oxygen binds to the iron, the energy levels shift, so oxygenated and deoxygenated hemoglobin absorb different wavelengths. That is why arterial blood looks bright red and venous blood looks darker.</p>
      <p>At 660 nm, deoxygenated hemoglobin absorbs much more than oxygenated hemoglobin. At 940 nm the order flips and oxygenated hemoglobin absorbs slightly more. The device measures the part of the signal that rises and falls with each heartbeat (from arterial blood) and divides by the steady part (from tissue, bone and venous blood). It computes the ratio</p>
      $$R = \frac{AC_{660}/DC_{660}}{AC_{940}/DC_{940}}$$
      <p>and converts it to oxygen saturation with a calibration curve measured on volunteers. A common textbook approximation is $\text{SpO}_2 \approx 110 - 25R$; real devices use their own curves.</p>
      <p>Those calibrations were mostly built on people with lighter skin. Studies since 2020 have found that oximeters more often overestimate oxygen levels in patients with darker skin, which can hide low oxygen. The US FDA reviewed the problem and in 2025 issued draft guidance asking makers to test devices on people with a wider range of skin tones.</p>`,
  },
  {
    id: 'gfp',
    title: 'Fluorescence microscopy and GFP',
    short: 'fluorescence',
    lessons: ['2.3'],
    idea: 'Absorb one photon, emit a lower-energy one (Stokes shift)',
    spotlight: tex`<p>Green fluorescent protein (GFP) absorbs blue light and gives off green light. The emitted photon has less energy than the absorbed one because the molecule loses a little energy to vibration while it is excited. Biologists attach GFP to proteins they want to follow, then watch them move inside living cells. The discovery and development of GFP won the 2008 Nobel Prize in Chemistry.</p>`,
    body: tex`
      <p>Fluorescence is absorption followed by emission. A molecule absorbs a photon whose energy matches a gap between energy levels, relaxes slightly in the excited state by losing energy as vibration, then drops back down by emitting a photon. Because some energy was lost, the emitted photon has a longer wavelength. The difference between the absorption and emission peaks is the Stokes shift.</p>
      <p>Enhanced GFP (EGFP), the version used in most labs, absorbs most strongly near 488 nm and emits near 507 nm. Using $E = hc/\lambda$, each absorbed photon carries 2.54 eV and each emitted photon about 2.45 eV, so roughly 0.1 eV per photon becomes heat.</p>
      <p>The Stokes shift is what makes fluorescence microscopy work. Filters block the bright blue excitation light and pass only the green emission, so labelled structures glow against a dark background. Combining proteins that glow in different colours lets researchers track several molecules at once.</p>`,
  },
  {
    id: 'photosynthesis',
    title: 'Light harvesting in photosynthesis',
    short: 'photosynthesis',
    lessons: ['2.1', '2.5'],
    idea: 'Chlorophyll absorbs quantized packets of light; how energy moves next is still debated',
    spotlight: tex`<p>Chlorophyll absorbs red and blue photons and reflects green. Hundreds of pigment molecules pass absorbed energy to a reaction centre, where nearly every photon that arrives drives a charge separation. In 2007 researchers reported signs that this energy moves in a wave-like, quantum way. Later studies found those effects fade too quickly at body temperature to matter much. Whether quantum coherence helps photosynthesis is still an open question.</p>`,
    body: tex`
      <p>Photosynthesis starts with photon absorption. Chlorophyll $a$ absorbs most strongly near 430 nm and 660 nm, which is why leaves look green. Each photon carries one fixed packet of energy, $E = hc/\lambda$. The reaction centre of photosystem II absorbs at 680 nm, and one mole of those photons carries about 176 kJ.</p>
      <p>Absorbed energy hops from pigment to pigment through the light-harvesting complex until it reaches a reaction centre. At that step the process is very efficient: most photons that reach the reaction centre produce a charge separation. The overall efficiency of turning sunlight into stored chemical energy is much lower, around 1 to 2% for most crops, because of losses later in the process.</p>
      <p>In 2007, experiments on a bacterial light-harvesting protein cooled to 77 K showed oscillating signals that were read as electronic quantum coherence, meaning the energy might explore several paths at once like a wave. This drew wide attention. Later work, including experiments at room temperature and more detailed models, found that electronic coherence lasts only a fraction of a picosecond and that many of the oscillations come from molecular vibrations. Most researchers now think quantum effects shape energy transfer in some way, but the size of that role is not settled.</p>`,
  },
];
