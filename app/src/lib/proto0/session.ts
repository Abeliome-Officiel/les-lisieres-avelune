import type {
	CorciteIdentity,
	CorciteState
} from './domain/corcite.js';
import type {
	Proto0InitialState,
	Proto0SessionConfiguration
} from './domain/session.js';
import type { RunId } from './domain/ids.js';
import type {
	WaveForecasts,
	WaveState
} from './domain/wave.js';
import { createReferenceCorciteState } from './corcite/state.js';
import { validateSessionConfiguration } from './config/validate.js';
import { SeededRng } from './random/seeded-rng.js';

const SIMULATED_CORCITES: readonly CorciteIdentity[] = [
	{
		id: 'corcite-brumelune',
		name: 'Brumelune',
		controller: 'simulated-tf'
	},
	{
		id: 'corcite-sylvelune',
		name: 'Sylvelune',
		controller: 'simulated-td'
	},
	{
		id: 'corcite-nacrelune',
		name: 'Nacrelune',
		controller: 'simulated-rpg'
	},
	{
		id: 'corcite-orbelune',
		name: 'Orbelune',
		controller: 'simulated-limits'
	}
];

export interface CreateInitialStateOptions {
	runId?: RunId;
}

function round(value: number, decimals = 6): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}

function varyWaveValue(
	value: number,
	minimumPercent: number,
	maximumPercent: number,
	rng: SeededRng
): number {
	const variationPercent = rng.between(
		minimumPercent,
		maximumPercent
	);

	return round(
		value * (1 + variationPercent / 100)
	);
}

function createActualWave(
	config: Proto0SessionConfiguration,
	rng: SeededRng
): WaveState {
	const { nominal, variation } = config.wave;

	return {
		pressure: varyWaveValue(
			nominal.pressure,
			variation.minimumPercent,
			variation.maximumPercent,
			rng
		),
		structure: varyWaveValue(
			nominal.structure,
			variation.minimumPercent,
			variation.maximumPercent,
			rng
		),
		charge: varyWaveValue(
			nominal.charge,
			variation.minimumPercent,
			variation.maximumPercent,
			rng
		),
		capturableMatter: varyWaveValue(
			nominal.capturableMatter,
			variation.minimumPercent,
			variation.maximumPercent,
			rng
		)
	};
}

type WaveForecastFactors =
	Record<keyof WaveState, number>;

function createWaveForecastFactors(
	rng: SeededRng
): WaveForecastFactors {
	return {
		pressure:
			rng.between(-1, 1),
		structure:
			rng.between(-1, 1),
		charge:
			rng.between(-1, 1),
		capturableMatter:
			rng.between(-1, 1)
	};
}

function createForecastWave(
	actualWave: WaveState,
	uncertaintyPercent: number,
	factors: WaveForecastFactors
): WaveState {
	return {
		pressure:
			round(
				actualWave.pressure *
					(
						1 +
						factors.pressure *
							uncertaintyPercent /
							100
					)
			),
		structure:
			round(
				actualWave.structure *
					(
						1 +
						factors.structure *
							uncertaintyPercent /
							100
					)
			),
		charge:
			round(
				actualWave.charge *
					(
						1 +
						factors.charge *
							uncertaintyPercent /
							100
					)
			),
		capturableMatter:
			round(
				actualWave.capturableMatter *
					(
						1 +
						factors.capturableMatter *
							uncertaintyPercent /
							100
					)
			)
	};
}

function createWaveForecasts(
	config: Proto0SessionConfiguration,
	actualWave: WaveState,
	rng: SeededRng
): WaveForecasts {
	const factors =
		createWaveForecastFactors(
			rng
		);

	const forecast =
		config.wave.forecast;

	return {
		tMinus3: {
			uncertaintyPercent:
				forecast.tMinus3Percent,
			estimatedWave:
				createForecastWave(
					actualWave,
					forecast.tMinus3Percent,
					factors
				)
		},
		tMinus2: {
			uncertaintyPercent:
				forecast.tMinus2Percent,
			estimatedWave:
				createForecastWave(
					actualWave,
					forecast.tMinus2Percent,
					factors
				)
		},
		tMinus1: {
			uncertaintyPercent:
				forecast.tMinus1Percent,
			estimatedWave:
				createForecastWave(
					actualWave,
					forecast.tMinus1Percent,
					factors
				)
		}
	};
}

export function createRunId(
	config: Proto0SessionConfiguration
): RunId {
	return `${config.testerCode}-${config.seed}-${crypto.randomUUID()}`;
}

function createCorcites(
	config: Proto0SessionConfiguration
): CorciteState[] {
	const human: CorciteIdentity = {
		id: `corcite-${config.testerCode.toLowerCase()}`,
		name: config.testerCode,
		controller: 'human'
	};

	return [
		createReferenceCorciteState(human),
		...SIMULATED_CORCITES.map((identity) =>
			createReferenceCorciteState(identity)
		)
	];
}

export function createInitialState(
	config: Proto0SessionConfiguration,
	options: CreateInitialStateOptions = {}
): Proto0InitialState {
	const validation = validateSessionConfiguration(config);

	if (!validation.valid) {
		throw new Error(
			`Configuration PROTO-0 invalide : ${validation.errors.join(' | ')}`
		);
	}

	const rng =
		new SeededRng(
			config.seed
		);

	const actualWave =
		createActualWave(
			config,
			rng
		);

	const waveForecasts =
		createWaveForecasts(
			config,
			actualWave,
			rng
		);

	return {
		runId:
			options.runId ??
			createRunId(config),
		configuration:
			structuredClone(
				config
			),
		currentTurn: 1,
		corcites:
			createCorcites(
				config
			),
		waveForecasts,
		actualWave
	};
}

export function serializeInitialState(
	state: Proto0InitialState
): string {
	return JSON.stringify(state, null, 2);
}
