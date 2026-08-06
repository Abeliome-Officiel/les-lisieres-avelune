import {
        PLAYABLE_START_REFERENCE
} from '../config/playable-start-reference.js';

import {
        getPlayableRecipePresentation
} from '../config/playable-processing-reference.js';

import type {
        PlayableCorciteState
} from '../domain/corcite.js';

import {
        RESOURCE_IDS,
        type ResourceAmounts,
        type ResourceId
} from '../domain/resources.js';

import type {
        TfExtractionResolution,
        TfProcessingResolution
} from '../domain/tf.js';

import type {
        PlayableSustainabilityTurnResolution
} from '../corcite/sustainability.js';

import type {
        PlayableRecoveryTurnResolution
} from '../corcite/recovery.js';

import type {
        PlayableResearchAdvanceStatus
} from '../rpg/playable-research.js';

export interface PlayerTurnResourceDelta {
        before: number;
        after: number;
        delta: number;
}

export interface PlayerTurnCapacitySnapshot {
        energy: {
                used: number;
                normalCapacity: number;
                reserveCurrent: number;
                reserveMaximum: number;
        };

        maintenance: {
                used: number;
                capacity: number;
                debt: number;
        };

        population: {
                total: number;
                assigned: number;
                available: number;
        };

        integrity: {
                current: number;
                maximum: number;
        };

        storage: {
                used: number;
                capacity: number;
        };
}

export type PlayerTurnEventKind =
        | 'extraction'
        | 'transformation'
        | 'fabrication'
        | 'research'
        | 'energy'
        | 'maintenance'
        | 'population'
        | 'recovery'
        | 'system';

export interface PlayerTurnEvent {
        kind: PlayerTurnEventKind;
        status:
                | 'positive'
                | 'neutral'
                | 'warning';
        message: string;
}

export interface PlayerTurnReport {
        schema:
                'avelune.proto0.player-turn-report';

        schemaVersion: 1;

        runId: string;
        turn: number;

        resources:
                Record<
                        ResourceId,
                        PlayerTurnResourceDelta
                >;

        before:
                PlayerTurnCapacitySnapshot;

        after:
                PlayerTurnCapacitySnapshot;

        events:
                PlayerTurnEvent[];
}

export interface CreatePlayerTurnReportInput {
        runId: string;
        turn: number;

        before:
                PlayableCorciteState;

        after:
                PlayableCorciteState;

        extraction:
                TfExtractionResolution;

        transformation:
                TfProcessingResolution;

        fabrication:
                TfProcessingResolution;

        sustainability:
                PlayableSustainabilityTurnResolution;

        recovery:
                PlayableRecoveryTurnResolution;

        researchStatus:
                PlayableResearchAdvanceStatus;
}

function storedResources(
        state:
                PlayableCorciteState
): ResourceAmounts {
        const result:
                ResourceAmounts = {
                        R1: 0,
                        R2: 0,
                        R3: 0,
                        R4: 0
                };

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

        return result;
}

function storageLoad(
        state:
                PlayableCorciteState
): number {
        return state.storageUnits.reduce(
                (
                        total,
                        storage
                ) =>
                        total +
                        RESOURCE_IDS.reduce(
                                (
                                        subtotal,
                                        resourceId
                                ) =>
                                        subtotal +
                                        storage.contents[
                                                resourceId
                                        ],
                                0
                        ) +
                        (
                                storage.unanalysedWaveMatter ??
                                0
                        ),
                0
        );
}

function storageCapacity(
        state:
                PlayableCorciteState
): number {
        return state.storageUnits.reduce(
                (
                        total,
                        storage
                ) =>
                        total +
                        storage.capacity,
                0
        );
}

