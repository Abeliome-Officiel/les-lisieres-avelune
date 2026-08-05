import assert from 'node:assert/strict';
import test from 'node:test';

import {
        constructPlayableBrowserStructure,
        connectPlayableBrowserTfStructures,
        createPlayableBrowserSession,
        fabricatePlayableBrowserTower,
        getPlayableBrowserForecast,
        getPlayableBrowserPendingDiscovery,
        placePlayableBrowserTower,
        resolvePlayableBrowserTurn,
        resolvePlayableBrowserWave,
        setPlayableBrowserStructureActive,
        startPlayableBrowserResearch,
        validatePlayableBrowserDiscovery
} from '../../src/lib/proto0/index.js';

function createSession() {
        return createPlayableBrowserSession({
                testerCode: 'IRFI',
                seed: 20260804,
                runId:
                        'PLAYABLE-BROWSER-TEST'
        });
}

function advanceUntilWaveReady(
        initial =
                createSession()
) {
        let state =
                initial;

        while (
                state.waveCycle.phase ===
                'preparation'
        ) {
                state =
                        resolvePlayableBrowserTurn(
                                state
                        );
        }

        return state;
}

test(
        'le contrôleur navigateur démarre sur le vrai Corcite jouable minimal',
        () => {
                const state =
                        createSession();

                assert.equal(
                        state.currentTurn,
                        1
                );

                assert.equal(
                        state.corcite.controller,
                        'human'
                );

                assert.equal(
                        state.corcite.population.total,
                        4
                );

                assert.deepEqual(
                        state.corcite.structures.map(
                                (structure) =>
                                        structure.kind
                        ),
                        [
                                'corcite-core-n1',
                                'storage-n1'
                        ]
                );

                assert.equal(
                        state.corcite.tdInventory.length,
                        0
                );

                assert.equal(
                        state.waveCycle.plannedWaveCount,
                        3
                );

                assert.equal(
                        state.waveCycle.current
                                ?.scheduledTurn,
                        6
                );
        }
);

test(
        'plusieurs constructions peuvent être décidées dans le même tour sans quota arbitraire',
        () => {
                let state =
                        createSession();

                state =
                        constructPlayableBrowserStructure(
                                state,
                                'organic-extractor'
                        );

                state =
                        constructPlayableBrowserStructure(
                                state,
                                'mineral-extractor'
                        );

                assert.equal(
                        state.currentTurn,
                        1
                );

                assert.equal(
                        state.waveCycle.lastAdvancedTurn,
                        0
                );

                assert.equal(
                        state.corcite.structures.some(
                                (structure) =>
                                        structure.kind ===
                                        'extractor-a-n1'
                        ),
                        true
                );

                assert.equal(
                        state.corcite.structures.some(
                                (structure) =>
                                        structure.kind ===
                                        'extractor-b-n1'
                        ),
                        true
                );
        }
);

test(
        'une fonction construite peut être arrêtée avant la résolution du tour',
        () => {
                let state =
                        constructPlayableBrowserStructure(
                                createSession(),
                                'organic-extractor'
                        );

                const extractor =
                        state.corcite.structures.find(
                                (structure) =>
                                        structure.kind ===
                                        'extractor-a-n1'
                        );

                assert.ok(
                        extractor
                );

                state =
                        setPlayableBrowserStructureActive(
                                state,
                                extractor.id,
                                false
                        );

                assert.equal(
                        state.corcite.structures.find(
                                (structure) =>
                                        structure.id ===
                                        extractor.id
                        )?.status,
                        'inactive'
                );

                assert.equal(
                        state.corcite.capacities.work.used,
                        0
                );
        }
);

test(
        'le contrôleur peut construire puis connecter une vraie chaîne TF sans faire avancer le temps',
        () => {
                let state =
                        createSession();

                state =
                        constructPlayableBrowserStructure(
                                state,
                                'organic-extractor'
                        );

                state =
                        constructPlayableBrowserStructure(
                                state,
                                'primary-transformer'
                        );

                const extractor =
                        state.corcite.structures.find(
                                (structure) =>
                                        structure.kind ===
                                        'extractor-a-n1'
                        );

                const transformer =
                        state.corcite.structures.find(
                                (structure) =>
                                        structure.kind ===
                                        'transformer-n1'
                        );

                assert.ok(
                        extractor
                );

                assert.ok(
                        transformer
                );

                state =
                        connectPlayableBrowserTfStructures(
                                state,
                                {
                                        fromStructureId:
                                                extractor.id,
                                        toStructureId:
                                                transformer.id,
                                        resourceId:
                                                'R1'
                                }
                        );

                assert.equal(
                        state.currentTurn,
                        1
                );

                assert.equal(
                        state.corcite.tfNetwork
                                .connections.length,
                        1
                );

                assert.equal(
                        state.corcite.tfNetwork
                                .buffers.length,
                        1
                );
        }
);

