import { TESTER_CODES, type TesterCode } from '../domain/ids.js';
import type { Proto0SessionConfiguration } from '../domain/session.js';
import { PROTO0_BOUNDS } from './bounds.js';

export interface ConfigurationValidationResult {
	valid: boolean;
	errors: string[];
}

function inRange(value: number, min: number, max: number): boolean {
	return Number.isFinite(value) && value >= min && value <= max;
}

export function isTesterCode(value: string): value is TesterCode {
	return TESTER_CODES.some((code) => code === value);
}

export function validateSessionConfiguration(
	config: Proto0SessionConfiguration
): ConfigurationValidationResult {
	const errors: string[] = [];

	if (config.schema !== 'avelune.proto0.session') {
		errors.push('schema doit être "avelune.proto0.session"');
	}

	if (config.schemaVersion !== 1) {
		errors.push('schemaVersion doit être 1');
	}

	if (!isTesterCode(config.testerCode)) {
		errors.push(`testerCode inconnu : ${config.testerCode}`);
	}

	if (
		!Number.isInteger(config.turns) ||
		!inRange(
			config.turns,
			PROTO0_BOUNDS.turns.min,
			PROTO0_BOUNDS.turns.max
		)
	) {
		errors.push(
			`turns doit être un entier entre ${PROTO0_BOUNDS.turns.min} et ${PROTO0_BOUNDS.turns.max}`
		);
	}

	if (
		!Number.isInteger(config.seed) ||
		!inRange(
			config.seed,
			PROTO0_BOUNDS.seed.min,
			PROTO0_BOUNDS.seed.max
		)
	) {
		errors.push(
			`seed doit être un entier entre ${PROTO0_BOUNDS.seed.min} et ${PROTO0_BOUNDS.seed.max}`
		);
	}

	if (config.waves !== 1) {
		errors.push('PROTO-0 doit contenir exactement 1 vague');
	}

	if (config.internalPathPositions !== 8) {
		errors.push('PROTO-0 doit utiliser exactement 8 positions TD internes');
	}

	if (config.humanControlledCorcites !== 1) {
		errors.push('PROTO-0 doit utiliser exactement 1 Corcite humain');
	}

	if (config.simulatedCorcites !== 4) {
		errors.push('PROTO-0 doit utiliser exactement 4 Corcites simulés');
	}

	const waveChecks = [
		[
			'pressure',
			config.wave.nominal.pressure,
			PROTO0_BOUNDS.wave.pressure
		],
		[
			'structure',
			config.wave.nominal.structure,
			PROTO0_BOUNDS.wave.structure
		],
		[
			'charge',
			config.wave.nominal.charge,
			PROTO0_BOUNDS.wave.charge
		],
		[
			'capturableMatter',
			config.wave.nominal.capturableMatter,
			PROTO0_BOUNDS.wave.capturableMatter
		]
	] as const;

	for (const [name, value, bounds] of waveChecks) {
		if (!inRange(value, bounds.min, bounds.max)) {
			errors.push(
				`${name} doit être compris entre ${bounds.min} et ${bounds.max}`
			);
		}
	}

	if (
		config.wave.variation.minimumPercent >
		config.wave.variation.maximumPercent
	) {
		errors.push(
			'La variation minimale de vague ne peut pas dépasser la variation maximale.'
		);
	}

	if (
		config.wave.variation.minimumPercent < -2 ||
		config.wave.variation.maximumPercent > 2
	) {
		errors.push(
			'La variation seedée de PROTO-0 doit rester comprise entre -2 % et +2 %.'
		);
	}

	if (
		config.wave.forecast.tMinus3Percent !== 10 ||
		config.wave.forecast.tMinus2Percent !== 6 ||
		config.wave.forecast.tMinus1Percent !== 3
	) {
		errors.push(
			'La prévision PROTO-0 doit respecter T-3 ±10 %, T-2 ±6 %, T-1 ±3 %.'
		);
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
