import {
	RPG_LAB_REFERENCE,
	type RpgResearchDefinition
} from './rpg-reference.js';

export type PlayableResearchDefinitionId =
	| 'transformation-efficiency-n1'
	| 'fabrication-efficiency-n1'
	| 'reserve-recovery-n1'
	| 'maintenance-recovery-n1'
	| 'wave-observation-n1'
	| 'capture-analysis-n1';

export interface PlayableResearchPresentation {
	id: PlayableResearchDefinitionId;
	category:
		| 'tf'
		| 'corcite'
		| 'wave'
		| 'td';
	summary: string;
	effectSummary: string;
}

/**
 * Petit catalogue PROVISOIRE pour rendre le choix de recherche réel.
 *
 * Les valeurs numériques sont des paramètres de test et non
 * l'équilibrage définitif d'Avelune.
 *
 * Les recherches Vague et Captation créent dès maintenant leurs
 * accès, connaissances et modificateurs ; leurs cibles mécaniques
 * seront consommées par les lots correspondants.
 */
export const PLAYABLE_RESEARCH_CATALOG:
	readonly RpgResearchDefinition[] = [
	RPG_LAB_REFERENCE,
	{
		id: 'fabrication-efficiency-n1',
		label: 'Gestes de fabrication N1',
		durationTurns: 3,
		completion: {
			modifier: {
				id:
					'modifier-research-fabrication-efficiency-n1',
				target:
					'tf.recipe.fabricate-r4-n1.output.R4',
				operation: 'multiply',
				value: 1.25
			},
			access: {
				id:
					'access-fabrication-analysis-n1',
				key:
					'tf:fabrication-analysis-n1'
			},
			knowledge: {
				id:
					'knowledge-fabrication-efficiency-n1',
				key:
					'tf:fabrication-efficiency-n1',
				value: 1
			}
		}
	},
	{
		id: 'reserve-recovery-n1',
		label: 'Cycles de réserve N1',
		durationTurns: 2,
		completion: {
			modifier: {
				id:
					'modifier-research-reserve-recovery-n1',
				target:
					'corcite.energy.reserve-recovery-per-stable-turn',
				operation: 'add',
				value: 1
			},
			access: {
				id:
					'access-energy-cycling-n1',
				key:
					'corcite:energy-cycling-n1'
			},
			knowledge: {
				id:
					'knowledge-energy-cycling-n1',
				key:
					'corcite:energy-cycling-n1',
				value: 1
			}
		}
	},
	{
		id: 'maintenance-recovery-n1',
		label: "Routines d'entretien N1",
		durationTurns: 2,
		completion: {
			modifier: {
				id:
					'modifier-research-maintenance-recovery-n1',
				target:
					'corcite.maintenance.debt-recovery-per-stable-turn',
				operation: 'add',
				value: 1
			},
			access: {
				id:
					'access-maintenance-routines-n1',
				key:
					'corcite:maintenance-routines-n1'
			},
			knowledge: {
				id:
					'knowledge-maintenance-routines-n1',
				key:
					'corcite:maintenance-routines-n1',
				value: 1
			}
		}
	},
	{
		id: 'wave-observation-n1',
		label: 'Observation des vagues N1',
		durationTurns: 2,
		completion: {
			modifier: {
				id:
					'modifier-research-wave-observation-n1',
				target:
					'wave.forecast.precision',
				operation: 'multiply',
				value: 1.15
			},
			access: {
				id:
					'access-wave-observation-n1',
				key:
					'wave:observation-n1'
			},
			knowledge: {
				id:
					'knowledge-wave-observation-n1',
				key:
					'wave:observation-n1',
				value: 1
			}
		}
	},
	{
		id: 'capture-analysis-n1',
		label: 'Étude de la captation N1',
		durationTurns: 3,
		completion: {
			modifier: {
				id:
					'modifier-research-capture-analysis-n1',
				target:
					'td.capture.effectiveness',
				operation: 'multiply',
				value: 1.15
			},
			access: {
				id:
					'access-capture-analysis-n1',
				key:
					'td:capture-analysis-n1'
			},
			knowledge: {
				id:
					'knowledge-capture-analysis-n1',
				key:
					'td:capture-analysis-n1',
				value: 1
			}
		}
	}
] as const;

export const PLAYABLE_RESEARCH_PRESENTATIONS:
	readonly PlayableResearchPresentation[] = [
	{
		id: 'transformation-efficiency-n1',
		category: 'tf',
		summary:
			'Mieux comprendre les transformations primaires.',
		effectSummary:
			'Améliore le rendement de la transformation R1 + R2 vers R3.'
	},
	{
		id: 'fabrication-efficiency-n1',
		category: 'tf',
		summary:
			'Affiner les gestes et séquences de fabrication.',
		effectSummary:
			'Améliore le rendement de fabrication des composants R4.'
	},
	{
		id: 'reserve-recovery-n1',
		category: 'corcite',
		summary:
			'Mieux organiser les cycles de charge et de repos.',
		effectSummary:
			'Accélère la récupération de la réserve énergétique pendant les tours stables.'
	},
	{
		id: 'maintenance-recovery-n1',
		category: 'corcite',
		summary:
			'Structurer les routines de soin du Corcite.',
		effectSummary:
			'Accélère la résorption de la dette d’entretien lorsque la capacité le permet.'
	},
	{
		id: 'wave-observation-n1',
		category: 'wave',
		summary:
			'Développer des méthodes d’observation de la vague.',
		effectSummary:
			'Ouvre une meilleure lecture des vagues ; son effet précis sera branché au cycle multi-vagues.'
	},
	{
		id: 'capture-analysis-n1',
		category: 'td',
		summary:
			'Étudier la matière capturable et les conditions de prélèvement.',
		effectSummary:
			'Ouvre une meilleure maîtrise de la captation ; son effet précis sera branché au lot TD/captation.'
	}
] as const;

export function getPlayableResearchDefinition(
	id: PlayableResearchDefinitionId
): RpgResearchDefinition {
	const definition =
		PLAYABLE_RESEARCH_CATALOG.find(
			(candidate) =>
				candidate.id === id
		);

	if (!definition) {
		throw new Error(
			`Recherche jouable inconnue : ${id}.`
		);
	}

	return definition;
}
