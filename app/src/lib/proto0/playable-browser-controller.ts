import type {
        PlayableConstructionDefinitionId
} from './config/playable-construction-reference.js';

import type {
        PlayableResearchDefinitionId
} from './config/playable-research-reference.js';

import type {
        CorciteState,
        PlayableCorciteState
} from './domain/corcite.js';

import type {
        TesterCode
} from './domain/ids.js';

import type {
        ResourceId
} from './domain/resources.js';

import type {
        TurnPlan
} from './domain/turn.js';

import type {
        TdPathPosition,
        TdTowerDefinitionId
} from './domain/td.js';

import type {
        TfConnectionRouting
} from './domain/tf.js';

import type {
        WaveRelevantConsumption
} from './domain/consequence.js';

import {
        createPlayableCorciteState
} from './corcite/state.js';

import {
        previewPlayableConstruction,
        createPlayableConstructionOperation,
        commitPlayableConstruction
} from './corcite/construction.js';

import {
        setPlayableStructureActive
} from './corcite/structure-control.js';

import {
        createTurnPlan,
        addPlayerOperation
} from './turn/plan.js';

import {
        endTurn
} from './turn/end-turn.js';

import {
        resolvePlayableTfTurn,
        type PlayableTfTurnResult
} from './tf/playable-turn.js';

import {
        connectPlayableTfStructures
} from './tf/playable-network.js';

import {
        getPlayableResearchChoices,
        startPlayableRpgResearch,
        advanceActivePlayableRpgResearch,
        getPlayablePendingDiscovery,
        validatePlayableResearchDiscovery,
        type PlayableResearchAdvanceStatus
} from './rpg/playable-research.js';

import {
        previewPlayableTdFabrication,
        createPlayableTdFabricationOperation,
        commitPlayableTdFabrication,
        placePlayableTdInventoryTower,
        removePlayableTdTower,
        movePlayableTdTower
} from './td/playable-inventory.js';

import {
        createPlayableWaveCycle,
        getPlayableWaveForecast,
        advancePlayableWaveCycleAfterTurn,
        resolvePlayableWave,
        type ResolvePlayableWaveResult
} from './wave/playable-cycle.js';

import type {
        PlayableWaveCycleState
} from './domain/playable-wave.js';

import {
        createPlayablePlayerTurnReport,
        type PlayerTurnEvent,
        type PlayerTurnReport
} from './reporting/player-turn-report.js';

export interface CreatePlayableBrowserSessionInput {
        testerCode: TesterCode;
        seed: number;
        runId?: string;
}

export type PlayableBrowserTfSnapshot =
        Omit<
                PlayableTfTurnResult,
                'corcite'
        >;

export interface PlayableBrowserResearchSnapshot {
        status:
                PlayableResearchAdvanceStatus;
        researchId?: string;
}

export type PlayableBrowserPlannedAction =
        | {
                operationId: string;
                kind:
                        'construction';
                definitionId:
                        PlayableConstructionDefinitionId;
                label: string;
          }
        | {
                operationId: string;
                kind:
                        'td-fabrication';
                definitionId:
                        TdTowerDefinitionId;
                label: string;
          };

export type PlayableBrowserLastWave =
        Omit<
                ResolvePlayableWaveResult,
                'corcite' | 'cycle'
        >;

/**
 * Etat d'orchestration de l'interface PROTO-0 jouable.
 *
 * Il ne remplace aucun moteur métier :
 * il coordonne uniquement les moteurs déjà validés.
 */
export interface Proto0PlayableBrowserState {
        runId: string;
        testerCode: TesterCode;
        seed: number;

        /**
         * Tour actuellement ouvert aux décisions du joueur.
         *
         * Lorsque la vague arrive à la fin du tour N,
         * currentTurn reste N jusqu'à résolution de la vague.
         */
        currentTurn: number;

        corcite: PlayableCorciteState;
        waveCycle:
                PlayableWaveCycleState;

        /**
         * Numéro monotone servant uniquement à fabriquer
         * des identifiants d'actions uniques.
         */
        actionSequence: number;

        /**
         * Plan matériel du tour actuellement ouvert.
         *
         * Les ressources restent dans les stockages jusqu'à
         * la résolution effective du tour.
         */
        turnPlan:
                TurnPlan;

        plannedActions:
                PlayableBrowserPlannedAction[];

