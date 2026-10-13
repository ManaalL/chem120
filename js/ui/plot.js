// Lightweight canvas plotting for the dark theme.
// Handles axes, ticks, multiple series, marker lines and points, and resizes with its container.

// Colours come from the element's own context, so plots inside dark instrument panels
// and plots on the page each pick up the right palette.
const css = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();

function niceStep(range, target = 5) {
  const raw = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return step * mag;
}

export class Plot {
  /**
   * @param {HTMLElement} container
   * @param {object} o  xLabel, yLabel, aspect (h/w), xFormat, yFormat, yZeroLine, padding
   */
  constructor(container, o = {}) {
    this.o = { aspect: 0.6, xFormat: (v) => +v.toPrecision(3), yFormat: (v) => +v.toPrecision(3), ...o };
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'plot';
    this.canvas.setAttribute('role', 'img');
    if (o.ariaLabel) this.canvas.setAttribute('aria-label', o.ariaLabel);
    container.append(this.canvas);
    this.series = [];
    this.vlines = [];
    this.points = [];
    this.bands = [];
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.container = container;
  }

  resize() {
    const w = this.container.clientWidth;
    if (!w) return;
    const hgt = Math.round(this.o.height ?? w * this.o.aspect);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = w * dpr; this.canvas.height = hgt * dpr;
    this.canvas.style.width = `${w}px`; this.canvas.style.height = `${hgt}px`;
    this.dpr = dpr; this.w = w; this.h = hgt;
    this.draw();
  }

  // series: [{data: [[x,y],...], color, width, dash, label, fill}]
  set({ series = this.series, vlines = this.vlines, points = this.points, bands = this.bands, xRange, yRange } = {}) {
    this.series = series; this.vlines = vlines; this.points = points; this.bands = bands;
    if (xRange) this.o.xRange = xRange;
    if (yRange !== undefined) this.o.yRange = yRange;
    this.draw();
  }

