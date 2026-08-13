function publicEnvelope(sequence = 40) {
  return {
    contract_id: 'avelune.representation.semantic',
    schema_version: '0.1.0',
    projection_profile: 'visual-lab-v0',
    source: {
      kind: 'synthetic',
      source_id: 'visual-public-projection',
      source_version: 'projection-synthetic-0.1',
      adapter_version: 'public-adapter-synthetic-0.1',
      replay_id: 'visuel0-adapter-proof-v0'
    },
    frame: {
      state_id: `visual-adapter-${sequence}`,
      sequence,
      logical_time: sequence,
      mode: 'full',
      scope: {
        kind: 'scene',
        id: 'view-scene-adapter-proof'
      }
    },
    descriptors: {},
    events: [],
    extensions: {
      'visual.scene': {
        entities: []
      }
    }
  };
}

function visualEntity(alias, x, y, scale, vector) {
  return {
    entity_id: alias,
    entity_type: 'living-form',
    pose: { x, y, scale, depth_hint: 0 },
    appearance: {
      cohesion: vector[0],
      elongation: vector[1],
      branching: vector[2],
      softness: vector[3],
      translucency: vector[4],
      surface_detail: vector[5],
      luminosity: vector[6],
      motion_amplitude: vector[7],
      pulse: vector[8],
      diffuseness: vector[9]
    },
    transition_state: 'stable'
  };
}

export function adaptSyntheticSourceA(source) {
  if (source?.synthetic_format !== 'A' || !Array.isArray(source.items)) {
    throw new TypeError('Unsupported synthetic source A');
  }

  const payload = publicEnvelope(40);
  payload.extensions['visual.scene'].entities = source.items.map((item, index) => {
    const look = item.look;
    const vector = [
      look.compact,
      look.long,
      look.forked,
      look.soft,
      look.clear,
      look.detail,
      look.glow,
      look.move,
      look.beat,
      look.mist
    ];

    return visualEntity(
      index === 0 ? 'view-form-adapter-proof' : `view-form-adapter-${index + 1}`,
      item.screen.left,
      item.screen.top,
      item.screen.size,
      vector
    );
  });

  return payload;
}

export function adaptSyntheticSourceB(source) {
  if (source?.synthetic_format !== 'B' || source.scene_items === null || typeof source.scene_items !== 'object') {
    throw new TypeError('Unsupported synthetic source B');
  }

  const payload = publicEnvelope(40);
  payload.extensions['visual.scene'].entities = Object.values(source.scene_items).map((item) => {
    const [x, y, scale] = item.placement;
    return visualEntity(item.public_alias, x, y, scale, item.style_vector);
  });

  return payload;
}
