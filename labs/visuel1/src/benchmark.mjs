import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import { planScene } from './planner.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(here, '../../../docs/contracts/visuel0-fixtures/stable-full.json');

function percentile(values, ratio) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor(sorted.length * ratio));
  return sorted[index];
}

export function buildBenchmarkScene(basePayload, count) {
  if (!Number.isInteger(count) || count < 1 || count > 128) {
    throw new Error('benchmark entity count must be an integer from 1 to 128');
  }

  const payload = structuredClone(basePayload);
  const template = payload.extensions['visual.scene'].entities[0];
  payload.extensions['visual.scene'].entities = Array.from({ length: count }, (_, index) => ({
    ...structuredClone(template),
    entity_id: `view-bench-${String(index + 1).padStart(3, '0')}`,
    pose: {
      ...template.pose,
      x: ((index % 16) + 0.5) / 16,
      y: (Math.floor(index / 16) + 0.5) / 8
    }
  }));
  payload.frame.state_id = `visuel1-bench-${count}`;
  return payload;
}

async function main() {
  const basePayload = JSON.parse(await readFile(fixturePath, 'utf8'));

  for (const count of [1, 16, 64, 128]) {
    const payload = buildBenchmarkScene(basePayload, count);
    const timings = [];
    const heapBefore = process.memoryUsage().heapUsed;

    for (let iteration = 0; iteration < 100; iteration += 1) {
      const start = performance.now();
      planScene(payload, { quality: 'normal', reducedMotion: false });
      timings.push(performance.now() - start);
    }

    const heapAfter = process.memoryUsage().heapUsed;
    console.log(JSON.stringify({
      entities: count,
      iterations: timings.length,
      p50_ms: Number(percentile(timings, 0.50).toFixed(4)),
      p95_ms: Number(percentile(timings, 0.95).toFixed(4)),
      heap_delta_kib: Number(((heapAfter - heapBefore) / 1024).toFixed(1))
    }));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
