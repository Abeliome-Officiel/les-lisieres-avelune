export const GRAMMAR_LAB_VERSION = 'visuel-grammar-lab-0.1';

function fnv1a32(text) {
  let hash = 0x811c9dc5;
  for (const char of text) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function deterministicUnit(key, channel = 'base') {
  const hash = fnv1a32(`${GRAMMAR_LAB_VERSION}|${key}|${channel}`);
  return hash / 0xffffffff;
}

export function deterministicVariant(entityId) {
  return Object.freeze({
    silhouetteBias: deterministicUnit(entityId, 'silhouette'),
    surfaceBias: deterministicUnit(entityId, 'surface'),
    motionPhase: deterministicUnit(entityId, 'motion'),
    detailBias: deterministicUnit(entityId, 'detail')
  });
}