        turnResolutionBlockers:
                string[];

        lastTf:
                PlayableBrowserTfSnapshot |
                null;

        lastResearchAdvance:
                PlayableBrowserResearchSnapshot |
                null;

        lastTurnReport:
                PlayerTurnReport |
                null;

        turnReports:
                PlayerTurnReport[];

        lastWave:
                PlayableBrowserLastWave |
                null;

        /**
         * Consommations directement liées à la préparation TD
         * depuis la dernière vague.
         */
        waveConsumptions:
                WaveRelevantConsumption[];

        statusMessage: string;
}

function requirePlayableCorcite(
        state: CorciteState
): PlayableCorciteState {
        if (
                state.population ===
                        undefined ||
                state.recovery ===
                        undefined ||
                state.captureEconomy ===
                        undefined ||
                !Array.isArray(
                        state.tdInventory
                )
        ) {
                throw new Error(
                        'Le contrôleur jouable exige un Corcite jouable complet.'
                );
        }

        return state as
                PlayableCorciteState;
}

function defaultRunId(
        input:
                CreatePlayableBrowserSessionInput
): string {
        return [
                'PROTO0-PLAYABLE',
                input.testerCode,
                String(input.seed)
        ].join('-');
}

function assertPreparationOpen(
        state:
                Proto0PlayableBrowserState
): void {
        if (
                state.waveCycle.phase ===
                'complete'
        ) {
                throw new Error(
                        'Le cycle de test est terminé.'
                );
        }

        if (
                state.waveCycle.phase ===
                'ready'
        ) {
                throw new Error(
                        'La vague est arrivée : la préparation est verrouillée jusqu’à sa résolution.'
                );
        }

        const expectedTurn =
                state.waveCycle
                        .lastAdvancedTurn +
                1;

        if (
                state.currentTurn !==
                expectedTurn
        ) {
                throw new Error(
                        `Etat navigateur incohérent : le tour ouvert devrait être ${expectedTurn}, pas ${state.currentTurn}.`
                );
        }
}

function nextActionId(
        state:
                Proto0PlayableBrowserState,
        kind: string
): string {
        return [
                state.runId,
                'turn',
                String(
                        state.currentTurn
                ),
                'action',
                String(
                        state.actionSequence +
                                1
                ),
                kind
        ].join(':');
}

function appendWaveConsumptions(
        state:
                Proto0PlayableBrowserState,
        consumptions:
                readonly {
                        resourceId: ResourceId;
                        amount: number;
                }[],
        source: string
): void {
        for (
                const consumption of
                consumptions
        ) {
                const existing =
                        state.waveConsumptions.find(
                                (entry) =>
                                        entry.resourceId ===
                                                consumption.resourceId &&
                                        entry.source ===
                                                source
                        );

                if (existing) {
                        existing.amount +=
                                consumption.amount;

                        continue;
                }

                state.waveConsumptions.push({
                        resourceId:
                                consumption.resourceId,
                        amount:
                                consumption.amount,
                        source
                });
        }
}

export function createPlayableBrowserSession(
        input:
                CreatePlayableBrowserSessionInput
): Proto0PlayableBrowserState {
        const runId =
                (
                        input.runId ??
                        defaultRunId(
                                input
                        )
                ).trim();

        if (!runId) {
                throw new Error(
                        'Une session jouable doit posséder un identifiant.'
                );
        }

        const corcite =
                createPlayableCorciteState({
                        id:
                                `${runId}:corcite:human`,
                        name:
                                `Corcite ${input.testerCode}`,
                        controller:
                                'human'
                });

        const waveCycle =
                createPlayableWaveCycle({
                        seed:
                                input.seed
                });

        return {
                runId,
                testerCode:
                        input.testerCode,
                seed:
                        input.seed,
                currentTurn: 1,
                corcite,
                waveCycle,
                actionSequence: 0,
                turnPlan:
                        createTurnPlan(
                                1
                        ),
                plannedActions: [],
                turnResolutionBlockers: [],
                lastTf: null,
                lastResearchAdvance:
                        null,
                lastTurnReport:
                        null,
                turnReports: [],
                lastWave: null,
                waveConsumptions: [],
                statusMessage:
                        `Session ${runId} créée. Tour 1 ouvert.`
        };
}

