import assert from 'node:assert/strict';
import test from 'node:test';

import {
        advancePlayableWaveCycleAfterTurn,
        applyPlayableWaveImpact,
        createPlayableCorciteState,
        createPlayableWaveCycle,
        deserializeCorciteState,
        resolvePlayableRecoveryTurn,
        resolvePlayableSustainabilityTurn,
        resolvePlayableWave,
        serializeCorciteState,
        validateCorciteState,
        type PlayableCorciteState,
        type WaveConsequenceState,
        type WaveState
} from '../../src/lib/proto0/index.js';

function createCorcite(): PlayableCorciteState {
        return createPlayableCorciteState({
                id:
                        'corcite-playable-recovery',
                name:
                        'RECOVERY',
                controller:
                        'human'
        });
}

function addConsequence(
        state: PlayableCorciteState,
        input: {
                id?: string;
                turn?: number;
                finalWave?: Partial<WaveState>;
        } = {}
): WaveConsequenceState {
        const finalWave: WaveState = {
                pressure: 0,
                structure: 0,
                charge: 0,
                capturableMatter: 0,
                ...input.finalWave
        };

        const consequence:
                WaveConsequenceState = {
                        id:
                                input.id ??
                                'wave-consequence:recovery-test',
                        runId:
                                'RECOVERY-TEST',
                        turn:
                                input.turn ?? 1,
                        defenseResult:
                                (
                                        finalWave.pressure === 0 &&
                                        finalWave.structure === 0 &&
                                        finalWave.charge === 0
                                )
                                        ? 'contained'
                                        : 'residual',
                        initialWave:
                                structuredClone(
                                        finalWave
                                ),
                        finalWave:
                                structuredClone(
                                        finalWave
                                ),
                        capturedMatter: 0,
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

function advanceToWave(
        inputCycle:
                ReturnType<
                        typeof createPlayableWaveCycle
                >
) {
        let cycle =
                inputCycle;

        if (!cycle.current) {
                throw new Error(
                        'Cycle sans vague courante.'
                );
        }

        const scheduledTurn =
                cycle.current
                        .scheduledTurn;

        for (
                let turn =
                        cycle.lastAdvancedTurn + 1;
                turn <=
                        scheduledTurn;
                turn += 1
        ) {
                cycle =
                        advancePlayableWaveCycleAfterTurn(
                                cycle,
                                turn
                        );
        }

        return cycle;
}

test(
        'le Corcite jouable démarre avec une intégrité complète',
        () => {
                const corcite =
                        createCorcite();

                assert.equal(
                        corcite.recovery.integrity
                                .current,
                        100
                );

                assert.equal(
                        corcite.recovery.integrity
                                .maximum,
                        100
                );

                assert.equal(
                        corcite.recovery.integrity
                                .damageTakenLastWave,
                        0
                );

                assert.equal(
                        corcite.recovery.integrity
                                .recoveredLastTurn,
                        0
                );

                assert.equal(
                        corcite.recovery
                                .lastWaveImpact,
                        null
                );

                assert.deepEqual(
                        corcite.recovery
                                .appliedWaveConsequenceIds,
                        []
                );
        }
);

test(
        'la pression résiduelle endommage réellement l’intégrité',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        finalWave: {
                                                pressure: 50
                                        }
                                }
                        );

                const result =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.impact
                                .integrityDamage,
                        6
                );

                assert.equal(
                        result.corcite.recovery
                                .integrity.current,
                        94
                );

                assert.equal(
                        corcite.recovery.integrity
                                .current,
                        100
                );
        }
);

test(
        'la charge résiduelle ponctionne la réserve énergétique sans la rendre négative',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        finalWave: {
                                                charge: 20
                                        }
                                }
                        );

                const result =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.impact
                                .energyReserveDrain,
                        0
                );

                assert.equal(
                        result.corcite.capacities
                                .energy.reserveCurrent,
                        0
                );
        }
);

test(
        'la structure résiduelle crée une dette d’entretien persistante',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        finalWave: {
                                                structure: 25
                                        }
                                }
                        );

                const result =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.impact
                                .maintenanceDebtAdded,
                        1
                );

                assert.equal(
                        result.corcite.sustainability
                                ?.maintenance.debt,
                        1
                );

                assert.equal(
                        result.corcite.sustainability
                                ?.maintenance.condition,
                        'strained'
                );
        }
);

test(
        'une même conséquence ne peut pas être appliquée deux fois',
        () => {
                const corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        id:
                                                'wave-consequence:unique',
                                        finalWave: {
                                                pressure: 10
                                        }
                                }
                        );

                const first =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        );

                assert.throws(
                        () =>
                                applyPlayableWaveImpact(
                                        first.corcite,
                                        consequence.id
                                ),
                        /déjà/
                );
        }
);

test(
        'l’intégrité ne descend jamais sous zéro',
        () => {
                const corcite =
                        createCorcite();

                corcite.recovery.integrity.current =
                        3;

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        finalWave: {
                                                pressure:
                                                        1000
                                        }
                                }
                        );

                const result =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        );

                assert.equal(
                        result.corcite.recovery
                                .integrity.current,
                        0
                );

                assert.equal(
                        result.impact
                                .integrityDamage,
                        3
                );
        }
);

