import assert from 'node:assert/strict';
import test from 'node:test';

import {
        advancePlayableWaveCycleAfterTurn,
        applyPlayableCaptureEconomy,
        createPlayableCorciteState,
        createPlayableWaveCycle,
        createTdTower,
        deserializeCorciteState,
        getStorageLoad,
        getTotalUnanalysedWaveMatter,
        placeTdTower,
        resolvePlayableWave,
        serializeCorciteState,
        validateCorciteState,
        type PlayableCorciteState,
        type WaveConsequenceState
} from '../../src/lib/proto0/index.js';

function createCorcite(
        suffix = 'base'
): PlayableCorciteState {
        return createPlayableCorciteState({
                id:
                        `corcite-capture-${suffix}`,
                name:
                        `CAPTURE-${suffix}`,
                controller:
                        'human'
        });
}

function clearKnownResources(
        state: PlayableCorciteState
): void {
        for (
                const storage of
                state.storageUnits
        ) {
                storage.contents.R1 = 0;
                storage.contents.R2 = 0;
                storage.contents.R3 = 0;
                storage.contents.R4 = 0;
        }
}

function addConsequence(
        state: PlayableCorciteState,
        capturedMatter: number,
        id =
                'wave-consequence:capture-test'
): WaveConsequenceState {
        const consequence:
                WaveConsequenceState = {
                        id,
                        runId:
                                'CAPTURE-TEST',
                        turn: 1,
                        defenseResult:
                                'residual',
                        initialWave: {
                                pressure: 10,
                                structure: 10,
                                charge: 10,
                                capturableMatter:
                                        capturedMatter
                        },
                        finalWave: {
                                pressure: 10,
                                structure: 10,
                                charge: 10,
                                capturableMatter: 0
                        },
                        capturedMatter,
                        consumptions: [],
                        knowledgeProduced: []
                };

        state.waveConsequences.push(
                structuredClone(
                        consequence
                )
        );

        return consequence;
}

function addCaptureTower(
        state: PlayableCorciteState
): void {
        state.td =
                placeTdTower(
                        state.td,
                        {
                                position: 1,
                                tower:
                                        createTdTower({
                                                id:
                                                        `capture-tower-${state.id}`,
                                                definitionId:
                                                        'captation-n1'
                                        })
                        }
                );
}

function advanceToFirstWave() {
        let cycle =
                createPlayableWaveCycle({
                        seed:
                                20260804
                });

        assert.ok(
                cycle.current
        );

        const scheduledTurn =
                cycle.current
                        .scheduledTurn;

        for (
                let turn = 1;
                turn <= scheduledTurn;
                turn += 1
        ) {
                cycle =
                        advancePlayableWaveCycleAfterTurn(
                                cycle,
                                turn
                        );
        }

        assert.equal(
                cycle.phase,
                'ready'
        );

        assert.ok(
                cycle.current
        );

        return cycle;
}

test(
        'le Corcite jouable démarre sans récupération de captation',
        () => {
                const corcite =
                        createCorcite();

                assert.deepEqual(
                        corcite.captureEconomy,
                        {
                                recoveries: []
                        }
                );

                assert.equal(
                        getTotalUnanalysedWaveMatter(
                                corcite
                        ),
                        0
                );
        }
);

test(
        'la matière interceptée reste distincte de la matière récupérée',
        () => {
                const corcite =
                        createCorcite();

                const knownBefore =
                        structuredClone(
                                corcite.storageUnits[0]
                                        .contents
                        );

                const consequence =
                        addConsequence(
                                corcite,
                                10
                        );

                const result =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.recovery
                                .interceptedMatter,
                        10
                );

                assert.equal(
                        result.recovery
                                .baseRecoveryRatio,
                        0.65
                );

                assert.equal(
                        result.recovery
                                .effectiveRecoveryRatio,
                        0.65
                );

                assert.equal(
                        result.recovery
                                .recoverableMatter,
                        6.5
                );

                /*
                 * Le stockage initial contient 10/12.
                 * Seules 2 unités peuvent être conservées.
                 */
                assert.equal(
                        result.recovery
                                .recoveredMatter,
                        2
                );

                assert.equal(
                        result.recovery
                                .lostDuringRecovery,
                        3.5
                );

                assert.equal(
                        result.recovery
                                .lostForLackOfStorage,
                        4.5
                );

                assert.deepEqual(
                        result.corcite
                                .storageUnits[0]
                                .contents,
                        knownBefore
                );

                assert.equal(
                        getTotalUnanalysedWaveMatter(
                                result.corcite
                        ),
                        2
                );
        }
);