export function isPlayableBrowserPreparationOpen(
        state:
                Proto0PlayableBrowserState
): boolean {
        return (
                state.waveCycle.phase ===
                'preparation'
        );
}

export function getPlayableBrowserForecast(
        state:
                Proto0PlayableBrowserState
) {
        return getPlayableWaveForecast(
                state.waveCycle,
                state.currentTurn,
                state.corcite
        );
}

export function getPlayableBrowserResearchChoices(
        state:
                Proto0PlayableBrowserState
) {
	const choices = getPlayableResearchChoices(state.corcite);

	return {
		...choices,
		definitions: choices.definitions.filter(
			(definition) => definition.id !== 'reserve-recovery-n1'
		)
	};
}

export function getPlayableBrowserPendingDiscovery(
        state:
                Proto0PlayableBrowserState
) {
        return getPlayablePendingDiscovery(
                state.corcite,
                state.currentTurn
        );
}

/**
 * Planifie une construction pendant le tour ouvert.
 *
 * La décision n'engage aucune ressource immédiatement.
 * Réservation, consommation et achèvement sont réalisés
 * lors de la résolution du tour.
 */
export function constructPlayableBrowserStructure(
        inputState:
                Proto0PlayableBrowserState,
        definitionId:
                PlayableConstructionDefinitionId
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        const preview =
                previewPlayableConstruction(
                        state.corcite,
                        definitionId
                );

        if (!preview.canConstruct) {
                throw new Error(
                        `Construction impossible : ${preview.blockers.join(' | ')}`
                );
        }

        const operationId =
                nextActionId(
                        state,
                        `construction:${definitionId}`
                );

        state.turnPlan =
                addPlayerOperation(
                        state.turnPlan,
                        createPlayableConstructionOperation(
                                definitionId,
                                operationId
                        )
                );

        state.plannedActions.push({
                operationId,
                kind:
                        'construction',
                definitionId,
                label:
                        preview.definition.label
        });

        state.turnResolutionBlockers =
                [];

        state.actionSequence +=
                1;

        state.statusMessage =
                `${preview.definition.label} planifié pour ce tour.`;

        return state;
}

export function cancelPlayableBrowserPlannedAction(
        inputState:
                Proto0PlayableBrowserState,
        operationId: string
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        const action =
                state.plannedActions.find(
                        (candidate) =>
                                candidate.operationId ===
                                operationId
                );

        if (!action) {
                throw new Error(
                        'Décision planifiée introuvable.'
                );
        }

        const remaining =
                state.turnPlan.operations.filter(
                        (operation) =>
                                operation.id !==
                                operationId
                );

        let plan =
                createTurnPlan(
                        state.currentTurn
                );

        for (const operation of remaining) {
                plan =
                        addPlayerOperation(
                                plan,
                                {
                                        ...structuredClone(
                                                operation
                                        ),
                                        status:
                                                'pending'
                                }
                        );
        }

        state.turnPlan =
                plan;

        state.plannedActions =
                state.plannedActions.filter(
                        (candidate) =>
                                candidate.operationId !==
                                operationId
                );

        state.turnResolutionBlockers =
                [];

        state.statusMessage =
                `${action.label} annulé.`;

        return state;
}

export function setPlayableBrowserStructureActive(
        inputState:
                Proto0PlayableBrowserState,
        structureId: string,
        active: boolean
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        state.corcite =
                setPlayableStructureActive(
                        state.corcite,
                        structureId,
                        active
                );

        state.actionSequence +=
                1;

        const structure =
                state.corcite
                        .structures.find(
                                (candidate) =>
                                        candidate.id ===
                                        structureId
                        );

        state.statusMessage =
                structure
                        ? `${structure.name} ${active ? 'activé' : 'mis en réserve'}.`
                        : 'Etat de structure modifié.';

        return state;
}

export function connectPlayableBrowserTfStructures(
        inputState:
                Proto0PlayableBrowserState,
        input: {
                fromStructureId: string;
                toStructureId: string;
                resourceId: ResourceId;
                routing?:
                        TfConnectionRouting;
        }
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        const connectionId =
                nextActionId(
                        state,
                        [
                                'connection',
                                input.resourceId
                        ].join(':')
                );

        state.corcite =
                connectPlayableTfStructures(
                        state.corcite,
                        {
                                id:
                                        connectionId,
                                fromStructureId:
                                        input.fromStructureId,
                                toStructureId:
                                        input.toStructureId,
                                resourceId:
                                        input.resourceId,
                                routing:
                                        input.routing
                        }
                );

        state.actionSequence +=
                1;

        state.statusMessage =
                'Connexion créée.';

        return state;
}

