const TAU = Math.PI * 2;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function hasEffect(entity, type) {
  return entity.effects.some((effect) => effect.type === type);
}

function effect(entity, type) {
  return entity.effects.find((candidate) => candidate.type === type);
}

function stableUnit(seed, channel) {
  const x = Math.sin((seed + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function palette(entity) {
  const hue = 168 + entity.variant.surfaceBias * 92;
  const saturation = 38 + entity.surface.detail * 28;
  const lightness = 43 + entity.surface.luminosity * 24;
  return {
    body: `hsla(${hue.toFixed(1)}, ${saturation.toFixed(1)}%, ${lightness.toFixed(1)}%, ${(0.66 + entity.primary.translucency * 0.22).toFixed(3)})`,
    inner: `hsla(${(hue + 24).toFixed(1)}, ${(saturation + 8).toFixed(1)}%, ${(lightness + 13).toFixed(1)}%, 0.24)`,
    line: `hsla(${(hue - 16).toFixed(1)}, ${(saturation + 5).toFixed(1)}%, ${(lightness + 18).toFixed(1)}%, 0.38)`,
    spark: `hsla(${(hue + 38).toFixed(1)}, 72%, 78%, 0.56)`
  };
}

export class CanvasReferenceRenderer {
  #canvas;
  #context;
  #timeMs = 0;

  constructor(canvas) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new Error('CanvasReferenceRenderer requires a canvas-like object');
    }
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas context unavailable');
    this.#canvas = canvas;
    this.#context = context;
  }

  setPresentationTime(timeMs) {
    this.#timeMs = Number.isFinite(timeMs) ? timeMs : 0;
  }

  resize(cssWidth, cssHeight, devicePixelRatio = 1) {
    const dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));
    if (this.#canvas.width !== width) this.#canvas.width = width;
    if (this.#canvas.height !== height) this.#canvas.height = height;
    if (this.#canvas.style) {
      this.#canvas.style.width = `${Math.max(1, Math.round(cssWidth))}px`;
      this.#canvas.style.height = `${Math.max(1, Math.round(cssHeight))}px`;
    }
    return { width, height, dpr };
  }

  render(plan) {
    if (!plan || !Array.isArray(plan.entities)) {
      throw new Error('render(plan) requires a VISUEL-1 render plan');
    }

    const ctx = this.#context;
    const width = this.#canvas.width || 1;
    const height = this.#canvas.height || 1;
    let drawCalls = 0;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#090b12';
    ctx.fillRect(0, 0, width, height);
    drawCalls += 2;

    for (const entity of plan.entities) {
      drawCalls += this.#drawEntity(entity, width, height);
    }

    ctx.restore();
    return {
      sequence: plan.sequence,
      entities: plan.entities.length,
      drawCalls
    };
  }

  #drawEntity(entity, width, height) {
    const ctx = this.#context;
    const minDimension = Math.min(width, height);
    const base = Math.max(8, minDimension * 0.22 * entity.primary.scale);
    const pulsePhase = this.#timeMs * 0.0012 + entity.motion.phase * TAU;
    const pulse = 1 + Math.sin(pulsePhase) * entity.motion.pulse * 0.045;
    const drift = Math.sin(this.#timeMs * 0.0007 + entity.motion.phase * TAU) * entity.motion.amplitude * base * 0.16;
    const depthShift = entity.primary.depthHint * minDimension * 0.008;
    const x = entity.primary.x * width + drift + depthShift;
    const y = entity.primary.y * height + Math.cos(pulsePhase * 0.73) * entity.motion.amplitude * base * 0.08;
    const rx = base * (0.72 + entity.primary.elongation * 0.78) * pulse;
    const ry = base * (1.12 - entity.primary.elongation * 0.28) * pulse;
    const colors = palette(entity);
    let drawCalls = 0;

    ctx.save();
    ctx.translate(x, y);

    if (hasEffect(entity, 'soft-glow')) {
      const glow = effect(entity, 'soft-glow');
      ctx.shadowBlur = 10 + clamp01(glow.strength) * 26;
      ctx.shadowColor = colors.spark;
    }

    ctx.beginPath();
    const points = 28;
    const lobeCount = 3 + Math.round(entity.primary.branching * 4);
    for (let index = 0; index <= points; index += 1) {
      const theta = (index / points) * TAU;
      const lobe = 1 + Math.sin(theta * lobeCount + entity.variant.silhouetteBias * TAU) * (0.035 + entity.primary.branching * 0.065);
      const irregularity = 1 + Math.sin(theta * 2 - entity.variant.detailBias * TAU) * (1 - entity.primary.softness) * 0.035;
      const px = Math.cos(theta) * rx * lobe * irregularity;
      const py = Math.sin(theta) * ry * lobe;
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = colors.body;
    ctx.fill();
    drawCalls += 1;

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(-rx * 0.12, -ry * 0.14, rx * 0.56, ry * 0.48, entity.variant.surfaceBias * 0.35, 0, TAU);
    ctx.fillStyle = colors.inner;
    ctx.fill();
    drawCalls += 1;

    const branchCount = Math.round(entity.primary.branching * 6);
    if (branchCount > 0) {
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = Math.max(1, base * 0.018);
      ctx.lineCap = 'round';
      for (let index = 0; index < branchCount; index += 1) {
        const theta = (index / Math.max(1, branchCount)) * TAU + entity.variant.silhouetteBias * 1.7;
        const reach = 0.42 + stableUnit(entity.variant.detailBias * 1000, index) * 0.34;
        ctx.beginPath();
        ctx.moveTo(Math.cos(theta) * rx * 0.08, Math.sin(theta) * ry * 0.08);
        ctx.quadraticCurveTo(
          Math.cos(theta + 0.18) * rx * reach * 0.58,
          Math.sin(theta + 0.18) * ry * reach * 0.58,
          Math.cos(theta) * rx * reach,
          Math.sin(theta) * ry * reach
        );
        ctx.stroke();
        drawCalls += 1;
      }
    }

    const detailCount = Math.round(entity.surface.detail * 8);
    if (detailCount > 0) {
      ctx.fillStyle = colors.line;
      for (let index = 0; index < detailCount; index += 1) {
        const theta = stableUnit(entity.variant.surfaceBias * 1000, index * 2) * TAU;
        const radius = 0.18 + stableUnit(entity.variant.detailBias * 1000, index * 2 + 1) * 0.56;
        const dotRadius = Math.max(0.8, base * (0.012 + stableUnit(index, 5) * 0.014));
        ctx.beginPath();
        ctx.arc(Math.cos(theta) * rx * radius, Math.sin(theta) * ry * radius, dotRadius, 0, TAU);
        ctx.fill();
        drawCalls += 1;
      }
    }

    const particleEffect = effect(entity, 'secondary-particles');
    if (particleEffect) {
      const particleCount = Math.round(clamp01(particleEffect.density) * 10);
      ctx.fillStyle = colors.spark;
      for (let index = 0; index < particleCount; index += 1) {
        const theta = stableUnit(entity.variant.silhouetteBias * 900, index + 13) * TAU + this.#timeMs * 0.00008;
        const distance = base * (1.15 + stableUnit(entity.variant.surfaceBias * 700, index + 29) * 0.85);
        const wobble = Math.sin(this.#timeMs * 0.001 + index) * entity.motion.amplitude * base * 0.08;
        ctx.beginPath();
        ctx.arc(Math.cos(theta) * distance + wobble, Math.sin(theta) * distance, Math.max(0.7, base * 0.012), 0, TAU);
        ctx.fill();
        drawCalls += 1;
      }
    }

    if (entity.semanticState.changeCue !== 'none') {
      ctx.strokeStyle = colors.spark;
      ctx.lineWidth = Math.max(1, base * 0.012);
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 1.08, ry * 1.08, 0, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
      drawCalls += 1;
    }

    ctx.restore();
    return drawCalls;
  }

  destroy() {
    const ctx = this.#context;
    ctx.clearRect(0, 0, this.#canvas.width || 1, this.#canvas.height || 1);
  }
}
