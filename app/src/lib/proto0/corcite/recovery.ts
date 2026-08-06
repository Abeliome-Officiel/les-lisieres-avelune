import {
        PLAYABLE_RECOVERY_REFERENCE
} from '../config/playable-recovery-reference.js';

import type {
        CorciteState,
        PlayableCorciteState,
        PlayableWaveImpactState
} from '../domain/corcite.js';

import {
        getPlayableMaintenanceCondition,
        getPlayableSustainabilityState,
        type PlayableSustainabilityTurnResolution
} from './sustainability.js';

import {
        validateCorciteState
} from './validate.js';

export interface ApplyPlayableWaveImpactResult {
        corcite: PlayableCorciteState;
        impact: PlayableWaveImpactState;
}

export interface PlayableRecoveryTurnResolution {
        turn: number;
        stable: boolean;

        integrity: {
                before: number;
                recovered: number;
                after: number;
                maximum: number;
        };
}

export interface PlayableRecoveryTurnResult {
        corcite: PlayableCorciteState;
        resolution: PlayableRecoveryTurnResolution;
}

function round(
        value: number,
        decimals = 6
): number {
        const factor =
                10 ** decimals;

        return (
                Math.round(
                        value * factor
                ) / factor
        );
}

function requirePlayableState(
        state: CorciteState
): PlayableCorciteState {
        if (
                state.population === undefined ||
                state.tdInventory === undefined ||
                state.recovery === undefined
        ) {
                throw new Error(
                        'La récupération nécessite un Corcite jouable complet.'
                );
        }

        return state as PlayableCorciteState;
}

function ensureSustainability(
        state: PlayableCorciteState
): void {
        if (
                state.sustainability ===
                undefined
        ) {
                state.sustainability =
                        getPlayableSustainabilityState(
                                state
                        );
        }
}

function validateResult(
        state: PlayableCorciteState,
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

/**
 * Transforme la vague résiduelle en conséquences persistantes.
 *
 * Le moteur historique de conséquences reste inchangé.
 * Cette couche jouable s'appuie obligatoirement sur une
 * WaveConsequenceState déjà persistée dans le Corcite.
 */
export function applyPlayableWaveImpact(
        inputState: CorciteState,
        consequenceId: string
): ApplyPlayableWaveImpactResult {
        const state =
                structuredClone(
                        requirePlayableState(
                                inputState
                        )
                );

        if (!consequenceId.trim()) {
                throw new Error(
                        'Une conséquence jouable doit posséder un identifiant.'
                );
        }

        const consequence =
                state.waveConsequences.find(
                        (candidate) =>
                                candidate.id ===
                                consequenceId
                );

        if (!consequence) {
                throw new Error(
                        `Conséquence de vague introuvable : ${consequenceId}.`
                );
        }

        if (
                state.recovery
                        .appliedWaveConsequenceIds
                        .includes(
                                consequenceId
                        )
        ) {
                throw new Error(
                        `La conséquence ${consequenceId} a déjà été appliquée à la récupération.`
                );
        }

        ensureSustainability(
                state
        );

        if (!state.sustainability) {
                throw new Error(
                        'Etat de soutenabilité absent après initialisation.'
                );
        }

        const requestedIntegrityDamage =
                round(
                        consequence.finalWave.pressure *
                                PLAYABLE_RECOVERY_REFERENCE
                                        .integrity
                                        .pressureDamageFactor
                );

        const integrityDamage =
                round(
                        Math.min(
                                state.recovery.integrity.current,
                                requestedIntegrityDamage
                        )
                );

        // Champ historique conservé dans les rapports sérialisés P0-P10.
        // PROTO-0.2 ne possède plus de réserve énergétique à ponctionner.
        const energyReserveDrain = 0;

        const maintenanceDebtAdded =
                round(
                        consequence.finalWave.structure *
                                PLAYABLE_RECOVERY_REFERENCE
                                        .maintenance
                                        .structureDebtFactor
                );

        state.recovery.integrity.current =
                round(
                        state.recovery.integrity.current -
                                integrityDamage
                );

        state.recovery.integrity
                .damageTakenLastWave =
                integrityDamage;

        state.sustainability.maintenance.debt =
                round(
                        state.sustainability
                                .maintenance.debt +
                                maintenanceDebtAdded
                );

        state.sustainability.maintenance.condition =
                getPlayableMaintenanceCondition(
                        state.sustainability
                                .maintenance.debt,
                        state.sustainability
                                .maintenance
                                .consecutiveDeficitTurns
                );

        state.sustainability.energy
                .mustReduceLoad =
                state.sustainability.energy
                        .overload > 0;

        const impact:
                PlayableWaveImpactState = {
                        consequenceId,
                        turn:
                                consequence.turn,
                        integrityDamage,
                        energyReserveDrain,
                        maintenanceDebtAdded
                };

        state.recovery.lastWaveImpact =
                structuredClone(
                        impact
                );

        state.recovery
                .appliedWaveConsequenceIds
                .push(
                        consequenceId
                );

        validateResult(
                state,
                'Etat invalide après conséquences de vague'
        );

        return {
                corcite:
                        state,
                impact:
                        structuredClone(
                                impact
                        )
        };
}

/**
 * Récupération naturelle de l'intégrité.
 *
 * Elle n'est accordée que pendant un tour réellement stable :
 * - aucun dépassement énergétique ;
 * - aucun déficit d'entretien courant ;
 * - aucune dette d'entretien à résorber au début du tour ;
 * - aucune pénurie de travail.
 *
 * Un tour servant à réparer une dette ne soigne donc pas
 * simultanément l'intégrité.
 */
export function resolvePlayableRecoveryTurn(
        inputState: CorciteState,
        sustainability:
                PlayableSustainabilityTurnResolution
): PlayableRecoveryTurnResult {
        const state =
                structuredClone(
                        requirePlayableState(
                                inputState
                        )
                );

        const turn =
                sustainability.turn;

        if (
                !Number.isInteger(turn) ||
                turn < 1
        ) {
                throw new Error(
                        `Tour de récupération invalide : ${turn}.`
                );
        }

        if (
                turn <=
                state.recovery.lastResolvedTurn
        ) {
                throw new Error(
                        `La récupération du tour ${turn} a déjà été résolue ou appartient au passé.`
                );
        }

        const stable =
                sustainability.energy.overload ===
                        0 &&
                sustainability.maintenance.deficit ===
                        0 &&
                sustainability.maintenance.debtBefore ===
                        0 &&
                sustainability.work.shortage ===
                        0;

        const before =
                state.recovery.integrity.current;

        const recovered =
                stable
                        ? round(
                                Math.min(
                                        PLAYABLE_RECOVERY_REFERENCE
                                                .integrity
                                                .recoveryPerStableTurn,
                                        state.recovery.integrity
                                                .maximum -
                                                before
                                )
                        )
                        : 0;

        state.recovery.integrity.current =
                round(
                        before +
                                recovered
                );

        state.recovery.integrity
                .recoveredLastTurn =
                recovered;

        state.recovery.lastResolvedTurn =
                turn;

        validateResult(
                state,
                'Etat invalide après récupération'
        );

        return {
                corcite:
                        state,
                resolution: {
                        turn,
                        stable,
                        integrity: {
                                before,
                                recovered,
                                after:
                                        state.recovery
                                                .integrity.current,
                                maximum:
                                        state.recovery
                                                .integrity.maximum
                        }
                }
        };
}
