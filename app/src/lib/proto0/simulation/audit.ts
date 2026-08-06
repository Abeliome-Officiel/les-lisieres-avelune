import {
	REFERENCE_SESSION_CONFIGURATION
} from '../config/reference.js';
import type {
	WaveState
} from '../domain/wave.js';
import {
	runTdReferenceBattery,
	type TdReferenceBatteryResult,
	type TdReferenceSimulationResult
} from './battery.js';
import {
	PROTO0_REFERENCE_TD_CONFIGURATIONS
} from './reference-configurations.js';
import {
	runProto0StressAudit,
	type Proto0StressAudit
} from './stress.js';

export const PROTO0_P9_SEEDS =
	Array.from(
		{
			length: 64
		},
		(_, index) =>
			index + 1
	);

export interface SimulationObjectiveLeader {
	objective:
		| 'pressure-min'
		| 'structure-min'
		| 'charge-min'
		| 'capturable-matter-max'
		| 'captured-matter-max';
	value: number;
	configurationIds: string[];
}

export interface SeededBatterySummary {
	seed: number;
	distinctResultCount: number;
	universallyDominantConfigurationIds:
		string[];
}

export interface Proto0SimulationAudit {
	referenceSet: {
		count: number;
		historicalExactListAvailable:
			false;
		definition:
			string;
	};
	nominal: {
		distinctResultCount: number;
		orderSensitive: boolean;
		universallyDominantConfigurationIds:
			string[];
		paretoFrontConfigurationIds:
			string[];
		objectiveLeaders:
			SimulationObjectiveLeader[];
	};
	seeded: {
		seeds: number[];
		batteriesExecuted: number;
		configurationsExecuted: number;
		allInputWavesWithinBounds:
			boolean;
		deterministicReplay:
			boolean;
		distinctSeedsProduceVariation:
			boolean;
		seedsWithUniversalDominance:
			SeededBatterySummary[];
	};
	stress: Proto0StressAudit;
	conclusions: {
		orderEffectReproduced:
			boolean;
		noUniversalDominanceObserved:
			boolean;
		seededVariationControlled:
			boolean;
		replayDeterministic:
			boolean;
		noFreeProcessingObserved:
			boolean;
		conflictsRemainExplicit:
			boolean;
		impossibleStatesDetected:
			boolean;
	};
}

function withinPercent(
	actual: number,
	reference: number,
	percent: number
): boolean {
	const delta =
		reference *
		(
			percent /
			100
		);

	return (
		actual >=
			reference -
				delta -
				1e-9 &&
		actual <=
			reference +
				delta +
				1e-9
	);
}

function waveWithinConfiguredBounds(
	wave: WaveState
): boolean {
	const nominal =
		REFERENCE_SESSION_CONFIGURATION
			.wave.nominal;

	const maximumPercent =
		Math.max(
			Math.abs(
				REFERENCE_SESSION_CONFIGURATION
					.wave.variation
					.minimumPercent
			),
			Math.abs(
				REFERENCE_SESSION_CONFIGURATION
					.wave.variation
					.maximumPercent
			)
		);

	return (
		withinPercent(
			wave.pressure,
			nominal.pressure,
			maximumPercent
		) &&
		withinPercent(
			wave.structure,
			nominal.structure,
			maximumPercent
		) &&
		withinPercent(
			wave.charge,
			nominal.charge,
			maximumPercent
		) &&
		withinPercent(
			wave.capturableMatter,
			nominal.capturableMatter,
			maximumPercent
		)
	);
}

function leader(
	results:
		readonly TdReferenceSimulationResult[],
	objective:
		SimulationObjectiveLeader['objective'],
	read:
		(
			result:
				TdReferenceSimulationResult
		) => number,
	mode:
		'min' |
		'max'
): SimulationObjectiveLeader {
	const values =
		results.map(
			read
		);

	const value =
		mode === 'min'
			? Math.min(
					...values
				)
			: Math.max(
					...values
				);

	return {
		objective,
		value,
		configurationIds:
			results
				.filter(
					(result) =>
						Math.abs(
							read(result) -
								value
						) <
						1e-9
				)
				.map(
					(result) =>
						result.configurationId
				)
	};
}

