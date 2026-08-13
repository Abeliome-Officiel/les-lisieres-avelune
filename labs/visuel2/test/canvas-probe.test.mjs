import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { planScene } from '../../visuel1/src/planner.mjs';
import { assertRendererPort } from '../../visuel1/src/renderer-port.mjs';
import { CanvasReferenceRenderer } from '../src/canvas-renderer.mjs';
import { interpolatePlans } from '../src/interpolate.mjs';
import { replicateScene } from '../src/replicate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(here, '../../../docs/contracts/visuel0-fixtures');

async function fixture(name) {
  return JSON.parse(await readFile(path.join(fixtureRoot, name), 'utf8'));
}

class RecordingContext {
  operations = [];
  save() { this.operations.push(['save']); }
  restore() { this.operations.push(['restore']); }
  clearRect(...args) { this.operations.push(['clearRect', ...args]); }
  fillRect(...args) { this.operations.push(['fillRect', ...args]); }
  translate(...args) { this.operations.push(['translate', ...args]); }
  beginPath() { this.operations.push(['beginPath']); }
  moveTo(...args) { this.operations.push(['moveTo', ...args]); }
  lineTo(...args) { this.operations.push(['lineTo', ...args]); }
  closePath() { this.operations.push(['closePath']); }
  fill() { this.operations.push(['fill']); }
  stroke() { this.operations.push(['stroke']); }
  ellipse(...args) { this.operations.push(['ellipse', ...args]); }
  quadraticCurveTo(...args) { this.operations.push(['quadraticCurveTo', ...args]); }
  arc(...args) { this.operations.push(['arc', ...args]); }
}

class FakeCanvas {
  width = 800;
  height = 600;
  style = {};
  context = new RecordingContext();
  getContext(kind) { return kind === '2d' ? this.context : null; }
}

function translations(canvas) {
  return canvas.context.operations.filter(([name]) => name === 'translate');
}

test('Canvas reference renderer implements the replaceable renderer port', async () => {
  const canvas = new FakeCanvas();
  const renderer = assertRendererPort(new CanvasReferenceRenderer(canvas));
  const payload = await fixture('stable-full.json');
  const plan = planScene(payload, { quality: 'normal' });
  const result = renderer.render(plan);
  assert.equal(result.entities, plan.entities.length);
  assert.ok(result.drawCalls > result.entities);
});

test('same plan and presentation time produce identical drawing commands', async () => {
  const payload = await fixture('stable-full.json');
  const plan = planScene(payload, { quality: 'normal' });
  const canvasA = new FakeCanvas();
  const canvasB = new FakeCanvas();
  const rendererA = new CanvasReferenceRenderer(canvasA);
  const rendererB = new CanvasReferenceRenderer(canvasB);
  rendererA.setPresentationTime(12345);
  rendererB.setPresentationTime(12345);
  rendererA.render(plan);
  rendererB.render(plan);
  assert.deepEqual(canvasA.context.operations, canvasB.context.operations);
});

test('reduced motion removes time-dependent body translation', async () => {
  const payload = await fixture('stable-full.json');
  const normalPlan = planScene(payload, { quality: 'normal', reducedMotion: false });
  const reducedPlan = planScene(payload, { quality: 'normal', reducedMotion: true });

  const normalA = new FakeCanvas();
  const normalB = new FakeCanvas();
  const rendererNormalA = new CanvasReferenceRenderer(normalA);
  const rendererNormalB = new CanvasReferenceRenderer(normalB);
  rendererNormalA.setPresentationTime(1000);
  rendererNormalB.setPresentationTime(4000);
  rendererNormalA.render(normalPlan);
  rendererNormalB.render(normalPlan);
  assert.notDeepEqual(translations(normalA), translations(normalB));

  const reducedA = new FakeCanvas();
  const reducedB = new FakeCanvas();
  const rendererReducedA = new CanvasReferenceRenderer(reducedA);
  const rendererReducedB = new CanvasReferenceRenderer(reducedB);
  rendererReducedA.setPresentationTime(1000);
  rendererReducedB.setPresentationTime(4000);
  rendererReducedA.render(reducedPlan);
  rendererReducedB.render(reducedPlan);
  assert.deepEqual(translations(reducedA), translations(reducedB));
});

test('presentation interpolation preserves identity and exact endpoints', async () => {
  const beforePayload = await fixture('transition-before.json');
  const afterPayload = await fixture('transition-after.json');
  const before = planScene(beforePayload, { quality: 'normal', reducedMotion: true });
  const after = planScene(afterPayload, { quality: 'normal', reducedMotion: true });
  const start = interpolatePlans(before, after, 0);
  const middle = interpolatePlans(before, after, 0.5);
  const end = interpolatePlans(before, after, 1);

  assert.equal(start.entities[0].id, before.entities[0].id);
  assert.equal(middle.entities[0].id, before.entities[0].id);
  assert.equal(end.entities[0].id, after.entities[0].id);
  assert.deepEqual(start.entities[0].primary, before.entities[0].primary);
  assert.deepEqual(end.entities[0].primary, after.entities[0].primary);
  assert.equal(middle.entities[0].semanticState.changeCue, 'shape-and-surface');
});

test('Canvas probe can consume a 128-entity synthetic public scene', async () => {
  const base = await fixture('stable-full.json');
  const payload = replicateScene(base, 128);
  const plan = planScene(payload, { quality: 'sober', reducedMotion: true });
  const canvas = new FakeCanvas();
  const renderer = new CanvasReferenceRenderer(canvas);
  const result = renderer.render(plan);
  assert.equal(result.entities, 128);
  assert.ok(result.drawCalls >= 128);
});
