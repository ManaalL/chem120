// Lesson 2.1: a ball on a ramp (any height allowed) beside a ball on stairs (only step heights allowed).
import * as THREE from 'three';
import { createStage, textSprite } from '../ui/stage.js';
import { h, slider, segmented, readouts } from '../ui/dom.js';
import { C, sci } from '../core/physics.js';

export function create() {
  const el = h('div', { class: 'viewport' }, h('p', { class: 'viewport-note' }, 'Drag the slider, or drag the scene to look around.'));
  const stage = createStage(el, { position: [0, 2.6, 8.2], target: [0, 1.1, 0], minDistance: 5, maxDistance: 14 });
  const state = { p: 0.35, mode: 'even' };
  const W = 2.6, HGT = 2.2, STEPS = 5;

  let rampBall, stairBall, stairGroup, labels;
  if (stage) {
    const { scene } = stage;
    const matBody = new THREE.MeshStandardMaterial({ color: 0x2b3747, roughness: 0.8 });
    const matEdge = new THREE.LineBasicMaterial({ color: 0x55657a });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 3), new THREE.MeshStandardMaterial({ color: 0x161d26, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; scene.add(floor);

    // ramp: triangular prism from x=-3.1 to -0.5
    const shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(W, 0), new THREE.Vector2(W, HGT)]);
    const rampGeo = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
    const ramp = new THREE.Mesh(rampGeo, matBody); ramp.position.set(-3.1, 0, -0.5); scene.add(ramp);
    const rampEdges = new THREE.LineSegments(new THREE.EdgesGeometry(rampGeo), matEdge); rampEdges.position.copy(ramp.position); scene.add(rampEdges);

    stairGroup = new THREE.Group(); stairGroup.position.set(0.5, 0, -0.5); scene.add(stairGroup);
    labels = new THREE.Group(); scene.add(labels);

    const ballGeo = new THREE.SphereGeometry(0.17, 32, 16);
    rampBall = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: 0xe6ebf0, roughness: 0.3 }));
    stairBall = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: 0x40c4e6, roughness: 0.3, emissive: 0x0b3340 }));
    scene.add(rampBall, stairBall);

    const t1 = textSprite(THREE, 'Ramp: any height', { scale: 0.32 }); t1.position.set(-1.8, -0.35, 0.8); scene.add(t1);
    const t2 = textSprite(THREE, 'Stairs: only step heights', { scale: 0.32 }); t2.position.set(1.8, -0.35, 0.8); scene.add(t2);
    stage.camera.position.set(0, 2.6, 8.2);
  }

  // Step heights as fractions of the top. "hydrogen" spaces them like E_n = -R_H/n^2.
  const levels = () => state.mode === 'even'
    ? Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS)
    : Array.from({ length: STEPS + 1 }, (_, i) => (1 - 1 / ((i + 1) ** 2)) / (1 - 1 / ((STEPS + 1) ** 2)));

  function buildStairs() {
    if (!stage) return;
    for (const c of [...stairGroup.children]) { stairGroup.remove(c); c.geometry?.dispose(); }
    for (const c of [...labels.children]) { labels.remove(c); c.material?.map?.dispose(); c.material?.dispose(); }
    const lv = levels();
    const w = W / (STEPS + 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2b3747, roughness: 0.8 });
    const edge = new THREE.LineBasicMaterial({ color: 0x55657a });
    lv.forEach((f, i) => {
      const hgt = Math.max(0.02, f * HGT);
      const geo = new THREE.BoxGeometry(w, hgt, 1);
      const m = new THREE.Mesh(geo, mat); m.position.set(w * (i + 0.5), hgt / 2, 0.5);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge); e.position.copy(m.position);
      stairGroup.add(m, e);
      const s = textSprite(THREE, state.mode === 'even' ? `${i}` : `n = ${i + 1}`, { scale: 0.2, color: '#94a1b0' });
      s.position.set(0.5 + w * (i + 0.5), hgt + 0.32, 0);
      labels.add(s);
    });
  }

  const ro = readouts([
    { key: 'ramp', label: 'Ramp ball height' },
    { key: 'stair', label: 'Stairs ball height' },
    { key: 'allowed', label: 'Heights allowed on the stairs' },
    { key: 'h', label: 'Hydrogen energy for this step' },
  ]);

  function update() {
    const lv = levels();
    const p = state.p;
    // stairs: the ball sits on the highest step it has fully reached
    let k = 0;
    for (let i = 0; i < lv.length; i++) if (p >= lv[i] - 1e-9) k = i;
    if (stage) {
      const x0 = -3.1, r = 0.17;
      const ang = Math.atan2(HGT, W);
      rampBall.position.set(x0 + p * W - Math.sin(ang) * r, p * HGT + Math.cos(ang) * r, 0);
      const w = W / (STEPS + 1);
      stairBall.position.set(0.5 + w * (k + 0.5), lv[k] * HGT + r + 0.01, 0);
    }
    ro.set('ramp', `${(p * 100).toFixed(1)}% of the top`);
    ro.set('stair', `${(lv[k] * 100).toFixed(1)}% of the top`);
    ro.set('allowed', lv.map((f) => `${Math.round(f * 100)}%`).join(', '));
    ro.set('h', state.mode === 'hydrogen' ? `n = ${k + 1}: ${sci(-C.RH / ((k + 1) ** 2), 4)} J` : 'switch to hydrogen spacing');
    stage?.render();
  }

  const controls = h('div', {},
    slider({ label: 'Energy given to each ball', min: 0, max: 1, step: 0.001, value: state.p, format: (v) => `${(v * 100).toFixed(1)}%`, onInput: (v) => { state.p = v; update(); } }),
    segmented({ label: 'Step spacing', options: [{ value: 'even', label: 'Even steps' }, { value: 'hydrogen', label: 'Hydrogen spacing' }], value: 'even', onChange: (v) => { state.mode = v; buildStairs(); update(); } }),
    ro,
    h('p', { class: 'ctl-hint' }, 'Hydrogen spacing places the steps like the energy levels of the H atom. The gaps shrink as n increases.'));

  buildStairs(); update();
  stage?.start();
  return { el, controls, title: 'Ramp and stairs', sub: 'Continuous energy versus quantized energy', dispose: () => stage?.dispose() };
}
