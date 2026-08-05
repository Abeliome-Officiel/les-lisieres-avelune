import type {
        TdTowerDefinitionId,
        TdTowerFamily
} from '../domain/td.js';
import type {
        ResourceCosts
} from '../domain/turn.js';

export interface PlayableTdFabricationDefinition {
        definitionId: TdTowerDefinitionId;
        family: TdTowerFamily;
        label: string;
        summary: string;
        resourceCosts: ResourceCosts;
}

/**
 * Catalogue PROVISOIRE du prototype miniature.
 *
 * Ces coûts servent à rendre les défenses TD dépendantes
 * de la véritable économie TF.
 *
 * Atténuation conserve exactement son coût historique P3/P10.
 * Les trois autres coûts sont des paramètres de playtest,
 * pas un équilibrage définitif.
 */
export const PLAYABLE_TD_FABRICATIONS:
        readonly PlayableTdFabricationDefinition[] = [
        {
                definitionId:
                        'attenuation-n1',
                family: 'attenuation',
                label: 'Atténuation N1',
                summary:
                        'Réduit principalement la pression, au prix d’une légère perte de matière capturable.',
                resourceCosts: {
                        R3: 2,
                        R4: 1
                }
        },
        {
                definitionId:
                        'destructuration-n1',
                family:
                        'destructuration',
                label:
                        'Déstructuration N1',
                summary:
                        'Fragilise la structure de la vague afin de favoriser certains effets en aval.',
                resourceCosts: {
                        R3: 1,
                        R4: 2
                }
        },
        {
                definitionId:
                        'captation-n1',
                family: 'captation',
                label: 'Captation N1',
                summary:
                        'Retire de la matière de la vague pour la capter, avec un contre-effet de charge.',
                resourceCosts: {
                        R3: 2,
                        R4: 2
                }
        },
        {
                definitionId:
                        'stabilisation-n1',
                family:
                        'stabilisation',
                label:
                        'Stabilisation N1',
                summary:
                        'Réduit la charge de la vague et restaure sa structure, avec un retour de pression.',
                resourceCosts: {
                        R3: 3,
                        R4: 1
                }
        }
];

export function getPlayableTdFabricationDefinition(
        definitionId: TdTowerDefinitionId
): PlayableTdFabricationDefinition {
        const definition =
                PLAYABLE_TD_FABRICATIONS.find(
                        (candidate) =>
                                candidate.definitionId ===
                                definitionId
                );

        if (!definition) {
                throw new Error(
                        `Défense TD jouable inconnue : ${definitionId}.`
                );
        }

        return definition;
}
