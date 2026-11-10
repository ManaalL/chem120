/* CHEM 120 Interactive: 3D model registry. Pages load this lazily (only when a 3D figure scrolls into view).
   mountModel(host, type, params, ctx) imports the model's module, mounts it (or its 2D fallback without WebGL) and returns {dispose}. */
import { webglOK } from "./viewer.mjs";
const MODULES = {
  orbital: "./orbital.mjs",
  molecule: "./molecule.mjs",
  lattice: "./lattice.mjs",
  bohr: "./bohr.mjs",
  emwave: "./waves.mjs",
  ringwave: "./waves.mjs",
  aufbau: "./aufbau.mjs",
  shells: "./shells.mjs",
  trends: "./trends.mjs",
  particles: "./particles.mjs",
  sterngerlach: "./waves.mjs"
};
/* models that live in a shared module export mount<Type> / fallback<Type> */
const EXPORT = { emwave: "EmWave", ringwave: "RingWave", sterngerlach: "SternGerlach" };
export const TYPES = Object.keys(MODULES);
export async function mountModel(host, type, params = {}, ctx = {}) {
  const path = MODULES[type]; if (!path) throw new Error("Unknown 3D model type: " + type);
  const mod = await import(path);
  const sfx = EXPORT[type] || "";
  const gl = webglOK();
  const fn = gl ? mod["mount" + sfx] : mod["fallback" + sfx];
  if (typeof fn !== "function") throw new Error(`Model ${type} has no ${gl ? "mount" : "fallback"}${sfx}()`);
  try { return fn(host, params, ctx); }
  catch (e) { console.error(e); const f = mod["fallback" + sfx]; if (gl && typeof f === "function") { host.innerHTML = ""; return f(host, params, ctx); } throw e; }
}
export { webglOK };
