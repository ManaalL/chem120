// Linked radial plots: R(r), R(r)^2 and the radial distribution function r^2 R(r)^2.
import { h, katexString } from '../ui/dom.js';
import { Plot } from '../ui/plot.js';
import * as H from '../core/hydrogen.js';

const RANGE_PM = { 1: 400, 2: 1100, 3: 1700, 4: 2700, 5: 3900, 6: 5400 };

export class RadialGraphs {
  constructor(container, { compact = false, which = ['R', 'R2', 'RDF'] } = {}) {
    this.el = h('div', { class: `radial-graphs ${compact ? 'compact' : ''}` });
    container.append(this.el);
    const defs = {
      R: { title: 'R(r)', sub: 'Radial factor. Crossings of the axis are radial nodes.' },
      R2: { title: '[R(r)]^2', sub: 'Density along one direction out from the nucleus.' },
      RDF: { title: 'r^2[R(r)]^2', sub: 'Radial distribution. Peak marks the most probable radius.' },
    };
    this.plots = {};
    for (const k of which) {
      const box = h('figure', { class: 'graph' },
        h('figcaption', {}, h('span', { class: 'graph-title', html: katexString(defs[k].title) }), compact ? null : h('span', { class: 'graph-sub' }, defs[k].sub)));
      const holder = h('div', { class: 'graph-canvas' });
      box.append(holder);
      this.el.append(box);
      this.plots[k] = new Plot(holder, { aspect: compact ? 0.62 : 0.7, xLabel: 'r (pm)', yFormat: (v) => +v.toPrecision(2), hideY: false, padding: { l: 48 }, ariaLabel: `${defs[k].title} plotted against r` });
    }
  }

  update(n, l) {
    const rmax = RANGE_PM[n];
    const N = 500;
    const pts = { R: [], R2: [], RDF: [] };
    for (let i = 0; i <= N; i++) {
      const rpm = (rmax * i) / N, r = rpm / H.A0_PM;
      const R = H.radial(n, l, r);
      pts.R.push([rpm, R]); pts.R2.push([rpm, R * R]); pts.RDF.push([rpm, r * r * R * R]);
    }
    const nodes = H.radialNodePositions(n, l).map((r) => r * H.A0_PM);
    const rmp = H.mostProbableRadius(n, l) * H.A0_PM;
    const nodeLines = nodes.map((x, i) => ({ x, color: 'rgba(223,231,239,0.55)', dash: [3, 4], label: `node ${Math.round(x)} pm`, row: i }));
    const line = '#e6ebf0';
    const fill = 'rgba(64,196,230,0.12)';
    this.plots.R?.set({ series: [{ data: pts.R, color: line }], vlines: nodeLines, xRange: [0, rmax] });
    const quietLines = nodeLines.map((v) => ({ ...v, label: null }));   // label nodes once, on the R(r) plot
    this.plots.R2?.set({ series: [{ data: pts.R2, color: line, fill }], vlines: quietLines, xRange: [0, rmax] });
    if (this.plots.RDF) {
      const peak = pts.RDF.reduce((a, b) => (b[1] > a[1] ? b : a));
      this.plots.RDF.set({
        series: [{ data: pts.RDF, color: line, fill }],
        vlines: [...quietLines, { x: rmp, color: '#ff6a55', dash: [], width: 1.5, label: `r_mp ≈ ${Math.round(rmp)} pm`, align: rmp > rmax * 0.55 ? 'right' : 'left', row: 0 }],
        points: [{ x: rmp, y: peak[1], color: '#ff6a55' }],
        xRange: [0, rmax],
      });
    }
    return { nodes, rmp };
  }

  dispose() { Object.values(this.plots).forEach((p) => p.dispose()); }
}