test(
        'un tour réellement stable récupère lentement l’intégrité',
        () => {
                const corcite =
                        createCorcite();

                corcite.recovery.integrity.current =
                        90;

                const sustainability =
                        resolvePlayableSustainabilityTurn(
                                corcite,
                                1
                        );

                const recovery =
                        resolvePlayableRecoveryTurn(
                                sustainability.corcite,
                                sustainability.resolution
                        );

                assert.equal(
                        recovery.resolution.stable,
                        true
                );

                assert.equal(
                        recovery.resolution.integrity
                                .recovered,
                        1
                );

                assert.equal(
                        recovery.corcite.recovery
                                .integrity.current,
                        91
                );
        }
);

test(
        'un tour consacré à résorber une dette ne soigne pas simultanément l’intégrité',
        () => {
                let corcite =
                        createCorcite();

                corcite.recovery.integrity.current =
                        90;

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        finalWave: {
                                                structure: 25
                                        }
                                }
                        );

                corcite =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        ).corcite;

                const sustainability =
                        resolvePlayableSustainabilityTurn(
                                corcite,
                                1
                        );

                assert.equal(
                        sustainability.resolution
                                .maintenance.debtBefore,
                        1
                );

                assert.equal(
                        sustainability.resolution
                                .maintenance.debtAfter,
                        0
                );

                const recovery =
                        resolvePlayableRecoveryTurn(
                                sustainability.corcite,
                                sustainability.resolution
                        );

                assert.equal(
                        recovery.resolution.stable,
                        false
                );

                assert.equal(
                        recovery.resolution.integrity
                                .recovered,
                        0
                );

                assert.equal(
                        recovery.corcite.recovery
                                .integrity.current,
                        90
                );
        }
);

test(
        'les conséquences et la récupération survivent à la sérialisation',
        () => {
                let corcite =
                        createCorcite();

                const consequence =
                        addConsequence(
                                corcite,
                                {
                                        finalWave: {
                                                pressure: 50,
                                                structure: 25,
                                                charge: 20
                                        }
                                }
                        );

                corcite =
                        applyPlayableWaveImpact(
                                corcite,
                                consequence.id
                        ).corcite;

                const restored =
                        deserializeCorciteState(
                                serializeCorciteState(
                                        corcite
                                )
                        );

                assert.deepEqual(
                        restored.recovery,
                        corcite.recovery
                );

                assert.equal(
                        restored.capacities.energy
                                .reserveCurrent,
                        0
                );

                assert.equal(
                        restored.sustainability
                                ?.maintenance.debt,
                        1
                );
        }
);

test(
        'un état recovery incohérent est rejeté',
        () => {
                const corcite =
                        createCorcite();

                corcite.recovery.integrity.current =
                        101;

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
                                        error.toLowerCase()
                                                .includes(
                                                        'récup'
                                                ) ||
                                        error.toLowerCase()
                                                .includes(
                                                        'intégrité'
                                                )
                        )
                );
        }
);

test(
        'une vraie vague du cycle applique désormais ses conséquences au Corcite',
        () => {
                const result =
                        resolvePlayableWave(
                                createCorcite(),
                                advanceToWave(
                                        createPlayableWaveCycle({
                                                seed:
                                                        20260804
                                        })
                                ),
                                {
                                        runId:
                                                'PLAYABLE-RECOVERY-INTEGRATION',
                                        turn:
                                                6
                                }
                        );

                assert.ok(
                        result.recoveryImpact
                                .integrityDamage >
                                0
                );

                assert.equal(
                        result.recoveryImpact
                                .energyReserveDrain,
                        0
                );

                assert.ok(
                        result.recoveryImpact
                                .maintenanceDebtAdded >
                                0
                );

                assert.ok(
                        result.corcite.recovery
                                .integrity.current <
                                result.corcite.recovery
                                        .integrity.maximum
                );

                assert.equal(
                        result.corcite.recovery
                                .lastWaveImpact
                                ?.consequenceId,
                        result.historyEntry
                                .consequenceId
                );
        }
);

test(
        'deux vagues accumulent leurs impacts persistants',
        () => {
                let corcite =
                        createCorcite();

                let cycle =
                        createPlayableWaveCycle({
                                seed:
                                        20260804
                        });

                cycle =
                        advanceToWave(
                                cycle
                        );

                const first =
                        resolvePlayableWave(
                                corcite,
                                cycle,
                                {
                                        runId:
                                                'PLAYABLE-RECOVERY-MULTI',
                                        turn:
                                                6
                                }
                        );

                corcite =
                        first.corcite;

                cycle =
                        advanceToWave(
                                first.cycle
                        );

                const integrityBeforeSecond =
                        corcite.recovery.integrity
                                .current;

                const second =
                        resolvePlayableWave(
                                corcite,
                                cycle,
                                {
                                        runId:
                                                'PLAYABLE-RECOVERY-MULTI',
                                        turn:
                                                cycle.current!.scheduledTurn
                                }
                        );

                assert.equal(
                        second.corcite.recovery
                                .appliedWaveConsequenceIds
                                .length,
                        2
                );

                assert.equal(
                        second.corcite
                                .waveConsequences.length,
                        2
                );

                assert.ok(
                        second.corcite.recovery
                                .integrity.current <
                                integrityBeforeSecond
                );
        }
);
