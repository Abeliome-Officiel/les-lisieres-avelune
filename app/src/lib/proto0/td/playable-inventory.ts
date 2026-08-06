import {
        PLAYABLE_START_REFERENCE
} from '../config/playable-start-reference.js';

import {
        getPlayableTdFabricationDefinition,
        type PlayableTdFabricationDefinition
} from '../config/playable-td-reference.js';
import type {
        CorciteState,
        PlayableCorciteState
} from '../domain/corcite.js';
import {
        RESOURCE_IDS,
        emptyResourceAmounts,
        type ResourceAmounts
} from '../domain/resources.js';
import type {
        TdPathPosition,
        TdTowerDefinitionId,
        TdTowerState
} from '../domain/td.js';
import type {
        PlayerOperation,
        ResourceCosts,
        TurnPlan
} from '../domain/turn.js';
import {
        validateCorciteState
} from '../corcite/validate.js';
import {
        commitOperationReservations,
        type CommittedReservationConsumption
} from '../turn/commit.js';
import {
        endTurn
} from '../turn/end-turn.js';
import {
        addPlayerOperation,
        createTurnPlan
} from '../turn/plan.js';
import {
        createTdTower,
        placeTdTower
} from './state.js';

export interface PlayableTdFabricationPreview {
        definition:
                PlayableTdFabricationDefinition;
        canFabricate: boolean;
        blockers: string[];
        availableResources:
                ResourceAmounts;
}

export interface PreparePlayableTdFabricationResult {
        corcite: CorciteState;
        plan: TurnPlan;
        status:
                | 'reserved'
                | 'blocked';
        blockers: string[];
}

export interface CommitPlayableTdFabricationResult {
        corcite: PlayableCorciteState;
        tower: TdTowerState;
        definition:
                PlayableTdFabricationDefinition;
        consumptions:
                CommittedReservationConsumption[];
}

function requirePlayableTdState(
        inputState: CorciteState
): PlayableCorciteState {
        if (
                inputState.population ===
                undefined ||
                !Array.isArray(
                        inputState.tdInventory
                )
        ) {
                throw new Error(
                        'Cette opération TD nécessite un Corcite jouable avec inventaire.'
                );
        }

        return inputState as
                PlayableCorciteState;
}

function assertTurn(
        turn: number
): void {
        if (
                !Number.isInteger(turn) ||
                turn < 1
        ) {
                throw new Error(
                        'Le tour de fabrication TD doit être un entier supérieur ou égal à 1.'
                );
        }
}

function hasActiveFabricator(
        state: CorciteState
): boolean {
        return state.structures.some(
                (structure) =>
                        structure.kind ===
                                'fabricator-n1' &&
                        structure.status ===
                                'active'
        );
}

function availableResources(
        state: CorciteState
): ResourceAmounts {
        const result =
                emptyResourceAmounts();

        for (
                const storage of
                state.storageUnits
        ) {
                for (
                        const resourceId of
                        RESOURCE_IDS
                ) {
                        result[resourceId] +=
                                storage.contents[
                                        resourceId
                                ];
                }
        }

        for (
                const reservation of
                state.reservations
        ) {
                if (
                        reservation.status !==
                        'active'
                ) {
                        continue;
                }

                result[
                        reservation.resourceId
                ] -= reservation.amount;
        }

        for (
                const resourceId of
                RESOURCE_IDS
        ) {
                result[resourceId] =
                        Math.max(
                                0,
                                result[resourceId]
                        );
        }

        return result;
}

function sameCosts(
        actual: ResourceCosts,
        expected: ResourceCosts
): boolean {
        return RESOURCE_IDS.every(
                (resourceId) =>
                        (
                                actual[
                                        resourceId
                                ] ?? 0
                        ) ===
                        (
                                expected[
                                        resourceId
                                ] ?? 0
                        )
        );
}

function assertValidCorcite(
        state: CorciteState,
        context: string
): void {
        const validation =
                validateCorciteState(
                        state
                );

        if (!validation.valid) {
                throw new Error(
                        `${context} : ${validation.errors.join(' | ')}`
                );
        }
}

