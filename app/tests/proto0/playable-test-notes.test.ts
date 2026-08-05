import assert from 'node:assert/strict';
import test from 'node:test';

import {
        createPlayableTestNote,
        parsePlayableTestNotes,
        serializePlayableTestNotes
} from '../../src/lib/proto0/index.js';

const context = {
        runId:
                'NOTEBOOK-TEST',
        turn: 4,
        view:
                'tf',
        waveNumber: 1,
        wavePhase:
                'preparation',
        statusMessage:
                'Tour 4 ouvert.',
        integrity: 96,
        energyReserve: 2,
        maintenanceDebt: 1
};

test(
        'une note conserve automatiquement le contexte de jeu',
        () => {
                const note =
                        createPlayableTestNote({
                                id:
                                        'NOTE-1',
                                createdAtIso:
                                        '2026-08-06T00:00:00.000Z',
                                category:
                                        'strategy',
                                text:
                                        'Je conserve le transformateur actif.',
                                context
                        });

                assert.equal(
                        note.context.turn,
                        4
                );

                assert.equal(
                        note.context.waveNumber,
                        1
                );

                assert.equal(
                        note.category,
                        'strategy'
                );
        }
);

test(
        'une note vide est refusée',
        () => {
                assert.throws(
                        () =>
                                createPlayableTestNote({
                                        category:
                                                'other',
                                        text:
                                                '   ',
                                        context
                                }),
                        /ne peut pas être vide/
                );
        }
);

test(
        'les notes survivent à un export puis un import JSON',
        () => {
                const note =
                        createPlayableTestNote({
                                id:
                                        'NOTE-2',
                                createdAtIso:
                                        '2026-08-06T00:00:00.000Z',
                                category:
                                        'friction',
                                text:
                                        'La lecture du stockage demande vérification.',
                                context
                        });

                const restored =
                        parsePlayableTestNotes(
                                serializePlayableTestNotes(
                                        [
                                                note
                                        ]
                                )
                        );

                assert.deepEqual(
                        restored,
                        [
                                note
                        ]
                );
        }
);

test(
        'un JSON invalide ne casse pas le carnet',
        () => {
                assert.deepEqual(
                        parsePlayableTestNotes(
                                '{invalid'
                        ),
                        []
                );
        }
);

test(
        'les entrées étrangères sont ignorées à la restauration',
        () => {
                const serialized =
                        JSON.stringify(
                                [
                                        {
                                                nonsense:
                                                        true
                                        }
                                ]
                        );

                assert.deepEqual(
                        parsePlayableTestNotes(
                                serialized
                        ),
                        []
                );
        }
);
