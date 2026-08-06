import assert from 'node:assert/strict';
import test from 'node:test';

import {
        PLAYABLE_RESEARCH_CATALOG,
        RPG_LAB_REFERENCE,
        playerResearchCategoryLabel,
        playerResourceLabel
} from '../../src/lib/proto0/index.js';

test(
        'les ressources conservent leurs identifiants mais disposent de noms joueur',
        () => {
                assert.equal(
                        playerResourceLabel('R1'),
                        'Matière organique brute'
                );

                assert.equal(
                        playerResourceLabel('R2'),
                        'Matière minérale brute'
                );

                assert.equal(
                        playerResourceLabel('R3'),
                        'Matériau transformé'
                );

                assert.equal(
                        playerResourceLabel('R4'),
                        'Composant fabriqué'
                );
        }
);

test(
        'les catégories internes sont traduites en vocabulaire joueur',
        () => {
                assert.equal(
                        playerResearchCategoryLabel('tf'),
                        'Ressources'
                );

                assert.equal(
                        playerResearchCategoryLabel('td'),
                        'Défenses'
                );

                assert.equal(
                        playerResearchCategoryLabel('corcite'),
                        'Corcite'
                );

                assert.equal(
                        playerResearchCategoryLabel('wave'),
                        'Vague'
                );
        }
);

test(
        'les recherches jouables durent toutes un tour sans modifier la référence historique',
        () => {
                assert.equal(
                        PLAYABLE_RESEARCH_CATALOG.length,
                        6
                );

                assert.equal(
                        PLAYABLE_RESEARCH_CATALOG.every(
                                (definition) =>
                                        definition.durationTurns ===
                                                1
                        ),
                        true
                );

                assert.equal(
                        RPG_LAB_REFERENCE.durationTurns,
                        3
                );
        }
);