test(
        'la matière de vague utilise la capacité physique du stockage',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                10
                        );

                const result =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        getStorageLoad(
                                result.corcite
                                        .storageUnits[0]
                        ),
                        12
                );
        }
);

test(
        'un stockage plein fait perdre la matière récupérable sans bloquer la résolution',
        () => {
                const corcite =
                        createCorcite();

                corcite.storageUnits[0]
                        .contents.R4 = 2;

                const consequence =
                        addConsequence(
                                corcite,
                                10
                        );

                const result =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.recovery
                                .recoverableMatter,
                        6.5
                );

                assert.equal(
                        result.recovery
                                .recoveredMatter,
                        0
                );

                assert.equal(
                        result.recovery
                                .lostForLackOfStorage,
                        6.5
                );

                assert.equal(
                        getTotalUnanalysedWaveMatter(
                                result.corcite
                        ),
                        0
                );
        }
);

test(
        'la recherche de captation améliore réellement le rendement individuel',
        () => {
                const corcite =
                        createCorcite();

                clearKnownResources(
                        corcite
                );

                corcite.modifiers.push({
                        id:
                                'modifier-capture-test',
                        source:
                                'research:capture-analysis-n1',
                        target:
                                'td.capture.effectiveness',
                        operation:
                                'multiply',
                        value:
                                1.15,
                        active:
                                true
                });

                const consequence =
                        addConsequence(
                                corcite,
                                10
                        );

                const result =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.recovery
                                .effectiveRecoveryRatio,
                        0.7475
                );

                assert.equal(
                        result.recovery
                                .recoverableMatter,
                        7.475
                );

                assert.equal(
                        result.recovery
                                .recoveredMatter,
                        7.475
                );

                assert.equal(
                        result.recovery
                                .appliedModifiers
                                .length,
                        1
                );
        }
);

test(
        'un modificateur de captation inactif ne produit aucun effet',
        () => {
                const corcite =
                        createCorcite();

                clearKnownResources(
                        corcite
                );

                corcite.modifiers.push({
                        id:
                                'modifier-capture-inactive',
                        source:
                                'research:capture-analysis-n1',
                        target:
                                'td.capture.effectiveness',
                        operation:
                                'multiply',
                        value:
                                1.15,
                        active:
                                false
                });

                const consequence =
                        addConsequence(
                                corcite,
                                10
                        );

                const result =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.recovery
                                .effectiveRecoveryRatio,
                        0.65
                );

                assert.equal(
                        result.recovery
                                .appliedModifiers
                                .length,
                        0
                );
        }
);

test(
        'une conséquence ne peut produire qu’une seule récupération économique',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                5
                        );

                const first =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                assert.throws(
                        () =>
                                applyPlayableCaptureEconomy(
                                        first.corcite,
                                        consequence.id
                                ),
                        /déjà été résolue/
                );
        }
);

test(
        'matière non analysée et historique de récupération survivent à la sérialisation',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                4
                        );

                const result =
                        applyPlayableCaptureEconomy(
                                corcite,
                                consequence.id
                        );

                const restored =
                        deserializeCorciteState(
                                serializeCorciteState(
                                        result.corcite
                                )
                        );

                assert.deepEqual(
                        restored.captureEconomy,
                        result.corcite
                                .captureEconomy
                );

                assert.equal(
                        getTotalUnanalysedWaveMatter(
                                restored
                        ),
                        getTotalUnanalysedWaveMatter(
                                result.corcite
                        )
                );
        }
);

test(
        'la validation compte la matière non analysée dans la capacité du bâtiment',
        () => {
                const corcite =
                        createCorcite();

                corcite.storageUnits[0]
                        .unanalysedWaveMatter =
                        3;

                const validation =
                        validateCorciteState(
                                corcite
                        );

                assert.equal(
                        validation.valid,
                        false
                );

                assert.ok(
                        validation.errors.some(
                                (error) =>
                                        error.includes(
                                                'dépasse sa capacité'
                                        )
                        )
                );
        }
);