function capacitySnapshot(
        state:
                PlayableCorciteState
): PlayerTurnCapacitySnapshot {
        const workCapacity =
                state.capacities.work.capacity;

        const workUsed =
                state.capacities.work.used;

        const workPerPopulation =
                state.population
                        .workPerPopulation;

        const available =
                Math.max(
                        0,
                        Math.floor(
                                (
                                        workCapacity -
                                        workUsed
                                ) /
                                workPerPopulation
                        )
                );

        const assigned =
                Math.max(
                        0,
                        state.population.total -
                        available
                );

        return {
                energy: {
                        used:
                                state.capacities.energy.used,
                        normalCapacity:
                                state.capacities.energy.normalCapacity,
                        reserveCurrent:
                                state.capacities.energy.reserveCurrent,
                        reserveMaximum:
                                state.capacities.energy.reserveMaximum
                },

                maintenance: {
                        used:
                                state.capacities.maintenance.used,
                        capacity:
                                state.capacities.maintenance.capacity,
                        debt:
                                state.sustainability
                                        ?.maintenance.debt ??
                                0
                },

                population: {
                        total:
                                state.population.total,
                        assigned,
                        available
                },

                integrity: {
                        current:
                                state.recovery.integrity.current,
                        maximum:
                                state.recovery.integrity.maximum
                },

                storage: {
                        used:
                                storageLoad(
                                        state
                                ),
                        capacity:
                                storageCapacity(
                                        state
                                )
                }
        };
}

function structureName(
        state:
                PlayableCorciteState,
        structureId: string
): string {
        return (
                state.structures.find(
                        (structure) =>
                                structure.id ===
                                structureId
                )?.name ??
                'Structure'
        );
}

function resourceLabel(
        resourceId:
                ResourceId
): string {
        return PLAYABLE_START_REFERENCE
                .resourceLabels[
                        resourceId
                ];
}

function formatOutputs(
        outputs:
                Partial<
                        Record<
                                ResourceId,
                                number
                        >
                >
): string {
        const parts =
                RESOURCE_IDS
                        .filter(
                                (resourceId) =>
                                        (
                                                outputs[
                                                        resourceId
                                                ] ??
                                                0
                                        ) > 0
                        )
                        .map(
                                (resourceId) =>
                                        `${
                                                outputs[
                                                        resourceId
                                                ] ??
                                                0
                                        } ${resourceLabel(resourceId)}`
                        );

        return parts.join(
                ' et '
        );
}

function processingEvents(
        kind:
                'transformation' |
                'fabrication',
        resolution:
                TfProcessingResolution,
        state:
                PlayableCorciteState
): PlayerTurnEvent[] {
        return resolution.events.map(
                (event) => {
                        const structure =
                                structureName(
                                        state,
                                        event.structureId
                                );

                        const recipe =
                                getPlayableRecipePresentation(
                                        event.recipeId
                                );

                        if (
                                event.status ===
                                'produced'
                        ) {
                                return {
                                        kind,
                                        status:
                                                'positive',
                                        message:
                                                `${structure} — ${recipe.label} : ${formatOutputs(event.outputs)} produit.`
                                };
                        }

                        if (
                                event.status ===
                                'inactive'
                        ) {
                                return {
                                        kind,
                                        status:
                                                'neutral',
                                        message:
                                                `${structure} est en réserve et n’a rien produit.`
                                };
                        }

                        if (
                                event.status ===
                                'storage-blocked'
                        ) {
                                return {
                                        kind,
                                        status:
                                                'warning',
                                        message:
                                                `${structure} n’a pas pu produire : espace de stockage insuffisant.`
                                };
                        }

                        if (
                                event.status ===
                                'input-conflict'
                        ) {
                                return {
                                        kind,
                                        status:
                                                'warning',
                                        message:
                                                `${structure} n’a pas pu produire : plusieurs fonctions réclament les mêmes ressources.`
                                };
                        }

                        return {
                                kind,
                                status:
                                        'warning',
                                message:
                                        `${structure} n’a pas pu produire faute d’intrants disponibles.`
                        };
                }
        );
}

