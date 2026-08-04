import type {
	CorciteDescriptor,
	Proto0InitialState,
	Proto0SessionConfiguration
} from './domain/session.js';
import type { RunId } from './domain/ids.js';
import type { WaveState } from './domain/wave.js';
import { validateSessionConfiguration } from './config/validate.js';
import { SeededRng } from './random/seeded-rng.js';

const SIMULATED_CORCITES: readonly CorciteDescriptor[] = [
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
	/**
	 * Permet aux tests, imports et restaurations de fournir un identifiant
	 * déterminé explicitement.
	 *
	 * En utilisation normale, un identifiant unique est généré.
	 */
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
	const variationPercent = rng.between(minimumPercent, maximumPercent);

	return round(value * (1 + variationPercent / 100));
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

export function createRunId(config: Proto0SessionConfiguration): RunId {
	return `${config.testerCode}-${config.seed}-${crypto.randomUUID()}`;
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

	const rng = new SeededRng(config.seed);

	const humanCorcite: CorciteDescriptor = {
		id: `corcite-${config.testerCode.toLowerCase()}`,
		name: config.testerCode,
		controller: 'human'
	};

	return {
		runId: options.runId ?? createRunId(config),
		configuration: structuredClone(config),
		currentTurn: 1,
		corcites: [
			humanCorcite,
			...SIMULATED_CORCITES.map((corcite) => ({ ...corcite }))
		],
		actualWave: createActualWave(config, rng)
	};
}

export function serializeInitialState(state: Proto0InitialState): string {
	return JSON.stringify(state, null, 2);
}
