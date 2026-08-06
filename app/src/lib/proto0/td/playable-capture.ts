import {
        PLAYABLE_CAPTURE_REFERENCE
} from '../config/playable-capture-reference.js';
import type {
        CorciteState,
        PlayableCorciteState
} from '../domain/corcite.js';
import type {
        PlayableCaptureAppliedModifier,
        PlayableCaptureRecoveryState
} from '../domain/playable-capture.js';
import {
        validateCorciteState
} from '../corcite/validate.js';
import {
        getTotalFreeStorageCapacity,
        storeUnanalysedWaveMatterDeterministically
} from '../tf/storage.js';

export interface ApplyPlayableCaptureEconomyResult {
        corcite: PlayableCorciteState;
        recovery: PlayableCaptureRecoveryState;
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

function clamp(
        value: number,
        minimum: number,
        maximum: number
): number {
        return Math.max(
                minimum,
                Math.min(
                        maximum,
                        value
                )
        );
}

function requirePlayableState(
        state: CorciteState
): PlayableCorciteState {
        if (
                state.population ===
                        undefined ||
                state.recovery ===
                        undefined ||
                state.captureEconomy ===
                        undefined ||
                state.tdInventory ===
                        undefined
        ) {
                throw new Error(
                        "L'économie de captation nécessite un Corcite jouable complet."
                );
        }

        return state as
                PlayableCorciteState;
}

function evaluateCaptureEfficiency(
        state: PlayableCorciteState
): {
        ratio: number;
        appliedModifiers:
                PlayableCaptureAppliedModifier[];
} {
        const target =
                PLAYABLE_CAPTURE_REFERENCE
                        .recovery
                        .modifierTarget;

        const modifiers =
                state.modifiers
                        .filter(
                                (modifier) =>
                                        modifier.active &&
                                        modifier.target ===
                                                target
                        )
                        .sort(
                                (a, b) =>
                                        a.id.localeCompare(
                                                b.id
                                        )
                        );

        let additive = 0;
        let multiplier = 1;

        const appliedModifiers:
                PlayableCaptureAppliedModifier[] = [];

        for (
                const modifier of
                modifiers
        ) {
                if (
                        modifier.operation ===
                        'add'
                ) {
                        additive +=
                                modifier.value;
                } else {
                        multiplier *=
                                modifier.value;
                }

                appliedModifiers.push({
                        id:
                                modifier.id,
                        source:
                                modifier.source,
                        target:
                                modifier.target,
                        operation:
                                modifier.operation,
                        value:
                                modifier.value
                });
        }

        const rawRatio =
                (
                        PLAYABLE_CAPTURE_REFERENCE
                                .recovery
                                .baseRatio +
                        additive
                ) *
                multiplier;

        if (
                !Number.isFinite(
                        rawRatio
                )
        ) {
                throw new Error(
                        'Rendement de récupération de captation invalide.'
                );
        }

        return {
                ratio:
                        round(
                                clamp(
                                        rawRatio,
                                        0,
                                        PLAYABLE_CAPTURE_REFERENCE
                                                .recovery
                                                .maximumRatio
                                )
                        ),
                appliedModifiers
        };
}

/**
 * Résout le bénéfice ECONOMIQUE de la captation.
 *
 * La vague est déjà résolue à ce stade :
 * `WaveConsequenceState.capturedMatter` reste donc la quantité
 * réellement interceptée / retirée de la vague.
 *
 * Cette fonction détermine uniquement la quantité que le Corcite
 * parvient ensuite à récupérer et à conserver physiquement.
 */
export function applyPlayableCaptureEconomy(
        inputState: CorciteState,
        consequenceId: string
): ApplyPlayableCaptureEconomyResult {
        const state =
                structuredClone(
                        requirePlayableState(
                                inputState
                        )
                );

        if (
                !consequenceId.trim()
        ) {
                throw new Error(
                        'Une récupération de captation doit référencer une conséquence de vague.'
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
                        `Conséquence de vague introuvable pour la captation : ${consequenceId}.`
                );
        }

        if (
                state.captureEconomy
                        .recoveries
                        .some(
                                (recovery) =>
                                        recovery.consequenceId ===
                                        consequenceId
                        )
        ) {
                throw new Error(
                        `L'économie de captation de ${consequenceId} a déjà été résolue.`
                );
        }

        const interceptedMatter =
                round(
                        consequence
                                .capturedMatter
                );

        const efficiency =
                evaluateCaptureEfficiency(
                        state
                );

        const recoverableMatter =
                round(
                        interceptedMatter *
                        efficiency.ratio
                );

        const freeStorage =
                getTotalFreeStorageCapacity(
                        state
                );

        const recoveredMatter =
                round(
                        Math.min(
                                recoverableMatter,
                                freeStorage
                        )
                );

        const lostDuringRecovery =
                round(
                        interceptedMatter -
                        recoverableMatter
                );

        const lostForLackOfStorage =
                round(
                        recoverableMatter -
                        recoveredMatter
                );

        const storagePlacements =
                recoveredMatter > 0
                        ? storeUnanalysedWaveMatterDeterministically(
                                state,
                                recoveredMatter
                          )
                        : [];

        const recovery:
                PlayableCaptureRecoveryState = {
                        id:
                                `capture-recovery:${consequenceId}`,
                        consequenceId,
                        turn:
                                consequence.turn,
                        interceptedMatter,
                        baseRecoveryRatio:
                                PLAYABLE_CAPTURE_REFERENCE
                                        .recovery
                                        .baseRatio,
                        effectiveRecoveryRatio:
                                efficiency.ratio,
                        recoverableMatter,
                        recoveredMatter,
                        lostDuringRecovery,
                        lostForLackOfStorage,
                        storagePlacements:
                                structuredClone(
                                        storagePlacements
                                ),
                        appliedModifiers:
                                structuredClone(
                                        efficiency
                                                .appliedModifiers
                                )
                };

        state.captureEconomy
                .recoveries.push(
                        structuredClone(
                                recovery
                        )
                );

        const validation =
                validateCorciteState(
                        state
                );

        if (!validation.valid) {
                throw new Error(
                        `Etat invalide après économie de captation : ${validation.errors.join(' | ')}`
                );
        }

        return {
                corcite:
                        state,
                recovery:
                        structuredClone(
                                recovery
                        )
        };
}
