import assert from 'node:assert/strict';
import test from 'node:test';

import {
        PLAYABLE_WAVE_CYCLE_REFERENCE,
        advancePlayableWaveCycleAfterTurn,
        createPlayableCorciteState,
        createPlayableWaveCycle,
        resolvePlayableWave
} from '../../src/lib/proto0/index.js';

function resolveFirstWave(seed: number) {
        const corcite =
                createPlayableCorciteState({
                        id:
                                `spacing-corcite-${seed}`,
                        name:
                                `SPACING ${seed}`,
                        controller:
                                'human'
                });

        let cycle =
                createPlayableWaveCycle({
                        seed
                });

        if (!cycle.current) {
                throw new Error(
                        'La première vague devrait exister.'
                );
        }

        const firstWaveTurn =
                cycle.current.scheduledTurn;

        for (
                let turn = 1;
                turn <= firstWaveTurn;
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

        const result =
                resolvePlayableWave(
                        corcite,
                        cycle,
                        {
                                runId:
                                        `SPACING-${seed}`,
                                turn:
                                        firstWaveTurn
                        }
                );

        if (!result.cycle.current) {
                throw new Error(
                        'La seconde vague devrait être planifiée.'
                );
        }

        return {
                firstWaveTurn,
                secondWaveTurn:
                        result.cycle.current
                                .scheduledTurn
        };
}

test(
        'la première vague conserve une fenêtre de départ fixe et lisible',
        () => {
                const cycle =
                        createPlayableWaveCycle({
                                seed: 20260804
                        });

                assert.equal(
                        cycle.current
                                ?.scheduledTurn,
                        PLAYABLE_WAVE_CYCLE_REFERENCE
                                .firstWaveTurn
                );
        }
);

test(
        'la vague suivante ne peut jamais arriver avant la fenêtre minimale de développement',
        () => {
                for (
                        let seed = 0;
                        seed < 64;
                        seed += 1
                ) {
                        const result =
                                resolveFirstWave(
                                        seed
                                );

                        const spacing =
                                result.secondWaveTurn -
                                result.firstWaveTurn;

                        assert.ok(
                                spacing >=
                                        PLAYABLE_WAVE_CYCLE_REFERENCE
                                                .minimumDevelopmentTurnsBetweenWaves,
                                `seed ${seed}: espacement ${spacing}`
                        );
                }
        }
);

test(
        'la petite variabilité peut retarder la vague de zéro à deux tours',
        () => {
                const spacings =
                        new Set<number>();

                for (
                        let seed = 0;
                        seed < 64;
                        seed += 1
                ) {
                        const result =
                                resolveFirstWave(
                                        seed
                                );

                        spacings.add(
                                result.secondWaveTurn -
                                        result.firstWaveTurn
                        );
                }

                const minimum =
                        PLAYABLE_WAVE_CYCLE_REFERENCE
                                .minimumDevelopmentTurnsBetweenWaves;

                const maximum =
                        minimum +
                        PLAYABLE_WAVE_CYCLE_REFERENCE
                                .maximumAdditionalArrivalDelayTurns;

                for (
                        const spacing of
                        spacings
                ) {
                        assert.ok(
                                spacing >= minimum
                        );

                        assert.ok(
                                spacing <= maximum
                        );
                }

                /*
                 * La batterie doit effectivement rencontrer plusieurs
                 * calendriers et pas seulement une valeur déguisée en
                 * paramètre variable.
                 */
                assert.ok(
                        spacings.size > 1
                );
        }
);

test(
        'le calendrier variable reste parfaitement reproductible à graine identique',
        () => {
                const first =
                        resolveFirstWave(
                                20260804
                        );

                const second =
                        resolveFirstWave(
                                20260804
                        );

                assert.deepEqual(
                        second,
                        first
                );
        }
);