export function previewPlayableTdFabrication(
        inputState: CorciteState,
        definitionId:
                TdTowerDefinitionId
): PlayableTdFabricationPreview {
        const state =
                requirePlayableTdState(
                        inputState
                );

        const definition =
                getPlayableTdFabricationDefinition(
                        definitionId
                );

        const resources =
                availableResources(
                        state
                );

        const blockers: string[] = [];

        if (
                !hasActiveFabricator(
                        state
                )
        ) {
                blockers.push(
                        'Un atelier de fabrication actif est nécessaire.'
                );
        }

        for (
                const resourceId of
                RESOURCE_IDS
        ) {
                const cost =
                        definition
                                .resourceCosts[
                                resourceId
                        ] ?? 0;

                if (
                        cost >
                        resources[resourceId]
                ) {
                        blockers.push(
                                `Ressource insuffisante : ${PLAYABLE_START_REFERENCE.resourceLabels[resourceId]} (${resources[resourceId]}/${cost}).`
                        );
                }
        }

        return {
                definition,
                canFabricate:
                        blockers.length === 0,
                blockers,
                availableResources:
                        resources
        };
}

export function createPlayableTdFabricationOperation(
        definitionId:
                TdTowerDefinitionId,
        operationId: string,
        priority = 0
): PlayerOperation {
        if (!operationId.trim()) {
                throw new Error(
                        "La fabrication TD doit posséder un identifiant d'opération."
                );
        }

        if (
                !Number.isInteger(
                        priority
                ) ||
                priority < 0
        ) {
                throw new Error(
                        'La priorité TD doit être un entier positif ou nul.'
                );
        }

        const definition =
                getPlayableTdFabricationDefinition(
                        definitionId
                );

        return {
                id: operationId,
                label:
                        `Fabriquer : ${definition.label}`,
                kind: 'resource-demand',
                priority,
                resourceCosts:
                        structuredClone(
                                definition
                                        .resourceCosts
                        ),
                status: 'pending'
        };
}

export function preparePlayableTdFabrication(
        inputState: CorciteState,
        turn: number,
        definitionId:
                TdTowerDefinitionId,
        operationId: string,
        priority = 0
): PreparePlayableTdFabricationResult {
        assertTurn(turn);

        const state =
                requirePlayableTdState(
                        inputState
                );

        const preview =
                previewPlayableTdFabrication(
                        state,
                        definitionId
                );

        let plan =
                createTurnPlan(
                        turn
                );

        plan =
                addPlayerOperation(
                        plan,
                        createPlayableTdFabricationOperation(
                                definitionId,
                                operationId,
                                priority
                        )
                );

        if (
                !hasActiveFabricator(
                        state
                )
        ) {
                const blockedPlan =
                        structuredClone(
                                plan
                        );

                const operation =
                        blockedPlan.operations.find(
                                (candidate) =>
                                        candidate.id ===
                                        operationId
                        );

                if (operation) {
                        operation.status =
                                'blocked';
                }

                return {
                        corcite:
                                structuredClone(
                                        state
                                ),
                        plan: blockedPlan,
                        status: 'blocked',
                        blockers:
                                preview.blockers
                };
        }

        const prepared =
                endTurn(
                        state,
                        plan
                );

        const operation =
                prepared.plan.operations.find(
                        (candidate) =>
                                candidate.id ===
                                operationId
                );

        return {
                corcite:
                        prepared.corcite,
                plan:
                        prepared.plan,
                status:
                        operation?.status ===
                                'reserved'
                                ? 'reserved'
                                : 'blocked',
                blockers:
                        preview.blockers
        };
}

function nextInstanceNumber(
        state: PlayableCorciteState,
        definitionId:
                TdTowerDefinitionId
): number {
        const inventoryCount =
                state.tdInventory.filter(
                        (tower) =>
                                tower.definitionId ===
                                definitionId
                ).length;

        const placedCount =
                state.td.positions.filter(
                        (position) =>
                                position.tower
                                        ?.definitionId ===
                                definitionId
                ).length;

        return (
                inventoryCount +
                placedCount +
                1
        );
}