export function startPlayableBrowserResearch(
        inputState:
                Proto0PlayableBrowserState,
        definitionId:
                PlayableResearchDefinitionId
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        state.corcite =
                requirePlayableCorcite(
                        startPlayableRpgResearch(
                                state.corcite,
                                state.currentTurn,
                                definitionId
                        )
                );

        state.actionSequence +=
                1;

        state.statusMessage =
                state.corcite.rpg.researches.at(-1)
                        ?.label
                        ? `Recherche « ${state.corcite.rpg.researches.at(-1)?.label} » lancée.`
                        : 'Recherche lancée.';

        return state;
}

export function validatePlayableBrowserDiscovery(
        inputState:
                Proto0PlayableBrowserState,
        definitionId:
                PlayableResearchDefinitionId
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        state.corcite =
                requirePlayableCorcite(
                        validatePlayableResearchDiscovery(
                                state.corcite,
                                state.currentTurn,
                                definitionId
                        )
                );

        state.actionSequence +=
                1;

        state.statusMessage =
                'Découverte validée et effets appliqués.';

        return state;
}

export function fabricatePlayableBrowserTower(
        inputState:
                Proto0PlayableBrowserState,
        definitionId:
                TdTowerDefinitionId
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        const preview =
                previewPlayableTdFabrication(
                        state.corcite,
                        definitionId
                );

        if (!preview.canFabricate) {
                throw new Error(
                        `Fabrication impossible : ${preview.blockers.join(' | ')}`
                );
        }

        const operationId =
                nextActionId(
                        state,
                        `td-fabrication:${definitionId}`
                );

        state.turnPlan =
                addPlayerOperation(
                        state.turnPlan,
                        createPlayableTdFabricationOperation(
                                definitionId,
                                operationId
                        )
                );

        state.plannedActions.push({
                operationId,
                kind:
                        'td-fabrication',
                definitionId,
                label:
                        preview.definition.label
        });

        state.turnResolutionBlockers =
                [];

        state.actionSequence +=
                1;

        state.statusMessage =
                `${preview.definition.label} planifiée pour ce tour.`;

        return state;
}

export function placePlayableBrowserTower(
        inputState:
                Proto0PlayableBrowserState,
        towerId: string,
        position:
                TdPathPosition
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        state.corcite =
                placePlayableTdInventoryTower(
                        state.corcite,
                        towerId,
                        position
                );

        state.actionSequence +=
                1;

        state.statusMessage =
                `Défense placée en position ${position}.`;

        return state;
}

export function removePlayableBrowserTower(
        inputState:
                Proto0PlayableBrowserState,
        position:
                TdPathPosition
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        state.corcite =
                removePlayableTdTower(
                        state.corcite,
                        position
                );

        state.actionSequence +=
                1;

        state.statusMessage =
                `Défense retirée de la position ${position} et replacée dans l’inventaire.`;

        return state;
}

export function movePlayableBrowserTower(
        inputState:
                Proto0PlayableBrowserState,
        fromPosition:
                TdPathPosition,
        toPosition:
                TdPathPosition
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        state.corcite =
                movePlayableTdTower(
                        state.corcite,
                        fromPosition,
                        toPosition
                );

        state.actionSequence +=
                1;

        state.statusMessage =
                `Défense déplacée de ${fromPosition} vers ${toPosition}.`;

        return state;
}

/**
 * Termine réellement le tour ouvert.
 *
 * Ordre d'orchestration :
 *
 * 1. moteur TF jouable ;
 * 2. progression de la recherche active ;
 * 3. avancement du cycle de vague.
 *
 * Si la vague arrive à la fin du tour N,
 * currentTurn reste N jusqu'à résolution de cette vague.
 */
