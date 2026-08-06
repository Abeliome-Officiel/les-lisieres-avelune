import type {
        WaveMatterStoragePlacement
} from './resources.js';

export interface PlayableCaptureAppliedModifier {
        id: string;
        source: string;
        target: string;
        operation:
                | 'add'
                | 'multiply';
        value: number;
}

/**
 * Trace économique d'une vague après sa résolution TD.
 *
 * interceptedMatter correspond à la quantité historique
 * `capturedMatter` du moteur TD.
 */
export interface PlayableCaptureRecoveryState {
        id: string;
        consequenceId: string;
        turn: number;

        interceptedMatter: number;

        baseRecoveryRatio: number;
        effectiveRecoveryRatio: number;

        /**
         * Quantité qui aurait pu être conservée avec une capacité
         * de stockage suffisante.
         */
        recoverableMatter: number;

        /**
         * Quantité effectivement placée dans les stockages.
         */
        recoveredMatter: number;

        /**
         * Perte liée au rendement de récupération lui-même.
         */
        lostDuringRecovery: number;

        /**
         * Matière récupérable abandonnée faute de capacité de stockage.
         */
        lostForLackOfStorage: number;

        storagePlacements:
                WaveMatterStoragePlacement[];

        appliedModifiers:
                PlayableCaptureAppliedModifier[];
}

export interface PlayableCaptureEconomyState {
        recoveries:
                PlayableCaptureRecoveryState[];
}
