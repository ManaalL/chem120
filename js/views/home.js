// Landing page: live orbital, the module as a story of questions, and how the site helps you learn.
import { h, katexString } from '../ui/dom.js';
import { LESSONS } from '../lessons/registry.js';
import { OrbitalView } from '../widgets/orbital-engine.js';
import { deckStats } from '../learn/deck.js';

const HERO = [{ id: '2pz', tex: '2p_z' }, { id: '3dz2', tex: '3d_{z^2}' }, { id: '3dxy', tex: '3d_{xy}' }, { id: '3pz', tex: '3p_z' }];
const QUESTIONS = {
  '2.1': 'Why can\'t an atom hold any amount of energy?',
  '2.2': 'What actually is light?',
  '2.3': 'Which experiments forced physicists to change their minds?',
  '2.4': 'Why does hydrogen glow in only four colours?',
  '2.5': 'Can an electron be a wave?',
  '2.6': 'Why can\'t we know an electron\'s path?',
  '2.7': 'What does the electron "cloud" really mean?',
  '2.8': 'What do orbitals look like, and why?',
  '2.9': 'What did a magnet reveal about electrons?',
  '2.10': 'Can you put it all together?',
};

export function render(ctx) {
  const { main, progress, onCleanup } = ctx;
  const p = progress.get();
  const started = Object.keys(p.visited).length > 0;
  const next = LESSONS.find((l) => !p.done[l.id]) || LESSONS[0];
  const due = deckStats().due;

  const win = h('div', { class: 'hero-window instrument' });
  const caption = h('p', { class: 'hero-caption' });
  const switcher = h('div', { class: 'hero-switch', role: 'group', 'aria-label': 'Choose an orbital' });
  win.append(caption, switcher);

  main.append(h('section', { class: 'home-hero' },
    h('div', {},
      h('p', { class: 'course' }, 'CHEM 120/121 at the University of Waterloo, Module 2'),
      h('h1', {}, 'Quantum theory and the hydrogen atom'),
      h('p', { class: 'lede' }, 'Why atoms only take in certain colours of light, why electrons behave like waves, and where orbital shapes like this one come from. Ten short lessons where you predict, try, and check as you go.'),
      h('div', { class: 'hero-actions' },
        h('a', { class: 'btn primary', href: `#/lesson/${next.id}` }, started ? `Continue with ${next.id}` : 'Start lesson 2.1'),
        due ? h('a', { class: 'btn', href: '#/review' }, `Review ${due} card${due === 1 ? '' : 's'}`) : h('a', { class: 'btn', href: '#/lab' }, 'Open the orbital lab'))),
    win));

  const view = new OrbitalView(win, { orbital: '3dz2', surface: false, cloud: true, points: 36000, axes: false, autoRotate: true });
  onCleanup(() => view.dispose());
  const buttons = HERO.map((o) => {
    const b = h('button', { type: 'button', 'aria-pressed': String(o.id === '3dz2'), html: katexString(o.tex) });
    b.addEventListener('click', () => { buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); view.set({ orbital: o.id }); setCaption(o); });
    switcher.append(b);
    return b;
  });
  const setCaption = (o) => { caption.innerHTML = `A hydrogen ${katexString(o.tex)} orbital drawn as 36,000 possible electron positions. Drag to turn it.`; };
  setCaption(HERO[1]);

  main.append(h('section', { class: 'home-section', 'aria-labelledby': 'story-h' },
    h('h2', { id: 'story-h' }, 'The module as ten questions'),
    h('p', { class: 'sub' }, 'Each lesson answers one question and raises the next. Read them in order the first time.'),
    h('ol', { class: 'story' }, LESSONS.map((l) => h('li', {},
      h('a', { href: `#/lesson/${l.id}` },
        h('span', { class: 'n' }, h('span', {}, `Lesson ${l.id}`), p.done[l.id] ? h('span', { class: 'done' }, 'Done') : p.visited[l.id] ? h('span', {}, 'Started') : null),
        h('span', { class: 't' }, l.title),
        h('span', { class: 'q' }, QUESTIONS[l.id]))))),
    h('p', { class: 'story-arc' }, 'Lessons 2.1 to 2.4 show that energy in atoms comes in steps. Lessons 2.5 to 2.7 explain why. Lessons 2.8 and 2.9 show what that means for the shape of an atom.')));

  main.append(h('section', { class: 'home-section', 'aria-labelledby': 'method-h' },
    h('h2', { id: 'method-h' }, 'How each lesson works'),
    h('p', { class: 'sub' }, 'Every part of a lesson is built on a study method with strong research behind it.'),
    h('div', { class: 'method' },
      m('Predict first', 'Each lesson opens with a question to guess before you read, and comes back to it at the end.', 'Guessing first, even wrongly, makes the right answer easier to remember.'),
      m('Highlights and notes', 'The key phrases light up as you scroll, and each lesson\'s main ideas collect into a Notes drawer.', 'Marking what matters helps you see the structure instead of every word at once.'),
      m('Guided simulations', 'Every simulation has a short list of things to try. Each one ticks off when you reach it and explains what you just saw.', 'Exploring with a goal teaches more than free play.'),
      m('Step-by-step examples', 'Worked examples show one step at a time, then you solve a similar problem with hints.', 'Studying a worked example before solving one is faster than solving from scratch.'),
      m('Quick checks', 'Short questions after each part, with an explanation for every option, including the wrong ones.', 'Answering questions is one of the best ways to learn, not just to test.'),
      m('Spaced review', 'Recall cards at the end of each lesson come back on the Review page days later.', 'Recalling something just as you start to forget it is what makes it stick.'))));

  main.append(h('section', { class: 'home-section', 'aria-labelledby': 'tools-h' },
    h('h2', { id: 'tools-h' }, 'Tools'),
    h('div', { class: 'tools-grid' },
      tool('#/lab', 'Orbital lab', 'All 14 orbitals from 1s to 3d. Rotate them, slice them open, and see their nodes.'),
      tool('#/sandbox', 'Experiments', 'Every simulation from the lessons in one place, each with its guided tasks.'),
      tool('#/review', 'Review', 'Spaced recall cards and mixed practice problems with worked solutions.'),
      tool('#/applications', 'Medicine and tech', 'MRI, electron microscopes, pulse oximeters and more, each with a small calculator.'))));

  main.append(h('footer', { class: 'site-foot' },
    h('p', {}, 'A study companion for CHEM 120/121 Module 2. Not an official University of Waterloo resource. Explanations are written for this site; equations and constants follow the module notes.'),
    h('p', {}, 'Formulas and constants are on the ', h('a', { href: '#/reference' }, 'reference page'), '. For more orbital pictures, the course points to ', h('a', { href: 'https://winter.group.shef.ac.uk/orbitron/', rel: 'noopener' }, 'The Orbitron'), ' at the University of Sheffield.')));
}

function m(title, text, why) { return h('div', {}, h('h3', {}, title), h('p', {}, text, h('span', { class: 'why' }, why))); }
function tool(href, title, text) { return h('a', { class: 'tool-link', href }, h('h3', {}, title), h('p', {}, text)); }
