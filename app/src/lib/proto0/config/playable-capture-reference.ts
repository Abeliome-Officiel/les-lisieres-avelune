/**
 * Paramètres PROVISOIRES de l'économie de captation du PROTO-0 jouable.
 *
 * Trois quantités restent volontairement distinctes :
 *
 * 1. matière interceptée :
 *    quantité réellement retirée de la vague par les tours TD ;
 *
 * 2. matière potentiellement récupérable :
 *    part de cette matière que les capacités du Corcite permettent
 *    de conserver après l'interception ;
 *
 * 3. matière effectivement récupérée :
 *    part qui trouve réellement une place dans les stockages.
 *
 * La matière récupérée reste NON ANALYSÉE.
 * Elle n'est donc pas automatiquement convertie en R1, R2, R3 ou R4.
 */
export const PLAYABLE_CAPTURE_REFERENCE = {
        recovery: {
                /**
                 * Rendement initial volontairement incomplet.
                 *
                 * 65 % permet de rendre les progrès de captation visibles
                 * tout en laissant une marge à la recherche et aux futurs
                 * équipements spécialisés.
                 */
                baseRatio: 0.65,

                /**
                 * Une récupération ne peut jamais dépasser toute la matière
                 * effectivement interceptée.
                 */
                maximumRatio: 1,

                modifierTarget:
                        'td.capture.effectiveness'
        },

        storage: {
                label:
                        'Matière de vague non analysée'
        }
} as const;
