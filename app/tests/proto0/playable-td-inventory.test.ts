import assert from 'node:assert/strict';
import test from 'node:test';

import {
        PLAYABLE_TD_FABRICATIONS,
        TD_PREPARATION_LAB_REFERENCE,
        commitPlayableTdFabrication,
        createPlayableCorciteState,
        createReferenceCorciteState,
        deserializeCorciteState,
        getPlayableTdFabricationDefinition,
        getStoredAmount,
        movePlayableTdTower,
        placePlayableTdInventoryTower,
        playerResourceLabel,
        preparePlayableTdFabrication,
        previewPlayableTdFabrication,
        removePlayableTdTower,
        serializeCorciteState,
        validateCorciteState
} from '../../src/lib/proto0/index.js';

import type {
        PlayableCorciteState
} from '../../src/lib/proto0/domain/corcite.js';

import type {
        TdTowerDefinitionId
} from '../../src/lib/proto0/domain/td.js';

function createPlayable():
        PlayableCorciteState {
        return createPlayableCorciteState({
                id:
                        'corcite-playable-td',
                name:
                        'PLAYABLE-TD',
                controller:
                        'human'
        });
}

function createTdReadyCorcite():
        PlayableCorciteState {
        const state =
                createPlayable();

        state.structures.push({
                id:
                        'structure-fabricator-test',
                kind:
                        'fabricator-n1',
                name:
                        'Atelier de fabrication test',
                status:
                        'active',
                usage: {
                        energy: 2,
                        maintenance: 1,
                        work: 1,
                        space: 3
                }
        });

        state.capacities.energy.used =
                2;

        state.capacities.maintenance.used =
                3;

        state.capacities.work.used =
                1;

        state.capacities.space.used =
                7;

        state.storageUnits[0].contents = {
                R1: 2,
                R2: 2,
                R3: 4,
                R4: 4
        };

        assert.equal(
                validateCorciteState(
                        state
                ).valid,
                true
        );

        return state;
}

function fabricate(
        inputState:
                PlayableCorciteState,
        definitionId:
                TdTowerDefinitionId,
        operationId: string,
        turn = 1
) {
        const prepared =
                preparePlayableTdFabrication(
                        inputState,
                        turn,
                        definitionId,
                        operationId
                );

        assert.equal(
                prepared.status,
                'reserved'
        );

        return commitPlayableTdFabrication(
                prepared.corcite,
                prepared.plan,
                operationId,
                definitionId
        );
}

test("le catalogue TD jouable contient les quatre familles et conserve le coût historique d'Atténuation", () => {
        assert.equal(
                PLAYABLE_TD_FABRICATIONS
                        .length,
                4
        );

        assert.deepEqual(
                new Set(
                        PLAYABLE_TD_FABRICATIONS.map(
                                (definition) =>
                                        definition.family
                        )
                ),
                new Set([
                        'attenuation',
                        'destructuration',
                        'captation',
                        'stabilisation'
                ])
        );

        assert.deepEqual(
                getPlayableTdFabricationDefinition(
                        'attenuation-n1'
                ).resourceCosts,
                TD_PREPARATION_LAB_REFERENCE
                        .resourceCosts
        );

        for (
                const definition of
                PLAYABLE_TD_FABRICATIONS
        ) {
                const totalCost =
                        Object.values(
                                definition
                                        .resourceCosts
                        ).reduce(
                                (
                                        total,
                                        amount
                                ) =>
                                        total +
                                        (
                                                amount ??
                                                0
                                        ),
                                0
                        );

                assert.ok(
                        totalCost > 0
                );
        }
});

test("le Corcite jouable démarre sans aucune défense fabriquée", () => {
        const state =
                createPlayable();

        assert.deepEqual(
                state.tdInventory,
                []
        );

        assert.equal(
                state.td.positions.every(
                        (position) =>
                                position.tower ===
                                null
                ),
                true
        );
});