test(
        'terminer le tour exécute le vrai moteur TF puis avance réellement le temps',
        () => {
                let state =
                        constructPlayableBrowserStructure(
                                createSession(),
                                'organic-extractor'
                        );

                state =
                        resolvePlayableBrowserTurn(
                                state
                        );

                assert.equal(
                        state.currentTurn,
                        2
                );

                assert.equal(
                        state.waveCycle.lastAdvancedTurn,
                        1
                );

                assert.ok(
                        state.lastTf
                );

                assert.equal(
                        state.lastTf?.extraction
                                .events.some(
                                        (event) =>
                                                event.status ===
                                                'produced'
                                ),
                        true
                );

                assert.equal(
                        state.corcite.sustainability
                                ?.lastResolvedTurn,
                        1
                );
        }
);

test(
        'la recherche jouable progresse avec les tours puis devient une découverte explicite',
        () => {
                let state =
                        startPlayableBrowserResearch(
                                createSession(),
                                'reserve-recovery-n1'
                        );

                state =
                        resolvePlayableBrowserTurn(
                                state
                        );

                assert.equal(
                        state.corcite.rpg
                                .researches[0]
                                .progressTurns,
                        1
                );

                assert.equal(
                        state.currentTurn,
                        2
                );

                state =
                        resolvePlayableBrowserTurn(
                                state
                        );

                assert.equal(
                        state.corcite.rpg
                                .researches[0]
                                .status,
                        'discovery-pending'
                );

                assert.equal(
                        state.currentTurn,
                        3
                );

                const discovery =
                        getPlayableBrowserPendingDiscovery(
                                state
                        );

                assert.ok(
                        discovery
                );

                state =
                        validatePlayableBrowserDiscovery(
                                state,
                                'reserve-recovery-n1'
                        );

                assert.equal(
                        state.corcite.rpg
                                .researches[0]
                                .status,
                        'validated'
                );

                assert.equal(
                        state.corcite.modifiers.some(
                                (modifier) =>
                                        modifier.target ===
                                        'corcite.energy.reserve-recovery-per-stable-turn' &&
                                        modifier.active
                        ),
                        true
                );
        }
);

test(
        'la première lecture de vague est disponible tôt sans ancien T-3 T-2 T-1',
        () => {
                const forecast =
                        getPlayableBrowserForecast(
                                createSession()
                        );

                assert.ok(
                        forecast
                );

                assert.equal(
                        forecast.turnsUntilWave,
                        5
                );

                assert.equal(
                        forecast.stage,
                        'distant'
                );

                assert.equal(
                        forecast.stageLabel,
                        'Lecture lointaine'
                );
        }
);

test(
        'le tour 6 reste ouvert sur la vague arrivée et interdit une fenêtre gratuite de préparation',
        () => {
                const state =
                        advanceUntilWaveReady();

                assert.equal(
                        state.waveCycle.phase,
                        'ready'
                );

                assert.equal(
                        state.currentTurn,
                        6
                );

                assert.equal(
                        state.waveCycle.lastAdvancedTurn,
                        6
                );

                assert.throws(
                        () =>
                                resolvePlayableBrowserTurn(
                                        state
                                ),
                        /vague est arrivée/
                );

                assert.throws(
                        () =>
                                constructPlayableBrowserStructure(
                                        state,
                                        'organic-extractor'
                                ),
                        /vague est arrivée/
                );
        }
);

