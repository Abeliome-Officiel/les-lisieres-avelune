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
const copyReport = $('#copy-report');
const copyStatus = $('#copy-status');
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

const samples = { frame: [], plan: [], draw: [] };
let lastFrameAt = performance.now();
let lastMetricsAt = 0;
let staticPlan = null;
let beforePlan = null;
let afterPlan = null;
let latestReport = null;

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
  const options = { quality: quality.value, reducedMotion: reducedMotion.checked };

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

  const started = performance.now();
  beforePlan = planScene(beforePayload, options);
  afterPlan = planScene(afterPayload, options);
  pushSample('plan', performance.now() - started);
  staticPlan = null;
  count.disabled = true;
  status.textContent = reducedMotion.checked
    ? 'Transformation synthétique figée à mi-parcours : information conservée, animation supprimée.'
    : 'Transformation synthétique en boucle de laboratoire, non canonique.';
}

function currentPlan(now) {
  if (staticPlan) return staticPlan;
  const started = performance.now();
  const rawProgress = reducedMotion.checked ? 0.5 : 0.5 - 0.5 * Math.cos((now / 6500) * Math.PI * 2);
  const plan = interpolatePlans(beforePlan, afterPlan, rawProgress);
  pushSample('plan', performance.now() - started);
  return plan;
}

function reportFor(plan, drawResult) {
  const frameP50 = percentile(samples.frame, 0.5);
  const frameP95 = percentile(samples.frame, 0.95);
  const frameP99 = percentile(samples.frame, 0.99);
  const planP95 = percentile(samples.plan, 0.95);
  const drawP95 = percentile(samples.draw, 0.95);
  return {
    probe: 'avelune-visuel2-canvas-reference-0.1',
    captured_at: new Date().toISOString(),
    scenario: scenario.value,
    quality: quality.value,
    reduced_motion: reducedMotion.checked,
    entities: plan.entities.length,
    metrics: {
      fps_observed: frameP50 > 0 ? Number((1000 / frameP50).toFixed(2)) : 0,
      frame_interval_p50_ms: Number(frameP50.toFixed(3)),
      frame_interval_p95_ms: Number(frameP95.toFixed(3)),
      frame_interval_p99_ms: Number(frameP99.toFixed(3)),
      plan_or_interpolation_p95_ms: Number(planP95.toFixed(4)),
      canvas_commands_p95_ms: Number(drawP95.toFixed(4)),
      estimated_draw_calls: drawResult.drawCalls
    },
    display: {
      canvas_buffer: `${canvas.width}x${canvas.height}`,
      device_pixel_ratio: window.devicePixelRatio || 1
    },
    runtime: {
      user_agent: navigator.userAgent,
      hardware_concurrency: navigator.hardwareConcurrency ?? null,
      device_memory_gib_hint: navigator.deviceMemory ?? null
    },
    caveats: ['GPU time not measured', 'energy not measured', 'synthetic non-canonical data']
  };
}

function renderMetrics(now, plan, drawResult) {
  if (now - lastMetricsAt < 250) return;
  lastMetricsAt = now;
  latestReport = reportFor(plan, drawResult);
  const m = latestReport.metrics;
  metrics.innerHTML = `
    <div><strong>${latestReport.entities}</strong><span>formes</span></div>
    <div><strong>${m.fps_observed.toFixed(1)}</strong><span>FPS observés</span></div>
    <div><strong>${m.frame_interval_p95_ms.toFixed(2)} ms</strong><span>intervalle frame p95</span></div>
    <div><strong>${m.frame_interval_p99_ms.toFixed(2)} ms</strong><span>intervalle frame p99</span></div>
    <div><strong>${m.plan_or_interpolation_p95_ms.toFixed(3)} ms</strong><span>plan/interpolation p95</span></div>
    <div><strong>${m.canvas_commands_p95_ms.toFixed(3)} ms</strong><span>commandes Canvas p95</span></div>
    <div><strong>${m.estimated_draw_calls}</strong><span>appels dessin estimés</span></div>
    <div><strong>${latestReport.display.canvas_buffer}</strong><span>buffer pixels</span></div>
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
    samples.frame.length = 0;
    samples.plan.length = 0;
    samples.draw.length = 0;
    copyStatus.textContent = '';
    rebuildPlans();
  });
}

copyReport.addEventListener('click', async () => {
  if (!latestReport) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(latestReport, null, 2));
    copyStatus.textContent = 'Relevé copié. Collez-le dans la conversation.';
  } catch {
    copyStatus.textContent = 'Copie automatique indisponible dans ce navigateur.';
  }
});

const observer = new ResizeObserver(resize);
observer.observe(canvas);
resize();
rebuildPlans();
requestAnimationFrame(frame);
