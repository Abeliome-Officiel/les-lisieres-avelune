export function assertRendererPort(renderer) {
  if (!renderer || typeof renderer.render !== 'function') {
    throw new Error('renderer port must expose render(plan)');
  }
  if (renderer.destroy !== undefined && typeof renderer.destroy !== 'function') {
    throw new Error('renderer destroy must be a function when provided');
  }
  return renderer;
}

export class RecordingRenderer {
  #frames = [];

  render(plan) {
    this.#frames.push(structuredClone(plan));
    return {
      sequence: plan.sequence,
      entities: plan.entities.length
    };
  }

  frames() {
    return structuredClone(this.#frames);
  }

  destroy() {
    this.#frames = [];
  }
}
