import assert from 'node:assert/strict';
import test from 'node:test';

import {
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
                        'TURN-REPORT-TEST'
        });
}

test(
        'le rapport distingue la construction du tour de sa production au tour suivant',
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
                        state.lastTurnReport?.turn,
                        1
                );

                assert.equal(
                        state.lastTurnReport
                                ?.events.some(
                                        (event) =>
                                                event.kind ===
                                                'construction' &&
                                                event.status ===
                                                'positive'
                                ),
                        true
                );

                assert.equal(
                        state.lastTurnReport
                                ?.events.some(
                                        (event) =>
                                                event.kind ===
                                                'extraction' &&
                                                event.status ===
                                                'positive'
                                ),
                        false
                );

                state =
                        resolvePlayableBrowserTurn(
                                state
                        );

                assert.equal(
                        state.lastTurnReport
                                ?.events.some(
                                        (event) =>
                                                event.kind ===
                                                'extraction' &&
                                                event.status ===
                                                'positive'
                                ),
                        true
                );
        }
);

test(
        'les rapports de tours sont conservés dans un historique ordonné',
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

                state =
                        resolvePlayableBrowserTurn(
                                state
                        );

                assert.deepEqual(
                        state.turnReports.map(
                                (entry) =>
                                        entry.turn
                        ),
                        [
                                1,
                                2
                        ]
                );
        }
);
