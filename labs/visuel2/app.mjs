import { planScene } from '../visuel1/src/planner.mjs';
import { CanvasReferenceRenderer } from './src/canvas-renderer.mjs';
import { interpolatePlans } from './src/interpolate.mjs';
import { replicateScene } from './src/replicate.mjs';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#world');
const quality = $('#quality');
const count = $('#count');
const scenario = $('#scenario');
const reducedMotion = $('#reduced-motion');
const metrics = $('#metrics');
const status = $('#status');
const renderer = new CanvasReferenceRenderer(canvas);

const fixtureRoot = '../../docs/contracts/visuel0-fixtures';

async function loadJson(name) {
  const response = await fetch(`${fixtureRoot}/${name}`);
  if (!response.ok) throw new Error(`cannot load ${name}: ${response.status}`);
  return response.json();
}

const [stablePayload, beforePayload, afterPayload] = await Promise.all([
  loadJson('stable-full.json'),
  loadJson('transition-before.json'),
  loadJson('transition-after.json')
]);

const samples = {
  frame: [],
  plan: [],
  draw: []
};
let lastFrameAt = performance.now();
let lastMetricsAt = 0;
let staticPlan = null;
let beforePlan = null;
let afterPlan = null;

function percentile(values, ratio) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio))];
}

function pushSample(kind, value) {
  const list = samples[kind];
  list.push(value);
  if (list.length > 240) list.shift();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  renderer.resize(rect.width, rect.height, window.devicePixelRatio || 1);
}

function rebuildPlans() {
  const options = {
    quality: quality.value,
    reducedMotion: reducedMotion.checked
  };

  if (scenario.value === 'stable') {
    const payload = replicateScene(stablePayload, Number(count.value));
    const started = performance.now();
    staticPlan = planScene(payload, options);
    pushSample('plan', performance.now() - started);
    beforePlan = null;
    afterPlan = null;
    count.disabled = false;
    status.textContent = 'Scène synthétique stable. Aucune donnée du Cœur.';
    return;
  }

  const beforeStarted = performance.now();
  beforePlan = planScene(beforePayload, options);
  afterPlan = planScene(afterPayload, options);
  pushSample('plan', performance.now() - beforeStarted);
  staticPlan = null;
  count.disabled = true;
  status.textContent = reducedMotion.checked
    ? 'Transformation synthétique figée à mi-parcours : information conservée, animation supprimée.'
    : 'Transformation synthétique en boucle de laboratoire, non canonique.';
}

function currentPlan(now) {
  if (staticPlan) return staticPlan;
  const started = performance.now();
  const rawProgress = reducedMotion.checked
    ? 0.5
    : 0.5 - 0.5 * Math.cos((now / 6500) * Math.PI * 2);
  const plan = interpolatePlans(beforePlan, afterPlan, rawProgress);
  pushSample('plan', performance.now() - started);
  return plan;
}

function renderMetrics(now, plan, drawResult) {
  if (now - lastMetricsAt < 250) return;
  lastMetricsAt = now;
  const frameP50 = percentile(samples.frame, 0.5);
  const frameP95 = percentile(samples.frame, 0.95);
  const frameP99 = percentile(samples.frame, 0.99);
  const planP95 = percentile(samples.plan, 0.95);
  const drawP95 = percentile(samples.draw, 0.95);
  const fps = frameP50 > 0 ? 1000 / frameP50 : 0;

  metrics.innerHTML = `
    <div><strong>${plan.entities.length}</strong><span>formes</span></div>
    <div><strong>${fps.toFixed(1)}</strong><span>FPS observés</span></div>
    <div><strong>${frameP95.toFixed(2)} ms</strong><span>intervalle frame p95</span></div>
    <div><strong>${frameP99.toFixed(2)} ms</strong><span>intervalle frame p99</span></div>
    <div><strong>${planP95.toFixed(3)} ms</strong><span>plan/interpolation p95</span></div>
    <div><strong>${drawP95.toFixed(3)} ms</strong><span>commandes Canvas p95</span></div>
    <div><strong>${drawResult.drawCalls}</strong><span>appels dessin estimés</span></div>
    <div><strong>${canvas.width}×${canvas.height}</strong><span>buffer pixels</span></div>
  `;
}

function frame(now) {
  pushSample('frame', now - lastFrameAt);
  lastFrameAt = now;
  renderer.setPresentationTime(now);
  const plan = currentPlan(now);
  const drawStarted = performance.now();
  const result = renderer.render(plan);
  pushSample('draw', performance.now() - drawStarted);
  renderMetrics(now, plan, result);
  requestAnimationFrame(frame);
}

for (const control of [quality, count, scenario, reducedMotion]) {
  control.addEventListener('change', () => {
    samples.plan.length = 0;
    samples.draw.length = 0;
    rebuildPlans();
  });
}

const observer = new ResizeObserver(resize);
observer.observe(canvas);
resize();
rebuildPlans();
requestAnimationFrame(frame);
