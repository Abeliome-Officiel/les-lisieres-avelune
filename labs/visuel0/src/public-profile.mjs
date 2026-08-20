const TOP_LEVEL_KEYS = new Set([
  'contract_id',
  'schema_version',
  'projection_profile',
  'source',
  'frame',
  'descriptors',
  'events',
  'extensions'
]);

const SOURCE_KEYS = new Set([
  'kind',
  'source_id',
  'source_version',
  'adapter_version',
  'replay_id'
]);

const FRAME_KEYS = new Set([
  'state_id',
  'sequence',
  'logical_time',
  'mode',
  'base_sequence',
  'scope'
]);

const SCOPE_KEYS = new Set(['kind', 'id']);
const EXTENSION_KEYS = new Set(['visual.scene']);
const SCENE_KEYS = new Set(['entities']);
const ENTITY_KEYS = new Set([
  'entity_id',
  'entity_type',
  'pose',
  'appearance',
  'transition_state'
]);
const POSE_KEYS = new Set(['x', 'y', 'scale', 'depth_hint']);
const APPEARANCE_KEYS = new Set([
  'cohesion',
  'elongation',
  'branching',
  'symmetry',
  'softness',
  'translucency',
  'surface_detail',
  'luminosity',
  'motion_amplitude',
  'pulse',
  'diffuseness'
]);
const EVENT_KEYS = new Set(['event_id', 'type', 'phase', 'intensity']);
const EVENT_PHASES = new Set(['start', 'active', 'peak', 'end', 'aftermath']);

function fail(message) {
  throw new TypeError(`VISUEL-0 public profile rejected payload: ${message}`);
}

function assertPlainObject(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
}

function assertExactKeys(value, allowed, label, required = []) {
  assertPlainObject(value, label);

  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      fail(`${label}.${key} is not allowed`);
    }
  }

  for (const key of required) {
    if (!(key in value)) {
      fail(`${label}.${key} is required`);
    }
  }
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(`${label} must be a non-empty string`);
  }
}

function assertInteger(value, label, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    fail(`${label} must be an integer >= ${minimum}`);
  }
}

function assertNumber(value, label, minimum, maximum) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum) {
    fail(`${label} must be a finite number in [${minimum}, ${maximum}]`);
  }
}

function assertUnit(value, label) {
  assertNumber(value, label, 0, 1);
}

function assertSource(source) {
  assertExactKeys(
    source,
    SOURCE_KEYS,
    'source',
    ['kind', 'source_id', 'source_version', 'adapter_version']
  );

  if (!new Set(['synthetic', 'replay', 'live']).has(source.kind)) {
    fail('source.kind is invalid');
  }

  if (source.source_id !== 'visual-public-projection') {
    fail('source.source_id must use the public projection alias');
  }

  assertString(source.source_version, 'source.source_version');
  assertString(source.adapter_version, 'source.adapter_version');

  if (!/^projection-synthetic-0\.[0-9]+$/.test(source.source_version)) {
    fail('source.source_version must use the public synthetic projection namespace in VISUEL-0');
  }

  if (!/^public-adapter-synthetic-0\.[0-9]+$/.test(source.adapter_version)) {
    fail('source.adapter_version must use the public adapter namespace in VISUEL-0');
  }

  if ('replay_id' in source) {
    assertString(source.replay_id, 'source.replay_id');
  }
}

function assertScope(scope) {
  assertExactKeys(scope, SCOPE_KEYS, 'frame.scope', ['kind', 'id']);
  if (!new Set(['world', 'region', 'scene']).has(scope.kind)) {
    fail('frame.scope.kind is invalid');
  }
  assertString(scope.id, 'frame.scope.id');
}

function assertFrame(frame) {
  assertExactKeys(
    frame,
    FRAME_KEYS,
    'frame',
    ['state_id', 'sequence', 'logical_time', 'mode', 'scope']
  );

  assertString(frame.state_id, 'frame.state_id');
  assertInteger(frame.sequence, 'frame.sequence');
  assertNumber(frame.logical_time, 'frame.logical_time', 0, Number.MAX_SAFE_INTEGER);

  if (!new Set(['full', 'delta']).has(frame.mode)) {
    fail('frame.mode is invalid');
  }

  if (frame.mode === 'delta') {
    if (!('base_sequence' in frame)) {
      fail('frame.base_sequence is required for delta frames');
    }
    assertInteger(frame.base_sequence, 'frame.base_sequence');
  }

  assertScope(frame.scope);
}