test("une défense ne peut pas être fabriquée sans atelier de fabrication actif", () => {
        const state =
                createPlayable();

        state.storageUnits[0].contents = {
                R1: 2,
                R2: 2,
                R3: 4,
                R4: 4
        };

        const preview =
                previewPlayableTdFabrication(
                        state,
                        'attenuation-n1'
                );

        assert.equal(
                preview.canFabricate,
                false
        );

        assert.ok(
                preview.blockers.some(
                        (blocker) =>
                                blocker.includes(
                                        'atelier'
                                )
                )
        );

        const prepared =
                preparePlayableTdFabrication(
                        state,
                        1,
                        'attenuation-n1',
                        'td-no-fabricator'
                );

        assert.equal(
                prepared.status,
                'blocked'
        );

        assert.deepEqual(
                prepared.corcite
                        .tdInventory,
                []
        );
});

test("les ressources manquantes bloquent explicitement la fabrication TD", () => {
        const state =
                createTdReadyCorcite();

        state.storageUnits[0]
                .contents.R4 = 0;

        const preview =
                previewPlayableTdFabrication(
                        state,
                        'attenuation-n1'
                );

        assert.equal(
                preview.canFabricate,
                false
        );

        assert.ok(
                preview.blockers.some(
                        (blocker) =>
                                blocker.includes(
                                        playerResourceLabel(
                                                'R4'
                                        )
                                )
                )
        );

        const prepared =
                preparePlayableTdFabrication(
                        state,
                        1,
                        'attenuation-n1',
                        'td-missing-r4'
                );

        assert.equal(
                prepared.status,
                'blocked'
        );
});

test("fabriquer une défense consomme réellement ses ressources et l'ajoute à l'inventaire", () => {
        const state =
                createTdReadyCorcite();

        const beforeR3 =
                getStoredAmount(
                        state,
                        'R3'
                );

        const beforeR4 =
                getStoredAmount(
                        state,
                        'R4'
                );

        const result =
                fabricate(
                        state,
                        'attenuation-n1',
                        'td-fabricate-one'
                );

        assert.equal(
                getStoredAmount(
                        result.corcite,
                        'R3'
                ),
                beforeR3 - 2
        );

        assert.equal(
                getStoredAmount(
                        result.corcite,
                        'R4'
                ),
                beforeR4 - 1
        );

        assert.equal(
                result.corcite
                        .tdInventory.length,
                1
        );

        assert.equal(
                result.corcite
                        .tdInventory[0]
                        .definitionId,
                'attenuation-n1'
        );

        assert.equal(
                result.corcite.td.positions
                        .every(
                                (position) =>
                                        position.tower ===
                                        null
                        ),
                true
        );
});

test("deux exemplaires d'une même famille nécessitent deux fabrications distinctes", () => {
        const initial =
                createTdReadyCorcite();

        const first =
                fabricate(
                        initial,
                        'attenuation-n1',
                        'td-copy-one'
                );

        const second =
                fabricate(
                        first.corcite,
                        'attenuation-n1',
                        'td-copy-two'
                );

        assert.equal(
                second.corcite
                        .tdInventory.length,
                2
        );

        assert.notEqual(
                second.corcite
                        .tdInventory[0].id,
                second.corcite
                        .tdInventory[1].id
        );

        assert.equal(
                getStoredAmount(
                        second.corcite,
                        'R3'
                ),
                getStoredAmount(
                        initial,
                        'R3'
                ) - 4
        );

        assert.equal(
                getStoredAmount(
                        second.corcite,
                        'R4'
                ),
                getStoredAmount(
                        initial,
                        'R4'
                ) - 2
        );
});

test("une fabrication sans réservation ne peut pas créer une défense", () => {
        const state =
                createTdReadyCorcite();

        const prepared =
                preparePlayableTdFabrication(
                        state,
                        1,
                        'captation-n1',
                        'td-not-reserved'
                );

        const falsified =
                structuredClone(
                        prepared.plan
                );

        const operation =
                falsified.operations.find(
                        (candidate) =>
                                candidate.id ===
                                'td-not-reserved'
                );

        assert.ok(operation);

        operation.status =
                'blocked';

        assert.throws(
                () =>
                        commitPlayableTdFabrication(
                                prepared.corcite,
                                falsified,
                                'td-not-reserved',
                                'captation-n1'
                        ),
                /n'est pas réservée/
        );
});

