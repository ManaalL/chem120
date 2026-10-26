/* CHEM 120 Interactive: shared 3D viewer.
   One Viewer per figure. It owns the renderer, camera, orbit controls, lights, the label layer and the toolbar.
   - renders on demand (only while something moves), pauses off screen and in hidden tabs
   - frees every geometry, material, texture and the WebGL context on dispose()
   - drag to rotate, scroll or pinch to zoom; buttons for reset, zoom and turning; keyboard: arrows rotate, + and - zoom, R resets
   - colours come from the page's CSS variables, so light and dark mode both work */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export { THREE };

const REG = window.C120_3D = window.C120_3D || { live: new Set(), created: 0, disposed: 0 };
const reduced = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

export function webglOK() {
  if (/[?&]nowebgl\b/.test(location.search)) return false;
  try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; }
}

/* read the site palette from CSS variables on (or above) an element */
export function palette(node) {
  const cs = getComputedStyle(node || document.documentElement);
  const v = (n, d) => (cs.getPropertyValue(n) || "").trim() || d;
  const dark = document.documentElement.getAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    dark,
    paper: v("--paper", "#ffffff"), ink: v("--ink", "#1c2624"), ink2: v("--ink2", "#5a6a65"), head: v("--head", "#14302b"),
    stroke: v("--fig-stroke", "#24423b"), axis: v("--fig-axis", "#5a6a65"), rule: v("--rule", "#d9e2de"), soft: v("--fig-soft", "#eef3ef"),
    accent: v("--c", v("--accent", "#2a7f6d")), pos: v("--phase-pos", "#c4553a"), neg: v("--phase-neg", "#2f74a8"),
    ok: v("--ok", "#2a7648"), bad: v("--bad", "#a53838"), warn: v("--warn", "#b07a12")
  };
}
export const col = (c) => new THREE.Color(c);

let dotTex = null;
export function dotTexture() {
  if (dotTex) return dotTex;
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c); return dotTex;
}

/* a standard material with optional diagonal hatching computed from world position.
   Hatching marks the negative phase of an orbital (or a negative partial charge) so sign never depends on colour alone. */
export function surfaceMaterial(color, o = {}) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: o.roughness ?? 0.48, metalness: 0.02, transparent: o.opacity != null && o.opacity < 1, opacity: o.opacity ?? 1, side: o.side ?? THREE.FrontSide, depthWrite: o.depthWrite ?? true });
  if (o.hatch) {
    m.userData.hatch = { value: o.hatchScale || 18 };
    m.onBeforeCompile = (sh) => {
      sh.uniforms.hatchK = m.userData.hatch;
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;").replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;\nuniform float hatchK;").replace("#include <dithering_fragment>", "#include <dithering_fragment>\nfloat hs = fract((vWPos.x + vWPos.y - vWPos.z) * hatchK);\nfloat hl = smoothstep(0.0, 0.06, hs) * (1.0 - smoothstep(0.22, 0.28, hs));\ngl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.66, hl);");
    };
    m.customProgramCacheKey = () => "hatch";
  }
  return m;
}