export function createPlayablePlayerTurnReport(
        input:
                CreatePlayerTurnReportInput
): PlayerTurnReport {
        const beforeResources =
                storedResources(
                        input.before
                );

        const afterResources =
                storedResources(
                        input.after
                );

        const resources =
                {} as
                Record<
                        ResourceId,
                        PlayerTurnResourceDelta
                >;

        for (
                const resourceId of
                RESOURCE_IDS
        ) {
                resources[resourceId] = {
                        before:
                                beforeResources[
                                        resourceId
                                ],

                        after:
                                afterResources[
                                        resourceId
                                ],

                        delta:
                                afterResources[
                                        resourceId
                                ] -
                                beforeResources[
                                        resourceId
                                ]
                };
        }

        const events:
                PlayerTurnEvent[] = [];

        for (
                const event of
                input.extraction.events
        ) {
                const structure =
                        structureName(
                                input.after,
                                event.structureId
                        );

                if (
                        event.status ===
                        'produced'
                ) {
                        events.push({
                                kind:
                                        'extraction',
                                status:
                                        'positive',
                                message:
                                        `${structure} a extrait ${event.producedOutput} ${resourceLabel(event.resourceId)}.`
                        });

                        continue;
                }

                if (
                        event.status ===
                        'storage-blocked'
                ) {
                        events.push({
                                kind:
                                        'extraction',
                                status:
                                        'warning',
                                message:
                                        `${structure} n’a rien extrait : le stockage disponible est insuffisant.`
                        });

                        continue;
                }

                events.push({
                        kind:
                                'extraction',
                        status:
                                'neutral',
                        message:
                                `${structure} est en réserve et n’a rien extrait.`
                });
        }

        events.push(
                ...processingEvents(
                        'transformation',
                        input.transformation,
                        input.after
                )
        );

        events.push(
                ...processingEvents(
                        'fabrication',
                        input.fabrication,
                        input.after
                )
        );

        if (
                input.researchStatus ===
                'discovery-pending'
        ) {
                events.push({
                        kind:
                                'research',
                        status:
                                'positive',
                        message:
                                'La recherche du tour est achevée ; sa découverte sera examinable au début du tour suivant.'
                });
        } else if (
                input.researchStatus ===
                'progressed'
        ) {
                events.push({
                        kind:
                                'research',
                        status:
                                'neutral',
                        message:
                                'La recherche active a progressé.'
                });
        }

        if (
                input.sustainability
                        .energy.reserveSpent >
                0
        ) {
                events.push({
                        kind:
                                'energy',
                        status:
                                'warning',
                        message:
                                `La réserve énergétique a fourni ${input.sustainability.energy.reserveSpent}.`
                });
        }

        if (
                input.sustainability
                        .energy.reserveRecovered >
                0
        ) {
                events.push({
                        kind:
                                'energy',
                        status:
                                'positive',
                        message:
                                `La réserve énergétique a récupéré ${input.sustainability.energy.reserveRecovered}.`
                });
        }

        if (
                input.sustainability
                        .maintenance.deficit >
                0
        ) {
                events.push({
                        kind:
                                'maintenance',
                        status:
                                'warning',
                        message:
                                `L’entretien manque de ${input.sustainability.maintenance.deficit} unité(s) ; la dette augmente.`
                });
        } else if (
                input.sustainability
                        .maintenance.debtAfter <
                input.sustainability
                        .maintenance.debtBefore
        ) {
                events.push({
                        kind:
                                'maintenance',
                        status:
                                'positive',
                        message:
                                'Une partie de la dette d’entretien a été résorbée.'
                });
        }

        if (
                input.sustainability
                        .work.shortage >
                0
        ) {
                events.push({
                        kind:
                                'population',
                        status:
                                'warning',
                        message:
                                `Il manque ${input.sustainability.work.shortage} unité(s) de population disponible pour soutenir les fonctions actives.`
                });
        }

        if (
                input.recovery.integrity.recovered >
                0
        ) {
                events.push({
                        kind:
                                'recovery',
                        status:
                                'positive',
                        message:
                                `Le Corcite a récupéré ${input.recovery.integrity.recovered} point(s) d’intégrité.`
                });
        }

        if (
                events.length ===
                0
        ) {
                events.push({
                        kind:
                                'system',
                        status:
                                'neutral',
                        message:
                                'Aucun changement automatique notable pendant ce tour.'
                });
        }

        return {
                schema:
                        'avelune.proto0.player-turn-report',
                schemaVersion: 1,
                runId:
                        input.runId,
                turn:
                        input.turn,
                resources,
                before:
                        capacitySnapshot(
                                input.before
                        ),
                after:
                        capacitySnapshot(
                                input.after
                        ),
                events
        };
}
