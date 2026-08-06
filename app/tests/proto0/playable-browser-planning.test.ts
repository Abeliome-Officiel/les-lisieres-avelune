import assert from 'node:assert/strict';
import test from 'node:test';

import {
        cancelPlayableBrowserPlannedAction,
        constructPlayableBrowserStructure,
        createPlayableBrowserSession,
        resolvePlayableBrowserTurn
} from '../../src/lib/proto0/index.js';

function createSession() {
        return createPlayableBrowserSession({
                testerCode:
                        'IRFI',
                seed:
                        20260806,
                runId:
                        'PLANNING-TEST'
        });
}

test(
        'une construction planifiée ne consomme rien avant la résolution du tour',
        () => {
                const initial =
                        createSession();

                const planned =
                        constructPlayableBrowserStructure(
                                initial,
                                'organic-extractor'
                        );

                assert.deepEqual(
                        planned.corcite.storageUnits,
                        initial.corcite.storageUnits
                );

                assert.deepEqual(
                        planned.corcite.structures,
                        initial.corcite.structures
                );

                assert.equal(
                        planned.plannedActions.length,
                        1
                );
        }
);

test(
        'un conflit de ressources ne choisit aucune décision à la place du joueur',
        () => {
                let state =
                        createSession();

                for (
                        let index = 0;
                        index < 3;
                        index += 1
                ) {
                        state =
                                constructPlayableBrowserStructure(
                                        state,
                                        'organic-extractor'
                                );
                }

                const unresolved =
                        resolvePlayableBrowserTurn(
                                state
                        );

                assert.equal(
                        unresolved.currentTurn,
                        1
                );

                assert.equal(
                        unresolved.waveCycle
                                .lastAdvancedTurn,
                        0
                );

                assert.ok(
                        unresolved
                                .turnResolutionBlockers
                                .length > 0
                );

                assert.equal(
                        unresolved.corcite.structures
                                .some(
                                        (structure) =>
                                                structure.kind ===
                                                'extractor-a-n1'
                                ),
                        false
                );

                const cancelled =
                        unresolved
                                .plannedActions[0]
                                .operationId;

                const revised =
                        cancelPlayableBrowserPlannedAction(
                                unresolved,
                                cancelled
                        );

                const resolved =
                        resolvePlayableBrowserTurn(
                                revised
                        );

                assert.equal(
                        resolved.currentTurn,
                        2
                );

                assert.equal(
                        resolved.corcite.structures
                                .filter(
                                        (structure) =>
                                                structure.kind ===
                                                'extractor-a-n1'
                                )
                                .length,
                        2
                );
        }
);

test(
        'annuler une décision reconstruit un plan joueur propre',
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

                const cancelled =
                        state.plannedActions[0]
                                .operationId;

                state =
                        cancelPlayableBrowserPlannedAction(
                                state,
                                cancelled
                        );

                assert.equal(
                        state.turnPlan.phase,
                        'player'
                );

                assert.equal(
                        state.turnPlan.operations.length,
                        1
                );

                assert.equal(
                        state.turnPlan.conflicts.length,
                        0
                );

                assert.equal(
                        state.turnPlan.arbitrations.length,
                        0
                );
        }
);
