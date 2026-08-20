import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertVisualPublicProfile } from './public-profile.mjs';
import { renderFakeScene } from './fake-renderer.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(here, '../../../docs/contracts/visuel0-fixtures');
const fixtures = [
  'stable-full.json',
  'transition-before.json',
  'transition-after.json',
  'resync-full.json'
];

for (const name of fixtures) {
  const raw = await readFile(path.join(fixtureRoot, name), 'utf8');
  const payload = JSON.parse(raw);
  assertVisualPublicProfile(payload);

  const start = process.hrtime.bigint();
  const rendered = renderFakeScene(payload);
  const end = process.hrtime.bigint();

  const compactBytes = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  const prettyBytes = Buffer.byteLength(raw, 'utf8');
  const renderMicros = Number(end - start) / 1000;

  console.log(JSON.stringify({
    fixture: name,
    entities: rendered.primitives.length,
    compact_bytes: compactBytes,
    pretty_bytes: prettyBytes,
    fake_render_microseconds: Number(renderMicros.toFixed(3))
  }));
}
