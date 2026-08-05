/**
 * Paramètres PROVISOIRES des conséquences persistantes du PROTO-0 jouable.
 *
 * Ils servent à vérifier qu'une vague modifie réellement la trajectoire
 * du Corcite sans introduire encore :
 * - destruction individuelle de bâtiments ;
 * - mortalité ;
 * - cicatrices complexes ;
 * - game over.
 *
 * Ils ne constituent pas l'équilibrage définitif d'Avelune.
 */
export const PLAYABLE_RECOVERY_REFERENCE = {
        integrity: {
                maximum: 100,

                /**
                 * Dommage d'intégrité appliqué par point de pression
                 * restant après la résolution TD.
                 */
                pressureDamageFactor: 0.12,

                /**
                 * Récupération naturelle pendant un tour réellement stable.
                 */
                recoveryPerStableTurn: 1
        },

        energy: {
                /**
                 * Ponction de réserve énergétique par point de charge
                 * restant après la résolution TD.
                 */
                chargeReserveDrainFactor: 0.05
        },

        maintenance: {
                /**
                 * Dette d'entretien créée par point de structure
                 * restant après la résolution TD.
                 */
                structureDebtFactor: 0.04
        }
} as const;