export class Viewer {
  constructor(host, o = {}) {
    this.o = { aspect: 0.72, minH: 260, maxH: 560, fov: 32, cam: [3.4, 2.6, 2.2], target: [0, 0, 0], zUp: true, autoRotate: false, minD: 1.2, maxD: 14, pan: false, label: "Interactive 3D model", tools: true, ...o };
    this.host = host; this.anims = new Set(); this.labels = []; this.themeFns = []; this.disposers = []; this.visible = false; this.raf = 0; this.dead = false;
    const wrap = this.wrap = document.createElement("div");
    wrap.className = "v3d"; wrap.tabIndex = 0; wrap.setAttribute("role", "application"); wrap.setAttribute("aria-roledescription", "3D model"); wrap.setAttribute("aria-label", this.o.label + ". Drag to rotate, scroll or pinch to zoom. Keyboard: arrow keys rotate, plus and minus zoom, R resets the view.");
    host.append(wrap);
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!window.__C120_TEST__ });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.localClippingEnabled = true;
    wrap.append(r.domElement);
    this.layer = document.createElement("div"); this.layer.className = "v3d-labels"; wrap.append(this.layer);
    this.scene = new THREE.Scene();
    const cam = this.camera = new THREE.PerspectiveCamera(this.o.fov, 1, 0.01, 500);
    if (this.o.zUp) cam.up.set(0, 0, 1);
    cam.position.set(...this.o.cam);
    const c = this.controls = new OrbitControls(cam, r.domElement);
    c.enableDamping = !reduced(); c.dampingFactor = 0.09; c.enablePan = this.o.pan; c.minDistance = this.o.minD; c.maxDistance = this.o.maxD;
    c.target.set(...this.o.target); c.autoRotate = this.o.autoRotate && !reduced(); c.autoRotateSpeed = 0.7; c.update();
    c.addEventListener("change", () => this.requestRender());
    c.addEventListener("start", () => { wrap.classList.add("grab"); if (this.o.onInteract) this.o.onInteract(); });
    c.addEventListener("end", () => wrap.classList.remove("grab"));
    this.home = { pos: cam.position.clone(), target: c.target.clone() };
    this.lights();
    this.pal = palette(host);
    if (this.o.tools) this.toolbar();
    this.keys();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(wrap);
    this.io = new IntersectionObserver((es) => { this.visible = es[es.length - 1].isIntersecting; if (this.visible) { this.resize(); this.requestRender(); } }, { rootMargin: "120px" });
    this.io.observe(wrap);
    this.onVis = () => { if (!document.hidden) this.requestRender(); };
    document.addEventListener("visibilitychange", this.onVis);
    this.onTheme = () => { this.pal = palette(host); this.themeFns.forEach((f) => { try { f(this.pal); } catch (e) { console.error(e); } }); this.requestRender(); };
    document.addEventListener("c120-theme", this.onTheme);
    REG.live.add(this); REG.created++;
    this.resize();
  }
  lights() {
    const s = this.scene;
    s.add(new THREE.HemisphereLight(0xffffff, 0x9a948a, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(3, 2, 6); s.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.45); fill.position.set(-4, -3, 2); s.add(fill);
    this.keyLight = key;
  }
  toolbar() {
    const bar = this.bar = document.createElement("div"); bar.className = "v3d-tools";
    const b = (t, title, fn) => { const x = document.createElement("button"); x.type = "button"; x.className = "v3b"; x.innerHTML = t; x.title = title; x.setAttribute("aria-label", title); x.onclick = (e) => { e.stopPropagation(); fn(x); this.wrap.focus({ preventScroll: true }); }; bar.append(x); return x; };
    b("Reset view", "Reset view", () => this.resetView());
    b("+", "Zoom in", () => this.zoom(0.8));
    b("−", "Zoom out", () => this.zoom(1.25));
    if (!reduced()) { const t = b("Turn", "Turn slowly on its own", (x) => { this.controls.autoRotate = !this.controls.autoRotate; x.setAttribute("aria-pressed", String(this.controls.autoRotate)); this.requestRender(); }); t.setAttribute("aria-pressed", String(this.controls.autoRotate)); }
    this.wrap.append(bar);
  }
  addTool(text, title, fn, pressed) { if (!this.bar) return null; const x = document.createElement("button"); x.type = "button"; x.className = "v3b"; x.innerHTML = text; x.title = title; x.setAttribute("aria-label", title); if (pressed != null) x.setAttribute("aria-pressed", String(pressed)); x.onclick = (e) => { e.stopPropagation(); fn(x); this.requestRender(); }; this.bar.append(x); return x; }
  keys() {
    this.wrap.addEventListener("keydown", (e) => {
      const k = e.key; const step = 0.12;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "r", "R"].includes(k)) e.preventDefault(); else return;
      if (k === "r" || k === "R") return this.resetView();
      if (k === "+" || k === "=") return this.zoom(0.85);
      if (k === "-" || k === "_") return this.zoom(1.18);
      this.orbit(k === "ArrowLeft" ? -step : k === "ArrowRight" ? step : 0, k === "ArrowUp" ? -step : k === "ArrowDown" ? step : 0);
    });
  }
  orbit(dTheta, dPhi) {
    const c = this.controls, cam = this.camera;
    const off = cam.position.clone().sub(c.target);
    const up = cam.up.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3(0, 1, 0));
    off.applyQuaternion(q);
    const sph = new THREE.Spherical().setFromVector3(off);
    sph.theta -= dTheta; sph.phi = Math.min(Math.PI - 0.05, Math.max(0.05, sph.phi + dPhi));
    off.setFromSpherical(sph).applyQuaternion(q.invert());
    cam.position.copy(c.target).add(off); c.update(); this.requestRender();
  }
  zoom(f) { const c = this.controls, cam = this.camera; const off = cam.position.clone().sub(c.target); const d = Math.min(c.maxDistance, Math.max(c.minDistance, off.length() * f)); cam.position.copy(c.target).add(off.setLength(d)); c.update(); this.requestRender(); }
  resetView() { this.camera.position.copy(this.home.pos); this.controls.target.copy(this.home.target); this.controls.update(); this.requestRender(); }
  setHome(pos, target) { this.home = { pos: new THREE.Vector3(...pos), target: new THREE.Vector3(...(target || [0, 0, 0])) }; this.resetView(); }
  resize() {
    if (this.dead) return;
    const w = this.wrap.clientWidth; if (!w) return;
    const h = Math.round(Math.min(this.o.maxH, Math.max(this.o.minH, w * this.o.aspect)));
    this.wrap.style.height = h + "px";
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = w + "px"; this.renderer.domElement.style.height = h + "px";
    this.camera.aspect = w / h;
    this.camera.zoom = Math.min(1, (w / h) * 1.15);
    this.camera.updateProjectionMatrix();
    this.requestRender();
  }
  requestRender() { if (this.dead || this.raf || !this.visible || document.hidden) return; this.raf = requestAnimationFrame((t) => this.frame(t)); }
  frame(t) {
    this.raf = 0; if (this.dead) return;
    const now = t / 1000; const dt = Math.min(0.05, now - (this.last || now)); this.last = now;
    let more = false;
    for (const a of [...this.anims]) { let keep = false; try { keep = a(dt, now); } catch (e) { console.error(e); } if (keep) more = true; else this.anims.delete(a); }
    const moved = this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.drawLabels();
    if (!this.rendered) { this.rendered = true; this.wrap.dataset.ready = "1"; this.host.dispatchEvent(new CustomEvent("v3d-ready", { bubbles: true })); }
    if (more || moved || this.controls.autoRotate) this.raf = requestAnimationFrame((tt) => this.frame(tt)); else this.last = 0;
  }
  /* animator: fn(dt, t) returns true while it wants more frames */
  animate(fn) { this.anims.add(fn); this.last = 0; this.requestRender(); return () => this.anims.delete(fn); }
  theme(fn, now = true) { this.themeFns.push(fn); if (now) fn(this.pal); }
  /* HTML label pinned to a 3D point. html may contain $..$ math. */
  label(html, pos, cls = "") {
    const el = document.createElement("div"); el.className = "v3l " + cls;
    const rich = window.C120 && window.C120.rich ? window.C120.rich : (s) => s;
    el.innerHTML = rich(html);
    this.layer.append(el);
    const L = { el, pos: pos.clone ? pos.clone() : new THREE.Vector3(...pos), visible: true, obj: null, set: (h) => { el.innerHTML = rich(h); }, remove: () => { el.remove(); this.labels = this.labels.filter((x) => x !== L); } };
    this.labels.push(L); this.requestRender(); return L;
  }
  clearLabels(cls) { this.labels.filter((l) => !cls || l.el.classList.contains(cls)).forEach((l) => l.remove()); }
  drawLabels() {
    if (!this.labels.length) return;
    const w = this.wrap.clientWidth, h = this.wrap.clientHeight; const v = new THREE.Vector3();
    for (const L of this.labels) {
      if (!L.visible) { L.el.style.display = "none"; continue; }
      v.copy(L.pos); if (L.obj) L.obj.localToWorld(v);
      v.project(this.camera);
      if (v.z > 1 || v.z < -1) { L.el.style.display = "none"; continue; }
      L.el.style.display = "";
      L.el.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(1)}px, ${((1 - v.y) / 2 * h).toFixed(1)}px) translate(-50%, -50%)`;
    }
  }
  /* labelled axes through the origin, half-length L */
  axes(L = 1.3, names = ["x", "y", "z"]) {
    const g = new THREE.Group(); const mat = new THREE.LineBasicMaterial({ color: this.pal.axis, transparent: true, opacity: 0.7 });
    const dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]; const labs = [];
    dirs.forEach((d, i) => {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-d[0] * L, -d[1] * L, -d[2] * L), new THREE.Vector3(d[0] * L, d[1] * L, d[2] * L)]);
      g.add(new THREE.Line(geo, mat));
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.025 * L, 0.08 * L, 12), new THREE.MeshBasicMaterial({ color: this.pal.axis }));
      cone.position.set(d[0] * L, d[1] * L, d[2] * L); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...d)); g.add(cone);
      labs.push(this.label(`<i>${names[i]}</i>`, new THREE.Vector3(d[0] * L * 1.1, d[1] * L * 1.1, d[2] * L * 1.1), "axis"));
    });
    this.theme((p) => { mat.color.set(p.axis); g.children.forEach((o) => { if (o.isMesh) o.material.color.set(p.axis); }); });
    g.setVisible = (on) => { g.visible = on; labs.forEach((l) => (l.visible = on)); this.requestRender(); };
    this.scene.add(g); return g;
  }
  /* raycast from a pointer event against a list of objects */
  pick(ev, objects) {
    const r = this.renderer.domElement.getBoundingClientRect();
    const p = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    const rc = new THREE.Raycaster(); rc.setFromCamera(p, this.camera);
    return rc.intersectObjects(objects, true);
  }
  /* turn a pointer drag on the canvas into a click only when it barely moved (so rotating never selects) */
  onTap(fn) {
    let down = null; const el = this.renderer.domElement;
    const pd = (e) => { down = { x: e.clientX, y: e.clientY }; };
    const pu = (e) => { if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) fn(e); down = null; };
    el.addEventListener("pointerdown", pd); el.addEventListener("pointerup", pu);
    this.disposers.push(() => { el.removeEventListener("pointerdown", pd); el.removeEventListener("pointerup", pu); });
  }
  add(...objs) { this.scene.add(...objs); this.requestRender(); }
  remove(obj) { if (!obj) return; this.scene.remove(obj); disposeTree(obj); this.requestRender(); }
  dispose() {
    if (this.dead) return; this.dead = true;
    cancelAnimationFrame(this.raf); this.anims.clear();
    this.disposers.forEach((f) => { try { f(); } catch (e) {} });
    this.ro.disconnect(); this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVis); document.removeEventListener("c120-theme", this.onTheme);
    this.controls.dispose();
    disposeTree(this.scene);
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    try { this.renderer.forceContextLoss(); } catch (e) {}
    this.wrap.remove();
    REG.live.delete(this); REG.disposed++;
  }
}
export function disposeTree(root) {
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { for (const k in x) { const v = x[k]; if (v && v.isTexture && v !== dotTex) v.dispose(); } x.dispose(); });
  });
}

/* ---------- small geometry helpers ---------- */
const UP = new THREE.Vector3(0, 1, 0);
/* a cylinder from a to b */
export function rod(a, b, r, mat, seg = 20) {
  const A = a.isVector3 ? a : new THREE.Vector3(...a), B = b.isVector3 ? b : new THREE.Vector3(...b);
  const d = B.clone().sub(A); const len = d.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg, 1, false), mat);
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
  return m;
}
/* an arrow from a to b with a cone head */
export function arrow(a, b, r, mat, head = 3.2) {
  const A = a.isVector3 ? a : new THREE.Vector3(...a), B = b.isVector3 ? b : new THREE.Vector3(...b);
  const d = B.clone().sub(A); const len = d.length(); const hl = Math.min(len * 0.45, r * head * 2.2);
  const g = new THREE.Group();
  const dir = d.clone().normalize();
  const shaftEnd = B.clone().sub(dir.clone().multiplyScalar(hl));
  if (len > hl) g.add(rod(A, shaftEnd, r, mat, 14));
  const cone = new THREE.Mesh(new THREE.ConeGeometry(r * head * 0.75, hl, 18), mat);
  cone.position.copy(shaftEnd).add(dir.clone().multiplyScalar(hl / 2)); cone.quaternion.setFromUnitVectors(UP, dir);
  g.add(cone); return g;
}
/* an arc between two directions around a centre, for angle measurements */
export function arcLine(center, u, v, radius, mat, n = 40) {
  const U = u.clone().normalize(), V = v.clone().normalize();
  const ang = U.angleTo(V); const axis = new THREE.Vector3().crossVectors(U, V).normalize();
  const pts = [];
  for (let i = 0; i <= n; i++) { const q = new THREE.Quaternion().setFromAxisAngle(axis, (ang * i) / n); pts.push(U.clone().applyQuaternion(q).multiplyScalar(radius).add(center)); }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
}
