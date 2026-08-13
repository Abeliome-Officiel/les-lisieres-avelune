export const QUALITY_PROFILES = Object.freeze({
  sober: Object.freeze({
    name: 'sober',
    detailScale: 0.45,
    secondaryMotion: false,
    particles: false,
    softGlow: false,
    parallax: false,
    maxSecondaryLayers: 0
  }),
  normal: Object.freeze({
    name: 'normal',
    detailScale: 1,
    secondaryMotion: true,
    particles: true,
    softGlow: true,
    parallax: false,
    maxSecondaryLayers: 2
  }),
  rich: Object.freeze({
    name: 'rich',
    detailScale: 1.35,
    secondaryMotion: true,
    particles: true,
    softGlow: true,
    parallax: true,
    maxSecondaryLayers: 4
  })
});

export function resolvePresentationProfile({ quality = 'normal', reducedMotion = false } = {}) {
  const base = QUALITY_PROFILES[quality];
  if (!base) {
    throw new Error(`unknown quality profile: ${quality}`);
  }

  return Object.freeze({
    ...base,
    reducedMotion,
    motionScale: reducedMotion ? 0 : 1,
    secondaryMotion: reducedMotion ? false : base.secondaryMotion,
    parallax: reducedMotion ? false : base.parallax
  });
}
