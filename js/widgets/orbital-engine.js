// 3D hydrogen orbital renderer.
// Builds boundary surfaces with marching cubes on a grid of Psi values, a Monte Carlo point
// cloud sampled from |Psi|^2, an optional slice plane with cutaway, and nodal surfaces.
import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/MarchingCubes.js';
import { createStage, axes } from '../ui/stage.js';
import * as H from '../core/hydrogen.js';

export const PHASE = { plus: '#ff6a55', minus: '#40c4e6' };
const WORLD = 1.25;          // world-space half-width that the orbital box maps onto
const MAX_EXTENT = H.extentFor(3);

const gridCache = new Map();
function gridFor(orb) {
  const res = orb.n === 3 ? 88 : orb.n === 2 ? 72 : 60;
  const key = `${orb.id}:${res}`;
  if (!gridCache.has(key)) {
    const L = H.extentFor(orb.n);
    gridCache.set(key, { res, L, field: H.psiGrid(orb, res, L), thresholds: new Map() });
  }
  return gridCache.get(key);
}

let dotTexture = null;
function dot() {
  if (dotTexture) return dotTexture;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  dotTexture = new THREE.CanvasTexture(c);
  return dotTexture;
}

// Heatmap of |Psi|^2 on a plane through the atom, coloured by phase, with nodal lines.
// axis: 'xy' | 'yz' | 'xz'; offset in a0. Returns {canvas, max, values}
// translucent: low-density areas become see-through (used for the plane inside the 3D view).
export function sliceImage(orb, axis, offset, L, N = 240, canvas = document.createElement('canvas'), translucent = false) {
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(N, N);
  const vals = new Float32Array(N * N);
  let max = 0;
  for (let j = 0; j < N; j++) {
    const v = L - (2 * L * (j + 0.5)) / N;          // top row is +v
    for (let i = 0; i < N; i++) {
      const u = -L + (2 * L * (i + 0.5)) / N;
      let x, y, z;
      if (axis === 'xy') { x = u; y = v; z = offset; }
      else if (axis === 'yz') { y = u; z = v; x = offset; }
      else { x = u; z = v; y = offset; }
      const p = H.psi(orb, x, y, z);
      vals[j * N + i] = p;
      if (p * p > max) max = p * p;
    }
  }
  const plus = [255, 106, 85], minus = [64, 196, 230];
  const nodal = max > 1e-12;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const k = j * N + i;
      const p = vals[k];
      let t = nodal ? Math.pow((p * p) / max, 0.42) : 0;
      const col = p >= 0 ? plus : minus;
      let r = 10 + col[0] * t, g = 14 + col[1] * t, b = 20 + col[2] * t;
      // nodal line where the sign flips between neighbours
      if (nodal && i < N - 1 && j < N - 1) {
        const a = vals[k], bR = vals[k + 1], bD = vals[k + N];
        const thr = Math.sqrt(max) * 1e-4;
        if ((a > thr && bR < -thr) || (a < -thr && bR > thr) || (a > thr && bD < -thr) || (a < -thr && bD > thr)) { r = 235; g = 240; b = 245; t = 1; }
      }
      img.data[k * 4] = r; img.data[k * 4 + 1] = g; img.data[k * 4 + 2] = b;
      img.data[k * 4 + 3] = translucent ? Math.round(70 + 185 * Math.min(1, t * 1.3)) : 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { canvas, max, values: vals, N, L };
}

export class OrbitalView {
  /**
   * @param {HTMLElement} container
   * @param {object} o  orbital id, surface, cloud, slice, nodes, axes, fraction, points, autoRotate, trueScale
   */
  constructor(container, o = {}) {
    this.o = { orbital: '2pz', surface: true, cloud: false, slice: false, cutaway: true, nodes: false, axes: true, fraction: 0.9, points: 50000, sliceAxis: 'xz', sliceOffset: 0, trueScale: false, autoRotate: true, ...o };
    this.stage = createStage(container, { zUp: true, position: [3.5, 2.7, 1.95], autoRotate: this.o.autoRotate, autoRotateSpeed: 0.6, minDistance: 1.2, maxDistance: 9, preserve: true, aspect: o.aspect });
    if (!this.stage) return;
    const { scene, renderer } = this.stage;
    renderer.localClippingEnabled = true;
    this.clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    this.root = new THREE.Group(); scene.add(this.root);

    this.matPlus = new THREE.MeshStandardMaterial({ color: PHASE.plus, roughness: 0.38, metalness: 0.05, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    this.matMinus = new THREE.MeshStandardMaterial({ color: PHASE.minus, roughness: 0.38, metalness: 0.05, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    this.mcPlus = null; this.mcMinus = null;

    this.axesObj = axes(THREE, WORLD * 1.18);
    scene.add(this.axesObj);

    this.sliceTex = new THREE.CanvasTexture(document.createElement('canvas'));
    this.sliceTex.colorSpace = THREE.SRGBColorSpace;
    this.sliceMesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * WORLD, 2 * WORLD), new THREE.MeshBasicMaterial({ map: this.sliceTex, transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false }));
    this.sliceFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2 * WORLD, 2 * WORLD)), new THREE.LineBasicMaterial({ color: 0x8fa0b3 }));
    this.sliceMesh.add(this.sliceFrame);
    this.sliceMesh.renderOrder = 10;   // draw after the orbital so the plane sits on the cut face
    scene.add(this.sliceMesh);