export function commitPlayableTdFabrication(
        inputState: CorciteState,
        plan: TurnPlan,
        operationId: string,
        definitionId:
                TdTowerDefinitionId
): CommitPlayableTdFabricationResult {
        const playable =
                requirePlayableTdState(
                        inputState
                );

        const definition =
                getPlayableTdFabricationDefinition(
                        definitionId
                );

        const operation =
                plan.operations.find(
                        (candidate) =>
                                candidate.id ===
                                operationId
                );

        if (!operation) {
                throw new Error(
                        `Opération de fabrication TD introuvable : ${operationId}.`
                );
        }

        if (
                operation.status !==
                'reserved'
        ) {
                throw new Error(
                        `La fabrication TD ${operationId} n'est pas réservée.`
                );
        }

        if (
                !sameCosts(
                        operation.resourceCosts,
                        definition.resourceCosts
                )
        ) {
                throw new Error(
                        `Les coûts réservés pour ${operationId} ne correspondent pas au catalogue TD.`
                );
        }

        if (
                !hasActiveFabricator(
                        playable
                )
        ) {
                throw new Error(
                        "La fabrication TD ne peut pas être engagée sans atelier de fabrication actif."
                );
        }

        const committed =
                commitOperationReservations(
                        playable,
                        operationId
                );

        const state =
                requirePlayableTdState(
                        committed.corcite
                );

        const instance =
                nextInstanceNumber(
                        state,
                        definitionId
                );

        const tower =
                createTdTower({
                        id:
                                `td-inventory:${definitionId}:${instance}`,
                        definitionId
                });

        state.tdInventory.push(
                tower
        );

        assertValidCorcite(
                state,
                'Etat Corcite invalide après fabrication TD'
        );

        return {
                corcite: state,
                tower,
                definition,
                consumptions:
                        committed.consumptions
        };
}

export function placePlayableTdInventoryTower(
        inputState: CorciteState,
        towerId: string,
        position: TdPathPosition
): PlayableCorciteState {
        const playable =
                requirePlayableTdState(
                        inputState
                );

        const state =
                structuredClone(
                        playable
                );

        const inventoryIndex =
                state.tdInventory.findIndex(
                        (tower) =>
                                tower.id ===
                                towerId
                );

        if (inventoryIndex < 0) {
                throw new Error(
                        `Tour TD absente de l'inventaire : ${towerId}.`
                );
        }

        const [
                tower
        ] = state.tdInventory.splice(
                inventoryIndex,
                1
        );

        state.td =
                placeTdTower(
                        state.td,
                        {
                                position,
                                tower
                        }
                );

        assertValidCorcite(
                state,
                'Etat Corcite invalide après placement TD'
        );

        return state;
}

export function removePlayableTdTower(
        inputState: CorciteState,
        position: TdPathPosition
): PlayableCorciteState {
        const playable =
                requirePlayableTdState(
                        inputState
                );

        const state =
                structuredClone(
                        playable
                );

        const slot =
                state.td.positions.find(
                        (candidate) =>
                                candidate.position ===
                                position
                );

        if (!slot) {
                throw new Error(
                        `Position TD absente : ${position}.`
                );
        }

        if (!slot.tower) {
                throw new Error(
                        `La position TD ${position} est vide.`
                );
        }

        const tower =
                structuredClone(
                        slot.tower
                );

        if (
                state.tdInventory.some(
                        (candidate) =>
                                candidate.id ===
                                tower.id
                )
        ) {
                throw new Error(
                        `La tour TD ${tower.id} existe déjà dans l'inventaire.`
                );
        }

        slot.tower = null;

        state.tdInventory.push(
                tower
        );

        assertValidCorcite(
                state,
                'Etat Corcite invalide après retrait TD'
        );

        return state;
}

export function movePlayableTdTower(
        inputState: CorciteState,
        fromPosition: TdPathPosition,
        toPosition: TdPathPosition
): PlayableCorciteState {
        if (
                fromPosition ===
                toPosition
        ) {
                return structuredClone(
                        requirePlayableTdState(
                                inputState
                        )
                );
        }

        const playable =
                requirePlayableTdState(
                        inputState
                );

        const source =
                playable.td.positions.find(
                        (position) =>
                                position.position ===
                                fromPosition
                );

        if (!source?.tower) {
                throw new Error(
                        `Aucune tour TD à déplacer depuis la position ${fromPosition}.`
                );
        }

        const towerId =
                source.tower.id;

        const removed =
                removePlayableTdTower(
                        playable,
                        fromPosition
                );

        return placePlayableTdInventoryTower(
                removed,
                towerId,
                toPosition
        );
}