  bounds() {
    let [x0, x1] = this.o.xRange || [Infinity, -Infinity];
    let y0 = Infinity, y1 = -Infinity;
    for (const s of this.series) for (const [x, y] of s.data) {
      if (!this.o.xRange) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      if (isFinite(y)) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
    for (const p of this.points) { y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
    if (this.o.yRange) [y0, y1] = this.o.yRange;
    if (!isFinite(y0)) { y0 = 0; y1 = 1; }
    if (y0 > 0 && !this.o.yRange) y0 = 0;
    if (y1 === y0) y1 = y0 + 1;
    if (!this.o.yRange) { const pad = (y1 - y0) * 0.08; y1 += pad; if (y0 < 0) y0 -= pad; }
    return { x0, x1, y0, y1 };
  }

  draw() {
    const c = this.canvas.getContext('2d');
    if (!this.w) return;
    const { dpr, w, h } = this;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    const pad = { l: 56, r: 14, t: 14, b: 40, ...this.o.padding };
    const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
    const { x0, x1, y0, y1 } = this.bounds();
    const X = (x) => pad.l + ((x - x0) / (x1 - x0)) * pw;
    const Y = (y) => pad.t + ph - ((y - y0) / (y1 - y0)) * ph;
    this.map = { X, Y, pad, pw, ph, x0, x1, y0, y1 };

    const grid = css(this.canvas, '--plot-grid') || '#253040';
    const axis = css(this.canvas, '--muted') || '#93a0b0';
    const font = '12px "IBM Plex Sans", system-ui, sans-serif';
    c.font = font;
    c.fillStyle = axis;

    // bands (e.g. visible region)
    for (const b of this.bands) {
      c.fillStyle = b.color;
      c.fillRect(X(b.from), pad.t, X(b.to) - X(b.from), ph);
    }

    // grid + ticks
    c.strokeStyle = grid; c.lineWidth = 1;
    const xs = niceStep(x1 - x0, Math.max(3, Math.floor(pw / 90)));
    const ys = niceStep(y1 - y0, Math.max(3, Math.floor(ph / 50)));
    c.fillStyle = axis; c.textAlign = 'center'; c.textBaseline = 'top';
    for (let v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9 * xs; v += xs) {
      const px = Math.round(X(v)) + 0.5;
      c.beginPath(); c.moveTo(px, pad.t); c.lineTo(px, pad.t + ph); c.stroke();
      c.fillText(this.o.xFormat(Math.abs(v) < xs * 1e-6 ? 0 : v), px, pad.t + ph + 6);
    }
    c.textAlign = 'right'; c.textBaseline = 'middle';
    if (!this.o.hideY) {
      for (let v = Math.ceil(y0 / ys) * ys; v <= y1 + 1e-9 * ys; v += ys) {
        const py = Math.round(Y(v)) + 0.5;
        c.beginPath(); c.moveTo(pad.l, py); c.lineTo(pad.l + pw, py); c.stroke();
        c.fillText(this.o.yFormat(Math.abs(v) < ys * 1e-6 ? 0 : v), pad.l - 8, py);
      }
    }
    // zero line
    if (y0 < 0 && y1 > 0) {
      c.strokeStyle = axis; c.globalAlpha = 0.6;
      c.beginPath(); c.moveTo(pad.l, Y(0)); c.lineTo(pad.l + pw, Y(0)); c.stroke();
      c.globalAlpha = 1;
    }
    // axis labels
    c.fillStyle = axis; c.textAlign = 'center'; c.textBaseline = 'bottom';
    if (this.o.xLabel) c.fillText(this.o.xLabel, pad.l + pw / 2, h - 2);
    if (this.o.yLabel) {
      c.save(); c.translate(13, pad.t + ph / 2); c.rotate(-Math.PI / 2);
      c.textBaseline = 'middle'; c.fillText(this.o.yLabel, 0, 0); c.restore();
    }

    // clip to plot area
    c.save();
    c.beginPath(); c.rect(pad.l, pad.t, pw, ph); c.clip();

    for (const s of this.series) {
      if (!s.data.length) continue;
      c.beginPath();
      let started = false;
      for (const [x, y] of s.data) {
        if (!isFinite(y)) { started = false; continue; }
        const py = Math.max(-1e4, Math.min(1e4, Y(y)));
        if (!started) { c.moveTo(X(x), py); started = true; } else c.lineTo(X(x), py);
      }
      if (s.fill) {
        c.lineTo(X(s.data[s.data.length - 1][0]), Y(Math.max(0, y0)));
        c.lineTo(X(s.data[0][0]), Y(Math.max(0, y0)));
        c.closePath(); c.fillStyle = s.fill; c.fill();
        c.beginPath(); started = false;
        for (const [x, y] of s.data) { const py = Y(y); if (!started) { c.moveTo(X(x), py); started = true; } else c.lineTo(X(x), py); }
      }
      c.strokeStyle = s.color; c.lineWidth = s.width ?? 2;
      c.setLineDash(s.dash || []);
      c.stroke();
      c.setLineDash([]);
    }

    for (const v of this.vlines) {
      c.strokeStyle = v.color || axis; c.lineWidth = v.width ?? 1;
      c.setLineDash(v.dash || [4, 4]);
      c.beginPath(); c.moveTo(X(v.x), pad.t); c.lineTo(X(v.x), pad.t + ph); c.stroke();
      c.setLineDash([]);
      if (v.label) {
        c.fillStyle = v.color || axis; c.textAlign = v.align || 'left'; c.textBaseline = 'top';
        c.fillText(v.label, X(v.x) + (v.align === 'right' ? -6 : 6), pad.t + 4 + (v.row || 0) * 16);
      }
    }
    for (const p of this.points) {
      c.fillStyle = p.color; c.beginPath(); c.arc(X(p.x), Y(p.y), p.r ?? 4, 0, Math.PI * 2); c.fill();
      if (p.ring) { c.strokeStyle = p.ring; c.lineWidth = 2; c.stroke(); }
      if (p.label) { c.fillStyle = p.labelColor || p.color; c.textAlign = 'left'; c.textBaseline = 'bottom'; c.fillText(p.label, X(p.x) + 7, Y(p.y) - 4); }
    }
    c.restore();
    // frame
    c.strokeStyle = grid; c.strokeRect(pad.l + 0.5, pad.t + 0.5, pw, ph);
  }

  dispose() { this.ro.disconnect(); }
}

// Samples f over [a, b] into [[x, y], ...]
export function sample(f, a, b, n = 400) {
  const out = [];
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; out.push([x, f(x)]); }
  return out;
}
