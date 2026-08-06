import type {
	TdPathPosition,
	TdTowerDefinitionId,
	TdTowerFamily,
	TdTowerLevel
} from '../domain/td.js';

export interface TdTowerDefinition {
	id: TdTowerDefinitionId;
	family: TdTowerFamily;
	level: TdTowerLevel;
	label: string;
}

export const TD_PATH_POSITIONS = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8
] as const satisfies readonly TdPathPosition[];

/**
 * Valeurs de laboratoire PROTO-0.
 *
 * Elles servent exclusivement à démontrer :
 * - les transformations progressives ;
 * - l'effet mécanique de l'ordre des tours ;
 * - la traçabilité avant/après.
 *
 * Elles ne constituent pas l'équilibrage définitif.
 */
export const TD_LAB_REFERENCE = {
	pathPositions:
		TD_PATH_POSITIONS.length,

	referenceStructure: 60,

	towers: [
		{
			id: 'attenuation-n1',
			family: 'attenuation',
			level: 'n1',
			label: 'Atténuation N1'
		},
		{
			id: 'destructuration-n1',
			family: 'destructuration',
			level: 'n1',
			label: 'Déstructuration N1'
		},
		{
			id: 'captation-n1',
			family: 'captation',
			level: 'n1',
			label: 'Captation N1'
		},
		{
			id: 'stabilisation-n1',
			family: 'stabilisation',
			level: 'n1',
			label: 'Stabilisation N1'
		}
	] satisfies TdTowerDefinition[],

	coefficients: {
		attenuation: {
			basePressureReduction: 8,
			structureFactorMinimum: 0.85,
			structureFactorMaximum: 1.15,
			capturableMatterLossPerPressure: 0.08,
			structureIncrease: 1.5
		},

		destructuration: {
			structureReduction: 8,
			chargeIncrease: 3,
			pressureReduction: 0.4
		},

		captation: {
			baseCapture: 3.5,
			structureFactorMinimum: 0.8,
			structureFactorMaximum: 1.25,
			pressureReductionPerCaptured: 0.15,
			chargeIncrease: 0.8
		},

		stabilisation: {
			chargeNeutralisationRatio: 0.30,
			structureIncrease: 4,
			pressureReturnPerNeutralisedCharge: 0.20
		}
	}
} as const;
