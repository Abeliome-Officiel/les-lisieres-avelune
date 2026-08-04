<script lang="ts">
  import AccessibilityPanel from '$lib/components/AccessibilityPanel.svelte';
  import WorldMap from '$lib/components/WorldMap.svelte';
  import { getElementById } from '$lib/data/catalogue';
  import {
    advanceWave,
    createSession,
    downloadLogFilename,
    exportSessionLog,
    getVisibleWaveInformation,
    queueOrders,
    resolvePreparationTurn,
    rpgOrderOptions,
    tdOrderOptions,
    tfOrderOptions,
    type CityId,
    type CityState,
    type CityTurnOrders,
    type RpgOrder,
    type SessionConfiguration,
    type SimulationSession,
    type TdOrder,
    type TfOrder,
    type WaveFamily,
    type WaveMode
  } from '$lib/simulation';

  type Selection = {
    td: string;
    tf: string;
    rpg: string;
    aidTarget: CityId;
  };

  type ScenarioDraft = {
    seed: string;
    cityCount: 4 | 6;
    mode: WaveMode;
    family: WaveFamily;
    power: number;
    sector: string;
    revealTurn: 7 | 8 | 9;
    maximumRing: number;
  };

  const defaultScenario: ScenarioDraft = {
    seed: 'avelune-dev3',
    cityCount: 4,
    mode: 'comparison',
    family: 'impact',
    power: 30,
    sector: 'Est',
    revealTurn: 8,
    maximumRing: 7
  };

  let scenario: ScenarioDraft = structuredClone(defaultScenario);

  function sessionConfiguration(
    draft: ScenarioDraft,
    identifier: string
  ): SessionConfiguration {
    return {
      sessionId: identifier,
      seed: draft.seed,
      cityCount: draft.cityCount,
      wave: {
        elementId: `td.wave.${draft.family}-1`,
        family: draft.family,
        mode: draft.mode,
        power: draft.power,
        sector: draft.sector,
        revealTurn: draft.revealTurn,
        maximumRing: draft.maximumRing
      }
    };
  }

  let session: SimulationSession = createSession(
    sessionConfiguration(scenario, 'dev3-session-initiale')
  );

  function defaultSelection(city: CityState): Selection {
    const target =
      session.cities.find((candidate) => candidate.id !== city.id)?.id ??
      city.id;

    return {
      td: tdOrderOptions[0].id,
      tf: `tf.extract.${String.fromCharCode(
        97 + session.cities.indexOf(city) % 3
      )}`,
      rpg: rpgOrderOptions[0].id,
      aidTarget: target
    };
  }

  function createSelections(current: SimulationSession): Record<string, Selection> {
    return Object.fromEntries(
      current.cities.map((city) => [city.id, defaultSelection(city)])
    );
  }

  let selections: Record<string, Selection> = createSelections(session);
  let copyStatus = '';
  let activeCityId: CityId = session.cities[0].id;

  $: visibleWave = getVisibleWaveInformation(session);
  $: completeLog = exportSessionLog(session);
  $: ordersLocked =
    session.phase !== 'preparation' && session.phase !== 'pre-wave';

  function newSession(): void {
    session = createSession(
      sessionConfiguration(
        scenario,
        `dev3-${Date.now().toString(36)}`
      )
    );
    selections = createSelections(session);
    activeCityId = session.cities[0].id;
    copyStatus = '';
  }

  function findTdOrder(id: string): TdOrder {
    return structuredClone(
      tdOrderOptions.find((option) => option.id === id)?.order ??
        tdOrderOptions[0].order
    );
  }

  function findTfOrder(id: string): TfOrder {
    return structuredClone(
      tfOrderOptions.find((option) => option.id === id)?.order ??
        tfOrderOptions[0].order
    );
  }

  function findRpgOrder(
    selection: Selection
  ): RpgOrder {
    if (selection.rpg === 'rpg.aid-city') {
      return {
        type: 'aid-city',
        targetCityId: selection.aidTarget
      };
    }

    return structuredClone(
      rpgOrderOptions.find((option) => option.id === selection.rpg)
        ?.order ?? rpgOrderOptions[0].order
    );
  }

  function resolveTurn(): void {
    if (ordersLocked) return;

    let next = session;

    for (const city of next.cities) {
      const selection = selections[city.id];
      const orders: CityTurnOrders = {
        td: findTdOrder(selection.td),
        tf: findTfOrder(selection.tf),
        rpg: findRpgOrder(selection)
      };

      next = queueOrders(next, city.id, orders);
    }

    session = resolvePreparationTurn(next);
    copyStatus = '';
  }

  function progressWave(): void {
    if (session.phase !== 'wave') return;
    session = advanceWave(session);
    copyStatus = '';
  }

  function patchSelection(
    cityId: CityId,
    patch: Partial<Selection>
  ): void {
    selections = {
      ...selections,
      [cityId]: {
        ...selections[cityId],
        ...patch
      }
    };
  }

  function updateCharacterText(
    cityId: CityId,
    field: 'name' | 'pronouns' | 'biography',
    value: string
  ): void {
    const next = structuredClone(session);
    const city = next.cities.find((candidate) => candidate.id === cityId);

    if (!city) return;

    city.character[field] = value;
    session = next;
  }

  function updateCharacterValue(
    cityId: CityId,
    group: 'characteristics' | 'skills',
    elementId: string,
    field: 'base' | 'modifier',
    value: number
  ): void {
    const next = structuredClone(session);
    const city = next.cities.find((candidate) => candidate.id === cityId);
    const record = city?.character[group][elementId];

    if (!city || !record) return;

    record[field] = value;
    record.final = Math.max(0, record.base + record.modifier);
    session = next;
  }

  async function copyLog(): Promise<void> {
    try {
      await navigator.clipboard.writeText(completeLog);
      copyStatus = 'Journal copié.';
    } catch {
      copyStatus =
        'Copie automatique impossible : sélectionne le journal ci-dessous.';
    }
  }

  function downloadLog(): void {
    const blob = new Blob([completeLog], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = downloadLogFilename(session);
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function elementName(elementId: string): string {
    return getElementById(elementId)?.displayName ?? elementId;
  }

  function stockEntries(city: CityState): Array<[string, number]> {
    return Object.entries(city.stock).filter(([, amount]) => amount !== 0);
  }

</script>

<svelte:head>
  <title>Prototype intégré v0.9-dev.3 — Les Lisières d’Avelune</title>
  <meta
    name="description"
    content="Prototype fonctionnel intégré TD, TF et RPG des Lisières d’Avelune."
  />
</svelte:head>

<AccessibilityPanel />

<main class="prototype-shell">
  <section class="hero-panel">
    <div>
      <p class="eyebrow">Laboratoire mécanique · v0.9-dev.3</p>
      <h1>Cœur fonctionnel intégré</h1>
      <p>
        Chaque corps-cité reçoit un ordre TD, un ordre TF et un ordre RPG par
        tour. Les quatre stratégies sont ensuite confrontées à une même vague
        ou à une trajectoire commune.
      </p>
    </div>

    <dl class="session-state">
      <div>
        <dt>Phase</dt>
        <dd>{session.phase}</dd>
      </div>
      <div>
        <dt>Tour</dt>
        <dd>{session.currentTurn}</dd>
      </div>
      <div>
        <dt>Préparation résolue</dt>
        <dd>{session.completedPreparationTurns}/10</dd>
      </div>
      <div>
        <dt>Session</dt>
        <dd>{session.sessionId}</dd>
      </div>
    </dl>
  </section>

  <section class="control-grid">
    <article class="panel test-controller">
      <header>
        <div>
          <p class="eyebrow">Contrôle de test</p>
          <h2>Nouvelle session</h2>
        </div>
        <span class="badge editable">modifiable</span>
      </header>

      <div class="field-grid">
        <label>
          <span>Seed</span>
          <input
            value={scenario.seed}
            oninput={(event) =>
              (scenario = {
                ...scenario,
                seed: (event.currentTarget as HTMLInputElement).value
              })}
          />
        </label>

        <label>
          <span>Corps-cités</span>
          <select
            value={scenario.cityCount}
            onchange={(event) =>
              (scenario = {
                ...scenario,
                cityCount: Number(
                  (event.currentTarget as HTMLSelectElement).value
                ) as 4 | 6
              })}
          >
            <option value="4">4 — comparaison lisible</option>
            <option value="6">6 — laboratoire étendu</option>
          </select>
        </label>

        <label>
          <span>Mode de vague</span>
          <select
            value={scenario.mode}
            onchange={(event) =>
              (scenario = {
                ...scenario,
                mode: (event.currentTarget as HTMLSelectElement)
                  .value as WaveMode
              })}
          >
            <option value="comparison">Comparaison</option>
            <option value="trajectory">Trajectoire</option>
          </select>
        </label>

        <label>
          <span>Type de vague</span>
          <select
            value={scenario.family}
            onchange={(event) =>
              (scenario = {
                ...scenario,
                family: (event.currentTarget as HTMLSelectElement)
                  .value as WaveFamily
              })}
          >
            <option value="impact">Impact</option>
            <option value="corrosion">Corrosion</option>
            <option value="interference">Interférence</option>
          </select>
        </label>

        <label>
          <span>Puissance</span>
          <input
            type="number"
            min="5"
            max="100"
            value={scenario.power}
            oninput={(event) =>
              (scenario = {
                ...scenario,
                power: Number(
                  (event.currentTarget as HTMLInputElement).value
                )
              })}
          />
        </label>

        <label>
          <span>Tour de révélation</span>
          <select
            value={scenario.revealTurn}
            onchange={(event) =>
              (scenario = {
                ...scenario,
                revealTurn: Number(
                  (event.currentTarget as HTMLSelectElement).value
                ) as 7 | 8 | 9
              })}
          >
            <option value="7">Fin du tour 7</option>
            <option value="8">Fin du tour 8</option>
            <option value="9">Fin du tour 9</option>
          </select>
        </label>

        <label>
          <span>Secteur</span>
          <select
            value={scenario.sector}
            onchange={(event) =>
              (scenario = {
                ...scenario,
                sector: (event.currentTarget as HTMLSelectElement).value
              })}
          >
            <option>Est</option>
            <option>Nord</option>
            <option>Sud</option>
            <option>Ouest</option>
          </select>
        </label>
      </div>

      <button class="primary-button" type="button" onclick={newSession}>
        Créer ou recommencer la session
      </button>
    </article>

    <article class="panel locked-rules">
      <header>
        <div>
          <p class="eyebrow">Règles du cœur</p>
          <h2>Paramètres verrouillés</h2>
        </div>
        <span class="badge locked">fixe</span>
      </header>

      <dl>
        <div>
          <dt>Ordres par cité</dt>
          <dd>1 TD + 1 TF + 1 RPG</dd>
        </div>
        <div>
          <dt>Résolution</dt>
          <dd>RPG → TF → TD</dd>
        </div>
        <div>
          <dt>Préparation maximale</dt>
          <dd>10 tours</dd>
        </div>
        <div>
          <dt>Après révélation</dt>
          <dd>1 tour de pré-vague</dd>
        </div>
        <div>
          <dt>Progression</dt>
          <dd>Fracture → anneaux → Lisière</dd>
        </div>
        <div>
          <dt>Construction interne</dt>
          <dd>Aucun emplacement spatial</dd>
        </div>
      </dl>
    </article>
  </section>

  <section class="panel wave-knowledge">
    <header>
      <div>
        <p class="eyebrow">Informations accessibles au joueur</p>
        <h2>Connaissance de la vague</h2>
      </div>
      <span class:revealed={session.waveKnowledge.typeKnown} class="badge">
        {session.waveKnowledge.typeKnown ? 'révélée' : 'partielle'}
      </span>
    </header>

    <div class="knowledge-grid">
      <div>
        <span>Type</span>
        <strong>{visibleWave.type}</strong>
      </div>
      <div>
        <span>Secteur</span>
        <strong>{visibleWave.sector}</strong>
      </div>
      <div>
        <span>Puissance</span>
        <strong>{visibleWave.power}</strong>
      </div>
      <div>
        <span>Observations</span>
        <strong>{session.waveKnowledge.observations}</strong>
      </div>
      <div>
        <span>Analyses</span>
        <strong>{session.waveKnowledge.analyses}</strong>
      </div>
    </div>
  </section>

  <section class="panel map-panel">
    <header>
      <div>
        <p class="eyebrow">Lecture spatiale simple</p>
        <h2>Fracture, anneaux et Lisière</h2>
      </div>
      <span class="badge">
        anneau actif : {session.waveRuntime.currentRing}
      </span>
    </header>

    <WorldMap
      {session}
      {activeCityId}
      onSelectCity={(cityId) => (activeCityId = cityId)}
    />

    <p class="textual-map">
      En mode <strong>{session.wave.mode}</strong>, la vague part de la
      Fracture. En trajectoire, seules les cités du secteur
      <strong>{session.wave.sector}</strong> transmettent le résidu à la cité
      suivante. En comparaison, chaque cité reçoit la puissance initiale
      complète.
    </p>
  </section>

  <section class="cities-section">
    <header class="section-header">
      <div>
        <p class="eyebrow">Pilotage parallèle</p>
        <h2>{session.cities.length} corps-cités</h2>
      </div>

      {#if !ordersLocked}
        <button class="primary-button" type="button" onclick={resolveTurn}>
          {session.phase === 'pre-wave'
            ? 'Résoudre le tour de pré-vague'
            : `Résoudre les trois ordres du tour ${session.currentTurn}`}
        </button>
      {:else if session.phase === 'wave'}
        <button class="danger-button" type="button" onclick={progressWave}>
          Avancer la vague vers l’anneau
          {session.waveRuntime.currentRing}
        </button>
      {:else}
        <span class="badge revealed">session terminée</span>
      {/if}
    </header>

    <div class="city-grid">
      {#each session.cities as city}
        <article
          class:active-card={activeCityId === city.id}
          class="city-card"
        >
          <header>
            <button
              class="city-title"
              type="button"
              onclick={() => (activeCityId = city.id)}
            >
              <strong>{city.name}</strong>
              <span>Anneau {city.ring} · {city.sector}</span>
            </button>

            <div class="integrity">
              <span>Intégrité</span>
              <strong>{city.integrity}/{city.maximumIntegrity}</strong>
            </div>
          </header>

          <div class="city-metrics">
            <span>Terrain {city.terrainIntegrity}/100</span>
            <span>Fatigue {city.character.fatigue}/12</span>
            <span>
              Défenses {city.defenses.length}
            </span>
            <span>
              Bâtiments {city.buildings.length}
            </span>
          </div>

          <div class="orders">
            <label>
              <span class="axis-label td">Ordre TD</span>
              <select
                disabled={ordersLocked}
                value={selections[city.id].td}
                onchange={(event) =>
                  patchSelection(city.id, {
                    td: (event.currentTarget as HTMLSelectElement).value
                  })}
              >
                {#each tdOrderOptions as option}
                  <option value={option.id}>{option.label}</option>
                {/each}
              </select>
              <small>
                {tdOrderOptions.find(
                  (option) => option.id === selections[city.id].td
                )?.description}
              </small>
            </label>

            <label>
              <span class="axis-label tf">Ordre TF</span>
              <select
                disabled={ordersLocked}
                value={selections[city.id].tf}
                onchange={(event) =>
                  patchSelection(city.id, {
                    tf: (event.currentTarget as HTMLSelectElement).value
                  })}
              >
                {#each tfOrderOptions as option}
                  <option value={option.id}>{option.label}</option>
                {/each}
              </select>
              <small>
                {tfOrderOptions.find(
                  (option) => option.id === selections[city.id].tf
                )?.description}
              </small>
            </label>

            <label>
              <span class="axis-label rpg">Ordre RPG</span>
              <select
                disabled={ordersLocked}
                value={selections[city.id].rpg}
                onchange={(event) =>
                  patchSelection(city.id, {
                    rpg: (event.currentTarget as HTMLSelectElement).value
                  })}
              >
                {#each rpgOrderOptions as option}
                  <option value={option.id}>{option.label}</option>
                {/each}
                <option value="rpg.aid-city">
                  Aider un autre corps-cité
                </option>
              </select>
              <small>
                {selections[city.id].rpg === 'rpg.aid-city'
                  ? 'Donne un bonus TD et TF à une autre cité.'
                  : rpgOrderOptions.find(
                      (option) => option.id === selections[city.id].rpg
                    )?.description}
              </small>
            </label>

            {#if selections[city.id].rpg === 'rpg.aid-city'}
              <label>
                <span>Cible de l’aide</span>
                <select
                  disabled={ordersLocked}
                  value={selections[city.id].aidTarget}
                  onchange={(event) =>
                    patchSelection(city.id, {
                      aidTarget: (event.currentTarget as HTMLSelectElement)
                        .value as CityId
                    })}
                >
                  {#each session.cities.filter(
                    (candidate) => candidate.id !== city.id
                  ) as target}
                    <option value={target.id}>{target.name}</option>
                  {/each}
                </select>
              </label>
            {/if}
          </div>

          <details>
            <summary>Stocks et constructions</summary>

            <div class="state-columns">
              <div>
                <h3>Stock {Object.values(city.stock).reduce((a, b) => a + b, 0)}/{city.stockCapacity}</h3>
                <ul>
                  {#each stockEntries(city) as [elementId, amount]}
                    <li>
                      <span>{elementName(elementId)}</span>
                      <strong>{amount}</strong>
                    </li>
                  {/each}
                </ul>
              </div>

              <div>
                <h3>Bâtiments</h3>
                <ul>
                  {#each city.buildings as building}
                    <li>
                      <span>{elementName(building.elementId)}</span>
                      <strong>
                        {building.integrity}/{building.maximumIntegrity}
                      </strong>
                    </li>
                  {/each}
                </ul>
              </div>

              <div>
                <h3>Défenses</h3>
                <ul>
                  {#if city.defenses.length === 0}
                    <li>Aucune défense construite.</li>
                  {:else}
                    {#each city.defenses as defense}
                      <li>
                        <span>{elementName(defense.elementId)}</span>
                        <strong>
                          {defense.integrity}/{defense.maximumIntegrity}
                        </strong>
                      </li>
                    {/each}
                  {/if}
                </ul>
              </div>
            </div>
          </details>

          <details>
            <summary>Fiche RPG simplifiée</summary>

            <div class="character-fields">
              <label>
                <span>Nom</span>
                <input
                  value={city.character.name}
                  oninput={(event) =>
                    updateCharacterText(
                      city.id,
                      'name',
                      (event.currentTarget as HTMLInputElement).value
                    )}
                />
              </label>

              <label>
                <span>Pronoms facultatifs</span>
                <input
                  value={city.character.pronouns}
                  oninput={(event) =>
                    updateCharacterText(
                      city.id,
                      'pronouns',
                      (event.currentTarget as HTMLInputElement).value
                    )}
                />
              </label>

              <label class="wide">
                <span>Biographie ou notes</span>
                <textarea
                  rows="3"
                  value={city.character.biography}
                  oninput={(event) =>
                    updateCharacterText(
                      city.id,
                      'biography',
                      (event.currentTarget as HTMLTextAreaElement).value
                    )}
                ></textarea>
              </label>
            </div>

            <div class="rpg-tables">
              <table>
                <caption>Caractéristiques</caption>
                <thead>
                  <tr>
                    <th>Élément</th>
                    <th>Base</th>
                    <th>Mod.</th>
                    <th>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {#each Object.entries(
                    city.character.characteristics
                  ) as [elementId, value]}
                    <tr>
                      <td>{elementName(elementId)}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="9"
                          value={value.base}
                          oninput={(event) =>
                            updateCharacterValue(
                              city.id,
                              'characteristics',
                              elementId,
                              'base',
                              Number(
                                (event.currentTarget as HTMLInputElement)
                                  .value
                              )
                            )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="-9"
                          max="9"
                          value={value.modifier}
                          oninput={(event) =>
                            updateCharacterValue(
                              city.id,
                              'characteristics',
                              elementId,
                              'modifier',
                              Number(
                                (event.currentTarget as HTMLInputElement)
                                  .value
                              )
                            )}
                        />
                      </td>
                      <td>{value.final}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>

              <table>
                <caption>Compétences</caption>
                <thead>
                  <tr>
                    <th>Élément</th>
                    <th>Base</th>
                    <th>Mod.</th>
                    <th>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {#each Object.entries(
                    city.character.skills
                  ) as [elementId, value]}
                    <tr>
                      <td>{elementName(elementId)}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="9"
                          value={value.base}
                          oninput={(event) =>
                            updateCharacterValue(
                              city.id,
                              'skills',
                              elementId,
                              'base',
                              Number(
                                (event.currentTarget as HTMLInputElement)
                                  .value
                              )
                            )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="-9"
                          max="9"
                          value={value.modifier}
                          oninput={(event) =>
                            updateCharacterValue(
                              city.id,
                              'skills',
                              elementId,
                              'modifier',
                              Number(
                                (event.currentTarget as HTMLInputElement)
                                  .value
                              )
                            )}
                        />
                      </td>
                      <td>{value.final}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </details>
        </article>
      {/each}
    </div>
  </section>

  <section class="panel log-panel">
    <header>
      <div>
        <p class="eyebrow">Trace reproductible</p>
        <h2>Journal intégral</h2>
      </div>

      <div class="log-actions">
        <button type="button" onclick={copyLog}>Copier le journal</button>
        <button type="button" onclick={downloadLog}>Télécharger le journal</button>
      </div>
    </header>

    {#if copyStatus}
      <p class="copy-status" aria-live="polite">{copyStatus}</p>
    {/if}

    <textarea
      class="complete-log"
      readonly
      aria-label="Journal complet de la session"
      value={completeLog}
    ></textarea>
  </section>
</main>

<style>
  :global(html) {
    font-family: var(
      --a11y-font-family,
      Inter,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif
    );
    font-size: calc(100% * var(--a11y-font-scale, 1));
    line-height: var(--a11y-line-height, 1.5);
    letter-spacing: var(--a11y-letter-spacing, 0);
    word-spacing: var(--a11y-word-spacing, 0);
  }

  :global(html[data-remove-italics='true'] em),
  :global(html[data-remove-italics='true'] i) {
    font-style: normal !important;
    font-weight: 700;
  }

  :global(html[data-reduced-motion='true'] *),
  :global(html[data-reduced-motion='true'] *::before),
  :global(html[data-reduced-motion='true'] *::after) {
    scroll-behavior: auto !important;
    animation: none !important;
    transition: none !important;
  }

  .prototype-shell {
    --surface: rgba(31, 22, 39, 0.92);
    --surface-strong: #17101e;
    --surface-soft: rgba(61, 42, 72, 0.48);
    --border: rgba(220, 192, 238, 0.18);
    --text: #f1eaf5;
    --muted: #b8abbf;
    --accent: #cda7e0;
    --accent-strong: #a96bc4;
    --success: #a8d4b2;
    --warning: #e0c081;
    --danger: #df8e97;

    display: grid;
    gap: 1.25rem;
    width: min(100%, 96rem);
    margin: 0 auto;
    padding: 2rem 1rem 7rem;
    color: var(--text);
  }

  :global(html[data-color-scheme='light']) .prototype-shell {
    --surface: rgba(255, 252, 247, 0.94);
    --surface-strong: #f3ede4;
    --surface-soft: rgba(225, 214, 228, 0.62);
    --border: rgba(78, 57, 91, 0.2);
    --text: #29222e;
    --muted: #665a6c;
    --accent: #704c82;
    --accent-strong: #5a356c;
    --success: #3d7350;
    --warning: #87651f;
    --danger: #9b3f4b;
  }

  .hero-panel,
  .panel,
  .city-card {
    border: 1px solid var(--border);
    border-radius: 0.85rem;
    background: var(--surface);
    box-shadow: 0 0.8rem 2.5rem rgba(0, 0, 0, 0.18);
  }

  .hero-panel {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 0.8fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }

  h1,
  h2,
  h3,
  p {
    max-width: var(--a11y-max-line, 78ch);
  }

  h1 {
    margin: 0.2rem 0 0.8rem;
    font-size: clamp(2rem, 4vw, 3.6rem);
    line-height: 1;
  }

  h2 {
    margin: 0.15rem 0 0;
    font-size: 1.35rem;
  }

  h3 {
    margin: 0 0 0.55rem;
    font-size: 1rem;
  }

  p {
    color: var(--muted);
  }

  .eyebrow {
    margin: 0;
    color: var(--accent);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .session-state,
  .locked-rules dl {
    display: grid;
    gap: 0.7rem;
    margin: 0;
  }

  .session-state {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .session-state div,
  .locked-rules dl div {
    padding: 0.75rem;
    border-radius: 0.55rem;
    background: var(--surface-soft);
  }

  dt {
    color: var(--muted);
    font-size: 0.76rem;
  }

  dd {
    margin: 0.15rem 0 0;
    font-weight: 750;
  }

  .control-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 0.8fr);
    gap: 1.25rem;
  }

  .panel {
    padding: 1.2rem;
  }

  .panel > header,
  .city-card > header,
  .section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .field-grid,
  .character-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
    margin-top: 1rem;
  }

  label {
    display: grid;
    gap: 0.32rem;
    color: var(--muted);
    font-size: 0.82rem;
  }

  input,
  select,
  textarea,
  button {
    font: inherit;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 0.42rem;
    background: var(--surface-strong);
    color: var(--text);
  }

  input,
  select {
    min-height: 2.6rem;
    padding: 0.45rem 0.58rem;
  }

  textarea {
    padding: 0.65rem;
    resize: vertical;
  }

  button {
    min-height: 2.5rem;
    border: 1px solid var(--border);
    border-radius: 0.48rem;
    background: var(--surface-soft);
    color: var(--text);
    cursor: pointer;
  }

  button:hover,
  button:focus-visible {
    border-color: var(--accent);
  }

  button:disabled,
  select:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .primary-button,
  .danger-button {
    padding: 0.65rem 1rem;
    font-weight: 800;
  }

  .primary-button {
    margin-top: 1rem;
    background: var(--accent-strong);
    color: #ffffff;
  }

  .danger-button {
    background: #7d3440;
    color: #ffffff;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    min-height: 1.8rem;
    padding: 0.25rem 0.55rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .badge.editable {
    color: var(--success);
  }

  .badge.locked {
    color: var(--muted);
    filter: grayscale(1);
  }

  .badge.revealed {
    color: var(--warning);
  }

  .knowledge-grid,
  .city-metrics {
    display: grid;
    gap: 0.6rem;
    margin-top: 1rem;
  }

  .knowledge-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .knowledge-grid div,
  .city-metrics span {
    padding: 0.65rem;
    border-radius: 0.48rem;
    background: var(--surface-soft);
  }

  .knowledge-grid span {
    display: block;
    color: var(--muted);
    font-size: 0.75rem;
  }

  .city-card.active-card {
    border-color: var(--accent);
  }

  .textual-map {
    margin-bottom: 0;
  }

  .cities-section {
    display: grid;
    gap: 1rem;
  }

  .section-header {
    align-items: center;
  }

  .section-header .primary-button {
    margin-top: 0;
  }

  .city-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .city-card {
    padding: 1rem;
  }

  .city-title {
    display: grid;
    justify-items: start;
    min-height: auto;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
  }

  .city-title strong {
    font-size: 1.15rem;
  }

  .city-title span,
  .integrity span {
    color: var(--muted);
    font-size: 0.75rem;
  }

  .integrity {
    display: grid;
    justify-items: end;
  }

  .city-metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .city-metrics span {
    font-size: 0.72rem;
    text-align: center;
  }

  .orders {
    display: grid;
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .orders small {
    min-height: 2.2em;
    color: var(--muted);
  }

  .axis-label {
    width: max-content;
    padding: 0.16rem 0.4rem;
    border-radius: 0.3rem;
    font-weight: 800;
  }

  .axis-label.td {
    background: rgba(211, 114, 128, 0.18);
    color: #efb0b9;
  }

  .axis-label.tf {
    background: rgba(121, 174, 207, 0.18);
    color: #aad3eb;
  }

  .axis-label.rpg {
    background: rgba(164, 137, 211, 0.2);
    color: #d0bced;
  }

  details {
    margin-top: 0.85rem;
    border-top: 1px solid var(--border);
  }

  summary {
    padding: 0.8rem 0 0.2rem;
    cursor: pointer;
    color: var(--accent);
    font-weight: 750;
  }

  .state-columns,
  .rpg-tables {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.8rem;
    margin-top: 0.8rem;
  }

  .state-columns > div {
    padding: 0.7rem;
    border-radius: 0.45rem;
    background: var(--surface-soft);
  }

  ul {
    display: grid;
    gap: 0.3rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    color: var(--muted);
    font-size: 0.75rem;
  }

  .character-fields .wide {
    grid-column: 1 / -1;
  }

  .rpg-tables {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.74rem;
  }

  caption {
    margin-bottom: 0.45rem;
    color: var(--accent);
    font-weight: 800;
    text-align: left;
  }

  th,
  td {
    padding: 0.35rem;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }

  td input {
    min-height: 2rem;
    width: 3.5rem;
  }

  .log-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .log-actions button {
    padding: 0.5rem 0.75rem;
  }

  .copy-status {
    color: var(--success);
  }

  .complete-log {
    min-height: 32rem;
    margin-top: 1rem;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.75rem;
    white-space: pre;
  }

  :global(html[data-interface-density='compact']) .panel,
  :global(html[data-interface-density='compact']) .city-card {
    padding: 0.8rem;
  }

  :global(html[data-interface-density='spacious']) .prototype-shell {
    gap: 1.7rem;
  }

  :global(html[data-interface-density='spacious']) .panel,
  :global(html[data-interface-density='spacious']) .city-card {
    padding: 1.45rem;
  }

  :global(html[data-high-contrast='true']) .hero-panel,
  :global(html[data-high-contrast='true']) .panel,
  :global(html[data-high-contrast='true']) .city-card,
  :global(html[data-high-contrast='true']) input,
  :global(html[data-high-contrast='true']) select,
  :global(html[data-high-contrast='true']) textarea {
    border-width: 2px;
  }

  :global(html[data-emphasize-active-task='true'])
    .city-card.active-card {
    outline: 3px solid var(--accent);
    outline-offset: 3px;
  }

  @media (max-width: 1050px) {
    .hero-panel,
    .control-grid,
    .city-grid {
      grid-template-columns: 1fr;
    }

    .knowledge-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 700px) {
    .prototype-shell {
      padding-inline: 0.65rem;
    }

    .hero-panel,
    .panel,
    .city-card {
      border-radius: 0.55rem;
    }

    .session-state,
    .field-grid,
    .character-fields,
    .knowledge-grid,
    .city-metrics,
    .state-columns,
    .rpg-tables {
      grid-template-columns: 1fr;
    }

    .panel > header,
    .section-header {
      align-items: stretch;
      flex-direction: column;
    }

    .complete-log {
      min-height: 24rem;
    }
  }
</style>
