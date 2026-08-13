export function replicateScene(basePayload, count) {
  if (!Number.isInteger(count) || count < 1 || count > 128) {
    throw new Error('entity count must be an integer from 1 to 128');
  }

  const payload = structuredClone(basePayload);
  const template = payload.extensions['visual.scene'].entities[0];
  payload.extensions['visual.scene'].entities = Array.from({ length: count }, (_, index) => ({
    ...structuredClone(template),
    entity_id: `view-probe-${String(index + 1).padStart(3, '0')}`,
    pose: {
      ...template.pose,
      x: ((index % 16) + 0.5) / 16,
      y: (Math.floor(index / 16) + 0.5) / 8,
      scale: count === 1 ? template.pose.scale : Math.min(template.pose.scale, 0.22)
    }
  }));
  payload.frame.state_id = `visuel2-probe-${count}`;
  return payload;
}
