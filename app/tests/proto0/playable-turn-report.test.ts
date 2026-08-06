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
        'la résolution produit un rapport joueur du tour sans recalcul côté interface',
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

                assert.ok(
                        state.lastTurnReport
                );

                assert.equal(
                        state.lastTurnReport?.turn,
                        1
                );

                assert.equal(
                        state.turnReports.length,
                        1
                );

                assert.equal(
                        state.lastTurnReport
                                ?.resources.R1.delta,
                        2
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
                                (report) =>
                                        report.turn
                        ),
                        [
                                1,
                                2
                        ]
                );

                assert.equal(
                        state.lastTurnReport?.turn,
                        2
                );
        }
);
