import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { buildBenchmarkScene } from '../src/benchmark.mjs';
import { planScene } from '../src/planner.mjs';
import { assertRendererPort, RecordingRenderer } from '../src/renderer-port.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(here, '../../../docs/contracts/visuel0-fixtures');

async function fixture(name) {
  return JSON.parse(await readFile(path.join(fixtureRoot, name), 'utf8'));
}

test('same public scene and grammar version produce the same render plan', async () => {
  const payload = await fixture('stable-full.json');
  const first = planScene(payload, { quality: 'normal' });
  const second = planScene(payload, { quality: 'normal' });
  assert.deepEqual(first, second);
});

test('quality tiers preserve identity and primary morphology', async () => {
  const payload = await fixture('stable-full.json');
  const sober = planScene(payload, { quality: 'sober' });
  const normal = planScene(payload, { quality: 'normal' });
  const rich = planScene(payload, { quality: 'rich' });

  for (let index = 0; index < sober.entities.length; index += 1) {
    assert.equal(sober.entities[index].id, normal.entities[index].id);
    assert.equal(normal.entities[index].id, rich.entities[index].id);
    assert.deepEqual(sober.entities[index].primary, normal.entities[index].primary);
    assert.deepEqual(normal.entities[index].primary, rich.entities[index].primary);
    assert.deepEqual(sober.entities[index].semanticState, rich.entities[index].semanticState);
    assert.ok(sober.entities[index].effects.length <= normal.entities[index].effects.length);
    assert.ok(normal.entities[index].effects.length <= rich.entities[index].effects.length);
  }
});

test('reduced motion removes animation without removing the change information', async () => {
  const payload = await fixture('transition-after.json');
  const normal = planScene(payload, { quality: 'normal', reducedMotion: false });
  const reduced = planScene(payload, { quality: 'normal', reducedMotion: true });

  assert.equal(normal.entities[0].semanticState.changeCue, 'shape-and-surface');
  assert.equal(reduced.entities[0].semanticState.changeCue, 'shape-and-surface');
  assert.equal(reduced.entities[0].motion.amplitude, 0);
  assert.equal(reduced.entities[0].motion.pulse, 0);
  assert.equal(reduced.entities[0].motion.secondary, false);
  assert.equal(reduced.profile.parallax, false);
});

test('benchmark generator remains inside the public VISUEL-0 profile up to 128 entities', async () => {
  const payload = await fixture('stable-full.json');
  const benchmark = buildBenchmarkScene(payload, 128);
  const plan = planScene(benchmark, { quality: 'normal' });

  assert.equal(plan.entities.length, 128);
  assert.equal(new Set(plan.entities.map((entity) => entity.id)).size, 128);
});

test('renderer implementations consume the render plan through a replaceable port', async () => {
  const payload = await fixture('stable-full.json');
  const plan = planScene(payload, { quality: 'normal' });
  const renderer = assertRendererPort(new RecordingRenderer());
  const result = renderer.render(plan);

  assert.deepEqual(result, { sequence: plan.sequence, entities: plan.entities.length });
  assert.deepEqual(renderer.frames()[0], plan);
  renderer.destroy();
  assert.deepEqual(renderer.frames(), []);
});

test('invalid renderer implementations fail closed', () => {
  assert.throws(() => assertRendererPort({}), /must expose render/);
});

test('unknown quality tiers fail closed', async () => {
  const payload = await fixture('stable-full.json');
  assert.throws(() => planScene(payload, { quality: 'ultra' }), /unknown quality profile/);
});
