function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function interpolateRecord(before, after, t) {
  const result = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const key of keys) {
    const a = before[key];
    const b = after[key];
    result[key] = Number.isFinite(a) && Number.isFinite(b) ? lerp(a, b, t) : (t < 0.5 ? a : b);
  }
  return Object.freeze(result);
}

export function interpolatePlans(before, after, progress) {
  if (!before || !after) throw new Error('before and after plans are required');
  if (before.entities.length !== after.entities.length) {
    throw new Error('interpolation requires matching entity counts');
  }

  const t = smoothstep(progress);
  const afterById = new Map(after.entities.map((entity) => [entity.id, entity]));
  const entities = before.entities.map((entity) => {
    const target = afterById.get(entity.id);
    if (!target) throw new Error(`missing target entity ${entity.id}`);
    return Object.freeze({
      id: entity.id,
      kind: entity.kind,
      semanticState: Object.freeze({ transitionState: 'changing', changeCue: 'shape-and-surface' }),
      primary: interpolateRecord(entity.primary, target.primary, t),
      surface: interpolateRecord(entity.surface, target.surface, t),
      motion: interpolateRecord(entity.motion, target.motion, t),
      variant: entity.variant,
      effects: t < 0.5 ? entity.effects : target.effects
    });
  });

  return Object.freeze({
    contract: before.contract,
    schemaVersion: before.schemaVersion,
    sequence: before.sequence,
    logicalTime: lerp(before.logicalTime, after.logicalTime, t),
    profile: before.profile,
    entities: Object.freeze(entities),
    presentation: Object.freeze({ kind: 'interpolation', progress: t })
  });
}