function assertAppearance(appearance, entityLabel) {
  assertExactKeys(appearance, APPEARANCE_KEYS, `${entityLabel}.appearance`);

  const keys = Object.keys(appearance);
  if (keys.length < 3) {
    fail(`${entityLabel}.appearance must expose at least 3 visual descriptors`);
  }

  for (const key of keys) {
    assertUnit(appearance[key], `${entityLabel}.appearance.${key}`);
  }
}

function assertPose(pose, entityLabel) {
  assertExactKeys(pose, POSE_KEYS, `${entityLabel}.pose`, ['x', 'y', 'scale']);
  assertUnit(pose.x, `${entityLabel}.pose.x`);
  assertUnit(pose.y, `${entityLabel}.pose.y`);
  assertUnit(pose.scale, `${entityLabel}.pose.scale`);

  if ('depth_hint' in pose) {
    assertNumber(pose.depth_hint, `${entityLabel}.pose.depth_hint`, -1, 1);
  }
}

function assertEntity(entity, index) {
  const label = `extensions.visual.scene.entities[${index}]`;
  assertExactKeys(
    entity,
    ENTITY_KEYS,
    label,
    ['entity_id', 'entity_type', 'pose', 'appearance']
  );

  if (!/^view-[a-z0-9-]{3,48}$/.test(entity.entity_id)) {
    fail(`${label}.entity_id must be a projected view alias`);
  }

  if (entity.entity_type !== 'living-form') {
    fail(`${label}.entity_type is invalid`);
  }

  assertPose(entity.pose, label);
  assertAppearance(entity.appearance, label);

  if ('transition_state' in entity && !new Set(['stable', 'changing']).has(entity.transition_state)) {
    fail(`${label}.transition_state is invalid`);
  }
}

function assertScene(scene) {
  assertExactKeys(scene, SCENE_KEYS, 'extensions.visual.scene', ['entities']);
  if (!Array.isArray(scene.entities)) {
    fail('extensions.visual.scene.entities must be an array');
  }
  if (scene.entities.length > 128) {
    fail('extensions.visual.scene.entities exceeds the VISUEL-0 scene cap');
  }
  scene.entities.forEach(assertEntity);
}

function assertEvents(events) {
  if (!Array.isArray(events)) {
    fail('events must be an array');
  }

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const label = `events[${index}]`;
    assertExactKeys(event, EVENT_KEYS, label, ['event_id', 'type', 'phase', 'intensity']);
    assertString(event.event_id, `${label}.event_id`);

    if (event.type !== 'visual.transition') {
      fail(`${label}.type is not allowed in VISUEL-0`);
    }
    if (!EVENT_PHASES.has(event.phase)) {
      fail(`${label}.phase is invalid`);
    }
    assertUnit(event.intensity, `${label}.intensity`);
  }
}

export function assertVisualPublicProfile(payload) {
  assertExactKeys(
    payload,
    TOP_LEVEL_KEYS,
    'payload',
    ['contract_id', 'schema_version', 'projection_profile', 'source', 'frame', 'descriptors', 'events', 'extensions']
  );

  if (payload.contract_id !== 'avelune.representation.semantic') {
    fail('contract_id is invalid');
  }

  if (!/^0\.[0-9]+\.[0-9]+$/.test(payload.schema_version)) {
    fail('schema_version must be a v0 semantic version');
  }

  if (payload.projection_profile !== 'visual-lab-v0') {
    fail('projection_profile is invalid');
  }

  assertSource(payload.source);
  assertFrame(payload.frame);

  assertPlainObject(payload.descriptors, 'descriptors');
  if (Object.keys(payload.descriptors).length !== 0) {
    fail('descriptors must be empty in the VISUEL-0 public profile');
  }

  assertEvents(payload.events);

  assertExactKeys(payload.extensions, EXTENSION_KEYS, 'extensions', ['visual.scene']);
  assertScene(payload.extensions['visual.scene']);

  return payload;
}
