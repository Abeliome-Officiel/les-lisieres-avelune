import type {
	PlayableWaveForecastStageId,
	PlayableWaveProfileId
} from '../domain/playable-wave.js';

import type {
	WaveState
} from '../domain/wave.js';

export interface PlayableWaveProfileDefinition {
	id: PlayableWaveProfileId;
	label: string;
	description: string;
	nominal: WaveState;
	variationPercent: number;
}

export interface PlayableWaveForecastStageDefinition {
	id: PlayableWaveForecastStageId;
	label: string;

	/**
	 * Cette lecture est utilisée tant que la vague est au moins
	 * à ce nombre de tours de son passage.
	 *
	 * Les paliers sont des paramètres PROTO-0 et non une règle
	 * définitive de type T-3 / T-2 / T-1.
	 */
	minimumTurnsBeforeArrival: number;

	uncertaintyPercent: number;
}

/**
 * Référence PROVISOIRE du cycle jouable.
 *
 * Elle sert à tester :
 * - plusieurs vagues dans une même partie ;
 * - une période réelle de préparation entre les vagues ;
 * - des profils qualitativement distincts ;
 * - une information qui se précise à l'approche du passage ;
 * - l'influence de la recherche sur cette information.
 *
 * Ces valeurs ne constituent pas l'équilibrage définitif.
 */
export const PLAYABLE_WAVE_CYCLE_REFERENCE = {
	plannedWaveCount: 3,

	firstWaveTurn: 6,

	turnsBetweenWaves: 5,

	forecastHorizonTurns: 5,

	forecastStages: [
		{
			id: 'distant',
			label: 'Lecture lointaine',
			minimumTurnsBeforeArrival: 4,
			uncertaintyPercent: 14
		},
		{
			id: 'approaching',
			label: 'Lecture affinée',
			minimumTurnsBeforeArrival: 2,
			uncertaintyPercent: 8
		},
		{
			id: 'near',
			label: 'Lecture proche',
			minimumTurnsBeforeArrival: 0,
			uncertaintyPercent: 4
		}
	] satisfies PlayableWaveForecastStageDefinition[],

	profiles: [
		{
			id: 'pressure-front',
			label: 'Front de pression',
			description:
				'Première vague centrée sur la pression, avec structure et charge plus modérées.',
			nominal: {
				pressure: 46,
				structure: 54,
				charge: 14,
				capturableMatter: 13
			},
			variationPercent: 4
		},
		{
			id: 'charged-fracture',
			label: 'Fracture chargée',
			description:
				'Vague plus instable : structure plus faible mais charge nettement renforcée.',
			nominal: {
				pressure: 50,
				structure: 45,
				charge: 28,
				capturableMatter: 18
			},
			variationPercent: 4
		},
		{
			id: 'dense-front',
			label: 'Front dense',
			description:
				'Vague fortement structurée et riche en matière capturable.',
			nominal: {
				pressure: 44,
				structure: 72,
				charge: 18,
				capturableMatter: 21
			},
			variationPercent: 4
		}
	] satisfies PlayableWaveProfileDefinition[]
} as const;