function objectiveLeaders(
	battery:
		TdReferenceBatteryResult
): SimulationObjectiveLeader[] {
	return [
		leader(
			battery.results,
			'pressure-min',
			(result) =>
				result.metrics
					.pressure,
			'min'
		),
		leader(
			battery.results,
			'structure-min',
			(result) =>
				result.metrics
					.structure,
			'min'
		),
		leader(
			battery.results,
			'charge-min',
			(result) =>
				result.metrics
					.charge,
			'min'
		),
		leader(
			battery.results,
			'capturable-matter-max',
			(result) =>
				result.metrics
					.capturableMatter,
			'max'
		),
		leader(
			battery.results,
			'captured-matter-max',
			(result) =>
				result.metrics
					.capturedMatter,
			'max'
		)
	];
}

export function createProto0SimulationAudit(
	seeds:
		readonly number[] =
			PROTO0_P9_SEEDS
): Proto0SimulationAudit {
	if (seeds.length === 0) {
		throw new Error(
			'L’audit P9 exige au moins une graine.'
		);
	}

	const nominal =
		runTdReferenceBattery({
			scenario:
				'nominal'
		});

	const seededBatteries =
		seeds.map(
			(seed) =>
				runTdReferenceBattery({
					scenario:
						'seeded',
					seed
				})
		);

	const replaySeed =
		seeds[0];

	const replayA =
		runTdReferenceBattery({
			scenario:
				'seeded',
			seed:
				replaySeed
		});

	const replayB =
		runTdReferenceBattery({
			scenario:
				'seeded',
			seed:
				replaySeed
		});

	const inputWaveSignatures =
		new Set(
			seededBatteries.map(
				(battery) =>
					JSON.stringify(
						battery.inputWave
					)
			)
		);

	const seedsWithUniversalDominance =
		seededBatteries
			.filter(
				(battery) =>
					battery
						.universallyDominantConfigurationIds
						.length >
					0
			)
			.map(
				(battery) => ({
					seed:
						battery.seed as number,
					distinctResultCount:
						battery
							.distinctResultCount,
					universallyDominantConfigurationIds:
						[
							...battery
								.universallyDominantConfigurationIds
						]
				})
			);

	const stress =
		runProto0StressAudit(
			100
		);

	const orderSensitive =
		nominal.distinctResultCount >
		1;

	const noUniversalDominanceObserved =
		nominal
			.universallyDominantConfigurationIds
			.length ===
			0 &&
		seedsWithUniversalDominance
			.length ===
			0;

	const allInputWavesWithinBounds =
		seededBatteries.every(
			(battery) =>
				waveWithinConfiguredBounds(
					battery.inputWave
				)
		);

	const deterministicReplay =
		JSON.stringify(
			replayA
		) ===
		JSON.stringify(
			replayB
		);

	return {
		referenceSet: {
			count:
				PROTO0_REFERENCE_TD_CONFIGURATIONS
					.length,
			historicalExactListAvailable:
				false,
			definition:
				'Référence moteur P9 : 24 permutations des quatre familles distinctes + 36 ordonnancements uniques composés de deux familles présentes deux fois.'
		},
		nominal: {
			distinctResultCount:
				nominal
					.distinctResultCount,
			orderSensitive,
			universallyDominantConfigurationIds:
				[
					...nominal
						.universallyDominantConfigurationIds
				],
			paretoFrontConfigurationIds:
				[
					...nominal
						.paretoFrontConfigurationIds
				],
			objectiveLeaders:
				objectiveLeaders(
					nominal
				)
		},
		seeded: {
			seeds:
				[...seeds],
			batteriesExecuted:
				seededBatteries.length,
			configurationsExecuted:
				seededBatteries.length *
				PROTO0_REFERENCE_TD_CONFIGURATIONS
					.length,
			allInputWavesWithinBounds,
			deterministicReplay,
			distinctSeedsProduceVariation:
				inputWaveSignatures.size >
				1,
			seedsWithUniversalDominance
		},
		stress,
		conclusions: {
			orderEffectReproduced:
				orderSensitive,
			noUniversalDominanceObserved,
			seededVariationControlled:
				allInputWavesWithinBounds,
			replayDeterministic:
				deterministicReplay,
			noFreeProcessingObserved:
				!stress
					.freeProcessingDetected &&
				stress.tfTurnsCompleted ===
					stress.tfTurnsRequested,
			conflictsRemainExplicit:
				stress
					.insufficientResourceExplicit &&
				stress
					.humanConflictExplicit &&
				stress
					.humanConflictResolved,
			impossibleStatesDetected:
				stress
					.impossibleStateDetected &&
				stress
					.allTfStatesValid
		}
	};
}
