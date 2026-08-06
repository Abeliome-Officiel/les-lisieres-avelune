import type {
	TdResolutionResult,
	TdWaveDelta
} from '../domain/td.js';
import type {
	WaveState
} from '../domain/wave.js';
import {
	applyTdTowerEffect
} from './effects.js';
import {
	validateTdState
} from './validate.js';

function validateWave(
	wave: WaveState
): void {
	for (
		const [
			name,
			value
		] of Object.entries(
			wave
		)
	) {
		if (
			!Number.isFinite(
				value
			) ||
			value < 0
		) {
			throw new Error(
				`Vague TD invalide : ${name}=${value}.`
			);
		}
	}
}

function emptyEffect():
	TdWaveDelta {
	return {
		pressure: 0,
		structure: 0,
		charge: 0,
		capturableMatter: 0,
		capturedMatter: 0
	};
}

export function resolveTdPath(
	tdState:
		Parameters<
			typeof validateTdState
		>[0],
	inputWave: WaveState
): TdResolutionResult {
	const validation =
		validateTdState(
			tdState
		);

	if (!validation.valid) {
		throw new Error(
			`Etat TD invalide : ${validation.errors.join(' | ')}`
		);
	}

	validateWave(
		inputWave
	);

	let currentWave =
		structuredClone(
			inputWave
		);

	let capturedMatter = 0;

	const steps =
		tdState.positions.map(
			(position) => {
				const before =
					structuredClone(
						currentWave
					);

				if (!position.tower) {
					return {
						position:
							position.position,
						tower: null,
						before,
						effect:
							emptyEffect(),
						after:
							structuredClone(
								before
							)
					};
				}

				const result =
					applyTdTowerEffect(
						position.tower
							.family,
						before
					);

				validateWave(
					result.wave
				);

				currentWave =
					structuredClone(
						result.wave
					);

				capturedMatter +=
					result.effect
						.capturedMatter;

				return {
					position:
						position.position,
					tower:
						structuredClone(
							position.tower
						),
					before,
					effect:
						structuredClone(
							result.effect
						),
					after:
						structuredClone(
							currentWave
						)
				};
			}
		);

	return {
		initialWave:
			structuredClone(
				inputWave
			),
		finalWave:
			structuredClone(
				currentWave
			),
		capturedMatter,
		steps
	};
}
