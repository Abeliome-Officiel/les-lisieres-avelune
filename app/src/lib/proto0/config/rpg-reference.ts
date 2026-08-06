import type {
	ModifierOperation
} from '../domain/corcite.js';

export interface RpgResearchCompletionModifier {
	id: string;
	target: string;
	operation: ModifierOperation;
	value: number;
}

export interface RpgResearchCompletionAccess {
	id: string;
	key: string;
}

export interface RpgResearchCompletionKnowledge {
	id: string;
	key: string;
	value: number;
}

export interface RpgResearchDefinition {
	id: string;
	label: string;
	durationTurns: number;
	completion: {
		modifier:
			RpgResearchCompletionModifier;
		access:
			RpgResearchCompletionAccess;
		knowledge:
			RpgResearchCompletionKnowledge;
	};
}

/**
 * Valeurs strictement expérimentales PROTO-0.
 *
 * Elles servent uniquement à vérifier :
 * - une recherche RPG multi-tour ;
 * - un déblocage ;
 * - une connaissance ;
 * - un modificateur mécaniquement mesurable en P4-C.
 *
 * Elles ne constituent pas un équilibrage définitif.
 */
export const RPG_LAB_REFERENCE:
	RpgResearchDefinition = {
		id:
			'transformation-efficiency-n1',
		label:
			'Optimisation de transformation N1',
		durationTurns: 3,
		completion: {
			modifier: {
				id:
					'modifier-research-transformation-efficiency-n1',
				target:
					'tf.recipe.transform-r3-n1.output.R3',
				operation:
					'multiply',
				value: 1.2
			},
			access: {
				id:
					'access-transformation-analysis-n1',
				key:
					'tf:transformation-analysis-n1'
			},
			knowledge: {
				id:
					'knowledge-transformation-efficiency-n1',
				key:
					'tf:transformation-efficiency-n1',
				value: 1
			}
		}
	};
