import { add, section, key, check, predict, revisit, myth, timeline } from '../learn/blocks.js';
import { sim } from '../learn/sim.js';

export const meta = {
  minutes: 12,
  objectives: [
    'Say what <strong>quantized</strong> energy means, using an everyday example',
    'Explain why quantum effects matter for electrons but not for baseballs',
    'Name the experiments coming up that proved energy is quantized',
  ],
};

export function render(ctx) {
  predict(ctx, {
    id: '2.1',
    q: 'A hydrogen atom takes in energy from light. Can it take in any amount of energy it likes?',
    options: [
      { t: 'Yes, any amount, like filling a glass with water' },
      { t: 'No, only certain exact amounts', right: true },
      { t: 'Only very large amounts' },
      { t: 'Atoms can\'t take in energy from light' },
    ],
  });

  section(ctx, 'The rules for big things break down');
  add(ctx, `
    <p>Newton's laws describe a thrown ball, a swinging pendulum and a planet in orbit almost perfectly. They were worked out by watching large objects, and for large objects they have never failed.</p>
    <p>Around 1900, physicists tried to use the same laws for electrons inside atoms. The predictions were badly wrong. They said heated objects should glow infinitely bright, that dim light could eventually knock electrons out of any metal, and that atoms should give off a smooth rainbow of colours. <mark>None of that happens.</mark></p>
  `);
  key(ctx, 'When an electron is held in a small space by the pull of a nucleus, its energy can only take <mark>certain allowed values</mark>. Energy like this is called <dfn data-g="quantized">quantized</dfn>.', 'An electron held near a nucleus can only have certain allowed energies. This is called quantized energy.');

  section(ctx, 'A ramp and a staircase');
  add(ctx, `
    <p>Think of a ball on a smooth ramp. It can stop at any height, so its energy can be any value. Now think of a ball on stairs. It can only rest on a step. <mark>Its energy jumps from one step to the next with nothing in between.</mark></p>
    <p>An electron in an atom behaves like the ball on the stairs. Try it below, and work through the three tasks on the right.</p>
  `);
  sim(ctx, 'rampStairs');
  check(ctx, {
    q: 'Which of these is most like quantized energy?',
    options: [
      { t: 'The pitch of a violin, which can slide smoothly up and down', why: 'A violinist can play any pitch in between notes, like the ball on the ramp. That\'s continuous.' },
      { t: 'The notes of a piano, which jump from key to key', right: true, why: 'A piano can only play the notes of its keys, with nothing in between. Like the stairs.' },
      { t: 'The volume knob on a speaker, turned slowly', why: 'A smooth knob can stop anywhere. That\'s continuous, like the ramp.' },
    ],
  });

  section(ctx, 'Why you never notice the steps');
  add(ctx, `
    <p>In principle everything is quantized, even a ball on a ramp. For a ball, though, the steps are so tiny that no instrument could ever detect them, so its energy looks perfectly smooth.</p>
    <p>For an electron the steps are big. The gaps between its allowed energies are around $10^{-19}$ J. That sounds small, but an electron's mass is only $9.109 \\times 10^{-31}$ kg, so on its own scale those steps are huge.</p>
  `);
  key(ctx, 'Quantum effects are large when a particle is <mark>very light</mark> and <mark>confined to a very small space</mark>. That describes an electron in an atom.');
  myth(ctx, {
    wrong: 'Quantum rules only apply to tiny things. Big objects follow different laws.',
    right: 'The same rules apply to everything. For big objects the energy steps are just far too small to notice, so the old laws work as a very good approximation.',
  });

  section(ctx, 'How we found out');
  add(ctx, '<p>Quantum theory was pieced together over about 30 years, mostly from experiments where light hit matter or came out of it. Tap each step to see what it added. You will meet each of them in this module.</p>');
  timeline(ctx, [
    { year: '1900', who: 'Planck', what: 'Glowing hot objects give out energy in packets of size $h\\nu$. The first hint of quantization.', lesson: '2.3' },
    { year: '1905', who: 'Einstein', what: 'Light itself comes in packets called photons, each with energy $E = h\\nu$.', lesson: '2.3' },
    { year: '1913', who: 'Bohr', what: 'The electron in hydrogen is only allowed certain energies. This explains hydrogen\'s colours.', lesson: '2.4' },
    { year: '1922', who: 'Stern, Gerlach', what: 'A beam of atoms splits in two in a magnet, revealing electron spin.', lesson: '2.9' },
    { year: '1924', who: 'de Broglie', what: 'Electrons, and all moving particles, behave like waves.', lesson: '2.5' },
    { year: '1926', who: 'Schrödinger', what: 'An equation for electron waves predicts the allowed energies and the shapes of orbitals.', lesson: '2.7' },
    { year: '1927', who: 'Heisenberg', what: 'You can\'t know an electron\'s exact position and speed at the same time.', lesson: '2.6' },
  ], 'Seven discoveries that built quantum theory');

  revisit(ctx, '2.1', 'An atom can only take in amounts of energy that exactly match the gap between two of its allowed energy levels. Anything else passes straight through. Lesson 2.3 shows the experiment that proves it: hydrogen gas absorbs only four visible colours of light.');
}