    this.nodeGroup = new THREE.Group(); this.root.add(this.nodeGroup);
    this.listeners = new Set();
    this.build();
    this.stage.start();
  }

  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { for (const fn of this.listeners) fn(this.info()); }

  get orb() { return H.getOrbital(this.o.orbital); }
  // world units per a0
  get scale() { return WORLD / (this.o.trueScale ? MAX_EXTENT : H.extentFor(this.orb.n)); }

  set(patch) {
    const prev = { ...this.o };
    Object.assign(this.o, patch);
    if (!this.stage) return;
    if ('autoRotate' in patch && this.stage.controls) this.stage.controls.autoRotate = patch.autoRotate;
    const rebuild = ['orbital', 'fraction', 'trueScale'].some((k) => k in patch && patch[k] !== prev[k]);
    const recloud = rebuild || ('points' in patch && patch.points !== prev.points) || ('cloud' in patch && patch.cloud && !this.cloud);
    if (rebuild) this.build();
    else {
      if (recloud) this.buildCloud();
      this.applyVisibility();
      if (['sliceAxis', 'sliceOffset', 'slice', 'cutaway'].some((k) => k in patch)) this.updateSlice();
      if ('nodes' in patch) this.buildNodes();
    }
    this.emit();
  }

  build() {
    const orb = this.orb;
    const grid = gridFor(orb);
    const f = this.o.fraction;
    if (!grid.thresholds.has(f)) grid.thresholds.set(f, H.enclosingThreshold(grid.field, f));
    this.threshold = grid.thresholds.get(f);

    // Rebuild marching cube objects when the grid resolution changes.
    if (!this.mcPlus || this.mcPlus.size !== grid.res) {
      for (const mc of [this.mcPlus, this.mcMinus]) if (mc) { this.root.remove(mc); mc.geometry.dispose(); }
      this.mcPlus = new MarchingCubes(grid.res, this.matPlus, false, false, 90000);
      this.mcMinus = new MarchingCubes(grid.res, this.matMinus, false, false, 90000);
      this.mcPlus.frustumCulled = this.mcMinus.frustumCulled = false;
      this.root.add(this.mcPlus, this.mcMinus);
    }
    const n3 = grid.field.length;
    const fp = this.mcPlus.field, fm = this.mcMinus.field;
    for (let i = 0; i < n3; i++) { const v = grid.field[i]; fp[i] = v; fm[i] = -v; }
    this.mcPlus.isolation = this.threshold; this.mcMinus.isolation = this.threshold;
    this.mcPlus.update(); this.mcMinus.update();
    const s = grid.L * this.scale;
    this.mcPlus.scale.setScalar(s); this.mcMinus.scale.setScalar(s);

    this.buildCloud();
    this.buildNodes();
    this.updateSlice();
    this.applyVisibility();
  }

  buildCloud() {
    if (this.cloud) { this.root.remove(this.cloud); this.cloud.geometry.dispose(); this.cloud.material.dispose(); this.cloud = null; }
    if (!this.o.cloud) return;
    const { pos, sign } = H.samplePoints(this.orb, this.o.points, 11);
    const n = sign.length, s = this.scale;
    const p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    const plus = new THREE.Color(PHASE.plus), minus = new THREE.Color(PHASE.minus);
    for (let i = 0; i < n; i++) {
      p[3 * i] = pos[3 * i] * s; p[3 * i + 1] = pos[3 * i + 1] * s; p[3 * i + 2] = pos[3 * i + 2] * s;
      const col = sign[i] > 0 ? plus : minus;
      c[3 * i] = col.r; c[3 * i + 1] = col.g; c[3 * i + 2] = col.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const size = 0.022 * Math.sqrt(50000 / this.o.points) ** 0.5;
    const m = new THREE.PointsMaterial({ size, map: dot(), vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    this.cloud = new THREE.Points(g, m);
    this.root.add(this.cloud);
    this.applyVisibility();
  }

  buildNodes() {
    for (const c of [...this.nodeGroup.children]) { this.nodeGroup.remove(c); c.geometry?.dispose(); c.material?.dispose(); }
    if (!this.o.nodes) return;
    const orb = this.orb, s = this.scale;
    const matSurf = new THREE.MeshBasicMaterial({ color: 0xdfe7ef, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
    const matLine = new THREE.LineBasicMaterial({ color: 0xdfe7ef, transparent: true, opacity: 0.55 });
    // radial nodes: spheres
    for (const r of H.radialNodePositions(orb.n, orb.l)) {
      const geo = new THREE.SphereGeometry(r * s, 48, 32);
      this.nodeGroup.add(new THREE.Mesh(geo, matSurf.clone()));
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(r * s, 24, 12)), matLine.clone());
      wire.material.opacity = 0.18;
      this.nodeGroup.add(wire);
    }
    // angular nodes: planes or cones
    const P = WORLD * 1.05;
    const plane = (normal) => {
      const geo = new THREE.PlaneGeometry(2 * P, 2 * P);
      const m = new THREE.Mesh(geo, matSurf.clone());
      m.lookAt(...normal);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), matLine.clone());
      e.lookAt(...normal);
      this.nodeGroup.add(m, e);
    };
    const planes = { px: [[1, 0, 0]], py: [[0, 1, 0]], pz: [[0, 0, 1]], dxy: [[1, 0, 0], [0, 1, 0]], dyz: [[0, 1, 0], [0, 0, 1]], dxz: [[1, 0, 0], [0, 0, 1]], dx2y2: [[1, -1, 0], [1, 1, 0]] }[orb.ang] || [];
    planes.forEach(plane);
    if (orb.ang === 'dz2') {
      const hgt = P, rad = hgt * Math.SQRT2; // cone half-angle 54.74 degrees from z
      for (const dir of [1, -1]) {
        const geo = new THREE.ConeGeometry(rad, hgt, 64, 1, true);
        const m = new THREE.Mesh(geo, matSurf.clone());
        m.rotation.x = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
        m.position.z = (dir * hgt) / 2;
        this.nodeGroup.add(m);
      }
    }
  }

  updateSlice() {
    const on = this.o.slice;
    this.sliceMesh.visible = on;
    const clipping = on && this.o.cutaway ? [this.clip] : [];
    for (const m of [this.matPlus, this.matMinus]) { m.clippingPlanes = clipping; m.needsUpdate = true; }
    if (this.cloud) { this.cloud.material.clippingPlanes = clipping; this.cloud.material.needsUpdate = true; }
    this.nodeGroup.traverse((o) => { if (o.material) { o.material.clippingPlanes = clipping; o.material.needsUpdate = true; } });
    if (!on) return;
    const orb = this.orb, L = this.o.trueScale ? MAX_EXTENT : H.extentFor(orb.n);
    const off = this.o.sliceOffset;
    const res = sliceImage(orb, this.o.sliceAxis, off, L, 200, this.sliceTex.image, true);
    this.sliceTex.needsUpdate = true;
    const w = off * this.scale;
    this.sliceMesh.rotation.set(0, 0, 0); this.sliceMesh.position.set(0, 0, 0);
    // Plane geometry lies in the local XY plane facing +z.
    // Cutaway removes the half on the camera's default side (positive axis), so the plane's
    // face and the inside of the orbital stay visible. Three.js keeps points where n.p + c >= 0.
    if (this.o.sliceAxis === 'xy') { this.sliceMesh.position.z = w; this.clip.normal.set(0, 0, -1); }
    else if (this.o.sliceAxis === 'yz') { this.sliceMesh.rotation.set(Math.PI / 2, Math.PI / 2, 0); this.sliceMesh.position.x = w; this.clip.normal.set(-1, 0, 0); }
    else { this.sliceMesh.rotation.set(Math.PI / 2, 0, 0); this.sliceMesh.position.y = w; this.clip.normal.set(0, -1, 0); }
    this.clip.constant = w;
    this.lastSlice = res;
  }

  applyVisibility() {
    if (!this.mcPlus) return;
    this.mcPlus.visible = this.mcMinus.visible = this.o.surface;
    if (this.cloud) this.cloud.visible = this.o.cloud;
    this.axesObj.visible = this.o.axes;
    // A see-through surface reads better when the cloud is showing too.
    const op = this.o.cloud ? 0.35 : 0.9;
    this.matPlus.opacity = this.matMinus.opacity = op;
    this.matPlus.depthWrite = this.matMinus.depthWrite = !this.o.cloud;
  }

  info() {
    const orb = this.orb;
    return {
      orb,
      threshold: this.threshold,
      extentA0: this.o.trueScale ? MAX_EXTENT : H.extentFor(orb.n),
      radialNodes: H.radialNodePositions(orb.n, orb.l),
      rmp: H.mostProbableRadius(orb.n, orb.l),
      slice: this.o.slice ? this.lastSlice : null,
      options: { ...this.o },
    };
  }

  resetView() {
    if (!this.stage) return;
    this.stage.camera.position.set(3.5, 2.7, 1.95);
    this.stage.controls?.target.set(0, 0, 0);
    this.stage.controls?.update();
  }

  snapshot() {
    if (!this.stage) return null;
    this.stage.render();
    return this.stage.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.listeners.clear();
    this.stage?.dispose();
  }
}