export function resolvePlayableBrowserTurn(
        inputState:
                Proto0PlayableBrowserState
): Proto0PlayableBrowserState {
        assertPreparationOpen(
                inputState
        );

        const state =
                structuredClone(
                        inputState
                );

        const resolvedTurn =
                state.currentTurn;

        const beforeTurn =
                structuredClone(
                        state.corcite
                );

        /*
         * Toutes les décisions matérielles sont arbitrées
         * ensemble. Le moteur existant conserve donc sa règle :
         * aucun choix implicite en cas de conflit humain.
         */
        const prepared =
                endTurn(
                        state.corcite,
                        state.turnPlan
                );

        if (
                prepared.status ===
                'awaiting-arbitration'
        ) {
                const conflicts =
                        prepared.plan.conflicts.filter(
                                (conflict) =>
                                        conflict
                                                .requiresHumanArbitration
                        );

                state.turnResolutionBlockers =
                        conflicts.map(
                                (conflict) => {
                                        const labels =
                                                conflict
                                                        .operationIds
                                                        .map(
                                                                (
                                                                        id
                                                                ) =>
                                                                        state
                                                                                .plannedActions
                                                                                .find(
                                                                                        (
                                                                                                action
                                                                                        ) =>
                                                                                                action.operationId ===
                                                                                                id
                                                                                )
                                                                                ?.label ??
                                                                        'Décision'
                                                        );

                                        return (
                                                'Ressources insuffisantes pour réaliser simultanément : '
                                                + labels.join(
                                                        ' / '
                                                )
                                                + '.'
                                        );
                                }
                        );

                state.statusMessage =
                        'Le tour reste ouvert : plusieurs décisions se disputent les mêmes ressources.';

                return state;
        }

        /*
         * Les ressources réservées ne sont plus disponibles
         * pour les productions du tour, mais ne sont pas encore
         * consommées.
         *
         * Une construction de ce tour ne peut donc pas produire
         * avant le tour suivant.
         */
        const tf =
                resolvePlayableTfTurn(
                        requirePlayableCorcite(
                                prepared.corcite
                        ),
                        resolvedTurn
                );

        const research =
                advanceActivePlayableRpgResearch(
                        tf.corcite,
                        resolvedTurn
                );

        let resolvedCorcite =
                requirePlayableCorcite(
                        research.corcite
                );

        const actionEvents:
                PlayerTurnEvent[] = [];

        const pendingWaveConsumptions:
                WaveRelevantConsumption[] =
                [];

        try {
                for (
                        const action of
                        state.plannedActions
                ) {
                        const operation =
                                prepared
                                        .plan
                                        .operations
                                        .find(
                                                (
                                                        candidate
                                                ) =>
                                                        candidate.id ===
                                                        action.operationId
                                        );

                        if (
                                operation?.status !==
                                'reserved'
                        ) {
                                actionEvents.push({
                                        kind:
                                                action.kind ===
                                                        'construction'
                                                        ? 'construction'
                                                        : 'defense',
                                        status:
                                                'warning',
                                        message:
                                                `${action.label} n’a pas été réalisé pendant ce tour.`
                                });

                                continue;
                        }

                        if (
                                action.kind ===
                                'construction'
                        ) {
                                const committed =
                                        commitPlayableConstruction(
                                                resolvedCorcite,
                                                prepared.plan,
                                                action.operationId,
                                                action.definitionId
                                        );

                                resolvedCorcite =
                                        committed.corcite;

                                actionEvents.push({
                                        kind:
                                                'construction',
                                        status:
                                                'positive',
                                        message:
                                                `${committed.definition.label} achevé en fin de tour.`
                                });

                                continue;
                        }

                        const committed =
                                commitPlayableTdFabrication(
                                        resolvedCorcite,
                                        prepared.plan,
                                        action.operationId,
                                        action.definitionId
                                );

                        resolvedCorcite =
                                committed.corcite;

                        for (
                                const consumption of
                                committed.consumptions
                        ) {
                                pendingWaveConsumptions.push({
                                        resourceId:
                                                consumption.resourceId,
                                        amount:
                                                consumption.amount,
                                        source:
                                                `td-fabrication:${action.definitionId}`
                                });
                        }

                        actionEvents.push({
                                kind:
                                        'defense',
                                status:
                                        'positive',
                                message:
                                        `${committed.definition.label} fabriquée et ajoutée à l’inventaire en fin de tour.`
                        });
                }
        } catch (error) {
                state.turnResolutionBlockers = [
                        error instanceof Error
                                ? error.message
                                : 'Une décision du tour ne peut pas être réalisée.'
                ];

                state.statusMessage =
                        'Le tour reste ouvert : corrigez les décisions signalées avant de réessayer.';

                return state;
        }

        state.corcite =
                resolvedCorcite;

        state.waveConsumptions.push(
                ...pendingWaveConsumptions
        );

        state.lastTf = {
                extraction:
                        structuredClone(
                                tf.extraction
                        ),
                transformation:
                        structuredClone(
                                tf.transformation
                        ),
                fabrication:
                        structuredClone(
                                tf.fabrication
                        ),
                sustainability:
                        structuredClone(
                                tf.sustainability
                        ),
                recovery:
                        structuredClone(
                                tf.recovery
                        )
        };

        state.lastResearchAdvance = {
                status:
                        research.status,
                ...(research.researchId
                        ? {
                                researchId:
                                        research.researchId
                          }
                        : {})
        };

        const turnReport =
                createPlayablePlayerTurnReport({
                        runId:
                                state.runId,
                        turn:
                                resolvedTurn,
                        before:
                                beforeTurn,
                        after:
                                state.corcite,
                        extraction:
                                tf.extraction,
                        transformation:
                                tf.transformation,
                        fabrication:
                                tf.fabrication,
                        sustainability:
                                tf.sustainability,
                        recovery:
                                tf.recovery,
                        researchStatus:
                                research.status
                });

        turnReport.events.unshift(
                ...actionEvents
        );

        state.lastTurnReport =
                turnReport;

        state.turnReports.push(
                turnReport
        );

        state.plannedActions =
                [];

        state.turnResolutionBlockers =
                [];

        state.waveCycle =
                advancePlayableWaveCycleAfterTurn(
                        state.waveCycle,
                        resolvedTurn
                );

        state.turnPlan =
                createTurnPlan(
                        resolvedTurn + 1
                );

        if (
                state.waveCycle.phase ===
                'ready'
        ) {
                const waveNumber =
                        state.waveCycle.current
                                ?.waveNumber;

                state.statusMessage =
                        `Tour ${resolvedTurn} résolu. La vague ${waveNumber ?? ''} est arrivée et doit maintenant être résolue.`.trim();

                state.currentTurn =
                        resolvedTurn;

                return state;
        }

        state.currentTurn =
                resolvedTurn + 1;

        state.statusMessage =
                `Tour ${resolvedTurn} résolu. Tour ${state.currentTurn} ouvert.`;

        return state;
}

