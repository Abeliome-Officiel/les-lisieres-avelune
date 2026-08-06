import {
	REFERENCE_SESSION_CONFIGURATION
} from '../config/reference.js';
import type {
	TdResolutionResult,
	TdTowerDefinitionId
} from '../domain/td.js';
import type {
	WaveState
} from '../domain/wave.js';
import {
	createInitialState
} from '../session.js';
import {
	resolveTdPath
} from '../td/resolution.js';
import {
	createEmptyTdState,
	createTdTower,
	placeTdTower
} from '../td/state.js';
import {
	PROTO0_REFERENCE_TD_CONFIGURATIONS,
	type TdReferenceConfiguration
} from './reference-configurations.js';

export type TdBatteryScenario =
	| 'nominal'
	| 'seeded';

export interface RunTdBatteryOptions {
	scenario: TdBatteryScenario;
	seed?: number;
}

export interface TdSimulationMetrics {
	pressure: number;
	structure: number;
	charge: number;
	capturableMatter: number;
	capturedMatter: number;
}

export interface TdReferenceSimulationResult {
	configurationId: string;
	configurationKind:
		TdReferenceConfiguration['kind'];
	order: TdTowerDefinitionId[];
	scenario: TdBatteryScenario;
	seed: number | null;
	inputWave: WaveState;
	resolution: TdResolutionResult;
	metrics: TdSimulationMetrics;
}

export interface TdReferenceBatteryResult {
	scenario: TdBatteryScenario;
	seed: number | null;
	inputWave: WaveState;
	results:
		TdReferenceSimulationResult[];
	distinctResultCount: number;
	universallyDominantConfigurationIds:
		string[];
	paretoFrontConfigurationIds:
		string[];
}

const EPSILON = 1e-9;

function createTdState(
	configuration:
		TdReferenceConfiguration
) {
	let state =
		createEmptyTdState();

	for (
		let index = 0;
		index <
			configuration.order.length;
		index += 1
	) {
		state =
			placeTdTower(
				state,
				{
					position:
						index + 1,
					tower:
						createTdTower({
							id:
								`${configuration.id}:tower:${index + 1}`,
							definitionId:
								configuration.order[
									index
								]
						})
				}
			);
	}

	return state;
}

function createInputWave(
	options: RunTdBatteryOptions
): {
	wave: WaveState;
	seed: number | null;
} {
	if (
		options.scenario ===
		'nominal'
	) {
		return {
			wave:
				structuredClone(
					REFERENCE_SESSION_CONFIGURATION
						.wave.nominal
				),
			seed: null
		};
	}

	if (
		!Number.isFinite(
			options.seed
		)
	) {
		throw new Error(
			'Une simulation seedée exige une graine.'
		);
	}

	const config =
		structuredClone(
			REFERENCE_SESSION_CONFIGURATION
		);

	config.seed =
		options.seed as number;

	const state =
		createInitialState(
			config,
			{
				runId:
					`P9-SEED-${options.seed}`
			}
		);

	return {
		wave:
			structuredClone(
				state.actualWave
			),
		seed:
			options.seed as number
	};
}

function toMetrics(
	resolution:
		TdResolutionResult
): TdSimulationMetrics {
	return {
		pressure:
			resolution.finalWave
				.pressure,
		structure:
			resolution.finalWave
				.structure,
		charge:
			resolution.finalWave
				.charge,
		capturableMatter:
			resolution.finalWave
				.capturableMatter,
		capturedMatter:
			resolution
				.capturedMatter
	};
}

function signature(
	result:
		TdReferenceSimulationResult
): string {
	return JSON.stringify(
		result.metrics
	);
}

function noWorse(
	candidate:
		TdReferenceSimulationResult,
	other:
		TdReferenceSimulationResult
): boolean {
	return (
		candidate.metrics.pressure <=
			other.metrics.pressure +
				EPSILON &&
		candidate.metrics.structure <=
			other.metrics.structure +
				EPSILON &&
		candidate.metrics.charge <=
			other.metrics.charge +
				EPSILON &&
		candidate.metrics.capturableMatter +
				EPSILON >=
			other.metrics.capturableMatter &&
		candidate.metrics.capturedMatter +
				EPSILON >=
			other.metrics.capturedMatter
	);
}

function strictlyBetterSomewhere(
	candidate:
		TdReferenceSimulationResult,
	other:
		TdReferenceSimulationResult
): boolean {
	return (
		candidate.metrics.pressure <
			other.metrics.pressure -
				EPSILON ||
		candidate.metrics.structure <
			other.metrics.structure -
				EPSILON ||
		candidate.metrics.charge <
			other.metrics.charge -
				EPSILON ||
		candidate.metrics.capturableMatter >
			other.metrics.capturableMatter +
				EPSILON ||
		candidate.metrics.capturedMatter >
			other.metrics.capturedMatter +
				EPSILON
	);
}

export function dominatesTdResult(
	candidate:
		TdReferenceSimulationResult,
	other:
		TdReferenceSimulationResult
): boolean {
	return (
		noWorse(
			candidate,
			other
		) &&
		strictlyBetterSomewhere(
			candidate,
			other
		)
	);
}

export function findUniversallyDominantConfigurations(
	results:
		readonly TdReferenceSimulationResult[]
): string[] {
	return results
		.filter(
			(candidate) =>
				results.every(
					(other) =>
						candidate.configurationId ===
							other.configurationId ||
						dominatesTdResult(
							candidate,
							other
						)
				)
		)
		.map(
			(result) =>
				result.configurationId
		);
}

export function findParetoFrontConfigurations(
	results:
		readonly TdReferenceSimulationResult[]
): string[] {
	return results
		.filter(
			(candidate) =>
				!results.some(
					(other) =>
						other.configurationId !==
							candidate.configurationId &&
						dominatesTdResult(
							other,
							candidate
						)
				)
		)
		.map(
			(result) =>
				result.configurationId
		);
}

export function runTdReferenceConfiguration(
	configuration:
		TdReferenceConfiguration,
	inputWave: WaveState,
	scenario:
		TdBatteryScenario,
	seed: number | null
): TdReferenceSimulationResult {
	const resolution =
		resolveTdPath(
			createTdState(
				configuration
			),
			inputWave
		);

	return {
		configurationId:
			configuration.id,
		configurationKind:
			configuration.kind,
		order:
			structuredClone(
				configuration.order
			),
		scenario,
		seed,
		inputWave:
			structuredClone(
				inputWave
			),
		resolution:
			structuredClone(
				resolution
			),
		metrics:
			toMetrics(
				resolution
			)
	};
}

export function runTdReferenceBattery(
	options: RunTdBatteryOptions
): TdReferenceBatteryResult {
	const {
		wave,
		seed
	} = createInputWave(
		options
	);

	const results =
		PROTO0_REFERENCE_TD_CONFIGURATIONS.map(
			(configuration) =>
				runTdReferenceConfiguration(
					configuration,
					wave,
					options.scenario,
					seed
				)
		);

	return {
		scenario:
			options.scenario,
		seed,
		inputWave:
			structuredClone(
				wave
			),
		results,
		distinctResultCount:
			new Set(
				results.map(
					signature
				)
			).size,
		universallyDominantConfigurationIds:
			findUniversallyDominantConfigurations(
				results
			),
		paretoFrontConfigurationIds:
			findParetoFrontConfigurations(
				results
			)
	};
}
