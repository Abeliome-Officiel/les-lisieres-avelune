import assert from 'node:assert/strict';
import test from 'node:test';

import {
	REFERENCE_SESSION_CONFIGURATION,
	createInitialState,
	serializeInitialState
} from '../../src/lib/proto0/index.js';

import type {
	WaveState
} from '../../src/lib/proto0/domain/wave.js';

function cloneReference() {
	return structuredClone(
		REFERENCE_SESSION_CONFIGURATION
	);
}

const WAVE_KEYS = [
	'pressure',
	'structure',
	'charge',
	'capturableMatter'
] as const satisfies readonly (
	keyof WaveState
)[];

function relativeErrorPercent(
	estimate: number,
	actual: number
): number {
	if (actual === 0) {
		return estimate === 0
			? 0
			: Number.POSITIVE_INFINITY;
	}

	return (
		Math.abs(
			estimate -
				actual
		) /
		actual *
		100
	);
}

test("la configuration nominale conserve 50 / 60 / 20 / 16", () => {
	assert.deepEqual(
		REFERENCE_SESSION_CONFIGURATION
			.wave.nominal,
		{
			pressure: 50,
			structure: 60,
			charge: 20,
			capturableMatter: 16
		}
	);
});

test("une session conserve T-3, T-2, T-1 et la vague réelle", () => {
	const state =
		createInitialState(
			cloneReference(),
			{
				runId:
					'P6-FORECAST'
			}
		);

	assert.equal(
		state.waveForecasts
			.tMinus3
			.uncertaintyPercent,
		10
	);

	assert.equal(
		state.waveForecasts
			.tMinus2
			.uncertaintyPercent,
		6
	);

	assert.equal(
		state.waveForecasts
			.tMinus1
			.uncertaintyPercent,
		3
	);

	for (
		const key of
		WAVE_KEYS
	) {
		assert.equal(
			Number.isFinite(
				state.waveForecasts
					.tMinus3
					.estimatedWave[key]
			),
			true
		);

		assert.equal(
			Number.isFinite(
				state.actualWave[key]
			),
			true
		);
	}
});

test("chaque prévision reste dans sa borne d'incertitude autour du réel", () => {
	const config =
		cloneReference();

	for (
		let seed = 1;
		seed <= 250;
		seed += 1
	) {
		config.seed =
			seed;

		const state =
			createInitialState(
				config,
				{
					runId:
						`P6-${seed}`
				}
			);

		const forecasts = [
			state.waveForecasts
				.tMinus3,
			state.waveForecasts
				.tMinus2,
			state.waveForecasts
				.tMinus1
		];

		for (
			const forecast of
			forecasts
		) {
			for (
				const key of
				WAVE_KEYS
			) {
				const error =
					relativeErrorPercent(
						forecast
							.estimatedWave[key],
						state
							.actualWave[key]
					);

				assert.ok(
					error <=
						forecast
							.uncertaintyPercent +
						0.00001,
					`${key} dépasse ±${forecast.uncertaintyPercent}%`
				);
			}
		}
	}
});

test("la prévision devient effectivement plus précise de T-3 vers T-1", () => {
	const config =
		cloneReference();

	for (
		let seed = 1;
		seed <= 250;
		seed += 1
	) {
		config.seed =
			seed;

		const state =
			createInitialState(
				config,
				{
					runId:
						`P6-PRECISION-${seed}`
				}
			);

		for (
			const key of
			WAVE_KEYS
		) {
			const error3 =
				Math.abs(
					state
						.waveForecasts
						.tMinus3
						.estimatedWave[key] -
					state
						.actualWave[key]
				);

			const error2 =
				Math.abs(
					state
						.waveForecasts
						.tMinus2
						.estimatedWave[key] -
					state
						.actualWave[key]
				);

			const error1 =
				Math.abs(
					state
						.waveForecasts
						.tMinus1
						.estimatedWave[key] -
					state
						.actualWave[key]
				);

			assert.ok(
				error2 <=
					error3 +
					0.000001
			);

			assert.ok(
				error1 <=
					error2 +
					0.000001
			);
		}
	}
});

test("même seed = mêmes prévisions et même vague réelle", () => {
	const config =
		cloneReference();

	const stateA =
		createInitialState(
			config,
			{
				runId: 'SAME'
			}
		);

	const stateB =
		createInitialState(
			config,
			{
				runId: 'SAME'
			}
		);

	assert.deepEqual(
		stateA.waveForecasts,
		stateB.waveForecasts
	);

	assert.deepEqual(
		stateA.actualWave,
		stateB.actualWave
	);
});

test("une autre seed peut modifier prévisions et vague réelle tout en restant bornée", () => {
	const configA =
		cloneReference();

	const configB =
		cloneReference();

	configB.seed =
		configA.seed + 1;

	const stateA =
		createInitialState(
			configA,
			{
				runId: 'A'
			}
		);

	const stateB =
		createInitialState(
			configB,
			{
				runId: 'B'
			}
		);

	assert.notDeepEqual(
		{
			forecasts:
				stateA.waveForecasts,
			actual:
				stateA.actualWave
		},
		{
			forecasts:
				stateB.waveForecasts,
			actual:
				stateB.actualWave
		}
	);
});

test("la sérialisation de l'état initial conserve nominal, prévisions et réel", () => {
	const state =
		createInitialState(
			cloneReference(),
			{
				runId:
					'P6-SERIALIZED'
			}
		);

	const serialized =
		serializeInitialState(
			state
		);

	const parsed =
		JSON.parse(
			serialized
		);

	assert.deepEqual(
		parsed.configuration
			.wave.nominal,
		state.configuration
			.wave.nominal
	);

	assert.deepEqual(
		parsed.waveForecasts,
		state.waveForecasts
	);

	assert.deepEqual(
		parsed.actualWave,
		state.actualWave
	);
});
