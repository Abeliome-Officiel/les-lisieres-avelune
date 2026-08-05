<script lang="ts">
        import { onMount } from 'svelte';

        import {
                PLAYABLE_CONSTRUCTION_CATALOG,
                PLAYABLE_RESEARCH_PRESENTATIONS,
                PLAYABLE_TD_FABRICATIONS,
                PLAYABLE_TEST_NOTE_CATEGORIES,
                constructPlayableBrowserStructure,
                connectPlayableBrowserTfStructures,
                createPlayableBrowserSession,
                createPlayableTestNote,
                fabricatePlayableBrowserTower,
                getPlayableBrowserForecast,
                getPlayableBrowserPendingDiscovery,
                getPlayableBrowserResearchChoices,
                getTotalUnanalysedWaveMatter,
                movePlayableBrowserTower,
                parsePlayableTestNotes,
                placePlayableBrowserTower,
                previewPlayableConstruction,
                previewPlayableTdFabrication,
                removePlayableBrowserTower,
                resolvePlayableBrowserTurn,
                resolvePlayableBrowserWave,
                serializePlayableTestNotes,
                setPlayableBrowserStructureActive,
                startPlayableBrowserResearch,
                summarizeStoredResources,
                validatePlayableBrowserDiscovery,
                type PlayableConstructionDefinitionId,
                type PlayableResearchDefinitionId,
                type PlayableTestNote,
                type PlayableTestNoteCategory,
                type Proto0PlayableBrowserState,
                type ResourceId,
                type TdPathPosition,
                type TdTowerDefinitionId
        } from '$lib/proto0/index.js';

        type ViewId =
                | 'corcite'
                | 'tf'
                | 'research'
                | 'defense'
                | 'wave'
                | 'notebook';

        const views: {
                id: ViewId;
                label: string;
        }[] = [
                {
                        id: 'corcite',
                        label: 'Corcite'
                },
                {
                        id: 'tf',
                        label: 'TF'
                },
                {
                        id: 'research',
                        label: 'Recherche'
                },
                {
                        id: 'defense',
                        label: 'Défense'
                },
                {
                        id: 'wave',
                        label: 'Vague'
                },
                {
                        id: 'notebook',
                        label: 'Carnet'
                }
        ];

        const pathPositions =
                Array.from(
                        {
                                length: 8
                        },
                        (_, index) =>
                                (
                                        index + 1
                                ) as TdPathPosition
                );

        let activeView:
                ViewId = 'corcite';

        let session:
                Proto0PlayableBrowserState =
                createPlayableBrowserSession({
                        testerCode: 'IRFI',
                        seed: 20260806,
                        runId:
                                'PROTO0-PLAYABLE-UI-20260806'
                });

        let uiError = '';

        const NOTE_STORAGE_KEY =
                'avelune:proto0:test-notes:v1';

        let noteCategory:
                PlayableTestNoteCategory =
                'strategy';

        let noteText = '';

        let testNotes:
                PlayableTestNote[] = [];

        let connectionFrom = '';
        let connectionTo = '';
        let connectionResource:
                ResourceId = 'R1';

        let placementTargets:
                Record<string, TdPathPosition> =
                {};

        let moveTargets:
                Record<number, TdPathPosition> =
                {};

        onMount(
                () => {
                        testNotes =
                                parsePlayableTestNotes(
                                        localStorage.getItem(
                                                NOTE_STORAGE_KEY
                                        )
                                );
                }
        );

        $: forecast =
                getPlayableBrowserForecast(
                        session
                );

        $: researchChoices =
                getPlayableBrowserResearchChoices(
                        session
                );

        $: pendingDiscovery =
                getPlayableBrowserPendingDiscovery(
                        session
                );

        $: resources =
                summarizeStoredResources(
                        session.corcite
                );

        $: unknownWaveMatter =
                getTotalUnanalysedWaveMatter(
                        session.corcite
                );

        $: totalStorageCapacity =
                session.corcite
                        .storageUnits.reduce(
                                (
                                        total,
                                        unit
                                ) =>
                                        total +
                                        unit.capacity,
                                0
                        );

        $: totalStorageLoad =
                session.corcite
                        .storageUnits.reduce(
                                (
                                        total,
                                        unit
                                ) =>
                                        total +
                                        unit.contents.R1 +
                                        unit.contents.R2 +
                                        unit.contents.R3 +
                                        unit.contents.R4 +
                                        (
                                                unit.unanalysedWaveMatter ??
                                                0
                                        ),
                                0
                        );

        $: preparationOpen =
                session.waveCycle.phase ===
                'preparation';

        $: activeResearch =
                session.corcite.rpg
                        .researches.find(
                                (research) =>
                                        research.status ===
                                        'active'
                        );

        $: productiveStructures =
                session.corcite
                        .structures.filter(
                                (structure) =>
                                        ![
                                                'corcite-core-n1',
                                                'storage-n1'
                                        ].includes(
                                                structure.kind
                                        )
                        );

        function persistTestNotes(): void {
                localStorage.setItem(
                        NOTE_STORAGE_KEY,
                        serializePlayableTestNotes(
                                testNotes
                        )
                );
        }

        function noteCategoryLabel(
                category:
                        PlayableTestNoteCategory
        ): string {
                return (
                        PLAYABLE_TEST_NOTE_CATEGORIES
                                .find(
                                        (entry) =>
                                                entry.id ===
                                                category
                                )
                                ?.label ??
                        category
                );
        }

        function addTestNote(): void {
                try {
                        const waveNumber =
                                session.waveCycle.current
                                        ?.waveNumber ??
                                session.waveCycle.history.at(
                                        -1
                                )?.waveNumber ??
                                null;

                        const note =
                                createPlayableTestNote({
                                        category:
                                                noteCategory,
                                        text:
                                                noteText,
                                        context: {
                                                runId:
                                                        session.runId,
                                                turn:
                                                        session.currentTurn,
                                                view:
                                                        activeView,
                                                waveNumber,
                                                wavePhase:
                                                        session.waveCycle.phase,
                                                statusMessage:
                                                        session.statusMessage,
                                                integrity:
                                                        session.corcite.recovery
                                                                .integrity.current,
                                                energyReserve:
                                                        session.corcite.capacities
                                                                .energy.reserveCurrent,
                                                maintenanceDebt:
                                                        session.corcite.sustainability
                                                                ?.maintenance.debt ??
                                                        0
                                        }
                                });

                        testNotes = [
                                note,
                                ...testNotes
                        ];

                        persistTestNotes();

                        noteText = '';
                        uiError = '';
                } catch (error) {
                        uiError =
                                errorMessage(
                                        error
                                );
                }
        }

        function exportTestNotes(): void {
                const blob =
                        new Blob(
                                [
                                        serializePlayableTestNotes(
                                                testNotes
                                        )
                                ],
                                {
                                        type:
                                                'application/json'
                                }
                        );

                const url =
                        URL.createObjectURL(
                                blob
                        );

                const link =
                        document.createElement(
                                'a'
                        );

                link.href =
                        url;

                link.download =
                        `avelune-carnet-${session.runId}.json`;

                link.click();

                URL.revokeObjectURL(
                        url
                );
        }

        function errorMessage(
                error: unknown
        ): string {
                return error instanceof Error
                        ? error.message
                        : String(error);
        }

        function apply(
                operation:
                        () =>
                                Proto0PlayableBrowserState
        ): void {
                try {
                        session =
                                operation();

                        uiError = '';
                } catch (error) {
                        uiError =
                                errorMessage(
                                        error
                                );
                }
        }

        function newSession(): void {
                const seed =
                        Math.floor(
                                Math.random() *
                                        4294967296
                        ) >>> 0;

                session =
                        createPlayableBrowserSession({
                                testerCode:
                                        'IRFI',
                                seed,
                                runId:
                                        `PROTO0-PLAYABLE-UI-${seed}`
                        });

                activeView =
                        'corcite';

                connectionFrom = '';
                connectionTo = '';
                connectionResource =
                        'R1';

                placementTargets = {};
                moveTargets = {};
                uiError = '';
        }

        function construct(
                definitionId:
                        PlayableConstructionDefinitionId
        ): void {
                apply(
                        () =>
                                constructPlayableBrowserStructure(
                                        session,
                                        definitionId
                                )
                );
        }

        function toggleStructure(
                structureId: string,
                currentlyActive:
                        boolean
        ): void {
                apply(
                        () =>
                                setPlayableBrowserStructureActive(
                                        session,
                                        structureId,
                                        !currentlyActive
                                )
                );
        }

        function connectTf(): void {
                if (
                        !connectionFrom ||
                        !connectionTo
                ) {
                        uiError =
                                'Choisissez une structure source et une structure destination.';

                        return;
                }

                apply(
                        () =>
                                connectPlayableBrowserTfStructures(
                                        session,
                                        {
                                                fromStructureId:
                                                        connectionFrom,
                                                toStructureId:
                                                        connectionTo,
                                                resourceId:
                                                        connectionResource
                                        }
                                )
                );
        }

        function startResearch(
                definitionId:
                        PlayableResearchDefinitionId
        ): void {
                apply(
                        () =>
                                startPlayableBrowserResearch(
                                        session,
                                        definitionId
                                )
                );
        }

        function validateDiscovery(
                definitionId:
                        PlayableResearchDefinitionId
        ): void {
                apply(
                        () =>
                                validatePlayableBrowserDiscovery(
                                        session,
                                        definitionId
                                )
                );
        }

        function fabricateTower(
                definitionId:
                        TdTowerDefinitionId
        ): void {
                apply(
                        () =>
                                fabricatePlayableBrowserTower(
                                        session,
                                        definitionId
                                )
                );
        }

        function placeTower(
                towerId: string
        ): void {
                const position =
                        placementTargets[
                                towerId
                        ];

                if (!position) {
                        uiError =
                                'Choisissez une position libre pour cette défense.';

                        return;
                }

                apply(
                        () =>
                                placePlayableBrowserTower(
                                        session,
                                        towerId,
                                        position
                                )
                );
        }

        function removeTower(
                position:
                        TdPathPosition
        ): void {
                apply(
                        () =>
                                removePlayableBrowserTower(
                                        session,
                                        position
                                )
                );
        }

        function moveTower(
                from:
                        TdPathPosition
        ): void {
                const target =
                        moveTargets[
                                from
                        ];

                if (!target) {
                        uiError =
                                'Choisissez une nouvelle position.';

                        return;
                }

                apply(
                        () =>
                                movePlayableBrowserTower(
                                        session,
                                        from,
                                        target
                                )
                );
        }

        function resolveTurn(): void {
                apply(
                        () =>
                                resolvePlayableBrowserTurn(
                                        session
                                )
                );
        }

        function resolveWave(): void {
                apply(
                        () =>
                                resolvePlayableBrowserWave(
                                        session
                                )
                );

                activeView =
                        'wave';
        }

        function researchPresentation(
                id: string
        ) {
                return PLAYABLE_RESEARCH_PRESENTATIONS
                        .find(
                                (presentation) =>
                                        presentation.id ===
                                        id
                        );
        }

        function getConnectionBuffer(
                connectionId: string
        ) {
                return session.corcite
                        .tfNetwork.buffers.find(
                                (buffer) =>
                                        buffer.connectionId ===
                                        connectionId
                        );
        }

        function formatNumber(
                value: number
        ): string {
                return Number.isInteger(
                        value
                )
                        ? String(value)
                        : value.toFixed(2);
        }