test("un coût réservé falsifié ne peut pas fabriquer une autre défense", () => {
        const state =
                createTdReadyCorcite();

        const prepared =
                preparePlayableTdFabrication(
                        state,
                        1,
                        'attenuation-n1',
                        'td-falsified-cost'
                );

        assert.equal(
                prepared.status,
                'reserved'
        );

        const plan =
                structuredClone(
                        prepared.plan
                );

        const operation =
                plan.operations.find(
                        (candidate) =>
                                candidate.id ===
                                'td-falsified-cost'
                );

        assert.ok(operation);

        operation.resourceCosts = {
                R3: 1
        };

        assert.throws(
                () =>
                        commitPlayableTdFabrication(
                                prepared.corcite,
                                plan,
                                'td-falsified-cost',
                                'attenuation-n1'
                        ),
                /ne correspondent pas/
        );
});

test("placer une défense la retire de l'inventaire et occupe exactement la position choisie", () => {
        const fabricated =
                fabricate(
                        createTdReadyCorcite(),
                        'destructuration-n1',
                        'td-place'
                );

        const towerId =
                fabricated.tower.id;

        const placed =
                placePlayableTdInventoryTower(
                        fabricated.corcite,
                        towerId,
                        5
                );

        assert.equal(
                placed.tdInventory.length,
                0
        );

        assert.equal(
                placed.td.positions[4]
                        .tower?.id,
                towerId
        );

        assert.equal(
                placed.td.positions[4]
                        .tower
                        ?.definitionId,
                'destructuration-n1'
        );
});

test("le chemin jouable refuse de placer une défense qui n'appartient pas à l'inventaire", () => {
        const state =
                createTdReadyCorcite();

        assert.throws(
                () =>
                        placePlayableTdInventoryTower(
                                state,
                                'tour-gratuite',
                                1
                        ),
                /absente de l'inventaire/
        );

        assert.equal(
                state.td.positions[0]
                        .tower,
                null
        );
});

test("retirer une défense la remet en inventaire sans remboursement matériel", () => {
        const fabricated =
                fabricate(
                        createTdReadyCorcite(),
                        'captation-n1',
                        'td-remove'
                );

        const placed =
                placePlayableTdInventoryTower(
                        fabricated.corcite,
                        fabricated.tower.id,
                        3
                );

        const beforeR3 =
                getStoredAmount(
                        placed,
                        'R3'
                );

        const beforeR4 =
                getStoredAmount(
                        placed,
                        'R4'
                );

        const removed =
                removePlayableTdTower(
                        placed,
                        3
                );

        assert.equal(
                removed.td.positions[2]
                        .tower,
                null
        );

        assert.equal(
                removed.tdInventory.length,
                1
        );

        assert.equal(
                removed.tdInventory[0].id,
                fabricated.tower.id
        );

        assert.equal(
                getStoredAmount(
                        removed,
                        'R3'
                ),
                beforeR3
        );

        assert.equal(
                getStoredAmount(
                        removed,
                        'R4'
                ),
                beforeR4
        );
});

test("une défense fabriquée peut être déplacée sans être refabriquée", () => {
        const fabricated =
                fabricate(
                        createTdReadyCorcite(),
                        'stabilisation-n1',
                        'td-move'
                );

        const placed =
                placePlayableTdInventoryTower(
                        fabricated.corcite,
                        fabricated.tower.id,
                        2
                );

        const beforeStocks = {
                R3:
                        getStoredAmount(
                                placed,
                                'R3'
                        ),
                R4:
                        getStoredAmount(
                                placed,
                                'R4'
                        )
        };

        const moved =
                movePlayableTdTower(
                        placed,
                        2,
                        7
                );

        assert.equal(
                moved.td.positions[1]
                        .tower,
                null
        );

        assert.equal(
                moved.td.positions[6]
                        .tower?.id,
                fabricated.tower.id
        );

        assert.equal(
                moved.tdInventory.length,
                0
        );

        assert.equal(
                getStoredAmount(
                        moved,
                        'R3'
                ),
                beforeStocks.R3
        );

        assert.equal(
                getStoredAmount(
                        moved,
                        'R4'
                ),
                beforeStocks.R4
        );
});