test(
        'une vraie tour de Captation intercepte puis récupère de la matière',
        () => {
                const corcite =
                        createCorcite();

                addCaptureTower(
                        corcite
                );

                const knownBefore =
                        structuredClone(
                                corcite.storageUnits.map(
                                        (storage) =>
                                                storage.contents
                                )
                        );

                const cycle =
                        advanceToFirstWave();

                assert.ok(
                        cycle.current
                );

                const result =
                        resolvePlayableWave(
                                corcite,
                                cycle,
                                {
                                        runId:
                                                'CAPTURE-ECONOMY-WAVE',
                                        turn:
                                                cycle.current
                                                        .scheduledTurn
                                }
                        );

                assert.ok(
                        result.resolution
                                .capturedMatter >
                                0
                );

                /*
                 * La résolution TD conserve sa précision brute.
                 * L'économie persistée normalise volontairement
                 * ses quantités à six décimales.
                 */
                const expectedEconomicIntercept =
                        Math.round(
                                result.resolution
                                        .capturedMatter *
                                        1_000_000
                        ) /
                        1_000_000;

                assert.equal(
                        result.captureEconomy
                                .interceptedMatter,
                        expectedEconomicIntercept
                );

                /*
                 * L'historique de vague reste, lui, une photographie
                 * exacte de la résolution TD.
                 */
                assert.equal(
                        result.historyEntry
                                .capturedMatter,
                        result.resolution
                                .capturedMatter
                );

                assert.ok(
                        result.captureEconomy
                                .recoveredMatter >
                                0
                );

                assert.ok(
                        result.captureEconomy
                                .recoveredMatter <=
                                result.captureEconomy
                                        .interceptedMatter
                );

                /*
                 * Aucun R1-R4 n'est créé par la vague.
                 */
                assert.deepEqual(
                        result.corcite.storageUnits.map(
                                (storage) =>
                                        storage.contents
                        ),
                        knownBefore
                );

                assert.equal(
                        getTotalUnanalysedWaveMatter(
                                result.corcite
                        ),
                        result.captureEconomy
                                .recoveredMatter
                );
        }
);

test(
        'la recherche améliore le gain du Corcite sans augmenter le retrait de la vague',
        () => {
                const base =
                        createCorcite(
                                'base-comparison'
                        );

                const researched =
                        createCorcite(
                                'researched-comparison'
                        );

                clearKnownResources(
                        base
                );

                clearKnownResources(
                        researched
                );

                addCaptureTower(
                        base
                );

                addCaptureTower(
                        researched
                );

                researched.modifiers.push({
                        id:
                                'modifier-research-capture-analysis-n1',
                        source:
                                'research:capture-analysis-n1',
                        target:
                                'td.capture.effectiveness',
                        operation:
                                'multiply',
                        value:
                                1.15,
                        active:
                                true
                });

                const baseCycle =
                        advanceToFirstWave();

                const researchedCycle =
                        advanceToFirstWave();

                assert.ok(
                        baseCycle.current
                );

                assert.ok(
                        researchedCycle.current
                );

                const baseResult =
                        resolvePlayableWave(
                                base,
                                baseCycle,
                                {
                                        runId:
                                                'CAPTURE-BASE',
                                        turn:
                                                baseCycle.current
                                                        .scheduledTurn
                                }
                        );

                const researchedResult =
                        resolvePlayableWave(
                                researched,
                                researchedCycle,
                                {
                                        runId:
                                                'CAPTURE-RESEARCHED',
                                        turn:
                                                researchedCycle.current
                                                        .scheduledTurn
                                }
                        );

                /*
                 * Même vague + même TD :
                 * même impact réel sur la vague.
                 */
                assert.equal(
                        researchedResult
                                .resolution
                                .capturedMatter,
                        baseResult
                                .resolution
                                .capturedMatter
                );

                assert.deepEqual(
                        researchedResult
                                .resolution
                                .finalWave,
                        baseResult
                                .resolution
                                .finalWave
                );

                /*
                 * Mais rendement individuel supérieur.
                 */
                assert.ok(
                        researchedResult
                                .captureEconomy
                                .effectiveRecoveryRatio >
                        baseResult
                                .captureEconomy
                                .effectiveRecoveryRatio
                );

                assert.ok(
                        researchedResult
                                .captureEconomy
                                .recoveredMatter >
                        baseResult
                                .captureEconomy
                                .recoveredMatter
                );
        }
);

test(
        'une vague sans Captation ne crée aucune matière économique cachée',
        () => {
                const corcite =
                        createCorcite();

                const before =
                        structuredClone(
                                corcite.storageUnits
                        );

                const cycle =
                        advanceToFirstWave();

                assert.ok(
                        cycle.current
                );

                const result =
                        resolvePlayableWave(
                                corcite,
                                cycle,
                                {
                                        runId:
                                                'CAPTURE-NONE',
                                        turn:
                                                cycle.current
                                                        .scheduledTurn
                                }
                        );

                assert.equal(
                        result.captureEconomy
                                .interceptedMatter,
                        0
                );

                assert.equal(
                        result.captureEconomy
                                .recoveredMatter,
                        0
                );

                assert.deepEqual(
                        result.corcite
                                .storageUnits,
                        before
                );
        }
);
