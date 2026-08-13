import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { adaptSyntheticSourceA, adaptSyntheticSourceB } from '../src/adapters.mjs';
import { renderFakeScene } from '../src/fake-renderer.mjs';
import { assertVisualPublicProfile } from '../src/public-profile.mjs';
import { decideFrameApplication } from '../src/sequence.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(here, '../../../docs/contracts/visuel0-fixtures');
const sourceRoot = path.resolve(here, '../fixtures');

async function readJson(root, name) {
  return JSON.parse(await readFile(path.join(root, name), 'utf8'));
}

async function fixture(name) {
  return readJson(fixtureRoot, name);
}

async function syntheticSource(name) {
  return readJson(sourceRoot, name);
}

test('VISUEL-0 accepts the stable synthetic public fixture', async () => {
  const payload = await fixture('stable-full.json');
  assert.equal(assertVisualPublicProfile(payload), payload);
});

test('VISUEL-0 preserves projected identity across a major transformation', async () => {
  const before = await fixture('transition-before.json');
  const after = await fixture('transition-after.json');

  const renderedBefore = renderFakeScene(before);
  const renderedAfter = renderFakeScene(after);

  assert.equal(renderedBefore.primitives.length, 1);
  assert.equal(renderedAfter.primitives.length, 1);
  assert.equal(renderedBefore.primitives[0].id, renderedAfter.primitives[0].id);
  assert.notDeepEqual(
    renderedBefore.primitives[0].visualSignature,
    renderedAfter.primitives[0].visualSignature
  );
});

test('two incompatible synthetic source structures produce the same public profile', async () => {
  const sourceA = await syntheticSource('source-a.json');
  const sourceB = await syntheticSource('source-b.json');

  const payloadA = adaptSyntheticSourceA(sourceA);
  const payloadB = adaptSyntheticSourceB(sourceB);

  assertVisualPublicProfile(payloadA);
  assertVisualPublicProfile(payloadB);
  assert.deepEqual(payloadA, payloadB);
  assert.deepEqual(renderFakeScene(payloadA), renderFakeScene(payloadB));
});

test('VISUEL-0 rejects an unexpected top-level field', async () => {
  const payload = structuredClone(await fixture('stable-full.json'));
  payload.private_debug = { fake: true };

  assert.throws(
    () => assertVisualPublicProfile(payload),
    /private_debug is not allowed/
  );
});

test('VISUEL-0 rejects an unlisted extension even when the UI would ignore it', async () => {
  const payload = structuredClone(await fixture('stable-full.json'));
  payload.extensions['private.synthetic-example'] = { fake: true };

  assert.throws(
    () => assertVisualPublicProfile(payload),
    /private\.synthetic-example is not allowed/
  );
});

test('VISUEL-0 rejects arbitrary shared descriptors in the public visual profile', async () => {
  const payload = structuredClone(await fixture('stable-full.json'));
  payload.descriptors['example.unlisted'] = { value: 0.5 };

  assert.throws(
    () => assertVisualPublicProfile(payload),
    /descriptors must be empty/
  );
});

test('a full frame is authoritative and can resynchronise after a gap', async () => {
  const payload = await fixture('resync-full.json');
  const decision = decideFrameApplication(21, payload.frame);

  assert.deepEqual(decision, {
    action: 'replace',
    nextSequence: 30,
    reason: 'authoritative-full-state'
  });
});

test('a delta with the wrong base requests resynchronisation', () => {
  const decision = decideFrameApplication(20, {
    mode: 'delta',
    sequence: 22,
    base_sequence: 19
  });

  assert.deepEqual(decision, {
    action: 'resync',
    nextSequence: 20,
    reason: 'base-sequence-mismatch'
  });
});

test('a compatible delta can advance without defining its merge semantics yet', () => {
  const decision = decideFrameApplication(20, {
    mode: 'delta',
    sequence: 21,
    base_sequence: 20
  });

  assert.deepEqual(decision, {
    action: 'apply-delta',
    nextSequence: 21,
    reason: 'compatible-delta'
  });
});