</script>

<svelte:head>
        <title>Les Lisières d’Avelune — PROTO-0 jouable</title>
        <meta
                name="description"
                content="Prototype jouable des Lisières d’Avelune."
        />
</svelte:head>

<div class="app-shell">
        <header class="topbar">
                <div class="brand">
                        <p class="eyebrow">
                                LES LISIÈRES D’AVELUNE
                        </p>

                        <h1>
                                PROTO-0 jouable
                        </h1>
                </div>

                <button
                        class="secondary compact-button"
                        type="button"
                        onclick={newSession}
                >
                        Nouvelle partie
                </button>
        </header>

        <section
                class="status-strip"
                aria-label="État du Corcite"
        >
                <div>
                        <span>Tour</span>
                        <strong>
                                {session.currentTurn}
                        </strong>
                </div>

                <div>
                        <span>Énergie</span>
                        <strong>
                                {session.corcite.capacities.energy.used}/{session.corcite.capacities.energy.normalCapacity}
                        </strong>
                        <small>
                                réserve {formatNumber(session.corcite.capacities.energy.reserveCurrent)}/{session.corcite.capacities.energy.reserveMaximum}
                        </small>
                </div>

                <div>
                        <span>Stockage</span>
                        <strong>
                                {formatNumber(totalStorageLoad)}/{formatNumber(totalStorageCapacity)}
                        </strong>
                </div>

                <div>
                        <span>Vague</span>

                        {#if session.waveCycle.phase === 'ready'}
                                <strong class="danger-text">
                                        arrivée
                                </strong>
                        {:else if session.waveCycle.phase === 'complete'}
                                <strong>
                                        cycle terminé
                                </strong>
                        {:else if forecast}
                                <strong>
                                        {forecast.turnsUntilWave}
                                        {forecast.turnsUntilWave === 1
                                                ? ' tour'
                                                : ' tours'}
                                </strong>
                        {:else}
                                <strong>
                                        hors lecture
                                </strong>
                        {/if}
                </div>
        </section>

        {#if uiError}
                <div
                        class="message error-message"
                        role="alert"
                >
                        {uiError}
                </div>
        {/if}

        <div
                class="message status-message"
                aria-live="polite"
        >
                {session.statusMessage}
        </div>

        <main>
                {#if activeView === 'corcite'}
                        <section class="view">
                                <div class="section-heading">
                                        <div>
                                                <p class="eyebrow">
                                                        CORPS-CITÉ
                                                </p>

                                                <h2>
                                                        État du Corcite
                                                </h2>
                                        </div>

                                        <span
                                                class:danger-badge={session.corcite.recovery.integrity.current < 50}
                                                class="badge"
                                        >
                                                Intégrité
                                                {formatNumber(session.corcite.recovery.integrity.current)}
                                        </span>
                                </div>

                                <div class="metric-grid">
                                        <article class="metric">
                                                <span>
                                                        Population
                                                </span>
                                                <strong>
                                                        {session.corcite.population.total}
                                                </strong>
                                        </article>

                                        <article class="metric">
                                                <span>
                                                        Travail
                                                </span>
                                                <strong>
                                                        {session.corcite.capacities.work.used}/{session.corcite.capacities.work.capacity}
                                                </strong>
                                        </article>

                                        <article class="metric">
                                                <span>
                                                        Entretien
                                                </span>
                                                <strong>
                                                        {session.corcite.capacities.maintenance.used}/{session.corcite.capacities.maintenance.capacity}
                                                </strong>

                                                <small>
                                                        dette
                                                        {formatNumber(session.corcite.sustainability?.maintenance.debt ?? 0)}
                                                </small>
                                        </article>

                                        <article class="metric">
                                                <span>
                                                        Espace
                                                </span>
                                                <strong>
                                                        {session.corcite.capacities.space.used}/{session.corcite.capacities.space.capacity}
                                                </strong>
                                        </article>
                                </div>

                                <div class="panel">
                                        <div class="panel-heading">
                                                <div>
                                                        <h3>
                                                                Structures
                                                        </h3>
                                                        <p>
                                                                Les fonctions productives actives utilisent énergie et travail. Les mettre en réserve permet de réorganiser le Corcite.
                                                        </p>
                                                </div>
                                        </div>

                                        <div class="card-list">
                                                {#each session.corcite.structures as structure}
                                                        <article class="compact-card">
                                                                <div>
                                                                        <strong>
                                                                                {structure.name}
                                                                        </strong>

                                                                        <p>
                                                                                {structure.status}
                                                                                · E {structure.usage.energy}
                                                                                · M {structure.usage.maintenance}
                                                                                · T {structure.usage.work}
                                                                                · S {structure.usage.space}
                                                                        </p>
                                                                </div>

                                                                {#if !['corcite-core-n1', 'storage-n1'].includes(structure.kind)}
                                                                        <button
                                                                                type="button"
                                                                                class="secondary"
                                                                                disabled={!preparationOpen}
                                                                                onclick={() =>
                                                                                        toggleStructure(
                                                                                                structure.id,
                                                                                                structure.status === 'active'
                                                                                        )}
                                                                        >
                                                                                {structure.status === 'active'
                                                                                        ? 'Mettre en réserve'
                                                                                        : 'Activer'}
                                                                        </button>
                                                                {/if}
                                                        </article>
                                                {/each}
                                        </div>
                                </div>

                                <div class="panel">
                                        <div class="panel-heading">
                                                <div>
                                                        <h3>
                                                                Développer le Corcite
                                                        </h3>
                                                        <p>
                                                                Construire ne termine pas le tour. Les limites viennent des ressources, du travail, de l’énergie et de l’espace.
                                                        </p>
                                                </div>
                                        </div>

                                        <div class="catalog-grid">
                                                {#each PLAYABLE_CONSTRUCTION_CATALOG as definition}
                                                        <article class="catalog-card">
                                                                <div>
                                                                        <h4>
                                                                                {definition.label}
                                                                        </h4>

                                                                        <p>
                                                                                {definition.description}
                                                                        </p>

                                                                        <p class="cost">
                                                                                Coût :
                                                                                {#each Object.entries(definition.resourceCosts) as [resourceId, amount]}
                                                                                        <span>
                                                                                                {resourceId} {amount}
                                                                                        </span>
                                                                                {/each}
                                                                        </p>
                                                                </div>

                                                                {#if previewPlayableConstruction(session.corcite, definition.id).canConstruct}
                                                                        <button
                                                                                type="button"
                                                                                disabled={!preparationOpen}
                                                                                onclick={() =>
                                                                                        construct(
                                                                                                definition.id
                                                                                        )}
                                                                        >
                                                                                Construire
                                                                        </button>
                                                                {:else}
                                                                        <div>
                                                                                <button
                                                                                        type="button"
                                                                                        disabled
                                                                                >
                                                                                        Indisponible
                                                                                </button>

                                                                                <p class="blockers">
                                                                                        {previewPlayableConstruction(session.corcite, definition.id).blockers.join(' · ')}
                                                                                </p>
                                                                        </div>
                                                                {/if}
                                                        </article>
                                                {/each}
                                        </div>
                                </div>
                        </section>
                {:else if activeView === 'tf'}
                        <section class="view">
                                <div class="section-heading">
                                        <div>
                                                <p class="eyebrow">
                                                        PRODUCTION
                                                </p>

                                                <h2>
                                                        Ressources et flux
                                                </h2>
                                        </div>
                                </div>

                                <div class="resource-grid">
                                        <article>
                                                <span>R1</span>
                                                <strong>{formatNumber(resources.R1)}</strong>
                                                <small>Matière organique brute</small>
                                        </article>

                                        <article>
                                                <span>R2</span>
                                                <strong>{formatNumber(resources.R2)}</strong>
                                                <small>Matière minérale brute</small>
                                        </article>

                                        <article>
                                                <span>R3</span>
                                                <strong>{formatNumber(resources.R3)}</strong>
                                                <small>Matériau transformé</small>
                                        </article>

                                        <article>
                                                <span>R4</span>
                                                <strong>{formatNumber(resources.R4)}</strong>
                                                <small>Composant fabriqué</small>
                                        </article>

                                        <article>
                                                <span>Vague</span>
                                                <strong>{formatNumber(unknownWaveMatter)}</strong>
                                                <small>Matière non analysée</small>
                                        </article>
                                </div>

                                <div class="panel">
                                        <h3>
                                                Stockages physiques
                                        </h3>

                                        <div class="card-list">
                                                {#each session.corcite.storageUnits as storage}
                                                        <article class="compact-card vertical-card">
                                                                <strong>
                                                                        {storage.name}
                                                                </strong>

                                                                <p>
                                                                        Capacité {formatNumber(storage.capacity)}
                                                                </p>

                                                                <p>
                                                                        R1 {formatNumber(storage.contents.R1)}
                                                                        · R2 {formatNumber(storage.contents.R2)}
                                                                        · R3 {formatNumber(storage.contents.R3)}
                                                                        · R4 {formatNumber(storage.contents.R4)}
                                                                        · Vague {formatNumber(storage.unanalysedWaveMatter ?? 0)}
                                                                </p>
                                                        </article>
                                                {/each}
                                        </div>
                                </div>

                                <div class="panel">
                                        <div class="panel-heading">
                                                <div>
                                                        <h3>
                                                                Réseau direct
                                                        </h3>
                                                        <p>
                                                                Une connexion crée automatiquement son tampon aval. Les sorties du tour N ne sont consommables qu’au tour N+1.
                                                        </p>
                                                </div>
                                        </div>

                                        <div class="form-grid">
                                                <label>
                                                        Source
                                                        <select
                                                                bind:value={connectionFrom}
                                                                disabled={!preparationOpen}
                                                        >
                                                                <option value="">
                                                                        Choisir
                                                                </option>

                                                                {#each productiveStructures as structure}
                                                                        <option value={structure.id}>
                                                                                {structure.name}
                                                                        </option>
                                                                {/each}
                                                        </select>
                                                </label>

                                                <label>
                                                        Destination
                                                        <select
                                                                bind:value={connectionTo}
                                                                disabled={!preparationOpen}
                                                        >
                                                                <option value="">
                                                                        Choisir
                                                                </option>

                                                                {#each productiveStructures as structure}
                                                                        <option value={structure.id}>
                                                                                {structure.name}
                                                                        </option>
                                                                {/each}
                                                        </select>
                                                </label>

                                                <label>
                                                        Ressource
                                                        <select
                                                                bind:value={connectionResource}
                                                                disabled={!preparationOpen}
                                                        >
                                                                <option value="R1">R1</option>
                                                                <option value="R2">R2</option>
                                                                <option value="R3">R3</option>
                                                                <option value="R4">R4</option>
                                                        </select>
                                                </label>

                                                <button
                                                        type="button"
                                                        disabled={!preparationOpen}
                                                        onclick={connectTf}
                                                >
                                                        Connecter
                                                </button>
                                        </div>

                                        {#if session.corcite.tfNetwork.connections.length === 0}
                                                <p class="muted">
                                                        Aucune connexion directe.
                                                </p>
                                        {:else}
                                                <div class="card-list">
                                                        {#each session.corcite.tfNetwork.connections as connection}
                                                                <article class="compact-card vertical-card">
                                                                        <strong>
                                                                                {connection.resourceId}
                                                                        </strong>
                                                                        <p>
                                                                                {connection.fromStructureId}
                                                                                → {connection.toStructureId}
                                                                        </p>

                                                                        {#if getConnectionBuffer(connection.id)}
                                                                                <small>
                                                                                        Tampon
                                                                                        {formatNumber(getConnectionBuffer(connection.id)?.amount ?? 0)}/{formatNumber(getConnectionBuffer(connection.id)?.capacity ?? 0)}
                                                                                </small>
                                                                        {/if}
                                                                </article>
                                                        {/each}
                                                </div>
                                        {/if}
                                </div>

                                {#if session.lastTf}
                                        <div class="panel">
                                                <h3>
                                                        Dernier tour productif
                                                </h3>

                                                <div class="event-list">
                                                        {#each session.lastTf.extraction.events as event}
                                                                <p>
                                                                        {event.message}
                                                                </p>
                                                        {/each}

                                                        {#each session.lastTf.transformation.events as event}
                                                                <p>
                                                                        {event.message}
                                                                </p>
                                                        {/each}

                                                        {#each session.lastTf.fabrication.events as event}
                                                                <p>
                                                                        {event.message}
                                                                </p>
                                                        {/each}
                                                </div>
                                        </div>
                                {/if}
                        </section>
                {:else if activeView === 'research'}
                        <section class="view">
                                <div class="section-heading">
                                        <div>
                                                <p class="eyebrow">
                                                        ÉVOLUTION
                                                </p>

                                                <h2>
                                                        Recherche
                                                </h2>
                                        </div>
                                </div>

                                {#if pendingDiscovery}
                                        <article class="discovery-card">
                                                <p class="eyebrow">
                                                        DÉCOUVERTE
                                                </p>

                                                <h3>
                                                        {pendingDiscovery.definition.label}
                                                </h3>

                                                <p>
                                                        {researchPresentation(pendingDiscovery.definition.id)?.summary}
                                                </p>

                                                <p>
                                                        {researchPresentation(pendingDiscovery.definition.id)?.effectSummary}
                                                </p>

                                                <button
                                                        type="button"
                                                        disabled={!preparationOpen}
                                                        onclick={() =>
                                                                validateDiscovery(
                                                                        pendingDiscovery.definition.id as PlayableResearchDefinitionId
                                                                )}
                                                >
                                                        Examiner et valider
                                                </button>
                                        </article>
                                {/if}

                                {#if activeResearch}
                                        <div class="panel">
                                                <p class="eyebrow">
                                                        RECHERCHE ACTIVE
                                                </p>

                                                <h3>
                                                        {activeResearch.definitionId}
                                                </h3>

                                                <p class="progress-text">
                                                        Progression :
                                                        {activeResearch.progressTurns}/{activeResearch.durationTurns}
                                                        tours
                                                </p>

                                                <progress
                                                        value={activeResearch.progressTurns}
                                                        max={activeResearch.durationTurns}
                                                ></progress>
                                        </div>
                                {/if}

                                <div class="catalog-grid">
                                        {#each researchChoices.definitions as definition}
                                                <article class="catalog-card">
                                                        <div>
                                                                <p class="eyebrow">
                                                                        {researchPresentation(definition.id)?.category ?? 'recherche'}
                                                                </p>

                                                                <h3>
                                                                        {definition.label}
                                                                </h3>

                                                                <p>
                                                                        {researchPresentation(definition.id)?.summary}
                                                                </p>

                                                                <p>
                                                                        {researchPresentation(definition.id)?.effectSummary}
                                                                </p>

                                                                <p>
                                                                        Durée :
                                                                        {definition.durationTurns}
                                                                        tours
                                                                </p>
                                                        </div>

                                                        <button
                                                                type="button"
                                                                disabled={!preparationOpen || !researchChoices.canStartResearch}
                                                                onclick={() =>
                                                                        startResearch(
                                                                                definition.id as PlayableResearchDefinitionId
                                                                        )}
                                                        >
                                                                Lancer
                                                        </button>
                                                </article>
                                        {/each}
                                </div>

                                {#if researchChoices.blockers.length > 0}
                                        <p class="blockers">
                                                {researchChoices.blockers.join(' · ')}
                                        </p>
                                {/if}

                                {#if session.corcite.rpg.researches.length > 0}
                                        <div class="panel">
                                                <h3>
                                                        Historique
                                                </h3>

                                                <div class="card-list">
                                                        {#each session.corcite.rpg.researches as research}
                                                                <article class="compact-card">
                                                                        <strong>
                                                                                {research.definitionId}
                                                                        </strong>

                                                                        <span class="badge">
                                                                                {research.status}
                                                                        </span>
                                                                </article>
                                                        {/each}
                                                </div>
                                        </div>
                                {/if}
                        </section>
                {:else if activeView === 'defense'}
                        <section class="view">
                                <div class="section-heading">
                                        <div>
                                                <p class="eyebrow">
                                                        PRÉPARATION TD
                                                </p>

                                                <h2>
                                                        Défense
                                                </h2>
                                        </div>
                                </div>

                                <div class="panel">
                                        <h3>
                                                Fabriquer
                                        </h3>

                                        <p class="muted">
                                                Chaque défense est un objet physique fabriqué par l’atelier. Aucun placement gratuit.
                                        </p>

                                        <div class="catalog-grid">
                                                {#each PLAYABLE_TD_FABRICATIONS as definition}
                                                        <article class="catalog-card">
                                                                <div>
                                                                        <p class="eyebrow">
                                                                                {definition.family}
                                                                        </p>

                                                                        <h4>
                                                                                {definition.label}
                                                                        </h4>

                                                                        <p>
                                                                                {definition.summary}
                                                                        </p>

                                                                        <p class="cost">
                                                                                Coût :
                                                                                {#each Object.entries(definition.resourceCosts) as [resourceId, amount]}
                                                                                        <span>
                                                                                                {resourceId} {amount}
                                                                                        </span>
                                                                                {/each}
                                                                        </p>
                                                                </div>

                                                                <button
                                                                        type="button"
                                                                        disabled={!preparationOpen || !previewPlayableTdFabrication(session.corcite, definition.definitionId).canFabricate}
                                                                        onclick={() =>
                                                                                fabricateTower(
                                                                                        definition.definitionId
                                                                                )}
                                                                >
                                                                        Fabriquer
                                                                </button>

                                                                {#if !previewPlayableTdFabrication(session.corcite, definition.definitionId).canFabricate}
                                                                        <p class="blockers">
                                                                                {previewPlayableTdFabrication(session.corcite, definition.definitionId).blockers.join(' · ')}
                                                                        </p>
                                                                {/if}
                                                        </article>
                                                {/each}
                                        </div>
                                </div>

                                <div class="panel">
                                        <h3>
                                                Inventaire
                                        </h3>

                                        {#if session.corcite.tdInventory.length === 0}
                                                <p class="muted">
                                                        Aucune défense en réserve.
                                                </p>
                                        {:else}
                                                <div class="card-list">
                                                        {#each session.corcite.tdInventory as tower}
                                                                <article class="compact-card inventory-card">
                                                                        <div>
                                                                                <strong>
                                                                                        {tower.definitionId}
                                                                                </strong>
                                                                        </div>

                                                                        <div class="inline-actions">
                                                                                <select
                                                                                        bind:value={placementTargets[tower.id]}
                                                                                        disabled={!preparationOpen}
                                                                                >
                                                                                        <option value={undefined}>
                                                                                                Position
                                                                                        </option>

                                                                                        {#each pathPositions as position}
                                                                                                <option
                                                                                                        value={position}
                                                                                                        disabled={Boolean(session.corcite.td.positions[position - 1].tower)}
                                                                                                >
                                                                                                        {position}
                                                                                                </option>
                                                                                        {/each}
                                                                                </select>

                                                                                <button
                                                                                        type="button"
                                                                                        disabled={!preparationOpen}
                                                                                        onclick={() =>
                                                                                                placeTower(
                                                                                                        tower.id
                                                                                                )}
                                                                                >
                                                                                        Placer
                                                                                </button>
                                                                        </div>
                                                                </article>
                                                        {/each}
                                                </div>
                                        {/if}
                                </div>

                                <div class="panel">
                                        <h3>
                                                Chemin de la vague
                                        </h3>

                                        <div class="td-path">
                                                {#each session.corcite.td.positions as slot}
                                                        <article
                                                                class:occupied={Boolean(slot.tower)}
                                                                class="td-slot"
                                                        >
                                                                <span class="position-number">
                                                                        {slot.position}
                                                                </span>

                                                                {#if slot.tower}
                                                                        <strong>
                                                                                {slot.tower.definitionId}
                                                                        </strong>

                                                                        <div class="slot-actions">
                                                                                <select
                                                                                        bind:value={moveTargets[slot.position]}
                                                                                        disabled={!preparationOpen}
                                                                                >
                                                                                        <option value={undefined}>
                                                                                                Déplacer vers…
                                                                                        </option>

                                                                                        {#each pathPositions as target}
                                                                                                {#if target !== slot.position}
                                                                                                        <option
                                                                                                                value={target}
                                                                                                                disabled={Boolean(session.corcite.td.positions[target - 1].tower)}
                                                                                                        >
                                                                                                                {target}
                                                                                                        </option>
                                                                                                {/if}
                                                                                        {/each}
                                                                                </select>

                                                                                <button
                                                                                        type="button"
                                                                                        class="secondary"
                                                                                        disabled={!preparationOpen}
                                                                                        onclick={() =>
                                                                                                moveTower(
                                                                                                        slot.position
                                                                                                )}
                                                                                >
                                                                                        Déplacer
                                                                                </button>

                                                                                <button
                                                                                        type="button"
                                                                                        class="secondary"
                                                                                        disabled={!preparationOpen}
                                                                                        onclick={() =>
                                                                                                removeTower(
                                                                                                        slot.position
                                                                                                )}
                                                                                >
                                                                                        Retirer
                                                                                </button>
                                                                        </div>
                                                                {:else}
                                                                        <span class="muted">
                                                                                vide
                                                                        </span>
                                                                {/if}
                                                        </article>
                                                {/each}
                                        </div>
                                </div>
                        </section>
                {:else if activeView === 'wave'}
                        <section class="view">
                                <div class="section-heading">
                                        <div>
                                                <p class="eyebrow">
                                                        CYCLE
                                                </p>

                                                <h2>
                                                        Vague
                                                </h2>
                                        </div>

                                        <span class="badge">
                                                {session.waveCycle.history.length}/{session.waveCycle.plannedWaveCount}
                                                résolues
                                        </span>
                                </div>

                                {#if session.waveCycle.phase === 'complete'}
                                        <article class="discovery-card">
                                                <p class="eyebrow">
                                                        CYCLE TERMINÉ
                                                </p>

                                                <h3>
                                                        Trois vagues traversées
                                                </h3>

                                                <p>
                                                        Le Corcite a conservé ses constructions, recherches, conséquences et matières récupérées pendant l’ensemble de la partie.
                                                </p>
                                        </article>
                                {:else if session.waveCycle.phase === 'ready'}
                                        <article class="wave-alert">
                                                <p class="eyebrow">
                                                        VAGUE ARRIVÉE
                                                </p>

                                                <h3>
                                                        La préparation est verrouillée.
                                                </h3>

                                                <p>
                                                        Le tour {session.currentTurn} a déjà été produit. Il n’est plus possible de construire ou réorganiser avant le passage de la vague.
                                                </p>

                                                <button
                                                        type="button"
                                                        class="danger-action"
                                                        onclick={resolveWave}
                                                >
                                                        Résoudre la vague
                                                </button>
                                        </article>
                                {:else if forecast}
                                        <article class="forecast-card">
                                                <div class="section-heading">
                                                        <div>
                                                                <p class="eyebrow">
                                                                        {forecast.stageLabel}
                                                                </p>

                                                                <h3>
                                                                        Vague {forecast.waveNumber}
                                                                </h3>
                                                        </div>

                                                        <strong>
                                                                {forecast.turnsUntilWave}
                                                                {forecast.turnsUntilWave === 1
                                                                        ? ' tour'
                                                                        : ' tours'}
                                                        </strong>
                                                </div>

                                                <p>
                                                        Incertitude :
                                                        ±{formatNumber(forecast.effectiveUncertaintyPercent)} %
                                                </p>

                                                <div class="wave-values">
                                                        <div>
                                                                <span>Pression</span>
                                                                <strong>
                                                                        {formatNumber(forecast.estimatedWave.pressure)}
                                                                </strong>
                                                        </div>

                                                        <div>
                                                                <span>Structure</span>
                                                                <strong>
                                                                        {formatNumber(forecast.estimatedWave.structure)}
                                                                </strong>
                                                        </div>

                                                        <div>
                                                                <span>Charge</span>
                                                                <strong>
                                                                        {formatNumber(forecast.estimatedWave.charge)}
                                                                </strong>
                                                        </div>

                                                        <div>
                                                                <span>Matière</span>
                                                                <strong>
                                                                        {formatNumber(forecast.estimatedWave.capturableMatter)}
                                                                </strong>
                                                        </div>
                                                </div>
                                        </article>
                                {:else}
                                        <div class="panel">
                                                <h3>
                                                        Aucun signal exploitable
                                                </h3>

                                                <p>
                                                        Une vague existe dans le cycle, mais son arrivée se situe encore hors de l’horizon de lecture actuel.
                                                </p>

                                                <p class="muted">
                                                        Après la première vague, le prototype garantit au moins cinq tours de développement ; une petite variation peut retarder le passage jusqu’à deux tours supplémentaires.
                                                </p>
                                        </div>
                                {/if}

                                {#if session.lastWave}
                                        <div class="panel">
                                                <h3>
                                                        Dernière vague
                                                </h3>

                                                <div class="wave-values">
                                                        <div>
                                                                <span>Pression réelle</span>
                                                                <strong>
                                                                        {formatNumber(session.lastWave.historyEntry.actualWave.pressure)}
                                                                </strong>
                                                                <small>
                                                                        après défense {formatNumber(session.lastWave.historyEntry.finalWave.pressure)}
                                                                </small>
                                                        </div>

                                                        <div>
                                                                <span>Structure réelle</span>
                                                                <strong>
                                                                        {formatNumber(session.lastWave.historyEntry.actualWave.structure)}
                                                                </strong>
                                                                <small>
                                                                        après défense {formatNumber(session.lastWave.historyEntry.finalWave.structure)}
                                                                </small>
                                                        </div>

                                                        <div>
                                                                <span>Charge réelle</span>
                                                                <strong>
                                                                        {formatNumber(session.lastWave.historyEntry.actualWave.charge)}
                                                                </strong>
                                                                <small>
                                                                        après défense {formatNumber(session.lastWave.historyEntry.finalWave.charge)}
                                                                </small>
                                                        </div>

                                                        <div>
                                                                <span>Captée</span>
                                                                <strong>
                                                                        {formatNumber(session.lastWave.historyEntry.capturedMatter)}
                                                                </strong>
                                                                <small>
                                                                        matière retirée de la vague
                                                                </small>
                                                        </div>
                                                </div>

                                                <p>
                                                        Intégrité actuelle :
                                                        <strong>
                                                                {formatNumber(session.corcite.recovery.integrity.current)}
                                                        </strong>
                                                </p>

                                                <p>
                                                        Matière de vague stockée :
                                                        <strong>
                                                                {formatNumber(unknownWaveMatter)}
                                                        </strong>
                                                </p>
                                        </div>
                                {/if}

                                {#if session.waveCycle.history.length > 0}
                                        <div class="panel">
                                                <h3>
                                                        Historique des vagues
                                                </h3>

                                                <div class="card-list">
                                                        {#each session.waveCycle.history as entry}
                                                                <article class="compact-card">
                                                                        <div>
                                                                                <strong>
                                                                                        Vague {entry.waveNumber}
                                                                                </strong>

                                                                                <p>
                                                                                        {entry.label}
                                                                                        · tour {entry.resolvedTurn}
                                                                                </p>
                                                                        </div>

                                                                        <span class="badge">
                                                                                captée {formatNumber(entry.capturedMatter)}
                                                                        </span>
                                                                </article>
                                                        {/each}
                                                </div>
                                        </div>
                                {/if}
                        </section>
                {:else}
                        <section class="view">
                                <div class="section-heading">
                                        <div>
                                                <p class="eyebrow">
                                                        PLAYTEST
                                                </p>

                                                <h2>
                                                        Carnet de test
                                                </h2>
                                        </div>

                                        <span class="badge">
                                                {testNotes.length}
                                                note{testNotes.length > 1 ? 's' : ''}
                                        </span>
                                </div>

                                <div class="panel notebook-form">
                                        <p>
                                                Note rapidement ce que tu cherchais à faire, ce qui t’a surpris ou ce qui t’a gêné. Le tour, la vague, l’intégrité, l’énergie et l’entretien sont enregistrés automatiquement avec la note.
                                        </p>

                                        <label>
                                                Type de note

                                                <select
                                                        bind:value={noteCategory}
                                                >
                                                        {#each PLAYABLE_TEST_NOTE_CATEGORIES as category}
                                                                <option value={category.id}>
                                                                        {category.label}
                                                                </option>
                                                        {/each}
                                                </select>
                                        </label>

                                        <label>
                                                Observation

                                                <textarea
                                                        rows="5"
                                                        bind:value={noteText}
                                                        placeholder="Ex. : je voulais préparer une Captation, mais je n’ai pas compris quelle chaîne produire d’abord."
                                                ></textarea>
                                        </label>

                                        <div class="notebook-actions">
                                                <button
                                                        type="button"
                                                        disabled={!noteText.trim()}
                                                        onclick={addTestNote}
                                                >
                                                        Ajouter la note
                                                </button>

                                                <button
                                                        type="button"
                                                        class="secondary"
                                                        disabled={testNotes.length === 0}
                                                        onclick={exportTestNotes}
                                                >
                                                        Exporter le carnet
                                                </button>
                                        </div>
                                </div>

                                {#if testNotes.length === 0}
                                        <div class="panel">
                                                <p class="muted">
                                                        Aucune note pour le moment.
                                                </p>
                                        </div>
                                {:else}
                                        <div class="card-list">
                                                {#each testNotes as note}
                                                        <article class="compact-card vertical-card notebook-entry">
                                                                <div class="section-heading">
                                                                        <strong>
                                                                                {noteCategoryLabel(note.category)}
                                                                        </strong>

                                                                        <span class="badge">
                                                                                Tour {note.context.turn}
                                                                        </span>
                                                                </div>

                                                                <p>
                                                                        {note.text}
                                                                </p>

                                                                <small>
                                                                        Vague {note.context.waveNumber ?? '—'}
                                                                        · {note.context.wavePhase}
                                                                        · intégrité {formatNumber(note.context.integrity)}
                                                                        · réserve {formatNumber(note.context.energyReserve)}
                                                                        · dette entretien {formatNumber(note.context.maintenanceDebt)}
                                                                </small>

                                                                <small>
                                                                        {new Date(note.createdAtIso).toLocaleString('fr-FR')}
                                                                </small>
                                                        </article>
                                                {/each}
                                        </div>
                                {/if}
                        </section>

                {/if}
        </main>

        <section class="turn-control">
                {#if session.waveCycle.phase === 'ready'}
                        <div>
                                <strong>
                                        La vague est arrivée.
                                </strong>
                                <span>
                                        Résolvez-la avant de poursuivre.
                                </span>
                        </div>

                        <button
                                type="button"
                                class="danger-action"
                                onclick={resolveWave}
                        >
                                Résoudre la vague
                        </button>
                {:else if session.waveCycle.phase === 'complete'}
                        <div>
                                <strong>
                                        Cycle terminé
                                </strong>
                                <span>
                                        Les trois vagues ont été résolues.
                                </span>
                        </div>

                        <button
                                type="button"
                                onclick={newSession}
                        >
                                Nouvelle partie
                        </button>
                {:else}
                        <div>
                                <strong>
                                        Tour {session.currentTurn}
                                </strong>
                                <span>
                                        Les décisions ne consomment pas d’action. Terminer le tour fait avancer le temps.
                                </span>
                        </div>

                        <button
                                type="button"
                                onclick={resolveTurn}
                        >
                                Terminer le tour
                        </button>
                {/if}
        </section>

        <nav
                class="primary-nav"
                aria-label="Sections du prototype"
        >
                {#each views as view}
                        <button
                                type="button"
                                class:active={activeView === view.id}
                                aria-current={activeView === view.id
                                        ? 'page'
                                        : undefined}
                                onclick={() =>
                                        activeView =
                                                view.id}
                        >
                                {view.label}
                        </button>
                {/each}
        </nav>
</div>

<style>
        .app-shell {
                --text: #ece9f2;
                --muted: #aaa2b8;
                --accent: #9f8dcc;
                --danger: #d07d8e;
                --border: #494153;
                --focus: #cabbea;
                --control: #302a39;
                --panel-solid: #19161f;
                --panel: #211d28;
                --panel-soft: #292430;
                --accent-soft: rgb(159 141 204 / 14%);
                --danger-soft: rgb(208 125 142 / 14%);

                width: min(100%, 1180px);
                color: var(--text);
                margin: 0 auto;
                padding:
                        0.8rem
                        0.8rem
                        8.5rem;
        }

        .topbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin-bottom: 0.8rem;
        }

        .brand h1,
        .section-heading h2,
        .panel h3,
        .catalog-card h3,
        .catalog-card h4 {
                margin: 0;
        }

        .brand h1 {
                font-size:
                        clamp(
                                1.35rem,
                                5vw,
                                2rem
                        );
        }

        .eyebrow {
                margin:
                        0
                        0
                        0.3rem;
                color: var(--accent);
                font-size: 0.72rem;
                font-weight: 800;
                letter-spacing: 0.13em;
                text-transform: uppercase;
        }

        button,
        select {
                min-height: 44px;
                border:
                        1px solid
                        var(--border);
                border-radius: 0.65rem;
        }

        button {
                padding:
                        0.68rem
                        0.9rem;
                color: #17131f;
                background: var(--accent);
                font-weight: 750;
                cursor: pointer;
        }

        button:hover:not(:disabled) {
                filter: brightness(1.08);
        }

        button:focus-visible,
        select:focus-visible {
                outline:
                        3px solid
                        var(--focus);
                outline-offset: 2px;
        }

        button:disabled {
                cursor: not-allowed;
                opacity: 0.42;
        }

        button.secondary {
                color: var(--text);
                background: var(--control);
        }

        .compact-button {
                min-width: max-content;
        }

        .danger-action {
                color: #1f1115;
                background: var(--danger);
        }

        .status-strip {
                position: sticky;
                z-index: 20;
                top: 0;
                display: grid;
                grid-template-columns:
                        repeat(
                                4,
                                minmax(0, 1fr)
                        );
                gap: 0.35rem;
                padding: 0.45rem;
                border:
                        1px solid
                        var(--border);
                border-radius: 0.85rem;
                background: var(--panel-solid);
                box-shadow:
                        0 0.75rem 2rem
                        rgb(0 0 0 / 24%);
        }

        .status-strip > div {
                display: flex;
                min-width: 0;
                flex-direction: column;
                padding: 0.42rem;
                border-radius: 0.55rem;
                background: var(--panel-soft);
        }

        .status-strip span,
        .metric span,
        .resource-grid span,
        .wave-values span {
                color: var(--muted);
                font-size: 0.72rem;
        }

        .status-strip strong {
                overflow: hidden;
                font-size: 0.91rem;
                text-overflow: ellipsis;
                white-space: nowrap;
        }

        small {
                color: var(--muted);
        }

        .danger-text {
                color: var(--danger);
        }

        .message {
                margin-top: 0.6rem;
                padding:
                        0.65rem
                        0.8rem;
                border-radius: 0.65rem;
                font-size: 0.9rem;
        }

        .status-message {
                color: var(--muted);
                background: var(--panel-soft);
        }

        .error-message {
                color: #ffd9e0;
                border:
                        1px solid
                        var(--danger);
                background:
                        var(--danger-soft);
        }

        main {
                margin-top: 1rem;
        }

        .view {
                display: grid;
                gap: 1rem;
        }

        .section-heading,
        .panel-heading {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 1rem;
        }

        .section-heading h2 {
                font-size:
                        clamp(
                                1.5rem,
                                7vw,
                                2.4rem
                        );
        }

        .metric-grid,
        .resource-grid,
        .wave-values {
                display: grid;
                grid-template-columns:
                        repeat(
                                2,
                                minmax(0, 1fr)
                        );
                gap: 0.6rem;
        }

        .metric,
        .resource-grid article,
        .wave-values > div {
                display: flex;
                min-width: 0;
                flex-direction: column;
                gap: 0.2rem;
                padding: 0.8rem;
                border:
                        1px solid
                        var(--border);
                border-radius: 0.75rem;
                background: var(--panel);
        }

        .metric strong,
        .resource-grid strong,
        .wave-values strong {
                font-size: 1.25rem;
        }

        .panel,
        .discovery-card,
        .forecast-card,
        .wave-alert {
                padding: 1rem;
                border:
                        1px solid
                        var(--border);
                border-radius: 0.9rem;
                background: var(--panel);
        }

        .panel > h3:first-child {
                margin-top: 0;
        }

        .panel-heading p,
        .catalog-card p,
        .compact-card p,
        .discovery-card p,
        .forecast-card p,
        .wave-alert p {
                margin:
                        0.4rem
                        0;
                line-height: 1.45;
        }

        .catalog-grid,
        .card-list,
        .event-list {
                display: grid;
                gap: 0.65rem;
                margin-top: 0.8rem;
        }

        .catalog-card,
        .compact-card {
                display: flex;
                justify-content: space-between;
                gap: 0.8rem;
                padding: 0.8rem;
                border:
                        1px solid
                        var(--border);
                border-radius: 0.75rem;
                background: var(--panel-soft);
        }

        .catalog-card {
                flex-direction: column;
        }

        .catalog-card button {
                width: 100%;
        }

        .vertical-card {
                flex-direction: column;
        }

        .cost {
                display: flex;
                flex-wrap: wrap;
                gap: 0.35rem;
        }

        .cost span,
        .badge {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                padding:
                        0.25rem
                        0.45rem;
                border:
                        1px solid
                        var(--border);
                border-radius: 999px;
                color: var(--muted);
                background: var(--control);
                font-size: 0.76rem;
        }

        .danger-badge {
                color: #ffdbe2;
                border-color: var(--danger);
                background: var(--danger-soft);
        }

        .blockers {
                color: #e2b0ba;
                font-size: 0.78rem;
        }

        .muted {
                color: var(--muted);
        }

        .form-grid {
                display: grid;
                gap: 0.65rem;
                margin-top: 0.8rem;
        }

        label {
                display: grid;
                gap: 0.35rem;
                color: var(--muted);
                font-size: 0.82rem;
        }

        select {
                width: 100%;
                padding:
                        0.55rem
                        0.65rem;
                color: var(--text);
                background: var(--panel-solid);
        }

        .event-list p {
                margin: 0;
                padding: 0.6rem;
                border-radius: 0.55rem;
                background: var(--panel-soft);
        }

        progress {
                width: 100%;
                height: 0.8rem;
                accent-color: var(--accent);
        }

        .progress-text {
                color: var(--muted);
        }

        .discovery-card {
                border-color: var(--accent);
                background: var(--accent-soft);
        }

        .wave-alert {
                border-color: var(--danger);
                background: var(--danger-soft);
        }

        .forecast-card {
                border-color: var(--accent);
        }

        .inline-actions,
        .slot-actions {
                display: grid;
                gap: 0.45rem;
        }

        .inventory-card {
                align-items: center;
        }

        .td-path {
                display: grid;
                grid-template-columns:
                        repeat(
                                2,
                                minmax(0, 1fr)
                        );
                gap: 0.55rem;
                margin-top: 0.8rem;
        }

        .td-slot {
                display: flex;
                min-height: 8rem;
                flex-direction: column;
                gap: 0.5rem;
                padding: 0.7rem;
                border:
                        1px dashed
                        var(--border);
                border-radius: 0.75rem;
                background: var(--panel-soft);
        }

        .td-slot.occupied {
                border-style: solid;
                border-color: var(--accent);
        }

        .position-number {
                display: grid;
                width: 1.75rem;
                height: 1.75rem;
                place-items: center;
                border-radius: 999px;
                color: #17131f;
                background: var(--accent);
                font-size: 0.8rem;
                font-weight: 800;
        }

        .notebook-form {
                display: grid;
                gap: 0.8rem;
        }

        .notebook-form textarea {
                box-sizing: border-box;
                width: 100%;
                min-height: 7rem;
                resize: vertical;
                padding: 0.75rem;
                color: var(--text);
                border:
                        1px solid
                        var(--border);
                border-radius: 0.65rem;
                background: var(--panel-solid);
                font: inherit;
                line-height: 1.45;
        }

        .notebook-form textarea:focus-visible {
                outline:
                        3px solid
                        var(--focus);
                outline-offset: 2px;
        }

        .notebook-actions {
                display: grid;
                grid-template-columns:
                        repeat(
                                2,
                                minmax(0, 1fr)
                        );
                gap: 0.55rem;
        }

        .notebook-entry p {
                white-space: pre-wrap;
        }

        .turn-control {
                position: fixed;
                z-index: 30;
                right: 0.8rem;
                bottom: 4.6rem;
                left: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.7rem;
                max-width: 1160px;
                margin: 0 auto;
                padding: 0.65rem;
                border:
                        1px solid
                        var(--border);
                border-radius: 0.8rem;
                background: var(--panel-solid);
                box-shadow:
                        0 0.8rem 2.4rem
                        rgb(0 0 0 / 38%);
        }

        .turn-control div {
                display: flex;
                min-width: 0;
                flex-direction: column;
        }

        .turn-control span {
                overflow: hidden;
                max-width: 55vw;
                color: var(--muted);
                font-size: 0.72rem;
                text-overflow: ellipsis;
                white-space: nowrap;
        }

        .turn-control button {
                flex: 0 0 auto;
        }

        .primary-nav {
                position: fixed;
                z-index: 40;
                right: 0;
                bottom: 0;
                left: 0;
                display: grid;
                grid-template-columns:
                        repeat(
                                6,
                                minmax(0, 1fr)
                        );
                gap: 1px;
                padding:
                        0.35rem
                        max(
                                0.35rem,
                                env(
                                        safe-area-inset-right
                                )
                        )
                        max(
                                0.35rem,
                                env(
                                        safe-area-inset-bottom
                                )
                        )
                        max(
                                0.35rem,
                                env(
                                        safe-area-inset-left
                                )
                        );
                border-top:
                        1px solid
                        var(--border);
                background: var(--panel-solid);
        }

        .primary-nav button {
                min-width: 0;
                padding:
                        0.55rem
                        0.2rem;
                color: var(--muted);
                border-color: transparent;
                background: transparent;
                font-size: 0.75rem;
        }

        .primary-nav button.active {
                color: var(--text);
                border-color: var(--border);
                background: var(--accent-soft);
        }

        @media (min-width: 720px) {
                .app-shell {
                        padding:
                                1.2rem
                                1.2rem
                                7rem;
                }

                .metric-grid {
                        grid-template-columns:
                                repeat(
                                        4,
                                        minmax(0, 1fr)
                                );
                }

                .resource-grid {
                        grid-template-columns:
                                repeat(
                                        5,
                                        minmax(0, 1fr)
                                );
                }

                .wave-values {
                        grid-template-columns:
                                repeat(
                                        4,
                                        minmax(0, 1fr)
                                );
                }

                .catalog-grid {
                        grid-template-columns:
                                repeat(
                                        2,
                                        minmax(0, 1fr)
                                );
                }

                .form-grid {
                        grid-template-columns:
                                1fr
                                1fr
                                0.7fr
                                auto;
                        align-items: end;
                }

                .td-path {
                        grid-template-columns:
                                repeat(
                                        4,
                                        minmax(0, 1fr)
                                );
                }

                .primary-nav {
                        position: sticky;
                        top: 5.4rem;
                        z-index: 19;
                        margin:
                                0.65rem
                                0
                                1rem;
                        padding: 0.35rem;
                        border:
                                1px solid
                                var(--border);
                        border-radius: 0.8rem;
                }

                .primary-nav button {
                        font-size: 0.88rem;
                }

                .turn-control {
                        bottom: 1rem;
                }
        }

        @media (min-width: 1020px) {
                .catalog-grid {
                        grid-template-columns:
                                repeat(
                                        3,
                                        minmax(0, 1fr)
                                );
                }

                .td-path {
                        grid-template-columns:
                                repeat(
                                        8,
                                        minmax(0, 1fr)
                                );
                }

                .td-slot {
                        min-height: 10rem;
                }
        }
</style>