test("un déplacement vers une position occupée est refusé sans modifier l'état d'origine", () => {
        const first =
                fabricate(
                        createTdReadyCorcite(),
                        'attenuation-n1',
                        'td-occupied-a'
                );

        const second =
                fabricate(
                        first.corcite,
                        'attenuation-n1',
                        'td-occupied-b'
                );

        let state =
                placePlayableTdInventoryTower(
                        second.corcite,
                        second.corcite
                                .tdInventory[0].id,
                        1
                );

        state =
                placePlayableTdInventoryTower(
                        state,
                        state.tdInventory[0].id,
                        2
                );

        const snapshot =
                structuredClone(
                        state
                );

        assert.throws(
                () =>
                        movePlayableTdTower(
                                state,
                                1,
                                2
                        ),
                /déjà occupée/
        );

        assert.deepEqual(
                state,
                snapshot
        );
});

test("l'inventaire TD survit à la sérialisation du Corcite jouable", () => {
        const fabricated =
                fabricate(
                        createTdReadyCorcite(),
                        'destructuration-n1',
                        'td-serialize'
                );

        const restored =
                deserializeCorciteState(
                        serializeCorciteState(
                                fabricated.corcite
                        )
                );

        assert.deepEqual(
                restored.tdInventory,
                fabricated.corcite
                        .tdInventory
        );

        assert.notEqual(
                restored.tdInventory,
                fabricated.corcite
                        .tdInventory
        );
});

test("une même instance ne peut pas être simultanément placée et présente en inventaire", () => {
        const fabricated =
                fabricate(
                        createTdReadyCorcite(),
                        'captation-n1',
                        'td-duplicate-state'
                );

        const placed =
                placePlayableTdInventoryTower(
                        fabricated.corcite,
                        fabricated.tower.id,
                        4
                );

        placed.tdInventory.push(
                structuredClone(
                        fabricated.tower
                )
        );

        const validation =
                validateCorciteState(
                        placed
                );

        assert.equal(
                validation.valid,
                false
        );

        assert.ok(
                validation.errors.some(
                        (error) =>
                                error.includes(
                                        'simultanément'
                                )
                )
        );
});

test("les états historiques restent valides sans champ d'inventaire TD", () => {
        const historical =
                createReferenceCorciteState({
                        id:
                                'corcite-historical-td',
                        name:
                                'HISTORICAL-TD',
                        controller:
                                'human'
                });

        assert.equal(
                historical.tdInventory,
                undefined
        );

        assert.equal(
                validateCorciteState(
                        historical
                ).valid,
                true
        );

        const restored =
                deserializeCorciteState(
                        serializeCorciteState(
                                historical
                        )
                );

        assert.equal(
                restored.tdInventory,
                undefined
        );
});

test("l'état jouable reste valide après fabrication, placement, déplacement et retrait", () => {
        const fabricated =
                fabricate(
                        createTdReadyCorcite(),
                        'attenuation-n1',
                        'td-full-cycle'
                );

        let state =
                placePlayableTdInventoryTower(
                        fabricated.corcite,
                        fabricated.tower.id,
                        1
                );

        state =
                movePlayableTdTower(
                        state,
                        1,
                        6
                );

        state =
                removePlayableTdTower(
                        state,
                        6
                );

        assert.equal(
                validateCorciteState(
                        state
                ).valid,
                true
        );

        assert.equal(
                state.tdInventory.length,
                1
        );

        assert.equal(
                state.td.positions.every(
                        (position) =>
                                position.tower ===
                                null
                ),
                true
        );
});