export function resolvePlayableBrowserWave(
        inputState:
                Proto0PlayableBrowserState
): Proto0PlayableBrowserState {
        if (
                inputState.waveCycle.phase !==
                'ready'
        ) {
                throw new Error(
                        'Aucune vague n’est actuellement prête à être résolue.'
                );
        }

        const state =
                structuredClone(
                        inputState
                );

        const result =
                resolvePlayableWave(
                        state.corcite,
                        state.waveCycle,
                        {
                                runId:
                                        state.runId,
                                turn:
                                        state.currentTurn,
                                consumptions:
                                        structuredClone(
                                                state.waveConsumptions
                                        )
                        }
                );

        state.corcite =
                result.corcite;

        state.waveCycle =
                result.cycle;

        state.lastWave = {
                resolution:
                        structuredClone(
                                result.resolution
                        ),
                recoveryImpact:
                        structuredClone(
                                result.recoveryImpact
                        ),
                captureEconomy:
                        structuredClone(
                                result.captureEconomy
                        ),
                historyEntry:
                        structuredClone(
                                result.historyEntry
                        )
        };

        /*
         * Les fabrications TD de la période qui vient de s'achever
         * sont maintenant rattachées à la conséquence de cette vague.
         */
        state.waveConsumptions =
                [];

        if (
                state.waveCycle.phase ===
                'complete'
        ) {
                state.statusMessage =
                        `Vague ${result.historyEntry.waveNumber} résolue. Cycle de test terminé.`;

                return state;
        }

        state.currentTurn =
                state.waveCycle
                        .lastAdvancedTurn +
                1;

        state.turnPlan =
                createTurnPlan(
                        state.currentTurn
                );

        state.plannedActions =
                [];

        state.turnResolutionBlockers =
                [];

        state.statusMessage =
                `Vague ${result.historyEntry.waveNumber} résolue. Tour ${state.currentTurn} ouvert pour l’adaptation.`;

        return state;
}
