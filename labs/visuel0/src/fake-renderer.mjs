import { assertVisualPublicProfile } from './public-profile.mjs';

export function renderFakeScene(payload) {
  assertVisualPublicProfile(payload);

  const scene = payload.extensions['visual.scene'];

  return {
    sequence: payload.frame.sequence,
    stateId: payload.frame.state_id,
    primitives: scene.entities.map((entity) => ({
      id: entity.entity_id,
      x: entity.pose.x,
      y: entity.pose.y,
      scale: entity.pose.scale,
      transitionState: entity.transition_state ?? 'stable',
      visualSignature: {
        cohesion: entity.appearance.cohesion ?? null,
        elongation: entity.appearance.elongation ?? null,
        branching: entity.appearance.branching ?? null,
        softness: entity.appearance.softness ?? null,
        translucency: entity.appearance.translucency ?? null,
        diffuseness: entity.appearance.diffuseness ?? null
      }
    }))
  };
}