test(
        'résoudre la première vague ouvre le tour 7 et conserve ses conséquences',
        () => {
                const ready =
                        advanceUntilWaveReady();

                const state =
                        resolvePlayableBrowserWave(
                                ready
                        );

                assert.equal(
                        state.currentTurn,
                        7
                );

                assert.equal(
                        state.waveCycle.phase,
                        'preparation'
                );

                assert.equal(
                        state.waveCycle.history.length,
                        1
                );

                assert.equal(
                        state.waveCycle.current
                                ?.waveNumber,
                        2
                );

                const nextWaveTurn =
                        state.waveCycle.current
                                ?.scheduledTurn;

                assert.ok(
                        nextWaveTurn !==
                                undefined
                );

                /*
                 * Le calendrier inter-vagues est désormais variable.
                 * Le contrat temporel précis est testé séparément :
                 * ici on vérifie seulement qu'une nouvelle période
                 * de préparation existe réellement.
                 */
                assert.ok(
                        nextWaveTurn >
                                state.currentTurn
                );

                assert.equal(
                        state.corcite
                                .waveConsequences.length,
                        1
                );

                assert.ok(
                        state.lastWave
                );
        }
);

test(
        'la fabrication TD passe par le vrai atelier puis par un inventaire physique',
        () => {
                let state =
                        constructPlayableBrowserStructure(
                                createSession(),
                                'component-workshop'
                        );

                /*
                 * Etat de test volontairement préparé pour isoler
                 * l'orchestration de fabrication TD.
                 *
                 * La capacité du stockage reste respectée.
                 */
                state.corcite.storageUnits[0]
                        .contents = {
                                R1: 0,
                                R2: 0,
                                R3: 4,
                                R4: 4
                        };

                state =
                        fabricatePlayableBrowserTower(
                                state,
                                'attenuation-n1'
                        );

                assert.equal(
                        state.corcite
                                .tdInventory.length,
                        1
                );

                assert.equal(
                        state.waveConsumptions.length >
                                0,
                        true
                );

                const towerId =
                        state.corcite
                                .tdInventory[0].id;

                state =
                        placePlayableBrowserTower(
                                state,
                                towerId,
                                4
                        );

                assert.equal(
                        state.corcite
                                .tdInventory.length,
                        0
                );

                assert.equal(
                        state.corcite.td
                                .positions[3]
                                .tower?.id,
                        towerId
                );
        }
);

test(
        'les consommations de fabrication TD sont rattachées à la vague puis remises à zéro',
        () => {
                let state =
                        constructPlayableBrowserStructure(
                                createSession(),
                                'component-workshop'
                        );

                state.corcite.storageUnits[0]
                        .contents = {
                                R1: 0,
                                R2: 0,
                                R3: 4,
                                R4: 4
                        };

                state =
                        fabricatePlayableBrowserTower(
                                state,
                                'attenuation-n1'
                        );

                const towerId =
                        state.corcite
                                .tdInventory[0].id;

                state =
                        placePlayableBrowserTower(
                                state,
                                towerId,
                                1
                        );

                state =
                        advanceUntilWaveReady(
                                state
                        );

                state =
                        resolvePlayableBrowserWave(
                                state
                        );

                assert.deepEqual(
                        state.waveConsumptions,
                        []
                );

                const consequence =
                        state.corcite
                                .waveConsequences[0];

                assert.ok(
                        consequence
                );

                assert.equal(
                        consequence.consumptions
                                .some(
                                        (entry) =>
                                                entry.source ===
                                                'td-fabrication:attenuation-n1'
                                ),
                        true
                );
        }
);

test(
        'le contrôleur peut parcourir les trois vagues dans une seule session',
        () => {
                let state =
                        createSession();

                while (
                        state.waveCycle.phase !==
                        'complete'
                ) {
                        while (
                                state.waveCycle.phase ===
                                'preparation'
                        ) {
                                state =
                                        resolvePlayableBrowserTurn(
                                                state
                                        );
                        }

                        if (
                                state.waveCycle.phase ===
                                'ready'
                        ) {
                                state =
                                        resolvePlayableBrowserWave(
                                                state
                                        );
                        }
                }

                assert.equal(
                        state.waveCycle.history.length,
                        3
                );

                assert.equal(
                        state.corcite
                                .waveConsequences.length,
                        3
                );

                assert.equal(
                        state.waveCycle.current,
                        null
                );

                const finalHistory =
                        state.waveCycle.history.at(
                                -1
                        );

                assert.ok(
                        finalHistory
                );

                /*
                 * La partie se termine au tour réel de la troisième
                 * vague, et non à un ancien numéro de tour figé.
                 */
                assert.equal(
                        state.currentTurn,
                        finalHistory.resolvedTurn
                );

                assert.throws(
                        () =>
                                constructPlayableBrowserStructure(
                                        state,
                                        'organic-extractor'
                                ),
                        /cycle de test est terminé/
                );
        }
);
