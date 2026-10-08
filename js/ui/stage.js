// Shared Three.js setup: renderer, camera, orbit controls, resize handling,
// and pausing when the view is off screen so several 3D figures on one page stay light.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { h, reducedMotion } from './dom.js';

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

export function noWebGL(container) {
  container.append(h('div', { class: 'no-webgl' },
    h('p', {}, 'This 3D view needs WebGL, which is turned off or unavailable in this browser.'),
    h('p', {}, 'Turning on hardware acceleration in your browser settings usually fixes it. The graphs and calculations on this page still work.')));
}

/**
 * @param {HTMLElement} container  element that receives the canvas
 * @param {object} o  fov, position [x,y,z], target, controls (bool), autoRotate, background
 */
export function createStage(container, o = {}) {
  if (!webglAvailable()) { noWebGL(container); return null; }
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!o.preserve });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.append(renderer.domElement);
  renderer.domElement.classList.add('stage-canvas');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(o.fov ?? 40, 1, 0.01, 2000);
  // Chemistry convention puts z up; most scenes here use it.
  if (o.zUp) camera.up.set(0, 0, 1);
  camera.position.set(...(o.position || [3, 2.2, 3.4]));

  let controls = null;
  if (o.controls !== false) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = !!o.pan;
    controls.autoRotate = !!o.autoRotate && !reducedMotion();
    controls.autoRotateSpeed = o.autoRotateSpeed ?? 0.8;
    if (o.minDistance) controls.minDistance = o.minDistance;
    if (o.maxDistance) controls.maxDistance = o.maxDistance;
    if (o.target) controls.target.set(...o.target);
    controls.update();
  } else if (o.target) camera.lookAt(...o.target);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fd8ff, 0.6); rim.position.set(-5, -2, -4); scene.add(rim);

  let w = 0, hgt = 0;
  function resize() {
    w = container.clientWidth; hgt = container.clientHeight || Math.round(w * (o.aspect ?? 0.66));
    if (!w) return;
    renderer.setSize(w, hgt, false);
    renderer.domElement.style.width = `${w}px`; renderer.domElement.style.height = `${hgt}px`;
    camera.aspect = w / hgt;
    // In tall, narrow views (phones, side columns) widen the view so the subject still fits across.
    camera.zoom = Math.min(1, camera.aspect * 1.05);
    camera.updateProjectionMatrix();
    if (!running) renderer.render(scene, camera);
  }
  const ro = new ResizeObserver(resize); ro.observe(container);

  let visible = true, running = false, frame = 0, loop = null, last = performance.now();
  // Widgets are often built before they are placed on the page, so start watching
  // visibility only once the container is in the document.
  const io = new IntersectionObserver((entries) => {
    const e = entries[entries.length - 1];
    visible = e.isIntersecting;
    if (visible) { resize(); kick(); }
  }, { rootMargin: '150px' });
  let watchFrame = 0;
  (function watch() {
    if (container.isConnected) { io.observe(container); resize(); kick(); return; }
    watchFrame = requestAnimationFrame(watch);
  })();

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    loop?.(dt, now / 1000);
    controls?.update();
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }
  function kick() { if (!frame) { running = true; last = performance.now(); frame = requestAnimationFrame(tick); } }
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener('visibilitychange', onVis);

  resize();
  const api = {
    THREE, scene, camera, renderer, controls,
    start(fn) { loop = fn; kick(); },
    render() { renderer.render(scene, camera); },
    dispose() {
      cancelAnimationFrame(frame); cancelAnimationFrame(watchFrame); frame = 0; ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      controls?.dispose();
      scene.traverse((obj) => {
        obj.geometry?.dispose?.();
        const m = obj.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); });
      });
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
    },
  };
  container.__stage = api; // handy for debugging in the browser console
  return api;
}

// Text label rendered to a canvas texture, for axis names inside 3D scenes.
export function textSprite(THREE_, text, { color = '#c9d3de', size = 48, scale = 0.35, font = '500 48px "IBM Plex Sans", sans-serif' } = {}) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 16;
  c.width = w; c.height = size + 16;
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'middle';
  ctx.fillText(text, 8, c.height / 2);
  const tex = new THREE_.CanvasTexture(c);
  tex.colorSpace = THREE_.SRGBColorSpace;
  const spr = new THREE_.Sprite(new THREE_.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  spr.scale.set((scale * c.width) / c.height, scale, 1);
  return spr;
}

// Thin labelled x, y, z axes of half-length L.
export function axes(THREE_, L = 1.3, color = 0x5d6b7d) {
  const g = new THREE_.Group();
  const mat = new THREE_.LineBasicMaterial({ color, transparent: true, opacity: 0.75 });
  const dirs = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
  for (const [name, d] of Object.entries(dirs)) {
    const geo = new THREE_.BufferGeometry().setFromPoints([new THREE_.Vector3(-d[0] * L, -d[1] * L, -d[2] * L), new THREE_.Vector3(d[0] * L, d[1] * L, d[2] * L)]);
    g.add(new THREE_.Line(geo, mat));
    const s = textSprite(THREE_, name, { scale: 0.16 * L, font: 'italic 500 48px "Fraunces", serif' });
    s.position.set(d[0] * (L + 0.12 * L), d[1] * (L + 0.12 * L), d[2] * (L + 0.12 * L));
    g.add(s);
  }
  return g;
}
