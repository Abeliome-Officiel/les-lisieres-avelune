<script lang="ts">
  import type {
    CityId,
    CityState,
    SimulationSession
  } from '$lib/simulation';

  let {
    session,
    activeCityId,
    onSelectCity
  } = $props<{
    session: SimulationSession;
    activeCityId: CityId;
    onSelectCity: (cityId: CityId) => void;
  }>();

  const sectorAngles: Record<string, number> = {
    Nord: -90,
    Est: 0,
    Sud: 90,
    Ouest: 180
  };

  function cityPosition(
    city: CityState,
    index: number
  ): { left: number; top: number } {
    const maximumRing = Math.max(1, session.wave.maximumRing);
    const radius = 8 + (city.ring / maximumRing) * 34;
    const baseAngle = sectorAngles[city.sector] ?? index * 60 - 90;
    const angle = (baseAngle * Math.PI) / 180;

    return {
      left: 50 + Math.cos(angle) * radius,
      top: 50 + Math.sin(angle) * radius
    };
  }

  function waveAngle(): number {
    return sectorAngles[session.wave.sector] ?? 0;
  }

  function waveEndpoint(): { x: number; y: number } {
    const angle = (waveAngle() * Math.PI) / 180;

    return {
      x: 50 + Math.cos(angle) * 42,
      y: 50 + Math.sin(angle) * 42
    };
  }

  function ringRadius(ring: number): number {
    return 7 + (ring / Math.max(1, session.wave.maximumRing)) * 36;
  }

  function cityStatus(city: CityState): string {
    if (city.integrity <= 0) return 'hors service';
    if (city.integrity < 40) return 'critique';
    if (city.integrity < 75) return 'fragilisé';
    return 'stable';
  }
</script>

