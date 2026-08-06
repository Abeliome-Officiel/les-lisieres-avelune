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
        preparePlayableTdFabrication,
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
        return getPlayableResearchChoices(
                state.corcite
        );
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
 * Construction immédiate pendant la fenêtre de décision.
 *
 * L'opération passe malgré tout par le moteur canonique
 * de réservation puis de consommation des ressources.
 *
 * Elle ne fait PAS avancer le temps.
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

        let plan =
                createTurnPlan(
                        state.currentTurn
                );

        plan =
                addPlayerOperation(
                        plan,
                        createPlayableConstructionOperation(
                                definitionId,
                                operationId
                        )
                );

        const prepared =
                endTurn(
                        state.corcite,
                        plan
                );

        const operation =
                prepared.plan.operations.find(
                        (candidate) =>
                                candidate.id ===
                                operationId
                );

        if (
                operation?.status !==
                'reserved'
        ) {
                throw new Error(
                        `Construction non réservée : ${operationId}.`
                );
        }

        const committed =
                commitPlayableConstruction(
                        prepared.corcite,
                        prepared.plan,
                        operationId,
                        definitionId
                );

        state.corcite =
                committed.corcite;

        state.actionSequence +=
                1;

        state.statusMessage =
                `${committed.definition.label} construit au tour ${state.currentTurn}.`;

        return state;
}

/**
 * Activation / désactivation immédiate d'une fonction construite.
 * Ne fait pas avancer le temps.
 */
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

        const operationId =
                nextActionId(
                        state,
                        `td-fabrication:${definitionId}`
                );

        const prepared =
                preparePlayableTdFabrication(
                        state.corcite,
                        state.currentTurn,
                        definitionId,
                        operationId
                );

        if (
                prepared.status !==
                'reserved'
        ) {
                throw new Error(
                        `Fabrication TD impossible : ${prepared.blockers.join(' | ')}`
                );
        }

        const committed =
                commitPlayableTdFabrication(
                        prepared.corcite,
                        prepared.plan,
                        operationId,
                        definitionId
                );

        state.corcite =
                committed.corcite;

        appendWaveConsumptions(
                state,
                committed.consumptions,
                `td-fabrication:${definitionId}`
        );

        state.actionSequence +=
                1;

        state.statusMessage =
                `${committed.definition.label} fabriquée et placée dans l’inventaire.`;

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

        const tf =
                resolvePlayableTfTurn(
                        state.corcite,
                        resolvedTurn
                );

        const research =
                advanceActivePlayableRpgResearch(
                        tf.corcite,
                        resolvedTurn
                );

        state.corcite =
                requirePlayableCorcite(
                        research.corcite
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

        state.lastTurnReport =
                turnReport;

        state.turnReports.push(
                turnReport
        );


        state.waveCycle =
                advancePlayableWaveCycleAfterTurn(
                        state.waveCycle,
                        resolvedTurn
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

                /*
                 * Important :
                 * aucune fenêtre gratuite de préparation n'est ouverte
                 * après l'arrivée de la vague.
                 */
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

/**
 * Résout la vague actuellement arrivée puis ouvre, s'il en existe,
 * le premier tour de préparation de la vague suivante.
 */
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

        state.statusMessage =
                `Vague ${result.historyEntry.waveNumber} résolue. Tour ${state.currentTurn} ouvert pour l’adaptation.`;

        return state;
}
