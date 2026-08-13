import { assertVisualPublicProfile } from '../../visuel0/src/public-profile.mjs';
import { deterministicVariant } from './determinism.mjs';
import { resolvePresentationProfile } from './profiles.mjs';

function effectList(appearance, profile) {
  const effects = [];

  if (profile.softGlow && appearance.luminosity > 0.05) {
    effects.push({ type: 'soft-glow', strength: appearance.luminosity });
  }
  if (profile.particles && appearance.diffuseness > 0.05) {
    effects.push({ type: 'secondary-particles', density: appearance.diffuseness });
  }
  if (profile.parallax) {
    effects.push({ type: 'parallax-hint', strength: 0.25 });
  }

  return effects.slice(0, profile.maxSecondaryLayers);
}

function planEntity(entity, profile) {
  const appearance = entity.appearance;
  const variant = deterministicVariant(entity.entity_id);

  return Object.freeze({
    id: entity.entity_id,
    kind: entity.entity_type,
    semanticState: Object.freeze({
      transitionState: entity.transition_state ?? 'stable',
      changeCue: entity.transition_state === 'changing' ? 'shape-and-surface' : 'none'
    }),
    primary: Object.freeze({
      x: entity.pose.x,
      y: entity.pose.y,
      scale: entity.pose.scale,
      depthHint: entity.pose.depth_hint ?? 0,
      cohesion: appearance.cohesion ?? 0.5,
      elongation: appearance.elongation ?? 0.5,
      branching: appearance.branching ?? 0,
      symmetry: appearance.symmetry ?? 0.5,
      softness: appearance.softness ?? 0.5,
      translucency: appearance.translucency ?? 0
    }),
    surface: Object.freeze({
      detail: Math.min(1, (appearance.surface_detail ?? 0) * profile.detailScale),
      luminosity: appearance.luminosity ?? 0,
      diffuseness: appearance.diffuseness ?? 0
    }),
    motion: Object.freeze({
      amplitude: (appearance.motion_amplitude ?? 0) * profile.motionScale,
      pulse: (appearance.pulse ?? 0) * profile.motionScale,
      phase: variant.motionPhase,
      secondary: profile.secondaryMotion
    }),
    variant,
    effects: Object.freeze(effectList(appearance, profile))
  });
}

export function planScene(payload, options = {}) {
  assertVisualPublicProfile(payload);
  const profile = resolvePresentationProfile(options);
  const entities = payload.extensions['visual.scene'].entities.map((entity) => planEntity(entity, profile));

  return Object.freeze({
    contract: payload.contract_id,
    schemaVersion: payload.schema_version,
    sequence: payload.frame.sequence,
    logicalTime: payload.frame.logical_time,
    profile,
    entities: Object.freeze(entities)
  });
}