<div class="world-map-layout">
  <div
    class="world-map"
    role="img"
    aria-label="Carte concentrique de la Fracture, des anneaux, des corps-cités et de la Lisière"
  >
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="fractureGlow">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.9" />
          <stop offset="65%" stop-color="currentColor" stop-opacity="0.25" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </radialGradient>

        <marker
          id="waveArrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" />
        </marker>
      </defs>

      <circle class="map-background" cx="50" cy="50" r="46" />

      {#each Array.from(
        { length: session.wave.maximumRing },
        (_, index) => index + 1
      ) as ring}
        <circle
          class:active-ring={
            session.phase === 'wave' &&
            session.waveRuntime.currentRing === ring
          }
          class="ring-line"
          cx="50"
          cy="50"
          r={ringRadius(ring)}
        />
      {/each}

      <circle class="lisiere-line" cx="50" cy="50" r="44" />

      <line
        class:wave-visible={session.phase === 'wave'}
        class="wave-path"
        x1="50"
        y1="50"
        x2={waveEndpoint().x}
        y2={waveEndpoint().y}
        marker-end="url(#waveArrow)"
      />

      <circle class="fracture-glow" cx="50" cy="50" r="10" />
      <circle class="fracture-core" cx="50" cy="50" r="4.6" />

      <text class="fracture-label" x="50" y="51.2">
        Fracture
      </text>

      <text class="lisiere-label" x="50" y="5.1">
        Lisière {session.waveRuntime.lisiereIntegrity}/100
      </text>
    </svg>

    {#each session.cities as city, index}
      {@const position = cityPosition(city, index)}
      <button
        type="button"
        class:active={activeCityId === city.id}
        class:damaged={city.integrity < 75}
        class:critical={city.integrity < 40}
        class="city-node"
        style={`left: ${position.left}%; top: ${position.top}%;`}
        aria-label={`${city.name}, anneau ${city.ring}, secteur ${city.sector}, intégrité ${city.integrity} sur ${city.maximumIntegrity}`}
        onclick={() => onSelectCity(city.id)}
      >
        <span class="city-symbol" aria-hidden="true">◆</span>
        <span class="city-node__text">
          <strong>{city.name.replace('Corps-cité ', '')}</strong>
          <small>A{city.ring} · {city.integrity}</small>
        </span>
      </button>
    {/each}
  </div>

  <aside class="map-legend" aria-label="Légende et lecture de la carte">
    <div class="legend-title">
      <span class="fracture-swatch" aria-hidden="true"></span>
      <div>
        <strong>Fracture</strong>
        <small>Origine de la vague</small>
      </div>
    </div>

    <div class="legend-title">
      <span class="wave-swatch" aria-hidden="true"></span>
      <div>
        <strong>Trajectoire</strong>
        <small>Secteur {session.wave.sector} · mode {session.wave.mode}</small>
      </div>
    </div>

    <div class="legend-title">
      <span class="lisiere-swatch" aria-hidden="true"></span>
      <div>
        <strong>Lisière</strong>
        <small>Limite vitale protégée</small>
      </div>
    </div>

    <div class="city-readout">
      {#each session.cities as city}
        <button
          type="button"
          class:active={activeCityId === city.id}
          onclick={() => onSelectCity(city.id)}
        >
          <span>
            <strong>{city.name}</strong>
            <small>
              Anneau {city.ring} · {city.sector} · {cityStatus(city)}
            </small>
          </span>
          <span>{city.integrity}/{city.maximumIntegrity}</span>
        </button>
      {/each}
    </div>
  </aside>
</div>

<style>
  .world-map-layout {
    display: grid;
    grid-template-columns: minmax(20rem, 1.45fr) minmax(15rem, 0.55fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .world-map {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    min-height: 25rem;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.85rem;
    background:
      radial-gradient(circle at center, rgba(127, 72, 145, 0.14), transparent 34%),
      var(--surface-strong);
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .map-background {
    fill: rgba(83, 63, 96, 0.09);
    stroke: rgba(220, 192, 238, 0.08);
    stroke-width: 0.5;
  }

  .ring-line {
    fill: none;
    stroke: rgba(220, 192, 238, 0.2);
    stroke-width: 0.38;
    stroke-dasharray: 1.3 1.1;
  }

  .ring-line.active-ring {
    stroke: var(--warning);
    stroke-width: 1.15;
    stroke-dasharray: none;
    filter: drop-shadow(0 0 1.4px var(--warning));
  }

  .lisiere-line {
    fill: none;
    stroke: var(--success);
    stroke-width: 1.05;
    opacity: 0.85;
  }

  .fracture-glow {
    fill: url(#fractureGlow);
    color: var(--danger);
  }

  .fracture-core {
    fill: rgba(65, 18, 34, 0.96);
    stroke: var(--danger);
    stroke-width: 0.9;
    filter: drop-shadow(0 0 2px var(--danger));
  }

  .fracture-label,
  .lisiere-label {
    fill: var(--text);
    font-family: var(--a11y-font-family, system-ui, sans-serif);
    font-size: 2.6px;
    font-weight: 800;
    text-anchor: middle;
    pointer-events: none;
  }

  .lisiere-label {
    fill: var(--success);
    font-size: 2.3px;
  }

  .wave-path {
    opacity: 0.28;
    stroke: var(--warning);
    stroke-width: 0.8;
    stroke-dasharray: 2 1.4;
  }

  .wave-path.wave-visible {
    opacity: 1;
    stroke-width: 1.3;
  }

  marker path {
    fill: var(--warning);
  }

  .city-node {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    min-height: 2.2rem;
    padding: 0.25rem 0.48rem;
    border: 1px solid rgba(205, 167, 224, 0.55);
    border-radius: 999px;
    background: rgba(31, 22, 39, 0.94);
    color: var(--text);
    transform: translate(-50%, -50%);
    box-shadow: 0 0.35rem 1rem rgba(0, 0, 0, 0.35);
    white-space: nowrap;
  }

  :global(html[data-color-scheme='light']) .city-node {
    background: rgba(255, 252, 247, 0.96);
  }

  .city-node:hover,
  .city-node:focus-visible,
  .city-node.active {
    border-color: var(--accent);
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .city-node.damaged {
    border-color: var(--warning);
  }

  .city-node.critical {
    border-color: var(--danger);
    color: var(--danger);
  }

  .city-symbol {
    color: var(--accent);
    font-size: 0.8rem;
  }

  .city-node__text {
    display: grid;
    justify-items: start;
    line-height: 1.05;
  }

  .city-node__text strong {
    font-size: 0.72rem;
  }

  .city-node__text small {
    color: var(--muted);
    font-size: 0.58rem;
  }

  .map-legend {
    display: grid;
    align-content: start;
    gap: 0.75rem;
    padding: 0.8rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: var(--surface-soft);
  }

  .legend-title {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.65rem;
  }

  .legend-title div {
    display: grid;
  }

  .legend-title small {
    color: var(--muted);
  }

  .fracture-swatch,
  .lisiere-swatch,
  .wave-swatch {
    display: block;
    width: 1.15rem;
    height: 1.15rem;
    border-radius: 50%;
  }

  .fracture-swatch {
    background: var(--danger);
    box-shadow: 0 0 0.7rem var(--danger);
  }

  .lisiere-swatch {
    border: 2px solid var(--success);
  }

  .wave-swatch {
    width: 1.4rem;
    height: 0.3rem;
    border-radius: 999px;
    background: var(--warning);
  }

  .city-readout {
    display: grid;
    gap: 0.4rem;
    margin-top: 0.35rem;
  }

  .city-readout button {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    min-height: 3rem;
    padding: 0.55rem;
    text-align: left;
  }

  .city-readout button.active {
    border-color: var(--accent);
    background: rgba(169, 107, 196, 0.18);
  }

  .city-readout button > span:first-child {
    display: grid;
  }

  .city-readout small {
    color: var(--muted);
  }

  @media (max-width: 900px) {
    .world-map-layout {
      grid-template-columns: 1fr;
    }

    .world-map {
      min-height: 22rem;
    }

    .map-legend {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .city-readout {
      grid-column: 1 / -1;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .world-map {
      min-height: 19rem;
    }

    .city-node {
      min-height: 1.8rem;
      padding: 0.18rem 0.34rem;
    }

    .city-node__text strong {
      font-size: 0.62rem;
    }

    .city-node__text small {
      font-size: 0.52rem;
    }

    .map-legend,
    .city-readout {
      grid-template-columns: 1fr;
    }
  }
</style>
