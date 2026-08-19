import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const here = dirname(fileURLToPath(import.meta.url));
const labRoot = join(here, '..');
const thisFile = fileURLToPath(import.meta.url);

async function filesUnder(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await filesUnder(path));
    else out.push(path);
  }
  return out;
}

test('baseline P5A démarre sans dépendance runtime tierce', async () => {
  const pkg = JSON.parse(await readFile(join(labRoot, 'package.json'), 'utf8'));
  assert.deepEqual(pkg.dependencies ?? {}, {});
  assert.deepEqual(pkg.devDependencies ?? {}, {});
});

test('baseline P5A n’importe aucun ancien LAB VISUEL', async () => {
  const forbidden = [
    'labs/visuel0',
    'labs/visuel1',
    'labs/visuel2',
    '../visuel0',
    '../visuel1',
    '../visuel2'
  ];

  const files = (await filesUnder(labRoot)).filter(
    (path) => path !== thisFile && /\.(?:mjs|js|json)$/.test(path)
  );
  const offenders = [];

  for (const path of files) {
    const text = await readFile(path, 'utf8');
    for (const token of forbidden) {
      if (text.includes(token)) offenders.push(`${relative(labRoot, path)} -> ${token}`);
    }
  }

  assert.deepEqual(offenders, []);
});
